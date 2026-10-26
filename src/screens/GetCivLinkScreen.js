import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNav } from '../navigation/Navigator';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import Notice from '../components/Notice';
import QrCode from '../components/QrCode';
import { getWebAppUrl, hasPublicWebUrl } from '../lib/webApp';
import { openUrl } from '../lib/links';
import { colors, spacing, radius, font, text } from '../theme';

const STEPS = [
  {
    id: 'iphone',
    title: 'iPhone and iPad',
    steps: [
      'Open the CivLink link in Safari.',
      'Tap the Share button, then Add to Home Screen.',
      'Open CivLink from the Home Screen. It runs like an app.',
    ],
  },
  {
    id: 'android',
    title: 'Android',
    steps: [
      'Open the CivLink link in Chrome.',
      'Open the browser menu (three dots), then Install app or Add to Home screen.',
      'Open CivLink from your Home Screen or app list.',
    ],
  },
  {
    id: 'desktop',
    title: 'Desktop computer',
    steps: [
      'Open the link in any modern browser.',
      'Use the install icon in the address bar if your browser offers one.',
      'The same screens work without installing anything.',
    ],
  },
];

export default function GetCivLinkScreen() {
  const nav = useNav();
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [openFailed, setOpenFailed] = useState(false);

  const url = getWebAppUrl();
  const publicUrl = hasPublicWebUrl();

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(url);
      setCopied(true);
      setCopyFailed(false);
    } catch (error) {
      setCopied(false);
      setCopyFailed(true);
    }
  };

  const handleOpen = async () => {
    const ok = await openUrl(url);
    setOpenFailed(!ok);
  };

  return (
    <Screen
      title="Get CivLink"
      subtitle="Open it in a browser, add it to a phone’s Home Screen, or share the link."
      onBack={nav.pop}
      footer={
        <View>
          <Button label="How CivLink delivers updates" onPress={() => nav.push('HowItWorks')} />
          <Button
            label="Back to home"
            variant="ghost"
            onPress={() => nav.reset('Home')}
            style={styles.footerGhost}
          />
        </View>
      }
    >
      {publicUrl ? (
        <Card style={styles.heroCard}>
          <QrCode value={url} size={188} />
          <Text style={styles.qrCaption}>
            Scan this code with a phone camera to open CivLink. It points to the public web version.
          </Text>
        </Card>
      ) : (
        <Notice tone="info" title={url ? 'This is a local preview link' : 'No public link configured'}>
          {url
            ? 'A QR code and a shareable link appear when CivLink is running at a public https address. Local preview addresses such as localhost will not open on another phone.'
            : 'The public link appears in the web build. For a phone build, set EXPO_PUBLIC_WEB_APP_URL to the deployed https address before building.'}
        </Notice>
      )}

      {url ? (
        <View style={styles.linkBlock}>
          <Text style={styles.linkLabel}>Web address</Text>
          <Text style={styles.linkValue} selectable accessibilityLabel={`CivLink web address ${url}`}>
            {url}
          </Text>
          <Button
            label={copied ? 'Copied ✓' : 'Copy link'}
            variant="secondary"
            onPress={handleCopy}
            style={styles.copyButton}
          />
          {copyFailed ? (
            <Text style={styles.error} accessibilityLiveRegion="polite">
              Could not copy automatically. Select the address above and copy it manually.
            </Text>
          ) : null}
          <Button
            label="Open the web app"
            onPress={handleOpen}
            accessibilityHint="Opens the CivLink web version in your browser"
            style={styles.openButton}
          />
          {openFailed ? (
            <Text style={styles.error} accessibilityLiveRegion="polite">
              Could not open the link. Open a browser and type the address above instead.
            </Text>
          ) : null}
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>Add it to your phone</Text>
      {STEPS.map((group) => (
        <Card key={group.id} style={styles.stepCard}>
          <Text style={styles.stepTitle}>{group.title}</Text>
          {group.steps.map((step, index) => (
            <View key={step} style={styles.stepRow}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </Card>
      ))}

      <Text style={styles.sectionTitle}>What to expect</Text>
      <View style={styles.honestCard}>
        <Text style={styles.honestLine}>
          <Text style={styles.honestStrong}>Not in an app store. </Text>
          CivLink is a web app, not an App Store or Google Play download. That keeps it available to
          iPhone, Android, and desktop users from one link.
        </Text>
        <Text style={styles.honestLine}>
          <Text style={styles.honestStrong}>Push notifications on the way. </Text>
          The in-app feed is the channel today, and push notifications for updates from your area
          are planned next.
        </Text>
        <Text style={styles.honestLine}>
          <Text style={styles.honestStrong}>Works without installing. </Text>
          Adding CivLink to a Home Screen is a convenience. Every screen also works in a normal
          browser tab.
        </Text>
      </View>

      <Button
        label="See updates from your area"
        variant="secondary"
        onPress={() => nav.push('Feed')}
        style={styles.feedButton}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
  },
  qrCaption: {
    ...text.small,
    textAlign: 'center',
    marginTop: spacing.md,
    maxWidth: 300,
  },
  linkBlock: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  linkLabel: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: colors.slateText,
    fontWeight: font.weight.semibold,
    marginBottom: spacing.xs,
  },
  linkValue: {
    fontFamily: font.family,
    fontSize: font.size.sm + 1,
    color: colors.ink,
    lineHeight: font.size.sm * 1.6,
    marginBottom: spacing.sm,
  },
  copyButton: {
    marginBottom: spacing.sm,
  },
  openButton: {
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  stepCard: {
    marginBottom: spacing.sm,
  },
  stepTitle: {
    fontFamily: font.family,
    fontSize: font.size.sm + 1,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs + 2,
  },
  stepNumber: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
    color: colors.tealDeep,
    width: 20,
  },
  stepText: {
    ...text.small,
    flex: 1,
    color: colors.ink,
  },
  honestCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  honestLine: {
    ...text.small,
    marginBottom: spacing.sm,
  },
  honestStrong: {
    fontFamily: font.family,
    fontWeight: font.weight.bold,
    color: colors.ink,
  },
  error: {
    ...text.small,
    color: colors.danger,
    fontWeight: font.weight.medium,
  },
  feedButton: {
    marginTop: spacing.md,
  },
  footerGhost: {
    marginTop: spacing.xs,
    minHeight: 40,
  },
});
