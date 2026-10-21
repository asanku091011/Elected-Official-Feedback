// Checks a draft before it is saved, so the app never stores an empty or
// abusive message. These are simple, explainable rules — not AI moderation.

export const MAX_LENGTH = 1200;
export const MIN_LENGTH = 40;

const THREAT_PATTERNS = [
  /\bkill (you|him|her|them)\b/i,
  /\bi will (hurt|find|shoot) you\b/i,
  /\bshoot (you|up|the)\b/i,
  /\bplant a bomb\b/i,
  /\bi know where you live\b/i,
];

export function hasThreat(text) {
  return THREAT_PATTERNS.some((pattern) => pattern.test(text));
}

export function findPlaceholders(text) {
  return text.match(/\[[^\]]{1,60}\]/g) || [];
}

export function reviewDraft({ message = '', zip = '', includeName = false, name = '' }) {
  const errors = {};
  const warnings = [];
  const text = message.trim();

  if (text.length === 0) {
    errors.message = 'Write your message before saving.';
  } else if (text.length < MIN_LENGTH) {
    errors.message = `Add a little more detail. Aim for at least ${MIN_LENGTH} characters — about two sentences.`;
  } else if (text.length > MAX_LENGTH) {
    errors.message = `Your message is too long. Shorten it to ${MAX_LENGTH} characters or less.`;
  } else if (hasThreat(text)) {
    errors.message =
      'This message contains threatening language. Threats are not feedback and can be illegal, so remove them before saving.';
  }

  const cleanZip = zip.trim();
  if (cleanZip.length > 0 && !/^\d{5}$/.test(cleanZip)) {
    errors.zip = 'Enter a 5-digit ZIP code, or leave it blank.';
  }

  if (includeName && name.trim().length === 0) {
    errors.name = 'Add a name, or switch off “Include my name”.';
  }

  if (text.length > 0) {
    if (findPlaceholders(text).length > 0) {
      warnings.push('Some [bracketed] placeholders are still in your message.');
    }
    const letters = text.replace(/[^a-z]/gi, '');
    const uppercase = text.replace(/[^A-Z]/g, '');
    if (letters.length >= 30 && uppercase.length / letters.length > 0.7) {
      warnings.push('Your message is mostly capital letters, which is harder to read.');
    }
    if (/https?:\/\//i.test(text)) {
      warnings.push('Some offices treat messages with links as spam. Describing the page may work better.');
    }
  }

  return { errors, warnings, isValid: Object.keys(errors).length === 0 };
}

// Used by the "Use a starting template" button. Keeping it here means the
// template and the placeholder warning always agree.
export { MESSAGE_TEMPLATE } from '../data/topics.js';
