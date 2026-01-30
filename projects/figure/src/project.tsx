/**
 * Figure FGRD Announcement Video
 * "Public equity, reimagined."
 *
 * Duration: ~22 seconds
 * Scenes: 6
 *
 * Storyboard:
 * 1. "Public equity, reimagined." - The Shift (~3s)
 * 2a. "Introducing FGRD" - Logo Reveal (~2s)
 * 2b. "Figure Shares On-chain" - Blockchain Illustrations (~2s)
 * 3. Core Value Props on rotating 3D cube (~6s)
 * 4. "One Wallet. All your assets." - Reframing (~4s)
 * 5. "Now available on Figure Markets." - CTA (~3s)
 */

import { makeProject } from '@revideo/core';

import scene1 from './scenes/scene1?scene';
import scene2a from './scenes/scene2a?scene';
import scene2b from './scenes/scene2b?scene';
import scene3 from './scenes/scene3?scene';
import scene4 from './scenes/scene4?scene';
import scene5 from './scenes/scene5?scene';

export default makeProject({
  scenes: [
    scene1,  // 00:00 - 03:00 | The Shift
    scene2a, // 03:00 - 05:00 | Logo Reveal
    scene2b, // 05:00 - 07:00 | Blockchain Illustrations
    scene3,  // 07:00 - 13:00 | Core Value Prop (3D Cube)
    scene4,  // 13:00 - 17:00 | Reframing
    scene5,  // 17:00 - 20:00 | CTA
  ],
});
