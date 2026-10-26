// Run with: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { JURISDICTIONS, getJurisdiction, jurisdictionName } from '../src/data/jurisdictions.js';

test('every locality has the fields the screens use', () => {
  for (const item of JURISDICTIONS) {
    assert.ok(item.id, 'missing id');
    assert.ok(item.name, `${item.id} missing name`);
    assert.ok(item.short, `${item.id} missing short name`);
    assert.ok(['county', 'city'].includes(item.type), `${item.id} has an unknown type`);
    assert.ok(/^https:\/\//.test(item.officialSiteUrl), `${item.id} official site is not https`);
    assert.ok(/^https:\/\//.test(item.sourceUrl), `${item.id} source is not https`);
    assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(item.lastVerified), `${item.id} needs a YYYY-MM-DD check date`);
    assert.ok(Number.isFinite(new Date(`${item.lastVerified}T12:00:00`).getTime()));
    assert.ok(item.note.length > 40, `${item.id} needs a real note`);
    assert.ok(item.links.length >= 2, `${item.id} needs at least two official links`);
  }
});

test('links use https and known kinds', () => {
  const kinds = new Set(['board', 'meetings', 'calendar', 'comment', 'contact']);
  for (const item of JURISDICTIONS) {
    for (const link of item.links) {
      assert.ok(/^https:\/\//.test(link.url), `${item.id} link is not https: ${link.url}`);
      assert.ok(kinds.has(link.kind), `${item.id} has an unknown link kind ${link.kind}`);
      assert.ok(link.label && link.note, `${item.id} link needs a label and note`);
    }
  }
});

test('the fixed list resolves exact IDs and nothing else', () => {
  assert.equal(getJurisdiction('fairfax')?.short, 'Fairfax');
  assert.equal(getJurisdiction('arlington')?.type, 'county');
  assert.equal(getJurisdiction('does-not-exist'), null);
  assert.equal(new Set(JURISDICTIONS.map((item) => item.id)).size, JURISDICTIONS.length);
  // Names come from the fixed list, never a free-typed value.
  assert.equal(jurisdictionName('fairfax'), 'Fairfax');
  assert.equal(jurisdictionName('not-an-area'), 'your area');
});
