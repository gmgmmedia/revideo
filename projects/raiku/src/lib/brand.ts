/**
 * Raiku Brand System
 * THREE COLORS ONLY - Black, White, Neon
 * 
 * @description Shared constants for all Raiku video animations
 */

// ============================================
// BRAND COLORS - THREE ONLY, NO EXCEPTIONS
// ============================================
export const RAIKU = {
  neon: '#C0FF38',
  black: '#000204',
  white: '#FDFDFF',
} as const;

export const colors = {
  primary: RAIKU.neon,
  secondary: RAIKU.black,
  background: RAIKU.black,
  text: RAIKU.white,
  accent: RAIKU.neon,
  glow: RAIKU.neon,
  neon: RAIKU.neon,
  white: RAIKU.white,
  black: RAIKU.black,
} as const;

// ============================================
// TYPOGRAPHY
// ============================================
export const fonts = {
  heading: 'JetBrains Mono, monospace',
  body: 'Inter, system-ui, sans-serif',
  data: 'JetBrains Mono, monospace',
} as const;

export const fontSizes = {
  hero: 120,
  h1: 72,
  h2: 56,
  h3: 42,
  body: 32,
  caption: 24,
  data: 48,
} as const;

// ============================================
// ANIMATION TIMING
// ============================================
export const timing = {
  beat: 0.3,
  microBeat: 0.1,
  entrance: 0.2,
  exit: 0.15,
  stagger: 0.05,
  hold: 0.1,
  crossfade: 0.1,
  fast: 0.08,
  snap: 0.05,
} as const;

// ============================================
// EFFECTS
// ============================================
export const effects = {
  glowBlur: 20,
  glowOpacity: 0.6,
  glowBlurLarge: 40,
  glowBlurSmall: 10,
  glowOpacitySubtle: 0.3,
  glowOpacityBright: 0.8,
  pulseScale: 1.05,
  pulseScaleLarge: 1.1,
  shakeIntensity: 3,
} as const;

// ============================================
// LAYOUT (16:9 @ 1080p)
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
// CUBE DIMENSIONS (for warehouse metaphor)
// ============================================
export const cube = {
  size: 80,
  sizeSmall: 50,
  sizeLarge: 120,
  gap: 20,
  strokeWidth: 2,
  strokeWidthThick: 3,
} as const;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Parse Raiku timestamp format (SS:FF) to seconds
 * @param ts - Timestamp string in format "SS:FF" (seconds:frames at 30fps)
 * @returns Time in seconds
 */
export function parseTimestamp(ts: string): number {
  const [seconds, frames] = ts.split(':').map(Number);
  return seconds + (frames / 30);
}

/**
 * Calculate duration between two timestamps
 * @param start - Start timestamp
 * @param end - End timestamp
 * @returns Duration in seconds
 */
export function getDuration(start: string, end: string): number {
  return parseTimestamp(end) - parseTimestamp(start);
}

/**
 * Generate stagger delays for array of elements
 * @param count - Number of elements
 * @param baseDelay - Delay between each element
 * @returns Array of delay values
 */
export function staggerDelays(count: number, baseDelay: number = timing.stagger): number[] {
  return Array.from({ length: count }, (_, i) => i * baseDelay);
}

/**
 * Generate grid positions for isometric cube layout
 * @param rows - Number of rows
 * @param cols - Number of columns
 * @param spacing - Space between cubes
 * @returns Array of {x, y} positions
 */
export function generateGridPositions(
  rows: number,
  cols: number,
  spacing: number = cube.size + cube.gap
): Array<{ x: number; y: number }> {
  const positions: Array<{ x: number; y: number }> = [];
  const offsetX = ((cols - 1) * spacing) / 2;
  const offsetY = ((rows - 1) * spacing) / 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      positions.push({
        x: col * spacing - offsetX,
        y: row * spacing - offsetY,
      });
    }
  }
  return positions;
}

/**
 * Generate isometric offset for pseudo-3D effect
 * @param index - Element index
 * @param total - Total elements
 * @returns {x, y} offset values
 */
export function isometricOffset(index: number, total: number): { x: number; y: number } {
  const angle = (index / total) * Math.PI * 2;
  return {
    x: Math.cos(angle) * 20,
    y: Math.sin(angle) * 10,
  };
}
