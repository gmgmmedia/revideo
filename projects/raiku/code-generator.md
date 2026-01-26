# Agent: Raiku Video Code Generator

Generate high-quality Revideo TSX for Raiku's short-form educational content. Optimized for TikTok-style attention spans with visual beats every 0.3 seconds.

---

## MANDATORY: Read Generic Template First

**BEFORE PROCEEDING:**
1. Read `../../agents/code-generator.md` for the complete workflow, patterns, and error prevention
2. Return here for Raiku-specific colors, patterns, and file paths
3. All technical patterns, imports, and animation structures are in the generic template

---

## Raiku Brand System

### Colors (THREE ONLY - NO EXCEPTIONS)

```typescript
const RAIKU = {
  neon: '#C0FF38',    // Primary accent, highlights, CTAs
  black: '#000204',   // Background, containers
  white: '#FDFDFF',   // Text, wireframes
} as const;
```

**Strict rule:** Only use these three colors. No grays, no variants, no exceptions.

### Color Usage

| Color | Hex | Usage |
|-------|-----|-------|
| Neon | `#C0FF38` | Accents, glows, highlights, CTAs, emphasis |
| Black | `#000204` | Background, containers, negative space |
| White | `#FDFDFF` | Text, wireframes, icons, outlines |

### Typography

```typescript
const FONTS = {
  heading: 'JetBrains Mono, monospace',  // Technical headings
  body: 'Inter, system-ui, sans-serif',   // Body text
  data: 'JetBrains Mono, monospace',      // Numbers, code, timestamps
} as const;
```

### Visual Patterns

Raiku uses these signature visual elements:

1. **Isometric Cubes** - 3D box representations for data/accounts
2. **Hexagonal Grids** - Background pattern for tech aesthetic
3. **Neon Glow Effects** - All accent elements have neon glow blur layers
4. **Warehouse Metaphor** - Solana accounts represented as boxes in a warehouse

### Animation Defaults

```typescript
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
import { RAIKU, colors, fonts, fontSizes, timing, effects, layout, cube } from '../lib/brand';
```

---

## Raiku-Specific Visual Elements

### Isometric Cube (Signature Element)

```typescript
// Create isometric cube with glow
const cubeGlow = createRef<Path>();
const cubeFill = createRef<Path>();

// Isometric cube path (adjust size by scaling)
const CUBE_PATH = "M0 -40 L70 0 L70 80 L0 120 L-70 80 L-70 0 Z M0 -40 L0 40 L70 80 M0 40 L-70 80";

<Node>
  {/* Glow layer */}
  <Path
    ref={cubeGlow}
    data={CUBE_PATH}
    stroke={colors.neon}
    lineWidth={3}
    opacity={0}
    filters={[blur(effects.glowBlurLarge)]}
  />
  {/* Main cube */}
  <Path
    ref={cubeFill}
    data={CUBE_PATH}
    stroke={colors.neon}
    lineWidth={2}
    opacity={0}
  />
</Node>
```

### Hexagon Grid Background

```typescript
const HEX_PATH = "M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z";

<Node opacity={0.1}>
  {Array.from({ length: 64 }, (_, i) => {
    const row = Math.floor(i / 8);
    const col = i % 8;
    const offsetX = (row % 2) * 60;
    return (
      <Path
        key={`hex-${i}`}
        data={HEX_PATH}
        x={col * 120 - 420 + offsetX}
        y={row * 104 - 364}
        stroke={colors.white}
        lineWidth={1}
        scale={0.3}
      />
    );
  })}
</Node>
```

### Neon Text with Glow

```typescript
const textGlow = createRef<Txt>();
const textMain = createRef<Txt>();

<Node>
  {/* Glow layer - behind */}
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
  {/* Main text - front */}
  <Txt
    ref={textMain}
    text="PARALLEL"
    fontFamily={fonts.heading}
    fontSize={fontSizes.hero}
    fontWeight={700}
    fill={colors.white}
    opacity={0}
  />
</Node>
```

---

## Quality Targets

| Metric | Target |
|--------|--------|
| Lines per scene | 800-1500 |
| Visual beats | Every 0.3 seconds |
| Glow layers | Every prominent element |
| Background density | Grid or particles always present |

---

## Example Scene Structure

```typescript
export default makeScene2D('scene1', function* (view) {
  view.fill(colors.background);

  // Refs
  const bgGlow = createRef<Circle>();
  const hexGrid = createRefArray<Path>();
  const mainCube = createRef<Node>();
  // ... more refs

  view.add(
    <>
      {/* Layer 1: Background glow */}
      <Circle
        ref={bgGlow}
        size={800}
        fill={colors.neon}
        opacity={0.03}
        filters={[blur(200)]}
      />

      {/* Layer 2: Hex grid */}
      <Node opacity={0.1}>
        {/* hex grid elements */}
      </Node>

      {/* Layer 3: Main content */}
      <Node ref={mainCube}>
        {/* cube with glow */}
      </Node>

      {/* Layer 4: Particles */}
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

## Final Checklist (Raiku-Specific)

Before outputting code, verify:

- [ ] Only THREE colors used: `#C0FF38`, `#000204`, `#FDFDFF`
- [ ] JetBrains Mono for headings and data
- [ ] Glow layers on all neon elements
- [ ] Isometric/warehouse visual metaphor maintained
- [ ] Import from `../lib/brand` (not `../lib/raiku`)
- [ ] Background elements present (hex grid, particles, glows)

---

*For full workflow, patterns, and error prevention, see `../../agents/code-generator.md`*
