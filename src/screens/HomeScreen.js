import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNav } from '../navigation/Navigator';
import Button from '../components/Button';
import Logo, { LogoMark } from '../components/Logo';
import Badge from '../components/Badge';
import { useCivic } from '../context/CivicContext';
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
    body: 'CivLink explains which office has the power to act, and what that office cannot do.',
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
  const { jurisdiction, unreadCount } = useCivic();
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
            <View style={styles.headerLeft}>
              <LogoMark size={30} />
              <Text style={styles.wordmark}>CivLink</Text>
            </View>
            <Pressable
              onPress={() => nav.push('About')}
              accessibilityRole="button"
              accessibilityLabel="About CivLink"
              hitSlop={12}
              style={({ pressed }) => [styles.aboutBtn, pressed && styles.pressed]}
            >
              <Text style={styles.aboutText}>About</Text>
            </Pressable>
          </View>

          <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }] }}>
            <View style={styles.hero}>
              <Logo width={200} style={styles.heroLogo} />
              <Text style={styles.eyebrow}>civic help</Text>
              <Text style={styles.headline} accessibilityRole="header">
                Your message, in the right inbox.
              </Text>
              <Text style={styles.heroBody}>
                Most people send a concern to an office that cannot act on it. CivLink finds the
                office that can, explains why, and helps you write something a staffer will actually
                read.
              </Text>

              <View style={styles.ctaBlock}>
                <Button
                  label="Find where my issue goes"
                  onPress={() => nav.push('Topic')}
                  accessibilityHint="Opens the list of issue topics"
                />
                <Button
                  label={
                    unreadCount > 0
                      ? `Updates from your area (${unreadCount} new)`
                      : 'Updates from your area'
                  }
                  variant="secondary"
                  onPress={() => nav.push('Feed')}
                  style={styles.secondaryCta}
                  accessibilityHint="Opens the announcement and poll feed for your area"
                />
                <Button
                  label="Browse offices of government"
                  variant="ghost"
                  onPress={() => nav.push('Offices')}
                  style={styles.tertiaryCta}
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
            </View>
          </Animated.View>
        </View>

        <View style={styles.divider} />

        <View style={[styles.inner, styles.section]}>
          <Text style={styles.sectionTitle}>How it works</Text>
          <View style={styles.stepsCard}>
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
        </View>

        <View style={[styles.inner, styles.section]}>
          <Text style={styles.sectionTitle}>Your area</Text>
          <View style={styles.areaCard}>
            <View style={styles.areaBody}>
              <Text style={styles.areaName}>{jurisdiction.name}</Text>
              <Badge
                label={jurisdiction.type === 'county' ? 'County' : 'City'}
                tone="neutral"
                style={styles.areaBadge}
              />
              <Text style={styles.areaNote}>
                CivLink stores an area, not an address. Updates and polls only appear for the area you
                pick.
              </Text>
            </View>
            <Button
              label="Change area"
              variant="secondary"
              full={false}
              onPress={() => nav.push('Jurisdiction')}
              style={styles.areaBtn}
            />
          </View>
          <View style={styles.linkRow}>
            <Pressable
              onPress={() => nav.push('LocalGovernment', { jurisdictionId: jurisdiction.id })}
              accessibilityRole="button"
              accessibilityLabel={`Open ${jurisdiction.name} local government links`}
              style={({ pressed }) => [styles.linkChip, pressed && styles.pressed]}
            >
              <Text style={styles.linkChipText}>Local government links</Text>
            </Pressable>
            <Pressable
              onPress={() => nav.push('HowItWorks')}
              accessibilityRole="button"
              accessibilityLabel="How CivLink communicates"
              style={({ pressed }) => [styles.linkChip, pressed && styles.pressed]}
            >
              <Text style={styles.linkChipText}>How updates travel</Text>
            </Pressable>
            <Pressable
              onPress={() => nav.push('DataSources')}
              accessibilityRole="button"
              accessibilityLabel="Data sources and dates"
              style={({ pressed }) => [styles.linkChip, pressed && styles.pressed]}
            >
              <Text style={styles.linkChipText}>Data sources</Text>
            </Pressable>
          </View>
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
              The CivLink Official Portal is the office side: write a neutral poll or announcement,
              publish it to the in-app feed, and see aggregate results and resident questions.
            </Text>
            <Button
              label="Open the Official Portal"
              onPress={() => nav.push('PortalSignIn')}
              style={styles.officialBtn}
            />
            <Button
              label="See the feedback dashboard"
              variant="secondary"
              onPress={() => nav.push('Dashboard')}
              style={styles.officialBtnSecondary}
            />
          </View>

          <Pressable
            onPress={() => nav.push('GetCivLink')}
            accessibilityRole="button"
            accessibilityLabel="Get CivLink on your phone or computer"
            style={({ pressed }) => [styles.getCard, pressed && styles.pressed]}
          >
            <Text style={styles.getTitle}>Get CivLink on your phone</Text>
            <Text style={styles.getBody}>
              Open the web app, scan the QR code, or add it to your Home Screen. No app store needed.
            </Text>
            <Text style={styles.footerLinkText}>Open the “Get CivLink” page</Text>
          </Pressable>

          <Pressable
            onPress={() => nav.push('About')}
            accessibilityRole="button"
            accessibilityLabel="About CivLink, privacy, and sources"
            style={({ pressed }) => [styles.footerLink, pressed && styles.pressed]}
          >
            <Text style={styles.footerText}>
              Built for residents across Northern Virginia
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
    backgroundColor: colors.white,
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordmark: {
    fontFamily: font.family,
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
    color: colors.ink,
    letterSpacing: -0.4,
    marginLeft: spacing.sm,
  },
  aboutBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.ink,
  },
  aboutText: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    color: colors.ink,
    fontWeight: font.weight.semibold,
  },
  pressed: {
    backgroundColor: colors.tealSoft,
  },
  hero: {
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  // Clear space around the logo stays about 10% of its width.
  heroLogo: {
    marginBottom: spacing.lg,
  },
  eyebrow: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    fontWeight: font.weight.semibold,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.tealDeep,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  headline: {
    fontFamily: font.family,
    fontSize: font.size.xxl,
    fontWeight: font.weight.bold,
    color: colors.ink,
    letterSpacing: -0.9,
    lineHeight: font.size.xxl * 1.1,
    marginBottom: spacing.md,
    textAlign: 'center',
    maxWidth: 520,
  },
  heroBody: {
    fontFamily: font.family,
    fontSize: font.size.md,
    color: colors.slateText,
    lineHeight: font.size.md * 1.6,
    textAlign: 'center',
    maxWidth: 540,
  },
  ctaBlock: {
    alignSelf: 'center',
    marginTop: spacing.lg,
    maxWidth: 420,
    width: '100%',
  },
  secondaryCta: {
    marginTop: spacing.sm,
  },
  tertiaryCta: {
    marginTop: spacing.xs,
    minHeight: 40,
  },
  areaCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  areaBody: {
    marginBottom: spacing.sm,
  },
  areaName: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  areaBadge: {
    maxWidth: '100%',
  },
  areaNote: {
    ...text.small,
    marginTop: spacing.xs,
  },
  areaBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    minHeight: 44,
  },
  linkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  linkChip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  linkChipText: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.tealDeep,
  },
  trustRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.sm,
    marginBottom: spacing.xs,
  },
  trustCheck: {
    color: colors.tealDeep,
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
    marginRight: 4,
  },
  trustText: {
    fontFamily: font.family,
    color: colors.slateText,
    fontSize: font.size.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: font.family,
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginBottom: spacing.md,
    letterSpacing: -0.2,
  },
  stepsCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  step: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.teal,
    borderWidth: 2,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  stepNumText: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
    color: colors.ink,
  },
  stepBody: {
    flex: 1,
    paddingTop: 3,
  },
  stepTitle: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginBottom: 2,
  },
  stepText: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    color: colors.slateText,
    lineHeight: font.size.sm * 1.55,
  },
  privacyCard: {
    backgroundColor: colors.tealSoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.tealBorder,
  },
  privacyTitle: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginBottom: spacing.xs + 2,
  },
  privacyBody: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    color: colors.slateText,
    lineHeight: font.size.sm * 1.6,
  },
  officialBlock: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.ink,
    marginBottom: spacing.lg,
  },
  officialBlockTitle: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginBottom: spacing.xs + 2,
  },
  officialBlockBody: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    color: colors.slateText,
    lineHeight: font.size.sm * 1.6,
    marginBottom: spacing.sm,
  },
  officialBtn: {
    alignSelf: 'stretch',
    paddingHorizontal: spacing.lg,
    minHeight: 44,
  },
  officialBtnSecondary: {
    marginTop: spacing.sm,
    minHeight: 44,
  },
  getCard: {
    backgroundColor: colors.tealSoft,
    borderWidth: 1,
    borderColor: colors.tealBorder,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  getTitle: {
    fontFamily: font.family,
    fontSize: font.size.sm + 1,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginBottom: 3,
  },
  getBody: {
    ...text.small,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  footerLink: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  footerText: {
    ...text.small,
    fontSize: font.size.xs,
    color: colors.slateText,
    textAlign: 'center',
    lineHeight: font.size.xs * 1.7,
  },
  footerLinkText: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.tealDeep,
    fontWeight: font.weight.semibold,
    marginTop: spacing.xs,
    textDecorationLine: 'underline',
  },
});
