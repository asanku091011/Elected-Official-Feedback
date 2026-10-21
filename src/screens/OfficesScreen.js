import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Screen from '../components/Screen';
import LevelBadge from '../components/LevelBadge';
import ExternalLink from '../components/ExternalLink';
import { LEVELS, officesForLevel } from '../data/offices';
import { useNav } from '../navigation/Navigator';
import { colors, spacing, radius, font, text } from '../theme';

const FILTERS = [{ id: 'all', label: 'All' }, ...LEVELS.map((level) => ({ id: level.id, label: level.label }))];

export default function OfficesScreen() {
  const nav = useNav();
  const [filter, setFilter] = useState('all');

  const groups = useMemo(() => {
    const visible = filter === 'all' ? LEVELS : LEVELS.filter((level) => level.id === filter);
    return visible.map((level) => ({ level, offices: officesForLevel(level.id) }));
  }, [filter]);

  return (
    <Screen
      title="Who does what"
      subtitle="Every level of government handles a different piece of your life. Here is the map."
      onBack={nav.pop}
    >
      <View style={styles.filterRow} accessibilityRole="tablist">
        {FILTERS.map((item) => {
          const selected = filter === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => setFilter(item.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={`Show ${item.label} offices`}
              style={({ pressed }) => [
                styles.chip,
                selected && styles.chipSelected,
                pressed && styles.chipPressed,
              ]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {groups.map(({ level, offices }) => (
        <View key={level.id} style={styles.group}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupTitle}>{level.label} government</Text>
            <Text style={styles.groupShort}>{level.short}</Text>
          </View>
          <Text style={styles.groupBlurb}>{level.blurb}</Text>

          {offices.map((office) => (
            <View key={office.id} style={styles.officeCard}>
              <View style={styles.officeHeader}>
                <Text style={styles.officeName}>{office.name}</Text>
                <LevelBadge level={office.level} />
              </View>
              <Text style={styles.officeRole}>{office.role}</Text>
              <ExternalLink
                url={office.url}
                label={office.urlLabel}
                variant="secondary"
                hint={`Opens ${office.urlLabel} in your browser`}
                style={styles.officeLink}
              />
            </View>
          ))}
        </View>
      ))}

      <Text style={styles.footnote}>
        Only official public websites are linked. Civic does not list individual officeholders,
        because elected officials and contact details change often.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  chipPressed: {
    opacity: 0.75,
  },
  chipText: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.ink,
  },
  chipTextSelected: {
    color: colors.white,
  },
  group: {
    marginBottom: spacing.lg,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  groupTitle: {
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
    color: colors.ink,
    letterSpacing: -0.2,
  },
  groupShort: {
    fontSize: font.size.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: colors.inkSoft,
    fontWeight: font.weight.semibold,
  },
  groupBlurb: {
    ...text.small,
    marginTop: spacing.xs,
    marginBottom: spacing.sm + 2,
  },
  officeCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  officeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.xs + 2,
  },
  officeName: {
    flex: 1,
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginRight: spacing.sm,
    lineHeight: font.size.md * 1.35,
  },
  officeRole: {
    ...text.small,
    fontSize: font.size.sm,
    marginBottom: spacing.sm,
  },
  officeLink: {
    alignSelf: 'flex-start',
  },
  footnote: {
    fontSize: font.size.xs,
    color: colors.inkSoft,
    lineHeight: font.size.xs * 1.7,
    marginTop: spacing.sm,
  },
});
