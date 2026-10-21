import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNav } from '../navigation/Navigator';
import Screen from '../components/Screen';
import Field from '../components/Field';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { TOPICS } from '../data/topics';
import { colors, spacing, radius, font, text } from '../theme';

export default function TopicScreen() {
  const nav = useNav();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return TOPICS;
    return TOPICS.filter((topic) =>
      `${topic.title} ${topic.examples}`.toLowerCase().includes(needle)
    );
  }, [query]);

  const handlePick = (topic) => {
    nav.push('Route', { topicId: topic.id });
  };

  return (
    <Screen
      step="Step 1 of 3"
      title="What’s your issue?"
      subtitle="Pick the closest topic. You can go back and change it at any time."
      onBack={nav.pop}
    >
      <Field
        label="Search topics"
        value={query}
        onChangeText={setQuery}
        placeholder="Try “pothole”, “school”, “water”"
        autoCapitalize="none"
        accessibilityLabel="Search topics"
        hint="Search by topic or by an example like “trash” or “data center”."
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title={`No topic matches “${query.trim()}”`}
          body="Try a simpler word, or browse the full list of offices and levels of government."
          actionLabel="Clear search"
          onAction={() => setQuery('')}
        />
      ) : (
        <View>
          {filtered.map((topic) => (
            <Pressable
              key={topic.id}
              onPress={() => handlePick(topic)}
              accessibilityRole="button"
              accessibilityLabel={`${topic.title}. ${topic.examples}`}
              accessibilityHint="Shows which office handles this issue"
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <View style={styles.iconBox}>
                <Text style={styles.icon}>{topic.icon}</Text>
              </View>
              <View style={styles.rowBody}>
                <Text style={styles.rowTitle}>{topic.title}</Text>
                <Text style={styles.rowExamples}>{topic.examples}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.footerBlock}>
        <Text style={styles.footerText}>
          Not sure which topic fits? You can look up offices by level of government instead.
        </Text>
        <Button
          label="Browse offices of government"
          variant="secondary"
          onPress={() => nav.push('Offices')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md - 2,
    marginBottom: spacing.sm,
  },
  rowPressed: {
    backgroundColor: '#EEF2F8',
    borderColor: colors.steelLight,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.slate,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md - 2,
  },
  icon: {
    fontSize: 20,
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginBottom: 2,
  },
  rowExamples: {
    ...text.small,
    fontSize: font.size.sm,
    color: colors.inkSoft,
  },
  chevron: {
    fontSize: 24,
    color: colors.steelLight,
    marginLeft: spacing.sm,
    marginTop: -4,
  },
  footerBlock: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    ...text.small,
    marginBottom: spacing.sm + 2,
  },
});
