/**
 * Cross-scene shared state — used for matched cuts.
 *
 * Scene N writes its closing transform; Scene N+1 reads it on entry and
 * animates from there.
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
