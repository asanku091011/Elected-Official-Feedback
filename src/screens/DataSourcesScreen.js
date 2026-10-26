import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNav } from '../navigation/Navigator';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import ExternalLink from '../components/ExternalLink';
import Notice from '../components/Notice';
import {
  JURISDICTIONS,
  FEDERAL_INFO,
} from '../data/jurisdictions';
import { formatDate } from '../lib/format';
import { colors, spacing, radius, font, text } from '../theme';

export default function DataSourcesScreen() {
  const nav = useNav();

  return (
    <Screen
      title="Data sources"
      subtitle="Where every fact and link comes from."
      onBack={nav.pop}
      footer={
        <Button
          label="Back to your area"
          variant="secondary"
          onPress={() => nav.push('Jurisdiction')}
        />
      }
    >
      <Notice tone="info" title="Curated, checked by hand">
        CivLink ships static locality data with a last-verified date instead of calling a live API.
        Every official link was checked against that locality’s own website on the date shown. If a
        page moves, the official site’s home page is the fallback.
      </Notice>

      <Text style={styles.sectionTitle}>Localities</Text>
      {JURISDICTIONS.map((item) => (
        <Card key={item.id} style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.name}>{item.name}</Text>
          </View>
          <Text style={styles.meta}>
            {item.type === 'county' ? 'County' : 'City'} · last verified{' '}
            {formatDate(`${item.lastVerified}T12:00:00`)}
          </Text>
          <ExternalLink
            url={item.officialSiteUrl}
            label="Official website"
            variant="secondary"
            hint={`Opens the official ${item.name} website`}
            style={styles.link}
          />
          <ExternalLink
            url={item.sourceUrl}
            label="Source page checked"
            variant="ghost"
            hint="Opens the official page CivLink verified"
            style={styles.ghostLink}
          />
          <Button
            label="Local government links"
            variant="ghost"
            onPress={() => nav.push('LocalGovernment', { jurisdictionId: item.id })}
            style={styles.ghostLink}
          />
        </Card>
      ))}

      <Text style={styles.sectionTitle}>Federal and state representatives</Text>
      <Card style={styles.card}>
        <Text style={styles.name}>{FEDERAL_INFO.name}</Text>
        <Text style={styles.body}>
          Because some localities span more than one state and federal district, CivLink always uses
          the locality you pick instead of guessing a district from an address. To find your exact
          representative, use the official lookups below with your street address.
        </Text>
        <ExternalLink
          url={FEDERAL_INFO.lookupUrl}
          label="Find your representative on house.gov"
          variant="secondary"
          hint="Opens the official House lookup; use an exact street address"
          style={styles.link}
        />
        <Text style={styles.smallNote}>
          State and federal district boundaries are set by law and change only through redistricting.
        </Text>
      </Card>

      <Text style={styles.sectionTitle}>Locality data</Text>
      <Text style={styles.body}>
        CivLink ships locally stored locality data with a last-verified date. Every official link was
        checked against that locality’s own website on the date shown. CivLink collects no address
        and no location; it uses the area you pick.
      </Text>

      <Text style={styles.sectionTitle}>Source notes</Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>
          • Locality pages: the official county or city website for each entry above.
        </Text>
        <Text style={styles.listItem}>
          • Announcements and polls in the update feed come from the CivLink communications office
          for the chosen localities.
        </Text>
        <Text style={styles.listItem}>
          • Office routing explanations in the message tool were written from the published
          responsibilities of each office, linked on each office card.
        </Text>
      </View>

      <Button
        label="How CivLink communicates"
        variant="secondary"
        onPress={() => nav.push('HowItWorks')}
        style={styles.bottomBtn}
      />
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
  card: {
    marginBottom: spacing.sm,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  badge: {
    maxWidth: '100%',
  },
  name: {
    flex: 1,
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginRight: spacing.sm,
  },
  meta: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  body: {
    ...text.small,
    fontSize: font.size.sm + 1,
    color: colors.ink,
    marginTop: spacing.xs,
  },
  smallNote: {
    ...text.small,
    fontSize: font.size.xs,
    marginTop: spacing.sm,
    lineHeight: font.size.xs * 1.6,
  },
  link: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  ghostLink: {
    marginTop: spacing.xs,
    minHeight: 36,
    alignSelf: 'flex-start',
  },
  list: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  listItem: {
    ...text.small,
    fontSize: font.size.sm,
    marginBottom: spacing.sm - 2,
  },
  bottomBtn: {
    marginTop: spacing.md,
  },
});
