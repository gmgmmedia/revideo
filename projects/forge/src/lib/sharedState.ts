/**
 * Cross-scene shared state — used for any transform handoff between scenes.
 *
 * Forge doesn't lean on matched cuts (motion_design.matched_cut_friendly = false)
 * but we keep the singleton available so glitch transitions can read the
 * previous scene's accent color or hero position when needed.
 */

export interface MatchedCutTransform {
  anchor: string;
  position: [number, number];
  scale: number;
  rotation: number;
}

let matchedCut: MatchedCutTransform | null = null;

export function setMatchedCut(t: MatchedCutTransform): void {
  matchedCut = t;
}

export function getMatchedCut(anchor?: string): MatchedCutTransform | null {
  if (anchor && matchedCut?.anchor !== anchor) return null;
  return matchedCut;
}

export function clearMatchedCut(): void {
  matchedCut = null;
}
