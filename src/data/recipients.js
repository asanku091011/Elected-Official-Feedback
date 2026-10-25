// Sample delivery targets for routed issue reports.
//
// These addresses are placeholder inboxes (all @example.org) for the demo
// email preview. They are NOT real government email addresses — the real
// office and its official website stay on the routing screen.
//
// The list is fixed and generated from the known areas and three topic
// groups. Submission code may only pass a recipient ID from this list; a
// free-typed address never reaches the send step (see getRecipient, which
// returns null for anything not in this list).

import { JURISDICTIONS } from './jurisdictions.js';
import { TOPICS } from './topics.js';

// Which sample office handles which topics. The three groups cover explicit
// topic IDs; anything uncovered (privacy, immigration, benefits, and any new
// topic added later) falls through to the catch-all "general" recipient, so a
// suggestion always exists for every known topic and area.
const TOPIC_GROUPS = [
  {
    id: 'infrastructure',
    officeName: 'Roads & Infrastructure (sample)',
    topics: ['roads', 'transit', 'utilities', 'environment'],
  },
  {
    id: 'community',
    officeName: 'Schools & Community Services (sample)',
    topics: ['schools', 'safety', 'health'],
  },
  {
    id: 'services',
    officeName: 'Housing, Taxes & Elections (sample)',
    topics: ['housing', 'taxes', 'voting'],
  },
];

// The catch-all keeps its own group so unmatched topics still get a recipient.
const GENERAL_GROUP = {
  id: 'general',
  officeName: 'Resident Services (sample)',
};

const covered = new Set(TOPIC_GROUPS.flatMap((group) => group.topics));
const fallbackTopics = TOPICS.filter((topic) => !covered.has(topic.id)).map((topic) => topic.id);

function buildRecipients() {
  const list = [];
  for (const jurisdiction of JURISDICTIONS) {
    for (const group of [...TOPIC_GROUPS, GENERAL_GROUP]) {
      list.push({
        id: `${jurisdiction.id}-${group.id}`,
        name: `${jurisdiction.short} ${group.officeName}`,
        jurisdiction: jurisdiction.id,
        categories: group === GENERAL_GROUP ? fallbackTopics : group.topics,
        email: `sample-${group.id}-${jurisdiction.id}@example.org`,
        isFallback: group === GENERAL_GROUP,
      });
    }
  }
  return list;
}

export const RECIPIENTS = buildRecipients();

const BY_ID = new Map(RECIPIENTS.map((item) => [item.id, item]));

// Only an ID from the fixed list resolves. Anything else — including a
// free-typed address or a manipulated ID — returns null and is rejected
// before an issue can be "sent".
export function getRecipient(id) {
  return BY_ID.get(id) || null;
}

export function recipientsForArea(jurisdictionId) {
  return RECIPIENTS.filter((item) => item.jurisdiction === jurisdictionId);
}

// Exact topic match first, then the area's catch-all recipient. Unknown
// topics still resolve to the catch-all; unknown areas return null and callers
// must show an error instead of sending.
export function suggestRecipient(topicId, jurisdictionId) {
  const areaRecipients = recipientsForArea(jurisdictionId);
  if (areaRecipients.length === 0) return null;
  const exact = areaRecipients.find(
    (item) => Array.isArray(item.categories) && item.categories.includes(topicId)
  );
  if (exact) return exact;
  return areaRecipients.find((item) => item.isFallback) || null;
}
