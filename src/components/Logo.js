// The CivLink brand mark, drawn from the original files in assets/branding.
// The files are never recolored, cropped, or stretched: both components keep
// the art's own aspect ratio, and the screens leave at least 10% of the logo's
// width clear around it through their own padding.
//
// Use <Logo> on a white or light surface. It must never sit on a dark or busy
// background — the artwork is ink and teal on transparent.

import React from 'react';
import { Image } from 'react-native';
import { logo } from '../theme';

const FULL_LOGO = require('../../assets/branding/civlink-logo.png');
const APP_ICON = require('../../assets/branding/icon-192.png');

export default function Logo({ width = 200, style }) {
  return (
    <Image
      source={FULL_LOGO}
      resizeMode="contain"
      accessibilityRole="image"
      accessibilityLabel="CivLink"
      style={[{ width, height: width / logo.aspect }, style]}
    />
  );
}

// A small square mark for headers, where the full logo would be too small to read.
// No borderRadius here: rounding the corners would crop the supplied icon, and
// the artwork already carries its own white background and internal padding.
export function LogoMark({ size = 30, style }) {
  return (
    <Image
      source={APP_ICON}
      resizeMode="contain"
      accessibilityRole="image"
      accessibilityLabel="CivLink"
      style={[{ width: size, height: size }, style]}
    />
  );
}
