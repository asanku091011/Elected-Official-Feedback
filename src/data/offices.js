// Offices of government a constituent might need to reach.
// Every link points at that office's official public website, and every role
// description sticks to what the office is actually responsible for.
// Sources are listed in README.md under "Where the routing information comes from".

export const LEVELS = [
  {
    id: 'local',
    label: 'Local',
    short: 'County & town',
    blurb:
      'County and town governments run schools, zoning and land use, local police, water and trash service, and local parks.',
  },
  {
    id: 'state',
    label: 'State',
    short: 'Virginia',
    blurb:
      'Virginia’s General Assembly writes state law and the state budget. State agencies carry out rules for schools, health, elections, roads, and utilities.',
  },
  {
    id: 'federal',
    label: 'Federal',
    short: 'U.S. government',
    blurb:
      'Congress writes federal law. Federal agencies run programs like Social Security, Medicare, immigration, and veterans benefits.',
  },
  {
    id: 'regional',
    label: 'Regional',
    short: 'Across county lines',
    blurb:
      'Regional authorities run services that cross city and county borders, like Metrorail and Metrobus.',
  },
];

const OFFICE_LIST = [
  // ---- Local: Loudoun County ----
  {
    id: 'loudoun-board',
    name: 'Loudoun County Board of Supervisors',
    level: 'local',
    role:
      'Elected supervisors set county policy, approve the county budget, and make land-use decisions for the county.',
    url: 'https://www.loudoun.gov',
    urlLabel: 'loudoun.gov',
  },
  {
    id: 'lcps-school-board',
    name: 'Loudoun County School Board',
    level: 'local',
    role:
      'Sets school division policy and the school budget, approves attendance zones and the school calendar, and hires the superintendent.',
    url: 'https://www.lcps.org',
    urlLabel: 'lcps.org',
  },
  {
    id: 'loudoun-planning',
    name: 'Loudoun County Planning & Zoning',
    level: 'local',
    role:
      'Reviews development applications, zoning rules, and permits for how land can be used.',
    url: 'https://www.loudoun.gov',
    urlLabel: 'loudoun.gov',
  },
  {
    id: 'loudoun-water',
    name: 'Loudoun Water',
    level: 'local',
    role:
      'An independent public utility that supplies drinking water and treats wastewater for most of Loudoun County.',
    url: 'https://www.loudounwater.org',
    urlLabel: 'loudounwater.org',
  },
  {
    id: 'loudoun-revenue',
    name: 'Loudoun County Commissioner of the Revenue',
    level: 'local',
    role:
      'Assesses personal property and real estate taxes and handles assessment questions and appeals.',
    url: 'https://www.loudoun.gov',
    urlLabel: 'loudoun.gov',
  },
  {
    id: 'loudoun-elections',
    name: 'Loudoun County Office of Elections',
    level: 'local',
    role:
      'The local general registrar runs early voting, polling places, and voter registration for Loudoun County.',
    url: 'https://www.loudoun.gov',
    urlLabel: 'loudoun.gov',
  },
  {
    id: 'loudoun-sheriff',
    name: 'Loudoun County Sheriff’s Office',
    level: 'local',
    role:
      'Provides law enforcement for the county and runs the adult detention center. The Sheriff is elected by voters.',
    url: 'https://www.loudoun.gov',
    urlLabel: 'loudoun.gov',
  },
  {
    id: 'loudoun-transit',
    name: 'Loudoun County Transit & Commuter Services',
    level: 'local',
    role:
      'Runs county bus routes and commuter services, including connections to Metrorail stations.',
    url: 'https://www.loudoun.gov',
    urlLabel: 'loudoun.gov',
  },

  // ---- State: Virginia ----
  {
    id: 'vdot',
    name: 'Virginia Department of Transportation (VDOT)',
    level: 'state',
    role:
      'Maintains most public roads in Virginia, including most roads in Loudoun County. Handles potholes, repaving, drainage, snow removal, and signage on state-maintained roads.',
    url: 'https://www.vdot.virginia.gov',
    urlLabel: 'vdot.virginia.gov',
  },
  {
    id: 'va-general-assembly',
    name: 'Virginia General Assembly',
    level: 'state',
    role:
      '140 elected legislators — 40 in the Senate and 100 in the House of Delegates — write state law and approve the state budget.',
    url: 'https://virginiageneralassembly.gov',
    urlLabel: 'virginiageneralassembly.gov',
  },
  {
    id: 'va-governor',
    name: 'Office of the Governor of Virginia',
    level: 'state',
    role:
      'Runs state agencies, signs or vetoes bills, and can propose amendments to legislation.',
    url: 'https://www.governor.virginia.gov',
    urlLabel: 'governor.virginia.gov',
  },
  {
    id: 'va-scc',
    name: 'State Corporation Commission (SCC)',
    level: 'state',
    role:
      'Regulates electric and water utilities, insurance, and businesses, and decides utility rate cases.',
    url: 'https://www.scc.virginia.gov',
    urlLabel: 'scc.virginia.gov',
  },
  {
    id: 'va-deq',
    name: 'Virginia Department of Environmental Quality (DEQ)',
    level: 'state',
    role:
      'Issues and enforces air, water, and waste permits, including permits for large facilities such as data centers.',
    url: 'https://www.deq.virginia.gov',
    urlLabel: 'deq.virginia.gov',
  },
  {
    id: 'va-doe',
    name: 'Virginia Department of Education',
    level: 'state',
    role:
      'Sets statewide academic standards (the SOLs), testing rules, and school accreditation requirements.',
    url: 'https://www.doe.virginia.gov',
    urlLabel: 'doe.virginia.gov',
  },
  {
    id: 'va-dh',
    name: 'Virginia Department of Health',
    level: 'state',
    role:
      'Runs public health programs, disease reporting, and local health districts across the state.',
    url: 'https://www.vdh.virginia.gov',
    urlLabel: 'vdh.virginia.gov',
  },
  {
    id: 'va-dss',
    name: 'Virginia Department of Social Services',
    level: 'state',
    role:
      'Administers benefits such as SNAP and child care assistance through local departments of social services. Medicaid is run by DMAS.',
    url: 'https://www.dss.virginia.gov',
    urlLabel: 'dss.virginia.gov',
  },
  {
    id: 'va-dmas',
    name: 'Department of Medical Assistance Services (DMAS)',
    level: 'state',
    role: 'Runs Virginia’s Medicaid program and sets what coverage it pays for.',
    url: 'https://www.dmas.virginia.gov',
    urlLabel: 'dmas.virginia.gov',
  },
  {
    id: 'va-elections',
    name: 'Virginia Department of Elections',
    level: 'state',
    role:
      'Sets statewide election rules and runs the voter registration system with local registrars.',
    url: 'https://www.elections.virginia.gov',
    urlLabel: 'elections.virginia.gov',
  },

  // ---- Federal ----
  {
    id: 'us-house',
    name: 'U.S. House of Representatives',
    level: 'federal',
    role:
      'Your representative votes on federal law and can open a casework inquiry with a federal agency on your behalf.',
    url: 'https://www.house.gov/representatives/find-your-representative',
    urlLabel: 'house.gov',
  },
  {
    id: 'us-senate',
    name: 'U.S. Senate',
    level: 'federal',
    role:
      'Virginia has two U.S. Senators. They vote on federal law and also handle casework for any Virginian.',
    url: 'https://www.senate.gov/senators/index.htm',
    urlLabel: 'senate.gov',
  },
  {
    id: 'ssa',
    name: 'Social Security Administration',
    level: 'federal',
    role:
      'Runs retirement, disability, and survivors benefits and handles claims and appeals.',
    url: 'https://www.ssa.gov',
    urlLabel: 'ssa.gov',
  },
  {
    id: 'cms',
    name: 'Centers for Medicare & Medicaid Services',
    level: 'federal',
    role:
      'Runs Medicare and sets federal rules for Medicaid. Virginia’s Medicaid program is run by DMAS.',
    url: 'https://www.medicare.gov',
    urlLabel: 'medicare.gov',
  },
  {
    id: 'uscis',
    name: 'U.S. Citizenship and Immigration Services',
    level: 'federal',
    role:
      'Processes visa, green card, work permit, and citizenship applications and decides those cases.',
    url: 'https://www.uscis.gov',
    urlLabel: 'uscis.gov',
  },
  {
    id: 'va-va',
    name: 'U.S. Department of Veterans Affairs',
    level: 'federal',
    role:
      'Provides veterans health care, disability compensation, education benefits, and home loans.',
    url: 'https://www.va.gov',
    urlLabel: 'va.gov',
  },
  {
    id: 'usps',
    name: 'U.S. Postal Service',
    level: 'federal',
    role:
      'Delivers mail and packages and handles mail delivery problems. It is a federal agency, not a private company.',
    url: 'https://www.usps.com',
    urlLabel: 'usps.com',
  },

  // ---- Regional ----
  {
    id: 'wmata',
    name: 'Washington Metropolitan Area Transit Authority (Metro)',
    level: 'regional',
    role:
      'Runs Metrorail, Metrobus, and paratransit service across D.C., Maryland, and Northern Virginia.',
    url: 'https://www.wmata.com',
    urlLabel: 'wmata.com',
  },
];

export const OFFICES = OFFICE_LIST.reduce((map, office) => {
  map[office.id] = office;
  return map;
}, {});

export function getOffice(id) {
  return OFFICES[id] || null;
}

export function getLevel(id) {
  return LEVELS.find((level) => level.id === id) || null;
}

export function officesForLevel(levelId) {
  return OFFICE_LIST.filter((office) => office.level === levelId);
}
