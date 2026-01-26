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
11. [Camera System](#camera-system)
12. [Media Components](#media-components)
13. [Code & LaTeX](#code--latex)
14. [Curves & Paths](#curves--paths)
15. [Filters & Effects](#filters--effects)
16. [Shaders](#shaders)
17. [References System](#references-system)
18. [Utilities](#utilities)
19. [Custom Components](#custom-components)
20. [Configuration](#configuration)

**Revideo-Specific Features:**
21. [Revideo Overview](#revideo-overview)
22. [Headless Video Rendering](#headless-video-rendering)
23. [Parameterized Videos](#parameterized-videos)
24. [CLI Commands](#cli-commands)
25. [Render Endpoint API](#render-endpoint-api)
26. [Player Components](#player-components)
27. [Audio Component](#audio-component)
28. [FFmpeg Configuration](#ffmpeg-configuration)
29. [Deployment & Production](#deployment--production)
30. [Revideo API Quick Reference](#revideo-api-quick-reference)

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
```typescript
import {spring, PlopSpring, SmoothSpring} from '@motion-canvas/core';

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

## Camera System

### Basic Camera
```typescript
import {Camera, Circle, Rect} from '@motion-canvas/2d';
import {createRef} from '@motion-canvas/core';

const camera = createRef<Camera>();

view.add(
  <Camera ref={camera}>
    <Rect position={[-100, 0]} />
    <Circle position={[100, 0]} />
  </Camera>
);

// Move camera
yield* camera().position([100, 50], 1);

// Center on node
yield* camera().centerOn(circleRef(), 1);
yield* camera().centerOn([x, y], 1);  // Or position

// Zoom
yield* camera().zoom(2, 1);      // Zoom in
yield* camera().zoom(0.5, 1);    // Zoom out

// Rotate
yield* camera().rotation(45, 1);

// Reset all
yield* camera().reset(1);

// Follow path
yield* camera().followCurve(splineRef(), 2, linear);
```

### Multiple Cameras
```typescript
const scene = (
  <Node>
    <Rect />
    <Circle />
  </Node>
);

const camera1 = createRef<Camera>();
const camera2 = createRef<Camera>();

view.add(
  <>
    <Camera.Stage
      cameraRef={camera1}
      scene={scene}
      size={[300, 200]}
      position={[-180, 0]}
    />
    <Camera.Stage
      cameraRef={camera2}
      scene={scene}
      size={[300, 200]}
      position={[180, 0]}
    />
  </>
);

// Animate independently
yield* all(
  camera1().centerOn(rect(), 1),
  camera2().centerOn(circle(), 1),
);
```

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
  Direction,
} from '@motion-canvas/core';
```

### 2D Imports
```typescript
import {
  // Components
  Node, Layout, Rect, Circle, Line, Polygon, Ray,
  Txt, Img, Video, Icon, Camera,

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
} from '@motion-canvas/2d';
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

*This reference covers Motion Canvas core capabilities. For detailed API documentation, see the [official API reference](https://motioncanvas.io/api/).*

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