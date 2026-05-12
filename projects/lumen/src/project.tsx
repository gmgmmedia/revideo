/**
 * Lumen — "Quietly Intelligent Health" launch teaser.
 *
 * Duration: ~12 seconds
 * Scenes: 3
 *
 * SOURCE SCRIPT (timestamp + VO):
 * ────────────────────────────────────────────────────────────────────
 * SCENE 1 (00:00 - 04:50)
 *   VO: "What if your data wasn't a competition?"
 *   VISUALS:
 *     - Soft cream background, single glow orb breathing at center (00:00-00:80)
 *     - Lumen wordmark mask-wipes in from left (00:80-01:80)
 *     - Pull-out reveals soft sage curve behind wordmark (01:80-03:00)
 *     - Hold, breath (03:00-04:50)
 *   TRANSITION: fade → scene 2 with matched-cut handoff of wordmark
 *
 * SCENE 2 (04:50 - 08:80)
 *   VO: "Pattern recognition without panic."
 *   VISUALS:
 *     - Wordmark enters at scene1 ending transform (matched cut)
 *     - Wordmark settles up; below it three insight cards cascade in (wave stagger)
 *     - Wrapper-camera push-in lands on the middle card during "panic"
 *     - Wrapper-camera pulls out to reveal all three (06:80-08:80)
 *   TRANSITION: fade → scene 3
 *
 * SCENE 3 (08:80 - 12:00)
 *   VO: "Quietly intelligent health. Lumen, 2026."
 *   VISUALS:
 *     - Tagline mask-wipes in over warm gradient
 *     - Lumen wordmark below + small dot signature
 *     - Slow fade-out
 * ────────────────────────────────────────────────────────────────────
 *
 * Motion design (from brand-identity.json → motion_design):
 *   philosophy: "Quietly intelligent — soft mask reveals, generous holds, no overshoot."
 *   energy_curve: calm
 *   pace.beat: 0.45s
 *   easing.primary: easeInOutCubic
 *   spring_config: OrganicSpring (used sparingly)
 *   transitions: fade primary, wipe for section changes
 *   camera: subtle pushIn / pullOut with parallax
 */

import { makeProject } from '@revideo/core';

import scene1 from './scenes/scene1?scene';
import scene2 from './scenes/scene2?scene';
import scene3 from './scenes/scene3?scene';

export default makeProject({
  scenes: [
    scene1,
    scene2,
    scene3,
  ],
});
