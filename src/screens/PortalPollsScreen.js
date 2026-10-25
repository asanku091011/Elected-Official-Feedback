import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNav } from '../navigation/Navigator';
import { useCivic } from '../context/CivicContext';
import PortalScreen from '../components/PortalScreen';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Notice from '../components/Notice';
import EmptyState from '../components/EmptyState';
import {
  audienceLabel,
  closesInLabel,
  pollPhase,
  pollStatusLabel,
  tallyPoll,
} from '../lib/polls';
import { formatDate } from '../lib/format';
import { colors, spacing, radius, font, text } from '../theme';

const PHASE_ORDER = { open: 0, scheduled: 1, draft: 2, closed: 3 };

const PHASE_TONE = {
  open: 'success',
  scheduled: 'warning',
  draft: 'neutral',
  closed: 'neutral',
};

function ActionLink({ label, onPress, tone = 'teal', accessibilityLabel }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      style={({ pressed }) => [styles.actionLink, pressed && styles.actionPressed]}
    >
      <Text style={[styles.actionText, tone === 'danger' && styles.actionDanger]}>{label}</Text>
    </Pressable>
  );
}

export default function PortalPollsScreen() {
  const nav = useNav();
  const { account, polls, votes, closePoll, deletePoll } = useCivic();
  const [notice, setNotice] = useState(null);
  const [confirming, setConfirming] = useState(null);

  if (!account) {
    return (
      <PortalScreen title="Polls" onBack={nav.pop}>
        <EmptyState
          icon="🔐"
          title="Sign in to manage polls"
          body="Polls are created and published from the Official Portal prototype."
          actionLabel="Choose a demo account"
          onAction={() => nav.push('PortalSignIn')}
        />
      </PortalScreen>
    );
  }

  const ordered = [...polls].sort((a, b) => {
    const phaseDiff = (PHASE_ORDER[pollPhase(a)] || 0) - (PHASE_ORDER[pollPhase(b)] || 0);
    if (phaseDiff !== 0) return phaseDiff;
    return new Date(a.closesAt).getTime() - new Date(b.closesAt).getTime();
  });

  const handleAction = (poll, action) => {
    const key = `${poll.id}:${action}`;
    if (confirming !== key) {
      setConfirming(key);
      setNotice(null);
      return;
    }
    setConfirming(null);
    const result = action === 'close' ? closePoll(poll.id) : deletePoll(poll.id);
    setNotice(
      result.ok
        ? { tone: 'success', text: action === 'close' ? 'Poll closed. Final results are now visible.' : 'Draft deleted.' }
        : { tone: 'danger', text: result.error }
    );
  };

  return (
    <PortalScreen
      title="Polls"
      subtitle="Ask residents a neutral question and read the aggregate results."
      onBack={nav.pop}
    >
      <Button label="New poll" onPress={() => nav.push('PollEditor')} />

      {notice ? (
        <Notice tone={notice.tone} style={styles.notice}>
          {notice.text}
        </Notice>
      ) : null}

      {ordered.length === 0 ? (
        <EmptyState
          icon="🗳️"
          title="No polls yet"
          body="Create a poll, run it past the neutrality checklist, and publish it to residents in the areas you choose."
          actionLabel="Create the first poll"
          onAction={() => nav.push('PollEditor')}
        />
      ) : null}

      {ordered.map((poll) => {
        const phase = pollPhase(poll);
        const total = tallyPoll(poll, votes).total;
        const confirmingClose = confirming === `${poll.id}:close`;
        const confirmingDelete = confirming === `${poll.id}:delete`;
        return (
          <View key={poll.id} style={styles.card}>
            <View style={styles.badgeRow}>
              <Badge label={pollStatusLabel(phase)} tone={PHASE_TONE[phase] || 'neutral'} dot />
              {poll.isSample ? <Badge label="Sample data" tone="neutral" /> : null}
            </View>

            <Text style={styles.question}>{poll.question}</Text>
            <Text style={styles.meta}>{audienceLabel(poll)}</Text>
            <Text style={styles.meta}>
              {phase === 'draft'
                ? 'Not published yet'
                : phase === 'scheduled'
                  ? `Opens ${formatDate(poll.opensAt)}`
                  : `${closesInLabel(poll)} · Closes ${formatDate(poll.closesAt)}`}
              {'  ·  '}
              {total} {total === 1 ? 'response' : 'responses'}
            </Text>

            <View style={styles.actionRow}>
              <ActionLink
                label="Edit"
                onPress={() => nav.push('PollEditor', { pollId: poll.id })}
                accessibilityLabel={`Edit poll: ${poll.question}`}
              />
              <ActionLink
                label="Results"
                onPress={() => nav.push('PollResults', { pollId: poll.id })}
                accessibilityLabel={`View results for: ${poll.question}`}
              />
              {phase === 'open' ? (
                <ActionLink
                  label={confirmingClose ? 'Tap again to close' : 'Close poll'}
                  onPress={() => handleAction(poll, 'close')}
                  accessibilityLabel={
                    confirmingClose
                      ? 'Tap again to close this poll and publish final results'
                      : `Close poll: ${poll.question}`
                  }
                />
              ) : null}
              {phase === 'draft' ? (
                <ActionLink
                  label={confirmingDelete ? 'Tap again to delete' : 'Delete draft'}
                  tone="danger"
                  onPress={() => handleAction(poll, 'delete')}
                  accessibilityLabel={
                    confirmingDelete ? 'Tap again to delete this draft' : `Delete draft: ${poll.question}`
                  }
                />
              ) : null}
            </View>

            {confirmingClose || confirmingDelete ? (
              <Text style={styles.confirmHint}>
                This takes one more tap so a real poll is never closed or deleted by accident.
              </Text>
            ) : null}
          </View>
        );
      })}

      <Text style={styles.footnote}>
        Drafts and scheduled polls stay hidden from residents. Results are aggregate only — CivLink
        never records who chose which option.
      </Text>
    </PortalScreen>
  );
}

const styles = StyleSheet.create({
  notice: {
    marginTop: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  question: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    lineHeight: font.size.md * 1.4,
    marginBottom: spacing.xs + 2,
  },
  meta: {
    ...text.small,
    fontSize: font.size.sm,
    marginBottom: 2,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  actionLink: {
    paddingVertical: spacing.sm - 2,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginBottom: spacing.xs,
  },
  actionPressed: {
    backgroundColor: colors.tealSoft,
  },
  actionText: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.tealDeep,
  },
  actionDanger: {
    color: colors.danger,
  },
  confirmHint: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.warning,
    lineHeight: font.size.xs * 1.5,
    marginTop: spacing.xs,
  },
  footnote: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    lineHeight: font.size.xs * 1.7,
    marginTop: spacing.md,
  },
});
