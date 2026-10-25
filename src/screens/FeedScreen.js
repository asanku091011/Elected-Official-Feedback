import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNav } from '../navigation/Navigator';
import { useCivic } from '../context/CivicContext';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Notice from '../components/Notice';
import EmptyState from '../components/EmptyState';
import { categoryLabel } from '../data/seedContent';
import { labelForVA10 } from '../data/jurisdictions';
import { audienceLabel, closesInLabel, findVote, pollPhase, pollTypeLabel } from '../lib/polls';
import { REPORT_REASONS } from '../lib/moderation';
import { formatDate } from '../lib/format';
import { colors, spacing, radius, font, text } from '../theme';

// The resident side of the feed. Everything here is sample content stored on
// the device; there is no server delivering real office announcements yet.
export default function FeedScreen() {
  const nav = useNav();
  const {
    feedItems,
    jurisdiction,
    jurisdictionId,
    unreadCount,
    seen,
    votes,
    markSeen,
    markAllSeen,
    notificationPrefs,
    reportContent,
  } = useCivic();
  const [openAnnouncementId, setOpenAnnouncementId] = useState(null);
  const [reportOpen, setReportOpen] = useState(null);
  const [reported, setReported] = useState([]);

  // One reporting control per post. Reports stay on this device in the demo,
  // and the sample administrator can see them in the portal.
  const handleReport = (key, type, id, reason) => {
    reportContent({ targetType: type, targetId: id, reason: reason.id });
    setReported((current) => [...current, key]);
    setReportOpen(null);
  };

  const toggleAnnouncement = (item) => {
    setOpenAnnouncementId((current) => (current === item.id ? null : item.id));
    markSeen('announcement', item.id);
  };

  const prefsOff = notificationPrefs.muted || notificationPrefs.jurisdictions[jurisdictionId] === false;

  return (
    <Screen
      title="Updates for your area"
      subtitle="Announcements and polls from the sample office. This demo feed is stored on your device."
      onBack={nav.pop}
      headerRight={
        unreadCount > 0 ? (
          <Badge label={`${unreadCount} unread`} tone="teal" />
        ) : (
          <Badge label="All read" tone="neutral" />
        )
      }
      footer={
        <View>
          <Button label="Ask a question" onPress={() => nav.push('Ask')} />
          <Button
            label="How announcements reach residents"
            variant="ghost"
            onPress={() => nav.push('HowItWorks')}
            style={styles.footerGhost}
          />
        </View>
      }
    >
      <View style={styles.areaRow}>
        <View style={styles.areaBody}>
          <Text style={styles.areaLabel}>Showing updates for</Text>
          <Text style={styles.areaName}>{jurisdiction.name}</Text>
          <Text style={styles.areaFlag}>{labelForVA10(jurisdiction.inVA10)}</Text>
        </View>
        <Button
          label="Change area"
          variant="secondary"
          full={false}
          onPress={() => nav.push('Jurisdiction')}
          style={styles.areaBtn}
        />
      </View>

      {prefsOff ? (
        <Notice tone="warning" title="Updates are turned off for this area">
          Your notification settings are hiding this feed. Turn them back on to see sample updates.
        </Notice>
      ) : null}

      <Notice tone="info" title="Demo feed with sample data">
        These announcements and polls come from a sample organization, not from a real county or
        city office. The in-app feed is the only delivery channel CivLink actually implements; push
        notifications and email are not connected.
      </Notice>

      <View style={styles.actionRow}>
        <Pressable
          onPress={() => nav.push('NotificationSettings')}
          accessibilityRole="button"
          accessibilityLabel="Open notification settings"
          style={({ pressed }) => [styles.textLink, pressed && styles.pressed]}
        >
          <Text style={styles.textLinkText}>Notification settings</Text>
        </Pressable>
        <Pressable
          onPress={markAllSeen}
          accessibilityRole="button"
          accessibilityLabel="Mark all updates as read"
          style={({ pressed }) => [styles.textLink, pressed && styles.pressed]}
        >
          <Text style={styles.textLinkText}>Mark all read</Text>
        </Pressable>
      </View>

      {feedItems.length === 0 ? (
        <EmptyState
          icon="📭"
          title="No updates for this area yet"
          body="The sample office has not published anything for this locality, or your notification settings are hiding it. You can switch areas or ask a question."
          actionLabel="Choose your area"
          onAction={() => nav.push('Jurisdiction')}
        />
      ) : (
        feedItems.map(({ type, item }) => {
          const isPoll = type === 'poll';
          const isUnread = isPoll
            ? !seen.polls.includes(item.id)
            : !seen.announcements.includes(item.id);

          if (isPoll) {
            const voted = Boolean(findVote(votes, item.id));
            const closed = pollPhase(item) === 'closed';
            return (
              <Card key={`poll-${item.id}`} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardKind}>Poll</Text>
                  <View style={styles.badgeRow}>
                    {item.isSample ? <Badge label="Sample" tone="teal" /> : null}
                    {isUnread ? <Badge label="New" tone="warning" /> : null}
                    {voted ? <Badge label="Responded" tone="success" dot /> : null}
                  </View>
                </View>
                <Text style={styles.cardTitle}>{item.question}</Text>
                <Text style={styles.cardMeta}>
                  {pollTypeLabel(item.type)} · {closesInLabel(item)} · {audienceLabel(item)}
                </Text>
                <Button
                  label={voted ? 'See results' : closed ? 'See final results' : 'Respond to this poll'}
                  variant={voted || closed ? 'secondary' : 'primary'}
                  onPress={() => nav.push('Poll', { pollId: item.id })}
                  style={styles.cardBtn}
                />
                <View style={styles.reportBlock}>
                  {reported.includes(`poll:${item.id}`) ? (
                    <Text style={styles.reportThanks}>Reported. The sample office will review it.</Text>
                  ) : reportOpen === `poll:${item.id}` ? (
                    <View>
                      <Text style={styles.reportTitle}>Why are you reporting this?</Text>
                      {REPORT_REASONS.map((reason) => (
                        <Pressable
                          key={reason.id}
                          onPress={() => handleReport(`poll:${item.id}`, 'poll', item.id, reason)}
                          accessibilityRole="button"
                          accessibilityLabel={`Report this poll: ${reason.label}`}
                          style={({ pressed }) => [styles.reasonRow, pressed && styles.pressed]}
                        >
                          <Text style={styles.reasonText}>{reason.label}</Text>
                        </Pressable>
                      ))}
                      <Pressable
                        onPress={() => setReportOpen(null)}
                        accessibilityRole="button"
                        accessibilityLabel="Cancel reporting"
                        style={styles.cancelReport}
                      >
                        <Text style={styles.reportLink}>Cancel</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => setReportOpen(`poll:${item.id}`)}
                      accessibilityRole="button"
                      accessibilityLabel="Report this poll"
                      style={styles.reportLinkWrap}
                    >
                      <Text style={styles.reportLink}>Report this content</Text>
                    </Pressable>
                  )}
                </View>
              </Card>
            );
          }

          const expanded = openAnnouncementId === item.id;
          return (
            <Card key={`ann-${item.id}`} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.cardKind}>Announcement</Text>
                <View style={styles.badgeRow}>
                  {item.isSample ? <Badge label="Sample" tone="teal" /> : null}
                  {isUnread ? <Badge label="New" tone="warning" /> : null}
                </View>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMeta}>
                {categoryLabel(item.category)} · {formatDate(item.publishAt)}
              </Text>
              {expanded ? <Text style={styles.cardBody}>{item.body}</Text> : null}
              <Pressable
                onPress={() => toggleAnnouncement(item)}
                accessibilityRole="button"
                accessibilityLabel={expanded ? 'Hide the announcement text' : `Read ${item.title}`}
                style={({ pressed }) => [styles.readBtn, pressed && styles.pressed]}
              >
                <Text style={styles.readBtnText}>{expanded ? 'Show less' : 'Read announcement'}</Text>
              </Pressable>
              <View style={styles.reportBlock}>
                {reported.includes(`announcement:${item.id}`) ? (
                  <Text style={styles.reportThanks}>Reported. The sample office will review it.</Text>
                ) : reportOpen === `announcement:${item.id}` ? (
                  <View>
                    <Text style={styles.reportTitle}>Why are you reporting this?</Text>
                    {REPORT_REASONS.map((reason) => (
                      <Pressable
                        key={reason.id}
                        onPress={() =>
                          handleReport(`announcement:${item.id}`, 'announcement', item.id, reason)
                        }
                        accessibilityRole="button"
                        accessibilityLabel={`Report this announcement: ${reason.label}`}
                        style={({ pressed }) => [styles.reasonRow, pressed && styles.pressed]}
                      >
                        <Text style={styles.reasonText}>{reason.label}</Text>
                      </Pressable>
                    ))}
                    <Pressable
                      onPress={() => setReportOpen(null)}
                      accessibilityRole="button"
                      accessibilityLabel="Cancel reporting"
                      style={styles.cancelReport}
                    >
                      <Text style={styles.reportLink}>Cancel</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable
                    onPress={() => setReportOpen(`announcement:${item.id}`)}
                    accessibilityRole="button"
                    accessibilityLabel="Report this announcement"
                    style={styles.reportLinkWrap}
                  >
                    <Text style={styles.reportLink}>Report this content</Text>
                  </Pressable>
                )}
              </View>
            </Card>
          );
        })
      )}

      <Text style={styles.footnote}>
        Sample announcements and polls are labeled wherever they appear. A real rollout would keep
        this content on a server and deliver it only to residents of the chosen localities.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  areaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md - 2,
    marginBottom: spacing.md,
  },
  areaBody: {
    flex: 1,
    marginRight: spacing.sm,
  },
  areaLabel: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.slateText,
    fontWeight: font.weight.semibold,
    marginBottom: 2,
  },
  areaName: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
  },
  areaFlag: {
    ...text.small,
    fontSize: font.size.xs,
    marginTop: 2,
  },
  areaBtn: {
    paddingHorizontal: spacing.md,
    minHeight: 44,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  textLink: {
    paddingVertical: spacing.sm,
    paddingRight: spacing.md,
  },
  textLinkText: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.tealDeep,
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.75,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  cardKind: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.tealDeep,
    fontWeight: font.weight.bold,
    marginTop: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    flex: 1,
    marginLeft: spacing.sm,
  },
  cardTitle: {
    fontFamily: font.family,
    fontSize: font.size.md + 1,
    fontWeight: font.weight.bold,
    color: colors.ink,
    lineHeight: (font.size.md + 1) * 1.35,
    marginBottom: spacing.xs,
  },
  cardMeta: {
    ...text.small,
    fontSize: font.size.sm - 1,
    marginBottom: spacing.sm,
  },
  cardBody: {
    ...text.body,
    fontSize: font.size.sm + 1,
    marginBottom: spacing.sm,
  },
  cardBtn: {
    marginTop: spacing.xs,
    minHeight: 44,
  },
  readBtn: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
  },
  readBtnText: {
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
  footerGhost: {
    marginTop: spacing.xs,
    minHeight: 40,
  },
  reportBlock: {
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  reportLinkWrap: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
  },
  reportLink: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    textDecorationLine: 'underline',
  },
  reportTitle: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  reasonRow: {
    paddingVertical: spacing.xs + 2,
  },
  reasonText: {
    ...text.small,
    fontSize: font.size.sm,
    color: colors.ink,
  },
  cancelReport: {
    paddingVertical: spacing.xs,
  },
  reportThanks: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.success,
  },
});
