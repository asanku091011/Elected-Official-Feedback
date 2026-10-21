// Small formatting helpers shared by the screens.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Unknown date';
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function formatTime(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

export function formatRelative(iso, now = Date.now()) {
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return 'Unknown date';
  const diffMinutes = Math.floor((now - time) / 60000);
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  if (diffHours < 48) return 'Yesterday';
  return formatDate(iso);
}

// No 0/O or 1/I, so a reference is easy to read aloud.
const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function makeReference(existing = []) {
  const taken = new Set(existing);
  for (let attempt = 0; attempt < 50; attempt += 1) {
    let code = '';
    for (let i = 0; i < 5; i += 1) {
      code += REFERENCE_ALPHABET[Math.floor(Math.random() * REFERENCE_ALPHABET.length)];
    }
    const reference = `CIV-${code}`;
    if (!taken.has(reference)) return reference;
  }
  // Extremely unlikely fallback that still produces a unique value.
  return `CIV-${Date.now().toString(36).toUpperCase().slice(-5)}`;
}

export function countWords(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}
