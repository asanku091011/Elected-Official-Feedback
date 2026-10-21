import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNav } from '../navigation/Navigator';
import { useApp } from '../context/AppContext';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import Notice from '../components/Notice';
import LevelBadge from '../components/LevelBadge';
import EmptyState from '../components/EmptyState';
import { getTopic } from '../data/topics';
import { getOffice } from '../data/offices';
import { reviewDraft } from '../lib/validate';
import { colors, spacing, radius, font, text } from '../theme';

export default function PreviewScreen() {
  const nav = useNav();
  const { draft, addMessage, resetDraft } = useApp();
  const [saving, setSaving] = useState(false);

  const topic = getTopic(draft.topicId);
  const office = topic ? getOffice(topic.officeId) : null;
  const review = reviewDraft(draft);

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

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    const { record, saved } = await addMessage({
      topicId: topic.id,
      message: draft.message,
      zip: draft.zip,
      includeName: draft.includeName,
      name: draft.name,
    });
    resetDraft();
    nav.replace('Sent', { record, saved });
  };

  return (
    <Screen
      title="Check it once more"
      subtitle="This is exactly what you would send."
      onBack={nav.pop}
      footer={
        <View>
          <Button
            label={saving ? 'Saving…' : 'Save & get sending options'}
            onPress={handleSave}
            disabled={saving || !review.isValid}
          />
          <Button label="Keep editing" variant="ghost" onPress={nav.pop} style={styles.editBtn} />
        </View>
      }
    >
      <Card style={styles.metaCard}>
        <View style={styles.metaTop}>
          <Text style={styles.metaTopic}>
            {topic.icon}  {topic.title}
          </Text>
          <LevelBadge level={topic.level} />
        </View>
        <Text style={styles.metaOffice}>{office ? office.name : 'Office'}</Text>
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

      <View style={styles.messageCard}>
        <Text style={styles.messageText}>{draft.message.trim()}</Text>
      </View>

      <Notice tone="info" title="How this gets sent">
        Saving keeps a copy on this device and shows you the office’s official contact page. CivLink
        does not email or deliver the message for you, so you stay in control of what you send.
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
  metaOffice: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
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
  editBtn: {
    marginTop: spacing.xs,
    minHeight: 40,
  },
});
