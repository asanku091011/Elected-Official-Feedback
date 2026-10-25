// Demo accounts for the Official Portal prototype.
//
// There is no real authentication. Nothing here is a password, and no real
// office or agency is represented. A real rollout would need a server, a
// verified .gov email, and an administrator who approves each account.
//
// Residents do not need an account at all. The `resident` role is the app's
// anonymous default.

export const ROLE_LABELS = {
  resident: 'Resident',
  official: 'Official',
  admin: 'Administrator',
};

export const SAMPLE_ORG = {
  id: 'sample-county-office',
  name: 'Sample County Office',
  jurisdictionId: 'loudoun',
  isSample: true,
};

// These two accounts belong to the sample organization, not to any real office.
export const SAMPLE_ACCOUNTS = [
  {
    id: 'acct-official',
    role: 'official',
    displayName: 'Sample staff account',
    orgId: SAMPLE_ORG.id,
    orgName: SAMPLE_ORG.name,
    email: 'staff@sample.gov',
    verified: true,
    isSample: true,
  },
  {
    id: 'acct-admin',
    role: 'admin',
    displayName: 'Sample administrator',
    orgId: SAMPLE_ORG.id,
    orgName: SAMPLE_ORG.name,
    email: 'admin@sample.gov',
    verified: true,
    isSample: true,
  },
];

export function orgNameFor(account) {
  if (!account) return '';
  return account.orgName || SAMPLE_ORG.name;
}

// Only a .gov address is accepted for an access request. This is a simple
// string check for the prototype, not proof of who someone is.
export function isGovEmail(value) {
  return /^[^\s@]+@[^\s@.]+\.gov$/i.test(String(value || '').trim());
}
