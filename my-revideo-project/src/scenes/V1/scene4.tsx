/**
 * Scene 4: Stateless Programs
 * Duration: 15:00 - 20:00 (5 seconds)
 * VO: "Programs have no memory. They just follow instructions.
 *      All the actual data lives in other boxes."
 *
 * Visual: Program box with brain icon that shatters dramatically,
 *         showing it's hollow. Threads connect to data boxes that light up.
 *
 * Enhanced with:
 * - Dramatic brain shatter with particle trails
 * - Thread particle trails (data flowing)
 * - Wave-fill animation for data boxes
 * - Pulsing endpoint nodes
 * - Enhanced hollow reveal
 */

import { makeScene2D } from '@revideo/2d';
import { Rect, Node, Line, Circle, Path, Txt, blur } from '@revideo/2d';
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

export default makeScene2D('scene4', function* (view) {
  // ============================================
  // SCENE SETUP
  // ============================================
  view.fill(colors.background);

  // ============================================
  // REFS - Background Layers
  // ============================================
  const bgGlow1 = createRef<Circle>();
  const bgGlow2 = createRef<Circle>();
  const bgGlow3 = createRef<Circle>();
  const gridLines = createRefArray<Line>();
  const verticalGridLines = createRefArray<Line>();

  // Hexagonal grid
  const hexGridGroup = createRef<Node>();
  const hexCells = createRefArray<Path>();
  const hexGlows = createRefArray<Path>();

  // Corner vignettes
  const vignetteTopLeft = createRef<Rect>();
  const vignetteTopRight = createRef<Rect>();
  const vignetteBottomLeft = createRef<Rect>();
  const vignetteBottomRight = createRef<Rect>();

  // Circuit traces
  const circuitTraces = createRefArray<Line>();
  const circuitNodes = createRefArray<Circle>();

  // ============================================
  // REFS - Program Box (Center)
  // ============================================
  const programGroup = createRef<Node>();
  const programBox = createRef<Rect>();
  const programBoxGlow = createRef<Rect>();
  const programBoxInner = createRef<Rect>();
  const programBoxDepth = createRef<Rect>();
  const programHalo = createRef<Circle>();
  const programHaloOuter = createRef<Circle>();
  const programHaloPulse = createRef<Circle>();

  // Brain icon (will shatter dramatically)
  const brainGroup = createRef<Node>();
  const brainCircle = createRef<Circle>();
  const brainCircleGlow = createRef<Circle>();
  const brainLines = createRefArray<Line>();
  const brainDots = createRefArray<Circle>();

  // Brain shards (more dramatic shatter)
  const brainShards = createRefArray<Node>();
  const shardTrails = createRefArray<Circle>();

  // Shatter flash effect
  const shatterFlash = createRef<Circle>();

  // "X" mark after brain shatters
  const xMark = createRef<Node>();
  const xLine1 = createRef<Line>();
  const xLine2 = createRef<Line>();
  const xGlow = createRef<Node>();

  // Hollow interior visualization
  const hollowGroup = createRef<Node>();
  const hollowLines = createRefArray<Line>();
  const hollowDots = createRefArray<Circle>();
  const emptyText = createRef<Txt>();

  // Code brackets inside (hollow reveal)
  const codeBracket1 = createRef<Line>();
  const codeBracket2 = createRef<Line>();
  const codeDotsGroup = createRef<Node>();
  const codeDots = createRefArray<Circle>();
  const codeLines = createRefArray<Line>();

  // Instruction arrows
  const instructionArrows = createRefArray<Node>();

  // ============================================
  // REFS - Connection Threads with Particle Trails
  // ============================================
  const threadsGroup = createRef<Node>();
  const threads = createRefArray<Line>();
  const threadGlows = createRefArray<Line>();
  const threadDashedLines = createRefArray<Line>();

  // Multiple particles per thread
  const threadParticles1 = createRefArray<Circle>();
  const threadParticles2 = createRefArray<Circle>();
  const threadParticles3 = createRefArray<Circle>();
  const threadParticleGlows = createRefArray<Circle>();

  // Endpoint nodes
  const endpointNodes = createRefArray<Circle>();
  const endpointGlows = createRefArray<Circle>();
  const endpointPulses = createRefArray<Circle>();

  // ============================================
  // REFS - Data Boxes (Receiving end)
  // ============================================
  const dataBoxesGroup = createRef<Node>();
  const dataBoxNodes = createRefArray<Node>();
  const dataBoxRects = createRefArray<Rect>();
  const dataBoxGlows = createRefArray<Rect>();
  const dataBoxDepths = createRefArray<Rect>();
  const dataBoxFills = createRefArray<Rect>();
  const dataBoxWaves = createRefArray<Rect>();
  const dataBoxInners = createRefArray<Rect>();
  const dataBoxLabels = createRefArray<Txt>();
  const dataBoxIcons = createRefArray<Node>();

  // ============================================
  // REFS - Ambient
  // ============================================
  const ambientParticles = createRefArray<Circle>();
  const ambientGlows = createRefArray<Circle>();
  const floatingDataBits = createRefArray<Rect>();

  // Data stream particles
  const dataStreamParticles = createRefArray<Circle>();

  // ============================================
  // CONSTANTS
  // ============================================
  const PROGRAM_SIZE = 180;
  const DATA_BOX_SIZE = 100;
  const DATA_BOX_COUNT = 5;
  const SHARD_COUNT = 16;
  const AMBIENT_COUNT = 18;
  const HEX_SIZE = 35;
  const HEX_COLS = 14;
  const HEX_ROWS = 10;

  // Data box positions (arranged in arc on right side)
  const dataBoxPositions = [
    { x: 340, y: -180, label: 'balance' },
    { x: 420, y: -60, label: 'owner' },
    { x: 440, y: 70, label: 'data' },
    { x: 380, y: 190, label: 'state' },
    { x: 280, y: 280, label: 'lamports' },
  ];

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
        ref={bgGlow1}
        size={1000}
        fill={colors.neon}
        opacity={0}
        x={-250}
        y={0}
        filters={[blur(250)]}
      />
      <Circle
        ref={bgGlow2}
        size={700}
        fill={colors.neon}
        opacity={0}
        x={400}
        y={50}
        filters={[blur(200)]}
      />
      <Circle
        ref={bgGlow3}
        size={500}
        fill={colors.white}
        opacity={0}
        x={100}
        y={-200}
        filters={[blur(180)]}
      />

      {/* ===== LAYER 0.5: Corner Vignettes ===== */}
      <Rect
        ref={vignetteTopLeft}
        width={500}
        height={350}
        x={-layout.width / 2 + 200}
        y={-layout.height / 2 + 150}
        fill={colors.black}
        opacity={0}
        filters={[blur(100)]}
      />
      <Rect
        ref={vignetteTopRight}
        width={500}
        height={350}
        x={layout.width / 2 - 200}
        y={-layout.height / 2 + 150}
        fill={colors.black}
        opacity={0}
        filters={[blur(100)]}
      />
      <Rect
        ref={vignetteBottomLeft}
        width={500}
        height={350}
        x={-layout.width / 2 + 200}
        y={layout.height / 2 - 150}
        fill={colors.black}
        opacity={0}
        filters={[blur(100)]}
      />
      <Rect
        ref={vignetteBottomRight}
        width={500}
        height={350}
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
            const isHighlight = (row + col) % 8 === 0;

            return (
              <Node key={key}>
                {isHighlight && (
                  <Path
                    ref={hexGlows}
                    data={hexPath(HEX_SIZE * 0.85)}
                    x={x}
                    y={y}
                    fill={colors.neon}
                    opacity={0}
                    filters={[blur(12)]}
                  />
                )}
                <Path
                  ref={hexCells}
                  data={hexPath(HEX_SIZE * 0.8)}
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

      {/* ===== LAYER 1.5: Grid Lines ===== */}
      {Array.from({ length: 10 }, (_, i) => (
        <Line
          key={`grid-h-${i}`}
          ref={gridLines}
          points={[
            [-layout.width / 2, -250 + i * 55],
            [layout.width / 2, -250 + i * 55],
          ]}
          stroke={colors.white}
          lineWidth={0.5}
          opacity={0}
        />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <Line
          key={`grid-v-${i}`}
          ref={verticalGridLines}
          points={[
            [-700 + i * 200, -layout.height / 2],
            [-700 + i * 200, layout.height / 2],
          ]}
          stroke={colors.white}
          lineWidth={0.3}
          opacity={0}
        />
      ))}

      {/* ===== LAYER 1.7: Circuit Traces ===== */}
      {Array.from({ length: 6 }, (_, i) => {
        const x = -600 + i * 200;
        const y = -400 + (i % 3) * 150;
        const length = 150 + (i % 3) * 80;
        return (
          <Node key={`circuit-${i}`}>
            <Line
              ref={circuitTraces}
              points={[
                [x, y],
                [x + length, y],
                [x + length, y + 50],
              ]}
              stroke={colors.neon}
              lineWidth={1}
              opacity={0}
              lineCap="round"
              lineJoin="round"
              end={0}
            />
            <Circle
              ref={circuitNodes}
              size={6}
              fill={colors.neon}
              x={x + length}
              y={y + 50}
              opacity={0}
            />
          </Node>
        );
      })}

      {/* ===== LAYER 2: Ambient Particles ===== */}
      {Array.from({ length: AMBIENT_COUNT }, (_, i) => {
        const angle = (i / AMBIENT_COUNT) * Math.PI * 2;
        const radius = 420 + (i % 4) * 60;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.55;
        const isNeon = i % 4 === 0;
        return (
          <Node key={`ambient-${i}`}>
            <Circle
              ref={ambientGlows}
              size={(10 + (i % 5) * 3)}
              fill={isNeon ? colors.neon : colors.white}
              opacity={0}
              x={x}
              y={y}
              filters={[blur(10)]}
            />
            <Circle
              ref={ambientParticles}
              size={3 + (i % 4)}
              fill={isNeon ? colors.neon : colors.white}
              opacity={0}
              x={x}
              y={y}
            />
          </Node>
        );
      })}

      {/* ===== LAYER 2.5: Floating Data Bits ===== */}
      {Array.from({ length: 12 }, (_, i) => {
        const x = -500 + (i % 6) * 180;
        const y = -350 + Math.floor(i / 6) * 700;
        return (
          <Rect
            key={`data-bit-${i}`}
            ref={floatingDataBits}
            width={4}
            height={4}
            fill={colors.neon}
            x={x}
            y={y}
            opacity={0}
            radius={1}
          />
        );
      })}

      {/* ===== LAYER 3: Data Boxes Group ===== */}
      <Node ref={dataBoxesGroup} opacity={0}>
        {dataBoxPositions.map((pos, i) => (
          <Node
            key={`data-box-${i}`}
            ref={dataBoxNodes}
            x={pos.x}
            y={pos.y}
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
              radius={10}
              x={5}
              y={5}
              filters={[blur(15)]}
            />

            {/* Glow */}
            <Rect
              ref={dataBoxGlows}
              width={DATA_BOX_SIZE + 15}
              height={DATA_BOX_SIZE + 15}
              fill={colors.neon}
              opacity={0}
              radius={12}
              filters={[blur(effects.glowBlur)]}
            />

            {/* Wave fill effect (background) */}
            <Rect
              ref={dataBoxWaves}
              width={DATA_BOX_SIZE - 12}
              height={0}
              fill={colors.neon}
              opacity={0}
              radius={6}
              y={(DATA_BOX_SIZE - 12) / 2}
            />

            {/* Fill (represents data) */}
            <Rect
              ref={dataBoxFills}
              width={DATA_BOX_SIZE - 14}
              height={0}
              fill={colors.neon}
              opacity={0}
              radius={6}
              y={(DATA_BOX_SIZE - 14) / 2}
            />

            {/* Box */}
            <Rect
              ref={dataBoxRects}
              width={DATA_BOX_SIZE}
              height={DATA_BOX_SIZE}
              fill={colors.background}
              stroke={colors.white}
              lineWidth={2}
              radius={10}
            />

            {/* Inner structure */}
            <Rect
              ref={dataBoxInners}
              width={DATA_BOX_SIZE - 24}
              height={DATA_BOX_SIZE - 24}
              fill={null}
              stroke={colors.white}
              lineWidth={1}
              opacity={0}
              radius={5}
            />

            {/* Label below box */}
            <Txt
              ref={dataBoxLabels}
              text={pos.label}
              fontFamily={fonts.data}
              fontSize={14}
              fill={colors.white}
              y={DATA_BOX_SIZE / 2 + 18}
              opacity={0}
            />

            {/* Data type icon above box */}
            <Node ref={dataBoxIcons} y={-DATA_BOX_SIZE / 2 - 15} opacity={0}>
              <Circle size={20} fill={colors.background} stroke={colors.neon} lineWidth={1.5} />
              <Txt
                text={['$', '👤', '📊', '⚡', '💎'][i]}
                fontFamily={fonts.data}
                fontSize={10}
                fill={colors.neon}
              />
            </Node>
          </Node>
        ))}
      </Node>

      {/* ===== LAYER 4: Connection Threads with Particles ===== */}
      <Node ref={threadsGroup} opacity={0}>
        {dataBoxPositions.map((pos, i) => {
          const startX = -200 + PROGRAM_SIZE / 2;
          const startY = 0;
          const endX = pos.x - DATA_BOX_SIZE / 2;
          const endY = pos.y;

          return (
            <Node key={`thread-${i}`}>
              {/* Thread dashed underline */}
              <Line
                ref={threadDashedLines}
                points={[
                  [startX, startY],
                  [endX, endY],
                ]}
                stroke={colors.white}
                lineWidth={1}
                opacity={0}
                lineCap="round"
                lineDash={[4, 8]}
                end={0}
              />

              {/* Thread glow */}
              <Line
                ref={threadGlows}
                points={[
                  [startX, startY],
                  [endX, endY],
                ]}
                stroke={colors.neon}
                lineWidth={8}
                opacity={0}
                lineCap="round"
                end={0}
                filters={[blur(10)]}
              />

              {/* Thread line */}
              <Line
                ref={threads}
                points={[
                  [startX, startY],
                  [endX, endY],
                ]}
                stroke={colors.neon}
                lineWidth={2.5}
                opacity={0}
                lineCap="round"
                end={0}
              />

              {/* Endpoint glow */}
              <Circle
                ref={endpointGlows}
                size={30}
                fill={colors.neon}
                x={endX}
                y={endY}
                opacity={0}
                filters={[blur(15)]}
              />

              {/* Endpoint pulse */}
              <Circle
                ref={endpointPulses}
                size={15}
                fill={null}
                stroke={colors.neon}
                lineWidth={2}
                x={endX}
                y={endY}
                opacity={0}
              />

              {/* Endpoint node */}
              <Circle
                ref={endpointNodes}
                size={10}
                fill={colors.neon}
                x={endX}
                y={endY}
                opacity={0}
              />

              {/* Traveling particles (3 per thread) */}
              <Circle
                ref={threadParticleGlows}
                size={16}
                fill={colors.neon}
                opacity={0}
                x={startX}
                y={startY}
                filters={[blur(8)]}
              />
              <Circle
                ref={threadParticles1}
                size={8}
                fill={colors.neon}
                opacity={0}
                x={startX}
                y={startY}
              />
              <Circle
                ref={threadParticles2}
                size={6}
                fill={colors.neon}
                opacity={0}
                x={startX}
                y={startY}
              />
              <Circle
                ref={threadParticles3}
                size={4}
                fill={colors.white}
                opacity={0}
                x={startX}
                y={startY}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 4.5: Data Stream Particles ===== */}
      {Array.from({ length: 15 }, (_, i) => {
        const x = -200 + (i % 5) * 150;
        const y = -300 + Math.floor(i / 5) * 300;
        return (
          <Circle
            key={`stream-${i}`}
            ref={dataStreamParticles}
            size={3}
            fill={colors.neon}
            x={x}
            y={y}
            opacity={0}
          />
        );
      })}

      {/* ===== LAYER 5: Program Box ===== */}
      <Node ref={programGroup} x={-200} scale={0} opacity={0}>
        {/* Outer halo ring */}
        <Circle
          ref={programHaloOuter}
          size={PROGRAM_SIZE + 100}
          fill={null}
          stroke={colors.neon}
          lineWidth={1.5}
          opacity={0}
          lineDash={[10, 10]}
        />

        {/* Halo pulse ring */}
        <Circle
          ref={programHaloPulse}
          size={PROGRAM_SIZE + 60}
          fill={null}
          stroke={colors.neon}
          lineWidth={2}
          opacity={0}
        />

        {/* Main halo glow */}
        <Circle
          ref={programHalo}
          size={PROGRAM_SIZE + 70}
          fill={colors.neon}
          opacity={0}
          filters={[blur(effects.glowBlurLarge)]}
        />

        {/* Box depth shadow */}
        <Rect
          ref={programBoxDepth}
          width={PROGRAM_SIZE}
          height={PROGRAM_SIZE}
          fill={colors.black}
          opacity={0}
          radius={14}
          x={6}
          y={6}
          filters={[blur(20)]}
        />

        {/* Box glow */}
        <Rect
          ref={programBoxGlow}
          width={PROGRAM_SIZE}
          height={PROGRAM_SIZE}
          fill={colors.neon}
          opacity={0}
          radius={14}
          filters={[blur(effects.glowBlur)]}
        />

        {/* Main box */}
        <Rect
          ref={programBox}
          width={PROGRAM_SIZE}
          height={PROGRAM_SIZE}
          fill={colors.background}
          stroke={colors.neon}
          lineWidth={3}
          radius={14}
        />

        {/* Inner (hollow reveal) */}
        <Rect
          ref={programBoxInner}
          width={PROGRAM_SIZE - 35}
          height={PROGRAM_SIZE - 35}
          fill={null}
          stroke={colors.white}
          lineWidth={1}
          opacity={0}
          radius={10}
          lineDash={[8, 8]}
        />

        {/* === Brain Icon (before shatter) === */}
        <Node ref={brainGroup}>
          {/* Brain glow */}
          <Circle
            ref={brainCircleGlow}
            size={60}
            fill={colors.white}
            y={-15}
            opacity={0}
            filters={[blur(15)]}
          />
          {/* Brain circle */}
          <Circle
            ref={brainCircle}
            size={55}
            fill={null}
            stroke={colors.white}
            lineWidth={2.5}
            y={-15}
          />
          {/* Brain internal lines (neural pathways) */}
          <Line
            ref={brainLines}
            points={[
              [-18, -25],
              [0, -8],
              [18, -25],
            ]}
            stroke={colors.white}
            lineWidth={2}
            lineCap="round"
            lineJoin="round"
            y={-15}
          />
          <Line
            ref={brainLines}
            points={[
              [-12, -5],
              [0, 5],
              [12, -5],
            ]}
            stroke={colors.white}
            lineWidth={2}
            lineCap="round"
            lineJoin="round"
            y={-15}
          />
          <Line
            ref={brainLines}
            points={[
              [-15, 8],
              [15, 8],
            ]}
            stroke={colors.white}
            lineWidth={2}
            lineCap="round"
            y={-15}
          />
          {/* Brain connection dots */}
          {Array.from({ length: 6 }, (_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const r = 20;
            return (
              <Circle
                key={`brain-dot-${i}`}
                ref={brainDots}
                size={5}
                fill={colors.white}
                x={Math.cos(angle) * r}
                y={-15 + Math.sin(angle) * r}
                opacity={0.6}
              />
            );
          })}
        </Node>

        {/* === Brain Shards (for dramatic shatter) === */}
        {Array.from({ length: SHARD_COUNT }, (_, i) => {
          const angle = (i / SHARD_COUNT) * Math.PI * 2;
          const size = 6 + (i % 4) * 3;
          return (
            <Node key={`shard-${i}`}>
              {/* Shard trail */}
              <Circle
                ref={shardTrails}
                size={size + 4}
                fill={colors.white}
                x={0}
                y={-15}
                opacity={0}
                filters={[blur(6)]}
              />
              {/* Shard piece */}
              <Node
                ref={brainShards}
                x={0}
                y={-15}
                opacity={0}
              >
                <Rect
                  width={size}
                  height={size * 0.7}
                  fill={colors.white}
                  rotation={(i * 45) % 360}
                  radius={1}
                />
              </Node>
            </Node>
          );
        })}

        {/* Shatter flash effect */}
        <Circle
          ref={shatterFlash}
          size={120}
          fill={colors.white}
          y={-15}
          opacity={0}
          filters={[blur(40)]}
        />

        {/* === X Mark (after brain shatters) === */}
        <Node ref={xMark} y={-15} opacity={0}>
          {/* X glow */}
          <Node ref={xGlow}>
            <Line
              points={[
                [-25, -25],
                [25, 25],
              ]}
              stroke={colors.neon}
              lineWidth={8}
              lineCap="round"
              filters={[blur(10)]}
            />
            <Line
              points={[
                [25, -25],
                [-25, 25],
              ]}
              stroke={colors.neon}
              lineWidth={8}
              lineCap="round"
              filters={[blur(10)]}
            />
          </Node>
          <Line
            ref={xLine1}
            points={[
              [-25, -25],
              [25, 25],
            ]}
            stroke={colors.neon}
            lineWidth={4}
            lineCap="round"
            end={0}
          />
          <Line
            ref={xLine2}
            points={[
              [25, -25],
              [-25, 25],
            ]}
            stroke={colors.neon}
            lineWidth={4}
            lineCap="round"
            end={0}
          />
        </Node>

        {/* === Hollow Interior Visualization === */}
        <Node ref={hollowGroup} opacity={0}>
          {/* Interior dashed lines suggesting emptiness */}
          {Array.from({ length: 5 }, (_, i) => (
            <Line
              key={`hollow-line-${i}`}
              ref={hollowLines}
              points={[
                [-50 + i * 8, 30],
                [50 - i * 8, 30 + i * 12],
              ]}
              stroke={colors.white}
              lineWidth={1}
              opacity={0.3}
              lineCap="round"
              lineDash={[4, 6]}
              end={0}
            />
          ))}
          {/* Scattered dots suggesting void */}
          {Array.from({ length: 8 }, (_, i) => (
            <Circle
              key={`hollow-dot-${i}`}
              ref={hollowDots}
              size={3}
              fill={colors.white}
              x={-40 + (i % 4) * 26}
              y={35 + Math.floor(i / 4) * 25}
              opacity={0}
            />
          ))}
          {/* "EMPTY" text */}
          <Txt
            ref={emptyText}
            text="∅"
            fontFamily={fonts.data}
            fontSize={28}
            fill={colors.white}
            y={55}
            opacity={0}
          />
        </Node>

        {/* === Code brackets (revealed after hollow) === */}
        <Line
          ref={codeBracket1}
          points={[
            [-45, -30],
            [-60, 25],
            [-45, 80],
          ]}
          stroke={colors.white}
          lineWidth={2.5}
          lineCap="round"
          lineJoin="round"
          opacity={0}
          end={0}
        />
        <Line
          ref={codeBracket2}
          points={[
            [45, -30],
            [60, 25],
            [45, 80],
          ]}
          stroke={colors.white}
          lineWidth={2.5}
          lineCap="round"
          lineJoin="round"
          opacity={0}
          end={0}
        />

        {/* Code lines inside brackets */}
        {Array.from({ length: 4 }, (_, i) => (
          <Line
            key={`code-line-${i}`}
            ref={codeLines}
            points={[
              [-30, 0 + i * 18],
              [30 - (i % 2) * 15, 0 + i * 18],
            ]}
            stroke={colors.neon}
            lineWidth={2}
            lineCap="round"
            opacity={0}
            end={0}
          />
        ))}

        {/* Code dots */}
        <Node ref={codeDotsGroup} y={25} opacity={0}>
          {Array.from({ length: 3 }, (_, i) => (
            <Circle
              key={`code-dot-${i}`}
              ref={codeDots}
              size={7}
              fill={colors.neon}
              x={-12 + i * 12}
              opacity={0}
            />
          ))}
        </Node>

        {/* === Instruction Arrows (showing direction) === */}
        {Array.from({ length: 4 }, (_, i) => {
          const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
          const r = PROGRAM_SIZE / 2 + 25;
          return (
            <Node
              key={`arrow-${i}`}
              ref={instructionArrows}
              x={Math.cos(angle) * r}
              y={Math.sin(angle) * r}
              rotation={(angle * 180 / Math.PI) + 90}
              opacity={0}
            >
              <Line
                points={[
                  [0, -8],
                  [0, 8],
                ]}
                stroke={colors.neon}
                lineWidth={2}
                lineCap="round"
              />
              <Line
                points={[
                  [-5, 3],
                  [0, 8],
                  [5, 3],
                ]}
                stroke={colors.neon}
                lineWidth={2}
                lineCap="round"
                lineJoin="round"
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

  // --- Beat 0 (15:00) - Background layers fade in ---
  yield* all(
    bgGlow1().opacity(0.05, timing.beat),
    bgGlow2().opacity(0.03, timing.beat),
    bgGlow3().opacity(0.02, timing.beat),
    vignetteTopLeft().opacity(0.5, timing.beat),
    vignetteTopRight().opacity(0.5, timing.beat),
    vignetteBottomLeft().opacity(0.5, timing.beat),
    vignetteBottomRight().opacity(0.5, timing.beat),
    ...gridLines.map((line, i) => delay(i * 0.02, line.opacity(0.04, timing.entrance))),
    ...verticalGridLines.map((line, i) => delay(i * 0.02, line.opacity(0.03, timing.entrance))),
  );

  // --- Beat 0.3 (15:03) - Hex grid fades in ---
  yield* all(
    hexGridGroup().opacity(1, timing.entrance),
    ...hexCells.map((cell, i) => delay(i * 0.003, cell.opacity(i % 8 === 0 ? 0.12 : 0.04, timing.entrance))),
    ...hexGlows.map((glow, i) => delay(i * 0.005, glow.opacity(0.08, timing.entrance))),
  );

  // --- Beat 0.5 (15:05) - Circuit traces animate ---
  yield* all(
    ...circuitTraces.map((trace, i) =>
      delay(i * 0.05, all(
        trace.opacity(0.2, timing.fast),
        trace.end(1, 0.25, easeOutCubic),
      ))
    ),
    ...circuitNodes.map((node, i) =>
      delay(i * 0.05 + 0.2, node.opacity(0.4, timing.fast))
    ),
  );

  // --- Beat 1 (15:10) - Program box appears center ---
  yield* all(
    programGroup().scale(1, timing.entrance * 2, easeOutBack),
    programGroup().opacity(1, timing.entrance * 1.5),
    programHalo().opacity(effects.glowOpacitySubtle, timing.entrance * 2),
    programBoxDepth().opacity(0.4, timing.entrance * 2),
  );

  // --- Beat 1.5 (15:15) - Halo rings appear ---
  yield* all(
    programHaloOuter().opacity(0.3, timing.entrance),
    brainCircleGlow().opacity(0.2, timing.entrance),
  );

  // --- Beat 2 (15:20) - Program box pulses ---
  yield* all(
    programBoxGlow().opacity(effects.glowOpacity, timing.fast),
    programGroup().scale(1.04, timing.fast, easeOutCubic),
  );
  yield* all(
    programBoxGlow().opacity(effects.glowOpacitySubtle, timing.microBeat),
    programGroup().scale(1, timing.microBeat, easeInOutCubic),
  );

  // --- Beat 3 (16:00) - Brain icon emphasized ---
  yield* all(
    brainCircle().stroke(colors.neon, timing.fast),
    brainCircle().scale(1.15, timing.fast, easeOutCubic),
    brainCircleGlow().opacity(0.4, timing.fast),
    ...brainDots.map((dot) => dot.opacity(1, timing.fast)),
  );

  // --- Beat 3.5 (16:03) - Dramatic pause before shatter ---
  yield* waitFor(0.1);

  // --- Beat 4 (16:05) - Brain SHATTERS DRAMATICALLY ---
  // Flash effect
  yield* shatterFlash().opacity(0.8, timing.snap);

  // Hide original brain instantly
  yield* all(
    brainCircle().opacity(0, 0),
    brainCircleGlow().opacity(0, 0),
    ...brainLines.map((line) => line.opacity(0, 0)),
    ...brainDots.map((dot) => dot.opacity(0, 0)),
    shatterFlash().opacity(0, 0.15, easeOutCubic),
  );

  // Show and explode shards with trails
  yield* all(
    ...brainShards.map((shard, i) => {
      const angle = (i / SHARD_COUNT) * Math.PI * 2;
      const distance = 80 + (i % 4) * 25;
      const rotation = (i * 60) % 360;
      return all(
        shard.opacity(1, timing.snap),
        shard.x(Math.cos(angle) * distance, 0.35, easeOutCubic),
        shard.y(-15 + Math.sin(angle) * distance, 0.35, easeOutCubic),
        shard.rotation(rotation, 0.35, linear),
        delay(0.18, shard.opacity(0, 0.17, easeInCubic)),
      );
    }),
    ...shardTrails.map((trail, i) => {
      const angle = (i / SHARD_COUNT) * Math.PI * 2;
      const distance = 60 + (i % 4) * 20;
      return all(
        trail.opacity(0.5, timing.snap),
        trail.x(Math.cos(angle) * distance * 0.6, 0.25, easeOutCubic),
        trail.y(-15 + Math.sin(angle) * distance * 0.6, 0.25, easeOutCubic),
        delay(0.1, trail.opacity(0, 0.15, easeInCubic)),
      );
    })
  );

  // --- Beat 5 (16:15) - X mark draws with glow ---
  yield* all(
    xMark().opacity(1, timing.fast),
    xLine1().end(1, 0.18, easeOutCubic),
    delay(0.06, xLine2().end(1, 0.18, easeOutCubic)),
  );

  // --- Beat 5.5 (16:18) - X pulses ---
  yield* all(
    xMark().scale(1.15, timing.fast, easeOutCubic),
  );
  yield* xMark().scale(1, timing.microBeat, easeInOutCubic);

  // --- Beat 6 (17:00) - Program box becomes "hollow" ---
  yield* all(
    programBox().fill(null, timing.entrance),
    programBoxInner().opacity(0.6, timing.entrance),
    xMark().opacity(0.25, timing.entrance),
    xMark().y(-70, timing.entrance, easeOutCubic),
    xMark().scale(0.7, timing.entrance, easeOutCubic),
  );

  // --- Beat 6.5 (17:05) - Hollow interior revealed ---
  yield* all(
    hollowGroup().opacity(1, timing.entrance),
    ...hollowLines.map((line, i) =>
      delay(i * 0.04, line.end(1, 0.2, easeOutCubic))
    ),
    ...hollowDots.map((dot, i) =>
      delay(i * 0.03, dot.opacity(0.4, timing.fast))
    ),
  );

  // --- Beat 6.8 (17:08) - Empty symbol appears ---
  yield* emptyText().opacity(0.5, timing.entrance);

  // --- Beat 7 (17:10) - Code brackets appear (instructions only) ---
  yield* all(
    codeBracket1().opacity(0.7, timing.fast),
    codeBracket2().opacity(0.7, timing.fast),
    codeBracket1().end(1, 0.28, easeOutCubic),
    codeBracket2().end(1, 0.28, easeOutCubic),
  );

  // --- Beat 7.3 (17:13) - Code lines draw ---
  yield* sequence(
    0.04,
    ...codeLines.map((line) =>
      all(
        line.opacity(0.7, timing.fast),
        line.end(1, 0.15, easeOutCubic),
      )
    )
  );

  // --- Beat 8 (17:20) - Code dots appear ---
  yield* all(
    codeDotsGroup().opacity(1, timing.fast),
    ...codeDots.map((dot, i) =>
      delay(i * 0.05, dot.opacity(1, timing.fast))
    ),
  );

  // --- Beat 8.3 (17:23) - Instruction arrows pop ---
  yield* sequence(
    0.04,
    ...instructionArrows.map((arrow) => arrow.opacity(0.5, timing.fast))
  );

  // --- Beat 9 (17:25) - Threads group appears ---
  yield* threadsGroup().opacity(1, timing.entrance);

  // --- Beat 10 (18:00) - Threads shoot out from program box ---
  yield* all(
    ...threads.map((thread, i) =>
      delay(
        i * 0.07,
        all(
          thread.opacity(0.9, timing.fast),
          thread.end(1, 0.22, easeOutCubic),
          threadGlows[i].opacity(0.5, timing.fast),
          threadGlows[i].end(1, 0.22, easeOutCubic),
          threadDashedLines[i].opacity(0.2, timing.fast),
          threadDashedLines[i].end(1, 0.22, easeOutCubic),
        )
      )
    )
  );

  // --- Beat 10.5 (18:05) - Particles travel along threads ---
  yield* all(
    ...threadParticles1.map((particle, i) => {
      const pos = dataBoxPositions[i];
      const endX = pos.x - DATA_BOX_SIZE / 2;
      const endY = pos.y;
      return delay(
        i * 0.08,
        all(
          particle.opacity(1, timing.fast),
          threadParticleGlows[i].opacity(0.6, timing.fast),
          particle.x(endX, 0.35, easeInOutCubic),
          particle.y(endY, 0.35, easeInOutCubic),
          threadParticleGlows[i].x(endX, 0.35, easeInOutCubic),
          threadParticleGlows[i].y(endY, 0.35, easeInOutCubic),
        )
      );
    })
  );

  // --- Beat 11 (18:10) - Endpoint nodes appear ---
  yield* all(
    ...endpointNodes.map((node, i) =>
      delay(i * 0.05, all(
        node.opacity(1, timing.fast),
        endpointGlows[i].opacity(0.4, timing.fast),
      ))
    ),
  );

  // --- Beat 11.3 (18:13) - Data boxes group appears ---
  yield* dataBoxesGroup().opacity(1, timing.entrance);

  // --- Beat 12 (18:15) - Data boxes pop in at thread endpoints ---
  yield* sequence(
    0.07,
    ...dataBoxNodes.map((box, i) =>
      all(
        box.scale(1, timing.entrance * 1.2, easeOutBack),
        box.opacity(1, timing.entrance),
        dataBoxDepths[i].opacity(0.35, timing.entrance),
      )
    )
  );

  // --- Beat 12.5 (18:18) - Second wave of particles ---
  yield* all(
    ...threadParticles2.map((particle, i) => {
      const pos = dataBoxPositions[i];
      const startX = -200 + PROGRAM_SIZE / 2;
      const endX = pos.x - DATA_BOX_SIZE / 2;
      const endY = pos.y;
      return delay(
        i * 0.06,
        all(
          particle.opacity(0.8, timing.fast),
          particle.x(endX, 0.3, easeInOutCubic),
          particle.y(endY, 0.3, easeInOutCubic),
          delay(0.25, particle.opacity(0, timing.fast)),
        )
      );
    })
  );

  // --- Beat 13 (18:25) - Threads connect and data boxes light up ---
  yield* sequence(
    0.06,
    ...dataBoxNodes.map((_, i) =>
      all(
        dataBoxGlows[i].opacity(effects.glowOpacity, timing.fast),
        dataBoxRects[i].stroke(colors.neon, timing.fast),
        dataBoxInners[i].opacity(0.5, timing.fast),
      )
    )
  );

  // --- Beat 13.5 (18:28) - Endpoint pulses ---
  yield* all(
    ...endpointPulses.map((pulse, i) =>
      delay(i * 0.05, all(
        pulse.opacity(0.6, timing.fast),
        pulse.size(35, timing.beat, easeOutCubic),
      ))
    ),
  );
  yield* all(
    ...endpointPulses.map((pulse) =>
      all(
        pulse.opacity(0, timing.microBeat),
        pulse.size(15, 0),
      )
    ),
  );

  // --- Beat 14 (19:00) - Wave fill animation on data boxes ---
  // First wave effect
  yield* sequence(
    0.04,
    ...dataBoxWaves.map((wave) =>
      all(
        wave.height(DATA_BOX_SIZE - 20, 0.25, easeOutCubic),
        wave.y(0, 0.25, easeOutCubic),
        wave.opacity(0.25, timing.fast),
      )
    )
  );

  // --- Beat 14.3 (19:03) - Main fill animation ---
  yield* sequence(
    0.05,
    ...dataBoxFills.map((fill) =>
      all(
        fill.height(DATA_BOX_SIZE - 24, 0.3, easeOutCubic),
        fill.y(0, 0.3, easeOutCubic),
        fill.opacity(0.5, timing.fast),
      )
    )
  );

  // --- Beat 14.5 (19:05) - Labels appear ---
  yield* sequence(
    0.03,
    ...dataBoxLabels.map((label) => label.opacity(0.7, timing.entrance))
  );

  // --- Beat 14.8 (19:08) - Icons appear ---
  yield* sequence(
    0.03,
    ...dataBoxIcons.map((icon) => icon.opacity(0.8, timing.entrance))
  );

  // --- Beat 15 (19:15) - Program box dims (showing it's just instructions, not memory) ---
  yield* all(
    programBoxGlow().opacity(0.08, timing.beat),
    programHalo().opacity(0.04, timing.beat),
    programBox().opacity(0.5, timing.beat),
    ...instructionArrows.map((arrow) => arrow.opacity(0.2, timing.beat)),
    hollowGroup().opacity(0.3, timing.beat),
  );

  // --- Beat 16 (19:20) - Data boxes pulse brighter (emphasis: "data lives here") ---
  yield* all(
    ...dataBoxGlows.map((glow) => glow.opacity(effects.glowOpacityBright, timing.fast)),
    ...dataBoxNodes.map((box) => box.scale(1.06, timing.fast, easeOutCubic)),
    ...dataBoxFills.map((fill) => fill.opacity(0.7, timing.fast)),
  );
  yield* all(
    ...dataBoxGlows.map((glow) => glow.opacity(effects.glowOpacity, timing.microBeat)),
    ...dataBoxNodes.map((box) => box.scale(1, timing.microBeat, easeInOutCubic)),
    ...dataBoxFills.map((fill) => fill.opacity(0.5, timing.microBeat)),
  );

  // --- Beat 17 (19:25) - Ambient particles fade in ---
  yield* all(
    ...ambientParticles.map((p, i) =>
      delay(i * 0.02, p.opacity(0.4, timing.entrance))
    ),
    ...ambientGlows.map((g, i) =>
      delay(i * 0.02, g.opacity(0.2, timing.entrance))
    ),
    ...floatingDataBits.map((bit, i) =>
      delay(i * 0.03, bit.opacity(0.5, timing.entrance))
    ),
  );

  // --- Beat 18 (19:28) - Third particle wave (reinforcing data flow) ---
  yield* all(
    ...threadParticles3.map((particle, i) => {
      const pos = dataBoxPositions[i];
      const endX = pos.x - DATA_BOX_SIZE / 2;
      const endY = pos.y;
      return delay(
        i * 0.05,
        all(
          particle.opacity(0.7, timing.fast),
          particle.x(endX, 0.28, easeInOutCubic),
          particle.y(endY, 0.28, easeInOutCubic),
          delay(0.2, particle.opacity(0, timing.fast)),
        )
      );
    })
  );

  // --- Beat 18.5 (19:29) - Data stream particles flow ---
  yield* all(
    ...dataStreamParticles.map((particle, i) =>
      delay(i * 0.02, all(
        particle.opacity(0.3, timing.fast),
        particle.x(particle.x() + 80, 0.4, linear),
      ))
    )
  );

  // --- Beat 18.8 (19:30) - Background glows intensify ---
  yield* all(
    bgGlow2().opacity(0.06, timing.beat),
    bgGlow1().opacity(0.03, timing.beat),
  );

  // --- Hold for transition (20:00) ---
  yield* waitFor(timing.hold);
});
