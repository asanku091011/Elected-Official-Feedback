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
import { useCivic } from '../context/CivicContext';
import Screen from '../components/Screen';
import Field from '../components/Field';
import Button from '../components/Button';
import CheckRow from '../components/CheckRow';
import EmptyState from '../components/EmptyState';
import Notice from '../components/Notice';
import { getTopic, DRAFT_CHECKS, MESSAGE_TEMPLATE } from '../data/topics';
import { getOffice } from '../data/offices';
import { suggestRecipient, getRecipient, recipientsForArea } from '../data/recipients';
import { reviewDraft, MAX_LENGTH } from '../lib/validate';
import { colors, spacing, radius, font, text } from '../theme';

export default function ComposeScreen() {
  const nav = useNav();
  const { draft, updateDraft, startDraft } = useApp();
  const { jurisdictionId, jurisdiction } = useCivic();
  const [attempted, setAttempted] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const topic = getTopic(draft.topicId);
  const office = topic ? getOffice(topic.officeId) : null;
  const review = useMemo(() => reviewDraft(draft), [draft]);
  // The suggestion comes from the category and the selected area. The resident
  // can change it, but only to another recipient from the fixed sample list.
  const suggestion = topic ? suggestRecipient(topic.id, jurisdictionId) : null;
  const selected = draft.recipientId ? getRecipient(draft.recipientId) : suggestion;
  const areaRecipients = recipientsForArea(jurisdictionId);

  if (!topic) {
    return (
      <Screen title="Write your message" onBack={nav.pop}>
        <EmptyState
          icon="✏️"
          title="No issue selected"
          body="Choose the topic you want to write about, then CivLink can route your message to the right office."
          actionLabel="Choose an issue"
          onAction={() => nav.replace('Topic')}
        />
      </Screen>
    );
  }

  const handlePreview = () => {
    if (!review.isValid || !selected || !draft.consended) {
      setAttempted(true);
      return;
    }
    setPickerOpen(false);
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
            <Text style={styles.routeChipLabel}>Your issue in {jurisdiction.name}</Text>
            <Text style={styles.routeChipName}>{topic.title}</Text>
          </View>
        </View>

        {selected ? (
          <>
            <View style={[styles.routeChip, styles.recipientChip]}>
              <Text style={styles.routeChipIcon}>✉️</Text>
              <View style={styles.routeChipBody}>
                <Text style={styles.routeChipLabel}>Suggested recipient</Text>
                <Text style={styles.routeChipName}>{selected.name}</Text>
                <Text style={styles.recipientEmail}>{selected.email}</Text>
              </View>
            </View>
            <Pressable
              onPress={() => setPickerOpen((current) => !current)}
              accessibilityRole="button"
              accessibilityLabel={
                pickerOpen ? 'Close the recipient list' : 'Choose a different recipient for this issue'
              }
              style={styles.changeLink}
            >
              <Text style={styles.templateLink}>
                {pickerOpen ? 'Hide the recipient list' : 'Change recipient'}
              </Text>
            </Pressable>

            {pickerOpen ? (
              <View style={styles.pickerList}>
                <Text style={styles.pickerHint}>
                  Recipients for {jurisdiction.name}. Only these sample inboxes can receive an issue.
                </Text>
                {areaRecipients.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      updateDraft({ recipientId: item.id, consended: draft.consended });
                      setPickerOpen(false);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Use ${item.name} as the recipient`}
                    style={({ pressed }) => [
                      styles.recipientRow,
                      item.id === selected.id && styles.recipientRowSelected,
                      pressed && styles.pressedRow,
                    ]}
                  >
                    <Text style={styles.recipientRowName} numberOfLines={1}>
                      {item.id === selected.id ? '✓ ' : ''}
                      {item.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}

            <CheckRow
              label={`Send this issue to ${selected.name}`}
              description="Required to send. The issue is also saved on this device under My issues."
              checked={draft.consended}
              onToggle={() => updateDraft({ consended: !draft.consended })}
            />
            {attempted && !draft.consended ? (
              <Notice tone="danger" title="Consent needed">
                Tick “Send this issue to {selected.name}” so CivLink knows the recipient agreed to
                receive it from you.
              </Notice>
            ) : null}
          </>
        ) : (
          <Notice tone="danger" title="No recipient on the list" style={styles.noticeSpacing}>
            This area has no recipient in the list yet, so the issue cannot be sent. Try changing
            your area from the home screen.
          </Notice>
        )}

        {office ? (
          <Text style={styles.officeNote}>
            The office that actually handles this issue is {office.name} — see the previous screen
            for its official website.
          </Text>
        ) : null}

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
            trackColor={{ false: colors.border, true: colors.tealDeep }}
            thumbColor={colors.white}
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
          Your issue is saved on this device, and — only if you tick the consent box — is sent to
          the recipient above as a demo email. No real government office receives it in this build.
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
    fontFamily: font.family,
    fontSize: font.size.xs,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.slateText,
    fontWeight: font.weight.semibold,
    marginBottom: 2,
  },
  routeChipName: {
    fontFamily: font.family,
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
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    fontVariant: ['tabular-nums'],
  },
  templateLink: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.tealDeep,
    textDecorationLine: 'underline',
  },
  clearLink: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.slateText,
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
    fontFamily: font.family,
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
    fontFamily: font.family,
    color: colors.tealDeep,
    fontSize: font.size.md,
    width: 16,
    lineHeight: font.size.md * 1.4,
  },
  guideBody: {
    flex: 1,
  },
  guideLabel: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginBottom: 1,
  },
  guideHint: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    color: colors.slateText,
    lineHeight: font.size.sm * 1.45,
  },
  sectionTitle: {
    fontFamily: font.family,
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
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginBottom: 2,
  },
  switchHint: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    color: colors.slateText,
    lineHeight: font.size.sm * 1.45,
  },
  privacyNote: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    lineHeight: font.size.xs * 1.7,
    marginBottom: spacing.sm,
  },
  recipientChip: {
    borderLeftWidth: 4,
    borderLeftColor: colors.teal,
  },
  recipientEmail: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    marginTop: 2,
  },
  changeLink: {
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  pickerList: {
    marginBottom: spacing.md,
  },
  pickerHint: {
    ...text.small,
    marginBottom: spacing.sm,
  },
  recipientRow: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md - 2,
    marginBottom: spacing.sm,
  },
  recipientRowSelected: {
    backgroundColor: colors.tealSoft,
    borderColor: colors.tealBorder,
  },
  pressedRow: {
    backgroundColor: colors.tealSoft,
  },
  recipientRowName: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.medium,
    color: colors.ink,
  },
  officeNote: {
    ...text.small,
    marginBottom: spacing.lg,
  },
  noticeSpacing: {
    marginBottom: spacing.md,
  },
  startOver: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  startOverText: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    color: colors.slateText,
    textDecorationLine: 'underline',
  },
});
