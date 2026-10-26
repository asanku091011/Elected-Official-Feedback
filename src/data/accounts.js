// Built-in Office Portal accounts used to start the app.
//
// Residents do not need an account at all. The `resident` role is the app's
// anonymous default.

export const ROLE_LABELS = {
  resident: 'Resident',
  official: 'Official',
  admin: 'Administrator',
};

export const SAMPLE_ORG = {
  id: 'civlink-office',
  name: 'CivLink Office of Communications',
  jurisdictionId: 'loudoun',
  isSample: true,
};

// These two accounts belong to the CivLink publishing office.
export const SAMPLE_ACCOUNTS = [
  {
    id: 'acct-official',
    role: 'official',
    displayName: 'CivLink staff account',
    orgId: SAMPLE_ORG.id,
    orgName: SAMPLE_ORG.name,
    email: 'staff@civlink.gov',
    verified: true,
    isSample: true,
  },
  {
    id: 'acct-admin',
    role: 'admin',
    displayName: 'CivLink administrator',
    orgId: SAMPLE_ORG.id,
    orgName: SAMPLE_ORG.name,
    email: 'admin@civlink.gov',
    verified: true,
    isSample: true,
  },
];

export function orgNameFor(account) {
  if (!account) return '';
  return account.orgName || SAMPLE_ORG.name;
}

// Only a .gov address is accepted for an access request; this is a format
// check, and an administrator reviews every request by hand.
export function isGovEmail(value) {
  return /^[^\s@]+@[^\s@.]+\.gov$/i.test(String(value || '').trim());
}
