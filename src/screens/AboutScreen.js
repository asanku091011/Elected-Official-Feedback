import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Screen from '../components/Screen';
import Card from '../components/Card';
import ExternalLink from '../components/ExternalLink';
import Button from '../components/Button';
import { useNav } from '../navigation/Navigator';
import { colors, spacing, radius, font, text } from '../theme';

const SOURCES = [
  {
    name: 'Loudoun County government',
    url: 'https://www.loudoun.gov',
    label: 'loudoun.gov',
    note: 'County services, Board of Supervisors, zoning, and local offices.',
  },
  {
    name: 'Loudoun County Public Schools',
    url: 'https://www.lcps.org',
    label: 'lcps.org',
    note: 'School Board, division policy, and school information.',
  },
  {
    name: 'Virginia Department of Transportation',
    url: 'https://www.vdot.virginia.gov',
    label: 'vdot.virginia.gov',
    note: 'Which roads the state maintains and how to report a road problem.',
  },
  {
    name: 'Virginia General Assembly',
    url: 'https://virginiageneralassembly.gov',
    label: 'virginiageneralassembly.gov',
    note: 'State legislators, bills, and how state law is made.',
  },
  {
    name: 'U.S. House of Representatives',
    url: 'https://www.house.gov/representatives/find-your-representative',
    label: 'house.gov',
    note: 'Find your member of Congress and their official contact form.',
  },
  {
    name: 'U.S. Senate',
    url: 'https://www.senate.gov/senators/index.htm',
    label: 'senate.gov',
    note: 'Virginia’s two senators and their state offices.',
  },
];

export default function AboutScreen() {
  const nav = useNav();

  return (
    <Screen
      title="About CivLink"
      subtitle="What it does, what it stores, and where the information comes from."
      onBack={nav.pop}
      footer={<Button label="Back to home" variant="secondary" onPress={() => nav.reset('Home')} />}
    >
      <Text style={styles.sectionTitle}>What this app is for</Text>
      <Text style={styles.body}>
        CivLink helps a resident of Northern Virginia figure out which office of government actually
        handles their problem, then write a clear message and send it through that office’s own
        contact page. It covers local, state, federal, and regional government.
      </Text>
      <Text style={styles.body}>
        The idea is simple: a message sent to the wrong office gets filed away. A message sent to the
        right office, with a specific place and a specific ask, has a chance to change something.
      </Text>

      <Text style={styles.sectionTitle}>How the routing works</Text>
      <Text style={styles.body}>
        Each topic is matched to the office with the legal authority to act on it, and the app says
        plainly what that office cannot do. The explanations were written from the official
        descriptions published by those offices. They are general guidance, not legal advice, and an
        individual address may belong to a town, an HOA, or a special district instead.
      </Text>

      <View style={styles.sourceList}>
        {SOURCES.map((source) => (
          <Card key={source.url} style={styles.sourceCard}>
            <Text style={styles.sourceName}>{source.name}</Text>
            <Text style={styles.sourceNote}>{source.note}</Text>
            <ExternalLink
              url={source.url}
              label={`Open ${source.label}`}
              variant="secondary"
              hint={`Opens ${source.label} in your browser`}
              style={styles.sourceLink}
            />
          </Card>
        ))}
      </View>
      <Text style={styles.body}>
        Every office linked in the app can be found on the “Who does what” screen.
      </Text>

      <Text style={styles.sectionTitle}>Privacy</Text>
      <View style={styles.privacyCard}>
        <Text style={styles.privacyLine}>
          <Text style={styles.privacyStrong}>Stored on this device: </Text>
          the topic you picked, the message you wrote, and a reference number with a timestamp. Your
          ZIP code and name are stored only if you choose to add them.
        </Text>
        <Text style={styles.privacyLine}>
          <Text style={styles.privacyStrong}>Never collected: </Text>
          your address, your contacts, your location, or any analytics about how you use the app.
        </Text>
        <Text style={styles.privacyLine}>
          <Text style={styles.privacyStrong}>Never sent: </Text>
          nothing leaves the app. There is no server and no account, and the only network access
          happens when you tap a link to an official website.
        </Text>
        <Text style={styles.privacyLine}>
          <Text style={styles.privacyStrong}>Delete it anytime: </Text>
          remove a single message after saving it, or clear everything from the dashboard.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Accessibility</Text>
      <Text style={styles.body}>
        Text sizes stay readable at system settings, every control has a screen reader label, buttons
        meet the minimum touch target size, and color choices keep text contrast high. The layout
        works on small phones and on a wide browser window.
      </Text>

      <Text style={styles.sectionTitle}>How this was built</Text>
      <Text style={styles.body}>
        Built with React Native and Expo. It works on iOS, Android, and the web from the same code.
        App storage uses AsyncStorage and copying uses expo-clipboard, both open source.
      </Text>

      <Text style={styles.sectionTitle}>AI disclosure</Text>
      <Text style={styles.body}>
        An AI coding assistant helped write and review this code at the student’s direction. The
        student chose the problem, the features, and the design, tested the app, and can explain how
        each screen works. A dated log of the AI-assisted work is kept in AI_USAGE.md in the source
        code.
      </Text>

      <Text style={styles.sectionTitle}>Credits</Text>
      <Text style={styles.body}>
        The CivLink logo and app icons are used exactly as supplied in assets/branding. Open source
        libraries: React, React Native, Expo, AsyncStorage, and expo-clipboard. No third-party images
        or copyrighted assets are included.
      </Text>

      <View style={styles.footerBlock}>
        <Text style={styles.footerTitle}>CivLink · version 1.0</Text>
        <Text style={styles.footerText}>
          A student project for the 2026 Congressional App Challenge in Virginia’s 10th District.
          This app is nonpartisan and does not endorse any candidate or party.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  body: {
    ...text.body,
    marginBottom: spacing.sm,
  },
  sourceList: {
    marginTop: spacing.xs,
  },
  sourceCard: {
    marginBottom: spacing.sm,
  },
  sourceName: {
    fontFamily: font.family,
    fontSize: font.size.sm + 1,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginBottom: 2,
  },
  sourceNote: {
    ...text.small,
    fontSize: font.size.sm,
    marginBottom: spacing.sm,
  },
  sourceLink: {
    alignSelf: 'flex-start',
  },
  privacyCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  privacyLine: {
    ...text.small,
    marginBottom: spacing.sm,
  },
  privacyStrong: {
    fontFamily: font.family,
    fontWeight: font.weight.bold,
    color: colors.ink,
  },
  footerBlock: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  footerTitle: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  footerText: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    textAlign: 'center',
    lineHeight: font.size.xs * 1.7,
  },
});
