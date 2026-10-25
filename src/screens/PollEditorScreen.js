import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNav } from '../navigation/Navigator';
import { useCivic } from '../context/CivicContext';
import PortalScreen from '../components/PortalScreen';
import Field from '../components/Field';
import Button from '../components/Button';
import Notice from '../components/Notice';
import CheckRow from '../components/CheckRow';
import EmptyState from '../components/EmptyState';
import { POLL_TYPES } from '../data/seedContent';
import { JURISDICTIONS, labelForVA10 } from '../data/jurisdictions';
import {
  MAX_OPTIONS,
  MAX_QUESTION_LENGTH,
  MIN_OPTIONS,
  NEUTRALITY_CHECKS,
  canPublish,
  emptyPollDraft,
  fromDateInput,
  optionsForRating,
  pollWarnings,
  toDateInput,
  validatePoll,
} from '../lib/polls';
import { colors, spacing, radius, font, text } from '../theme';

const DAY = 24 * 60 * 60 * 1000;

// A date field is a plain YYYY-MM-DD input: easier to type on a phone than a
// native date picker, and it works the same on web.
function resolveDate(input, fallback, endOfDay) {
  if (!input) return fallback;
  return fromDateInput(input, endOfDay);
}

export default function PollEditorScreen({ pollId }) {
  const nav = useNav();
  const { account, polls, savePoll, publishPoll } = useCivic();

  const existing = pollId ? polls.find((item) => item.id === pollId) : null;

  const [draft, setDraft] = useState(() => {
    if (existing) {
      return {
        ...existing,
        options: (existing.options || []).map((option) => ({ ...option })),
        audience: [...(existing.audience || [])],
        neutrality: { ...(existing.neutrality || {}) },
      };
    }
    const base = emptyPollDraft(account ? account.id : '');
    return {
      ...base,
      opensAt: new Date().toISOString(),
      closesAt: new Date(Date.now() + 14 * DAY).toISOString(),
    };
  });
  const [opensInput, setOpensInput] = useState(() =>
    toDateInput(existing ? existing.opensAt : new Date().toISOString())
  );
  const [closesInput, setClosesInput] = useState(() =>
    toDateInput(existing ? existing.closesAt : new Date(Date.now() + 14 * DAY).toISOString())
  );
  const [attempted, setAttempted] = useState(false);
  const [message, setMessage] = useState(null);
  const [pendingPublishId, setPendingPublishId] = useState(null);

  // Publishing has to run after the saved poll reaches shared state, so the
  // portal can validate the version it actually stored. The effect fires on the
  // re-render that follows savePoll.
  useEffect(() => {
    if (!pendingPublishId) return;
    const result = publishPoll(pendingPublishId);
    setPendingPublishId(null);
    if (!result.ok) {
      setMessage({ tone: 'danger', text: result.error });
      return;
    }
    nav.replace('PortalPolls');
  }, [pendingPublishId, polls, publishPoll, nav]);

  if (!account) {
    return (
      <PortalScreen title="Create a poll" onBack={nav.pop}>
        <EmptyState
          icon="🔐"
          title="Sign in to write a poll"
          body="Only a verified official account can create or publish polls in this prototype."
          actionLabel="Choose a demo account"
          onAction={() => nav.push('PortalSignIn')}
        />
      </PortalScreen>
    );
  }

  if (pollId && !existing) {
    return (
      <PortalScreen title="Poll not found" onBack={nav.pop}>
        <EmptyState
          icon="🗳️"
          title="That poll is no longer available"
          body="It may have been reset. Open the poll list to pick another one."
          actionLabel="Back to polls"
          onAction={() => nav.replace('PortalPolls')}
        />
      </PortalScreen>
    );
  }

  const payload = {
    ...draft,
    opensAt: resolveDate(opensInput, draft.opensAt, false),
    closesAt: resolveDate(closesInput, draft.closesAt, true),
  };
  const check = validatePoll(payload);
  const warnings = pollWarnings(payload);
  const ready = canPublish(payload, draft.neutrality || {});
  const unchecked = NEUTRALITY_CHECKS.filter((item) => draft.neutrality[item.id] !== true).length;

  const update = (patch) => setDraft((current) => ({ ...current, ...patch }));

  const handleType = (type) => {
    if (type === draft.type) return;
    if (type === 'rating') {
      update({ type, options: optionsForRating() });
      return;
    }
    update({
      type,
      options:
        draft.type === 'rating'
          ? [
              { id: 'o1', label: '' },
              { id: 'o2', label: '' },
            ]
          : draft.options,
    });
  };

  const updateOption = (index, label) => {
    setDraft((current) => ({
      ...current,
      options: current.options.map((option, position) =>
        position === index ? { ...option, label } : option
      ),
    }));
  };

  const addOption = () => {
    setDraft((current) => {
      if (current.options.length >= MAX_OPTIONS) return current;
      let number = 1;
      while (current.options.some((option) => option.id === `o${number}`)) number += 1;
      return { ...current, options: [...current.options, { id: `o${number}`, label: '' }] };
    });
  };

  const removeOption = (index) => {
    setDraft((current) => {
      if (current.options.length <= MIN_OPTIONS) return current;
      return { ...current, options: current.options.filter((_, position) => position !== index) };
    });
  };

  const toggleAudience = (id) => {
    setDraft((current) => {
      const has = current.audience.includes(id);
      return {
        ...current,
        audience: has ? current.audience.filter((item) => item !== id) : [...current.audience, id],
      };
    });
  };

  const toggleNeutrality = (id) => {
    setDraft((current) => ({
      ...current,
      neutrality: { ...current.neutrality, [id]: !current.neutrality[id] },
    }));
  };

  const handleSave = (publish) => {
    setAttempted(true);
    setMessage(null);
    if (!check.isValid) {
      setMessage({ tone: 'danger', text: Object.values(check.errors)[0] });
      return;
    }
    if (publish && !ready) {
      setMessage({ tone: 'danger', text: 'Complete the neutrality checklist before publishing.' });
      return;
    }
    const saved = savePoll({ ...payload, neutrality: draft.neutrality || {} });
    if (!saved.ok) {
      setMessage({ tone: 'danger', text: saved.error });
      return;
    }
    if (publish) {
      setPendingPublishId(saved.id);
      return;
    }
    nav.replace('PortalPolls');
  };

  const rating = draft.type === 'rating';

  return (
    <PortalScreen
      title={pollId ? 'Edit poll' : 'New poll'}
      subtitle="Write one neutral question, pick the areas that should see it, then publish."
      onBack={nav.pop}
      footer={
        <View>
          <Button
            label={pendingPublishId ? 'Publishing…' : 'Publish to residents'}
            onPress={() => handleSave(true)}
            disabled={!ready || Boolean(pendingPublishId)}
          />
          <Button
            label="Save draft"
            variant="secondary"
            onPress={() => handleSave(false)}
            style={styles.saveDraft}
          />
        </View>
      }
    >
      {message ? (
        <Notice tone={message.tone} title={message.tone === 'danger' ? 'Not saved yet' : undefined}>
          {message.text}
        </Notice>
      ) : null}

      <Field
        label="Question"
        value={draft.question}
        onChangeText={(value) => update({ question: value })}
        placeholder="Which library program would your family use this winter?"
        maxLength={MAX_QUESTION_LENGTH}
        error={attempted ? check.errors.question : null}
        hint={`${draft.question.trim().length} / ${MAX_QUESTION_LENGTH} characters. Ask about a service, not a person or a campaign.`}
      />

      <Field
        label="Short explanation (optional)"
        value={draft.description}
        onChangeText={(value) => update({ description: value })}
        placeholder="One or two sentences that give residents context."
        multiline
        inputStyle={styles.descriptionInput}
        hint="Shown under the question. Keep it factual and free of persuasion."
      />

      <Text style={styles.sectionTitle}>How residents answer</Text>
      <View style={styles.chipRow}>
        {POLL_TYPES.map((type) => {
          const selected = draft.type === type.id;
          return (
            <Pressable
              key={type.id}
              onPress={() => handleType(type.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`Poll type: ${type.label}`}
              style={({ pressed }) => [
                styles.chip,
                selected && styles.chipSelected,
                pressed && styles.chipPressed,
              ]}
            >
              <Text style={styles.chipText}>{type.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Options</Text>
      {rating ? (
        <Notice tone="info" title="1 to 5 rating">
          Residents pick a number from 1 to 5. CivLink supplies those labels automatically, so there
          is nothing to write here.
        </Notice>
      ) : (
        <View>
          {draft.options.map((option, index) => (
            <View key={option.id} style={styles.optionRow}>
              <Field
                label={`Option ${index + 1}`}
                value={option.label}
                onChangeText={(value) => updateOption(index, value)}
                placeholder={index === 0 ? 'Yes, I would use it' : 'No, it would not help'}
                maxLength={100}
                style={styles.optionField}
                accessibilityLabel={`Option ${index + 1}`}
              />
              {draft.options.length > MIN_OPTIONS ? (
                <Pressable
                  onPress={() => removeOption(index)}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove option ${index + 1}`}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              ) : null}
            </View>
          ))}
          {draft.options.length < MAX_OPTIONS ? (
            <Pressable
              onPress={addOption}
              accessibilityRole="button"
              accessibilityLabel="Add another option"
              style={({ pressed }) => [styles.addOption, pressed && styles.chipPressed]}
            >
              <Text style={styles.addOptionText}>+ Add another option</Text>
            </Pressable>
          ) : null}
          {attempted && check.errors.options ? (
            <Text style={styles.errorText}>{check.errors.options}</Text>
          ) : null}
        </View>
      )}

      <Text style={styles.sectionTitle}>Who receives it</Text>
      {JURISDICTIONS.map((item) => (
        <CheckRow
          key={item.id}
          label={item.name}
          description={labelForVA10(item.inVA10)}
          checked={draft.audience.includes(item.id)}
          onToggle={() => toggleAudience(item.id)}
        />
      ))}
      {attempted && check.errors.audience ? (
        <Text style={styles.errorText}>{check.errors.audience}</Text>
      ) : null}

      <Text style={styles.sectionTitle}>Dates</Text>
      <Field
        label="Opens"
        value={opensInput}
        onChangeText={setOpensInput}
        placeholder="YYYY-MM-DD"
        autoCapitalize="none"
        hint="Publishing before this date schedules the poll instead of opening it."
      />
      <Field
        label="Closes"
        value={closesInput}
        onChangeText={setClosesInput}
        placeholder="YYYY-MM-DD"
        autoCapitalize="none"
        error={attempted && check.errors.dates ? check.errors.dates : null}
        hint="The poll closes at the end of this day. Closed polls show final results."
      />

      <Text style={styles.sectionTitle}>Neutrality checklist</Text>
      <Text style={styles.sectionIntro}>
        Every poll has to pass these four checks before it can publish. The automatic hints below
        are just a second look; the checklist is the promise the office makes.
      </Text>
      {NEUTRALITY_CHECKS.map((item) => (
        <CheckRow
          key={item.id}
          label={item.label}
          checked={draft.neutrality[item.id] === true}
          onToggle={() => toggleNeutrality(item.id)}
        />
      ))}

      {warnings.length > 0 ? (
        <Notice tone="warning" title="Wording to look at again">
          {warnings.join(' ')}
        </Notice>
      ) : null}

      {!ready ? (
        <Notice tone="info" title="Publishing is locked">
          {unchecked > 0
            ? `${unchecked} neutrality ${unchecked === 1 ? 'check is' : 'checks are'} still unticked. `
            : ''}
          {!check.isValid ? Object.values(check.errors)[0] : ''}
        </Notice>
      ) : null}

      <Text style={styles.footnote}>
        Saving keeps the poll as a draft. Publishing checks the poll, records the checklist, and puts
        it in the in-app feed for residents of the areas you picked. Scheduled polls appear on their
        opening date; drafts never reach residents.
      </Text>
    </PortalScreen>
  );
}

const styles = StyleSheet.create({
  saveDraft: {
    marginTop: spacing.sm,
  },
  descriptionInput: {
    minHeight: 100,
  },
  sectionTitle: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionIntro: {
    ...text.small,
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
    opacity: 0.75,
  },
  chipText: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.ink,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  optionField: {
    flex: 1,
  },
  removeButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    marginLeft: spacing.xs,
  },
  removeText: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    color: colors.danger,
    textDecorationLine: 'underline',
  },
  addOption: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
  },
  addOptionText: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.tealDeep,
  },
  errorText: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    color: colors.danger,
    fontWeight: font.weight.medium,
    marginBottom: spacing.sm,
  },
  footnote: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    lineHeight: font.size.xs * 1.7,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
});
