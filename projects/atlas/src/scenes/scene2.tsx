/**
 * Atlas — Scene 2: "Pace consistency improved."
 *
 * Duration: ~4.2 seconds
 *
 * Patterns demonstrated:
 *   - Matched-cut entry (reads metric closing transform from scene 1)
 *   - Wrapper-Layout virtual camera with push-in on hero card
 *   - Asymmetric staging (3 cards positioned via asymmetricPosition — NOT centered)
 *   - Multi-layer glow stack on each card (3 layers via multiLayerGlow helper)
 *   - Rim light TR (signal orange, off-frame) via rimLight pattern
 *   - Wave-stagger cascade (middle card first per motion_design pace)
 *   - Secondary motion (glow lags card; sparkline draws after metric)
 *   - Mask-wipe for hero section title (compositeOperation destination-in)
 *   - Count-up animation on metric values (countUpMetric helper)
 *   - emphasisPulse on hero during VO "improved"
 *   - Easing diversity (easeOutExpo, easeOutQuart, easeOutBack, easeInOutCubic, linear, easeOutQuint)
 *   - Matched-cut writeback for scene 3
 *
 * Cards (asymmetric, NOT centered):
 *   - Card 1 (centerLeft): "4:21/km avg" — ascending sparkline
 *   - Card 2 (HERO, slight top-middle): "92% pace consistency" — emphasis
 *   - Card 3 (centerRight): "+18% vs last month" — green delta
 */

import {
  makeScene2D,
  Rect, Node, Circle, Layout, Txt, Line,
  blur,
} from '@revideo/2d';
import {
  all, delay, sequence, waitFor,
  createRef, createRefArray, createSignal,
  spring,
  easeOutExpo, easeOutQuart, easeOutBack, easeInOutCubic,
  easeOutCubic, easeOutQuint, linear,
  ThreadGenerator,
} from '@revideo/core';
import {
  colors, dataColors, fonts, fontSizes, fontWeights, opticalTracking,
  timing, effects, layout, composition,
  UISpring, PunchSpring,
  staggerWave,
} from '../lib/brand';
import {
  charStagger, multiLayerGlow, countUpMetric, emphasisPulse,
  rimLight, asymmetricPosition, computeStagger, cinematicFade,
  breathHold,
} from '../lib/motion-helpers';
import {getMatchedCut, setMatchedCut} from '../lib/sharedState';

// Try to load SFX manifest — fallback to silent scene if missing
let beatGrid: Array<{time: number; layer: string; category: string; duration: number}> = [];
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const sfxManifest = require('../../sfx-manifest.json');
  beatGrid = (sfxManifest?.scenes?.scene2 ?? []).map((e: any) => ({
    time: e.start_offset_seconds ?? e.beat_offset ?? 0,
    layer: e.layer ?? 'foreground',
    category: e.category ?? 'ui',
    duration: e.duration_seconds ?? e.duration ?? 0.3,
  }));
} catch {
  beatGrid = [];  // SFX manifest not present — silent scene.
}

interface CardSpec {
  zone: 'centerLeft' | 'topMiddle' | 'centerRight';
  yOffset: number;
  width: number;
  height: number;
  metricInitial: string;
  metricTarget: number;
  metricFormatter: (v: number) => string;
  label: string;
  delta: string;
  isHero: boolean;
  trendUp: boolean;
  accent: string;
  sparklinePoints: Array<[number, number]>;
}

// Three cards — asymmetric, NOT centered. Card 2 is the HERO (slightly larger).
// All cards live in the lower half so they don't collide with the section header at y=-400.
const CARD_DATA: CardSpec[] = [
  {
    zone: 'centerLeft',
    yOffset: 170,   // pushed below center
    width: 420,
    height: 340,
    metricInitial: '0:00',
    metricTarget: 261,  // 4:21 in seconds
    metricFormatter: (v) => {
      const m = Math.floor(v / 60);
      const s = Math.floor(v % 60);
      return `${m}:${s.toString().padStart(2, '0')}`;
    },
    label: '/ KM  AVG  PACE',
    delta: 'ROLLING  30D',
    isHero: false,
    trendUp: true,
    accent: colors.white,
    sparklinePoints: [
      [-150, 40], [-100, 25], [-50, 35], [0, 10], [50, 15], [100, -10], [150, -25],
    ],
  },
  {
    zone: 'topMiddle',  // anchor point at (0, -360); yOffset lifts hero slightly above
    yOffset: 460,   // anchor=-360, +460 = 100 (hero center sits just below frame center)
    width: 540,
    height: 440,
    metricInitial: '0',
    metricTarget: 92,
    metricFormatter: (v) => `${Math.round(v)}%`,
    label: 'PACE  CONSISTENCY',
    delta: 'HERO  METRIC',
    isHero: true,
    trendUp: true,
    accent: colors.accent,
    sparklinePoints: [
      [-200, 30], [-150, 28], [-100, 22], [-50, 18], [0, 12], [50, 5], [100, -8], [150, -18], [200, -32],
    ],
  },
  {
    zone: 'centerRight',
    yOffset: 170,
    width: 420,
    height: 340,
    metricInitial: '0',
    metricTarget: 18,
    metricFormatter: (v) => `+${Math.round(v)}%`,
    label: 'VS  LAST  MONTH',
    delta: 'TREND  POSITIVE',
    isHero: false,
    trendUp: true,
    accent: colors.secondary,
    sparklinePoints: [
      [-150, 30], [-100, 18], [-50, 22], [0, 0], [50, -10], [100, -22], [150, -38],
    ],
  },
];

// Convert sparkline points array to SVG path string
function sparklinePath(points: Array<[number, number]>): string {
  if (points.length === 0) return '';
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]},${p[1]}`)
    .join(' ');
}

export default makeScene2D('scene2', function* (view) {
  // ─── Matched-cut entry — read metric transform from scene 1
  const entry = getMatchedCut('metric');
  const entryScale = entry?.scale ?? 1;

  // ─── Refs ──────────────────────────────────────────────────────────────
  const world = createRef<Layout>();
  const bgWorld = createRef<Layout>();
  const bgFill = createRef<Rect>();

  // Rim light stack (TR off-frame, signal orange)
  const rimOuter = createRef<Circle>();
  const rimMid = createRef<Circle>();
  const rimInner = createRef<Circle>();

  // Grid hairlines
  const gridLinesV = createRefArray<Line>();
  const gridLinesH = createRefArray<Line>();

  // Section header
  const sectionHeader = createRef<Node>();
  const sectionHeaderTitle = createRef<Txt>();
  const sectionHeaderMask = createRef<Rect>();
  const sectionHeaderEyebrow = createRef<Txt>();
  const sectionHeaderUnderline = createRef<Rect>();

  // Per-card refs
  const cardNodes = createRefArray<Node>();
  const cardRects = createRefArray<Rect>();
  const cardMetrics = createRefArray<Txt>();
  const cardLabels = createRefArray<Txt>();
  const cardDeltas = createRefArray<Txt>();
  const cardSparklines = createRefArray<Line>();
  const cardTrendDots = createRefArray<Circle>();
  const cardAccentBars = createRefArray<Rect>();

  // Three-layer glow per card (9 refs total)
  const glowInners = createRefArray<Circle>();
  const glowMids = createRefArray<Circle>();
  const glowOuters = createRefArray<Circle>();

  // Card-scale signals (springs drive these on entrance)
  const cardScales = CARD_DATA.map(() => createSignal<number>(0));

  // Camera signals
  const cameraScale = createSignal<number>(1);
  const cameraOffset = createSignal<[number, number]>([0, 0]);

  // ─── Scene Graph ────────────────────────────────────────────────────────
  view.add(
    <Layout
      ref={world}
      size={[layout.width, layout.height]}
      scale={() => cameraScale()}
      position={() => cameraOffset()}
    >

      {/* Background layer — parallax slower than world */}
      <Layout ref={bgWorld} size={[layout.width, layout.height]} scale={1}>

        <Rect
          ref={bgFill}
          size={[layout.width, layout.height]}
          fill={colors.primary}
        />

        {/* Rim-light stack (TR off-frame, signal orange) */}
        <Circle
          ref={rimOuter}
          size={1400}
          x={composition.thirdsTR[0] + 220}
          y={composition.thirdsTR[1] - 80}
          fill={colors.accent}
          opacity={0.32}
          filters={[blur(160) as any]}
        />
        <Circle
          ref={rimMid}
          size={760}
          x={composition.thirdsTR[0] + 100}
          y={composition.thirdsTR[1] - 40}
          fill={colors.accent}
          opacity={0.45}
          filters={[blur(90) as any]}
        />
        <Circle
          ref={rimInner}
          size={300}
          x={composition.thirdsTR[0] + 40}
          fill={colors.accent}
          opacity={0.55}
          filters={[blur(30) as any]}
        />

        {/* Grid hairlines */}
        {Array.from({length: 11}).map((_, i) => {
          const x = -layout.width / 2 + (i + 1) * (layout.width / 12);
          const isThird = i === 3 || i === 7;
          return (
            <Line
              key={`gridV-${i}`}
              ref={gridLinesV}
              points={[[x, -layout.height / 2], [x, layout.height / 2]]}
              stroke={colors.gridLine}
              lineWidth={isThird ? 1.5 : 1}
              opacity={0}
            />
          );
        })}

        {Array.from({length: 6}).map((_, i) => {
          const y = -layout.height / 2 + (i + 1) * (layout.height / 7);
          const isThird = i === 1 || i === 4;
          return (
            <Line
              key={`gridH-${i}`}
              ref={gridLinesH}
              points={[[-layout.width / 2, y], [layout.width / 2, y]]}
              stroke={colors.gridLine}
              lineWidth={isThird ? 1.5 : 1}
              opacity={0}
            />
          );
        })}
      </Layout>

      {/* Section header (top) — eyebrow + title + underline */}
      <Node ref={sectionHeader} y={-layout.height / 2 + 140}>
        <Txt
          ref={sectionHeaderEyebrow}
          text={'/  TRAINING  REPORT  /  WEEK  18'}
          fontFamily={fonts.accent}
          fontSize={fontSizes.label}
          fontWeight={fontWeights.accent as any}
          fill={colors.accent}
          letterSpacing={opticalTracking.labelUppercase as any}
          y={-42}
          opacity={0}
        />
        <Node cache y={0}>
          <Txt
            ref={sectionHeaderTitle}
            text={'Pace consistency improved.'}
            fontFamily={fonts.heading}
            fontSize={fontSizes.h2}
            fontWeight={fontWeights.heading as any}
            fill={colors.white}
            letterSpacing={opticalTracking.h2 as any}
          />
          <Rect
            ref={sectionHeaderMask}
            size={[0, 100]}
            x={-720}
            offsetX={-1}
            fill={colors.white}
            compositeOperation={'destination-in'}
          />
        </Node>
        <Rect
          ref={sectionHeaderUnderline}
          size={[0, 2]}
          y={56}
          fill={colors.accent}
          opacity={0}
        />
      </Node>

      {/* Three cards — positioned asymmetrically via asymmetricPosition */}
      {CARD_DATA.map((card, i) => {
        const [zx, zy] = asymmetricPosition(card.zone);
        const x = zx;
        const y = zy + card.yOffset;
        const baseFill = card.isHero ? colors.bgDark : colors.bgDark;
        const accent = card.accent;
        return (
          <Node
            key={`card-${i}`}
            ref={cardNodes}
            x={x}
            y={y}
            scale={() => cardScales[i]()}
          >
            {/* 3-layer glow stack BEHIND card (outer → mid → inner) */}
            <Circle
              ref={glowOuters}
              size={card.width * 1.5}
              fill={accent}
              opacity={0}
              filters={[blur(140) as any]}
            />
            <Circle
              ref={glowMids}
              size={card.width * 1.05}
              fill={accent}
              opacity={0}
              filters={[blur(70) as any]}
            />
            <Circle
              ref={glowInners}
              size={card.width * 0.8}
              fill={accent}
              opacity={0}
              filters={[blur(28) as any]}
            />

            {/* Card body */}
            <Rect
              ref={cardRects}
              size={[card.width, card.height]}
              fill={baseFill}
              radius={effects.cardRadius}
              opacity={0}
              stroke={accent}
              lineWidth={card.isHero ? 2 : 1.5}
              shadowColor={colors.shadow}
              shadowBlur={effects.shadowBlur}
              shadowOffsetY={28}
            />

            {/* Top-left accent bar (track-stripe motif) */}
            <Rect
              ref={cardAccentBars}
              size={[0, 4]}
              x={-card.width / 2 + 32}
              y={-card.height / 2 + 36}
              offsetX={-1}
              fill={accent}
              opacity={0}
            />

            {/* Eyebrow delta text at top */}
            <Txt
              ref={cardDeltas}
              text={card.delta}
              fontFamily={fonts.accent}
              fontSize={fontSizes.label}
              fontWeight={fontWeights.accent as any}
              fill={colors.softGrey}
              letterSpacing={opticalTracking.labelUppercase as any}
              x={-card.width / 2 + 32}
              y={-card.height / 2 + 60}
              offsetX={-1}
              opacity={0}
            />

            {/* Big metric */}
            <Txt
              ref={cardMetrics}
              text={card.metricInitial}
              fontFamily={fonts.mono}
              fontSize={card.isHero ? 130 : 96}
              fontWeight={fontWeights.display as any}
              fill={accent}
              letterSpacing={opticalTracking.h1 as any}
              x={-card.width / 2 + 32}
              y={-card.height / 2 + (card.isHero ? 180 : 140)}
              offsetX={-1}
              opacity={0}
            />

            {/* Label below metric */}
            <Txt
              ref={cardLabels}
              text={card.label}
              fontFamily={fonts.accent}
              fontSize={fontSizes.label + 2}
              fontWeight={fontWeights.accent as any}
              fill={colors.white}
              letterSpacing={opticalTracking.labelUppercase as any}
              x={-card.width / 2 + 32}
              y={-card.height / 2 + (card.isHero ? 260 : 200)}
              offsetX={-1}
              opacity={0}
            />

            {/* Sparkline at the bottom of the card */}
            <Line
              ref={cardSparklines}
              points={card.sparklinePoints}
              stroke={accent}
              lineWidth={effects.sparklineWidth}
              y={card.height / 2 - 60}
              start={0}
              end={0}
            />

            {/* Trend dot at end of sparkline */}
            <Circle
              ref={cardTrendDots}
              size={card.isHero ? 14 : 10}
              x={card.sparklinePoints[card.sparklinePoints.length - 1][0]}
              y={card.height / 2 - 60 + card.sparklinePoints[card.sparklinePoints.length - 1][1]}
              fill={accent}
              opacity={0}
            />
          </Node>
        );
      })}
    </Layout>,
  );

  // ─── Beat 0 (00:00 – 00:30) — Grid + section header arrive
  // Wipe-in entrance: matches matched-cut character from scene 1
  yield* all(
    // Grid lines settle in fast (high-energy pace)
    sequence(
      0.025,
      ...gridLinesV.map(g => g.opacity(0.65, 0.26, easeOutQuart)),
    ),
    delay(0.08, sequence(
      0.03,
      ...gridLinesH.map(g => g.opacity(0.5, 0.24, easeOutQuart)),
    )),

    // Section header eyebrow
    delay(0.05, sectionHeaderEyebrow().opacity(0.85, 0.24, easeOutExpo) as ThreadGenerator),

    // Section header title — mask wipes in
    delay(0.1, sectionHeaderMask().size([1440, 100], 0.42, easeOutExpo) as ThreadGenerator),

    // Underline draws across after title
    delay(0.32, all(
      sectionHeaderUnderline().size([520, 2], 0.34, easeOutExpo) as ThreadGenerator,
      sectionHeaderUnderline().opacity(1, 0.18, linear) as ThreadGenerator,
    ) as ThreadGenerator),
  );

  // ─── Beat 1 (00:30 – 01:20) — Cards cascade in (WAVE stagger — middle first)
  // Hero (index 1) arrives first per wave; outer cards (0, 2) follow.
  const cardOrder = [1, 0, 2];  // Hero center first → left → right
  yield* all(
    ...cardOrder.map((idx, orderIdx) => {
      const cardDelay = orderIdx * 0.12;
      const card = CARD_DATA[idx];
      const sparkline = cardSparklines[idx];
      return delay(cardDelay, all(
        // Spring scale entrance — hero gets PunchSpring (more snap)
        spring(
          card.isHero ? PunchSpring : UISpring,
          0,
          1,
          0.01,
          (v) => cardScales[idx](v),
        ) as ThreadGenerator,

        // Card body fades + glow ramps up
        delay(0.04, cardRects[idx].opacity(1, 0.28, easeOutExpo) as ThreadGenerator),

        // Multi-layer glow stack (3 layers via helper)
        delay(0.04, multiLayerGlow(
          [glowInners[idx] as any, glowMids[idx] as any, glowOuters[idx] as any],
          0.42,
          card.isHero ? [0.22, 0.12, 0.06] : [0.16, 0.09, 0.05],
          [0, 0.05, 0.1],
        ) as ThreadGenerator),

        // Accent bar slams left → right (track-stripe motif)
        delay(0.18, all(
          cardAccentBars[idx].size([card.width - 64, 4], 0.34, easeOutExpo) as ThreadGenerator,
          cardAccentBars[idx].opacity(1, 0.16, linear) as ThreadGenerator,
        ) as ThreadGenerator),

        // Eyebrow delta text
        delay(0.22, cardDeltas[idx].opacity(0.75, 0.22, easeOutCubic) as ThreadGenerator),

        // Sparkline draws
        delay(0.32, sparkline.end(1, 0.5, easeOutQuart) as ThreadGenerator),

        // Trend dot pops at end of sparkline
        delay(0.78, cardTrendDots[idx].opacity(1, 0.18, easeOutBack) as ThreadGenerator),
      ) as ThreadGenerator);
    }),
  );

  // ─── Beat 2 (01:20 – 02:10) — Metrics count-up in parallel + labels arrive
  yield* all(
    // Card 0 count-up (4:21/km — pace format)
    countUpMetric(
      cardMetrics[0],
      CARD_DATA[0].metricTarget,
      0.7,
      CARD_DATA[0].metricFormatter,
      easeOutQuint,
    ) as ThreadGenerator,

    // Card 1 count-up (92%)
    countUpMetric(
      cardMetrics[1],
      CARD_DATA[1].metricTarget,
      0.85,
      CARD_DATA[1].metricFormatter,
      easeOutExpo,
    ) as ThreadGenerator,

    // Card 2 count-up (+18%)
    countUpMetric(
      cardMetrics[2],
      CARD_DATA[2].metricTarget,
      0.65,
      CARD_DATA[2].metricFormatter,
      easeOutQuint,
    ) as ThreadGenerator,

    // Metric opacities arrive with hierarchy stagger
    sequence(
      0.04,
      ...cardMetrics.map(m => m.opacity(1, 0.18, easeOutExpo)),
    ),

    // Labels appear with cascade stagger
    delay(0.18, sequence(
      0.05,
      ...cardLabels.map(l => l.opacity(0.9, 0.2, easeOutCubic)),
    )),
  );

  // ─── Beat 3 (02:10 – 02:80) — Focus pull onto HERO card during VO "improved"
  // Camera pushes in toward the hero's position. Hero center is at (0, 100).
  yield* all(
    cameraScale(1.28, 0.42, easeInOutCubic) as ThreadGenerator,
    cameraOffset([0, -50], 0.42, easeInOutCubic) as ThreadGenerator,
    bgWorld().scale(1.12, 0.42, easeInOutCubic) as ThreadGenerator,
    bgWorld().filters([blur(8) as any] as any, 0.42, easeInOutCubic) as ThreadGenerator,

    // Hero emphasis pulse — scale + color flash on the metric text
    delay(0.18, emphasisPulse(cardMetrics[1], 'color', colors.white, 1) as ThreadGenerator),

    // Hero glow flares
    delay(0.16, glowInners[1].opacity(0.42, 0.22, easeOutExpo) as ThreadGenerator),
    delay(0.16, glowMids[1].opacity(0.28, 0.22, easeOutExpo) as ThreadGenerator),
  );

  // ─── Beat 4 (02:80 – 03:10) — Hero scale-pulse
  yield* emphasisPulse(cardNodes[1] as any, 'scale', colors.accent, 0.6) as ThreadGenerator;

  // ─── Beat 5 (03:10 – 03:70) — Pull back to reveal all three cards
  yield* all(
    cameraScale(1, 0.42, easeOutExpo) as ThreadGenerator,
    cameraOffset([0, 0], 0.42, easeOutExpo) as ThreadGenerator,
    bgWorld().scale(1, 0.42, easeOutExpo) as ThreadGenerator,
    bgWorld().filters([blur(0) as any] as any, 0.42, easeOutCubic) as ThreadGenerator,

    // Hero glows settle back
    glowInners[1].opacity(0.22, 0.32, easeOutCubic) as ThreadGenerator,
    glowMids[1].opacity(0.12, 0.32, easeOutCubic) as ThreadGenerator,
  );

  // ─── Beat 6 (03:70 – 04:00) — Brief hold (Atlas brand: short breaths only)
  yield* breathHold(timing.hold) as ThreadGenerator;

  // ─── Matched-cut writeback for scene 3 ─────────────────────────────────
  setMatchedCut({
    anchor: 'cards',
    position: [0, 0],
    scale: 1,
    rotation: 0,
  });

  // ─── Beat 7 (04:00 – 04:20) — Pre-exit anticipation: cards slightly compress
  yield* all(
    ...cardScales.map((s, i) =>
      delay(i * 0.04, s(0.95, 0.18, easeOutExpo) as ThreadGenerator),
    ),
  );
});
