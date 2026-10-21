import { Linking } from 'react-native';

// Opens an official website. Returns false when the device cannot open it,
// so the screen can show a readable message instead of crashing.
export async function openUrl(url) {
  try {
    await Linking.openURL(url);
    return true;
  } catch (error) {
    return false;
  }
}
