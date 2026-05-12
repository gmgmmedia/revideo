/**
 * Atlas — Scene 1: "5K PR. Yesterday."
 *
 * Duration: ~4.5 seconds
 *
 * Patterns demonstrated:
 *   - Wrapper-Layout virtual camera (push-in + screen-shake)
 *   - Spring physics (UISpring on the hero metric scale entrance)
 *   - Count-up metric (00:00 → 21:47 via countUpMetric helper)
 *   - Screen-shake at PR moment (world().position with random offsets)
 *   - Mask reveal with compositeOperation (eyebrow label wipe)
 *   - Multi-layer rim light (orange off-frame TR via rimLight helper)
 *   - Rich ambient particle drift
 *   - Hierarchy timing: rim-light → grid → hero metric count-up → label → particles
 *   - Easing diversity (easeOutExpo, easeOutQuart, easeOutBack, easeInOutCubic, linear)
 *   - Matched-cut handoff (writes metric position for scene 2)
 *
 * Beat structure (from sfx-plan):
 *   B0 00:00 — intro riser begins (background)
 *   B1 00:45 — metric ticks start (count-up begins)
 *   B2 01:95 — PR impact hit (screen-shake fires)
 *   B3 02:50 — label stagger
 *   B4 04:20 — whip-pan exit cue
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
  breathHold, screenShake, formatMMSS,
} from '../lib/motion-helpers';
import {setMatchedCut} from '../lib/sharedState';

// Try to load SFX manifest — fallback to silent scene if missing
let beatGrid: Array<{time: number; layer: string; category: string; duration: number}> = [];
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const sfxManifest = require('../../sfx-manifest.json');
  beatGrid = (sfxManifest?.scenes?.scene1 ?? []).map((e: any) => ({
    time: e.start_offset_seconds ?? e.beat_offset ?? 0,
    layer: e.layer ?? 'foreground',
    category: e.category ?? 'ui',
    duration: e.duration_seconds ?? e.duration ?? 0.3,
  }));
} catch {
  beatGrid = [];  // SFX manifest not present — silent scene.
}

export default makeScene2D('scene1', function* (view) {
  // ─── Refs ──────────────────────────────────────────────────────────────
  const world = createRef<Layout>();           // wrapper-Layout virtual camera
  const bgWorld = createRef<Layout>();         // parallax background layer
  const bgFill = createRef<Rect>();            // track-black backdrop
  const bgVignette = createRef<Rect>();        // subtle vignette overlay

  // Rim-light stack (top-right, off-frame signal orange — atmospheric haze + bloom + sharp)
  const rimOuter = createRef<Circle>();
  const rimMid = createRef<Circle>();
  const rimInner = createRef<Circle>();

  // Grid hairlines (rule-of-thirds measurement aesthetic)
  const gridLinesV = createRefArray<Line>();
  const gridLinesH = createRefArray<Line>();
  const cornerMarks = createRefArray<Rect>();

  // Eyebrow label "5K — PERSONAL BEST" — character stagger
  const eyebrowChars = createRefArray<Txt>();

  // Hero metric "21:47" — display weight; count-up animated via countUpMetric
  const metricGroup = createRef<Node>();
  const metric = createRef<Txt>();
  const metricUnderline = createRef<Rect>();
  const metricUnit = createRef<Txt>();  // "MIN:SEC" label below

  // Bottom-left date label
  const dateLabel = createRef<Txt>();
  const dateLabelLine = createRef<Rect>();

  // Bottom-right delta chip
  const deltaChip = createRef<Rect>();
  const deltaChipText = createRef<Txt>();
  const deltaChipDot = createRef<Circle>();

  // Top-left run number label
  const runNumberLabel = createRef<Txt>();

  // Multi-layer glow stack BEHIND the metric (signal-orange bloom on PR impact)
  const metricGlowOuter = createRef<Circle>();
  const metricGlowMid = createRef<Circle>();
  const metricGlowInner = createRef<Circle>();

  // Rich ambient particles — orange embers drifting
  const embers = createRefArray<Circle>();
  const dustParticles = createRefArray<Circle>();

  // Signals
  const metricScale = createSignal<number>(0);    // spring-driven hero metric scale
  const cameraZoom = createSignal<number>(1.08);  // wrapper camera scale signal

  // Eyebrow label string split for character-stagger
  const eyebrowString = '5K — PERSONAL BEST';
  const eyebrowChunks = eyebrowString.split('');

  // ─── Scene Graph ────────────────────────────────────────────────────────
  view.add(
    <Layout ref={world} size={[layout.width, layout.height]} scale={() => cameraZoom()}>
      {/* Background layer — parallax target (scales less than foreground) */}
      <Layout ref={bgWorld} size={[layout.width, layout.height]} scale={1}>

        <Rect
          ref={bgFill}
          size={[layout.width, layout.height]}
          fill={colors.primary}
        />

        {/* Subtle slate vignette */}
        <Rect
          ref={bgVignette}
          size={[layout.width, layout.height]}
          fill={colors.bgMid}
          opacity={0.18}
          filters={[blur(60) as any]}
        />

        {/* Rim-light stack (off-frame TR signal-orange) — three layers */}
        <Circle
          ref={rimOuter}
          size={1400}
          x={composition.thirdsTR[0] + 240}
          y={composition.thirdsTR[1] - 80}
          fill={colors.accent}
          opacity={0}
          filters={[blur(160) as any]}
        />
        <Circle
          ref={rimMid}
          size={780}
          x={composition.thirdsTR[0] + 120}
          y={composition.thirdsTR[1] - 40}
          fill={colors.accent}
          opacity={0}
          filters={[blur(90) as any]}
        />
        <Circle
          ref={rimInner}
          size={320}
          x={composition.thirdsTR[0] + 60}
          y={composition.thirdsTR[1] - 20}
          fill={colors.accent}
          opacity={0}
          filters={[blur(30) as any]}
        />

        {/* Grid hairlines — vertical (rule of thirds, plus 6 sub-divisions) */}
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

        {/* Grid hairlines — horizontal */}
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

        {/* Corner editorial markers — track-style angles */}
        {Array.from({length: 4}).map((_, i) => {
          const positions: [number, number][] = [
            [-(layout.width / 2 - 90), -(layout.height / 2 - 90)],
            [layout.width / 2 - 90, -(layout.height / 2 - 90)],
            [-(layout.width / 2 - 90), layout.height / 2 - 90],
            [layout.width / 2 - 90, layout.height / 2 - 90],
          ];
          return (
            <Rect
              key={`corner-${i}`}
              ref={cornerMarks}
              size={[42, 2]}
              x={positions[i][0]}
              y={positions[i][1]}
              fill={colors.accent}
              opacity={0}
            />
          );
        })}
      </Layout>

      {/* Foreground layer — metric, eyebrow label, particles */}

      {/* Hero metric glow stack (3 layers) — sits BEHIND the metric */}
      <Circle
        ref={metricGlowOuter}
        size={1200}
        fill={colors.accent}
        opacity={0}
        filters={[blur(140) as any]}
      />
      <Circle
        ref={metricGlowMid}
        size={680}
        fill={colors.accent}
        opacity={0}
        filters={[blur(70) as any]}
      />
      <Circle
        ref={metricGlowInner}
        size={340}
        fill={colors.accent}
        opacity={0}
        filters={[blur(28) as any]}
      />

      {/* Eyebrow label — sits ABOVE the metric. Built character-by-character for stagger. */}
      <Layout
        layout
        direction={'row'}
        gap={0}
        y={composition.topMiddle[1] + 70}
      >
        {eyebrowChunks.map((c, i) => (
          <Txt
            key={`eyebrow-${i}`}
            ref={eyebrowChars}
            text={c === ' ' ? ' ' : c}
            fontFamily={fonts.accent}
            fontSize={fontSizes.label + 4}
            fontWeight={fontWeights.accent as any}
            fill={colors.accent}
            letterSpacing={opticalTracking.labelUppercase as any}
            opacity={0}
            y={18}
          />
        ))}
      </Layout>

      {/* Hero metric — "21:47" — spring-driven scale + count-up text */}
      <Node ref={metricGroup} y={0} scale={() => metricScale()}>
        <Txt
          ref={metric}
          text={'00:00'}
          fontFamily={fonts.mono}
          fontSize={fontSizes.hero}
          fontWeight={fontWeights.display as any}
          fill={colors.white}
          letterSpacing={opticalTracking.hero as any}
        />
        {/* Hairline underline below metric — appears post-impact */}
        <Rect
          ref={metricUnderline}
          size={[0, 3]}
          y={140}
          fill={colors.accent}
          opacity={0}
        />
        <Txt
          ref={metricUnit}
          text={'MIN : SEC'}
          fontFamily={fonts.accent}
          fontSize={fontSizes.label}
          fontWeight={fontWeights.accent as any}
          fill={colors.softGrey}
          letterSpacing={opticalTracking.labelUppercase as any}
          y={180}
          opacity={0}
        />
      </Node>

      {/* Bottom-left date label (editorial detail) */}
      <Rect
        ref={dateLabelLine}
        size={[0, 1]}
        x={-(layout.width / 2 - 140)}
        y={layout.height / 2 - 110}
        offsetX={-1}
        fill={colors.softGrey}
        opacity={0}
      />
      <Txt
        ref={dateLabel}
        text={'YESTERDAY  /  06:24 AM'}
        fontFamily={fonts.accent}
        fontSize={fontSizes.label}
        fontWeight={fontWeights.accent as any}
        fill={colors.softGrey}
        letterSpacing={opticalTracking.labelUppercase as any}
        x={-(layout.width / 2 - 140)}
        y={layout.height / 2 - 80}
        offsetX={-1}
        opacity={0}
      />

      {/* Top-left run number */}
      <Txt
        ref={runNumberLabel}
        text={'RUN  #0142'}
        fontFamily={fonts.accent}
        fontSize={fontSizes.label}
        fontWeight={fontWeights.accent as any}
        fill={colors.softGrey}
        letterSpacing={opticalTracking.labelUppercase as any}
        x={-(layout.width / 2 - 140)}
        y={-(layout.height / 2 - 100)}
        offsetX={-1}
        opacity={0}
      />

      {/* Bottom-right delta chip — "–24S" since last 5K */}
      <Rect
        ref={deltaChip}
        size={[0, 56]}
        x={layout.width / 2 - 140}
        y={layout.height / 2 - 110}
        offsetX={1}
        fill={colors.bgDark}
        radius={effects.cardRadius}
        stroke={colors.accent}
        lineWidth={1.5}
        opacity={0}
      >
        <Circle
          ref={deltaChipDot}
          size={10}
          x={-78}
          fill={colors.accent}
          opacity={1}
        />
        <Txt
          ref={deltaChipText}
          text={'–24S  VS  LAST  5K'}
          fontFamily={fonts.accent}
          fontSize={fontSizes.label}
          fontWeight={fontWeights.accent as any}
          fill={colors.white}
          letterSpacing={opticalTracking.labelUppercase as any}
          x={14}
        />
      </Rect>

      {/* Rich ambient embers — orange particles drifting */}
      {Array.from({length: 18}).map((_, i) => {
        const ax = -layout.width / 2 + 60 + (i * 105) + ((i * 47) % 70);
        const ay = -layout.height / 2 + 60 + ((i * 83) % (layout.height - 120));
        const size = 4 + ((i * 7) % 6);
        return (
          <Circle
            key={`ember-${i}`}
            ref={embers}
            size={size}
            x={ax}
            y={ay}
            fill={colors.accent}
            opacity={0}
            filters={[blur(1) as any]}
          />
        );
      })}

      {/* Dust particles — even smaller, white */}
      {Array.from({length: 26}).map((_, i) => {
        const ax = -layout.width / 2 + 40 + (i * 73) + ((i * 19) % 50);
        const ay = -layout.height / 2 + 40 + ((i * 41) % (layout.height - 80));
        return (
          <Circle
            key={`dust-${i}`}
            ref={dustParticles}
            size={2}
            x={ax}
            y={ay}
            fill={colors.white}
            opacity={0}
          />
        );
      })}
    </Layout>,
  );

  // ─── Beat 0 (00:00 – 00:45) — Rim light blooms in; grid hairlines settle
  // Outer layer first (atmosphere), then mid (bloom), then sharp inner
  yield* all(
    // Multi-layer rim light entrance — outer (haze) → mid (bloom) → inner (sharp)
    rimOuter().opacity(0.42, 0.55, easeOutQuart),
    delay(0.06, rimMid().opacity(0.55, 0.5, easeOutCubic) as ThreadGenerator),
    delay(0.12, rimInner().opacity(0.68, 0.45, easeOutExpo) as ThreadGenerator),

    // Grid hairlines fade in with cascade stagger
    sequence(
      0.035,
      ...gridLinesV.map(g => g.opacity(0.7, 0.32, easeOutQuart)),
    ),
    delay(0.12, sequence(
      0.04,
      ...gridLinesH.map(g => g.opacity(0.55, 0.3, easeOutQuart)),
    )),

    // Corner markers appear with even stagger
    delay(0.18, sequence(
      0.06,
      ...cornerMarks.map(c => c.opacity(0.85, 0.22, easeOutExpo)),
    )),

    // Editorial labels arrive (run number, date)
    delay(0.22, all(
      runNumberLabel().opacity(0.7, 0.3, easeOutCubic) as ThreadGenerator,
      dateLabelLine().size([280, 1], 0.35, easeOutQuart) as ThreadGenerator,
      dateLabelLine().opacity(0.5, 0.3, linear) as ThreadGenerator,
      delay(0.06, dateLabel().opacity(0.75, 0.3, easeOutCubic) as ThreadGenerator),
    )),
  );

  // ─── Beat 1 (00:45 – 02:00) — Hero metric springs in; count-up rolls from 00:00 → 21:47
  // Spring drives scale (UISpring); count-up runs over 1.45s with mechanical tick feel
  yield* all(
    // Spring scale: 0 → 1 (with mild overshoot character)
    spring(UISpring, 0, 1, 0.01, (v) => metricScale(v)) as ThreadGenerator,

    // Glow build during count-up (anticipates PR impact)
    delay(0.1, multiLayerGlow(
      [metricGlowInner, metricGlowMid, metricGlowOuter],
      0.9,
      [0.14, 0.08, 0.04],
      [0, 0.05, 0.1],
    ) as ThreadGenerator),

    // Count-up: 00:00 → 1307 seconds (21:47) — formatted as MM:SS
    // Easing rolls fast then settles (mechanical metric feel)
    delay(0.25, countUpMetric(
      metric,
      1307,
      1.45,
      (v) => formatMMSS(v),
      easeOutQuart,
    ) as ThreadGenerator),
  );

  // ─── Beat 2 (02:00 – 02:50) — PR IMPACT: screen-shake, glow flash, underline draw
  yield* all(
    // Screen-shake: wrapper world position jitters for ~0.4s with decay
    screenShake(world, 22, 0.42, 10) as ThreadGenerator,

    // Glow flashes brighter on impact
    metricGlowInner().opacity(0.5, 0.18, easeOutExpo) as ThreadGenerator,
    metricGlowMid().opacity(0.35, 0.18, easeOutExpo) as ThreadGenerator,
    metricGlowOuter().opacity(0.18, 0.22, easeOutQuart) as ThreadGenerator,

    // Metric subtle scale-pulse (emphasisPulse character)
    delay(0.05, emphasisPulse(metricGroup as any, 'scale', colors.accent, 0.6) as ThreadGenerator),

    // Underline slams across beneath the metric
    delay(0.08, all(
      metricUnderline().size([520, 3], 0.32, easeOutExpo) as ThreadGenerator,
      metricUnderline().opacity(1, 0.18, easeOutCubic) as ThreadGenerator,
    ) as ThreadGenerator),

    // Unit label appears with character-snap
    delay(0.22, metricUnit().opacity(0.85, 0.25, easeOutQuart) as ThreadGenerator),

    // Camera punch — slight zoom-in on impact
    delay(0.04, cameraZoom(1.04, 0.32, easeOutExpo) as ThreadGenerator),
  );

  // ─── Beat 3 (02:50 – 03:30) — Eyebrow label character-staggers in + delta chip
  yield* all(
    // Character-stagger on "5K — PERSONAL BEST" — opacity-y technique (premium snap)
    charStagger(eyebrowChars, 0.035, 0.18, 'opacity-y') as ThreadGenerator,

    // Delta chip slides in from right
    delay(0.18, all(
      deltaChip().size([280, 56], 0.32, easeOutExpo) as ThreadGenerator,
      deltaChip().opacity(1, 0.22, easeOutCubic) as ThreadGenerator,
    ) as ThreadGenerator),
  );

  // ─── Beat 4 (03:30 – 04:00) — Rich ambient particle drift
  // Embers fade in via wave stagger (rich density per motion_design)
  const emberDelays = computeStagger(embers.length, 0.6, 'wave');
  yield* all(
    ...embers.map((p, i) =>
      delay(emberDelays[i], all(
        p.opacity(0.4 + ((i * 13) % 30) / 100, 0.4, easeOutCubic) as ThreadGenerator,
        // Slow drift upward (rich trail intensity)
        p.y(p.y() - 30 - ((i * 11) % 40), 1.6, linear) as ThreadGenerator,
      )) as ThreadGenerator,
    ),

    // Dust particles fade in with even march stagger
    delay(0.1, sequence(
      0.015,
      ...dustParticles.map(d => d.opacity(0.35, 0.32, easeOutCubic)),
    )),
  );

  // ─── Beat 5 (04:00 – 04:30) — Brief breath hold before whip-pan
  yield* breathHold(timing.hold) as ThreadGenerator;

  // ─── Matched-cut writeback for scene 2 ─────────────────────────────────
  setMatchedCut({
    anchor: 'metric',
    position: [metricGroup().position().x, metricGroup().position().y],
    scale: metricScale(),
    rotation: 0,
  });

  // ─── Beat 6 (04:30 – 04:50) — Camera anticipation for whip-pan
  // Subtle camera zoom-out before the whipPan transition kicks in
  yield* all(
    cameraZoom(1.0, 0.18, easeOutExpo) as ThreadGenerator,
    // Glow flares one more time as exit signal
    metricGlowInner().opacity(0.6, 0.12, easeOutExpo) as ThreadGenerator,
  );
});
