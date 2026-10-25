import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useNav } from '../navigation/Navigator';
import { useApp } from '../context/AppContext';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Notice from '../components/Notice';
import BarRow from '../components/BarRow';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import LevelBadge from '../components/LevelBadge';
import { summarize } from '../lib/aggregate';
import { getTopic } from '../data/topics';
import { getJurisdiction } from '../data/jurisdictions';
import { levelTint, colors, spacing, radius, font, text } from '../theme';
import { formatRelative } from '../lib/format';

export default function DashboardScreen() {
  const nav = useNav();
  const { messages, ready, clearMessages } = useApp();
  const [expanded, setExpanded] = useState({});
  const [confirmClear, setConfirmClear] = useState(false);

  const summary = useMemo(() => summarize(messages), [messages]);

  const toggle = (id) => {
    setExpanded((current) => ({ ...current, [id]: !current[id] }));
  };

  const handleClear = async () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    await clearMessages();
    setConfirmClear(false);
  };

  return (
    <Screen
      title="Feedback dashboard"
      subtitle="What the saved messages look like once they are grouped."
      onBack={nav.pop}
    >
      <Notice tone="info" title="Demo dashboard">
        This screen reads only the messages saved on this device. A real official account would need
        verified sign-in and a secure server before any constituent data reached staff.
      </Notice>

      {!ready ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.tealDeep} />
          <Text style={styles.loadingText}>Loading saved messages…</Text>
        </View>
      ) : summary.total === 0 ? (
        <EmptyState
          icon="📊"
          title="No messages to summarize yet"
          body="Write a message as a constituent, then come back here to see it grouped by issue and level of government."
          actionLabel="Write a test message"
          onAction={() => nav.push('Topic')}
        />
      ) : (
        <View>
          <View style={styles.statRow}>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{summary.total}</Text>
              <Text style={styles.statLabel}>
                {summary.total === 1 ? 'message' : 'messages'}
              </Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{summary.topics.length}</Text>
              <Text style={styles.statLabel}>
                {summary.topics.length === 1 ? 'issue' : 'issues'}
              </Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{summary.levels.length}</Text>
              <Text style={styles.statLabel}>
                {summary.levels.length === 1 ? 'level' : 'levels'}
              </Text>
            </Card>
          </View>

          <Text style={styles.sectionTitle}>By level of government</Text>
          <Card style={styles.chartCard}>
            {summary.levels.map((level) => (
              <BarRow
                key={level.id}
                label={level.label}
                count={level.count}
                total={summary.total}
                color={(levelTint[level.id] || levelTint.local).fg}
              />
            ))}
          </Card>

          <Text style={styles.sectionTitle}>Top issues</Text>
          <Card style={styles.chartCard}>
            {summary.topics.map((topic) => (
              <BarRow
                key={topic.id}
                label={topic.title}
                icon={topic.icon}
                count={topic.count}
                total={summary.total}
                color={colors.teal}
              />
            ))}
          </Card>

          <Text style={styles.sectionTitle}>My issues</Text>
          {messages.map((item) => {
            const topic = getTopic(item.topicId);
            const area = item.areaId ? getJurisdiction(item.areaId) : null;
            const isOpen = Boolean(expanded[item.id]);
            return (
              <View key={item.id} style={styles.messageCard}>
                <View style={styles.messageHeader}>
                  <Text style={styles.messageTopic}>
                    {topic ? topic.icon : '📝'}  {topic ? topic.title : 'Other'}
                  </Text>
                  <LevelBadge level={item.level} />
                </View>
                <Text style={styles.messageMeta}>
                  {formatRelative(item.createdAt)}
                  {area ? `  ·  ${area.name}` : ''}
                  {item.recipientName ? `  ·  To ${item.recipientName}` : ''}
                  {item.status ? `  ·  ${item.status}` : ''}
                  {item.zip ? `  ·  ZIP ${item.zip}` : ''}
                  {item.authorName ? `  ·  ${item.authorName}` : '  ·  Anonymous'}
                </Text>
                <Text style={styles.messageText} numberOfLines={isOpen ? undefined : 3}>
                  {item.message}
                </Text>
                <Pressable
                  onPress={() => toggle(item.id)}
                  accessibilityRole="button"
                  accessibilityLabel={isOpen ? 'Show less of this message' : 'Read the full message'}
                  style={styles.readMore}
                >
                  <Text style={styles.readMoreText}>
                    {isOpen ? 'Show less' : 'Read full message'}
                  </Text>
                </Pressable>
              </View>
            );
          })}

          <Text style={styles.footnote}>
            Issues appear here exactly as they were saved. “Sent” means the issue was delivered to
            the chosen sample recipient in this demo — no real office received it. A name is shown
            only if the writer chose to include one.
          </Text>

          <Button
            label={confirmClear ? 'Tap again to delete all messages' : 'Clear all messages on this device'}
            variant="danger"
            onPress={handleClear}
            style={styles.clearBtn}
            accessibilityHint="Deletes every saved message from this device"
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  loadingText: {
    ...text.small,
    marginTop: spacing.sm,
  },
  statRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  statCard: {
    flex: 1,
    marginRight: spacing.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: font.family,
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    color: colors.ink,
  },
  statLabel: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: 2,
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
    paddingBottom: 0,
  },
  messageCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  messageTopic: {
    fontFamily: font.family,
    flex: 1,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginRight: spacing.sm,
  },
  messageMeta: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    marginBottom: spacing.sm - 2,
  },
  messageText: {
    ...text.small,
    color: colors.ink,
  },
  readMore: {
    paddingTop: spacing.sm,
  },
  readMoreText: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.tealDeep,
    textDecorationLine: 'underline',
  },
  footnote: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    lineHeight: font.size.xs * 1.7,
    marginTop: spacing.sm,
  },
  clearBtn: {
    marginTop: spacing.md,
  },
});
