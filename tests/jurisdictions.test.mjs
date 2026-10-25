// Run with: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DISTRICT_INFO,
  JURISDICTIONS,
  getJurisdiction,
  labelForVA10,
} from '../src/data/jurisdictions.js';

const IDS = new Set(JURISDICTIONS.map((item) => item.id));

test('every locality has the fields the screens use', () => {
  for (const item of JURISDICTIONS) {
    assert.ok(item.id, 'missing id');
    assert.ok(item.name, `${item.id} missing name`);
    assert.ok(item.short, `${item.id} missing short name`);
    assert.ok(['county', 'city'].includes(item.type), `${item.id} has an unknown type`);
    assert.ok(['full', 'partial', 'no'].includes(item.inVA10), `${item.id} has an unknown VA-10 flag`);
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

test('district facts match the current map', () => {
  assert.equal(getJurisdiction('loudoun').inVA10, 'full');
  assert.equal(getJurisdiction('fauquier').inVA10, 'full');
  assert.equal(getJurisdiction('rappahannock').inVA10, 'full');
  assert.equal(getJurisdiction('manassas').inVA10, 'full');
  assert.equal(getJurisdiction('manassas-park').inVA10, 'full');
  assert.equal(getJurisdiction('fairfax').inVA10, 'partial');
  assert.equal(getJurisdiction('prince-william').inVA10, 'partial');
  assert.equal(getJurisdiction('arlington').inVA10, 'no');
  assert.equal(labelForVA10('no'), 'Outside VA-10 (VA-8). Supported as an expansion area.');
  assert.equal(labelForVA10('partial'), 'Part of this county is in VA-10');
  assert.equal(getJurisdiction('does-not-exist'), null);
  assert.equal(new Set(JURISDICTIONS.map((item) => item.id)).size, JURISDICTIONS.length);
});

test('Arlington is described as an expansion area and never as VA-10', () => {
  const arlington = getJurisdiction('arlington');
  assert.ok(arlington.note.includes('8th District'));
  assert.ok(arlington.note.includes('not VA-10'));
  assert.equal(arlington.inVA10, 'no');
});

test('district info has a source and a lookup link', () => {
  assert.ok(/^https:\/\//.test(DISTRICT_INFO.sourceUrl));
  assert.ok(/^https:\/\//.test(DISTRICT_INFO.lookupUrl));
  assert.ok(DISTRICT_INFO.pilotNote.includes('Virginia’s 10th'));
  assert.ok(DISTRICT_INFO.boundaryNote.includes('VA-8'));
  assert.ok(IDS.has('fairfax') && IDS.has('arlington'));
});
