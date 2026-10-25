import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, font, text } from '../theme';

// A large tap target with a visible box, used by the neutrality checklist and
// the notification settings. The whole row toggles, and screen readers hear it
// as a checkbox.
export default function CheckRow({ label, description, checked, onToggle, style, disabled = false }) {
  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: Boolean(checked), disabled }}
      accessibilityLabel={label}
      accessibilityHint={description}
      style={({ pressed }) => [
        styles.row,
        checked && styles.rowChecked,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <Text style={styles.check}>✓</Text> : null}
      </View>
      <View style={styles.body}>
        <Text style={styles.label}>{label}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md - 2,
    marginBottom: spacing.sm,
  },
  rowChecked: {
    backgroundColor: colors.tealSoft,
    borderColor: colors.tealBorder,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: radius.sm - 2,
    borderWidth: 2,
    borderColor: colors.slate,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 2,
    marginTop: 1,
  },
  boxChecked: {
    backgroundColor: colors.tealDeep,
    borderColor: colors.tealDeep,
  },
  check: {
    color: colors.white,
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
    lineHeight: font.size.sm + 2,
  },
  body: {
    flex: 1,
  },
  label: {
    fontFamily: font.family,
    fontSize: font.size.sm + 1,
    fontWeight: font.weight.medium,
    color: colors.ink,
    lineHeight: font.size.sm * 1.5,
  },
  description: {
    ...text.small,
    marginTop: 3,
  },
});
