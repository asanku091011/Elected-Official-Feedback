// Northern Virginia localities CivLink knows about.
//
// Every URL below was checked against the locality's own official site on
// 2026-10-23 and is linked, never copied. CivLink does not scrape local
// government pages and does not name sitting elected officials.
//
// The district flags come from the current congressional map. Virginia's
// redistricting amendment was struck down in May 2026, so the new map is not
// in effect:
//   - all of Loudoun, Fauquier and Rappahannock counties are in VA-10
//   - the cities of Manassas and Manassas Park are in VA-10
//   - only PARTS of Fairfax and Prince William counties are in VA-10
//   - Arlington County is in VA-8, not VA-10

export const VA10_LABELS = {
  full: 'In VA-10',
  partial: 'Part of this county is in VA-10',
  no: 'Outside VA-10 (VA-8). Supported as an expansion area.',
};

export const DISTRICT_INFO = {
  name: 'Virginia’s 10th Congressional District',
  shortName: 'VA-10',
  pilotNote:
    'CivLink’s pilot district is Virginia’s 10th. The same system also supports neighboring Northern Virginia localities, starting with Fairfax and Arlington.',
  boundaryNote:
    'Virginia voters approved a redistricting amendment in April 2026, but the Supreme Court of Virginia struck it down in May 2026 and the U.S. Supreme Court declined an emergency appeal, so the current map still applies. Only parts of Fairfax and Prince William counties are in VA-10; Arlington is in VA-8.',
  lastVerified: '2026-10-23',
  sourceUrl: 'https://en.wikipedia.org/wiki/Virginia%27s_10th_congressional_district',
  lookupUrl: 'https://www.house.gov/representatives/find-your-representative',
};

const LOUDOUN = {
  id: 'loudoun',
  name: 'Loudoun County',
  short: 'Loudoun',
  type: 'county',
  inVA10: 'full',
  officialSiteUrl: 'https://www.loudoun.gov',
  sourceUrl: 'https://www.loudoun.gov/bos',
  lastVerified: '2026-10-23',
  note: 'All of Loudoun County is in VA-10. The county government handles land use, local roads, police, parks, and county services.',
  links: [
    {
      kind: 'board',
      label: 'Board of Supervisors',
      url: 'https://www.loudoun.gov/bos',
      note: 'Who sits on the board, how to email the full board, and the board’s main phone line.',
    },
    {
      kind: 'meetings',
      label: 'Meeting agendas and packets',
      url: 'https://www.loudoun.gov/3426/Board-of-Supervisors-Meetings-Packets',
      note: 'Business meeting and public hearing documents, plus links to live and archived video.',
    },
    {
      kind: 'calendar',
      label: 'County meeting calendar',
      url: 'https://www.loudoun.gov/calendar.aspx?CID=14',
      note: 'Upcoming county meetings, including board and committee dates.',
    },
    {
      kind: 'comment',
      label: 'How public comment works',
      url: 'https://www.loudoun.gov/4853/About-Board-of-Supervisors-Meetings',
      note: 'When the board takes public input, how to speak in person or by phone, and the board comment line.',
    },
    {
      kind: 'contact',
      label: 'Contact the county',
      url: 'https://www.loudoun.gov/2364/Contact-Us',
      note: 'Main county phone number, address, and department contacts.',
    },
  ],
};

const FAIRFAX = {
  id: 'fairfax',
  name: 'Fairfax County',
  short: 'Fairfax',
  type: 'county',
  inVA10: 'partial',
  officialSiteUrl: 'https://www.fairfaxcounty.gov',
  sourceUrl: 'https://www.fairfaxcounty.gov/boardofsupervisors/',
  lastVerified: '2026-10-23',
  note: 'Only parts of Fairfax County are in VA-10 — the current map includes areas such as Braddock, Bull Run, Clifton, Fairfax Station and Union Mill, but it splits the county. A county name alone cannot tell CivLink whether an address is inside VA-10.',
  links: [
    {
      kind: 'board',
      label: 'Board of Supervisors',
      url: 'https://www.fairfaxcounty.gov/boardofsupervisors/',
      note: 'The county’s governing board and its published priorities.',
    },
    {
      kind: 'meetings',
      label: 'Board meeting schedule',
      url: 'https://www.fairfaxcounty.gov/boardofsupervisors/2026-board-meetings',
      note: 'The 2026 schedule of board and committee meetings.',
    },
    {
      kind: 'comment',
      label: 'Sign up to speak / Clerk to the Board',
      url: 'https://www.fairfaxcounty.gov/bosclerk/speakers-form',
      note: 'How to sign up to speak before the board and how to reach the Clerk to the Board.',
    },
  ],
};

const PRINCE_WILLIAM = {
  id: 'prince-william',
  name: 'Prince William County',
  short: 'Prince William',
  type: 'county',
  inVA10: 'partial',
  officialSiteUrl: 'https://www.pwcva.gov',
  sourceUrl: 'https://www.pwcva.gov/department/board-county-supervisors',
  lastVerified: '2026-10-23',
  note: 'Only parts of Prince William County are in VA-10; the current map divides the county. CivLink cannot tell from a county name alone whether an address is inside the district.',
  links: [
    {
      kind: 'board',
      label: 'Board of County Supervisors',
      url: 'https://www.pwcva.gov/department/board-county-supervisors',
      note: 'The county’s governing board and how the public may comment at meetings.',
    },
    {
      kind: 'meetings',
      label: 'Live video, briefs and archives',
      url: 'https://www.pwcva.gov/department/board-county-supervisors/live-video-briefs-archives',
      note: 'When the board meets, plus live and recorded meeting video.',
    },
    {
      kind: 'calendar',
      label: 'Board events',
      url: 'https://www.pwcva.gov/department/board-county-supervisors/events',
      note: 'Upcoming board meetings and county events.',
    },
  ],
};

const FAUQUIER = {
  id: 'fauquier',
  name: 'Fauquier County',
  short: 'Fauquier',
  type: 'county',
  inVA10: 'full',
  officialSiteUrl: 'https://www.fauquiercounty.gov',
  sourceUrl: 'https://www.fauquiercounty.gov/government/board-of-supervisors',
  lastVerified: '2026-10-23',
  note: 'All of Fauquier County is in VA-10. The county handles local land use, roads, parks, and county services.',
  links: [
    {
      kind: 'board',
      label: 'Board of Supervisors',
      url: 'https://www.fauquiercounty.gov/government/board-of-supervisors',
      note: 'The governing board, its office, and contact details.',
    },
    {
      kind: 'meetings',
      label: 'Meeting agendas',
      url: 'https://www.fauquiercounty.gov/government/board-of-supervisors/bos-meeting-agendas',
      note: 'Board agendas and meeting documents, newest first.',
    },
    {
      kind: 'calendar',
      label: 'Public meetings calendar',
      url: 'https://www.fauquiercounty.gov/government/boards-committees/public-meetings-calendar',
      note: 'Meeting dates for the board and county boards and commissions.',
    },
    {
      kind: 'comment',
      label: 'Meeting protocol',
      url: 'https://www.fauquiercounty.gov/government/board-of-supervisors/electronic-meeting-protocol',
      note: 'How board meetings run and how to contact the Deputy Clerk about speaking.',
    },
    {
      kind: 'contact',
      label: 'Contact the county',
      url: 'https://www.fauquiercounty.gov/about-us/contact-us',
      note: 'Department phone numbers and email contacts.',
    },
  ],
};

const RAPPAHANNOCK = {
  id: 'rappahannock',
  name: 'Rappahannock County',
  short: 'Rappahannock',
  type: 'county',
  inVA10: 'full',
  officialSiteUrl: 'https://www.rappahannockcountyva.gov',
  sourceUrl: 'https://www.rappahannockcountyva.gov/government/board_of_supervisors/index.php',
  lastVerified: '2026-10-23',
  note: 'All of Rappahannock County is in VA-10. It is a small, rural county; the county administrator’s office is the main starting point.',
  links: [
    {
      kind: 'board',
      label: 'Board of Supervisors',
      url: 'https://www.rappahannockcountyva.gov/government/board_of_supervisors/index.php',
      note: 'The governing board, meeting times, and how to reach members.',
    },
    {
      kind: 'meetings',
      label: 'Meeting schedules and agendas',
      url: 'https://www.rappahannockcountyva.gov/government/board_of_supervisors/meeting_schedules/index.php',
      note: 'Regular meeting schedule and links to agendas.',
    },
    {
      kind: 'contact',
      label: 'Contact the county',
      url: 'https://www.rappahannockcountyva.gov/how_do_i/contact_us/index.php',
      note: 'County administration phone numbers and department contacts.',
    },
  ],
};

const MANASSAS = {
  id: 'manassas',
  name: 'City of Manassas',
  short: 'Manassas',
  type: 'city',
  inVA10: 'full',
  officialSiteUrl: 'https://www.manassasva.gov',
  sourceUrl: 'https://www.manassasva.gov/connect/city_clerk/manassas_council_meeting_center.php',
  lastVerified: '2026-10-23',
  note: 'The City of Manassas is in VA-10. As a city, it runs its own schools, police, land use, and utilities instead of the surrounding county.',
  links: [
    {
      kind: 'board',
      label: 'City Council meetings',
      url: 'https://www.manassasva.gov/connect/city_clerk/about_city_council_meetings.php',
      note: 'How regular City Council meetings work and when they are held.',
    },
    {
      kind: 'meetings',
      label: 'Agendas, minutes and meeting video',
      url: 'https://www.manassasva.gov/connect/city_clerk/manassas_council_meeting_center.php',
      note: 'The city’s meeting center for agendas, minutes, and recordings.',
    },
    {
      kind: 'contact',
      label: 'City Clerk’s Office',
      url: 'https://www.manassasva.gov/connect/city_clerk/index.php',
      note: 'The clerk’s office handles council records and can point you to the right department.',
    },
  ],
};

const MANASSAS_PARK = {
  id: 'manassas-park',
  name: 'City of Manassas Park',
  short: 'Manassas Park',
  type: 'city',
  inVA10: 'full',
  officialSiteUrl: 'https://www.manassasparkva.gov',
  sourceUrl: 'https://www.manassasparkva.gov/government/governing_body/index.php',
  lastVerified: '2026-10-23',
  note: 'The City of Manassas Park is in VA-10. The city has its own governing body, schools, police, and services.',
  links: [
    {
      kind: 'board',
      label: 'Governing Body',
      url: 'https://www.manassasparkva.gov/government/governing_body/index.php',
      note: 'The city’s governing body, meeting times, and clerk contact.',
    },
    {
      kind: 'meetings',
      label: 'Meetings, agendas and minutes',
      url: 'https://www.manassasparkva.gov/government/governing_body/meetings_agendas___minutes/index.php',
      note: 'Agendas and minutes for governing body meetings.',
    },
    {
      kind: 'contact',
      label: 'City staff directory',
      url: 'https://www.manassasparkva.gov/how_do_i/contact/the_city_staff.php',
      note: 'Phone numbers and email addresses for city departments.',
    },
  ],
};

const ARLINGTON = {
  id: 'arlington',
  name: 'Arlington County',
  short: 'Arlington',
  type: 'county',
  inVA10: 'no',
  officialSiteUrl: 'https://www.arlingtonva.us',
  sourceUrl: 'https://www.arlingtonva.us/Government/County-Board',
  lastVerified: '2026-10-23',
  note: 'Arlington County is in Virginia’s 8th District, not VA-10. CivLink lists it as an expansion area so neighboring Northern Virginia localities can use the same tools.',
  links: [
    {
      kind: 'board',
      label: 'County Board',
      url: 'https://www.arlingtonva.us/Government/County-Board',
      note: 'The county board, its meeting information, and contact details.',
    },
    {
      kind: 'meetings',
      label: 'Meetings and agendas',
      url: 'https://www.arlingtonva.us/Government/Departments/County-Board/County-Board-Meetings',
      note: 'Board meeting dates, agendas, and how public participation works.',
    },
    {
      kind: 'comment',
      label: 'Speaking at a County Board meeting',
      url: 'https://www.arlingtonva.us/Government/Departments/County-Board/County-Board-Meetings/Speaking-at-a-Monthly-County-Board-Meeting',
      note: 'How to sign up to speak and how public comment periods work.',
    },
    {
      kind: 'contact',
      label: 'Contact the County Board',
      url: 'https://www.arlingtonva.us/Government/County-Board',
      note: 'Board office phone number and email address.',
    },
  ],
};

export const JURISDICTIONS = [
  LOUDOUN,
  FAIRFAX,
  PRINCE_WILLIAM,
  FAUQUIER,
  RAPPAHANNOCK,
  MANASSAS,
  MANASSAS_PARK,
  ARLINGTON,
];

export function getJurisdiction(id) {
  return JURISDICTIONS.find((item) => item.id === id) || null;
}

export function labelForVA10(flag) {
  return VA10_LABELS[flag] || VA10_LABELS.full;
}

// Localities whose residents can receive content for the selected area.
export function jurisdictionName(id) {
  const item = getJurisdiction(id);
  return item ? item.short : 'your area';
}
