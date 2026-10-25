import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNav } from '../navigation/Navigator';
import { useCivic } from '../context/CivicContext';
import PortalScreen from '../components/PortalScreen';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import Notice from '../components/Notice';
import { formatRelative } from '../lib/format';
import { colors, spacing, radius, font, text } from '../theme';

export default function AuditLogScreen() {
  const nav = useNav();
  const { account, auditLog } = useCivic();

  const entries = useMemo(
    () =>
      [...auditLog].sort(
        (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
      ),
    [auditLog]
  );

  if (!account) {
    return (
      <PortalScreen title="Audit log" onBack={nav.pop}>
        <EmptyState
          icon="🔐"
          title="Sign in to view the audit log"
          body="The Official Portal uses sample demo accounts. No real office or agency is represented."
          actionLabel="Go to demo sign-in"
          onAction={() => nav.push('PortalSignIn')}
        />
      </PortalScreen>
    );
  }

  return (
    <PortalScreen
      title="Audit log"
      subtitle="Who published or changed something, and when."
      onBack={nav.pop}
    >
      <Notice tone="info" title="A simple local record">
        Every publish, edit, approval, and archive action in this prototype appends one line here.
        It is stored on this device and can be reset with the demo data. A real service would keep
        append-only records on a server, with a timestamp that staff cannot edit.
      </Notice>

      <View style={styles.summaryRow}>
        <Badge label={`${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`} tone="neutral" />
      </View>

      {entries.length === 0 ? (
        <EmptyState
          icon="🧾"
          title="Nothing logged yet"
          body="Publish a poll or an announcement and come back here to see the record."
          actionLabel="Back to the portal"
          onAction={() => nav.replace('PortalHome')}
        />
      ) : (
        entries.map((entry) => (
          <View key={entry.id} style={styles.row}>
            <View style={styles.rowHeader}>
              <Text style={styles.actor}>{entry.actor}</Text>
              <Text style={styles.time}>{formatRelative(entry.at)}</Text>
            </View>
            <Text style={styles.action}>{entry.action}</Text>
            {entry.target ? <Text style={styles.target}>{entry.target}</Text> : null}
          </View>
        ))
      )}
    </PortalScreen>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  row: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: colors.teal,
    borderRadius: radius.md,
    padding: spacing.md - 2,
    marginBottom: spacing.sm,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 3,
  },
  actor: {
    flex: 1,
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginRight: spacing.sm,
  },
  time: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
  },
  action: {
    ...text.small,
    color: colors.ink,
  },
  target: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    marginTop: 2,
    fontStyle: 'italic',
  },
});
