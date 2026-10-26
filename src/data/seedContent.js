// Announcements, polls, and resident questions that the Official Portal
// starts with. Each record targets the localities listed in `audience`, using
// the same jurisdiction IDs as src/data/jurisdictions.js.

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
    id: 'poll-route-28-timing',
    question: 'Which signal-timing change would help your Route 28 commute most?',
    description:
      'The county and VDOT are retiming signals along Route 28 between Sterling and the Prince William line. Tell us which change matters most for your trip.',
    type: 'single',
    options: [
      { id: 'morning-eb', label: 'Shorter mornings: more green time southbound before 9 a.m.' },
      { id: 'evening-nb', label: 'Shorter evenings: more green time northbound after 4 p.m.' },
      { id: 'offpeak', label: 'Smoother midday flow, even if rush hours stay the same' },
    ],
    audience: ['loudoun'],
    opensAt: '2026-10-19T13:00:00.000Z',
    closesAt: '2026-11-06T23:59:00.000Z',
    status: 'open',
    createdBy: 'acct-official',
  },
  {
    id: 'poll-trail-lighting',
    question: 'Should the W&OD trail gates stay open later on weekends?',
    description:
      'Reston and Herndon residents have asked about trail access hours. Northern Virginia Regional Park Authority will use responses when it reviews the season schedule.',
    type: 'single',
    options: [
      { id: 'current', label: 'Keep current hours' },
      { id: 'weekend', label: 'Stay open two hours later on weekends' },
      { id: 'seasonal', label: 'Follow sunset hours year-round' },
    ],
    audience: ['loudoun', 'fairfax'],
    opensAt: '2026-10-20T13:00:00.000Z',
    closesAt: '2026-11-05T23:59:00.000Z',
    status: 'open',
    createdBy: 'acct-official',
  },
  {
    id: 'poll-connector-routes',
    question: 'Which Fairfax Connector change would you use most?',
    description:
      'The winter service change draft is open for comment through November 14. Pick the adjustment that fits your routine; write to the Board if you need something different.',
    type: 'multiple',
    options: [
      { id: 'later-runs', label: 'Later weekday runs on my route' },
      { id: 'more-frequency', label: 'Buses every 15 minutes instead of 30' },
      { id: 'sunday', label: 'Sunday service on my route' },
      { id: 'stops', label: 'A new stop closer to my neighborhood' },
    ],
    audience: ['fairfax'],
    opensAt: '2026-09-26T13:00:00.000Z',
    closesAt: '2026-10-10T23:59:00.000Z',
    status: 'closed',
    createdBy: 'acct-official',
  },
  {
    id: 'poll-wildlife-crossing',
    question: 'How often do you see deer on Route 50 west of Gilbert’s Corner?',
    description:
      'This four-week count feeds the animal-crossing study for the Route 50 corridor. Every report area counts, even if you only see deer once a week.',
    type: 'rating',
    options: [
      { id: '1', label: '1 - Never' },
      { id: '2', label: '2' },
      { id: '3', label: '3 - Once or twice a week' },
      { id: '4', label: '4' },
      { id: '5', label: '5 - Nearly every trip' },
    ],
    audience: ['loudoun', 'fauquier'],
    opensAt: '2026-10-27T13:00:00.000Z',
    closesAt: '2026-11-10T23:59:00.000Z',
    status: 'scheduled',
    createdBy: 'acct-official',
  },
  {
    id: 'poll-pwcs-start-times',
    question: 'Which school start time works best for your household?',
    description:
      'The School Board is studying a later start for high schools county-wide. Respond so the study reflects household schedules, not just bus routing.',
    type: 'single',
    options: [
      { id: 'keep', label: 'Keep the current start times' },
      { id: 'later-hs', label: 'Move high school starts 45 minutes later' },
      { id: 'later-all', label: 'Move all school starts one hour later' },
    ],
    audience: ['prince-william'],
    opensAt: '2026-10-18T13:00:00.000Z',
    closesAt: '2026-11-08T23:59:00.000Z',
    status: 'open',
    createdBy: 'acct-official',
  },
  {
    id: 'poll-water-report',
    question: 'Did your neighborhood lose water pressure with last Tuesday’s line break?',
    description:
      'Prince William County Service Authority is mapping which streets saw low pressure during the October 20 main break. Results go to the Public Works annual report.',
    type: 'single',
    options: [
      { id: 'none', label: 'No interruption' },
      { id: 'brief', label: 'Brief low pressure (under an hour)' },
      { id: 'long', label: 'Low pressure longer than an hour' },
      { id: 'outage', label: 'Full outage at my address' },
    ],
    audience: ['prince-william', 'manassas', 'manassas-park'],
    opensAt: '2026-10-22T13:00:00.000Z',
    closesAt: '2026-11-01T23:59:00.000Z',
    status: 'open',
    createdBy: 'acct-official',
  },
  {
    id: 'poll-manassas-parking',
    question: 'Which parking change should the Old Town Manassas garage pilot first?',
    description:
      'The garage on Center Street fills before 10 a.m. most weekdays. Pick the fix the city should try during the pilot that runs November through February.',
    type: 'single',
    options: [
      { id: '2hr-free', label: 'Two hours free, then meter rates' },
      { id: 'permit', label: 'First hour free with a resident sticker' },
      { id: 'validation', label: 'Merchants validate parking for customers' },
    ],
    audience: ['manassas'],
    opensAt: '2026-10-21T13:00:00.000Z',
    closesAt: '2026-11-04T23:59:00.000Z',
    status: 'open',
    createdBy: 'acct-official',
  },
  {
    id: 'poll-mps-trails',
    question: 'How should the city spend the matching-trail grant?',
    description:
      'Manassas Park received a state trail grant that requires a resident vote on the design. The grant covers one improvement, so tell us which matters most to your family.',
    type: 'multiple',
    options: [
      { id: 'lights', label: 'Lighted path connections to Lions Park' },
      { id: 'signs', label: 'Signage and wayfinding throughout' },
      { id: 'widen', label: 'Widen the Covington bike path' },
    ],
    audience: ['manassas-park'],
    opensAt: '2026-10-20T13:00:00.000Z',
    closesAt: '2026-11-03T23:59:00.000Z',
    status: 'open',
    createdBy: 'acct-official',
  },
  {
    id: 'poll-aps-zones',
    question: 'Which fall recycling schedule should Arlington adopt in 2027?',
    description:
      'Arlington’s Solid Waste Bureau is reviewing collection routes and wants resident input before the winter budget hearing.',
    type: 'single',
    options: [
      { id: 'weekly', label: 'Keep weekly collection' },
      { id: 'biweekly', label: 'Move to twice-monthly collection with a larger cart' },
      { id: 'sat-drop', label: 'Add a Saturday drop-off site instead' },
    ],
    audience: ['arlington'],
    opensAt: '2026-10-19T13:00:00.000Z',
    closesAt: '2026-11-02T23:59:00.000Z',
    status: 'open',
    createdBy: 'acct-official',
  },
  {
    id: 'poll-garbage-review',
    question: 'How satisfied are you with the county trash transfer station wait?',
    description:
      'The Solid Waste Management Board surveys citizens annually. Results come out at the November Work Session.',
    type: 'rating',
    options: [
      { id: '1', label: '1 - Over 30 minutes' },
      { id: '2', label: '2' },
      { id: '3', label: '3 - 10–30 minutes' },
      { id: '4', label: '4' },
      { id: '5', label: '5 - Under 10 minutes' },
    ],
    audience: ['fauquier', 'rappahannock'],
    opensAt: '2026-10-22T13:00:00.000Z',
    closesAt: '2026-11-12T23:59:00.000Z',
    status: 'open',
    createdBy: 'acct-official',
  },
  {
    id: 'poll-rapp-road-shift',
    question: 'Would later park-and-ride shuttle runs help your commute?',
    description:
      'The county is studying two added shuttle runs a day from the Sperryville park-and-ride lot toward the Front Royal commuter lot. Closes November 13.',
    type: 'single',
    options: [
      { id: 'yes', label: 'Yes, I would use the later hours' },
      { id: 'sometimes', label: 'Maybe, for occasional trips' },
      { id: 'no', label: 'No, the current schedule fits my day' },
    ],
    audience: ['rappahannock'],
    opensAt: '2026-10-18T13:00:00.000Z',
    closesAt: '2026-11-13T23:59:00.000Z',
    status: 'open',
    createdBy: 'acct-official',
  },
  {
    id: 'poll-community-center',
    question: 'Which evening program belongs at the community center first?',
    description:
      'A January pilot is planned out of the evening programming fund. Pick the one you think draws the strongest first-come turn-out.',
    type: 'multiple',
    options: [
      { id: 'esl', label: 'Adult English conversation circle' },
      { id: 'computers', label: 'Open computer lab hours' },
      { id: 'fitness', label: 'Evening senior fitness' },
      { id: 'tutoring', label: 'Homework help table for middle schoolers' },
    ],
    audience: ['manassas', 'manassas-park'],
    opensAt: '2026-10-23T13:00:00.000Z',
    closesAt: '2026-11-09T23:59:00.000Z',
    status: 'open',
    createdBy: 'acct-official',
  },
];

const ANNOUNCEMENTS = [
  {
    id: 'ann-leaf-collection',
    title: 'Fall leaf collection starts November 2 in Sterling, Ashburn, and Leesburg areas',
    body:
      'Leaf collection runs on a four-week schedule by neighborhood. Put leaves in paper bags at the curb before 6 a.m. on your pickup day. Bags set out late wait until the next pass.\n\nBagged leaf drop-off is also open Saturdays 8 a.m. to 4 p.m. through December 13 at the Loudoun County Landfill on Evergreen Mills Road. Questions go to bwsw@loudoun.gov or 703-777-0180.',
    category: 'services',
    audience: ['loudoun'],
    status: 'published',
    publishAt: '2026-10-21T13:00:00.000Z',
    createdBy: 'acct-official',
  },
  {
    id: 'ann-exam-hours',
    title: 'Library branches add study hours during exam week',
    body:
      'Three branches (Ashburn, Cascades, and Rust) stay open until 10 p.m. Tuesday through Thursday, December 9–11, with a quiet room set aside for students. Regular hours resume December 12.\n\nTimes are posted at loudoun.gov/library. Note that study rooms must be booked by 4 p.m. that day at any branch desk.',
    category: 'schools',
    audience: ['loudoun'],
    status: 'published',
    publishAt: '2026-10-22T13:00:00.000Z',
    createdBy: 'acct-official',
  },
  {
    id: 'ann-winter-prep',
    title: 'Winter weather preparedness week: build your emergency kit',
    body:
      'Upcoming snow and ice season reminder: every household should keep a three-day supply of water, food that requires no cooking, flashlights, batteries, and any medicines on hand. Sign up for free local alerts by text by Registering at the county alert page.\n\nThe county opens a warming center whenever town temps sit below 32 °F for three or more hours; shelter locations will be listed here when activated.',
    category: 'safety',
    audience: ['loudoun', 'fauquier', 'rappahannock'],
    status: 'scheduled',
    publishAt: '2026-11-02T13:00:00.000Z',
    createdBy: 'acct-official',
  },
  {
    id: 'ann-park-townhall',
    title: 'Draft: 2027 park improvement community meeting',
    body:
      'Draft announcement from the Director of Parks, Recreation and Community Services. Save as a draft to keep editing, or publish when the meeting logistics are final.',
    category: 'parks',
    audience: ['loudoun'],
    status: 'draft',
    publishAt: null,
    createdBy: 'acct-official',
  },
  {
    id: 'ann-freezing',
    title: 'Fairfax County opens hypothermia-prevention shelter season November 7',
    body:
      'Fairfax County shelters open each night the forecast falls below 32 degrees. Transportation is available from five pickup points; a full schedule and transportation map lives at fairfaxcounty.gov/human-services. If you see someone outdoors in the cold, call 703-691-2131, TTY 711.',
    category: 'safety',
    audience: ['fairfax'],
    status: 'published',
    publishAt: '2026-10-20T13:00:00.000Z',
    createdBy: 'acct-official',
  },
  {
    id: 'ann-braddock-road',
    title: 'Braddock Road corridor: share your thoughts on the draft design by Nov 13',
    body:
      'The draft corridor design for Braddock Road between Peace Haven Lane and Commonwealth Drive is out for review. It proposes a continuous shared-use path, new signals at four intersections, and raised crosswalks at each school crossing.\n\nRead the plan at the county Department of Transportation page and send written comment to braddockroad@fairfaxcounty.gov before November 13.',
    category: 'transit',
    audience: ['fairfax'],
    status: 'published',
    publishAt: '2026-10-23T13:00:00.000Z',
    createdBy: 'acct-official',
  },
  {
    id: 'ann-trail-expansion',
    title: 'Cross County Trail: six new miles of paved path open this weekend',
    body:
      'The extended Cross County Trail from Cold Stream Park to Pillsbury Drive opens Saturday at 9 a.m. after bridge repairs. The 9.2-mile route connects four neighborhoods to the W&OD trail for the first time in one stretch.',
    category: 'parks',
    audience: ['fairfax'],
    status: 'published',
    publishAt: '2026-10-21T13:00:00.000Z',
    createdBy: 'acct-official',
  },
  {
    id: 'ann-pwcs-bus',
    title: 'Bus routes 1 through 24 shift five minutes earlier starting November 9',
    body:
      'Prince William County Public Schools adjusts the pickup window for the routes listed on the transportation site. Riders on shifted routes should be at the stop five minutes earlier. Curbside pickup is unchanged for routes 25 and up.\n\nContact the transportation office at 703-791-0029 with questions.',
    category: 'schools',
    audience: ['prince-william'],
    status: 'published',
    publishAt: '2026-10-22T14:00:00.000Z',
    createdBy: 'acct-official',
  },
  {
    id: 'ann-vote-early',
    title: 'Early voting for the November 3 general election is open through October 31',
    body:
      'Prince William County vote centers accept early ballots Monday through Friday, 8:30 a.m. to 5 p.m., and Saturday, October 31, 9 a.m. to 5 p.m. Bring an acceptable ID; a list is on the registrar’s page.\n\nSame-day registration is available at the vote center only during early voting hours.',
    category: 'general',
    audience: ['prince-william'],
    status: 'published',
    publishAt: '2026-10-20T15:00:00.000Z',
    createdBy: 'acct-official',
  },
  {
    id: 'ann-fauquier-budget',
    title: 'Fauquier County gears up for the annual budget: public survey and November 19 hearing',
    body:
      'The county Administration released the annual survey about the proposed fiscal 2027 operating budget and capital plan. Responses close November 6 and shape the Board of Supervisors’ work session on November 19.\n\nThe public hearing starting at 6:30 p.m. takes comment on spending priorities for schools, public safety and shared services. The proposed budget document is available at the Administration center and online.',
    category: 'general',
    audience: ['fauquier'],
    status: 'published',
    publishAt: '2026-10-23T13:00:00.000Z',
    createdBy: 'acct-official',
  },
  {
    id: 'ann-fauquier-radon',
    title: 'Free radon test kits at the Warrenton library through December 5',
    body:
      'The county Health Department is handing out free home radon test kits at the Fauquier library branch, 11 Winchester Street, Warrenton, while supplies last. Radon is the second-leading cause of lung cancer; the tri-county read sits above the state average.\n\nKits come with instructions and lab-costs included. Questions to the Health Department at 540-422-0003.',
    category: 'health',
    audience: ['fauquier'],
    status: 'published',
    publishAt: '2026-10-22T13:00:00.000Z',
    createdBy: 'acct-official',
  },
  {
    id: 'ann-rapp-burn-ban',
    title: 'Rappahannock County: burning ban lifts October 31; permits still required',
    body:
      'Seasonal burning restrictions end October 31 at 4 p.m. Housekeeping burns before that date need a permit from the Virginia Department of Forestry. After October 31, the three-foot rule applies until the next declared ban.\n\nBurn only after 4 p.m., keep a rake and water source at the site, and call 911 if the fire spreads outside your pile.',
    category: 'safety',
    audience: ['rappahannock'],
    status: 'published',
    publishAt: '2026-10-21T13:00:00.000Z',
    createdBy: 'acct-official',
  },
  {
    id: 'ann-rapp-broadband',
    title: 'County broadband expansion: fiber construction reaches Flint Hill in November',
    body:
      'Crews extend fiber along Route 522 north through October, reaching Flint Hill in early November. Street-level online signup opens when construction finishes your segment; sign up for alerts at the county broadband page to know when service goes live at your address.',
    category: 'services',
    audience: ['rappahannock'],
    status: 'published',
    publishAt: '2026-10-20T13:00:00.000Z',
    createdBy: 'acct-official',
  },
  {
    id: 'ann-manassas-lights',
    title: 'Old Town Manassas holiday lights switch on Friday, November 20',
    body:
      'The annual holiday lighting ceremony begins at 6 p.m. on the museum lawn, with hot cider, the city’s tree lighting, and a visit from Santa. Shops downtown stay open late, and children’s craft tables run until 8 p.m.\n\nFree parking at the garage on Center Street after 5 p.m. on ceremony night.',
    category: 'parks',
    audience: ['manassas'],
    status: 'published',
    publishAt: '2026-10-24T13:00:00.000Z',
    createdBy: 'acct-official',
  },
  {
    id: 'ann-manassas-forum',
    title: 'Manassas City Council election: council candidate forum on October 29',
    body:
      'The candidate forum runs 7 to 8:30 p.m. at the Flight Center, 9431 Association Court. Doors open at 6:30 p.m. All five candidates who qualified for the ballot will appear.\n\nThe forum is moderated by the League of Women Voters. Submit questions beforehand at the city’s official online comment form by Tuesday, October 27.',
    category: 'general',
    audience: ['manassas'],
    status: 'published',
    publishAt: '2026-10-23T13:00:00.000Z',
    createdBy: 'acct-official',
  },
  {
    id: 'ann-mps-roads',
    title: 'Manassas Park: sidewalk repairs on Center Street start November 3',
    body:
      'Crews replace cracked sidewalk panels on Center Street between McAdam and Cushing from November 3 to 7, 7 a.m. to 3 p.m. each day. Sidewalk stays open with a flagger; on-street parking is temporarily closed in the work zone.\n\nMotorists may experience brief delays. Direct questions to the Department of Public Works.',
    category: 'transit',
    audience: ['manassas-park'],
    status: 'published',
    publishAt: '2026-10-22T13:00:00.000Z',
    createdBy: 'acct-official',
  },
  {
    id: 'ann-mps-keister',
    title: 'Keister Elementary earns APP accreditation for the sixth straight year',
    body:
      'The Virginia Department of Education lists George C. Keister Elementary among the schools earning accreditation for the 2026–27 school year. The school will hold a family recognition evening during the next PTO meeting, date to be announced.',
    category: 'schools',
    audience: ['manassas-park'],
    status: 'published',
    publishAt: '2026-10-21T13:00:00.000Z',
    createdBy: 'acct-official',
  },
  {
    id: 'ann-arlington-adoptathon',
    title: 'Arlington adoptathon: meet adoptable dogs this Saturday at the Animal Welfare League',
    body:
      'The Animal Welfare League of Arlington hosts its fall adopt-a-thon Saturday, October 25, from 11 a.m. to 4 p.m. at 2650 South Arlington Mill Drive. Adoption fees are reduced; same-day foster applications are welcome.\n\nAny questions to the Animal Welfare League at 703-931-9241.',
    category: 'general',
    audience: ['arlington'],
    status: 'published',
    publishAt: '2026-10-22T13:00:00.000Z',
    createdBy: 'acct-official',
  },
  {
    id: 'ann-arlington-budget-draft',
    title: 'Draft: 2027 preliminary community-build budget message from the Board chair',
    body:
      'Draft message from the chair of the County Board about the fiscal year budget proposal, schools funding, and the permanent Metrorail maintenance yard. Add the Board meeting details before publishing.',
    category: 'general',
    audience: ['arlington'],
    status: 'draft',
    publishAt: null,
    createdBy: 'acct-official',
  },
  {
    id: 'ann-spanish-help',
    title: 'Protección contra el frío y centros de abrigo gratis en el condado',
    body:
      'Durante el invierno, los centros de abrigo abren cuando la temperatura baje de 32 grados. El condado presta transporte desde cinco puntos de recogida. Los horarios y el mapa de transporte están en la página de servicios humanos del condado.\n\nSi ve a alguien afuera en el frío, llame al 703-691-2131, TTY 711.',
    category: 'safety',
    audience: ['fairfax', 'arlington'],
    status: 'scheduled',
    publishAt: '2026-11-07T13:00:00.000Z',
    createdBy: 'acct-official',
  },
];

const QUESTIONS = [
  {
    id: 'q-crosswalk',
    jurisdictionId: 'loudoun',
    category: 'transit',
    body:
      'Could the county add a marked crosswalk near the middle school? Cars turn quickly there in the morning and students cross in the dark.',
    authorLabel: 'Resident',
    createdAt: '2026-10-22T18:20:00.000Z',
    status: 'new',
    reply: null,
  },
  {
    id: 'q-leaf-bags',
    jurisdictionId: 'loudoun',
    category: 'services',
    body: 'Are paper bags required for leaf pickup, or can I use reusable bins?',
    authorLabel: 'Resident',
    createdAt: '2026-10-21T15:05:00.000Z',
    status: 'replied',
    reply: {
      body:
        'Paper bags are required because the leaves are composted with the bag. Reusable bins cannot go through the vacuum truck. Contact bwsw@loudoun.gov with bag questions.',
      isPublic: true,
      repliedAt: '2026-10-21T18:40:00.000Z',
      repliedBy: 'acct-official',
    },
  },
  {
    id: 'q-fairfax-trail',
    jurisdictionId: 'fairfax',
    category: 'parks',
    body: 'Will the paved Cross County Trail extension be plowed in winter?',
    authorLabel: 'Resident',
    createdAt: '2026-10-20T14:10:00.000Z',
    status: 'replied',
    reply: {
      body:
        'The paved extension reads as part of the regular trail loop and is groomed on the same schedule as the existing section. Ice conditions can still close it temporarily; closures post at the parks page.',
      isPublic: true,
      repliedAt: '2026-10-21T09:15:00.000Z',
      repliedBy: 'acct-official',
    },
  },
  {
    id: 'q-pwcs-bus',
    jurisdictionId: 'prince-william',
    category: 'schools',
    body: 'Route 14 has not shown up on the bus tracker in three mornings. Is it running?',
    authorLabel: 'Resident',
    createdAt: '2026-10-23T07:40:00.000Z',
    status: 'new',
    reply: null,
  },
  {
    id: 'q-fauquier-bins',
    jurisdictionId: 'fauquier',
    category: 'services',
    body: 'The transfer station melted a hole in my trash bag last week. Is the compactor down?',
    authorLabel: 'Resident',
    createdAt: '2026-10-19T15:30:00.000Z',
    status: 'resolved',
    reply: {
      body:
        'The compactor at the site was down for emergency repair on October 18 and has been back operating since October 19. Hours and any closure updates post at the Solid Waste page.',
      isPublic: true,
      repliedAt: '2026-10-21T20:15:00.000Z',
      repliedBy: 'acct-official',
    },
  },
  {
    id: 'q-rapp-sign',
    jurisdictionId: 'rappahannock',
    category: 'transit',
    body: 'The Route 211 westbound stop sign near Sperryville is nearly blocked by brush. Can someone clear it?',
    authorLabel: 'Resident',
    createdAt: '2026-10-22T13:45:00.000Z',
    status: 'new',
    reply: null,
  },
  {
    id: 'q-manassas-garage',
    jurisdictionId: 'manassas',
    category: 'services',
    body: 'Is there a monthly permit option for the Center Street garage before the pilot starts?',
    authorLabel: 'Resident',
    createdAt: '2026-10-23T09:20:00.000Z',
    status: 'new',
    reply: null,
  },
  {
    id: 'q-mps-bridge',
    jurisdictionId: 'manassas-park',
    category: 'transit',
    body: 'The sidewalk where it crosses the creek bridge has a lip. Two kids have tripped on it.',
    authorLabel: 'Resident',
    createdAt: '2026-10-21T16:55:00.000Z',
    status: 'replied',
    reply: {
      body:
        'Public Works inspected the lip on October 22 and placed a temporary ramp while the replacement panel is on order. Expected install within two weeks.',
      isPublic: true,
      repliedAt: '2026-10-23T11:05:00.000Z',
      repliedBy: 'acct-official',
    },
  },
  {
    id: 'q-arlington-signal',
    jurisdictionId: 'arlington',
    category: 'services',
    body: 'The crosswalk signal at my corner goes from walk to flashing red in four seconds. Is that adjustable?',
    authorLabel: 'Resident',
    createdAt: '2026-10-19T13:15:00.000Z',
    status: 'new',
    reply: null,
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
