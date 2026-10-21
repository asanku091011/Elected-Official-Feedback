import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNav } from '../navigation/Navigator';
import { useApp } from '../context/AppContext';
import Screen from '../components/Screen';
import Card from '../components/Card';
import LevelBadge from '../components/LevelBadge';
import Button from '../components/Button';
import Notice from '../components/Notice';
import ExternalLink from '../components/ExternalLink';
import EmptyState from '../components/EmptyState';
import { getTopic } from '../data/topics';
import { getOffice } from '../data/offices';
import { colors, spacing, radius, font, text } from '../theme';

export default function RouteScreen({ topicId }) {
  const nav = useNav();
  const { startDraft } = useApp();
  const topic = getTopic(topicId);

  if (!topic) {
    return (
      <Screen title="Pick an issue first" onBack={nav.pop}>
        <EmptyState
          icon="🗂️"
          title="That issue is not available"
          body="Choose a topic and CivLink will show the office that handles it."
          actionLabel="Choose an issue"
          onAction={() => nav.replace('Topic')}
        />
      </Screen>
    );
  }

  const office = getOffice(topic.officeId);
  const alsoOffices = topic.also.map(getOffice).filter(Boolean);

  const handleWrite = () => {
    startDraft(topic.id);
    nav.push('Compose');
  };

  return (
    <Screen
      step="Step 2 of 3"
      title="Where this goes"
      subtitle={`${topic.icon}  ${topic.title}`}
      onBack={nav.pop}
      footer={
        <View>
          <Button label="Write my message" onPress={handleWrite} />
          <Button
            label="Choose a different topic"
            variant="ghost"
            onPress={nav.pop}
            style={styles.footerGhost}
          />
        </View>
      }
    >
      {office ? (
        <Card style={styles.officeCard}>
          <LevelBadge level={office.level} />
          <Text style={styles.officeName}>{office.name}</Text>
          <Text style={styles.officeRole}>{office.role}</Text>
          <ExternalLink
            url={office.url}
            label={`Open ${office.urlLabel}`}
            variant="secondary"
            hint="Opens the office's official website in your browser"
            style={styles.officeLink}
          />
        </Card>
      ) : null}

      <Text style={styles.sectionTitle}>Why this office</Text>
      <Text style={styles.body}>{topic.why}</Text>

      <Text style={styles.sectionTitle}>What they can do</Text>
      <View style={styles.list}>
        {topic.canDo.map((item) => (
          <View key={item} style={styles.listItem}>
            <Text style={styles.check}>✓</Text>
            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.limitCard}>
        <Text style={styles.limitTitle}>What they cannot do</Text>
        <Text style={styles.limitText}>{topic.limit}</Text>
      </View>

      {alsoOffices.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Also worth contacting</Text>
          {alsoOffices.map((item) => (
            <View key={item.id} style={styles.alsoRow}>
              <View style={styles.alsoHeader}>
                <Text style={styles.alsoName}>{item.name}</Text>
                <LevelBadge level={item.level} />
              </View>
              <Text style={styles.alsoRole}>{item.role}</Text>
            </View>
          ))}
        </>
      ) : null}

      <Notice tone="info" title="This is general guidance" style={styles.notice}>
        Office responsibilities can change, and a specific address may belong to a town or an HOA
        instead. If you are not sure, send it to the office listed first and ask them to forward it.
      </Notice>
    </Screen>
  );
}

const styles = StyleSheet.create({
  officeCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  officeName: {
    fontFamily: font.family,
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginTop: spacing.sm,
    marginBottom: spacing.xs + 2,
    lineHeight: font.size.lg * 1.3,
  },
  officeRole: {
    ...text.small,
    marginBottom: spacing.md,
  },
  officeLink: {
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  body: {
    ...text.body,
    marginBottom: spacing.md,
  },
  list: {
    marginBottom: spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  check: {
    fontFamily: font.family,
    color: colors.tealDeep,
    fontWeight: font.weight.bold,
    fontSize: font.size.md,
    width: 22,
  },
  listText: {
    ...text.body,
    flex: 1,
    fontSize: font.size.md,
  },
  limitCard: {
    backgroundColor: colors.warningSoft,
    borderWidth: 1,
    borderColor: colors.warningBorder,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  limitTitle: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
    color: colors.warning,
    marginBottom: spacing.xs,
  },
  limitText: {
    ...text.small,
    color: colors.slateText,
  },
  alsoRow: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  alsoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs + 2,
  },
  alsoName: {
    flex: 1,
    fontFamily: font.family,
    fontSize: font.size.sm + 1,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginRight: spacing.sm,
  },
  alsoRole: {
    ...text.small,
    fontSize: font.size.sm,
  },
  notice: {
    marginTop: spacing.lg,
    marginBottom: 0,
  },
  footerGhost: {
    marginTop: spacing.xs,
    minHeight: 40,
  },
});
