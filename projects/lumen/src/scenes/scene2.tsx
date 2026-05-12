/**
 * Lumen — Scene 2: "Pattern recognition without panic."
 *
 * Duration: ~4 seconds
 *
 * Patterns demonstrated:
 *   - Matched-cut entry (reads wordmark transform from shared state)
 *   - Wrapper-Layout virtual camera with focus pulls
 *   - Hierarchy timing (wordmark → cards cascade → glyphs)
 *   - Wave-stagger entrance for the three cards
 *   - Secondary motion (glow lags card; data line lags glyph)
 *   - Mask-wipe between sections (when camera shifts focus)
 *   - Easing diversity (easeInOutCubic, easeOutCubic, easeOutQuart, easeOutQuint)
 *   - Matched-cut writeback for scene 3
 */

import {
  makeScene2D,
  Rect, Node, Circle, Layout, Txt, Path, Line,
  blur,
} from '@revideo/2d';
import {
  all, delay, sequence, waitFor,
  createRef, createRefArray, createSignal,
  easeInOutCubic, easeOutCubic, easeOutQuart, easeOutQuint, linear,
  ThreadGenerator,
} from '@revideo/core';
import {
  colors, fonts, fontSizes, fontWeights,
  timing, effects, layout,
  staggerWave,
} from '../lib/brand';
import { getMatchedCut, setMatchedCut } from '../lib/sharedState';

interface CardSpec {
  metric: string;
  label: string;
  delta: string;
  trendUp: boolean;
}

const CARD_DATA: CardSpec[] = [
  { metric: '+12%',  label: 'Sleep depth',       delta: 'vs last 14d', trendUp: true },
  { metric: '–8 bpm',label: 'Resting heart rate',delta: 'evening avg', trendUp: false },
  { metric: '94%',   label: 'Recovery confidence',delta: 'today',       trendUp: true },
];

export default makeScene2D('scene2', function* (view) {
  // ─── Matched-cut entry — read wordmark closing transform from scene 1
  const entry = getMatchedCut('wordmark');
  const entryY = entry?.position[1] ?? 260;

  // ─── Refs ──────────────────────────────────────────────────────────────
  const world = createRef<Layout>();
  const bgWorld = createRef<Layout>();
  const bgWash = createRef<Rect>();
  const bgGlow = createRef<Circle>();
  const gridLines = createRefArray<Line>();

  const wordmarkGroup = createRef<Node>();
  const wordmark = createRef<Txt>();
  const wordmarkUnderline = createRef<Rect>();

  const sectionTitle = createRef<Txt>();
  const sectionTitleMask = createRef<Rect>();
  const sectionTitleHolder = createRef<Node>();

  const cards = createRefArray<Rect>();
  const cardMetrics = createRefArray<Txt>();
  const cardLabels = createRefArray<Txt>();
  const cardDeltas = createRefArray<Txt>();
  const cardGlows = createRefArray<Circle>();
  const cardSparklines = createRefArray<Path>();
  const cardTrendDots = createRefArray<Circle>();

  // ─── Scene Graph ────────────────────────────────────────────────────────
  view.add(
    <Layout ref={world} size={[layout.width, layout.height]}>

      {/* Background — same cream wash continuing from scene 1 (continuity) */}
      <Layout ref={bgWorld} size={[layout.width, layout.height]}>
        <Rect
          ref={bgWash}
          size={[layout.width, layout.height]}
          fill={colors.bgLight}
        />

        <Circle
          ref={bgGlow}
          size={1600}
          x={220}
          y={140}
          fill={colors.accent}
          opacity={0.55}
          filters={[blur(220)]}
        />

        {/* Soft grid hairlines — appear under cards for editorial structure */}
        {Array.from({ length: 9 }).map((_, i) => {
          const x = -800 + i * 200;
          return (
            <Line
              key={`gridV-${i}`}
              ref={gridLines}
              points={[[x, -440], [x, 440]]}
              stroke={colors.softNeutral}
              lineWidth={1}
              opacity={0}
            />
          );
        })}
      </Layout>

      {/* Wordmark — enters at matched position from scene 1, then moves up + shrinks */}
      <Node ref={wordmarkGroup} y={entryY}>
        <Txt
          ref={wordmark}
          text={'Lumen'}
          fontFamily={fonts.heading}
          fontSize={fontSizes.hero}
          fontWeight={fontWeights.heading}
          fill={colors.primary}
          letterSpacing={-2}
        />
        <Rect
          ref={wordmarkUnderline}
          size={[320, 1]}
          y={65}
          fill={colors.softNeutral}
          opacity={1}
        />
      </Node>

      {/* Section title — mask-wipes in after wordmark settles */}
      <Node ref={sectionTitleHolder} y={-180} cache>
        <Txt
          ref={sectionTitle}
          text={'Pattern recognition without panic.'}
          fontFamily={fonts.heading}
          fontSize={fontSizes.h2}
          fontWeight={fontWeights.heading}
          fill={colors.primary}
          letterSpacing={-0.8}
          opacity={1}
        />
        <Rect
          ref={sectionTitleMask}
          size={[0, 100]}
          x={-720}
          offsetX={-1}
          fill={colors.primary}
          compositeOperation={'destination-in'}
        />
      </Node>

      {/* Three insight cards — cascade in via wave stagger */}
      {CARD_DATA.map((card, i) => {
        const xOffset = (i - 1) * 460;
        return (
          <Node key={`card-${i}`} x={xOffset} y={120}>
            {/* Soft glow behind card — follows scale with delay */}
            <Circle
              ref={cardGlows}
              size={460}
              fill={colors.accent}
              opacity={0}
              filters={[blur(80)]}
            />

            {/* Card surface */}
            <Rect
              ref={cards}
              size={[380, 280]}
              fill={colors.bgWhite}
              radius={effects.cardRadius}
              opacity={0}
              y={40}
              shadowColor={colors.shadow}
              shadowBlur={effects.shadowBlur}
              shadowOffsetY={20}
            />

            {/* Big metric number */}
            <Txt
              ref={cardMetrics}
              text={card.metric}
              fontFamily={fonts.heading}
              fontSize={64}
              fontWeight={500}
              fill={colors.primary}
              letterSpacing={-1.5}
              y={-30}
              opacity={0}
            />

            {/* Label */}
            <Txt
              ref={cardLabels}
              text={card.label}
              fontFamily={fonts.body}
              fontSize={20}
              fontWeight={fontWeights.body}
              fill={colors.primary}
              y={40}
              opacity={0}
            />

            {/* Delta text */}
            <Txt
              ref={cardDeltas}
              text={card.delta}
              fontFamily={fonts.accent}
              fontSize={fontSizes.label}
              fontWeight={fontWeights.accent}
              fill={colors.secondary}
              letterSpacing={2}
              y={72}
              opacity={0}
            />

            {/* Tiny sparkline */}
            <Path
              ref={cardSparklines}
              data={
                card.trendUp
                  ? 'M -100,30 L -50,10 L 0,20 L 50,-10 L 100,-22'
                  : 'M -100,-20 L -50,0 L 0,-15 L 50,15 L 100,28'
              }
              stroke={card.trendUp ? colors.secondary : colors.accent}
              lineWidth={2}
              end={0}
              y={108}
            />

            {/* Trend indicator dot */}
            <Circle
              ref={cardTrendDots}
              size={8}
              x={104}
              y={card.trendUp ? 86 : 136}
              fill={card.trendUp ? colors.secondary : colors.accent}
              opacity={0}
            />
          </Node>
        );
      })}
    </Layout>,
  );

  // ─── Beat 0 (00:00 – 00:45) — Matched cut settles
  // Wordmark moves up + shrinks to make room for content
  yield* all(
    wordmarkGroup().y(-360, 0.55, easeInOutCubic),
    wordmarkGroup().scale(0.55, 0.55, easeInOutCubic),
    wordmarkUnderline().opacity(0.4, 0.4, linear),
    bgGlow().opacity(0.65, 0.5, easeOutCubic),
  );

  // ─── Beat 1 (00:45 – 01:10) — Soft grid lines appear, section title mask-wipes in
  yield* all(
    sequence(0.04, ...gridLines.map((g) => g.opacity(0.3, 0.35, easeOutCubic))),
    delay(0.15, sectionTitleMask().size([1440, 100], 0.55, easeInOutCubic)),
  );

  // ─── Beat 2 (01:10 – 02:00) — Cards cascade in (wave stagger)
  // Wave stagger gives an organic, breathing reveal — middle items arrive quickest.
  yield* all(
    ...staggerWave(
      cards.map((card, i) =>
        all(
          card.opacity(1, 0.45, easeOutCubic),
          card.y(0, 0.5, easeOutQuint),
          delay(0.08, cardGlows[i].opacity(0.5, 0.4, easeOutCubic) as ThreadGenerator),
        ) as ThreadGenerator,
      ),
      0.5,
    ),
  );

  // ─── Beat 2.5 — Card contents arrive with hierarchy (metric → label → delta)
  yield* all(
    sequence(0.06, ...cardMetrics.map((m) => m.opacity(1, 0.3, easeOutCubic))),
    delay(0.08, sequence(0.06, ...cardLabels.map((l) => l.opacity(0.9, 0.25, easeOutCubic)))),
    delay(0.16, sequence(0.06, ...cardDeltas.map((d) => d.opacity(0.75, 0.25, easeOutCubic)))),
  );

  // Sparklines draw in (linear easing for mechanical precision)
  yield* sequence(
    0.06,
    ...cardSparklines.map((s) => s.end(1, 0.5, linear)),
  );

  // Trend dots pop with secondary-motion lag
  yield* sequence(
    0.06,
    ...cardTrendDots.map((d) => d.opacity(1, 0.2, easeOutQuart)),
  );

  // ─── Beat 3 (02:00 – 02:80) — Focus pull onto middle card during VO emphasis on "panic"
  // Camera pushes in on the middle card. Wrapper-Layout pattern from Section 23.
  yield* all(
    world().scale(1.5, 0.85, easeInOutCubic),
    world().position([0, -40], 0.85, easeInOutCubic),
    bgWorld().scale(1.18, 0.85, easeInOutCubic),  // slower parallax (depth)
  );

  yield* waitFor(0.35);  // generous hold (calm pacing)

  // ─── Beat 4 (02:80 – 03:40) — Camera pulls back to reveal all three cards
  yield* all(
    world().scale(1, 0.7, easeInOutCubic),
    world().position(0, 0.7, easeInOutCubic),
    bgWorld().scale(1, 0.7, easeInOutCubic),
  );

  // ─── Beat 5 (03:40 – 04:00) — Final hold + matched-cut writeback for scene 3
  yield* waitFor(0.4);

  setMatchedCut({
    anchor: 'wordmark',
    position: [wordmarkGroup().position().x, wordmarkGroup().position().y],
    scale: wordmarkGroup().scale().x,
    rotation: 0,
  });

  yield* waitFor(0.2);
});
