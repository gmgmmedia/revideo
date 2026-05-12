/**
 * Forge — motion-helpers.ts (v2 standardised helper library).
 *
 * 10 standardised helpers from agents/code-generator.md "Motion Helper
 * Library Convention (v2)". Scenes import these instead of re-implementing
 * patterns inline. Defaults tuned for Forge's high-energy indie game DNA:
 * heavy overshoot, dense pacing, particle bursts, screen shake.
 */

import {
  Txt,
  Circle,
  Rect,
  Node,
  Layout,
  blur,
} from '@revideo/2d';
import {
  all,
  delay,
  sequence,
  waitFor,
  tween,
  Reference,
  ThreadGenerator,
  TimingFunction,
  easeInOutCubic,
  easeOutCubic,
  easeOutQuart,
  easeOutQuint,
  easeOutExpo,
  easeOutBack,
  linear,
} from '@revideo/core';
import { colors, timing, layout } from './brand';

export interface BeatGridEntry {
  time: number;
  layer: 'foreground' | 'background' | 'accent' | 'ambient';
  category: string;
  duration: number;
}

export type BeatGrid = BeatGridEntry[];

// ── 1. charStagger — sequential character/word reveal ────────────────────
// Defaults to opacity-scale for Forge (energetic, playful) with easeOutBack
// for strong overshoot — every hero entrance uses this technique.
export function* charStagger(
  chars: Array<Reference<Txt>>,
  staggerDelay = 0.04,
  charDuration = 0.22,
  technique: 'opacity' | 'opacity-y' | 'opacity-scale' = 'opacity-scale',
): ThreadGenerator {
  const gens = chars.map((c) => {
    if (technique === 'opacity-y') {
      return all(
        c().opacity(1, charDuration, easeOutBack),
        c().y(0, charDuration, easeOutBack),
      ) as ThreadGenerator;
    }
    if (technique === 'opacity-scale') {
      // Strong overshoot — characters scale from 0.6 → past 1.0 → settle at 1.0
      c().scale(0.55);
      return all(
        c().opacity(1, charDuration, easeOutCubic),
        c().scale(1, charDuration, easeOutBack),
      ) as ThreadGenerator;
    }
    return c().opacity(1, charDuration, easeOutCubic) as ThreadGenerator;
  });
  yield* sequence(staggerDelay, ...gens);
}

// ── 2. multiLayerGlow — 3-layer glow stack entrance ──────────────────────
// Inner sharp + mid bloom + outer atmospheric haze. Indie game brands use
// higher opacities than calm brands (additive-bloom lighting_style).
export function* multiLayerGlow(
  glows: [Reference<Circle>, Reference<Circle>, Reference<Circle>],
  duration = 0.4,
  peakOpacities: [number, number, number] = [0.55, 0.4, 0.25],
  staggerDelays: [number, number, number] = [0, 0.04, 0.08],
): ThreadGenerator {
  yield* all(
    delay(staggerDelays[2], glows[2]().opacity(peakOpacities[2], duration, easeOutCubic) as ThreadGenerator),
    delay(staggerDelays[1], glows[1]().opacity(peakOpacities[1], duration * 0.85, easeOutCubic) as ThreadGenerator),
    delay(staggerDelays[0], glows[0]().opacity(peakOpacities[0], duration * 0.7, easeOutCubic) as ThreadGenerator),
  );
}

// ── 3. countUpMetric — animate number text from 0 to target ──────────────
export function* countUpMetric(
  textRef: Reference<Txt>,
  target: number,
  duration = 0.6,
  formatter: (v: number) => string = (v) => Math.round(v).toString(),
  easing: TimingFunction = easeOutQuint,
): ThreadGenerator {
  yield* tween(duration, (t) => {
    const value = target * easing(t);
    textRef().text(formatter(value));
  });
  textRef().text(formatter(target));
}

// ── 4. emphasisPulse — color/scale/weight pulse ──────────────────────────
// Forge defaults to 'scale' technique with overshoot — every emphasis
// moment is an overshoot+settle (overshoot-settle vocabulary).
export function* emphasisPulse(
  node: Reference<Txt> | Reference<Rect> | Reference<Node>,
  technique: 'color' | 'scale' | 'weight' | 'tracking' = 'scale',
  accentColor: string = colors.accent,
  intensity = 1,
): ThreadGenerator {
  switch (technique) {
    case 'color': {
      const txtNode = node as Reference<Txt>;
      yield* txtNode().fill(accentColor, 0.08, easeOutCubic);
      yield* txtNode().fill(colors.white, 0.2, easeInOutCubic);
      break;
    }
    case 'scale': {
      // Heavy overshoot — scale to 1.15 then settle to 1.0
      yield* node().scale(1 + 0.15 * intensity, 0.12, easeOutBack);
      yield* node().scale(1, 0.18, easeInOutCubic);
      break;
    }
    case 'weight': {
      const txtNode = node as Reference<Txt>;
      yield* txtNode().fontWeight(900, 0.1, easeOutCubic);
      yield* txtNode().fontWeight(700, 0.2, easeInOutCubic);
      break;
    }
    case 'tracking': {
      const txtNode = node as Reference<Txt>;
      const baseTracking = txtNode().letterSpacing();
      yield* txtNode().letterSpacing(baseTracking + 6 * intensity, 0.15, easeOutCubic);
      yield* txtNode().letterSpacing(baseTracking, 0.25, easeInOutCubic);
      break;
    }
  }
}

// ── 5. rimLight — directional key light positioned at 1/3 offset ─────────
// Returns a Circle node ready to be added to view. Forge uses magenta or
// gold rim lights weighted to thirds intersections.
export function rimLight(
  color: string = colors.accent,
  blurAmount = 120,
  intensity = 0.42,
  position: 'TR' | 'TL' | 'BR' | 'BL' = 'TR',
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
      size={520}
      x={x}
      y={y}
      fill={color}
      opacity={intensity}
      filters={[blur(blurAmount)]}
    />
  );
}

// ── 6. alignToBeat — wait until next beat in beatGrid (audio sync) ───────
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

// ── 7. asymmetricPosition — rule-of-thirds positioning helper ────────────
export function asymmetricPosition(
  zone:
    | 'TL' | 'TR' | 'BL' | 'BR'
    | 'centerLeft' | 'centerRight' | 'topMiddle' | 'bottomMiddle',
): [number, number] {
  const tX = layout.width / 3;
  const tY = layout.height / 3;
  switch (zone) {
    case 'TL': return [-tX, -tY];
    case 'TR': return [tX, -tY];
    case 'BL': return [-tX, tY];
    case 'BR': return [tX, tY];
    case 'centerLeft': return [-tX, 0];
    case 'centerRight': return [tX, 0];
    case 'topMiddle': return [0, -tY];
    case 'bottomMiddle': return [0, tY];
  }
}

// ── 8. computeStagger — parameterised stagger replacing hard-coded delays ─
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
        return totalSpan * (t - 0.5 * Math.sin(2 * Math.PI * t) / (2 * Math.PI));
      case 'exponential':
        return totalSpan * Math.pow(t, 1.6);
      case 'cascade':
        return totalSpan * (Math.pow(2, t * 4) - 1) / 15;
      default:
        return totalSpan * t;
    }
  });
}

// ── 9. cinematicFade — fade with subtle blur (atmospheric haze) ──────────
export function* cinematicFade(
  target: Reference<Node> | Reference<Layout>,
  fadeIn: boolean,
  duration = 0.35,
  hazeBlur = 6,
): ThreadGenerator {
  if (fadeIn) {
    target().filters([blur(hazeBlur)]);
    target().opacity(0);
    yield* all(
      target().opacity(1, duration, easeOutCubic) as ThreadGenerator,
      target().filters([blur(0)], duration, easeInOutCubic) as ThreadGenerator,
    );
  } else {
    yield* all(
      target().opacity(0, duration, easeInOutCubic) as ThreadGenerator,
      target().filters([blur(hazeBlur)], duration, easeInOutCubic) as ThreadGenerator,
    );
  }
}

// ── 10. breathHold — enforced negative-space pause (composition discipline)
// Forge's hold is short (0.18s default) — no long static holds per spec.
export function* breathHold(durationFromBrand: number = timing.hold): ThreadGenerator {
  yield* waitFor(durationFromBrand);
}

// ── Bonus: particleBurst — sequence-staggered radial burst (Forge signature)
// Drives N circles outward from a center via signal arrays. Caller provides
// pre-positioned refs (placed at center=[0,0] before burst) and target
// positions. Cascade distribution gives accelerating "explosion" energy.
export function* particleBurst(
  particles: Array<Reference<Circle>>,
  targetPositions: Array<[number, number]>,
  totalDuration = 0.55,
): ThreadGenerator {
  const delays = computeStagger(particles.length, 0.15, 'cascade');
  const gens: ThreadGenerator[] = particles.map((p, i) => {
    const target = targetPositions[i] ?? [0, 0];
    return delay(
      delays[i] ?? 0,
      all(
        p().position(target, totalDuration * 0.85, easeOutExpo) as ThreadGenerator,
        p().opacity(0.95, totalDuration * 0.25, easeOutCubic) as ThreadGenerator,
        p().scale(1, totalDuration * 0.35, easeOutBack) as ThreadGenerator,
        // Then fade out over the second half of total duration
        delay(
          totalDuration * 0.35,
          all(
            p().opacity(0, totalDuration * 0.6, easeOutCubic) as ThreadGenerator,
            p().scale(0.3, totalDuration * 0.65, easeInOutCubic) as ThreadGenerator,
          ) as ThreadGenerator,
        ) as ThreadGenerator,
      ) as ThreadGenerator,
    ) as ThreadGenerator;
  });
  yield* all(...gens);
}

// ── Bonus: screenShake — animate world().position with random offsets ────
// 3-5 oscillations over `duration` seconds at impact moments. Caller passes
// the world ref and a seeded Random.
export function* screenShake(
  world: Reference<Layout>,
  rng: { nextFloat: (a: number, b: number) => number },
  amplitude = 10,
  oscillations = 5,
  duration = 0.2,
): ThreadGenerator {
  const stepDuration = duration / (oscillations + 1);
  for (let i = 0; i < oscillations; i++) {
    yield* world().position(
      [rng.nextFloat(-amplitude, amplitude), rng.nextFloat(-amplitude, amplitude)],
      stepDuration,
      linear,
    );
  }
  yield* world().position([0, 0], stepDuration, easeOutCubic);
}
