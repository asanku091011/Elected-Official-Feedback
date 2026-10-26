import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNav } from '../navigation/Navigator';
import { useCivic } from '../context/CivicContext';
import PortalScreen from '../components/PortalScreen';
import StatCard from '../components/StatCard';
import Button from '../components/Button';
import Notice from '../components/Notice';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { ROLE_LABELS } from '../data/accounts';
import { pollPhase } from '../lib/polls';
import { colors, spacing, radius, font, text } from '../theme';

const START_STEPS = [
  'Sign in with the CivLink staff account.',
  'Open Polls, create one, complete the neutrality checklist, and publish it.',
  'Switch to the resident side, open the feed, and respond from your area.',
  'Come back to Poll results to watch the count update.',
];

// A large row that opens another portal screen. Kept local because only this
// dashboard uses it.
function NavRow({ title, meta, onPress, accessibilityHint }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${meta}`}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [styles.navRow, pressed && styles.navRowPressed]}
    >
      <View style={styles.navBody}>
        <Text style={styles.navTitle}>{title}</Text>
        <Text style={styles.navMeta}>{meta}</Text>
      </View>
      <Text style={styles.navChevron}>›</Text>
    </Pressable>
  );
}

export default function PortalHomeScreen() {
  const nav = useNav();
  const {
    account,
    role,
    openPolls,
    scheduledPosts,
    unreadQuestions,
    totalResponses,
    polls,
    announcements,
    accessRequests,
    resetPortalData,
    signOut,
  } = useCivic();
  const [confirmReset, setConfirmReset] = useState(false);

  if (!account) {
    return (
      <PortalScreen
        title="Official Portal"
        subtitle="The office side of CivLink."
        onBack={nav.pop}
      >
        <EmptyState
          icon="🏛️"
          title="Sign in to the Official Portal"
          body="Sign in with an office account to manage polls, announcements, and resident questions."
          actionLabel="Choose an account"
          onAction={() => nav.push('PortalSignIn')}
        />
        <Button
          label="Back to the resident app"
          variant="secondary"
          onPress={() => nav.reset('Home')}
        />
      </PortalScreen>
    );
  }

  const pendingRequests = accessRequests.filter((item) => item.status === 'pending').length;
  const draftPolls = polls.filter((item) => pollPhase(item) === 'draft').length;

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetPortalData();
    nav.reset('PortalSignIn');
  };

  return (
    <PortalScreen
      title="Official Portal"
      subtitle="The office side of CivLink"
      onBack={nav.pop}
      headerRight={<Badge label={ROLE_LABELS[role] || 'Official'} tone="teal" dot />}
    >
      <View style={styles.statRow}>
        <StatCard value={openPolls.length} label="Active polls" />
        <StatCard value={scheduledPosts} label="Scheduled posts" />
      </View>
      <View style={styles.statRow}>
        <StatCard value={unreadQuestions} label="Unread questions" />
        <StatCard value={totalResponses} label="Total responses" />
      </View>

      <Notice tone="info" title="What these numbers include">
        Total responses counts every response recorded on this device. Open the results screen for
        any poll to see its full tally.
      </Notice>

      <Text style={styles.sectionTitle}>Manage</Text>
      <NavRow
        title="Polls"
        meta={`${openPolls.length} active · ${draftPolls} ${draftPolls === 1 ? 'draft' : 'drafts'}`}
        onPress={() => nav.push('PortalPolls')}
        accessibilityHint="Create, publish, close, and review polls"
      />
      <NavRow
        title="Announcements"
        meta={`${announcements.length} total`}
        onPress={() => nav.push('PortalAnnouncements')}
        accessibilityHint="Write, schedule, publish, and archive announcements"
      />
      <NavRow
        title="Resident questions"
        meta={`${unreadQuestions} waiting for a reply`}
        onPress={() => nav.push('PortalQuestions')}
        accessibilityHint="Read questions from residents and reply"
      />
      <NavRow
        title="Audit log"
        meta="Who changed what, and when"
        onPress={() => nav.push('AuditLog')}
        accessibilityHint="See the record of portal actions"
      />
      {role === 'admin' ? (
        <NavRow
          title="Access requests"
          meta={`${pendingRequests} awaiting verification`}
          onPress={() => nav.push('PortalAdmin')}
          accessibilityHint="Approve or deny official account requests"
        />
      ) : null}
      <NavRow
        title="Content policy"
        meta="The rules every post must follow"
        onPress={() => nav.push('ContentPolicy')}
        accessibilityHint="Read the nonpartisan content rules"
      />

      <Text style={styles.sectionTitle}>How publishing works</Text>
      <View style={styles.stepCard}>
        {START_STEPS.map((step, index) => (
          <View key={step} style={styles.stepItem}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
        <Button
          label="Open the resident feed"
          variant="secondary"
          onPress={() => nav.push('Feed')}
          style={styles.stepsButton}
        />
      </View>

      <Text style={styles.sectionTitle}>Account</Text>
      <Button
        label="Sign out and switch role"
        variant="secondary"
        onPress={() => {
          signOut();
          nav.reset('Home');
        }}
        accessibilityHint="Returns to the resident app"
      />
      <Button
        label={confirmReset ? 'Tap again to reset portal content' : 'Reset portal content'}
        variant="danger"
        onPress={handleReset}
        style={styles.resetButton}
        accessibilityHint="Restores the built-in polls, announcements, and questions, and clears responses"
      />
      <Text style={styles.resetNote}>
        Resetting restores the built-in polls, announcements, questions, and clears responses
        recorded on this device. Saved resident messages are kept separately and are not deleted
        here.
      </Text>
    </PortalScreen>
  );
}

const styles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
  },
  sectionTitle: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 3,
    marginBottom: spacing.sm,
  },
  navRowPressed: {
    backgroundColor: colors.tealSoft,
    borderColor: colors.tealBorder,
  },
  navBody: {
    flex: 1,
  },
  navTitle: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    color: colors.ink,
  },
  navMeta: {
    ...text.small,
    fontSize: font.size.sm,
    marginTop: 2,
  },
  navChevron: {
    fontSize: 24,
    color: colors.slate,
    marginLeft: spacing.sm,
    marginTop: -4,
  },
  stepCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm + 2,
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.teal,
    borderWidth: 1,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 2,
  },
  stepNumText: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    fontWeight: font.weight.bold,
    color: colors.ink,
  },
  stepText: {
    ...text.small,
    flex: 1,
    color: colors.ink,
    paddingTop: 2,
  },
  stepsButton: {
    marginTop: spacing.xs,
  },
  resetButton: {
    marginTop: spacing.sm,
  },
  resetNote: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    lineHeight: font.size.xs * 1.6,
    marginTop: spacing.sm,
  },
});
