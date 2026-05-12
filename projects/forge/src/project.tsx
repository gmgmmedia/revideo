/**
 * Forge — "FORGE: Echoes" Steam launch trailer.
 *
 * Duration: ~12 seconds across 3 scenes.
 *
 * SOURCE SCRIPT (timestamp + visual directions):
 * ────────────────────────────────────────────────────────────────────
 * SCENE 1 (00:00 - 04:00) — Logo reveal
 *   VO/title: "FORGE: Echoes — A pixel puzzle adventure"
 *   VISUALS:
 *     - Iris-in transition (Circle mask growing from center) at scene start
 *     - Subtitle "A PIXEL PUZZLE ADVENTURE" enters via character-stagger
 *       BEFORE the logo (anticipation)
 *     - "FORGE" hero text — each letter springs in via LogoLandSpring with
 *       strong overshoot (anticipation pre-scale to 0.95 then spring to 1.0+)
 *     - ":Echoes" appears below via character-stagger
 *     - PARTICLE BURST at logo-land moment (20+ particles, hot magenta + gold,
 *       scattered radially via useRandom seeded)
 *     - Screen-shake on world().position (5 oscillations over 0.2s)
 *     - Multi-layer glow (magenta) on logo
 *     - Background: deep cosmic blue with bright accent stars/dots
 *   TRANSITION: glitch → scene 2
 *
 * SCENE 2 (04:00 - 08:00) — "Three realms, one key"
 *   VISUALS:
 *     - Glitch-in entry (RGB-split chromatic aberration)
 *     - Three card portals representing realms (icons inside)
 *     - Each portal entrance: anticipation pre-scale + spring overshoot +
 *       per-portal particle burst
 *     - Cards positioned ASYMMETRICALLY (NOT centered row)
 *     - Color cycling: portal 1 magenta, 2 gold, 3 electric blue
 *     - Center "key" element appears between them with iris-mask reveal
 *     - emphasisPulse on hero key element ('scale' technique with overshoot)
 *     - Camera pushes in + slight shake during emphasis
 *   TRANSITION: iris → scene 3
 *
 * SCENE 3 (08:00 - 12:00) — "Wishlist now"
 *   VISUALS:
 *     - Hero text "WISHLIST" — character-stagger overshoot+settle
 *       (each letter overshoots to 1.15 then settles to 1.0)
 *     - "ON STEAM" below with character-stagger
 *     - Particle burst at moment of land
 *     - Steam logo silhouette (simple shape) appears with iris reveal
 *     - Final screen-flash (full-screen bright accent ~0.08s, then return)
 *     - Quick fade to black
 * ────────────────────────────────────────────────────────────────────
 *
 * Motion design (from brand-identity.json → motion_design):
 *   philosophy: "Indie game energy — overshoot everywhere, particle bursts
 *               on every hero, glitch transitions, screen-shake on impacts,
 *               vibrant accents"
 *   energy_curve: high
 *   pace.beat: 0.22s
 *   easing.primary: easeOutBack
 *   easing.secondary: easeOutExpo
 *   spring_config: LogoLandSpring (high overshoot)
 *   transitions: iris primary, glitch for section change
 *   camera: zoom + shake + pushIn, dramatic intensity
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
