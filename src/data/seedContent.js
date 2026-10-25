// Sample content for the Official Portal prototype.
//
// None of this comes from a real government office. Every seeded poll and
// announcement is marked `isSample: true`, and the portal shows a permanent
// banner saying so. Counts in `sampleResults` are made-up sample numbers so the
// results screen has something to draw; they are labeled "sample" wherever they
// appear and are never presented as real constituent responses.

export const CATEGORIES = [
  { id: 'services', label: 'County services' },
  { id: 'safety', label: 'Public safety' },
  { id: 'parks', label: 'Parks & recreation' },
  { id: 'schools', label: 'Schools & libraries' },
  { id: 'transit', label: 'Transportation & transit' },
  { id: 'general', label: 'General update' },
];

export function categoryLabel(id) {
  const found = CATEGORIES.find((item) => item.id === id);
  return found ? found.label : 'General update';
}

export const POLL_TYPES = [
  { id: 'single', label: 'Pick one' },
  { id: 'multiple', label: 'Pick any that apply' },
  { id: 'rating', label: '1 to 5 rating' },
];

export const POLL_STATUSES = ['draft', 'scheduled', 'open', 'closed'];

const POLLS = [
  {
    id: 'poll-park-hours',
    question: 'Which park hours would work best for your household this fall?',
    description:
      'Parks close earlier when daylight is shorter. This is a sample poll about a routine scheduling question, not a real county survey.',
    type: 'single',
    options: [
      { id: 'sunrise-sunset', label: 'Sunrise to sunset' },
      { id: 'seven-pm', label: 'Until 7 p.m. on weekdays' },
      { id: 'nine-pm', label: 'Until 9 p.m. on weekdays' },
    ],
    audience: ['loudoun', 'fairfax', 'fauquier'],
    opensAt: '2026-10-19T13:00:00.000Z',
    closesAt: '2026-11-06T23:59:00.000Z',
    status: 'open',
    createdBy: 'acct-official',
    isSample: true,
    sampleResults: {
      total: 24,
      byOption: { 'sunrise-sunset': 6, 'seven-pm': 9, 'nine-pm': 9 },
      byJurisdiction: { loudoun: 15, fairfax: 6, fauquier: 3 },
    },
  },
  {
    id: 'poll-library-evenings',
    question: 'Would you use a monthly evening library program for students?',
    description:
      'A sample question about library hours. It is here to show the “not enough responses yet” rule: fewer than five responses hide the results.',
    type: 'single',
    options: [
      { id: 'yes', label: 'Yes, I would attend' },
      { id: 'maybe', label: 'Maybe, depending on the topic' },
      { id: 'no', label: 'No, evenings do not work for us' },
    ],
    audience: ['loudoun', 'fairfax'],
    opensAt: '2026-10-20T13:00:00.000Z',
    closesAt: '2026-10-30T23:59:00.000Z',
    status: 'open',
    createdBy: 'acct-official',
    isSample: true,
    sampleResults: {
      total: 3,
      byOption: { yes: 2, maybe: 1, no: 0 },
      byJurisdiction: { loudoun: 2, fairfax: 1 },
    },
  },
  {
    id: 'poll-bus-service',
    question: 'Which of these would make evening bus service easier to use?',
    description:
      'A closed sample poll. Close polls show final results instead of accepting new responses.',
    type: 'multiple',
    options: [
      { id: 'later-hours', label: 'Later service hours' },
      { id: 'more-signs', label: 'Better signs at stops' },
      { id: 'phone-updates', label: 'Text or phone updates' },
      { id: 'bike-racks', label: 'More bike racks on buses' },
    ],
    audience: ['loudoun', 'prince-william', 'fairfax', 'manassas', 'manassas-park'],
    opensAt: '2026-09-26T13:00:00.000Z',
    closesAt: '2026-10-10T23:59:00.000Z',
    status: 'closed',
    createdBy: 'acct-official',
    isSample: true,
    sampleResults: {
      total: 41,
      byOption: { 'later-hours': 21, 'more-signs': 12, 'phone-updates': 24, 'bike-racks': 7 },
      byJurisdiction: {
        loudoun: 18,
        'prince-william': 9,
        fairfax: 8,
        manassas: 4,
        'manassas-park': 2,
      },
    },
  },
  {
    id: 'poll-pothole-reporting',
    question: 'How easy was it to report a pothole on a county road?',
    description:
      'A scheduled sample poll that opens later, so it does not appear in the resident feed yet.',
    type: 'rating',
    options: [
      { id: '1', label: '1 - Very hard' },
      { id: '2', label: '2' },
      { id: '3', label: '3 - Neutral' },
      { id: '4', label: '4' },
      { id: '5', label: '5 - Very easy' },
    ],
    audience: ['loudoun', 'fauquier', 'rappahannock'],
    opensAt: '2026-10-27T13:00:00.000Z',
    closesAt: '2026-11-10T23:59:00.000Z',
    status: 'scheduled',
    createdBy: 'acct-official',
    isSample: true,
    sampleResults: { total: 0, byOption: {}, byJurisdiction: {} },
  },
];

const ANNOUNCEMENTS = [
  {
    id: 'ann-leaf-collection',
    title: 'Fall leaf collection starts November 2',
    body:
      'Leaf collection runs on a four-week schedule by neighborhood. Put leaves in paper bags at the curb before 6 a.m. on your pickup day. Bags set out late wait until the next pass.\n\nThis is sample text for the prototype, not a real county notice.',
    category: 'services',
    audience: ['loudoun'],
    status: 'published',
    publishAt: '2026-10-21T13:00:00.000Z',
    createdBy: 'acct-official',
    isSample: true,
  },
  {
    id: 'ann-library-hours',
    title: 'Library branches add study hours during exam week',
    body:
      'Two branches would stay open until 9 p.m. for three evenings during exam week, with a quiet room set aside for students. Times and branches would be posted on the library system’s own site.\n\nThis is sample text for the prototype, not a real library notice.',
    category: 'schools',
    audience: ['loudoun', 'fairfax'],
    status: 'published',
    publishAt: '2026-10-22T13:00:00.000Z',
    createdBy: 'acct-official',
    isSample: true,
  },
  {
    id: 'ann-winter-prep',
    title: 'Winter weather preparedness week',
    body:
      'A sample scheduled announcement: it is set to publish on November 2 and stays hidden from residents until then.',
    category: 'safety',
    audience: ['loudoun', 'fauquier', 'rappahannock', 'fairfax', 'prince-william', 'manassas', 'manassas-park'],
    status: 'scheduled',
    publishAt: '2026-11-02T13:00:00.000Z',
    createdBy: 'acct-official',
    isSample: true,
  },
  {
    id: 'ann-park-townhall',
    title: 'Draft: park improvements conversation',
    body:
      'A draft that has not been published. Residents never see drafts. Edit it or publish it from the announcements screen.',
    category: 'parks',
    audience: ['loudoun'],
    status: 'draft',
    publishAt: null,
    createdBy: 'acct-official',
    isSample: true,
  },
];

const QUESTIONS = [
  {
    id: 'q-crosswalk',
    jurisdictionId: 'loudoun',
    category: 'transit',
    body:
      'Could the county add a marked crosswalk near the middle school? Cars turn quickly there in the morning and students cross in the dark.',
    authorLabel: 'Sample resident',
    createdAt: '2026-10-22T18:20:00.000Z',
    status: 'new',
    reply: null,
    isSample: true,
  },
  {
    id: 'q-leaf-bags',
    jurisdictionId: 'loudoun',
    category: 'services',
    body: 'Are paper bags required for leaf pickup, or can I use reusable bins?',
    authorLabel: 'Sample resident',
    createdAt: '2026-10-21T15:05:00.000Z',
    status: 'replied',
    reply: {
      body:
        'Paper bags are required because the leaves are composted with the bag. Reusable bins cannot go through the vacuum truck. This reply is sample text.',
      isPublic: true,
      repliedAt: '2026-10-21T18:40:00.000Z',
      repliedBy: 'acct-official',
    },
    isSample: true,
  },
];

export const SEED_POLLS = POLLS;
export const SEED_ANNOUNCEMENTS = ANNOUNCEMENTS;
export const SEED_QUESTIONS = QUESTIONS;

// A fresh copy for the app state, so edits never mutate the seed constants.
export function seedCivicData() {
  return {
    polls: JSON.parse(JSON.stringify(POLLS)),
    announcements: JSON.parse(JSON.stringify(ANNOUNCEMENTS)),
    questions: JSON.parse(JSON.stringify(QUESTIONS)),
  };
}
