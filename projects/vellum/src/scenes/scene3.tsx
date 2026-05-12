/**
 * Vellum — Scene 3: "Read on Vellum." (CTA / closing)
 *
 * Duration: ~4.0 seconds
 *
 * Patterns demonstrated:
 *   - fadeTransition entry (matches motion_design.transition_vocabulary.scene_change)
 *   - Hero text "Vellum" — char-stagger with opacity-y, then tracking tightens
 *   - Tagline "On stillness, attention, and writing for the long hours."
 *     word-by-word wave reveal
 *   - Year "MMXXVI" in tiny tracking-spaced accent text
 *   - Single hairline divider grows from center
 *   - Camera pulls out for final wide shot (subtle parallax)
 *   - Generous 1.0s breath hold before fade
 *   - 4+ distinct easings: easeOutQuint, easeInOutCubic, easeOutCubic,
 *     easeOutQuart, linear
 *   - emphasisPulse with technique='tracking' on the wordmark (signature move)
 *   - rimLight helper at bottom-left for warm under-light
 *   - SFX manifest read with try/catch fallback
 */

import {
  makeScene2D,
  Rect, Node, Circle, Layout, Txt, Audio,
  blur,
} from '@revideo/2d';
import {
  all, delay, sequence, waitFor,
  createRef, createRefArray,
  fadeTransition,
  easeInOutCubic, easeOutCubic, easeOutQuint, easeOutQuart, linear,
  ThreadGenerator,
} from '@revideo/core';
import {
  colors, fonts, fontSizes, fontWeights,
  timing, effects, layout, composition, staggerWave,
} from '../lib/brand';
import {
  charStagger, multiLayerGlow, emphasisPulse, rimLight,
  asymmetricPosition, computeStagger, cinematicFade, breathHold,
} from '../lib/motion-helpers';
import { getMatchedCut } from '../lib/sharedState';

// ─── SFX manifest read with try/catch fallback ─────────────────────────────
let sceneBeats: Array<{ time: number; volume: number; src?: string }> = [];
try {
  const manifest = require('../../sfx-manifest.json');
  sceneBeats = (manifest?.scenes?.scene3 ?? []).map((e: any) => ({
    time: e.beat_offset ?? 0,
    volume: e.volume ?? 0.4,
    src: e.path ?? undefined,
  }));
} catch {
  // SFX manifest not present — silent scene.
}

const TAGLINE_WORDS = ['On', 'stillness,', 'attention,', 'and', 'writing', 'for', 'the', 'long', 'hours.'];

export default makeScene2D('scene3', function* (view) {
  // ─── Fade-in transition ────────────────────────────────────────────────
  yield* fadeTransition(0.6);

  // ─── Matched-cut read (informational; scene 3 doesn't enter from anywhere) ───
  const entry = getMatchedCut('sectionEnd');

  // ─── Refs ───────────────────────────────────────────────────────────────
  const world = createRef<Layout>();
  const bgWorld = createRef<Layout>();
  const bgPaper = createRef<Rect>();
  const bgHazeA = createRef<Circle>();
  const bgHazeB = createRef<Circle>();
  const bgHazeC = createRef<Circle>();

  // Editorial corner marks
  const cornerMarks = createRefArray<Rect>();

  // Top mark "READ ON" + tiny bracket
  const topMark = createRef<Txt>();
  const topMarkBracketLeft = createRef<Rect>();
  const topMarkBracketRight = createRef<Rect>();

  // Hero "Vellum" wordmark — split into chars for stagger
  const wordmarkGroup = createRef<Layout>();
  const wordmarkChars = createRefArray<Txt>();

  // Hero glow stack — gentle warm halo behind "Vellum"
  const wordmarkGlowInner = createRef<Circle>();
  const wordmarkGlowMid = createRef<Circle>();
  const wordmarkGlowOuter = createRef<Circle>();

  // Hairline divider that grows from center (below Vellum, above tagline)
  const heroDivider = createRef<Rect>();

  // Tagline word group
  const taglineGroup = createRef<Layout>();
  const taglineWords = createRefArray<Txt>();

  // Year mark "MMXXVI" — tiny, very wide tracking
  const yearMark = createRef<Txt>();
  const yearMarkLineLeft = createRef<Rect>();
  const yearMarkLineRight = createRef<Rect>();

  // Single terracotta accent dot — closing punctuation
  const closingDot = createRef<Circle>();
  const closingDotGlow = createRef<Circle>();

  // Page-corner folio
  const folio = createRef<Txt>();
  const folioLine = createRef<Rect>();

  // Ambient dust particles
  const dustParticles = createRefArray<Circle>();

  // ─── Scene Graph ────────────────────────────────────────────────────────
  view.add(
    <Layout ref={world} size={[layout.width, layout.height]} scale={1.05}>

      {/* ───── Background layer ───── */}
      <Layout ref={bgWorld} size={[layout.width, layout.height]}>
        <Rect
          ref={bgPaper}
          size={[layout.width, layout.height]}
          fill={colors.bgWarm}
        />
        {/* Triple atmospheric haze — counter-glow composition */}
        <Circle
          ref={bgHazeA}
          size={1800}
          x={-200}
          y={-50}
          fill={colors.bgCream}
          opacity={0}
          filters={[blur(280)]}
        />
        <Circle
          ref={bgHazeB}
          size={1200}
          x={550}
          y={250}
          fill={colors.accent}
          opacity={0}
          filters={[blur(240)]}
        />
        <Circle
          ref={bgHazeC}
          size={900}
          x={-450}
          y={300}
          fill={colors.softNeutral}
          opacity={0}
          filters={[blur(200)]}
        />
        {/* Rim light from BL for warm under-light counter-balance */}
        {rimLight(colors.accent, 220, 0.1, 'BL')}
      </Layout>

      {/* Corner marks */}
      {Array.from({ length: 4 }).map((_, i) => {
        const positions: [number, number][] = [
          [-(layout.width / 2 - layout.margin), -(layout.height / 2 - layout.margin)],
          [layout.width / 2 - layout.margin, -(layout.height / 2 - layout.margin)],
          [-(layout.width / 2 - layout.margin), layout.height / 2 - layout.margin],
          [layout.width / 2 - layout.margin, layout.height / 2 - layout.margin],
        ];
        return (
          <Rect
            key={`corner-${i}`}
            ref={cornerMarks}
            size={[28, 1]}
            x={positions[i][0]}
            y={positions[i][1]}
            fill={colors.softNeutral}
            opacity={0}
          />
        );
      })}

      {/* "READ ON" top mark */}
      <Txt
        ref={topMark}
        text={'READ ON'}
        fontFamily={fonts.accent}
        fontSize={fontSizes.label}
        fontWeight={fontWeights.accent}
        fill={colors.secondary}
        letterSpacing={effects.trackingMicro}
        y={-280}
        opacity={0}
      />
      <Rect
        ref={topMarkBracketLeft}
        size={[0, 1]}
        x={-90}
        y={-280}
        fill={colors.softNeutral}
        opacity={0}
      />
      <Rect
        ref={topMarkBracketRight}
        size={[0, 1]}
        x={90}
        y={-280}
        fill={colors.softNeutral}
        opacity={0}
      />

      {/* ───── Wordmark glow stack (3 layers) ───── */}
      <Circle
        ref={wordmarkGlowOuter}
        size={1500}
        x={0}
        y={-50}
        fill={colors.accent}
        opacity={0}
        filters={[blur(280)]}
      />
      <Circle
        ref={wordmarkGlowMid}
        size={900}
        x={0}
        y={-50}
        fill={colors.bgCream}
        opacity={0}
        filters={[blur(180)]}
      />
      <Circle
        ref={wordmarkGlowInner}
        size={500}
        x={0}
        y={-50}
        fill={colors.bgCream}
        opacity={0}
        filters={[blur(100)]}
      />

      {/* ───── Hero wordmark "Vellum" — flex row of char Txts ───── */}
      <Layout
        ref={wordmarkGroup}
        layout
        direction={'row'}
        alignItems={'baseline'}
        justifyContent={'center'}
        y={-80}
      >
        {'Vellum'.split('').map((ch, i) => (
          <Txt
            key={`wmc-${i}`}
            ref={wordmarkChars}
            text={ch}
            fontFamily={fonts.heading}
            fontSize={fontSizes.hero}
            fontWeight={fontWeights.heading}
            fill={colors.primary}
            letterSpacing={effects.trackingHero}
            opacity={0}
            y={36}
          />
        ))}
      </Layout>

      {/* Hero divider — grows from center, below wordmark */}
      <Rect
        ref={heroDivider}
        size={[0, 1]}
        y={60}
        fill={colors.softNeutral}
        opacity={0}
      />

      {/* ───── Tagline word group ───── */}
      <Layout
        ref={taglineGroup}
        layout
        direction={'row'}
        alignItems={'baseline'}
        justifyContent={'center'}
        gap={14}
        y={140}
      >
        {TAGLINE_WORDS.map((w, i) => (
          <Txt
            key={`tw-${i}`}
            ref={taglineWords}
            text={w}
            fontFamily={fonts.body}
            fontSize={fontSizes.body}
            fontWeight={fontWeights.body}
            fill={colors.secondary}
            letterSpacing={0}
            opacity={0}
            y={14}
          />
        ))}
      </Layout>

      {/* Year mark "MMXXVI" — tiny, very wide tracking, between divider hairlines */}
      <Txt
        ref={yearMark}
        text={'MMXXVI'}
        fontFamily={fonts.accent}
        fontSize={fontSizes.caption}
        fontWeight={fontWeights.accent}
        fill={colors.quiet}
        letterSpacing={12}
        y={240}
        opacity={0}
      />
      <Rect
        ref={yearMarkLineLeft}
        size={[0, 1]}
        x={-130}
        y={240}
        fill={colors.softNeutral}
        opacity={0}
      />
      <Rect
        ref={yearMarkLineRight}
        size={[0, 1]}
        x={130}
        y={240}
        fill={colors.softNeutral}
        opacity={0}
      />

      {/* Closing terracotta dot — far right of "MMXXVI" mark, quiet punctuation */}
      <Circle
        ref={closingDotGlow}
        size={36}
        x={0}
        y={310}
        fill={colors.accent}
        opacity={0}
        filters={[blur(16)]}
      />
      <Circle
        ref={closingDot}
        size={9}
        x={0}
        y={310}
        fill={colors.accent}
        opacity={0}
      />

      {/* Page-corner folio */}
      <Txt
        ref={folio}
        text={'colophon'}
        fontFamily={fonts.accent}
        fontSize={fontSizes.micro}
        fontWeight={fontWeights.accent}
        fill={colors.quiet}
        letterSpacing={6}
        x={layout.width / 2 - layout.margin - 40}
        y={layout.height / 2 - layout.margin - 18}
        opacity={0}
      />
      <Rect
        ref={folioLine}
        size={[0, 1]}
        x={layout.width / 2 - layout.margin - 40}
        y={layout.height / 2 - layout.margin - 6}
        fill={colors.softNeutral}
        opacity={0}
      />

      {/* Ambient dust particles */}
      {Array.from({ length: 10 }).map((_, i) => {
        const ax = -700 + i * 160 + ((i * 37) % 60) - 30;
        const ay = -380 + ((i * 81) % 700);
        return (
          <Circle
            key={`dust3-${i}`}
            ref={dustParticles}
            size={1 + (i % 3)}
            x={ax}
            y={ay}
            fill={i % 2 === 0 ? colors.softNeutral : colors.quiet}
            opacity={0}
            filters={[blur(1)]}
          />
        );
      })}

      {/* Audio tracks from manifest */}
      {sceneBeats
        .filter((b) => b.src)
        .map((b, i) => (
          <Audio
            key={`audio-${i}`}
            src={b.src!}
            play={true}
            time={b.time}
            volume={b.volume ?? 0.4}
          />
        ))}
    </Layout>,
  );

  // ─── Beat 0 (00:00 – 00:40) — Background haze + corners + top mark ───────
  yield* all(
    bgHazeA().opacity(0.6, 0.4, easeOutCubic),
    delay(0.06, bgHazeB().opacity(0.4, 0.4, easeOutCubic) as ThreadGenerator),
    delay(0.12, bgHazeC().opacity(0.45, 0.4, easeOutCubic) as ThreadGenerator),
    sequence(0.04, ...cornerMarks.map((m) => m.opacity(0.5, 0.3, easeOutCubic) as ThreadGenerator)),
    delay(0.18, all(
      topMark().opacity(0.85, 0.3, easeOutCubic),
      topMarkBracketLeft().size([70, 1], 0.3, easeOutQuart),
      topMarkBracketRight().size([70, 1], 0.3, easeOutQuart),
      topMarkBracketLeft().opacity(0.55, 0.28, linear),
      topMarkBracketRight().opacity(0.55, 0.28, linear),
    )),
  );

  // ─── Beat 1 (00:40 – 00:90) — Wordmark glow stack appears under wordmark ──
  yield* multiLayerGlow(
    [wordmarkGlowInner, wordmarkGlowMid, wordmarkGlowOuter],
    0.45,
    [0.5, 0.4, 0.25],
    [0, 0.06, 0.12],
  );

  // ─── Beat 2 (00:90 – 01:50) — Char-stagger reveal of "Vellum" ─────────────
  yield* charStagger(wordmarkChars, timing.charStagger, 0.4, 'opacity-y');

  // ─── Beat 3 (01:50 – 01:90) — Letter-spacing tightens (signature move) ────
  yield* all(
    ...wordmarkChars.map((c) =>
      c.letterSpacing(effects.trackingTight, timing.trackingTighten, easeOutQuint) as ThreadGenerator,
    ),
    // Hero divider grows from center, concurrent
    delay(0.08, all(
      heroDivider().size([360, 1], 0.45, easeOutQuint),
      heroDivider().opacity(0.65, 0.32, linear),
    )),
  );

  // ─── Beat 4 (01:90 – 02:40) — Tagline word-by-word wave reveal ────────────
  yield* all(
    ...staggerWave(
      taglineWords.map((w) =>
        all(
          w.opacity(0.95, 0.28, easeOutCubic),
          w.y(0, 0.28, easeOutQuint),
        ) as ThreadGenerator,
      ),
      0.5,
    ),
  );

  // ─── Beat 5 (02:40 – 02:80) — Year mark + flanking hairlines + closing dot ───
  yield* all(
    yearMark().opacity(0.75, 0.35, easeOutCubic),
    delay(0.05, all(
      yearMarkLineLeft().size([90, 1], 0.3, easeOutQuart),
      yearMarkLineRight().size([90, 1], 0.3, easeOutQuart),
      yearMarkLineLeft().opacity(0.5, 0.28, linear),
      yearMarkLineRight().opacity(0.5, 0.28, linear),
    )),
    delay(0.12, all(
      closingDot().opacity(1, 0.25, easeOutCubic),
      closingDotGlow().opacity(0.55, 0.35, easeOutCubic),
    )),
    delay(0.18, all(
      folio().opacity(0.7, 0.3, easeOutCubic),
      folioLine().size([60, 1], 0.3, easeOutQuart),
      folioLine().opacity(0.5, 0.28, linear),
    )),
  );

  // ─── Beat 6 (02:80 – 03:20) — Dust particles + camera pull-out + tracking pulse ─
  const dustOffsets = computeStagger(dustParticles.length, 0.35, 'wave');
  // Tracking emphasis on the central "Vellum" char — Vellum signature move.
  const middleIdx = Math.floor(wordmarkChars.length / 2);
  yield* all(
    ...dustParticles.map((p, i) =>
      delay(dustOffsets[i], p.opacity(0.35, 0.3, easeOutCubic) as ThreadGenerator),
    ),
    // Subtle camera pull-out — wrapper scales 1.05 → 1.0
    world().scale(1, 0.4, easeInOutCubic),
    bgWorld().scale(1.02, 0.4, easeInOutCubic),
    // Tracking pulse on the middle char of "Vellum"
    wordmarkChars[middleIdx].letterSpacing(effects.trackingTight - 4, 0.35, easeOutQuint) as ThreadGenerator,
  );
  // Release the tracking pulse
  yield* wordmarkChars[middleIdx].letterSpacing(effects.trackingTight, 0.3, easeInOutCubic);

  // ─── Beat 7 — Generous final hold (signature breath) ──────────────────────
  yield* breathHold(0.6);

  // (Render system will cut at scene end. No matched-cut writeback needed.)
});
