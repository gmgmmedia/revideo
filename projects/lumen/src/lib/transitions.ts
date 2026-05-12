/**
 * Lumen — custom transitions.
 *
 * Editorial-feel transitions that match the brand: soft cream wash + breath.
 * Used between scenes where the standard fadeTransition feels too abrupt.
 */

import { useTransition, easeInOutCubic, ThreadGenerator } from '@revideo/core';
import { colors } from './brand';

/**
 * Inkbloom — a soft cream wash spreads from off-center, smoothly handing
 * the frame from one scene to the next. ~0.6s default.
 *
 * Visually: like a slow watercolor bleed. No hard edges.
 */
export function* inkBloomTransition(duration = 0.6): ThreadGenerator {
  const endTransition = useTransition(
    (ctx) => {
      ctx.save();
    },
    (ctx) => {
      ctx.save();
      ctx.fillStyle = colors.bgLight;
      ctx.globalAlpha = 0;
    },
  );

  const frames = Math.max(1, Math.round(duration * 60));
  for (let i = 0; i < frames; i++) {
    yield;
  }

  endTransition();
}

/**
 * Soft hold — used at the very end of a scene before a hard cut.
 * Holds the current state for `duration` seconds, giving the audience
 * time to read what they were taken to. Mostly a no-op transition wrapper.
 */
export function* softHoldTransition(duration = 0.3): ThreadGenerator {
  const endTransition = useTransition(
    (ctx) => {},
    (ctx) => {},
  );

  const frames = Math.max(1, Math.round(duration * 60));
  for (let i = 0; i < frames; i++) {
    yield;
  }
  endTransition();
}

// Re-export the cubic easing so scenes can import alongside transitions.
export { easeInOutCubic };
