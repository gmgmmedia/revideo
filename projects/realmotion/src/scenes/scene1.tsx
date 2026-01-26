/**
 * Real Motion Scene 1: Community Love
 * VO: "but you wanna have those early community members get shown a lot of love"
 * Duration: ~10 seconds (300 frames @ 30fps)
 *
 * Theme: Hearts and people figures representing community love
 * Visual Elements:
 * - Layered background glows (magenta/pink)
 * - Scanline overlay for retro aesthetic
 * - Grid pattern (Tron-style)
 * - Central heart with orbiting hearts
 * - People figures in community formation
 * - Pulse effects and micro-animations
 */

import {makeScene2D, Rect, Node, Line, Circle, Path, blur} from '@revideo/2d';
import {
  all,
  chain,
  waitFor,
  createRef,
  createRefArray,
  easeOutCubic,
  easeInOutCubic,
  easeOutBack,
  easeInOutQuad,
  easeOutQuad,
  linear,
} from '@revideo/core';

import {colors, icons, layout} from '../lib/brand';

export default makeScene2D('scene1-community-love', function* (view) {
  // ============================================
  // SCENE SETUP
  // ============================================
  view.fill(colors.background);

  // ============================================
  // CONSTANTS
  // ============================================
  const HEART_OUTER_COUNT = 8;
  const HEART_INNER_COUNT = 6;
  const FIGURE_COUNT = 9;
  const MINI_HEART_COUNT = 16;
  const SPARKLE_COUNT = 20;
  const PARTICLE_COUNT = 30;
  const GRID_H = 14;
  const GRID_V = 20;

  // ============================================
  // REFS - Background Glows
  // ============================================
  const bgGlowMagenta1 = createRef<Circle>();
  const bgGlowMagenta2 = createRef<Circle>();
  const bgGlowPink1 = createRef<Circle>();
  const bgGlowPink2 = createRef<Circle>();
  const bgGlowPurple1 = createRef<Circle>();
  const bgGlowYellow1 = createRef<Circle>();

  // ============================================
  // REFS - Scanlines
  // ============================================
  const scanlineContainer = createRef<Node>();

  // ============================================
  // REFS - Grid
  // ============================================
  const gridContainer = createRef<Node>();
  const gridLinesH = createRefArray<Line>();
  const gridLinesV = createRefArray<Line>();

  // ============================================
  // REFS - Center Heart
  // ============================================
  const centerHeartContainer = createRef<Node>();
  const centerHeart = createRef<Path>();
  const centerHeartGlow = createRef<Path>();
  const centerHeartSphereGlow = createRef<Circle>();
  const centerHeartOuterGlow = createRef<Circle>();
  const centerPulseRing1 = createRef<Circle>();
  const centerPulseRing2 = createRef<Circle>();
  const centerPulseRing3 = createRef<Circle>();

  // ============================================
  // REFS - Inner Hearts
  // ============================================
  const innerHeartsContainer = createRef<Node>();
  const innerHearts = createRefArray<Path>();
  const innerHeartsGlow = createRefArray<Path>();
  const innerHeartsSphere = createRefArray<Circle>();

  // ============================================
  // REFS - Outer Hearts
  // ============================================
  const outerHeartsContainer = createRef<Node>();
  const outerHearts = createRefArray<Path>();
  const outerHeartsGlow = createRefArray<Path>();
  const outerHeartsSphere = createRefArray<Circle>();
  const outerHeartsPulse = createRefArray<Circle>();

  // ============================================
  // REFS - Mini Floating Hearts
  // ============================================
  const miniHeartsContainer = createRef<Node>();
  const miniHearts = createRefArray<Path>();
  const miniHeartsGlow = createRefArray<Circle>();

  // ============================================
  // REFS - Figures
  // ============================================
  const figuresContainer = createRef<Node>();
  const figures = createRefArray<Path>();
  const figuresGlow = createRefArray<Path>();
  const figuresSphere = createRefArray<Circle>();
  const figuresOuter = createRefArray<Circle>();

  // ============================================
  // REFS - Connection Lines
  // ============================================
  const connectionsContainer = createRef<Node>();
  const connectionLines = createRefArray<Line>();
  const connectionGlows = createRefArray<Line>();

  // ============================================
  // REFS - Sparkles
  // ============================================
  const sparklesContainer = createRef<Node>();
  const sparkles = createRefArray<Path>();
  const sparklesGlow = createRefArray<Path>();

  // ============================================
  // REFS - Particles
  // ============================================
  const particlesContainer = createRef<Node>();
  const particles = createRefArray<Circle>();
  const particlesGlow = createRefArray<Circle>();

  // ============================================
  // REFS - Decorative Rings
  // ============================================
  const decorativeRingsContainer = createRef<Node>();
  const decorativeRings = createRefArray<Circle>();
  const decorativeRingsGlow = createRefArray<Circle>();
  const decorativeRingsInner = createRefArray<Circle>();

  // ============================================
  // REFS - Floating Dots
  // ============================================
  const floatingDotsContainer = createRef<Node>();
  const floatingDots = createRefArray<Circle>();
  const floatingDotsGlow = createRefArray<Circle>();
  const floatingDotsTrail = createRefArray<Circle>();

  // ============================================
  // REFS - Wave Lines
  // ============================================
  const waveLinesContainer = createRef<Node>();
  const waveLines = createRefArray<Line>();
  const waveLinesGlow = createRefArray<Line>();

  // ============================================
  // REFS - Corner Accents
  // ============================================
  const cornerAccentsContainer = createRef<Node>();
  const cornerAccents = createRefArray<Rect>();
  const cornerAccentsGlow = createRefArray<Rect>();
  const cornerDots = createRefArray<Circle>();

  // ============================================
  // REFS - Energy Orbs
  // ============================================
  const energyOrbsContainer = createRef<Node>();
  const energyOrbs = createRefArray<Circle>();
  const energyOrbsGlow = createRefArray<Circle>();
  const energyOrbsCore = createRefArray<Circle>();
  const energyOrbsRing = createRefArray<Circle>();

  // ============================================
  // REFS - Hexagon Pattern
  // ============================================
  const hexPatternContainer = createRef<Node>();
  const hexagons = createRefArray<Path>();
  const hexagonsGlow = createRefArray<Path>();

  // ============================================
  // REFS - Pulse Waves
  // ============================================
  const pulseWavesContainer = createRef<Node>();
  const pulseWaves = createRefArray<Circle>();

  // ============================================
  // ADDITIONAL CONSTANTS
  // ============================================
  const DECORATIVE_RING_COUNT = 6;
  const FLOATING_DOT_COUNT = 24;
  const WAVE_LINE_COUNT = 8;
  const ENERGY_ORB_COUNT = 10;
  const HEX_COUNT = 12;
  const PULSE_WAVE_COUNT = 5;

  // ============================================
  // POSITION CALCULATIONS
  // ============================================

  // Outer hearts (elliptical ring)
  const outerHeartPos = Array.from({length: HEART_OUTER_COUNT}, (_, i) => {
    const angle = (i / HEART_OUTER_COUNT) * Math.PI * 2 - Math.PI / 2;
    return {
      x: Math.cos(angle) * 280,
      y: Math.sin(angle) * 200,
      angle,
      scale: 1.6 + (i % 2) * 0.3,
    };
  });

  // Inner hearts (smaller ring)
  const innerHeartPos = Array.from({length: HEART_INNER_COUNT}, (_, i) => {
    const angle = (i / HEART_INNER_COUNT) * Math.PI * 2 - Math.PI / 2 + Math.PI / HEART_INNER_COUNT;
    return {
      x: Math.cos(angle) * 150,
      y: Math.sin(angle) * 110,
      angle,
      scale: 2.0 + (i % 2) * 0.25,
    };
  });

  // Figures (arc at bottom)
  const figurePos = Array.from({length: FIGURE_COUNT}, (_, i) => {
    const spread = 600;
    const x = (i - (FIGURE_COUNT - 1) / 2) * (spread / (FIGURE_COUNT - 1));
    const normalizedX = (i - (FIGURE_COUNT - 1) / 2) / ((FIGURE_COUNT - 1) / 2);
    const y = 260 + Math.abs(normalizedX) * 60;
    const isCenter = i === Math.floor(FIGURE_COUNT / 2);
    return {x, y, isCenter, scale: isCenter ? 3.2 : 2.5};
  });

  // Connection pairs
  const connectionPairs = Array.from({length: FIGURE_COUNT - 1}, (_, i) => [i, i + 1]);

  // Mini hearts (scattered)
  const miniHeartPos = Array.from({length: MINI_HEART_COUNT}, (_, i) => {
    const angle = (i / MINI_HEART_COUNT) * Math.PI * 2;
    const radius = 350 + (i % 4) * 80;
    return {
      x: Math.cos(angle) * radius + Math.sin(i * 3) * 40,
      y: Math.sin(angle) * radius * 0.6 + Math.cos(i * 3) * 30,
      scale: 0.6 + (i % 3) * 0.2,
    };
  });

  // Sparkles
  const sparklePos = Array.from({length: SPARKLE_COUNT}, (_, i) => {
    const angle = (i / SPARKLE_COUNT) * Math.PI * 2;
    const radius = 300 + (i % 5) * 70;
    return {
      x: Math.cos(angle) * radius + Math.sin(i * 2) * 60,
      y: Math.sin(angle) * radius * 0.55 + Math.cos(i * 2) * 40,
      scale: 0.7 + (i % 3) * 0.25,
    };
  });

  // Particles
  const particlePos = Array.from({length: PARTICLE_COUNT}, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
    const radius = 380 + (i % 6) * 50;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.5,
      size: 4 + (i % 4) * 2,
    };
  });

  // Decorative rings positions
  const decorativeRingPos = Array.from({length: DECORATIVE_RING_COUNT}, (_, i) => {
    const angle = (i / DECORATIVE_RING_COUNT) * Math.PI * 2 + Math.PI / 6;
    const radius = 420 + (i % 3) * 60;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.55,
      size: 50 + (i % 3) * 20,
    };
  });

  // Floating dots positions
  const floatingDotPos = Array.from({length: FLOATING_DOT_COUNT}, (_, i) => {
    const angle = (i / FLOATING_DOT_COUNT) * Math.PI * 2;
    const radius = 320 + (i % 5) * 65;
    return {
      x: Math.cos(angle) * radius + Math.sin(i * 2.5) * 45,
      y: Math.sin(angle) * radius * 0.52 + Math.cos(i * 2.5) * 35,
      size: 3 + (i % 4) * 2,
    };
  });

  // Wave line control points
  const waveLinePoints = Array.from({length: WAVE_LINE_COUNT}, (_, i) => {
    const baseY = -350 + i * 100;
    const amplitude = 30 + (i % 3) * 15;
    const points: [number, number][] = [];
    for (let x = -900; x <= 900; x += 100) {
      const yOffset = Math.sin((x / 900) * Math.PI * 2 + i * 0.5) * amplitude;
      points.push([x, baseY + yOffset]);
    }
    return {points, baseY};
  });

  // Energy orbs positions
  const energyOrbPos = Array.from({length: ENERGY_ORB_COUNT}, (_, i) => {
    const angle = (i / ENERGY_ORB_COUNT) * Math.PI * 2 + Math.PI / 10;
    const radius = 480 + (i % 4) * 45;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.48,
      size: 12 + (i % 3) * 6,
    };
  });

  // Hexagon positions
  const hexPos = Array.from({length: HEX_COUNT}, (_, i) => {
    const angle = (i / HEX_COUNT) * Math.PI * 2 + Math.PI / 4;
    const radius = 360 + (i % 4) * 80;
    return {
      x: Math.cos(angle) * radius + Math.sin(i * 1.8) * 35,
      y: Math.sin(angle) * radius * 0.5 + Math.cos(i * 1.8) * 25,
      scale: 0.6 + (i % 3) * 0.2,
    };
  });

  // Hexagon path
  const hexPath = 'M 0 -10 L 8.66 -5 L 8.66 5 L 0 10 L -8.66 5 L -8.66 -5 Z';

  // Corner positions
  const cornerPositions = [
    {x: -850, y: -450, rotation: 0},
    {x: 850, y: -450, rotation: 90},
    {x: 850, y: 450, rotation: 180},
    {x: -850, y: 450, rotation: 270},
  ];

  // ============================================
  // BUILD SCENE
  // ============================================
  view.add(
    <>
      {/* ===== LAYER 1: Background Glows ===== */}
      <Circle
        ref={bgGlowMagenta1}
        size={1000}
        fill={colors.magenta}
        opacity={0}
        x={-350}
        y={-250}
        filters={[blur(350)]}
      />
      <Circle
        ref={bgGlowMagenta2}
        size={700}
        fill={colors.magenta}
        opacity={0}
        x={400}
        y={300}
        filters={[blur(280)]}
      />
      <Circle
        ref={bgGlowPink1}
        size={600}
        fill={colors.pink}
        opacity={0}
        x={0}
        y={-150}
        filters={[blur(250)]}
      />
      <Circle
        ref={bgGlowPink2}
        size={500}
        fill={colors.pink}
        opacity={0}
        x={200}
        y={150}
        filters={[blur(200)]}
      />
      <Circle
        ref={bgGlowPurple1}
        size={900}
        fill={colors.purple}
        opacity={0}
        x={0}
        y={350}
        filters={[blur(350)]}
      />
      <Circle
        ref={bgGlowYellow1}
        size={500}
        fill={colors.yellow}
        opacity={0}
        x={350}
        y={-200}
        filters={[blur(200)]}
      />

      {/* ===== LAYER 2: Scanlines ===== */}
      <Node ref={scanlineContainer} opacity={0}>
        {Array.from({length: 135}, (_, i) => (
          <Rect
            key={`scanline-${i}`}
            width={layout.width + 200}
            height={2}
            fill="#000000"
            opacity={0.06}
            y={-540 + i * 8}
          />
        ))}
      </Node>

      {/* ===== LAYER 3: Grid ===== */}
      <Node ref={gridContainer} opacity={0}>
        {Array.from({length: GRID_H}, (_, i) => (
          <Line
            ref={gridLinesH}
            key={`gh-${i}`}
            points={[[-960, -400 + i * 60], [960, -400 + i * 60]]}
            stroke={colors.magenta}
            lineWidth={1}
            opacity={0}
            end={0}
          />
        ))}
        {Array.from({length: GRID_V}, (_, i) => (
          <Line
            ref={gridLinesV}
            key={`gv-${i}`}
            points={[[-900 + i * 95, -540], [-900 + i * 95, 540]]}
            stroke={colors.magenta}
            lineWidth={1}
            opacity={0}
            end={0}
          />
        ))}
      </Node>

      {/* ===== LAYER 4: Mini Floating Hearts ===== */}
      <Node ref={miniHeartsContainer} opacity={0}>
        {miniHeartPos.map((pos, i) => (
          <Node key={`mini-${i}`} x={pos.x} y={pos.y}>
            <Circle
              ref={miniHeartsGlow}
              size={30}
              fill={i % 2 === 0 ? colors.magenta : colors.pink}
              opacity={0}
              filters={[blur(12)]}
            />
            <Path
              ref={miniHearts}
              data={icons.heart}
              fill={i % 2 === 0 ? colors.magenta : colors.pink}
              opacity={0}
              scale={0}
              offset={[-0.5, -0.5]}
            />
          </Node>
        ))}
      </Node>

      {/* ===== LAYER 5: Connections ===== */}
      <Node ref={connectionsContainer} opacity={0}>
        {connectionPairs.map(([from, to], i) => (
          <Node key={`conn-${i}`}>
            <Line
              ref={connectionGlows}
              points={[[figurePos[from].x, figurePos[from].y], [figurePos[to].x, figurePos[to].y]]}
              stroke={colors.magenta}
              lineWidth={4}
              opacity={0}
              end={0}
              lineDash={[10, 6]}
              filters={[blur(5)]}
            />
            <Line
              ref={connectionLines}
              points={[[figurePos[from].x, figurePos[from].y], [figurePos[to].x, figurePos[to].y]]}
              stroke={colors.magenta}
              lineWidth={2}
              opacity={0}
              end={0}
              lineDash={[10, 6]}
            />
          </Node>
        ))}
      </Node>

      {/* ===== LAYER 6: Particles ===== */}
      <Node ref={particlesContainer} opacity={0}>
        {particlePos.map((pos, i) => (
          <Node key={`particle-${i}`} x={pos.x} y={pos.y}>
            <Circle
              ref={particlesGlow}
              size={pos.size * 3}
              fill={i % 3 === 0 ? colors.magenta : i % 3 === 1 ? colors.yellow : colors.pink}
              opacity={0}
              filters={[blur(10)]}
            />
            <Circle
              ref={particles}
              size={pos.size}
              fill={i % 3 === 0 ? colors.magenta : i % 3 === 1 ? colors.yellow : colors.pink}
              opacity={0}
            />
          </Node>
        ))}
      </Node>

      {/* ===== LAYER 7: Outer Hearts ===== */}
      <Node ref={outerHeartsContainer} opacity={0}>
        {outerHeartPos.map((pos, i) => (
          <Node key={`outer-${i}`} x={pos.x} y={pos.y}>
            <Circle
              ref={outerHeartsPulse}
              size={50}
              fill={null}
              stroke={i % 2 === 0 ? colors.magenta : colors.pink}
              lineWidth={2}
              opacity={0}
            />
            <Circle
              ref={outerHeartsSphere}
              size={60 + (i % 3) * 10}
              fill={i % 2 === 0 ? colors.magenta : colors.pink}
              opacity={0}
              filters={[blur(22)]}
            />
            <Path
              ref={outerHeartsGlow}
              data={icons.heart}
              fill={i % 2 === 0 ? colors.magenta : colors.pink}
              opacity={0}
              scale={pos.scale}
              offset={[-0.5, -0.5]}
              filters={[blur(10)]}
            />
            <Path
              ref={outerHearts}
              data={icons.heart}
              fill={i % 2 === 0 ? colors.magenta : colors.pink}
              opacity={0}
              scale={0}
              offset={[-0.5, -0.5]}
            />
          </Node>
        ))}
      </Node>

      {/* ===== LAYER 8: Inner Hearts ===== */}
      <Node ref={innerHeartsContainer} opacity={0}>
        {innerHeartPos.map((pos, i) => (
          <Node key={`inner-${i}`} x={pos.x} y={pos.y}>
            <Circle
              ref={innerHeartsSphere}
              size={70 + (i % 2) * 15}
              fill={i % 2 === 0 ? colors.pink : colors.magenta}
              opacity={0}
              filters={[blur(25)]}
            />
            <Path
              ref={innerHeartsGlow}
              data={icons.heart}
              fill={i % 2 === 0 ? colors.pink : colors.magenta}
              opacity={0}
              scale={pos.scale}
              offset={[-0.5, -0.5]}
              filters={[blur(12)]}
            />
            <Path
              ref={innerHearts}
              data={icons.heart}
              fill={i % 2 === 0 ? colors.pink : colors.magenta}
              opacity={0}
              scale={0}
              offset={[-0.5, -0.5]}
            />
          </Node>
        ))}
      </Node>

      {/* ===== LAYER 9: Center Heart ===== */}
      <Node ref={centerHeartContainer} opacity={0} y={-40}>
        <Circle
          ref={centerHeartOuterGlow}
          size={220}
          fill={colors.magenta}
          opacity={0}
          filters={[blur(70)]}
        />
        <Circle
          ref={centerPulseRing1}
          size={100}
          fill={null}
          stroke={colors.magenta}
          lineWidth={3}
          opacity={0}
        />
        <Circle
          ref={centerPulseRing2}
          size={130}
          fill={null}
          stroke={colors.pink}
          lineWidth={2}
          opacity={0}
        />
        <Circle
          ref={centerPulseRing3}
          size={160}
          fill={null}
          stroke={colors.yellow}
          lineWidth={1}
          opacity={0}
        />
        <Circle
          ref={centerHeartSphereGlow}
          size={120}
          fill={colors.magenta}
          opacity={0}
          filters={[blur(35)]}
        />
        <Path
          ref={centerHeartGlow}
          data={icons.heart}
          fill={colors.magenta}
          opacity={0}
          scale={3.5}
          offset={[-0.5, -0.5]}
          filters={[blur(18)]}
        />
        <Path
          ref={centerHeart}
          data={icons.heart}
          fill={colors.magenta}
          opacity={0}
          scale={0}
          offset={[-0.5, -0.5]}
        />
      </Node>

      {/* ===== LAYER 10: Figures ===== */}
      <Node ref={figuresContainer} opacity={0}>
        {figurePos.map((pos, i) => (
          <Node key={`figure-${i}`} x={pos.x} y={pos.y}>
            <Circle
              ref={figuresOuter}
              size={pos.isCenter ? 100 : 70}
              fill={pos.isCenter ? colors.yellow : colors.magenta}
              opacity={0}
              filters={[blur(30)]}
            />
            <Circle
              ref={figuresSphere}
              size={pos.isCenter ? 60 : 45}
              fill={pos.isCenter ? colors.yellow : colors.magenta}
              opacity={0}
              filters={[blur(18)]}
            />
            <Path
              ref={figuresGlow}
              data={icons.person}
              fill={pos.isCenter ? colors.yellow : colors.magenta}
              opacity={0}
              scale={pos.scale}
              offset={[-0.5, -0.5]}
              filters={[blur(10)]}
            />
            <Path
              ref={figures}
              data={icons.person}
              fill={pos.isCenter ? colors.yellow : colors.white}
              opacity={0}
              scale={0}
              offset={[-0.5, -0.5]}
            />
          </Node>
        ))}
      </Node>

      {/* ===== LAYER 11: Sparkles ===== */}
      <Node ref={sparklesContainer} opacity={0}>
        {sparklePos.map((pos, i) => (
          <Node key={`sparkle-${i}`} x={pos.x} y={pos.y}>
            <Path
              ref={sparklesGlow}
              data={icons.star}
              fill={i % 3 === 0 ? colors.yellow : i % 3 === 1 ? colors.magenta : colors.pink}
              opacity={0}
              scale={pos.scale}
              offset={[-0.5, -0.5]}
              filters={[blur(8)]}
            />
            <Path
              ref={sparkles}
              data={icons.star}
              fill={i % 3 === 0 ? colors.yellow : i % 3 === 1 ? colors.magenta : colors.pink}
              opacity={0}
              scale={0}
              offset={[-0.5, -0.5]}
            />
          </Node>
        ))}
      </Node>

      {/* ===== LAYER 12: Decorative Rings ===== */}
      <Node ref={decorativeRingsContainer} opacity={0}>
        {decorativeRingPos.map((pos, i) => (
          <Node key={`dec-ring-${i}`} x={pos.x} y={pos.y}>
            <Circle
              ref={decorativeRingsGlow}
              size={pos.size + 30}
              fill={null}
              stroke={i % 3 === 0 ? colors.magenta : i % 3 === 1 ? colors.pink : colors.yellow}
              lineWidth={3}
              opacity={0}
              filters={[blur(8)]}
            />
            <Circle
              ref={decorativeRings}
              size={pos.size}
              fill={null}
              stroke={i % 3 === 0 ? colors.magenta : i % 3 === 1 ? colors.pink : colors.yellow}
              lineWidth={2}
              opacity={0}
            />
            <Circle
              ref={decorativeRingsInner}
              size={pos.size * 0.5}
              fill={null}
              stroke={i % 3 === 0 ? colors.magenta : i % 3 === 1 ? colors.pink : colors.yellow}
              lineWidth={1}
              opacity={0}
            />
          </Node>
        ))}
      </Node>

      {/* ===== LAYER 13: Floating Dots ===== */}
      <Node ref={floatingDotsContainer} opacity={0}>
        {floatingDotPos.map((pos, i) => (
          <Node key={`float-dot-${i}`} x={pos.x} y={pos.y}>
            <Circle
              ref={floatingDotsTrail}
              size={pos.size * 4}
              fill={i % 4 === 0 ? colors.magenta : i % 4 === 1 ? colors.pink : i % 4 === 2 ? colors.yellow : colors.purple}
              opacity={0}
              filters={[blur(12)]}
            />
            <Circle
              ref={floatingDotsGlow}
              size={pos.size * 2.5}
              fill={i % 4 === 0 ? colors.magenta : i % 4 === 1 ? colors.pink : i % 4 === 2 ? colors.yellow : colors.purple}
              opacity={0}
              filters={[blur(6)]}
            />
            <Circle
              ref={floatingDots}
              size={pos.size}
              fill={i % 4 === 0 ? colors.magenta : i % 4 === 1 ? colors.pink : i % 4 === 2 ? colors.yellow : colors.white}
              opacity={0}
            />
          </Node>
        ))}
      </Node>

      {/* ===== LAYER 14: Wave Lines ===== */}
      <Node ref={waveLinesContainer} opacity={0}>
        {waveLinePoints.map((wave, i) => (
          <Node key={`wave-${i}`}>
            <Line
              ref={waveLinesGlow}
              points={wave.points}
              stroke={i % 2 === 0 ? colors.magenta : colors.pink}
              lineWidth={4}
              opacity={0}
              end={0}
              filters={[blur(6)]}
            />
            <Line
              ref={waveLines}
              points={wave.points}
              stroke={i % 2 === 0 ? colors.magenta : colors.pink}
              lineWidth={1.5}
              opacity={0}
              end={0}
            />
          </Node>
        ))}
      </Node>

      {/* ===== LAYER 15: Energy Orbs ===== */}
      <Node ref={energyOrbsContainer} opacity={0}>
        {energyOrbPos.map((pos, i) => (
          <Node key={`energy-orb-${i}`} x={pos.x} y={pos.y}>
            <Circle
              ref={energyOrbsGlow}
              size={pos.size * 4}
              fill={i % 3 === 0 ? colors.magenta : i % 3 === 1 ? colors.yellow : colors.pink}
              opacity={0}
              filters={[blur(15)]}
            />
            <Circle
              ref={energyOrbsRing}
              size={pos.size * 2.5}
              fill={null}
              stroke={i % 3 === 0 ? colors.magenta : i % 3 === 1 ? colors.yellow : colors.pink}
              lineWidth={1.5}
              opacity={0}
            />
            <Circle
              ref={energyOrbs}
              size={pos.size * 1.5}
              fill={i % 3 === 0 ? colors.magenta : i % 3 === 1 ? colors.yellow : colors.pink}
              opacity={0}
              filters={[blur(3)]}
            />
            <Circle
              ref={energyOrbsCore}
              size={pos.size}
              fill={colors.white}
              opacity={0}
            />
          </Node>
        ))}
      </Node>

      {/* ===== LAYER 16: Hexagon Pattern ===== */}
      <Node ref={hexPatternContainer} opacity={0}>
        {hexPos.map((pos, i) => (
          <Node key={`hex-${i}`} x={pos.x} y={pos.y}>
            <Path
              ref={hexagonsGlow}
              data={hexPath}
              fill={null}
              stroke={i % 3 === 0 ? colors.magenta : i % 3 === 1 ? colors.yellow : colors.pink}
              lineWidth={3}
              opacity={0}
              scale={pos.scale}
              filters={[blur(6)]}
            />
            <Path
              ref={hexagons}
              data={hexPath}
              fill={null}
              stroke={i % 3 === 0 ? colors.magenta : i % 3 === 1 ? colors.yellow : colors.pink}
              lineWidth={1.5}
              opacity={0}
              scale={0}
            />
          </Node>
        ))}
      </Node>

      {/* ===== LAYER 17: Corner Accents ===== */}
      <Node ref={cornerAccentsContainer} opacity={0}>
        {cornerPositions.map((pos, i) => (
          <Node key={`corner-${i}`} x={pos.x} y={pos.y} rotation={pos.rotation}>
            <Rect
              ref={cornerAccentsGlow}
              width={100}
              height={3}
              fill={i % 2 === 0 ? colors.magenta : colors.yellow}
              opacity={0}
              x={50}
              filters={[blur(5)]}
            />
            <Rect
              ref={cornerAccents}
              width={80}
              height={2}
              fill={i % 2 === 0 ? colors.magenta : colors.yellow}
              opacity={0}
              x={40}
            />
            <Circle
              ref={cornerDots}
              size={8}
              fill={i % 2 === 0 ? colors.magenta : colors.yellow}
              opacity={0}
            />
          </Node>
        ))}
      </Node>

      {/* ===== LAYER 18: Pulse Waves ===== */}
      <Node ref={pulseWavesContainer} opacity={0} y={-40}>
        {Array.from({length: PULSE_WAVE_COUNT}, (_, i) => (
          <Circle
            key={`pulse-wave-${i}`}
            ref={pulseWaves}
            size={80 + i * 50}
            fill={null}
            stroke={i % 2 === 0 ? colors.magenta : colors.pink}
            lineWidth={2 - i * 0.3}
            opacity={0}
          />
        ))}
      </Node>
    </>
  );

  // ============================================
  // ANIMATION TIMELINE (~10 seconds)
  // ============================================

  // === PHASE 1: Atmosphere (0.0 - 0.3s) ===
  yield* all(
    bgGlowMagenta1().opacity(0.04, 0.15),
    bgGlowPurple1().opacity(0.025, 0.15),
    scanlineContainer().opacity(1, 0.15),
  );

  // === PHASE 2: Grid draws (0.3 - 0.6s) ===
  yield* all(
    gridContainer().opacity(1, 0.08),
    ...gridLinesH.slice(0, 7).map((line, i) =>
      chain(waitFor(i * 0.015), all(line.opacity(0.07, 0.1), line.end(1, 0.2, easeOutCubic)))
    ),
    ...gridLinesV.slice(0, 10).map((line, i) =>
      chain(waitFor(i * 0.012), all(line.opacity(0.05, 0.1), line.end(1, 0.2, easeOutCubic)))
    ),
  );

  // === PHASE 3: Center heart appears (0.6 - 1.0s) ===
  yield* centerHeartContainer().opacity(1, 0.08);
  yield* all(
    centerHeart().scale(3.5, 0.25, easeOutBack),
    centerHeart().opacity(1, 0.15),
    chain(waitFor(0.05), centerHeartGlow().opacity(0.55, 0.2)),
    chain(waitFor(0.08), centerHeartSphereGlow().opacity(0.35, 0.22)),
    chain(waitFor(0.1), centerHeartOuterGlow().opacity(0.18, 0.25)),
  );

  // === PHASE 4: First pulse ring (1.0 - 1.2s) ===
  yield* all(
    centerPulseRing1().opacity(0.6, 0.08),
    centerPulseRing1().size(140, 0.2, easeOutCubic),
  );
  yield* centerPulseRing1().opacity(0, 0.12);

  // === PHASE 5: Inner hearts (1.2 - 1.5s) ===
  yield* innerHeartsContainer().opacity(1, 0.05);
  yield* all(
    ...innerHearts.map((heart, i) =>
      chain(
        waitFor(i * 0.03),
        all(
          heart.scale(innerHeartPos[i].scale, 0.18, easeOutBack),
          heart.opacity(1, 0.12),
          chain(waitFor(0.03), innerHeartsGlow[i].opacity(0.5, 0.15)),
          chain(waitFor(0.05), innerHeartsSphere[i].opacity(0.28, 0.18)),
        )
      )
    ),
  );

  // === PHASE 6: Outer hearts (1.5 - 1.9s) ===
  yield* outerHeartsContainer().opacity(1, 0.05);
  yield* all(
    ...outerHearts.map((heart, i) =>
      chain(
        waitFor(i * 0.025),
        all(
          heart.scale(outerHeartPos[i].scale, 0.16, easeOutBack),
          heart.opacity(1, 0.1),
          chain(waitFor(0.02), outerHeartsGlow[i].opacity(0.45, 0.12)),
          chain(waitFor(0.04), outerHeartsSphere[i].opacity(0.22, 0.15)),
        )
      )
    ),
  );

  // === PHASE 7: Background intensifies (1.9 - 2.1s) ===
  yield* all(
    bgGlowMagenta2().opacity(0.03, 0.15),
    bgGlowPink1().opacity(0.025, 0.15),
    bgGlowYellow1().opacity(0.02, 0.15),
  );

  // === PHASE 8: All hearts pulse (2.1 - 2.4s) ===
  yield* all(
    centerHeart().scale(3.8, 0.08, easeOutCubic),
    centerHeartGlow().opacity(0.7, 0.06),
    ...innerHearts.map((h, i) => h.scale(innerHeartPos[i].scale * 1.1, 0.08, easeOutCubic)),
    ...outerHearts.map((h, i) => h.scale(outerHeartPos[i].scale * 1.08, 0.08, easeOutCubic)),
  );
  yield* all(
    centerHeart().scale(3.5, 0.1, easeInOutCubic),
    centerHeartGlow().opacity(0.55, 0.08),
    ...innerHearts.map((h, i) => h.scale(innerHeartPos[i].scale, 0.1, easeInOutCubic)),
    ...outerHearts.map((h, i) => h.scale(outerHeartPos[i].scale, 0.1, easeInOutCubic)),
  );

  // === PHASE 9: Second pulse rings (2.4 - 2.6s) ===
  yield* all(
    centerPulseRing2().opacity(0.45, 0.06),
    centerPulseRing2().size(170, 0.22, easeOutCubic),
    centerPulseRing3().opacity(0.3, 0.08),
    centerPulseRing3().size(200, 0.25, easeOutCubic),
  );
  yield* all(
    centerPulseRing2().opacity(0, 0.12),
    centerPulseRing3().opacity(0, 0.15),
  );

  // === PHASE 10: Figures appear (2.6 - 3.2s) ===
  yield* figuresContainer().opacity(1, 0.05);
  yield* connectionsContainer().opacity(1, 0.05);

  // Connection lines draw
  yield* all(
    ...connectionLines.map((line, i) =>
      chain(
        waitFor(i * 0.025),
        all(
          line.opacity(0.35, 0.08),
          line.end(1, 0.18, easeOutCubic),
          connectionGlows[i].opacity(0.18, 0.15),
          connectionGlows[i].end(1, 0.18, easeOutCubic),
        )
      )
    ),
  );

  // Figures scale in (center first)
  const figureOrder = [4, 3, 5, 2, 6, 1, 7, 0, 8];
  yield* all(
    ...figureOrder.map((idx, i) =>
      chain(
        waitFor(i * 0.03),
        all(
          figures[idx].scale(figurePos[idx].scale, 0.16, easeOutBack),
          figures[idx].opacity(1, 0.1),
          chain(waitFor(0.02), figuresGlow[idx].opacity(0.45, 0.12)),
          chain(waitFor(0.04), figuresSphere[idx].opacity(0.28, 0.14)),
          chain(waitFor(0.06), figuresOuter[idx].opacity(0.14, 0.16)),
        )
      )
    ),
  );

  // === PHASE 11: Mini hearts scatter (3.2 - 3.6s) ===
  yield* miniHeartsContainer().opacity(1, 0.05);
  yield* all(
    ...miniHearts.map((heart, i) =>
      chain(
        waitFor(i * 0.015),
        all(
          heart.scale(miniHeartPos[i].scale, 0.14, easeOutBack),
          heart.opacity(0.7, 0.1),
          miniHeartsGlow[i].opacity(0.35, 0.12),
        )
      )
    ),
  );

  // === PHASE 12: Particles fade in (3.6 - 3.9s) ===
  yield* particlesContainer().opacity(1, 0.05);
  yield* all(
    ...particles.map((p, i) =>
      chain(
        waitFor(i * 0.012),
        all(p.opacity(0.6, 0.12), particlesGlow[i].opacity(0.3, 0.15))
      )
    ),
  );

  // === PHASE 13: Sparkles appear (3.9 - 4.2s) ===
  yield* sparklesContainer().opacity(1, 0.05);
  yield* all(
    ...sparkles.map((s, i) =>
      chain(
        waitFor(i * 0.015),
        all(
          s.scale(sparklePos[i].scale, 0.14, easeOutBack),
          s.opacity(0.55, 0.1),
          sparklesGlow[i].opacity(0.3, 0.12),
        )
      )
    ),
  );

  // === PHASE 14: Grid completes + Decorative rings appear (4.2 - 4.5s) ===
  yield* decorativeRingsContainer().opacity(1, 0.05);
  yield* all(
    ...gridLinesH.slice(7).map((line, i) =>
      chain(waitFor(i * 0.012), all(line.opacity(0.05, 0.08), line.end(1, 0.18, easeOutCubic)))
    ),
    ...gridLinesV.slice(10).map((line, i) =>
      chain(waitFor(i * 0.012), all(line.opacity(0.04, 0.08), line.end(1, 0.18, easeOutCubic)))
    ),
    ...decorativeRings.map((ring, i) =>
      chain(
        waitFor(i * 0.02),
        all(
          ring.opacity(0.4, 0.12),
          decorativeRingsGlow[i].opacity(0.25, 0.15),
          decorativeRingsInner[i].opacity(0.3, 0.15),
        )
      )
    ),
  );

  // === PHASE 14.5: Floating dots fade in (4.4 - 4.6s) ===
  yield* floatingDotsContainer().opacity(1, 0.05);
  yield* all(
    ...floatingDots.map((dot, i) =>
      chain(
        waitFor(i * 0.008),
        all(
          dot.opacity(0.6, 0.1),
          floatingDotsGlow[i].opacity(0.35, 0.12),
          floatingDotsTrail[i].opacity(0.15, 0.15),
        )
      )
    ),
  );

  // === PHASE 15: Second hearts pulse (4.5 - 4.8s) ===
  yield* all(
    centerHeart().scale(3.7, 0.08, easeOutCubic),
    ...innerHearts.map((h, i) =>
      chain(waitFor(i * 0.01), h.scale(innerHeartPos[i].scale * 1.08, 0.08, easeOutCubic))
    ),
  );
  yield* all(
    centerHeart().scale(3.5, 0.1, easeInOutCubic),
    ...innerHearts.map((h, i) => h.scale(innerHeartPos[i].scale, 0.1, easeInOutCubic)),
  );

  // === PHASE 16: Outer hearts pulse with ring (4.8 - 5.2s) ===
  yield* all(
    ...outerHearts.map((h, i) =>
      chain(
        waitFor(i * 0.015),
        chain(
          h.scale(outerHeartPos[i].scale * 1.1, 0.07, easeOutCubic),
          h.scale(outerHeartPos[i].scale, 0.08, easeInOutCubic),
        )
      )
    ),
    ...outerHeartsPulse.slice(0, 4).map((ring, i) =>
      chain(
        waitFor(i * 0.02),
        chain(
          all(ring.opacity(0.45, 0.06), ring.size(70, 0.15, easeOutCubic)),
          all(ring.opacity(0, 0.1), ring.size(50, 0)),
        )
      )
    ),
  );

  // === PHASE 17: Background glow shift + Energy orbs (5.2 - 5.5s) ===
  yield* energyOrbsContainer().opacity(1, 0.05);
  yield* all(
    bgGlowMagenta1().x(-300, 0.3, easeInOutCubic),
    bgGlowMagenta1().opacity(0.05, 0.25),
    bgGlowYellow1().x(300, 0.3, easeInOutCubic),
    bgGlowYellow1().opacity(0.03, 0.25),
    ...energyOrbs.map((orb, i) =>
      chain(
        waitFor(i * 0.018),
        all(
          orb.opacity(0.5, 0.12),
          energyOrbsGlow[i].opacity(0.3, 0.15),
          energyOrbsCore[i].opacity(0.7, 0.12),
          energyOrbsRing[i].opacity(0.4, 0.15),
        )
      )
    ),
  );

  // === PHASE 17.5: Wave lines draw (5.4 - 5.7s) ===
  yield* waveLinesContainer().opacity(1, 0.05);
  yield* all(
    ...waveLines.map((line, i) =>
      chain(
        waitFor(i * 0.025),
        all(
          line.opacity(0.2, 0.1),
          line.end(1, 0.25, easeOutCubic),
          waveLinesGlow[i].opacity(0.12, 0.15),
          waveLinesGlow[i].end(1, 0.25, easeOutCubic),
        )
      )
    ),
  );

  // === PHASE 18: Figures wave + Hexagons appear (5.5 - 5.9s) ===
  yield* hexPatternContainer().opacity(1, 0.05);
  yield* all(
    ...figures.map((fig, i) =>
      chain(waitFor(i * 0.02), fig.y(fig.y() - 10, 0.15, easeOutCubic))
    ),
    ...hexagons.map((hex, i) =>
      chain(
        waitFor(i * 0.015),
        all(
          hex.scale(hexPos[i].scale, 0.14, easeOutBack),
          hex.opacity(0.45, 0.1),
          hexagonsGlow[i].opacity(0.25, 0.12),
        )
      )
    ),
  );
  yield* all(
    ...figures.map((fig, i) =>
      chain(waitFor(i * 0.02), fig.y(fig.y() + 10, 0.18, easeInOutCubic))
    ),
  );

  // === PHASE 18.5: Corner accents appear (5.8 - 6.1s) ===
  yield* cornerAccentsContainer().opacity(1, 0.05);
  yield* all(
    ...cornerAccents.map((accent, i) =>
      chain(
        waitFor(i * 0.04),
        all(
          accent.opacity(0.5, 0.12),
          accent.width(80, 0.18, easeOutCubic),
          cornerAccentsGlow[i].opacity(0.3, 0.15),
          cornerAccentsGlow[i].width(100, 0.18, easeOutCubic),
          cornerDots[i].opacity(0.6, 0.12),
        )
      )
    ),
  );

  // === PHASE 19: Sparkles twinkle (5.9 - 6.2s) ===
  yield* all(
    ...sparkles.map((s, i) =>
      chain(
        waitFor(i * 0.012),
        chain(
          s.scale(sparklePos[i].scale * 1.25, 0.07, easeOutCubic),
          s.scale(sparklePos[i].scale, 0.08, easeInOutCubic),
        )
      )
    ),
  );

  // === PHASE 20: Particles drift (6.2 - 6.6s) ===
  yield* all(
    ...particles.map((p, i) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const driftX = Math.cos(angle) * 15;
      const driftY = Math.sin(angle) * 12;
      return chain(
        waitFor(i * 0.01),
        all(
          p.x(p.x() + driftX, 0.35, easeInOutQuad),
          p.y(p.y() + driftY, 0.35, easeInOutQuad),
        )
      );
    }),
  );

  // === PHASE 20.5: Pulse waves expand (6.5 - 6.8s) ===
  yield* pulseWavesContainer().opacity(1, 0.05);
  yield* all(
    ...pulseWaves.map((wave, i) =>
      chain(
        waitFor(i * 0.03),
        all(
          wave.opacity(0.35 - i * 0.06, 0.1),
          wave.size(120 + i * 60, 0.2, easeOutCubic),
        )
      )
    ),
  );
  yield* all(
    ...pulseWaves.map((wave, i) =>
      all(
        wave.opacity(0, 0.15),
        wave.size(80 + i * 50, 0),
      )
    ),
  );

  // === PHASE 20.6: Decorative rings rotate (6.7 - 6.9s) ===
  yield* all(
    ...decorativeRings.map((ring, i) =>
      chain(
        waitFor(i * 0.015),
        all(
          ring.size(decorativeRingPos[i].size * 1.15, 0.1, easeOutCubic),
          decorativeRingsInner[i].size(decorativeRingPos[i].size * 0.6, 0.1, easeOutCubic),
        )
      )
    ),
  );
  yield* all(
    ...decorativeRings.map((ring, i) =>
      all(
        ring.size(decorativeRingPos[i].size, 0.12, easeInOutCubic),
        decorativeRingsInner[i].size(decorativeRingPos[i].size * 0.5, 0.12, easeInOutCubic),
      )
    ),
  );

  // === PHASE 21: Third pulse (6.6 - 7.0s) ===
  yield* all(
    centerHeart().scale(3.9, 0.1, easeOutCubic),
    centerHeartGlow().opacity(0.75, 0.08),
    centerPulseRing1().opacity(0.55, 0.06),
    centerPulseRing1().size(150, 0.22, easeOutCubic),
  );
  yield* all(
    centerHeart().scale(3.5, 0.12, easeInOutCubic),
    centerHeartGlow().opacity(0.55, 0.1),
    centerPulseRing1().opacity(0, 0.14),
  );

  // === PHASE 21.5: Energy orbs pulse (7.0 - 7.2s) ===
  yield* all(
    ...energyOrbs.map((orb, i) =>
      chain(
        waitFor(i * 0.012),
        chain(
          all(
            orb.opacity(0.7, 0.06),
            energyOrbsGlow[i].opacity(0.45, 0.06),
            energyOrbsRing[i].size(energyOrbPos[i].size * 3, 0.12, easeOutCubic),
          ),
          all(
            orb.opacity(0.5, 0.08),
            energyOrbsGlow[i].opacity(0.3, 0.08),
            energyOrbsRing[i].size(energyOrbPos[i].size * 2.5, 0.1, easeInOutCubic),
          ),
        )
      )
    ),
  );

  // === PHASE 22: Connection lines pulse (7.0 - 7.3s) ===
  yield* all(
    ...connectionLines.map((line, i) =>
      chain(waitFor(i * 0.01), line.lineWidth(3.5, 0.08, easeOutCubic))
    ),
    ...connectionGlows.map(g => g.opacity(0.35, 0.08)),
  );
  yield* all(
    ...connectionLines.map(line => line.lineWidth(2, 0.1, easeInOutCubic)),
    ...connectionGlows.map(g => g.opacity(0.18, 0.1)),
  );

  // === PHASE 23: Figures second wave (7.3 - 7.7s) ===
  yield* all(
    ...figures.map((fig, i) =>
      chain(waitFor(Math.abs(i - 4) * 0.015), fig.y(fig.y() - 8, 0.12, easeOutCubic))
    ),
  );
  yield* all(
    ...figures.map((fig, i) =>
      chain(waitFor(Math.abs(i - 4) * 0.015), fig.y(fig.y() + 8, 0.15, easeInOutCubic))
    ),
  );

  // === PHASE 24: Mini hearts float (7.7 - 8.0s) ===
  yield* all(
    ...miniHearts.map((heart, i) =>
      chain(
        waitFor(i * 0.012),
        all(
          heart.y(heart.y() - 12, 0.25, easeInOutQuad),
          heart.opacity(0.8, 0.2),
        )
      )
    ),
  );

  // === PHASE 24.3: Floating dots drift (7.9 - 8.2s) ===
  yield* all(
    ...floatingDots.map((dot, i) => {
      const angle = (i / FLOATING_DOT_COUNT) * Math.PI * 2;
      const driftX = Math.cos(angle) * 10;
      const driftY = Math.sin(angle) * 8;
      return chain(
        waitFor(i * 0.008),
        all(
          dot.x(dot.x() + driftX, 0.25, easeInOutQuad),
          dot.y(dot.y() + driftY, 0.25, easeInOutQuad),
          dot.opacity(0.75, 0.2),
        )
      );
    }),
  );

  // === PHASE 24.5: Hexagons pulse (8.0 - 8.2s) ===
  yield* all(
    ...hexagons.map((hex, i) =>
      chain(
        waitFor(i * 0.01),
        chain(
          hex.scale(hexPos[i].scale * 1.2, 0.08, easeOutCubic),
          hex.scale(hexPos[i].scale, 0.1, easeInOutCubic),
        )
      )
    ),
  );

  // === PHASE 24.7: Wave lines shimmer (8.1 - 8.3s) ===
  yield* all(
    ...waveLines.map((line, i) =>
      chain(
        waitFor(i * 0.02),
        all(
          line.opacity(0.35, 0.08),
          waveLinesGlow[i].opacity(0.2, 0.08),
        )
      )
    ),
  );
  yield* all(
    ...waveLines.map((line, i) =>
      all(
        line.opacity(0.2, 0.1),
        waveLinesGlow[i].opacity(0.12, 0.1),
      )
    ),
  );

  // === PHASE 25: All glows intensify (8.0 - 8.3s) ===
  yield* all(
    bgGlowMagenta1().opacity(0.065, 0.22),
    bgGlowPink1().opacity(0.035, 0.22),
    bgGlowPink2().opacity(0.025, 0.22),
    centerHeartOuterGlow().opacity(0.28, 0.2),
    ...innerHeartsSphere.map(g => g.opacity(0.38, 0.2)),
    ...outerHeartsSphere.map(g => g.opacity(0.32, 0.2)),
  );

  // === PHASE 26: Fourth pulse - biggest (8.3 - 8.6s) ===
  yield* all(
    centerHeart().scale(4.0, 0.1, easeOutCubic),
    ...innerHearts.map((h, i) => h.scale(innerHeartPos[i].scale * 1.12, 0.1, easeOutCubic)),
    ...outerHearts.map((h, i) => h.scale(outerHeartPos[i].scale * 1.1, 0.1, easeOutCubic)),
    ...figures.map((f, i) => f.scale(figurePos[i].scale * 1.05, 0.1, easeOutCubic)),
  );

  // === PHASE 27: Settle (8.6 - 8.9s) ===
  yield* all(
    centerHeart().scale(3.5, 0.12, easeInOutCubic),
    ...innerHearts.map((h, i) => h.scale(innerHeartPos[i].scale, 0.12, easeInOutCubic)),
    ...outerHearts.map((h, i) => h.scale(outerHeartPos[i].scale, 0.12, easeInOutCubic)),
    ...figures.map((f, i) => f.scale(figurePos[i].scale, 0.12, easeInOutCubic)),
  );

  // === PHASE 28: Final sparkle burst (8.9 - 9.2s) ===
  yield* all(
    ...sparkles.slice(0, 10).map((s, i) =>
      chain(
        waitFor(i * 0.01),
        chain(
          all(s.scale(sparklePos[i].scale * 1.4, 0.06, easeOutBack), sparklesGlow[i].opacity(0.5, 0.06)),
          all(s.scale(sparklePos[i].scale, 0.08), sparklesGlow[i].opacity(0.3, 0.08)),
        )
      )
    ),
  );

  // === PHASE 28.3: Corner accents flash (9.0 - 9.2s) ===
  yield* all(
    ...cornerAccents.map((accent, i) =>
      chain(
        waitFor(i * 0.03),
        chain(
          all(accent.opacity(0.75, 0.06), cornerDots[i].size(12, 0.08, easeOutCubic)),
          all(accent.opacity(0.5, 0.08), cornerDots[i].size(8, 0.1, easeInOutCubic)),
        )
      )
    ),
  );

  // === PHASE 28.5: Second pulse wave burst (9.1 - 9.3s) ===
  yield* all(
    ...pulseWaves.slice(0, 3).map((wave, i) =>
      chain(
        waitFor(i * 0.025),
        all(
          wave.opacity(0.3 - i * 0.08, 0.08),
          wave.size(100 + i * 40, 0.15, easeOutCubic),
        )
      )
    ),
  );
  yield* all(
    ...pulseWaves.slice(0, 3).map((wave) =>
      all(wave.opacity(0, 0.1), wave.size(80, 0))
    ),
  );

  // === PHASE 29: Mini hearts return (9.2 - 9.5s) ===
  yield* all(
    ...miniHearts.map((heart, i) =>
      chain(waitFor(i * 0.01), heart.y(heart.y() + 12, 0.22, easeInOutQuad))
    ),
    ...floatingDots.map((dot, i) => {
      const angle = (i / FLOATING_DOT_COUNT) * Math.PI * 2;
      const driftX = Math.cos(angle) * 10;
      const driftY = Math.sin(angle) * 8;
      return dot.x(dot.x() - driftX, 0.2, easeInOutQuad);
    }),
  );

  // === PHASE 29.5: Energy orbs glow intensify (9.4 - 9.6s) ===
  yield* all(
    ...energyOrbs.map((orb, i) =>
      chain(
        waitFor(i * 0.01),
        all(
          orb.opacity(0.65, 0.1),
          energyOrbsGlow[i].opacity(0.4, 0.1),
          energyOrbsCore[i].opacity(0.85, 0.1),
        )
      )
    ),
  );

  // === PHASE 30: Final glow pulse (9.5 - 9.8s) ===
  yield* all(
    centerHeartGlow().opacity(0.65, 0.12),
    centerHeartSphereGlow().opacity(0.42, 0.12),
    ...figuresGlow.map(g => g.opacity(0.5, 0.12)),
    ...decorativeRingsGlow.map(g => g.opacity(0.35, 0.12)),
    ...hexagonsGlow.map(g => g.opacity(0.35, 0.12)),
  );
  yield* all(
    centerHeartGlow().opacity(0.55, 0.1),
    centerHeartSphereGlow().opacity(0.35, 0.1),
    ...figuresGlow.map(g => g.opacity(0.45, 0.1)),
    ...decorativeRingsGlow.map(g => g.opacity(0.25, 0.1)),
    ...hexagonsGlow.map(g => g.opacity(0.25, 0.1)),
  );

  // === PHASE 30.5: Final micro-animations (9.7 - 9.9s) ===
  yield* all(
    ...decorativeRings.slice(0, 3).map((ring, i) =>
      chain(
        waitFor(i * 0.015),
        chain(
          ring.size(decorativeRingPos[i].size * 1.08, 0.06, easeOutCubic),
          ring.size(decorativeRingPos[i].size, 0.08, easeInOutCubic),
        )
      )
    ),
    ...energyOrbs.slice(0, 5).map((orb, i) =>
      chain(
        waitFor(i * 0.012),
        chain(
          orb.opacity(0.7, 0.05),
          orb.opacity(0.5, 0.07),
        )
      )
    ),
  );

  // === PHASE 31: Hold with subtle breathing (9.8 - 10.0s) ===
  yield* all(
    centerHeart().scale(3.55, 0.15, easeInOutQuad),
    centerHeartGlow().opacity(0.58, 0.15),
    bgGlowMagenta1().opacity(0.055, 0.15),
  );
  yield* all(
    centerHeart().scale(3.5, 0.05),
    centerHeartGlow().opacity(0.55, 0.05),
    bgGlowMagenta1().opacity(0.05, 0.05),
  );

  // ============================================
  // Total: ~10 seconds
  // ============================================
});
