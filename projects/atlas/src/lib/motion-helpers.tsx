/**
 * Atlas — Motion Helper Library (v2).
 *
 * Standardized 10-helper convention from agents/code-generator.md
 * "Motion Helper Library Convention (v2)". Scenes import these
 * instead of re-implementing patterns inline.
 *
 * Helpers encode craft details from docs/technical-reference.md
 * Sections 30-34 (Typography, Lighting, Color, Composition, Audio Sync).
 */

import {Txt, Circle, Rect, Node, blur} from '@revideo/2d';
import {
  all, delay, sequence, waitFor, tween,
  Reference, ThreadGenerator,
  easeInOutCubic, easeOutCubic, easeOutQuint, easeOutQuart,
  easeOutExpo, easeOutBack, linear,
  TimingFunction,
} from '@revideo/core';
import {colors, timing, layout, composition} from './brand';

// ─── Beat Grid Types (Audio Sync — technical-reference Section 34) ───────
export interface BeatGridEntry {
  time: number;
  layer: 'foreground' | 'background' | 'accent' | 'ambient';
  category: string;
  duration: number;
}

export type BeatGrid = BeatGridEntry[];

// ─── 1. charStagger ───────────────────────────────────────────────────────
// Sequential character/word reveal. Atlas default = opacity-y (premium snap).
// Accepts either ReferenceArray<Txt> (iteration yields Txt nodes) or Array<Reference<Txt>>.
export function* charStagger(
  chars: ArrayLike<Txt | Reference<Txt>>,
  staggerDelay = 0.04,
  charDuration = 0.18,
  technique: 'opacity' | 'opacity-y' | 'opacity-scale' = 'opacity-y',
): ThreadGenerator {
  // Normalize: if entry is a Reference (callable), unwrap it to the underlying Txt.
  const nodes: Txt[] = Array.from(chars as any).map((c: any) =>
    typeof c === 'function' ? (c as Reference<Txt>)() : (c as Txt),
  );
  const gens: ThreadGenerator[] = nodes.map(n => {
    if (technique === 'opacity-y') {
      return all(
        n.opacity(1, charDuration, easeOutExpo),
        n.y(0, charDuration, easeOutQuart),
      ) as ThreadGenerator;
    }
    if (technique === 'opacity-scale') {
      n.scale(0.7);
      return all(
        n.opacity(1, charDuration, easeOutBack),
        n.scale(1, charDuration, easeOutBack),
      ) as ThreadGenerator;
    }
    return n.opacity(1, charDuration, easeOutExpo) as ThreadGenerator;
  });
  yield* sequence(staggerDelay, ...gens);
}

// ─── 2. multiLayerGlow ────────────────────────────────────────────────────
// 3-layer glow stack entrance (inner sharp + mid + outer bloom).
// Accepts either Reference<Circle> (callable) or Circle node directly.
export function* multiLayerGlow(
  glows: [
    Reference<Circle> | Circle,
    Reference<Circle> | Circle,
    Reference<Circle> | Circle,
  ],
  duration = 0.5,
  peakOpacities: [number, number, number] = [0.45, 0.28, 0.14],
  staggerDelays: [number, number, number] = [0, 0.05, 0.1],
): ThreadGenerator {
  const unwrap = (g: Reference<Circle> | Circle): Circle =>
    typeof g === 'function' ? (g as Reference<Circle>)() : (g as Circle);
  const inner = unwrap(glows[0]);
  const mid = unwrap(glows[1]);
  const outer = unwrap(glows[2]);
  // Outer first (atmospheric haze), then mid (bloom), then inner (sharp)
  yield* all(
    delay(staggerDelays[2], outer.opacity(peakOpacities[2], duration, easeOutCubic) as ThreadGenerator),
    delay(staggerDelays[1], mid.opacity(peakOpacities[1], duration * 0.85, easeOutCubic) as ThreadGenerator),
    delay(staggerDelays[0], inner.opacity(peakOpacities[0], duration * 0.7, easeOutCubic) as ThreadGenerator),
  );
}

// ─── 3. countUpMetric ─────────────────────────────────────────────────────
// Animate number text from 0 to target with easing.
// Accepts either a Reference<Txt> (callable) or a Txt node directly.
export function* countUpMetric(
  textRef: Reference<Txt> | Txt,
  target: number,
  duration = 0.8,
  formatter: (v: number) => string = (v) => Math.round(v).toString(),
  easing: TimingFunction = easeOutQuint,
): ThreadGenerator {
  const node: Txt = typeof textRef === 'function'
    ? (textRef as Reference<Txt>)()
    : (textRef as Txt);
  yield* tween(duration, (t) => {
    const value = target * easing(t);
    node.text(formatter(value));
  });
  node.text(formatter(target));  // ensure final value is exact
}

// ─── 4. emphasisPulse ─────────────────────────────────────────────────────
// Color / scale / weight / tracking pulse. Atlas default uses overshoot.
// Accepts either Reference (callable) or the actual node.
export function* emphasisPulse(
  node: Reference<Txt> | Reference<Rect> | Reference<Node> | Txt | Rect | Node,
  technique: 'color' | 'scale' | 'weight' | 'tracking',
  accentColor: string = colors.accent,
  intensity = 1,
): ThreadGenerator {
  const target: any = typeof node === 'function' ? (node as any)() : node;
  switch (technique) {
    case 'color': {
      yield* target.fill(accentColor, 0.08, easeOutExpo);
      yield* waitFor(0.16);
      yield* target.fill(colors.white, 0.22, easeInOutCubic);
      break;
    }
    case 'scale': {
      yield* target.scale(1 + 0.12 * intensity, 0.12, easeOutBack);
      yield* target.scale(1, 0.22, easeInOutCubic);
      break;
    }
    case 'weight': {
      yield* target.fontWeight(900, 0.12, easeOutExpo);
      yield* target.fontWeight(700, 0.22, easeInOutCubic);
      break;
    }
    case 'tracking': {
      const base: number = (target.letterSpacing() as number) ?? 0;
      yield* target.letterSpacing(base - 4 * intensity, 0.18, easeOutQuart);
      yield* target.letterSpacing(base, 0.28, easeInOutCubic);
      break;
    }
  }
}

// ─── 5. rimLight ──────────────────────────────────────────────────────────
// Directional key light positioned at 1/3 offset. Returns JSX node.
export function rimLight(
  color: string = colors.accent,
  blurAmount = 90,
  intensity = 0.45,
  position: 'TR' | 'TL' | 'BR' | 'BL' = 'TR',
  size = 720,
) {
  const positions = {
    TR: [layout.width / 3, -layout.height / 3],
    TL: [-layout.width / 3, -layout.height / 3],
    BR: [layout.width / 3, layout.height / 3],
    BL: [-layout.width / 3, layout.height / 3],
  } as const;
  const [x, y] = positions[position];
  return (
    <Circle
      size={size}
      x={x}
      y={y}
      fill={color}
      opacity={intensity}
      filters={[blur(blurAmount) as any]}
    />
  );
}

// ─── 6. alignToBeat ───────────────────────────────────────────────────────
// Wait until target beat in beatGrid (audio sync).
export function* alignToBeat(
  beatGrid: BeatGrid,
  targetIndex: number,
  currentTime: {value: number},
): ThreadGenerator {
  const target = beatGrid[targetIndex]?.time;
  if (target === undefined) return;
  const delta = target - currentTime.value;
  if (delta > 0) {
    yield* waitFor(delta);
    currentTime.value = target;
  }
}

// ─── 7. asymmetricPosition ────────────────────────────────────────────────
// Rule-of-thirds positioning helper.
export function asymmetricPosition(
  zone: 'TL' | 'TR' | 'BL' | 'BR' | 'centerLeft' | 'centerRight' | 'topMiddle' | 'bottomMiddle',
): [number, number] {
  switch (zone) {
    case 'TL': return composition.thirdsTL;
    case 'TR': return composition.thirdsTR;
    case 'BL': return composition.thirdsBL;
    case 'BR': return composition.thirdsBR;
    case 'centerLeft': return composition.centerLeft;
    case 'centerRight': return composition.centerRight;
    case 'topMiddle': return composition.topMiddle;
    case 'bottomMiddle': return composition.bottomMiddle;
  }
}

// ─── 8. computeStagger ────────────────────────────────────────────────────
// Parameterized stagger replacing hard-coded delays.
export function computeStagger(
  count: number,
  totalSpan: number,
  distribution: 'linear' | 'wave' | 'exponential' | 'cascade',
): number[] {
  if (count <= 1) return [0];
  return Array.from({length: count}, (_, i) => {
    const t = i / (count - 1);
    switch (distribution) {
      case 'linear': return totalSpan * t;
      case 'wave': return totalSpan * (t - 0.5 * Math.sin(2 * Math.PI * t) / (2 * Math.PI));
      case 'exponential': return totalSpan * Math.pow(t, 1.6);
      case 'cascade': return totalSpan * (Math.pow(2, t * 4) - 1) / 15;
    }
  });
}

// ─── 9. cinematicFade ─────────────────────────────────────────────────────
// Fade with subtle blur (atmospheric haze).
export function* cinematicFade(
  target: Reference<Node>,
  fadeIn: boolean,
  duration = 0.4,
  hazeBlur = 10,
): ThreadGenerator {
  if (fadeIn) {
    (target() as Node).filters([blur(hazeBlur) as any]);
    yield* all(
      (target() as Node).opacity(1, duration, easeOutExpo),
      (target() as any).filters([blur(0) as any], duration, easeOutCubic),
    );
  } else {
    yield* all(
      (target() as Node).opacity(0, duration, easeInOutCubic),
      (target() as any).filters([blur(hazeBlur) as any], duration, easeInOutCubic),
    );
  }
}

// ─── 10. breathHold ───────────────────────────────────────────────────────
// Enforced negative-space pause. Atlas brand keeps it brief (0.3s default).
export function* breathHold(durationFromBrand: number = timing.hold): ThreadGenerator {
  yield* waitFor(durationFromBrand);
}

// ─── Extras (Atlas-specific) ──────────────────────────────────────────────

/**
 * Screen-shake — animates a wrapper world's position with random offsets.
 * Used at PR/impact moments. Decays over duration.
 */
export function* screenShake(
  world: Reference<any>,
  intensity = 18,
  duration = 0.4,
  steps = 8,
): ThreadGenerator {
  const stepDuration = duration / steps;
  for (let i = 0; i < steps; i++) {
    const decay = 1 - (i / steps);
    const dx = (Math.random() - 0.5) * 2 * intensity * decay;
    const dy = (Math.random() - 0.5) * 2 * intensity * decay;
    yield* (world() as any).position([dx, dy], stepDuration, linear);
  }
  yield* (world() as any).position([0, 0], stepDuration, easeOutCubic);
}

/**
 * Format MM:SS from a number of seconds.
 * E.g. 1307 -> "21:47"
 */
export function formatMMSS(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
