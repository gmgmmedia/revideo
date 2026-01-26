/**
 * Real Motion Scene 3: Time Theme
 * VO: "no money, had time" - community building campaign
 *
 * Theme: Clock/time transformation representing dedication and investment
 * Visual Elements:
 * - Background glows (magenta/yellow gradient)
 * - Scanline overlay for retro aesthetic
 * - Central clock with animated hands
 * - Clock face elements (numbers, tick marks)
 * - Time flowing visualization (particles along clock path)
 * - Transformation: clock elements morph into people icons
 * - Hour glass elements
 * - Ambient floating particles
 * - Energy pulses from clock
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
  easeInOutSine,
  easeOutElastic,
  linear,
} from '@revideo/core';

import {
  REALMOTION,
  colors,
  timing,
  effects,
  layout,
  icons,
  fonts,
  fontSizes,
} from '../lib/brand';

export default makeScene2D('scene3-time-theme', function* (view) {
  // ============================================
  // SCENE SETUP
  // ============================================
  view.fill(colors.background);

  // ============================================
  // CONSTANTS
  // ============================================
  const CLOCK_TICK_COUNT = 60;
  const CLOCK_NUMBER_COUNT = 12;
  const TIME_PARTICLE_COUNT = 36;
  const ORBIT_PARTICLE_COUNT = 20;
  const TRANSFORMATION_FIGURE_COUNT = 8;
  const AMBIENT_PARTICLE_COUNT = 28;
  const GRID_H_COUNT = 16;
  const GRID_V_COUNT = 18;
  const SPARKLE_COUNT = 18;
  const ENERGY_RING_COUNT = 6;
  const HOURGLASS_PARTICLE_COUNT = 24;
  const RADIAL_LINE_COUNT = 24;

  // ============================================
  // REFS - Background Glow Layer
  // ============================================
  const bgGlowMagenta1 = createRef<Circle>();
  const bgGlowMagenta2 = createRef<Circle>();
  const bgGlowMagenta3 = createRef<Circle>();
  const bgGlowYellow1 = createRef<Circle>();
  const bgGlowYellow2 = createRef<Circle>();
  const bgGlowYellow3 = createRef<Circle>();
  const bgGlowPink1 = createRef<Circle>();
  const bgGlowPink2 = createRef<Circle>();
  const bgGlowPurple1 = createRef<Circle>();
  const bgGlowPurple2 = createRef<Circle>();

  // ============================================
  // REFS - Scanline Overlay
  // ============================================
  const scanlineContainer = createRef<Node>();

  // ============================================
  // REFS - Grid Pattern
  // ============================================
  const gridContainer = createRef<Node>();
  const gridLinesH = createRefArray<Line>();
  const gridLinesV = createRefArray<Line>();
  const gridGlowH = createRefArray<Line>();
  const gridGlowV = createRefArray<Line>();

  // ============================================
  // REFS - Clock Face
  // ============================================
  const clockContainer = createRef<Node>();
  const clockFaceOuterGlow = createRef<Circle>();
  const clockFaceMiddleGlow = createRef<Circle>();
  const clockFaceInnerGlow = createRef<Circle>();
  const clockFaceRing1 = createRef<Circle>();
  const clockFaceRing2 = createRef<Circle>();
  const clockFaceRing3 = createRef<Circle>();
  const clockFaceCenter = createRef<Circle>();
  const clockFaceCenterGlow = createRef<Circle>();

  // ============================================
  // REFS - Clock Tick Marks
  // ============================================
  const tickMarksContainer = createRef<Node>();
  const tickMarks = createRefArray<Line>();
  const tickMarksGlow = createRefArray<Line>();

  // ============================================
  // REFS - Clock Numbers (12 positions)
  // ============================================
  const clockNumbersContainer = createRef<Node>();
  const clockNumbers = createRefArray<Txt>();
  const clockNumbersGlow = createRefArray<Circle>();

  // ============================================
  // REFS - Clock Hands
  // ============================================
  const clockHandsContainer = createRef<Node>();
  const hourHandGlow = createRef<Line>();
  const hourHand = createRef<Line>();
  const minuteHandGlow = createRef<Line>();
  const minuteHand = createRef<Line>();
  const secondHandGlow = createRef<Line>();
  const secondHand = createRef<Line>();
  const handsPivot = createRef<Circle>();
  const handsPivotGlow = createRef<Circle>();

  // ============================================
  // REFS - Energy Rings (pulsing from clock)
  // ============================================
  const energyRingsContainer = createRef<Node>();
  const energyRings = createRefArray<Circle>();
  const energyRingsGlow = createRefArray<Circle>();

  // ============================================
  // REFS - Time Particles (flowing around clock)
  // ============================================
  const timeParticlesContainer = createRef<Node>();
  const timeParticles = createRefArray<Circle>();
  const timeParticlesGlow = createRefArray<Circle>();
  const timeParticlesTrail = createRefArray<Circle>();

  // ============================================
  // REFS - Radial Lines (emanating from clock)
  // ============================================
  const radialLinesContainer = createRef<Node>();
  const radialLines = createRefArray<Line>();
  const radialLinesGlow = createRefArray<Line>();

  // ============================================
  // REFS - Transformation Figures (people emerging)
  // ============================================
  const transformFiguresContainer = createRef<Node>();
  const transformFigures = createRefArray<Path>();
  const transformFiguresGlow = createRefArray<Path>();
  const transformFiguresSphereGlow = createRefArray<Circle>();
  const transformFiguresOuterGlow = createRefArray<Circle>();

  // ============================================
  // REFS - Hourglass Elements
  // ============================================
  const hourglassContainer = createRef<Node>();
  const hourglassTopGlow = createRef<Path>();
  const hourglassTop = createRef<Path>();
  const hourglassBottomGlow = createRef<Path>();
  const hourglassBottom = createRef<Path>();
  const hourglassCenterGlow = createRef<Circle>();
  const hourglassCenter = createRef<Circle>();
  const hourglassParticles = createRefArray<Circle>();
  const hourglassParticlesGlow = createRefArray<Circle>();

  // ============================================
  // REFS - Orbit Particles
  // ============================================
  const orbitContainer = createRef<Node>();
  const orbitParticles = createRefArray<Circle>();
  const orbitParticlesGlow = createRefArray<Circle>();
  const orbitParticlesTrail = createRefArray<Circle>();

  // ============================================
  // REFS - Ambient Particles
  // ============================================
  const ambientParticlesContainer = createRef<Node>();
  const ambientParticles = createRefArray<Circle>();
  const ambientParticlesGlow = createRefArray<Circle>();

  // ============================================
  // REFS - Sparkles
  // ============================================
  const sparklesContainer = createRef<Node>();
  const sparkles = createRefArray<Path>();
  const sparklesGlow = createRefArray<Path>();

  // ============================================
  // REFS - Clock Icon (center)
  // ============================================
  const clockIconContainer = createRef<Node>();
  const clockIcon = createRef<Path>();
  const clockIconGlow = createRef<Path>();
  const clockIconSphereGlow = createRef<Circle>();

  // ============================================
  // REFS - Decorative Elements
  // ============================================
  const decorContainer = createRef<Node>();
  const decorCircles = createRefArray<Circle>();
  const decorCirclesGlow = createRefArray<Circle>();
  const decorLines = createRefArray<Line>();
  const decorLinesGlow = createRefArray<Line>();

  // ============================================
  // REFS - Vignette
  // ============================================
  const vignetteTop = createRef<Rect>();
  const vignetteBottom = createRef<Rect>();

  // ============================================
  // POSITION CALCULATIONS
  // ============================================

  // Clock tick mark positions
  const tickMarkPositions = Array.from({ length: CLOCK_TICK_COUNT }, (_, i) => {
    const angle = (i / CLOCK_TICK_COUNT) * Math.PI * 2 - Math.PI / 2;
    const isHourMark = i % 5 === 0;
    const innerRadius = isHourMark ? 200 : 220;
    const outerRadius = 240;
    return {
      angle,
      innerX: Math.cos(angle) * innerRadius,
      innerY: Math.sin(angle) * innerRadius,
      outerX: Math.cos(angle) * outerRadius,
      outerY: Math.sin(angle) * outerRadius,
      isHourMark,
    };
  });

  // Clock number positions (1-12)
  const clockNumberPositions = Array.from({ length: CLOCK_NUMBER_COUNT }, (_, i) => {
    const angle = ((i + 1) / CLOCK_NUMBER_COUNT) * Math.PI * 2 - Math.PI / 2;
    const radius = 170;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      number: i + 1,
      angle,
    };
  });

  // Time particle positions (around clock circumference)
  const timeParticlePositions = Array.from({ length: TIME_PARTICLE_COUNT }, (_, i) => {
    const angle = (i / TIME_PARTICLE_COUNT) * Math.PI * 2;
    const radius = 260 + (i % 4) * 20;
    return {
      angle,
      radius,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });

  // Transformation figure positions (emerging from clock)
  const transformFigurePositions = Array.from({ length: TRANSFORMATION_FIGURE_COUNT }, (_, i) => {
    const angle = (i / TRANSFORMATION_FIGURE_COUNT) * Math.PI * 2 - Math.PI / 2;
    const radius = 380;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.7,
      angle,
      scale: 2.5 + (i % 3) * 0.4,
    };
  });

  // Orbit particle positions
  const orbitPositions = Array.from({ length: ORBIT_PARTICLE_COUNT }, (_, i) => {
    const angle = (i / ORBIT_PARTICLE_COUNT) * Math.PI * 2;
    const radius = 310 + (i % 3) * 40;
    return { angle, radius };
  });

  // Radial line positions
  const radialLinePositions = Array.from({ length: RADIAL_LINE_COUNT }, (_, i) => {
    const angle = (i / RADIAL_LINE_COUNT) * Math.PI * 2;
    const innerRadius = 250;
    const outerRadius = 400 + (i % 3) * 50;
    return {
      angle,
      innerX: Math.cos(angle) * innerRadius,
      innerY: Math.sin(angle) * innerRadius,
      outerX: Math.cos(angle) * outerRadius,
      outerY: Math.sin(angle) * outerRadius,
    };
  });

  // Hourglass triangle path
  const HOURGLASS_TOP_PATH = 'M-50 -80 L50 -80 L0 0 Z';
  const HOURGLASS_BOTTOM_PATH = 'M0 0 L-50 80 L50 80 Z';

  // ============================================
  // BUILD SCENE
  // ============================================
  view.add(
    <>
      {/* ===== LAYER 1: Background Glows ===== */}
      <Circle
        ref={bgGlowMagenta1}
        size={1100}
        fill={colors.magenta}
        opacity={0}
        x={0}
        y={0}
        filters={[blur(400)]}
      />
      <Circle
        ref={bgGlowMagenta2}
        size={700}
        fill={colors.magenta}
        opacity={0}
        x={-400}
        y={-250}
        filters={[blur(300)]}
      />
      <Circle
        ref={bgGlowMagenta3}
        size={500}
        fill={colors.magenta}
        opacity={0}
        x={450}
        y={280}
        filters={[blur(220)]}
      />
      <Circle
        ref={bgGlowYellow1}
        size={900}
        fill={colors.yellow}
        opacity={0}
        x={300}
        y={-150}
        filters={[blur(350)]}
      />
      <Circle
        ref={bgGlowYellow2}
        size={600}
        fill={colors.yellow}
        opacity={0}
        x={-350}
        y={200}
        filters={[blur(260)]}
      />
      <Circle
        ref={bgGlowYellow3}
        size={450}
        fill={colors.yellow}
        opacity={0}
        x={500}
        y={-350}
        filters={[blur(200)]}
      />
      <Circle
        ref={bgGlowPink1}
        size={800}
        fill={colors.pink}
        opacity={0}
        x={-200}
        y={100}
        filters={[blur(320)]}
      />
      <Circle
        ref={bgGlowPink2}
        size={500}
        fill={colors.pink}
        opacity={0}
        x={400}
        y={-100}
        filters={[blur(220)]}
      />
      <Circle
        ref={bgGlowPurple1}
        size={950}
        fill={colors.purple}
        opacity={0}
        x={0}
        y={400}
        filters={[blur(400)]}
      />
      <Circle
        ref={bgGlowPurple2}
        size={550}
        fill={colors.purple}
        opacity={0}
        x={-500}
        y={-380}
        filters={[blur(280)]}
      />

      {/* ===== LAYER 2: Scanline Overlay ===== */}
      <Node ref={scanlineContainer} opacity={0}>
        {Array.from({ length: 270 }, (_, i) => (
          <Rect
            key={`scanline-${i}`}
            width={layout.width + 200}
            height={1}
            fill={colors.white}
            opacity={0.012 + (i % 4) * 0.004}
            y={-540 + i * 4}
          />
        ))}
      </Node>

      {/* ===== LAYER 3: Grid Pattern ===== */}
      <Node ref={gridContainer} opacity={0}>
        {Array.from({ length: GRID_H_COUNT }, (_, i) => (
          <Node key={`h-grid-group-${i}`}>
            <Line
              ref={gridGlowH}
              points={[
                [-1000, -420 + i * 55],
                [1000, -420 + i * 55],
              ]}
              stroke={colors.magenta}
              lineWidth={2}
              opacity={0}
              end={0}
              filters={[blur(4)]}
            />
            <Line
              ref={gridLinesH}
              points={[
                [-1000, -420 + i * 55],
                [1000, -420 + i * 55],
              ]}
              stroke={colors.magenta}
              lineWidth={1}
              opacity={0}
              end={0}
            />
          </Node>
        ))}
        {Array.from({ length: GRID_V_COUNT }, (_, i) => (
          <Node key={`v-grid-group-${i}`}>
            <Line
              ref={gridGlowV}
              points={[
                [-850 + i * 100, -560],
                [-850 + i * 100, 560],
              ]}
              stroke={colors.magenta}
              lineWidth={2}
              opacity={0}
              end={0}
              filters={[blur(4)]}
            />
            <Line
              ref={gridLinesV}
              points={[
                [-850 + i * 100, -560],
                [-850 + i * 100, 560],
              ]}
              stroke={colors.magenta}
              lineWidth={1}
              opacity={0}
              end={0}
            />
          </Node>
        ))}
      </Node>

      {/* ===== LAYER 4: Radial Lines ===== */}
      <Node ref={radialLinesContainer} opacity={0}>
        {radialLinePositions.map((pos, i) => {
          const color = i % 3 === 0 ? colors.magenta : i % 3 === 1 ? colors.yellow : colors.pink;
          return (
            <Node key={`radial-line-${i}`}>
              <Line
                ref={radialLinesGlow}
                points={[
                  [pos.innerX, pos.innerY],
                  [pos.outerX, pos.outerY],
                ]}
                stroke={color}
                lineWidth={4}
                opacity={0}
                end={0}
                filters={[blur(8)]}
              />
              <Line
                ref={radialLines}
                points={[
                  [pos.innerX, pos.innerY],
                  [pos.outerX, pos.outerY],
                ]}
                stroke={color}
                lineWidth={1.5}
                opacity={0}
                end={0}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 5: Energy Rings ===== */}
      <Node ref={energyRingsContainer} opacity={0}>
        {Array.from({ length: ENERGY_RING_COUNT }, (_, i) => {
          const size = 280 + i * 50;
          const color = i % 2 === 0 ? colors.magenta : colors.yellow;
          return (
            <Node key={`energy-ring-${i}`}>
              <Circle
                ref={energyRingsGlow}
                size={size}
                fill={null}
                stroke={color}
                lineWidth={4}
                opacity={0}
                filters={[blur(8)]}
              />
              <Circle
                ref={energyRings}
                size={size}
                fill={null}
                stroke={color}
                lineWidth={2}
                opacity={0}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 6: Clock Face ===== */}
      <Node ref={clockContainer} opacity={0}>
        {/* Outer glow */}
        <Circle
          ref={clockFaceOuterGlow}
          size={550}
          fill={colors.magenta}
          opacity={0}
          filters={[blur(120)]}
        />
        {/* Middle glow */}
        <Circle
          ref={clockFaceMiddleGlow}
          size={400}
          fill={colors.magenta}
          opacity={0}
          filters={[blur(80)]}
        />
        {/* Inner glow */}
        <Circle
          ref={clockFaceInnerGlow}
          size={280}
          fill={colors.pink}
          opacity={0}
          filters={[blur(50)]}
        />
        {/* Clock face rings */}
        <Circle
          ref={clockFaceRing1}
          size={500}
          fill={null}
          stroke={colors.magenta}
          lineWidth={3}
          opacity={0}
        />
        <Circle
          ref={clockFaceRing2}
          size={480}
          fill={null}
          stroke={colors.magenta}
          lineWidth={1}
          opacity={0}
          lineDash={[4, 4]}
        />
        <Circle
          ref={clockFaceRing3}
          size={260}
          fill={null}
          stroke={colors.yellow}
          lineWidth={2}
          opacity={0}
        />
        {/* Center dot */}
        <Circle
          ref={clockFaceCenterGlow}
          size={40}
          fill={colors.yellow}
          opacity={0}
          filters={[blur(15)]}
        />
        <Circle
          ref={clockFaceCenter}
          size={20}
          fill={colors.yellow}
          opacity={0}
        />
      </Node>

      {/* ===== LAYER 7: Tick Marks ===== */}
      <Node ref={tickMarksContainer} opacity={0}>
        {tickMarkPositions.map((pos, i) => {
          const color = pos.isHourMark ? colors.yellow : colors.magenta;
          const lineWidth = pos.isHourMark ? 3 : 1;
          return (
            <Node key={`tick-mark-${i}`}>
              <Line
                ref={tickMarksGlow}
                points={[
                  [pos.innerX, pos.innerY],
                  [pos.outerX, pos.outerY],
                ]}
                stroke={color}
                lineWidth={lineWidth + 2}
                opacity={0}
                end={0}
                filters={[blur(5)]}
              />
              <Line
                ref={tickMarks}
                points={[
                  [pos.innerX, pos.innerY],
                  [pos.outerX, pos.outerY],
                ]}
                stroke={color}
                lineWidth={lineWidth}
                opacity={0}
                end={0}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 8: Clock Numbers ===== */}
      <Node ref={clockNumbersContainer} opacity={0}>
        {clockNumberPositions.map((pos, i) => (
          <Node key={`clock-number-${i}`} x={pos.x} y={pos.y}>
            <Circle
              ref={clockNumbersGlow}
              size={45}
              fill={colors.magenta}
              opacity={0}
              filters={[blur(15)]}
            />
            <Txt
              ref={clockNumbers}
              text={pos.number.toString()}
              fill={colors.white}
              fontFamily={fonts.heading}
              fontSize={28}
              opacity={0}
              offsetX={-0.5}
              offsetY={-0.5}
            />
          </Node>
        ))}
      </Node>

      {/* ===== LAYER 9: Clock Hands ===== */}
      <Node ref={clockHandsContainer} opacity={0}>
        {/* Hour hand */}
        <Line
          ref={hourHandGlow}
          points={[[0, 0], [0, -90]]}
          stroke={colors.magenta}
          lineWidth={10}
          opacity={0}
          lineCap="round"
          filters={[blur(8)]}
        />
        <Line
          ref={hourHand}
          points={[[0, 0], [0, -90]]}
          stroke={colors.magenta}
          lineWidth={6}
          opacity={0}
          lineCap="round"
        />
        {/* Minute hand */}
        <Line
          ref={minuteHandGlow}
          points={[[0, 0], [0, -140]]}
          stroke={colors.yellow}
          lineWidth={8}
          opacity={0}
          lineCap="round"
          filters={[blur(6)]}
        />
        <Line
          ref={minuteHand}
          points={[[0, 0], [0, -140]]}
          stroke={colors.yellow}
          lineWidth={4}
          opacity={0}
          lineCap="round"
        />
        {/* Second hand */}
        <Line
          ref={secondHandGlow}
          points={[[0, 20], [0, -160]]}
          stroke={colors.pink}
          lineWidth={4}
          opacity={0}
          lineCap="round"
          filters={[blur(4)]}
        />
        <Line
          ref={secondHand}
          points={[[0, 20], [0, -160]]}
          stroke={colors.pink}
          lineWidth={2}
          opacity={0}
          lineCap="round"
        />
        {/* Pivot */}
        <Circle
          ref={handsPivotGlow}
          size={25}
          fill={colors.white}
          opacity={0}
          filters={[blur(10)]}
        />
        <Circle
          ref={handsPivot}
          size={14}
          fill={colors.white}
          opacity={0}
        />
      </Node>

      {/* ===== LAYER 10: Time Particles ===== */}
      <Node ref={timeParticlesContainer} opacity={0}>
        {timeParticlePositions.map((pos, i) => {
          const color = i % 3 === 0 ? colors.magenta : i % 3 === 1 ? colors.yellow : colors.pink;
          return (
            <Node key={`time-particle-${i}`} x={pos.x} y={pos.y}>
              <Circle
                ref={timeParticlesTrail}
                size={30 + (i % 4) * 10}
                fill={color}
                opacity={0}
                filters={[blur(18)]}
              />
              <Circle
                ref={timeParticlesGlow}
                size={18 + (i % 4) * 5}
                fill={color}
                opacity={0}
                filters={[blur(10)]}
              />
              <Circle
                ref={timeParticles}
                size={6 + (i % 4) * 2}
                fill={color}
                opacity={0}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 11: Orbit Particles ===== */}
      <Node ref={orbitContainer} opacity={0}>
        {orbitPositions.map((pos, i) => {
          const x = Math.cos(pos.angle) * pos.radius;
          const y = Math.sin(pos.angle) * pos.radius * 0.65;
          const color = i % 3 === 0 ? colors.yellow : i % 3 === 1 ? colors.magenta : colors.pink;
          return (
            <Node key={`orbit-particle-${i}`} x={x} y={y}>
              <Circle
                ref={orbitParticlesTrail}
                size={35 + (i % 3) * 12}
                fill={color}
                opacity={0}
                filters={[blur(20)]}
              />
              <Circle
                ref={orbitParticlesGlow}
                size={20 + (i % 3) * 7}
                fill={color}
                opacity={0}
                filters={[blur(12)]}
              />
              <Circle
                ref={orbitParticles}
                size={7 + (i % 3) * 3}
                fill={color}
                opacity={0}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 12: Transformation Figures ===== */}
      <Node ref={transformFiguresContainer} opacity={0}>
        {transformFigurePositions.map((pos, i) => {
          const color = i % 2 === 0 ? colors.yellow : colors.magenta;
          return (
            <Node key={`transform-figure-${i}`} x={pos.x} y={pos.y}>
              <Circle
                ref={transformFiguresOuterGlow}
                size={100 + (i % 3) * 20}
                fill={color}
                opacity={0}
                filters={[blur(40)]}
              />
              <Circle
                ref={transformFiguresSphereGlow}
                size={60 + (i % 3) * 15}
                fill={color}
                opacity={0}
                filters={[blur(25)]}
              />
              <Path
                ref={transformFiguresGlow}
                data={icons.person}
                fill={color}
                opacity={0}
                scale={pos.scale}
                offset={[-0.5, -0.5]}
                filters={[blur(12)]}
              />
              <Path
                ref={transformFigures}
                data={icons.person}
                fill={i % 2 === 0 ? colors.yellow : colors.white}
                opacity={0}
                scale={0}
                offset={[-0.5, -0.5]}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 13: Clock Icon (center decorative) ===== */}
      <Node ref={clockIconContainer} opacity={0} y={-20}>
        <Circle
          ref={clockIconSphereGlow}
          size={120}
          fill={colors.magenta}
          opacity={0}
          filters={[blur(50)]}
        />
        <Path
          ref={clockIconGlow}
          data={icons.clock}
          fill={colors.magenta}
          opacity={0}
          scale={4}
          offset={[-0.5, -0.5]}
          filters={[blur(15)]}
        />
        <Path
          ref={clockIcon}
          data={icons.clock}
          fill={colors.white}
          opacity={0}
          scale={0}
          offset={[-0.5, -0.5]}
        />
      </Node>

      {/* ===== LAYER 14: Hourglass Elements ===== */}
      <Node ref={hourglassContainer} opacity={0} x={550} y={0}>
        {/* Top triangle glow */}
        <Path
          ref={hourglassTopGlow}
          data={HOURGLASS_TOP_PATH}
          fill={colors.yellow}
          opacity={0}
          filters={[blur(15)]}
        />
        <Path
          ref={hourglassTop}
          data={HOURGLASS_TOP_PATH}
          fill={null}
          stroke={colors.yellow}
          lineWidth={2}
          opacity={0}
        />
        {/* Bottom triangle glow */}
        <Path
          ref={hourglassBottomGlow}
          data={HOURGLASS_BOTTOM_PATH}
          fill={colors.magenta}
          opacity={0}
          filters={[blur(15)]}
        />
        <Path
          ref={hourglassBottom}
          data={HOURGLASS_BOTTOM_PATH}
          fill={null}
          stroke={colors.magenta}
          lineWidth={2}
          opacity={0}
        />
        {/* Center connection glow */}
        <Circle
          ref={hourglassCenterGlow}
          size={30}
          fill={colors.pink}
          opacity={0}
          filters={[blur(12)]}
        />
        <Circle
          ref={hourglassCenter}
          size={12}
          fill={colors.pink}
          opacity={0}
        />
        {/* Falling particles */}
        {Array.from({ length: HOURGLASS_PARTICLE_COUNT }, (_, i) => {
          const y = -70 + (i % 12) * 12;
          const x = (Math.random() - 0.5) * 30;
          const color = i % 2 === 0 ? colors.yellow : colors.magenta;
          return (
            <Node key={`hourglass-particle-${i}`} x={x} y={y}>
              <Circle
                ref={hourglassParticlesGlow}
                size={8 + (i % 3) * 3}
                fill={color}
                opacity={0}
                filters={[blur(5)]}
              />
              <Circle
                ref={hourglassParticles}
                size={3 + (i % 3)}
                fill={color}
                opacity={0}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 15: Ambient Particles ===== */}
      <Node ref={ambientParticlesContainer} opacity={0}>
        {Array.from({ length: AMBIENT_PARTICLE_COUNT }, (_, i) => {
          const angle = (i / AMBIENT_PARTICLE_COUNT) * Math.PI * 2;
          const radius = 500 + (i % 5) * 80;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius * 0.55;
          const color = i % 3 === 0 ? colors.magenta : i % 3 === 1 ? colors.yellow : colors.pink;
          return (
            <Node key={`ambient-particle-${i}`} x={x} y={y}>
              <Circle
                ref={ambientParticlesGlow}
                size={16 + (i % 4) * 6}
                fill={color}
                opacity={0}
                filters={[blur(10)]}
              />
              <Circle
                ref={ambientParticles}
                size={5 + (i % 4) * 2}
                fill={color}
                opacity={0}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 16: Sparkles ===== */}
      <Node ref={sparklesContainer} opacity={0}>
        {Array.from({ length: SPARKLE_COUNT }, (_, i) => {
          const angle = (i / SPARKLE_COUNT) * Math.PI * 2 + Math.PI / 6;
          const radius = 400 + (i % 4) * 70;
          const x = Math.cos(angle) * radius + Math.sin(i * 2) * 35;
          const y = Math.sin(angle) * radius * 0.55 + Math.cos(i * 2) * 25;
          const color = i % 3 === 0 ? colors.yellow : i % 3 === 1 ? colors.magenta : colors.pink;
          return (
            <Node key={`sparkle-${i}`} x={x} y={y}>
              <Path
                ref={sparklesGlow}
                data={icons.star}
                fill={color}
                opacity={0}
                scale={0.85 + (i % 3) * 0.3}
                offset={[-0.5, -0.5]}
                filters={[blur(8)]}
              />
              <Path
                ref={sparkles}
                data={icons.star}
                fill={color}
                opacity={0}
                scale={0}
                offset={[-0.5, -0.5]}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 17: Decorative Elements ===== */}
      <Node ref={decorContainer} opacity={0}>
        {/* Corner decorations */}
        {Array.from({ length: 5 }, (_, i) => (
          <Node key={`decor-corner-tl-${i}`} x={-870 + i * 35} y={-490 + i * 30}>
            <Circle
              ref={decorCirclesGlow}
              size={18 - i * 2}
              fill={colors.magenta}
              opacity={0}
              filters={[blur(10)]}
            />
            <Circle
              ref={decorCircles}
              size={8 - i}
              fill={colors.magenta}
              opacity={0}
            />
          </Node>
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <Node key={`decor-corner-tr-${i}`} x={870 - i * 35} y={-490 + i * 30}>
            <Circle
              ref={decorCirclesGlow}
              size={18 - i * 2}
              fill={colors.yellow}
              opacity={0}
              filters={[blur(10)]}
            />
            <Circle
              ref={decorCircles}
              size={8 - i}
              fill={colors.yellow}
              opacity={0}
            />
          </Node>
        ))}
        {Array.from({ length: 4 }, (_, i) => (
          <Node key={`decor-corner-bl-${i}`} x={-870 + i * 32} y={490 - i * 28}>
            <Circle
              ref={decorCirclesGlow}
              size={16 - i * 2}
              fill={colors.pink}
              opacity={0}
              filters={[blur(8)]}
            />
            <Circle
              ref={decorCircles}
              size={7 - i}
              fill={colors.pink}
              opacity={0}
            />
          </Node>
        ))}
        {Array.from({ length: 4 }, (_, i) => (
          <Node key={`decor-corner-br-${i}`} x={870 - i * 32} y={490 - i * 28}>
            <Circle
              ref={decorCirclesGlow}
              size={16 - i * 2}
              fill={colors.magenta}
              opacity={0}
              filters={[blur(8)]}
            />
            <Circle
              ref={decorCircles}
              size={7 - i}
              fill={colors.magenta}
              opacity={0}
            />
          </Node>
        ))}
        {/* Corner lines */}
        {Array.from({ length: 3 }, (_, i) => (
          <Node key={`decor-line-tl-${i}`}>
            <Line
              ref={decorLinesGlow}
              points={[
                [-930 + i * 25, -530 + i * 35],
                [-870 + i * 25, -470 + i * 35],
              ]}
              stroke={colors.magenta}
              lineWidth={4}
              opacity={0}
              end={0}
              filters={[blur(5)]}
            />
            <Line
              ref={decorLines}
              points={[
                [-930 + i * 25, -530 + i * 35],
                [-870 + i * 25, -470 + i * 35],
              ]}
              stroke={colors.magenta}
              lineWidth={1.5}
              opacity={0}
              end={0}
            />
          </Node>
        ))}
        {Array.from({ length: 3 }, (_, i) => (
          <Node key={`decor-line-tr-${i}`}>
            <Line
              ref={decorLinesGlow}
              points={[
                [930 - i * 25, -530 + i * 35],
                [870 - i * 25, -470 + i * 35],
              ]}
              stroke={colors.yellow}
              lineWidth={4}
              opacity={0}
              end={0}
              filters={[blur(5)]}
            />
            <Line
              ref={decorLines}
              points={[
                [930 - i * 25, -530 + i * 35],
                [870 - i * 25, -470 + i * 35],
              ]}
              stroke={colors.yellow}
              lineWidth={1.5}
              opacity={0}
              end={0}
            />
          </Node>
        ))}
      </Node>

      {/* ===== LAYER 18: Vignette ===== */}
      <Rect
        ref={vignetteTop}
        width={layout.width}
        height={200}
        y={-440}
        fill={colors.darkNavy}
        opacity={0}
        filters={[blur(50)]}
      />
      <Rect
        ref={vignetteBottom}
        width={layout.width}
        height={200}
        y={440}
        fill={colors.darkNavy}
        opacity={0}
        filters={[blur(50)]}
      />
    </>
  );

  // ============================================
  // ANIMATION TIMELINE
  // ============================================

  // ========================================
  // BEAT 0 (0.0s) - Scene initialization
  // ========================================
  yield* all(
    bgGlowMagenta1().opacity(0.03, 0.16),
    bgGlowPurple1().opacity(0.02, 0.16),
    bgGlowPurple2().opacity(0.015, 0.16),
  );

  // ========================================
  // BEAT 1 (0.4s) - Scanlines appear
  // ========================================
  yield* scanlineContainer().opacity(1, 0.1);

  // ========================================
  // BEAT 2 (0.65s) - Grid starts
  // ========================================
  yield* all(
    gridContainer().opacity(1, 0.04),
    ...gridLinesH.slice(0, 5).map((line, i) =>
      delay(i * 0.014, all(
        line.opacity(0.055, 0.08),
        line.end(1, 0.18, easeOutCubic),
        gridGlowH[i].opacity(0.022, 0.1),
        gridGlowH[i].end(1, 0.18, easeOutCubic),
      ))
    ),
  );

  // ========================================
  // BEAT 3 (0.9s) - More grid + background
  // ========================================
  yield* all(
    ...gridLinesV.slice(0, 5).map((line, i) =>
      delay(i * 0.014, all(
        line.opacity(0.045, 0.07),
        line.end(1, 0.16, easeOutCubic),
        gridGlowV[i].opacity(0.018, 0.09),
        gridGlowV[i].end(1, 0.16, easeOutCubic),
      ))
    ),
    bgGlowYellow1().opacity(0.02, 0.14),
    bgGlowPink1().opacity(0.018, 0.14),
  );

  // ========================================
  // BEAT 4 (1.2s) - Clock container appears
  // ========================================
  yield* clockContainer().opacity(1, 0.06);

  // ========================================
  // BEAT 5 (1.35s) - Clock outer glow
  // ========================================
  yield* all(
    clockFaceOuterGlow().opacity(0.12, 0.16),
    clockFaceMiddleGlow().opacity(0.2, 0.14),
  );

  // ========================================
  // BEAT 6 (1.7s) - Clock rings appear
  // ========================================
  yield* all(
    clockFaceRing1().opacity(0.7, 0.1),
    delay(0.03, clockFaceRing2().opacity(0.4, 0.1)),
    delay(0.06, clockFaceRing3().opacity(0.5, 0.1)),
    clockFaceInnerGlow().opacity(0.25, 0.12),
  );

  // ========================================
  // BEAT 7 (2.0s) - Clock center appears
  // ========================================
  yield* all(
    clockFaceCenterGlow().opacity(0.5, 0.08),
    clockFaceCenter().opacity(1, 0.08),
    clockFaceCenter().size(25, 0.1, easeOutBack),
  );

  // ========================================
  // BEAT 8 (2.25s) - Tick marks container
  // ========================================
  yield* tickMarksContainer().opacity(1, 0.04);

  // ========================================
  // BEAT 9 (2.35s) - Tick marks draw
  // ========================================
  yield* sequence(
    0.006,
    ...tickMarks.map((mark, i) =>
      all(
        mark.opacity(tickMarkPositions[i].isHourMark ? 0.85 : 0.5, 0.06),
        mark.end(1, 0.1, easeOutCubic),
        tickMarksGlow[i].opacity(tickMarkPositions[i].isHourMark ? 0.4 : 0.2, 0.08),
        tickMarksGlow[i].end(1, 0.1, easeOutCubic),
      )
    )
  );

  // ========================================
  // BEAT 10 (3.2s) - Clock numbers container
  // ========================================
  yield* clockNumbersContainer().opacity(1, 0.04);

  // ========================================
  // BEAT 11 (3.3s) - Clock numbers appear
  // ========================================
  yield* sequence(
    0.024,
    ...clockNumbers.map((num, i) =>
      all(
        num.opacity(0.9, 0.08),
        clockNumbersGlow[i].opacity(0.25, 0.1),
      )
    )
  );

  // ========================================
  // BEAT 12 (4.0s) - Clock hands container
  // ========================================
  yield* clockHandsContainer().opacity(1, 0.04);

  // ========================================
  // BEAT 13 (4.1s) - Hour hand appears
  // ========================================
  yield* all(
    hourHand().opacity(1, 0.08),
    hourHandGlow().opacity(0.4, 0.1),
  );

  // ========================================
  // BEAT 14 (4.35s) - Minute hand appears
  // ========================================
  yield* all(
    minuteHand().opacity(1, 0.08),
    minuteHandGlow().opacity(0.35, 0.1),
  );

  // ========================================
  // BEAT 15 (4.6s) - Second hand + pivot
  // ========================================
  yield* all(
    secondHand().opacity(1, 0.07),
    secondHandGlow().opacity(0.3, 0.09),
    handsPivot().opacity(1, 0.06),
    handsPivotGlow().opacity(0.5, 0.08),
  );

  // ========================================
  // BEAT 16 (4.8s) - Clock hands start rotating
  // ========================================
  yield* all(
    hourHand().rotation(30, 0.32, easeInOutCubic),
    hourHandGlow().rotation(30, 0.32, easeInOutCubic),
    minuteHand().rotation(180, 0.32, easeInOutCubic),
    minuteHandGlow().rotation(180, 0.32, easeInOutCubic),
    secondHand().rotation(720, 0.32, linear),
    secondHandGlow().rotation(720, 0.32, linear),
  );

  // ========================================
  // BEAT 17 (5.6s) - Energy rings container
  // ========================================
  yield* energyRingsContainer().opacity(1, 0.04);

  // ========================================
  // BEAT 18 (5.7s) - First energy pulse
  // ========================================
  yield* all(
    energyRings[0].opacity(0.6, 0.06),
    energyRings[0].size(380, 0.2, easeOutCubic),
    energyRingsGlow[0].opacity(0.3, 0.08),
    energyRingsGlow[0].size(380, 0.2, easeOutCubic),
  );
  yield* all(
    energyRings[0].opacity(0, 0.12),
    energyRingsGlow[0].opacity(0, 0.12),
  );

  // ========================================
  // BEAT 19 (6.2s) - Radial lines container
  // ========================================
  yield* radialLinesContainer().opacity(1, 0.04);

  // ========================================
  // BEAT 20 (6.3s) - Radial lines shoot out
  // ========================================
  yield* sequence(
    0.012,
    ...radialLines.map((line, i) =>
      all(
        line.opacity(0.5, 0.06),
        line.end(1, 0.16, easeOutQuart),
        radialLinesGlow[i].opacity(0.25, 0.08),
        radialLinesGlow[i].end(1, 0.16, easeOutQuart),
      )
    )
  );

  // ========================================
  // BEAT 21 (7.0s) - Background intensifies
  // ========================================
  yield* all(
    bgGlowMagenta1().opacity(0.04, 0.14),
    bgGlowMagenta2().opacity(0.025, 0.14),
    bgGlowYellow1().opacity(0.03, 0.14),
  );

  // ========================================
  // BEAT 22 (7.35s) - Time particles container
  // ========================================
  yield* timeParticlesContainer().opacity(1, 0.04);

  // ========================================
  // BEAT 23 (7.45s) - Time particles appear
  // ========================================
  yield* sequence(
    0.01,
    ...timeParticles.map((particle, i) =>
      all(
        particle.opacity(0.7, 0.07),
        timeParticlesGlow[i].opacity(0.4, 0.09),
        timeParticlesTrail[i].opacity(0.15, 0.1),
      )
    )
  );

  // ========================================
  // BEAT 24 (8.35s) - Time particles rotate
  // ========================================
  yield* all(
    ...timeParticles.map((particle, i) => {
      const pos = timeParticlePositions[i];
      const newAngle = pos.angle + Math.PI / 3;
      const newX = Math.cos(newAngle) * pos.radius;
      const newY = Math.sin(newAngle) * pos.radius;
      return all(
        particle.x(newX, 0.28, easeInOutSine),
        particle.y(newY, 0.28, easeInOutSine),
      );
    }),
    ...timeParticlesGlow.map((glow, i) => {
      const pos = timeParticlePositions[i];
      const newAngle = pos.angle + Math.PI / 3;
      const newX = Math.cos(newAngle) * pos.radius;
      const newY = Math.sin(newAngle) * pos.radius;
      return all(
        glow.x(newX, 0.28, easeInOutSine),
        glow.y(newY, 0.28, easeInOutSine),
      );
    }),
    ...timeParticlesTrail.map((trail, i) => {
      const pos = timeParticlePositions[i];
      const newAngle = pos.angle + Math.PI / 3;
      const newX = Math.cos(newAngle) * pos.radius;
      const newY = Math.sin(newAngle) * pos.radius;
      return all(
        trail.x(newX, 0.28, easeInOutSine),
        trail.y(newY, 0.28, easeInOutSine),
      );
    }),
  );

  // ========================================
  // BEAT 25 (9.05s) - Second energy pulse
  // ========================================
  yield* all(
    energyRings[1].opacity(0.55, 0.05),
    energyRings[1].size(450, 0.22, easeOutCubic),
    energyRings[2].opacity(0.4, 0.06),
    energyRings[2].size(500, 0.24, easeOutCubic),
    energyRingsGlow[1].opacity(0.28, 0.07),
    energyRingsGlow[1].size(450, 0.22, easeOutCubic),
    energyRingsGlow[2].opacity(0.2, 0.08),
    energyRingsGlow[2].size(500, 0.24, easeOutCubic),
  );
  yield* all(
    energyRings[1].opacity(0, 0.12),
    energyRings[2].opacity(0, 0.14),
    energyRingsGlow[1].opacity(0, 0.12),
    energyRingsGlow[2].opacity(0, 0.14),
  );

  // ========================================
  // BEAT 26 (9.7s) - Orbit container
  // ========================================
  yield* orbitContainer().opacity(1, 0.04);

  // ========================================
  // BEAT 27 (9.8s) - Orbit particles appear
  // ========================================
  yield* sequence(
    0.014,
    ...orbitParticles.map((particle, i) =>
      all(
        particle.opacity(0.75, 0.08),
        orbitParticlesGlow[i].opacity(0.45, 0.1),
        orbitParticlesTrail[i].opacity(0.18, 0.11),
      )
    )
  );

  // ========================================
  // BEAT 28 (10.5s) - Complete grid
  // ========================================
  yield* all(
    ...gridLinesH.slice(5).map((line, i) =>
      delay(i * 0.01, all(
        line.opacity(0.045, 0.06),
        line.end(1, 0.14, easeOutCubic),
      ))
    ),
    ...gridLinesV.slice(5).map((line, i) =>
      delay(i * 0.01, all(
        line.opacity(0.038, 0.06),
        line.end(1, 0.14, easeOutCubic),
      ))
    ),
  );

  // ========================================
  // BEAT 29 (10.9s) - Transformation begins
  // ========================================
  yield* transformFiguresContainer().opacity(1, 0.04);

  // ========================================
  // BEAT 30 (11.0s) - Figures emerge from clock
  // ========================================
  yield* sequence(
    0.04,
    ...transformFigures.map((fig, i) =>
      all(
        fig.scale(transformFigurePositions[i].scale, 0.16, easeOutBack),
        fig.opacity(1, 0.11),
        delay(0.03, transformFiguresGlow[i].opacity(0.5, 0.13)),
        delay(0.05, transformFiguresSphereGlow[i].opacity(0.3, 0.14)),
        delay(0.07, transformFiguresOuterGlow[i].opacity(0.15, 0.16)),
      )
    )
  );

  // ========================================
  // BEAT 31 (11.8s) - Clock hands continue rotating
  // ========================================
  yield* all(
    hourHand().rotation(60, 0.24, easeInOutCubic),
    hourHandGlow().rotation(60, 0.24, easeInOutCubic),
    minuteHand().rotation(360, 0.24, easeInOutCubic),
    minuteHandGlow().rotation(360, 0.24, easeInOutCubic),
    secondHand().rotation(1440, 0.24, linear),
    secondHandGlow().rotation(1440, 0.24, linear),
  );

  // ========================================
  // BEAT 32 (12.4s) - Clock Icon appears
  // ========================================
  yield* clockIconContainer().opacity(1, 0.04);
  yield* all(
    clockIcon().scale(4, 0.14, easeOutBack),
    clockIcon().opacity(1, 0.1),
    clockIconGlow().opacity(0.55, 0.12),
    clockIconSphereGlow().opacity(0.35, 0.14),
  );

  // ========================================
  // BEAT 33 (12.85s) - Hourglass appears
  // ========================================
  yield* hourglassContainer().opacity(1, 0.06);
  yield* all(
    hourglassTop().opacity(0.7, 0.1),
    hourglassTopGlow().opacity(0.2, 0.12),
    hourglassBottom().opacity(0.7, 0.1),
    hourglassBottomGlow().opacity(0.2, 0.12),
    hourglassCenter().opacity(0.8, 0.08),
    hourglassCenterGlow().opacity(0.4, 0.1),
  );

  // ========================================
  // BEAT 34 (13.3s) - Hourglass particles animate
  // ========================================
  yield* sequence(
    0.016,
    ...hourglassParticles.map((particle, i) =>
      all(
        particle.opacity(0.6, 0.06),
        particle.y(particle.y() + 60, 0.2, easeInCubic),
        hourglassParticlesGlow[i].opacity(0.35, 0.08),
        hourglassParticlesGlow[i].y(hourglassParticlesGlow[i].y() + 60, 0.2, easeInCubic),
      )
    )
  );

  // ========================================
  // BEAT 35 (13.8s) - Sparkles container
  // ========================================
  yield* sparklesContainer().opacity(1, 0.04);

  // ========================================
  // BEAT 36 (13.9s) - Sparkles appear
  // ========================================
  yield* sequence(
    0.016,
    ...sparkles.map((sparkle, i) =>
      all(
        sparkle.scale(0.85 + (i % 3) * 0.3, 0.1, easeOutBack),
        sparkle.opacity(0.6, 0.07),
        sparklesGlow[i].opacity(0.35, 0.09),
      )
    )
  );

  // ========================================
  // BEAT 37 (14.35s) - Ambient particles container
  // ========================================
  yield* ambientParticlesContainer().opacity(1, 0.04);

  // ========================================
  // BEAT 38 (14.45s) - Ambient particles appear
  // ========================================
  yield* sequence(
    0.012,
    ...ambientParticles.map((particle, i) =>
      all(
        particle.opacity(0.6, 0.07),
        ambientParticlesGlow[i].opacity(0.35, 0.09),
      )
    )
  );

  // ========================================
  // BEAT 39 (14.9s) - Third energy pulse
  // ========================================
  yield* all(
    energyRings[3].opacity(0.5, 0.05),
    energyRings[3].size(550, 0.24, easeOutCubic),
    energyRings[4].opacity(0.35, 0.06),
    energyRings[4].size(600, 0.26, easeOutCubic),
    energyRings[5].opacity(0.25, 0.07),
    energyRings[5].size(650, 0.28, easeOutCubic),
    energyRingsGlow[3].opacity(0.25, 0.07),
    energyRingsGlow[3].size(550, 0.24, easeOutCubic),
    energyRingsGlow[4].opacity(0.18, 0.08),
    energyRingsGlow[4].size(600, 0.26, easeOutCubic),
    energyRingsGlow[5].opacity(0.12, 0.09),
    energyRingsGlow[5].size(650, 0.28, easeOutCubic),
  );
  yield* all(
    ...energyRings.slice(3).map((ring) => ring.opacity(0, 0.14)),
    ...energyRingsGlow.slice(3).map((glow) => glow.opacity(0, 0.14)),
  );

  // ========================================
  // BEAT 40 (15.6s) - Vignette appears
  // ========================================
  yield* all(
    vignetteTop().opacity(0.3, 0.12),
    vignetteBottom().opacity(0.3, 0.12),
  );

  // ========================================
  // BEAT 41 (15.9s) - Decor container
  // ========================================
  yield* decorContainer().opacity(1, 0.04);

  // ========================================
  // BEAT 42 (16.0s) - Decorative elements
  // ========================================
  yield* all(
    ...decorCircles.map((circle, i) =>
      delay(i * 0.008, circle.opacity(0.5, 0.07))
    ),
    ...decorCirclesGlow.map((glow, i) =>
      delay(i * 0.008, glow.opacity(0.28, 0.09))
    ),
    ...decorLines.map((line, i) =>
      delay(i * 0.012, all(
        line.opacity(0.42, 0.06),
        line.end(1, 0.11, easeOutCubic),
      ))
    ),
    ...decorLinesGlow.map((glow, i) =>
      delay(i * 0.012, all(
        glow.opacity(0.22, 0.07),
        glow.end(1, 0.11, easeOutCubic),
      ))
    ),
  );

  // ========================================
  // BEAT 43 (16.45s) - Figures pulse
  // ========================================
  yield* all(
    ...transformFigures.map((fig, i) =>
      delay(i * 0.012, chain(
        fig.scale(transformFigurePositions[i].scale * 1.15, 0.05, easeOutCubic),
        fig.scale(transformFigurePositions[i].scale, 0.06, easeInOutCubic),
      ))
    ),
  );

  // ========================================
  // BEAT 44 (16.8s) - Background glow shift
  // ========================================
  yield* all(
    bgGlowMagenta1().opacity(0.05, 0.18),
    bgGlowYellow1().opacity(0.04, 0.18),
    bgGlowPink1().opacity(0.028, 0.18),
    bgGlowMagenta2().opacity(0.032, 0.18),
  );

  // ========================================
  // BEAT 45 (17.25s) - Orbit rotation
  // ========================================
  yield* all(
    ...orbitParticles.map((particle, i) => {
      const pos = orbitPositions[i];
      const newAngle = pos.angle + Math.PI / 2;
      const newX = Math.cos(newAngle) * pos.radius;
      const newY = Math.sin(newAngle) * pos.radius * 0.65;
      return all(
        particle.x(newX, 0.24, easeInOutSine),
        particle.y(newY, 0.24, easeInOutSine),
      );
    }),
    ...orbitParticlesGlow.map((glow, i) => {
      const pos = orbitPositions[i];
      const newAngle = pos.angle + Math.PI / 2;
      const newX = Math.cos(newAngle) * pos.radius;
      const newY = Math.sin(newAngle) * pos.radius * 0.65;
      return all(
        glow.x(newX, 0.24, easeInOutSine),
        glow.y(newY, 0.24, easeInOutSine),
      );
    }),
    ...orbitParticlesTrail.map((trail, i) => {
      const pos = orbitPositions[i];
      const newAngle = pos.angle + Math.PI / 2;
      const newX = Math.cos(newAngle) * pos.radius;
      const newY = Math.sin(newAngle) * pos.radius * 0.65;
      return all(
        trail.x(newX, 0.24, easeInOutSine),
        trail.y(newY, 0.24, easeInOutSine),
      );
    }),
  );

  // ========================================
  // BEAT 46 (17.85s) - Clock face pulses
  // ========================================
  yield* all(
    clockFaceRing1().size(520, 0.05, easeOutCubic),
    clockFaceInnerGlow().opacity(0.35, 0.05),
    clockFaceMiddleGlow().opacity(0.3, 0.05),
  );
  yield* all(
    clockFaceRing1().size(500, 0.06, easeInOutCubic),
    clockFaceInnerGlow().opacity(0.25, 0.06),
    clockFaceMiddleGlow().opacity(0.2, 0.06),
  );

  // ========================================
  // BEAT 47 (18.15s) - Sparkles twinkle
  // ========================================
  yield* all(
    ...sparkles.map((sparkle, i) =>
      delay(i * 0.01, chain(
        sparkle.scale((0.85 + (i % 3) * 0.3) * 1.4, 0.04, easeOutCubic),
        sparkle.scale(0.85 + (i % 3) * 0.3, 0.06, easeInOutCubic),
      ))
    ),
  );

  // ========================================
  // BEAT 48 (18.55s) - Time particles continue rotation
  // ========================================
  yield* all(
    ...timeParticles.map((particle, i) => {
      const pos = timeParticlePositions[i];
      const newAngle = pos.angle + Math.PI * 2 / 3;
      const newX = Math.cos(newAngle) * pos.radius;
      const newY = Math.sin(newAngle) * pos.radius;
      return all(
        particle.x(newX, 0.26, easeInOutSine),
        particle.y(newY, 0.26, easeInOutSine),
      );
    }),
    ...timeParticlesGlow.map((glow, i) => {
      const pos = timeParticlePositions[i];
      const newAngle = pos.angle + Math.PI * 2 / 3;
      const newX = Math.cos(newAngle) * pos.radius;
      const newY = Math.sin(newAngle) * pos.radius;
      return all(
        glow.x(newX, 0.26, easeInOutSine),
        glow.y(newY, 0.26, easeInOutSine),
      );
    }),
  );

  // ========================================
  // BEAT 49 (19.2s) - Clock icon pulses
  // ========================================
  yield* all(
    clockIcon().scale(4.4, 0.05, easeOutCubic),
    clockIconGlow().opacity(0.7, 0.04),
    clockIconSphereGlow().opacity(0.5, 0.04),
  );
  yield* all(
    clockIcon().scale(4, 0.07, easeInOutCubic),
    clockIconGlow().opacity(0.55, 0.06),
    clockIconSphereGlow().opacity(0.35, 0.06),
  );

  // ========================================
  // BEAT 50 (19.5s) - Radial lines pulse
  // ========================================
  yield* all(
    ...radialLines.map((line, i) =>
      delay(i * 0.006, chain(
        line.lineWidth(3, 0.04, easeOutCubic),
        line.lineWidth(1.5, 0.05, easeInOutCubic),
      ))
    ),
    ...radialLinesGlow.map((glow, i) =>
      delay(i * 0.006, chain(
        glow.opacity(0.4, 0.04),
        glow.opacity(0.25, 0.05),
      ))
    ),
  );

  // ========================================
  // BEAT 51 (19.95s) - Final hands rotation
  // ========================================
  yield* all(
    hourHand().rotation(90, 0.2, easeInOutCubic),
    hourHandGlow().rotation(90, 0.2, easeInOutCubic),
    minuteHand().rotation(540, 0.2, easeInOutCubic),
    minuteHandGlow().rotation(540, 0.2, easeInOutCubic),
    secondHand().rotation(2160, 0.2, linear),
    secondHandGlow().rotation(2160, 0.2, linear),
  );

  // ========================================
  // BEAT 52 (20.45s) - Ambient drift
  // ========================================
  yield* all(
    ...ambientParticles.map((particle, i) => {
      const angle = (i / AMBIENT_PARTICLE_COUNT) * Math.PI * 2;
      const driftX = Math.cos(angle) * 25;
      const driftY = Math.sin(angle) * 18;
      return delay(i * 0.005, all(
        particle.x(particle.x() + driftX, 0.18, easeInOutSine),
        particle.y(particle.y() + driftY, 0.18, easeInOutSine),
      ));
    }),
  );

  // ========================================
  // BEAT 53 (20.9s) - Final intensity
  // ========================================
  yield* all(
    bgGlowMagenta1().opacity(0.06, 0.16),
    bgGlowYellow1().opacity(0.05, 0.16),
    bgGlowPink1().opacity(0.035, 0.16),
    clockFaceOuterGlow().opacity(0.18, 0.14),
  );

  // ========================================
  // BEAT 54 (21.3s) - Everything pulses together
  // ========================================
  yield* all(
    clockFaceCenter().size(32, 0.05, easeOutCubic),
    clockIcon().scale(4.3, 0.05, easeOutCubic),
    ...transformFigures.map((fig, i) =>
      fig.scale(transformFigurePositions[i].scale * 1.1, 0.05, easeOutCubic)
    ),
  );
  yield* all(
    clockFaceCenter().size(25, 0.07, easeInOutCubic),
    clockIcon().scale(4, 0.07, easeInOutCubic),
    ...transformFigures.map((fig, i) =>
      fig.scale(transformFigurePositions[i].scale, 0.07, easeInOutCubic)
    ),
  );

  // ========================================
  // BEAT 55 (21.6s) - Hold final frame
  // ========================================
  yield* waitFor(0.36);

  // ========================================
  // Total duration: ~10 seconds
  // ========================================
});
