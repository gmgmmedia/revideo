/**
 * Atlas — Scene 3: "Atlas knows your form. Run with intent."
 *
 * Duration: ~4 seconds
 *
 * Patterns demonstrated:
 *   - Character-stagger reveal on "ATLAS" hero display (each letter as own Txt)
 *   - Word-reveal on tagline "Run with intent" — opacity-y technique
 *   - Tracking-tighten on tagline as emphasis (letterSpacing animation)
 *   - Multi-layer glow stack on hero logo
 *   - Spring physics (UISpring) on signature dot entrance
 *   - Mask-wipe reveal for subline "FOR THE LONG GAME"
 *   - Camera pulls back to wide shot at end (pullOut with parallax)
 *   - Easing diversity (easeOutExpo, easeOutQuart, easeOutBack, easeInOutCubic, linear, easeOutQuint)
 *   - rim light TR (signal-orange off-frame key light)
 *   - Atlas-brand brief hold only (no long breath — high energy)
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
  UISpring, LogoLandSpring, PunchSpring,
} from '../lib/brand';
import {
  charStagger, multiLayerGlow, emphasisPulse,
  rimLight, asymmetricPosition, computeStagger, cinematicFade,
  breathHold,
} from '../lib/motion-helpers';
import {getMatchedCut} from '../lib/sharedState';

// Try to load SFX manifest — fallback to silent scene if missing
let beatGrid: Array<{time: number; layer: string; category: string; duration: number}> = [];
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const sfxManifest = require('../../sfx-manifest.json');
  beatGrid = (sfxManifest?.scenes?.scene3 ?? []).map((e: any) => ({
    time: e.start_offset_seconds ?? e.beat_offset ?? 0,
    layer: e.layer ?? 'foreground',
    category: e.category ?? 'ui',
    duration: e.duration_seconds ?? e.duration ?? 0.3,
  }));
} catch {
  beatGrid = [];  // SFX manifest not present — silent scene.
}

export default makeScene2D('scene3', function* (view) {
  // ─── Matched-cut entry (read from scene 2)
  const entry = getMatchedCut('cards');

  // ─── Refs ──────────────────────────────────────────────────────────────
  const world = createRef<Layout>();
  const bgWorld = createRef<Layout>();
  const bgFill = createRef<Rect>();
  const bgVignette = createRef<Rect>();

  // Rim light stack (TR off-frame)
  const rimOuter = createRef<Circle>();
  const rimMid = createRef<Circle>();
  const rimInner = createRef<Circle>();

  // Counter-rim from BL (electric green — secondary motivation)
  const rimGreenOuter = createRef<Circle>();
  const rimGreenMid = createRef<Circle>();

  // Grid hairlines
  const gridLinesV = createRefArray<Line>();
  const gridLinesH = createRefArray<Line>();

  // Corner markers
  const cornerMarks = createRefArray<Rect>();

  // ATLAS logo — character-stagger; each letter is its own Txt
  const logoChars = createRefArray<Txt>();
  const logoGroup = createRef<Node>();

  // Logo glow stack (3 layers behind ATLAS)
  const logoGlowOuter = createRef<Circle>();
  const logoGlowMid = createRef<Circle>();
  const logoGlowInner = createRef<Circle>();

  // Tagline "Run with intent." — word-reveal
  const taglineWords = createRefArray<Txt>();
  const taglineGroup = createRef<Node>();
  const taglineTracking = createSignal<number>(12);  // start loose → tighten

  // Signature dot (signal-orange) — spring-driven
  const dot = createRef<Circle>();
  const dotGlow = createRef<Circle>();
  const dotScale = createSignal<number>(0);

  // Subline "FOR THE LONG GAME" — mask wipe
  const sublineHolder = createRef<Node>();
  const sublineText = createRef<Txt>();
  const sublineMask = createRef<Rect>();

  // Top eyebrow line + label
  const eyebrowTopLine = createRef<Rect>();
  const eyebrowTop = createRef<Txt>();

  // Bottom labels
  const bottomLabelLeft = createRef<Txt>();
  const bottomLabelRight = createRef<Txt>();
  const yearLabel = createRef<Txt>();

  // Camera signals
  const cameraScale = createSignal<number>(1.08);
  const cameraOffset = createSignal<[number, number]>([0, 0]);

  // ATLAS letters split into individual Txt refs
  const ATLAS_CHARS = ['A', 'T', 'L', 'A', 'S'];
  // Tagline words
  const TAGLINE_WORDS = ['Run', 'with', 'intent.'];

  // ─── Scene Graph ────────────────────────────────────────────────────────
  view.add(
    <Layout
      ref={world}
      size={[layout.width, layout.height]}
      scale={() => cameraScale()}
      position={() => cameraOffset()}
    >

      {/* Background layer — parallax slower */}
      <Layout ref={bgWorld} size={[layout.width, layout.height]} scale={1}>

        <Rect
          ref={bgFill}
          size={[layout.width, layout.height]}
          fill={colors.primary}
        />

        {/* Subtle vignette */}
        <Rect
          ref={bgVignette}
          size={[layout.width, layout.height]}
          fill={colors.bgMid}
          opacity={0.2}
          filters={[blur(80) as any]}
        />

        {/* Rim light TR (signal orange) */}
        <Circle
          ref={rimOuter}
          size={1600}
          x={composition.thirdsTR[0] + 280}
          y={composition.thirdsTR[1] - 120}
          fill={colors.accent}
          opacity={0}
          filters={[blur(170) as any]}
        />
        <Circle
          ref={rimMid}
          size={860}
          x={composition.thirdsTR[0] + 140}
          y={composition.thirdsTR[1] - 60}
          fill={colors.accent}
          opacity={0}
          filters={[blur(100) as any]}
        />
        <Circle
          ref={rimInner}
          size={360}
          x={composition.thirdsTR[0] + 60}
          y={composition.thirdsTR[1] - 30}
          fill={colors.accent}
          opacity={0}
          filters={[blur(35) as any]}
        />

        {/* Counter-rim BL (electric green) — visual weight balance */}
        <Circle
          ref={rimGreenOuter}
          size={1100}
          x={composition.thirdsBL[0] - 160}
          y={composition.thirdsBL[1] + 80}
          fill={colors.secondary}
          opacity={0}
          filters={[blur(150) as any]}
        />
        <Circle
          ref={rimGreenMid}
          size={520}
          x={composition.thirdsBL[0] - 80}
          y={composition.thirdsBL[1] + 40}
          fill={colors.secondary}
          opacity={0}
          filters={[blur(80) as any]}
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

        {/* Corner markers */}
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
              size={[44, 2]}
              x={positions[i][0]}
              y={positions[i][1]}
              fill={colors.accent}
              opacity={0}
            />
          );
        })}
      </Layout>

      {/* Top eyebrow */}
      <Rect
        ref={eyebrowTopLine}
        size={[0, 1.5]}
        y={-380}
        fill={colors.accent}
        opacity={0}
      />
      <Txt
        ref={eyebrowTop}
        text={'/  ATLAS  KNOWS  YOUR  FORM  /'}
        fontFamily={fonts.accent}
        fontSize={fontSizes.label + 2}
        fontWeight={fontWeights.accent as any}
        fill={colors.accent}
        letterSpacing={opticalTracking.labelUppercase as any}
        y={-340}
        opacity={0}
      />

      {/* Logo glow stack (3 layers BEHIND the ATLAS text) */}
      <Circle
        ref={logoGlowOuter}
        size={1400}
        y={-40}
        fill={colors.accent}
        opacity={0}
        filters={[blur(160) as any]}
      />
      <Circle
        ref={logoGlowMid}
        size={840}
        y={-40}
        fill={colors.accent}
        opacity={0}
        filters={[blur(75) as any]}
      />
      <Circle
        ref={logoGlowInner}
        size={420}
        y={-40}
        fill={colors.accent}
        opacity={0}
        filters={[blur(28) as any]}
      />

      {/* ATLAS hero logo — each letter is own Txt for character stagger */}
      <Layout
        ref={logoGroup}
        layout
        direction={'row'}
        gap={4}
        y={-40}
      >
        {ATLAS_CHARS.map((c, i) => (
          <Txt
            key={`logo-${i}`}
            ref={logoChars}
            text={c}
            fontFamily={fonts.heading}
            fontSize={fontSizes.display}
            fontWeight={fontWeights.display as any}
            fill={colors.white}
            letterSpacing={opticalTracking.display as any}
            y={28}
            opacity={0}
          />
        ))}
      </Layout>

      {/* Tagline "Run with intent." — word reveal */}
      <Node ref={taglineGroup} y={150}>
        <Layout
          layout
          direction={'row'}
          gap={() => taglineTracking()}
        >
          {TAGLINE_WORDS.map((word, i) => (
            <Txt
              key={`tag-${i}`}
              ref={taglineWords}
              text={word}
              fontFamily={fonts.heading}
              fontSize={fontSizes.h3}
              fontWeight={fontWeights.body as any}
              fill={colors.white}
              letterSpacing={opticalTracking.h2 as any}
              y={20}
              opacity={0}
            />
          ))}
        </Layout>

        {/* Signature dot — sits after the tagline */}
        <Circle
          ref={dotGlow}
          size={68}
          x={300}
          y={4}
          fill={colors.accent}
          opacity={0}
          filters={[blur(20) as any]}
        />
        <Circle
          ref={dot}
          size={() => 22 * dotScale()}
          x={300}
          y={4}
          fill={colors.accent}
          opacity={() => dotScale() > 0 ? 1 : 0}
        />
      </Node>

      {/* Subline "FOR THE LONG GAME" — mask wipe */}
      <Node ref={sublineHolder} y={260} cache>
        <Txt
          ref={sublineText}
          text={'FOR THE LONG GAME'}
          fontFamily={fonts.accent}
          fontSize={fontSizes.label + 4}
          fontWeight={fontWeights.accent as any}
          fill={colors.softGrey}
          letterSpacing={opticalTracking.labelUppercase * 1.4 as any}
        />
        <Rect
          ref={sublineMask}
          size={[0, 60]}
          x={-360}
          offsetX={-1}
          fill={colors.white}
          compositeOperation={'destination-in'}
        />
      </Node>

      {/* Bottom-left + bottom-right labels */}
      <Txt
        ref={bottomLabelLeft}
        text={'ATLAS  /  RUNNING  ANALYTICS'}
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
      <Txt
        ref={bottomLabelRight}
        text={'AVAILABLE  IOS  +  ANDROID'}
        fontFamily={fonts.accent}
        fontSize={fontSizes.label}
        fontWeight={fontWeights.accent as any}
        fill={colors.softGrey}
        letterSpacing={opticalTracking.labelUppercase as any}
        x={layout.width / 2 - 140}
        y={layout.height / 2 - 80}
        offsetX={1}
        opacity={0}
      />
      <Txt
        ref={yearLabel}
        text={'— 2026 —'}
        fontFamily={fonts.accent}
        fontSize={fontSizes.label - 2}
        fontWeight={fontWeights.accent as any}
        fill={colors.accent}
        letterSpacing={opticalTracking.labelUppercase * 1.6 as any}
        y={330}
        opacity={0}
      />
    </Layout>,
  );

  // ─── Beat 0 (00:00 – 00:30) — Rim lights bloom in; grid settles
  yield* all(
    // Rim light TR
    rimOuter().opacity(0.42, 0.4, easeOutQuart) as ThreadGenerator,
    delay(0.04, rimMid().opacity(0.55, 0.38, easeOutCubic) as ThreadGenerator),
    delay(0.08, rimInner().opacity(0.65, 0.36, easeOutExpo) as ThreadGenerator),

    // Counter-rim BL (electric green — secondary motivation)
    delay(0.06, rimGreenOuter().opacity(0.22, 0.4, easeOutQuart) as ThreadGenerator),
    delay(0.1, rimGreenMid().opacity(0.32, 0.38, easeOutCubic) as ThreadGenerator),

    // Grid hairlines
    sequence(
      0.025,
      ...gridLinesV.map(g => g.opacity(0.62, 0.24, easeOutQuart)),
    ),
    delay(0.08, sequence(
      0.03,
      ...gridLinesH.map(g => g.opacity(0.5, 0.22, easeOutQuart)),
    )),

    // Corner markers
    delay(0.12, sequence(
      0.05,
      ...cornerMarks.map(c => c.opacity(0.85, 0.18, easeOutExpo)),
    )),

    // Top eyebrow line + text
    delay(0.14, all(
      eyebrowTopLine().size([720, 1.5], 0.34, easeOutExpo) as ThreadGenerator,
      eyebrowTopLine().opacity(1, 0.2, linear) as ThreadGenerator,
      delay(0.06, eyebrowTop().opacity(0.95, 0.24, easeOutCubic) as ThreadGenerator),
    )),
  );

  // ─── Beat 1 (00:30 – 01:10) — Logo glow ramps, then ATLAS character-staggers in
  yield* all(
    // Logo glow stack (3 layers via helper)
    multiLayerGlow(
      [logoGlowInner, logoGlowMid, logoGlowOuter],
      0.45,
      [0.4, 0.22, 0.1],
      [0, 0.04, 0.08],
    ) as ThreadGenerator,

    // ATLAS character stagger (opacity-y) — fast, athletic snap
    delay(0.12, charStagger(logoChars, 0.05, 0.22, 'opacity-y') as ThreadGenerator),
  );

  // ─── Beat 2 (01:10 – 01:65) — Tagline word-reveal + tracking tightens
  yield* all(
    // Word-reveal: opacity + y-rise stagger
    sequence(
      0.085,
      ...taglineWords.map(w =>
        all(
          w.opacity(0.95, 0.24, easeOutExpo),
          w.y(0, 0.24, easeOutQuart),
        ),
      ),
    ),

    // Tracking tightens (12 → 28 spacing widens then tightens to make tagline feel
    // intentional). We start at 12 and animate to 22 (slight widening) then to 14
    // for the emphasis settle.
    delay(0.15, taglineTracking(22, 0.3, easeOutQuart) as ThreadGenerator),
  );

  // Tracking tighten for emphasis (per technical-reference Section 30 tracking pattern)
  yield* taglineTracking(14, 0.32, easeInOutCubic) as ThreadGenerator;

  // ─── Beat 3 (01:65 – 02:05) — Signature dot springs in with glow
  yield* all(
    // Spring drives scale (LogoLandSpring — confident bounce)
    spring(LogoLandSpring, 0, 1, 0.01, (v) => dotScale(v)) as ThreadGenerator,

    // Glow lags by 0.05s (secondary motion)
    delay(0.05, dotGlow().opacity(0.6, 0.25, easeOutExpo) as ThreadGenerator),
  );

  // ─── Beat 4 (02:05 – 02:50) — Subline mask-wipes in + bottom labels arrive
  yield* all(
    sublineMask().size([720, 60], 0.34, easeOutExpo) as ThreadGenerator,

    delay(0.12, bottomLabelLeft().opacity(0.85, 0.22, easeOutCubic) as ThreadGenerator),
    delay(0.18, bottomLabelRight().opacity(0.85, 0.22, easeOutCubic) as ThreadGenerator),

    delay(0.2, yearLabel().opacity(0.95, 0.22, easeOutExpo) as ThreadGenerator),
  );

  // ─── Beat 5 (02:50 – 02:80) — Final hero emphasis: logo glow pulse
  yield* all(
    // Logo glow briefly intensifies
    logoGlowInner().opacity(0.55, 0.16, easeOutExpo) as ThreadGenerator,
    logoGlowMid().opacity(0.32, 0.16, easeOutExpo) as ThreadGenerator,

    // Dot glow pulse
    dotGlow().opacity(0.85, 0.14, easeOutExpo) as ThreadGenerator,
  );

  yield* all(
    logoGlowInner().opacity(0.4, 0.22, easeInOutCubic) as ThreadGenerator,
    logoGlowMid().opacity(0.22, 0.22, easeInOutCubic) as ThreadGenerator,
    dotGlow().opacity(0.6, 0.18, easeInOutCubic) as ThreadGenerator,
  );

  // ─── Beat 6 (02:80 – 03:30) — Camera pulls back to wide shot
  yield* all(
    cameraScale(1, 0.4, easeInOutCubic) as ThreadGenerator,
    bgWorld().scale(1.015, 0.4, easeInOutCubic) as ThreadGenerator,  // very subtle parallax
  );

  // ─── Beat 7 (03:30 – 03:60) — Brief final hold (Atlas brand: short breath only)
  yield* breathHold(timing.hold) as ThreadGenerator;
});
