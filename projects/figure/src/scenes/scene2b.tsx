/**
 * Scene 2B: "Public Equity on Blockchain"
 * Duration: ~2 seconds
 *
 * V4: Simplified - Chart only, centered layout
 * - Removed: blockchain network, floating tokens, globe
 * - Kept: background glows, vignettes, ambient particles, growth chart (centered)
 * - Chart centered at x=0, y=0, scaled up to 1.2
 * - CTA text centered at y=280
 */

import { makeScene2D } from '@revideo/2d';
import { Rect, Node, Circle, Txt, Line, blur } from '@revideo/2d';
import {
  all,
  delay,
  waitFor,
  createRef,
  easeOutCubic,
  easeOutBack,
  linear,
} from '@revideo/core';

import { colors, fonts, fontSizes, fontWeights, timing, layout } from '../lib/brand';

export default makeScene2D('scene2b', function* (view) {
  view.fill(colors.background);

  // Background glows
  const bgGlow = createRef<Circle>();
  const bgGlowSecondary = createRef<Circle>();
  const bgGlowTertiary = createRef<Circle>();
  const bgGlowDeep = createRef<Circle>();

  // Vignettes
  const vignetteTopLeft = createRef<Circle>();
  const vignetteTopRight = createRef<Circle>();
  const vignetteBottomLeft = createRef<Circle>();
  const vignetteBottomRight = createRef<Circle>();

  // Chart (V4: CENTERED, scaled up)
  const chartContainer = createRef<Node>();
  const chartBackground = createRef<Rect>();
  const chartGlow = createRef<Rect>();
  const chartGrid: Array<ReturnType<typeof createRef<Rect>>> = [];
  for (let i = 0; i < 8; i++) {
    chartGrid.push(createRef<Rect>());
  }
  const chartLine = createRef<Line>();
  const chartLineGlow = createRef<Line>();
  const chartDots: Array<ReturnType<typeof createRef<Circle>>> = [];
  for (let i = 0; i < 6; i++) {
    chartDots.push(createRef<Circle>());
  }

  // Ambient particles (kept for atmosphere)
  const ambientParticles: Array<ReturnType<typeof createRef<Circle>>> = [];
  for (let i = 0; i < 30; i++) {
    ambientParticles.push(createRef<Circle>());
  }

  // CTA text (V4: centered at y=280)
  const ctaText = createRef<Txt>();
  const ctaTextGlow = createRef<Txt>();
  const ctaTextGlowOuter = createRef<Txt>();

  // Chart data points (scaled up for centered view)
  const chartPoints = [
    { x: 0, y: 70 },
    { x: 50, y: 45 },
    { x: 100, y: 55 },
    { x: 150, y: 20 },
    { x: 200, y: -15 },
    { x: 250, y: -60 },
  ];

  // Ambient particle positions
  const ambientParticlePositions = Array.from({ length: 30 }, (_, i) => ({
    x: (Math.random() - 0.5) * layout.width * 0.9,
    y: (Math.random() - 0.5) * layout.height * 0.8,
    size: 2 + Math.random() * 3,
    delay: i * 0.02,
  }));

  view.add(
    <>
      {/* Deep background */}
      <Circle
        ref={bgGlowDeep}
        size={2400}
        fill={colors.background}
        opacity={1}
        x={0}
        y={0}
      />

      {/* Vignettes */}
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

      {/* Background glows */}
      <Circle
        ref={bgGlow}
        size={1200}
        fill={colors.primary}
        opacity={0.04}
        x={0}
        y={0}
        filters={[blur(300)]}
      />
      <Circle
        ref={bgGlowSecondary}
        size={800}
        fill={colors.secondary}
        opacity={0.03}
        x={150}
        y={-80}
        filters={[blur(250)]}
      />
      <Circle
        ref={bgGlowTertiary}
        size={600}
        fill={colors.accent}
        opacity={0}
        x={-100}
        y={50}
        filters={[blur(200)]}
      />

      {/* Ambient particles */}
      {ambientParticlePositions.map((pos, i) => (
        <Circle
          ref={ambientParticles[i]}
          key={`ambient-${i}`}
          size={pos.size}
          x={pos.x}
          y={pos.y}
          fill={i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.text}
          opacity={0}
          filters={[blur(1)]}
        />
      ))}

      {/* V4: CENTERED Chart - x=0, y=0, scale=1.6 - larger for better visibility */}
      <Node ref={chartContainer} x={0} y={-40} opacity={0} scale={1.6}>
        {/* Chart glow */}
        <Rect
          ref={chartGlow}
          width={320}
          height={200}
          fill={colors.primary}
          opacity={0}
          radius={16}
          filters={[blur(50)]}
        />

        {/* Chart background */}
        <Rect
          ref={chartBackground}
          width={300}
          height={180}
          fill={colors.background}
          stroke={colors.primary}
          lineWidth={1.5}
          opacity={0}
          radius={12}
        />

        {/* Horizontal grid lines */}
        {Array.from({ length: 4 }, (_, i) => (
          <Rect
            ref={chartGrid[i]}
            key={`grid-h-${i}`}
            width={260}
            height={1}
            fill={colors.primary}
            opacity={0}
            x={0}
            y={-60 + i * 35}
          />
        ))}
        {/* Vertical grid lines */}
        {Array.from({ length: 4 }, (_, i) => (
          <Rect
            ref={chartGrid[4 + i]}
            key={`grid-v-${i}`}
            width={1}
            height={130}
            fill={colors.primary}
            opacity={0}
            x={-100 + i * 65}
            y={-15}
          />
        ))}

        {/* Chart line glow */}
        <Line
          ref={chartLineGlow}
          points={chartPoints.map(p => [p.x - 125, p.y])}
          stroke={colors.accent}
          lineWidth={8}
          opacity={0}
          filters={[blur(12)]}
          end={0}
        />
        {/* Chart line */}
        <Line
          ref={chartLine}
          points={chartPoints.map(p => [p.x - 125, p.y])}
          stroke={colors.accent}
          lineWidth={3}
          opacity={0}
          end={0}
        />

        {/* Chart dots */}
        {chartPoints.map((p, i) => (
          <Circle
            ref={chartDots[i]}
            key={`chart-dot-${i}`}
            size={8}
            x={p.x - 125}
            y={p.y}
            fill={colors.accent}
            opacity={0}
          />
        ))}
      </Node>

      {/* V5: CTA text - font style matched with scene 4 */}
      <Txt
        ref={ctaTextGlowOuter}
        text="Figure Shares On-chain"
        fontFamily={fonts.display}
        fontSize={fontSizes.h2}
        fontWeight={fontWeights.bold}
        fill={colors.primary}
        opacity={0}
        y={210}
        letterSpacing={-1}
        filters={[blur(40)]}
      />
      <Txt
        ref={ctaTextGlow}
        text="Figure Shares On-chain"
        fontFamily={fonts.display}
        fontSize={fontSizes.h2}
        fontWeight={fontWeights.bold}
        fill={colors.primary}
        opacity={0}
        y={210}
        letterSpacing={-1}
        filters={[blur(15)]}
      />
      <Txt
        ref={ctaText}
        text="Figure Shares On-chain"
        fontFamily={fonts.display}
        fontSize={fontSizes.h2}
        fontWeight={fontWeights.bold}
        fill={colors.text}
        opacity={0}
        y={210}
        letterSpacing={-1}
      />
    </>
  );

  // ============================================
  // V4: SIMPLIFIED ANIMATION TIMELINE
  // ============================================

  // Beat 0 - Background setup
  yield* all(
    vignetteTopLeft().opacity(0.28, timing.fast),
    vignetteTopRight().opacity(0.28, timing.fast),
    vignetteBottomLeft().opacity(0.28, timing.fast),
    vignetteBottomRight().opacity(0.28, timing.fast),
    bgGlow().opacity(0.08, timing.fast),
    bgGlowSecondary().opacity(0.05, timing.fast),
  );

  // Beat 1 - Ambient particles
  yield* all(
    ...ambientParticles.map((p, i) =>
      delay(ambientParticlePositions[i].delay * 0.5, p().opacity(0.4, timing.fast))
    ),
  );

  // Beat 2 - Chart container appears
  yield* all(
    chartContainer().opacity(1, timing.entrance),
    chartContainer().scale(1.6, timing.entrance, easeOutCubic),
    chartGlow().opacity(0.2, timing.entrance),
    chartBackground().opacity(0.2, timing.entrance),
  );

  // Beat 3 - Chart grid appears
  yield* all(
    ...chartGrid.map((grid, i) =>
      delay(i * 0.02, grid().opacity(0.15, timing.fast))
    ),
  );

  // Beat 4 - Chart line draws
  yield* all(
    chartLine().opacity(1, timing.fast),
    chartLine().end(1, timing.smooth, easeOutCubic),
    chartLineGlow().opacity(0.35, timing.fast),
    chartLineGlow().end(1, timing.smooth, easeOutCubic),
  );

  // Beat 5 - Chart dots appear
  yield* all(
    ...chartDots.map((dot, i) =>
      delay(i * 0.05, dot().opacity(1, timing.fast, easeOutBack))
    ),
  );

  // Beat 6 - CTA text appears
  yield* all(
    ctaTextGlowOuter().opacity(0.2, timing.fast),
    ctaTextGlow().opacity(0.4, timing.fast),
    ctaText().opacity(1, timing.fast),
    bgGlowTertiary().opacity(0.04, timing.fast),
  );

  // Beat 7 - Chart glow pulse
  yield* all(
    chartLineGlow().opacity(0.55, timing.fast),
    chartGlow().opacity(0.35, timing.fast),
    ...chartDots.map((dot, i) =>
      delay(i * 0.02, dot().size(12, timing.fast))
    ),
  );
  yield* all(
    chartLineGlow().opacity(0.3, timing.fast),
    chartGlow().opacity(0.18, timing.fast),
    ...chartDots.map((dot, i) =>
      delay(i * 0.02, dot().size(8, timing.fast))
    ),
  );

  // Beat 8 - Text glow pulse
  yield* all(
    ctaTextGlow().opacity(0.6, timing.fast),
  );
  yield* all(
    ctaTextGlow().opacity(0.35, timing.fast),
  );

  // Beat 9 - Background intensifies
  yield* all(
    bgGlow().opacity(0.12, timing.fast),
    bgGlowSecondary().opacity(0.07, timing.fast),
    ...ambientParticles.map((p, i) =>
      p().y(ambientParticlePositions[i].y - 10, timing.entrance, linear)
    ),
  );

  // Beat 10 - Final chart pulse
  yield* all(
    chartLineGlow().opacity(0.5, timing.fast),
    chartGlow().opacity(0.3, timing.fast),
  );
  yield* all(
    chartLineGlow().opacity(0.25, timing.fast),
    chartGlow().opacity(0.15, timing.fast),
  );

  // Brief hold
  yield* waitFor(0.2);

  // Fade out
  yield* all(
    chartContainer().opacity(0, timing.fast),
    ctaText().opacity(0, timing.fast),
    ctaTextGlow().opacity(0, timing.fast),
    ctaTextGlowOuter().opacity(0, timing.fast),
    ...ambientParticles.map(p => p().opacity(0, timing.fast)),
    bgGlow().opacity(0.03, timing.fast),
    bgGlowSecondary().opacity(0.02, timing.fast),
    bgGlowTertiary().opacity(0, timing.fast),
    vignetteTopLeft().opacity(0.18, timing.fast),
    vignetteTopRight().opacity(0.18, timing.fast),
    vignetteBottomLeft().opacity(0.18, timing.fast),
    vignetteBottomRight().opacity(0.18, timing.fast),
  );
});
