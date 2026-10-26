// Routing targets for resident issue reports.
//
// Every entry is a real public office of the locality it serves, with the
// office's official website. Email addresses are the published public
// addresses listed on the office's own contact pages (verified 2026-10-25);
// offices without a published general inbox carry their website instead.
// Submissions may only pass a recipient ID from this list; a free-typed
// address never reaches the send step (see getRecipient, which returns null
// for anything not in this list).

import { JURISDICTIONS } from './jurisdictions.js';
import { TOPICS } from './topics.js';

// National agencies that serve every locality. Roads on state-maintained
// routes go to VDOT no matter which locality a resident picked.
const SHARED_OFFICES = {
  roads: {
    name: 'Virginia Department of Transportation (VDOT)',
    url: 'https://www.vdot.virginia.gov',
    urlLabel: 'vdot.virginia.gov',
    email: null,
  },
};

// Topic coverage. `government` is the locality's main governing body and the
// catch-all: county boards and city councils handle land use, taxes,
// elections, budgets, public safety oversight, and county/city services, and
// they route whatever belongs to a department they fund.
const TOPIC_GROUPS = [
  {
    id: 'roads',
    topics: ['roads'],
    ...SHARED_OFFICES.roads,
  },
  {
    id: 'schools',
    topics: ['schools'],
    // Filled per locality below, because every division has its own division
    // office and website.
  },
  {
    id: 'government',
    topics: ['housing', 'taxes', 'voting', 'utilities', 'environment', 'safety', 'health', 'transit'],
    // Filled per locality below; isFallback is handled in buildRecipients.
  },
];

// Real offices per locality: the governing body, the school division, and (for
// counties) the main county administration. Only published public addresses or
// verified inboxes are used; null means "the office publishes no general
// inbox, so contact it through its website".
const LOCALITY_OFFICES = {
  loudoun: {
    government: {
      name: 'Loudoun County Board of Supervisors',
      url: 'https://www.loudoun.gov/bos',
      urlLabel: 'loudoun.gov',
      email: 'bos@loudoun.gov',
    },
    schools: {
      name: 'Loudoun County Public Schools',
      url: 'https://www.lcps.org',
      urlLabel: 'lcps.org',
      email: null,
    },
  },
  fairfax: {
    government: {
      name: 'Fairfax County Board of Supervisors (Chairman’s Office)',
      url: 'https://www.fairfaxcounty.gov/boardofsupervisors/',
      urlLabel: 'fairfaxcounty.gov',
      email: 'chairman@fairfaxcounty.gov',
    },
    schools: {
      name: 'Fairfax County Public Schools',
      url: 'https://www.fcps.edu',
      urlLabel: 'fcps.edu',
      email: null,
    },
  },
  'prince-william': {
    government: {
      name: 'Prince William Board of County Supervisors (Chair’s Office)',
      url: 'https://www.pwcva.gov/department/board-county-supervisors',
      urlLabel: 'pwcva.gov',
      email: 'chair@pwcgov.org',
    },
    schools: {
      name: 'Prince William County School Board',
      url: 'https://www.pwcs.edu/about/school_board/contact',
      urlLabel: 'pwcs.edu',
      email: 'PWCSclerk@pwcs.edu',
    },
  },
  fauquier: {
    government: {
      name: 'Fauquier County Administration',
      url: 'https://www.fauquiercounty.gov/about-us/contact-us',
      urlLabel: 'fauquiercounty.gov',
      email: 'ginger.obrien@fauquiercounty.gov',
    },
    schools: {
      name: 'Fauquier County Public Schools',
      url: 'https://www.fcps1.org',
      urlLabel: 'fcps1.org',
      email: null,
    },
  },
  rappahannock: {
    government: {
      name: 'Rappahannock County Administration',
      url: 'https://www.rappahannockcountyva.gov/how_do_i/contact_us/',
      urlLabel: 'rappahannockcountyva.gov',
      email: 'admin@rappahannockcountyva.gov',
    },
    schools: {
      name: 'Rappahannock County Public Schools',
      url: 'https://www.rappahannockschools.us/contact',
      urlLabel: 'rappahannockschools.us',
      email: 'info@rappahannockschools.us',
    },
  },
  manassas: {
    government: {
      name: 'Manassas City Council',
      url: 'https://www.manassasva.gov/connect/mayor_and_council/mayor_council_directory.php',
      urlLabel: 'manassasva.gov',
      email: 'mayorandcouncil@manassasva.gov',
    },
    schools: {
      name: 'Manassas City Public Schools',
      url: 'https://www.mcpsva.org',
      urlLabel: 'mcpsva.org',
      email: 'info@mcpsva.org',
    },
  },
  'manassas-park': {
    government: {
      name: 'Manassas Park Governing Body',
      url: 'https://www.manassasparkva.gov/government/governing_body/index.php',
      urlLabel: 'manassasparkva.gov',
      email: 'l.conner@manassasparkva.gov',
    },
    schools: {
      name: 'Manassas Park City Schools',
      url: 'https://www.mpark.net',
      urlLabel: 'mpark.net',
      email: null,
    },
  },
  arlington: {
    government: {
      name: 'Arlington County Board',
      url: 'https://www.arlingtonva.us/Government/County-Board',
      urlLabel: 'arlingtonva.us',
      email: 'countyboard@arlingtonva.us',
    },
    schools: {
      name: 'Arlington Public Schools',
      url: 'https://www.apsva.us/contact-aps/',
      urlLabel: 'apsva.us',
      email: 'engage@apsva.us',
    },
  },
};

const covered = new Set(TOPIC_GROUPS.flatMap((group) => group.topics));
TOPICS.filter((topic) => !covered.has(topic.id)).forEach((topic) =>
  TOPIC_GROUPS[TOPIC_GROUPS.length - 1].topics.push(topic.id)
);

function buildRecipients() {
  const list = [];
  for (const jurisdiction of JURISDICTIONS) {
    for (const group of TOPIC_GROUPS) {
      const office =
        LOCALITY_OFFICES[jurisdiction.id][group.id] || SHARED_OFFICES[group.id];
      list.push({
        id: `${jurisdiction.id}-${group.id}`,
        name: office.name,
        jurisdiction: jurisdiction.id,
        categories: group.topics,
        email: office.email,
        url: office.url,
        urlLabel: office.urlLabel,
        isFallback: group.id === 'government',
      });
    }
  }
  return list;
}

export const RECIPIENTS = buildRecipients();

const BY_ID = new Map(RECIPIENTS.map((item) => [item.id, item]));

// Only an ID from the fixed list resolves. Anything else — including a
// free-typed address or a manipulated ID — returns null and is rejected
// before an issue can be sent.
export function getRecipient(id) {
  return BY_ID.get(id) || null;
}

export function recipientsForArea(jurisdictionId) {
  return RECIPIENTS.filter((item) => item.jurisdiction === jurisdictionId);
}

// Exact topic match first, then the area's governing-body recipient. Unknown
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
