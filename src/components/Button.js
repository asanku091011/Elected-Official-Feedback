import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, font } from '../theme';

const VARIANTS = {
  primary: {
    container: { backgroundColor: colors.navy },
    label: { color: colors.white },
  },
  amber: {
    container: { backgroundColor: colors.amber },
    label: { color: colors.black },
  },
  secondary: {
    container: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
    },
    label: { color: colors.ink },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    label: { color: colors.navy },
  },
  danger: {
    container: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: 'rgba(163, 35, 28, 0.35)',
    },
    label: { color: colors.danger },
  },
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  style,
  accessibilityHint,
  full = true,
}) {
  const variantStyle = VARIANTS[variant] || VARIANTS.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        full && styles.full,
        variantStyle.container,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, variantStyle.label]}>
        {icon ? `${icon}  ` : ''}
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md - 2,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  full: {
    width: '100%',
  },
  pressed: {
    opacity: 0.82,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    textAlign: 'center',
  },
});
