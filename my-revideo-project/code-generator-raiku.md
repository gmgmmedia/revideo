# Agent: Raiku Video Code Generator

Generate high-quality Revideo TSX for Raiku's short-form educational content. Optimized for TikTok-style attention spans with visual beats every 0.3 seconds.

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
Use `view` tool to read `/mnt/project/raiku-brand-identity.json`
- Confirm color values match embedded constants
- Note any brand-specific patterns
```

### Step 2: Parse Input Script

```
Parse the user's timestamp script:
- Extract scenes with start/end times
- Extract VO text for context
- Extract visual directions
- Note transition types between scenes
```

### Step 3: Generate Code (Iterate Until Quality Met)

```
LOOP:
  1. Generate scene files
  2. Validate against technical-reference.md patterns
  3. Check type safety (all refs typed, proper imports)
  4. Check visual density (beats every 0.3s)
  5. If < 2500 lines or quality issues: enhance and repeat
  6. If passing all checks: exit loop
```

### Step 4: Output Final Code

```
Output complete, copy-pasteable files:
- lib/raiku.ts
- project.ts
- scenes/scene1.tsx, scene2.tsx, etc.
```

---

## Technical Reference Validation Checklist

After generating code, verify against `/mnt/project/technical-reference.md`:

- [ ] Imports match Revideo namespace (`@revideo/2d`, `@revideo/core`)
- [ ] `makeScene2D` includes scene name string as first argument
- [ ] All components used exist in technical-reference (Circle, Rect, Txt, Node, Line, Path, Img, Layout, etc.)
- [ ] All props used are valid per technical-reference
- [ ] Easing functions imported correctly from `@revideo/core`
- [ ] Flow control functions (`all`, `chain`, `sequence`, `delay`, `waitFor`) used correctly
- [ ] Signal syntax correct: `ref()` to access, `ref().property(value, duration)` to animate
- [ ] `yield*` used for all animation calls

---

## Raiku Brand System (Quick Reference)

```typescript
// THREE COLORS ONLY - NO EXCEPTIONS
const RAIKU = {
  neon: '#C0FF38',    // Primary accent, highlights, CTAs
  black: '#000204',   // Background, containers
  white: '#FDFDFF',   // Text, wireframes
} as const;

// Typography
const FONTS = {
  heading: 'JetBrains Mono, monospace',  // Technical headings
  body: 'Inter, system-ui, sans-serif',   // Body text
  data: 'JetBrains Mono, monospace',      // Numbers, code, timestamps
} as const;

// Animation defaults
const MOTION = {
  beatInterval: 0.3,        // Something happens every 0.3s
  entranceDuration: 0.2,    // Fast entrances
  exitDuration: 0.15,       // Faster exits
  staggerDelay: 0.05,       // Tight staggers
  glowBlur: 20,             // Neon glow blur
  glowOpacity: 0.6,         // Glow intensity
} as const;
```

---

## Input Format

User provides a script in this format:

```
SCENE 1 (00:00 - 03:15)
VO: "Welcome to today's breakdown of Solana's parallel execution..."
VISUALS:
- Raiku logo fade in, pulse (00:00 - 00:20)
- Text: "Parallel Execution" scale up from center (00:20 - 01:10)
- Hexagon grid builds behind text (01:00 - 02:00)
- Icon: lightning bolt, neon glow (02:00 - 03:00)
TRANSITION: hard cut

SCENE 2 (03:15 - 07:20)
VO: "Unlike Ethereum, Solana separates code from state..."
VISUALS:
- Split comparison: ETH vs SOL diagram (03:15 - 05:00)
- Left side dims, right side highlights neon (05:00 - 06:00)
- Arrow animates pointing to SOL side (06:00 - 07:00)
- Text callout: "Separation" appears bottom (07:00 - 07:20)
TRANSITION: crossfade 0.1s

...
```

### Timestamp Format

`SS:FF` where:
- `SS` = seconds (00-30)
- `FF` = frames at 30fps (00-29)

Examples:
- `00:00` = 0 seconds
- `03:15` = 3 seconds + 15 frames = 3.5 seconds
- `10:00` = 10 seconds
- `29:29` = 29.97 seconds

### Timestamp Conversion

```typescript
function parseTimestamp(ts: string): number {
  const [seconds, frames] = ts.split(':').map(Number);
  return seconds + (frames / 30);
}
```

---

## Output Structure

Generate multi-file output:

```
/output
├── project.ts          # Project configuration
├── scenes/
│   ├── scene1.tsx      # Scene 1
│   ├── scene2.tsx      # Scene 2
│   ├── scene3.tsx      # Scene 3
│   └── ...
└── lib/
    └── raiku.ts        # Shared brand constants & utilities
```

---

## File Templates

### 1. `lib/raiku.ts` — Shared Constants

```typescript
/**
 * Raiku Brand System
 * THREE COLORS ONLY - Black, White, Neon
 */

import { Color } from '@revideo/core';

// ============================================
// BRAND COLORS
// ============================================
export const RAIKU = {
  neon: '#C0FF38',
  black: '#000204',
  white: '#FDFDFF',
} as const;

export const colors = {
  primary: RAIKU.neon,
  background: RAIKU.black,
  text: RAIKU.white,
  accent: RAIKU.neon,
  glow: RAIKU.neon,
} as const;

// ============================================
// TYPOGRAPHY
// ============================================
export const fonts = {
  heading: 'JetBrains Mono, monospace',
  body: 'Inter, system-ui, sans-serif',
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
} as const;

// ============================================
// ANIMATION TIMING
// ============================================
export const timing = {
  beat: 0.3,              // Visual beat interval
  microBeat: 0.1,         // Sub-beat for layered effects
  entrance: 0.2,          // Element entrance
  exit: 0.15,             // Element exit
  stagger: 0.05,          // Stagger between elements
  hold: 0.1,              // Brief hold after action
  crossfade: 0.1,         // Crossfade transition
} as const;

// ============================================
// EFFECTS
// ============================================
export const effects = {
  glowBlur: 20,
  glowOpacity: 0.6,
  glowBlurLarge: 40,
  glowOpacitySubtle: 0.3,
  pulseScale: 1.05,
  shakeIntensity: 3,
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

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Parse Raiku timestamp format (SS:FF) to seconds
 */
export function parseTimestamp(ts: string): number {
  const [seconds, frames] = ts.split(':').map(Number);
  return seconds + (frames / 30);
}

/**
 * Calculate duration between two timestamps
 */
export function getDuration(start: string, end: string): number {
  return parseTimestamp(end) - parseTimestamp(start);
}

/**
 * Generate stagger delays for array of elements
 */
export function staggerDelays(count: number, baseDelay: number = timing.stagger): number[] {
  return Array.from({ length: count }, (_, i) => i * baseDelay);
}
```

### 2. `project.ts` — Project Configuration

```typescript
import { makeProject } from '@revideo/core';

import scene1 from './scenes/scene1?scene';
import scene2 from './scenes/scene2?scene';
// ... import all scenes

export default makeProject({
  scenes: [
    scene1,
    scene2,
    // ... all scenes in order
  ],
});
```

### 3. Scene File Template

```typescript
import { makeScene2D } from '@revideo/2d';
import { Circle, Rect, Txt, Node, Line, Path, Img, Layout } from '@revideo/2d';
import {
  all,
  chain,
  delay,
  sequence,
  waitFor,
  loop,
  createRef,
  createRefArray,
  createSignal,
  easeOutCubic,
  easeInCubic,
  easeInOutCubic,
  easeOutQuart,
  easeOutExpo,
  easeInOutSine,
  linear,
  Vector2,
  Color,
  DEFAULT,
} from '@revideo/core';

import { RAIKU, colors, fonts, fontSizes, timing, effects, layout } from '../lib/raiku';

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
  // REFS
  // ============================================
  // Declare all refs at top

  // ============================================
  // BUILD SCENE
  // ============================================
  view.add(
    <>
      {/* Layer 1: Background elements */}
      {/* Layer 2: Glow layers (behind main content) */}
      {/* Layer 3: Main content */}
      {/* Layer 4: Foreground/overlays */}
    </>
  );

  // ============================================
  // ANIMATION TIMELINE
  // ============================================
  
  // Beat 1 (00:00)
  yield* all(
    // animations
  );

  // Beat 2 (00:10)
  yield* all(
    // animations
  );

  // ... continue with 0.3s beat structure

  // ============================================
  // SCENE EXIT / TRANSITION PREP
  // ============================================
  
  // Hold or exit animations for transition
  yield* waitFor(timing.hold);
});
```

---

## Visual Elements Library

### Text Elements

```typescript
// Hero text (big impact)
const heroText = createRef<Txt>();
<Txt
  ref={heroText}
  text="PARALLEL"
  fontFamily={fonts.heading}
  fontSize={fontSizes.hero}
  fontWeight={700}
  fill={colors.text}
  opacity={0}
  scale={0.8}
/>

// With neon glow
const textGlow = createRef<Txt>();
<Txt
  ref={textGlow}
  text="PARALLEL"
  fontFamily={fonts.heading}
  fontSize={fontSizes.hero}
  fontWeight={700}
  fill={colors.neon}
  opacity={0}
  filters={[blur(effects.glowBlur)]}
/>
// Layer glow BEHIND main text

// Data/number display
const dataText = createRef<Txt>();
<Txt
  ref={dataText}
  text="50ms"
  fontFamily={fonts.data}
  fontSize={fontSizes.data}
  fill={colors.neon}
/>
```

### Raiku Logo

```typescript
// Hexagon logo mark
const logoHex = createRef<Path>();
const logoGlow = createRef<Path>();

<Node>
  {/* Glow layer */}
  <Path
    ref={logoGlow}
    data="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z"
    fill={colors.neon}
    opacity={0}
    filters={[blur(effects.glowBlurLarge)]}
    scale={1.2}
  />
  {/* Main logo */}
  <Path
    ref={logoHex}
    data="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z"
    fill={colors.neon}
    opacity={0}
    scale={0}
  />
</Node>

// Logo entrance
yield* all(
  logoHex().scale(1, timing.entrance, easeOutCubic),
  logoHex().opacity(1, timing.entrance * 0.8),
  delay(0.05, logoGlow().opacity(effects.glowOpacity, timing.entrance)),
);

// Logo pulse
yield* all(
  logoHex().scale(effects.pulseScale, 0.1, easeOutCubic),
  logoGlow().opacity(0.8, 0.1),
);
yield* all(
  logoHex().scale(1, 0.15, easeInOutCubic),
  logoGlow().opacity(effects.glowOpacity, 0.1),
);
```

### Hexagon Grid Background

```typescript
const hexGrid = createRefArray<Path>();
const gridSize = 8;
const hexSpacing = 120;

<Node opacity={0.1}>
  {Array.from({ length: gridSize * gridSize }, (_, i) => {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    const offsetX = (row % 2) * (hexSpacing / 2);
    return (
      <Path
        key={`hex-${i}`}
        ref={hexGrid}
        data="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z"
        x={col * hexSpacing - (gridSize * hexSpacing) / 2 + offsetX}
        y={row * hexSpacing * 0.866 - (gridSize * hexSpacing * 0.866) / 2}
        stroke={colors.white}
        lineWidth={1}
        opacity={0}
        scale={0.3}
      />
    );
  })}
</Node>

// Staggered grid reveal
yield* sequence(
  0.02,
  ...hexGrid.map(hex => 
    all(
      hex.opacity(1, 0.1),
      hex.scale(0.4, 0.15, easeOutCubic),
    )
  ),
);
```

### Comparison Split

```typescript
const leftPanel = createRef<Rect>();
const rightPanel = createRef<Rect>();
const divider = createRef<Line>();

<Node>
  {/* Left panel */}
  <Rect
    ref={leftPanel}
    x={-layout.width / 4}
    width={layout.width / 2 - 20}
    height={layout.height - 200}
    fill={colors.background}
    stroke={colors.white}
    lineWidth={2}
    opacity={0}
  />
  
  {/* Right panel */}
  <Rect
    ref={rightPanel}
    x={layout.width / 4}
    width={layout.width / 2 - 20}
    height={layout.height - 200}
    fill={colors.background}
    stroke={colors.neon}
    lineWidth={2}
    opacity={0}
  />
  
  {/* Center divider */}
  <Line
    ref={divider}
    points={[[0, -400], [0, 400]]}
    stroke={colors.white}
    lineWidth={2}
    opacity={0}
    end={0}
  />
</Node>

// Split entrance
yield* all(
  leftPanel().opacity(1, timing.entrance),
  rightPanel().opacity(1, timing.entrance),
  divider().opacity(1, 0.1),
  divider().end(1, 0.3, easeOutCubic),
);

// Highlight right side
yield* all(
  leftPanel().opacity(0.3, 0.2),
  rightPanel().stroke(colors.neon, 0.2),
  rightPanel().shadowColor(colors.neon, 0.2),
  rightPanel().shadowBlur(30, 0.2),
);
```

### Bar Chart

```typescript
const bars = createRefArray<Rect>();
const barData = [65, 100, 45, 80]; // percentages
const barWidth = 80;
const barGap = 40;
const maxBarHeight = 400;

<Node y={100}>
  {barData.map((value, i) => (
    <Rect
      key={`bar-${i}`}
      ref={bars}
      x={(i - (barData.length - 1) / 2) * (barWidth + barGap)}
      y={maxBarHeight / 2}
      width={barWidth}
      height={0}
      fill={i === 1 ? colors.neon : colors.white}
      opacity={0.8}
      radius={4}
    />
  ))}
</Node>

// Bars grow up
yield* sequence(
  timing.stagger,
  ...bars.map((bar, i) =>
    all(
      bar.height((barData[i] / 100) * maxBarHeight, 0.3, easeOutCubic),
      bar.y(maxBarHeight / 2 - (barData[i] / 100) * maxBarHeight / 2, 0.3, easeOutCubic),
    )
  ),
);

// Highlight specific bar
yield* all(
  bars[1].fill(colors.neon, 0.15),
  bars[1].shadowColor(colors.neon, 0.15),
  bars[1].shadowBlur(effects.glowBlur, 0.15),
);
```

### Progress/Loading Bar

```typescript
const progressBg = createRef<Rect>();
const progressFill = createRef<Rect>();
const progressGlow = createRef<Rect>();

<Node>
  {/* Background track */}
  <Rect
    ref={progressBg}
    width={600}
    height={16}
    fill={colors.white}
    opacity={0.2}
    radius={8}
  />
  {/* Glow */}
  <Rect
    ref={progressGlow}
    width={0}
    height={16}
    fill={colors.neon}
    opacity={0.5}
    radius={8}
    filters={[blur(20)]}
    x={-300}
  />
  {/* Fill */}
  <Rect
    ref={progressFill}
    width={0}
    height={16}
    fill={colors.neon}
    radius={8}
    x={-300}
  />
</Node>

// Animate progress
yield* all(
  progressFill().width(600, 1.5, easeInOutCubic),
  progressFill().x(0, 1.5, easeInOutCubic),
  progressGlow().width(600, 1.5, easeInOutCubic),
  progressGlow().x(0, 1.5, easeInOutCubic),
);
```

### Arrow/Pointer

```typescript
const arrow = createRef<Line>();
const arrowGlow = createRef<Line>();

<Node>
  <Line
    ref={arrowGlow}
    points={[[-100, 0], [80, 0], [50, -30]]}
    stroke={colors.neon}
    lineWidth={8}
    lineCap="round"
    lineJoin="round"
    opacity={0}
    filters={[blur(15)]}
    end={0}
  />
  <Line
    ref={arrow}
    points={[[-100, 0], [80, 0], [50, -30]]}
    stroke={colors.neon}
    lineWidth={4}
    lineCap="round"
    lineJoin="round"
    opacity={0}
    end={0}
  />
</Node>

// Arrow draws in
yield* all(
  arrow().opacity(1, 0.1),
  arrowGlow().opacity(0.5, 0.1),
  arrow().end(1, 0.3, easeOutCubic),
  arrowGlow().end(1, 0.3, easeOutCubic),
);
```

### Icon with Glow

```typescript
const iconGlow = createRef<Circle>();
const iconBg = createRef<Circle>();
const icon = createRef<Path>(); // or use Icon component

<Node>
  <Circle
    ref={iconGlow}
    size={120}
    fill={colors.neon}
    opacity={0}
    filters={[blur(effects.glowBlurLarge)]}
  />
  <Circle
    ref={iconBg}
    size={80}
    fill={colors.black}
    stroke={colors.neon}
    lineWidth={3}
    opacity={0}
    scale={0}
  />
  <Path
    ref={icon}
    data="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
    stroke={colors.neon}
    lineWidth={2}
    scale={2}
    opacity={0}
  />
</Node>

// Icon entrance with glow
yield* all(
  iconBg().scale(1, timing.entrance, easeOutCubic),
  iconBg().opacity(1, timing.entrance * 0.8),
  delay(0.05, iconGlow().opacity(effects.glowOpacitySubtle, timing.entrance)),
  delay(0.1, icon().opacity(1, timing.entrance)),
);
```

---

## Animation Patterns

### Beat-Driven Timeline

Structure animations in 0.3s beats:

```typescript
// Beat 0 (00:00) - Initial entrance
yield* all(
  element1().opacity(1, 0.15),
  element1().y(0, 0.2, easeOutCubic),
);

// Beat 1 (00:10) - Secondary element
yield* all(
  element2().scale(1, 0.15, easeOutCubic),
  element1Glow().opacity(0.5, 0.1),
);

// Beat 2 (00:20) - Text appears
yield* all(
  text().opacity(1, 0.1),
  text().x(0, 0.2, easeOutCubic),
);

// Beat 3 (01:00) - Emphasis pulse
yield* all(
  mainElement().scale(1.05, 0.1, easeOutCubic),
  glowLayer().opacity(0.8, 0.1),
);
yield* all(
  mainElement().scale(1, 0.1, easeInOutCubic),
  glowLayer().opacity(0.5, 0.1),
);

// Continue every 0.3s...
```

### Staggered Entrances

```typescript
// Fast stagger for lists/grids
yield* sequence(
  0.05, // 50ms between each
  ...items.map(item =>
    all(
      item.opacity(1, 0.1),
      item.y(0, 0.15, easeOutCubic),
    )
  ),
);
```

### Emphasis/Pulse

```typescript
// Quick attention pulse
yield* all(
  element().scale(1.08, 0.08, easeOutCubic),
  elementGlow().opacity(0.8, 0.08),
);
yield* all(
  element().scale(1, 0.12, easeInOutCubic),
  elementGlow().opacity(effects.glowOpacity, 0.1),
);
```

### Shake/Vibrate

```typescript
// Quick shake for emphasis
const shakeIntensity = 3;
yield* chain(
  element().x(shakeIntensity, 0.03),
  element().x(-shakeIntensity, 0.03),
  element().x(shakeIntensity * 0.5, 0.03),
  element().x(-shakeIntensity * 0.5, 0.03),
  element().x(0, 0.03),
);
```

### Typewriter Text

```typescript
const textRef = createRef<Txt>();
const fullText = "Parallel Execution";

<Txt ref={textRef} text="" fontFamily={fonts.heading} fill={colors.text} />

// Typewriter effect
for (let i = 0; i <= fullText.length; i++) {
  textRef().text(fullText.slice(0, i));
  yield* waitFor(0.03); // 30ms per character
}
```

### Counter Animation

```typescript
const counter = createSignal(0);
const counterText = createRef<Txt>();

<Txt
  ref={counterText}
  text={() => `${Math.round(counter())}ms`}
  fontFamily={fonts.data}
  fontSize={fontSizes.data}
  fill={colors.neon}
/>

// Animate counter
yield* counter(50, 0.8, easeOutCubic);
```

---

## Transition Patterns

### Hard Cut

```typescript
// Scene ends - no exit animation needed
// Next scene starts fresh

yield* waitFor(0.1); // Tiny buffer
// Scene ends
```

### Crossfade (0.1s)

```typescript
// At end of scene, fade out main elements
yield* all(
  ...mainElements.map(el => el.opacity(0, 0.1, easeInCubic)),
);

// Next scene fades in its elements
yield* all(
  ...newElements.map(el => el.opacity(1, 0.1, easeOutCubic)),
);
```

### Wipe/Slide

```typescript
// Slide everything left
yield* all(
  sceneGroup().x(-layout.width, 0.25, easeInCubic),
  sceneGroup().opacity(0, 0.2),
);
```

---

## Quality Iteration Loop

The agent MUST iterate internally until code meets all criteria:

### Iteration Process

```
1. Generate initial code (~1300 lines)
2. Type-check mentally / validate syntax
3. If errors: fix silently, regenerate
4. Check visual density:
   - Count beats (should be ~1 per 0.3s)
   - Count glow layers (every main element needs one)
   - Count animations per beat (2-4 simultaneous)
5. If under-animated: add more layers, effects, micro-animations
6. Repeat until ~2500 lines achieved
7. Final validation pass
8. Output clean, copy-pasteable code
```

### Line Count Scaling

| Target Lines | Complexity Level |
|-------------|------------------|
| 1300 | Base: main elements, basic animations |
| 1600 | + Glow layers for all elements |
| 1900 | + Background grid/particles |
| 2200 | + Micro-animations, extra pulses |
| 2500 | + Ambient motion, layered effects |

### Adding Visual Density

To increase lines while improving quality:

1. **Add glow layers** - Every text, icon, shape gets a blur glow behind it
2. **Add background elements** - Hex grids, dot patterns, ambient shapes
3. **Add micro-beats** - Small scale/opacity pulses between main beats
4. **Add particle effects** - Floating dots, lines, shapes
5. **Layer more elements** - Multiple text shadows, stroke + fill versions
6. **More animation steps** - Break single animations into sequences

### Code Quality Checks

Before outputting, verify:

- [ ] All imports from `@revideo/2d` and `@revideo/core` (NOT @motion-canvas)
- [ ] `makeScene2D('sceneName', function* (view) {...})` with scene name string
- [ ] All refs declared with `createRef<Type>()` before use
- [ ] All refs accessed with `()` - e.g., `myRef().opacity(1, 0.2)`
- [ ] JSX keys on mapped elements: `key={\`item-${i}\`}`
- [ ] No trailing commas in objects/arrays
- [ ] Proper easing imports used
- [ ] Only THREE colors used: `#C0FF38`, `#000204`, `#FDFDFF`
- [ ] `yield*` before all animation calls
- [ ] `all()`, `chain()`, `sequence()` wrapping parallel/sequential animations
- [ ] No `any` types - all refs properly typed

---

## Output Example

For a 2-scene input, output structure:

**`lib/raiku.ts`** - Shared constants (as shown above)

**`project.ts`**:
```typescript
import { makeProject } from '@revideo/core';

import scene1 from './scenes/scene1?scene';
import scene2 from './scenes/scene2?scene';

export default makeProject({
  scenes: [scene1, scene2],
});
```

**`scenes/scene1.tsx`**:
```typescript
// ~1200-1300 lines per scene for high quality
// Full implementation following patterns above
```

**`scenes/scene2.tsx`**:
```typescript
// ~1200-1300 lines per scene for high quality
// Full implementation following patterns above
```

---

## Final Checklist

Before outputting code, verify ALL of the following:

### Technical Reference Compliance
- [ ] Read `/mnt/project/technical-reference.md` BEFORE generating
- [ ] All imports from `@revideo/2d` and `@revideo/core` (NOT @motion-canvas)
- [ ] `makeScene2D('sceneName', function* (view) {...})` with scene name string
- [ ] All components/props exist in technical-reference.md
- [ ] All easing functions properly imported from `@revideo/core`
- [ ] Flow control (`all`, `chain`, `sequence`, `delay`) used correctly per tech-ref

### Type Safety
- [ ] All refs declared with `createRef<Type>()` before use
- [ ] All refs accessed with `()` — e.g., `myRef().opacity(1, 0.2)`
- [ ] JSX keys on mapped elements: `key={\`item-${i}\`}`
- [ ] No `any` types — all refs properly typed
- [ ] No trailing commas breaking syntax

### Raiku Brand Compliance
- [ ] Only THREE colors used: `#C0FF38`, `#000204`, `#FDFDFF`
- [ ] Fonts match brand spec (JetBrains Mono for headings/data, Inter for body)

### Animation Quality
- [ ] Visual beat every 0.3 seconds
- [ ] Glow layers on all primary elements
- [ ] `yield*` before all animation calls

### Output Completeness
- [ ] Scene duration matches input timestamps
- [ ] Transitions match specified style (hard cut / crossfade)
- [ ] Line count target met (~2500 total)
- [ ] All files included: `scenes/*.tsx` + `project.ts` + `lib/raiku.ts`
- [ ] Code is copy-pasteable (no placeholders, no TODOs)

---

## Critical Learnings & Error Prevention

### 1. Filter Syntax (CRITICAL)

The `filters` prop does NOT use object notation. It uses function calls:

```typescript
// ❌ WRONG - Will cause TypeScript error
filters={[{ name: 'blur', radius: 200 }]}

// ✅ CORRECT - Import blur function and call it
import { blur } from '@revideo/2d';
filters={[blur(200)]}
```

The `blur()` function must be imported from `@revideo/2d` along with other components.

### 2. Scene Import Suffix

Scene imports in `project.tsx` MUST include the `?scene` suffix:

```typescript
// ❌ WRONG
import scene1 from './scenes/scene1';

// ✅ CORRECT
import scene1 from './scenes/scene1?scene';
```

### 3. Module Path for Brand Constants

The `raiku.ts` file should be located at `src/lib/raiku.ts` (not `src/raiku.ts`):

```
src/
├── lib/
│   └── raiku.ts          # Brand constants here
├── scenes/
│   ├── scene1.tsx
│   └── ...
└── project.tsx
```

Import in scene files:
```typescript
import { colors, timing, effects, fonts, fontSizes, layout } from '../lib/raiku';
```

### 4. Colors Object Enhancement

Include direct color values for convenience:

```typescript
export const colors = {
  primary: RAIKU.neon,
  secondary: RAIKU.black,
  background: RAIKU.black,
  text: RAIKU.white,
  accent: RAIKU.neon,
  glow: RAIKU.neon,
  // Direct access to brand colors
  neon: RAIKU.neon,
  white: RAIKU.white,
  black: RAIKU.black,
} as const;
```

### 5. Visual Enhancement Patterns

When enhancing scenes to ~1,200+ lines with quality code:

**Background layers (add depth):**
- Hexagonal grid (Raiku signature motif)
- Multiple background glows (varying sizes/opacity)
- Corner vignettes for framing
- Grid lines (horizontal + vertical)
- Circuit trace patterns

**3D depth effects:**
- Depth shadow behind main elements (offset + blur)
- 3D offset layer (slightly offset wireframe)
- Multiple glow layers at different blur levels

**Particle systems:**
- Orbital particles around hero elements
- Ambient floating particles
- Data stream particles
- Flow particles along connection lines

**Enhanced icons:**
- Multi-layer construction (outline + fill + glow)
- Internal detail patterns
- Animated sub-elements

**Animation density:**
- Visual beat every 0.3 seconds
- Micro-pulses between beats
- Staggered reveals with delays
- Particle trails following movements

### 6. Transparent Color Values (CRITICAL)

Revideo does NOT support the string `"transparent"` for color values. Use `null` instead:

```typescript
// ❌ WRONG - Will cause "unknown format: transparent" error
fill="transparent"
fill={'transparent'}
.fill('transparent', duration)

// ✅ CORRECT - Use null for transparent
fill={null}
.fill(null, duration)
```

This applies to:
- JSX props: `fill={null}`, `stroke={null}`
- Animation calls: `.fill(null, duration)`, `.stroke(null, duration)`

### 7. Key Prop Types in Arrays

When using array indices as React keys, convert numbers to strings:

```typescript
// ❌ WRONG - TypeScript error: Type 'number' is not assignable to type 'string'
{array.map((item, i) => (
  <Node key={i} />
))}

// ✅ CORRECT - Use template literal or toString()
{array.map((item, i) => (
  <Node key={`item-${i}`} />
))}
```

**CRITICAL: Nested loops must include ALL parent indices in keys:**

```typescript
// ❌ WRONG - Causes "Duplicated node key" error when outer loop creates multiple instances
{outerArray.map((_, i) => (
  condition && innerArray.map((_, j) => (
    <Circle key={`dot-${j}`} />  // j=0 appears multiple times!
  ))
))}

// ✅ CORRECT - Include both indices for uniqueness
{outerArray.map((_, i) => (
  condition && innerArray.map((_, j) => (
    <Circle key={`block-${i}-dot-${j}`} />
  ))
))}
```

### 8. tsconfig.json Configuration

Required configuration for Revideo projects:

```json
{
  "extends": "@revideo/2d/tsconfig.project.json",
  "include": ["src"],
  "compilerOptions": {
    "noEmit": false,
    "outDir": "dist",
    "module": "CommonJS",
    "skipLibCheck": true,
    "ignoreDeprecations": "5.0"
  }
}
```

The `"ignoreDeprecations": "5.0"` is required to silence the `moduleResolution=node10` deprecation warning from the base config.

### 9. Required Imports Checklist

Always include these imports in scene files:

```typescript
// From @revideo/2d - Components AND blur filter
import { makeScene2D } from '@revideo/2d';
import { Rect, Node, Line, Circle, Path, Txt, blur } from '@revideo/2d';

// From @revideo/core - Animation utilities
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
```

**Common import mistakes:**
- Forgetting `blur` from `@revideo/2d`
- Using `@motion-canvas/*` instead of `@revideo/*`
- Missing easing functions from `@revideo/core`

### 10. Animation Property Patterns

```typescript
// ✅ CORRECT - Animate with (value, duration, easing)
element().opacity(1, 0.3, easeOutCubic)
element().scale(1.2, 0.2, easeOutBack)
element().x(100, 0.5, easeInOutCubic)
element().fill(colors.neon, 0.2)

// ✅ CORRECT - Animate line drawing with end property
line().end(1, 0.3, easeOutCubic)  // Draws line from 0% to 100%

// ❌ WRONG - Missing yield*
element().opacity(1, 0.3)  // Won't animate!

// ✅ CORRECT - Always use yield*
yield* element().opacity(1, 0.3)
```

### 11. Node Hierarchy and Layering

Elements render in order - first elements are BEHIND later elements:

```typescript
view.add(
  <>
    {/* LAYER 1 (BACK): Background glows - render first, appear behind everything */}
    <Circle size={800} fill={colors.neon} opacity={0.05} filters={[blur(200)]} />

    {/* LAYER 2: Grid/patterns */}
    <Node opacity={0.1}>
      {/* hex grid here */}
    </Node>

    {/* LAYER 3: Main content */}
    <Rect ref={mainBox} /* ... */ />

    {/* LAYER 4 (FRONT): Foreground overlays - render last, appear on top */}
    <Node ref={particles}>
      {/* particles here */}
    </Node>
  </>
);
```

### 12. Ref Array Patterns

```typescript
// Declare ref array
const boxes = createRefArray<Rect>();

// Use in JSX - refs automatically added to array
{Array.from({ length: 5 }, (_, i) => (
  <Rect
    key={`box-${i}`}
    ref={boxes}  // Each Rect added to boxes array
    /* ... */
  />
))}

// Animate all refs
yield* sequence(
  0.1,
  ...boxes.map((box, i) => box.opacity(1, 0.2))
);

// Access individual refs
yield* boxes[0].scale(1.2, 0.3);
```

---

## Quick Start Checklist (New Project)

Before running your first Revideo project, verify:

### File Structure
```
my-revideo-project/
├── src/
│   ├── lib/
│   │   └── raiku.ts         # Brand constants (NOT in src/ root!)
│   ├── scenes/
│   │   ├── scene1.tsx
│   │   ├── scene2.tsx
│   │   └── ...
│   └── project.tsx          # Main project file
├── package.json
├── tsconfig.json
└── vite.config.ts           # If using Vite
```

### package.json Requirements
```json
{
  "scripts": {
    "start": "revideo serve",
    "build": "revideo build",
    "render": "revideo render"
  },
  "dependencies": {
    "@revideo/2d": "^0.x.x",
    "@revideo/core": "^0.x.x"
  }
}
```

### tsconfig.json (Copy exactly)
```json
{
  "extends": "@revideo/2d/tsconfig.project.json",
  "include": ["src"],
  "compilerOptions": {
    "noEmit": false,
    "outDir": "dist",
    "module": "CommonJS",
    "skipLibCheck": true,
    "ignoreDeprecations": "5.0"
  }
}
```

### project.tsx Template
```typescript
import { makeProject } from '@revideo/core';

// MUST include ?scene suffix!
import scene1 from './scenes/scene1?scene';
import scene2 from './scenes/scene2?scene';

export default makeProject({
  scenes: [scene1, scene2],
});
```

---

## Common Errors & Solutions

### Error: "Cannot find module '../lib/raiku'"
**Cause:** raiku.ts is in wrong location
**Fix:** Move `src/raiku.ts` → `src/lib/raiku.ts`

### Error: "'radius' does not exist in type 'Filter'"
**Cause:** Using object syntax for filters
**Fix:**
```typescript
// Wrong: filters={[{ name: 'blur', radius: 20 }]}
// Right: filters={[blur(20)]}
// Don't forget to import blur from '@revideo/2d'
```

### Error: "unknown format: transparent"
**Cause:** Using string "transparent" for colors
**Fix:** Use `null` instead of `"transparent"`
```typescript
// Wrong: fill="transparent" or fill={'transparent'}
// Right: fill={null}
```

### Error: "Duplicated node key: 'item-0'"
**Cause:** Keys not unique across nested loops
**Fix:** Include ALL loop indices in key
```typescript
// Wrong: key={`item-${j}`}
// Right: key={`group-${i}-item-${j}`}
```

### Error: "Type 'number' is not assignable to type 'string'" (for key prop)
**Cause:** Using number directly as key
**Fix:** Convert to string with template literal
```typescript
// Wrong: key={i}
// Right: key={`item-${i}`}
```

### Error: "moduleResolution=node10 is deprecated"
**Cause:** TypeScript deprecation warning
**Fix:** Add to tsconfig.json compilerOptions:
```json
"ignoreDeprecations": "5.0"
```

### Error: Scene not loading / blank screen
**Cause:** Missing `?scene` suffix in imports
**Fix:** Add `?scene` to all scene imports in project.tsx
```typescript
// Wrong: import scene1 from './scenes/scene1';
// Right: import scene1 from './scenes/scene1?scene';
```

### Error: Animations not playing
**Cause:** Missing `yield*` before animation calls
**Fix:** Always use `yield*` for animations
```typescript
// Wrong: element().opacity(1, 0.3);
// Right: yield* element().opacity(1, 0.3);
```

### Error: "Cannot read property 'x' of undefined"
**Cause:** Accessing ref before it's assigned (outside view.add)
**Fix:** Only access refs after view.add() has run

### Runtime: Elements appearing in wrong order
**Cause:** JSX render order = visual layer order
**Fix:** Render background elements FIRST, foreground LAST

---

## Revideo vs Motion Canvas Differences

If you're coming from Motion Canvas, note these critical differences:

| Feature | Motion Canvas | Revideo |
|---------|--------------|---------|
| Package names | `@motion-canvas/*` | `@revideo/*` |
| makeScene2D | `makeScene2D(function* (view) {...})` | `makeScene2D('sceneName', function* (view) {...})` |
| Scene imports | `import scene from './scene'` | `import scene from './scene?scene'` |
| Filter syntax | Varies | `blur(radius)` function from `@revideo/2d` |

---

## Performance Tips

1. **Limit particle count** - 20-30 particles max per scene
2. **Use blur sparingly** - Heavy blur = heavy GPU load
3. **Reuse refs** - Don't create new refs inside animation loops
4. **Batch animations** - Use `all()` to run animations in parallel
5. **Avoid deep nesting** - Keep Node hierarchy shallow when possible

---

## Debugging Tips

1. **Check browser console** - Runtime errors appear there
2. **Verify imports** - Most errors are import-related
3. **Test incrementally** - Add one element/animation at a time
4. **Use opacity: 0** - Start elements invisible, animate in
5. **Check ref access** - Refs only work after view.add()

---

*Primary Reference: `/mnt/project/technical-reference.md` — MUST read before generating*
*Brand Reference: `/mnt/project/raiku-brand-identity.json`*
