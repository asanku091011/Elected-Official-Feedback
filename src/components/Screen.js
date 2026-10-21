// Every screen shares this shell: a navy header, a light rounded content
// "sheet", and an optional sticky footer for the main action.

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius, font, text } from '../theme';

export default function Screen({
  title,
  subtitle,
  step,
  onBack,
  headerRight,
  children,
  footer,
  scroll = true,
  contentStyle,
}) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          {onBack ? (
            <Pressable
              onPress={onBack}
              hitSlop={16}
              style={styles.back}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Text style={styles.backText}>←</Text>
            </Pressable>
          ) : (
            <View style={styles.back} />
          )}
          {step ? <Text style={styles.step}>{step}</Text> : null}
          {headerRight ? <View style={styles.headerRight}>{headerRight}</View> : null}
        </View>
        {title ? (
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
        ) : null}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.sheet}>
        {scroll ? (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, contentStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inner}>{children}</View>
          </ScrollView>
        ) : (
          <View style={styles.innerFlex}>{children}</View>
        )}

        {footer ? (
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
            <View style={styles.inner}>{footer}</View>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.navy,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 36,
    marginBottom: spacing.sm,
  },
  back: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.navyLight,
  },
  backText: {
    color: colors.white,
    fontSize: 20,
    lineHeight: 22,
    marginTop: -2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  step: {
    fontSize: font.size.xs,
    fontWeight: font.weight.semibold,
    letterSpacing: 1.2,
    color: colors.amber,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: font.size.xxl,
    fontWeight: font.weight.bold,
    color: colors.white,
    letterSpacing: -0.7,
    lineHeight: font.size.xxl * 1.12,
  },
  subtitle: {
    ...text.body,
    color: colors.steelLight,
    marginTop: spacing.sm,
    fontSize: font.size.md,
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.slate,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  inner: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
  },
  innerFlex: {
    flex: 1,
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
    paddingTop: spacing.md,
    paddingHorizontal: 0,
  },
});
