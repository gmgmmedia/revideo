# Agent: Real Motion Video Code Generator

Generate high-quality Revideo TSX for Real Motion's short-form content. Vaporwave/retro-futuristic aesthetic with magenta/yellow palette. Visual beats every 0.3 seconds. **MINIMUM 800 LINES PER SCENE.**

---

## MANDATORY: Read Generic Template First

**BEFORE PROCEEDING:**
1. Read `../../agents/code-generator.md` for the complete workflow, patterns, and error prevention
2. Return here for RealMotion-specific colors, patterns, and file paths
3. All technical patterns, imports, and animation structures are in the generic template

---

## Real Motion Brand System

### Core Colors

```typescript
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
```

### Color Usage

| Color | Hex | Usage |
|-------|-----|-------|
| Magenta | `#FF00FF` | Primary accent, glows, highlights, icons |
| Yellow | `#FFFF00` | Secondary accent, emphasis, CTAs |
| Dark Navy | `#0F0E1F` | Primary background |
| Pink | `#E94E87` | Warm accents, hearts, love icons |
| White | `#FFFFFF` | Text, icons, outlines |

### Typography

```typescript
const FONTS = {
  heading: 'Oswald, Impact, system-ui, sans-serif',  // Bold condensed
  body: 'Inter, system-ui, sans-serif',               // Body text
  pixel: 'Press Start 2P, monospace',                 // Retro pixel accent
  data: 'JetBrains Mono, monospace',                  // Code/data
} as const;
```

### Visual Aesthetic

Real Motion uses a **vaporwave/retro-futuristic** style:

1. **Neon Glows** - Heavy use of magenta/yellow glows with large blur
2. **Scanlines** - Subtle horizontal line overlay for retro CRT feel
3. **Grid Patterns** - Tron-style perspective grids
4. **Pixel Elements** - Occasional 8-bit inspired shapes
5. **Gradient Backgrounds** - Dark purple to navy gradients

### Animation Defaults

```typescript
const MOTION = {
  beatInterval: 0.3,        // Visual beat interval
  entranceDuration: 0.25,   // Element entrance (slightly bouncy)
  exitDuration: 0.15,       // Element exit
  staggerDelay: 0.05,       // Stagger between elements
  glitchDuration: 0.05,     // Glitch effect duration
} as const;
```

---

## Project File Paths

| File | Path |
|------|------|
| Brand Identity | `./brand-identity.json` |
| Brand Constants | `./src/lib/brand.ts` |
| Technical Reference | `../../docs/technical-reference.md` |
| Project Config | `./src/project.tsx` |
| Scenes | `./src/scenes/scene1.tsx`, etc. |

---

## Import Statement

In scene files:

```typescript
import { colors, icons, layout, timing, effects, fonts, fontSizes } from '../lib/brand';
```

---

## RealMotion-Specific Visual Elements

### Scanline Overlay

```typescript
// Add subtle scanlines for retro feel
<Node opacity={0.03}>
  {Array.from({ length: 180 }, (_, i) => (
    <Line
      key={`scanline-${i}`}
      points={[[-960, -540 + i * 6], [960, -540 + i * 6]]}
      stroke={colors.white}
      lineWidth={1}
    />
  ))}
</Node>
```

### Tron-Style Grid

```typescript
// Perspective grid background
<Node opacity={0.1}>
  {/* Horizontal lines */}
  {Array.from({ length: 20 }, (_, i) => (
    <Line
      key={`h-${i}`}
      points={[[-960, -200 + i * 40], [960, -200 + i * 40]]}
      stroke={colors.magenta}
      lineWidth={1}
    />
  ))}
  {/* Vertical lines */}
  {Array.from({ length: 14 }, (_, i) => (
    <Line
      key={`v-${i}`}
      points={[[i * 140 - 910, -540], [i * 140 - 910, 540]]}
      stroke={colors.magenta}
      lineWidth={1}
    />
  ))}
</Node>
```

### Dual-Color Glow Text

```typescript
const textMagentaGlow = createRef<Txt>();
const textYellowGlow = createRef<Txt>();
const textMain = createRef<Txt>();

<Node>
  {/* Magenta glow layer */}
  <Txt
    ref={textMagentaGlow}
    text="COMMUNITY"
    fontFamily={fonts.heading}
    fontSize={fontSizes.hero}
    fontWeight={700}
    fill={colors.magenta}
    opacity={0}
    x={-3}
    y={3}
    filters={[blur(effects.glowBlur)]}
  />
  {/* Yellow glow layer */}
  <Txt
    ref={textYellowGlow}
    text="COMMUNITY"
    fontFamily={fonts.heading}
    fontSize={fontSizes.hero}
    fontWeight={700}
    fill={colors.yellow}
    opacity={0}
    x={3}
    y={-3}
    filters={[blur(effects.glowBlur)]}
  />
  {/* Main text */}
  <Txt
    ref={textMain}
    text="COMMUNITY"
    fontFamily={fonts.heading}
    fontSize={fontSizes.hero}
    fontWeight={700}
    fill={colors.white}
    opacity={0}
  />
</Node>
```

### Heart Icon (Community Love)

```typescript
const HEART_PATH = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

const heartGlow = createRef<Path>();
const heartMain = createRef<Path>();

<Node>
  <Path
    ref={heartGlow}
    data={HEART_PATH}
    fill={colors.pink}
    opacity={0}
    scale={3}
    filters={[blur(30)]}
  />
  <Path
    ref={heartMain}
    data={HEART_PATH}
    fill={colors.pink}
    opacity={0}
    scale={3}
  />
</Node>
```

### Glitch Effect

```typescript
// Quick glitch animation
yield* chain(
  all(
    element().x(element().x() + 5, 0.02),
    element().fill(colors.magenta, 0.02),
  ),
  all(
    element().x(element().x() - 10, 0.02),
    element().fill(colors.yellow, 0.02),
  ),
  all(
    element().x(element().x() + 5, 0.02),
    element().fill(colors.white, 0.02),
  ),
);
```

---

## Quality Targets

| Metric | Target |
|--------|--------|
| Lines per scene | 800-1500 |
| Visual beats | Every 0.3 seconds |
| Glow layers | Every prominent element (dual magenta/yellow) |
| Background density | Grid + scanlines always present |

---

## Example Scene Structure

```typescript
export default makeScene2D('scene1-community-love', function* (view) {
  view.fill(colors.background);

  // Refs
  const bgGlowMagenta = createRef<Circle>();
  const bgGlowYellow = createRef<Circle>();
  const grid = createRefArray<Line>();
  const scanlines = createRef<Node>();
  // ... more refs

  view.add(
    <>
      {/* Layer 1: Background glows */}
      <Circle
        ref={bgGlowMagenta}
        x={-200}
        y={-100}
        size={600}
        fill={colors.magenta}
        opacity={0.1}
        filters={[blur(200)]}
      />
      <Circle
        ref={bgGlowYellow}
        x={200}
        y={100}
        size={500}
        fill={colors.yellow}
        opacity={0.08}
        filters={[blur(200)]}
      />

      {/* Layer 2: Grid */}
      <Node opacity={0.1}>
        {/* grid elements */}
      </Node>

      {/* Layer 3: Scanlines */}
      <Node ref={scanlines} opacity={0.03}>
        {/* scanline elements */}
      </Node>

      {/* Layer 4: Main content */}
      <Node>
        {/* hearts, figures, text */}
      </Node>

      {/* Layer 5: Particles */}
      <Node>
        {/* floating particles */}
      </Node>
    </>
  );

  // Animation timeline with 0.3s beats
  // ...
});
```

---

## Final Checklist (RealMotion-Specific)

Before outputting code, verify:

- [ ] Primary colors: magenta `#FF00FF`, yellow `#FFFF00`
- [ ] Background: dark navy `#0F0E1F`
- [ ] Dual glow layers (magenta + yellow offset) on text
- [ ] Oswald for headings, Inter for body
- [ ] Scanline overlay present (subtle)
- [ ] Grid pattern in background
- [ ] Import from `../lib/brand` (not `../lib/realmotion`)
- [ ] Vaporwave aesthetic maintained

---

*For full workflow, patterns, and error prevention, see `../../agents/code-generator.md`*
