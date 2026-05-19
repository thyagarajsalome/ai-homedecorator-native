// ============================================================
// AI Home Decorator — Centralized Design System Tokens
// ============================================================
// All colors, typography, spacing, and border radii should
// reference this file. No raw color strings in components!
// ============================================================

export const Colors = {
  // Brand Palette
  brand: {
    primary: '#6366F1',       // Indigo
    secondary: '#D946EF',     // Fuchsia
    accent: '#8B5CF6',        // Violet
    primaryLight: '#818CF8',  // Light Indigo (text on dark)
    accentLight: '#C4B5FD',   // Lavender
  },

  // Background Layers
  background: {
    base: '#050505',          // App background
    card: 'rgba(30, 41, 59, 0.4)',  // Card surfaces
    elevated: '#1E293B',      // Elevated surfaces
    input: '#0F172A',         // Input fields
    subtle: '#334155',        // Subtle separators / secondary buttons
  },

  // Text
  text: {
    primary: '#F8FAFC',       // Headlines & body
    secondary: '#CBD5E1',     // Labels
    muted: '#94A3B8',         // Placeholders, captions
    disabled: '#64748B',      // Disabled states
  },

  // Semantic
  semantic: {
    success: '#22C55E',
    error: '#EF4444',
    errorBg: 'rgba(239, 68, 68, 0.15)',
    warning: '#F59E0B',
    infoBg: 'rgba(139, 92, 246, 0.1)',
    infoBorder: 'rgba(139, 92, 246, 0.3)',
  },

  // Borders
  border: {
    default: 'rgba(255, 255, 255, 0.05)',
    subtle: '#334155',
    brand: 'rgba(99, 102, 241, 0.4)',
    brandStrong: '#6366F1',
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
