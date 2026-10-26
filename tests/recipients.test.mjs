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
  assert.ok(getRecipient('loudoun-schools'));
  assert.equal(getRecipient('no-such-id'), null);
  // A free-typed address can never become a recipient.
  assert.equal(getRecipient('bos@loudoun.gov'), null);
  assert.equal(getRecipient(''), null);
  assert.equal(getRecipient(null), null);
});

test('every recipient points at a real office with a public source', () => {
  for (const recipient of RECIPIENTS) {
    // Emails are the office's published public address, or null when the
    // office publishes no general inbox (contact goes through its website).
    assert.ok(
      recipient.email === null || /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(recipient.email),
      `${recipient.id} must be null or a real email address`
    );
    assert.ok(/^https:\/\//.test(recipient.url), `${recipient.id} needs an https office website`);
    assert.ok(recipient.name, `${recipient.id} needs an office name`);
  }
});

test('each area has one recipient per group and unique IDs', () => {
  for (const jurisdiction of JURISDICTIONS) {
    const areaRecipients = recipientsForArea(jurisdiction.id);
    // One shared roads office (VDOT), the area's school division, and the
    // area's governing body as catch-all.
    assert.equal(areaRecipients.length, 3, `${jurisdiction.id} should have 3 recipients`);
    assert.ok(areaRecipients.some((item) => item.isFallback), `${jurisdiction.id} needs a catch-all`);
    assert.ok(
      areaRecipients.some((item) => item.id === `${jurisdiction.id}-roads`),
      `${jurisdiction.id} should route roads to VDOT`
    );
    for (const recipient of areaRecipients) {
      // VDOT's name is a shared state office, so it does not carry the area.
      if (!recipient.isFallback && recipient.id !== `${jurisdiction.id}-roads`) {
        assert.ok(
          recipient.name.includes(jurisdiction.short),
          `${recipient.id} name should name the area`
        );
      }
    }
  }
  assert.equal(new Set(RECIPIENTS.map((item) => item.id)).size, RECIPIENTS.length);
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

test('suggestions follow the topic, and areas route separately', () => {
  // State-maintained roads always go to VDOT, whichever area was picked.
  assert.equal(suggestRecipient('roads', 'loudoun').id, 'loudoun-roads');
  assert.equal(suggestRecipient('roads', 'fairfax').id, 'fairfax-roads');
  // Local topics route to the area's school division or governing body.
  assert.equal(suggestRecipient('schools', 'loudoun').id, 'loudoun-schools');
  assert.equal(suggestRecipient('housing', 'fairfax').id, 'fairfax-government');
  // The same topic in another area must not return Loudoun's recipient.
  assert.notEqual(suggestRecipient('schools', 'fairfax').id, 'loudoun-schools');
  // Unknown area: no recipient, so a send must be blocked rather than guessed.
  assert.equal(suggestRecipient('roads', 'not-an-area'), null);
});
