import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Screen from './Screen';
import Badge from './Badge';
import { useCivic } from '../context/CivicContext';
import { useNav } from '../navigation/Navigator';
import { SAMPLE_ORG } from '../data/accounts';
import { colors, spacing, radius, font, text } from '../theme';

// Every Official Portal screen renders inside this wrapper. The banner is not
// dismissible on purpose: nothing in this prototype may look like a message
// from a real office.
export default function PortalScreen({
  title,
  subtitle,
  step,
  onBack,
  children,
  footer,
  headerRight,
  banner = true,
}) {
  const nav = useNav();
  const { account, signOut } = useCivic();
  const orgName = account && account.orgName ? account.orgName : SAMPLE_ORG.name;

  return (
    <Screen
      title={title}
      subtitle={subtitle}
      step={step}
      onBack={onBack}
      footer={footer}
      headerRight={
        headerRight !== undefined ? (
          headerRight
        ) : account ? (
          <Pressable
            onPress={() => {
              signOut();
              nav.reset('Home');
            }}
            accessibilityRole="button"
            accessibilityLabel="Sign out of the Official Portal"
            style={({ pressed }) => [styles.signOut, pressed && styles.pressed]}
          >
            <Text style={styles.signOutText}>Sign out</Text>
          </Pressable>
        ) : null
      }
    >
      {banner ? (
        <View style={styles.banner}>
          <Text style={styles.bannerStrong}>Prototype with sample data.</Text>
          <Text style={styles.bannerText}>
            Not affiliated with any government office. No real officials, offices, or agencies are
            represented here.
          </Text>
        </View>
      ) : null}

      {account ? (
        <View style={styles.orgRow}>
          <View style={styles.orgBody}>
            <Text style={styles.orgName}>{orgName}</Text>
            <Text style={styles.orgMeta}>
              {account.isSample ? 'Sample account · ' : ''}
              {account.email}
            </Text>
          </View>
          {account.verified ? <Badge label="Verified official" tone="success" dot /> : null}
        </View>
      ) : null}

      {children}
    </Screen>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.warningSoft,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    borderRadius: radius.md,
    padding: spacing.md - 4,
    marginBottom: spacing.md,
  },
  bannerStrong: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
    color: colors.warning,
    marginBottom: 2,
  },
  bannerText: {
    ...text.small,
    fontSize: font.size.xs,
    lineHeight: font.size.xs * 1.6,
  },
  orgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md - 2,
    marginBottom: spacing.md,
  },
  orgBody: {
    flex: 1,
    marginRight: spacing.sm,
  },
  orgName: {
    fontFamily: font.family,
    fontSize: font.size.sm + 1,
    fontWeight: font.weight.semibold,
    color: colors.ink,
  },
  orgMeta: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    marginTop: 2,
  },
  signOut: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    borderWidth: 2,
    borderColor: colors.ink,
    borderRadius: radius.pill,
  },
  signOutText: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    fontWeight: font.weight.semibold,
    color: colors.ink,
  },
  pressed: {
    backgroundColor: colors.tealSoft,
  },
});
