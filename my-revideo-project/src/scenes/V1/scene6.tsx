/**
 * Scene 6: Logo Outro
 * Duration: 28:00 - 32:00 (4 seconds)
 * VO: "Same program, different boxes, no waiting. That's how Solana stays fast."
 *     (Optional, could be silent)
 * 
 * Visual: Quick recap montage (warehouse, boxes, parallel beams),
 *         then Raiku logo with neon glow
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
  linear,
} from '@revideo/core';

import { RAIKU, colors, timing, effects, layout, cube } from '../lib/raiku';

export default makeScene2D('scene6', function* (view) {
  // ============================================
  // SCENE SETUP
  // ============================================
  view.fill(colors.background);

  // ============================================
  // REFS - Background
  // ============================================
  const bgGlow = createRef<Circle>();
  const bgGlowOuter = createRef<Circle>();

  // ============================================
  // REFS - Recap Elements (Quick Montage)
  // ============================================
  const recapGroup = createRef<Node>();

  // Program box icon
  const programIcon = createRef<Node>();
  const programBox = createRef<Rect>();
  const programGlow = createRef<Rect>();

  // Data boxes icon cluster
  const dataCluster = createRef<Node>();
  const dataBoxes = createRefArray<Rect>();
  const dataBoxGlows = createRefArray<Rect>();

  // Parallel beam arrows
  const beamArrows = createRefArray<Line>();
  const beamArrowGlows = createRefArray<Line>();

  // ============================================
  // REFS - Raiku Logo
  // ============================================
  const logoGroup = createRef<Node>();
  const logoGlowOuter = createRef<Circle>();
  const logoGlowInner = createRef<Circle>();
  const logoHexagon = createRef<Path>();
  const logoHexagonGlow = createRef<Path>();
  const logoChevron = createRef<Path>();

  // ============================================
  // REFS - URL
  // ============================================
  const urlGroup = createRef<Node>();
  const urlDots = createRefArray<Circle>();
  const urlUnderline = createRef<Line>();

  // ============================================
  // REFS - Ambient particles
  // ============================================
  const ambientParticles = createRefArray<Circle>();
  const ambientGlows = createRefArray<Circle>();

  // ============================================
  // CONSTANTS
  // ============================================
  const LOGO_SIZE = 120;
  const PARTICLE_COUNT = 16;

  // Hexagon path (scaled for logo)
  const hexPath = 'M 60 0 L 113.92 30 L 113.92 90 L 60 120 L 6.08 90 L 6.08 30 Z';
  // Chevron inside hexagon
  const chevronPath = 'M 35 45 L 60 70 L 85 45';

  // ============================================
  // BUILD SCENE
  // ============================================
  view.add(
    <>
      {/* ===== LAYER 1: Background Glow ===== */}
      <Circle
        ref={bgGlowOuter}
        size={1200}
        fill={colors.glow}
        opacity={0}
        filters={[blur(300)]}
      />
      <Circle
        ref={bgGlow}
        size={600}
        fill={colors.glow}
        opacity={0}
        filters={[blur(150)]}
      />

      {/* ===== LAYER 2: Ambient Particles ===== */}
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
        const radius = 250 + (i % 4) * 80;
        return (
          <Node key={`particle-${i}`}>
            <Circle
              ref={ambientGlows}
              size={8 + (i % 4) * 3}
              fill={i % 3 === 0 ? colors.neon : colors.white}
              opacity={0}
              x={Math.cos(angle) * radius}
              y={Math.sin(angle) * radius * 0.7}
              filters={[blur(8)]}
            />
            <Circle
              ref={ambientParticles}
              size={3 + (i % 3)}
              fill={i % 3 === 0 ? colors.neon : colors.white}
              opacity={0}
              x={Math.cos(angle) * radius}
              y={Math.sin(angle) * radius * 0.7}
            />
          </Node>
        );
      })}

      {/* ===== LAYER 3: Recap Group ===== */}
      <Node ref={recapGroup} opacity={0}>
        {/* Program Box (left) */}
        <Node ref={programIcon} x={-200} y={0} scale={0.8}>
          <Rect
            ref={programGlow}
            width={60}
            height={60}
            fill={colors.neon}
            opacity={0}
            radius={8}
            filters={[blur(15)]}
          />
          <Rect
            ref={programBox}
            width={60}
            height={60}
            fill={colors.background}
            stroke={colors.neon}
            lineWidth={2}
            radius={8}
          />
          {/* Code brackets inside */}
          <Line
            points={[[-15, -12], [-22, 0], [-15, 12]]}
            stroke={colors.white}
            lineWidth={2}
            lineCap="round"
            lineJoin="round"
          />
          <Line
            points={[[15, -12], [22, 0], [15, 12]]}
            stroke={colors.white}
            lineWidth={2}
            lineCap="round"
            lineJoin="round"
          />
        </Node>

        {/* Parallel arrows (center) */}
        {Array.from({ length: 3 }, (_, i) => (
          <Node key={`arrow-group-${i}`}>
            <Line
              ref={beamArrowGlows}
              points={[
                [-120, -30 + i * 30],
                [120, -30 + i * 30],
              ]}
              stroke={colors.neon}
              lineWidth={6}
              opacity={0}
              lineCap="round"
              end={0}
              filters={[blur(8)]}
            />
            <Line
              ref={beamArrows}
              points={[
                [-120, -30 + i * 30],
                [120, -30 + i * 30],
              ]}
              stroke={colors.neon}
              lineWidth={2}
              opacity={0}
              lineCap="round"
              endArrow
              arrowSize={8}
              end={0}
            />
          </Node>
        ))}

        {/* Data Boxes (right) */}
        <Node ref={dataCluster} x={200} y={0}>
          {Array.from({ length: 4 }, (_, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            return (
              <Node key={`data-box-${i}`}>
                <Rect
                  ref={dataBoxGlows}
                  width={35}
                  height={35}
                  fill={colors.white}
                  opacity={0}
                  radius={4}
                  x={-20 + col * 45}
                  y={-20 + row * 45}
                  filters={[blur(8)]}
                />
                <Rect
                  ref={dataBoxes}
                  width={35}
                  height={35}
                  fill={colors.background}
                  stroke={colors.white}
                  lineWidth={2}
                  radius={4}
                  x={-20 + col * 45}
                  y={-20 + row * 45}
                />
              </Node>
            );
          })}
        </Node>
      </Node>

      {/* ===== LAYER 4: Raiku Logo ===== */}
      <Node ref={logoGroup} scale={0} opacity={0}>
        {/* Outer glow */}
        <Circle
          ref={logoGlowOuter}
          size={LOGO_SIZE * 2.5}
          fill={colors.glow}
          opacity={0}
          filters={[blur(effects.glowBlurLarge)]}
        />
        {/* Inner glow */}
        <Circle
          ref={logoGlowInner}
          size={LOGO_SIZE * 1.5}
          fill={colors.glow}
          opacity={0}
          filters={[blur(effects.glowBlur)]}
        />
        {/* Hexagon glow */}
        <Path
          ref={logoHexagonGlow}
          data={hexPath}
          fill={colors.neon}
          opacity={0}
          scale={1}
          x={-60}
          y={-60}
          filters={[blur(effects.glowBlur)]}
        />
        {/* Hexagon */}
        <Path
          ref={logoHexagon}
          data={hexPath}
          fill={colors.neon}
          opacity={0}
          scale={1}
          x={-60}
          y={-60}
        />
        {/* Chevron inside */}
        <Path
          ref={logoChevron}
          data={chevronPath}
          stroke={colors.black}
          lineWidth={6}
          fill={null}
          lineCap="round"
          lineJoin="round"
          x={-60}
          y={-60}
          opacity={0}
        />
      </Node>

      {/* ===== LAYER 5: URL ===== */}
      <Node ref={urlGroup} y={120} opacity={0}>
        {/* raiku.com represented as dots (no text per spec) */}
        {Array.from({ length: 9 }, (_, i) => (
          <Circle
            key={`url-dot-${i}`}
            ref={urlDots}
            size={6}
            fill={colors.white}
            x={-50 + i * 12}
            opacity={0}
          />
        ))}
        {/* Underline */}
        <Line
          ref={urlUnderline}
          points={[
            [-55, 15],
            [55, 15],
          ]}
          stroke={colors.neon}
          lineWidth={2}
          lineCap="round"
          opacity={0}
          end={0}
        />
      </Node>
    </>
  );

  // ============================================
  // ANIMATION TIMELINE
  // ============================================

  // --- Beat 0 (28:00) - Background subtly appears ---
  yield* all(
    bgGlowOuter().opacity(0.02, timing.beat),
    bgGlow().opacity(0.03, timing.beat),
  );

  // --- Beat 1 (28:05) - Recap group fades in ---
  yield* recapGroup().opacity(1, timing.entrance);

  // --- Beat 2 (28:10) - Program box glows ---
  yield* all(
    programGlow().opacity(0.5, timing.fast),
    programBox().scale(1.05, timing.fast, easeOutCubic),
  );
  yield* programBox().scale(1, timing.microBeat, easeInOutCubic);

  // --- Beat 3 (28:15) - Parallel arrows animate ---
  yield* sequence(
    0.08,
    ...beamArrows.map((arrow, i) =>
      all(
        arrow.opacity(0.8, timing.fast),
        arrow.end(1, 0.2, easeOutCubic),
        beamArrowGlows[i].opacity(0.4, timing.fast),
        beamArrowGlows[i].end(1, 0.2, easeOutCubic),
      )
    )
  );

  // --- Beat 4 (28:22) - Data boxes light up ---
  yield* sequence(
    0.05,
    ...dataBoxes.map((box, i) =>
      all(
        dataBoxGlows[i].opacity(0.3, timing.fast),
        box.stroke(colors.neon, timing.fast),
      )
    )
  );

  // --- Beat 5 (28:28) - Quick pulse on all recap elements ---
  yield* all(
    programGlow().opacity(0.7, timing.fast),
    ...dataBoxGlows.map((glow) => glow.opacity(0.5, timing.fast)),
    ...beamArrowGlows.map((glow) => glow.opacity(0.6, timing.fast)),
  );

  // --- Beat 6 (29:00) - Recap shrinks/fades, makes room for logo ---
  yield* all(
    recapGroup().scale(0.3, timing.beat, easeInCubic),
    recapGroup().y(-250, timing.beat, easeInCubic),
    recapGroup().opacity(0, timing.beat),
  );

  // --- Beat 7 (29:10) - Logo appears ---
  yield* all(
    logoGroup().scale(1, timing.entrance * 2, easeOutCubic),
    logoGroup().opacity(1, timing.entrance * 1.5),
  );

  // --- Beat 8 (29:18) - Inner glows build ---
  yield* all(
    logoGlowInner().opacity(effects.glowOpacitySubtle, timing.entrance),
    logoGlowOuter().opacity(0.1, timing.entrance),
  );

  // --- Beat 9 (29:22) - Hexagon fills in ---
  yield* all(
    logoHexagon().opacity(1, timing.entrance),
    logoHexagonGlow().opacity(effects.glowOpacity, timing.entrance),
  );

  // --- Beat 10 (29:26) - Chevron reveals ---
  yield* logoChevron().opacity(1, timing.entrance);

  // --- Beat 11 (29:28) - Logo pulse ---
  yield* all(
    logoGroup().scale(1.08, timing.fast, easeOutCubic),
    logoGlowOuter().opacity(0.2, timing.fast),
    logoHexagonGlow().opacity(effects.glowOpacityBright, timing.fast),
  );
  yield* all(
    logoGroup().scale(1, timing.microBeat * 1.5, easeInOutCubic),
    logoGlowOuter().opacity(0.1, timing.microBeat * 1.5),
    logoHexagonGlow().opacity(effects.glowOpacity, timing.microBeat * 1.5),
  );

  // --- Beat 12 (30:00) - URL appears ---
  yield* urlGroup().opacity(1, timing.entrance);

  // --- Beat 13 (30:05) - URL dots type in ---
  yield* sequence(
    0.04,
    ...urlDots.map((dot) => dot.opacity(0.8, timing.fast))
  );

  // --- Beat 14 (30:15) - Underline draws ---
  yield* all(
    urlUnderline().opacity(0.8, timing.fast),
    urlUnderline().end(1, 0.25, easeOutCubic),
  );

  // --- Beat 15 (30:20) - Ambient particles fade in ---
  yield* all(
    ...ambientParticles.map((p, i) =>
      delay(i * 0.02, p.opacity(0.3, timing.entrance))
    ),
    ...ambientGlows.map((g, i) =>
      delay(i * 0.02, g.opacity(0.15, timing.entrance))
    ),
  );

  // --- Beat 16 (30:28) - Background glow intensifies ---
  yield* all(
    bgGlow().opacity(0.05, timing.beat),
    bgGlowOuter().opacity(0.03, timing.beat),
  );

  // --- Beat 17 (31:00) - Final logo pulse ---
  yield* all(
    logoHexagonGlow().opacity(effects.glowOpacityBright, timing.fast),
    logoGroup().scale(1.03, timing.fast, easeOutCubic),
  );
  yield* all(
    logoHexagonGlow().opacity(effects.glowOpacity, timing.microBeat),
    logoGroup().scale(1, timing.microBeat, easeInOutCubic),
  );

  // --- Hold on final frame (31:10 - 32:00) ---
  yield* waitFor(0.8);
});
