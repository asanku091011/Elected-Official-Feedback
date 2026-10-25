import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNav } from '../navigation/Navigator';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import Notice from '../components/Notice';
import { colors, spacing, font, text } from '../theme';

function Bullets({ items }) {
  return (
    <View style={styles.bulletList}>
      {items.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export default function ContentPolicyScreen() {
  const nav = useNav();

  return (
    <Screen
      title="Content policy and safety"
      subtitle="The rules CivLink uses for anything an official or a resident posts."
      onBack={nav.pop}
      footer={
        <View>
          <Button label="How CivLink works" onPress={() => nav.push('HowItWorks')} />
          <Button
            label="Notification settings"
            variant="secondary"
            onPress={() => nav.push('NotificationSettings')}
            style={styles.footerButton}
          />
          <Button
            label="Back to updates"
            variant="ghost"
            onPress={() => nav.push('Feed')}
            style={styles.footerGhost}
          />
        </View>
      }
    >
      <Notice tone="info" title="Nonpartisan by design">
        CivLink does not support or oppose candidates, parties, or campaigns. It is a prototype built
        for a student competition, is not connected to any government office, and is not an official
        record of any kind.
      </Notice>

      <Text style={styles.sectionTitle}>Who can post</Text>
      <Text style={styles.body}>
        Only a verified official account can publish a poll or an announcement. In this prototype
        every organization is a sample, and every portal screen carries a banner saying so. Resident
        accounts are not needed at all: residents can read, vote, and ask a question anonymously.
      </Text>
      <Text style={styles.body}>
        Verification would mean a .gov email address plus a human administrator’s approval. The
        request form in the portal only checks the address format — it does not prove who someone is.
      </Text>

      <Text style={styles.sectionTitle}>What is allowed</Text>
      <Card style={styles.card}>
        <Bullets
          items={[
            'Service updates such as collection schedules, road work, closures, and office hours.',
            'Meeting notices, agendas, and ways for residents to take part.',
            'Neutral questions about local services, with balanced answer choices.',
            'Requests for input that make clear what the office can and cannot decide.',
          ]}
        />
      </Card>

      <Text style={styles.sectionTitle}>What is not allowed</Text>
      <Card style={styles.card}>
        <Bullets
          items={[
            'Campaign or partisan content: endorsements, electioneering, or attacks on a party or candidate.',
            'Attacks, harassment, or threats against residents, officials, or staff.',
            'Someone’s personal information, including addresses, phone numbers, or student records.',
            'Advertising, fundraising, or promotions for a business.',
            'Claims presented as facts without a source, or invented statistics.',
            'Anything that pretends to come from an office that has not been verified.',
          ]}
        />
      </Card>

      <Text style={styles.sectionTitle}>How CivLink checks content</Text>
      <Text style={styles.body}>
        These are simple, explainable safeguards, not an automated moderation system:
      </Text>
      <Card style={styles.card}>
        <Bullets
          items={[
            'Every official post shows whether its account is verified, and sample accounts are labeled “Sample”.',
            'Before a poll can be published, the official must complete a four-item neutrality checklist; automatic hints flag campaign wording, exclamation points, and unbalanced options.',
            'Resident questions go through a short word filter and a posting rate limit.',
            'Residents can report content, and the reason is stored with the report.',
            'Publishing, closing, archiving, approving accounts, and replying to questions are written to an audit log with who did it and when.',
          ]}
        />
      </Card>

      <Text style={styles.sectionTitle}>What CivLink does not claim</Text>
      <Card style={styles.card}>
        <Bullets
          items={[
            'It does not use AI to moderate language, and a filter can miss things.',
            'It is not affiliated with, endorsed by, or operated by any government office.',
            'It does not show delivery, open, or read statistics, because it cannot measure them.',
            'It does not deliver messages to an office. Residents send messages themselves through the office’s own contact page.',
          ]}
        />
      </Card>

      <Text style={styles.sectionTitle}>Privacy</Text>
      <Text style={styles.body}>
        Officials see aggregate poll results only. A vote records the poll, the chosen options, and a
        locality — never a name, account, or address. In this prototype everything is stored on this
        device, and no data is sent to a server. A real deployment would need a written retention
        policy and a way for people to delete their data.
      </Text>

      <Text style={styles.sectionTitle}>Reporting a problem</Text>
      <Text style={styles.body}>
        Resident content in the feed can be reported with a reason. Reports are stored on this device
        for the demo; a real service would need a published review process, a named human reviewer,
        and a stated response time. CivLink is not an emergency service: call 911 for an emergency.
      </Text>

      <View style={styles.footerNote}>
        <Text style={styles.footerText}>
          A real rollout would also need published moderation procedures, an appeals path, and
          record-keeping that follows the office’s own rules. This prototype has none of those.
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
  card: {
    backgroundColor: colors.surface,
  },
  bulletList: {
    marginTop: -spacing.xs,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs + 2,
  },
  bullet: {
    fontFamily: font.family,
    color: colors.tealDeep,
    fontSize: font.size.md,
    width: 16,
    lineHeight: font.size.md * 1.5,
  },
  bulletText: {
    ...text.small,
    flex: 1,
    color: colors.ink,
  },
  footerNote: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    lineHeight: font.size.xs * 1.7,
  },
  footerButton: {
    marginTop: spacing.xs,
  },
  footerGhost: {
    marginTop: spacing.xs,
    minHeight: 40,
  },
});
