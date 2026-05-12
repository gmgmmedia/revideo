/**
 * Vellum — "Issue No. 27" launch intro.
 *
 * Duration: ~14 seconds
 * Scenes: 3
 *
 * SOURCE SCRIPT (timestamp + VO):
 * ────────────────────────────────────────────────────────────────────
 * SCENE 1 (00:00 - 05:00)
 *   VO: "Issue No. 27."
 *   VISUALS:
 *     - Cream paper background with subtle warm gradient mesh
 *     - Camera SLOW pull-out from extreme zoom on a single serif character
 *     - Character-stagger reveal of "Issue No. 27" with 0.10s spacing
 *     - Letter-spacing animates from 16px → 4px (tightens as the word lands)
 *     - Subline "BI-MONTHLY · FASHION · LITERATURE" with huge tracking
 *     - Hairline dividers above and below the title (draw from center)
 *     - Single terracotta accent dot at right edge as punctuation
 *     - Long hold (1.2s breath) before transition
 *   TRANSITION: paperWash → scene 2
 *
 * SCENE 2 (05:00 - 10:00)
 *   VO: "Three writers, three cities."
 *   VISUALS:
 *     - Three asymmetric portrait cards (NOT a centered row):
 *         Card 1: LARGE, top-left (rule-of-thirds TL)
 *         Card 2: MEDIUM, center-right
 *         Card 3: SMALL, bottom-left
 *     - Cream-filled Rect with 1px taupe stroke
 *     - Tiny serif city labels below each card
 *     - Mask-wipe reveals one card at a time (0.4s stagger)
 *     - Multi-layer glow on the hero card during focusPull
 *     - Color shift on "writers" word — primary → terracotta for 0.2s
 *   TRANSITION: fade → scene 3
 *
 * SCENE 3 (10:00 - 14:00)
 *   VO: "Read on Vellum."
 *   VISUALS:
 *     - Hero text "Vellum" — char-stagger with opacity-y rise then tracking tighten
 *     - Tagline "On stillness, attention, and writing for the long hours."
 *       word-by-word wave reveal
 *     - Year "MMXXVI" in tiny tracking-spaced accent text
 *     - Single hairline divider grows from center
 *     - Camera pulls out to final wide shot
 *     - Generous 1.0s hold before fade
 * ────────────────────────────────────────────────────────────────────
 *
 * Motion design (from brand-identity.json → motion_design):
 *   philosophy: "Editorial restraint — character-by-character reveals."
 *   energy_curve: moderate
 *   pace.beat: 0.55s
 *   easing.primary: easeOutQuint
 *   spring_config: NONE — no spring imports
 *   transitions: wipe primary, fade for section changes
 *   camera: subtle pan / focusPull / pullOut with parallax
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
