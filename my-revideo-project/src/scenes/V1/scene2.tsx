/**
 * Scene 2: Three Box Types
 * Duration: 03:00 - 08:00 (5 seconds)
 * VO: "Your wallet? A box. Token balance? Box. Programs? Also boxes.
 *      Everything on Solana lives in a box."
 *
 * Visual: Three distinct cubes rise up with richly detailed icons,
 *         flow particles connect them, then more cubes flood in
 *
 * Enhanced with: 3D depth shadows, secondary halos, flow particles,
 *                hexagonal grid, sophisticated icon details
 */

import { makeScene2D } from '@revideo/2d';
import { Rect, Node, Line, Circle, Path, blur } from '@revideo/2d';
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

import { RAIKU, colors, timing, effects, layout, cube } from '../lib/raiku';

export default makeScene2D('scene2', function* (view) {
  // ============================================
  // SCENE SETUP
  // ============================================
  view.fill(colors.background);

  // ============================================
  // REFS - Deep Background Layers
  // ============================================
  const bgGlow1 = createRef<Circle>();
  const bgGlow2 = createRef<Circle>();
  const bgGlow3 = createRef<Circle>();
  const bgGlow4 = createRef<Circle>();

  // ============================================
  // REFS - Hexagonal Grid Background
  // ============================================
  const hexGridContainer = createRef<Node>();
  const hexagons = createRefArray<Path>();
  const hexGridIntersections = createRefArray<Circle>();

  // ============================================
  // REFS - Perspective Grid
  // ============================================
  const gridContainer = createRef<Node>();
  const horizontalGridLines = createRefArray<Line>();
  const verticalGridLines = createRefArray<Line>();

  // ============================================
  // REFS - Three Hero Cubes with Full 3D
  // ============================================

  // Cube 1: WALLET
  const walletGroup = createRef<Node>();
  const walletShadow = createRef<Rect>();
  const walletDepthLayer1 = createRef<Rect>();
  const walletDepthLayer2 = createRef<Rect>();
  const walletCube = createRef<Rect>();
  const walletGlowOuter = createRef<Rect>();
  const walletGlowInner = createRef<Circle>();
  const walletHalo = createRef<Circle>();
  const walletHaloOuter = createRef<Circle>();
  const walletPulseRing = createRef<Circle>();
  // Wallet icon elements (detailed)
  const walletIcon = createRef<Node>();
  const walletBody = createRef<Rect>();
  const walletBodyInner = createRef<Rect>();
  const walletFlap = createRef<Path>();
  const walletClasp = createRef<Circle>();
  const walletClaspGlow = createRef<Circle>();
  const walletCardSlots = createRefArray<Rect>();
  const walletStitchLines = createRefArray<Line>();

  // Cube 2: TOKEN/COIN
  const tokenGroup = createRef<Node>();
  const tokenShadow = createRef<Rect>();
  const tokenDepthLayer1 = createRef<Rect>();
  const tokenDepthLayer2 = createRef<Rect>();
  const tokenCube = createRef<Rect>();
  const tokenGlowOuter = createRef<Rect>();
  const tokenGlowInner = createRef<Circle>();
  const tokenHalo = createRef<Circle>();
  const tokenHaloOuter = createRef<Circle>();
  const tokenPulseRing = createRef<Circle>();
  // Token icon elements (detailed coin)
  const tokenIcon = createRef<Node>();
  const tokenOuterRing = createRef<Circle>();
  const tokenMiddleRing = createRef<Circle>();
  const tokenInnerRing = createRef<Circle>();
  const tokenCenterDot = createRef<Circle>();
  const tokenRadialLines = createRefArray<Line>();
  const tokenShineArc = createRef<Circle>();

  // Cube 3: PROGRAM/GEAR
  const programGroup = createRef<Node>();
  const programShadow = createRef<Rect>();
  const programDepthLayer1 = createRef<Rect>();
  const programDepthLayer2 = createRef<Rect>();
  const programCube = createRef<Rect>();
  const programGlowOuter = createRef<Rect>();
  const programGlowInner = createRef<Circle>();
  const programHalo = createRef<Circle>();
  const programHaloOuter = createRef<Circle>();
  const programPulseRing = createRef<Circle>();
  // Program icon elements (gear + code)
  const programIcon = createRef<Node>();
  const programGearOuter = createRef<Circle>();
  const programGearInner = createRef<Circle>();
  const programGearCenter = createRef<Circle>();
  const programGearTeeth = createRefArray<Rect>();
  const programBracketLeft = createRef<Line>();
  const programBracketRight = createRef<Line>();
  const programCodeDots = createRefArray<Circle>();

  // ============================================
  // REFS - Connecting Lines & Flow Particles
  // ============================================
  const connectLinesContainer = createRef<Node>();
  const connectLine1 = createRef<Line>();
  const connectLine1Glow = createRef<Line>();
  const connectLine2 = createRef<Line>();
  const connectLine2Glow = createRef<Line>();
  const flowParticles = createRefArray<Circle>();
  const flowParticleGlows = createRefArray<Circle>();

  // ============================================
  // REFS - Flood Cubes (Enhanced)
  // ============================================
  const floodContainer = createRef<Node>();
  const floodCubes = createRefArray<Node>();
  const floodCubeRects = createRefArray<Rect>();
  const floodCubeGlows = createRefArray<Rect>();
  const floodCubeShadows = createRefArray<Rect>();
  const floodCubeDepthLines = createRefArray<Line>();

  // ============================================
  // REFS - Ambient Elements
  // ============================================
  const ambientParticles = createRefArray<Circle>();
  const ambientParticleGlows = createRefArray<Circle>();

  // ============================================
  // REFS - Data Streams (Background)
  // ============================================
  const dataStreamContainer = createRef<Node>();
  const dataStreams = createRefArray<Line>();
  const dataStreamParticles = createRefArray<Circle>();

  // ============================================
  // CONSTANTS
  // ============================================
  const CUBE_SIZE = 150;
  const CUBE_SPACING = 240;
  const CUBE_DEPTH = 15;
  const FLOOD_COUNT = 28;
  const AMBIENT_COUNT = 20;
  const HEX_COUNT = 18;
  const FLOW_PARTICLE_COUNT = 6;
  const DATA_STREAM_COUNT = 4;

  // Hero cube positions
  const positions = {
    wallet: { x: -CUBE_SPACING, y: 0 },
    token: { x: 0, y: 0 },
    program: { x: CUBE_SPACING, y: 0 },
  };

  // Hexagon path generator
  const createHexPath = (size: number) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      points.push(`${i === 0 ? 'M' : 'L'} ${Math.cos(angle) * size} ${Math.sin(angle) * size}`);
    }
    return points.join(' ') + ' Z';
  };

  // ============================================
  // BUILD SCENE
  // ============================================
  view.add(
    <>
      {/* ===== LAYER 1: Deep Background Glows ===== */}
      <Circle
        ref={bgGlow1}
        size={1000}
        fill={colors.glow}
        opacity={0}
        x={-350}
        y={-150}
        filters={[blur(280)]}
      />
      <Circle
        ref={bgGlow2}
        size={800}
        fill={colors.glow}
        opacity={0}
        x={400}
        y={250}
        filters={[blur(240)]}
      />
      <Circle
        ref={bgGlow3}
        size={600}
        fill={colors.glow}
        opacity={0}
        x={0}
        y={0}
        filters={[blur(200)]}
      />
      <Circle
        ref={bgGlow4}
        size={500}
        fill={colors.glow}
        opacity={0}
        x={-200}
        y={200}
        filters={[blur(180)]}
      />

      {/* ===== LAYER 2: Hexagonal Grid Background ===== */}
      <Node ref={hexGridContainer} opacity={0}>
        {Array.from({ length: HEX_COUNT }, (_, i) => {
          const cols = 6;
          const row = Math.floor(i / cols);
          const col = i % cols;
          const hexSize = 100;
          const xSpacing = hexSize * 1.9;
          const ySpacing = hexSize * 1.65;
          const xOffset = row % 2 === 0 ? 0 : xSpacing / 2;
          const x = (col - cols / 2) * xSpacing + xOffset;
          const y = (row - 1.5) * ySpacing;

          return (
            <Node key={`hex-${i}`}>
              <Path
                ref={hexagons}
                data={createHexPath(hexSize)}
                fill={null}
                stroke={colors.white}
                lineWidth={0.5}
                opacity={0}
                x={x}
                y={y}
              />
              <Circle
                ref={hexGridIntersections}
                size={4}
                fill={colors.neon}
                opacity={0}
                x={x}
                y={y}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 3: Perspective Grid ===== */}
      <Node ref={gridContainer} opacity={0}>
        {Array.from({ length: 14 }, (_, i) => (
          <Line
            key={`h-grid-${i}`}
            ref={horizontalGridLines}
            points={[
              [-layout.width / 2, -350 + i * 55],
              [layout.width / 2, -350 + i * 55],
            ]}
            stroke={colors.white}
            lineWidth={0.5}
            opacity={0}
            lineCap="round"
            end={0}
          />
        ))}
        {Array.from({ length: 18 }, (_, i) => (
          <Line
            key={`v-grid-${i}`}
            ref={verticalGridLines}
            points={[
              [-480 + i * 60, -layout.height / 2],
              [-480 + i * 60, layout.height / 2],
            ]}
            stroke={colors.white}
            lineWidth={0.5}
            opacity={0}
            lineCap="round"
            end={0}
          />
        ))}
      </Node>

      {/* ===== LAYER 4: Data Streams (Background) ===== */}
      <Node ref={dataStreamContainer} opacity={0}>
        {Array.from({ length: DATA_STREAM_COUNT }, (_, i) => {
          const y = -150 + i * 100;
          return (
            <Node key={`stream-${i}`}>
              <Line
                ref={dataStreams}
                points={[
                  [-layout.width / 2 - 50, y],
                  [layout.width / 2 + 50, y + (i % 2 === 0 ? 30 : -30)],
                ]}
                stroke={colors.neon}
                lineWidth={1}
                opacity={0}
                lineCap="round"
                lineDash={[4, 15]}
                end={0}
              />
              <Circle
                ref={dataStreamParticles}
                size={5}
                fill={colors.neon}
                opacity={0}
                x={-layout.width / 2 - 50}
                y={y}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 5: Ambient Particles ===== */}
      {Array.from({ length: AMBIENT_COUNT }, (_, i) => {
        const angle = (i / AMBIENT_COUNT) * Math.PI * 2;
        const radius = 320 + (i % 5) * 90;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.55;

        return (
          <Node key={`ambient-${i}`}>
            <Circle
              ref={ambientParticleGlows}
              size={12 + (i % 4) * 3}
              fill={i % 4 === 0 ? colors.neon : colors.white}
              opacity={0}
              x={x}
              y={y}
              filters={[blur(10)]}
            />
            <Circle
              ref={ambientParticles}
              size={3 + (i % 3)}
              fill={i % 4 === 0 ? colors.neon : colors.white}
              opacity={0}
              x={x}
              y={y}
            />
          </Node>
        );
      })}

      {/* ===== LAYER 6: Flood Cubes (Behind Heroes) ===== */}
      <Node ref={floodContainer} opacity={0}>
        {Array.from({ length: FLOOD_COUNT }, (_, i) => {
          const angle = (i / FLOOD_COUNT) * Math.PI * 2;
          const radius = 300 + (i % 4) * 90;
          const size = 35 + (i % 5) * 12;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius * 0.5;
          const isHighlighted = i % 6 === 0;

          return (
            <Node
              key={`flood-${i}`}
              ref={floodCubes}
              x={x}
              y={y}
              scale={0}
              opacity={0}
            >
              {/* Shadow */}
              <Rect
                ref={floodCubeShadows}
                width={size}
                height={size}
                fill={colors.black}
                opacity={0}
                radius={3}
                x={3}
                y={3}
                filters={[blur(6)]}
              />
              {/* Glow */}
              <Rect
                ref={floodCubeGlows}
                width={size + 4}
                height={size + 4}
                fill={isHighlighted ? colors.neon : colors.white}
                opacity={0}
                radius={5}
                filters={[blur(8)]}
              />
              {/* Depth line */}
              <Line
                ref={floodCubeDepthLines}
                points={[
                  [size / 2, -size / 2],
                  [size / 2 + 6, -size / 2 - 6],
                ]}
                stroke={colors.white}
                lineWidth={0.8}
                opacity={0}
                lineCap="round"
              />
              {/* Cube */}
              <Rect
                ref={floodCubeRects}
                width={size}
                height={size}
                fill={null}
                stroke={isHighlighted ? colors.neon : colors.white}
                lineWidth={1.5}
                opacity={0}
                radius={4}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 7: Connecting Lines & Flow Particles ===== */}
      <Node ref={connectLinesContainer} opacity={0}>
        {/* Connection 1: Wallet -> Token */}
        <Line
          ref={connectLine1Glow}
          points={[
            [positions.wallet.x + CUBE_SIZE / 2 + 10, positions.wallet.y],
            [positions.token.x - CUBE_SIZE / 2 - 10, positions.token.y],
          ]}
          stroke={colors.neon}
          lineWidth={6}
          opacity={0}
          lineCap="round"
          end={0}
          filters={[blur(8)]}
        />
        <Line
          ref={connectLine1}
          points={[
            [positions.wallet.x + CUBE_SIZE / 2 + 10, positions.wallet.y],
            [positions.token.x - CUBE_SIZE / 2 - 10, positions.token.y],
          ]}
          stroke={colors.neon}
          lineWidth={2}
          opacity={0}
          lineCap="round"
          end={0}
        />

        {/* Connection 2: Token -> Program */}
        <Line
          ref={connectLine2Glow}
          points={[
            [positions.token.x + CUBE_SIZE / 2 + 10, positions.token.y],
            [positions.program.x - CUBE_SIZE / 2 - 10, positions.program.y],
          ]}
          stroke={colors.neon}
          lineWidth={6}
          opacity={0}
          lineCap="round"
          end={0}
          filters={[blur(8)]}
        />
        <Line
          ref={connectLine2}
          points={[
            [positions.token.x + CUBE_SIZE / 2 + 10, positions.token.y],
            [positions.program.x - CUBE_SIZE / 2 - 10, positions.program.y],
          ]}
          stroke={colors.neon}
          lineWidth={2}
          opacity={0}
          lineCap="round"
          end={0}
        />

        {/* Flow particles along connections */}
        {Array.from({ length: FLOW_PARTICLE_COUNT }, (_, i) => {
          const onFirstLine = i < 3;
          const startX = onFirstLine
            ? positions.wallet.x + CUBE_SIZE / 2 + 10
            : positions.token.x + CUBE_SIZE / 2 + 10;
          const startY = onFirstLine ? positions.wallet.y : positions.token.y;

          return (
            <Node key={`flow-particle-${i}`}>
              <Circle
                ref={flowParticleGlows}
                size={14}
                fill={colors.neon}
                opacity={0}
                x={startX}
                y={startY}
                filters={[blur(8)]}
              />
              <Circle
                ref={flowParticles}
                size={6}
                fill={colors.neon}
                opacity={0}
                x={startX}
                y={startY}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 8: Hero Cube 1 - WALLET ===== */}
      <Node
        ref={walletGroup}
        x={positions.wallet.x}
        y={positions.wallet.y + 120}
        scale={0}
        opacity={0}
      >
        {/* Deep shadow */}
        <Rect
          ref={walletShadow}
          width={CUBE_SIZE}
          height={CUBE_SIZE}
          fill={colors.black}
          opacity={0}
          radius={10}
          x={12}
          y={12}
          filters={[blur(20)]}
        />

        {/* Pulse ring */}
        <Circle
          ref={walletPulseRing}
          size={CUBE_SIZE * 1.8}
          fill={null}
          stroke={colors.neon}
          lineWidth={2}
          opacity={0}
        />

        {/* Outer halo */}
        <Circle
          ref={walletHaloOuter}
          size={CUBE_SIZE * 1.6}
          fill={null}
          stroke={colors.neon}
          lineWidth={1}
          opacity={0}
          lineDash={[4, 8]}
        />

        {/* Inner halo */}
        <Circle
          ref={walletHalo}
          size={CUBE_SIZE * 1.3}
          fill={colors.neon}
          opacity={0}
          filters={[blur(effects.glowBlurLarge)]}
        />

        {/* Depth layers */}
        <Rect
          ref={walletDepthLayer2}
          width={CUBE_SIZE - 6}
          height={CUBE_SIZE - 6}
          fill={null}
          stroke={colors.white}
          lineWidth={0.5}
          opacity={0}
          radius={8}
          x={CUBE_DEPTH}
          y={-CUBE_DEPTH}
        />
        <Rect
          ref={walletDepthLayer1}
          width={CUBE_SIZE - 3}
          height={CUBE_SIZE - 3}
          fill={null}
          stroke={colors.white}
          lineWidth={0.8}
          opacity={0}
          radius={9}
          x={CUBE_DEPTH * 0.5}
          y={-CUBE_DEPTH * 0.5}
        />

        {/* Inner glow */}
        <Circle
          ref={walletGlowInner}
          size={CUBE_SIZE * 1.5}
          fill={colors.glow}
          opacity={0}
          filters={[blur(effects.glowBlurLarge)]}
        />

        {/* Outer glow */}
        <Rect
          ref={walletGlowOuter}
          width={CUBE_SIZE + 8}
          height={CUBE_SIZE + 8}
          fill={colors.neon}
          opacity={0}
          radius={14}
          filters={[blur(effects.glowBlur)]}
        />

        {/* Main cube */}
        <Rect
          ref={walletCube}
          width={CUBE_SIZE}
          height={CUBE_SIZE}
          fill={null}
          stroke={colors.neon}
          lineWidth={3}
          radius={12}
        />

        {/* Wallet Icon (Detailed) */}
        <Node ref={walletIcon} opacity={0}>
          {/* Wallet body outer */}
          <Rect
            ref={walletBody}
            width={60}
            height={42}
            fill={null}
            stroke={colors.white}
            lineWidth={2}
            radius={6}
            y={5}
          />
          {/* Wallet body inner pocket */}
          <Rect
            ref={walletBodyInner}
            width={52}
            height={32}
            fill={null}
            stroke={colors.white}
            lineWidth={1}
            opacity={0}
            radius={4}
            y={7}
          />
          {/* Wallet flap */}
          <Path
            ref={walletFlap}
            data="M -30 -16 Q -30 -26 0 -26 Q 30 -26 30 -16"
            stroke={colors.white}
            lineWidth={2}
            fill={null}
          />
          {/* Card slots */}
          {Array.from({ length: 3 }, (_, i) => (
            <Rect
              key={`card-${i}`}
              ref={walletCardSlots}
              width={14}
              height={8}
              fill={null}
              stroke={colors.neon}
              lineWidth={1}
              opacity={0}
              radius={2}
              x={-18 + i * 18}
              y={12}
            />
          ))}
          {/* Stitch lines */}
          {Array.from({ length: 4 }, (_, i) => (
            <Line
              key={`stitch-${i}`}
              ref={walletStitchLines}
              points={[
                [-26 + i * 17, -10],
                [-26 + i * 17, 20],
              ]}
              stroke={colors.white}
              lineWidth={0.5}
              opacity={0}
              lineDash={[2, 3]}
              lineCap="round"
            />
          ))}
          {/* Clasp glow */}
          <Circle
            ref={walletClaspGlow}
            size={16}
            fill={colors.neon}
            opacity={0}
            x={24}
            y={5}
            filters={[blur(8)]}
          />
          {/* Clasp */}
          <Circle
            ref={walletClasp}
            size={10}
            fill={colors.neon}
            opacity={0}
            x={24}
            y={5}
          />
        </Node>
      </Node>

      {/* ===== LAYER 9: Hero Cube 2 - TOKEN ===== */}
      <Node
        ref={tokenGroup}
        x={positions.token.x}
        y={positions.token.y + 120}
        scale={0}
        opacity={0}
      >
        {/* Deep shadow */}
        <Rect
          ref={tokenShadow}
          width={CUBE_SIZE}
          height={CUBE_SIZE}
          fill={colors.black}
          opacity={0}
          radius={10}
          x={12}
          y={12}
          filters={[blur(20)]}
        />

        {/* Pulse ring */}
        <Circle
          ref={tokenPulseRing}
          size={CUBE_SIZE * 1.8}
          fill={null}
          stroke={colors.neon}
          lineWidth={2}
          opacity={0}
        />

        {/* Outer halo */}
        <Circle
          ref={tokenHaloOuter}
          size={CUBE_SIZE * 1.6}
          fill={null}
          stroke={colors.neon}
          lineWidth={1}
          opacity={0}
          lineDash={[4, 8]}
        />

        {/* Inner halo */}
        <Circle
          ref={tokenHalo}
          size={CUBE_SIZE * 1.3}
          fill={colors.neon}
          opacity={0}
          filters={[blur(effects.glowBlurLarge)]}
        />

        {/* Depth layers */}
        <Rect
          ref={tokenDepthLayer2}
          width={CUBE_SIZE - 6}
          height={CUBE_SIZE - 6}
          fill={null}
          stroke={colors.white}
          lineWidth={0.5}
          opacity={0}
          radius={8}
          x={CUBE_DEPTH}
          y={-CUBE_DEPTH}
        />
        <Rect
          ref={tokenDepthLayer1}
          width={CUBE_SIZE - 3}
          height={CUBE_SIZE - 3}
          fill={null}
          stroke={colors.white}
          lineWidth={0.8}
          opacity={0}
          radius={9}
          x={CUBE_DEPTH * 0.5}
          y={-CUBE_DEPTH * 0.5}
        />

        {/* Inner glow */}
        <Circle
          ref={tokenGlowInner}
          size={CUBE_SIZE * 1.5}
          fill={colors.glow}
          opacity={0}
          filters={[blur(effects.glowBlurLarge)]}
        />

        {/* Outer glow */}
        <Rect
          ref={tokenGlowOuter}
          width={CUBE_SIZE + 8}
          height={CUBE_SIZE + 8}
          fill={colors.neon}
          opacity={0}
          radius={14}
          filters={[blur(effects.glowBlur)]}
        />

        {/* Main cube */}
        <Rect
          ref={tokenCube}
          width={CUBE_SIZE}
          height={CUBE_SIZE}
          fill={null}
          stroke={colors.white}
          lineWidth={3}
          radius={12}
        />

        {/* Token Icon (Detailed Coin) */}
        <Node ref={tokenIcon} opacity={0}>
          {/* Outer ring */}
          <Circle
            ref={tokenOuterRing}
            size={60}
            fill={null}
            stroke={colors.neon}
            lineWidth={3}
            startAngle={0}
            endAngle={0}
          />
          {/* Middle ring */}
          <Circle
            ref={tokenMiddleRing}
            size={45}
            fill={null}
            stroke={colors.neon}
            lineWidth={2}
            opacity={0}
          />
          {/* Inner ring */}
          <Circle
            ref={tokenInnerRing}
            size={30}
            fill={null}
            stroke={colors.neon}
            lineWidth={1.5}
            opacity={0}
          />
          {/* Center dot */}
          <Circle
            ref={tokenCenterDot}
            size={12}
            fill={colors.neon}
            opacity={0}
          />
          {/* Radial lines */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const innerR = 18;
            const outerR = 26;
            return (
              <Line
                key={`radial-${i}`}
                ref={tokenRadialLines}
                points={[
                  [Math.cos(angle) * innerR, Math.sin(angle) * innerR],
                  [Math.cos(angle) * outerR, Math.sin(angle) * outerR],
                ]}
                stroke={colors.neon}
                lineWidth={1}
                opacity={0}
                lineCap="round"
              />
            );
          })}
          {/* Shine arc */}
          <Circle
            ref={tokenShineArc}
            size={55}
            fill={null}
            stroke={colors.white}
            lineWidth={2}
            opacity={0}
            startAngle={-45}
            endAngle={0}
          />
        </Node>
      </Node>

      {/* ===== LAYER 10: Hero Cube 3 - PROGRAM ===== */}
      <Node
        ref={programGroup}
        x={positions.program.x}
        y={positions.program.y + 120}
        scale={0}
        opacity={0}
      >
        {/* Deep shadow */}
        <Rect
          ref={programShadow}
          width={CUBE_SIZE}
          height={CUBE_SIZE}
          fill={colors.black}
          opacity={0}
          radius={10}
          x={12}
          y={12}
          filters={[blur(20)]}
        />

        {/* Pulse ring */}
        <Circle
          ref={programPulseRing}
          size={CUBE_SIZE * 1.8}
          fill={null}
          stroke={colors.neon}
          lineWidth={2}
          opacity={0}
        />

        {/* Outer halo */}
        <Circle
          ref={programHaloOuter}
          size={CUBE_SIZE * 1.6}
          fill={null}
          stroke={colors.neon}
          lineWidth={1}
          opacity={0}
          lineDash={[4, 8]}
        />

        {/* Inner halo */}
        <Circle
          ref={programHalo}
          size={CUBE_SIZE * 1.3}
          fill={colors.neon}
          opacity={0}
          filters={[blur(effects.glowBlurLarge)]}
        />

        {/* Depth layers */}
        <Rect
          ref={programDepthLayer2}
          width={CUBE_SIZE - 6}
          height={CUBE_SIZE - 6}
          fill={null}
          stroke={colors.white}
          lineWidth={0.5}
          opacity={0}
          radius={8}
          x={CUBE_DEPTH}
          y={-CUBE_DEPTH}
        />
        <Rect
          ref={programDepthLayer1}
          width={CUBE_SIZE - 3}
          height={CUBE_SIZE - 3}
          fill={null}
          stroke={colors.white}
          lineWidth={0.8}
          opacity={0}
          radius={9}
          x={CUBE_DEPTH * 0.5}
          y={-CUBE_DEPTH * 0.5}
        />

        {/* Inner glow */}
        <Circle
          ref={programGlowInner}
          size={CUBE_SIZE * 1.5}
          fill={colors.glow}
          opacity={0}
          filters={[blur(effects.glowBlurLarge)]}
        />

        {/* Outer glow */}
        <Rect
          ref={programGlowOuter}
          width={CUBE_SIZE + 8}
          height={CUBE_SIZE + 8}
          fill={colors.neon}
          opacity={0}
          radius={14}
          filters={[blur(effects.glowBlur)]}
        />

        {/* Main cube */}
        <Rect
          ref={programCube}
          width={CUBE_SIZE}
          height={CUBE_SIZE}
          fill={null}
          stroke={colors.white}
          lineWidth={3}
          radius={12}
        />

        {/* Program Icon (Gear + Code) */}
        <Node ref={programIcon} opacity={0}>
          {/* Gear outer ring */}
          <Circle
            ref={programGearOuter}
            size={38}
            fill={null}
            stroke={colors.neon}
            lineWidth={2}
          />
          {/* Gear inner ring */}
          <Circle
            ref={programGearInner}
            size={24}
            fill={null}
            stroke={colors.neon}
            lineWidth={1.5}
            opacity={0}
          />
          {/* Gear center */}
          <Circle
            ref={programGearCenter}
            size={10}
            fill={colors.neon}
            opacity={0}
          />
          {/* Gear teeth */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            return (
              <Rect
                key={`tooth-${i}`}
                ref={programGearTeeth}
                width={8}
                height={12}
                fill={colors.neon}
                x={Math.cos(angle) * 26}
                y={Math.sin(angle) * 26}
                rotation={(angle * 180) / Math.PI + 90}
                opacity={0}
              />
            );
          })}
          {/* Code bracket left */}
          <Line
            ref={programBracketLeft}
            points={[
              [-42, -18],
              [-52, 0],
              [-42, 18],
            ]}
            stroke={colors.white}
            lineWidth={2}
            lineCap="round"
            lineJoin="round"
            end={0}
          />
          {/* Code bracket right */}
          <Line
            ref={programBracketRight}
            points={[
              [42, -18],
              [52, 0],
              [42, 18],
            ]}
            stroke={colors.white}
            lineWidth={2}
            lineCap="round"
            lineJoin="round"
            end={0}
          />
          {/* Code dots */}
          {Array.from({ length: 3 }, (_, i) => (
            <Circle
              key={`code-dot-${i}`}
              ref={programCodeDots}
              size={5}
              fill={colors.neon}
              x={-8 + i * 8}
              y={0}
              opacity={0}
            />
          ))}
        </Node>
      </Node>
    </>
  );

  // ============================================
  // ANIMATION TIMELINE
  // ============================================

  // --- Phase 1: Background Setup (03:00 - 03:10) ---

  // Beat 0 - Subtle background glow
  yield* all(
    bgGlow1().opacity(0.025, timing.beat),
    bgGlow3().opacity(0.02, timing.beat),
  );

  // Beat 1 - Grid fades in
  yield* all(
    gridContainer().opacity(1, timing.entrance),
    sequence(
      0.01,
      ...horizontalGridLines.map((line) =>
        all(
          line.opacity(0.04, timing.fast),
          line.end(1, 0.1, easeOutCubic),
        )
      )
    ),
  );

  // --- Phase 2: Wallet Cube (03:10 - 03:45) ---

  // Beat 2 - Wallet cube rises in
  yield* all(
    walletGroup().scale(1, timing.entrance * 1.8, easeOutBack),
    walletGroup().opacity(1, timing.entrance * 1.5),
    walletGroup().y(positions.wallet.y, timing.entrance * 1.8, easeOutCubic),
    walletShadow().opacity(0.4, timing.entrance * 1.8),
    walletGlowInner().opacity(effects.glowOpacitySubtle, timing.entrance * 1.8),
  );

  // Beat 3 - Depth layers reveal
  yield* all(
    walletDepthLayer1().opacity(0.25, timing.entrance),
    walletDepthLayer2().opacity(0.15, timing.entrance),
  );

  // Beat 4 - Wallet icon appears
  yield* all(
    walletIcon().opacity(1, timing.entrance),
    walletBody().opacity(1, timing.entrance),
  );

  // Beat 5 - Wallet details animate
  yield* all(
    walletBodyInner().opacity(0.5, timing.fast),
    walletClasp().opacity(1, timing.fast),
    walletClaspGlow().opacity(0.6, timing.fast),
  );

  // Beat 6 - Card slots appear
  yield* sequence(
    0.04,
    ...walletCardSlots.map((slot) => slot.opacity(0.7, timing.fast))
  );

  // Beat 7 - Stitch lines
  yield* sequence(
    0.03,
    ...walletStitchLines.map((line) => line.opacity(0.4, timing.fast))
  );

  // Beat 8 - Wallet glow pulse
  yield* all(
    walletGlowOuter().opacity(effects.glowOpacity, timing.fast),
    walletPulseRing().opacity(0.5, timing.fast),
    walletPulseRing().size(CUBE_SIZE * 2.2, timing.fast, easeOutCubic),
  );
  yield* all(
    walletGlowOuter().opacity(effects.glowOpacitySubtle, timing.microBeat),
    walletPulseRing().opacity(0, timing.microBeat),
    walletPulseRing().size(CUBE_SIZE * 1.8, 0),
  );

  // --- Phase 3: Token Cube (03:45 - 04:20) ---

  // Beat 9 - Token cube rises in
  yield* all(
    tokenGroup().scale(1, timing.entrance * 1.8, easeOutBack),
    tokenGroup().opacity(1, timing.entrance * 1.5),
    tokenGroup().y(positions.token.y, timing.entrance * 1.8, easeOutCubic),
    tokenShadow().opacity(0.4, timing.entrance * 1.8),
    tokenGlowInner().opacity(effects.glowOpacitySubtle, timing.entrance * 1.8),
  );

  // Beat 10 - Depth layers
  yield* all(
    tokenDepthLayer1().opacity(0.25, timing.entrance),
    tokenDepthLayer2().opacity(0.15, timing.entrance),
  );

  // Beat 11 - Token icon appears with ring animation
  yield* all(
    tokenIcon().opacity(1, timing.entrance),
    tokenOuterRing().endAngle(360, 0.3, easeOutCubic),
  );

  // Beat 12 - Inner rings
  yield* all(
    tokenMiddleRing().opacity(0.8, timing.fast),
    tokenInnerRing().opacity(0.6, timing.fast),
  );

  // Beat 13 - Center and radials
  yield* all(
    tokenCenterDot().opacity(1, timing.fast),
    sequence(
      0.02,
      ...tokenRadialLines.map((line) => line.opacity(0.7, timing.fast))
    ),
  );

  // Beat 14 - Shine arc
  yield* all(
    tokenShineArc().opacity(0.6, timing.fast),
    tokenShineArc().endAngle(45, 0.2, easeOutCubic),
  );

  // Beat 15 - Token glow pulse
  yield* all(
    tokenGlowOuter().opacity(effects.glowOpacity, timing.fast),
    tokenCube().stroke(colors.neon, timing.fast),
    tokenPulseRing().opacity(0.5, timing.fast),
    tokenPulseRing().size(CUBE_SIZE * 2.2, timing.fast, easeOutCubic),
  );
  yield* all(
    tokenGlowOuter().opacity(effects.glowOpacitySubtle, timing.microBeat),
    tokenPulseRing().opacity(0, timing.microBeat),
  );

  // --- Phase 4: Program Cube (04:20 - 05:00) ---

  // Beat 16 - Program cube rises in
  yield* all(
    programGroup().scale(1, timing.entrance * 1.8, easeOutBack),
    programGroup().opacity(1, timing.entrance * 1.5),
    programGroup().y(positions.program.y, timing.entrance * 1.8, easeOutCubic),
    programShadow().opacity(0.4, timing.entrance * 1.8),
    programGlowInner().opacity(effects.glowOpacitySubtle, timing.entrance * 1.8),
  );

  // Beat 17 - Depth layers
  yield* all(
    programDepthLayer1().opacity(0.25, timing.entrance),
    programDepthLayer2().opacity(0.15, timing.entrance),
  );

  // Beat 18 - Program icon appears
  yield* all(
    programIcon().opacity(1, timing.entrance),
  );

  // Beat 19 - Gear internals
  yield* all(
    programGearInner().opacity(0.7, timing.fast),
    programGearCenter().opacity(1, timing.fast),
  );

  // Beat 20 - Gear teeth animate in
  yield* sequence(
    0.025,
    ...programGearTeeth.map((tooth) =>
      all(
        tooth.opacity(1, timing.fast),
        tooth.scale(1.1, timing.fast, easeOutCubic),
      )
    )
  );
  yield* all(
    ...programGearTeeth.map((tooth) => tooth.scale(1, timing.microBeat))
  );

  // Beat 21 - Code brackets draw
  yield* all(
    programBracketLeft().end(1, 0.2, easeOutCubic),
    programBracketRight().end(1, 0.2, easeOutCubic),
  );

  // Beat 22 - Code dots
  yield* sequence(
    0.04,
    ...programCodeDots.map((dot) => dot.opacity(1, timing.fast))
  );

  // Beat 23 - Program glow pulse
  yield* all(
    programGlowOuter().opacity(effects.glowOpacity, timing.fast),
    programPulseRing().opacity(0.5, timing.fast),
    programPulseRing().size(CUBE_SIZE * 2.2, timing.fast, easeOutCubic),
  );
  yield* all(
    programGlowOuter().opacity(effects.glowOpacitySubtle, timing.microBeat),
    programPulseRing().opacity(0, timing.microBeat),
  );

  // --- Phase 5: Connections & Sync (05:00 - 05:30) ---

  // Beat 24 - All three pulse together
  yield* all(
    walletGlowOuter().opacity(effects.glowOpacity, timing.fast),
    tokenGlowOuter().opacity(effects.glowOpacity, timing.fast),
    programGlowOuter().opacity(effects.glowOpacity, timing.fast),
    walletGroup().scale(1.04, timing.fast, easeOutCubic),
    tokenGroup().scale(1.04, timing.fast, easeOutCubic),
    programGroup().scale(1.04, timing.fast, easeOutCubic),
  );
  yield* all(
    walletGlowOuter().opacity(effects.glowOpacitySubtle, timing.microBeat),
    tokenGlowOuter().opacity(effects.glowOpacitySubtle, timing.microBeat),
    programGlowOuter().opacity(effects.glowOpacitySubtle, timing.microBeat),
    walletGroup().scale(1, timing.microBeat, easeInOutCubic),
    tokenGroup().scale(1, timing.microBeat, easeInOutCubic),
    programGroup().scale(1, timing.microBeat, easeInOutCubic),
  );

  // Beat 25 - Connecting lines container
  yield* connectLinesContainer().opacity(1, timing.entrance);

  // Beat 26 - First connection draws
  yield* all(
    connectLine1().opacity(0.8, timing.fast),
    connectLine1().end(1, 0.25, easeOutCubic),
    connectLine1Glow().opacity(0.4, timing.fast),
    connectLine1Glow().end(1, 0.25, easeOutCubic),
  );

  // Beat 27 - Second connection draws
  yield* all(
    connectLine2().opacity(0.8, timing.fast),
    connectLine2().end(1, 0.25, easeOutCubic),
    connectLine2Glow().opacity(0.4, timing.fast),
    connectLine2Glow().end(1, 0.25, easeOutCubic),
  );

  // Beat 28 - Flow particles travel (first set)
  yield* all(
    ...flowParticles.slice(0, 3).map((particle, i) => {
      const endX = positions.token.x - CUBE_SIZE / 2 - 10;
      return all(
        particle.opacity(0.9, timing.fast),
        flowParticleGlows[i].opacity(0.5, timing.fast),
        particle.x(endX, 0.3, easeInOutCubic),
        flowParticleGlows[i].x(endX, 0.3, easeInOutCubic),
        delay(0.25, particle.opacity(0, 0.05)),
        delay(0.25, flowParticleGlows[i].opacity(0, 0.05)),
      );
    })
  );

  // Beat 29 - Flow particles (second set)
  yield* all(
    ...flowParticles.slice(3).map((particle, i) => {
      const idx = i + 3;
      const endX = positions.program.x - CUBE_SIZE / 2 - 10;
      return all(
        particle.opacity(0.9, timing.fast),
        flowParticleGlows[idx].opacity(0.5, timing.fast),
        particle.x(endX, 0.3, easeInOutCubic),
        flowParticleGlows[idx].x(endX, 0.3, easeInOutCubic),
        delay(0.25, particle.opacity(0, 0.05)),
        delay(0.25, flowParticleGlows[idx].opacity(0, 0.05)),
      );
    })
  );

  // --- Phase 6: Halos & Background (05:30 - 06:00) ---

  // Beat 30 - Halos appear
  yield* all(
    walletHalo().opacity(effects.glowOpacitySubtle, timing.entrance),
    tokenHalo().opacity(effects.glowOpacitySubtle, timing.entrance),
    programHalo().opacity(effects.glowOpacitySubtle, timing.entrance),
    walletHaloOuter().opacity(0.4, timing.entrance),
    tokenHaloOuter().opacity(0.4, timing.entrance),
    programHaloOuter().opacity(0.4, timing.entrance),
  );

  // Beat 31 - Hexagonal grid
  yield* hexGridContainer().opacity(1, timing.entrance);
  yield* sequence(
    0.015,
    ...hexagons.map((hex, i) =>
      all(
        hex.opacity(0.06, timing.fast),
        hexGridIntersections[i].opacity(0.3, timing.fast),
      )
    )
  );

  // Beat 32 - Background intensifies
  yield* all(
    bgGlow2().opacity(0.03, timing.beat),
    bgGlow4().opacity(0.02, timing.beat),
  );

  // --- Phase 7: Flood Cubes (06:00 - 07:00) ---

  // Beat 33 - Flood container appears
  yield* floodContainer().opacity(1, timing.entrance);

  // Beat 34-38 - Flood cubes animate in rapidly
  yield* sequence(
    0.02,
    ...floodCubes.map((cubeNode, i) =>
      all(
        cubeNode.scale(1, timing.entrance * 0.8, easeOutCubic),
        cubeNode.opacity(1, timing.entrance * 0.6),
        floodCubeGlows[i].opacity(0.12, timing.entrance),
        floodCubeShadows[i].opacity(0.2, timing.entrance),
        floodCubeRects[i].opacity(0.6, timing.entrance),
        floodCubeDepthLines[i].opacity(0.25, timing.entrance),
      )
    )
  );

  // Beat 39 - Wave pulse through flood cubes
  yield* sequence(
    0.01,
    ...floodCubes.slice(0, 14).map((_, i) =>
      all(
        floodCubeGlows[i].opacity(0.35, timing.fast),
        delay(timing.fast, floodCubeGlows[i].opacity(0.12, timing.microBeat)),
      )
    )
  );

  // --- Phase 8: Ambient & Data Streams (07:00 - 07:30) ---

  // Beat 40 - Ambient particles
  yield* all(
    ...ambientParticles.map((p, i) =>
      delay(
        i * 0.015,
        all(
          p.opacity(0.4, timing.entrance),
          ambientParticleGlows[i].opacity(0.2, timing.entrance),
        )
      )
    )
  );

  // Beat 41 - Data streams
  yield* dataStreamContainer().opacity(1, timing.entrance);
  yield* sequence(
    0.08,
    ...dataStreams.map((stream, i) =>
      all(
        stream.opacity(0.25, timing.fast),
        stream.end(1, 0.4, easeOutCubic),
        delay(0.1, dataStreamParticles[i].opacity(0.5, timing.fast)),
        delay(0.1, dataStreamParticles[i].x(layout.width / 2 + 50, 0.5, linear)),
      )
    )
  );

  // --- Phase 9: Final Flourish (07:30 - 08:00) ---

  // Beat 42 - Background final intensity
  yield* all(
    bgGlow1().opacity(0.04, timing.beat),
    bgGlow3().opacity(0.035, timing.beat),
  );

  // Beat 43 - Final hero cube emphasis
  yield* all(
    walletGlowOuter().opacity(effects.glowOpacity, timing.fast),
    tokenGlowOuter().opacity(effects.glowOpacity, timing.fast),
    programGlowOuter().opacity(effects.glowOpacity, timing.fast),
  );

  // Beat 44 - Second wave pulse through flood
  yield* sequence(
    0.008,
    ...floodCubes.slice(14).map((_, i) =>
      all(
        floodCubeGlows[i + 14].opacity(0.4, timing.fast),
        delay(timing.fast, floodCubeGlows[i + 14].opacity(0.12, timing.microBeat)),
      )
    )
  );

  // Beat 45 - Hex intersection pulse
  yield* sequence(
    0.01,
    ...hexGridIntersections.slice(0, 9).map((intersection) =>
      all(
        intersection.scale(1.5, timing.fast, easeOutCubic),
        delay(timing.fast, intersection.scale(1, timing.microBeat)),
      )
    )
  );

  // --- Hold for Transition (08:00) ---
  yield* waitFor(timing.hold * 2);
});
