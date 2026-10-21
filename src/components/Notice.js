import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, font, text } from '../theme';

const TONES = {
  info: { bg: '#EDF2FA', border: '#C9D6EA', icon: 'ℹ️', title: colors.navy },
  warning: { bg: colors.warningLight, border: '#F0D9A8', icon: '⚠️', title: colors.warning },
  success: { bg: colors.successLight, border: '#B7DCC9', icon: '✅', title: colors.success },
  danger: { bg: colors.dangerLight, border: '#EFC4C0', icon: '⚠️', title: colors.danger },
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
    color: colors.inkSoft,
  },
});
