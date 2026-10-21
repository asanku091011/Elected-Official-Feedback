import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from './Button';
import { colors, spacing, font, text } from '../theme';

export default function EmptyState({ icon = '📭', title, body, actionLabel, onAction }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} variant="secondary" style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  icon: {
    fontSize: 34,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  body: {
    ...text.small,
    textAlign: 'center',
    maxWidth: 320,
  },
  action: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
});
