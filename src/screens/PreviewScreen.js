import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNav } from '../navigation/Navigator';
import { useApp } from '../context/AppContext';
import { useCivic } from '../context/CivicContext';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import Notice from '../components/Notice';
import LevelBadge from '../components/LevelBadge';
import EmptyState from '../components/EmptyState';
import { getTopic } from '../data/topics';
import { getRecipient } from '../data/recipients';
import { reviewDraft } from '../lib/validate';
import { colors, spacing, radius, font, text } from '../theme';

const PHASE_LABELS = {
  preparing: 'Preparing your issue…',
  routing: 'Routing your issue…',
  sent: 'Email sent ✓',
};

export default function PreviewScreen() {
  const nav = useNav();
  const { draft, addMessage, resetDraft } = useApp();
  const { jurisdictionId } = useCivic();
  const [saving, setSaving] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [sendError, setSendError] = useState('');
  const timersRef = useRef([]);

  const topic = getTopic(draft.topicId);
  const review = reviewDraft(draft);
  // Resolved by ID only. A draft value that is not on the fixed list is
  // blocked here and can never reach the send step.
  const recipient = draft.recipientId ? getRecipient(draft.recipientId) : null;

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
    },
    []
  );

  if (!topic) {
    return (
      <Screen title="Nothing to preview" onBack={nav.pop}>
        <EmptyState
          icon="🧾"
          title="No message yet"
          body="Choose an issue and write a message first."
          actionLabel="Choose an issue"
          onAction={() => nav.replace('Topic')}
        />
      </Screen>
    );
  }

  if (!recipient) {
    return (
      <Screen title="Check it once more" onBack={nav.pop}>
        <Notice tone="danger" title="This recipient is not on the CivLink list">
          Only recipients on the app’s fixed list can receive an issue, so nothing can be sent.
          Go back and pick a recipient, or start the issue again.
        </Notice>
        <Button
          label="Go back"
          variant="secondary"
          onPress={nav.pop}
          style={styles.editBtn}
        />
      </Screen>
    );
  }

  const canSend = review.isValid && draft.consended;

  const sendIssue = async () => {
    if (saving || !canSend) return;
    setSaving(true);
    setSendError('');
    const wait = (ms) =>
      new Promise((resolve) => {
        const timer = setTimeout(resolve, ms);
        timersRef.current.push(timer);
      });

    // Send the issue through the full sequence, then save it.
    setPhase('preparing');
    await wait(700);
    setPhase('routing');
    await wait(800);
    try {
      const result = await addMessage({
        topicId: draft.topicId,
        recipientId: recipient.id,
        message: draft.message,
        zip: draft.zip,
        includeName: draft.includeName,
        name: draft.name,
        jurisdictionId,
      });
      if (!result.ok) {
        throw new Error(result.error || 'The issue could not be sent.');
      }
      setPhase('sent');
      await wait(600);
      resetDraft();
      nav.replace('Sent', { record: result.record, saved: result.saved });
    } catch (error) {
      setPhase('idle');
      setSaving(false);
      setSendError(
        'The issue could not be sent or saved right now. Nothing was lost — try again in a moment.'
      );
    }
  };

  return (
    <Screen
      title="Check it once more"
      subtitle="This is exactly what would be sent."
      onBack={nav.pop}
      footer={
        <View>
          <Button
            label={saving ? 'Sending…' : 'Send issue to recipient'}
            onPress={sendIssue}
            disabled={saving || !canSend}
          />
          {!draft.consended ? (
            <Text style={styles.consentHint}>
              Agree to send it to {recipient.name} on the previous screen to enable sending.
            </Text>
          ) : null}
          <Button label="Keep editing" variant="ghost" onPress={nav.pop} style={styles.editBtn} />
        </View>
      }
    >
      {phase !== 'idle' ? (
        <View style={styles.overlay} pointerEvents="auto">
          <View style={styles.overlayCard}>
            {phase !== 'sent' ? (
              <ActivityIndicator color={colors.tealDeep} size="small" />
            ) : (
              <Text style={styles.overlayCheck}>✓</Text>
            )}
            <Text style={styles.overlayText}>{PHASE_LABELS[phase]}</Text>
            {phase === 'routing' && recipient ? (
              <Text style={styles.overlayRecipient}>to {recipient.name}</Text>
            ) : null}
            <Text style={styles.overlayStatus}>
              Routing to {recipient.name}…
            </Text>
          </View>
        </View>
      ) : null}

      <Card style={styles.metaCard}>
        <View style={styles.metaTop}>
          <Text style={styles.metaTopic}>
            {topic.icon}  {topic.title}
          </Text>
          <LevelBadge level={topic.level} />
        </View>
        <Text style={styles.metaRecipientTo}>
          To: {recipient.name}
        </Text>
        <Text style={styles.metaSmall}>
          From: {draft.includeName && draft.name.trim() ? draft.name.trim() : 'Anonymous'}
          {draft.zip.trim() ? `  ·  ZIP ${draft.zip.trim()}` : ''}
        </Text>
      </Card>

      {review.warnings.map((warning) => (
        <Notice key={warning} tone="warning" title="Small thing to fix">
          {warning}
        </Notice>
      ))}

      {!review.isValid ? (
        <Notice tone="danger" title="This message is not ready">
          {Object.values(review.errors)[0]}
        </Notice>
      ) : null}

      {sendError ? (
        <Notice tone="danger" title="Could not send">
          {sendError}
        </Notice>
      ) : null}

      <View style={styles.messageCard}>
        <Text style={styles.messageText}>{draft.message.trim()}</Text>
      </View>

      <Notice tone="info" title="What happens when you send">
        CivLink prepares your issue, routes it to the recipient you chose, and saves it on this
        device with a reference number under “My issues”.
      </Notice>
    </Screen>
  );
}

const styles = StyleSheet.create({
  metaCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  metaTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm - 2,
  },
  metaTopic: {
    flex: 1,
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginRight: spacing.sm,
  },
  metaRecipientTo: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.tealDeep,
    marginBottom: 4,
  },
  metaSmall: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    color: colors.slateText,
  },
  // The teal bar on the left marks the message as the thing being sent.
  messageCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.teal,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  messageText: {
    ...text.body,
    color: colors.ink,
  },
  consentHint: {
    ...text.small,
    marginTop: -spacing.sm + 4,
    marginBottom: spacing.sm,
    color: colors.danger,
  },
  editBtn: {
    marginTop: spacing.xs,
    minHeight: 40,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    zIndex: 10,
  },
  overlayCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    maxWidth: 320,
  },
  overlayCheck: {
    fontFamily: font.family,
    fontSize: 28,
    color: colors.success,
    fontWeight: font.weight.bold,
    marginBottom: spacing.xs,
  },
  overlayText: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    color: colors.ink,
  },
  overlayRecipient: {
    ...text.small,
    marginTop: spacing.xs,
    maxWidth: 240,
    textAlign: 'center',
  },
  overlayStatus: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
