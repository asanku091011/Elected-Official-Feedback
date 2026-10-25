// Run with: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MIN_RESULTS_TO_SHOW,
  NEUTRALITY_CHECKS,
  canPublish,
  canVote,
  closesInLabel,
  emptyPollDraft,
  findVote,
  fromDateInput,
  pollPhase,
  pollWarnings,
  tallyPoll,
  toDateInput,
  validatePoll,
  validateSelection,
} from '../src/lib/polls.js';
import { POLL_TYPES, SEED_ANNOUNCEMENTS, SEED_POLLS, SEED_QUESTIONS } from '../src/data/seedContent.js';
import { getJurisdiction } from '../src/data/jurisdictions.js';

const NOW = new Date('2026-10-23T18:00:00.000Z').getTime();

function makePoll(overrides = {}) {
  return {
    id: 'test-poll',
    question: 'Which library hours would your family use?',
    type: 'single',
    options: [
      { id: 'a', label: 'Afternoon' },
      { id: 'b', label: 'Evening' },
    ],
    audience: ['loudoun'],
    opensAt: '2026-10-20T00:00:00.000Z',
    closesAt: '2026-10-30T23:59:00.000Z',
    status: 'open',
    ...overrides,
  };
}

test('poll phase follows status and dates', () => {
  assert.equal(pollPhase(makePoll(), NOW), 'open');
  assert.equal(pollPhase(makePoll({ status: 'draft' }), NOW), 'draft');
  assert.equal(pollPhase(makePoll({ opensAt: '2026-10-25T00:00:00.000Z' }), NOW), 'scheduled');
  assert.equal(pollPhase(makePoll({ closesAt: '2026-10-22T00:00:00.000Z' }), NOW), 'closed');
  assert.equal(pollPhase(makePoll({ status: 'closed' }), NOW), 'closed');
  assert.equal(closesInLabel(makePoll(), NOW), 'Closes in 8 days');
});

test('one response per device and closed polls reject votes', () => {
  const poll = makePoll();
  assert.equal(canVote(poll, [], NOW).ok, true);
  const vote = { pollId: poll.id, optionIds: ['a'] };
  const after = canVote(poll, [vote], NOW);
  assert.equal(after.ok, false);
  assert.match(after.reason, /already/i);
  assert.equal(findVote([vote], poll.id), vote);
  assert.equal(canVote(makePoll({ status: 'closed' }), [], NOW).ok, false);
  assert.equal(canVote(makePoll({ opensAt: '2026-11-01T00:00:00.000Z' }), [], NOW).ok, false);
});

test('selection rules match the poll type', () => {
  const poll = makePoll();
  assert.match(validateSelection(poll, []), /at least one/i);
  assert.match(validateSelection(poll, ['a', 'b']), /single option|one answer/i);
  assert.equal(validateSelection(poll, ['a']), '');
  const multiple = makePoll({ type: 'multiple' });
  assert.equal(validateSelection(multiple, ['a', 'b']), '');
  assert.match(validateSelection(multiple, ['nope']), /not part of this poll/i);
});

test('tallies combine labeled sample counts with local responses', () => {
  const poll = makePoll({
    isSample: true,
    options: [
      { id: 'a', label: 'Afternoon' },
      { id: 'b', label: 'Evening' },
      { id: 'c', label: 'Weekend' },
    ],
    sampleResults: {
      total: 9,
      byOption: { a: 4, b: 3, c: 2 },
      byJurisdiction: { loudoun: 6, fairfax: 3 },
    },
  });
  const votes = [
    { pollId: poll.id, optionIds: ['b'], jurisdictionId: 'loudoun' },
    { pollId: 'other-poll', optionIds: ['a'], jurisdictionId: 'fairfax' },
  ];

  const tally = tallyPoll(poll, votes);
  assert.equal(tally.total, 10);
  assert.equal(tally.localCount, 1);
  assert.equal(tally.usingSampleData, true);
  assert.equal(tally.hasEnough, true);
  assert.equal(tally.options.find((item) => item.id === 'b').count, 4);
  assert.equal(tally.options.find((item) => item.id === 'b').share, 40);
  assert.equal(tally.jurisdictions.find((item) => item.id === 'loudoun').count, 7);
});

test('results stay hidden below the minimum response count', () => {
  const poll = makePoll({
    isSample: true,
    sampleResults: { total: MIN_RESULTS_TO_SHOW - 2, byOption: { a: 2, b: 1 }, byJurisdiction: { loudoun: 3 } },
  });
  const tally = tallyPoll(poll, []);
  assert.equal(tally.total, 3);
  assert.equal(tally.hasEnough, false);
});

test('poll validation rejects thin or unbalanced polls', () => {
  const draft = emptyPollDraft('acct-official');
  assert.equal(validatePoll(draft).isValid, false);
  assert.ok(validatePoll(draft).errors.question);
  assert.ok(validatePoll(draft).errors.options);

  const valid = makePoll();
  assert.equal(validatePoll(valid).isValid, true);
  assert.equal(validatePoll(makePoll({ options: [{ id: 'a', label: 'Same' }, { id: 'b', label: 'same' }] })).isValid, false);
  assert.equal(validatePoll(makePoll({ audience: [] })).isValid, false);
  assert.equal(validatePoll(makePoll({ closesAt: '2026-10-01T00:00:00.000Z' })).isValid, false);
});

test('publishing needs every neutrality check and a valid poll', () => {
  const poll = makePoll();
  const all = NEUTRALITY_CHECKS.reduce((map, item) => ({ ...map, [item.id]: true }), {});
  assert.equal(canPublish(poll, all), true);
  assert.equal(canPublish(poll, { ...all, [NEUTRALITY_CHECKS[0].id]: false }), false);
  assert.equal(canPublish(makePoll({ audience: [] }), all), false);
  assert.ok(pollWarnings(makePoll({ question: 'Should we elect a new mayor?' })).length > 0);
  assert.ok(pollWarnings(makePoll({ question: 'Would you use evening hours?' })).length === 0);
});

test('date inputs round-trip without drifting a day', () => {
  const iso = fromDateInput('2026-11-02', false);
  assert.equal(toDateInput(iso), '2026-11-02');
  assert.equal(fromDateInput('not-a-date'), '');
  assert.equal(new Date(fromDateInput('2026-11-02', true)).getHours(), 23);
});

test('seeded sample content is labeled and internally consistent', () => {
  assert.equal(SEED_POLLS.length, 4);
  assert.equal(new Set(SEED_POLLS.map((poll) => poll.id)).size, SEED_POLLS.length);
  assert.ok(SEED_POLLS.every((poll) => poll.isSample === true));
  assert.ok(SEED_POLLS.some((poll) => tallyPoll(poll, []).hasEnough));
  assert.ok(SEED_POLLS.some((poll) => !tallyPoll(poll, []).hasEnough));
  assert.ok(SEED_POLLS.some((poll) => pollPhase(poll, NOW) === 'closed'));
  assert.ok(SEED_POLLS.some((poll) => pollPhase(poll, NOW) === 'scheduled'));

  for (const poll of SEED_POLLS) {
    assert.ok(POLL_TYPES.some((type) => type.id === poll.type), `${poll.id} has an unknown type`);
    assert.ok(poll.options.length >= 2 && poll.options.length <= 6, `${poll.id} needs 2 to 6 options`);
    assert.ok(poll.audience.length > 0, `${poll.id} needs an audience`);
    for (const id of poll.audience) {
      assert.ok(getJurisdiction(id), `${poll.id} targets unknown area ${id}`);
    }
  }

  for (const announcement of SEED_ANNOUNCEMENTS) {
    assert.equal(announcement.isSample, true);
    assert.ok(['draft', 'scheduled', 'published', 'archived'].includes(announcement.status));
    for (const id of announcement.audience) {
      assert.ok(getJurisdiction(id), `${announcement.id} targets unknown area ${id}`);
    }
  }

  for (const question of SEED_QUESTIONS) {
    assert.equal(question.isSample, true);
    assert.ok(getJurisdiction(question.jurisdictionId));
    assert.ok(['new', 'replied', 'resolved'].includes(question.status));
  }
});
