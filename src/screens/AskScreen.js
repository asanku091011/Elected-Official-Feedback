import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNav } from '../navigation/Navigator';
import { useCivic } from '../context/CivicContext';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Field from '../components/Field';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Notice from '../components/Notice';
import { CATEGORIES, categoryLabel } from '../data/seedContent';
import { getJurisdiction } from '../data/jurisdictions';
import { formatRelative } from '../lib/format';
import { colors, spacing, radius, font, text } from '../theme';

const STATUS = {
  new: { label: 'Awaiting reply', tone: 'warning' },
  replied: { label: 'Replied', tone: 'success' },
  resolved: { label: 'Resolved', tone: 'teal' },
};

export default function AskScreen() {
  const nav = useNav();
  const { askQuestion, questions, jurisdiction } = useCivic();
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('general');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const mine = questions.filter((item) => item.isMine);

  const handleSend = () => {
    const result = askQuestion({ body, category });
    if (!result.ok) {
      setError(result.error);
      setSent(false);
      return;
    }
    setBody('');
    setError('');
    setSent(true);
  };

  return (
    <Screen
      title="Ask a question"
      subtitle={`Write to the sample office that serves ${jurisdiction.name}.`}
      onBack={nav.pop}
      footer={<Button label="Back to updates" variant="secondary" onPress={() => nav.replace('Feed')} />}
    >
      <Notice tone="info" title="Sample inbox">
        This question goes into a sample inbox stored on your device, so you can see how the official
        side would read and answer it. No real office receives it, and nothing leaves your device.
      </Notice>

      {sent ? (
        <Notice tone="success" title="Your question was added to the sample inbox">
          You can see it in the list below. On the official side, the same question appears as an
          unread resident question.
        </Notice>
      ) : null}

      {error ? (
        <Notice tone="danger" title="That question was not added">
          {error}
        </Notice>
      ) : null}

      <Field
        label="Your question"
        value={body}
        onChangeText={(value) => {
          setBody(value);
          setError('');
        }}
        placeholder="What would you like the office to look into?"
        multiline
        maxLength={600}
        hint="At least 20 characters. Include where the issue is and what you would like done."
        accessibilityLabel="Your question to the sample office"
      />

      <Text style={styles.label}>Topic</Text>
      <View style={styles.chipRow}>
        {CATEGORIES.map((item) => {
          const selected = category === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => setCategory(item.id)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Topic: ${item.label}`}
              style={({ pressed }) => [
                styles.chip,
                selected && styles.chipSelected,
                pressed && styles.chipPressed,
              ]}
            >
              <Text style={styles.chipText}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Button
        label="Send question"
        onPress={handleSend}
        disabled={body.trim().length === 0}
        style={styles.sendBtn}
      />

      <Text style={styles.sectionTitle}>Your questions</Text>
      {mine.length === 0 ? (
        <Text style={styles.emptyText}>
          You have not asked anything yet. Questions you add appear here with the office’s reply.
        </Text>
      ) : (
        mine.map((item) => {
          const status = STATUS[item.status] || STATUS.new;
          const area = getJurisdiction(item.jurisdictionId);
          return (
            <Card key={item.id} style={styles.questionCard}>
              <View style={styles.questionTop}>
                <Text style={styles.questionMeta}>
                  {categoryLabel(item.category)}
                  {area ? ` · ${area.short}` : ''} · {formatRelative(item.createdAt)}
                </Text>
                <Badge label={status.label} tone={status.tone} />
              </View>
              <Text style={styles.questionBody}>{item.body}</Text>

              {item.reply ? (
                <View style={styles.replyBox}>
                  <View style={styles.replyTop}>
                    <Text style={styles.replyLabel}>Reply from the sample office</Text>
                    <Badge
                      label={item.reply.isPublic ? 'Public' : 'Private'}
                      tone={item.reply.isPublic ? 'teal' : 'neutral'}
                    />
                  </View>
                  <Text style={styles.replyBody}>{item.reply.body}</Text>
                  <Text style={styles.replyMeta}>
                    {formatRelative(item.reply.repliedAt)}
                    {item.reply.isPublic
                      ? ' · Visible to residents'
                      : ' · Only you can see this reply'}
                  </Text>
                </View>
              ) : (
                <Text style={styles.replyMeta}>No reply yet.</Text>
              )}
            </Card>
          );
        })
      )}

      <Text style={styles.footnote}>
        A real inbox would need a server, verified official accounts, and a privacy policy covering
        what staff can see. This prototype keeps everything on the device.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.teal,
    borderColor: colors.ink,
  },
  chipPressed: {
    opacity: 0.75,
  },
  chipText: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.ink,
  },
  sendBtn: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...text.small,
    marginBottom: spacing.lg,
  },
  questionCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
  },
  questionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs + 2,
  },
  questionMeta: {
    flex: 1,
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    marginRight: spacing.sm,
    marginTop: 3,
  },
  questionBody: {
    ...text.body,
    fontSize: font.size.sm + 1,
    marginBottom: spacing.sm,
  },
  replyBox: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.tealBorder,
    borderRadius: radius.md,
    padding: spacing.md - 2,
  },
  replyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  replyLabel: {
    flex: 1,
    fontFamily: font.family,
    fontSize: font.size.xs,
    fontWeight: font.weight.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.tealDeep,
    marginRight: spacing.sm,
  },
  replyBody: {
    ...text.small,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  replyMeta: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    lineHeight: font.size.xs * 1.6,
  },
  footnote: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    lineHeight: font.size.xs * 1.7,
    marginTop: spacing.sm,
  },
});
