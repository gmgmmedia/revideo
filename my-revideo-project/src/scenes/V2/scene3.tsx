/**
 * Scene 3: Account Anatomy
 * Duration: 11 seconds
 * VO: "Each box has an address and holds data. A few special boxes hold code —
 *      these are programs. But most boxes just store information."
 *
 * Visual: Single cube shows internal structure, then distinction between
 *         executable (haloed) and regular data boxes
 *
 * Enhanced with:
 * - Hex address visualization (actual hex characters)
 * - Circuit-like data patterns
 * - Animated data flow beziers
 * - Enhanced multi-ring executable halo
 * - Connecting relationship lines
 */

import { makeScene2D } from '@revideo/2d';
import { Rect, Node, Line, Circle, Txt, Path, blur } from '@revideo/2d';
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
  easeOutBack,
  linear,
} from '@revideo/core';

import { RAIKU, colors, timing, effects, layout, cube, fonts, fontSizes } from '../lib/raiku';

export default makeScene2D('scene3', function* (view) {
  // ============================================
  // SCENE SETUP
  // ============================================
  view.fill(colors.background);

  // ============================================
  // REFS - Background Layers
  // ============================================
  const bgGlow = createRef<Circle>();
  const bgGlowSecondary = createRef<Circle>();
  const bgGridLines = createRefArray<Line>();
  const bgVerticalLines = createRefArray<Line>();

  // Hexagonal grid background
  const hexGridGroup = createRef<Node>();
  const hexCells = createRefArray<Path>();
  const hexGlows = createRefArray<Path>();

  // Corner vignettes
  const vignetteTopLeft = createRef<Rect>();
  const vignetteTopRight = createRef<Rect>();
  const vignetteBottomLeft = createRef<Rect>();
  const vignetteBottomRight = createRef<Rect>();

  // ============================================
  // REFS - Circuit Pattern Background
  // ============================================
  const circuitGroup = createRef<Node>();
  const circuitHorizontalLines = createRefArray<Line>();
  const circuitVerticalLines = createRefArray<Line>();
  const circuitNodes = createRefArray<Circle>();
  const circuitNodeGlows = createRefArray<Circle>();

  // ============================================
  // REFS - Hero Account Box (Anatomy)
  // ============================================
  const heroBoxGroup = createRef<Node>();
  const heroBoxOuter = createRef<Rect>();
  const heroBoxOuterGlow = createRef<Rect>();
  const heroBoxDepthShadow = createRef<Rect>();
  const heroBoxInner = createRef<Rect>();
  const heroBox3dOffset = createRef<Rect>();

  // Address Layer with hex visualization
  const addressLayer = createRef<Node>();
  const addressBar = createRef<Rect>();
  const addressBarFill = createRef<Rect>();
  const addressBarGlow = createRef<Rect>();
  const addressHexChars = createRefArray<Txt>();
  const addressPrefix = createRef<Txt>();
  const addressCursor = createRef<Rect>();

  // Data Layer with circuit patterns
  const dataLayer = createRef<Node>();
  const dataBlocks = createRefArray<Rect>();
  const dataBlockGlows = createRefArray<Rect>();
  const dataBlockInners = createRefArray<Rect>();
  const dataCircuitLines = createRefArray<Line>();

  // Content visualization
  const contentLayer = createRef<Node>();
  const contentLines = createRefArray<Line>();
  const contentBits = createRefArray<Rect>();

  // Internal data flow beziers
  const dataFlowGroup = createRef<Node>();
  const dataFlowLines = createRefArray<Path>();
  const dataFlowParticles = createRefArray<Circle>();

  // ============================================
  // REFS - Executable Box (Special)
  // ============================================
  const execBoxGroup = createRef<Node>();
  const execBox = createRef<Rect>();
  const execBoxGlow = createRef<Rect>();
  const execBoxDepth = createRef<Rect>();

  // Multi-ring halo system
  const execHaloInner = createRef<Circle>();
  const execHaloMiddle = createRef<Circle>();
  const execHaloOuter = createRef<Circle>();
  const execHaloOuterDashed = createRef<Circle>();
  const execHaloPulse = createRef<Circle>();

  // Code visualization
  const execCodeSymbols = createRefArray<Node>();
  const execBracket1 = createRef<Line>();
  const execBracket2 = createRef<Line>();
  const execCodeLines = createRefArray<Line>();
  const execFunctionIcon = createRef<Node>();

  // Glow rays
  const execGlowRays = createRefArray<Line>();

  // ============================================
  // REFS - Data Boxes (Regular)
  // ============================================
  const dataBoxes = createRefArray<Node>();
  const dataBoxRects = createRefArray<Rect>();
  const dataBoxGlows = createRefArray<Rect>();
  const dataBoxInners = createRefArray<Rect>();
  const dataBoxDepths = createRefArray<Rect>();
  const dataBoxIcons = createRefArray<Node>();
  const dataBoxPatterns = createRefArray<Node>();

  // ============================================
  // REFS - Visual Comparison Layout
  // ============================================
  const comparisonGroup = createRef<Node>();
  const dividerLine = createRef<Line>();
  const dividerGlow = createRef<Line>();

  // Labels
  const execLabel = createRef<Txt>();
  const execLabelGlow = createRef<Txt>();
  const dataLabel = createRef<Txt>();
  const dataLabelGlow = createRef<Txt>();

  // Connecting beziers
  const connectionBeziers = createRefArray<Path>();
  const connectionParticles = createRefArray<Circle>();

  // ============================================
  // REFS - Ambient
  // ============================================
  const floatingParticles = createRefArray<Circle>();
  const floatingGlows = createRefArray<Circle>();
  const orbitParticles = createRefArray<Circle>();
  const orbitTrails = createRefArray<Circle>();

  // Data stream particles
  const dataStreamParticles = createRefArray<Circle>();

  // ============================================
  // CONSTANTS
  // ============================================
  const HERO_SIZE = 220;
  const EXEC_SIZE = 140;
  const DATA_BOX_SIZE = 90;
  const DATA_BOX_COUNT = 6;
  const PARTICLE_COUNT = 15;
  const HEX_CHARS = ['5', 'K', 'j', '2', 'v', 'X', '9', 'a', 'H', 'c', 'F'];
  const ORBIT_PARTICLE_COUNT = 8;

  // Hex grid dimensions
  const HEX_SIZE = 40;
  const HEX_COLS = 12;
  const HEX_ROWS = 8;

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  // Generate hexagon path
  const hexPath = (size: number) => {
    const angle = Math.PI / 3;
    let path = '';
    for (let i = 0; i < 6; i++) {
      const x = size * Math.cos(angle * i - Math.PI / 6);
      const y = size * Math.sin(angle * i - Math.PI / 6);
      path += (i === 0 ? 'M' : 'L') + `${x},${y}`;
    }
    return path + 'Z';
  };

  // ============================================
  // BUILD SCENE
  // ============================================
  view.add(
    <>
      {/* ===== LAYER 0: Deep Background Glows ===== */}
      <Circle
        ref={bgGlow}
        size={1200}
        fill={colors.neon}
        opacity={0}
        filters={[blur(250)]}
      />
      <Circle
        ref={bgGlowSecondary}
        size={800}
        fill={colors.white}
        opacity={0}
        y={200}
        x={300}
        filters={[blur(200)]}
      />

      {/* ===== LAYER 0.5: Corner Vignettes ===== */}
      <Rect
        ref={vignetteTopLeft}
        width={600}
        height={400}
        x={-layout.width / 2 + 200}
        y={-layout.height / 2 + 150}
        fill={colors.black}
        opacity={0}
        filters={[blur(100)]}
      />
      <Rect
        ref={vignetteTopRight}
        width={600}
        height={400}
        x={layout.width / 2 - 200}
        y={-layout.height / 2 + 150}
        fill={colors.black}
        opacity={0}
        filters={[blur(100)]}
      />
      <Rect
        ref={vignetteBottomLeft}
        width={600}
        height={400}
        x={-layout.width / 2 + 200}
        y={layout.height / 2 - 150}
        fill={colors.black}
        opacity={0}
        filters={[blur(100)]}
      />
      <Rect
        ref={vignetteBottomRight}
        width={600}
        height={400}
        x={layout.width / 2 - 200}
        y={layout.height / 2 - 150}
        fill={colors.black}
        opacity={0}
        filters={[blur(100)]}
      />

      {/* ===== LAYER 1: Hexagonal Grid Background ===== */}
      <Node ref={hexGridGroup} opacity={0}>
        {Array.from({ length: HEX_ROWS }, (_, row) =>
          Array.from({ length: HEX_COLS }, (_, col) => {
            const offsetX = row % 2 === 0 ? 0 : HEX_SIZE * 0.866;
            const x = (col - HEX_COLS / 2) * HEX_SIZE * 1.732 + offsetX;
            const y = (row - HEX_ROWS / 2) * HEX_SIZE * 1.5;
            const key = `hex-${row}-${col}`;
            const isHighlight = (row + col) % 7 === 0;

            return (
              <Node key={key}>
                {/* Hex glow for highlighted cells */}
                {isHighlight && (
                  <Path
                    ref={hexGlows}
                    data={hexPath(HEX_SIZE * 0.9)}
                    x={x}
                    y={y}
                    fill={colors.neon}
                    opacity={0}
                    filters={[blur(15)]}
                  />
                )}
                {/* Hex outline */}
                <Path
                  ref={hexCells}
                  data={hexPath(HEX_SIZE * 0.85)}
                  x={x}
                  y={y}
                  stroke={isHighlight ? colors.neon : colors.white}
                  lineWidth={isHighlight ? 1.5 : 0.5}
                  opacity={0}
                />
              </Node>
            );
          })
        ).flat()}
      </Node>

      {/* ===== LAYER 1.5: Circuit Pattern Background ===== */}
      <Node ref={circuitGroup} opacity={0}>
        {/* Horizontal circuit lines */}
        {Array.from({ length: 8 }, (_, i) => {
          const y = -300 + i * 85;
          const length = 200 + (i % 3) * 100;
          const x = (i % 2 === 0 ? -1 : 1) * (300 + (i % 4) * 50);
          return (
            <Line
              key={`circuit-h-${i}`}
              ref={circuitHorizontalLines}
              points={[
                [x - length / 2, y],
                [x + length / 2, y],
              ]}
              stroke={colors.neon}
              lineWidth={1}
              opacity={0}
              end={0}
            />
          );
        })}

        {/* Vertical circuit lines */}
        {Array.from({ length: 6 }, (_, i) => {
          const x = -400 + i * 160;
          const length = 100 + (i % 3) * 50;
          const y = (i % 2 === 0 ? -1 : 1) * (200 + (i % 4) * 30);
          return (
            <Line
              key={`circuit-v-${i}`}
              ref={circuitVerticalLines}
              points={[
                [x, y - length / 2],
                [x, y + length / 2],
              ]}
              stroke={colors.neon}
              lineWidth={1}
              opacity={0}
              end={0}
            />
          );
        })}

        {/* Circuit nodes (connection points) */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 350 + (i % 3) * 80;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius * 0.5;
          return (
            <Node key={`circuit-node-${i}`}>
              <Circle
                ref={circuitNodeGlows}
                size={16}
                fill={colors.neon}
                x={x}
                y={y}
                opacity={0}
                filters={[blur(8)]}
              />
              <Circle
                ref={circuitNodes}
                size={6}
                fill={colors.neon}
                x={x}
                y={y}
                opacity={0}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 2: Grid Lines ===== */}
      {Array.from({ length: 12 }, (_, i) => (
        <Line
          key={`bg-grid-h-${i}`}
          ref={bgGridLines}
          points={[
            [-layout.width / 2, -300 + i * 55],
            [layout.width / 2, -300 + i * 55],
          ]}
          stroke={colors.white}
          lineWidth={0.5}
          opacity={0}
        />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <Line
          key={`bg-grid-v-${i}`}
          ref={bgVerticalLines}
          points={[
            [-700 + i * 200, -layout.height / 2],
            [-700 + i * 200, layout.height / 2],
          ]}
          stroke={colors.white}
          lineWidth={0.3}
          opacity={0}
        />
      ))}

      {/* ===== LAYER 3: Floating Particles ===== */}
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const x = (i - PARTICLE_COUNT / 2) * 120 + (i % 2) * 40;
        const y = (i % 4 - 2) * 150;
        const size = 3 + (i % 4);
        const isNeon = i % 5 === 0;
        return (
          <Node key={`particle-${i}`}>
            <Circle
              ref={floatingGlows}
              size={size * 4}
              fill={isNeon ? colors.neon : colors.white}
              opacity={0}
              x={x}
              y={y}
              filters={[blur(10)]}
            />
            <Circle
              ref={floatingParticles}
              size={size}
              fill={isNeon ? colors.neon : colors.white}
              opacity={0}
              x={x}
              y={y}
            />
          </Node>
        );
      })}

      {/* ===== LAYER 4: Data Stream Particles ===== */}
      {Array.from({ length: 20 }, (_, i) => {
        const x = -800 + (i * 80);
        const y = -400 + (i % 5) * 200;
        return (
          <Circle
            key={`data-stream-${i}`}
            ref={dataStreamParticles}
            size={2}
            fill={colors.neon}
            x={x}
            y={y}
            opacity={0}
          />
        );
      })}

      {/* ===== LAYER 5: Hero Account Box (Anatomy View) ===== */}
      <Node ref={heroBoxGroup} scale={0} opacity={0}>
        {/* 3D depth shadow */}
        <Rect
          ref={heroBoxDepthShadow}
          width={HERO_SIZE}
          height={HERO_SIZE}
          fill={colors.black}
          opacity={0}
          radius={14}
          x={8}
          y={8}
          filters={[blur(20)]}
        />

        {/* 3D offset layer */}
        <Rect
          ref={heroBox3dOffset}
          width={HERO_SIZE}
          height={HERO_SIZE}
          fill={colors.background}
          stroke={colors.neon}
          lineWidth={1}
          opacity={0}
          radius={12}
          x={4}
          y={4}
        />

        {/* Outer glow */}
        <Rect
          ref={heroBoxOuterGlow}
          width={HERO_SIZE + 30}
          height={HERO_SIZE + 30}
          fill={colors.neon}
          opacity={0}
          radius={18}
          filters={[blur(effects.glowBlur)]}
        />

        {/* Main outer box */}
        <Rect
          ref={heroBoxOuter}
          width={HERO_SIZE}
          height={HERO_SIZE}
          fill={colors.background}
          stroke={colors.neon}
          lineWidth={3}
          radius={12}
        />

        {/* Inner structure (semi-transparent) */}
        <Rect
          ref={heroBoxInner}
          width={HERO_SIZE - 24}
          height={HERO_SIZE - 24}
          fill={null}
          stroke={colors.white}
          lineWidth={1}
          opacity={0}
          radius={8}
        />

        {/* === Address Layer with Hex Visualization === */}
        <Node ref={addressLayer} y={-70} opacity={0}>
          {/* Address bar glow */}
          <Rect
            ref={addressBarGlow}
            width={180}
            height={32}
            fill={colors.neon}
            opacity={0}
            radius={6}
            filters={[blur(12)]}
          />

          {/* Address bar background */}
          <Rect
            ref={addressBar}
            width={180}
            height={28}
            fill={null}
            stroke={colors.white}
            lineWidth={1.5}
            radius={5}
            opacity={0.6}
          />

          {/* Address bar fill (animated) */}
          <Rect
            ref={addressBarFill}
            width={0}
            height={24}
            fill={colors.neon}
            opacity={0.2}
            radius={4}
            x={-87}
          />

          {/* Address prefix "0x" */}
          <Txt
            ref={addressPrefix}
            text="0x"
            fontFamily={fonts.data}
            fontSize={16}
            fill={colors.neon}
            opacity={0}
            x={-75}
          />

          {/* Hex characters (actual characters instead of dots) */}
          {HEX_CHARS.map((char, i) => (
            <Txt
              key={`hex-char-${i}`}
              ref={addressHexChars}
              text={char}
              fontFamily={fonts.data}
              fontSize={14}
              fill={colors.white}
              opacity={0}
              x={-55 + i * 13}
            />
          ))}

          {/* Cursor blink */}
          <Rect
            ref={addressCursor}
            width={2}
            height={16}
            fill={colors.neon}
            opacity={0}
            x={100}
          />
        </Node>

        {/* === Data Layer with Circuit Patterns === */}
        <Node ref={dataLayer} y={20} opacity={0}>
          {/* Data blocks arranged in grid */}
          {Array.from({ length: 6 }, (_, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const blockWidth = 28 + (i % 3) * 8;
            const x = -55 + col * 50;
            const y = row * 35;

            return (
              <Node key={`data-block-${i}`}>
                {/* Block glow */}
                <Rect
                  ref={dataBlockGlows}
                  width={blockWidth}
                  height={24}
                  fill={colors.neon}
                  opacity={0}
                  x={x}
                  y={y}
                  radius={4}
                  filters={[blur(8)]}
                />
                {/* Block outline */}
                <Rect
                  ref={dataBlocks}
                  width={blockWidth}
                  height={24}
                  fill={null}
                  stroke={colors.white}
                  lineWidth={1.5}
                  opacity={0}
                  x={x}
                  y={y}
                  radius={4}
                />
                {/* Inner pattern (circuit-like) */}
                <Rect
                  ref={dataBlockInners}
                  width={blockWidth - 8}
                  height={12}
                  fill={colors.neon}
                  opacity={0}
                  x={x}
                  y={y}
                  radius={2}
                />
              </Node>
            );
          })}

          {/* Circuit connection lines between blocks */}
          {Array.from({ length: 4 }, (_, i) => (
            <Line
              key={`data-circuit-${i}`}
              ref={dataCircuitLines}
              points={[
                [-55 + (i % 2) * 50, 10 + Math.floor(i / 2) * 35],
                [-5 + (i % 2) * 50, 10 + Math.floor(i / 2) * 35],
              ]}
              stroke={colors.neon}
              lineWidth={1}
              opacity={0}
              end={0}
            />
          ))}
        </Node>

        {/* Content layer removed - dots were going outside the box */}
        <Node ref={contentLayer} opacity={0} />

        {/* Data flow beziers removed per request */}
        <Node ref={dataFlowGroup} opacity={0} />
      </Node>

      {/* ===== LAYER 6: Orbit Particles around Hero ===== */}
      {Array.from({ length: ORBIT_PARTICLE_COUNT }, (_, i) => {
        const angle = (i / ORBIT_PARTICLE_COUNT) * Math.PI * 2;
        const radius = HERO_SIZE / 2 + 60;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.6;
        return (
          <Node key={`orbit-${i}`}>
            <Circle
              ref={orbitTrails}
              size={12}
              fill={colors.neon}
              x={x}
              y={y}
              opacity={0}
              filters={[blur(8)]}
            />
            <Circle
              ref={orbitParticles}
              size={4}
              fill={colors.neon}
              x={x}
              y={y}
              opacity={0}
            />
          </Node>
        );
      })}

      {/* ===== LAYER 7: Comparison Group ===== */}
      <Node ref={comparisonGroup} opacity={0}>
        {/* Divider glow */}
        <Line
          ref={dividerGlow}
          points={[
            [0, -220],
            [0, 220],
          ]}
          stroke={colors.neon}
          lineWidth={6}
          opacity={0}
          lineCap="round"
          filters={[blur(15)]}
          end={0}
        />

        {/* Divider line */}
        <Line
          ref={dividerLine}
          points={[
            [0, -220],
            [0, 220],
          ]}
          stroke={colors.white}
          lineWidth={1.5}
          opacity={0}
          lineCap="round"
          end={0}
        />

        {/* === Labels === */}
        {/* Executable label glow */}
        <Txt
          ref={execLabelGlow}
          text="PROGRAM"
          fontFamily={fonts.heading}
          fontSize={fontSizes.caption}
          fill={colors.neon}
          x={-280}
          y={-180}
          opacity={0}
          filters={[blur(10)]}
        />
        <Txt
          ref={execLabel}
          text="PROGRAM"
          fontFamily={fonts.heading}
          fontSize={fontSizes.caption}
          fill={colors.neon}
          x={-280}
          y={-180}
          opacity={0}
        />

        {/* Data label - centered over the 3-column data boxes grid */}
        {/* Data boxes span x=180 to x=410, center = 295 */}
        <Txt
          ref={dataLabelGlow}
          text="DATA"
          fontFamily={fonts.heading}
          fontSize={fontSizes.caption}
          fill={colors.white}
          x={295}
          y={-180}
          opacity={0}
          filters={[blur(8)]}
        />
        <Txt
          ref={dataLabel}
          text="DATA"
          fontFamily={fonts.heading}
          fontSize={fontSizes.caption}
          fill={colors.white}
          x={295}
          y={-180}
          opacity={0}
        />

        {/* ===== Executable Box (Left Side) with Enhanced Halo ===== */}
        <Node
          ref={execBoxGroup}
          x={-280}
          y={30}
          scale={0}
          opacity={0}
        >
          {/* Multi-ring halo system */}
          {/* Outer dashed ring */}
          <Circle
            ref={execHaloOuterDashed}
            size={EXEC_SIZE + 100}
            fill={null}
            stroke={colors.neon}
            lineWidth={2}
            opacity={0}
            lineDash={[12, 8]}
          />

          {/* Outer solid ring */}
          <Circle
            ref={execHaloOuter}
            size={EXEC_SIZE + 70}
            fill={null}
            stroke={colors.neon}
            lineWidth={1.5}
            opacity={0}
          />

          {/* Middle glow ring */}
          <Circle
            ref={execHaloMiddle}
            size={EXEC_SIZE + 50}
            fill={colors.neon}
            opacity={0}
            filters={[blur(effects.glowBlurLarge)]}
          />

          {/* Inner intense glow */}
          <Circle
            ref={execHaloInner}
            size={EXEC_SIZE + 30}
            fill={colors.neon}
            opacity={0}
            filters={[blur(effects.glowBlur)]}
          />

          {/* Pulse ring (for animation) */}
          <Circle
            ref={execHaloPulse}
            size={EXEC_SIZE + 20}
            fill={null}
            stroke={colors.neon}
            lineWidth={3}
            opacity={0}
          />

          {/* Glow rays emanating from box */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const innerR = EXEC_SIZE / 2 + 10;
            const outerR = EXEC_SIZE / 2 + 50;
            return (
              <Line
                key={`glow-ray-${i}`}
                ref={execGlowRays}
                points={[
                  [Math.cos(angle) * innerR, Math.sin(angle) * innerR],
                  [Math.cos(angle) * outerR, Math.sin(angle) * outerR],
                ]}
                stroke={colors.neon}
                lineWidth={2}
                opacity={0}
                lineCap="round"
                end={0}
              />
            );
          })}

          {/* Box depth shadow */}
          <Rect
            ref={execBoxDepth}
            width={EXEC_SIZE}
            height={EXEC_SIZE}
            fill={colors.black}
            opacity={0}
            radius={12}
            x={5}
            y={5}
            filters={[blur(15)]}
          />

          {/* Box glow */}
          <Rect
            ref={execBoxGlow}
            width={EXEC_SIZE}
            height={EXEC_SIZE}
            fill={colors.neon}
            opacity={0}
            radius={12}
            filters={[blur(effects.glowBlur)]}
          />

          {/* Main Box */}
          <Rect
            ref={execBox}
            width={EXEC_SIZE}
            height={EXEC_SIZE}
            fill={colors.background}
            stroke={colors.neon}
            lineWidth={3}
            radius={12}
          />

          {/* Code visualization inside */}
          {/* Brackets */}
          <Line
            ref={execBracket1}
            points={[
              [-30, -25],
              [-45, 0],
              [-30, 25],
            ]}
            stroke={colors.white}
            lineWidth={3}
            lineCap="round"
            lineJoin="round"
            end={0}
          />
          <Line
            ref={execBracket2}
            points={[
              [30, -25],
              [45, 0],
              [30, 25],
            ]}
            stroke={colors.white}
            lineWidth={3}
            lineCap="round"
            lineJoin="round"
            end={0}
          />

          {/* Code lines inside brackets */}
          {Array.from({ length: 4 }, (_, i) => (
            <Line
              key={`exec-code-line-${i}`}
              ref={execCodeLines}
              points={[
                [-15, -20 + i * 12],
                [15 - (i % 2) * 10, -20 + i * 12],
              ]}
              stroke={colors.neon}
              lineWidth={2}
              lineCap="round"
              opacity={0}
              end={0}
            />
          ))}

          {/* Function symbol nodes - removed per request */}
          <Node ref={execFunctionIcon} opacity={0} />
        </Node>

        {/* ===== Data Boxes (Right Side) ===== */}
        {Array.from({ length: DATA_BOX_COUNT }, (_, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = 180 + col * (DATA_BOX_SIZE + 25);
          const y = -50 + row * (DATA_BOX_SIZE + 25);

          return (
            <Node
              key={`data-box-${i}`}
              ref={dataBoxes}
              x={x}
              y={y}
              scale={0}
              opacity={0}
            >
              {/* Depth shadow */}
              <Rect
                ref={dataBoxDepths}
                width={DATA_BOX_SIZE}
                height={DATA_BOX_SIZE}
                fill={colors.black}
                opacity={0}
                radius={8}
                x={4}
                y={4}
                filters={[blur(12)]}
              />

              {/* Glow (subtle for data boxes) */}
              <Rect
                ref={dataBoxGlows}
                width={DATA_BOX_SIZE}
                height={DATA_BOX_SIZE}
                fill={colors.white}
                opacity={0}
                radius={8}
                filters={[blur(10)]}
              />

              {/* Box */}
              <Rect
                ref={dataBoxRects}
                width={DATA_BOX_SIZE}
                height={DATA_BOX_SIZE}
                fill={colors.background}
                stroke={colors.white}
                lineWidth={2}
                radius={8}
              />

              {/* Inner content indicator */}
              <Rect
                ref={dataBoxInners}
                width={DATA_BOX_SIZE - 24}
                height={DATA_BOX_SIZE - 24}
                fill={null}
                stroke={colors.white}
                lineWidth={1}
                opacity={0}
                radius={4}
              />

              {/* Data pattern inside (unique per box) */}
              <Node ref={dataBoxPatterns} opacity={0}>
                {/* Different patterns for each box */}
                {i % 3 === 0 && (
                  // Horizontal bars
                  <>
                    <Rect width={50} height={4} fill={colors.white} y={-15} radius={2} opacity={0.5} />
                    <Rect width={35} height={4} fill={colors.white} y={0} radius={2} opacity={0.5} />
                    <Rect width={45} height={4} fill={colors.white} y={15} radius={2} opacity={0.5} />
                  </>
                )}
                {i % 3 === 1 && (
                  // Grid dots
                  <>
                    {Array.from({ length: 9 }, (_, j) => (
                      <Circle
                        key={`block-${i}-dot-${j}`}
                        size={6}
                        fill={colors.white}
                        x={-18 + (j % 3) * 18}
                        y={-18 + Math.floor(j / 3) * 18}
                        opacity={0.5}
                      />
                    ))}
                  </>
                )}
                {i % 3 === 2 && (
                  // Single value
                  <Txt
                    text={['128', '256', '512', '64', '32', '1024'][i]}
                    fontFamily={fonts.data}
                    fontSize={20}
                    fill={colors.white}
                    opacity={0.6}
                  />
                )}
              </Node>

              {/* Data type icons - removed per request */}
              <Node ref={dataBoxIcons} opacity={0} />
            </Node>
          );
        })}

        {/* ===== Connecting Beziers (Program to Data) - 2 lines for 2 rows ===== */}
        {Array.from({ length: 2 }, (_, i) => {
          const startX = -280 + EXEC_SIZE / 2 + 20;
          const startY = 30 + (i === 0 ? -25 : 25); // Two output points from program
          const endX = 180 - DATA_BOX_SIZE / 2 - 15;
          const endY = -50 + i * (DATA_BOX_SIZE + 25); // Row 0: -50, Row 1: 65
          const midX = (startX + endX) / 2;

          return (
            <Node key={`connection-${i}`}>
              <Path
                ref={connectionBeziers}
                data={`M ${startX},${startY} C ${midX},${startY} ${midX},${endY} ${endX},${endY}`}
                stroke={colors.neon}
                lineWidth={1.5}
                opacity={0}
                lineCap="round"
                end={0}
              />
              {/* Particle traveling along connection */}
              <Circle
                ref={connectionParticles}
                size={6}
                fill={colors.neon}
                x={startX}
                y={startY}
                opacity={0}
              />
            </Node>
          );
        })}
      </Node>
    </>
  );

  // ============================================
  // ANIMATION TIMELINE
  // ============================================

  // --- Beat 0 (08:00) - Background layers appear ---
  yield* all(
    bgGlow().opacity(0.04, timing.beat),
    bgGlowSecondary().opacity(0.02, timing.beat),
    vignetteTopLeft().opacity(0.5, timing.beat),
    vignetteTopRight().opacity(0.5, timing.beat),
    vignetteBottomLeft().opacity(0.5, timing.beat),
    vignetteBottomRight().opacity(0.5, timing.beat),
    ...bgGridLines.map((line, i) => delay(i * 0.02, line.opacity(0.04, timing.entrance))),
    ...bgVerticalLines.map((line, i) => delay(i * 0.02, line.opacity(0.03, timing.entrance))),
  );

  // --- Beat 0.5 (08:05) - Hex grid fades in ---
  yield* all(
    hexGridGroup().opacity(1, timing.entrance),
    ...hexCells.map((cell, i) => delay(i * 0.005, cell.opacity(i % 7 === 0 ? 0.15 : 0.05, timing.entrance))),
    ...hexGlows.map((glow, i) => delay(i * 0.01, glow.opacity(0.1, timing.entrance))),
  );

  // --- Beat 1 (08:10) - Hero box floats to center ---
  yield* all(
    heroBoxGroup().scale(1, timing.entrance * 2.5, easeOutBack),
    heroBoxGroup().opacity(1, timing.entrance * 2),
    heroBoxOuterGlow().opacity(effects.glowOpacitySubtle, timing.entrance * 2),
    heroBoxDepthShadow().opacity(0.4, timing.entrance * 2),
    heroBox3dOffset().opacity(0.3, timing.entrance * 2),
  );

  // --- Beat 1.5 (08:15) - Orbit particles appear ---
  yield* all(
    ...orbitParticles.map((p, i) => delay(i * 0.04, p.opacity(0.6, timing.entrance))),
    ...orbitTrails.map((t, i) => delay(i * 0.04, t.opacity(0.2, timing.entrance))),
  );

  // --- Beat 2 (08:20) - Hero box rotates slightly (attention) ---
  yield* all(
    heroBoxGroup().rotation(4, timing.beat, easeOutCubic),
  );
  yield* heroBoxGroup().rotation(0, timing.beat * 0.6, easeInOutCubic);

  // --- Beat 3 (09:00) - Inner structure reveals ---
  yield* all(
    heroBoxInner().opacity(0.6, timing.entrance),
    heroBoxOuter().fill(null, timing.entrance),
  );

  // --- Beat 4 (09:15) - Address layer appears with glow ---
  yield* all(
    addressLayer().opacity(1, timing.entrance),
    addressBarGlow().opacity(0.15, timing.entrance),
  );

  // --- Beat 5 (09:20) - Address bar fills ---
  yield* all(
    addressBarFill().width(174, 0.35, easeOutCubic),
    addressBarFill().x(0, 0.35, easeOutCubic),
  );

  // --- Beat 5.5 (09:23) - "0x" prefix appears ---
  yield* addressPrefix().opacity(1, timing.fast);

  // --- Beat 6 (09:28) - Hex characters type in one by one ---
  yield* sequence(
    0.025,
    ...addressHexChars.map((char) => char.opacity(0.9, timing.fast))
  );

  // --- Beat 6.5 (09:35) - Cursor blinks ---
  yield* addressCursor().opacity(1, timing.fast);
  yield* waitFor(0.1);
  yield* addressCursor().opacity(0, timing.fast);

  // --- Beat 7 (10:00) - Data layer appears ---
  yield* dataLayer().opacity(1, timing.entrance);

  // --- Beat 8 (10:10) - Data blocks animate in with circuit lines ---
  yield* sequence(
    0.05,
    ...dataBlocks.map((block, i) =>
      all(
        block.opacity(0.8, timing.entrance),
        dataBlockGlows[i].opacity(0.25, timing.entrance),
        dataBlockInners[i].opacity(0.4, timing.entrance),
      )
    )
  );

  // --- Beat 8.5 (10:15) - Circuit connection lines draw ---
  yield* all(
    ...dataCircuitLines.map((line, i) =>
      delay(i * 0.06, all(
        line.opacity(0.5, timing.fast),
        line.end(1, 0.2, easeOutCubic),
      ))
    ),
  );

  // --- Beat 9 (10:20) - Content lines draw ---
  yield* all(
    contentLayer().opacity(1, timing.fast),
    ...contentLines.map((line, i) =>
      delay(i * 0.04, line.end(1, 0.18, easeOutCubic))
    ),
  );

  // --- Beat 9.5 (10:25) - Binary bits appear ---
  yield* sequence(
    0.02,
    ...contentBits.map((bit) => bit.opacity(0.6, timing.fast))
  );

  // --- Beat 10 (11:00) - Data flow beziers animate ---
  yield* all(
    dataFlowGroup().opacity(1, timing.fast),
    ...dataFlowLines.map((line, i) =>
      delay(i * 0.1, all(
        line.opacity(0.4, timing.fast),
        line.end(1, 0.3, easeOutCubic),
      ))
    ),
  );

  // --- Beat 10.3 (11:03) - Flow particles pulse ---
  yield* sequence(
    0.04,
    ...dataFlowParticles.map((p) => p.opacity(0.7, timing.fast))
  );

  // --- Beat 10.5 (11:05) - Hero box pulses (complete anatomy shown) ---
  yield* all(
    heroBoxOuterGlow().opacity(effects.glowOpacity, timing.fast),
    heroBoxGroup().scale(1.06, timing.fast, easeOutCubic),
    addressBarGlow().opacity(0.3, timing.fast),
  );
  yield* all(
    heroBoxOuterGlow().opacity(effects.glowOpacitySubtle, timing.microBeat),
    heroBoxGroup().scale(1, timing.microBeat, easeInOutCubic),
    addressBarGlow().opacity(0.15, timing.microBeat),
  );

  // --- Beat 11 (11:10) - Floating particles fade in ---
  yield* all(
    ...floatingParticles.map((p, i) =>
      delay(i * 0.025, p.opacity(0.5, timing.entrance))
    ),
    ...floatingGlows.map((g, i) =>
      delay(i * 0.025, g.opacity(0.2, timing.entrance))
    ),
  );

  // --- Beat 11.5 (11:15) - Circuit background animates ---
  yield* all(
    circuitGroup().opacity(1, timing.entrance),
    ...circuitHorizontalLines.map((line, i) =>
      delay(i * 0.05, all(
        line.opacity(0.2, timing.fast),
        line.end(1, 0.25, easeOutCubic),
      ))
    ),
    ...circuitVerticalLines.map((line, i) =>
      delay(i * 0.05, all(
        line.opacity(0.2, timing.fast),
        line.end(1, 0.25, easeOutCubic),
      ))
    ),
    ...circuitNodes.map((node, i) =>
      delay(i * 0.04, node.opacity(0.5, timing.entrance))
    ),
    ...circuitNodeGlows.map((glow, i) =>
      delay(i * 0.04, glow.opacity(0.2, timing.entrance))
    ),
  );

  // --- Beat 12 (12:00) - Transition to comparison: Hero shrinks, moves up ---
  yield* all(
    heroBoxGroup().scale(0.45, timing.beat * 1.2, easeInOutCubic),
    heroBoxGroup().y(-380, timing.beat * 1.2, easeInOutCubic),
    heroBoxGroup().opacity(0.25, timing.beat),
    ...orbitParticles.map((p) => p.opacity(0, timing.beat)),
    ...orbitTrails.map((t) => t.opacity(0, timing.beat)),
    dataFlowGroup().opacity(0, timing.beat),
  );

  // --- Beat 13 (12:10) - Comparison group fades in ---
  yield* comparisonGroup().opacity(1, timing.entrance);

  // --- Beat 14 (12:15) - Executable box appears with multi-ring halo ---
  yield* all(
    execBoxGroup().scale(1, timing.entrance * 1.8, easeOutBack),
    execBoxGroup().opacity(1, timing.entrance * 1.5),
    execHaloInner().opacity(effects.glowOpacitySubtle, timing.entrance * 1.8),
    execBoxDepth().opacity(0.3, timing.entrance),
  );

  // --- Beat 14.5 (12:20) - Halo rings expand outward ---
  yield* all(
    execHaloMiddle().opacity(effects.glowOpacitySubtle * 0.7, timing.entrance),
    execHaloOuter().opacity(0.5, timing.entrance),
    execHaloOuterDashed().opacity(0.4, timing.entrance),
    execBoxGlow().opacity(effects.glowOpacity, timing.fast),
  );

  // --- Beat 15 (12:25) - Glow rays animate ---
  yield* all(
    ...execGlowRays.map((ray, i) =>
      delay(i * 0.03, all(
        ray.opacity(0.4, timing.fast),
        ray.end(1, 0.15, easeOutCubic),
      ))
    ),
  );

  // --- Beat 15.5 (12:28) - Pulse ring effect ---
  yield* all(
    execHaloPulse().opacity(0.6, timing.fast),
    execHaloPulse().size(EXEC_SIZE + 60, timing.beat, easeOutCubic),
  );
  yield* all(
    execHaloPulse().opacity(0, timing.microBeat),
    execHaloPulse().size(EXEC_SIZE + 20, 0),
  );

  // --- Beat 16 (13:00) - Code brackets draw inside exec box ---
  yield* all(
    execBracket1().end(1, 0.22, easeOutCubic),
    execBracket2().end(1, 0.22, easeOutCubic),
  );

  // --- Beat 16.5 (13:05) - Code lines inside brackets draw ---
  yield* sequence(
    0.04,
    ...execCodeLines.map((line) =>
      all(
        line.opacity(0.8, timing.fast),
        line.end(1, 0.12, easeOutCubic),
      )
    )
  );

  // --- Beat 17.5 (13:15) - Labels appear ---
  yield* all(
    execLabel().opacity(1, timing.entrance),
    execLabelGlow().opacity(0.3, timing.entrance),
  );

  // --- Beat 18 (14:00) - Data boxes appear on right side ---
  yield* sequence(
    0.07,
    ...dataBoxes.map((box, i) =>
      all(
        box.scale(1, timing.entrance * 1.2, easeOutBack),
        box.opacity(1, timing.entrance),
        dataBoxGlows[i].opacity(0.08, timing.entrance),
        dataBoxDepths[i].opacity(0.3, timing.entrance),
      )
    )
  );

  // --- Beat 18.3 (14:03) - Data label appears ---
  yield* all(
    dataLabel().opacity(0.8, timing.entrance),
    dataLabelGlow().opacity(0.2, timing.entrance),
  );

  // --- Beat 18.5 (14:05) - Data box inners reveal ---
  yield* sequence(
    0.03,
    ...dataBoxInners.map((inner) => inner.opacity(0.5, timing.entrance))
  );

  // --- Beat 18.7 (14:07) - Data box patterns appear ---
  yield* sequence(
    0.04,
    ...dataBoxPatterns.map((pattern) => pattern.opacity(1, timing.entrance))
  );

  // --- Beat 19.5 (14:15) - Divider line draws ---
  yield* all(
    dividerGlow().opacity(0.15, timing.fast),
    dividerGlow().end(1, 0.35, easeOutCubic),
    delay(0.05, all(
      dividerLine().opacity(0.4, timing.fast),
      dividerLine().end(1, 0.35, easeOutCubic),
    )),
  );

  // --- Beat 20 (14:20) - Connection beziers draw ---
  yield* sequence(
    0.08,
    ...connectionBeziers.map((bezier, i) =>
      all(
        bezier.opacity(0.5, timing.fast),
        bezier.end(1, 0.3, easeOutCubic),
        delay(0.15, connectionParticles[i].opacity(0.8, timing.fast)),
      )
    )
  );

  // --- Beat 20.5 (14:25) - Animate particles along beziers (2 connections) ---
  // Particles move from program to data rows
  yield* all(
    ...connectionParticles.slice(0, 2).map((particle, i) =>
      all(
        particle.x(180 - DATA_BOX_SIZE / 2 - 15, 0.4, easeInOutCubic),
        particle.y(-50 + i * (DATA_BOX_SIZE + 25), 0.4, easeInOutCubic),
      )
    )
  );
  yield* all(
    ...connectionParticles.slice(0, 2).map((particle) => particle.opacity(0, timing.fast))
  );

  // --- Beat 21 (15:00) - Exec box pulses brighter (emphasis - "special boxes") ---
  yield* all(
    execBoxGlow().opacity(effects.glowOpacityBright, timing.fast),
    execHaloInner().opacity(effects.glowOpacity, timing.fast),
    execHaloMiddle().opacity(effects.glowOpacitySubtle, timing.fast),
    execHaloOuter().opacity(0.7, timing.fast),
    execHaloOuterDashed().opacity(0.6, timing.fast),
  );

  // --- Beat 21.3 (15:03) - Second pulse ring ---
  yield* all(
    execHaloPulse().opacity(0.5, timing.fast),
    execHaloPulse().size(EXEC_SIZE + 80, timing.beat, easeOutCubic),
  );
  yield* all(
    execHaloPulse().opacity(0, timing.microBeat),
    execHaloPulse().size(EXEC_SIZE + 20, 0),
  );

  // --- Beat 22 (15:05) - Data boxes stay dim (contrast - "most boxes just store information") ---
  yield* all(
    ...dataBoxGlows.map((glow) => glow.opacity(0.04, timing.microBeat)),
    ...dataBoxRects.map((rect) => rect.opacity(0.6, timing.microBeat)),
    ...dataBoxPatterns.map((pattern) => pattern.opacity(0.4, timing.microBeat)),
  );

  // --- Beat 23 (15:08) - Final emphasis pulse on exec ---
  yield* all(
    execBoxGroup().scale(1.08, timing.fast, easeOutCubic),
    execBoxGlow().opacity(1, timing.fast),
  );
  yield* all(
    execBoxGroup().scale(1, timing.microBeat * 1.5, easeInOutCubic),
    execBoxGlow().opacity(effects.glowOpacity, timing.microBeat),
  );

  // --- Beat 23.5 (15:10) - Data stream particles flow ---
  yield* all(
    ...dataStreamParticles.map((particle, i) =>
      delay(i * 0.02, all(
        particle.opacity(0.4, timing.fast),
        particle.x(particle.x() + 100, 0.5, linear),
      ))
    )
  );

  // --- Hold for transition (15:00) ---
  yield* waitFor(timing.hold);
});
