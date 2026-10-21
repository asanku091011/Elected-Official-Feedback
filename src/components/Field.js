import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, spacing, radius, font, text } from '../theme';

export default function Field({
  label,
  value,
  onChangeText,
  placeholder,
  hint,
  error,
  multiline = false,
  maxLength,
  keyboardType,
  autoCapitalize = 'sentences',
  accessibilityLabel,
  inputStyle,
  style,
}) {
  return (
    <View style={[styles.wrap, style]}>
      {label ? (
        <Text style={styles.label}>
          {label}
        </Text>
      ) : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8794AC"
        multiline={multiline}
        maxLength={maxLength}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={multiline}
        accessibilityLabel={accessibilityLabel || label}
        style={[styles.input, multiline && styles.multiline, error && styles.inputError, inputStyle]}
      />
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
  },
  label: {
    ...text.label,
    marginBottom: spacing.sm - 2,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    minHeight: 48,
    fontSize: font.size.md,
    color: colors.ink,
  },
  multiline: {
    minHeight: 180,
    paddingTop: spacing.md - 4,
    textAlignVertical: 'top',
    lineHeight: font.size.md * 1.5,
  },
  inputError: {
    borderColor: colors.danger,
  },
  hint: {
    ...text.small,
    marginTop: spacing.sm - 2,
  },
  error: {
    ...text.small,
    color: colors.danger,
    fontWeight: font.weight.medium,
    marginTop: spacing.sm - 2,
  },
});
