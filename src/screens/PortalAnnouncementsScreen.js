import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNav } from '../navigation/Navigator';
import { useCivic } from '../context/CivicContext';
import PortalScreen from '../components/PortalScreen';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Notice from '../components/Notice';
import EmptyState from '../components/EmptyState';
import { getJurisdiction } from '../data/jurisdictions';
import { categoryLabel } from '../data/seedContent';
import { formatDate, formatTime } from '../lib/format';
import { colors, spacing, radius, font, text } from '../theme';

const STATUS_TONE = {
  draft: 'neutral',
  scheduled: 'teal',
  published: 'success',
  archived: 'neutral',
};

const STATUS_ORDER = { draft: 0, scheduled: 1, published: 2, archived: 3 };

function statusLabel(status) {
  if (!status) return 'Draft';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function areaNames(audience) {
  return (audience || [])
    .map((id) => {
      const item = getJurisdiction(id);
      return item ? item.short : id;
    })
    .join(', ');
}

export default function PortalAnnouncementsScreen() {
  const nav = useNav();
  const {
    account,
    announcements,
    publishAnnouncement,
    archiveAnnouncement,
  } = useCivic();
  const [feedback, setFeedback] = useState(null);
  const [confirmArchive, setConfirmArchive] = useState(null);

  const sorted = useMemo(
    () =>
      [...announcements].sort((a, b) => {
        const order = (STATUS_ORDER[a.status] || 0) - (STATUS_ORDER[b.status] || 0);
        if (order !== 0) return order;
        return new Date(b.publishAt || b.updatedAt || 0).getTime() -
          new Date(a.publishAt || a.updatedAt || 0).getTime();
      }),
    [announcements]
  );

  if (!account) {
    return (
      <PortalScreen title="Announcements" onBack={nav.pop}>
        <EmptyState
          icon="🔐"
          title="Sign in to manage announcements"
          body="Sign in to write, schedule, and publish announcements for your residents."
          actionLabel="Go to sign-in"
          onAction={() => nav.push('PortalSignIn')}
        />
      </PortalScreen>
    );
  }

  const handlePublish = (item) => {
    const result = publishAnnouncement(item.id);
    if (!result.ok) {
      setFeedback({ tone: 'danger', title: 'Could not publish', body: result.error });
      return;
    }
    setFeedback({
      tone: result.status === 'scheduled' ? 'info' : 'success',
      title: result.status === 'scheduled' ? 'Scheduled' : 'Published',
      body:
        result.status === 'scheduled'
          ? 'Residents will see it in their in-app feed at the scheduled time.'
          : 'Residents in the chosen areas can now see it in their in-app feed.',
    });
    setConfirmArchive(null);
  };

  const handleArchive = (item) => {
    if (confirmArchive !== item.id) {
      setConfirmArchive(item.id);
      return;
    }
    const result = archiveAnnouncement(item.id);
    setConfirmArchive(null);
    if (!result.ok) {
      setFeedback({ tone: 'danger', title: 'Could not archive', body: result.error });
      return;
    }
    setFeedback({
      tone: 'info',
      title: 'Archived',
      body: 'The announcement is removed from the resident feed. It stays in this list for the record.',
    });
  };

  return (
    <PortalScreen
      title="Announcements"
      subtitle="Write an update, choose who receives it, then publish now or schedule it."
      onBack={nav.pop}
    >
      <Button
        label="New announcement"
        onPress={() => nav.push('AnnouncementEditor')}
        style={styles.newBtn}
      />

      {feedback ? (
        <Notice tone={feedback.tone} title={feedback.title}>
          {feedback.body}
        </Notice>
      ) : null}

      <Notice tone="info" title="Who sees what">
        Only published announcements appear in the resident feed, and only for the areas you pick.
        Scheduled items stay hidden until their publish time, and drafts never leave this portal.
      </Notice>

      {sorted.length === 0 ? (
        <EmptyState
          icon="📣"
          title="No announcements yet"
          body="Create a draft, then publish it when the wording is ready."
          actionLabel="New announcement"
          onAction={() => nav.push('AnnouncementEditor')}
        />
      ) : (
        sorted.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.badgeRow}>
              <Badge label={statusLabel(item.status)} tone={STATUS_TONE[item.status] || 'neutral'} />
              <Badge label={categoryLabel(item.category)} tone="teal" />
            </View>

            <Text style={styles.title}>{item.title}</Text>

            <Text style={styles.meta}>
              {areaNames(item.audience) || 'No area selected'}
              {item.publishAt
                ? `  ·  ${item.status === 'scheduled' ? 'Goes out' : 'Published'} ${formatDate(
                    item.publishAt
                  )} at ${formatTime(item.publishAt)}`
                : '  ·  Not scheduled'}
            </Text>

            <Text style={styles.body} numberOfLines={3}>
              {item.body}
            </Text>

            <View style={styles.actionRow}>
              <Button
                label="Edit"
                variant="secondary"
                full={false}
                onPress={() => nav.push('AnnouncementEditor', { announcementId: item.id })}
                style={styles.actionBtn}
              />
              {item.status !== 'published' ? (
                <Button
                  label={item.status === 'scheduled' ? 'Publish now' : 'Publish'}
                  full={false}
                  onPress={() => handlePublish(item)}
                  style={styles.actionBtn}
                />
              ) : null}
              {item.status === 'published' || item.status === 'scheduled' ? (
                <Button
                  label={confirmArchive === item.id ? 'Tap again to archive' : 'Archive'}
                  variant="ghost"
                  full={false}
                  onPress={() => handleArchive(item)}
                  style={styles.archiveBtn}
                />
              ) : null}
            </View>
          </View>
        ))
      )}

      <Text style={styles.footnote}>
        Announcements are delivered to residents of the chosen areas after an official account
        publishes them. Archived items stay in this list for the record.
      </Text>
    </PortalScreen>
  );
}

const styles = StyleSheet.create({
  newBtn: {
    marginBottom: spacing.md,
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
  title: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
    lineHeight: font.size.md * 1.35,
    marginBottom: 4,
  },
  meta: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    lineHeight: font.size.xs * 1.6,
    marginBottom: spacing.sm,
  },
  body: {
    ...text.small,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  actionBtn: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    marginTop: spacing.xs,
  },
  archiveBtn: {
    minHeight: 40,
    paddingHorizontal: spacing.sm,
    marginTop: spacing.xs,
  },
  footnote: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    lineHeight: font.size.xs * 1.7,
    marginTop: spacing.sm,
  },
});
