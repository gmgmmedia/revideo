/**
 * Atlas — "Run with intent." launch teaser.
 *
 * Duration: ~13 seconds
 * Scenes: 3
 *
 * SOURCE SCRIPT (timestamp + VO):
 * ────────────────────────────────────────────────────────────────────
 * SCENE 1 (00:00 - 04:50)
 *   VO: "5K PR. Yesterday."
 *   VISUALS:
 *     - Dark track-black field, grid hairlines, orange rim light TR off-frame
 *     - Hero metric "21:47" count-ups from "00:00" via countUpMetric (00:60-02:00)
 *     - Screen-shake at the moment metric lands (02:00 PR impact)
 *     - "5K — PERSONAL BEST" eyebrow label character-staggers in (02:40)
 *     - Rich particle drift (ambient orange embers)
 *     - Whip-pan out (04:30)
 *   TRANSITION: whipPan / matched-cut metric anchor handoff to scene 2
 *
 * SCENE 2 (04:50 - 09:00)
 *   VO: "Pace consistency improved."
 *   VISUALS:
 *     - Three data cards asymmetric (NOT centered): left, hero-center, right
 *     - Card 1: "4:21/km avg" with ascending sparkline (centerLeft)
 *     - Card 2: "92% pace consistency" — HERO, slightly larger (topMiddle-ish)
 *     - Card 3: "+18% vs last month" green data color (centerRight)
 *     - Each card: multiLayerGlow (3 layers); orange rim light TR
 *     - Wave-stagger cascade (middle first)
 *     - Camera push-in on hero during "improved" emphasis
 *     - emphasisPulse on hero (scale + color shift)
 *   TRANSITION: slide → scene 3
 *
 * SCENE 3 (09:00 - 13:00)
 *   VO: "Atlas knows your form. Run with intent."
 *   VISUALS:
 *     - "ATLAS" hero text — character-stagger reveal in display weight
 *     - Tagline "Run with intent." word-reveal with tracking-tighten on
 *     - Small signal-orange dot signature springs in after tagline
 *     - Subline: "FOR THE LONG GAME" in wide eyebrow tracking
 *     - Camera pulls back to wide shot at end
 *     - Brief hold (~0.3s); high energy brand — no long breath
 * ────────────────────────────────────────────────────────────────────
 *
 * Motion design (from brand-identity.json → motion_design):
 *   philosophy: "Athletic snap — impact easing, count-up metrics, camera shake on PRs"
 *   energy_curve: high
 *   pace.beat: 0.22s (dense)
 *   easing.primary: easeOutExpo
 *   easing.secondary: easeOutQuart
 *   spring_config: UISpring (used on hero entrances)
 *   transitions: wipe primary, slide section change, whipPan scene change
 *   camera: dramatic pushIn / pullOut / whipPan with parallax
 *   secondary_motion: rich trails, follow-through, rich particle density
 *   lighting: rim-light (TR orange)
 */

import {makeProject} from '@revideo/core';

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
