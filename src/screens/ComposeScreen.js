import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useNav } from '../navigation/Navigator';
import { useApp } from '../context/AppContext';
import Screen from '../components/Screen';
import Field from '../components/Field';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import Notice from '../components/Notice';
import { getTopic, DRAFT_CHECKS, MESSAGE_TEMPLATE } from '../data/topics';
import { getOffice } from '../data/offices';
import { reviewDraft, MAX_LENGTH } from '../lib/validate';
import { colors, spacing, radius, font, text } from '../theme';

export default function ComposeScreen() {
  const nav = useNav();
  const { draft, updateDraft, startDraft } = useApp();
  const [attempted, setAttempted] = useState(false);

  const topic = getTopic(draft.topicId);
  const office = topic ? getOffice(topic.officeId) : null;
  const review = useMemo(() => reviewDraft(draft), [draft]);

  if (!topic) {
    return (
      <Screen title="Write your message" onBack={nav.pop}>
        <EmptyState
          icon="✏️"
          title="No issue selected"
          body="Choose the topic you want to write about, then Civic can route your message to the right office."
          actionLabel="Choose an issue"
          onAction={() => nav.replace('Topic')}
        />
      </Screen>
    );
  }

  const handlePreview = () => {
    if (!review.isValid) {
      setAttempted(true);
      return;
    }
    nav.push('Preview');
  };

  const insertTemplate = () => {
    updateDraft({ message: MESSAGE_TEMPLATE });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Screen
        step="Step 3 of 3"
        title="Write your message"
        onBack={nav.pop}
        footer={
          <View>
            <Button label="Preview message" onPress={handlePreview} />
            <Pressable
              onPress={() => {
                startDraft(topic.id);
                setAttempted(false);
              }}
              accessibilityRole="button"
              accessibilityLabel="Start over with an empty message"
              style={styles.startOver}
            >
              <Text style={styles.startOverText}>Start over</Text>
            </Pressable>
          </View>
        }
      >
        <View style={styles.routeChip}>
          <Text style={styles.routeChipIcon}>{topic.icon}</Text>
          <View style={styles.routeChipBody}>
            <Text style={styles.routeChipLabel}>Sending to</Text>
            <Text style={styles.routeChipName}>{office ? office.name : topic.title}</Text>
          </View>
        </View>

        {attempted && !review.isValid ? (
          <Notice tone="danger" title="A few things to fix">
            <Text style={styles.noticeText}>
              Check the highlighted fields below, then preview again.
            </Text>
          </Notice>
        ) : null}

        <Field
          label="Your message"
          value={draft.message}
          onChangeText={(value) => updateDraft({ message: value })}
          placeholder="Describe what is happening, where, and what you would like the office to do."
          multiline
          maxLength={MAX_LENGTH}
          error={attempted ? review.errors.message : null}
          hint="Write in your own words. Two or three short paragraphs is plenty."
          accessibilityLabel="Your message"
        />

        <View style={styles.counterRow}>
          <Text style={styles.counter}>{draft.message.length} / {MAX_LENGTH} characters</Text>
          {draft.message.length === 0 ? (
            <Pressable
              onPress={insertTemplate}
              accessibilityRole="button"
              accessibilityLabel="Insert a starting template"
            >
              <Text style={styles.templateLink}>Use a starting template</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => updateDraft({ message: '' })}
              accessibilityRole="button"
              accessibilityLabel="Clear the message"
            >
              <Text style={styles.clearLink}>Clear</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.guideCard}>
          <Text style={styles.guideTitle}>What a strong message includes</Text>
          {DRAFT_CHECKS.map((check) => (
            <View key={check.id} style={styles.guideItem}>
              <Text style={styles.guideBullet}>•</Text>
              <View style={styles.guideBody}>
                <Text style={styles.guideLabel}>{check.label}</Text>
                <Text style={styles.guideHint}>{check.hint}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Optional details</Text>

        <Field
          label="ZIP code"
          value={draft.zip}
          onChangeText={(value) => updateDraft({ zip: value.replace(/[^0-9]/g, '').slice(0, 5) })}
          placeholder="20176"
          keyboardType="number-pad"
          maxLength={5}
          error={attempted ? review.errors.zip : null}
          hint="Used only to say roughly where the issue is. Leave it blank if you prefer."
          accessibilityLabel="ZIP code, optional"
        />

        <View style={styles.switchRow}>
          <View style={styles.switchBody}>
            <Text style={styles.switchLabel}>Include my name</Text>
            <Text style={styles.switchHint}>
              Off by default. Your name is saved only on this device and only shown to you.
            </Text>
          </View>
          <Switch
            value={draft.includeName}
            onValueChange={(value) => updateDraft({ includeName: value })}
            trackColor={{ false: colors.border, true: colors.navyLight }}
            thumbColor={draft.includeName ? colors.amber : colors.white}
            accessibilityLabel="Include my name in this message"
          />
        </View>

        {draft.includeName ? (
          <Field
            label="Name"
            value={draft.name}
            onChangeText={(value) => updateDraft({ name: value })}
            placeholder="First and last name"
            error={attempted ? review.errors.name : null}
            accessibilityLabel="Your name"
          />
        ) : null}

        <Text style={styles.privacyNote}>
          Nothing is sent from this app. Your message is saved on this device, and the next screen
          gives you the office’s official contact page so you can send it yourself.
        </Text>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  routeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md - 2,
    marginBottom: spacing.md,
  },
  routeChipIcon: {
    fontSize: 20,
    marginRight: spacing.sm + 2,
  },
  routeChipBody: {
    flex: 1,
  },
  routeChipLabel: {
    fontSize: font.size.xs,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.inkSoft,
    fontWeight: font.weight.semibold,
    marginBottom: 2,
  },
  routeChipName: {
    fontSize: font.size.sm + 1,
    fontWeight: font.weight.semibold,
    color: colors.ink,
  },
  noticeText: {
    ...text.small,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  counter: {
    fontSize: font.size.xs,
    color: colors.inkSoft,
    fontVariant: ['tabular-nums'],
  },
  templateLink: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.navy,
    textDecorationLine: 'underline',
  },
  clearLink: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.inkSoft,
    textDecorationLine: 'underline',
  },
  guideCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  guideTitle: {
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  guideItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm + 2,
  },
  guideBullet: {
    color: colors.amber,
    fontSize: font.size.md,
    width: 16,
    lineHeight: font.size.md * 1.4,
  },
  guideBody: {
    flex: 1,
  },
  guideLabel: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginBottom: 1,
  },
  guideHint: {
    fontSize: font.size.sm,
    color: colors.inkSoft,
    lineHeight: font.size.sm * 1.45,
  },
  sectionTitle: {
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  switchBody: {
    flex: 1,
    marginRight: spacing.md,
  },
  switchLabel: {
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginBottom: 2,
  },
  switchHint: {
    fontSize: font.size.sm,
    color: colors.inkSoft,
    lineHeight: font.size.sm * 1.45,
  },
  privacyNote: {
    fontSize: font.size.xs,
    color: colors.inkSoft,
    lineHeight: font.size.xs * 1.7,
    marginBottom: spacing.sm,
  },
  startOver: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  startOverText: {
    fontSize: font.size.sm,
    color: colors.inkSoft,
    textDecorationLine: 'underline',
  },
});
