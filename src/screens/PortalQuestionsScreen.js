import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNav } from '../navigation/Navigator';
import { useCivic } from '../context/CivicContext';
import PortalScreen from '../components/PortalScreen';
import Badge from '../components/Badge';
import Button from '../components/Button';
import CheckRow from '../components/CheckRow';
import Field from '../components/Field';
import Notice from '../components/Notice';
import EmptyState from '../components/EmptyState';
import { getJurisdiction } from '../data/jurisdictions';
import { categoryLabel } from '../data/seedContent';
import { formatRelative } from '../lib/format';
import { colors, spacing, radius, font, text } from '../theme';

const STATUS_TONE = {
  new: 'warning',
  replied: 'teal',
  resolved: 'success',
};

const STATUS_LABEL = {
  new: 'New',
  replied: 'Replied',
  resolved: 'Resolved',
};

export default function PortalQuestionsScreen() {
  const nav = useNav();
  const { account, questions, replyQuestion, resolveQuestion } = useCivic();
  const [drafts, setDrafts] = useState({});
  const [publicById, setPublicById] = useState({});
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);

  const sorted = useMemo(
    () =>
      [...questions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [questions]
  );

  if (!account) {
    return (
      <PortalScreen title="Resident questions" onBack={nav.pop}>
        <EmptyState
          icon="🔐"
          title="Sign in to read questions"
          body="The Official Portal uses sample demo accounts. No real office or agency is represented."
          actionLabel="Go to demo sign-in"
          onAction={() => nav.push('PortalSignIn')}
        />
      </PortalScreen>
    );
  }

  const newCount = questions.filter((item) => item.status === 'new').length;

  const handleReply = (item) => {
    const text = drafts[item.id] || '';
    const result = replyQuestion(item.id, {
      reply: text,
      isPublic: publicById[item.id] !== false,
    });
    if (!result.ok) {
      setErrors((current) => ({ ...current, [item.id]: result.error }));
      return;
    }
    setErrors((current) => ({ ...current, [item.id]: '' }));
    setDrafts((current) => ({ ...current, [item.id]: '' }));
    setFeedback({
      tone: 'success',
      title: 'Reply saved',
      body:
        publicById[item.id] !== false
          ? 'The reply is marked public, so the resident can see it with their question.'
          : 'The reply is marked private. In this prototype it stays on this device.',
    });
  };

  const handleResolve = (item) => {
    const result = resolveQuestion(item.id);
    if (!result.ok) {
      setErrors((current) => ({ ...current, [item.id]: result.error }));
      return;
    }
    setFeedback({
      tone: 'success',
      title: 'Marked resolved',
      body: 'The question stays in the inbox for the record, with a resolved badge.',
    });
  };

  return (
    <PortalScreen
      title="Resident questions"
      subtitle="Questions from residents in the selected area. Reply in public or private, then mark it resolved."
      onBack={nav.pop}
    >
      {feedback ? (
        <Notice tone={feedback.tone} title={feedback.title}>
          {feedback.body}
        </Notice>
      ) : null}

      <View style={styles.summaryRow}>
        <Badge label={`${questions.length} total`} tone="neutral" />
        <Badge label={`${newCount} new`} tone={newCount > 0 ? 'warning' : 'neutral'} />
      </View>

      <Notice tone="info" title="What officials can and cannot see">
        Officials see poll results only as totals, never who voted. This inbox shows questions
        stored on this device in the prototype; a real service would need a server, verified
        accounts, and a privacy review.
      </Notice>

      {sorted.length === 0 ? (
        <EmptyState
          icon="💬"
          title="No questions yet"
          body="Residents can ask a question from the Updates screen. Their question appears here."
          actionLabel="Back to the portal"
          onAction={() => nav.replace('PortalHome')}
        />
      ) : (
        sorted.map((item) => {
          const area = getJurisdiction(item.jurisdictionId);
          const isResolved = item.status === 'resolved';
          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.badgeRow}>
                <Badge
                  label={STATUS_LABEL[item.status] || 'New'}
                  tone={STATUS_TONE[item.status] || 'neutral'}
                />
                {item.isSample ? <Badge label="Sample data" tone="warning" /> : null}
                <Badge label={categoryLabel(item.category)} tone="teal" />
              </View>

              <Text style={styles.meta}>
                {area ? area.name : 'Unknown area'}
                {item.isMine ? '  ·  From this device' : `  ·  ${item.authorLabel || 'Resident'}`}
                {`  ·  ${formatRelative(item.createdAt)}`}
              </Text>

              <Text style={styles.question}>{item.body}</Text>

              {item.reply ? (
                <View style={styles.replyBox}>
                  <View style={styles.replyHeader}>
                    <Text style={styles.replyTitle}>Reply</Text>
                    <Badge
                      label={item.reply.isPublic ? 'Public reply' : 'Private reply'}
                      tone={item.reply.isPublic ? 'success' : 'neutral'}
                    />
                  </View>
                  <Text style={styles.replyBody}>{item.reply.body}</Text>
                  <Text style={styles.replyMeta}>{formatRelative(item.reply.repliedAt)}</Text>
                </View>
              ) : null}

              {!isResolved ? (
                <>
                  {errors[item.id] ? (
                    <Text style={styles.error} accessibilityLiveRegion="polite">
                      {errors[item.id]}
                    </Text>
                  ) : null}
                  <Field
                    label={item.reply ? 'Write another reply' : 'Your reply'}
                    value={drafts[item.id] || ''}
                    onChangeText={(value) =>
                      setDrafts((current) => ({ ...current, [item.id]: value }))
                    }
                    placeholder="Answer the question directly, and say what happens next."
                    multiline
                    maxLength={600}
                    accessibilityLabel={`Reply to question from ${area ? area.name : 'resident'}`}
                  />
                  <CheckRow
                    label="Post this reply publicly"
                    description="Off keeps the reply private in this prototype. Residents only see public replies."
                    checked={publicById[item.id] !== false}
                    onToggle={() =>
                      setPublicById((current) => ({
                        ...current,
                        [item.id]: current[item.id] === false,
                      }))
                    }
                  />
                  <View style={styles.actionRow}>
                    <Button
                      label="Send reply"
                      full={false}
                      onPress={() => handleReply(item)}
                      style={styles.actionBtn}
                    />
                    <Button
                      label="Mark resolved"
                      variant="secondary"
                      full={false}
                      onPress={() => handleResolve(item)}
                      style={styles.actionBtn}
                    />
                  </View>
                </>
              ) : (
                <Text style={styles.resolvedNote}>
                  This question is closed. Reopen is not part of this prototype.
                </Text>
              )}
            </View>
          );
        })
      )}
    </PortalScreen>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  meta: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    marginBottom: spacing.sm,
    lineHeight: font.size.xs * 1.6,
  },
  question: {
    ...text.body,
    fontSize: font.size.sm + 1,
    marginBottom: spacing.md,
  },
  replyBox: {
    backgroundColor: colors.tealSoft,
    borderWidth: 1,
    borderColor: colors.tealBorder,
    borderRadius: radius.md,
    padding: spacing.md - 2,
    marginBottom: spacing.md,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  replyTitle: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    fontWeight: font.weight.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.tealDeep,
  },
  replyBody: {
    ...text.small,
    color: colors.ink,
  },
  replyMeta: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    marginTop: spacing.xs,
  },
  error: {
    ...text.small,
    color: colors.danger,
    fontWeight: font.weight.medium,
    marginBottom: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xs,
  },
  actionBtn: {
    minHeight: 42,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  resolvedNote: {
    ...text.small,
    color: colors.success,
  },
});
