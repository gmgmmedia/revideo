/**
 * Vellum — Motion Helper Library (v2 convention).
 *
 * Every scene imports from this file rather than re-implementing patterns inline.
 * Encodes the craft details from docs/technical-reference.md Sections 30-34.
 *
 * Vellum-specific tuning:
 *   - NO spring (motion_design.spring_config = 'none')
 *   - NO overshoot (use_overshoot = false). Never easeOutBack.
 *   - Slow editorial pace — 0.10s default char stagger.
 *   - Primary easing: easeOutQuint. Secondary: easeInOutCubic.
 *
 * Reference convention: this file accepts the unwrapped instance form
 * (`Txt`, `Circle`, `Node`) — that is what `createRefArray<T>()` items
 * expose directly. Pass `ref()` for single-ref values (createRef<T>()).
 *
 * Helper set (per v2 convention):
 *   1.  charStagger
 *   2.  multiLayerGlow
 *   3.  countUpMetric           (declared for API completeness; not used by Vellum)
 *   4.  emphasisPulse
 *   5.  rimLight
 *   6.  alignToBeat
 *   7.  asymmetricPosition
 *   8.  computeStagger
 *   9.  cinematicFade
 *   10. breathHold
 */

import { Txt, Circle, Rect, Node, Layout, blur } from '@revideo/2d';
import {
  all, delay, sequence, waitFor, tween,
  Reference, ThreadGenerator,
  easeInOutCubic, easeOutCubic, easeOutQuint, easeOutQuart, linear,
  TimingFunction,
} from '@revideo/core';
import { colors, timing, layout, composition } from './brand';

// ─── Beat Grid types (Section 34) ────────────────────────────────────────
export interface BeatGridEntry {
  time: number;
  layer: 'foreground' | 'background' | 'accent' | 'ambient';
  category: string;
  duration: number;
}
export type BeatGrid = BeatGridEntry[];

// ─── 1. charStagger ───────────────────────────────────────────────────────
/**
 * Sequential character/word reveal.
 * Vellum default technique is 'opacity-y' — characters rise from below.
 * Stagger defaults to 0.10s for the slow editorial pace.
 *
 * Pass an array of Txt instances (e.g. from createRefArray<Txt>()).
 */
export function* charStagger(
  chars: Txt[],
  staggerDelay: number = timing.charStagger,
  charDuration = 0.4,
  technique: 'opacity' | 'opacity-y' | 'opacity-scale' = 'opacity-y',
): ThreadGenerator {
  const gens = chars.map((c) => {
    if (technique === 'opacity-y') {
      return all(
        c.opacity(1, charDuration, easeOutQuint),
        c.y(0, charDuration, easeOutQuint),
      );
    }
    if (technique === 'opacity-scale') {
      // No overshoot for Vellum — use easeOutQuint, NOT easeOutBack
      c.scale(0.92);
      return all(
        c.opacity(1, charDuration, easeOutQuint),
        c.scale(1, charDuration, easeOutQuint),
      );
    }
    return c.opacity(1, charDuration, easeOutCubic);
  });
  yield* sequence(staggerDelay, ...(gens as ThreadGenerator[]));
}

// ─── 2. multiLayerGlow ────────────────────────────────────────────────────
/**
 * 3-layer glow stack entrance (atmospheric haze for Vellum).
 * Outer first (atmosphere), then mid (bloom), then inner (sharp).
 * Vellum keeps the peak opacities VERY low — atmospheric, never punchy.
 *
 * Pass Reference<Circle> values (from createRef<Circle>()) — caller invokes
 * `circleRef` (without parentheses) and helper unwraps via `glow()`.
 */
export function* multiLayerGlow(
  glows: [Reference<Circle>, Reference<Circle>, Reference<Circle>],
  duration = 0.7,
  peakOpacities: [number, number, number] = [0.18, 0.10, 0.05],
  staggerDelays: [number, number, number] = [0, 0.08, 0.16],
): ThreadGenerator {
  yield* all(
    delay(staggerDelays[2], glows[2]().opacity(peakOpacities[2], duration, easeOutCubic) as ThreadGenerator),
    delay(staggerDelays[1], glows[1]().opacity(peakOpacities[1], duration * 0.9, easeOutCubic) as ThreadGenerator),
    delay(staggerDelays[0], glows[0]().opacity(peakOpacities[0], duration * 0.8, easeOutCubic) as ThreadGenerator),
  );
}

// ─── 3. countUpMetric ─────────────────────────────────────────────────────
/**
 * Declared for API completeness. Vellum is NOT data-driven and does not call
 * this helper. Kept here so the helper library is portable to data-heavy
 * sibling brands.
 */
export function* countUpMetric(
  textRef: Reference<Txt>,
  target: number,
  duration = 0.8,
  formatter: (v: number) => string = (v) => Math.round(v).toString(),
  easing: TimingFunction = easeOutQuint,
): ThreadGenerator {
  yield* tween(duration, (t) => {
    const value = target * easing(t);
    textRef().text(formatter(value));
  });
  textRef().text(formatter(target));
}

// ─── 4. emphasisPulse ─────────────────────────────────────────────────────
/**
 * Color/scale/weight/tracking pulse without overshoot.
 * Vellum strongly prefers 'tracking' and 'color' techniques.
 * 'tracking' tightens letter-spacing then releases (signature Vellum move).
 *
 * Pass a Txt instance directly (from createRefArray) — or pass `ref()`
 * if using createRef.
 */
export function* emphasisPulse(
  node: Txt,
  technique: 'color' | 'scale' | 'weight' | 'tracking',
  accentColor: string = colors.accent,
  intensity = 1,
): ThreadGenerator {
  switch (technique) {
    case 'color':
      yield* node.fill(accentColor, 0.15, easeOutCubic);
      yield* waitFor(0.2);
      yield* node.fill(colors.primary, 0.35, easeInOutCubic);
      break;
    case 'scale':
      yield* node.scale(1 + 0.04 * intensity, 0.2, easeOutQuint);
      yield* node.scale(1, 0.3, easeInOutCubic);
      break;
    case 'weight':
      yield* node.fontWeight(400 + 200 * intensity, 0.2, easeOutCubic);
      yield* node.fontWeight(400, 0.3, easeInOutCubic);
      break;
    case 'tracking': {
      const baseTracking = node.letterSpacing();
      yield* node.letterSpacing(baseTracking - 4 * intensity, 0.3, easeOutQuint);
      yield* waitFor(0.15);
      yield* node.letterSpacing(baseTracking, 0.4, easeInOutCubic);
      break;
    }
  }
}

// ─── 5. rimLight ──────────────────────────────────────────────────────────
/**
 * Directional key light at 1/3 offset (rule-of-thirds intersection).
 * Returns a JSX Circle for view.add — call inside scene graph definition.
 */
export function rimLight(
  color: string = colors.accent,
  blurAmount = 200,
  intensity = 0.18,
  position: 'TR' | 'TL' | 'BR' | 'BL' = 'TR',
) {
  const positions: Record<'TR' | 'TL' | 'BR' | 'BL', [number, number]> = {
    TR: [layout.width / 3, -layout.height / 3],
    TL: [-layout.width / 3, -layout.height / 3],
    BR: [layout.width / 3, layout.height / 3],
    BL: [-layout.width / 3, layout.height / 3],
  };
  const [x, y] = positions[position];
  return (
    <Circle
      size={1200}
      x={x}
      y={y}
      fill={color}
      opacity={intensity}
      filters={[blur(blurAmount)]}
    />
  );
}

// ─── 6. alignToBeat ───────────────────────────────────────────────────────
/**
 * Audio-driven sync: wait until target beat time in the beat grid.
 * Used to align animation phases to sfx-manifest beat offsets.
 */
export function* alignToBeat(
  beatGrid: BeatGrid,
  targetIndex: number,
  currentTime: { value: number },
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
/**
 * Rule-of-thirds positioning helper. Returns [x, y] for the requested zone.
 * Used to avoid centered compositions.
 */
export function asymmetricPosition(
  zone:
    | 'TL' | 'TR' | 'BL' | 'BR'
    | 'centerLeft' | 'centerRight'
    | 'topMiddle' | 'bottomMiddle',
): [number, number] {
  switch (zone) {
    case 'TL': return composition.thirdsTL;
    case 'TR': return composition.thirdsTR;
    case 'BL': return composition.thirdsBL;
    case 'BR': return composition.thirdsBR;
    case 'centerLeft': return composition.thirdsCenterL;
    case 'centerRight': return composition.thirdsCenterR;
    case 'topMiddle': return composition.thirdsTopM;
    case 'bottomMiddle': return composition.thirdsBotM;
  }
}

// ─── 8. computeStagger ────────────────────────────────────────────────────
/**
 * Parameterized stagger offsets. Replaces hard-coded delay(...) calls.
 * Returns an array of seconds-offsets (length = count).
 */
export function computeStagger(
  count: number,
  totalSpan: number,
  distribution: 'linear' | 'wave' | 'exponential' | 'cascade',
): number[] {
  if (count <= 1) return [0];
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    switch (distribution) {
      case 'linear':
        return totalSpan * t;
      case 'wave':
        return totalSpan * (t - (0.5 * Math.sin(2 * Math.PI * t)) / (2 * Math.PI));
      case 'exponential':
        return totalSpan * Math.pow(t, 1.6);
      case 'cascade':
        return (totalSpan * (Math.pow(2, t * 4) - 1)) / 15;
      default:
        return totalSpan * t;
    }
  });
}

// ─── 9. cinematicFade ─────────────────────────────────────────────────────
/**
 * Fade with subtle blur — atmospheric haze. Vellum's signature fade.
 * On fade-in: blur dissolves from haze to focus.
 * On fade-out: blur grows back to haze while opacity drops.
 *
 * Pass a Reference (e.g. from createRef<Layout>()) — helper unwraps via `target()`.
 */
export function* cinematicFade(
  target: Reference<Node>,
  fadeIn: boolean,
  duration = 0.6,
  hazeBlur = 8,
): ThreadGenerator {
  if (fadeIn) {
    target().filters([blur(hazeBlur)]);
    yield* all(
      target().opacity(1, duration, easeInOutCubic),
      target().filters([blur(0)], duration, easeInOutCubic) as ThreadGenerator,
    );
  } else {
    yield* all(
      target().opacity(0, duration, easeInOutCubic),
      target().filters([blur(hazeBlur)], duration, easeInOutCubic) as ThreadGenerator,
    );
  }
}

// ─── 10. breathHold ───────────────────────────────────────────────────────
/**
 * Enforced negative-space pause. Defaults to brand timing.hold.
 * Use after dense animation phases — magazine pacing.
 */
export function* breathHold(durationFromBrand: number = timing.hold): ThreadGenerator {
  yield* waitFor(durationFromBrand);
}

// ─── Re-export TimingFunctions for scenes ────────────────────────────────
export { easeOutQuint, easeOutCubic, easeInOutCubic, easeOutQuart, linear };
