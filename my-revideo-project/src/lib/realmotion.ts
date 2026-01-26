/**
 * Real Motion Brand System
 * Vaporwave/Retro-Futuristic Web3 Aesthetic
 * Primary: Magenta + Yellow on Dark Navy
 */

// ============================================
// BRAND COLORS
// ============================================
export const REALMOTION = {
  // Primary
  magenta: '#FF00FF',
  yellow: '#FFFF00',
  purple: '#800080',

  // Secondary
  pink: '#E94E87',
  gold: '#F9C632',
  neonGreen: '#55FF33',
  lime: '#CCFF00',
  teal: '#2B9FB8',

  // Neutrals
  darkNavy: '#0F0E1F',
  darkPurple: '#1A1A2E',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const colors = {
  // Primary accent colors
  primary: REALMOTION.magenta,
  secondary: REALMOTION.yellow,
  accent: REALMOTION.pink,

  // Background
  background: REALMOTION.darkNavy,
  backgroundAlt: REALMOTION.darkPurple,

  // Text
  text: REALMOTION.white,
  textAlt: REALMOTION.yellow,

  // Glow colors
  glow: REALMOTION.magenta,
  glowAlt: REALMOTION.yellow,
  glowPink: REALMOTION.pink,

  // Direct access
  magenta: REALMOTION.magenta,
  yellow: REALMOTION.yellow,
  purple: REALMOTION.purple,
  pink: REALMOTION.pink,
  white: REALMOTION.white,
  darkNavy: REALMOTION.darkNavy,
  neonGreen: REALMOTION.neonGreen,
} as const;

// ============================================
// TYPOGRAPHY
// ============================================
export const fonts = {
  heading: 'Oswald, Impact, system-ui, sans-serif',    // Bold condensed for impact
  body: 'Inter, system-ui, sans-serif',                 // Clean body text
  pixel: 'Press Start 2P, monospace',                   // Retro pixel accent
  data: 'JetBrains Mono, monospace',                    // Technical data
} as const;

export const fontSizes = {
  hero: 120,
  h1: 72,
  h2: 56,
  h3: 42,
  body: 32,
  caption: 24,
  data: 48,
  pixel: 16,
} as const;

// ============================================
// ANIMATION TIMING
// ============================================
export const timing = {
  beat: 0.3,              // Visual beat interval
  microBeat: 0.1,         // Sub-beat for layered effects
  entrance: 0.25,         // Element entrance (slightly bouncy)
  exit: 0.15,             // Element exit
  stagger: 0.05,          // Stagger between elements
  hold: 0.1,              // Brief hold after action
  crossfade: 0.15,        // Crossfade transition
  glitch: 0.05,           // Glitch effect duration
} as const;

// ============================================
// EFFECTS
// ============================================
export const effects = {
  // Glow effects
  glowBlur: 20,
  glowOpacity: 0.6,
  glowBlurLarge: 40,
  glowOpacitySubtle: 0.3,

  // Animation effects
  pulseScale: 1.08,
  bounceScale: 1.12,
  shakeIntensity: 4,

  // Retro effects
  scanlineOpacity: 0.03,
  scanlineSpacing: 4,
  rgbSplitOffset: 3,
  chromaticOffset: 2,
} as const;

// ============================================
// LAYOUT (16:9)
// ============================================
export const layout = {
  width: 1920,
  height: 1080,
  centerX: 0,
  centerY: 0,
  safeMargin: 80,
  gridSize: 40,
} as const;

// ============================================
// ICON SVG PATHS
// ============================================
export const icons = {
  // Simple person silhouette (walking figure style)
  person: 'M12 2C13.1 2 14 2.9 14 4S13.1 6 12 6 10 5.1 10 4 10.9 2 12 2M10 7H14C15.1 7 16 7.9 16 9V14H14V22H10V14H8V9C8 7.9 8.9 7 10 7Z',

  // Heart
  heart: 'M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z',

  // Star
  star: 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z',

  // Document/code
  document: 'M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2M18 20H6V4H13V9H18V20M9 13V15H15V13H9M9 17V19H12V17H9Z',

  // Arrow up (growth)
  arrowUp: 'M7 14L12 9L17 14H7Z',

  // Network/connections
  network: 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2M12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6M12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8',

  // Crown (achievement)
  crown: 'M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.55 18.55 20 18 20H6C5.45 20 5 19.55 5 19V18H19V19Z',

  // Code brackets
  code: 'M8 3L3 12L8 21H10L5 12L10 3H8M16 3H14L19 12L14 21H16L21 12L16 3Z',

  // Clock
  clock: 'M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z',

  // Group of people
  group: 'M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11M8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11M8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13M16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z',
} as const;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Parse timestamp format (SS:FF or MM:SS,mmm) to seconds
 */
export function parseTimestamp(ts: string): number {
  if (ts.includes(',')) {
    // SRT format: MM:SS,mmm or HH:MM:SS,mmm
    const [time, ms] = ts.split(',');
    const parts = time.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2] + parseInt(ms) / 1000;
    }
    return parts[0] * 60 + parts[1] + parseInt(ms) / 1000;
  }
  // Frame format: SS:FF
  const [seconds, frames] = ts.split(':').map(Number);
  return seconds + (frames / 30);
}

/**
 * Calculate duration between two timestamps
 */
export function getDuration(start: string, end: string): number {
  return parseTimestamp(end) - parseTimestamp(start);
}

/**
 * Generate stagger delays for array of elements
 */
export function staggerDelays(count: number, baseDelay: number = timing.stagger): number[] {
  return Array.from({ length: count }, (_, i) => i * baseDelay);
}

/**
 * Create scanline Y positions for overlay effect
 */
export function generateScanlines(height: number, spacing: number = effects.scanlineSpacing): number[] {
  const count = Math.ceil(height / spacing);
  return Array.from({ length: count }, (_, i) => -height / 2 + i * spacing);
}
