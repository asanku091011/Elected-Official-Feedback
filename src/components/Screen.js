// Every screen shares this shell: a white header with the CivLink mark on the
// left, a readable title, and an optional sticky footer for the main action.

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogoMark } from './Logo';
import { colors, spacing, radius, font } from '../theme';

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
          <View style={styles.headerLeft}>
            {onBack ? (
              <Pressable
                onPress={onBack}
                hitSlop={12}
                style={({ pressed }) => [styles.back, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Text style={styles.backText}>←</Text>
              </Pressable>
            ) : null}
            <LogoMark size={30} />
          </View>
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

      <View style={styles.body}>
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
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  back: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.ink,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
  },
  backText: {
    color: colors.ink,
    fontSize: 18,
    lineHeight: 20,
    marginTop: -2,
  },
  pressed: {
    backgroundColor: colors.tealSoft,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  step: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    fontWeight: font.weight.semibold,
    letterSpacing: 1.2,
    color: colors.tealDeep,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: font.family,
    fontSize: font.size.xxl,
    fontWeight: font.weight.bold,
    color: colors.ink,
    letterSpacing: -0.7,
    lineHeight: font.size.xxl * 1.12,
  },
  subtitle: {
    fontFamily: font.family,
    fontSize: font.size.md,
    color: colors.slateText,
    lineHeight: font.size.md * 1.5,
    marginTop: spacing.sm,
    maxWidth: 620,
  },
  body: {
    flex: 1,
    backgroundColor: colors.white,
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
  },
});
