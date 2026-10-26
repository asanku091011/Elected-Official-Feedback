import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNav } from '../navigation/Navigator';
import { useCivic } from '../context/CivicContext';
import PortalScreen from '../components/PortalScreen';
import Card from '../components/Card';
import Button from '../components/Button';
import Field from '../components/Field';
import Notice from '../components/Notice';
import Badge from '../components/Badge';
import { ROLE_LABELS, isGovEmail } from '../data/accounts';
import { formatDate } from '../lib/format';
import { colors, spacing, radius, font, text } from '../theme';

const STATUS_TONES = {
  pending: 'warning',
  approved: 'success',
  denied: 'danger',
};

const STATUS_LABELS = {
  pending: 'Awaiting verification',
  approved: 'Approved',
  denied: 'Not approved',
};

const EMPTY_FORM = { orgName: '', email: '', note: '' };

export default function PortalSignInScreen() {
  const nav = useNav();
  const { accounts, accessRequests, signIn, requestAccess } = useCivic();
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [signInError, setSignInError] = useState('');

  const handleSignIn = (account) => {
    const result = signIn(account.id);
    if (!result.ok) {
      setSignInError(result.error);
      return;
    }
    setSignInError('');
    nav.reset('PortalHome');
  };

  const handleRequest = () => {
    if (!isGovEmail(form.email)) {
      setError('Use a .gov email address.');
      setSent(false);
      return;
    }
    const result = requestAccess(form);
    if (!result.ok) {
      setError(result.error);
      setSent(false);
      return;
    }
    setError('');
    setSent(true);
    setForm(EMPTY_FORM);
  };

  return (
    <PortalScreen
      title="Official Portal"
      subtitle="Office sign-in"
      onBack={nav.pop}
      headerRight={null}
      footer={
        <Button label="Back to CivLink" variant="secondary" onPress={() => nav.reset('Home')} />
      }
    >
      <Notice tone="info" title="Reviewed access">
        Every official account is approved by an administrator before it can publish anything. Sign
        in with the administrator account to review access requests.
      </Notice>

      <Text style={styles.sectionTitle}>Office accounts</Text>
      {accounts.map((account) => (
        <Card key={account.id} style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <View style={styles.accountBody}>
              <Text style={styles.accountName}>{account.displayName}</Text>
              <Text style={styles.accountMeta}>
                {ROLE_LABELS[account.role] || 'Account'}
                {account.orgName ? ` · ${account.orgName}` : ''}
              </Text>
              <Text style={styles.accountEmail}>{account.email}</Text>
            </View>
            <View style={styles.badgeColumn}>
              {account.verified ? <Badge label="Verified official" tone="success" dot /> : null}
              {account.isSample ? <Badge label="Sample" tone="neutral" /> : null}
            </View>
          </View>
          <Button
            label={`Sign in as ${account.displayName}`}
            variant={account.role === 'admin' ? 'secondary' : 'primary'}
            onPress={() => handleSignIn(account)}
            accessibilityHint={
              account.role === 'admin'
                ? 'Opens the portal as the administrator, who can approve access requests'
                : 'Opens the portal dashboard'
            }
            style={styles.signInButton}
          />
        </Card>
      ))}

      {signInError ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {signInError}
        </Text>
      ) : null}

      <Text style={styles.sectionTitle}>Request official access</Text>
      <Text style={styles.body}>
        Send a request with your office name and a .gov email. An administrator reviews every
        request before the account can publish.
      </Text>

      {sent ? (
        <Notice tone="success" title="Request submitted">
          Sign in with the administrator account to review and approve it.
        </Notice>
      ) : null}

      <Field
        label="Office or organization"
        value={form.orgName}
        onChangeText={(value) => setForm((current) => ({ ...current, orgName: value }))}
        placeholder="County Office"
        accessibilityLabel="Office or organization name"
      />
      <Field
        label="Work email"
        value={form.email}
        onChangeText={(value) => setForm((current) => ({ ...current, email: value }))}
        placeholder="name@agency.gov"
        autoCapitalize="none"
        keyboardType="email-address"
        hint="Must end in .gov. This is a format check only."
        accessibilityLabel="Work email ending in .gov"
      />
      <Field
        label="What would you post about? (optional)"
        value={form.note}
        onChangeText={(value) => setForm((current) => ({ ...current, note: value }))}
        placeholder="Meeting notices, service updates, and neutral questions for residents"
        multiline
        maxLength={300}
        accessibilityLabel="Note about what you would post"
      />

      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}

      <Button label="Send access request" onPress={handleRequest} style={styles.requestButton} />

      {accessRequests.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Submitted requests</Text>
          {accessRequests.map((request) => (
            <View key={request.id} style={styles.requestRow}>
              <View style={styles.requestBody}>
                <Text style={styles.requestName}>{request.orgName}</Text>
                <Text style={styles.requestMeta}>{request.email}</Text>
                <Text style={styles.requestMeta}>
                  Sent {formatDate(request.createdAt)}
                  {request.decidedAt ? ` · Reviewed ${formatDate(request.decidedAt)}` : ''}
                </Text>
              </View>
              <Badge
                label={STATUS_LABELS[request.status] || 'Recorded'}
                tone={STATUS_TONES[request.status] || 'neutral'}
              />
            </View>
          ))}
          <Text style={styles.footnote}>
            Requests are reviewed by the administrator before an account is approved.
          </Text>
        </>
      ) : null}
    </PortalScreen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  body: {
    ...text.body,
    marginBottom: spacing.md,
  },
  accountCard: {
    marginBottom: spacing.sm,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  accountBody: {
    flex: 1,
    marginRight: spacing.sm,
  },
  accountName: {
    fontFamily: font.family,
    fontSize: font.size.sm + 1,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginBottom: 2,
  },
  accountMeta: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    color: colors.slateText,
  },
  accountEmail: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    marginTop: 2,
  },
  badgeColumn: {
    alignItems: 'flex-end',
  },
  signInButton: {
    marginTop: spacing.xs,
  },
  requestButton: {
    marginTop: spacing.xs,
  },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md - 2,
    marginBottom: spacing.sm,
  },
  requestBody: {
    flex: 1,
    marginRight: spacing.sm,
  },
  requestName: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginBottom: 2,
  },
  requestMeta: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    lineHeight: font.size.xs * 1.5,
  },
  error: {
    ...text.small,
    color: colors.danger,
    fontWeight: font.weight.medium,
    marginBottom: spacing.sm,
  },
  footnote: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    lineHeight: font.size.xs * 1.7,
    marginTop: spacing.xs,
  },
});
