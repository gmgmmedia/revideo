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
   - "Camera Patterns (Wrapper Layout)" (Section 11) — NO built-in Camera; use Layout wrapper
   - "Motion Design Patterns" (Section 21) — spring physics, secondary motion, hierarchy
   - "Masking, Wipe Transitions & Matched Cuts" (Section 22) — non-hard-cut transitions
   - "Easing Personalities & Decision Tables" (Section 23) — easing choice framework
   - "Performance & Gotchas" (Section 24) — cache discipline, blur ceilings, determinism
3. Keep these patterns in working memory throughout generation
```

**Why this matters:**
- Revideo uses `@revideo/core` and `@revideo/2d` (NOT `@motion-canvas/*`)
- Revideo's `makeScene2D` requires a scene name string: `makeScene2D('sceneName', function* (view) {...})`
- Motion Canvas omits the name: `makeScene2D(function* (view) {...})` — THIS WILL BREAK
- Revideo does NOT ship a `Camera` component. Virtual camera = wrapper `<Layout>` with animated transform.

### Step 1: Read Brand Identity (with motion_design)

```
Read the project's brand-identity.json file:
- Confirm color values match embedded constants
- Note any brand-specific patterns
- Load colors into your working memory

THEN extract motion_design fields as decision inputs:
- motion_design.philosophy           → guides high-level animation choices
- motion_design.pace.average_beat_duration → controls beat timing
- motion_design.pace.beat_density    → controls how many beats fit per second
- motion_design.easing_personality.primary → default easing for entrances
- motion_design.easing_personality.spring_config → if not 'none', use spring()
- motion_design.easing_personality.use_overshoot → whether to use easeOutBack/spring
- motion_design.easing_personality.use_anticipation → pre-scale-down before entrances
- motion_design.transition_vocabulary.primary → scene-to-scene transition default
- motion_design.transition_vocabulary.matched_cut_friendly → use useScene variables
- motion_design.camera_personality.static → if false, use wrapper-Layout camera moves
- motion_design.camera_personality.preferred_moves → which moves to apply
- motion_design.camera_personality.use_parallax → nest wrappers
- motion_design.secondary_motion.trail_intensity → particle/glow follow-through density
- motion_design.sound_aesthetic_hint → informs SFX selection (consumed by sound-designer)
```

**Fallback if motion_design is missing or incomplete:** Use the "Generic Professional" default profile:
- easing.primary = easeOutCubic, secondary = easeInOutCubic
- spring_config = none
- pace.beat = 0.3s
- transitions = fade only
- camera.static = true
- secondary_motion.trail_intensity = subtle
- reference_brands = ["Stripe"]

Document the fallback in a comment at the top of generated scene files: `// Motion design defaulted to Generic Professional — no motion_design in brand-identity.json.`

### Step 2: Parse Input Script

```
Parse the user's timestamp script:
- Extract scenes with start/end times
- Extract VO text for context
- Extract visual directions
- Note transition types between scenes
```

### Step 3: Generate Code (Iterate Until Score ≥ 9.0)

```
LOOP:
  1. Generate scene files
  2. Run hard checklist (all must pass; regenerate if any fail):
     - All 16 error-prevention rules
     - Scene name matches file name
     - All imports used; no unused refs
     - At least one beat per pace.average_beat_duration
  3. Compute weighted quality score (target ≥ 9.0) — see "Quality Iteration Loop" below
  4. If score < 9.0: fix the LOWEST-scoring metric.
     DO NOT add more glow layers if the deficit is in spring/camera/masking.
  5. Loop until score ≥ 9.0 AND scene reaches min line count (800+)
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
- [ ] No `Camera` import (Revideo has none) — wrapper `<Layout>` used for camera moves instead
- [ ] `motion_design` block from brand-identity.json was consulted BEFORE choosing easing/transition/camera
- [ ] Spring physics imported and used at least once (unless brand.motion_design.spring_config == 'none')
- [ ] Wrapper `<Layout>` virtual camera used at least once per video (unless brand.camera.static == true)
- [ ] At least one `compositeOperation` mask OR custom `useTransition` per video
- [ ] Secondary motion (`delay()` inside `all()`) used on every hero element entrance
- [ ] Easing diversity ≥ 4 distinct functions per scene; no single easing exceeds 50% of animations

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

Generate multi-file output using video-specific subfolders to support parallel code generation:

```
/src
├── scenes/
│   ├── {VIDEO-ID}/                    # Subfolder per video (e.g., NEAR-1, NEAR-2)
│   │   ├── project-{videoid}.tsx      # Project config for this video
│   │   ├── {VideoId}_scene1.tsx       # Scene files prefixed with video ID
│   │   ├── {VideoId}_scene2.tsx
│   │   └── ...
│   └── {VIDEO-ID-2}/                  # Another video can run in parallel
│       └── ...
└── lib/
    └── brand.ts                       # Shared brand constants (unchanged)
```

### Video Naming Convention

To support parallel code generation, use this naming pattern:

| Component | Format | Example |
|-----------|--------|---------|
| Folder | `{VIDEO-ID}/` | `NEAR-1/`, `NEAR-2/`, `RAIKU-1/` |
| Project file | `project-{videoid}.tsx` | `project-near3.tsx` |
| Scene files | `{VideoId}_scene{N}.tsx` | `Near3_scene1.tsx`, `Near3_scene2.tsx` |

**Rules:**
- VIDEO-ID: Uppercase with hyphen (e.g., `NEAR-1`)
- VideoId in files: PascalCase or camelCase (e.g., `Near3`, `Raiku1`)
- Never overwrite `scenes/scene1.tsx` directly - always use subfolders

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

### 2. `project-{videoid}.tsx` — Project Configuration

Located in the video's subfolder (e.g., `scenes/NEAR-3/project-near3.tsx`):

```typescript
import { makeProject } from '@revideo/core';

import Near3_scene1 from './Near3_scene1?scene';
import Near3_scene2 from './Near3_scene2?scene';
// ... import all scenes with VideoId prefix

export default makeProject({
  scenes: [
    Near3_scene1,
    Near3_scene2,
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

## Animation Pattern Library

15 production patterns organized into 5 families. Pick patterns from each family to compose a scene. Every pattern shows required imports at the top.

### Family 1: Entrance Patterns

#### 1A. Beat-Driven Timeline
```typescript
// Imports: all, easeOutCubic from '@revideo/core'

// Beat 0 (00:00) — hero element lands
yield* all(
  hero().opacity(1, 0.15),
  hero().y(0, 0.2, easeOutCubic),
);
// Beat 1 (00:10) — secondary element
yield* all(
  supporting().scale(1, 0.15, easeOutCubic),
  heroGlow().opacity(0.5, 0.1),
);
// Beat 2 (00:20) — text appears
yield* all(
  text().opacity(1, 0.1),
  text().x(0, 0.2, easeOutCubic),
);
// Continue every motion_design.pace.average_beat_duration seconds...
```

#### 1B. Staggered Cascade
```typescript
// Imports: sequence, all, easeOutCubic from '@revideo/core'

// Fast stagger (staccato): 0.04s — for code reveals, lists
yield* sequence(0.04, ...items.map(item =>
  all(item.opacity(1, 0.1), item.y(0, 0.15, easeOutCubic))
));

// March (0.08s) — for 3-5 element reveals
yield* sequence(0.08, ...items.map(item => item.opacity(1, 0.15, easeOutCubic)));

// Wave (0.15s, with easeInOutCubic) — for text lines, hero builds
yield* sequence(0.15, ...items.map(item => item.opacity(1, 0.2, easeInOutCubic)));
```

#### 1C. Spring Drop (HERO entrance for organic/playful brands)
```typescript
// Imports: spring, createSignal from '@revideo/core'

// Use UISpring | LogoLandSpring | OrganicSpring (defined in lib/brand.ts)
const heroScale = createSignal<number>(0);
const heroY = createSignal<number>(-200);
hero().scale(heroScale).y(heroY);

yield* all(
  spring(LogoLandSpring, 0, 1, value => heroScale(value)),
  spring(LogoLandSpring, -200, 0, value => heroY(value)),
);
```

#### 1D. Anticipation Entrance (HERO entrance for energetic brands)
```typescript
// Imports: easeInOutCubic, easeOutBack from '@revideo/core'

// Pre-load (wind-up) then release
yield* hero().scale(0.95, 0.08, easeInOutCubic);    // anticipation
yield* hero().scale(1.0, 0.2, easeOutBack);          // release + overshoot
```

#### 1E. Mask-Wipe Entrance (HERO entrance for cinematic feel)
```typescript
// Imports: createRef, easeInOutCubic from '@revideo/core'; Rect from '@revideo/2d'

const wipe = createRef<Rect>();

view.add(
  <Node cache>
    <Txt text="Hero text" fontSize={120} fill={'#fff'} />
    <Rect ref={wipe} size={[0, 200]} x={-600} offsetX={-1} fill={'#fff'}
          compositeOperation={'destination-in'} />
  </Node>
);

yield* wipe().size([1200, 200], 0.5, easeInOutCubic);
```

### Family 2: Emphasis Patterns

#### 2A. Pulse (attention beat)
```typescript
// Imports: all, easeOutCubic, easeInOutCubic from '@revideo/core'

yield* all(
  element().scale(1.08, 0.08, easeOutCubic),
  elementGlow().opacity(0.8, 0.08),
);
yield* all(
  element().scale(1, 0.12, easeInOutCubic),
  elementGlow().opacity(effects.glowOpacity, 0.1),
);
```

#### 2B. Overshoot + Settle (premium UI emphasis)
```typescript
// Imports: easeOutBack, easeInOutCubic from '@revideo/core'

yield* element().scale(1.1, 0.15, easeOutBack);     // overshoot
yield* element().scale(1.0, 0.12, easeInOutCubic);  // settle
```

#### 2C. Focus-Pull Emphasis (wrapper-camera emphasis)
```typescript
// Imports: createRef, all, easeInOutCubic from '@revideo/core'

const heroPos = heroElement().position();
yield* all(
  world().position(heroPos.scale(-1), 1.2, easeInOutCubic),
  world().scale(2, 1.2, easeInOutCubic),
);
yield* waitFor(0.3);  // hold for audience to read
yield* all(
  world().position(0, 0.6, easeInOutCubic),
  world().scale(1, 0.6, easeInOutCubic),
);
```

### Family 3: Secondary Motion Patterns

#### 3A. Glow Follow-Through (lags shape by 50ms)
```typescript
// Imports: all, delay, easeOutCubic from '@revideo/core'

yield* all(
  hero().scale(1, 0.2, easeOutCubic),
  delay(0.05, heroGlow().opacity(0.8, 0.15)),
  delay(0.08, heroGlow().scale(1.2, 0.18)),
);
```

#### 3B. Particle Trail (arrives after parent lands)
```typescript
// Imports: all, delay, sequence from '@revideo/core'

yield* all(
  hero().y(0, 0.25, easeOutCubic),
  delay(0.1, sequence(0.04, ...trailParticles.map(p =>
    all(p.opacity(0.6, 0.12), p.scale(1, 0.12))
  ))),
);
```

#### 3C. Settling Oscillation (small scale wobble using spring)
```typescript
// Imports: spring from '@revideo/core'

// After hero lands, small spring wobble — feels alive
const wobble = createSignal<number>(1);
hero().scale(() => wobble());
yield* spring({mass: 0.02, stiffness: 30, damping: 0.4, initialVelocity: 0.5},
              1, 1, v => wobble(v));
```

### Family 4: Transition Patterns

#### 4A. Wipe-Out Exit (mask closing)
```typescript
// Imports: easeInOutCubic from '@revideo/core'

yield* wipeMask().size([0, 200], 0.4, easeInOutCubic);  // collapse mask
```

#### 4B. Push-Out (element exits with glow follow-through)
```typescript
// Imports: all, delay, easeInCubic from '@revideo/core'

yield* all(
  element().y(-1200, 0.3, easeInCubic),        // off-screen up
  element().opacity(0, 0.3),
  delay(0.08, elementGlow().opacity(0, 0.2)),  // glow trails behind
);
```

#### 4C. Crossfade with Color Shift
```typescript
// Imports: all from '@revideo/core'

yield* all(
  oldElement().opacity(0, 0.2),
  newElement().opacity(1, 0.2),
  bgGradient().fill(nextSceneAccentColor, 0.3),  // color motivation
);
```

#### 4D. Matched-Cut Handoff
```typescript
// Imports: useScene, waitFor from '@revideo/core'

// At END of scene N
useScene().variables.set('matchedCut', {
  anchor: 'heroBox',
  position: heroBox().position(),
  scale: heroBox().scale(),
  rotation: heroBox().rotation(),
});
yield* waitFor(0.2);  // hold so cut feels deliberate

// At START of scene N+1
const entry = useScene().variables.get('matchedCut', null)();
const hero = createRef<Rect>();
view.add(<Rect ref={hero} position={entry?.position ?? 0}
                scale={entry?.scale ?? 1} ... />);
yield* hero().position([0, 0], 0.4, easeInOutCubic);
```

### Family 5: Wrapper-Camera Moves

> **CRITICAL**: There is NO `Camera` component in Revideo. All camera moves use a wrapper `<Layout ref={world}>` animated via its transform.

#### 5A. Push-In (zoom on hero)
```typescript
// Imports: createRef, easeInOutCubic from '@revideo/core'; Layout from '@revideo/2d'

const world = createRef<Layout>();

view.add(
  <Layout ref={world} size={[1920, 1080]}>
    {/* scene content */}
  </Layout>
);

// Land on hero word during VO emphasis
yield* world().scale(1.8, 1.2, easeInOutCubic);
yield* waitFor(0.3);  // hold
yield* world().scale(1, 0.6, easeInOutCubic);  // pull back
```

#### 5B. Reveal Pull-Out
```typescript
// Imports: all, easeInOutCubic from '@revideo/core'

// Start zoomed in (set in JSX), pull out to reveal context
view.add(<Layout ref={world} scale={1.8}>...</Layout>);

yield* world().scale(1, 1.5, easeInOutCubic);
```

#### 5C. Focus-Pull Between Two Elements
```typescript
// Imports: all, easeInOutCubic from '@revideo/core'

// Pull to first element
yield* all(
  world().position(firstEl().position().scale(-1), 1.2, easeInOutCubic),
  world().scale(1.6, 1.2, easeInOutCubic),
);
yield* waitFor(0.4);
// Pull to second element
yield* world().position(secondEl().position().scale(-1), 1.2, easeInOutCubic);
```

---

## Motion Design Decision Framework

Apply these IF-THEN rules BEFORE writing each animation. The rules read `brand-identity.json → motion_design` block to pick easing, transition, camera per situation.

### Entrance of HERO Element

```
IF motion_design.easing_personality.spring_config != 'none':
  USE: Pattern 1C (Spring Drop)
ELIF motion_design.energy_curve in ['high', 'frenetic'] AND use_overshoot == true:
  USE: Pattern 1D (Anticipation Entrance) → easeOutBack
ELIF motion_design.transition_vocabulary.primary in ['wipe', 'slide']:
  USE: Pattern 1E (Mask-Wipe Entrance)
ELSE:
  USE: Pattern 1A (Beat-Driven Timeline) → easeOutCubic
```

### Section Transition WITHIN a Scene

```
IF motion_design.transition_vocabulary.section_change == 'wipe':
  USE: Pattern 1E or Pattern 4A (compositeOperation mask)
ELIF .section_change == 'fade':
  USE: Pattern 4C (crossfade — optionally with color shift)
ELIF .section_change == 'slide':
  USE: position animation with easeInOutCubic
ELIF .section_change == 'glitch':
  USE: rapid opacity/RGB-shift custom (see lib/transitions.ts)
ELSE:
  USE: fade transition (safe default)
```

### VO Emphasis Word

```
IF motion_design.camera_personality.static == false:
  USE: Pattern 5A (Push-In) — land on emphasis syllable
ELIF .use_overshoot == true:
  USE: Pattern 2B (Overshoot + Settle) on the emphasized element
ELSE:
  USE: Pattern 2A (Pulse) — scale 1.08 + glow flash
```

### Scene-to-Scene Transition

```
IF motion_design.transition_vocabulary.matched_cut_friendly == true:
  USE: Pattern 4D (Matched-Cut Handoff) with useScene().variables
ELIF .scene_change == 'fade':
  USE: fadeTransition(0.6) at top of scene
ELIF .scene_change == 'slide':
  USE: slideTransition(Direction.Left, 0.6)
ELIF .scene_change == 'zoomIn':
  USE: zoomInTransition(0.6)
ELIF .scene_change == 'zoomOut':
  USE: zoomOutTransition(0.6)
ELSE:
  USE: fadeTransition(0.6)  // safe default
```

### Ambient Idle Moment (>0.5s without primary motion)

```
IF motion_design.secondary_motion.ambient_particle_density == 'rich':
  ADD: 8-12 floating particles with sequence-staggered drift
ELIF .ambient_particle_density == 'moderate':
  ADD: 3-5 floating particles
ELIF .ambient_particle_density == 'sparse':
  ADD: 1-2 slow-drifting glow orbs
ELSE:
  HOLD with subtle hero-glow breathing animation
```

### Hero Glow Strategy

```
IF motion_design.secondary_motion.follow_through == true:
  USE: Pattern 3A (Glow Follow-Through) — glow lags shape by 0.05s
ELSE:
  USE: Pattern 1A (synchronous glow+shape)
```

### Easing Diversity Check (per scene)

```
COUNT distinct easing functions used in scene.
IF count < 4:
  ADD variety — use motion_design.easing_personality.secondary for non-hero animations.
COMPUTE max single-easing-share (occurrences / total).
IF share > 50%:
  REASSIGN some animations to secondary easing until share drops below 50%.
```

---

## Wiring SFX from sfx-manifest.json

If the project has a `sfx-manifest.json` (output of `scripts/generate_sfx.py`), the agent MUST wire `<Audio>` components into each scene that has SFX entries.

### File Convention

- Manifest location: `src/sfx-manifest.json` (project-relative)
- Audio files: `src/sfx/{scene}/{id}_{name}.mp3`

### Pattern: Auto-Wire from Manifest

```typescript
// Top of scene file
import {Audio, makeScene2D} from '@revideo/2d';
import sfxManifest from '../sfx-manifest.json';

export default makeScene2D('scene1', function* (view) {
  const sceneSfx = sfxManifest.scenes['scene1'] ?? [];

  view.add(
    <>
      {sceneSfx.map((s, i) => (
        <Audio
          key={`sfx-${s.id}`}
          src={s.file}
          play={true}
          time={s.start_offset_seconds}
          volume={s.volume ?? 1}
        />
      ))}
      {/* rest of scene content */}
    </>,
  );

  // animations...
});
```

### Pattern: Per-Beat SFX (for tight sync)

When the manifest entry's `anchor` is `beat_X`, align beats to manifest offsets:

```typescript
// SFX at beat_0 (start), beat_1 (after 0.3s), beat_2 (after 0.6s)
yield* all(
  hero().opacity(1, 0.15),
  hero().y(0, 0.2, easeOutCubic),
);  // beat_0 sound plays at scene start
yield* waitFor(0.1);  // ensures beat_1 sound aligns
```

### Volume Defaults by Layer

When the manifest entry omits `volume`:
- `layer: 'background'` → volume = 0.3
- `layer: 'ambient'` → volume = 0.4
- `layer: 'foreground'` → volume = 0.8
- `layer: 'accent'` → volume = 1.0

### Fallback (Manifest Missing)

If `sfx-manifest.json` does not exist, do NOT throw. Skip the import and audio block. Scene still renders without SFX. Add a comment: `// SFX manifest not present — silent scene.`

---

## Motion Helper Library Convention (v2)

Every new project MUST ship with `src/lib/motion-helpers.ts` alongside `src/lib/brand.ts`. This file contains 10 standardized helper functions that scenes import instead of re-implementing patterns inline. The helpers encode the craft details from `docs/technical-reference.md` Sections 30-34 (Typography, Lighting, Color, Composition, Audio Sync).

### Standard Helper Set

The agent MUST emit `motion-helpers.ts` with these 10 helpers:

```typescript
// 1. charStagger — sequential character/word reveal
export function* charStagger(
  chars: Reference<Txt>[] | Txt[],
  staggerDelay: number,
  charDuration: number,
  technique: 'opacity' | 'opacity-y' | 'opacity-scale' = 'opacity'
): ThreadGenerator;

// 2. multiLayerGlow — 3-layer glow stack entrance (inner sharp + mid + outer bloom)
export function* multiLayerGlow(
  glows: [Reference<Circle>, Reference<Circle>, Reference<Circle>],
  duration: number,
  peakOpacities: [number, number, number] = [0.12, 0.08, 0.04],
  staggerDelays: [number, number, number] = [0, 0.06, 0.12]
): ThreadGenerator;

// 3. countUpMetric — animate number text from 0 to target with easing
export function* countUpMetric(
  textRef: Reference<Txt>,
  target: number,
  duration: number,
  formatter?: (v: number) => string,
  easing?: TimingFunction
): ThreadGenerator;

// 4. emphasisPulse — color/scale/weight pulse without overshoot
export function* emphasisPulse(
  node: Reference<Txt> | Reference<Rect>,
  technique: 'color' | 'scale' | 'weight' | 'tracking',
  accentColor?: string,
  intensity?: number
): ThreadGenerator;

// 5. rimLight — directional key light positioned at 1/3 offset
export function rimLight(
  color: string,
  blur: number,
  intensity: number,
  position?: 'TR' | 'TL' | 'BR' | 'BL'
): JSX.Element;  // returns a Circle node for view.add

// 6. alignToBeat — wait until next beat in beatGrid (audio sync)
export function* alignToBeat(
  beatGrid: BeatGrid,
  targetIndex: number,
  currentTime: { value: number }
): ThreadGenerator;

// 7. asymmetricPosition — rule-of-thirds positioning helper
export function asymmetricPosition(
  zone: 'TL' | 'TR' | 'BL' | 'BR' | 'centerLeft' | 'centerRight' | 'topMiddle' | 'bottomMiddle',
  layout: { width: number; height: number }
): [number, number];

// 8. computeStagger — parameterized stagger replacing hard-coded delays
export function computeStagger(
  count: number,
  totalSpan: number,
  distribution: 'linear' | 'wave' | 'exponential' | 'cascade'
): number[];

// 9. cinematicFade — fade with subtle blur (atmospheric haze)
export function* cinematicFade(
  target: Reference<Node>,
  fadeIn: boolean,
  duration: number,
  hazeBlur?: number
): ThreadGenerator;

// 10. breathHold — enforced negative-space pause (composition discipline)
export function* breathHold(durationFromBrand?: number): ThreadGenerator;
```

### Implementation Skeleton

The agent emits this concrete implementation in each new project:

```typescript
// src/lib/motion-helpers.ts
import {Txt, Circle, Rect, Node, Layout} from '@revideo/2d';
import {
  all, delay, sequence, waitFor, tween,
  Reference, ThreadGenerator,
  easeInOutCubic, easeOutCubic, easeOutQuint, easeOutQuart, easeOutBack, linear,
  TimingFunction,
} from '@revideo/core';
import {colors, timing, layout, OrganicSpring, composition} from './brand';

export interface BeatGridEntry {
  time: number;
  layer: 'foreground' | 'background' | 'accent' | 'ambient';
  category: string;
  duration: number;
}

export type BeatGrid = BeatGridEntry[];

// charStagger — opacity-y is the most common premium technique
export function* charStagger(
  chars: Array<Reference<Txt>>,
  staggerDelay = 0.06,
  charDuration = 0.2,
  technique: 'opacity' | 'opacity-y' | 'opacity-scale' = 'opacity-y',
): ThreadGenerator {
  const gens = chars.map(c => {
    if (technique === 'opacity-y') {
      return all(c().opacity(1, charDuration, easeOutCubic), c().y(0, charDuration, easeOutCubic));
    }
    if (technique === 'opacity-scale') {
      c().scale(0.7);
      return all(c().opacity(1, charDuration, easeOutBack), c().scale(1, charDuration, easeOutBack));
    }
    return c().opacity(1, charDuration, easeOutCubic);
  });
  yield* sequence(staggerDelay, ...(gens as ThreadGenerator[]));
}

export function* multiLayerGlow(
  glows: [Reference<Circle>, Reference<Circle>, Reference<Circle>],
  duration = 0.5,
  peakOpacities: [number, number, number] = [0.12, 0.08, 0.04],
  staggerDelays: [number, number, number] = [0, 0.06, 0.12],
): ThreadGenerator {
  // Outer first (atmospheric haze), then mid (bloom), then inner (sharp)
  yield* all(
    delay(staggerDelays[2], glows[2]().opacity(peakOpacities[2], duration, easeOutCubic)),
    delay(staggerDelays[1], glows[1]().opacity(peakOpacities[1], duration * 0.85, easeOutCubic)),
    delay(staggerDelays[0], glows[0]().opacity(peakOpacities[0], duration * 0.7, easeOutCubic)),
  );
}

export function* countUpMetric(
  textRef: Reference<Txt>,
  target: number,
  duration = 0.8,
  formatter: (v: number) => string = (v) => Math.round(v).toString(),
  easing: TimingFunction = easeOutQuint,
): ThreadGenerator {
  yield* tween(duration, (t) => {
    const value = target * easing(t);
    textRef().text(formatter(value));
  });
  textRef().text(formatter(target));  // ensure final value is exact
}

export function* emphasisPulse(
  node: Reference<Txt>,
  technique: 'color' | 'scale' | 'weight' | 'tracking',
  accentColor: string = colors.accent,
  intensity = 1,
): ThreadGenerator {
  switch (technique) {
    case 'color':
      yield* node().fill(accentColor, 0.1, easeOutCubic);
      yield* node().fill(colors.primary, 0.25, easeInOutCubic);
      break;
    case 'scale':
      yield* node().scale(1 + 0.08 * intensity, 0.12, easeOutCubic);
      yield* node().scale(1, 0.18, easeInOutCubic);
      break;
    case 'weight':
      yield* node().fontWeight(500 + 200 * intensity, 0.15, easeOutCubic);
      yield* node().fontWeight(500, 0.25, easeInOutCubic);
      break;
    case 'tracking':
      const baseTracking = node().letterSpacing();
      yield* node().letterSpacing(baseTracking - 2 * intensity, 0.2, easeOutCubic);
      yield* node().letterSpacing(baseTracking, 0.3, easeInOutCubic);
      break;
  }
}

export function rimLight(
  color = colors.accent,
  blurAmount = 80,
  intensity = 0.4,
  position: 'TR' | 'TL' | 'BR' | 'BL' = 'TR',
) {
  const positions = {
    TR: [layout.width / 3, -layout.height / 3],
    TL: [-layout.width / 3, -layout.height / 3],
    BR: [layout.width / 3, layout.height / 3],
    BL: [-layout.width / 3, layout.height / 3],
  } as const;
  const [x, y] = positions[position];
  return (
    <Circle
      size={400}
      x={x}
      y={y}
      fill={color}
      opacity={intensity}
      filters={[blur(blurAmount) as any]}
    />
  );
}

export function* alignToBeat(
  beatGrid: BeatGrid,
  targetIndex: number,
  currentTime: { value: number },
): ThreadGenerator {
  const target = beatGrid[targetIndex]?.time;
  if (target === undefined) return;
  const delta = target - currentTime.value;
  if (delta > 0) {
    yield* waitFor(delta);
    currentTime.value = target;
  }
}

export function asymmetricPosition(
  zone: 'TL' | 'TR' | 'BL' | 'BR' | 'centerLeft' | 'centerRight' | 'topMiddle' | 'bottomMiddle',
): [number, number] {
  const tX = layout.width / 3;
  const tY = layout.height / 3;
  switch (zone) {
    case 'TL': return [-tX, -tY];
    case 'TR': return [tX, -tY];
    case 'BL': return [-tX, tY];
    case 'BR': return [tX, tY];
    case 'centerLeft': return [-tX, 0];
    case 'centerRight': return [tX, 0];
    case 'topMiddle': return [0, -tY];
    case 'bottomMiddle': return [0, tY];
  }
}

export function computeStagger(
  count: number,
  totalSpan: number,
  distribution: 'linear' | 'wave' | 'exponential' | 'cascade',
): number[] {
  if (count <= 1) return [0];
  return Array.from({length: count}, (_, i) => {
    const t = i / (count - 1);
    switch (distribution) {
      case 'linear': return totalSpan * t;
      case 'wave': return totalSpan * (t - 0.5 * Math.sin(2 * Math.PI * t) / (2 * Math.PI));
      case 'exponential': return totalSpan * Math.pow(t, 1.6);
      case 'cascade': return totalSpan * (Math.pow(2, t * 4) - 1) / 15;
    }
  });
}

export function* cinematicFade(
  target: Reference<Node>,
  fadeIn: boolean,
  duration = 0.5,
  hazeBlur = 8,
): ThreadGenerator {
  if (fadeIn) {
    target().filters([blur(hazeBlur) as any]);
    yield* all(
      target().opacity(1, duration, easeInOutCubic),
      target().filters([blur(0) as any], duration, easeInOutCubic) as any,
    );
  } else {
    yield* all(
      target().opacity(0, duration, easeInOutCubic),
      target().filters([blur(hazeBlur) as any], duration, easeInOutCubic) as any,
    );
  }
}

export function* breathHold(durationFromBrand = timing.hold): ThreadGenerator {
  yield* waitFor(durationFromBrand);
}
```

### When to Use Each Helper

The agent's Decision Framework references these helpers explicitly:

| Situation | Use Helper |
|---|---|
| Hero text entrance | `charStagger(chars, 0.06, 0.2, 'opacity-y')` |
| Hero shape entrance | `multiLayerGlow(glows, ...)` + `spring()` for shape |
| Data metric reveal | `countUpMetric(metric, target, 0.8)` |
| Word emphasis on VO peak | `emphasisPulse(word, 'color' or 'tracking')` |
| Adding directional light | `rimLight(accentColor, 80, 0.4, 'TR')` |
| Audio-driven beat sync | `alignToBeat(beatGrid, idx, currentTime)` before each section |
| Hero positioning | `asymmetricPosition('TR')` instead of `[0, -200]` |
| Replacing hard-coded delays | `computeStagger(8, 1.2, 'wave')` |
| Scene transitions with depth | `cinematicFade(target, true, 0.6, 8)` |
| After dense moments | `yield* breathHold()` for calm pacing |

### Anti-Pattern Watchlist

- DO NOT re-implement these helpers inline in scenes — always import from `./lib/motion-helpers`
- DO NOT skip `motion-helpers.ts` for "simple" projects — it's mandatory
- DO NOT hard-code stagger delays (`delay(0.15, ...)`) when `computeStagger()` works

---

## Critical Learnings & Error Prevention

> **AGENT INSTRUCTION:** Apply ALL of these patterns automatically. Never generate code that violates these rules.

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
fill={'transparent'}

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
// From @revideo/2d - Components AND filters
import { makeScene2D } from '@revideo/2d';
import {
  Rect, Node, Line, Circle, Path, Txt, Layout, Audio,
  blur, brightness, contrast, dropShadow,
} from '@revideo/2d';
// NOTE: There is NO Camera component in Revideo. Use wrapper <Layout> for camera moves.

// From @revideo/core - Animation utilities, springs, transitions, types
import {
  // Flow control
  all, chain, delay, sequence, waitFor, spawn, loop,

  // Refs and signals
  createRef, createRefArray, createSignal,

  // Easings
  easeOutCubic, easeInCubic, easeInOutCubic,
  easeOutQuart, easeOutExpo, easeOutBack,
  easeInQuart, easeOutQuint, easeInOutQuart,
  easeOutElastic, easeOutSine, easeInOutSine,
  linear,

  // Spring physics (use named configs from lib/brand.ts: LogoLandSpring, UISpring, OrganicSpring)
  spring, PlopSpring, SmoothSpring,

  // Scene transitions
  slideTransition, fadeTransition,
  zoomInTransition, zoomOutTransition,
  waitTransition, useTransition,
  Direction, finishScene,

  // Scene variables (for matched cuts)
  useScene,

  // Types
  SimpleSignal,
  ThreadGenerator,
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

### 8. Signal Type Annotation (CRITICAL)

```typescript
// ❌ WRONG - Returns unknown type, causes JSX errors
const mySignal = createSignal(0);

// ✅ CORRECT - Explicit type parameter
const mySignal = createSignal<number>(0);
const myString = createSignal<string>('');
```

**Rule:** ALWAYS include `<number>` or appropriate type with `createSignal()`.

### 9. Signal Array Type Declaration (CRITICAL)

```typescript
// ❌ WRONG - Returns unknown type
const positions: ReturnType<typeof createSignal>[] = [];

// ✅ CORRECT - Use SimpleSignal type
import { SimpleSignal } from '@revideo/core';
const positions: SimpleSignal<number>[] = [];
```

**Rule:** Use `SimpleSignal<number>[]` for arrays of signals, never `ReturnType`.

### 10. RefArray Access Patterns (CRITICAL)

```typescript
const dots = createRefArray<Circle>();

// ❌ WRONG - dot is already the node in .map()
dots.map(dot => dot().opacity(1))

// ✅ CORRECT - no parentheses
dots.map(dot => dot.opacity(1))

// ❌ WRONG - layers[0] is already the node
layers[0]().scale(1.5)

// ✅ CORRECT - no parentheses after index
layers[0].scale(1.5)
```

**Summary Table:**
| Type | Access Pattern | Example |
|------|----------------|---------|
| `createRef<T>()` | Callable - use `()` | `myRef().opacity(1)` |
| `createRefArray<T>()` | Direct access - NO `()` | `myArray[i].opacity(1)` |
| `createRefArray<T>()` in `.map()` | Direct access - NO `()` | `arr.map(el => el.opacity(1))` |

### 11. Generator Type for Animation Arrays

```typescript
// ❌ WRONG - Type error with all()
const animations: Generator[] = [];
yield* all(...animations);

// ✅ CORRECT - Use ThreadGenerator or any[]
import { ThreadGenerator } from '@revideo/core';
const animations: ThreadGenerator[] = [];
// OR
const animations: any[] = [];
```

### 12. JSX Lambda Array Safety (CRITICAL - RUNTIME)

```typescript
// ❌ WRONG - Crashes if signal undefined
{Array.from({ length: COUNT }).map((_, i) => (
  <Node
    x={() => posX[i]()}
    y={() => posY[i]()}
    scale={() => scaleArr[i]() * pulseArr[i]()}
  />
))}

// ✅ CORRECT - Always add null checks
{Array.from({ length: COUNT }).map((_, i) => (
  <Node
    x={() => posX[i] ? posX[i]() : 0}
    y={() => posY[i] ? posY[i]() : 0}
    scale={() => (scaleArr[i] ? scaleArr[i]() : 0) * (pulseArr[i] ? pulseArr[i]() : 1)}
  />
))}
```

**Rule:** EVERY signal array access in JSX must have null check with fallback.

### 13. Object Property Safety (CRITICAL - RUNTIME)

```typescript
// ❌ WRONG - Crashes if zone undefined
const zone = ZONES[idx % ZONES.length];
const x = zone.x + offset;
const r = zone.radius * 0.5;

// ✅ CORRECT - Guard clause + nullish coalescing
const zone = ZONES[idx % ZONES.length];
if (!zone) continue;  // or return
const x = (zone.x ?? 0) + offset;
const r = (zone.radius ?? 100) * 0.5;
```

**Rule:** Check object existence before property access, use `??` for fallbacks.

### 14. Array Size Must Match Total Usage (CRITICAL - RUNTIME)

```typescript
// ❌ WRONG - Array too small for total spawns
const DOT_COUNT = 250;
const wave1 = 50;   // indices 0-49
const wave2 = 80;   // indices 50-129
const wave3 = 100;  // indices 130-229
const wave4 = 50;   // indices 230-279 ← EXCEEDS 250!

// ✅ CORRECT - Calculate total FIRST
const wave1 = 50, wave2 = 80, wave3 = 100, wave4 = 50;
const DOT_COUNT = wave1 + wave2 + wave3 + wave4; // = 280
```

**Rule:** Before setting array size constants, calculate the sum of all elements that will be added.

### 15. Helper Function Bounds Checking (CRITICAL - RUNTIME)

```typescript
// ❌ WRONG - No bounds check
function* spawnDot(index: number, x: number, y: number) {
  dotX[index](x);  // Crashes if index >= DOT_COUNT
  dotY[index](y);
}

// ✅ CORRECT - Guard at function start
function* spawnDot(index: number, x: number, y: number) {
  if (index < 0 || index >= DOT_COUNT || !dotX[index]) return;
  dotX[index](x);
  dotY[index](y);
}
```

**Rule:** Every function accessing arrays by index must validate bounds first.

### 16. Loop Array Access Safety (CRITICAL - RUNTIME)

```typescript
// ❌ WRONG - activeDotCount may exceed array size
for (let i = 0; i < activeDotCount; i++) {
  const x = dotX[i]();  // Crashes when i >= DOT_COUNT
}

// ✅ CORRECT - Clamp to array size
const maxDots = Math.min(activeDotCount, DOT_COUNT);
for (let i = 0; i < maxDots; i++) {
  if (!dotX[i]) continue;
  const x = dotX[i]();
}
```

**Rule:** Use `Math.min(counter, ARRAY_SIZE)` when counter can grow independently.

---

## Quality Iteration Loop (Scoring Rubric v2)

The agent self-assesses the generated scene against an expanded 17-metric rubric. Target score: **≥ 15.0 / 18.0** for "stunning" (was ≥9.0/12.0 in v1). Iterate until met.

### Hard Checklist (Gate — All Must Pass; Regenerate if Any Fail)

- [ ] All 16 error-prevention rules pass
- [ ] Scene name (first arg of `makeScene2D`) matches file name
- [ ] All imports are USED in the file; no unused imports
- [ ] No unused refs (every `createRef`/`createRefArray` is referenced in JSX AND animated)
- [ ] Scene duration meets the script's stated length
- [ ] At least one visual beat per `motion_design.pace.average_beat_duration` seconds on average
- [ ] **v2**: `lib/motion-helpers.ts` exists and is imported (not re-implemented inline)

### Weighted Metrics (Drive Iteration Toward Score ≥ 15.0)

**v1 Compliance Metrics (keep all 11):**

| Metric | Weight | How to Measure | Pass Threshold |
|---|---|---|---|
| Easing diversity | 1.0 | distinct easing fns / total animations | ≥4 distinct AND no single easing >50% |
| Spring usage | 1.0 | `spring()` calls present | ≥1 per scene (unless brand says spring_config='none') |
| Secondary motion | 1.5 | `delay()` calls inside `all()` blocks | ≥3 per major beat block |
| Anticipation/overshoot on hero | 1.0 | hero entrance uses pre-scale-down OR easeOutBack | ≥1 hero per scene |
| Transition variety | 1.0 | non-hardcut transition between scenes | ≥1 non-hardcut per video |
| Mask/wipe usage | 1.0 | `compositeOperation` OR custom `useTransition` | ≥1 per video (unless brand explicitly excludes) |
| Virtual camera (wrapper Layout) | 1.5 | `<Layout ref={world}>` with animated transform | ≥1 move per video (unless camera.static==true) |
| Hierarchy timing | 1.0 | `sequence()` with stagger OR delay()-based cascade | ≥2 instances per scene |
| Animation density | 0.5 | parallel animations inside `all()` | 3-6 per `all()` block (above 8 deducts) |
| Visual density (glow per hero/text) | 0.5 | blur-filtered glow layers behind heroes and text | ≥1 glow per hero element |
| Beat fidelity | 1.0 | animations land on the brand's beat grid | ≥90% of beats on grid |

**v2 Craft Metrics (6 new):**

| Metric | Weight | How to Measure | Pass Threshold |
|---|---|---|---|
| **Typography craft** | 1.5 | `charStagger` used for hero text; OR `fontWeight` animated; OR `countUpMetric` for numbers; OR letter-spacing animated | ≥1 technique per scene (unless brand.text_entrance == 'opacity-fade' only) |
| **Color animation** | 1.0 | At least one `.fill()` animated mid-scene OR gradient mesh used OR `saturate()` filter animated | ≥1 meaningful color event per scene |
| **Composition discipline** | 1.0 | At least one hero uses `asymmetricPosition()` (NOT centered); rule-of-thirds verified | ≥1 hero off-center per scene |
| **Narrative progression** | 1.0 | Scene comments label setup → rising → peak → resolution beats | ≥3 distinct narrative beats labeled |
| **Micro-timing precision** | 1.0 | Delays computed via `computeStagger`/`alignToBeat`, NOT hard-coded | <5 hard-coded `delay(N, ...)` per scene |
| **Audio-motion sync** | 1.0 | Scene imports `sfx-manifest.json` AND references `beatGrid` in at least one `alignToBeat` OR `waitFor(beat.time)` | manifest imported AND used (or brand says silent) |

### Score = sum(weight × pass_value), max = 18.0

- pass_value = 1.0 if metric fully met
- pass_value = 0.5 if partially met (used once where 3 expected; or cosmetic vs. substantive)
- pass_value = 0.0 if not met

**Quality Tiers:**
- ≥15.0 → "Stunning" (HQ agency-tier target — commit-ready)
- 12.0–14.9 → "Strong" (broadcast/marketing-tier — needs polish)
- 9.0–11.9 → "Functional" (v1 baseline — competent but not stunning)
- <9.0 → "Generic" (must regenerate)

### Iteration Rule

If score < 15.0:
1. Identify the lowest-scoring metric.
2. Fix THAT metric specifically — prefer adding a single v2 craft technique over inflating v1 compliance metrics.
3. Do NOT add more glow layers if the deficit is in typography craft or color animation.
4. Re-score and repeat — max 1 iteration in the v2 commit cycle (diminishing returns).

### Anti-Gaming Rules (v2 expanded)

- **Spring usage** requires `spring()` to drive a HERO element's primary entrance. Decorative-only spring = partial credit.
- **Typography craft** requires `charStagger` AND at least one of (`countUpMetric`, font-weight animation, tracking animation). Single technique = 0.5 partial credit.
- **Multi-layer glow** requires 3 distinct Circle refs with DIFFERENT blur radii (e.g., 20/60/120). Three identical glow Circles = 0.5 partial credit.
- **Audio-motion sync** requires `beatGrid` actually used in an `alignToBeat` or `waitFor` call. Importing manifest without using `beatGrid` references = 0.0 credit.
- **Composition discipline** requires `asymmetricPosition()` used on a HERO element, not just on decorative particles.
- **Color animation** requires the color change to be MEANINGFUL — tied to VO emphasis, data semantics, or section transition. Random rainbow-cycling = 0.5 partial credit.

---

## Common Errors & Solutions

### Compile-Time Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module '../lib/brand'` | brand.ts in wrong location | Move to `src/lib/brand.ts` |
| `'radius' does not exist in type 'Filter'` | Object syntax for filters | Use `blur(20)` function |
| `unknown format: transparent` | String "transparent" for colors | Use `fill={null}` instead |
| `Duplicated node key` | Keys not unique in nested loops | Include ALL loop indices: `key={\`group-${i}-item-${j}\`}` |
| Scene not loading | Missing `?scene` suffix | Add `?scene` to imports |
| Animations not playing | Missing `yield*` | Always use `yield*` for animations |
| `'() => unknown' not assignable to 'SignalValue<number>'` | Missing type on createSignal | Use `createSignal<number>(0)` |
| `Type 'Generator[]' not assignable to 'ThreadGenerator'` | Wrong array type for animations | Use `ThreadGenerator[]` or `any[]` |
| `spring is not a function` | Missing `spring` import from `@revideo/core` | Add `spring, PlopSpring, SmoothSpring` to imports |
| `Cannot find name 'Camera'` | Tried to import Camera from `@revideo/2d` (doesn't exist) | Use wrapper `<Layout ref={world}>` and animate `world().scale/position` |
| Transition not firing | Yield ordering wrong — animation yielded before transition | Transition generator must yield FIRST: `yield* fadeTransition(0.6); yield* animation();` |
| Masked node invisible | Parent missing `cache` prop | Add `cache` and `cachePadding` to parent Node holding compositeOperation children |

### Runtime Errors (CRITICAL - Prevent These)

| Error | Cause | Fix |
|-------|-------|-----|
| `arr[i] is not a function` | Signal array element undefined | Add null check: `arr[i] ? arr[i]() : 0` |
| `undefined is not an object (evaluating 'obj.prop')` | Object doesn't exist | Add guard: `if (!obj) return;` + use `obj?.prop ?? fallback` |
| `Cannot read property 'x' of undefined` | Array index out of bounds | Add bounds check: `if (i >= ARRAY_SIZE) return;` |
| Index out of bounds in loop | Counter exceeds array size | Use `Math.min(counter, ARRAY_SIZE)` |
| Random crashes during animation | Missing null checks in JSX lambdas | Always use ternary: `() => arr[i] ? arr[i]() : 0` |

### Runtime Error Prevention Checklist

Before finalizing any scene, verify:

- [ ] All `createSignal()` calls have explicit type: `createSignal<number>()`
- [ ] All signal arrays use `SimpleSignal<number>[]` type
- [ ] All JSX lambdas with array access have null checks
- [ ] All helper functions check bounds before array access
- [ ] All loops use `Math.min()` to clamp to array size
- [ ] All object property access uses optional chaining (`?.`) or guards
- [ ] Array size constants are >= sum of all elements that will be added

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
