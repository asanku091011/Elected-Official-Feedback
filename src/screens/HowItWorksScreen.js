import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNav } from '../navigation/Navigator';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Notice from '../components/Notice';
import { colors, spacing, radius, font, text } from '../theme';

const STEPS = [
  {
    number: '1',
    title: 'An official writes it',
    body: 'An official signed in to the Official Portal writes an announcement or a poll and picks the areas that should receive it.',
  },
  {
    number: '2',
    title: 'CivLink checks it',
    body: 'Before a poll is published, the neutrality checklist must be completed, and only a verified official account can publish. Announcements are checked for a title, detail, and audience.',
  },
  {
    number: '3',
    title: 'Residents receive it',
    body: 'The post appears in the in-app feed for residents in the chosen localities. The notification settings control what appears there.',
  },
  {
    number: '4',
    title: 'Residents read, vote, reply',
    body: 'Residents read announcements, answer polls, or send a question. Officials see aggregated poll results and the questions inbox — never who voted for what.',
  },
];

const CHANNELS = [
  {
    id: 'in-app',
    title: 'In-app feed',
    status: 'Active',
    tone: 'success',
    body: 'Updates appear for the selected area, with an unread count. Notification settings control what appears there.',
  },
  {
    id: 'push',
    title: 'Push notifications',
    status: 'Coming',
    tone: 'warning',
    body: 'Planned for the next release, on iPhone with iOS 16.4 or later and on Android.',
  },
  {
    id: 'email',
    title: 'Email digest',
    status: 'Coming',
    tone: 'warning',
    body: 'Planned alongside account creation, so updates can reach one inbox a week.',
  },
];

export default function HowItWorksScreen() {
  const nav = useNav();

  return (
    <Screen
      title="How CivLink communicates"
      subtitle="From an official’s draft to a resident’s response."
      onBack={nav.pop}
      footer={
        <View>
          <Button label="Open the update feed" onPress={() => nav.push('Feed')} />
          <Button
            label="Notification settings"
            variant="secondary"
            onPress={() => nav.push('NotificationSettings')}
            style={styles.footerBtn}
          />
        </View>
      }
    >
      <Notice tone="info" title="How updates reach residents">
        The feed, polls, announcements, and replies appear for the localities the publishing office
        chooses. Notification settings control what shows up for you.
      </Notice>

      {STEPS.map((step, index) => (
        <View key={step.number}>
          <Card style={styles.stepCard}>
            <View style={styles.stepTop}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{step.number}</Text>
              </View>
              <Text style={styles.stepTitle}>{step.title}</Text>
            </View>
            <Text style={styles.stepBody}>{step.body}</Text>
          </Card>
          {index < STEPS.length - 1 ? (
            <Text style={styles.arrow} accessibilityElementsHidden importantForAccessibility="no">
              ↓
            </Text>
          ) : null}
        </View>
      ))}

      <Text style={styles.sectionTitle}>Channels</Text>
      {CHANNELS.map((channel) => (
        <View key={channel.id} style={styles.channel}>
          <View style={styles.channelTop}>
            <Text style={styles.channelTitle}>{channel.title}</Text>
            <Badge label={channel.status} tone={channel.tone} />
          </View>
          <Text style={styles.channelBody}>{channel.body}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>What works today</Text>
      <View style={styles.facts}>
        <Text style={styles.fact}>
          ✓ Publishing, scheduling, audience selection, poll voting, and replies all work on this
          device and survive a reload.
        </Text>
        <Text style={styles.fact}>
          ✓ The neutrality checklist blocks publishing until every item is checked.
        </Text>
        <Text style={styles.fact}>
          ✓ One response per poll on this device, and a recorded response cannot be edited.
        </Text>
        <Text style={styles.fact}>
          ✓ Poll results are shown once a poll has enough responses to summarize.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Privacy</Text>
      <Text style={styles.body}>
        A poll response stores the poll, the chosen options, and the locality. It stores no name,
        account, or address. Officials see aggregated totals and turnout by locality, never who
        voted for what. Resident questions carry only the area and the text the resident wrote.
      </Text>

      <View style={styles.buttons}>
        <Button
          label="Content and neutrality policy"
          variant="secondary"
          onPress={() => nav.push('ContentPolicy')}
        />
        <Button
          label="Open the Official Portal"
          variant="ghost"
          onPress={() => nav.push('PortalSignIn')}
          style={styles.ghost}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stepCard: {
    padding: spacing.md,
  },
  stepTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm - 2,
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
    marginRight: spacing.sm,
  },
  stepNumText: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
    color: colors.ink,
  },
  stepTitle: {
    flex: 1,
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
  },
  stepBody: {
    ...text.small,
    fontSize: font.size.sm + 1,
    color: colors.ink,
  },
  arrow: {
    textAlign: 'center',
    fontSize: font.size.lg,
    color: colors.slate,
    marginVertical: spacing.xs,
  },
  sectionTitle: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  channel: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md - 2,
    marginBottom: spacing.sm,
  },
  channelTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  channelTitle: {
    flex: 1,
    fontFamily: font.family,
    fontSize: font.size.sm + 1,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginRight: spacing.sm,
  },
  channelBody: {
    ...text.small,
    fontSize: font.size.sm,
  },
  facts: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  fact: {
    ...text.small,
    fontSize: font.size.sm,
    color: colors.ink,
    marginBottom: spacing.sm - 2,
    lineHeight: font.size.sm * 1.55,
  },
  body: {
    ...text.body,
    fontSize: font.size.sm + 1,
  },
  buttons: {
    marginTop: spacing.md,
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
