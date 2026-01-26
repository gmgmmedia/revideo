/**
 * Real Motion Video Project
 * "Community Building Story - Andy Gole's Journey"
 *
 * Duration: ~30-60 seconds (6 scenes)
 * Brand: Real Motion (vaporwave/retro-futuristic aesthetic)
 *
 * Scene Breakdown:
 * - Scene 1: Community Love (hearts + figures) ~5s
 * - Scene 2: Movement Labs (logo + community interest) ~5s
 * - Scene 3: Time Theme (clock + transformation) ~5s
 * - Scene 4: Network Building (connections growing) ~5s
 * - Scene 5: Tutorials (documents + code) ~5s
 * - Scene 6: Core Engineer (level up + crown) ~5-6s
 *
 * VO Script:
 * "but you wanna have those early community members get shown a lot of love
 * when we had the movement curious vote coming in I realized okay
 * what's the best thing I can do cause I had no money I had time so I was like okay
 * I'm gonna do a community building campaign which is
 * whoever participates in helping spread awareness about movement
 * in the move programming language I'll get a one on one on with them
 * and so I had a guy named Andy Gole who was writing a ton of like how to program and move
 * how to program in move this guy was just a monster and I called him
 * and he became one of our core engineers"
 */

import { makeProject } from '@revideo/core';

import scene1 from './scenes/realmotion/scene1?scene';
import scene2 from './scenes/realmotion/scene2?scene';
import scene3 from './scenes/realmotion/scene3?scene';
import scene4 from './scenes/realmotion/scene4?scene';
import scene5 from './scenes/realmotion/scene5?scene';
import scene6 from './scenes/realmotion/scene6?scene';

export default makeProject({
  scenes: [
    scene1,  // Community Love - hearts + figures appearing
    scene2,  // Movement Labs - logo with community interest
    scene3,  // Time Theme - clock + transformation ("no money, had time")
    scene4,  // Network Building - connections growing (campaign spreading)
    scene5,  // Tutorials - documents + code (Andy writing tutorials)
    scene6,  // Core Engineer - level up + crown (Andy becomes engineer)
  ],
});
