// Run with: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  reviewDraft,
  hasThreat,
  findPlaceholders,
  MAX_LENGTH,
  MIN_LENGTH,
} from '../src/lib/validate.js';

const GOOD_MESSAGE =
  'The streetlight at the corner of our block has been dark for three weeks. It is hard to see children crossing in the evening. Please ask VDOT to repair it.';

test('a short but real message is accepted', () => {
  const result = reviewDraft({ message: GOOD_MESSAGE });
  assert.equal(result.isValid, true);
  assert.deepEqual(result.warnings, []);
});

test('empty and too-short messages are rejected with a helpful reason', () => {
  assert.equal(reviewDraft({ message: '   ' }).isValid, false);
  const short = reviewDraft({ message: 'Fix it' });
  assert.equal(short.isValid, false);
  assert.match(short.errors.message, new RegExp(String(MIN_LENGTH)));
});

test('messages over the limit are rejected', () => {
  const long = reviewDraft({ message: 'a'.repeat(MAX_LENGTH + 1) });
  assert.equal(long.isValid, false);
  assert.match(long.errors.message, /too long/i);
});

test('threats are blocked', () => {
  assert.equal(hasThreat('I will hurt you if this is not fixed'), true);
  const result = reviewDraft({
    message: `${GOOD_MESSAGE} I will hurt you if nothing changes.`,
  });
  assert.equal(result.isValid, false);
  assert.match(result.errors.message, /threatening/i);
});

test('ordinary civic language is not flagged as a threat', () => {
  assert.equal(hasThreat('This intersection is dangerous and someone could get hurt.'), false);
  assert.equal(reviewDraft({ message: GOOD_MESSAGE }).isValid, true);
});

test('ZIP codes must be five digits when provided', () => {
  assert.equal(reviewDraft({ message: GOOD_MESSAGE, zip: '2017' }).isValid, false);
  assert.equal(reviewDraft({ message: GOOD_MESSAGE, zip: '20176' }).isValid, true);
  assert.equal(reviewDraft({ message: GOOD_MESSAGE, zip: '' }).isValid, true);
});

test('choosing to include a name requires a name', () => {
  const result = reviewDraft({ message: GOOD_MESSAGE, includeName: true, name: '   ' });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.name);
  assert.equal(
    reviewDraft({ message: GOOD_MESSAGE, includeName: true, name: 'Ari Chen' }).isValid,
    true
  );
});

test('unfilled template placeholders produce a warning, not a block', () => {
  const result = reviewDraft({
    message: 'I live in [my town] and the issue is [the problem]. Please fix the sidewalk near the school.',
  });
  assert.equal(result.isValid, true);
  assert.equal(result.warnings.length, 1);
  assert.match(result.warnings[0], /placeholder/i);
  assert.deepEqual(findPlaceholders('[a] and [b]'), ['[a]', '[b]']);
});

test('shouting and links produce warnings', () => {
  const shouting = reviewDraft({
    message: 'THE LIGHT ON OUR STREET HAS BEEN OUT FOR THREE WEEKS AND NOBODY WILL FIX IT.',
  });
  assert.equal(shouting.isValid, true);
  assert.match(shouting.warnings.join(' '), /capital letters/i);

  const linked = reviewDraft({ message: `${GOOD_MESSAGE} Details: https://example.com/report` });
  assert.equal(linked.isValid, true);
  assert.match(linked.warnings.join(' '), /links/i);
});
