// Northern Virginia localities CivLink knows about.
//
// Every URL below was checked against the locality's own official site on
// 2026-10-23 and is linked, never copied. CivLink does not scrape local
// government pages and does not name sitting elected officials.
const LOUDOUN = {
  id: 'loudoun',
  name: 'Loudoun County',
  short: 'Loudoun',
  type: 'county',
  officialSiteUrl: 'https://www.loudoun.gov',
  sourceUrl: 'https://www.loudoun.gov/bos',
  lastVerified: '2026-10-23',
  note: 'The county government handles land use, local roads, police, parks, and county services.',
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
  officialSiteUrl: 'https://www.fairfaxcounty.gov',
  sourceUrl: 'https://www.fairfaxcounty.gov/boardofsupervisors/',
  lastVerified: '2026-10-23',
  note: 'The county spans several communities — Braddock, Bull Run, Clifton, Fairfax Station, and Union Mill, among others — and its government runs countywide services. CivLink always uses the county you pick rather than guessing from a street address.',
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
  officialSiteUrl: 'https://www.pwcva.gov',
  sourceUrl: 'https://www.pwcva.gov/department/board-county-supervisors',
  lastVerified: '2026-10-23',
  note: 'The county spans several communities, and its government runs countywide services. CivLink always uses the county you pick rather than guessing from a street address.',
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
  officialSiteUrl: 'https://www.fauquiercounty.gov',
  sourceUrl: 'https://www.fauquiercounty.gov/government/board-of-supervisors',
  lastVerified: '2026-10-23',
  note: 'The county handles local land use, roads, parks, and county services.',
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
  officialSiteUrl: 'https://www.rappahannockcountyva.gov',
  sourceUrl: 'https://www.rappahannockcountyva.gov/government/board_of_supervisors/index.php',
  lastVerified: '2026-10-23',
  note: 'A small, rural county; the county administrator’s office is the main starting point.',
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
  officialSiteUrl: 'https://www.manassasva.gov',
  sourceUrl: 'https://www.manassasva.gov/connect/city_clerk/manassas_council_meeting_center.php',
  lastVerified: '2026-10-23',
  note: 'As a city, it runs its own schools, police, land use, and utilities instead of the surrounding county.',
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
  officialSiteUrl: 'https://www.manassasparkva.gov',
  sourceUrl: 'https://www.manassasparkva.gov/government/governing_body/index.php',
  lastVerified: '2026-10-23',
  note: 'The city has its own governing body, schools, police, and services.',
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
  officialSiteUrl: 'https://www.arlingtonva.us',
  sourceUrl: 'https://www.arlingtonva.us/Government/County-Board',
  lastVerified: '2026-10-23',
  note: 'The county government runs countywide services, and neighboring Northern Virginia localities use the same CivLink tools.',
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


// Localities whose residents can receive content for the selected area.
export function jurisdictionName(id) {
  const item = getJurisdiction(id);
  return item ? item.short : 'your area';
}
