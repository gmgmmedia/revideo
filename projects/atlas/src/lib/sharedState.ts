/**
 * Cross-scene shared state — used for matched cuts.
 *
 * `useScene().variables.get()` only returns read-only signals seeded by
 * project-level configuration. For scene→scene handoff of closing
 * transforms, we use a simple module-level singleton.
 *
 * Scene N writes its closing transform; Scene N+1 reads it on entry and
 * animates from there. Works because scenes evaluate sequentially.
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
