// One shared design system for the whole app.
// Change a color or size here and every screen updates with it.

export const colors = {
  // Brand
  navy: '#1B2A4A',
  navyLight: '#2C3F6A',
  amber: '#E8A020',
  amberLight: '#FDF3E0',

  // Neutrals
  slate: '#F7F8FA',
  white: '#FFFFFF',
  black: '#0D1526',

  // Text on light backgrounds (kept dark enough for readable contrast)
  ink: '#16243D',
  inkSoft: '#44546F',

  // Text on the dark navy background
  steel: '#9FAECB',
  steelLight: '#C3CFE4',

  border: '#DDE2ED',
  borderDark: 'rgba(107, 122, 153, 0.28)',

  // Status
  success: '#1B6B4F',
  successLight: '#E3F2EA',
  danger: '#A3231C',
  dangerLight: '#FBE9E7',
  warning: '#7A4E06',
  warningLight: '#FDF3E0',
};

// Each level of government gets its own tint so screens stay scannable.
export const levelTint = {
  local: { bg: '#E4F2EC', fg: '#12604A' },
  state: { bg: '#E8EBF7', fg: '#2F3F8F' },
  federal: { bg: '#F8E7EE', fg: '#7C2F4B' },
  regional: { bg: '#E4EFF4', fg: '#1B566E' },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 100,
};

export const font = {
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

// Reusable styles for text on light screens.
export const text = {
  title: {
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    color: colors.ink,
    letterSpacing: -0.4,
  },
  sectionTitle: {
    fontSize: font.size.lg,
    fontWeight: font.weight.bold,
    color: colors.ink,
    letterSpacing: -0.2,
  },
  body: {
    fontSize: font.size.md,
    color: colors.inkSoft,
    lineHeight: font.size.md * 1.55,
  },
  small: {
    fontSize: font.size.sm,
    color: colors.inkSoft,
    lineHeight: font.size.sm * 1.5,
  },
  label: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
};
