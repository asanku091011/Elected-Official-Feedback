import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNav } from '../navigation/Navigator';
import { useCivic } from '../context/CivicContext';
import Screen from '../components/Screen';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Notice from '../components/Notice';
import EmptyState from '../components/EmptyState';
import CheckRow from '../components/CheckRow';
import BarRow from '../components/BarRow';
import {
  MIN_RESULTS_TO_SHOW,
  audienceLabel,
  canVote,
  closesInLabel,
  findVote,
  pollPhase,
  pollTypeLabel,
  tallyPoll,
} from '../lib/polls';
import { colors, spacing, font, text } from '../theme';

export default function PollScreen({ pollId }) {
  const nav = useNav();
  const { polls, votes, vote, markSeen } = useCivic();
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const poll = polls.find((item) => item.id === pollId) || null;

  // Opening a poll counts as reading it.
  useEffect(() => {
    if (pollId) markSeen('poll', pollId);
  }, [pollId, markSeen]);

  if (!poll) {
    return (
      <Screen title="Poll" onBack={nav.pop}>
        <EmptyState
          icon="📊"
          title="That poll is not available"
          body="It may have been removed by the sample office. Go back to the updates feed to see what is open."
          actionLabel="Back to updates"
          onAction={() => nav.replace('Feed')}
        />
      </Screen>
    );
  }

  const existingVote = findVote(votes, poll.id);
  const tally = tallyPoll(poll, votes);
  const phase = pollPhase(poll);
  const showResults = Boolean(existingVote) || phase === 'closed';
  const eligibility = canVote(poll, votes);
  const canSelect = eligibility.ok;

  const toggleOption = (optionId) => {
    setError('');
    if (poll.type === 'multiple') {
      setSelected((current) =>
        current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId]
      );
      return;
    }
    setSelected([optionId]);
  };

  const handleSubmit = () => {
    const result = vote(poll.id, selected);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSelected([]);
    setError('');
    setSubmitted(true);
  };

  return (
    <Screen
      title="Poll"
      subtitle={`${pollTypeLabel(poll.type)} · ${closesInLabel(poll)}`}
      onBack={nav.pop}
      footer={
        canSelect ? (
          <Button
            label={selected.length === 0 ? 'Choose an answer first' : 'Record my response'}
            onPress={handleSubmit}
            disabled={selected.length === 0}
          />
        ) : (
          <Button label="Back to updates" variant="secondary" onPress={() => nav.replace('Feed')} />
        )
      }
    >
      <Card style={styles.questionCard}>
        <View style={styles.badgeRow}>
          {poll.isSample ? <Badge label="Sample poll" tone="teal" /> : null}
          <Badge
            label={phase === 'closed' ? 'Closed' : 'Open'}
            tone={phase === 'closed' ? 'neutral' : 'success'}
          />
        </View>
        <Text style={styles.question} accessibilityRole="header">
          {poll.question}
        </Text>
        {poll.description ? <Text style={styles.description}>{poll.description}</Text> : null}
        <Text style={styles.meta}>
          Asked of {audienceLabel(poll)} · {closesInLabel(poll)}
        </Text>
      </Card>

      {submitted ? (
        <Notice tone="success" title="Thanks, your response was recorded">
          Your answer is stored on this device and added to the results below. Nothing is sent to a
          server, and no name or account is attached to it.
        </Notice>
      ) : null}

      {error ? (
        <Notice tone="danger" title="That did not go through">
          {error}
        </Notice>
      ) : null}

      {canSelect ? (
        <View>
          <Text style={styles.sectionTitle}>
            {poll.type === 'multiple' ? 'Choose all that apply' : 'Choose one answer'}
          </Text>
          {poll.options.map((option) => (
            <CheckRow
              key={option.id}
              label={option.label}
              checked={selected.includes(option.id)}
              onToggle={() => toggleOption(option.id)}
            />
          ))}
          <Text style={styles.privacyNote}>
            One response per resident on this device. CivLink does not record who voted for what.
          </Text>
        </View>
      ) : !existingVote ? (
        <Notice tone="info" title="This poll is closed">
          Final results are below. A closed poll does not accept new responses.
        </Notice>
      ) : null}

      {showResults ? (
        <View>
          <Text style={styles.sectionTitle}>
            {phase === 'closed' ? 'Final results' : 'Results so far'}
          </Text>

          {!tally.hasEnough ? (
            <Notice tone="info" title="Not enough responses yet">
              Results are hidden until at least {MIN_RESULTS_TO_SHOW} responses are recorded. This
              poll has {tally.total} so far.
            </Notice>
          ) : (
            <Card style={styles.resultsCard}>
              <View style={styles.badgeRow}>
                {tally.usingSampleData ? <Badge label="Sample responses" tone="teal" /> : null}
                <Badge
                  label={`${tally.total} ${tally.total === 1 ? 'response' : 'responses'}`}
                  tone="neutral"
                />
              </View>
              {tally.options.map((option) => (
                <BarRow
                  key={option.id}
                  label={option.label}
                  count={option.count}
                  total={tally.total}
                  color={colors.teal}
                />
              ))}
              {poll.type === 'multiple' ? (
                <Text style={styles.chartNote}>
                  Percent of respondents who chose each option; a respondent may choose more than
                  one.
                </Text>
              ) : null}
            </Card>
          )}

          {tally.hasEnough && tally.jurisdictions.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Responses by locality</Text>
              <Card style={styles.resultsCard}>
                {tally.jurisdictions.map((item) => (
                  <BarRow
                    key={item.id}
                    label={item.label}
                    count={item.count}
                    total={tally.total}
                    color={colors.tealDeep}
                  />
                ))}
              </Card>
            </>
          ) : null}

          <Text style={styles.footnote}>
            {tally.usingSampleData
              ? 'Sample responses are made-up numbers shipped with the prototype. They are mixed with responses recorded on this device and labeled wherever they appear.'
              : 'These results include only responses recorded on this device. A real deployment would count them on a secure server.'}
          </Text>
        </View>
      ) : (
        <Text style={styles.footnote}>
          Results appear after you respond, or when the poll closes.
        </Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  questionCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  question: {
    fontFamily: font.family,
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
    color: colors.ink,
    lineHeight: font.size.lg * 1.35,
    marginBottom: spacing.sm,
  },
  description: {
    ...text.body,
    fontSize: font.size.sm + 1,
    marginBottom: spacing.sm,
  },
  meta: {
    ...text.small,
    fontSize: font.size.sm - 1,
  },
  sectionTitle: {
    fontFamily: font.family,
    fontSize: font.size.md,
    fontWeight: font.weight.bold,
    color: colors.ink,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  privacyNote: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    lineHeight: font.size.xs * 1.7,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  resultsCard: {
    backgroundColor: colors.surface,
    paddingBottom: 0,
    marginBottom: spacing.md,
  },
  chartNote: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    lineHeight: font.size.xs * 1.6,
    marginTop: -spacing.xs,
    marginBottom: spacing.md,
  },
  footnote: {
    fontFamily: font.family,
    fontSize: font.size.xs,
    color: colors.slateText,
    lineHeight: font.size.xs * 1.7,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
});
