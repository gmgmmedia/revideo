/**
 * Scene 1: Solana Box to Warehouse
 * Duration: 00:00 - 03:10 (3.333 seconds)
 *
 * 0:00 - 1:10: Single box with Solana logo (neon colored)
 * 1:11 - 3:10: Box transitions into warehouse full of boxes, boxes glow at end
 *
 * VO: "Solana is basically a giant warehouse full of boxes."
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

export default makeScene2D('scene1', function* (view) {
  // ============================================
  // SCENE SETUP
  // ============================================
  view.fill(colors.background);

  // ============================================
  // TIMING CONSTANTS (in seconds)
  // ============================================
  // Phase 1: Box with Solana logo (0:00 - 1:10 = 0 - 1.333s)
  // Phase 2: Warehouse transition (1:11 - 3:10 = 1.367 - 3.333s)
  const PHASE1_END = 1.333;
  const PHASE2_START = 1.367;
  const SCENE_END = 3.333;

  // ============================================
  // REFS - Background Glows (Minimal for clean look)
  // ============================================
  const bgGlow1 = createRef<Circle>();
  const bgGlow2 = createRef<Circle>();

  // ============================================
  // REFS - Hero Cube with Solana Logo
  // ============================================
  const heroCubeGroup = createRef<Node>();
  const heroCubeShadow = createRef<Rect>();
  const heroCubeGlowOuter = createRef<Rect>();
  const heroCubeGlowInner = createRef<Circle>();
  const heroCubeMainFace = createRef<Rect>();
  const heroCubePulseRing = createRef<Circle>();

  // Solana logo elements
  const solanaLogoGroup = createRef<Node>();
  const solanaLogoPath = createRef<Path>();
  const solanaLogoGlow = createRef<Path>();

  // ============================================
  // REFS - Warehouse Grid Cubes
  // ============================================
  const warehouseContainer = createRef<Node>();
  const gridCubes = createRefArray<Node>();
  const gridCubesFaces = createRefArray<Rect>();
  const gridCubesGlows = createRefArray<Rect>();
  const gridCubesShadows = createRefArray<Rect>();

  // ============================================
  // REFS - Ambient Particles (for final glow effect)
  // ============================================
  const ambientParticles = createRefArray<Circle>();
  const ambientParticleGlows = createRefArray<Circle>();

  // ============================================
  // CONSTANTS
  // ============================================
  const HERO_SIZE = 180;
  const GRID_ROWS = 5;
  const GRID_COLS = 7;
  const CUBE_SPACING = 75;
  const SMALL_CUBE_SIZE = 50;
  const PARTICLE_COUNT = 12;

  // Solana Logo SVG Path (scaled and centered)
  // Original viewBox: 0 0 101 88, scaling to fit ~80px wide
  const SOLANA_LOGO_PATH = "M100.48 69.3817L83.8068 86.8015C83.4444 87.1799 83.0058 87.4816 82.5185 87.6878C82.0312 87.894 81.5055 88.0003 80.9743 88H1.93563C1.55849 88 1.18957 87.8926 0.874202 87.6912C0.558829 87.4897 0.31074 87.2029 0.160416 86.8659C0.0100923 86.529 -0.0359181 86.1566 0.0280382 85.7945C0.0919944 85.4324 0.263131 85.0964 0.520422 84.8278L17.2061 67.408C17.5676 67.0306 18.0047 66.7295 18.4904 66.5234C18.9762 66.3172 19.5002 66.2104 20.0301 66.2095H99.0644C99.4415 66.2095 99.8104 66.3169 100.126 66.5183C100.441 66.7198 100.689 67.0067 100.84 67.3436C100.99 67.6806 101.036 68.0529 100.972 68.415C100.908 68.7771 100.737 69.1131 100.48 69.3817ZM83.8068 34.3032C83.4444 33.9248 83.0058 33.6231 82.5185 33.4169C82.0312 33.2108 81.5055 33.1045 80.9743 33.1048H1.93563C1.55849 33.1048 1.18957 33.2121 0.874202 33.4136C0.558829 33.6151 0.31074 33.9019 0.160416 34.2388C0.0100923 34.5758 -0.0359181 34.9482 0.0280382 35.3103C0.0919944 35.6723 0.263131 36.0083 0.520422 36.277L17.2061 53.6968C17.5676 54.0742 18.0047 54.3752 18.4904 54.5814C18.9762 54.7875 19.5002 54.8944 20.0301 54.8952H99.0644C99.4415 54.8952 99.8104 54.7879 100.126 54.5864C100.441 54.3849 100.689 54.0981 100.84 53.7612C100.99 53.4242 101.036 53.0518 100.972 52.6897C100.908 52.3277 100.737 51.9917 100.48 51.723L83.8068 34.3032ZM1.93563 21.7905H80.9743C81.5055 21.7907 82.0312 21.6845 82.5185 21.4783C83.0058 21.2721 83.4444 20.9704 83.8068 20.592L100.48 3.17219C100.737 2.90357 100.908 2.56758 100.972 2.2055C101.036 1.84342 100.99 1.47103 100.84 1.13408C100.689 0.79713 100.441 0.510296 100.126 0.308823C99.8104 0.107349 99.4415 1.24074e-05 99.0644 0L20.0301 0C19.5002 0.000878397 18.9762 0.107699 18.4904 0.313848C18.0047 0.519998 17.5676 0.821087 17.2061 1.19848L0.524723 18.6183C0.267681 18.8866 0.0966198 19.2223 0.0325185 19.5839C-0.0315829 19.9456 0.0140624 20.3177 0.163856 20.6545C0.31365 20.9913 0.561081 21.2781 0.875804 21.4799C1.19053 21.6817 1.55886 21.7896 1.93563 21.7905Z";

  // ============================================
  // BUILD SCENE
  // ============================================
  view.add(
    <>
      {/* ===== LAYER 1: Background Glows ===== */}
      <Circle
        ref={bgGlow1}
        size={800}
        fill={colors.glow}
        opacity={0}
        x={0}
        y={0}
        filters={[blur(250)]}
      />
      <Circle
        ref={bgGlow2}
        size={600}
        fill={colors.glow}
        opacity={0}
        x={200}
        y={-100}
        filters={[blur(200)]}
      />

      {/* ===== LAYER 2: Warehouse Grid Cubes (Initially Hidden) ===== */}
      <Node ref={warehouseContainer} opacity={0}>
        {Array.from({ length: GRID_ROWS * GRID_COLS }, (_, i) => {
          const row = Math.floor(i / GRID_COLS);
          const col = i % GRID_COLS;
          const x = (col - (GRID_COLS - 1) / 2) * CUBE_SPACING;
          const y = (row - (GRID_ROWS - 1) / 2) * CUBE_SPACING;
          const isHighlighted = (row + col) % 4 === 0;

          return (
            <Node
              key={`grid-cube-${i}`}
              ref={gridCubes}
              x={x}
              y={y}
              scale={0}
              opacity={0}
            >
              {/* Shadow */}
              <Rect
                ref={gridCubesShadows}
                width={SMALL_CUBE_SIZE}
                height={SMALL_CUBE_SIZE}
                fill={colors.black}
                opacity={0}
                radius={4}
                x={4}
                y={4}
                filters={[blur(8)]}
              />
              {/* Glow */}
              <Rect
                ref={gridCubesGlows}
                width={SMALL_CUBE_SIZE + 4}
                height={SMALL_CUBE_SIZE + 4}
                fill={isHighlighted ? colors.neon : colors.white}
                opacity={0}
                radius={6}
                filters={[blur(12)]}
              />
              {/* Main face */}
              <Rect
                ref={gridCubesFaces}
                width={SMALL_CUBE_SIZE}
                height={SMALL_CUBE_SIZE}
                fill={null}
                stroke={isHighlighted ? colors.neon : colors.white}
                lineWidth={1.5}
                opacity={0.7}
                radius={4}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 3: Ambient Particles (for final glow) ===== */}
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
        const radius = 280 + (i % 3) * 80;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.6;

        return (
          <Node key={`ambient-${i}`}>
            <Circle
              ref={ambientParticleGlows}
              size={14 + (i % 4) * 4}
              fill={i % 3 === 0 ? colors.neon : colors.white}
              opacity={0}
              x={x}
              y={y}
              filters={[blur(12)]}
            />
            <Circle
              ref={ambientParticles}
              size={4 + (i % 3)}
              fill={i % 3 === 0 ? colors.neon : colors.white}
              opacity={0}
              x={x}
              y={y}
            />
          </Node>
        );
      })}

      {/* ===== LAYER 4: Hero Cube with Solana Logo ===== */}
      <Node ref={heroCubeGroup} scale={0} opacity={0}>
        {/* Deep shadow */}
        <Rect
          ref={heroCubeShadow}
          width={HERO_SIZE}
          height={HERO_SIZE}
          fill={colors.black}
          opacity={0}
          radius={12}
          x={15}
          y={15}
          filters={[blur(30)]}
        />

        {/* Pulse ring */}
        <Circle
          ref={heroCubePulseRing}
          size={HERO_SIZE * 2}
          fill={null}
          stroke={colors.neon}
          lineWidth={2}
          opacity={0}
        />

        {/* Inner glow */}
        <Circle
          ref={heroCubeGlowInner}
          size={HERO_SIZE * 1.8}
          fill={colors.glow}
          opacity={0}
          filters={[blur(effects.glowBlurLarge)]}
        />

        {/* Outer glow */}
        <Rect
          ref={heroCubeGlowOuter}
          width={HERO_SIZE + 12}
          height={HERO_SIZE + 12}
          fill={colors.neon}
          opacity={0}
          radius={16}
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
          radius={12}
        />

        {/* Solana Logo (centered inside cube) */}
        <Node ref={solanaLogoGroup} opacity={0}>
          {/* Logo glow */}
          <Path
            ref={solanaLogoGlow}
            data={SOLANA_LOGO_PATH}
            fill={colors.neon}
            opacity={0}
            scale={0.7}
            x={-35}
            y={-31}
            filters={[blur(10)]}
          />
          {/* Logo main */}
          <Path
            ref={solanaLogoPath}
            data={SOLANA_LOGO_PATH}
            fill={colors.neon}
            opacity={0}
            scale={0.7}
            x={-35}
            y={-31}
          />
        </Node>
      </Node>
    </>
  );

  // ============================================
  // ANIMATION TIMELINE
  // ============================================

  // ========================================
  // PHASE 1: Box with Solana Logo (0:00 - 1:10)
  // Duration: ~1.333 seconds
  // ========================================

  // Beat 0 (0:00) - Subtle background glow appears
  yield* all(
    bgGlow1().opacity(0.03, 0.2),
  );

  // Beat 1 (0:03) - Hero cube materializes with bounce
  yield* all(
    heroCubeGroup().scale(1, 0.35, easeOutBack),
    heroCubeGroup().opacity(1, 0.25),
    heroCubeGlowInner().opacity(effects.glowOpacitySubtle, 0.35),
    heroCubeShadow().opacity(0.5, 0.35),
  );

  // Beat 2 (0:10) - Glow intensifies
  yield* all(
    heroCubeGlowOuter().opacity(effects.glowOpacity, 0.15),
  );

  // Beat 3 (0:13) - Solana logo fades in
  yield* all(
    solanaLogoGroup().opacity(1, 0.15),
    solanaLogoPath().opacity(1, 0.2),
    solanaLogoGlow().opacity(0.5, 0.2),
  );

  // Beat 4 (0:18) - Logo pulse effect
  yield* all(
    solanaLogoGroup().scale(1.08, 0.12, easeOutCubic),
    solanaLogoGlow().opacity(0.8, 0.12),
  );
  yield* all(
    solanaLogoGroup().scale(1, 0.1, easeInOutCubic),
    solanaLogoGlow().opacity(0.5, 0.1),
  );

  // Beat 5 (0:22) - Cube pulse
  yield* all(
    heroCubeGroup().scale(1.05, 0.1, easeOutCubic),
    heroCubePulseRing().opacity(0.5, 0.1),
    heroCubePulseRing().size(HERO_SIZE * 2.3, 0.1, easeOutCubic),
  );
  yield* all(
    heroCubeGroup().scale(1, 0.08, easeInOutCubic),
    heroCubePulseRing().opacity(0, 0.08),
    heroCubePulseRing().size(HERO_SIZE * 2, 0),
  );

  // Beat 6 (0:26) - Second background glow
  yield* all(
    bgGlow2().opacity(0.02, 0.15),
    heroCubeGlowOuter().opacity(0.4, 0.15),
  );

  // Hold on logo box (0:28 - 1:10)
  yield* waitFor(0.35);

  // ========================================
  // PHASE 2: Warehouse Transition (1:11 - 3:10)
  // Duration: ~1.967 seconds
  // ========================================

  // Beat 7 (1:11) - Hero cube shrinks and moves to corner
  yield* all(
    heroCubeGroup().scale(0.35, 0.3, easeInOutCubic),
    heroCubeGroup().x(-380, 0.3, easeInOutCubic),
    heroCubeGroup().y(-200, 0.3, easeInOutCubic),
    heroCubeGlowOuter().opacity(0.15, 0.3),
    heroCubeGlowInner().opacity(0.1, 0.3),
    solanaLogoGlow().opacity(0.3, 0.3),
  );

  // Beat 8 (1:20) - Warehouse container appears
  yield* warehouseContainer().opacity(1, 0.15);

  // Beat 9-12 (1:22 - 2:10) - Grid cubes expand from center (ripple)
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
    0.012,
    ...cubeIndices.map((i) =>
      all(
        gridCubes[i].scale(1, 0.18, easeOutCubic),
        gridCubes[i].opacity(1, 0.15),
        gridCubesShadows[i].opacity(0.25, 0.15),
      )
    )
  );

  // Beat 13 (2:15) - Background intensifies
  yield* all(
    bgGlow1().opacity(0.05, 0.2),
    bgGlow2().opacity(0.04, 0.2),
  );

  // Beat 14 (2:20) - First wave of glows on cubes
  yield* sequence(
    0.008,
    ...cubeIndices.slice(0, 18).map((i) =>
      all(
        gridCubesGlows[i].opacity(0.25, 0.12),
      )
    )
  );

  // Beat 15 (2:26) - Second wave of glows
  yield* sequence(
    0.006,
    ...cubeIndices.slice(18).map((i) =>
      all(
        gridCubesGlows[i].opacity(0.2, 0.1),
      )
    )
  );

  // Beat 16 (2:28) - Ambient particles fade in
  yield* all(
    ...ambientParticles.map((p, i) =>
      delay(
        i * 0.015,
        all(
          p.opacity(0.4, 0.15),
          ambientParticleGlows[i].opacity(0.2, 0.15),
        )
      )
    )
  );

  // Beat 17 (3:00) - Final lightning glow pulse on ALL boxes
  yield* all(
    ...gridCubesGlows.map((glow, i) =>
      delay(
        i * 0.003,
        all(
          glow.opacity(0.6, 0.08, easeOutCubic),
        )
      )
    ),
    bgGlow1().opacity(0.08, 0.15),
  );

  // Beat 18 (3:05) - Glow settles on ALL boxes
  yield* all(
    ...gridCubesGlows.map((glow) =>
      glow.opacity(0.35, 0.1)
    ),
  );

  // Hold final frame (3:08 - 3:10)
  yield* waitFor(0.07);
});
