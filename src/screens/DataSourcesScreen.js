import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNav } from '../navigation/Navigator';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ExternalLink from '../components/ExternalLink';
import Notice from '../components/Notice';
import {
  JURISDICTIONS,
  DISTRICT_INFO,
  labelForVA10,
} from '../data/jurisdictions';
import { formatDate } from '../lib/format';
import { colors, spacing, radius, font, text } from '../theme';

const TONE = { full: 'success', partial: 'warning', no: 'neutral' };

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
          <View style={styles.badgeRow}>
            <Badge
              label={labelForVA10(item.inVA10)}
              tone={TONE[item.inVA10] || 'neutral'}
              style={styles.badge}
            />
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

      <Text style={styles.sectionTitle}>District boundaries</Text>
      <Card style={styles.card}>
        <Text style={styles.name}>{DISTRICT_INFO.name}</Text>
        <Text style={styles.body}>
          CivLink’s pilot district is Virginia’s 10th. The current map still applies: Virginia voters
          approved a redistricting amendment in April 2026, the Supreme Court of Virginia struck it
          down in May 2026, and the U.S. Supreme Court declined an emergency appeal. Arlington
          County is in Virginia’s 8th District, and only parts of Fairfax and Prince William counties
          are in VA-10.
        </Text>
        <Text style={styles.meta}>
          Last verified {formatDate(`${DISTRICT_INFO.lastVerified}T12:00:00`)}
        </Text>
        <ExternalLink
          url={DISTRICT_INFO.sourceUrl}
          label="District composition source"
          variant="secondary"
          hint="Opens the source page used for district boundaries"
          style={styles.link}
        />
        <ExternalLink
          url={DISTRICT_INFO.lookupUrl}
          label="Find your representative on house.gov"
          variant="secondary"
          hint="Opens the official House lookup; use an exact street address"
          style={styles.link}
        />
        <Text style={styles.smallNote}>
          Use the House lookup with an exact address before relying on a district label, especially
          in Fairfax or Prince William County.
        </Text>
      </Card>

      <Text style={styles.sectionTitle}>Why there is no live lookup</Text>
      <Text style={styles.body}>
        Google’s Civic Information Representatives API was shut down in April 2025, so CivLink does
        not claim to look up your officials live. Its replacement returns district identifiers
        rather than a list of offices, and would still need a server-side key. CivLink collects no
        address and no location; it uses the area you pick and says when each fact was last checked.
      </Text>

      <Text style={styles.sectionTitle}>Source notes</Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>
          • Locality pages: the official county or city website for each entry above.
        </Text>
        <Text style={styles.listItem}>
          • District composition: the source linked in the District boundaries card.
        </Text>
        <Text style={styles.listItem}>
          • Polls and announcements in the update feed are sample content created for this
          prototype, not statements from any office.
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
