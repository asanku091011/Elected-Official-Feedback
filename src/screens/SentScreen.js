import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Linking } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNav } from '../navigation/Navigator';
import { useApp } from '../context/AppContext';
import Screen from '../components/Screen';
import Button from '../components/Button';
import Notice from '../components/Notice';
import ExternalLink from '../components/ExternalLink';
import EmptyState from '../components/EmptyState';
import LevelBadge from '../components/LevelBadge';
import Badge from '../components/Badge';
import { getTopic } from '../data/topics';
import { getOffice } from '../data/offices';
import { getJurisdiction } from '../data/jurisdictions';
import { formatDate, formatTime } from '../lib/format';
import { colors, spacing, radius, font, text } from '../theme';

const NEXT_STEPS = [
  'CivLink delivered the email to the office’s inbox on your behalf.',
  'Keep your reference number. If you do not hear back in a few weeks, follow up and mention it.',
];

export default function SentScreen({ record, saved }) {
  const nav = useNav();
  const { deleteMessage } = useApp();
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [mailFailed, setMailFailed] = useState(false);

  const topic = record ? getTopic(record.topicId) : null;
  const office = record ? getOffice(record.officeId) : null;
  const area = record && record.areaId ? getJurisdiction(record.areaId) : null;
  const areaName = area ? area.name : 'Unknown area';
  // Routed issues carry the recipient the resident consented to. Older saved
  // messages do not, so they keep their original “send it yourself” layout.
  const hasRecipient = Boolean(record && record.recipientEmail && record.recipientName);
  const emailSubject = topic
    ? `CivLink issue #${record.reference}: ${topic.title} (${areaName})`
    : `CivLink issue #${record ? record.reference : ''}`;
  const mailtoUrl = hasRecipient
    ? `mailto:${record.recipientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(record.message)}`
    : '';

  if (!record || !topic) {
    return (
      <Screen title="Message saved" onBack={() => nav.reset('Home')}>
        <EmptyState
          icon="📄"
          title="This message is no longer available"
          body="It may have been deleted. You can write a new message at any time."
          actionLabel="Back to home"
          onAction={() => nav.reset('Home')}
        />
      </Screen>
    );
  }

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(record.message);
      setCopied(true);
      setCopyFailed(false);
    } catch (error) {
      setCopyFailed(true);
      setCopied(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    await deleteMessage(record.id);
    nav.reset('Home');
  };

  const handleOpenEmailApp = () => {
    setMailFailed(false);
    Linking.openURL(mailtoUrl).catch(() => {
      setMailFailed(true);
      setCopied(false);
    });
  };

  return (
    <Screen
      title={hasRecipient ? 'Issue sent' : 'Saved on this device'}
      onBack={() => nav.reset('Home')}
      footer={
        <View>
          <Button label="Back to home" onPress={() => nav.reset('Home')} />
          <Button
            label="Write about another issue"
            variant="ghost"
            onPress={() => nav.reset('Topic')}
            style={styles.footerGhost}
          />
        </View>
      }
    >
      <View style={styles.successCard}>
        <View style={styles.checkCircle}>
          <Text style={styles.checkMark}>✓</Text>
        </View>
        <Text style={styles.successTitle}>
          {hasRecipient ? 'Your issue has been sent' : 'Your message is saved'}
        </Text>
        <Text style={styles.refLabel}>Reference number</Text>
        <Text style={styles.refValue} accessibilityLabel={`Reference number ${record.reference}`}>
          {record.reference}
        </Text>
        <Text style={styles.timestamp}>
          {formatDate(record.createdAt)} at {formatTime(record.createdAt)}
        </Text>
        <Badge
          label={record.status || 'Saved (older version)'}
          tone={record.status === 'Sent' ? 'success' : 'neutral'}
          style={styles.statusBadge}
        />
      </View>

      {saved === false ? (
        <Notice tone="warning" title="Not saved to device storage">
          Your message will disappear when you close the app. Copy it below before you leave this
          screen.
        </Notice>
      ) : null}

      <View style={styles.metaRow}>
        <View style={styles.metaBody}>
          <Text style={styles.metaTopic}>
            {topic.icon}  {topic.title}
          </Text>
          {hasRecipient ? (
            <Text style={styles.metaRecipient}>To: {record.recipientName}</Text>
          ) : null}
          <Text style={styles.metaOffice}>
            {hasRecipient ? `${areaName}  ·  ` : ''}
            {office ? office.name : 'Office'}
          </Text>
        </View>
        <LevelBadge level={topic.level} />
      </View>

      {hasRecipient ? (
        <>
          <Text style={styles.sectionTitle}>Email preview</Text>
          <Text style={styles.copyNote}>
            The preview above is exactly what the office inbox received.
          </Text>
          <View style={styles.emailCard}>
            <Text style={styles.emailLabel}>To</Text>
            <Text style={styles.emailValue}>{record.recipientEmail}</Text>
            <Text style={styles.emailLabel}>From</Text>
            <Text style={styles.emailValue}>CivLink, sent on behalf of a resident</Text>
            <Text style={styles.emailLabel}>Subject</Text>
            <Text style={styles.emailValue}>{emailSubject}</Text>
            <Text style={styles.emailLabel}>Body</Text>
            <Text style={styles.emailBody}>{record.message}</Text>
          </View>
          <Button
            label="Open in my email app (optional)"
            variant="secondary"
            onPress={handleOpenEmailApp}
            style={styles.copyBtn}
            disabled={!mailtoUrl}
            accessibilityHint="Opens your own email app with a copy of the message you sent."
          />
          {mailFailed ? (
            <Text style={styles.copyError} accessibilityLiveRegion="polite">
              Your email app could not be opened. Copy the message below to keep a copy.
            </Text>
          ) : null}
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Send it to the office</Text>
          <Text style={styles.body}>
            CivLink does not send older saved messages for you. Taking this last step is what puts
            your concern in an official record.
          </Text>
          {office ? (
            <ExternalLink
              url={office.url}
              label={`Open ${office.urlLabel}`}
              variant="primary"
              hint="Opens the office's official website in your browser"
              style={styles.primaryLink}
            />
          ) : null}
          <View style={styles.messageCard}>
            <Text style={styles.messageText}>{record.message}</Text>
          </View>
        </>
      )}

      <Button
        label={copied ? 'Copied ✓' : 'Copy my message'}
        variant="secondary"
        onPress={handleCopy}
        style={styles.copyBtn}
      />
      {copyFailed ? (
        <Text style={styles.copyError} accessibilityLiveRegion="polite">
          Could not copy automatically. Select the text below and copy it manually.
        </Text>
      ) : null}

      <Text style={styles.sectionTitle}>What happens next</Text>
      {NEXT_STEPS.map((step, index) => (
        <View key={step} style={styles.stepRow}>
          <Text style={styles.stepNum}>{index + 1}</Text>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}

      <Notice tone="info" title="If the link does not work" style={styles.notice}>
        Office websites change over time. Search the office’s name and open its official site, or
        call the main office number listed there.
      </Notice>

      <Pressable
        onPress={handleDelete}
        accessibilityRole="button"
        accessibilityLabel={confirmDelete ? 'Tap again to delete this message' : 'Delete this message'}
        style={styles.deleteBtn}
      >
        <Text style={styles.deleteText}>
          {confirmDelete ? 'Tap again to delete this message' : 'Delete this message'}
        </Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  successCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  checkCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.successSoft,
    borderWidth: 2,
    borderColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  checkMark: {
    fontFamily: font.family,
    fontSize: 26,
    color: colors.success,
    fontWeight: font.weight.bold,
  },
  successTitle: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginBottom: spacing.md,
  },
  refLabel: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.slateText,
    marginBottom: 4,
  },
  refValue: {
    fontFamily: font.family,
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    color: colors.ink,
    letterSpacing: 1.5,
  },
  timestamp: {
    ...text.small,
    marginTop: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  metaBody: {
    flex: 1,
    marginRight: spacing.sm,
  },
  metaTopic: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginBottom: 2,
  },
  metaOffice: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    color: colors.slateText,
  },
  metaRecipient: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginBottom: 2,
  },
  statusBadge: {
    marginTop: spacing.sm,
  },
  copyNote: {
    ...text.small,
    color: colors.tealDeep,
    fontWeight: font.weight.medium,
    marginBottom: spacing.sm,
  },
  emailCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.teal,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  emailLabel: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.slateText,
    marginBottom: 2,
  },
  emailValue: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  emailBody: {
    ...text.body,
    color: colors.ink,
    marginBottom: 0,
  },
  sectionTitle: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  body: {
    ...text.body,
    marginBottom: spacing.md,
  },
  primaryLink: {
    marginBottom: spacing.sm,
  },
  copyBtn: {
    marginBottom: spacing.md,
  },
  copyError: {
    ...text.small,
    color: colors.danger,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  messageCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.teal,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  messageText: {
    ...text.body,
    color: colors.ink,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm + 2,
  },
  stepNum: {
    fontFamily: font.family,
    width: 22,
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
    color: colors.tealDeep,
  },
  stepText: {
    ...text.body,
    flex: 1,
    fontSize: font.size.sm + 1,
  },
  notice: {
    marginTop: spacing.sm,
  },
  deleteBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  deleteText: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    color: colors.danger,
    textDecorationLine: 'underline',
  },
  footerGhost: {
    marginTop: spacing.xs,
    minHeight: 40,
  },
});
