// Run with: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  RECIPIENTS,
  getRecipient,
  recipientsForArea,
  suggestRecipient,
} from '../src/data/recipients.js';
import { JURISDICTIONS } from '../src/data/jurisdictions.js';
import { TOPICS } from '../src/data/topics.js';

test('only IDs on the fixed list resolve; anything else is blocked', () => {
  assert.ok(getRecipient('loudoun-infrastructure'));
  assert.equal(getRecipient('no-such-id'), null);
  // A free-typed address can never become a recipient.
  assert.equal(getRecipient('someone@loudoun.gov'), null);
  assert.equal(getRecipient(''), null);
  assert.equal(getRecipient(null), null);
});

test('every recipient address is a sample @example.org placeholder', () => {
  for (const recipient of RECIPIENTS) {
    assert.match(
      recipient.email,
      /^sample-[a-z0-9-]+@example\.org$/,
      `${recipient.id} must use a sample example.org address`
    );
  }
});

test('each area has one recipient per group and unique IDs and emails', () => {
  for (const jurisdiction of JURISDICTIONS) {
    const areaRecipients = recipientsForArea(jurisdiction.id);
    assert.equal(areaRecipients.length, 4, `${jurisdiction.id} should have 4 recipients`);
    assert.ok(areaRecipients.some((item) => item.isFallback), `${jurisdiction.id} needs a catch-all`);
    for (const recipient of areaRecipients) {
      assert.equal(recipient.jurisdiction, jurisdiction.id);
      assert.ok(recipient.name.includes(jurisdiction.short), `${recipient.id} name should name the area`);
    }
  }
  assert.equal(new Set(RECIPIENTS.map((item) => item.id)).size, RECIPIENTS.length);
  assert.equal(new Set(RECIPIENTS.map((item) => item.email)).size, RECIPIENTS.length);
});

test('every known topic resolves to a recipient in every area', () => {
  for (const jurisdiction of JURISDICTIONS) {
    for (const topic of TOPICS) {
      const suggestion = suggestRecipient(topic.id, jurisdiction.id);
      assert.ok(suggestion, `${topic.id} in ${jurisdiction.id} must resolve`);
      assert.ok(
        RECIPIENTS.includes(suggestion),
        'a suggestion must come from the fixed list'
      );
    }
  }
});

test('suggestions follow the category, and areas route separately', () => {
  assert.equal(suggestRecipient('roads', 'loudoun').id, 'loudoun-infrastructure');
  assert.equal(suggestRecipient('schools', 'loudoun').id, 'loudoun-community');
  assert.equal(suggestRecipient('housing', 'fairfax').id, 'fairfax-services');
  // Federal-topic catch-all: privacy resolves to the area's general recipient.
  assert.equal(suggestRecipient('privacy', 'fairfax').id, 'fairfax-general');
  // The same topic in another area must not return Loudoun's recipient.
  assert.notEqual(suggestRecipient('roads', 'fairfax').id, 'loudoun-infrastructure');
  // Unknown area: no recipient, so a send must be blocked rather than guessed.
  assert.equal(suggestRecipient('roads', 'not-an-area'), null);
});
