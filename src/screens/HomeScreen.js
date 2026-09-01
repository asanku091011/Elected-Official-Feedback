import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { colors, spacing, radius, font } from '../theme';

const { width } = Dimensions.get('window');

const FEATURES = [
  { icon: '🔒', label: 'Anonymous by default' },
  { icon: '📍', label: 'Finds your officials automatically' },
  { icon: '📊', label: 'Tracks issue trends' },
  { icon: '🗳️', label: 'Official micro-polls' },
  { icon: '🛡️', label: 'Moderated & safe' },
  { icon: '🔀', label: 'Routes to the right office' },
];

export default function HomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.navy} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header / Nav */}
        <View style={styles.header}>
          <View style={styles.wordmark}>
            <Text style={styles.wordmarkText}>Civic</Text>
            <View style={styles.wordmarkDot} />
          </View>
          <TouchableOpacity style={styles.signInBtn}>
            <Text style={styles.signInText}>Sign in</Text>
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <Animated.View
          style={[
            styles.hero,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.heroLabel}>Your voice. Their inbox.</Text>
          <Text style={styles.heroHeadline}>
            Direct feedback to every elected official who represents you.
          </Text>
          <Text style={styles.heroSub}>
            From your school board to the U.S. Senate — anonymously, safely, and routed to the right office automatically.
          </Text>
        </Animated.View>

        {/* CTAs */}
        <View style={styles.ctaRow}>
          <TouchableOpacity
            style={styles.ctaPrimary}
            activeOpacity={0.85}
            onPress={() => navigation?.navigate('ConstituentFlow')}
          >
            <Text style={styles.ctaPrimaryText}>I'm a constituent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ctaSecondary}
            activeOpacity={0.85}
            onPress={() => navigation?.navigate('OfficialFlow')}
          >
            <Text style={styles.ctaSecondaryText}>I'm an official</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Built for real civic engagement</Text>
          <View style={styles.featureGrid}>
            {FEATURES.map((f, i) => (
              <View key={i} style={styles.featurePill}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
                <Text style={styles.featureLabel}>{f.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* How it works — constituent side */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How it works</Text>

          <Step
            number="1"
            title="Enter your address"
            body="We map your location to every level of government — federal, state, county, and local."
          />
          <Step
            number="2"
            title="Pick your issue"
            body="Choose a category or describe your concern. Civic finds the right official and office."
          />
          <Step
            number="3"
            title="Send feedback anonymously"
            body="Your identity stays private. Officials see aggregated trends, not personal data."
          />
        </View>

        {/* Officials CTA block */}
        <View style={styles.officialBlock}>
          <Text style={styles.officialBlockTitle}>For elected officials</Text>
          <Text style={styles.officialBlockBody}>
            See what your constituents actually care about. Send targeted micro-polls. Spot emerging issues before they become crises.
          </Text>
          <TouchableOpacity style={styles.officialBlockBtn} activeOpacity={0.85}>
            <Text style={styles.officialBlockBtnText}>Request official access</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Built for the Congressional App Challenge · Virginia's 10th District
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Step({ number, title, body }) {
  return (
    <View style={styles.step}>
      <View style={styles.stepNumCol}>
        <View style={styles.stepNum}>
          <Text style={styles.stepNumText}>{number}</Text>
        </View>
        <View style={styles.stepLine} />
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepBody}>{body}</Text>
      </View>
    </View>
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
    paddingBottom: spacing.xxl,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  wordmark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  wordmarkText: {
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
    color: colors.white,
    letterSpacing: -0.5,
  },
  wordmarkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.amber,
    marginBottom: 8,
  },
  signInBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.navyLight,
  },
  signInText: {
    fontSize: font.size.sm,
    color: colors.steelLight,
    fontWeight: font.weight.medium,
  },

  // Hero
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  heroLabel: {
    fontSize: font.size.sm,
    color: colors.amber,
    fontWeight: font.weight.semibold,
    marginBottom: spacing.sm,
    letterSpacing: 0.2,
  },
  heroHeadline: {
    fontSize: font.size.xxl,
    fontWeight: font.weight.bold,
    color: colors.white,
    lineHeight: font.size.xxl * 1.15,
    letterSpacing: -0.8,
    marginBottom: spacing.md,
  },
  heroSub: {
    fontSize: font.size.md,
    color: colors.steelLight,
    lineHeight: font.size.md * 1.6,
  },

  // CTAs
  ctaRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  ctaPrimary: {
    flex: 1,
    backgroundColor: colors.amber,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  ctaPrimaryText: {
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    color: colors.black,
  },
  ctaSecondary: {
    flex: 1,
    backgroundColor: colors.navyLight,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.steel,
  },
  ctaSecondaryText: {
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    color: colors.white,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.navyLight,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },

  // Sections
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
    color: colors.white,
    marginBottom: spacing.md,
    letterSpacing: -0.3,
  },

  // Feature pills
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.navyLight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(107,122,153,0.3)',
  },
  featureIcon: {
    fontSize: 14,
  },
  featureLabel: {
    fontSize: font.size.sm,
    color: colors.steelLight,
    fontWeight: font.weight.medium,
  },

  // Steps
  step: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  stepNumCol: {
    alignItems: 'center',
    width: 28,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
    color: colors.black,
  },
  stepLine: {
    flex: 1,
    width: 1,
    backgroundColor: colors.navyLight,
    marginTop: spacing.xs,
  },
  stepContent: {
    flex: 1,
    paddingBottom: spacing.md,
  },
  stepTitle: {
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  stepBody: {
    fontSize: font.size.sm,
    color: colors.steel,
    lineHeight: font.size.sm * 1.6,
  },

  // Officials block
  officialBlock: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.navyLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(107,122,153,0.25)',
    marginBottom: spacing.xl,
  },
  officialBlockTitle: {
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  officialBlockBody: {
    fontSize: font.size.sm,
    color: colors.steelLight,
    lineHeight: font.size.sm * 1.6,
    marginBottom: spacing.md,
  },
  officialBlockBtn: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.amber,
    alignSelf: 'flex-start',
  },
  officialBlockBtnText: {
    fontSize: font.size.sm,
    color: colors.amber,
    fontWeight: font.weight.semibold,
  },

  // Footer
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    alignItems: 'center',
  },
  footerText: {
    fontSize: font.size.xs,
    color: colors.steel,
    textAlign: 'center',
    lineHeight: font.size.xs * 1.6,
  },
});
