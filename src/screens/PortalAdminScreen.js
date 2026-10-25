import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNav } from '../navigation/Navigator';
import { useCivic } from '../context/CivicContext';
import PortalScreen from '../components/PortalScreen';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Notice from '../components/Notice';
import EmptyState from '../components/EmptyState';
import { getJurisdiction } from '../data/jurisdictions';
import { ROLE_LABELS } from '../data/accounts';
import { REPORT_REASONS } from '../lib/moderation';
import { formatDate, formatRelative } from '../lib/format';
import { colors, spacing, radius, font, text } from '../theme';

function reasonLabel(id) {
  const found = REPORT_REASONS.find((item) => item.id === id);
  return found ? found.label : 'Another reason';
}

function requestStatus(item) {
  if (item.status === 'approved') return { label: 'Approved', tone: 'success' };
  if (item.status === 'denied') return { label: 'Denied', tone: 'danger' };
  return { label: 'Awaiting verification', tone: 'warning' };
}

export default function PortalAdminScreen() {
  const nav = useNav();
  const {
    account,
    role,
    accounts,
    accessRequests,
    reports,
    approveAccess,
    denyAccess,
  } = useCivic();
  const [feedback, setFeedback] = useState(null);

  if (!account) {
    return (
      <PortalScreen title="Access requests" onBack={nav.pop}>
        <EmptyState
          icon="🔐"
          title="Sign in as an administrator"
          body="Accounts are approved by an administrator. The demo has one administrator account."
          actionLabel="Go to demo sign-in"
          onAction={() => nav.push('PortalSignIn')}
        />
      </PortalScreen>
    );
  }

  if (role !== 'admin') {
    return (
      <PortalScreen title="Access requests" onBack={nav.pop}>
        <Notice tone="warning" title="Administrator access required">
          Approving an official account is a separate job from publishing content. Sign in with the
          sample administrator account to try this screen.
        </Notice>
        <Button
          label="Switch demo account"
          onPress={() => nav.replace('PortalSignIn')}
          style={styles.switchBtn}
        />
        <Text style={styles.footnote}>
          In a real rollout this would be a county clerk or communications office with its own
          permissions, not the same account that publishes posts.
        </Text>
      </PortalScreen>
    );
  }

  const pending = accessRequests.filter((item) => item.status === 'pending');
  const decided = accessRequests.filter((item) => item.status !== 'pending');

  const handleApprove = (item) => {
    const result = approveAccess(item.id);
    if (!result.ok) {
      setFeedback({ tone: 'danger', title: 'Could not approve', body: result.error });
      return;
    }
    setFeedback({
      tone: 'success',
      title: 'Account approved',
      body: `${item.orgName} now has a demo official account on this device with a verified badge.`,
    });
  };

  const handleDeny = (item) => {
    const result = denyAccess(item.id);
    if (!result.ok) {
      setFeedback({ tone: 'danger', title: 'Could not deny', body: result.error });
      return;
    }
    setFeedback({
      tone: 'info',
      title: 'Request denied',
      body: 'No account was created. A real office would send the requester a short explanation.',
    });
  };

  return (
    <PortalScreen
      title="Access requests"
      subtitle="Verify an office, approve its account, and review what residents have flagged."
      onBack={nav.pop}
    >
      {feedback ? (
        <Notice tone={feedback.tone} title={feedback.title}>
          {feedback.body}
        </Notice>
      ) : null}

      <Notice tone="info" title="How verification would work">
        A real rollout would check that the email domain belongs to the office, confirm the person
        works there, and require a second approval before the account could publish anything. This
        prototype only checks for a .gov address and a human tap.
      </Notice>

      <Text style={styles.sectionTitle}>Pending requests</Text>
      {pending.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>No requests waiting</Text>
          <Text style={styles.emptyBody}>
            An office can request access from the demo sign-in screen. Requests appear here for the
            administrator.
          </Text>
          <Button
            label="Open demo sign-in"
            variant="secondary"
            onPress={() => nav.push('PortalSignIn')}
            style={styles.emptyBtn}
          />
        </View>
      ) : (
        pending.map((item) => {
          const area = getJurisdiction(item.jurisdictionId);
          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.badgeRow}>
                <Badge label="Pending" tone="warning" />
                <Badge label=".gov email" tone="teal" />
              </View>
              <Text style={styles.orgName}>{item.orgName}</Text>
              <Text style={styles.meta}>{item.email}</Text>
              <Text style={styles.meta}>
                {area ? area.name : 'Unknown area'} · Requested {formatDate(item.createdAt)}
              </Text>
              {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
              <View style={styles.actionRow}>
                <Button
                  label="Verify and approve"
                  full={false}
                  onPress={() => handleApprove(item)}
                  style={styles.actionBtn}
                />
                <Button
                  label="Deny"
                  variant="danger"
                  full={false}
                  onPress={() => handleDeny(item)}
                  style={styles.actionBtn}
                />
              </View>
            </View>
          );
        })
      )}

      {decided.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Decided requests</Text>
          {decided.map((item) => {
            const status = requestStatus(item);
            return (
              <View key={item.id} style={styles.decidedRow}>
                <View style={styles.decidedBody}>
                  <Text style={styles.decidedName}>{item.orgName}</Text>
                  <Text style={styles.meta}>
                    {item.email}
                    {item.decidedAt ? ` · ${formatRelative(item.decidedAt)}` : ''}
                  </Text>
                </View>
                <Badge label={status.label} tone={status.tone} />
              </View>
            );
          })}
        </>
      ) : null}

      <Text style={styles.sectionTitle}>Official accounts</Text>
      {accounts.map((item) => (
        <View key={item.id} style={styles.accountRow}>
          <View style={styles.accountBody}>
            <Text style={styles.decidedName}>
              {item.displayName} · {ROLE_LABELS[item.role] || item.role}
            </Text>
            <Text style={styles.meta}>
              {item.orgName} · {item.email}
              {item.isSample ? ' · Sample account' : ''}
            </Text>
          </View>
          {item.verified ? <Badge label="Verified" tone="success" dot /> : null}
        </View>
      ))}

      <Text style={styles.sectionTitle}>Resident reports</Text>
      {reports.length === 0 ? (
        <Text style={styles.emptyText}>
          Nothing has been reported. Residents can report a post from the Updates screen.
        </Text>
      ) : (
        reports.map((item) => (
          <View key={item.id} style={styles.reportRow}>
            <View style={styles.accountBody}>
              <Text style={styles.decidedName}>
                {item.targetType} · {item.targetId}
              </Text>
              <Text style={styles.meta}>
                {reasonLabel(item.reason)} · {formatRelative(item.createdAt)}
              </Text>
            </View>
          </View>
        ))
      )}

      <View style={styles.linkRow}>
        <Button
          label="Open audit log"
          variant="secondary"
          full={false}
          onPress={() => nav.push('AuditLog')}
          style={styles.linkBtn}
        />
        <Button
          label="Content policy"
          variant="ghost"
          full={false}
          onPress={() => nav.push('ContentPolicy')}
          style={styles.linkBtn}
        />
      </View>
    </PortalScreen>
  );
}

const styles = StyleSheet.create({
  switchBtn: {
    marginTop: spacing.sm,
  },
  footnote: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    lineHeight: font.size.xs * 1.7,
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  emptyTitle: {
    fontFamily: font.family,
    fontSize: font.size.sm + 1,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginBottom: 4,
  },
  emptyBody: {
    ...text.small,
  },
  emptyBtn: {
    marginTop: spacing.sm,
    minHeight: 42,
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
  orgName: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginBottom: 2,
  },
  meta: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    lineHeight: font.size.xs * 1.6,
  },
  note: {
    ...text.small,
    color: colors.ink,
    marginTop: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  actionBtn: {
    minHeight: 42,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  decidedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md - 2,
    marginBottom: spacing.sm,
  },
  decidedBody: {
    flex: 1,
    marginRight: spacing.sm,
  },
  decidedName: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginBottom: 2,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md - 2,
    marginBottom: spacing.sm,
  },
  accountBody: {
    flex: 1,
    marginRight: spacing.sm,
  },
  reportRow: {
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    borderRadius: radius.md,
    padding: spacing.md - 2,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...text.small,
  },
  linkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  linkBtn: {
    minHeight: 42,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
});
