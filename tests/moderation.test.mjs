// Run with: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { csvFileName, pollResultsCsv, toCsv } from '../src/lib/csv.js';
import {
  containsThreats,
  findBlockedWords,
  rateLimitOk,
} from '../src/lib/moderation.js';
import { isGovEmail } from '../src/data/accounts.js';

const POLL = {
  id: 'poll-1',
  question: 'Which park hours work for you?',
  type: 'single',
  audience: ['loudoun', 'fairfax'],
  status: 'open',
  isSample: true,
};

const TALLY = {
  total: 10,
  options: [
    { id: 'a', label: 'Sunrise, to sunset', count: 6, share: 60 },
    { id: 'b', label: 'Until 9 p.m.', count: 4, share: 40 },
  ],
  jurisdictions: [{ id: 'loudoun', label: 'Loudoun', count: 7, share: 70 }],
};

test('CSV escapes commas, quotes, and newlines', () => {
  const csv = toCsv([
    ['plain', 'has, comma', 'has "quotes"', 'line\nbreak'],
    [1, 2, 3],
  ]);
  assert.equal(
    csv,
    'plain,"has, comma","has ""quotes""","line\nbreak"\n1,2,3'
  );
});

test('poll CSV carries aggregates, sample label, and no voter identity', () => {
  const csv = pollResultsCsv(POLL, TALLY, '2026-10-23T18:00:00.000Z');
  assert.ok(csv.includes('Which park hours work for you?'));
  assert.ok(csv.includes('"Sunrise, to sunset",6,60'));
  assert.ok(csv.includes('Includes sample data,yes - sample numbers plus this device'));
  assert.ok(csv.includes('Loudoun,7,70'));
  assert.ok(!/name|email|account|resident\s*id/i.test(csv));
  assert.match(csvFileName(POLL, '2026-10-23T18:00:00.000Z'), /^civlink-which-park-hours-work-for-you-2026-10-23\.csv$/);
});

test('basic profanity and threat filters are predictable', () => {
  assert.deepEqual(findBlockedWords('This is a stupid plan'), ['stupid']);
  assert.deepEqual(findBlockedWords('Classic analysis'), []);
  assert.equal(containsThreats('I will hurt you'), true);
  assert.equal(containsThreats('Please fix the crosswalk'), false);
});

test('rate limiting counts only the rolling window', () => {
  const now = Date.now();
  const times = [now - 1000, now - 2000, now - 3000];
  assert.equal(rateLimitOk(times, 3, 10 * 60 * 1000, now), false);
  assert.equal(rateLimitOk(times.slice(0, 2), 3, 10 * 60 * 1000, now), true);
  const old = [now - 60 * 60 * 1000, now - 60 * 60 * 1000, now - 60 * 60 * 1000];
  assert.equal(rateLimitOk(old, 3, 10 * 60 * 1000, now), true);
});

test('only .gov addresses pass the format check', () => {
  assert.equal(isGovEmail('staff@fairfaxcounty.gov'), true);
  assert.equal(isGovEmail('staff@sample.gov'), true);
  assert.equal(isGovEmail('staff@agency.gov.example.com'), false);
  assert.equal(isGovEmail('staff@gmail.com'), false);
  assert.equal(isGovEmail('not an email'), false);
  assert.equal(isGovEmail('a@b.gov'), true);
  assert.equal(isGovEmail('a@.gov'), false);
});
