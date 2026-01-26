import {makeScene2D, Rect, Circle, Line, Node, Path, blur} from '@revideo/2d';
import {
  all,
  chain,
  waitFor,
  createRef,
  createRefArray,
  easeOutBack,
  easeOutCubic,
  easeInOutCubic,
  easeOutElastic,
  easeInOutQuad,
  linear,
  loop,
  Vector2,
  Color,
} from '@revideo/core';

/**
 * Scene 5: Tutorials - Documents + Code
 * Theme: Andy Gole writing tutorials - documents multiplying, code elements
 * Duration: ~5 seconds
 * Visual: Document icons appearing and multiplying, code brackets, typing effect
 */

// Real Motion Brand Colors
const COLORS = {
  magenta: '#FF00FF',
  yellow: '#FFFF00',
  purple: '#800080',
  pink: '#E94E87',
  darkNavy: '#0F0E1F',
  neonGreen: '#55FF33',
  cyan: '#00FFFF',
  white: '#FFFFFF',
};

// Document icon path (simple document shape)
const DOCUMENT_PATH = 'M-15,-20 L10,-20 L15,-15 L15,20 L-15,20 Z M10,-20 L10,-15 L15,-15';

// Code bracket paths
const LEFT_BRACKET_PATH = 'M5,-15 L-5,-10 L-10,0 L-5,10 L5,15';
const RIGHT_BRACKET_PATH = 'M-5,-15 L5,-10 L10,0 L5,10 L-5,15';

// Pencil icon path
const PENCIL_PATH = 'M-2,-18 L2,-18 L3,-15 L3,12 L0,18 L-3,12 L-3,-15 Z';

export default makeScene2D('scene5', function* (view) {
  // Background
  const background = createRef<Rect>();

  // Scanline overlay
  const scanlineOverlay = createRef<Rect>();

  // Grid container
  const gridContainer = createRef<Node>();
  const gridLines = createRefArray<Line>();

  // Central document (main tutorial)
  const mainDocContainer = createRef<Node>();
  const mainDocGlowOuter = createRef<Circle>();
  const mainDocGlowInner = createRef<Circle>();
  const mainDoc = createRef<Path>();
  const mainDocLines = createRefArray<Rect>();

  // Multiplying documents
  const docContainers = createRefArray<Node>();
  const docGlows = createRefArray<Circle>();
  const docs = createRefArray<Path>();

  // Code brackets
  const leftBracketContainer = createRef<Node>();
  const leftBracket = createRef<Path>();
  const leftBracketGlow = createRef<Circle>();

  const rightBracketContainer = createRef<Node>();
  const rightBracket = createRef<Path>();
  const rightBracketGlow = createRef<Circle>();

  // Code lines (typing effect)
  const codeContainer = createRef<Node>();
  const codeLines = createRefArray<Rect>();
  const codeLineGlows = createRefArray<Rect>();

  // Pencil/writing elements
  const pencilContainer = createRef<Node>();
  const pencil = createRef<Path>();
  const pencilGlow = createRef<Circle>();
  const pencilTrail = createRefArray<Circle>();

  // Sparkle particles
  const sparkles = createRefArray<Circle>();
  const sparkleGlows = createRefArray<Circle>();

  // Floating text snippets (code-like)
  const textSnippets = createRefArray<Rect>();
  const textSnippetGlows = createRefArray<Rect>();

  // Progress indicators
  const progressDots = createRefArray<Circle>();
  const progressDotGlows = createRefArray<Circle>();

  // Knowledge particles
  const knowledgeParticles = createRefArray<Circle>();

  // Connection lines from pencil to documents
  const connectionLines = createRefArray<Line>();

  // Ripple effects
  const ripples = createRefArray<Circle>();

  // Energy pulses
  const energyPulses = createRefArray<Circle>();

  // Star bursts for achievements
  const starBursts = createRefArray<Path>();

  // Document positions (arranged in arc pattern)
  const documentPositions = [
    {x: -300, y: -120, delay: 0.1, scale: 0.7},
    {x: -200, y: -200, delay: 0.2, scale: 0.8},
    {x: -80, y: -250, delay: 0.3, scale: 0.75},
    {x: 80, y: -250, delay: 0.4, scale: 0.8},
    {x: 200, y: -200, delay: 0.5, scale: 0.7},
    {x: 300, y: -120, delay: 0.6, scale: 0.75},
    {x: -350, y: 50, delay: 0.7, scale: 0.65},
    {x: 350, y: 50, delay: 0.8, scale: 0.65},
    {x: -280, y: 180, delay: 0.9, scale: 0.6},
    {x: 280, y: 180, delay: 1.0, scale: 0.6},
    {x: -150, y: 220, delay: 1.1, scale: 0.55},
    {x: 150, y: 220, delay: 1.2, scale: 0.55},
  ];

  // Code line configurations
  const codeLineConfigs = [
    {width: 180, y: -60, delay: 0.0, color: COLORS.magenta},
    {width: 140, y: -30, delay: 0.1, color: COLORS.cyan},
    {width: 200, y: 0, delay: 0.2, color: COLORS.yellow},
    {width: 120, y: 30, delay: 0.3, color: COLORS.neonGreen},
    {width: 160, y: 60, delay: 0.4, color: COLORS.pink},
  ];

  // Sparkle positions
  const sparklePositions = [
    {x: -400, y: -300},
    {x: 400, y: -280},
    {x: -450, y: 100},
    {x: 450, y: 80},
    {x: -380, y: 280},
    {x: 380, y: 300},
    {x: -200, y: -350},
    {x: 200, y: -340},
    {x: 0, y: -380},
    {x: -500, y: -150},
    {x: 500, y: -120},
    {x: -480, y: 220},
    {x: 480, y: 200},
    {x: -100, y: 350},
    {x: 100, y: 340},
  ];

  // Progress dot positions
  const progressDotPositions = [
    {x: -180, y: 320},
    {x: -90, y: 320},
    {x: 0, y: 320},
    {x: 90, y: 320},
    {x: 180, y: 320},
  ];

  // Text snippet configurations
  const textSnippetConfigs = [
    {x: -420, y: -50, width: 60, height: 8},
    {x: -420, y: -30, width: 45, height: 8},
    {x: -420, y: -10, width: 55, height: 8},
    {x: 420, y: -50, width: 50, height: 8},
    {x: 420, y: -30, width: 65, height: 8},
    {x: 420, y: -10, width: 40, height: 8},
  ];

  // Build scene
  view.add(
    <>
      {/* Dark navy background */}
      <Rect
        ref={background}
        width={1920}
        height={1080}
        fill={COLORS.darkNavy}
      />

      {/* Animated grid */}
      <Node ref={gridContainer} opacity={0}>
        {/* Vertical grid lines */}
        {Array.from({length: 25}, (_, i) => {
          const x = -960 + i * 80;
          return (
            <Line
              ref={gridLines}
              key={`v-${i}`}
              points={[[x, -540], [x, 540]]}
              stroke={COLORS.purple}
              lineWidth={1}
              opacity={0.15}
            />
          );
        })}
        {/* Horizontal grid lines */}
        {Array.from({length: 15}, (_, i) => {
          const y = -540 + i * 80;
          return (
            <Line
              ref={gridLines}
              key={`h-${i}`}
              points={[[-960, y], [960, y]]}
              stroke={COLORS.purple}
              lineWidth={1}
              opacity={0.15}
            />
          );
        })}
      </Node>

      {/* Ripple effects container */}
      {Array.from({length: 5}, (_, i) => (
        <Circle
          ref={ripples}
          key={`ripple-${i}`}
          x={0}
          y={0}
          width={0}
          height={0}
          stroke={COLORS.magenta}
          lineWidth={2}
          opacity={0}
        />
      ))}

      {/* Energy pulses */}
      {Array.from({length: 8}, (_, i) => (
        <Circle
          ref={energyPulses}
          key={`pulse-${i}`}
          x={0}
          y={0}
          width={20}
          height={20}
          fill={COLORS.yellow}
          opacity={0}
          filters={[blur(8)]}
        />
      ))}

      {/* Knowledge particles */}
      {Array.from({length: 30}, (_, i) => (
        <Circle
          ref={knowledgeParticles}
          key={`knowledge-${i}`}
          x={0}
          y={400}
          width={6}
          height={6}
          fill={i % 3 === 0 ? COLORS.magenta : i % 3 === 1 ? COLORS.yellow : COLORS.cyan}
          opacity={0}
          filters={[blur(3)]}
        />
      ))}

      {/* Connection lines */}
      {Array.from({length: 12}, (_, i) => (
        <Line
          ref={connectionLines}
          key={`conn-${i}`}
          points={[[0, 0], [0, 0]]}
          stroke={COLORS.cyan}
          lineWidth={2}
          opacity={0}
          lineDash={[8, 4]}
          filters={[blur(2)]}
        />
      ))}

      {/* Left bracket container */}
      <Node ref={leftBracketContainer} x={-280} y={0} opacity={0} scale={0}>
        <Circle
          ref={leftBracketGlow}
          width={120}
          height={120}
          fill={COLORS.magenta}
          opacity={0.3}
          filters={[blur(30)]}
        />
        <Path
          ref={leftBracket}
          data={LEFT_BRACKET_PATH}
          stroke={COLORS.magenta}
          lineWidth={8}
          lineCap={'round'}
          scale={3}
        />
      </Node>

      {/* Right bracket container */}
      <Node ref={rightBracketContainer} x={280} y={0} opacity={0} scale={0}>
        <Circle
          ref={rightBracketGlow}
          width={120}
          height={120}
          fill={COLORS.magenta}
          opacity={0.3}
          filters={[blur(30)]}
        />
        <Path
          ref={rightBracket}
          data={RIGHT_BRACKET_PATH}
          stroke={COLORS.magenta}
          lineWidth={8}
          lineCap={'round'}
          scale={3}
        />
      </Node>

      {/* Code lines container (between brackets) */}
      <Node ref={codeContainer} opacity={0}>
        {codeLineConfigs.map((config, i) => (
          <Node key={`code-line-${i}`}>
            <Rect
              ref={codeLineGlows}
              x={0}
              y={config.y}
              width={0}
              height={12}
              fill={config.color}
              opacity={0.4}
              radius={6}
              filters={[blur(10)]}
            />
            <Rect
              ref={codeLines}
              x={0}
              y={config.y}
              width={0}
              height={8}
              fill={config.color}
              radius={4}
            />
          </Node>
        ))}
      </Node>

      {/* Multiplying documents */}
      {documentPositions.map((pos, i) => (
        <Node
          ref={docContainers}
          key={`doc-container-${i}`}
          x={pos.x}
          y={pos.y}
          opacity={0}
          scale={0}
        >
          <Circle
            ref={docGlows}
            width={80}
            height={80}
            fill={i % 2 === 0 ? COLORS.yellow : COLORS.cyan}
            opacity={0.25}
            filters={[blur(20)]}
          />
          <Path
            ref={docs}
            data={DOCUMENT_PATH}
            fill={i % 2 === 0 ? COLORS.yellow : COLORS.cyan}
            stroke={COLORS.white}
            lineWidth={2}
            scale={pos.scale * 1.5}
          />
          {/* Document lines */}
          <Rect
            x={-5 * pos.scale}
            y={-5 * pos.scale}
            width={15 * pos.scale}
            height={3}
            fill={COLORS.darkNavy}
            radius={1}
          />
          <Rect
            x={-5 * pos.scale}
            y={3 * pos.scale}
            width={20 * pos.scale}
            height={3}
            fill={COLORS.darkNavy}
            radius={1}
          />
          <Rect
            x={-5 * pos.scale}
            y={11 * pos.scale}
            width={12 * pos.scale}
            height={3}
            fill={COLORS.darkNavy}
            radius={1}
          />
        </Node>
      ))}

      {/* Main document (center, writing in progress) */}
      <Node ref={mainDocContainer} x={0} y={50} opacity={0} scale={0}>
        <Circle
          ref={mainDocGlowOuter}
          width={250}
          height={250}
          fill={COLORS.magenta}
          opacity={0.2}
          filters={[blur(50)]}
        />
        <Circle
          ref={mainDocGlowInner}
          width={150}
          height={150}
          fill={COLORS.yellow}
          opacity={0.3}
          filters={[blur(25)]}
        />
        <Path
          ref={mainDoc}
          data={DOCUMENT_PATH}
          fill={COLORS.white}
          stroke={COLORS.magenta}
          lineWidth={4}
          scale={3}
        />
        {/* Animated writing lines on main doc */}
        {Array.from({length: 6}, (_, i) => (
          <Rect
            ref={mainDocLines}
            key={`main-line-${i}`}
            x={-20}
            y={-25 + i * 15}
            width={0}
            height={6}
            fill={i % 2 === 0 ? COLORS.magenta : COLORS.cyan}
            radius={3}
          />
        ))}
      </Node>

      {/* Pencil container */}
      <Node ref={pencilContainer} x={80} y={-30} opacity={0} scale={0}>
        <Circle
          ref={pencilGlow}
          width={60}
          height={60}
          fill={COLORS.neonGreen}
          opacity={0.4}
          filters={[blur(15)]}
        />
        <Path
          ref={pencil}
          data={PENCIL_PATH}
          fill={COLORS.neonGreen}
          stroke={COLORS.white}
          lineWidth={2}
          scale={1.5}
          rotation={-30}
        />
        {/* Pencil trail particles */}
        {Array.from({length: 8}, (_, i) => (
          <Circle
            ref={pencilTrail}
            key={`trail-${i}`}
            x={-10 - i * 8}
            y={20 + i * 5}
            width={8 - i * 0.8}
            height={8 - i * 0.8}
            fill={COLORS.neonGreen}
            opacity={0}
            filters={[blur(3)]}
          />
        ))}
      </Node>

      {/* Text snippets (floating code fragments) */}
      {textSnippetConfigs.map((config, i) => (
        <Node key={`text-snippet-${i}`}>
          <Rect
            ref={textSnippetGlows}
            x={config.x}
            y={config.y}
            width={config.width}
            height={config.height + 4}
            fill={i % 2 === 0 ? COLORS.cyan : COLORS.yellow}
            opacity={0}
            radius={4}
            filters={[blur(8)]}
          />
          <Rect
            ref={textSnippets}
            x={config.x}
            y={config.y}
            width={config.width}
            height={config.height}
            fill={i % 2 === 0 ? COLORS.cyan : COLORS.yellow}
            opacity={0}
            radius={4}
          />
        </Node>
      ))}

      {/* Progress dots */}
      {progressDotPositions.map((pos, i) => (
        <Node key={`progress-${i}`}>
          <Circle
            ref={progressDotGlows}
            x={pos.x}
            y={pos.y}
            width={30}
            height={30}
            fill={COLORS.magenta}
            opacity={0}
            filters={[blur(12)]}
          />
          <Circle
            ref={progressDots}
            x={pos.x}
            y={pos.y}
            width={16}
            height={16}
            fill={COLORS.darkNavy}
            stroke={COLORS.magenta}
            lineWidth={3}
            opacity={0}
          />
        </Node>
      ))}

      {/* Sparkles */}
      {sparklePositions.map((pos, i) => (
        <Node key={`sparkle-${i}`}>
          <Circle
            ref={sparkleGlows}
            x={pos.x}
            y={pos.y}
            width={20}
            height={20}
            fill={i % 3 === 0 ? COLORS.magenta : i % 3 === 1 ? COLORS.yellow : COLORS.cyan}
            opacity={0}
            filters={[blur(10)]}
          />
          <Circle
            ref={sparkles}
            x={pos.x}
            y={pos.y}
            width={8}
            height={8}
            fill={COLORS.white}
            opacity={0}
          />
        </Node>
      ))}

      {/* Scanline overlay */}
      <Rect
        ref={scanlineOverlay}
        width={1920}
        height={1080}
        opacity={0}
      >
        {Array.from({length: 135}, (_, i) => (
          <Rect
            key={`scanline-${i}`}
            y={-540 + i * 8}
            width={1920}
            height={2}
            fill={'#000000'}
            opacity={0.08}
          />
        ))}
      </Rect>
    </>
  );

  // Animation sequence

  // Phase 1: Grid and atmosphere fade in (0.0 - 0.3s)
  yield* all(
    gridContainer().opacity(1, 0.12, easeOutCubic),
    scanlineOverlay().opacity(1, 0.12, easeOutCubic),
  );

  // Phase 2: Main document appears with pencil (0.3 - 0.8s)
  yield* all(
    mainDocContainer().opacity(1, 0.16, easeOutCubic),
    mainDocContainer().scale(1, 0.2, easeOutBack),
  );

  // Pencil appears
  yield* all(
    pencilContainer().opacity(1, 0.12, easeOutCubic),
    pencilContainer().scale(1, 0.16, easeOutBack),
  );

  // Phase 3: Writing animation on main document (0.8 - 1.5s)
  // Lines appear one by one with typing effect
  const lineWidths = [35, 45, 30, 50, 25, 40];

  yield* all(
    ...mainDocLines.map((line, i) =>
      chain(
        waitFor(i * 0.032),
        line.width(lineWidths[i], 0.08, easeOutCubic),
      )
    ),
    // Pencil moves as writing
    pencilContainer().y(-30 + 60, 0.2, easeInOutCubic),
    // Trail particles appear
    ...pencilTrail.map((particle, i) =>
      chain(
        waitFor(i * 0.02),
        all(
          particle.opacity(0.6 - i * 0.06, 0.04),
        ),
      )
    ),
  );

  // Phase 4: Code brackets appear (1.5 - 2.0s)
  yield* all(
    leftBracketContainer().opacity(1, 0.12, easeOutCubic),
    leftBracketContainer().scale(1, 0.16, easeOutBack),
    rightBracketContainer().opacity(1, 0.12, easeOutCubic),
    rightBracketContainer().scale(1, 0.16, easeOutBack),
  );

  // Code lines typing effect
  yield* codeContainer().opacity(1, 0.08);

  yield* all(
    ...codeLines.map((line, i) =>
      chain(
        waitFor(codeLineConfigs[i].delay * 0.4),
        line.width(codeLineConfigs[i].width, 0.12, easeOutCubic),
      )
    ),
    ...codeLineGlows.map((glow, i) =>
      chain(
        waitFor(codeLineConfigs[i].delay * 0.4),
        glow.width(codeLineConfigs[i].width + 20, 0.12, easeOutCubic),
      )
    ),
  );

  // Phase 5: Documents multiply outward (2.0 - 3.2s)
  yield* all(
    ...docContainers.map((container, i) =>
      chain(
        waitFor(documentPositions[i].delay * 0.32),
        all(
          container.opacity(1, 0.12, easeOutCubic),
          container.scale(1, 0.16, easeOutBack),
        ),
      )
    ),
  );

  // Connection lines draw from center to documents
  yield* all(
    ...connectionLines.map((line, i) => {
      const targetPos = documentPositions[i];
      return chain(
        waitFor(documentPositions[i].delay * 0.2),
        all(
          line.opacity(0.5, 0.08),
          line.points([[0, 50], [targetPos.x, targetPos.y]], 0.16, easeOutCubic),
        ),
      );
    }),
  );

  // Phase 6: Text snippets and progress (3.2 - 3.8s)
  yield* all(
    ...textSnippets.map((snippet, i) =>
      chain(
        waitFor(i * 0.032),
        snippet.opacity(0.8, 0.12, easeOutCubic),
      )
    ),
    ...textSnippetGlows.map((glow, i) =>
      chain(
        waitFor(i * 0.032),
        glow.opacity(0.4, 0.12, easeOutCubic),
      )
    ),
  );

  // Progress dots fill in
  yield* all(
    ...progressDots.map((dot, i) =>
      chain(
        waitFor(i * 0.04),
        all(
          dot.opacity(1, 0.08),
          progressDotGlows[i].opacity(0.5, 0.08),
        ),
      )
    ),
  );

  // Fill progress dots one by one
  yield* all(
    ...progressDots.map((dot, i) =>
      chain(
        waitFor(i * 0.06),
        dot.fill(COLORS.magenta, 0.08, easeOutCubic),
      )
    ),
  );

  // Phase 7: Knowledge particles rise (3.8 - 4.3s)
  yield* all(
    ...knowledgeParticles.map((particle, i) => {
      const targetX = -400 + (i % 10) * 80 + Math.random() * 40;
      const targetY = -300 + Math.random() * 200;
      return chain(
        waitFor(i * 0.012),
        all(
          particle.opacity(0.7, 0.08),
          particle.x(targetX, 0.6, easeOutCubic),
          particle.y(targetY, 0.6, easeOutCubic),
        ),
      );
    }),
  );

  // Phase 8: Sparkles twinkle (4.3 - 4.6s)
  yield* all(
    ...sparkles.map((sparkle, i) =>
      chain(
        waitFor(i * 0.016),
        all(
          sparkle.opacity(1, 0.06),
          sparkleGlows[i].opacity(0.6, 0.06),
          sparkle.scale(1.3, 0.06, easeOutBack),
        ),
      )
    ),
  );

  // Phase 9: Ripple effects from center (4.6 - 5.0s)
  yield* all(
    ...ripples.map((ripple, i) =>
      chain(
        waitFor(i * 0.06),
        all(
          ripple.opacity(0.6, 0.04),
          ripple.width(400 + i * 150, 0.32, easeOutCubic),
          ripple.height(400 + i * 150, 0.32, easeOutCubic),
          ripple.opacity(0, 0.32, easeOutCubic),
        ),
      )
    ),
  );

  // Energy pulses fly outward
  yield* all(
    ...energyPulses.map((pulse, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const targetX = Math.cos(angle) * 500;
      const targetY = Math.sin(angle) * 350;
      return chain(
        waitFor(i * 0.02),
        all(
          pulse.opacity(0.8, 0.04),
          pulse.x(targetX, 0.24, easeOutCubic),
          pulse.y(targetY, 0.24, easeOutCubic),
          pulse.opacity(0, 0.24),
          pulse.scale(0.3, 0.24),
        ),
      );
    }),
  );

  // Final pulse on main document
  yield* all(
    mainDocGlowOuter().scale(1.3, 0.12, easeOutCubic),
    mainDocGlowOuter().opacity(0.4, 0.12, easeOutCubic),
    mainDocGlowInner().scale(1.2, 0.12, easeOutCubic),
  );

  // Sparkle pulse
  yield* all(
    ...sparkles.map((sparkle, i) =>
      chain(
        waitFor(i * 0.008),
        all(
          sparkle.scale(1.5, 0.08, easeOutBack),
          sparkle.opacity(0.8, 0.08),
        ),
      )
    ),
  );

  // Hold final frame
  yield* waitFor(0.12);

  // Ambient animations for hold
  yield* all(
    // Documents gentle float
    ...docContainers.map((container, i) =>
      container.y(documentPositions[i].y - 5, 0.16, easeInOutQuad)
    ),
    // Code lines subtle pulse
    ...codeLineGlows.map((glow, i) =>
      glow.opacity(0.6, 0.12, easeInOutQuad)
    ),
    // Main doc glow pulse
    mainDocGlowOuter().opacity(0.3, 0.16, easeInOutQuad),
  );

  // Reverse float
  yield* all(
    ...docContainers.map((container, i) =>
      container.y(documentPositions[i].y, 0.16, easeInOutQuad)
    ),
    ...codeLineGlows.map((glow, i) =>
      glow.opacity(0.4, 0.12, easeInOutQuad)
    ),
    mainDocGlowOuter().opacity(0.2, 0.16, easeInOutQuad),
  );

  // Phase 10: Additional visual polish

  // Pencil continues writing motion
  yield* all(
    pencilContainer().rotation(5, 0.12, easeInOutQuad),
    pencilGlow().scale(1.2, 0.12, easeOutCubic),
  );

  yield* all(
    pencilContainer().rotation(-5, 0.12, easeInOutQuad),
    pencilGlow().scale(1, 0.12, easeOutCubic),
  );

  // Trail particles fade and regenerate
  yield* all(
    ...pencilTrail.map((particle, i) =>
      chain(
        particle.opacity(0.3, 0.08),
        particle.opacity(0.5, 0.08),
      )
    ),
  );

  // Second wave of sparkle animations
  yield* all(
    ...sparkles.map((sparkle, i) =>
      chain(
        waitFor(i * 0.008),
        all(
          sparkle.scale(0.8, 0.06),
          sparkleGlows[i].opacity(0.3, 0.06),
        ),
      )
    ),
  );

  yield* all(
    ...sparkles.map((sparkle, i) =>
      chain(
        waitFor(i * 0.008),
        all(
          sparkle.scale(1.2, 0.06, easeOutBack),
          sparkleGlows[i].opacity(0.6, 0.06),
        ),
      )
    ),
  );

  // Connection lines pulse
  yield* all(
    ...connectionLines.map((line, i) =>
      chain(
        waitFor(i * 0.012),
        all(
          line.opacity(0.8, 0.08),
          line.lineWidth(3, 0.08),
        ),
      )
    ),
  );

  yield* all(
    ...connectionLines.map((line, i) =>
      chain(
        waitFor(i * 0.012),
        all(
          line.opacity(0.5, 0.08),
          line.lineWidth(2, 0.08),
        ),
      )
    ),
  );

  // Documents subtle scale pulse
  yield* all(
    ...docContainers.map((container, i) =>
      chain(
        waitFor(i * 0.02),
        container.scale(1.05, 0.08, easeOutCubic),
      )
    ),
  );

  yield* all(
    ...docContainers.map((container, i) =>
      chain(
        waitFor(i * 0.02),
        container.scale(1, 0.08, easeOutCubic),
      )
    ),
  );

  // Progress dots glow enhancement
  yield* all(
    ...progressDotGlows.map((glow, i) =>
      chain(
        waitFor(i * 0.032),
        glow.scale(1.5, 0.12, easeOutCubic),
      )
    ),
  );

  yield* all(
    ...progressDotGlows.map((glow, i) =>
      chain(
        waitFor(i * 0.032),
        glow.scale(1, 0.12, easeOutCubic),
      )
    ),
  );

  // Knowledge particles continue rising
  yield* all(
    ...knowledgeParticles.map((particle, i) =>
      particle.y(particle.y() - 50, 0.2, easeOutCubic)
    ),
  );

  // Main document final emphasis
  yield* all(
    mainDoc().scale(3.2, 0.12, easeOutCubic),
    mainDocGlowInner().scale(1.4, 0.12, easeOutCubic),
    mainDocGlowInner().opacity(0.5, 0.12, easeOutCubic),
  );

  yield* all(
    mainDoc().scale(3, 0.12, easeOutCubic),
    mainDocGlowInner().scale(1.2, 0.12, easeOutCubic),
    mainDocGlowInner().opacity(0.3, 0.12, easeOutCubic),
  );

  // Brackets subtle animation
  yield* all(
    leftBracket().scale(3.1, 0.08, easeOutCubic),
    rightBracket().scale(3.1, 0.08, easeOutCubic),
    leftBracketGlow().scale(1.2, 0.08, easeOutCubic),
    rightBracketGlow().scale(1.2, 0.08, easeOutCubic),
  );

  yield* all(
    leftBracket().scale(3, 0.08, easeOutCubic),
    rightBracket().scale(3, 0.08, easeOutCubic),
    leftBracketGlow().scale(1, 0.08, easeOutCubic),
    rightBracketGlow().scale(1, 0.08, easeOutCubic),
  );

  // Text snippets fade in more
  yield* all(
    ...textSnippets.map((snippet, i) =>
      snippet.opacity(1, 0.08)
    ),
    ...textSnippetGlows.map((glow, i) =>
      glow.opacity(0.6, 0.08)
    ),
  );

  // Final ambient hold
  yield* waitFor(0.08);

  // Grid subtle pulse
  yield* gridContainer().opacity(0.8, 0.08);
  yield* gridContainer().opacity(1, 0.08);

  // Final sparkle burst
  yield* all(
    ...sparkles.slice(0, 8).map((sparkle, i) =>
      chain(
        waitFor(i * 0.012),
        all(
          sparkle.scale(1.8, 0.06, easeOutBack),
          sparkleGlows[i].opacity(0.8, 0.06),
        ),
      )
    ),
  );

  yield* all(
    ...sparkles.slice(0, 8).map((sparkle, i) =>
      chain(
        waitFor(i * 0.012),
        all(
          sparkle.scale(1, 0.06),
          sparkleGlows[i].opacity(0.5, 0.06),
        ),
      )
    ),
  );

  // Additional document animations

  // Documents wobble
  yield* all(
    ...docContainers.map((container, i) =>
      chain(
        waitFor(i * 0.012),
        container.rotation(3, 0.06, easeInOutQuad),
      )
    ),
  );

  yield* all(
    ...docContainers.map((container, i) =>
      chain(
        waitFor(i * 0.012),
        container.rotation(-3, 0.06, easeInOutQuad),
      )
    ),
  );

  yield* all(
    ...docContainers.map((container, i) =>
      chain(
        waitFor(i * 0.012),
        container.rotation(0, 0.06, easeInOutQuad),
      )
    ),
  );

  // Code lines typing continuation
  yield* all(
    ...codeLines.map((line, i) =>
      chain(
        waitFor(i * 0.02),
        line.width(codeLineConfigs[i].width + 20, 0.08, easeOutCubic),
      )
    ),
  );

  yield* all(
    ...codeLines.map((line, i) =>
      chain(
        waitFor(i * 0.02),
        line.width(codeLineConfigs[i].width, 0.08, easeOutCubic),
      )
    ),
  );

  // Pencil final flourish
  yield* all(
    pencilContainer().y(pencilContainer().y() - 20, 0.08, easeOutCubic),
    pencil().rotation(-45, 0.08, easeOutCubic),
  );

  yield* all(
    pencilContainer().y(pencilContainer().y() + 20, 0.08, easeOutCubic),
    pencil().rotation(-30, 0.08, easeOutCubic),
  );

  // Energy pulse finale
  yield* all(
    ...energyPulses.map((pulse, i) => {
      pulse.x(0);
      pulse.y(0);
      pulse.opacity(0);
      pulse.scale(1);
      const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
      const targetX = Math.cos(angle) * 450;
      const targetY = Math.sin(angle) * 300;
      return chain(
        waitFor(i * 0.016),
        all(
          pulse.opacity(0.7, 0.04),
          pulse.x(targetX, 0.2, easeOutCubic),
          pulse.y(targetY, 0.2, easeOutCubic),
          pulse.opacity(0, 0.2),
        ),
      );
    }),
  );

  // Ripples final wave
  yield* all(
    ...ripples.map((ripple, i) => {
      ripple.width(0);
      ripple.height(0);
      ripple.opacity(0);
      return chain(
        waitFor(i * 0.04),
        all(
          ripple.opacity(0.4, 0.04),
          ripple.width(300 + i * 100, 0.24, easeOutCubic),
          ripple.height(300 + i * 100, 0.24, easeOutCubic),
          ripple.opacity(0, 0.24),
        ),
      );
    }),
  );

  // Main doc lines extend
  yield* all(
    ...mainDocLines.map((line, i) =>
      chain(
        waitFor(i * 0.02),
        line.width(lineWidths[i] + 10, 0.08, easeOutCubic),
      )
    ),
  );

  // Connection lines final pulse
  yield* all(
    ...connectionLines.map((line, i) =>
      chain(
        waitFor(i * 0.008),
        all(
          line.stroke(COLORS.magenta, 0.08),
          line.opacity(0.7, 0.08),
        ),
      )
    ),
  );

  yield* all(
    ...connectionLines.map((line, i) =>
      chain(
        waitFor(i * 0.008),
        all(
          line.stroke(COLORS.cyan, 0.08),
          line.opacity(0.5, 0.08),
        ),
      )
    ),
  );

  // Documents glow enhancement
  yield* all(
    ...docGlows.map((glow, i) =>
      chain(
        waitFor(i * 0.016),
        glow.opacity(0.4, 0.08, easeOutCubic),
      )
    ),
  );

  yield* all(
    ...docGlows.map((glow, i) =>
      chain(
        waitFor(i * 0.016),
        glow.opacity(0.25, 0.08, easeOutCubic),
      )
    ),
  );

  // Knowledge particles drift
  yield* all(
    ...knowledgeParticles.map((particle, i) =>
      chain(
        particle.x(particle.x() + (i % 2 === 0 ? 20 : -20), 0.16, easeInOutQuad),
      )
    ),
  );

  yield* all(
    ...knowledgeParticles.map((particle, i) =>
      chain(
        particle.x(particle.x() + (i % 2 === 0 ? -20 : 20), 0.16, easeInOutQuad),
      )
    ),
  );

  // Text snippets subtle pulse
  yield* all(
    ...textSnippets.map((snippet, i) =>
      chain(
        waitFor(i * 0.02),
        snippet.scale(1.1, 0.06, easeOutCubic),
      )
    ),
  );

  yield* all(
    ...textSnippets.map((snippet, i) =>
      chain(
        waitFor(i * 0.02),
        snippet.scale(1, 0.06, easeOutCubic),
      )
    ),
  );

  // Progress dots bounce
  yield* all(
    ...progressDots.map((dot, i) =>
      chain(
        waitFor(i * 0.024),
        dot.y(progressDotPositions[i].y - 5, 0.06, easeOutCubic),
      )
    ),
  );

  yield* all(
    ...progressDots.map((dot, i) =>
      chain(
        waitFor(i * 0.024),
        dot.y(progressDotPositions[i].y, 0.06, easeOutCubic),
      )
    ),
  );

  // Final hold
  yield* waitFor(0.08);

  // Scanline intensify briefly
  yield* scanlineOverlay().opacity(0.8, 0.04);
  yield* scanlineOverlay().opacity(1, 0.04);

  // All glows pulse together
  yield* all(
    mainDocGlowOuter().opacity(0.35, 0.08),
    mainDocGlowInner().opacity(0.45, 0.08),
    leftBracketGlow().opacity(0.45, 0.08),
    rightBracketGlow().opacity(0.45, 0.08),
    pencilGlow().opacity(0.55, 0.08),
    ...docGlows.map(glow => glow.opacity(0.4, 0.08)),
    ...progressDotGlows.map(glow => glow.opacity(0.65, 0.08)),
    ...sparkleGlows.map(glow => glow.opacity(0.7, 0.08)),
  );

  yield* all(
    mainDocGlowOuter().opacity(0.2, 0.08),
    mainDocGlowInner().opacity(0.3, 0.08),
    leftBracketGlow().opacity(0.3, 0.08),
    rightBracketGlow().opacity(0.3, 0.08),
    pencilGlow().opacity(0.4, 0.08),
    ...docGlows.map(glow => glow.opacity(0.25, 0.08)),
    ...progressDotGlows.map(glow => glow.opacity(0.5, 0.08)),
    ...sparkleGlows.map(glow => glow.opacity(0.5, 0.08)),
  );

  // Pencil trail final animation
  yield* all(
    ...pencilTrail.map((particle, i) =>
      chain(
        waitFor(i * 0.012),
        all(
          particle.scale(1.3, 0.06, easeOutCubic),
          particle.opacity(0.7 - i * 0.07, 0.06),
        ),
      )
    ),
  );

  yield* all(
    ...pencilTrail.map((particle, i) =>
      chain(
        waitFor(i * 0.012),
        all(
          particle.scale(1, 0.06, easeOutCubic),
          particle.opacity(0.5 - i * 0.05, 0.06),
        ),
      )
    ),
  );

  // Documents final float
  yield* all(
    ...docContainers.map((container, i) =>
      container.y(documentPositions[i].y - 8, 0.12, easeInOutQuad)
    ),
  );

  yield* all(
    ...docContainers.map((container, i) =>
      container.y(documentPositions[i].y, 0.12, easeInOutQuad)
    ),
  );

  // Main document content shimmer
  yield* all(
    ...mainDocLines.map((line, i) =>
      chain(
        waitFor(i * 0.016),
        all(
          line.opacity(0.7, 0.06),
        ),
      )
    ),
  );

  yield* all(
    ...mainDocLines.map((line, i) =>
      chain(
        waitFor(i * 0.016),
        all(
          line.opacity(1, 0.06),
        ),
      )
    ),
  );

  // Code container subtle shift
  yield* codeContainer().x(5, 0.08, easeInOutQuad);
  yield* codeContainer().x(0, 0.08, easeInOutQuad);

  // Brackets breathe
  yield* all(
    leftBracketContainer().x(-285, 0.1, easeInOutQuad),
    rightBracketContainer().x(285, 0.1, easeInOutQuad),
  );

  yield* all(
    leftBracketContainer().x(-280, 0.1, easeInOutQuad),
    rightBracketContainer().x(280, 0.1, easeInOutQuad),
  );

  // Final sparkle twinkle
  yield* all(
    ...sparkles.map((sparkle, i) =>
      chain(
        waitFor(i * 0.008),
        all(
          sparkle.opacity(0.5, 0.04),
        ),
      )
    ),
  );

  yield* all(
    ...sparkles.map((sparkle, i) =>
      chain(
        waitFor(i * 0.008),
        all(
          sparkle.opacity(1, 0.04),
        ),
      )
    ),
  );

  // Grid final pulse
  yield* all(
    ...gridLines.map((line, i) =>
      chain(
        waitFor(i * 0.002),
        line.opacity(0.2, 0.06),
      )
    ),
  );

  yield* all(
    ...gridLines.map((line, i) =>
      chain(
        waitFor(i * 0.002),
        line.opacity(0.15, 0.06),
      )
    ),
  );

  // Knowledge particles fade out preparation
  yield* all(
    ...knowledgeParticles.map((particle, i) =>
      particle.opacity(0.5, 0.12)
    ),
  );

  yield* all(
    ...knowledgeParticles.map((particle, i) =>
      particle.opacity(0.7, 0.12)
    ),
  );

  // Connection lines color cycle
  yield* all(
    ...connectionLines.map((line, i) =>
      line.stroke(i % 2 === 0 ? COLORS.yellow : COLORS.pink, 0.08)
    ),
  );

  yield* all(
    ...connectionLines.map((line, i) =>
      line.stroke(COLORS.cyan, 0.08)
    ),
  );

  // Very final hold with subtle ambient
  yield* all(
    mainDocContainer().scale(1.02, 0.12, easeInOutQuad),
    pencilContainer().scale(1.02, 0.12, easeInOutQuad),
  );

  yield* all(
    mainDocContainer().scale(1, 0.12, easeInOutQuad),
    pencilContainer().scale(1, 0.12, easeInOutQuad),
  );

  // End hold
  yield* waitFor(0.04);
});
