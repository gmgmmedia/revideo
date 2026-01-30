/**
 * Figure Markets Brand System
 * Premium fintech meets Web3 - institutional credibility with modern digital asset energy
 *
 * @description Shared constants for all Figure/FGRD video animations
 */

// ============================================
// BRAND COLORS - Figure Markets Palette
// ============================================
export const FIGURE = {
  indigo: '#6366F1',      // Primary brand
  violet: '#8B5CF6',      // Secondary accent
  cyan: '#06B6D4',        // Interactive accent
  dark: '#0F0F23',        // Background
  white: '#FFFFFF',       // Primary text
  muted: '#94A3B8',       // Secondary text
  indigoDark: '#4F46E5',  // Dark variant
  indigoLight: '#818CF8', // Light variant
} as const;

export const colors = {
  primary: FIGURE.indigo,
  secondary: FIGURE.violet,
  accent: FIGURE.cyan,
  background: FIGURE.dark,
  text: FIGURE.white,
  textMuted: FIGURE.muted,
  glow: FIGURE.indigo,
  glowSecondary: FIGURE.violet,
} as const;

// ============================================
// GRADIENT DEFINITIONS
// ============================================
export const gradients = {
  brand: [FIGURE.indigo, FIGURE.violet, '#A78BFA'],
  subtle: [FIGURE.indigo, FIGURE.indigoDark],
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
// ANIMATION TIMING
// ============================================
export const timing = {
  beat: 0.3,
  microBeat: 0.1,
  entrance: 0.4,
  exit: 0.3,
  stagger: 0.08,
  hold: 0.2,
  crossfade: 0.2,
  fast: 0.15,
  smooth: 0.6,
  premium: 0.8,
} as const;

// ============================================
// EFFECTS
// ============================================
export const effects = {
  glowBlur: 30,
  glowOpacity: 0.5,
  glowBlurLarge: 60,
  glowBlurSmall: 15,
  glowOpacitySubtle: 0.25,
  glowOpacityBright: 0.7,
  pulseScale: 1.03,
  glassmorphBlur: 20,
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
  perspective: 800,
  faceGap: 2,
  strokeWidth: 2,
  cornerRadius: 16,
} as const;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create a radial gradient color string for backgrounds
 */
export function radialGlow(
  color: string,
  opacity: number = 0.15
): string {
  return `radial-gradient(circle, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}, transparent)`;
}

/**
 * Generate stagger delays for array of elements
 */
export function staggerDelays(count: number, baseDelay: number = timing.stagger): number[] {
  return Array.from({ length: count }, (_, i) => i * baseDelay);
}

/**
 * Interpolate between two colors
 */
export function lerpColor(from: string, to: string, t: number): string {
  const parseHex = (hex: string) => {
    const h = hex.replace('#', '');
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  };

  const f = parseHex(from);
  const toC = parseHex(to);

  const r = Math.round(f.r + (toC.r - f.r) * t);
  const g = Math.round(f.g + (toC.g - f.g) * t);
  const b = Math.round(f.b + (toC.b - f.b) * t);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
