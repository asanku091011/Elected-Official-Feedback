import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNav } from '../navigation/Navigator';
import { useCivic } from '../context/CivicContext';
import PortalScreen from '../components/PortalScreen';
import Badge from '../components/Badge';
import Button from '../components/Button';
import CheckRow from '../components/CheckRow';
import Field from '../components/Field';
import Notice from '../components/Notice';
import EmptyState from '../components/EmptyState';
import { JURISDICTIONS, getJurisdiction } from '../data/jurisdictions';
import { CATEGORIES } from '../data/seedContent';
import { fromDateInput, toDateInput } from '../lib/polls';
import { formatDate } from '../lib/format';
import { colors, spacing, radius, font, text } from '../theme';

const MAX_TITLE = 100;
const MAX_BODY = 1200;

export default function AnnouncementEditorScreen({ announcementId }) {
  const nav = useNav();
  const {
    account,
    announcements,
    saveAnnouncement,
    publishAnnouncement,
    archiveAnnouncement,
  } = useCivic();

  const existing = announcementId
    ? announcements.find((item) => item.id === announcementId) || null
    : null;

  const [title, setTitle] = useState(existing ? existing.title : '');
  const [body, setBody] = useState(existing ? existing.body : '');
  const [category, setCategory] = useState(existing ? existing.category : 'services');
  const [audience, setAudience] = useState(
    existing ? existing.audience || [] : []
  );
  const [schedule, setSchedule] = useState(
    Boolean(existing && existing.status === 'scheduled' && existing.publishAt)
  );
  const [dateValue, setDateValue] = useState(
    existing && existing.publishAt
      ? toDateInput(existing.publishAt)
      : toDateInput(new Date().toISOString())
  );
  const [feedback, setFeedback] = useState(null);
  const [confirmArchive, setConfirmArchive] = useState(false);

  if (!account) {
    return (
      <PortalScreen title="Announcement" onBack={nav.pop}>
        <EmptyState
          icon="🔐"
          title="Sign in to write an announcement"
          body="The Official Portal uses sample demo accounts. No real office or agency is represented."
          actionLabel="Go to demo sign-in"
          onAction={() => nav.push('PortalSignIn')}
        />
      </PortalScreen>
    );
  }

  if (announcementId && !existing) {
    return (
      <PortalScreen title="Announcement" onBack={nav.pop}>
        <EmptyState
          icon="🗂️"
          title="That announcement is not available"
          body="It may have been removed from the demo data."
          actionLabel="Back to announcements"
          onAction={() => nav.replace('PortalAnnouncements')}
        />
      </PortalScreen>
    );
  }

  const toggleArea = (id) => {
    setAudience((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  // Returns the values to save, or a readable error. Nothing is published here.
  const buildRecord = () => {
    const cleanTitle = title.trim();
    const cleanBody = body.trim();
    if (cleanTitle.length < 6) return { error: 'Add a title of at least 6 characters.' };
    if (cleanBody.length < 20) return { error: 'Add a little more detail, at least 20 characters.' };
    if (audience.length === 0) return { error: 'Choose at least one area.' };

    let publishAt = null;
    if (schedule) {
      publishAt = fromDateInput(dateValue, true);
      if (!publishAt) return { error: 'Use a schedule date in YYYY-MM-DD format.' };
    }

    return {
      record: {
        ...(existing || {}),
        title: cleanTitle,
        body: cleanBody,
        category,
        audience,
        publishAt,
        status: existing ? existing.status : 'draft',
        isSample: existing ? Boolean(existing.isSample) : false,
      },
    };
  };

  const handleSaveDraft = () => {
    const built = buildRecord();
    if (built.error) {
      setFeedback({ tone: 'danger', title: 'Nothing saved yet', body: built.error });
      return;
    }
    const saved = saveAnnouncement(built.record);
    if (!saved.ok) {
      setFeedback({ tone: 'danger', title: 'Could not save', body: saved.error });
      return;
    }
    nav.replace('PortalAnnouncements');
  };

  const handlePublish = () => {
    const built = buildRecord();
    if (built.error) {
      setFeedback({ tone: 'danger', title: 'Nothing published yet', body: built.error });
      return;
    }
    const saved = saveAnnouncement(built.record);
    if (!saved.ok) {
      setFeedback({ tone: 'danger', title: 'Could not save', body: saved.error });
      return;
    }
    const result = publishAnnouncement(saved.id);
    if (!result.ok) {
      setFeedback({ tone: 'danger', title: 'Could not publish', body: result.error });
      return;
    }
    nav.replace('PortalAnnouncements');
  };

  const handleArchive = () => {
    if (!existing) return;
    if (!confirmArchive) {
      setConfirmArchive(true);
      return;
    }
    const result = archiveAnnouncement(existing.id);
    if (!result.ok) {
      setFeedback({ tone: 'danger', title: 'Could not archive', body: result.error });
      return;
    }
    nav.replace('PortalAnnouncements');
  };

  const publishLabel = schedule ? 'Schedule announcement' : 'Publish now';

  return (
    <PortalScreen
      title={existing ? 'Edit announcement' : 'New announcement'}
      subtitle="Residents in the areas you choose see this in their in-app feed. Nothing is emailed or texted."
      onBack={nav.pop}
      footer={
        <View>
          <Button label={publishLabel} onPress={handlePublish} />
          <Button
            label="Save as draft"
            variant="secondary"
            onPress={handleSaveDraft}
            style={styles.secondary}
          />
        </View>
      }
    >
      {feedback ? (
        <Notice tone={feedback.tone} title={feedback.title}>
          {feedback.body}
        </Notice>
      ) : null}

      <View style={styles.statusRow}>
        <Badge
          label={
            existing
              ? existing.status.charAt(0).toUpperCase() + existing.status.slice(1)
              : 'New draft'
          }
          tone={existing && existing.status === 'published' ? 'success' : 'neutral'}
        />
        {existing && existing.isSample ? <Badge label="Sample data" tone="warning" /> : null}
      </View>

      <Field
        label="Title"
        value={title}
        onChangeText={setTitle}
        placeholder="What is happening, in one clear line"
        maxLength={MAX_TITLE}
        hint={`${title.length} / ${MAX_TITLE} characters`}
        accessibilityLabel="Announcement title"
      />

      <Field
        label="Message"
        value={body}
        onChangeText={setBody}
        placeholder="What residents need to know, when it starts, and what they should do."
        multiline
        maxLength={MAX_BODY}
        hint={`${body.length} / ${MAX_BODY} characters`}
        accessibilityLabel="Announcement body"
      />

      <Text style={styles.sectionTitle}>Category</Text>
      <View style={styles.chipRow}>
        {CATEGORIES.map((item) => {
          const selected = category === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => setCategory(item.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`Category ${item.label}`}
              style={({ pressed }) => [
                styles.chip,
                selected && styles.chipSelected,
                pressed && styles.chipPressed,
              ]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Who receives it</Text>
      <Text style={styles.sectionHint}>
        Pick every area that should get this update. CivLink delivers through the in-app feed, so
        these choices decide which residents see it.
      </Text>
      {JURISDICTIONS.map((item) => (
        <CheckRow
          key={item.id}
          label={item.name}
          description={
            item.inVA10 === 'no'
              ? 'Outside VA-10 (VA-8). Included as an expansion area.'
              : item.inVA10 === 'partial'
                ? 'Only part of this county is in VA-10.'
                : 'In VA-10.'
          }
          checked={audience.includes(item.id)}
          onToggle={() => toggleArea(item.id)}
        />
      ))}

      <Text style={styles.sectionTitle}>When to publish</Text>
      <CheckRow
        label="Schedule for later"
        description="Off means the announcement can publish immediately when you tap the publish button."
        checked={schedule}
        onToggle={() => setSchedule((current) => !current)}
      />
      {schedule ? (
        <Field
          label="Publish date"
          value={dateValue}
          onChangeText={setDateValue}
          placeholder="2026-11-02"
          autoCapitalize="none"
          hint={`Use YYYY-MM-DD. It publishes at 11:59 PM on ${
            fromDateInput(dateValue, true) ? formatDate(fromDateInput(dateValue, true)) : 'that date'
          }.`}
          accessibilityLabel="Scheduled publish date"
        />
      ) : null}

      {existing && existing.publishAt ? (
        <Text style={styles.sectionHint}>
          Currently set for {formatDate(existing.publishAt)}. Changing the date and publishing again
          replaces that time.
        </Text>
      ) : null}

      {existing && (existing.status === 'published' || existing.status === 'scheduled') ? (
        <Button
          label={confirmArchive ? 'Tap again to archive this announcement' : 'Archive announcement'}
          variant="danger"
          onPress={handleArchive}
          style={styles.archive}
          accessibilityHint="Removes the announcement from the resident feed but keeps it in the portal"
        />
      ) : null}

      <View style={styles.note}>
        <Text style={styles.noteTitle}>Before you publish</Text>
        <Text style={styles.noteBody}>
          Check the area list and the date. This prototype has no server, so the update reaches
          residents on this device only; a real rollout would deliver it after the same verified
          official check you see at the top of this screen.
        </Text>
      </View>

      {audience.length > 0 ? (
        <Text style={styles.audienceSummary}>
          Recipients: {audience.map((id) => (getJurisdiction(id) || {}).short || id).join(', ')}
        </Text>
      ) : (
        <Text style={styles.audienceWarning}>No area selected yet.</Text>
      )}
    </PortalScreen>
  );
}

const styles = StyleSheet.create({
  secondary: {
    marginTop: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionHint: {
    ...text.small,
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.teal,
    borderColor: colors.ink,
  },
  chipPressed: {
    opacity: 0.78,
  },
  chipText: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.ink,
  },
  chipTextSelected: {
    color: colors.ink,
  },
  archive: {
    marginTop: spacing.md,
  },
  note: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  noteTitle: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  noteBody: {
    ...text.small,
  },
  audienceSummary: {
    ...text.small,
    color: colors.ink,
    marginTop: spacing.sm,
  },
  audienceWarning: {
    ...text.small,
    color: colors.warning,
    marginTop: spacing.sm,
  },
});
