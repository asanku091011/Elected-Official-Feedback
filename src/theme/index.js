// One shared design system for the whole app, built from the CivLink logo.
// Change a color, radius, or size here and every screen updates with it.
//
// Contrast notes (WCAG AA, checked on 2026-10-20):
//   ink #0E1014 on white ............ 19.0:1
//   ink #0E1014 on teal #38CBD0 .....  9.6:1  (primary button text)
//   tealDeep #127074 on white .......  5.8:1  (teal text and links)
//   slateText #5A666E on white ......  5.9:1  (secondary text)
//   slate #76848D on white ..........  3.8:1  (icons and borders only, never body text)
// The brand teal #38CBD0 is too light for text on white and too light to carry
// white text, so it is used as a surface, never as small text.

import { Platform } from 'react-native';

export const colors = {
  // Brand
  teal: '#38CBD0', // primary surfaces, highlights, active states
  tealDeep: '#127074', // teal text, links, and any teal carrying white text
  tealSoft: '#E7F8F9', // soft teal tint for badges and callouts

  // Neutrals
  slate: '#76848D', // icons, outlines, muted decoration
  slateText: '#5A666E', // secondary text that must stay readable
  ink: '#0E1014', // headings, body text, outlines
  white: '#FFFFFF', // page background
  surface: '#F4F7F8', // cards and section backgrounds
  border: '#DDE3E6',
  borderStrong: '#C9D2D6',

  // Status surfaces and their tinted borders
  tealBorder: '#BFE9EB',
  success: '#1B6B4F',
  successSoft: '#E3F2EA',
  successBorder: '#B7DCC9',
  danger: '#A3231C',
  dangerSoft: '#FBE9E7',
  dangerBorder: '#EFC4C0',
  warning: '#7A4E06',
  warningSoft: '#FDF3E0',
  warningBorder: '#F0D9A8',
};

// Each level of government gets its own tint so screens stay scannable.
// Every foreground color clears 4.5:1 on its own background.
export const levelTint = {
  local: { bg: '#E7F8F9', fg: '#127074' },
  state: { bg: '#EDF1F2', fg: '#3F4C54' },
  federal: { bg: '#E6E9EB', fg: '#0E1014' },
  regional: { bg: '#F1F7F8', fg: '#2E6E78' },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Rounded corners stay between 8 and 12px to echo the logo's soft corners.
export const radius = {
  sm: 8,
  md: 10,
  lg: 12,
  pill: 999,
};

// One clean sans-serif stack: the platform default (Inter-like) everywhere.
export const font = {
  family: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    web: 'system-ui',
    default: 'System',
  }),
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 24,
    xxl: 32,
    hero: 40,
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: 1.1,
    normal: 1.4,
    relaxed: 1.6,
  },
};

// Reusable text styles. Body copy is ink for strong contrast; secondary copy
// uses slateText, never the lighter slate.
export const text = {
  title: {
    fontFamily: font.family,
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  sectionTitle: {
    fontFamily: font.family,
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
    color: colors.ink,
    letterSpacing: -0.2,
  },
  body: {
    fontFamily: font.family,
    fontSize: font.size.md,
    color: colors.ink,
    lineHeight: font.size.md * 1.55,
  },
  small: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    color: colors.slateText,
    lineHeight: font.size.sm * 1.5,
  },
  label: {
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
};

// The logo files are used exactly as provided, never recolored or cropped.
// 1849x2000 keeps its aspect ratio wherever it is drawn.
export const logo = {
  aspect: 1849 / 2000,
  clearSpace: 0.1, // padding around the mark equal to 10% of its width
};
