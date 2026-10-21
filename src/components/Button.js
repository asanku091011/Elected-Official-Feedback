import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, font } from '../theme';

// Teal is the primary action color. Its label is ink, never white: #0E1014 on
// #38CBD0 is 9.6:1, while white on teal would fail. White text is only used on
// the deep teal, which clears AA.
const VARIANTS = {
  primary: {
    container: {
      backgroundColor: colors.teal,
      borderWidth: 2,
      borderColor: colors.ink,
    },
    label: { color: colors.ink },
  },
  deep: {
    container: {
      backgroundColor: colors.tealDeep,
      borderWidth: 2,
      borderColor: colors.tealDeep,
    },
    label: { color: colors.white },
  },
  secondary: {
    container: {
      backgroundColor: colors.white,
      borderWidth: 2,
      borderColor: colors.ink,
    },
    label: { color: colors.ink },
  },
  ghost: {
    container: { backgroundColor: 'transparent', borderWidth: 2, borderColor: 'transparent' },
    label: { color: colors.tealDeep },
  },
  danger: {
    container: {
      backgroundColor: colors.white,
      borderWidth: 2,
      borderColor: colors.danger,
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
    opacity: 0.78,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    textAlign: 'center',
  },
});
