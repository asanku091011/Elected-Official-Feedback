// Where the installable web app lives.
//
// Set EXPO_PUBLIC_WEB_APP_URL when building for phones so the Get CivLink screen
// has a link and a QR code to show. In a browser the app can use its own address,
// so the QR always points at the page the judge is already looking at.

const CONFIGURED = String(process.env.EXPO_PUBLIC_WEB_APP_URL || '')
  .trim()
  .replace(/\/+$/, '');

export function getWebAppUrl() {
  if (CONFIGURED) return CONFIGURED;
  if (typeof window !== 'undefined' && window.location) {
    const { protocol, origin, pathname } = window.location;
    if (protocol === 'https:' || protocol === 'http:') {
      const path = String(pathname || '/').replace(/index\.html$/, '');
      return `${origin}${path === '/' ? '' : path.replace(/\/+$/, '')}`;
    }
  }
  return '';
}

export function hasPublicWebUrl() {
  return /^https:\/\//.test(getWebAppUrl());
}
