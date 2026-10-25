import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNav } from '../navigation/Navigator';
import { useCivic } from '../context/CivicContext';
import Screen from '../components/Screen';
import Badge from '../components/Badge';
import Notice from '../components/Notice';
import Button from '../components/Button';
import {
  JURISDICTIONS,
  DISTRICT_INFO,
  getJurisdiction,
  labelForVA10,
} from '../data/jurisdictions';
import { colors, spacing, radius, font, text } from '../theme';

const TONE = { full: 'success', partial: 'warning', no: 'neutral' };

export default function JurisdictionScreen() {
  const nav = useNav();
  const { jurisdictionId, selectJurisdiction } = useCivic();
  const selected = getJurisdiction(jurisdictionId) || JURISDICTIONS[0];

  return (
    <Screen
      title="Your area"
      subtitle="CivLink uses an area, not an address."
      onBack={nav.pop}
      footer={
        <View>
          <Button
            label={`Open ${selected.short} local government page`}
            onPress={() => nav.push('LocalGovernment', { jurisdictionId: selected.id })}
          />
          <Button
            label="Where this information comes from"
            variant="secondary"
            onPress={() => nav.push('DataSources')}
            style={styles.footerBtn}
          />
        </View>
      }
    >
      <Text style={styles.intro}>
        Pick the locality where the issue is. CivLink has no address lookup and never asks for your
        street address, so the app cannot work out your district for you. Choosing an area changes
        which updates and polls you see.
      </Text>

      <Notice tone="info" title="One district, several localities">
        {DISTRICT_INFO.pilotNote}
      </Notice>

      {JURISDICTIONS.map((item) => {
        const isSelected = item.id === jurisdictionId;
        return (
          <Pressable
            key={item.id}
            onPress={() => selectJurisdiction(item.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${item.name}. ${labelForVA10(item.inVA10)}`}
            accessibilityHint="Uses this locality for updates, polls, and questions"
            style={({ pressed }) => [
              styles.card,
              isSelected && styles.cardSelected,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.cardTop}>
              <View style={styles.cardNameWrap}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardType}>{item.type === 'county' ? 'County' : 'City'}</Text>
              </View>
            </View>
            <View style={styles.badgeRow}>
              <Badge
                label={labelForVA10(item.inVA10)}
                tone={TONE[item.inVA10] || 'neutral'}
                style={styles.badge}
              />
            </View>
            <Text style={styles.cardNote}>{item.note}</Text>
            <View style={styles.cardBottom}>
              <Text style={[styles.selectText, isSelected && styles.selectTextOn]}>
                {isSelected ? '✓ Selected area' : 'Use this area'}
              </Text>
            </View>
          </Pressable>
        );
      })}

      <Text style={styles.sectionTitle}>Why the boundaries matter</Text>
      <Text style={styles.body}>{DISTRICT_INFO.boundaryNote}</Text>

      <Notice tone="warning" title="Check an exact address elsewhere">
        CivLink cannot tell which part of a split county an address is in. Use the official House
        “Find Your Representative” lookup for an exact address before relying on the district label.
      </Notice>

      <View style={styles.links}>
        <Button
          label="How CivLink communicates"
          variant="secondary"
          onPress={() => nav.push('HowItWorks')}
        />
        <Button
          label="Data sources and dates"
          variant="ghost"
          onPress={() => nav.push('DataSources')}
          style={styles.ghost}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    ...text.body,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardSelected: {
    borderColor: colors.tealDeep,
    borderWidth: 2,
    backgroundColor: colors.tealSoft,
  },
  pressed: {
    opacity: 0.82,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.xs + 2,
  },
  // Long labels such as "Outside VA-10 (VA-8). Supported as an expansion
  // area." need to wrap instead of running off a narrow screen.
  badgeRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  badge: {
    maxWidth: '100%',
  },
  cardNameWrap: {
    flex: 1,
    marginRight: spacing.sm,
  },
  cardName: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    color: colors.ink,
  },
  cardType: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginTop: 2,
  },
  cardNote: {
    ...text.small,
    fontSize: font.size.sm,
  },
  cardBottom: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  selectText: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    fontWeight: font.weight.semibold,
    color: colors.slateText,
  },
  selectTextOn: {
    color: colors.tealDeep,
  },
  sectionTitle: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  body: {
    ...text.small,
    fontSize: font.size.sm + 1,
    color: colors.ink,
    marginBottom: spacing.md,
  },
  links: {
    marginTop: spacing.sm,
  },
  footerBtn: {
    marginTop: spacing.sm,
    minHeight: 44,
  },
  ghost: {
    marginTop: spacing.xs,
    minHeight: 40,
  },
});
