// Run with: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { TOPICS, getTopic } from '../src/data/topics.js';
import { LEVELS, OFFICES, getOffice, officesForLevel } from '../src/data/offices.js';

test('every topic routes to a real office at the topic level', () => {
  for (const topic of TOPICS) {
    const office = getOffice(topic.officeId);
    assert.ok(office, `${topic.id} points at missing office ${topic.officeId}`);
    assert.equal(
      office.level,
      topic.level,
      `${topic.id} says level ${topic.level} but ${office.name} is ${office.level}`
    );
    assert.ok(topic.why.length > 40, `${topic.id} needs a real explanation`);
    assert.ok(topic.canDo.length >= 2, `${topic.id} needs at least two responsibilities`);
    assert.ok(topic.limit.length > 20, `${topic.id} needs an honest limit`);
  }
});

test('secondary offices exist and are not the primary office', () => {
  for (const topic of TOPICS) {
    for (const officeId of topic.also) {
      assert.ok(OFFICES[officeId], `${topic.id} references missing secondary office ${officeId}`);
      assert.notEqual(officeId, topic.officeId, `${topic.id} lists its primary office twice`);
    }
  }
});

test('topic ids are unique and lookups work', () => {
  const ids = TOPICS.map((topic) => topic.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate topic id');
  assert.equal(getTopic('roads').title, 'Roads & traffic');
  assert.equal(getTopic('does-not-exist'), null);
});

test('every level of government has at least one office', () => {
  for (const level of LEVELS) {
    assert.ok(officesForLevel(level.id).length > 0, `no offices listed for ${level.id}`);
  }
});

test('office data is complete and uses https links', () => {
  for (const office of Object.values(OFFICES)) {
    assert.ok(office.name.length > 3, `${office.id} needs a name`);
    assert.ok(office.role.length > 20, `${office.id} needs a role description`);
    assert.ok(office.url.startsWith('https://'), `${office.id} should link over https`);
    assert.ok(office.urlLabel.length > 3, `${office.id} needs a short link label`);
  }
});
