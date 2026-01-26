/**
 * Scene 1: Warehouse Emerges
 * Duration: 00:00 - 03:00 (3 seconds)
 * VO: "Solana is basically a giant warehouse full of boxes."
 *
 * Visual metaphor: Single cube appears, multiplies into warehouse grid
 * Enhanced with hexagonal grids, orbital particles, 3D depth, and dynamic animations
 */

import { makeScene2D } from '@revideo/2d';
import { Rect, Node, Line, Circle, Path, blur } from '@revideo/2d';
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

import { RAIKU, colors, timing, effects, layout, cube } from '../lib/raiku';

export default makeScene2D('scene1', function* (view) {
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
  // REFS - Hexagonal Grid Background (Brand Motif)
  // ============================================
  const hexGridContainer = createRef<Node>();
  const hexagons = createRefArray<Path>();
  const hexagonGlows = createRefArray<Path>();
  const hexGridIntersections = createRefArray<Circle>();
  const hexGridIntersectionGlows = createRefArray<Circle>();

  // ============================================
  // REFS - Perspective Grid Lines
  // ============================================
  const perspectiveGridContainer = createRef<Node>();
  const horizontalGridLines = createRefArray<Line>();
  const verticalGridLines = createRefArray<Line>();
  const diagonalGridLines = createRefArray<Line>();

  // ============================================
  // REFS - Orbital Particle System
  // ============================================
  const orbitalContainer = createRef<Node>();
  const orbitalRings = createRefArray<Circle>();
  const orbitalParticles = createRefArray<Circle>();
  const orbitalParticleGlows = createRefArray<Circle>();
  const orbitalTrails = createRefArray<Line>();

  // ============================================
  // REFS - Hero Cube (Main Focus) with 3D Depth
  // ============================================
  const heroCubeGroup = createRef<Node>();
  const heroCubeShadow = createRef<Rect>();
  const heroCubeDepthLayer1 = createRef<Rect>();
  const heroCubeDepthLayer2 = createRef<Rect>();
  const heroCubeDepthLayer3 = createRef<Rect>();
  const heroCubeMainFace = createRef<Rect>();
  const heroCubeTopFace = createRef<Path>();
  const heroCubeRightFace = createRef<Path>();
  const heroCubeGlowOuter = createRef<Rect>();
  const heroCubeGlowInner = createRef<Circle>();
  const heroCubeCornerAccents = createRefArray<Circle>();
  const heroCubeEdgeLines = createRefArray<Line>();
  const heroCubeInternalGrid = createRefArray<Line>();
  const heroCubePulseRing = createRef<Circle>();

  // ============================================
  // REFS - Data Flow Lines (inside hero cube)
  // ============================================
  const dataFlowContainer = createRef<Node>();
  const dataFlowLines = createRefArray<Line>();
  const dataFlowParticles = createRefArray<Circle>();

  // ============================================
  // REFS - Grid Cubes (Warehouse)
  // ============================================
  const gridContainer = createRef<Node>();
  const gridCubes = createRefArray<Node>();
  const gridCubesFaces = createRefArray<Rect>();
  const gridCubesGlows = createRefArray<Rect>();
  const gridCubesShadows = createRefArray<Rect>();
  const gridCubesDepthLines = createRefArray<Line>();

  // ============================================
  // REFS - Warehouse Structure (Enhanced)
  // ============================================
  const warehouseGroup = createRef<Node>();
  const shelfLines = createRefArray<Line>();
  const verticalSupportLines = createRefArray<Line>();
  const crossBraces = createRefArray<Line>();
  const neonAccentLines = createRefArray<Line>();
  const structuralNodes = createRefArray<Circle>();
  const floorReflectionLines = createRefArray<Line>();

  // ============================================
  // REFS - Ambient Floating Particles
  // ============================================
  const ambientParticles = createRefArray<Circle>();
  const ambientParticleGlows = createRefArray<Circle>();

  // ============================================
  // REFS - Data Streams (Background Activity)
  // ============================================
  const dataStreamContainer = createRef<Node>();
  const dataStreams = createRefArray<Line>();
  const dataStreamParticles = createRefArray<Circle>();

  // ============================================
  // REFS - Corner Vignette Effects
  // ============================================
  const vignetteTopLeft = createRef<Circle>();
  const vignetteTopRight = createRef<Circle>();
  const vignetteBottomLeft = createRef<Circle>();
  const vignetteBottomRight = createRef<Circle>();

  // ============================================
  // CONSTANTS
  // ============================================
  const GRID_ROWS = 5;
  const GRID_COLS = 7;
  const CUBE_SPACING = cube.size + cube.gap + 10;
  const PARTICLE_COUNT = 16;
  const ORBITAL_PARTICLE_COUNT = 8;
  const HEX_GRID_COUNT = 24;
  const DATA_STREAM_COUNT = 6;
  const AMBIENT_PARTICLE_COUNT = 20;

  // Hero cube size
  const HERO_SIZE = cube.sizeLarge;
  const HERO_DEPTH = 20;

  // Hexagon path generator
  const createHexPath = (size: number) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      points.push(`${i === 0 ? 'M' : 'L'} ${Math.cos(angle) * size} ${Math.sin(angle) * size}`);
    }
    return points.join(' ') + ' Z';
  };

  // Isometric cube face paths
  const createTopFacePath = (size: number, depth: number) => {
    return `M ${-size/2} ${-size/2} L ${-size/2 + depth} ${-size/2 - depth} L ${size/2 + depth} ${-size/2 - depth} L ${size/2} ${-size/2} Z`;
  };

  const createRightFacePath = (size: number, depth: number) => {
    return `M ${size/2} ${-size/2} L ${size/2 + depth} ${-size/2 - depth} L ${size/2 + depth} ${size/2 - depth} L ${size/2} ${size/2} Z`;
  };

  // ============================================
  // BUILD SCENE
  // ============================================
  view.add(
    <>
      {/* ===== LAYER 0: Corner Vignettes ===== */}
      <Circle
        ref={vignetteTopLeft}
        size={600}
        fill={colors.black}
        opacity={0}
        x={-layout.width / 2}
        y={-layout.height / 2}
        filters={[blur(200)]}
      />
      <Circle
        ref={vignetteTopRight}
        size={600}
        fill={colors.black}
        opacity={0}
        x={layout.width / 2}
        y={-layout.height / 2}
        filters={[blur(200)]}
      />
      <Circle
        ref={vignetteBottomLeft}
        size={600}
        fill={colors.black}
        opacity={0}
        x={-layout.width / 2}
        y={layout.height / 2}
        filters={[blur(200)]}
      />
      <Circle
        ref={vignetteBottomRight}
        size={600}
        fill={colors.black}
        opacity={0}
        x={layout.width / 2}
        y={layout.height / 2}
        filters={[blur(200)]}
      />

      {/* ===== LAYER 1: Deep Background Glows ===== */}
      <Circle
        ref={bgGlow1}
        size={900}
        fill={colors.glow}
        opacity={0}
        x={-450}
        y={-250}
        filters={[blur(250)]}
      />
      <Circle
        ref={bgGlow2}
        size={700}
        fill={colors.glow}
        opacity={0}
        x={550}
        y={350}
        filters={[blur(220)]}
      />
      <Circle
        ref={bgGlow3}
        size={500}
        fill={colors.glow}
        opacity={0}
        x={0}
        y={0}
        filters={[blur(180)]}
      />
      <Circle
        ref={bgGlow4}
        size={400}
        fill={colors.glow}
        opacity={0}
        x={300}
        y={-200}
        filters={[blur(150)]}
      />

      {/* ===== LAYER 2: Hexagonal Grid Background (Raiku Brand Motif) ===== */}
      <Node ref={hexGridContainer} opacity={0}>
        {Array.from({ length: HEX_GRID_COUNT }, (_, i) => {
          const cols = 6;
          const row = Math.floor(i / cols);
          const col = i % cols;
          const hexSize = 80;
          const xSpacing = hexSize * 1.8;
          const ySpacing = hexSize * 1.55;
          const xOffset = row % 2 === 0 ? 0 : xSpacing / 2;
          const x = (col - cols / 2) * xSpacing + xOffset;
          const y = (row - 2) * ySpacing;

          return (
            <Node key={`hex-${i}`}>
              {/* Hexagon glow */}
              <Path
                ref={hexagonGlows}
                data={createHexPath(hexSize)}
                fill={colors.neon}
                opacity={0}
                x={x}
                y={y}
                filters={[blur(15)]}
              />
              {/* Hexagon outline */}
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
              {/* Intersection point */}
              <Circle
                ref={hexGridIntersectionGlows}
                size={8}
                fill={colors.neon}
                opacity={0}
                x={x}
                y={y}
                filters={[blur(6)]}
              />
              <Circle
                ref={hexGridIntersections}
                size={3}
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
      <Node ref={perspectiveGridContainer} opacity={0}>
        {/* Horizontal perspective lines */}
        {Array.from({ length: 12 }, (_, i) => {
          const y = -300 + i * 55;
          const perspectiveScale = 1 - Math.abs(y) / 600;
          return (
            <Line
              key={`h-grid-${i}`}
              ref={horizontalGridLines}
              points={[
                [-layout.width * 0.5 * perspectiveScale, y],
                [layout.width * 0.5 * perspectiveScale, y],
              ]}
              stroke={colors.white}
              lineWidth={0.5}
              opacity={0}
              lineCap="round"
              end={0}
            />
          );
        })}
        {/* Vertical perspective lines */}
        {Array.from({ length: 10 }, (_, i) => {
          const x = -450 + i * 100;
          return (
            <Line
              key={`v-grid-${i}`}
              ref={verticalGridLines}
              points={[
                [x * 0.6, -350],
                [x * 1.2, 350],
              ]}
              stroke={colors.white}
              lineWidth={0.5}
              opacity={0}
              lineCap="round"
              end={0}
            />
          );
        })}
        {/* Diagonal accent lines */}
        {Array.from({ length: 4 }, (_, i) => (
          <Line
            key={`diag-${i}`}
            ref={diagonalGridLines}
            points={[
              [-500 + i * 250, -300],
              [-300 + i * 250, 300],
            ]}
            stroke={colors.neon}
            lineWidth={0.5}
            opacity={0}
            lineCap="round"
            end={0}
          />
        ))}
      </Node>

      {/* ===== LAYER 4: Data Streams (Background Activity) ===== */}
      <Node ref={dataStreamContainer} opacity={0}>
        {Array.from({ length: DATA_STREAM_COUNT }, (_, i) => {
          const startX = -layout.width / 2 - 100;
          const startY = -200 + i * 80;
          const endX = layout.width / 2 + 100;
          const endY = startY + (i % 2 === 0 ? 50 : -50);

          return (
            <Node key={`stream-${i}`}>
              <Line
                ref={dataStreams}
                points={[
                  [startX, startY],
                  [endX, endY],
                ]}
                stroke={colors.neon}
                lineWidth={1}
                opacity={0}
                lineCap="round"
                lineDash={[4, 12]}
                end={0}
              />
              <Circle
                ref={dataStreamParticles}
                size={4}
                fill={colors.neon}
                opacity={0}
                x={startX}
                y={startY}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 5: Ambient Floating Particles ===== */}
      {Array.from({ length: AMBIENT_PARTICLE_COUNT }, (_, i) => {
        const angle = (i / AMBIENT_PARTICLE_COUNT) * Math.PI * 2;
        const radius = 200 + (i % 5) * 120;
        const x = Math.cos(angle) * radius + (i % 3 - 1) * 50;
        const y = Math.sin(angle) * radius * 0.6 + (i % 4 - 2) * 30;

        return (
          <Node key={`ambient-${i}`}>
            <Circle
              ref={ambientParticleGlows}
              size={10 + (i % 5) * 3}
              fill={i % 4 === 0 ? colors.neon : colors.white}
              opacity={0}
              x={x}
              y={y}
              filters={[blur(10)]}
            />
            <Circle
              ref={ambientParticles}
              size={2 + (i % 3)}
              fill={i % 4 === 0 ? colors.neon : colors.white}
              opacity={0}
              x={x}
              y={y}
            />
          </Node>
        );
      })}

      {/* ===== LAYER 6: Warehouse Structure (Enhanced) ===== */}
      <Node ref={warehouseGroup} opacity={0}>
        {/* Main horizontal shelf lines */}
        {Array.from({ length: 7 }, (_, i) => (
          <Line
            key={`shelf-${i}`}
            ref={shelfLines}
            points={[
              [-layout.width * 0.45, -250 + i * 85],
              [layout.width * 0.45, -250 + i * 85],
            ]}
            stroke={colors.white}
            lineWidth={1.5}
            opacity={0}
            lineCap="round"
            end={0}
          />
        ))}

        {/* Vertical support columns */}
        {Array.from({ length: 10 }, (_, i) => (
          <Line
            key={`support-${i}`}
            ref={verticalSupportLines}
            points={[
              [-420 + i * 95, -300],
              [-420 + i * 95, 380],
            ]}
            stroke={colors.white}
            lineWidth={i % 3 === 0 ? 2 : 1}
            opacity={0}
            lineCap="round"
            end={0}
          />
        ))}

        {/* Cross braces for structural detail */}
        {Array.from({ length: 6 }, (_, i) => (
          <Line
            key={`brace-${i}`}
            ref={crossBraces}
            points={[
              [-350 + i * 140, -250],
              [-280 + i * 140, -180],
            ]}
            stroke={colors.white}
            lineWidth={0.5}
            opacity={0}
            lineCap="round"
            end={0}
          />
        ))}

        {/* Structural intersection nodes */}
        {Array.from({ length: 15 }, (_, i) => {
          const col = i % 5;
          const row = Math.floor(i / 5);
          return (
            <Circle
              key={`node-${i}`}
              ref={structuralNodes}
              size={4}
              fill={colors.white}
              opacity={0}
              x={-300 + col * 150}
              y={-200 + row * 150}
            />
          );
        })}

        {/* Neon accent lines at base */}
        {Array.from({ length: 5 }, (_, i) => (
          <Line
            key={`accent-${i}`}
            ref={neonAccentLines}
            points={[
              [-380 + i * 190, 280],
              [-200 + i * 190, 280],
            ]}
            stroke={colors.neon}
            lineWidth={3}
            opacity={0}
            lineCap="round"
            end={0}
          />
        ))}

        {/* Floor reflection lines */}
        {Array.from({ length: 8 }, (_, i) => (
          <Line
            key={`floor-${i}`}
            ref={floorReflectionLines}
            points={[
              [-400 + i * 100, 320],
              [-400 + i * 100, 380],
            ]}
            stroke={colors.neon}
            lineWidth={1}
            opacity={0}
            lineCap="round"
            end={0}
          />
        ))}
      </Node>

      {/* ===== LAYER 7: Grid Cubes (Warehouse) ===== */}
      <Node ref={gridContainer} opacity={0}>
        {Array.from({ length: GRID_ROWS * GRID_COLS }, (_, i) => {
          const row = Math.floor(i / GRID_COLS);
          const col = i % GRID_COLS;
          const x = (col - (GRID_COLS - 1) / 2) * CUBE_SPACING;
          const y = (row - (GRID_ROWS - 1) / 2) * CUBE_SPACING;
          const isHighlighted = (row + col) % 5 === 0;
          const isPrimary = (row === 2 && col === 3);

          return (
            <Node
              key={`grid-cube-${i}`}
              ref={gridCubes}
              x={x}
              y={y}
              scale={0}
              opacity={0}
            >
              {/* Shadow layer */}
              <Rect
                ref={gridCubesShadows}
                width={cube.sizeSmall}
                height={cube.sizeSmall}
                fill={colors.black}
                opacity={0}
                radius={4}
                x={4}
                y={4}
                filters={[blur(8)]}
              />
              {/* Glow layer */}
              <Rect
                ref={gridCubesGlows}
                width={cube.sizeSmall + 4}
                height={cube.sizeSmall + 4}
                fill={isHighlighted ? colors.neon : colors.white}
                opacity={0}
                radius={6}
                filters={[blur(effects.glowBlurSmall)]}
              />
              {/* Depth indicator line */}
              <Line
                ref={gridCubesDepthLines}
                points={[
                  [cube.sizeSmall / 2, -cube.sizeSmall / 2],
                  [cube.sizeSmall / 2 + 8, -cube.sizeSmall / 2 - 8],
                ]}
                stroke={colors.white}
                lineWidth={1}
                opacity={0}
                lineCap="round"
              />
              {/* Main cube face */}
              <Rect
                ref={gridCubesFaces}
                width={cube.sizeSmall}
                height={cube.sizeSmall}
                fill={null}
                stroke={isHighlighted ? colors.neon : colors.white}
                lineWidth={isPrimary ? 2 : cube.strokeWidth}
                opacity={0.7}
                radius={4}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 8: Orbital System Around Hero Cube ===== */}
      <Node ref={orbitalContainer} opacity={0}>
        {/* Orbital rings */}
        {Array.from({ length: 3 }, (_, i) => (
          <Circle
            key={`orbital-ring-${i}`}
            ref={orbitalRings}
            size={HERO_SIZE * (1.8 + i * 0.5)}
            fill={null}
            stroke={colors.white}
            lineWidth={0.5}
            opacity={0}
            lineDash={[2, 8]}
          />
        ))}

        {/* Orbital particles with trails */}
        {Array.from({ length: ORBITAL_PARTICLE_COUNT }, (_, i) => {
          const orbitIndex = i % 3;
          const orbitRadius = HERO_SIZE * (0.9 + orbitIndex * 0.25);
          const angle = (i / ORBITAL_PARTICLE_COUNT) * Math.PI * 2;
          const x = Math.cos(angle) * orbitRadius;
          const y = Math.sin(angle) * orbitRadius * 0.6;

          return (
            <Node key={`orbital-particle-${i}`}>
              {/* Particle trail */}
              <Line
                ref={orbitalTrails}
                points={[
                  [x - 15, y - 5],
                  [x, y],
                ]}
                stroke={i % 2 === 0 ? colors.neon : colors.white}
                lineWidth={2}
                opacity={0}
                lineCap="round"
              />
              {/* Particle glow */}
              <Circle
                ref={orbitalParticleGlows}
                size={12 + (i % 3) * 4}
                fill={i % 2 === 0 ? colors.neon : colors.white}
                opacity={0}
                x={x}
                y={y}
                filters={[blur(8)]}
              />
              {/* Particle core */}
              <Circle
                ref={orbitalParticles}
                size={4 + (i % 2) * 2}
                fill={i % 2 === 0 ? colors.neon : colors.white}
                opacity={0}
                x={x}
                y={y}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 9: Hero Cube (Main Focus) with Full 3D Depth ===== */}
      <Node ref={heroCubeGroup} scale={0} opacity={0}>
        {/* Deep shadow */}
        <Rect
          ref={heroCubeShadow}
          width={HERO_SIZE}
          height={HERO_SIZE}
          fill={colors.black}
          opacity={0}
          radius={10}
          x={15}
          y={15}
          filters={[blur(25)]}
        />

        {/* Pulse ring effect */}
        <Circle
          ref={heroCubePulseRing}
          size={HERO_SIZE * 2}
          fill={null}
          stroke={colors.neon}
          lineWidth={2}
          opacity={0}
        />

        {/* Depth layers (3D effect) */}
        <Rect
          ref={heroCubeDepthLayer3}
          width={HERO_SIZE - 8}
          height={HERO_SIZE - 8}
          fill={null}
          stroke={colors.white}
          lineWidth={0.5}
          opacity={0}
          radius={6}
          x={HERO_DEPTH}
          y={-HERO_DEPTH}
        />
        <Rect
          ref={heroCubeDepthLayer2}
          width={HERO_SIZE - 4}
          height={HERO_SIZE - 4}
          fill={null}
          stroke={colors.white}
          lineWidth={0.8}
          opacity={0}
          radius={7}
          x={HERO_DEPTH * 0.6}
          y={-HERO_DEPTH * 0.6}
        />
        <Rect
          ref={heroCubeDepthLayer1}
          width={HERO_SIZE - 2}
          height={HERO_SIZE - 2}
          fill={null}
          stroke={colors.white}
          lineWidth={1}
          opacity={0}
          radius={8}
          x={HERO_DEPTH * 0.3}
          y={-HERO_DEPTH * 0.3}
        />

        {/* Inner circular glow */}
        <Circle
          ref={heroCubeGlowInner}
          size={HERO_SIZE * 1.8}
          fill={colors.glow}
          opacity={0}
          filters={[blur(effects.glowBlurLarge)]}
        />

        {/* Outer rectangular glow */}
        <Rect
          ref={heroCubeGlowOuter}
          width={HERO_SIZE + 10}
          height={HERO_SIZE + 10}
          fill={colors.neon}
          opacity={0}
          radius={12}
          filters={[blur(effects.glowBlur)]}
        />

        {/* Main cube face */}
        <Rect
          ref={heroCubeMainFace}
          width={HERO_SIZE}
          height={HERO_SIZE}
          fill={null}
          stroke={colors.neon}
          lineWidth={3}
          radius={10}
        />

        {/* Top isometric face */}
        <Path
          ref={heroCubeTopFace}
          data={createTopFacePath(HERO_SIZE, HERO_DEPTH)}
          fill={null}
          stroke={colors.white}
          lineWidth={1.5}
          opacity={0}
        />

        {/* Right isometric face */}
        <Path
          ref={heroCubeRightFace}
          data={createRightFacePath(HERO_SIZE, HERO_DEPTH)}
          fill={null}
          stroke={colors.white}
          lineWidth={1.5}
          opacity={0}
        />

        {/* Corner accent circles */}
        {[
          { x: -HERO_SIZE / 2, y: -HERO_SIZE / 2 },
          { x: HERO_SIZE / 2, y: -HERO_SIZE / 2 },
          { x: -HERO_SIZE / 2, y: HERO_SIZE / 2 },
          { x: HERO_SIZE / 2, y: HERO_SIZE / 2 },
        ].map((pos, i) => (
          <Circle
            key={`corner-${i}`}
            ref={heroCubeCornerAccents}
            size={8}
            fill={colors.neon}
            opacity={0}
            x={pos.x}
            y={pos.y}
          />
        ))}

        {/* Edge highlight lines */}
        {[
          { points: [[-HERO_SIZE / 2 + 10, -HERO_SIZE / 2], [HERO_SIZE / 2 - 10, -HERO_SIZE / 2]] },
          { points: [[-HERO_SIZE / 2 + 10, HERO_SIZE / 2], [HERO_SIZE / 2 - 10, HERO_SIZE / 2]] },
          { points: [[-HERO_SIZE / 2, -HERO_SIZE / 2 + 10], [-HERO_SIZE / 2, HERO_SIZE / 2 - 10]] },
          { points: [[HERO_SIZE / 2, -HERO_SIZE / 2 + 10], [HERO_SIZE / 2, HERO_SIZE / 2 - 10]] },
        ].map((line, i) => (
          <Line
            key={`edge-${i}`}
            ref={heroCubeEdgeLines}
            points={line.points as any}
            stroke={colors.white}
            lineWidth={1}
            opacity={0}
            lineCap="round"
            end={0}
          />
        ))}

        {/* Internal grid pattern */}
        {Array.from({ length: 4 }, (_, i) => (
          <Line
            key={`internal-h-${i}`}
            ref={heroCubeInternalGrid}
            points={[
              [-HERO_SIZE / 2 + 15, -HERO_SIZE / 2 + 25 + i * 25],
              [HERO_SIZE / 2 - 15, -HERO_SIZE / 2 + 25 + i * 25],
            ]}
            stroke={colors.neon}
            lineWidth={0.5}
            opacity={0}
            lineCap="round"
            end={0}
          />
        ))}
        {Array.from({ length: 4 }, (_, i) => (
          <Line
            key={`internal-v-${i}`}
            ref={heroCubeInternalGrid}
            points={[
              [-HERO_SIZE / 2 + 25 + i * 25, -HERO_SIZE / 2 + 15],
              [-HERO_SIZE / 2 + 25 + i * 25, HERO_SIZE / 2 - 15],
            ]}
            stroke={colors.neon}
            lineWidth={0.5}
            opacity={0}
            lineCap="round"
            end={0}
          />
        ))}

        {/* Data flow inside cube */}
        <Node ref={dataFlowContainer} opacity={0}>
          {Array.from({ length: 5 }, (_, i) => {
            const startX = -HERO_SIZE / 2 + 20;
            const startY = -HERO_SIZE / 2 + 20 + i * 22;
            const endX = HERO_SIZE / 2 - 20;
            const endY = startY + (i % 2 === 0 ? 10 : -10);

            return (
              <Node key={`flow-${i}`}>
                <Line
                  ref={dataFlowLines}
                  points={[
                    [startX, startY],
                    [endX, endY],
                  ]}
                  stroke={colors.neon}
                  lineWidth={1}
                  opacity={0}
                  lineCap="round"
                  lineDash={[3, 6]}
                  end={0}
                />
                <Circle
                  ref={dataFlowParticles}
                  size={4}
                  fill={colors.neon}
                  opacity={0}
                  x={startX}
                  y={startY}
                />
              </Node>
            );
          })}
        </Node>
      </Node>
    </>
  );

  // ============================================
  // ANIMATION TIMELINE
  // ============================================

  // --- Phase 1: Hero Cube Emergence (00:00 - 00:20) ---

  // Beat 0 (00:00) - Subtle background glow
  yield* all(
    bgGlow3().opacity(0.02, timing.entrance),
    vignetteTopLeft().opacity(0.3, timing.entrance),
    vignetteBottomRight().opacity(0.3, timing.entrance),
  );

  // Beat 1 (00:03) - Hero cube materializes
  yield* all(
    heroCubeGroup().scale(1, timing.entrance * 2, easeOutBack),
    heroCubeGroup().opacity(1, timing.entrance * 1.5),
    heroCubeGlowInner().opacity(effects.glowOpacitySubtle, timing.entrance * 2),
    heroCubeShadow().opacity(0.4, timing.entrance * 2),
  );

  // Beat 2 (00:06) - 3D depth layers reveal
  yield* all(
    heroCubeDepthLayer1().opacity(0.2, timing.entrance),
    heroCubeDepthLayer2().opacity(0.15, timing.entrance),
    heroCubeDepthLayer3().opacity(0.1, timing.entrance),
    heroCubeTopFace().opacity(0.4, timing.entrance),
    heroCubeRightFace().opacity(0.3, timing.entrance),
  );

  // Beat 3 (00:09) - Glow pulse
  yield* all(
    heroCubeGlowOuter().opacity(effects.glowOpacity, timing.fast),
    heroCubeGroup().scale(effects.pulseScale, timing.fast, easeOutCubic),
    heroCubePulseRing().opacity(0.5, timing.fast),
    heroCubePulseRing().size(HERO_SIZE * 2.5, timing.fast, easeOutCubic),
  );
  yield* all(
    heroCubeGroup().scale(1, timing.microBeat, easeInOutCubic),
    heroCubeGlowOuter().opacity(effects.glowOpacitySubtle, timing.microBeat),
    heroCubePulseRing().opacity(0, timing.microBeat),
    heroCubePulseRing().size(HERO_SIZE * 2, 0),
  );

  // Beat 4 (00:12) - Corner accents pop
  yield* sequence(
    0.02,
    ...heroCubeCornerAccents.map((corner) =>
      all(
        corner.opacity(1, timing.fast),
        corner.scale(1.2, timing.fast, easeOutCubic),
      )
    )
  );
  yield* all(
    ...heroCubeCornerAccents.map((corner) => corner.scale(1, timing.microBeat))
  );

  // Beat 5 (00:15) - Edge lines draw
  yield* sequence(
    0.03,
    ...heroCubeEdgeLines.map((line) =>
      all(
        line.opacity(0.5, timing.fast),
        line.end(1, 0.15, easeOutCubic),
      )
    )
  );

  // --- Phase 2: Internal Activity (00:15 - 00:30) ---

  // Beat 6 (00:18) - Internal grid appears
  yield* sequence(
    0.02,
    ...heroCubeInternalGrid.map((line) =>
      all(
        line.opacity(0.3, timing.fast),
        line.end(1, 0.1, easeOutCubic),
      )
    )
  );

  // Beat 7 (00:20) - Data flow container reveals
  yield* dataFlowContainer().opacity(1, timing.entrance);

  // Beat 8 (00:22) - Data flow lines animate
  yield* sequence(
    0.04,
    ...dataFlowLines.map((line) =>
      all(
        line.opacity(0.6, timing.fast),
        line.end(1, 0.2, easeOutCubic),
      )
    )
  );

  // Beat 9 (00:25) - Data particles travel
  yield* all(
    ...dataFlowParticles.map((particle, i) => {
      const endX = HERO_SIZE / 2 - 20;
      const baseY = -HERO_SIZE / 2 + 20 + i * 22;
      const endY = baseY + (i % 2 === 0 ? 10 : -10);
      return all(
        particle.opacity(0.8, timing.fast),
        particle.x(endX, 0.3, easeInOutCubic),
        particle.y(endY, 0.3, easeInOutCubic),
        delay(0.2, particle.opacity(0, 0.1)),
      );
    })
  );

  // --- Phase 3: Background & Orbital Elements (00:25 - 00:45) ---

  // Beat 10 (00:28) - Background glows intensify
  yield* all(
    bgGlow1().opacity(0.03, timing.beat * 2),
    bgGlow2().opacity(0.02, timing.beat * 2),
    bgGlow4().opacity(0.02, timing.beat * 2),
  );

  // Beat 11 (00:30) - Orbital container appears
  yield* orbitalContainer().opacity(1, timing.entrance);

  // Beat 12 (00:32) - Orbital rings fade in
  yield* sequence(
    0.08,
    ...orbitalRings.map((ring) => ring.opacity(0.2, timing.entrance))
  );

  // Beat 13 (00:35) - Orbital particles appear
  yield* sequence(
    0.03,
    ...orbitalParticles.map((particle, i) =>
      all(
        particle.opacity(0.7, timing.fast),
        orbitalParticleGlows[i].opacity(0.4, timing.fast),
        orbitalTrails[i].opacity(0.3, timing.fast),
      )
    )
  );

  // --- Phase 4: Grid & Warehouse (00:40 - 01:30) ---

  // Beat 14 (00:40) - Hexagonal grid container appears
  yield* hexGridContainer().opacity(1, timing.entrance);

  // Beat 15 (00:42) - Hexagons fade in
  yield* sequence(
    0.02,
    ...hexagons.map((hex, i) =>
      all(
        hex.opacity(0.08, timing.fast),
        hexGridIntersections[i].opacity(0.4, timing.fast),
      )
    )
  );

  // Beat 16 (00:50) - Grid container fades in
  yield* all(
    gridContainer().opacity(1, timing.entrance),
    perspectiveGridContainer().opacity(1, timing.entrance),
  );

  // Beat 17 (00:52) - Perspective grid lines draw
  yield* all(
    sequence(
      0.02,
      ...horizontalGridLines.map((line) =>
        all(
          line.opacity(0.06, timing.fast),
          line.end(1, 0.15, easeOutCubic),
        )
      )
    ),
    sequence(
      0.02,
      ...verticalGridLines.map((line) =>
        all(
          line.opacity(0.04, timing.fast),
          line.end(1, 0.15, easeOutCubic),
        )
      )
    ),
  );

  // Beat 18-22 (01:00 - 01:15) - Grid cubes expand outward (ripple effect)
  const centerRow = Math.floor(GRID_ROWS / 2);
  const centerCol = Math.floor(GRID_COLS / 2);

  const cubeIndices = Array.from({ length: GRID_ROWS * GRID_COLS }, (_, i) => i);
  cubeIndices.sort((a, b) => {
    const rowA = Math.floor(a / GRID_COLS);
    const colA = a % GRID_COLS;
    const rowB = Math.floor(b / GRID_COLS);
    const colB = b % GRID_COLS;
    const distA = Math.abs(rowA - centerRow) + Math.abs(colA - centerCol);
    const distB = Math.abs(rowB - centerRow) + Math.abs(colB - centerCol);
    return distA - distB;
  });

  yield* sequence(
    0.015,
    ...cubeIndices.map((i) =>
      all(
        gridCubes[i].scale(1, timing.entrance * 0.8, easeOutCubic),
        gridCubes[i].opacity(1, timing.entrance * 0.6),
        gridCubesGlows[i].opacity(0.15, timing.entrance),
        gridCubesShadows[i].opacity(0.2, timing.entrance),
        gridCubesDepthLines[i].opacity(0.3, timing.entrance),
      )
    )
  );

  // Beat 23 (01:18) - Hero cube transitions: shrinks and moves
  yield* all(
    heroCubeGroup().scale(0.55, timing.beat * 1.2, easeInOutCubic),
    heroCubeGroup().x(-320, timing.beat * 1.2, easeInOutCubic),
    heroCubeGroup().y(-170, timing.beat * 1.2, easeInOutCubic),
    heroCubeGlowOuter().opacity(0.15, timing.beat),
    heroCubeGlowInner().opacity(0.1, timing.beat),
    orbitalContainer().opacity(0.3, timing.beat),
    orbitalContainer().scale(0.55, timing.beat, easeInOutCubic),
    orbitalContainer().x(-320, timing.beat, easeInOutCubic),
    orbitalContainer().y(-170, timing.beat, easeInOutCubic),
  );

  // --- Phase 5: Warehouse Detail (01:20 - 02:10) ---

  // Beat 24 (01:20) - Warehouse group appears
  yield* warehouseGroup().opacity(1, timing.entrance);

  // Beat 25 (01:22) - Shelf lines draw
  yield* sequence(
    0.035,
    ...shelfLines.map((line) =>
      all(
        line.opacity(0.2, timing.fast),
        line.end(1, 0.25, easeOutCubic),
      )
    )
  );

  // Beat 26 (01:28) - Vertical supports draw
  yield* sequence(
    0.025,
    ...verticalSupportLines.map((line) =>
      all(
        line.opacity(0.12, timing.fast),
        line.end(1, 0.2, easeOutCubic),
      )
    )
  );

  // Beat 27 (01:35) - Cross braces
  yield* sequence(
    0.04,
    ...crossBraces.map((line) =>
      all(
        line.opacity(0.1, timing.fast),
        line.end(1, 0.15, easeOutCubic),
      )
    )
  );

  // Beat 28 (01:40) - Structural nodes pop
  yield* sequence(
    0.03,
    ...structuralNodes.map((node) => node.opacity(0.4, timing.fast))
  );

  // --- Phase 6: Ambient & Final Polish (01:45 - 02:20) ---

  // Beat 29 (01:45) - Data stream container
  yield* dataStreamContainer().opacity(1, timing.entrance);

  // Beat 30 (01:47) - Data streams animate
  yield* sequence(
    0.06,
    ...dataStreams.map((stream, i) =>
      all(
        stream.opacity(0.3, timing.fast),
        stream.end(1, 0.4, easeOutCubic),
        delay(0.1, dataStreamParticles[i].opacity(0.6, timing.fast)),
        delay(0.1, dataStreamParticles[i].x(layout.width / 2 + 100, 0.5, linear)),
      )
    )
  );

  // Beat 31 (02:00) - Background glows final intensity
  yield* all(
    bgGlow1().opacity(0.05, timing.beat * 2),
    bgGlow2().opacity(0.04, timing.beat * 2),
    bgGlow3().opacity(0.06, timing.beat * 2),
    bgGlow4().opacity(0.03, timing.beat * 2),
  );

  // Beat 32 (02:05) - Neon accent lines draw
  yield* sequence(
    0.05,
    ...neonAccentLines.map((line) =>
      all(
        line.opacity(0.8, timing.entrance),
        line.end(1, 0.2, easeOutCubic),
      )
    )
  );

  // Beat 33 (02:10) - Floor reflections
  yield* sequence(
    0.03,
    ...floorReflectionLines.map((line) =>
      all(
        line.opacity(0.4, timing.fast),
        line.end(1, 0.15, easeOutCubic),
      )
    )
  );

  // Beat 34 (02:15) - Ambient particles fade in
  yield* all(
    ...ambientParticles.map((p, i) =>
      delay(
        i * 0.02,
        all(
          p.opacity(0.3 + (i % 4) * 0.1, timing.entrance),
          ambientParticleGlows[i].opacity(0.15, timing.entrance),
        )
      )
    )
  );

  // --- Phase 7: Final Flourish (02:20 - 03:00) ---

  // Beat 35 (02:20) - Diagonal accent lines
  yield* sequence(
    0.06,
    ...diagonalGridLines.map((line) =>
      all(
        line.opacity(0.15, timing.fast),
        line.end(1, 0.25, easeOutCubic),
      )
    )
  );

  // Beat 36 (02:25) - Hex grid intersection pulse
  yield* sequence(
    0.01,
    ...hexGridIntersections.slice(0, 12).map((intersection, i) =>
      all(
        hexGridIntersectionGlows[i].opacity(0.5, timing.fast),
        delay(timing.fast, hexGridIntersectionGlows[i].opacity(0, timing.microBeat)),
      )
    )
  );

  // Beat 37 (02:28) - Grid cube wave pulse
  yield* sequence(
    0.008,
    ...cubeIndices.slice(0, 20).map((i) =>
      all(
        gridCubesGlows[i].opacity(0.4, timing.fast),
        delay(timing.fast, gridCubesGlows[i].opacity(0.15, timing.microBeat)),
      )
    )
  );

  // Beat 38 (02:32) - Final hero cube glow pulse
  yield* all(
    heroCubeGlowOuter().opacity(effects.glowOpacity, timing.fast),
    heroCubePulseRing().opacity(0.4, timing.fast),
    heroCubePulseRing().size(HERO_SIZE * 1.5, timing.fast, easeOutCubic),
  );
  yield* all(
    heroCubeGlowOuter().opacity(0.2, timing.microBeat * 2),
    heroCubePulseRing().opacity(0, timing.microBeat * 2),
  );

  // Beat 39 (02:36) - Neon accent pulse
  yield* all(
    ...neonAccentLines.map((line) => line.opacity(1, timing.fast)),
  );
  yield* all(
    ...neonAccentLines.map((line) => line.opacity(0.6, timing.microBeat)),
  );

  // --- Hold for Transition (02:40 - 03:00) ---
  yield* waitFor(timing.hold * 2);
});
