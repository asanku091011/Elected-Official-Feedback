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
