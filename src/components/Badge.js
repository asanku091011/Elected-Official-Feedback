import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, font } from '../theme';

// Small labels: status chips, "Sample" markers, and the verified-official badge.
// Colors pair a strong foreground with a soft surface so every badge keeps
// readable contrast.
const TONES = {
  neutral: { bg: colors.surface, border: colors.border, fg: colors.slateText },
  teal: { bg: colors.tealSoft, border: colors.tealBorder, fg: colors.tealDeep },
  success: { bg: colors.successSoft, border: colors.successBorder, fg: colors.success },
  warning: { bg: colors.warningSoft, border: colors.warningBorder, fg: colors.warning },
  danger: { bg: colors.dangerSoft, border: colors.dangerBorder, fg: colors.danger },
};

export default function Badge({ label, tone = 'neutral', dot = false, style }) {
  const theme = TONES[tone] || TONES.neutral;
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: theme.bg, borderColor: theme.border },
        style,
      ]}
    >
      {dot ? <View style={[styles.dot, { backgroundColor: theme.fg }]} /> : null}
      <Text style={[styles.label, { color: theme.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  label: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    fontWeight: font.weight.semibold,
    letterSpacing: 0.3,
  },
});
