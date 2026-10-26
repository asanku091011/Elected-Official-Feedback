import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNav } from '../navigation/Navigator';
import { useCivic } from '../context/CivicContext';
import Screen from '../components/Screen';
import CheckRow from '../components/CheckRow';
import Notice from '../components/Notice';
import Button from '../components/Button';
import { CATEGORIES } from '../data/seedContent';
import { JURISDICTIONS } from '../data/jurisdictions';
import { colors, spacing, radius, font, text } from '../theme';

function allOn(ids) {
  return ids.reduce((map, id) => ({ ...map, [id]: true }), {});
}

function allOff(ids) {
  return ids.reduce((map, id) => ({ ...map, [id]: false }), {});
}

export default function NotificationSettingsScreen() {
  const nav = useNav();
  const { notificationPrefs, setNotificationPrefs, jurisdiction } = useCivic();
  const { categories, jurisdictions, muted } = notificationPrefs;

  const categoryCount = CATEGORIES.filter((item) => categories[item.id]).length;
  const areaCount = JURISDICTIONS.filter((item) => jurisdictions[item.id]).length;

  return (
    <Screen
      title="Notifications"
      subtitle="In-app feed settings."
      onBack={nav.pop}
      footer={
        <View>
          <Button label="Open the update feed" onPress={() => nav.push('Feed')} />
          <Button
            label={`Change area (${jurisdiction.short})`}
            variant="secondary"
            onPress={() => nav.push('Jurisdiction')}
            style={styles.footerBtn}
          />
        </View>
      }
    >
      <Notice tone="info" title="How notifications work">
        These settings control what appears in CivLink’s update feed and whether it counts toward
        the unread badge. Push notifications for these categories are planned next.
      </Notice>

      <Text style={styles.summary}>
        {categoryCount} of {CATEGORIES.length} categories on · {areaCount} of {JURISDICTIONS.length}{' '}
        areas on{muted ? ' · unread badge muted' : ''}
      </Text>

      <Text style={styles.sectionTitle}>Categories</Text>
      {CATEGORIES.map((item) => (
        <CheckRow
          key={item.id}
          label={item.label}
          checked={categories[item.id] !== false}
          onToggle={() =>
            setNotificationPrefs({ categories: { [item.id]: categories[item.id] === false } })
          }
        />
      ))}

      <Text style={styles.sectionTitle}>Areas</Text>
      <Text style={styles.helper}>
        Turning an area off hides its updates. Your selected area is {jurisdiction.name}.
      </Text>
      {JURISDICTIONS.map((item) => (
        <CheckRow
          key={item.id}
          label={item.name}
          checked={jurisdictions[item.id] !== false}
          onToggle={() =>
            setNotificationPrefs({ jurisdictions: { [item.id]: jurisdictions[item.id] === false } })
          }
        />
      ))}

      <Text style={styles.sectionTitle}>Unread badge</Text>
      <CheckRow
        label="Mute unread badges"
        description="Updates still appear in the feed; the number badge stays hidden until you unmute."
        checked={muted}
        onToggle={() => setNotificationPrefs({ muted: !muted })}
      />

      <View style={styles.bulk}>
        <Button
          label="Turn everything off"
          variant="secondary"
          onPress={() =>
            setNotificationPrefs({
              categories: allOff(CATEGORIES.map((item) => item.id)),
              jurisdictions: allOff(JURISDICTIONS.map((item) => item.id)),
            })
          }
        />
        <Button
          label="Turn everything back on"
          variant="ghost"
          onPress={() =>
            setNotificationPrefs({
              categories: allOn(CATEGORIES.map((item) => item.id)),
              jurisdictions: allOn(JURISDICTIONS.map((item) => item.id)),
            })
          }
          style={styles.ghost}
        />
      </View>

      <Text style={styles.footnote}>
        Preferences are saved for this device and apply every time you open CivLink.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    color: colors.ink,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm + 2,
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
  helper: {
    ...text.small,
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
  },
  bulk: {
    marginTop: spacing.sm,
  },
  ghost: {
    marginTop: spacing.xs,
    minHeight: 40,
  },
  footnote: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    lineHeight: font.size.xs * 1.7,
    marginTop: spacing.md,
  },
  footerBtn: {
    marginTop: spacing.sm,
    minHeight: 44,
  },
});
