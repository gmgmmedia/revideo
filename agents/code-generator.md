# Agent: Revideo Video Code Generator (Generic Template)

Generate high-quality Revideo TSX for short-form video content. Optimized for TikTok-style attention spans with visual beats every 0.3 seconds.

**IMPORTANT:** This is a generic template. Project-specific agents should reference this file and add their own brand colors, patterns, and file paths.

---

## MANDATORY: Execution Workflow

**YOU MUST FOLLOW THESE STEPS IN ORDER. DO NOT SKIP.**

### Step 0: Read Technical Reference (REQUIRED FIRST)

```
BEFORE writing ANY code:
1. Read the technical-reference.md file in docs/
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
Read the project's brand-identity.json file:
- Confirm color values match embedded constants
- Note any brand-specific patterns
- Load colors into your working memory
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
  5. If < 800 lines per scene or quality issues: enhance and repeat
  6. If passing all checks: exit loop
```

### Step 4: Output Final Code

```
Output complete, copy-pasteable files:
- lib/brand.ts
- project.tsx
- scenes/scene1.tsx, scene2.tsx, etc.
```

---

## Technical Reference Validation Checklist

After generating code, verify against the technical reference:

- [ ] Imports match Revideo namespace (`@revideo/2d`, `@revideo/core`)
- [ ] `makeScene2D` includes scene name string as first argument
- [ ] All components used exist in technical-reference (Circle, Rect, Txt, Node, Line, Path, Img, Layout, etc.)
- [ ] All props used are valid per technical-reference
- [ ] Easing functions imported correctly from `@revideo/core`
- [ ] Flow control functions (`all`, `chain`, `sequence`, `delay`, `waitFor`) used correctly
- [ ] Signal syntax correct: `ref()` to access, `ref().property(value, duration)` to animate
- [ ] `yield*` used for all animation calls

---

## Input Format

User provides a script in this format:

```
SCENE 1 (00:00 - 03:15)
VO: "Welcome to today's breakdown..."
VISUALS:
- Logo fade in, pulse (00:00 - 00:20)
- Text: "Title" scale up from center (00:20 - 01:10)
- Grid builds behind text (01:00 - 02:00)
- Icon with glow (02:00 - 03:00)
TRANSITION: hard cut

SCENE 2 (03:15 - 07:20)
VO: "More content here..."
VISUALS:
- Split comparison diagram (03:15 - 05:00)
- Highlight animation (05:00 - 06:00)
- Arrow pointing (06:00 - 07:00)
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

---

## Output Structure

Generate multi-file output:

```
/src
├── project.tsx         # Project configuration
├── scenes/
│   ├── scene1.tsx      # Scene 1
│   ├── scene2.tsx      # Scene 2
│   └── ...
└── lib/
    └── brand.ts        # Shared brand constants & utilities
```

---

## File Templates

### 1. `lib/brand.ts` — Shared Constants (Template)

```typescript
/**
 * Brand System
 * Colors, typography, and animation constants
 */

// ============================================
// BRAND COLORS (customize per brand)
// ============================================
export const BRAND = {
  primary: '#XXXXXX',
  secondary: '#XXXXXX',
  background: '#XXXXXX',
  text: '#XXXXXX',
} as const;

export const colors = {
  primary: BRAND.primary,
  background: BRAND.background,
  text: BRAND.text,
  accent: BRAND.primary,
  glow: BRAND.primary,
} as const;

// ============================================
// TYPOGRAPHY
// ============================================
export const fonts = {
  heading: 'Inter, system-ui, sans-serif',
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
 * Parse timestamp format (SS:FF) to seconds
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

### 2. `project.tsx` — Project Configuration

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
import { Circle, Rect, Txt, Node, Line, Path, blur } from '@revideo/2d';
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

import { colors, fonts, fontSizes, timing, effects, layout } from '../lib/brand';

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

---

## Critical Learnings & Error Prevention

### 1. Filter Syntax (CRITICAL)

```typescript
// ❌ WRONG - Will cause TypeScript error
filters={[{ name: 'blur', radius: 200 }]}

// ✅ CORRECT - Import blur function and call it
import { blur } from '@revideo/2d';
filters={[blur(200)]}
```

### 2. Scene Import Suffix

```typescript
// ❌ WRONG
import scene1 from './scenes/scene1';

// ✅ CORRECT
import scene1 from './scenes/scene1?scene';
```

### 3. Transparent Color Values (CRITICAL)

```typescript
// ❌ WRONG - Will cause "unknown format: transparent" error
fill="transparent"

// ✅ CORRECT - Use null for transparent
fill={null}
```

### 4. Key Prop Types in Arrays

```typescript
// ❌ WRONG - TypeScript error
{array.map((item, i) => (
  <Node key={i} />
))}

// ✅ CORRECT - Use template literal
{array.map((item, i) => (
  <Node key={`item-${i}`} />
))}
```

### 5. Required Imports Checklist

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

### 6. Animation Property Patterns

```typescript
// ✅ CORRECT - Always use yield*
yield* element().opacity(1, 0.3, easeOutCubic);
yield* element().scale(1.2, 0.2, easeOutBack);

// ❌ WRONG - Missing yield*
element().opacity(1, 0.3);  // Won't animate!
```

### 7. Node Hierarchy and Layering

Elements render in order - first elements are BEHIND later elements:

```typescript
view.add(
  <>
    {/* LAYER 1 (BACK): Background glows */}
    <Circle size={800} fill={colors.glow} opacity={0.05} filters={[blur(200)]} />

    {/* LAYER 2: Grid/patterns */}
    <Node opacity={0.1}>{/* grid here */}</Node>

    {/* LAYER 3: Main content */}
    <Rect ref={mainBox} /* ... */ />

    {/* LAYER 4 (FRONT): Foreground overlays */}
    <Node ref={particles}>{/* particles here */}</Node>
  </>
);
```

---

## Quality Iteration Loop

### Iteration Process

```
1. Generate initial code (~800 lines per scene)
2. Type-check mentally / validate syntax
3. If errors: fix silently, regenerate
4. Check visual density:
   - Count beats (should be ~1 per 0.3s)
   - Count glow layers (every main element needs one)
   - Count animations per beat (2-4 simultaneous)
5. If under-animated: add more layers, effects, micro-animations
6. Repeat until quality met
7. Final validation pass
8. Output clean, copy-pasteable code
```

### Adding Visual Density

To increase quality:

1. **Add glow layers** - Every text, icon, shape gets a blur glow behind it
2. **Add background elements** - Grids, dot patterns, ambient shapes
3. **Add micro-beats** - Small scale/opacity pulses between main beats
4. **Add particle effects** - Floating dots, lines, shapes
5. **Layer more elements** - Multiple text shadows, stroke + fill versions
6. **More animation steps** - Break single animations into sequences

---

## Common Errors & Solutions

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module '../lib/brand'` | brand.ts in wrong location | Move to `src/lib/brand.ts` |
| `'radius' does not exist in type 'Filter'` | Object syntax for filters | Use `blur(20)` function |
| `unknown format: transparent` | String "transparent" for colors | Use `null` instead |
| `Duplicated node key` | Keys not unique in nested loops | Include ALL loop indices: `key={\`group-${i}-item-${j}\`}` |
| Scene not loading | Missing `?scene` suffix | Add `?scene` to imports |
| Animations not playing | Missing `yield*` | Always use `yield*` for animations |

---

## Revideo vs Motion Canvas Differences

| Feature | Motion Canvas | Revideo |
|---------|--------------|---------|
| Package names | `@motion-canvas/*` | `@revideo/*` |
| makeScene2D | `makeScene2D(function* (view) {...})` | `makeScene2D('sceneName', function* (view) {...})` |
| Scene imports | `import scene from './scene'` | `import scene from './scene?scene'` |
| Filter syntax | Varies | `blur(radius)` function from `@revideo/2d` |

---

*This is a generic template. See project-specific code-generator.md files for brand colors and patterns.*
