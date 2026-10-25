import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useNav } from '../navigation/Navigator';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import ExternalLink from '../components/ExternalLink';
import EmptyState from '../components/EmptyState';
import Notice from '../components/Notice';
import { getJurisdiction, labelForVA10 } from '../data/jurisdictions';
import { formatDate } from '../lib/format';
import { colors, spacing, font, text } from '../theme';

const KIND_LABELS = {
  board: 'Governing board',
  meetings: 'Meetings and agendas',
  calendar: 'Meeting calendar',
  comment: 'Public comment',
  contact: 'Contact',
};

const TONE = { full: 'success', partial: 'warning', no: 'neutral' };

export default function LocalGovernmentScreen({ jurisdictionId }) {
  const nav = useNav();
  const locality = getJurisdiction(jurisdictionId);

  if (!locality) {
    return (
      <Screen title="Local government" onBack={nav.pop}>
        <EmptyState
          icon="🗺️"
          title="That area is not available"
          body="Pick a locality first, then CivLink can show its official pages."
          actionLabel="Choose your area"
          onAction={() => nav.push('Jurisdiction')}
        />
      </Screen>
    );
  }

  return (
    <Screen
      title={locality.name}
      subtitle="Local government links"
      onBack={nav.pop}
      footer={
        <Button
          label="Choose a different area"
          variant="secondary"
          onPress={() => nav.push('Jurisdiction')}
        />
      }
    >
      <Badge
        label={labelForVA10(locality.inVA10)}
        tone={TONE[locality.inVA10] || 'neutral'}
        style={styles.badge}
      />
      <Text style={styles.note}>{locality.note}</Text>

      <Text style={styles.sectionTitle}>Official pages</Text>
      {locality.links.map((link) => (
        <Card key={`${link.kind}-${link.url}`} style={styles.card}>
          <Text style={styles.kind}>{KIND_LABELS[link.kind] || 'Official page'}</Text>
          <Text style={styles.linkLabel}>{link.label}</Text>
          <Text style={styles.linkNote}>{link.note}</Text>
          <ExternalLink
            url={link.url}
            label="Open official page"
            variant="secondary"
            hint={`Opens the official ${locality.name} website in your browser`}
            style={styles.external}
          />
        </Card>
      ))}

      <Text style={styles.sectionTitle}>Where this came from</Text>
      <Card style={styles.sourceCard}>
        <Text style={styles.sourceNote}>
          Every link above points at the locality’s own official website and was checked on the
          date below.
        </Text>
        <ExternalLink
          url={locality.sourceUrl}
          label="Official source checked"
          variant="secondary"
          hint="Opens the official page CivLink checked"
        />
        <Text style={styles.verified}>
          Last verified: {formatDate(`${locality.lastVerified}T12:00:00`)}
        </Text>
      </Card>

      <Notice tone="info" title="Link out, then read the details there">
        CivLink opens official pages instead of copying them. Meeting times, comment rules, and
        contact addresses can change, and the official site is always the authority. This app does
        not name sitting elected officials, because names and contact details change often.
      </Notice>

      <Button
        label="Data sources and dates"
        variant="ghost"
        onPress={() => nav.push('DataSources')}
        style={styles.ghost}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  badge: {
    maxWidth: '100%',
  },
  note: {
    ...text.body,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
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
  kind: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: font.weight.semibold,
    color: colors.tealDeep,
    marginBottom: 3,
  },
  linkLabel: {
    fontFamily: font.family,
    fontSize: font.size.sm + 1,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginBottom: 3,
  },
  linkNote: {
    ...text.small,
    fontSize: font.size.sm,
    marginBottom: spacing.sm,
  },
  external: {
    alignSelf: 'flex-start',
  },
  sourceCard: {
    padding: spacing.md,
  },
  sourceNote: {
    ...text.small,
    marginBottom: spacing.sm,
  },
  verified: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    marginTop: spacing.sm,
  },
  ghost: {
    marginTop: spacing.sm,
    minHeight: 40,
  },
});
