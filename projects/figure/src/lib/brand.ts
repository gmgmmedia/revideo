/**
 * Figure Markets Brand System
 * Clean, bright, institutional look with white/light backgrounds and single purple accent
 *
 * @description Shared constants for all Figure/FGRD video animations
 */

// ============================================
// BRAND COLORS - Clean & Bright Palette
// ============================================
export const FIGURE = {
  // Primary brand purple
  purple: '#6366F1',
  purpleLight: '#8B8FFA',
  purpleDark: '#4F46E5',

  // Backgrounds
  white: '#FFFFFF',
  backgroundAlt: '#F8F7FF',  // Subtle purple tint

  // Text colors
  textDark: '#1A1A2E',       // Dark text on light bg
  textLight: '#FFFFFF',       // White text on purple elements
  textMuted: '#64648B',       // Muted secondary text

  // UI elements (for phone mockup)
  uiDark: '#0F0F23',         // Dark UI inside phone
  success: '#22C55E',         // Green for APR numbers
} as const;

export const colors = {
  // Main colors
  background: FIGURE.white,
  backgroundAlt: FIGURE.backgroundAlt,
  primary: FIGURE.purple,
  primaryLight: FIGURE.purpleLight,
  primaryDark: FIGURE.purpleDark,
  secondary: FIGURE.purpleLight,   // Unified to purple (was violet)
  accent: FIGURE.purpleLight,      // Unified to purple (was cyan)

  // Text
  text: FIGURE.textDark,
  textLight: FIGURE.textLight,
  textMuted: FIGURE.textMuted,

  // UI
  uiDark: FIGURE.uiDark,
  success: FIGURE.success,

  // Glow (single purple family)
  glow: FIGURE.purple,
  glowLight: FIGURE.purpleLight,
  glowSecondary: FIGURE.purpleLight,  // For backward compatibility
} as const;

// ============================================
// GRADIENT DEFINITIONS
// ============================================
export const gradients = {
  // Light background gradient with subtle purple tint
  background: [FIGURE.white, FIGURE.backgroundAlt],
  // Purple gradient for accents
  brand: [FIGURE.purple, FIGURE.purpleLight],
} as const;

// ============================================
// TYPOGRAPHY
// ============================================
export const fonts = {
  heading: 'Sharp Grotesk, system-ui, sans-serif',
  body: 'Sharp Grotesk, system-ui, sans-serif',
  display: 'Sharp Grotesk, system-ui, sans-serif',
} as const;

export const fontSizes = {
  hero: 96,
  h1: 72,
  h2: 56,
  h3: 42,
  body: 32,
  caption: 24,
  subline: 28,
} as const;

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// ============================================
// ANIMATION TIMING (~25-30% faster)
// ============================================
export const timing = {
  beat: 0.22,           // Was 0.3
  microBeat: 0.08,      // Was 0.1
  entrance: 0.3,        // Was 0.4
  exit: 0.22,           // Was 0.3
  stagger: 0.06,        // Was 0.08
  hold: 0.15,           // Was 0.2
  crossfade: 0.15,      // Was 0.2
  fast: 0.12,           // Was 0.15
  smooth: 0.45,         // Was 0.6
  premium: 0.6,         // Was 0.8
} as const;

// ============================================
// EFFECTS
// ============================================
export const effects = {
  glowBlur: 30,
  glowOpacity: 0.3,
  glowBlurLarge: 60,
  glowBlurSmall: 15,
  glowOpacitySubtle: 0.15,
  glowOpacityBright: 0.5,
  shadowBlur: 40,
  shadowOpacity: 0.15,
} as const;

// ============================================
// LAYOUT (16:9 @ 1080p)
// ============================================
export const layout = {
  width: 1920,
  height: 1080,
  centerX: 0,
  centerY: 0,
  safeMargin: 100,
  gridSize: 40,
} as const;

// ============================================
// 3D CUBE SETTINGS (for scene 3)
// ============================================
export const cube = {
  size: 300,
  cornerRadius: 12,
  pedestalWidth: 200,
  pedestalHeight: 60,
} as const;

// ============================================
// PHONE MOCKUP SETTINGS (for scene 4)
// ============================================
export const phone = {
  width: 320,
  height: 640,
  borderRadius: 40,
  screenPadding: 12,
  notchWidth: 120,
  notchHeight: 24,
} as const;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate stagger delays for array of elements
 */
export function staggerDelays(count: number, baseDelay: number = timing.stagger): number[] {
  return Array.from({ length: count }, (_, i) => i * baseDelay);
}
