// Saves messages on this device only. There is no server and no account.
// If device storage is unavailable (for example in a browser with storage
// blocked) the app keeps working for the current session and tells the user.

import AsyncStorage from '@react-native-async-storage/async-storage';

// The key keeps its original spelling on purpose: renaming it would hide saved
// messages from anyone who already used an earlier build of the app.
const KEY = 'civic.messages.v1';

function looksLikeMessage(value) {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.message === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.topicId === 'string' &&
    typeof value.level === 'string'
  );
}

export async function loadMessages() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return { messages: [], ok: true };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return { messages: [], ok: true };
    return { messages: parsed.filter(looksLikeMessage), ok: true };
  } catch (error) {
    // Corrupted or blocked storage should never crash the app.
    return { messages: [], ok: false };
  }
}

export async function saveMessages(messages) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(messages));
    return true;
  } catch (error) {
    return false;
  }
}

// Civic content: polls, announcements, questions, votes, and the built-in
// accounts, all stored on this device. A real rollout would keep this on a
// server instead. The version suffix lets a future shape change start clean
// rather than crash on old data.
const CIVIC_KEY = 'civic.civicState.v1';

export async function loadCivicState() {
  try {
    const raw = await AsyncStorage.getItem(CIVIC_KEY);
    if (!raw) return { state: null, ok: true };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { state: null, ok: true };
    return { state: parsed, ok: true };
  } catch (error) {
    return { state: null, ok: false };
  }
}

export async function saveCivicState(state) {
  try {
    await AsyncStorage.setItem(CIVIC_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    return false;
  }
}
