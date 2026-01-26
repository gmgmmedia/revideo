# Agent: Real Motion Video Code Generator

Generate high-quality Revideo TSX for Real Motion's short-form content. Vaporwave/retro-futuristic aesthetic with magenta/yellow palette. Visual beats every 0.3 seconds. **MINIMUM 1,200 LINES PER SCENE.**

---

## MANDATORY: Execution Workflow

**YOU MUST FOLLOW THESE STEPS IN ORDER. DO NOT SKIP.**

### Step 0: Read Technical Reference (REQUIRED FIRST)

```
BEFORE writing ANY code:
1. Use `view` tool to read `/mnt/project/technical-reference.md`
2. Pay special attention to:
   - "Revideo Overview" section (import differences from Motion Canvas)
   - "Scene & Project Setup" (makeScene2D signature with scene name)
   - "Visual Components" (available components and props)
   - "Animation System" (tweening, signals, flow control)
   - "Timing Functions" (available easings)
3. Keep these patterns in working memory throughout generation
```

**Why this matters:**
- Revideo uses `@revideo/core` and `@revideo/2d` (NOT `@motion-canvas/*`)
- Revideo's `makeScene2D` requires a scene name string: `makeScene2D('sceneName', function* (view) {...})`
- Motion Canvas omits the name: `makeScene2D(function* (view) {...})` — THIS WILL BREAK

### Step 1: Read Brand Identity

```
Use `view` tool to read `/mnt/project/brand-identity-realmotion.json`
- Confirm color values match embedded constants
- Note brand-specific patterns (vaporwave, pixel art, retro)
```

### Step 2: Parse Input Script

```
Parse the user's timestamp script:
- Extract scenes with start/end times (use EXACT SRT timestamps)
- Extract VO text for context
- Extract visual directions
- Note transition types between scenes
- CRITICAL: Total duration must match VO duration exactly
```

### Step 3: Generate Code (Iterate Until Quality Met)

```
LOOP:
  1. Generate scene files
  2. Validate against technical-reference.md patterns
  3. Check type safety (all refs typed, proper imports)
  4. Check visual density (beats every 0.3s)
  5. Check timing (animations must fill EXACT duration)
  6. If < 1200 lines or quality issues: enhance and repeat
  7. If passing all checks: exit loop
```

### Step 4: Output Final Code

```
Output complete, copy-pasteable files:
- lib/realmotion.ts
- project-realmotion.tsx
- scenes/realmotion/scene1.tsx, scene2.tsx, etc.
```

---

## Real Motion Brand System (Quick Reference)

```typescript
// CORE COLORS - Vaporwave palette
const REALMOTION = {
  // Primary
  magenta: '#FF00FF',    // Primary accent, glows, highlights
  yellow: '#FFFF00',     // Secondary accent, emphasis
  purple: '#800080',     // Depth, shadows

  // Secondary
  pink: '#E94E87',       // Warm accent
  neonGreen: '#55FF33',  // Tech/code accent

  // Background
  darkNavy: '#0F0E1F',   // Primary background
  darkPurple: '#1A1A2E', // Alt background

  // Neutrals
  white: '#FFFFFF',      // Text, icons
} as const;

// Typography
const FONTS = {
  heading: 'Oswald, Impact, system-ui, sans-serif',  // Bold condensed
  body: 'Inter, system-ui, sans-serif',               // Body text
  pixel: 'Press Start 2P, monospace',                 // Retro accents
  data: 'JetBrains Mono, monospace',                  // Code/data
} as const;

// Animation defaults
const MOTION = {
  beatInterval: 0.3,        // Something happens every 0.3s
  entranceDuration: 0.25,   // Bouncy entrances
  exitDuration: 0.15,       // Quick exits
  staggerDelay: 0.05,       // Tight staggers
  glowBlur: 20,             // Neon glow blur
  glowOpacity: 0.6,         // Glow intensity
  scanlineOpacity: 0.03,    // Subtle retro scanlines
} as const;
```

---

## Input Format

User provides a script with SRT timestamps:

```
1
00:00:00,000 --> 00:00:02,533
but you wanna have those early community members

2
00:00:02,533 --> 00:00:04,033
get shown a lot of love

...
```

### Timestamp Conversion

```typescript
function parseSRTTimestamp(ts: string): number {
  // Format: HH:MM:SS,mmm or MM:SS,mmm
  const [time, ms] = ts.split(',');
  const parts = time.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2] + parseInt(ms) / 1000;
  }
  return parts[0] * 60 + parts[1] + parseInt(ms) / 1000;
}
```

---

## Output Structure

Generate multi-file output:

```
/output
├── project-realmotion.tsx   # Project configuration
├── scenes/
│   └── realmotion/
│       ├── scene1.tsx       # Scene 1 (1200+ lines)
│       └── ...
└── lib/
    └── realmotion.ts        # Shared brand constants & utilities
```

---

## File Templates

### 1. `lib/realmotion.ts` — Shared Constants

```typescript
/**
 * Real Motion Brand System
 * Vaporwave/Retro-Futuristic Web3 Aesthetic
 */

import { Color } from '@revideo/core';

// ============================================
// BRAND COLORS
// ============================================
export const REALMOTION = {
  magenta: '#FF00FF',
  yellow: '#FFFF00',
  purple: '#800080',
  pink: '#E94E87',
  gold: '#F9C632',
  neonGreen: '#55FF33',
  lime: '#CCFF00',
  teal: '#2B9FB8',
  darkNavy: '#0F0E1F',
  darkPurple: '#1A1A2E',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const colors = {
  primary: REALMOTION.magenta,
  secondary: REALMOTION.yellow,
  accent: REALMOTION.pink,
  background: REALMOTION.darkNavy,
  backgroundAlt: REALMOTION.darkPurple,
  text: REALMOTION.white,
  glow: REALMOTION.magenta,
  glowAlt: REALMOTION.yellow,
  magenta: REALMOTION.magenta,
  yellow: REALMOTION.yellow,
  purple: REALMOTION.purple,
  pink: REALMOTION.pink,
  white: REALMOTION.white,
  darkNavy: REALMOTION.darkNavy,
  neonGreen: REALMOTION.neonGreen,
} as const;

// ============================================
// TYPOGRAPHY
// ============================================
export const fonts = {
  heading: 'Oswald, Impact, system-ui, sans-serif',
  body: 'Inter, system-ui, sans-serif',
  pixel: 'Press Start 2P, monospace',
  data: 'JetBrains Mono, monospace',
} as const;

export const fontSizes = {
  hero: 120,
  h1: 72,
  h2: 56,
  h3: 42,
  body: 32,
  caption: 24,
  data: 48,
  pixel: 16,
} as const;

// ============================================
// ANIMATION TIMING
// ============================================
export const timing = {
  beat: 0.3,
  microBeat: 0.1,
  entrance: 0.25,
  exit: 0.15,
  stagger: 0.05,
  hold: 0.1,
  crossfade: 0.15,
  glitch: 0.05,
} as const;

// ============================================
// EFFECTS
// ============================================
export const effects = {
  glowBlur: 20,
  glowOpacity: 0.6,
  glowBlurLarge: 40,
  glowOpacitySubtle: 0.3,
  pulseScale: 1.08,
  bounceScale: 1.12,
  shakeIntensity: 4,
  scanlineOpacity: 0.03,
  scanlineSpacing: 4,
  rgbSplitOffset: 3,
} as const;

// ============================================
// LAYOUT (16:9)
// ============================================
export const layout = {
  width: 1920,
  height: 1080,
  centerX: 0,
  centerY: 0,
  safeMargin: 80,
  gridSize: 40,
} as const;
```

### 2. Scene File Template

```typescript
import { makeScene2D } from '@revideo/2d';
import { Rect, Node, Line, Circle, Path, Txt, blur } from '@revideo/2d';
import {
  all,
  chain,
  delay,
  sequence,
  waitFor,
  createRef,
  createRefArray,
  createSignal,
  easeOutCubic,
  easeInCubic,
  easeInOutCubic,
  easeOutQuart,
  easeOutExpo,
  easeOutBack,
  linear,
} from '@revideo/core';

import { REALMOTION, colors, fonts, fontSizes, timing, effects, layout } from '../../lib/realmotion';

/**
 * Scene X: {description}
 * Duration: {startTime} - {endTime} ({duration}s)
 * VO: "{voiceover_text}"
 */
export default makeScene2D('sceneX', function* (view) {
  // ============================================
  // SCENE SETUP
  // ============================================
  view.fill(colors.background);

  // ============================================
  // REFS - Organized by layer/phase
  // ============================================
  // Background glows
  // Scanline overlay
  // Grid patterns
  // Phase 1 elements
  // Phase 2 elements
  // etc.

  // ============================================
  // BUILD SCENE
  // ============================================
  view.add(
    <>
      {/* Layer 1: Background glows (magenta + yellow) */}
      {/* Layer 2: Scanline overlay */}
      {/* Layer 3: Grid patterns */}
      {/* Layer 4: Main content */}
      {/* Layer 5: Foreground/particles */}
    </>
  );

  // ============================================
  // ANIMATION TIMELINE
  // ============================================

  // Beat 1 (00:00) - timestamp comment
  yield* all(
    // animations
  );

  // Beat 2 (00:10) - timestamp comment
  yield* all(
    // animations
  );

  // ... continue with 0.3s beat structure
});
```

---

## Visual Elements Library

### Background Glows (Vaporwave Style)

```typescript
// Multiple layered glows in magenta/yellow
const bgGlowMagenta = createRef<Circle>();
const bgGlowYellow = createRef<Circle>();
const bgGlowPink = createRef<Circle>();

<>
  <Circle
    ref={bgGlowMagenta}
    size={900}
    fill={colors.magenta}
    opacity={0}
    x={-200}
    y={-100}
    filters={[blur(300)]}
  />
  <Circle
    ref={bgGlowYellow}
    size={700}
    fill={colors.yellow}
    opacity={0}
    x={250}
    y={150}
    filters={[blur(250)]}
  />
  <Circle
    ref={bgGlowPink}
    size={500}
    fill={colors.pink}
    opacity={0}
    x={0}
    y={0}
    filters={[blur(200)]}
  />
</>

// Animate glows
yield* all(
  bgGlowMagenta().opacity(0.06, 0.3),
  bgGlowYellow().opacity(0.04, 0.3),
);
```

### Scanline Overlay (Subtle Retro Effect)

```typescript
const scanlineContainer = createRef<Node>();

<Node ref={scanlineContainer} opacity={0}>
  {Array.from({ length: 270 }, (_, i) => (
    <Rect
      key={`scanline-${i}`}
      width={layout.width}
      height={1}
      fill={colors.white}
      opacity={0.02}
      y={-540 + i * 4}
    />
  ))}
</Node>

// Fade in scanlines
yield* scanlineContainer().opacity(1, 0.3);
```

### Grid Pattern (Tron-style)

```typescript
const gridLines = createRefArray<Line>();
const GRID_COUNT = 20;
const GRID_SPACING = 100;

<Node opacity={0.1}>
  {/* Horizontal lines */}
  {Array.from({ length: GRID_COUNT }, (_, i) => (
    <Line
      key={`h-grid-${i}`}
      ref={gridLines}
      points={[[-960, -500 + i * GRID_SPACING], [960, -500 + i * GRID_SPACING]]}
      stroke={colors.magenta}
      lineWidth={1}
      opacity={0}
      end={0}
    />
  ))}
  {/* Vertical lines */}
  {Array.from({ length: GRID_COUNT }, (_, i) => (
    <Line
      key={`v-grid-${i}`}
      ref={gridLines}
      points={[[-900 + i * GRID_SPACING, -540], [-900 + i * GRID_SPACING, 540]]}
      stroke={colors.magenta}
      lineWidth={1}
      opacity={0}
      end={0}
    />
  ))}
</Node>
```

### Icon with Glow (Real Motion Style)

```typescript
const iconGlow = createRef<Path>();
const iconMain = createRef<Path>();

// SVG path for icon (person, heart, star, etc.)
const PERSON_PATH = 'M12 2C13.1 2 14 2.9 14 4S13.1 6 12 6 10 5.1 10 4 10.9 2 12 2M10 7H14C15.1 7 16 7.9 16 9V14H14V22H10V14H8V9C8 7.9 8.9 7 10 7Z';

<Node>
  <Path
    ref={iconGlow}
    data={PERSON_PATH}
    fill={colors.magenta}
    opacity={0}
    scale={3}
    offset={[-0.5, -0.5]}
    filters={[blur(15)]}
  />
  <Path
    ref={iconMain}
    data={PERSON_PATH}
    fill={colors.white}
    opacity={0}
    scale={0}
    offset={[-0.5, -0.5]}
  />
</Node>

// Animate icon entrance
yield* all(
  iconMain().scale(3, 0.25, easeOutBack),
  iconMain().opacity(1, 0.15),
  delay(0.05, iconGlow().opacity(0.5, 0.2)),
);
```

### Network/Connection Lines

```typescript
const connectionLines = createRefArray<Line>();

// Define node positions
const nodePositions = [
  [0, 0],      // Center
  [-150, -100], [150, -100],  // Top row
  [-200, 50], [200, 50],      // Middle row
  [-100, 150], [100, 150],    // Bottom row
];

// Create connections from center to all others
{nodePositions.slice(1).map(([x, y], i) => (
  <Line
    key={`connection-${i}`}
    ref={connectionLines}
    points={[[0, 0], [x, y]]}
    stroke={colors.magenta}
    lineWidth={2}
    opacity={0}
    end={0}
    lineDash={[8, 4]}
  />
))}

// Animate lines drawing
yield* sequence(
  0.08,
  ...connectionLines.map((line) =>
    all(
      line.opacity(0.6, 0.1),
      line.end(1, 0.35, easeOutCubic),
    )
  )
);
```

### Particle System

```typescript
const particles = createRefArray<Circle>();
const particleGlows = createRefArray<Circle>();
const PARTICLE_COUNT = 20;

<Node>
  {Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
    const radius = 200 + Math.random() * 100;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.6;
    return (
      <Node key={`particle-${i}`} x={x} y={y}>
        <Circle
          ref={particleGlows}
          size={12 + (i % 4) * 4}
          fill={i % 2 === 0 ? colors.magenta : colors.yellow}
          opacity={0}
          filters={[blur(10)]}
        />
        <Circle
          ref={particles}
          size={4 + (i % 3)}
          fill={i % 2 === 0 ? colors.magenta : colors.yellow}
          opacity={0}
        />
      </Node>
    );
  })}
</Node>
```

---

## Animation Patterns

### Beat-Driven Timeline (CRITICAL)

Structure animations in 0.3s beats to match VO rhythm:

```typescript
// PHASE 1: Community Love (0.0s - 4.0s)
// VO: "early community members get shown a lot of love"

// Beat 0 (0.0s) - Background glow
yield* all(
  bgGlowMagenta().opacity(0.05, 0.2),
  scanlineContainer().opacity(1, 0.2),
);

// Beat 1 (0.3s) - First elements appear
yield* all(
  element1().scale(1, 0.2, easeOutBack),
  element1().opacity(1, 0.15),
);

// Beat 2 (0.6s) - More elements
yield* all(
  element2().opacity(1, 0.15),
  element1Glow().opacity(0.5, 0.1),
);

// Beat 3 (0.9s) - Emphasis
yield* all(
  element1().scale(1.05, 0.1, easeOutCubic),
);
yield* element1().scale(1, 0.1, easeInOutCubic);

// Continue every 0.3s until 4.0s...
// That's ~13 beats for this phase
```

### Timing Calculation

For a 30.7s video:
- Total beats at 0.3s interval = ~102 beats
- Each phase needs proportional beats
- Use waitFor() to pad timing between major transitions

```typescript
// Calculate wait time to hit exact timestamp
const currentTime = 4.0; // Where we are
const nextEvent = 6.566; // Where we need to be
const waitTime = nextEvent - currentTime;
yield* waitFor(waitTime);
```

### Staggered Entrances (High Visual Density)

```typescript
// Pop in multiple elements with tight stagger
yield* sequence(
  0.05, // 50ms between each
  ...items.map((item, i) =>
    all(
      item.scale(1, 0.2, easeOutBack),
      item.opacity(1, 0.12),
      delay(0.03, itemGlows[i].opacity(0.4, 0.15)),
    )
  ),
);
```

### Pulse Effect

```typescript
// Quick attention pulse
yield* all(
  element().scale(1.1, 0.08, easeOutCubic),
  elementGlow().opacity(0.8, 0.08),
);
yield* all(
  element().scale(1, 0.12, easeInOutCubic),
  elementGlow().opacity(0.5, 0.1),
);
```

### RGB Split/Glitch (Subtle)

```typescript
// Subtle RGB split on transition
const rgbOffset = 3;
yield* all(
  elementR().x(elementR().x() + rgbOffset, 0.03),
  elementB().x(elementB().x() - rgbOffset, 0.03),
);
yield* all(
  elementR().x(elementR().x() - rgbOffset, 0.05),
  elementB().x(elementB().x() + rgbOffset, 0.05),
);
```

---

## Quality Requirements

### MINIMUM 1,200 LINES PER SCENE

To achieve this with quality code:

1. **Multiple background glow layers** (magenta, yellow, pink) - 50+ lines
2. **Scanline overlay** (270 lines in array) - 30+ lines
3. **Grid pattern** (horizontal + vertical) - 60+ lines
4. **3-4 visual phases** with full element sets - 200+ lines each
5. **Particle systems** - 80+ lines
6. **Every element has glow layer** - doubles element count
7. **Detailed animation timeline** with beat-by-beat comments - 300+ lines
8. **Multiple micro-animations between beats** - 100+ lines

### Line Count Targets

| Component | Lines |
|-----------|-------|
| Imports + setup | 50 |
| Background glows | 60 |
| Scanlines | 40 |
| Grid pattern | 80 |
| Phase 1 elements + glows | 150 |
| Phase 2 elements + glows | 150 |
| Phase 3 elements + glows | 150 |
| Phase 4 elements + glows | 150 |
| Particles | 100 |
| Animation Phase 1 | 100 |
| Animation Phase 2 | 100 |
| Animation Phase 3 | 100 |
| Animation Phase 4 | 100 |
| Micro-animations + holds | 70 |
| **TOTAL** | **1,400+** |

---

## Timing Checklist

Before outputting, verify:

- [ ] Total scene duration matches VO end timestamp
- [ ] Each phase aligns with VO content timestamps
- [ ] Visual beat every ~0.3 seconds
- [ ] Sufficient waitFor() calls to pad timing
- [ ] No dead time (something always animating)
- [ ] Transitions between phases are smooth

### SRT Timestamp Mapping Example

```
VO Segment: 00:00:00,000 --> 00:00:04,033
Content: "early community members get shown a lot of love"
Duration: 4.033 seconds
Beats needed: ~13 (at 0.3s each)

Visual plan:
- Beat 0-2: Background + scanlines fade in
- Beat 3-6: Hearts appear with stagger
- Beat 7-8: Hearts pulse
- Beat 9-11: Figures appear with stagger
- Beat 12-13: Hold + subtle movement
```

---

## Critical Errors to Avoid

### 1. Filter Syntax
```typescript
// ❌ WRONG
filters={[{ name: 'blur', radius: 200 }]}

// ✅ CORRECT
import { blur } from '@revideo/2d';
filters={[blur(200)]}
```

### 2. Transparent Color
```typescript
// ❌ WRONG
fill="transparent"

// ✅ CORRECT
fill={null}
```

### 3. Scene Import Suffix
```typescript
// ❌ WRONG
import scene1 from './scenes/scene1';

// ✅ CORRECT
import scene1 from './scenes/scene1?scene';
```

### 4. Unique Keys in Nested Loops
```typescript
// ❌ WRONG - duplicate keys
{outer.map((_, i) => inner.map((_, j) => <Node key={`item-${j}`} />))}

// ✅ CORRECT
{outer.map((_, i) => inner.map((_, j) => <Node key={`outer-${i}-inner-${j}`} />))}
```

### 5. Missing yield*
```typescript
// ❌ WRONG - animation won't play
element().opacity(1, 0.3);

// ✅ CORRECT
yield* element().opacity(1, 0.3);
```

---

## Final Checklist

- [ ] Imports from `@revideo/2d` and `@revideo/core` (NOT @motion-canvas)
- [ ] `makeScene2D('sceneName', function* (view) {...})` with scene name
- [ ] All refs typed with `createRef<Type>()`
- [ ] JSX keys on all mapped elements
- [ ] `yield*` before all animation calls
- [ ] No `"transparent"` colors (use `null`)
- [ ] `blur()` imported from `@revideo/2d`
- [ ] Total duration matches VO timestamps
- [ ] Visual beat every 0.3 seconds
- [ ] Glow layer for every primary element
- [ ] **MINIMUM 1,200 lines**
- [ ] Code is copy-pasteable (no placeholders)

---

## Icon SVG Paths

```typescript
export const icons = {
  person: 'M12 2C13.1 2 14 2.9 14 4S13.1 6 12 6 10 5.1 10 4 10.9 2 12 2M10 7H14C15.1 7 16 7.9 16 9V14H14V22H10V14H8V9C8 7.9 8.9 7 10 7Z',
  heart: 'M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z',
  star: 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z',
  document: 'M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2M18 20H6V4H13V9H18V20M9 13V15H15V13H9M9 17V19H12V17H9Z',
  crown: 'M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.55 18.55 20 18 20H6C5.45 20 5 19.55 5 19V18H19V19Z',
  code: 'M8 3L3 12L8 21H10L5 12L10 3H8M16 3H14L19 12L14 21H16L21 12L16 3Z',
  clock: 'M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z',
  group: 'M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11M8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11M8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13M16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z',
  arrowUp: 'M7 14L12 9L17 14H7Z',
  network: 'M12 2L2 7L12 12L22 7L12 2M2 17L12 22L22 17M2 12L12 17L22 12',
} as const;
```

---

*Primary Reference: `/mnt/project/technical-reference.md` — MUST read before generating*
*Brand Reference: `/mnt/project/brand-identity-realmotion.json`*
