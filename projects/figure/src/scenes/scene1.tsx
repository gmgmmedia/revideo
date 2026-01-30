/**
 * Scene 1: The Shift
 * Duration: ~2 seconds (V4: faster pacing)
 *
 * Visual: "A new dawn" - sunrise/light breaking through, representing transformation
 * Text: "Public equity, reimagined."
 * Style: Hexagonal grid, light rays, aurora waves, floating particles
 */

import { makeScene2D } from '@revideo/2d';
import { Rect, Node, Circle, Txt, Line, blur } from '@revideo/2d';
import {
  all,
  chain,
  delay,
  sequence,
  waitFor,
  createRef,
  createSignal,
  easeOutCubic,
  easeInOutCubic,
  easeOutQuart,
  easeInOutQuad,
  linear,
} from '@revideo/core';

import { colors, fonts, fontSizes, fontWeights, timing, effects, layout } from '../lib/brand';

export default makeScene2D('scene1', function* (view) {
  // ============================================
  // SCENE SETUP
  // ============================================
  view.fill(colors.background);

  // ============================================
  // REFS - Background Layers
  // ============================================
  const bgGlowPrimary = createRef<Circle>();
  const bgGlowSecondary = createRef<Circle>();
  const bgGlowAccent = createRef<Circle>();
  const bgGlowDeep = createRef<Circle>();

  // Vignette corners
  const vignetteTopLeft = createRef<Circle>();
  const vignetteTopRight = createRef<Circle>();
  const vignetteBottomLeft = createRef<Circle>();
  const vignetteBottomRight = createRef<Circle>();

  // Hexagonal grid refs
  const hexGridContainer = createRef<Node>();
  const hexCells: Array<ReturnType<typeof createRef<Rect>>> = [];
  for (let i = 0; i < 96; i++) {
    hexCells.push(createRef<Rect>());
  }

  // Horizon line
  const horizonLine = createRef<Rect>();
  const horizonGlow = createRef<Rect>();
  const horizonGlowIntense = createRef<Rect>();

  // Light rays (20 rays emanating from center)
  const lightRayContainer = createRef<Node>();
  const lightRays: Array<ReturnType<typeof createRef<Rect>>> = [];
  for (let i = 0; i < 20; i++) {
    lightRays.push(createRef<Rect>());
  }

  // Aurora waves (3 bezier curves)
  const auroraContainer = createRef<Node>();
  const aurora1 = createRef<Rect>();
  const aurora2 = createRef<Rect>();
  const aurora3 = createRef<Rect>();

  // Floating dust particles (16 particles)
  const particleContainer = createRef<Node>();
  const dustParticles: Array<ReturnType<typeof createRef<Circle>>> = [];
  for (let i = 0; i < 16; i++) {
    dustParticles.push(createRef<Circle>());
  }

  // Main text with multi-layer glow system
  const mainText = createRef<Txt>();
  const textGlowShadow = createRef<Txt>();
  const textGlowOuter = createRef<Txt>();
  const textGlowMid = createRef<Txt>();
  const textGlowInner = createRef<Txt>();

  // Light beams (original 3 + 5 additional)
  const lightBeam1 = createRef<Rect>();
  const lightBeam2 = createRef<Rect>();
  const lightBeam3 = createRef<Rect>();
  const lightBeam4 = createRef<Rect>();
  const lightBeam5 = createRef<Rect>();
  const lightBeam6 = createRef<Rect>();
  const lightBeam7 = createRef<Rect>();
  const lightBeam8 = createRef<Rect>();

  // Beam glows
  const beamGlow1 = createRef<Rect>();
  const beamGlow2 = createRef<Rect>();
  const beamGlow3 = createRef<Rect>();

  // ============================================
  // HEXAGONAL GRID PARAMETERS
  // ============================================
  const HEX_COLS = 12;
  const HEX_ROWS = 8;
  const HEX_SIZE = 60;
  const HEX_GAP = 8;
  const HEX_OFFSET_X = -((HEX_COLS - 1) * (HEX_SIZE + HEX_GAP)) / 2;
  const HEX_OFFSET_Y = -((HEX_ROWS - 1) * (HEX_SIZE + HEX_GAP)) / 2;

  // ============================================
  // PARTICLE POSITIONS
  // ============================================
  const particlePositions = [
    { x: -600, y: -300, size: 4, delay: 0 },
    { x: -450, y: -200, size: 3, delay: 0.1 },
    { x: -300, y: -350, size: 5, delay: 0.2 },
    { x: -150, y: -150, size: 3, delay: 0.15 },
    { x: 0, y: -280, size: 4, delay: 0.05 },
    { x: 150, y: -320, size: 3, delay: 0.25 },
    { x: 300, y: -180, size: 5, delay: 0.1 },
    { x: 450, y: -250, size: 4, delay: 0.2 },
    { x: 600, y: -300, size: 3, delay: 0.15 },
    { x: -500, y: 100, size: 4, delay: 0.3 },
    { x: -350, y: 200, size: 3, delay: 0.25 },
    { x: -200, y: 150, size: 5, delay: 0.35 },
    { x: 200, y: 180, size: 4, delay: 0.2 },
    { x: 400, y: 120, size: 3, delay: 0.4 },
    { x: 550, y: 200, size: 5, delay: 0.3 },
    { x: -100, y: 250, size: 4, delay: 0.45 },
  ];

  // ============================================
  // LIGHT RAY PARAMETERS
  // ============================================
  const rayAngles = Array.from({ length: 20 }, (_, i) => -90 + (i - 10) * 9);

  // ============================================
  // BUILD SCENE
  // ============================================
  view.add(
    <>
      {/* ===== LAYER 0: Deep Background Glow ===== */}
      <Circle
        ref={bgGlowDeep}
        size={2000}
        fill={colors.background}
        opacity={1}
        x={0}
        y={0}
      />

      {/* ===== LAYER 1: Corner Vignettes ===== */}
      <Circle
        ref={vignetteTopLeft}
        size={800}
        fill={'#000000'}
        opacity={0}
        x={-layout.width / 2}
        y={-layout.height / 2}
        filters={[blur(200)]}
      />
      <Circle
        ref={vignetteTopRight}
        size={800}
        fill={'#000000'}
        opacity={0}
        x={layout.width / 2}
        y={-layout.height / 2}
        filters={[blur(200)]}
      />
      <Circle
        ref={vignetteBottomLeft}
        size={800}
        fill={'#000000'}
        opacity={0}
        x={-layout.width / 2}
        y={layout.height / 2}
        filters={[blur(200)]}
      />
      <Circle
        ref={vignetteBottomRight}
        size={800}
        fill={'#000000'}
        opacity={0}
        x={layout.width / 2}
        y={layout.height / 2}
        filters={[blur(200)]}
      />

      {/* ===== LAYER 2: Background Glows ===== */}
      <Circle
        ref={bgGlowPrimary}
        size={1200}
        fill={colors.primary}
        opacity={0}
        x={0}
        y={100}
        filters={[blur(300)]}
      />
      <Circle
        ref={bgGlowSecondary}
        size={800}
        fill={colors.secondary}
        opacity={0}
        x={400}
        y={-200}
        filters={[blur(250)]}
      />
      <Circle
        ref={bgGlowAccent}
        size={600}
        fill={colors.accent}
        opacity={0}
        x={-300}
        y={200}
        filters={[blur(200)]}
      />

      {/* ===== LAYER 3: Hexagonal Grid ===== */}
      <Node ref={hexGridContainer} opacity={0}>
        {Array.from({ length: HEX_ROWS }, (_, row) =>
          Array.from({ length: HEX_COLS }, (_, col) => {
            const idx = row * HEX_COLS + col;
            const offsetX = row % 2 === 0 ? 0 : (HEX_SIZE + HEX_GAP) / 2;
            const x = HEX_OFFSET_X + col * (HEX_SIZE + HEX_GAP) + offsetX;
            const y = HEX_OFFSET_Y + row * (HEX_SIZE + HEX_GAP) * 0.866;
            const distFromCenter = Math.sqrt(x * x + y * y);
            const opacity = Math.max(0, 0.15 - distFromCenter / 2000);
            return (
              <Rect
                ref={hexCells[idx]}
                key={`hex-${row}-${col}`}
                width={HEX_SIZE}
                height={HEX_SIZE}
                x={x}
                y={y}
                fill={null}
                stroke={colors.primary}
                lineWidth={1}
                opacity={opacity}
                rotation={30}
                radius={8}
              />
            );
          })
        )}
      </Node>

      {/* ===== LAYER 4: Horizon Line with Glow ===== */}
      <Rect
        ref={horizonGlowIntense}
        width={layout.width + 200}
        height={20}
        fill={colors.primary}
        opacity={0}
        x={0}
        y={120}
        filters={[blur(60)]}
      />
      <Rect
        ref={horizonGlow}
        width={layout.width + 200}
        height={8}
        fill={colors.secondary}
        opacity={0}
        x={0}
        y={120}
        filters={[blur(30)]}
      />
      <Rect
        ref={horizonLine}
        width={0}
        height={2}
        fill={colors.primary}
        opacity={0}
        x={0}
        y={120}
        radius={1}
      />

      {/* ===== LAYER 5: Aurora Waves ===== */}
      <Node ref={auroraContainer} opacity={0}>
        <Rect
          ref={aurora1}
          width={layout.width + 400}
          height={200}
          fill={colors.primary}
          opacity={0.03}
          x={0}
          y={-50}
          rotation={-2}
          filters={[blur(80)]}
        />
        <Rect
          ref={aurora2}
          width={layout.width + 400}
          height={150}
          fill={colors.secondary}
          opacity={0.025}
          x={100}
          y={0}
          rotation={1}
          filters={[blur(60)]}
        />
        <Rect
          ref={aurora3}
          width={layout.width + 400}
          height={180}
          fill={colors.accent}
          opacity={0.02}
          x={-50}
          y={50}
          rotation={-1}
          filters={[blur(70)]}
        />
      </Node>

      {/* ===== LAYER 6: Light Rays (20 rays) ===== */}
      <Node ref={lightRayContainer} y={300} opacity={0}>
        {rayAngles.map((angle, i) => {
          const isCenter = Math.abs(angle + 90) < 30;
          const opacity = isCenter ? 0.4 : 0.2;
          const width = isCenter ? 3 : 2;
          return (
            <Rect
              ref={lightRays[i]}
              key={`ray-${i}`}
              width={width}
              height={0}
              fill={i % 2 === 0 ? colors.primary : colors.secondary}
              opacity={opacity}
              x={0}
              y={0}
              rotation={angle}
              filters={[blur(4)]}
            />
          );
        })}
      </Node>

      {/* ===== LAYER 7: Original Light Beams with Glows ===== */}
      <Rect
        ref={beamGlow1}
        width={20}
        height={0}
        fill={colors.primary}
        opacity={0}
        x={-200}
        y={0}
        rotation={-15}
        filters={[blur(20)]}
      />
      <Rect
        ref={lightBeam1}
        width={3}
        height={0}
        fill={colors.primary}
        opacity={0}
        x={-200}
        y={0}
        rotation={-15}
        filters={[blur(4)]}
      />

      <Rect
        ref={beamGlow2}
        width={25}
        height={0}
        fill={colors.secondary}
        opacity={0}
        x={0}
        y={0}
        rotation={0}
        filters={[blur(25)]}
      />
      <Rect
        ref={lightBeam2}
        width={2}
        height={0}
        fill={colors.secondary}
        opacity={0}
        x={0}
        y={0}
        rotation={0}
        filters={[blur(3)]}
      />

      <Rect
        ref={beamGlow3}
        width={20}
        height={0}
        fill={colors.primary}
        opacity={0}
        x={200}
        y={0}
        rotation={15}
        filters={[blur(20)]}
      />
      <Rect
        ref={lightBeam3}
        width={3}
        height={0}
        fill={colors.primary}
        opacity={0}
        x={200}
        y={0}
        rotation={15}
        filters={[blur(4)]}
      />

      {/* Additional light beams for density */}
      <Rect
        ref={lightBeam4}
        width={2}
        height={0}
        fill={colors.secondary}
        opacity={0}
        x={-400}
        y={0}
        rotation={-25}
        filters={[blur(3)]}
      />
      <Rect
        ref={lightBeam5}
        width={2}
        height={0}
        fill={colors.primary}
        opacity={0}
        x={-100}
        y={0}
        rotation={-8}
        filters={[blur(3)]}
      />
      <Rect
        ref={lightBeam6}
        width={2}
        height={0}
        fill={colors.secondary}
        opacity={0}
        x={100}
        y={0}
        rotation={8}
        filters={[blur(3)]}
      />
      <Rect
        ref={lightBeam7}
        width={2}
        height={0}
        fill={colors.primary}
        opacity={0}
        x={400}
        y={0}
        rotation={25}
        filters={[blur(3)]}
      />
      <Rect
        ref={lightBeam8}
        width={1}
        height={0}
        fill={colors.accent}
        opacity={0}
        x={-50}
        y={0}
        rotation={-3}
        filters={[blur(2)]}
      />

      {/* ===== LAYER 8: Floating Dust Particles ===== */}
      <Node ref={particleContainer} opacity={0}>
        {particlePositions.map((pos, i) => (
          <Circle
            ref={dustParticles[i]}
            key={`particle-${i}`}
            size={pos.size}
            fill={i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.text}
            opacity={0}
            x={pos.x}
            y={pos.y}
            filters={[blur(2)]}
          />
        ))}
      </Node>

      {/* ===== LAYER 9: Main Text with Multi-Layer Glow ===== */}
      <Txt
        ref={textGlowShadow}
        text="Public equity, reimagined."
        fontFamily={fonts.display}
        fontSize={fontSizes.h1}
        fontWeight={fontWeights.bold}
        fill={'#000000'}
        opacity={0}
        y={5}
        x={5}
        letterSpacing={-2}
        filters={[blur(40)]}
      />
      <Txt
        ref={textGlowOuter}
        text="Public equity, reimagined."
        fontFamily={fonts.display}
        fontSize={fontSizes.h1}
        fontWeight={fontWeights.bold}
        fill={colors.primary}
        opacity={0}
        letterSpacing={-2}
        filters={[blur(60)]}
      />
      <Txt
        ref={textGlowMid}
        text="Public equity, reimagined."
        fontFamily={fonts.display}
        fontSize={fontSizes.h1}
        fontWeight={fontWeights.bold}
        fill={colors.secondary}
        opacity={0}
        letterSpacing={-2}
        filters={[blur(30)]}
      />
      <Txt
        ref={textGlowInner}
        text="Public equity, reimagined."
        fontFamily={fonts.display}
        fontSize={fontSizes.h1}
        fontWeight={fontWeights.bold}
        fill={colors.text}
        opacity={0}
        letterSpacing={-2}
        filters={[blur(8)]}
      />
      <Txt
        ref={mainText}
        text="Public equity, reimagined."
        fontFamily={fonts.display}
        fontSize={fontSizes.h1}
        fontWeight={fontWeights.bold}
        fill={colors.text}
        opacity={0}
        letterSpacing={-2}
      />
    </>
  );

  // ============================================
  // ANIMATION TIMELINE - 30+ Beats
  // ============================================

  // ============================================
  // V4: FASTER ANIMATION TIMELINE (~40% faster)
  // ============================================

  // V5: Beat 0 - EVERYTHING starts together: vignettes, background, lines AND text
  yield* all(
    // Vignettes + background
    vignetteTopLeft().opacity(0.3, timing.fast),
    vignetteTopRight().opacity(0.3, timing.fast),
    vignetteBottomLeft().opacity(0.3, timing.fast),
    vignetteBottomRight().opacity(0.3, timing.fast),
    bgGlowPrimary().opacity(0.08, timing.fast),
    bgGlowPrimary().size(1400, timing.entrance, easeOutQuart),
    bgGlowSecondary().opacity(0.05, timing.fast),
    bgGlowAccent().opacity(0.04, timing.fast),
    // Hex grid + aurora
    hexGridContainer().opacity(1, timing.fast),
    auroraContainer().opacity(1, timing.fast),
    aurora1().y(-80, timing.entrance, easeInOutQuad),
    aurora2().y(-30, timing.entrance, easeInOutQuad),
    aurora3().y(20, timing.entrance, easeInOutQuad),
    // Horizon line - REMOVED per V5
    // Light rays
    lightRayContainer().opacity(1, timing.fast),
    ...lightRays.map((ray, i) =>
      delay(i * 0.01, all(
        ray().height(600 + Math.random() * 400, timing.entrance, easeOutCubic),
        ray().y(-300, timing.entrance, easeOutCubic),
      ))
    ),
    // TEXT appears immediately with everything else
    textGlowShadow().opacity(0.3, timing.fast),
    textGlowOuter().opacity(0.4, timing.fast, easeOutCubic),
    textGlowMid().opacity(0.5, timing.fast, easeOutCubic),
    textGlowInner().opacity(0.7, timing.fast, easeOutCubic),
    mainText().opacity(1, timing.fast, easeOutCubic),
  );

  // V5: Beat 1 - Hex cells staggered appearance
  yield* all(
    ...hexCells.slice(0, 32).map((cell, i) =>
      delay(i * 0.005, cell().opacity(0.15, timing.fast))
    ),
  );

  // Beat 2 - All light beams (combined, reduced delays)
  yield* all(
    lightBeam1().opacity(0.4, timing.fast),
    lightBeam1().height(800, timing.entrance, easeOutCubic),
    lightBeam1().y(-50, timing.entrance, easeOutCubic),
    beamGlow1().opacity(0.15, timing.fast),
    beamGlow1().height(800, timing.entrance, easeOutCubic),
    beamGlow1().y(-50, timing.entrance, easeOutCubic),
    delay(0.03, all(
      lightBeam2().opacity(0.5, timing.fast),
      lightBeam2().height(1000, timing.entrance, easeOutCubic),
      beamGlow2().opacity(0.12, timing.fast),
      beamGlow2().height(1000, timing.entrance, easeOutCubic),
    )),
    delay(0.06, all(
      lightBeam3().opacity(0.4, timing.fast),
      lightBeam3().height(800, timing.entrance, easeOutCubic),
      lightBeam3().y(50, timing.entrance, easeOutCubic),
      beamGlow3().opacity(0.15, timing.fast),
      beamGlow3().height(800, timing.entrance, easeOutCubic),
      beamGlow3().y(50, timing.entrance, easeOutCubic),
    )),
    delay(0.02, all(
      lightBeam4().opacity(0.3, timing.fast),
      lightBeam4().height(600, timing.entrance, easeOutCubic),
    )),
    delay(0.04, all(
      lightBeam5().opacity(0.35, timing.fast),
      lightBeam5().height(700, timing.entrance, easeOutCubic),
    )),
    delay(0.05, all(
      lightBeam6().opacity(0.35, timing.fast),
      lightBeam6().height(700, timing.entrance, easeOutCubic),
    )),
    delay(0.07, all(
      lightBeam7().opacity(0.3, timing.fast),
      lightBeam7().height(600, timing.entrance, easeOutCubic),
    )),
    delay(0.08, all(
      lightBeam8().opacity(0.4, timing.fast),
      lightBeam8().height(900, timing.entrance, easeOutCubic),
    )),
  );

  // Beat 3 - Particles appear
  yield* all(
    particleContainer().opacity(1, timing.fast),
    ...dustParticles.map((particle, i) =>
      delay(
        particlePositions[i].delay * 0.5,
        all(
          particle().opacity(0.6, timing.fast),
          particle().y(particlePositions[i].y - 20, timing.entrance, easeOutCubic),
        )
      )
    ),
    bgGlowPrimary().opacity(0.12, timing.fast),
    bgGlowSecondary().opacity(0.07, timing.fast),
  );

  // Beat 6 - Text pulse + aurora movement
  yield* all(
    textGlowOuter().opacity(0.6, timing.microBeat),
    textGlowMid().opacity(0.7, timing.microBeat),
    aurora1().rotation(-4, timing.entrance, easeInOutQuad),
    aurora2().rotation(2, timing.entrance, easeInOutQuad),
    aurora3().rotation(-2, timing.entrance, easeInOutQuad),
  );
  yield* all(
    textGlowOuter().opacity(0.35, timing.fast),
    textGlowMid().opacity(0.45, timing.fast),
  );

  // Beat 7 - Final glow pulse
  yield* all(
    textGlowOuter().opacity(0.5, timing.fast),
    textGlowMid().opacity(0.6, timing.fast),
    textGlowInner().opacity(0.8, timing.fast),
    ...dustParticles.map((particle, i) =>
      particle().y(particlePositions[i].y - 35, timing.entrance, linear)
    ),
  );
  yield* all(
    textGlowOuter().opacity(0.3, timing.fast),
    textGlowMid().opacity(0.4, timing.fast),
    textGlowInner().opacity(0.6, timing.fast),
  );

  // Brief hold before transition
  yield* waitFor(0.2);

  // Fade out for transition (faster)
  yield* all(
    mainText().opacity(0, timing.fast),
    textGlowShadow().opacity(0, timing.fast),
    textGlowOuter().opacity(0, timing.fast),
    textGlowMid().opacity(0, timing.fast),
    textGlowInner().opacity(0, timing.fast),
    lightBeam1().opacity(0, timing.fast),
    lightBeam2().opacity(0, timing.fast),
    lightBeam3().opacity(0, timing.fast),
    lightBeam4().opacity(0, timing.fast),
    lightBeam5().opacity(0, timing.fast),
    lightBeam6().opacity(0, timing.fast),
    lightBeam7().opacity(0, timing.fast),
    lightBeam8().opacity(0, timing.fast),
    beamGlow1().opacity(0, timing.fast),
    beamGlow2().opacity(0, timing.fast),
    beamGlow3().opacity(0, timing.fast),
    lightRayContainer().opacity(0, timing.fast),
    // Horizon line fade out - REMOVED per V5
    auroraContainer().opacity(0, timing.fast),
    hexGridContainer().opacity(0, timing.fast),
    particleContainer().opacity(0, timing.fast),
    bgGlowPrimary().opacity(0.05, timing.fast),
    bgGlowSecondary().opacity(0.03, timing.fast),
    bgGlowAccent().opacity(0.02, timing.fast),
    vignetteTopLeft().opacity(0.15, timing.fast),
    vignetteTopRight().opacity(0.15, timing.fast),
    vignetteBottomLeft().opacity(0.15, timing.fast),
    vignetteBottomRight().opacity(0.15, timing.fast),
  );
});
