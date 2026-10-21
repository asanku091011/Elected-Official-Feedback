import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNav } from '../navigation/Navigator';
import Button from '../components/Button';
import { colors, spacing, radius, font, text } from '../theme';

const STEPS = [
  {
    number: '1',
    title: 'Pick your issue',
    body: 'Choose the topic that matches your concern — roads, schools, water, privacy, and more.',
  },
  {
    number: '2',
    title: 'See who actually handles it',
    body: 'Civic explains which office has the power to act, and what that office cannot do.',
  },
  {
    number: '3',
    title: 'Write it, then send it',
    body: 'Get help writing a clear message, then use the office’s own contact page to send it.',
  },
];

const TRUST = ['No account', 'No tracking', 'Saved on your device'];

export default function HomeScreen() {
  const nav = useNav();
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: false }),
      Animated.timing(slide, { toValue: 0, duration: 500, useNativeDriver: false }),
    ]).start();
  }, [fade, slide]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          <View style={styles.header}>
            <View style={styles.wordmark}>
              <Text style={styles.wordmarkText}>Civic</Text>
              <View style={styles.wordmarkDot} />
            </View>
            <Pressable
              onPress={() => nav.push('About')}
              accessibilityRole="button"
              accessibilityLabel="About Civic"
              hitSlop={12}
              style={({ pressed }) => [styles.aboutBtn, pressed && styles.pressed]}
            >
              <Text style={styles.aboutText}>About</Text>
            </Pressable>
          </View>

          <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }] }}>
            <Text style={styles.eyebrow}>Northern Virginia · civic help</Text>
            <Text style={styles.headline} accessibilityRole="header">
              Your message, in the right inbox.
            </Text>
            <Text style={styles.heroBody}>
              Most people send a concern to an office that cannot act on it. Civic finds the office
              that can, explains why, and helps you write something a staffer will actually read.
            </Text>

            <View style={styles.ctaBlock}>
              <Button
                label="Find where my issue goes"
                variant="amber"
                onPress={() => nav.push('Topic')}
                accessibilityHint="Opens the list of issue topics"
              />
              <Button
                label="Browse offices of government"
                variant="secondary"
                onPress={() => nav.push('Offices')}
                style={styles.secondaryCta}
              />
            </View>

            <View style={styles.trustRow}>
              {TRUST.map((item) => (
                <View key={item} style={styles.trustItem}>
                  <Text style={styles.trustCheck}>✓</Text>
                  <Text style={styles.trustText}>{item}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </View>

        <View style={styles.divider} />

        <View style={[styles.inner, styles.section]}>
          <Text style={styles.sectionTitle}>How it works</Text>
          {STEPS.map((step) => (
            <View key={step.number} style={styles.step}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{step.number}</Text>
              </View>
              <View style={styles.stepBody}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepText}>{step.body}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.inner}>
          <View style={styles.privacyCard}>
            <Text style={styles.privacyTitle}>Your message stays yours</Text>
            <Text style={styles.privacyBody}>
              There is no account and no server. Messages you save are kept only on this device, and
              the app never asks for your name unless you choose to add it. Nothing is sent anywhere
              without you opening the office’s own contact page.
            </Text>
          </View>

          <View style={styles.officialBlock}>
            <Text style={styles.officialBlockTitle}>For elected officials and staff</Text>
            <Text style={styles.officialBlockBody}>
              See how the same messages look when grouped by issue and level of government. The
              demo dashboard only reads messages saved on this device.
            </Text>
            <Button
              label="Open the demo dashboard"
              variant="secondary"
              onPress={() => nav.push('Dashboard')}
              style={styles.officialBtn}
            />
          </View>

          <Pressable
            onPress={() => nav.push('About')}
            accessibilityRole="button"
            accessibilityLabel="About Civic, privacy, and sources"
            style={({ pressed }) => [styles.footerLink, pressed && styles.pressed]}
          >
            <Text style={styles.footerText}>
              Built for the Congressional App Challenge · Virginia’s 10th District
            </Text>
            <Text style={styles.footerLinkText}>About, privacy & sources</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.navy,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  inner: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  wordmark: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordmarkText: {
    fontSize: font.size.lg + 2,
    fontWeight: font.weight.bold,
    color: colors.white,
    letterSpacing: -0.5,
  },
  wordmarkDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.amber,
    marginLeft: 3,
    marginBottom: 9,
  },
  aboutBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  aboutText: {
    fontSize: font.size.sm,
    color: colors.steelLight,
    fontWeight: font.weight.medium,
  },
  pressed: {
    opacity: 0.7,
  },
  eyebrow: {
    fontSize: font.size.xs,
    fontWeight: font.weight.semibold,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.amber,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  headline: {
    fontSize: font.size.xxl,
    fontWeight: font.weight.bold,
    color: colors.white,
    letterSpacing: -0.9,
    lineHeight: font.size.xxl * 1.1,
    marginBottom: spacing.md,
  },
  heroBody: {
    fontSize: font.size.md,
    color: colors.steelLight,
    lineHeight: font.size.md * 1.6,
  },
  ctaBlock: {
    marginTop: spacing.lg,
  },
  secondaryCta: {
    marginTop: spacing.sm,
    backgroundColor: colors.navyLight,
    borderColor: colors.borderDark,
  },
  trustRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
    marginBottom: spacing.xs,
  },
  trustCheck: {
    color: colors.amber,
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
    marginRight: 4,
  },
  trustText: {
    color: colors.steelLight,
    fontSize: font.size.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.navyLight,
    marginVertical: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
    color: colors.white,
    marginBottom: spacing.md,
    letterSpacing: -0.2,
  },
  step: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  stepNumText: {
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
    color: colors.black,
  },
  stepBody: {
    flex: 1,
    paddingTop: 3,
  },
  stepTitle: {
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    color: colors.white,
    marginBottom: 2,
  },
  stepText: {
    fontSize: font.size.sm,
    color: colors.steel,
    lineHeight: font.size.sm * 1.55,
  },
  privacyCard: {
    backgroundColor: colors.navyLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  privacyTitle: {
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.white,
    marginBottom: spacing.xs + 2,
  },
  privacyBody: {
    fontSize: font.size.sm,
    color: colors.steelLight,
    lineHeight: font.size.sm * 1.6,
  },
  officialBlock: {
    backgroundColor: 'transparent',
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginBottom: spacing.lg,
  },
  officialBlockTitle: {
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.white,
    marginBottom: spacing.xs + 2,
  },
  officialBlockBody: {
    fontSize: font.size.sm,
    color: colors.steel,
    lineHeight: font.size.sm * 1.6,
    marginBottom: spacing.sm,
  },
  officialBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    minHeight: 44,
  },
  footerLink: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  footerText: {
    ...text.small,
    fontSize: font.size.xs,
    color: colors.steel,
    textAlign: 'center',
    lineHeight: font.size.xs * 1.7,
  },
  footerLinkText: {
    fontSize: font.size.xs,
    color: colors.steelLight,
    fontWeight: font.weight.semibold,
    marginTop: spacing.xs,
    textDecorationLine: 'underline',
  },
});
