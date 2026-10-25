// Simple, explainable safeguards for resident content. These are word lists and
// counters, not AI moderation, and the app says so on its content policy screen.

// Short, deliberately mild list: enough to catch obvious abuse in a prototype
// without pretending to be a real moderation system.
const BLOCKED_WORDS = ['damn', 'hell', 'crap', 'idiot', 'stupid', 'shut up', 'hate you'];

export function findBlockedWords(text) {
  const lower = String(text || '').toLowerCase();
  return BLOCKED_WORDS.filter((word) => {
    const pattern = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return pattern.test(lower);
  });
}

export function containsThreats(text) {
  const patterns = [
    /\bkill (you|him|her|them)\b/i,
    /\bi will (hurt|find|shoot) you\b/i,
    /\bplant a bomb\b/i,
    /\bi know where you live\b/i,
  ];
  return patterns.some((pattern) => pattern.test(String(text || '')));
}

// Counts recent actions inside a rolling window. Used so one demo device cannot
// post twenty questions in a row, mirroring the rate limit a real service would
// enforce on the server.
export function rateLimitOk(events = [], limit = 3, windowMs = 10 * 60 * 1000, now = Date.now()) {
  const recent = events.filter((time) => now - new Date(time).getTime() < windowMs);
  return recent.length < limit;
}

export const REPORT_REASONS = [
  { id: 'abusive', label: 'It is abusive or threatening' },
  { id: 'campaign', label: 'It is campaign or partisan content' },
  { id: 'personal', label: 'It shares someone’s personal information' },
  { id: 'spam', label: 'It is spam or advertising' },
];
