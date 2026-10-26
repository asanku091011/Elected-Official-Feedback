import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNav } from '../navigation/Navigator';
import { useCivic } from '../context/CivicContext';
import PortalScreen from '../components/PortalScreen';
import Badge from '../components/Badge';
import BarRow from '../components/BarRow';
import Button from '../components/Button';
import Notice from '../components/Notice';
import EmptyState from '../components/EmptyState';
import {
  MIN_RESULTS_TO_SHOW,
  audienceLabel,
  closesInLabel,
  pollPhase,
  pollStatusLabel,
  tallyPoll,
} from '../lib/polls';
import { csvFileName, pollResultsCsv } from '../lib/csv';
import { formatDate } from '../lib/format';
import { colors, spacing, radius, font, text } from '../theme';

export default function PollResultsScreen({ pollId }) {
  const nav = useNav();
  const { account, polls, votes } = useCivic();
  const [exportMessage, setExportMessage] = useState(null);

  const poll = polls.find((item) => item.id === pollId);

  if (!account) {
    return (
      <PortalScreen title="Poll results" onBack={nav.pop}>
        <EmptyState
          icon="🔐"
          title="Sign in to see results"
          body="Aggregate results are part of the Official Portal."
          actionLabel="Choose an account"
          onAction={() => nav.push('PortalSignIn')}
        />
      </PortalScreen>
    );
  }

  if (!poll) {
    return (
      <PortalScreen title="Poll results" onBack={nav.pop}>
        <EmptyState
          icon="🗳️"
          title="That poll is no longer available"
          body="It may have been reset. Open the poll list to pick another one."
          actionLabel="Back to polls"
          onAction={() => nav.replace('PortalPolls')}
        />
      </PortalScreen>
    );
  }

  const tally = tallyPoll(poll, votes);
  const phase = pollPhase(poll);

  const handleExport = async () => {
    const exportedAt = new Date().toISOString();
    const csv = pollResultsCsv(poll, tally, exportedAt);
    const name = csvFileName(poll, exportedAt);
    try {
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Give the browser a moment to start the download before releasing the URL.
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        setExportMessage({ tone: 'success', text: `Downloaded ${name}.` });
      } else {
        await Clipboard.setStringAsync(csv);
        setExportMessage({
          tone: 'success',
          text: `Copied ${name} as CSV. Paste it into a spreadsheet app to save it.`,
        });
      }
    } catch (error) {
      setExportMessage({
        tone: 'danger',
        text: 'Could not export the file. Try again, or read the aggregate numbers on this screen.',
      });
    }
  };

  return (
    <PortalScreen
      title="Poll results"
      subtitle="Aggregate numbers only. Nobody can see who chose what."
      onBack={nav.pop}
    >
      <View style={styles.summaryCard}>
        <View style={styles.badgeRow}>
          <Badge label={pollStatusLabel(phase)} tone={phase === 'open' ? 'success' : 'neutral'} dot />
        </View>
        <Text style={styles.question}>{poll.question}</Text>
        {poll.description ? <Text style={styles.description}>{poll.description}</Text> : null}
        <Text style={styles.meta}>{audienceLabel(poll)}</Text>
        <Text style={styles.meta}>
          {phase === 'closed'
            ? `Closed ${formatDate(poll.closesAt)}`
            : `${closesInLabel(poll)} · Closes ${formatDate(poll.closesAt)}`}
        </Text>
        <Text style={styles.totalLine}>
          {tally.total} {tally.total === 1 ? 'response' : 'responses'}
        </Text>
      </View>

      {!tally.hasEnough ? (
        <Notice tone="info" title="Not enough responses yet">
          Results stay hidden until a poll has at least {MIN_RESULTS_TO_SHOW} responses. So far this
          poll has {tally.total}. The count itself is visible so staff know the poll is live.
        </Notice>
      ) : (
        <View>
          <Text style={styles.sectionTitle}>Responses by option</Text>
          <View style={styles.chartCard}>
            {tally.options.map((option) => (
              <BarRow
                key={option.id}
                label={option.label}
                count={option.count}
                total={tally.total}
                color={colors.teal}
              />
            ))}
          </View>
          <Text style={styles.chartNote}>
            {poll.type === 'multiple'
              ? 'Percent of respondents who chose each option. A resident could choose more than one, so shares can add up to more than 100%.'
              : 'Percent of all responses.'}
          </Text>

          <Text style={styles.sectionTitle}>Turnout by area</Text>
          <View style={styles.chartCard}>
            {tally.jurisdictions.length === 0 ? (
              <Text style={styles.emptyTurnout}>No area information has been recorded yet.</Text>
            ) : (
              tally.jurisdictions.map((item) => (
                <View key={item.id} style={styles.turnoutRow}>
                  <Text style={styles.turnoutLabel}>{item.label}</Text>
                  <Text style={styles.turnoutCount}>
                    {item.count} · {item.share}%
                  </Text>
                </View>
              ))
            )}
          </View>
          <Text style={styles.chartNote}>
            Area comes from the resident’s own picker, never an address. Responses carry no name or
            account, and officials see aggregates only — never who voted or which option they chose.
          </Text>
        </View>
      )}

      <Button
        label={
          tally.hasEnough ? 'Export results as CSV' : `Export unlocks at ${MIN_RESULTS_TO_SHOW} responses`
        }
        variant="secondary"
        onPress={handleExport}
        disabled={!tally.hasEnough}
        style={styles.exportButton}
        accessibilityHint="Downloads an aggregate CSV on the web, or copies it to the clipboard on a phone"
      />
      {!tally.hasEnough ? (
        <Text style={styles.exportLocked}>
          The export stays locked while results are hidden, so a small number of responses cannot be
          read option by option.
        </Text>
      ) : null}
      {exportMessage ? (
        <Notice tone={exportMessage.tone} style={styles.exportNotice}>
          {exportMessage.text}
        </Notice>
      ) : null}

      <Text style={styles.footnote}>
        The export contains option counts and turnout by area only. It never includes a resident’s
        identity, because CivLink does not record one on a vote.
      </Text>
    </PortalScreen>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  question: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
    lineHeight: font.size.md * 1.4,
    marginBottom: spacing.xs + 2,
  },
  description: {
    ...text.small,
    marginBottom: spacing.sm,
  },
  meta: {
    ...text.small,
    fontSize: font.size.sm,
    marginBottom: 2,
  },
  totalLine: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  chartCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    paddingBottom: spacing.xs,
  },
  chartNote: {
    ...text.small,
    fontSize: font.size.xs,
    lineHeight: font.size.xs * 1.6,
    marginTop: spacing.sm,
  },
  emptyTurnout: {
    ...text.small,
    marginBottom: spacing.sm,
  },
  turnoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  turnoutLabel: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    color: colors.ink,
    flex: 1,
    marginRight: spacing.sm,
  },
  turnoutCount: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    color: colors.slateText,
    fontVariant: ['tabular-nums'],
  },
  exportButton: {
    marginTop: spacing.lg,
  },
  exportNotice: {
    marginTop: spacing.sm,
    marginBottom: 0,
  },
  exportLocked: {
    ...text.small,
    fontSize: font.size.xs,
    marginTop: spacing.sm,
  },
  footnote: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    lineHeight: font.size.xs * 1.7,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
});
