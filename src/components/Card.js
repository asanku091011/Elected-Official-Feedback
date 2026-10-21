import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';

export default function Card({ children, style, onPress, accessibilityLabel, accessibilityHint }) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  pressed: {
    backgroundColor: colors.tealSoft,
  },
});
