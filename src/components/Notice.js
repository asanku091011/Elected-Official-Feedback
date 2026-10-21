import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, font, text } from '../theme';

const TONES = {
  info: { bg: colors.tealSoft, border: colors.tealBorder, icon: 'ℹ️', title: colors.tealDeep },
  warning: { bg: colors.warningSoft, border: colors.warningBorder, icon: '⚠️', title: colors.warning },
  success: { bg: colors.successSoft, border: colors.successBorder, icon: '✅', title: colors.success },
  danger: { bg: colors.dangerSoft, border: colors.dangerBorder, icon: '⚠️', title: colors.danger },
};

export default function Notice({ tone = 'info', title, children, style }) {
  const theme = TONES[tone] || TONES.info;
  return (
    <View style={[styles.wrap, { backgroundColor: theme.bg, borderColor: theme.border }, style]}>
      <Text style={styles.icon}>{theme.icon}</Text>
      <View style={styles.bodyWrap}>
        {title ? <Text style={[styles.title, { color: theme.title }]}>{title}</Text> : null}
        {typeof children === 'string' ? <Text style={styles.body}>{children}</Text> : children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md - 4,
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: font.size.md,
    marginRight: spacing.sm,
    lineHeight: font.size.md * 1.4,
  },
  bodyWrap: {
    flex: 1,
  },
  title: {
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
    marginBottom: 2,
  },
  body: {
    ...text.small,
    color: colors.ink,
  },
});
