// Run with: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { summarize, newestFirst } from '../src/lib/aggregate.js';
import { makeReference, formatRelative, formatDate, countWords } from '../src/lib/format.js';
import { LEVELS } from '../src/data/offices.js';

const sample = [
  {
    id: '1',
    topicId: 'roads',
    level: 'state',
    createdAt: '2026-10-01T10:00:00.000Z',
    message: 'Pothole on our street.',
  },
  {
    id: '2',
    topicId: 'roads',
    level: 'state',
    createdAt: '2026-10-03T10:00:00.000Z',
    message: 'Second pothole.',
  },
  {
    id: '3',
    topicId: 'schools',
    level: 'local',
    createdAt: '2026-10-02T10:00:00.000Z',
    message: 'Bus route question.',
  },
];

test('an empty dashboard reports zero without dividing by zero', () => {
  const summary = summarize([]);
  assert.equal(summary.total, 0);
  assert.deepEqual(summary.levels, []);
  assert.deepEqual(summary.topics, []);
  assert.equal(summary.topTopic, null);
  assert.equal(summary.latest, null);
});

test('totals, shares, and ordering are correct', () => {
  const summary = summarize(sample);
  assert.equal(summary.total, 3);

  assert.deepEqual(
    summary.levels.map((level) => [level.id, level.count, level.share]),
    [
      ['local', 1, 33],
      ['state', 2, 67],
    ]
  );

  // Levels keep the same order the app uses everywhere else.
  const order = LEVELS.map((level) => level.id);
  assert.deepEqual(
    summary.levels.map((level) => level.id),
    order.filter((id) => ['local', 'state'].includes(id))
  );

  assert.equal(summary.topics[0].id, 'roads');
  assert.equal(summary.topics[0].count, 2);
  assert.equal(summary.topics[0].share, 67);
  assert.equal(summary.topTopic.title, 'Roads & traffic');
});

test('newestFirst sorts without mutating the input', () => {
  const sorted = newestFirst(sample);
  assert.deepEqual(sorted.map((item) => item.id), ['2', '3', '1']);
  assert.deepEqual(sample.map((item) => item.id), ['1', '2', '3']);
  assert.equal(summarize(sample).latest.id, '2');
});

test('an unknown topic id still produces a row', () => {
  const summary = summarize([{ id: '9', topicId: 'gone', level: 'local', createdAt: '2026-10-01', message: 'x' }]);
  assert.equal(summary.topics[0].title, 'Other');
  assert.equal(summary.topics[0].count, 1);
});

test('reference numbers are short, readable, and never repeat', () => {
  const existing = [];
  for (let i = 0; i < 50; i += 1) {
    const ref = makeReference(existing);
    assert.match(ref, /^CIV-[A-HJ-NP-Z2-9]{5}$/);
    assert.equal(existing.includes(ref), false);
    existing.push(ref);
  }
  // A taken value is skipped rather than returned again.
  const taken = ['CIV-ABCDE'];
  assert.notEqual(makeReference(taken), 'CIV-ABCDE');
});

test('dates are formatted for humans', () => {
  assert.equal(formatDate('2026-10-20T12:00:00.000Z'), 'Oct 20, 2026');
  assert.equal(formatDate('not a date'), 'Unknown date');
  const now = new Date('2026-10-20T12:00:00.000Z').getTime();
  assert.equal(formatRelative('2026-10-20T11:59:30.000Z', now), 'Just now');
  assert.equal(formatRelative('2026-10-20T11:30:00.000Z', now), '30 min ago');
  assert.equal(formatRelative('2026-10-20T08:00:00.000Z', now), '4 hr ago');
});

test('word counting ignores extra whitespace', () => {
  assert.equal(countWords('   '), 0);
  assert.equal(countWords('  one   two  '), 2);
});
