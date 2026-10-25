import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, font } from '../theme';

export default function StatCard({ value, label, style }) {
  return (
    <View style={[styles.card, style]} accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 104,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm + 2,
    alignItems: 'center',
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  value: {
    fontFamily: font.family,
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    color: colors.ink,
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    textAlign: 'center',
    marginTop: 3,
    lineHeight: font.size.xs * 1.4,
  },
});
