// What each issue is about, and which office actually handles it.
// "why" explains the routing in plain language. "limit" is honest about what
// that office cannot do, which keeps the app from over-promising.

export const TOPICS = [
  {
    id: 'roads',
    title: 'Roads & traffic',
    icon: '🛣️',
    examples: 'Potholes, crosswalks, streetlights, speeding',
    level: 'state',
    officeId: 'vdot',
    why:
      'In Virginia, VDOT maintains most public roads, including most roads in Loudoun County. Some streets belong to a town, the county, or a private community, so it helps to check who owns the road first.',
    canDo: [
      'Repair potholes and repave state-maintained roads',
      'Clear snow and fix drainage on state routes',
      'Review signs, guardrails, and pavement markings',
    ],
    limit:
      'VDOT does not enforce traffic laws or respond to crashes. For an immediate hazard call your local police non-emergency line, and for private or HOA roads contact the property owner.',
    also: ['loudoun-board', 'loudoun-transit'],
  },
  {
    id: 'schools',
    title: 'Schools & students',
    icon: '🎒',
    examples: 'Class size, buses, school safety, schedules',
    level: 'local',
    officeId: 'lcps-school-board',
    why:
      'Virginia school divisions are run locally. The Loudoun County School Board sets division policy and approves the school budget, while the superintendent and school staff run daily operations.',
    canDo: [
      'Set division-wide policy and approve the school budget',
      'Approve attendance zones, calendars, and bell schedules',
      'Adopt safety and discipline policies',
    ],
    limit:
      'The School Board does not set state testing rules or teacher licensing — that is the Virginia Department of Education. A single classroom concern usually starts with the teacher and principal.',
    also: ['va-doe', 'va-general-assembly'],
  },
  {
    id: 'housing',
    title: 'Housing & development',
    icon: '🏘️',
    examples: 'Zoning, new construction, rentals, affordability',
    level: 'local',
    officeId: 'loudoun-board',
    why:
      'Land use is decided locally. The Board of Supervisors adopts the zoning ordinance and decides rezoning and special-exception cases, with recommendations from the Planning Commission.',
    canDo: [
      'Adopt zoning rules and the county comprehensive plan',
      'Decide rezoning and development applications',
      'Fund local housing programs',
    ],
    limit:
      'Virginia law does not allow local rent control, so the county cannot cap rent. The county also does not own or manage private apartment buildings.',
    also: ['loudoun-planning'],
  },
  {
    id: 'utilities',
    title: 'Water, trash & utilities',
    icon: '💧',
    examples: 'Water quality, sewer, trash pickup, utility bills',
    level: 'local',
    officeId: 'loudoun-water',
    why:
      'Water and sewer in most of Loudoun are provided by Loudoun Water, a separate public utility. Trash collection is usually handled by a private hauler, an HOA, or a town.',
    canDo: [
      'Fix water main breaks, leaks, and service problems',
      'Answer questions about water quality and billing',
      'Plan water and sewer capacity for new development',
    ],
    limit:
      'Loudoun Water does not set electric rates — the State Corporation Commission does. Trash pickup problems usually go to your hauler, HOA, or town.',
    also: ['va-scc', 'loudoun-board'],
  },
  {
    id: 'safety',
    title: 'Crime & public safety',
    icon: '🚨',
    examples: 'Speeding, unsafe intersections, neighborhood concerns',
    level: 'local',
    officeId: 'loudoun-sheriff',
    why:
      'Policing is local. The Loudoun County Sheriff’s Office provides law enforcement across the county, and some towns run their own police department.',
    canDo: [
      'Respond to crimes and neighborhood safety concerns',
      'Run traffic enforcement in problem areas',
      'Share crime data and prevention resources',
    ],
    limit:
      'For anything happening right now, call 911. A message saved in this app is not an emergency report and does not reach a dispatcher.',
    also: ['loudoun-board'],
  },
  {
    id: 'environment',
    title: 'Data centers, energy & the environment',
    icon: '🌳',
    examples: 'Data center projects, power lines, air and water quality, noise',
    level: 'local',
    officeId: 'loudoun-board',
    why:
      'Data center projects touch several levels of government at once: the county decides zoning and site approvals, DEQ issues environmental permits, and the SCC decides what utilities can charge.',
    canDo: [
      'Decide zoning and site-plan approvals for new projects',
      'Adopt local noise and buffering rules',
      'Attach conditions to a specific project’s approval',
    ],
    limit:
      'The county does not issue air and water permits or set electric rates. Those decisions belong to DEQ and the SCC.',
    also: ['va-deq', 'va-scc'],
  },
  {
    id: 'privacy',
    title: 'Online privacy & kids’ safety',
    icon: '🔐',
    examples: 'App data collection, social media, scam texts, AI',
    level: 'federal',
    officeId: 'us-house',
    why:
      'Most rules for how companies collect data and design products for children come from federal law, so Congress is the main place to raise it. Virginia has also passed its own consumer data privacy law.',
    canDo: [
      'Write and vote on federal privacy and online safety law',
      'Ask federal agencies to investigate deceptive practices',
      'Raise a specific problem with a company through casework',
    ],
    limit:
      'Congress does not remove individual posts or refund a single purchase. For a scam in progress, report it to the FTC at reportfraud.ftc.gov.',
    also: ['us-senate', 'va-general-assembly'],
  },
  {
    id: 'immigration',
    title: 'Immigration & citizenship',
    icon: '🛂',
    examples: 'Green cards, work permits, citizenship, case delays',
    level: 'federal',
    officeId: 'uscis',
    why:
      'Immigration is handled by federal agencies. USCIS decides applications, and your member of Congress can request a status update on a pending case.',
    canDo: [
      'Decide visa, green card, and citizenship applications',
      'Schedule interviews and issue decisions',
      'Respond to case inquiries from a congressional office',
    ],
    limit:
      'A congressional office can ask about a case but cannot decide it, and it cannot make an agency act faster than the law allows.',
    also: ['us-house', 'us-senate'],
  },
  {
    id: 'benefits',
    title: 'Social Security, Medicare & veterans',
    icon: '🧾',
    examples: 'Benefits, claims, denials, Medicare coverage',
    level: 'federal',
    officeId: 'ssa',
    why:
      'These programs are run by federal agencies. Social Security handles retirement and disability claims, Medicare is run by CMS, and veterans benefits are handled by the VA.',
    canDo: [
      'Decide benefit claims and hear appeals',
      'Answer questions about your earnings record',
      'Offer local field offices and online services',
    ],
    limit:
      'A congressional office can help with a stuck claim but cannot change the rules for who qualifies for a benefit.',
    also: ['cms', 'va-va', 'us-house'],
  },
  {
    id: 'health',
    title: 'Health care & public health',
    icon: '🏥',
    examples: 'Medicaid coverage, clinic access, health permits',
    level: 'state',
    officeId: 'va-dh',
    why:
      'Public health in Virginia is run by the Department of Health through local health districts, while Medicaid coverage is run by the Department of Medical Assistance Services. Medicare is a separate federal program.',
    canDo: [
      'Run local health departments and community clinics',
      'Track and respond to disease outbreaks',
      'Inspect restaurants and issue health permits',
    ],
    limit:
      'The health department does not decide who qualifies for Medicaid, and it does not set what private insurance covers.',
    also: ['va-dmas', 'cms', 'us-house'],
  },
  {
    id: 'taxes',
    title: 'Taxes & assessments',
    icon: '💵',
    examples: 'Property assessments, state taxes, tax credits',
    level: 'local',
    officeId: 'loudoun-revenue',
    why:
      'Property assessments in Loudoun are made by the Commissioner of the Revenue, and you can appeal an assessment. State tax rules come from the General Assembly, and federal tax law from Congress.',
    canDo: [
      'Explain how your property was assessed',
      'Correct errors in an assessment',
      'Hear assessment appeals',
    ],
    limit:
      'The Commissioner of the Revenue does not write tax law. Rate changes come from the Board of Supervisors, the General Assembly, or Congress.',
    also: ['loudoun-board', 'va-general-assembly', 'us-house'],
  },
  {
    id: 'transit',
    title: 'Buses, Metro & commuting',
    icon: '🚌',
    examples: 'Routes, delays, station access, parking',
    level: 'regional',
    officeId: 'wmata',
    why:
      'Metrorail and Metrobus are run by the regional transit authority, while county bus routes and commuter services are run by Loudoun County.',
    canDo: [
      'Run Metrorail and Metrobus service',
      'Set fares and service levels with regional partners',
      'Handle accessibility and paratransit requests',
    ],
    limit:
      'Metro does not control county roads, station parking rules, or county bus routes.',
    also: ['loudoun-transit'],
  },
  {
    id: 'voting',
    title: 'Voting & elections',
    icon: '🗳️',
    examples: 'Registration, polling places, mail ballots, early voting',
    level: 'state',
    officeId: 'va-elections',
    why:
      'Elections are run by the state with local registrars. The Virginia Department of Elections sets statewide rules, and the Loudoun County Office of Elections runs voting locally.',
    canDo: [
      'Maintain the statewide voter registration system',
      'Set rules for mail and early voting',
      'Publish official results',
    ],
    limit:
      'Election officials cannot discuss how you voted or change a result. Report a problem at the polls to your local registrar.',
    also: ['loudoun-elections'],
  },
];

export function getTopic(id) {
  return TOPICS.find((topic) => topic.id === id) || null;
}

// A starting template for the message box. It is clearly labeled as a template
// in the UI, and the app warns the writer if the [brackets] are still there.
export const MESSAGE_TEMPLATE = `I live in [your neighborhood or town] in ZIP code [ZIP].

For the past [how long], [what is happening and where it happens]. This affects [who it affects and how].

I would like you to [the specific action you are asking for].

Thank you for your time.`;

export const DRAFT_CHECKS = [
  {
    id: 'who',
    label: 'Who you are and where you live',
    hint: 'A neighborhood, town, or ZIP code is enough. You do not need to give your name.',
  },
  {
    id: 'what',
    label: 'What is happening, and where',
    hint: 'Choose one issue. A specific street, school, or building is easier to act on.',
  },
  {
    id: 'impact',
    label: 'How it affects you or your neighbors',
    hint: 'One or two sentences on the real impact is what staff remember.',
  },
  {
    id: 'ask',
    label: 'What you want them to do',
    hint: 'Ask for a concrete action: fix it, vote a certain way, or explain a decision.',
  },
];
