# Technical Reference — Revideo/Motion Canvas API

> **CRITICAL: Import Mapping for Revideo**
> 
> This reference shows `@motion-canvas/*` imports. For Revideo, replace:
> - `@motion-canvas/core` → `@revideo/core`
> - `@motion-canvas/2d` → `@revideo/2d`
>
> **Scene Signature Difference:**
> - Motion Canvas: `makeScene2D(function* (view) {...})`
> - Revideo: `makeScene2D('sceneName', function* (view) {...})` — requires scene name string!

A complete technical reference for creating high-quality animations. This guide covers all available components, functions, properties, and APIs.

---

## Table of Contents

1. [Core Architecture](#core-architecture)
2. [Scene & Project Setup](#scene--project-setup)
3. [Node System](#node-system)
4. [Visual Components](#visual-components)
5. [Layout System](#layout-system)
6. [Animation System](#animation-system)
7. [Signals & Reactivity](#signals--reactivity)
8. [Flow Control](#flow-control)
9. [Timing Functions](#timing-functions)
10. [Transitions](#transitions)
11. [Camera Patterns (Wrapper Layout)](#camera-patterns-wrapper-layout)
12. [Media Components](#media-components)
13. [Code & LaTeX](#code--latex)
14. [Curves & Paths](#curves--paths)
15. [Filters & Effects](#filters--effects)
16. [Shaders](#shaders)
17. [References System](#references-system)
18. [Utilities](#utilities)
19. [Custom Components](#custom-components)
20. [Configuration](#configuration)

**Agency-Grade Motion Design (v1):**
21. [Motion Design Patterns (Spring, Secondary Motion, Hierarchy)](#motion-design-patterns)
22. [Masking, Wipe Transitions & Matched Cuts](#masking-wipe-transitions--matched-cuts)
23. [Easing Personalities & Decision Tables](#easing-personalities--decision-tables)
24. [Performance & Gotchas](#performance--gotchas)

**Extended APIs (v2):**
25. [Rive, Icon & Grid Components](#rive-icon--grid-components)
26. [Standalone Audio Component (Extended)](#standalone-audio-component-extended)
27. [Composite Blend Modes Reference](#composite-blend-modes-reference)
28. [Advanced APIs (drawHooks, Shaders, CurvePoint, Random, useContext, Layout Shortcuts)](#advanced-apis)
29. [Filter Stacking](#filter-stacking)

**Stunning HQ Motion Craft (v2):**
30. [Typography Animation Vocabulary](#typography-animation-vocabulary)
31. [Cinematic Lighting & Glow Systems](#cinematic-lighting--glow-systems)
32. [Color Animation Rules (60-30-10, Semantic, Gradient Mesh)](#color-animation-rules)
33. [Composition Discipline (Rule of Thirds, Asymmetry, Negative Space)](#composition-discipline)
34. [Audio-Driven Animation Sync (beatGrid)](#audio-driven-animation-sync)

**Revideo-Specific Features:**
35. [Revideo Overview](#revideo-overview)
36. [Headless Video Rendering](#headless-video-rendering)
37. [Parameterized Videos](#parameterized-videos)
38. [CLI Commands](#cli-commands)
39. [Render Endpoint API](#render-endpoint-api)
40. [Player Components](#player-components)
41. [Audio Component](#audio-component)
42. [FFmpeg Configuration](#ffmpeg-configuration)
43. [Deployment & Production](#deployment--production)
44. [Revideo API Quick Reference](#revideo-api-quick-reference)

---

## Core Architecture

Motion Canvas consists of two main components:
- **Library**: TypeScript library using generators to program animations
- **Editor**: Real-time preview with editing capabilities

### Core Packages
```typescript
import {...} from '@motion-canvas/core';  // Core utilities, signals, flow control
import {...} from '@motion-canvas/2d';     // 2D components and rendering
```

---

## Scene & Project Setup

### Creating a Project
```typescript
// project.ts
import {makeProject} from '@motion-canvas/core';
import example from './scenes/example?scene';  // ?scene suffix required

export default makeProject({
  scenes: [example],
  audio: audioFile,                    // Optional audio track
  variables: {key: 'value'},           // Optional project variables
  experimentalFeatures: true,          // Enable experimental features
});
```

### Creating a Scene
```typescript
import {makeScene2D} from '@motion-canvas/2d';

export default makeScene2D(function* (view) {
  // view is the root node - add children to it
  view.add(<Circle />);

  // Animation code using generators
  yield* animation();
});
```

### Project Variables
```typescript
const value = useScene().variables.get('variableName', 'defaultValue');
```

---

## Node System

### Base Node Class
All visual elements extend from `Node`. Core properties available on ALL nodes:

#### Transform Properties
| Property | Type | Description |
|----------|------|-------------|
| `position` | `Vector2` | Position relative to parent |
| `x` | `number` | X coordinate |
| `y` | `number` | Y coordinate |
| `scale` | `Vector2` | Scale factor |
| `rotation` | `number` | Rotation in degrees |
| `absolutePosition` | `Vector2` | Position in world space |
| `absoluteScale` | `Vector2` | Scale in world space |
| `absoluteRotation` | `number` | Rotation in world space |

#### Appearance Properties
| Property | Type | Description |
|----------|------|-------------|
| `opacity` | `number` | Opacity (0-1) |
| `fill` | `Color` | Fill color |
| `stroke` | `Color` | Stroke color |
| `lineWidth` | `number` | Stroke width |
| `lineCap` | `'butt'\|'round'\|'square'` | Line cap style |
| `lineJoin` | `'miter'\|'round'\|'bevel'` | Line join style |
| `shadowColor` | `Color` | Drop shadow color |
| `shadowBlur` | `number` | Shadow blur radius |
| `shadowOffsetX` | `number` | Shadow X offset |
| `shadowOffsetY` | `number` | Shadow Y offset |
| `clip` | `boolean` | Clip children to bounds |
| `cache` | `boolean` | Enable caching for filters |
| `cachePadding` | `Spacing` | Extra cache space |

#### Hierarchy Methods
```typescript
node.add(child);           // Add child node(s)
node.insert(child, index); // Insert at specific position
node.remove();             // Remove from parent
node.removeChildren();     // Remove all children
node.reparent(newParent);  // Move to new parent
node.moveUp();             // Move up in sibling order
node.moveDown();           // Move down in sibling order
node.moveToTop();          // Move to front
node.moveToBottom();       // Move to back
node.moveTo(index);        // Move to specific index
node.moveAbove(sibling);   // Move above sibling
node.moveBelow(sibling);   // Move below sibling
```

#### Query Methods
```typescript
node.children();                    // Get all children
node.parent();                      // Get parent node
node.findAll(predicate);           // Find all matching descendants
node.findFirst(predicate);         // Find first match
node.findLast(predicate);          // Find last match
node.findAncestor(predicate);      // Find matching ancestor
node.childrenAs<T>();              // Get children as specific type
```

#### Utility - Type Checking
```typescript
import {is} from '@motion-canvas/2d';
const circles = view.findAll(is(Circle));
const filtered = node.children().filter(is(Rect));
```

#### Matrix Properties
```typescript
node.localToWorld();    // Transform matrix to world space
node.worldToLocal();    // Transform matrix from world space
node.localToParent();   // Transform matrix to parent space
node.parentToWorld();   // Parent's world transform
node.worldToParent();   // Inverse of parentToWorld
```

---

## Visual Components

### Shape Components

#### Circle
```typescript
import {Circle} from '@motion-canvas/2d';

<Circle
  size={200}              // Diameter (or use width/height)
  width={200}             // Width
  height={200}            // Height
  fill={'#ff0000'}        // Fill color
  stroke={'white'}        // Stroke color
  lineWidth={4}           // Stroke width
  startAngle={0}          // Arc start angle (degrees)
  endAngle={360}          // Arc end angle (degrees)
  closed={true}           // Close the arc
/>
```

#### Rect
```typescript
import {Rect} from '@motion-canvas/2d';

<Rect
  width={200}
  height={100}
  fill={'blue'}
  radius={10}              // Corner radius (all corners)
  radius={[10, 20, 30, 40]} // [topLeft, topRight, bottomRight, bottomLeft]
  smoothCorners={true}     // iOS-style smooth corners
/>
```

#### Line
```typescript
import {Line} from '@motion-canvas/2d';

<Line
  points={[[-100, 0], [0, -50], [100, 0]]}
  stroke={'white'}
  lineWidth={4}
  lineCap={'round'}
  lineJoin={'round'}
  closed={false}
  start={0}               // Start percentage (0-1)
  end={1}                 // End percentage (0-1)
  startOffset={0}         // Offset from start (pixels)
  endOffset={0}           // Offset from end (pixels)
  startArrow={false}      // Show start arrow
  endArrow={false}        // Show end arrow
  arrowSize={16}          // Arrow size
/>
```

#### Polygon
```typescript
import {Polygon} from '@motion-canvas/2d';

<Polygon
  sides={6}               // Number of sides (hexagon)
  size={100}              // Circumradius
  fill={'green'}
/>
```

#### Ray
```typescript
import {Ray} from '@motion-canvas/2d';

<Ray
  from={[-100, 0]}
  to={[100, 0]}
  stroke={'white'}
  lineWidth={4}
  startArrow={true}
  endArrow={true}
/>
```

#### Icon
```typescript
import {Icon} from '@motion-canvas/2d';

<Icon
  icon={'mdi:home'}       // Icon identifier (uses iconify)
  size={48}
  color={'white'}
/>
```

### Text Components

#### Txt (Text)
```typescript
import {Txt} from '@motion-canvas/2d';

<Txt
  text={'Hello World'}
  fontSize={48}
  fontFamily={'Arial'}
  fontWeight={700}
  fontStyle={'italic'}
  fill={'white'}
  textAlign={'center'}     // 'left' | 'center' | 'right'
  textWrap={false}         // Enable text wrapping
  lineHeight={'150%'}      // Line height
/>
```

#### Custom Fonts
```css
/* global.css */
@import url('https://fonts.googleapis.com/css2?family=Fira+Code&display=swap');

@font-face {
  font-family: 'Custom Font';
  src: url(public/fonts/FONT.TTF) format('truetype');
}
```
```typescript
// project.ts
import './global.css';
```

---

## Layout System

Layout uses Flexbox. Enable with `layout={true}` on any Layout-extending node.

### Layout Properties
```typescript
import {Layout, Rect} from '@motion-canvas/2d';

<Layout
  layout={true}           // Enable layout (makes this the layout root)

  // Size
  size={[width, height]}
  width={200}
  height={100}

  // Positioning offset within parent
  offset={[-1, -1]}       // Anchor point (-1 to 1)

  // Flexbox Direction
  direction={'row'}        // 'row' | 'column' | 'row-reverse' | 'column-reverse'

  // Spacing
  gap={20}                 // Gap between children
  padding={20}             // Internal padding (or [top, right, bottom, left])
  margin={10}              // External margin

  // Alignment
  alignItems={'center'}    // 'start' | 'center' | 'end' | 'stretch'
  justifyContent={'center'} // 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'

  // Wrapping
  wrap={'wrap'}            // 'nowrap' | 'wrap' | 'wrap-reverse'
>
  <Rect />
  <Rect />
</Layout>
```

### Cardinal Direction Properties
Position nodes relative to edges/corners:
```typescript
<Rect
  // Absolute positioning relative to edges
  top={point}
  bottom={point}
  left={point}
  right={point}
  topLeft={point}
  topRight={point}
  bottomLeft={point}
  bottomRight={point}
  middle={point}
/>

// Example: Position relative to another node
<Rect right={otherRect().left} />  // Place right edge at other's left edge
```

---

## Animation System

### Tweening Basics
```typescript
// Tween a property
yield* node.property(targetValue, duration);

// Chain tweens
yield* node.position.x(100, 1).to(-100, 1).to(0, 1);

// Custom timing function
yield* node.opacity(1, 1, easeInOutCubic);

// Custom interpolation
yield* node.position([100, 100], 1, easeInOutCubic, Vector2.arcLerp);
```

### The `tween` Function
```typescript
import {tween, map, easeInOutCubic} from '@motion-canvas/core';

yield* tween(2, value => {
  // value goes from 0 to 1 over 2 seconds
  node.position.x(map(-300, 300, easeInOutCubic(value)));
  node.fill(Color.lerp(new Color('#ff0000'), new Color('#00ff00'), value));
});
```

### Spring Animations
> **For agency-grade spring usage**, see **Section 21 → Spring Physics Production Patterns** for tuned configs (`LogoLandSpring`, `UISpring`, `OrganicSpring`) and decision rules on when to use spring vs. `easeOutBack` vs. cubic easings.

```typescript
import {spring, PlopSpring, SmoothSpring} from '@revideo/core';

yield* spring(PlopSpring, fromValue, toValue, settleTolerance, value => {
  node.position.x(value);
});

// Custom spring
const MySpring = {
  mass: 0.04,
  stiffness: 10.0,
  damping: 0.7,
  initialVelocity: 8.0,
};
```

### Save and Restore State
```typescript
node.save();                    // Save current state to stack
yield* node.position([100, 100], 1);
yield* node.restore(1);         // Animate back to saved state
yield* node.restore(1, linear); // With custom timing
```

---

## Signals & Reactivity

### Creating Signals
```typescript
import {createSignal} from '@motion-canvas/core';
import {Vector2, Color} from '@motion-canvas/core';

// Primitive signal
const count = createSignal(0);

// Complex type signals
const position = Vector2.createSignal([0, 0]);
const color = Color.createSignal('#ff0000');

// Computed signal (reactive)
const doubled = createSignal(() => count() * 2);
```

### Using Signals
```typescript
// Get value
const value = signal();

// Set value immediately
signal(newValue);

// Tween to value
yield* signal(targetValue, duration);

// Reset to default
import {DEFAULT} from '@motion-canvas/core';
signal(DEFAULT);
yield* signal(DEFAULT, 1);  // Animate to default
```

### Signal Properties
All node properties are signals:
```typescript
const circle = <Circle fill={'red'} />;

// Read
const currentFill = circle.fill();

// Write
circle.fill('blue');

// Animate
yield* circle.fill('green', 1);
```

### Effects
```typescript
import {createEffect, createDeferredEffect} from '@motion-canvas/core';

// Immediate effect - runs when dependencies change
const unsubscribe = createEffect(() => {
  console.log('Value changed:', signal());
});

// Deferred effect - runs at end of frame
createDeferredEffect(() => {
  // Batches multiple changes
});

// Cleanup
unsubscribe();
```

---

## Flow Control

### Flow Functions
```typescript
import {all, any, chain, delay, sequence, loop, waitFor, waitUntil} from '@motion-canvas/core';

// Run animations in parallel
yield* all(
  node1.opacity(1, 1),
  node2.position.x(100, 1),
  node3.scale(2, 1),
);

// Wait for first to complete
yield* any(
  longAnimation(),
  shortAnimation(),  // If this finishes first, any() completes
);

// Run in sequence
yield* chain(
  firstAnimation(),
  secondAnimation(),
  thirdAnimation(),
);

// Delay before animation
yield* delay(0.5, animation());

// Staggered animations
yield* sequence(
  0.1,  // Delay between each
  node1.opacity(1, 0.5),
  node2.opacity(1, 0.5),
  node3.opacity(1, 0.5),
);

// Loop
yield* loop(5, i => node.rotation(360, 1));
yield* loop(() => infiniteAnimation());  // Infinite loop

// Wait
yield* waitFor(2);  // Wait 2 seconds

// Time events (editor-adjustable)
yield* waitUntil('eventName');
const duration = useDuration('eventName');
```

### Spawning Background Tasks
```typescript
import {spawn} from '@motion-canvas/core';

// Fire and forget
spawn(backgroundAnimation());

// Spawn with cleanup
const task = spawn(animation().do(() => cleanup()));
```

### Looping Patterns
```typescript
import {range, makeRef} from '@motion-canvas/core';

// Create multiple nodes
const rects: Rect[] = [];
view.add(
  range(10).map(i => (
    <Rect ref={makeRef(rects, i)} x={i * 50} />
  ))
);

// Animate all simultaneously
yield* all(...rects.map(rect => rect.opacity(1, 0.5)));

// Staggered with sequence
yield* sequence(0.1, ...rects.map(rect => rect.opacity(1, 0.5)));
```

---

## Timing Functions

All timing/easing functions available:

### Basic Easings
```typescript
import {
  linear,
  easeInSine, easeOutSine, easeInOutSine,
  easeInQuad, easeOutQuad, easeInOutQuad,
  easeInCubic, easeOutCubic, easeInOutCubic,
  easeInQuart, easeOutQuart, easeInOutQuart,
  easeInQuint, easeOutQuint, easeInOutQuint,
  easeInExpo, easeOutExpo, easeInOutExpo,
  easeInCirc, easeOutCirc, easeInOutCirc,
  easeInBack, easeOutBack, easeInOutBack,
  easeInElastic, easeOutElastic, easeInOutElastic,
  easeInBounce, easeOutBounce, easeInOutBounce,
} from '@motion-canvas/core';

yield* node.opacity(1, 1, easeInOutCubic);
```

### Interpolation Functions
```typescript
import {map} from '@motion-canvas/core';

// Linear interpolation between numbers
const value = map(0, 100, 0.5);  // Returns 50

// Complex type lerp
Color.lerp(color1, color2, t);
Vector2.lerp(v1, v2, t);
Vector2.arcLerp(v1, v2, t);  // Curved path
```

---

## Transitions

> **For transition decision rules and custom transition patterns** (masking, wipes, matched cuts), see **Section 22 → Masking, Wipe Transitions & Matched Cuts**.

Scene transitions are performed at the beginning of a new scene:

### Built-in Transitions
```typescript
import {
  slideTransition,
  zoomInTransition,
  zoomOutTransition,
  fadeTransition,
  waitTransition,
  Direction,
} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  view.add(/* nodes */);

  // Slide from direction
  yield* slideTransition(Direction.Left, 0.6);

  // Zoom transitions
  yield* zoomInTransition(0.6);
  yield* zoomOutTransition(0.6);

  // Fade
  yield* fadeTransition(0.6);

  // Wait (no visual transition)
  yield* waitTransition(0.6);

  // Continue with animation...
});
```

### Direction Values
```typescript
Direction.Top
Direction.Bottom
Direction.Left
Direction.Right
```

### Custom Transitions
```typescript
import {useTransition, useScene} from '@motion-canvas/core';

export function* myTransition(duration: number) {
  const endTransition = useTransition(
    ctx => { /* modify current scene context */ },
    ctx => { /* modify previous scene context */ },
  );

  yield* myAnimation(duration);

  endTransition();
}
```

### Animate During Transition
```typescript
import {finishScene} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  yield* mainAnimation();
  finishScene();  // Trigger transition early
  yield* exitAnimation();  // Continue animating during transition
});
```

---

## Camera Patterns (Wrapper Layout)

> **Revideo does NOT ship a built-in `Camera` component.** Verified against `@revideo/2d/lib/components/`. The legacy Motion Canvas `Camera` and `Camera.Stage` APIs are unavailable here. Virtual camera moves must use a wrapper `<Layout>` and animate its transform — the "camera" is the inverse transform of the world wrapper.

### Basic Wrapper-Layout Camera
```typescript
import {Layout, Rect, Circle, makeScene2D} from '@revideo/2d';
import {createRef, easeInOutCubic} from '@revideo/core';

export default makeScene2D('cameraDemo', function* (view) {
  const world = createRef<Layout>();

  view.add(
    <Layout ref={world} size={[1920, 1080]}>
      <Rect position={[-400, 0]} size={300} fill={'#22e'} />
      <Circle position={[400, 0]} size={300} fill={'#e22'} />
    </Layout>,
  );

  // PUSH IN (zoom on hero) — scale up world
  yield* world().scale(1.8, 1.2, easeInOutCubic);

  // PAN — translate world (opposite direction of intended camera move)
  yield* world().position([-300, 0], 1, easeInOutCubic);

  // RESET
  yield* all(
    world().position(0, 0.6, easeInOutCubic),
    world().scale(1, 0.6, easeInOutCubic),
  );
});
```

### Named Camera Moves

```typescript
// PUSH-IN: dolly forward onto a subject (importance/emphasis)
yield* world().scale(1.8, 1.2, easeInOutCubic);

// PULL-OUT: reveal wider context
yield* world().scale(0.7, 1.5, easeInOutCubic);

// PAN: lateral move across composition (follow reading direction)
yield* world().position([targetX, targetY], 1, easeInOutCubic);

// WHIP-PAN: fast pan with motion blur (energy)
import {blur} from '@revideo/2d';
yield* all(
  world().filters([blur(0)]).filters([blur(12)], 0.15),
  world().position([targetX, targetY], 0.3, easeInOutQuart),
);
yield* world().filters([blur(0)], 0.15);

// FOCUS-PULL: lock attention on element (translate world so subject centers + zoom)
const heroPos = heroElement().position();
yield* all(
  world().position(heroPos.scale(-1), 1.2, easeInOutCubic),
  world().scale(2, 1.2, easeInOutCubic),
);
```

### Composition Rules

1. **Rule of thirds for zoom targets** — don't center; offset target by ~1/3 of frame.
2. **One layer at a time** — don't animate the camera AND the subject simultaneously. Pick one.
3. **Reset between sections** — `yield* all(world().position(0, 0.6), world().scale(1, 0.6))`.
4. **Pull-out before scene exit** — give context before a transition.
5. **Hold after a camera move** — at least 0.3s of stillness so the audience reads what they were taken to.

### Parallax via Nested Wrappers

Layer multiple `<Layout>` wrappers; animate inner ones with a smaller scale delta than outer ones to fake depth:

```typescript
const bgWorld = createRef<Layout>();
const fgWorld = createRef<Layout>();

view.add(
  <Layout ref={bgWorld}>
    {/* background imagery */}
    <Layout ref={fgWorld}>
      {/* foreground imagery */}
    </Layout>
  </Layout>,
);

// Push in — foreground moves more than background → parallax depth
yield* all(
  bgWorld().scale(1.15, 1.2, easeInOutCubic),  // 15% scale
  fgWorld().scale(1.4, 1.2, easeInOutCubic),   // 40% scale (relative to bg = ~22% over absolute)
);
```

### Caveats

- Wrapper transforms compound. If `fgWorld` is inside `bgWorld`, animating both stacks the effect.
- The `<Layout>` must have an explicit `size` or its bounds depend on children.
- For rotation, use small angles (≤10°) for cinematic feel; large rotations make compositions hard to read.
- See **Section 21 (Motion Design Patterns) → Hierarchy Timing** for when to apply camera vs. subject animation.

---

## Media Components

### Images
```typescript
import {Img} from '@motion-canvas/2d';
import imageSrc from '../images/photo.png';

<Img
  src={imageSrc}
  width={400}           // Or use size
  height={300}
  smoothing={true}      // Image smoothing
/>
```

### Video
```typescript
import {Video} from '@motion-canvas/2d';
import videoSrc from '../videos/clip.mp4';

const videoRef = createRef<Video>();

<Video
  ref={videoRef}
  src={videoSrc}
  play={true}           // Auto-play
  loop={false}
  time={0}              // Seek position
/>

// Control playback
videoRef().play();
videoRef().pause();
videoRef().seek(5);     // Seek to 5 seconds
```

### Audio
Configure in project.ts:
```typescript
import audio from '../audio/voiceover.mp3';

export default makeProject({
  scenes: [example],
  audio: audio,
});
```

---

## Code & LaTeX

### Code Component
```typescript
import {Code, LezerHighlighter, lines, word, insert, remove, replace} from '@motion-canvas/2d';
import {parser} from '@lezer/javascript';

// Set default highlighter
Code.defaultHighlighter = new LezerHighlighter(
  parser.configure({dialect: 'jsx ts'})
);

const codeRef = createRef<Code>();

<Code
  ref={codeRef}
  code={`function example() {
  return 42;
}`}
  fontSize={24}
  fontFamily={'JetBrains Mono'}
/>

// Animate code changes (diffing)
yield* codeRef().code('const x = 5;', 0.6);

// Append/Prepend
yield* codeRef().code.append('\nconsole.log(x);', 0.6);
yield* codeRef().code.prepend('// Comment\n', 0.6);

// Insert/Replace/Remove at range
yield* codeRef().code.insert([1, 0], '  // new line\n', 0.6);
yield* codeRef().code.replace(word(0, 9, 7), 'newName', 0.6);
yield* codeRef().code.remove(lines(2), 0.6);

// Edit helper
yield* codeRef().code.edit(0.6)`\
function ${replace('old', 'new')}() {
  ${insert('// inserted')}
  ${remove('// removed')}
}`;

// Selection
yield* codeRef().selection(lines(1, 3), 0.6);
yield* codeRef().selection(codeRef().findFirstRange('example'), 0.6);
yield* codeRef().selection(DEFAULT, 0.6);  // Clear selection

// Code ranges
lines(1);           // Single line
lines(1, 3);        // Lines 1-3
word(0, 5, 10);     // Line 0, column 5, length 10
word(0, 5);         // Line 0, from column 5 to end
```

### LaTeX
```typescript
import {Latex} from '@motion-canvas/2d';

const texRef = createRef<Latex>();

<Latex
  ref={texRef}
  tex="{{a}}^2 + {{b}}^2 = {{c}}^2"  // {{}} for animation parts
  fill="white"
  fontSize={48}
/>

// Animate formula changes
yield* texRef().tex('{{a}} + {{b}} = {{c}}', 1);

// Array syntax
<Latex tex={['a^2', '+', 'b^2', '=', 'c^2']} />
```

---

## Curves & Paths

### Bezier Curves
```typescript
import {QuadBezier, CubicBezier} from '@motion-canvas/2d';

// Quadratic (1 control point)
<QuadBezier
  p0={[-100, 0]}      // Start
  p1={[0, -100]}      // Control
  p2={[100, 0]}       // End
  stroke={'white'}
  lineWidth={4}
  start={0}           // Draw percentage start
  end={1}             // Draw percentage end
  startArrow={true}
  endArrow={true}
  arrowSize={16}
/>

// Cubic (2 control points)
<CubicBezier
  p0={[-100, 0]}      // Start
  p1={[-50, -100]}    // Control 1
  p2={[50, 100]}      // Control 2
  p3={[100, 0]}       // End
/>

// Animate drawing
yield* bezier().end(1, 1);  // Draw in
yield* bezier().start(1, 1); // Draw out

// Get point on curve
const point = bezier().getPointAtPercentage(0.5);
// Returns {position: Vector2, tangent: Vector2}
```

### Splines
```typescript
import {Spline, Knot} from '@motion-canvas/2d';

// Using points array
<Spline
  points={[[-100, 0], [0, -50], [100, 0]]}
  smoothness={0.4}    // 0-1, curve smoothness
  closed={false}
  stroke={'white'}
  lineWidth={4}
/>

// Using Knot nodes (more control)
<Spline stroke={'white'} lineWidth={4}>
  <Knot position={[-100, 0]} />
  <Knot
    position={[0, -50]}
    startHandle={[-30, 0]}  // Relative to knot
    endHandle={[30, 0]}     // Auto-mirrors if only one set
  />
  <Knot position={[100, 0]} />
</Spline>

// Broken knot (sharp corner)
<Knot
  position={[0, 0]}
  startHandle={[-50, 0]}
  endHandle={[0, 50]}   // Different direction = sharp corner
/>

// Blend between auto and manual handles
<Knot auto={0.5} startHandle={[50, 0]} />

// Animate along spline
const progress = createSignal(0);
<Rect position={() => spline().getPointAtPercentage(progress()).position} />
yield* progress(1, 2);
```

### SVG Paths
```typescript
import {Path} from '@motion-canvas/2d';

<Path
  data="M10 10 L100 100 Q150 50 200 100"  // SVG path data
  stroke={'white'}
  lineWidth={4}
  start={0}
  end={1}
/>

// Morph between paths
yield* path().data('M0 0 L200 200', 1);

// Get point on path
const point = path().getPointAtPercentage(0.5);
```

---

## Filters & Effects

### Filters
```typescript
import {blur, brightness, contrast, grayscale, hue, invert, saturate, sepia, dropShadow} from '@motion-canvas/2d';

// Filter property method
yield* node().filters.blur(10, 1);
yield* node().filters.brightness(1.5, 1);

// Filter array
const blurAmount = createSignal(0);
<Rect filters={[blur(blurAmount), brightness(1.2)]} />
yield* blurAmount(10, 1);

// Available filters
blur(radius)
brightness(amount)      // 1 = normal
contrast(amount)        // 1 = normal
grayscale(amount)       // 0-1
hue(degrees)            // Hue rotation
invert(amount)          // 0-1
saturate(amount)        // 1 = normal
sepia(amount)           // 0-1
dropShadow(x, y, blur, color)
```

### Composite Operations (Masking)
```typescript
// Composite operations for masking
<Node cache>
  <Circle fill={'white'} />  {/* Mask shape */}
  <Rect
    compositeOperation={'source-in'}  {/* Value layer */}
    fill={'red'}
  />
</Node>

// Operations for masking:
// 'source-in'        - Show where both overlap
// 'source-out'       - Show source outside destination
// 'destination-in'   - Show destination where source overlaps
// 'destination-out'  - Show destination outside source
// 'xor'              - Show non-overlapping parts
```

### Cached Nodes
```typescript
// Required for filters and composite operations
<Node cache>
  <Circle filters={[blur(5)]} />
</Node>

// Increase cache area for effects that extend beyond bounds
<Node cache cachePadding={50}>
  <Circle shadowBlur={40} />
</Node>
```

---

## Shaders

```typescript
import myShader from './myShader.glsl';

<Circle
  shaders={myShader}        // Simple usage

  // With uniforms
  shaders={{
    fragment: myShader,
    uniforms: {
      myFloat: 0.5,
      myVec2: new Vector2(1, 2),
      myColor: new Color('red'),
    },
  }}
/>
```

GLSL shader structure:
```glsl
#version 300 es
precision highp float;

#include "@motion-canvas/core/shaders/common.glsl"

// Available uniforms:
// uniform float time;
// uniform float deltaTime;
// uniform int frame;
// uniform vec2 resolution;
// uniform sampler2D sourceTexture;
// uniform sampler2D destinationTexture;

void main() {
    outColor = texture(sourceTexture, sourceUV);
    outColor.rgb = 1.0 - outColor.rgb;  // Invert colors
}
```

---

## References System

### createRef
```typescript
import {createRef} from '@motion-canvas/core';

const circleRef = createRef<Circle>();
view.add(<Circle ref={circleRef} />);

// Access with ()
yield* circleRef().fill('red', 1);
```

### makeRef (Arrays/Objects)
```typescript
import {makeRef, range} from '@motion-canvas/core';

// Array of references
const circles: Circle[] = [];
view.add(
  range(10).map(i => <Circle ref={makeRef(circles, i)} />)
);

// Object properties
const refs = {circle: null as Circle, rect: null as Rect};
view.add(
  <>
    <Circle ref={makeRef(refs, 'circle')} />
    <Rect ref={makeRef(refs, 'rect')} />
  </>
);
```

### createRefArray
```typescript
import {createRefArray} from '@motion-canvas/core';

const circles = createRefArray<Circle>();
view.add(
  range(10).map(() => <Circle ref={circles} />)  // Auto-appends
);
```

### createRefMap
```typescript
import {createRefMap} from '@motion-canvas/core';

const labels = createRefMap<Txt>();
view.add(
  <>
    <Txt ref={labels.title}>Title</Txt>
    <Txt ref={labels.subtitle}>Subtitle</Txt>
  </>
);

yield* labels.title().text('New Title', 1);
yield* all(...labels.mapRefs(label => label.fill('white', 0.5)));
```

---

## Utilities

### Random Values
```typescript
import {useRandom} from '@motion-canvas/core';

const random = useRandom();       // Scene-seeded RNG
const random = useRandom(12345);  // Custom seed

random.nextInt(0, 10);           // Random int [0, 10)
random.nextFloat();              // Random float [0, 1)
random.nextFloat(5, 10);         // Random float [5, 10)
random.gauss(0, 1);              // Gaussian distribution
```

### Logging
```typescript
import {useLogger, debug} from '@motion-canvas/core';

const logger = useLogger();
logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning');
logger.error('Error');

// Quick debug
debug(object);

// Detailed log
logger.debug({
  message: 'Complex log',
  remarks: 'Additional info',
  object: {data: 'value'},
  durationMs: 200,
});

// Profiling
logger.profile('myOperation');
// ... expensive code ...
logger.profile('myOperation');  // Logs duration
```

### Vector2
```typescript
import {Vector2} from '@motion-canvas/core';

new Vector2(x, y)
new Vector2([x, y])
Vector2.zero          // (0, 0)
Vector2.one           // (1, 1)
Vector2.up            // (0, -1)
Vector2.down          // (0, 1)
Vector2.left          // (-1, 0)
Vector2.right         // (1, 0)

// Methods
vector.add(other)
vector.sub(other)
vector.mul(scalar)
vector.div(scalar)
vector.magnitude
vector.normalized
vector.dot(other)
vector.perpendicular
vector.degrees        // Angle in degrees
vector.radians        // Angle in radians
Vector2.lerp(a, b, t)
Vector2.arcLerp(a, b, t)
```

### Color
```typescript
import {Color} from '@motion-canvas/core';

new Color('#ff0000')
new Color('red')
new Color([255, 0, 0])
new Color({r: 255, g: 0, b: 0})

Color.lerp(color1, color2, t)

color.alpha()         // Get alpha
color.alpha(0.5)      // Set alpha
color.brighten(0.5)
color.darken(0.5)
color.saturate(0.5)
color.desaturate(0.5)
```

### Range Helper
```typescript
import {range} from '@motion-canvas/core';

range(5);             // [0, 1, 2, 3, 4]
range(2, 5);          // [2, 3, 4]
```

### Presentations
```typescript
import {beginSlide} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  yield* beginSlide('intro');
  // First slide content...

  yield* beginSlide('main');
  // Second slide content...

  yield* beginSlide('conclusion');
  // Third slide content...
});
```

---

## Custom Components

### Basic Structure
```typescript
import {Node, NodeProps, initial, signal} from '@motion-canvas/2d';
import {SignalValue, SimpleSignal, ColorSignal} from '@motion-canvas/core';

export interface MyComponentProps extends NodeProps {
  myValue?: SignalValue<number>;
  myColor?: SignalValue<PossibleColor>;
}

export class MyComponent extends Node {
  @initial(0)
  @signal()
  public declare readonly myValue: SimpleSignal<number, this>;

  @initial('#ffffff')
  @colorSignal()
  public declare readonly myColor: ColorSignal<this>;

  public constructor(props?: MyComponentProps) {
    super({...props});

    this.add(
      <Rect fill={this.myColor}>
        <Circle size={() => this.myValue() * 10} />
      </Rect>
    );
  }

  // Custom animation method
  public *animate(duration: number) {
    yield* all(
      this.myValue(100, duration),
      this.myColor('red', duration),
    );
  }
}
```

### Usage
```typescript
const myComponent = createRef<MyComponent>();

view.add(<MyComponent ref={myComponent} myValue={50} />);

yield* myComponent().animate(1);
yield* myComponent().myValue(100, 1);
```

---

## Configuration

### Vite Configuration
```typescript
// vite.config.ts
import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';

export default defineConfig({
  plugins: [
    motionCanvas({
      project: './src/project.ts',          // Or array for multiple
      output: './output',                    // Output directory
      bufferedAssets: /\.(wav|ogg)$/,       // Buffer these assets
      editor: '@motion-canvas/ui',          // Editor package
      proxy: {
        allowedMimeTypes: ['image/*', 'video/*'],
        allowListHosts: ['example.com'],
      },
    }),
  ],
});
```

### Rendering Settings
| Setting | Description |
|---------|-------------|
| Background | Canvas background color |
| Range | Frame range to render |
| Resolution | Output resolution |
| Frame rate | FPS (24, 30, 60, etc.) |
| Scale | Resolution multiplier |
| Color Space | sRGB or DCI-P3 |
| Audio offset | Audio sync offset |

### Output Paths
```
[output]/[projectName]/[frameNumber].[extension]
[output]/still/[projectName]/[frameNumber].[extension]  # Snapshots
```

---

## API Quick Reference

### Core Imports
```typescript
import {
  // Project/Scene
  makeProject,
  makeScene2D,

  // Signals
  createSignal,
  createEffect,
  createDeferredEffect,
  DEFAULT,

  // Flow
  all, any, chain, delay, sequence, loop,
  waitFor, waitUntil,
  spawn,

  // References
  createRef, createRefArray, createRefMap,
  makeRef, makeRefs,

  // Types
  Vector2, Color, BBox, Spacing,

  // Timing
  linear, easeInOutCubic, /* all easings */
  tween, map, spring, PlopSpring, SmoothSpring,

  // Utilities
  range, useRandom, useLogger, debug,
  useDuration, beginSlide, finishScene,
  useScene,

  // Transitions
  slideTransition, fadeTransition,
  zoomInTransition, zoomOutTransition,
  waitTransition, useTransition, finishScene,
  Direction,
} from '@revideo/core';
```

### 2D Imports
```typescript
import {
  // Components (Revideo does NOT ship Camera; use wrapper <Layout> for camera moves)
  Node, Layout, Rect, Circle, Line, Polygon, Ray,
  Txt, Img, Video, Icon, Audio,

  // Curves
  QuadBezier, CubicBezier, Spline, Knot, Path,

  // Code
  Code, LezerHighlighter, CODE,
  lines, word, insert, remove, replace,

  // LaTeX
  Latex,

  // Filters
  blur, brightness, contrast, grayscale,
  hue, invert, saturate, sepia, dropShadow,

  // Utilities
  is, withDefaults,
} from '@revideo/2d';
```

---

## Best Practices

1. **Use generators properly**: Always `yield*` for animations, plain `yield` for single-frame operations
2. **Reference nodes before animating**: Always create refs with `createRef()` or `makeRef()`
3. **Parallel animations**: Use `all()` to run independent animations simultaneously
4. **Caching**: Enable `cache` on parent nodes when using filters or composite operations
5. **Performance**: Use object pools with spawners for frequently changing node counts
6. **Signals**: Prefer computed signals for derived values to maintain reactivity
7. **Time events**: Use `waitUntil()` for audio sync instead of hardcoded durations
8. **Transitions**: Add nodes to view before yielding transition generators

---

## Motion Design Patterns

This section is the agency-grade motion vocabulary the agents must use. It covers what separates "competent code-driven animation" from "indistinguishable-from-After-Effects" output: spring physics, secondary motion, follow-through, anticipation, and hierarchy timing.

### The 12 Principles Mapped to Code

| Principle | What it Means Visually | Revideo Implementation |
|---|---|---|
| **Anticipation** | Brief pre-motion in the opposite direction before the main action | Scale `0.95` for `0.08s` before scaling to `1.0` |
| **Squash & Stretch** | Object deforms briefly under acceleration | Animate `scale.x` and `scale.y` independently with offset timing |
| **Follow-Through** | Trailing elements arrive after the primary | `delay(0.05, glowRef().opacity(0.8, 0.15))` inside `all()` |
| **Overshoot & Settle** | Element passes target, then settles back | `easeOutBack` to `1.1` → `easeInOutCubic` to `1.0` |
| **Secondary Motion** | Subordinate elements move because primary did | Glow/particle/shadow trailing the parent shape |
| **Staging** | Eye knows where to look | Hero element animates first; supporting elements lag 0.1–0.2s |
| **Slow-In/Slow-Out** | Acceleration, not constant velocity | `easeInOutCubic`, never `linear` for entrances |
| **Arcs** | Natural motion paths curve | Use `Vector2.arcLerp` or two-axis tweens with offset duration |
| **Timing** | Duration encodes weight & intent | Heavy = slow (`0.4s+`); light = fast (`0.15s`); UI snap = `0.08-0.12s` |
| **Exaggeration** | Push readability past realism | Overshoot to `1.15` on emphasis; never `1.0` flat |
| **Appeal** | Designed to be looked at | Use signature shapes, glows, color variation — not stock primitives |
| **Solid Drawing** | Sense of weight and 3D | Layer glows with cache + blur; use parallax wrappers |

### Spring Physics Production Patterns

Revideo's `spring()` from `@revideo/core` drives a signal with simulated mass-spring-damper physics. Three production-tuned configs to copy-paste:

```typescript
import {spring, PlopSpring, SmoothSpring, createSignal} from '@revideo/core';

// LogoLandSpring: bouncy, organic drop. For hero entrances on playful/organic brands.
const LogoLandSpring = {
  mass: 0.04,
  stiffness: 12,
  damping: 0.6,
  initialVelocity: 8,
};

// UISpring: snappy with one micro-overshoot. For UI elements, app demos.
const UISpring = {
  mass: 0.05,
  stiffness: 25,
  damping: 0.85,
  initialVelocity: 4,
};

// OrganicSpring: soft, floaty. For calm/premium brands.
const OrganicSpring = {
  mass: 0.08,
  stiffness: 8,
  damping: 0.7,
  initialVelocity: 2,
};

// Drive a scale signal with spring
const heroScale = createSignal(0);
heroBox().scale(heroScale);

yield* spring(LogoLandSpring, 0, 1, value => heroScale(value));
```

**When to use spring vs. easeOutBack vs. cubic:**
- `spring()` — organic/playful brands, hero entrances. Has natural physics overshoot.
- `easeOutBack` — UI confirmation, stylized "tap-back" emphasis. Has stylized overshoot.
- `easeOutCubic` — information delivery, everyday motion. No overshoot.

You can drive multiple properties from one spring signal for compound motion:

```typescript
const dropProgress = createSignal(0);
heroBox().scale(() => dropProgress());
heroBox().y(() => -200 + dropProgress() * 200);  // drops from y=-200 to y=0

yield* spring(LogoLandSpring, 0, 1, value => dropProgress(value));
```

### Secondary Motion & Follow-Through

Primary element moves → dependent elements arrive on a slight delay. This is the single biggest lever for "feels alive" output.

```typescript
// Pattern A: Glow lags shape by 50ms
yield* all(
  heroBox().scale(1, 0.2, easeOutCubic),
  delay(0.05, heroGlow().opacity(0.8, 0.15)),
  delay(0.08, heroGlow().scale(1.2, 0.18)),
);

// Pattern B: Trailing particles arrive after parent lands
yield* all(
  heroBox().y(0, 0.25, easeOutCubic),
  delay(0.1, sequence(0.04, ...trailParticles.map(p => p.opacity(1, 0.12)))),
);

// Pattern C: Overshoot + settle
yield* heroBox().scale(1.1, 0.15, easeOutBack);
yield* heroBox().scale(1.0, 0.12, easeInOutCubic);

// Pattern D: Anticipation pre-load
yield* heroBox().scale(0.95, 0.08, easeInOutCubic);  // wind-up
yield* heroBox().scale(1.0, 0.2, easeOutBack);       // release
```

**Rules:**
- Secondary motion lags primary by `0.04–0.12s`. Less = looks rigid; more = feels disconnected.
- Three trailing elements max; beyond that, stagger them in a `sequence()` instead of stacking delays.
- The glow/shadow should ALWAYS lag the shape it belongs to. Never simultaneous.

### Hierarchy Timing

Professional motion graphics moves elements in priority order: hero first, supporting next, ambient last.

```typescript
// Rule of thirds for entrance staging
yield* all(
  heroElement().scale(1, 0.25, easeOutBack),                          // 0ms
  delay(0.1, supportingText().opacity(1, 0.2, easeOutCubic)),         // 100ms
  delay(0.2, contextDetails().opacity(0.7, 0.2, easeOutCubic)),       // 200ms
  delay(0.3, ambientParticles().opacity(0.4, 0.3, easeOutCubic)),     // 300ms
);
```

### Named Cadences

Four cadence patterns for stagger sequences:

```typescript
// Staccato: 0.04s stagger — rapid, machine-gun. For lists, code reveals.
yield* sequence(0.04, ...items.map(item => item.opacity(1, 0.1)));

// March: 0.08s stagger — confident, building. For 3-5 element reveals.
yield* sequence(0.08, ...items.map(item => item.opacity(1, 0.15)));

// Wave: 0.15s stagger — organic, breathing. For text lines, hero builds.
yield* sequence(0.15, ...items.map(item => item.opacity(1, 0.2, easeInOutCubic)));

// Cascade: exponential stagger — accelerating. For "explosion" reveals.
function staggerExp(elements, base = 0.04, factor = 1.6) {
  return elements.map((el, i) => delay(base * Math.pow(factor, i), el.opacity(1, 0.12)));
}
yield* all(...staggerExp(particles));
```

### Helper Functions to Copy into Project's brand.ts

```typescript
import {delay, all} from '@revideo/core';

// Exponential stagger — accelerating reveal
export function staggerExp(
  generators: Generator[],
  baseDelay = 0.04,
  factor = 1.6,
): Generator[] {
  return generators.map((gen, i) =>
    delay(baseDelay * Math.pow(factor, i), gen)
  );
}

// Wave stagger — sinusoidal distribution (early/late items slower, middle items quicker)
export function staggerWave(
  generators: Generator[],
  totalDuration = 1.0,
): Generator[] {
  const n = generators.length;
  return generators.map((gen, i) => {
    const t = i / Math.max(1, n - 1);
    const offset = totalDuration * (t - 0.5 * Math.sin(2 * Math.PI * t) / (2 * Math.PI));
    return delay(offset, gen);
  });
}
```

---

## Masking, Wipe Transitions & Matched Cuts

This section covers everything that's NOT a hard cut. Eliminating hard cuts is the second biggest lever for agency-quality output.

### Revideo's Built-in Scene Transitions

Revideo ships 4 prebuilt transitions plus `useTransition` for custom. Each implies a different meaning — pick deliberately, not by default:

| Transition | When to Pick | Direction Semantics |
|---|---|---|
| `slideTransition(Direction, 0.6)` | Energy shift, new chapter | `Left` = reading forward (most common); `Up` = reveal to wider context; `Down` = collapse to detail; `Right` = backward (rarely correct) |
| `zoomInTransition(0.6)` | Dive deeper, excitement, drill-into-detail | Lands on new scene at native scale |
| `zoomOutTransition(0.6)` | Pull back, context reveal, conclusion | Pulls away from previous scene |
| `fadeTransition(0.6)` | Neutral, time-passage, mood change | Lowest energy — use sparingly |
| `waitTransition(0.6)` | No visual transition (hard cut after pause) | Pair with matched cut for continuity across a cut |

```typescript
import {makeScene2D} from '@revideo/2d';
import {Direction, slideTransition} from '@revideo/core';

export default makeScene2D('scene2', function* (view) {
  // Yield transition BEFORE animating content
  yield* slideTransition(Direction.Left, 0.6);

  // Now build the scene's content
  view.add(<Rect ... />);
  yield* mainAnimation();
});
```

### Masking with `compositeOperation`

Mask reveals create cinematic "open up" moments. They require a `cache` parent and a child with `compositeOperation`.

```typescript
import {Rect, Circle, Node, makeScene2D} from '@revideo/2d';
import {createRef, easeInOutCubic} from '@revideo/core';

// Iris reveal — circle expands from center revealing content
const mask = createRef<Circle>();

view.add(
  <Node cache>
    {/* The content to reveal */}
    <Rect size={[1600, 900]} fill={'#ee2'} />

    {/* The mask — anything `source-in` shows ONLY where this shape exists */}
    <Circle ref={mask} size={0} fill={'#fff'} compositeOperation={'destination-in'} />
  </Node>,
);

yield* mask().size(2400, 0.6, easeInOutCubic);  // iris expands; size 2400 covers frame
```

```typescript
// Wipe reveal — rectangle slides L-to-R revealing content
const wipe = createRef<Rect>();

view.add(
  <Node cache>
    <Txt text="REVEALED" fontSize={120} fill={'#fff'} />
    <Rect ref={wipe} size={[0, 200]} x={-960} fill={'#fff'} compositeOperation={'destination-in'} />
  </Node>,
);

yield* wipe().size([2400, 200], 0.5, easeInOutCubic);
```

```typescript
// Text reveal — wipe mask animating L-to-R over text
const textMask = createRef<Rect>();

view.add(
  <Node cache>
    <Txt text="Quietly intelligent." fontSize={96} fill={'#fff'} />
    <Rect
      ref={textMask}
      size={[0, 200]}
      x={-600}
      offsetX={-1}  // anchor left edge
      fill={'#fff'}
      compositeOperation={'destination-in'}
    />
  </Node>,
);

yield* textMask().size([1200, 200], 0.4, easeInOutCubic);
```

**Critical gotchas:**
- Parent MUST have `cache` prop. Without it, the mask doesn't isolate.
- `compositeOperation` values: `'destination-in'` (show only where mask exists), `'destination-out'` (hide where mask exists), `'source-in'` (clip mask to content).
- For blur effects mixed with masks, also set `cachePadding` on the parent to `blurRadius × 2` minimum.

### Custom Transitions with `useTransition`

For brand-distinctive transitions (glitch, ink-bloom, shatter), write a custom transition generator.

```typescript
// lib/transitions.ts
import {Direction, useTransition} from '@revideo/core';
import {linear, easeInOutCubic} from '@revideo/core';

export function* glitchTransition(duration = 0.4) {
  const endTransition = useTransition(
    ctx => {},                  // current scene transformation
    ctx => {                    // next scene transformation
      ctx.globalCompositeOperation = 'difference';
    },
  );

  // Animate over duration — flicker effect
  for (let t = 0; t < duration; t += 1/60) {
    yield;
  }

  endTransition();
}
```

Usage in scene:
```typescript
import {glitchTransition} from '../lib/transitions';

export default makeScene2D('scene3', function* (view) {
  yield* glitchTransition(0.35);
  // scene content...
});
```

Reference custom-transition templates worth building (~25 lines each in `lib/transitions.ts`):
- `inkBloomTransition` — radial mask growing from a point with feathered edge
- `iceShatterTransition` — voronoi-mask fragments scattering outward
- `gradientWipeTransition` — animated gradient sweeping across with color shift

### Matched Cuts (NEW Concept)

Scene N ends with an element at transform X. Scene N+1 begins with the SAME element matching transform X. Result: a hard cut that feels continuous.

Use `useScene().variables` to pass closing transform between scenes:

```typescript
// scene1.tsx — end of scene
import {useScene} from '@revideo/core';

export default makeScene2D('scene1', function* (view) {
  // ... animations ...

  // At end of scene, write closing transform for scene2
  useScene().variables.set('matchedCut', {
    anchor: 'heroBox',
    position: heroBox().position(),
    scale: heroBox().scale(),
    rotation: heroBox().rotation(),
  });

  yield* waitFor(0.3);
});
```

```typescript
// scene2.tsx — start of scene
import {useScene} from '@revideo/core';

export default makeScene2D('scene2', function* (view) {
  const variables = useScene().variables;
  const entry = variables.get('matchedCut', null)();

  const heroBox = createRef<Rect>();

  view.add(
    <Rect
      ref={heroBox}
      position={entry?.position ?? 0}
      scale={entry?.scale ?? 1}
      rotation={entry?.rotation ?? 0}
      size={300}
      fill={'#fff'}
    />,
  );

  // Now animate FROM the matched position to scene2's intended position
  yield* heroBox().position([0, 0], 0.4, easeInOutCubic);
});
```

**Two patterns to apply:**
1. **Shape-match cut**: logo at top-right of scene 1 → logo at top-right at scene 2 start (same screen position, different scale or color).
2. **Color-match cut**: gradient end-color of scene 1 = gradient start-color of scene 2. Use the same hex value.

---

## Easing Personalities & Decision Tables

Most under-used dimension in the existing scenes (94% are `easeOutCubic`). Use this table to drive easing choice:

| Intent | Easing | When to Pick |
|---|---|---|
| Element lands and stays (default) | `easeOutCubic` | Clean, professional, information delivery |
| Element overshoots, settles | `easeOutBack` → `easeInOutCubic` | UI confirmation, "ta-da" moments |
| Bouncy/organic | `easeOutElastic` | Playful brands ONLY; max ~5% of animations |
| Sharp impact/punch | `easeOutQuart`, `easeOutExpo` | Energetic brands, data emphasis, percussive hits |
| Smooth two-way motion | `easeInOutCubic` | Camera moves, opacity transitions, mood shifts |
| Mechanical/precise | `linear` | Loops, particle drift, NEVER for entrances |
| Quick start, soft land | `easeOutQuint` | Fast text entrances |
| Slow start, quick exit | `easeInQuart` | Element dismissals |
| Spring with overshoot | `spring(UISpring, ...)` | Logo/hero entrances |
| Anticipation + release | `easeInOutCubic` (wind-up) + `easeOutBack` (release) | Energy-building hero reveals |

### Easing Diversity Quota

In any single scene, no single easing function should exceed 50% of animations. Distribute across 4+ distinct functions for cinematic quality.

Existing scenes audit baseline: 94% `easeOutCubic` is FAILING this quota — they should be redistributed:
- ~40% `easeOutCubic` (default)
- ~25% `easeInOutCubic` (camera/opacity)
- ~15% `easeOutBack` or `spring()` (emphasis)
- ~10% `easeOutQuart` or `easeOutExpo` (punch)
- ~10% custom (linear for loops, easeInQuart for exits, etc.)

---

## Performance & Gotchas

### Cache Discipline

- **Required**: any parent of children using `compositeOperation`, `blur`, `dropShadow`, or other filters that read pixels.
- **Killer**: caching a constantly-animating parent that contains many children — every frame re-renders the whole cache.
- **Rule**: cache only when filter pixel-read is needed; never cache an animating parent.

```typescript
// GOOD — static parent, animating glow child
<Rect cache>
  <Circle filters={[blur(20)]} />  // glow blurs without re-caching parent
  <Rect />                          // static content
</Rect>

// BAD — animating parent with cache
<Rect cache scale={animatedSignal}>  // re-caches every frame; expensive
  <Circle filters={[blur(20)]} />
</Rect>
```

### `cachePadding` Rule

Blur expands beyond bounding box. Without `cachePadding`, edges clip.

```typescript
<Rect cache cachePadding={40}>  // blur radius × 2
  <Circle filters={[blur(20)]} />
</Rect>
```

### Signal Determinism

- Always seed `useRandom()`. Never use `Math.random()` — outputs differ frame-to-frame on re-render.
- `useRandom(seed)` returns a deterministic generator; pass the same seed for reproducible animation.

### Glow Layer Ceiling

Heavy blurs are GPU-expensive. Hard ceiling: **8 simultaneous nodes with `blur(20)+`** at any one frame. Above that, render time degrades visibly.

- Use one large blur for ambient background, not 10 small ones.
- Layered glows on a single hero (3-4 blurs) are fine; that's one element.

### Filter Array Stability

Filters must be a stable array. Don't reconstruct on every frame:

```typescript
// BAD — new array per frame, breaks caching
<Rect filters={() => [blur(blurAmount())]} />

// GOOD — precompute, animate the blur amount via signal
const blurFilter = blur(20);
<Rect filters={[blurFilter]} />
// Animate blurFilter's signal instead if available
```

### `createRefArray` over Manual Lists

For a known number of similar refs, use `createRefArray<T>()` rather than `Generator[]` accumulator. It's optimized for batch operations.

```typescript
import {createRefArray} from '@revideo/core';

const particles = createRefArray<Circle>();

view.add(
  <>
    {range(20).map(i => <Circle ref={particles} ... />)}
  </>,
);

// Animate all at once
yield* sequence(0.03, ...particles.map(p => p.opacity(1, 0.15)));
```

### `yield*` vs `yield` Semantics

- `yield*` — animation generator. Delegates to a generator and runs ALL its frames before continuing. Use for tweens, animations, sequences.
- `yield` — single-frame yield. Pauses for one frame, then continues. Use only inside custom generators when you need per-frame logic.

### Signal Reactivity Edge Cases

- Signals captured in JSX closures may not update reactively. Use `createComputed()` for derived values, not inline arrow functions.
- Reading a signal in a generator (`signal()`) returns the current value at that moment, not reactive.

---

*This reference covers Motion Canvas core capabilities. For detailed API documentation, see the [official API reference](https://motioncanvas.io/api/).*

---

# Extended APIs (v2)

The following sections document Revideo components and APIs that aren't covered in the core Motion Canvas reference but ship with `@revideo/2d` and `@revideo/core`.

---

## Rive, Icon & Grid Components

Three high-leverage components for production motion graphics.

### Rive — Vector Animation Player

Plays Rive vector animations natively. Pre-built animations from Rive editor (`.riv` files) are imported and triggered with signals.

```typescript
import {Rive} from '@revideo/2d';
import {createRef, createSignal} from '@revideo/core';

const riveRef = createRef<Rive>();
const artboard = createSignal<string>('Main');
const animation = createSignal<string>('Idle');

view.add(
  <Rive
    ref={riveRef}
    src={'./assets/logo.riv'}
    artboardId={artboard}
    animationId={animation}
    size={[400, 400]}
    autoplay={true}
  />
);

// Switch to a different animation in the same artboard
yield* animation('Bounce', 0.6);

// Switch artboards entirely (e.g., logo states)
yield* artboard('LogoActive', 0.6);
```

**When to use:**
- Brand assets pre-animated in Rive
- Logo state machines (idle/hover/active)
- Complex character/illustration animation that would take 1000+ LOC in code

**Performance note:** Rive is GPU-accelerated; cheap to render. But each `.riv` file loads asynchronously — preload via `awaitCanPlay` or scene `start()` hook.

### Icon — Icônes.js (150k+ Icon Library)

```typescript
import {Icon} from '@revideo/2d';

view.add(
  <Icon
    icon="mdi:check-circle"
    color={'#4ade80'}
    size={48}
  />
);
```

Icon names follow `{collection}:{name}` from [icones.js.org](https://icones.js.org/):
- `mdi:*` — Material Design Icons (most comprehensive)
- `ph:*` — Phosphor Icons (modern, weight variants)
- `tabler:*` — Tabler Icons
- `bi:*` — Bootstrap Icons
- `lucide:*` — Lucide Icons
- `simple-icons:*` — Brand logos
- `carbon:*` — IBM Carbon

**Animate color:**
```typescript
yield* iconRef().color('#f87171', 0.3);  // color tweens automatically
```

**Common collections by use case:**
- Tech/dev: `tabler:brand-typescript`, `simple-icons:github`
- UI: `mdi:menu`, `ph:caret-right-bold`
- Status: `mdi:check-circle`, `mdi:alert-circle`
- Data: `tabler:chart-line`, `carbon:dashboard`

### Grid — Geometric Patterns

```typescript
import {Grid} from '@revideo/2d';
import {createRef, createSignal} from '@revideo/core';

const grid = createRef<Grid>();
const gridEnd = createSignal<number>(0);  // 0-1, controls how much grid is drawn

view.add(
  <Grid
    ref={grid}
    width={1920}
    height={1080}
    spacing={80}
    stroke={'#E8E2D5'}
    lineWidth={1}
    start={0}
    end={gridEnd}
  />
);

// Draw grid in over 0.8s — lines appear progressively
yield* gridEnd(1, 0.8, easeOutCubic);
```

**Properties:**
- `spacing` — distance between grid lines (px)
- `start`/`end` — 0..1 range; controls which portion of grid is rendered (for drawing-in animations)
- `stroke`, `lineWidth` — appearance
- `width`/`height` — bounds

**When to use:**
- Background structure for data dashboards
- Sci-fi/tech aesthetic patterns
- Stage-setting before content arrives

---

## Standalone Audio Component (Extended)

Beyond project-level audio, Revideo's `<Audio>` is a full scene-graph component for layered SFX/music control.

```typescript
import {Audio} from '@revideo/2d';
import {createRef, createSignal} from '@revideo/core';

const audioRef = createRef<Audio>();
const volumeSignal = createSignal<number>(0.8);

view.add(
  <Audio
    ref={audioRef}
    src={'./audio/main-theme.mp3'}
    play={true}
    loop={true}
    volume={volumeSignal}
    playbackRate={1.0}
    time={0}
  />
);

// Duck audio during VO
yield* volumeSignal(0.3, 0.4, easeInOutCubic);
yield* waitFor(2.0);  // VO plays
yield* volumeSignal(0.8, 0.4, easeInOutCubic);

// Pause and resume
audioRef().play(false);
yield* waitFor(0.5);
audioRef().play(true);

// Scrub to a specific time
yield* audioRef().time(15.0, 0.2);
```

### Methods (synchronous)

```typescript
audioRef().play(true);              // start playback
audioRef().play(false);             // pause
audioRef().getCurrentTime();        // → number (seconds)
audioRef().getDuration();           // → number (seconds, after metadata loads)
audioRef().getVolume();             // → number 0..1+
audioRef().setVolume(0.5);          // set without animation
```

### Volume Amplification (Revideo-specific)

By default, `volume > 1.0` is clamped in editor preview. Enable amplification:

```typescript
<Audio
  src={'...'}
  volume={1.5}
  allowVolumeAmplificationInPreview={true}
/>
```

Renders always honor volume above 1.0; this flag is purely for editor preview behavior.

### Audio Sync Pattern (Wait for Media Ready)

Reliable scene start with audio:

```typescript
const audio = createRef<Audio>();
view.add(<Audio ref={audio} src={'...'} play={false} awaitCanPlay={true} />);

// Audio is ready when this resolves
yield* waitFor(0.05);  // small buffer
audio().play(true);

yield* mainAnimation();
```

### Layered Audio Pattern (Background + SFX)

```typescript
view.add(
  <>
    {/* Background ambient music — looped */}
    <Audio src={'./audio/ambient.mp3'} play={true} loop={true} volume={0.3} />

    {/* One-shot SFX at specific times */}
    <Audio src={'./audio/whoosh.mp3'} play={true} time={2.4} volume={0.7} />
    <Audio src={'./audio/impact.mp3'} play={true} time={4.8} volume={0.9} />
  </>
);
```

The `time` prop schedules playback START at that absolute time in the scene.

---

## Composite Blend Modes Reference

The `compositeOperation` prop on any Node controls how its pixels blend with what's behind. Parent should have `cache` for blend modes to work correctly.

| Mode | What It Does | Best For |
|---|---|---|
| `'source-over'` | Default — paint on top | Normal layering |
| `'source-in'` | Show only where new pixel overlaps existing | Inside-only clipping |
| `'source-out'` | Show only where new pixel does NOT overlap existing | Outside-only painting |
| `'source-atop'` | Show new pixels, but only where existing pixels exist | Text-fill on a shape |
| `'destination-over'` | Paint behind existing | Behind-fill |
| `'destination-in'` | Keep only where new pixel exists | **Mask reveal** (primary use) |
| `'destination-out'` | Keep only where new pixel does NOT exist | **Mask cutout** (eraser) |
| `'destination-atop'` | Keep existing only where new pixel exists; new pixels behind | Rare clipping pattern |
| `'lighter'` | Add color values (brightens) | Light explosions, additive glow |
| `'copy'` | Replace with new pixel | Hard overwrites |
| `'xor'` | Show where one or other exists, not both | Punch-through effects |
| `'multiply'` | Multiply pixels (darken) | Shadow layering, color-dodge-ink |
| `'screen'` | Inverse multiply (lighten) | Light overlay, glow boost |
| `'overlay'` | Combination of multiply + screen | Contrast pop |
| `'darken'` | Keep darker of two pixels | Combine dark shapes without blending |
| `'lighten'` | Keep lighter of two pixels | Combine bright shapes |
| `'color-dodge'` | Brighten existing based on new | Sun-flare, intense highlights |
| `'color-burn'` | Darken existing based on new | Vignette, deep shadows |
| `'hard-light'` | Like overlay but inverse | Vivid contrast |
| `'soft-light'` | Soft version of overlay | Gentle gradient overlays |
| `'difference'` | Absolute difference of pixels | **Chromatic aberration sim**, glitch |
| `'exclusion'` | Like difference but lower contrast | Soft inversion |
| `'hue'` | Hue of new, sat+lum of existing | Color recoloring |
| `'saturation'` | Sat of new, hue+lum of existing | Saturation effects |
| `'color'` | Hue+sat of new, lum of existing | Color tinting (most natural) |
| `'luminosity'` | Lum of new, hue+sat of existing | Tonal mapping |

### Example: Mask Reveal (most common)

```typescript
<Node cache>
  <Txt text="REVEALED" fontSize={120} fill={'#fff'} />
  <Rect
    ref={mask}
    size={[0, 200]}
    fill={'#fff'}
    compositeOperation={'destination-in'}
  />
</Node>
```

### Example: Additive Glow (lighter)

```typescript
<Node cache>
  <Circle size={100} fill={'#fff'} />
  <Circle
    size={200}
    fill={'#facc15'}
    filters={[blur(60)]}
    compositeOperation={'lighter'}  // adds light values
    opacity={0.5}
  />
</Node>
```

### Example: Chromatic Aberration / RGB Split (difference)

```typescript
<Node cache>
  <Txt text="GLITCH" fontSize={120} fill={'#ff0000'} x={-3} />
  <Txt text="GLITCH" fontSize={120} fill={'#00ffff'} x={3}
       compositeOperation={'difference'} />
</Node>
```

---

## Advanced APIs

### Code drawHooks (Per-Token Rendering Control)

The Code component exposes `drawHooks` for custom per-token rendering (e.g., blur unselected lines, color-code by syntax type).

```typescript
import {Code} from '@revideo/2d';

view.add(
  <Code
    code={`function hello() { return 'world'; }`}
    drawHooks={{
      token: (ctx, text, position, color, selection) => {
        // Default rendering with custom modifications
        const isSelected = selection ? selection.contains(position) : true;
        ctx.globalAlpha = isSelected ? 1.0 : 0.3;  // dim unselected
        ctx.fillStyle = color;
        ctx.fillText(text, position.x, position.y);
      },
    }}
  />
);
```

**Common patterns:**
- Blur unselected tokens (`ctx.filter = isSelected ? 'none' : 'blur(2px)'`)
- Spotlight specific tokens (alpha modulation)
- Color-shift tokens during emphasis

### Custom Shaders (Fragment GLSL)

Apply WebGL shaders to any Node for custom effects.

```typescript
import {Node} from '@revideo/2d';
import {createSignal} from '@revideo/core';

const distortionAmount = createSignal<number>(0);

const chromaticAberrationShader = `
  precision mediump float;
  uniform sampler2D src;
  uniform float distortion;
  varying vec2 vUv;

  void main() {
    vec2 d = vec2(distortion * 0.01, 0.0);
    float r = texture2D(src, vUv + d).r;
    float g = texture2D(src, vUv).g;
    float b = texture2D(src, vUv - d).b;
    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

view.add(
  <Node
    shaders={[{
      fragment: chromaticAberrationShader,
      uniforms: { distortion: distortionAmount },
    }]}
  >
    <Txt text="GLITCH" fontSize={120} fill={'#fff'} />
  </Node>
);

// Animate the distortion
yield* distortionAmount(1, 0.4);
yield* distortionAmount(0, 0.2);
```

**Uniforms supported:** `float`, `vec2`, `vec3`, `vec4`. Signals are auto-converted.

**Hooks:**
- `setup(gl, program)` — runs once when shader compiles; bind extra textures, set static uniforms
- `teardown(gl, program)` — runs when shader is removed; clean up resources

### CurvePoint Geometry (Object-Follows-Path)

```typescript
import {Spline} from '@revideo/2d';
import {createRef} from '@revideo/core';

const path = createRef<Spline>();
const dot = createRef<Circle>();

view.add(
  <>
    <Spline ref={path} points={[[-400, 0], [-100, -200], [100, 200], [400, 0]]} />
    <Circle ref={dot} size={20} fill={'#fff'} />
  </>
);

// Move dot along path
const progress = createSignal<number>(0);
const curveLength = path().getLength();

dot().position(() => {
  const point = path().getPointAtPercentage(progress());
  return point.position;
});

dot().rotation(() => {
  const point = path().getPointAtPercentage(progress());
  return point.tangent.degrees;  // dot orients along path direction
});

yield* progress(1, 2.0, easeInOutCubic);
```

**CurvePoint shape:** `{ position: Vector2, tangent: Vector2, normal: Vector2 }`

**Available on:** `Spline`, `Path`, `Bezier`, `CubicBezier`, `QuadBezier`, `Line`, `Ray`.

### Random Class (Seeded Deterministic RNG)

```typescript
import {useRandom} from '@revideo/core';

const rand = useRandom(42);  // seed

const x = rand.nextFloat(-100, 100);
const angle = rand.nextFloat(0, Math.PI * 2);
const intIdx = rand.nextInt(0, 10);
const gaussianValue = rand.gauss(0, 1);  // mean 0, stddev 1

// Generate arrays
const positions = rand.floatArray(20, 0, 1000);  // 20 floats in [0, 1000)
const indices = rand.intArray(8, 0, 5);          // 8 ints in [0, 5)

// Spawn a child generator with new seed (for nested randomness)
const childRand = rand.spawn();
```

**Why seeded:** rendering is deterministic. Same scene + same seed = same output. Never use `Math.random()` — it varies per frame.

### useContext & useContextAfter Hooks

Low-level canvas hooks for custom drawing before/after the default render pass.

```typescript
import {useContext} from '@revideo/core';

export default makeScene2D('demo', function* (view) {
  const cleanup = useContext((ctx) => {
    // Draw before scene renders — e.g., custom gradient background
    const grad = ctx.createRadialGradient(960, 540, 100, 960, 540, 800);
    grad.addColorStop(0, '#f7f4ec');
    grad.addColorStop(1, '#e8e2d5');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1920, 1080);
  });

  // ... scene content ...

  yield* mainAnimation();
  cleanup();  // unregister the hook
});
```

`useContextAfter(callback)` draws AFTER all scene rendering completes — useful for overlays (vignettes, film grain, watermarks).

### Layout Edge Positioning Shortcuts

Instead of computing absolute positions, use named shortcuts on `Layout`:

```typescript
// Position elements at edges/corners without manual math
<Layout>
  <Rect ref={topLeft} ... />
  <Rect ref={topRight} ... />
</Layout>

// In animation:
yield* myRect().position(layout().topLeft(), 0.5);     // animate to top-left
yield* myRect().position(layout().middle(), 0.5);      // center
yield* myRect().position(layout().bottomRight(), 0.5); // bottom-right
```

**Available shortcuts:** `top, bottom, left, right, middle, topLeft, topRight, bottomLeft, bottomRight, middleLeft, middleRight, topMiddle, bottomMiddle`. Each returns a `Vector2`.

### SVG getChildrenById

Animate sub-elements of an imported SVG logo.

```typescript
import {SVG} from '@revideo/2d';

const logo = createRef<SVG>();
view.add(<SVG ref={logo} src={'./logo.svg'} size={400} />);

// Animate one piece of the logo
const ringElements = logo().getChildrenById('ring');
yield* all(...ringElements.map(el => el.opacity(1, 0.3)));

// Find by index too
const allShapes = logo().getChildrenByTagName('path');
yield* sequence(0.04, ...allShapes.map(s => s.opacity(1, 0.2)));
```

**IDs come from the SVG source.** Add `id="ring"` to grouped layers in your SVG editor before export.

---

## Filter Stacking

Filters are CSS-style image processing applied to a Node's rendered output. They chain in array order.

```typescript
import {blur, brightness, contrast, grayscale, hue, invert, saturate, sepia, dropShadow} from '@revideo/2d';

<Rect filters={[
  blur(20),                      // 20px Gaussian blur
  brightness(1.2),               // 120% brightness
  contrast(1.4),                 // 140% contrast
  grayscale(0.5),                // 50% grayscale
  hue(45),                       // rotate hue 45deg
  invert(0.3),                   // 30% inversion
  saturate(1.5),                 // 150% saturation
  sepia(0.4),                    // 40% sepia
  dropShadow({                   // CSS dropShadow
    offsetX: 0,
    offsetY: 8,
    blurRadius: 24,
    color: 'rgba(0,0,0,0.2)',
  }),
]} />
```

### Stable Array Pattern (CRITICAL for performance)

```typescript
// ❌ BAD — new filter array per frame
<Rect filters={() => [blur(blurAmount())]} />

// ✅ GOOD — precompute, animate the signal inside
const blurFilter = blur(20);
<Rect filters={[blurFilter]} />
// Animate via a signal-driven filter: blurFilter.value(40)
```

### Common Stacking Patterns

```typescript
// Vintage photograph
filters={[saturate(0.7), sepia(0.3), contrast(1.1), blur(0.5)]}

// Sci-fi data screen
filters={[hue(180), saturate(1.6), brightness(1.1), contrast(1.3)]}

// Soft dream blur (with dropshadow for depth)
filters={[blur(8), saturate(1.2), dropShadow({offsetX: 0, offsetY: 16, blurRadius: 40, color: 'rgba(0,0,0,0.15)'})]}

// Chromatic abberation effect (use difference compositeOp instead — see Section 27)
```

### Performance Discipline

- Each filter costs GPU time. Max ~3-4 simultaneous filters per high-density node.
- `blur` is the most expensive; cache the parent when blurring children: `<Node cache cachePadding={blurAmount * 2}>`.
- `dropShadow` is moderately expensive but cheaper than blurring a duplicate.
- Hue/saturate/grayscale are cheap.

---

# Stunning HQ Motion Craft (v2)

The following five sections cover the craft details that separate "competent" from "stunning" motion graphics output. Pair these with the v1 Motion Design Patterns (Section 21) for full agency-grade quality.

---

## Typography Animation Vocabulary

The single biggest lever for agency-grade output. Text shouldn't fade in as a block — every brand has a typographic motion signature.

### Character-Level Reveals

Split text into individual `<Txt>` nodes and stagger their entrance.

```typescript
import {Txt} from '@revideo/2d';
import {sequence, all, delay, createRefArray} from '@revideo/core';

// Split "Lumen" into 5 character refs
const chars = createRefArray<Txt>();
const word = 'Lumen';

view.add(
  <Layout layout direction={'row'}>
    {word.split('').map((c, i) => (
      <Txt
        key={`char-${i}`}
        ref={chars}
        text={c}
        fontSize={96}
        fontFamily={'Inter'}
        fontWeight={500}
        opacity={0}
        y={20}
      />
    ))}
  </Layout>
);

// Three techniques — pick based on brand energy_curve:

// Opacity-only (calm brands)
yield* sequence(0.06, ...chars.map(c => c.opacity(1, 0.2, easeOutCubic)));

// Opacity + y-rise (premium/editorial)
yield* sequence(0.06, ...chars.map(c =>
  all(c.opacity(1, 0.2, easeOutCubic), c.y(0, 0.2, easeOutCubic))
));

// Opacity + scale (energetic/playful)
yield* sequence(0.04, ...chars.map(c => {
  c.scale(0.7);
  return all(c.opacity(1, 0.15, easeOutBack), c.scale(1, 0.15, easeOutBack));
}));
```

**Stagger timing by brand:**
- Calm/premium: 0.06-0.10s between chars
- Moderate: 0.04-0.06s
- High-energy: 0.02-0.04s
- Frenetic: 0.01-0.02s (machine-gun)

### Word-by-Word & Line-by-Line Reveals

```typescript
const words = 'Pattern recognition without panic.'.split(' ');

const wordRefs = createRefArray<Txt>();
view.add(
  <Layout layout direction={'row'} gap={20}>
    {words.map((w, i) => (
      <Txt key={`w-${i}`} ref={wordRefs} text={w} opacity={0} y={20} />
    ))}
  </Layout>
);

yield* sequence(0.12, ...wordRefs.map(w =>
  all(w.opacity(1, 0.25, easeOutCubic), w.y(0, 0.25, easeOutCubic))
));
```

**Wave-stagger for word reveals** — middle words arrive fastest (per Section 21 cadence rules):

```typescript
import {staggerWave} from '../lib/brand';  // helper from v1 motion-helpers

yield* all(...staggerWave(
  wordRefs.map(w => all(w.opacity(1, 0.25), w.y(0, 0.25)) as ThreadGenerator),
  1.0
));
```

### Letter-Spacing (Tracking) Animation

Editorial brands tighten tracking on emphasis. Premium tightening uses `easeInOutCubic` over 0.3-0.5s.

```typescript
const tracking = createSignal<number>(0);  // letter-spacing in em or px

<Txt
  text={'QUIETLY INTELLIGENT'}
  fontSize={48}
  letterSpacing={() => tracking()}
  fill={'#1F2A26'}
/>

// Loose tracking on entrance, tightens during emphasis
yield* tracking(8, 0.3, easeOutCubic);   // start at 8px tracking
yield* waitFor(0.5);                      // hold
yield* tracking(2, 0.4, easeInOutCubic); // tighten for emphasis — feels intentional
```

### Font-Weight Pulse (No Scale)

```typescript
const weight = createSignal<number>(400);

<Txt
  text={'+12%'}
  fontSize={64}
  fontWeight={() => weight()}
  fill={'#1F2A26'}
/>

// Pulse weight without changing size — text appears to "inhale" without animation jitter
yield* weight(600, 0.15, easeOutCubic);
yield* weight(500, 0.2, easeInOutCubic);  // settle slightly heavier
```

### Count-Up for Metrics

```typescript
import {tween, easeOutQuint} from '@revideo/core';

const metricRef = createRef<Txt>();
const value = createSignal<number>(0);

view.add(<Txt ref={metricRef} text={() => `+${Math.round(value())}%`} fontSize={64} />);

// Animate the number from 0 to 12 over 0.8s
yield* value(12, 0.8, easeOutQuint);

// For decimals:
const ratio = createSignal<number>(0);
metricRef().text(() => ratio().toFixed(2));
yield* ratio(0.94, 0.8, easeOutQuint);  // 0.00 → 0.94
```

### Optical Sizing (Tracking Scales with Font Size)

| Font Size | Letter-Spacing (em) | Why |
|---|---|---|
| 96px+ (hero) | -0.04 to -0.025 | Tight; counter-overlap |
| 64-96px (h1) | -0.02 to -0.01 | Slightly tight |
| 32-64px (h2) | -0.005 to 0 | Neutral |
| 18-32px (body) | 0 to 0.005 | Slightly loose for readability |
| 12-18px (caption) | 0.02 to 0.06 | Loose; aids legibility |
| Labels (uppercase) | 0.08 to 0.18 | Wide; institutional feel |

```typescript
// In brand.ts:
export const opticalTracking = {
  hero: -1.6,        // -0.04em at 64px = -1.6px (computed)
  h1: -0.8,
  h2: 0,
  body: 0.2,
  caption: 0.6,
  labelUppercase: 5.0,
};
```

---

## Cinematic Lighting & Glow Systems

Replace single-blur "glows" with proper layered lighting.

### Multi-Layer Glow Stack (Hero Elements)

Three Circles at increasing blur radii, decreasing opacity. Creates physically-plausible bloom.

```typescript
import {Circle} from '@revideo/2d';
import {createRef, all, delay, easeOutCubic} from '@revideo/core';

const glowInner = createRef<Circle>();   // sharp halo
const glowMid = createRef<Circle>();      // mid bloom
const glowOuter = createRef<Circle>();    // atmospheric haze

view.add(
  <>
    <Circle ref={glowOuter} size={500} fill={'#d4b98c'} opacity={0} filters={[blur(120)]} />
    <Circle ref={glowMid} size={300} fill={'#d4b98c'} opacity={0} filters={[blur(60)]} />
    <Circle ref={glowInner} size={180} fill={'#d4b98c'} opacity={0} filters={[blur(20)]} />
    <Circle size={120} fill={'#7a9e8e'} ref={hero} />  {/* the actual hero */}
  </>
);

// Layered glow entrance — outer first (atmosphere), then mid, then sharp
yield* all(
  delay(0.0, glowOuter().opacity(0.04, 0.6, easeOutCubic)),
  delay(0.06, glowMid().opacity(0.08, 0.5, easeOutCubic)),
  delay(0.12, glowInner().opacity(0.12, 0.4, easeOutCubic)),
  delay(0.10, hero().scale(1, 0.4, easeOutCubic)),
);
```

**Opacity scale:**
- Inner (sharp): 0.12-0.18 — most visible halo
- Mid (bloom): 0.06-0.10 — softens the halo edge
- Outer (haze): 0.03-0.05 — atmospheric bleed into background

### Rim Lighting (Directional Key Light)

Suggests an off-frame light source. Position at 1/3 offset (not center).

```typescript
const rimGlow = createRef<Circle>();

view.add(
  <Circle
    ref={rimGlow}
    size={400}
    x={layout.width / 3}        // 1/3 from center, NOT centered
    y={-layout.height / 3}      // upper third
    fill={'#d4b98c'}             // warm key light
    opacity={0}
    filters={[blur(80)]}
  />
);

yield* rimGlow().opacity(0.42, 0.5, easeOutCubic);
```

**Rule:** rim light positioned at one of the 4 thirds-grid intersections. Stays present through the scene (not animated out) until next section.

### Shadow Depth Dynamics

Shadows that respond to camera moves create depth perception.

```typescript
const card = createRef<Rect>();
const shadowDepth = createSignal<number>(20);

<Rect
  ref={card}
  size={[380, 280]}
  shadowOffsetY={() => shadowDepth() * 0.5}
  shadowBlur={() => shadowDepth() * 2.5}
  shadowOpacity={0.15}
  shadowColor={'#000'}
/>

// During camera push-in, shadow grows (card "lifts off" the plane)
yield* shadowDepth(48, 0.6, easeInOutCubic);
```

### Glow Color Shifts

The glow color animates during transitions — color motivation cues the audience.

```typescript
const glow = createRef<Circle>();

// Scene 1 hero: warm linen glow
yield* glow().fill('#d4b98c', 0);

// Scene 2 transition: shifts to sage
yield* glow().fill('#7a9e8e', 0.8, easeInOutCubic);
```

### Atmospheric Haze (Aerial Perspective)

Distant Layouts get progressive blur during push-in — simulates atmospheric perspective.

```typescript
const bgWorld = createRef<Layout>();

// During camera push-in
yield* all(
  world().scale(1.5, 0.85, easeInOutCubic),     // foreground zooms in
  bgWorld().scale(1.18, 0.85, easeInOutCubic),   // background zooms less (parallax)
  bgWorld().filters([blur(0)]).filters([blur(8)], 0.6),  // background hazes
);

// Pull-out reverses
yield* all(
  world().scale(1, 0.6, easeInOutCubic),
  bgWorld().scale(1, 0.6, easeInOutCubic),
  bgWorld().filters([blur(0)], 0.5),
);
```

---

## Color Animation Rules

### 60-30-10 Motion Rule

Each frame's color distribution should approximate:
- **60%** dominant color (background, fills, ambient glow)
- **30%** secondary color (typography, supporting illustrations)
- **10%** accent color (highlights, glyph fills, status indicators) — these can FLASH but not LINGER

**Verification heuristic:** open a rendered frame in any color picker. Pixel-area distribution should roughly match this ratio. If accent fills >15%, it's overwhelming.

### Semantic Data Colors

Data has meaning beyond brand aesthetic. Use semantic colors with rule-driven animation.

```typescript
// In brand.ts
export const dataColors = {
  positive: '#4ade80',  // green — improvement, success
  negative: '#f87171',  // red — caution, decrease
  neutral: '#94a3b8',   // gray — no change, info
} as const;

// Rules:
//   positive: enter with count-up + soft glow pulse (uplifting)
//   negative: enter with rest tone, no pulse (somber)
//   neutral: enter via opacity fade only (informational)
```

```typescript
// Positive metric animation
yield* all(
  metricRef().fill(dataColors.positive, 0),
  countUpMetric(metricRef, 12, 0.6, v => `+${v}%`),
  delay(0.4, glowRef().opacity(0.5, 0.2, easeOutCubic)),  // celebratory pulse
);

// Negative metric — no glow, just present
yield* all(
  metricRef().fill(dataColors.negative, 0),
  countUpMetric(metricRef, -8, 0.6, v => `${v} bpm`),
);
```

### VO-Emphasis Color Shift

When VO emphasizes a word, briefly tint it to accent color (~0.15s) then return.

```typescript
// Word "panic" emphasized in VO
yield* word().fill(colors.accent, 0.1, easeOutCubic);
yield* word().fill(colors.primary, 0.2, easeInOutCubic);
```

Combined with font-weight pulse:
```typescript
yield* all(
  word().fill(colors.accent, 0.1),
  word().fontWeight(700, 0.1),
);
yield* all(
  word().fill(colors.primary, 0.25, easeInOutCubic),
  word().fontWeight(500, 0.25, easeInOutCubic),
);
```

### Gradient Mesh Backgrounds

Replace flat fills with radial/linear gradients with animated stops. Higher production value than solid colors.

```typescript
import {useContext} from '@revideo/core';

useContext((ctx) => {
  const grad = ctx.createRadialGradient(
    960, 540, 100,           // inner circle center + radius
    960 + 200, 540 - 100, 800,  // outer (offset for asymmetric look)
  );
  grad.addColorStop(0, '#f7f4ec');
  grad.addColorStop(0.5, '#e8e2d5');
  grad.addColorStop(1, '#1f2a26');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1920, 1080);
});
```

**Animated gradient mesh** — animate the stops via signals:

```typescript
const gradStop = createSignal<number>(0);

useContext((ctx) => {
  const grad = ctx.createLinearGradient(0, 0, 1920, 0);
  grad.addColorStop(gradStop(), '#d4b98c');
  grad.addColorStop(1, '#f7f4ec');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1920, 1080);
});

yield* gradStop(0.8, 1.0, easeInOutCubic);  // gradient slides across
```

### Saturation Pulse (Emphasis Without Scale)

```typescript
const sat = createSignal<number>(1);

<Img src={'./hero.jpg'} filters={() => [saturate(sat())]} />

// Emphasis moment — pop saturation briefly
yield* sat(1.4, 0.15, easeOutCubic);
yield* sat(1.0, 0.25, easeInOutCubic);
```

---

## Composition Discipline

### Rule of Thirds

Hero elements at thirds intersections, not center. Add to `brand.ts`:

```typescript
export const composition = {
  thirdX: layout.width / 3,        // 640
  thirdY: layout.height / 3,        // 360
  thirdsTL: [-layout.width / 3, -layout.height / 3],  // [-640, -360]
  thirdsTR: [layout.width / 3, -layout.height / 3],
  thirdsBL: [-layout.width / 3, layout.height / 3],
  thirdsBR: [layout.width / 3, layout.height / 3],
} as const;
```

```typescript
// Hero positioned at top-third intersection (not center)
<Circle ref={hero} x={composition.thirdsTR[0]} y={composition.thirdsTR[1]} size={300} />
```

Camera moves land on thirds intersections, not center:

```typescript
const heroPos = [composition.thirdX, -composition.thirdY];
yield* all(
  world().position([-heroPos[0], -heroPos[1]], 1.0, easeInOutCubic),  // camera moves to hero
  world().scale(1.6, 1.0, easeInOutCubic),
);
```

### Asymmetric Staging

Centered compositions feel mechanical. Weight elements to one side.

```typescript
// BAD — three cards centered
<Layout layout direction={'row'} gap={40} alignItems={'center'}>
  {/* card1 */} {/* card2 */} {/* card3 */}
</Layout>

// GOOD — three cards weighted left, with negative space to right for typography
<Layout layout direction={'row'} gap={40} x={-200}>  // shift left
  {/* card1 */} {/* card2 */} {/* card3 */}
</Layout>
<Txt text={'Pattern recognition'} x={400} />  // typography fills right space
```

### Leading Lines

Background elements guide the eye toward the hero.

```typescript
// Hairlines that converge toward hero position
<Line points={[[-960, -100], [composition.thirdX, -composition.thirdY]]}
      stroke={colors.softNeutral} lineWidth={1} />
<Line points={[[960, -100], [composition.thirdX, -composition.thirdY]]}
      stroke={colors.softNeutral} lineWidth={1} />
// Particle drift directions point inward
```

### Negative Space Discipline (Breath Rule)

Every busy moment needs a 0.6-1.2s stillness afterward.

```typescript
yield* heroComplexAnimation();  // dense action
yield* waitFor(timing.hold);     // ENFORCED breath — minimum 0.6s
yield* nextSection();
```

**As a helper:**

```typescript
// In motion-helpers.ts
export function* breathHold(durationFromBrand: number = 0.6): ThreadGenerator {
  yield* waitFor(durationFromBrand);
}
```

### Visual Weight Balance

When one corner is dense, opposite corner gets a tiny anchor.

```typescript
// Dense content top-right → anchor dot bottom-left
<Rect ref={contentBlock} x={400} y={-300} />  // dense, off-center top-right
<Circle ref={anchorDot} x={-800} y={400} size={8} fill={colors.accent} />  // tiny anchor BL
```

---

## Audio-Driven Animation Sync

The sfx-manifest.json should drive animation timing, not just play sounds.

### Beat Grid Extraction

```typescript
import sfxManifest from '../sfx-manifest.json';

export default makeScene2D('scene1', function* (view) {
  // Pull beat grid for this scene
  const beats = (sfxManifest.scenes?.['scene1'] ?? []).map(entry => ({
    time: entry.start_offset_seconds,
    layer: entry.layer,         // 'foreground' | 'background' | 'accent' | 'ambient'
    category: entry.category,    // 'ui' | 'transition' | 'impact' | etc.
    duration: entry.duration_seconds,
  }));

  // Scene-level current-time tracker
  let sceneTime = 0;

  // Helper: yield* aligns animation to nearest upcoming beat
  function* alignTo(targetBeatIdx: number): ThreadGenerator {
    const target = beats[targetBeatIdx]?.time ?? 0;
    const delta = target - sceneTime;
    if (delta > 0) {
      yield* waitFor(delta);
      sceneTime = target;
    }
  }

  // ... use alignTo(0), alignTo(1), etc. between animation phases ...
});
```

### Anchor Animations to Beats

Instead of `delay(0.85, ...)` use beat references:

```typescript
// Beat 0 at scene start
yield* alignTo(0);
yield* heroEntrance();

// Beat 1 — text reveal
yield* alignTo(1);
yield* textReveal();

// Beat 2 — emphasis pulse
yield* alignTo(2);
yield* emphasisPulse();
```

### Silence Is a Beat

When manifest has no entry near expected time, pace animations slower (audience has nothing to anchor to).

```typescript
// If sceneTime - lastBeat > 0.8s, we're in silence territory
const silentZone = sceneTime - (beats[lastBeatIdx]?.time ?? 0) > 0.8;
const animationDuration = silentZone ? timing.beat * 1.5 : timing.beat;  // slower in silence
```

### Volume-Driven Motion Intensity

```typescript
// Match motion intensity to expected sound layer
function motionIntensity(layer: string): number {
  switch (layer) {
    case 'foreground': return 1.0;   // big animation
    case 'accent':     return 0.6;
    case 'ambient':    return 0.3;
    case 'background': return 0.2;
    default: return 0.5;
  }
}

const beat = beats[0];
yield* hero().scale(motionIntensity(beat.layer), 0.3);
```

### Anchor Types

```typescript
// sfx-plan.json entries have an anchor field
function resolveTime(entry: any, scriptVOData?: VOData): number {
  switch (entry.anchor) {
    case 'beat_offset':
      return entry.beat_offset;
    case 'absolute_seconds':
      return entry.absolute_seconds;
    case 'vo_word_index':
      // Requires VO timing data — provided via project variable or VO segmenter
      return scriptVOData?.wordTimes[entry.vo_word_index] ?? 0;
    default:
      return 0;
  }
}
```

### Fallback (Missing Manifest)

```typescript
let beats: BeatGrid = [];
try {
  beats = (sfxManifest.scenes?.['scene1'] ?? []).map(...);
} catch {
  beats = [];  // silent scene fallback
}

// alignTo gracefully no-ops when target beat doesn't exist
function* alignTo(idx: number) {
  const target = beats[idx]?.time;
  if (target === undefined) return;  // no-op
  // ... rest of impl
}
```

---

# Revideo-Specific Features

The following sections cover functionality unique to Revideo that extends beyond the Motion Canvas base.

---

## Revideo Overview

Revideo is an open-source framework for programmatic video editing, forked from Motion Canvas. While Motion Canvas is a standalone editor, Revideo is designed to be used as a library for building video editing applications.

### Key Differences from Motion Canvas

| Feature | Motion Canvas | Revideo |
|---------|--------------|---------|
| Purpose | Standalone editor | Library for apps |
| Rendering | UI button | Programmatic API |
| Audio | Project-level only | `<Audio>` component |
| Deployment | Local only | Cloud-ready |
| Player | Editor only | Embeddable components |

### Revideo Packages

```typescript
// Core packages (same as Motion Canvas, different namespace)
import {...} from '@revideo/core';
import {...} from '@revideo/2d';

// Revideo-specific packages
import {renderVideo} from '@revideo/renderer';
import {Player} from '@revideo/player-react';
```

| Package | Purpose |
|---------|---------|
| `@revideo/core` | Core animation engine, signals, flow control |
| `@revideo/2d` | 2D components and rendering |
| `@revideo/renderer` | Headless video rendering with Puppeteer |
| `@revideo/cli` | Command-line interface |
| `@revideo/player` | Web Component player |
| `@revideo/player-react` | React player component |
| `@revideo/ffmpeg` | FFmpeg utilities for video export |
| `@revideo/vite-plugin` | Vite integration |

---

## Headless Video Rendering

Revideo enables programmatic video rendering without a UI, using Puppeteer for headless browser execution.

### renderVideo Function

```typescript
import {renderVideo} from '@revideo/renderer';

const outputPath = await renderVideo({
  projectFile: './src/project.ts',
  variables: {username: 'John'},
  settings: {
    outFile: 'output.mp4',
    outDir: './videos',
    workers: 4,
  },
});
```

### RenderSettings Interface

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `outFile` | `string` | `'video.mp4'` | Output filename (.mp4, .webm, .mov) |
| `outDir` | `string` | `'./output'` | Output directory |
| `workers` | `number` | `1` | Parallel render workers |
| `viteBasePort` | `number` | `9000` | Base port for Vite servers |
| `logProgress` | `boolean` | `false` | Log progress to console |
| `progressCallback` | `(worker, progress) => void` | - | Progress callback (0-1) |
| `ffmpeg` | `FfmpegSettings` | - | FFmpeg configuration |
| `puppeteer` | `PuppeteerLaunchOptions` | - | Puppeteer launch options |
| `viteConfig` | `InlineConfig` | - | Vite configuration |
| `projectSettings` | `object` | - | Project-level settings |

### Complete Example

```typescript
import {renderVideo} from '@revideo/renderer';

async function render() {
  const outputPath = await renderVideo({
    projectFile: './src/project.ts',
    variables: {
      title: 'Welcome Video',
      username: 'Alice',
      backgroundColor: '#1a1a2e',
    },
    settings: {
      outFile: 'welcome.mp4',
      outDir: './output',
      workers: 4,
      logProgress: true,
      progressCallback: (worker, progress) => {
        console.log(`Worker ${worker}: ${(progress * 100).toFixed(1)}%`);
      },
      ffmpeg: {
        ffmpegLogLevel: 'error',
      },
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    },
  });

  console.log(`Video saved to: ${outputPath}`);
}
```

### Distributed Rendering with renderPartialVideo

For large-scale rendering, use `renderPartialVideo` to distribute work across multiple machines:

```typescript
import {renderPartialVideo} from '@revideo/renderer';

// Worker 0 of 4
const {audioFile, videoFile} = await renderPartialVideo({
  projectFile: './src/project.ts',
  variables: {title: 'My Video'},
  workerId: 0,
  numWorkers: 4,
  settings: {
    outFile: 'output.mp4',
  },
});
```

---

## Parameterized Videos

Create dynamic video templates by passing variables at render time.

### Accessing Variables in Scenes

```typescript
import {makeScene2D} from '@revideo/2d';
import {useScene} from '@revideo/core';

export default makeScene2D('myScene', function* (view) {
  // Get variable with default fallback
  const username = useScene().variables.get('username', 'Guest');
  const primaryColor = useScene().variables.get('primaryColor', '#ff0000');

  view.add(
    <Txt text={`Hello, ${username}!`} fill={primaryColor} />
  );
});
```

### Passing Variables via renderVideo

```typescript
import {renderVideo} from '@revideo/renderer';

await renderVideo({
  projectFile: './src/project.ts',
  variables: {
    username: 'Alice',
    primaryColor: '#00ff00',
    logoUrl: 'https://example.com/logo.png',
    items: ['Item 1', 'Item 2', 'Item 3'],
  },
});
```

### Passing Variables via Project Configuration

```typescript
// project.ts
import {makeProject} from '@revideo/core';
import myScene from './scenes/myScene?scene';

export default makeProject({
  scenes: [myScene],
  variables: {
    username: 'Default User',
    primaryColor: '#ff0000',
  },
});
```

### Complex Variable Types

Variables can include any JSON-serializable data:

```typescript
// Render call
await renderVideo({
  projectFile: './src/project.ts',
  variables: {
    // Strings
    title: 'Product Demo',

    // Numbers
    duration: 30,

    // Arrays
    features: ['Fast', 'Reliable', 'Secure'],

    // Objects
    branding: {
      primaryColor: '#1a1a2e',
      fontFamily: 'Inter',
      logoUrl: '/assets/logo.png',
    },

    // AI-generated content
    subtitles: [
      {text: 'Welcome', start: 0, end: 2},
      {text: 'to our product', start: 2, end: 4},
    ],
  },
});

// In scene
const subtitles = useScene().variables.get('subtitles', []);
const branding = useScene().variables.get('branding', {});
```

---

## CLI Commands

Revideo provides a CLI for development and rendering.

### Installation

```bash
npm install @revideo/cli
```

### revideo serve

Starts a development server with a render endpoint:

```bash
npx revideo serve --projectFile ./src/project.ts --port 4000
```

| Option | Default | Description |
|--------|---------|-------------|
| `--projectFile` | `./src/project.ts` | Path to project file |
| `--port` | `4000` | Server port |

The server exposes:
- `POST /render` - Render videos
- `GET /download/:filename` - Download rendered videos

### revideo editor

Starts the visual editor for development:

```bash
npx revideo editor --projectFile ./src/project.ts --port 9000
```

| Option | Default | Description |
|--------|---------|-------------|
| `--projectFile` | `./src/project.ts` | Path to project file |
| `--port` | `9000` | Editor port |

---

## Render Endpoint API

When using `revideo serve`, a REST API is exposed for rendering videos.

### POST /render

Render a video with optional variables.

#### Synchronous Response

```bash
curl -X POST http://localhost:4000/render \
  -H "Content-Type: application/json" \
  -d '{"variables": {"username": "Alice"}}'
```

Response:
```json
{
  "status": "success",
  "downloadLink": "http://localhost:4000/download/abc123.mp4"
}
```

#### With Callback URL

```bash
curl -X POST http://localhost:4000/render \
  -H "Content-Type: application/json" \
  -d '{
    "variables": {"username": "Alice"},
    "callbackUrl": "https://your-server.com/webhook"
  }'
```

Immediate response:
```json
{
  "tempProjectName": "abc123"
}
```

Callback POST to your server when complete:
```json
{
  "tempProjectName": "abc123",
  "status": "success",
  "downloadLink": "http://localhost:4000/download/abc123.mp4"
}
```

#### Streaming Progress (Server-Sent Events)

```bash
curl -X POST http://localhost:4000/render \
  -H "Content-Type: application/json" \
  -d '{
    "variables": {"username": "Alice"},
    "streamProgress": true
  }'
```

SSE stream:
```
event: progress
data: {"worker": 0, "progress": 0.25}

event: progress
data: {"worker": 0, "progress": 0.50}

event: progress
data: {"worker": 0, "progress": 0.75}

event: completed
data: {"status": "success", "downloadLink": "http://localhost:4000/download/abc123.mp4"}
```

### Request Body Schema

| Field | Type | Description |
|-------|------|-------------|
| `variables` | `object` | Variables to pass to the project |
| `callbackUrl` | `string` | Webhook URL for async rendering |
| `streamProgress` | `boolean` | Enable SSE progress streaming |
| `settings` | `RenderSettings` | Rendering settings |

### GET /download/:filename

Download a rendered video:

```bash
curl -O http://localhost:4000/download/abc123.mp4
```

---

## Player Components

Revideo provides embeddable player components for previewing videos in web applications.

### Web Component Player

The `<revideo-player>` custom element works in any web framework:

```html
<script type="module">
  import '@revideo/player';
</script>

<revideo-player
  src="/path/to/project.js"
  width="1920"
  height="1080"
  quality="1"
  auto="true"
  variables='{"username": "Alice"}'
></revideo-player>
```

#### Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `src` | `string` | URL to compiled project module |
| `width` | `number` | Player width |
| `height` | `number` | Player height |
| `quality` | `number` | Resolution scale (1 = 100%) |
| `auto` | `boolean\|'hover'` | Auto-play on load or hover |
| `variables` | `string` | JSON-encoded variables |

### React Player Component

```typescript
import {Player} from '@revideo/player-react';
import project from './project';

function VideoPreview() {
  return (
    <Player
      project={project}
      controls={true}
      variables={{username: 'Alice'}}
      playing={false}
      width={1920}
      height={1080}
      quality={1}
      fps={30}
      volume={1}
      looping={true}
      timeDisplayFormat="MM:SS"
      onDurationChange={(duration) => console.log('Duration:', duration)}
      onTimeUpdate={(time) => console.log('Time:', time)}
      onPlayerReady={(player) => console.log('Player ready:', player)}
      onPlayerResize={(rect) => console.log('Resized:', rect)}
    />
  );
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `project` | `Project` | required | Project instance |
| `controls` | `boolean` | `true` | Show playback controls |
| `variables` | `Record<string, any>` | `{}` | Dynamic variables |
| `playing` | `boolean` | `false` | Initial playing state |
| `currentTime` | `number` | `0` | Initial time position |
| `volume` | `number` | `1` | Volume (0-1) |
| `looping` | `boolean` | `true` | Loop playback |
| `fps` | `number` | `30` | Frames per second |
| `width` | `number` | - | Player width |
| `height` | `number` | - | Player height |
| `quality` | `number` | - | Resolution scale |
| `timeDisplayFormat` | `string` | `'MM:SS'` | Time format |

#### Callbacks

| Callback | Parameters | Description |
|----------|------------|-------------|
| `onDurationChange` | `(duration: number)` | Called when duration is known |
| `onTimeUpdate` | `(currentTime: number)` | Called on time changes |
| `onPlayerReady` | `(player: Player)` | Called when player initializes |
| `onPlayerResize` | `(rect: DOMRectReadOnly)` | Called on size changes |

---

## Audio Component

Revideo adds the `<Audio>` component for synchronized audio playback, which is not available in Motion Canvas.

### Basic Usage

```typescript
import {Audio} from '@revideo/2d';

export default makeScene2D('audioScene', function* (view) {
  view.add(
    <Audio
      src="https://example.com/audio.mp3"
      play={true}
      time={0}
      volume={1}
    />
  );

  yield* waitFor(5);
});
```

### Audio with Video

```typescript
import {Video, Audio} from '@revideo/2d';

export default makeScene2D('mediaScene', function* (view) {
  view.add(
    <>
      <Video
        src="https://example.com/video.mp4"
        size={['100%', '100%']}
        play={true}
      />
      <Audio
        src="https://example.com/background-music.mp3"
        play={true}
        time={17.0}  // Start at 17 seconds
        volume={0.5}
      />
    </>
  );

  yield* waitFor(10);
});
```

### MediaProps (Audio & Video)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `src` | `string` | required | Media URL |
| `play` | `boolean` | `false` | Auto-play on mount |
| `loop` | `boolean` | `false` | Loop playback |
| `time` | `number` | `0` | Start time offset (seconds) |
| `volume` | `number` | `1` | Volume level (0-1, or >1 with amplification) |
| `playbackRate` | `number` | `1` | Playback speed |
| `awaitCanPlay` | `boolean` | `true` | Wait for media ready |
| `allowVolumeAmplificationInPreview` | `boolean` | `false` | Enable >1 volume in preview |

### Controlling Audio

```typescript
const audioRef = createRef<Audio>();

view.add(
  <Audio ref={audioRef} src="audio.mp3" />
);

// Control methods
audioRef().play();
audioRef().pause();

// Get info
const currentTime = audioRef().getCurrentTime();
const duration = audioRef().getDuration();
const volume = audioRef().getVolume();
const isPlaying = audioRef().isPlaying();

// Set volume (supports >1 for amplification during export)
audioRef().setVolume(1.5);
```

### Syncing Audio with Animations

```typescript
export default makeScene2D('syncedScene', function* (view) {
  const audioRef = createRef<Audio>();
  const textRef = createRef<Txt>();

  view.add(
    <>
      <Audio ref={audioRef} src="narration.mp3" play={true} />
      <Txt ref={textRef} text="" fontSize={48} fill="white" />
    </>
  );

  // Sync text with audio timestamps
  yield* waitFor(1);
  yield* textRef().text('First line', 0.3);

  yield* waitFor(2);
  yield* textRef().text('Second line', 0.3);

  yield* waitFor(2);
  yield* textRef().text('Third line', 0.3);
});
```

---

## FFmpeg Configuration

Revideo uses FFmpeg for video encoding and audio processing.

### FFmpeg Settings in renderVideo

```typescript
await renderVideo({
  projectFile: './src/project.ts',
  settings: {
    outFile: 'output.mp4',
    ffmpeg: {
      ffmpegLogLevel: 'error',  // error | warning | info | verbose | debug | trace
      ffmpegPath: '/custom/path/to/ffmpeg',  // Custom FFmpeg binary
    },
  },
});
```

### Supported Output Formats

| Format | Extension | Audio Codec |
|--------|-----------|-------------|
| MP4 | `.mp4` | AAC |
| WebM | `.webm` | Opus |
| MOV | `.mov` | AAC |

### Specifying Output Format

```typescript
await renderVideo({
  projectFile: './src/project.ts',
  settings: {
    outFile: 'output.webm',  // Format determined by extension
  },
});
```

---

## Deployment & Production

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DISABLE_TELEMETRY` | Set to `true` to disable anonymous usage tracking |
| `PROJECT_FILE` | Default project file path |
| `REVIDEO_PORT` | Default server port |

```bash
DISABLE_TELEMETRY=true npx revideo serve
```

### Docker Deployment

```dockerfile
FROM node:20

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# Install dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
    --no-install-recommends

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

EXPOSE 4000
CMD ["npx", "revideo", "serve", "--port", "4000"]
```

### Google Cloud Run Deployment

```typescript
// Puppeteer settings for Cloud Run
await renderVideo({
  projectFile: './src/project.ts',
  settings: {
    puppeteer: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    },
  },
});
```

### Parallelized Cloud Rendering

For large-scale rendering, distribute work across Cloud Functions:

```typescript
// Coordinator function
async function coordinateRender(variables: object) {
  const numWorkers = 4;
  const promises = [];

  for (let i = 0; i < numWorkers; i++) {
    promises.push(
      callCloudFunction('render-worker', {
        variables,
        workerId: i,
        numWorkers,
      })
    );
  }

  const results = await Promise.all(promises);
  // Concatenate results...
}

// Worker function
async function workerRender({variables, workerId, numWorkers}) {
  const {audioFile, videoFile} = await renderPartialVideo({
    projectFile: './src/project.ts',
    variables,
    workerId,
    numWorkers,
  });

  // Upload to storage and return paths
  return {audioFile, videoFile};
}
```

---

## Revideo API Quick Reference

### Revideo-Specific Imports

```typescript
// Rendering
import {renderVideo, renderPartialVideo} from '@revideo/renderer';

// Player Components
import {Player} from '@revideo/player-react';
import '@revideo/player';  // Web component

// CLI (programmatic usage)
import {createServer} from '@revideo/cli';
```

### Import Mapping from Motion Canvas

| Motion Canvas | Revideo |
|---------------|---------|
| `@motion-canvas/core` | `@revideo/core` |
| `@motion-canvas/2d` | `@revideo/2d` |
| `@motion-canvas/vite-plugin` | `@revideo/vite-plugin` |
| `@motion-canvas/ui` | `@revideo/ui` |

### Scene Signature

```typescript
// Motion Canvas
makeScene2D(function* (view) {...})

// Revideo (requires scene name)
makeScene2D('sceneName', function* (view) {...})
```

### Quick Snippets

#### Render a Video
```typescript
import {renderVideo} from '@revideo/renderer';

await renderVideo({
  projectFile: './src/project.ts',
  variables: {title: 'Hello'},
  settings: {outFile: 'output.mp4'},
});
```

#### Access Project Variables
```typescript
const title = useScene().variables.get('title', 'Default');
```

#### Add Background Audio
```typescript
import {Audio} from '@revideo/2d';

view.add(<Audio src="music.mp3" play={true} volume={0.5} />);
```

#### Embed React Player
```typescript
import {Player} from '@revideo/player-react';
import project from './project';

<Player project={project} controls variables={{name: 'User'}} />
```

#### Start Render Server
```bash
npx revideo serve --port 4000
```

#### Call Render API
```bash
curl -X POST http://localhost:4000/render \
  -H "Content-Type: application/json" \
  -d '{"variables": {"name": "Alice"}}'
```

---

*For more information, see the [Revideo documentation](https://docs.re.video/) and [examples repository](https://github.com/redotvideo/revideo-examples).*