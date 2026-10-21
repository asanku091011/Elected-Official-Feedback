import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, font, text } from '../theme';

export default function BarRow({ label, count, total, color = colors.navy, icon }) {
  const share = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <View
      style={styles.row}
      accessibilityLabel={`${label}: ${count} ${count === 1 ? 'message' : 'messages'}, ${share} percent`}
    >
      <View style={styles.labelRow}>
        <Text style={styles.label} numberOfLines={1}>
          {icon ? `${icon}  ` : ''}
          {label}
        </Text>
        <Text style={styles.count}>
          {count} · {share}%
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.max(share, 3)}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm - 3,
  },
  label: {
    ...text.small,
    color: colors.ink,
    fontWeight: font.weight.medium,
    flex: 1,
    marginRight: spacing.sm,
  },
  count: {
    ...text.small,
    color: colors.inkSoft,
    fontVariant: ['tabular-nums'],
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
