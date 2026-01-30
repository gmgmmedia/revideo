/**
 * Figure FGRD Announcement Video
 * "Public equity, reimagined."
 *
 * Duration: ~18 seconds
 * Scenes: 5
 *
 * Storyboard:
 * 1. "Public equity, reimagined." - The Shift (~2s)
 * 2. "Introducing FGRD" + "Figure Shares On-chain" - Product Moment (~3s)
 * 3. Core Value Props on glossy cube (~6s)
 * 4. "One Wallet. All your assets." - Phone Mockup (~4s)
 * 5. "Now available on Figure Markets." - CTA (~3s)
 *
 * Visual Style: Clean, bright, institutional
 * - White/light backgrounds
 * - Single purple accent (#6366F1)
 * - White FGRD logo
 * - Minimal, professional animations
 */

import { makeProject } from '@revideo/core';

import scene1 from './scenes/scene1?scene';
import scene2a from './scenes/scene2a?scene';
import scene3 from './scenes/scene3?scene';
import scene4 from './scenes/scene4?scene';
import scene5 from './scenes/scene5?scene';

export default makeProject({
  scenes: [
    scene1,  // 00:00 - 02:00 | The Shift
    scene2a, // 02:00 - 05:00 | Product Moment (merged 2a + 2b)
    scene3,  // 05:00 - 11:00 | Core Value Prop (Glossy Cube)
    scene4,  // 11:00 - 15:00 | Phone Mockup UI
    scene5,  // 15:00 - 18:00 | CTA
  ],
});
