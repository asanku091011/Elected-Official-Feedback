import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getLevel } from '../data/offices';
import { levelTint, font, spacing } from '../theme';

export default function LevelBadge({ level }) {
  const meta = getLevel(level);
  const tint = levelTint[level] || levelTint.local;

  return (
    <View style={[styles.badge, { backgroundColor: tint.bg }]}>
      <View style={[styles.dot, { backgroundColor: tint.fg }]} />
      <Text style={[styles.label, { color: tint.fg }]}>{meta ? meta.label : 'Local'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: 100,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  label: {
    fontSize: font.size.xs,
    fontWeight: font.weight.semibold,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
