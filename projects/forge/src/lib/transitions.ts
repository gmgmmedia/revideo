/**
 * Forge — custom transitions.
 *
 * Indie game vocabulary: iris (Circle mask growing from center) and glitch
 * (RGB-split via compositeOperation 'difference' with offset duplicates).
 * Both are deliberately short (<0.4s) — Forge avoids long fades.
 */

import {
  useTransition,
  easeOutCubic,
  easeInOutCubic,
  easeOutExpo,
  ThreadGenerator,
} from '@revideo/core';
import { colors } from './brand';

/**
 * Iris transition — a Circle mask growing from the center reveals the new
 * scene. Visually like a camera shutter opening. Used between scenes.
 *
 * Duration default 0.4s. Forge's transition_vocabulary.primary = 'iris'.
 */
export function* irisTransition(duration = 0.4): ThreadGenerator {
  const frames = Math.max(1, Math.round(duration * 60));
  let frame = 0;

  const endTransition = useTransition(
    // Current scene context — paint a dark backing then mask in a growing
    // circle of "destination-in" that lets the upcoming scene show through.
    (ctx) => {
      const t = Math.min(1, frame / frames);
      const eased = easeOutExpo(t);
      const w = 1920;
      const h = 1080;
      const maxR = Math.sqrt(w * w + h * h) / 2;
      const r = eased * maxR;

      // Outside the growing iris circle, paint a dark cosmic wash so the
      // previous scene fades behind the opening shutter.
      ctx.save();
      ctx.fillStyle = colors.primary;
      ctx.globalAlpha = eased;
      // Use evenodd fill rule: outer rectangle minus inner circle.
      ctx.beginPath();
      ctx.rect(0, 0, w, h);
      ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2, true);
      ctx.fill('evenodd');
      ctx.restore();
    },
    // Previous scene context — fade it out behind the iris.
    (ctx) => {
      const t = Math.min(1, frame / frames);
      ctx.save();
      ctx.globalAlpha = 1 - easeOutCubic(t);
    },
  );

  for (let i = 0; i < frames; i++) {
    frame = i + 1;
    yield;
  }

  endTransition();
}

/**
 * Glitch transition — RGB-split chromatic-aberration style flicker between
 * scenes. Uses 'difference' compositeOperation with horizontally offset
 * paint passes over a short duration. ~0.3s default.
 *
 * Forge's transition_vocabulary.section_change = 'glitch'.
 */
export function* glitchTransition(duration = 0.3): ThreadGenerator {
  const frames = Math.max(1, Math.round(duration * 60));
  let frame = 0;

  const endTransition = useTransition(
    // Current scene context (the new scene as it enters)
    (ctx) => {
      const t = Math.min(1, frame / frames);
      // Stuttering offset that decays over the transition
      const intensity = (1 - t) * 18;
      const stutter = Math.sin(frame * 1.7) * intensity;
      ctx.save();
      ctx.translate(stutter, 0);
    },
    // Previous scene context — flash RGB-split aberration over it
    (ctx) => {
      const t = Math.min(1, frame / frames);
      const fadeOut = 1 - t;
      ctx.save();
      ctx.globalCompositeOperation = 'difference';
      ctx.globalAlpha = 0.45 * fadeOut;
      ctx.fillStyle = colors.accent;       // magenta channel
      ctx.fillRect(-8 * fadeOut, 0, 1920, 1080);
      ctx.globalAlpha = 0.35 * fadeOut;
      ctx.fillStyle = colors.tertiary;     // blue channel
      ctx.fillRect(8 * fadeOut, 0, 1920, 1080);
    },
  );

  for (let i = 0; i < frames; i++) {
    frame = i + 1;
    yield;
  }

  endTransition();
}

/**
 * Flash transition — extremely brief screen flash (Forge uses for impact
 * moments between scenes when iris/glitch feels too long). ~0.15s.
 */
export function* flashTransition(duration = 0.15): ThreadGenerator {
  const frames = Math.max(1, Math.round(duration * 60));
  let frame = 0;

  const endTransition = useTransition(
    (ctx) => {
      const t = Math.min(1, frame / frames);
      ctx.save();
      ctx.fillStyle = colors.white;
      ctx.globalAlpha = (1 - t) * 0.85;
      ctx.fillRect(0, 0, 1920, 1080);
    },
    (ctx) => {
      const t = Math.min(1, frame / frames);
      ctx.save();
      ctx.globalAlpha = 1 - easeInOutCubic(t);
    },
  );

  for (let i = 0; i < frames; i++) {
    frame = i + 1;
    yield;
  }

  endTransition();
}

export { easeOutCubic, easeInOutCubic, easeOutExpo };
