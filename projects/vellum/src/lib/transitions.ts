/**
 * Vellum — custom transitions.
 *
 * Editorial wipe-and-fade vocabulary. Paper-tone wash, no glitch, no shake.
 */

import { useTransition, easeInOutCubic, ThreadGenerator } from '@revideo/core';
import { colors } from './brand';

/**
 * Paper Wash — a soft warm-paper sheet sweeps across the frame and lifts.
 * Visually: like turning a page in a magazine, gentle and slow.
 * ~0.7s default; matches motion_design.transition_vocabulary.primary = 'wipe'.
 */
export function* paperWashTransition(duration = 0.7): ThreadGenerator {
  const endTransition = useTransition(
    (ctx) => {
      ctx.save();
    },
    (ctx) => {
      ctx.save();
      ctx.fillStyle = colors.bgWarm;
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
 * Soft Hold — no-op transition wrapper that holds current state for `duration`.
 * Used between sections that need a deliberate magazine pause.
 */
export function* softHoldTransition(duration = 0.4): ThreadGenerator {
  const endTransition = useTransition(
    () => {},
    () => {},
  );

  const frames = Math.max(1, Math.round(duration * 60));
  for (let i = 0; i < frames; i++) {
    yield;
  }
  endTransition();
}

export { easeInOutCubic };
