// ============================================================
// AI Home Decorator — Centralized Design System Tokens
// ============================================================
// All colors, typography, spacing, and border radii should
// reference this file. No raw color strings in components!
// ============================================================

export const Colors = {
  // Brand Palette - Harmonized with warm architectural amber / terracotta / gold logo
  brand: {
    primary: '#EA580C',       // Warm Terracotta Orange
    secondary: '#F59E0B',     // Honey Gold
    accent: '#D97706',        // Amber Ochre
    primaryLight: '#FB923C',  // Light Amber / Peach (text on dark)
    accentLight: '#FDE68A',   // Warm Honey Cream
  },

  // Background Layers - Warm obsidian & espresso undertones
  background: {
    base: '#0A0806',          // App background (warm deep obsidian)
    card: 'rgba(38, 28, 22, 0.55)',  // Warm tinted card surfaces
    elevated: '#201612',      // Elevated surfaces
    input: '#150E0B',         // Input fields
    subtle: '#3B2920',        // Subtle separators / secondary buttons
  },

  // Text
  text: {
    primary: '#FFFBF5',       // Warm White Headlines & body
    secondary: '#E2D9D2',     // Labels
    muted: '#A89F97',         // Placeholders, captions
    disabled: '#6E645D',      // Disabled states
  },

  // Semantic
  semantic: {
    success: '#22C55E',
    error: '#EF4444',
    errorBg: 'rgba(239, 68, 68, 0.15)',
    warning: '#F59E0B',
    infoBg: 'rgba(234, 88, 12, 0.1)',
    infoBorder: 'rgba(234, 88, 12, 0.3)',
  },

  // Borders
  border: {
    default: 'rgba(255, 255, 255, 0.08)',
    subtle: '#3B2920',
    brand: 'rgba(234, 88, 12, 0.45)',
    brandStrong: '#EA580C',
  },

  // Overlays
  overlay: {
    dark: 'rgba(0, 0, 0, 0.7)',
    modal: 'rgba(0, 0, 0, 0.85)',
  },

  // Transparent utilities
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
};

export const Typography = {
  fontFamily: {
    // When expo-font is configured with a custom font, reference it here
    // regular: 'Inter_400Regular',
    // semiBold: 'Inter_600SemiBold',
    // bold: 'Inter_700Bold',
  },
  size: {
    xs: 11,
    sm: 12,
    base: 14,
    md: 15,
    lg: 18,
    xl: 20,
    '2xl': 22,
    '3xl': 28,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
    black: '900' as const,
  },
  lineHeight: {
    tight: 18,
    normal: 22,
    relaxed: 28,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  '4xl': 30,
  full: 100,
};

export const Shadow = {
  sm: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
};
