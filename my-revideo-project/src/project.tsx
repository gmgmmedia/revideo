/**
 * Raiku Video Project
 * "Solana's Warehouse Model"
 * 
 * Duration: ~32 seconds
 * Scenes: 6
 * 
 * VO Script:
 * 1. "Solana is basically a giant warehouse full of boxes."
 * 2. "Your wallet? A box. Token balance? Box. Programs? Also boxes. 
 *     Everything on Solana lives in a box."
 * 3. "Each box has an address and holds data. A few special boxes hold code — 
 *     these are programs. But most boxes just store information."
 * 4. "Programs have no memory. They just follow instructions. 
 *     All the actual data lives in other boxes."
 * 5. "When you make a transaction, you tell Solana which boxes you need. 
 *     If you're not fighting over the same boxes, everyone runs at the same time."
 * 6. "Same program, different boxes, no waiting. That's how Solana stays fast."
 */

import { makeProject } from '@revideo/core';

import scene1 from './scenes/scene1?scene';
import scene2 from './scenes/scene2?scene';
import scene3 from './scenes/scene3?scene';
import scene4 from './scenes/scene4?scene';
import scene5 from './scenes/scene5?scene';
import scene6 from './scenes/scene6?scene';

export default makeProject({
  scenes: [
    scene1,  // 00:00 - 03:00 | Warehouse emerges
    scene2,  // 03:00 - 08:00 | Three box types
    scene3,  // 08:00 - 15:00 | Account anatomy
    scene4,  // 15:00 - 20:00 | Stateless programs
    scene5,  // 20:00 - 28:00 | Parallel execution
    scene6,  // 28:00 - 32:00 | Logo outro
  ],
});