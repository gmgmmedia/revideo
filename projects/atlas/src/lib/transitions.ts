/**
 * Atlas — custom transitions.
 *
 * Athletic-feel transitions: wipe & whipPan. Bold, sharp, no fades.
 * Matches motion_design.transition_vocabulary (primary: wipe, scene_change: wipe).
 */

import {useTransition, easeOutExpo, easeOutQuart, ThreadGenerator, tween} from '@revideo/core';
import {colors} from './brand';

/**
 * Wipe transition — orange signal bar sweeps across to the right.
 * Used between high-energy scenes. ~0.35s.
 */
export function* wipeTransition(duration = 0.35): ThreadGenerator {
  let progress = 0;

  const endTransition = useTransition(
    (ctx) => {
      // Current scene is fully revealed below the wipe bar's tail
      ctx.save();
      // Clip out everything to the LEFT of the wipe edge (current scene exits left-side first)
      const edge = progress * 1920;
      ctx.beginPath();
      ctx.rect(edge, 0, 1920 - edge, 1080);
      ctx.clip();
    },
    (ctx) => {
      // Incoming scene is revealed on the LEFT of the wipe edge
      ctx.save();
      const edge = progress * 1920;
      ctx.beginPath();
      ctx.rect(0, 0, edge, 1080);
      ctx.clip();
    },
  );

  yield* tween(duration, (t) => {
    progress = easeOutExpo(t);
  });

  // Restore both saves (one per cb)
  endTransition();
}

/**
 * Whip-pan transition — the entire frame motion-blurs and slams across.
 * Used for scene_change in Atlas. ~0.35s.
 */
export function* whipPanTransition(duration = 0.35): ThreadGenerator {
  let progress = 0;

  const endTransition = useTransition(
    (ctx) => {
      // Outgoing scene: slide left
      ctx.save();
      ctx.translate(-progress * 1920, 0);
    },
    (ctx) => {
      // Incoming scene: slide in from right
      ctx.save();
      ctx.translate((1 - progress) * 1920, 0);
    },
  );

  yield* tween(duration, (t) => {
    progress = easeOutQuart(t);
  });

  endTransition();
}

/**
 * Slide-out — horizontal hard slide for section changes.
 * Less violent than whipPan but still athletic.
 */
export function* slideTransition(duration = 0.4): ThreadGenerator {
  let progress = 0;

  const endTransition = useTransition(
    (ctx) => {
      ctx.save();
      ctx.translate(-progress * 1920 * 0.8, 0);
      ctx.globalAlpha = 1 - progress * 0.4;
    },
    (ctx) => {
      ctx.save();
      ctx.translate((1 - progress) * 1920 * 0.6, 0);
    },
  );

  yield* tween(duration, (t) => {
    progress = easeOutQuart(t);
  });

  endTransition();
}

// Re-export the bold easings so scenes can import alongside transitions.
export {easeOutExpo, easeOutQuart};
