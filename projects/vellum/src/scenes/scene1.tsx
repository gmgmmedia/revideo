/**
 * Vellum — Scene 1: "Issue No. 27"
 *
 * Duration: ~5.0 seconds
 *
 * Patterns demonstrated:
 *   - Wrapper-Layout virtual camera (very subtle: 1.04 → 1.0 pull-out)
 *   - Character-stagger reveal (charStagger helper, 0.10s slow editorial pace)
 *   - Letter-spacing animation: starts loose (16px) → tightens to (4px)
 *   - Multi-layer atmospheric haze background (3-layer glow stack)
 *   - rimLight helper at top-right third
 *   - Hairline dividers (1px taupe) drawing from center
 *   - Single terracotta accent dot as quiet punctuation
 *   - 4+ distinct easings: easeOutQuint (primary), easeInOutCubic,
 *     easeOutCubic, linear, easeOutQuart
 *   - Long breath holds (1.2s) — magazine pacing
 *   - SFX manifest read with try/catch fallback
 *   - Matched-cut writeback for scene 2
 */

import {
  makeScene2D,
  Rect, Node, Circle, Layout, Txt, Audio,
  blur,
} from '@revideo/2d';
import {
  all, delay, sequence, waitFor,
  createRef, createRefArray,
  easeInOutCubic, easeOutCubic, easeOutQuint, easeOutQuart, linear,
  ThreadGenerator,
} from '@revideo/core';
import {
  colors, fonts, fontSizes, fontWeights,
  timing, effects, layout, composition,
} from '../lib/brand';
import {
  charStagger, multiLayerGlow, emphasisPulse, rimLight,
  asymmetricPosition, computeStagger, cinematicFade, breathHold,
} from '../lib/motion-helpers';
import { setMatchedCut } from '../lib/sharedState';

// ─── SFX manifest read with try/catch fallback ─────────────────────────────
let sceneBeats: Array<{ time: number; volume: number; src?: string }> = [];
let sfxBackgroundSrc: string | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const manifest = require('../../sfx-manifest.json');
  const entries = manifest?.scenes?.scene1 ?? [];
  sceneBeats = entries.map((e: any) => ({
    time: e.beat_offset ?? 0,
    volume: e.volume ?? 0.4,
    src: e.path ?? undefined,
  }));
  const bg = entries.find((e: any) => e.layer === 'background');
  sfxBackgroundSrc = bg?.path ?? null;
} catch {
  // SFX manifest not present — silent scene.
}

export default makeScene2D('scene1', function* (view) {
  // ─── Refs ───────────────────────────────────────────────────────────────
  // World layers (camera + parallax)
  const world = createRef<Layout>();
  const bgWorld = createRef<Layout>();
  const midWorld = createRef<Layout>();   // hairline-detail layer (closer parallax)

  // Background paper layer
  const bgPaper = createRef<Rect>();
  const bgGradInner = createRef<Circle>();   // inner warm glow
  const bgGradMid = createRef<Circle>();     // mid bloom
  const bgGradOuter = createRef<Circle>();   // atmospheric haze
  const bgGradSecondary = createRef<Circle>(); // counter-balance glow

  // Editorial corner marks (very faint hairlines)
  const cornerMarks = createRefArray<Rect>();
  const folioMark = createRef<Rect>();        // tiny page-corner mark BR

  // Top label "VELLUM" + subtle bracket
  const topMark = createRef<Txt>();
  const topMarkUnderline = createRef<Rect>();
  const topBracketLeft = createRef<Rect>();
  const topBracketRight = createRef<Rect>();

  // Hero title "Issue No. 27" — character refs
  const titleGroup = createRef<Layout>();
  const titleChars = createRefArray<Txt>();
  const TITLE_TEXT = 'Issue No. 27';

  // Bracketing hairline dividers above and below the title
  const dividerAbove = createRef<Rect>();
  const dividerBelow = createRef<Rect>();

  // Subline below
  const subline = createRef<Txt>();
  const sublineDot1 = createRef<Circle>();    // 1px dots between subline words
  const sublineDot2 = createRef<Circle>();

  // Single terracotta accent dot at far right of the title
  const accentDot = createRef<Circle>();
  const accentDotGlow = createRef<Circle>();

  // Tiny page-number indicator far bottom-right
  const pageNumber = createRef<Txt>();
  const pageNumberLine = createRef<Rect>();

  // Tiny "MMXXVI" year mark top-left
  const yearMark = createRef<Txt>();

  // Ambient dust particles — very sparse, low opacity (editorial restraint)
  const dustParticles = createRefArray<Circle>();

  // ─── Scene Graph ────────────────────────────────────────────────────────
  view.add(
    <Layout ref={world} size={[layout.width, layout.height]} scale={1.04}>

      {/* ───── Background layer (slowest parallax) ───── */}
      <Layout ref={bgWorld} size={[layout.width, layout.height]} scale={1}>
        {/* Book paper base */}
        <Rect
          ref={bgPaper}
          size={[layout.width, layout.height]}
          fill={colors.bgWarm}
          opacity={1}
        />

        {/* Multi-layer glow stack — atmospheric warm haze, asymmetric positioning */}
        {/* Outer haze: very large, very soft */}
        <Circle
          ref={bgGradOuter}
          size={2000}
          x={-200}
          y={-100}
          fill={colors.bgCream}
          opacity={0}
          filters={[blur(280)]}
        />
        {/* Mid bloom */}
        <Circle
          ref={bgGradMid}
          size={1200}
          x={composition.thirdX * 0.6}
          y={-composition.thirdY * 0.4}
          fill={colors.accent}
          opacity={0}
          filters={[blur(220)]}
        />
        {/* Inner soft warm glow */}
        <Circle
          ref={bgGradInner}
          size={700}
          x={composition.thirdX * 0.7}
          y={composition.thirdY * 0.2}
          fill={colors.bgCream}
          opacity={0}
          filters={[blur(160)]}
        />
        {/* Secondary glow — opposite corner counterweight */}
        <Circle
          ref={bgGradSecondary}
          size={900}
          x={-composition.thirdX * 0.8}
          y={composition.thirdY * 0.7}
          fill={colors.softNeutral}
          opacity={0}
          filters={[blur(200)]}
        />

        {/* Rim light — directional warm key from top-right (per helper) */}
        {rimLight(colors.accent, 220, 0.12, 'TR')}
      </Layout>

      {/* ───── Mid layer (hairlines, corner marks — slightly more parallax) ───── */}
      <Layout ref={midWorld} size={[layout.width, layout.height]} scale={1}>
        {/* Editorial corner marks — four tiny hairlines */}
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
              size={[32, 1]}
              x={positions[i][0]}
              y={positions[i][1]}
              fill={colors.softNeutral}
              opacity={0}
            />
          );
        })}

        {/* Tiny folio mark — small "27" hairline indicator BR */}
        <Rect
          ref={folioMark}
          size={[1, 18]}
          x={layout.width / 2 - 80}
          y={layout.height / 2 - 100}
          fill={colors.quiet}
          opacity={0}
        />

        {/* Tiny "MMXXVI" year mark — top-left, very wide tracking */}
        <Txt
          ref={yearMark}
          text={'MMXXVI'}
          fontFamily={fonts.accent}
          fontSize={fontSizes.micro}
          fontWeight={fontWeights.accent}
          fill={colors.quiet}
          letterSpacing={6}
          x={-(layout.width / 2 - layout.margin) + 40}
          y={-(layout.height / 2 - layout.margin) + 20}
          opacity={0}
        />

        {/* Page number indicator far BR */}
        <Txt
          ref={pageNumber}
          text={'p.  001'}
          fontFamily={fonts.accent}
          fontSize={fontSizes.micro}
          fontWeight={fontWeights.accent}
          fill={colors.quiet}
          letterSpacing={4}
          x={layout.width / 2 - layout.margin - 30}
          y={layout.height / 2 - layout.margin - 18}
          opacity={0}
        />
        <Rect
          ref={pageNumberLine}
          size={[0, 1]}
          x={layout.width / 2 - layout.margin - 30}
          y={layout.height / 2 - layout.margin - 5}
          fill={colors.softNeutral}
          opacity={0}
        />
      </Layout>

      {/* ───── Top label "VELLUM" mark — far up, wide tracking ───── */}
      <Txt
        ref={topMark}
        text={'VELLUM'}
        fontFamily={fonts.accent}
        fontSize={fontSizes.label}
        fontWeight={fontWeights.accent}
        fill={colors.secondary}
        letterSpacing={effects.trackingMicro}
        y={-380}
        opacity={0}
      />
      {/* Tiny bracket marks flanking VELLUM */}
      <Rect
        ref={topBracketLeft}
        size={[0, 1]}
        x={-80}
        y={-380}
        fill={colors.softNeutral}
        opacity={0}
      />
      <Rect
        ref={topBracketRight}
        size={[0, 1]}
        x={80}
        y={-380}
        fill={colors.softNeutral}
        opacity={0}
      />
      <Rect
        ref={topMarkUnderline}
        size={[0, 1]}
        y={-358}
        fill={colors.softNeutral}
        opacity={0}
      />

      {/* ───── Hairline divider ABOVE title — draws from center ───── */}
      <Rect
        ref={dividerAbove}
        size={[0, 1]}
        y={-110}
        fill={colors.softNeutral}
        opacity={0}
      />

      {/* ───── Hero title group — chars laid out as a flex row ───── */}
      <Layout
        ref={titleGroup}
        layout
        direction={'row'}
        alignItems={'center'}
        justifyContent={'center'}
        y={0}
      >
        {TITLE_TEXT.split('').map((ch, i) => (
          <Txt
            key={`tch-${i}`}
            ref={titleChars}
            text={ch === ' ' ? ' ' : ch}
            fontFamily={fonts.heading}
            fontSize={fontSizes.hero}
            fontWeight={fontWeights.heading}
            fill={colors.primary}
            letterSpacing={effects.trackingHero}
            opacity={0}
            y={28}
          />
        ))}
      </Layout>

      {/* ───── Hairline divider BELOW title ───── */}
      <Rect
        ref={dividerBelow}
        size={[0, 1]}
        y={110}
        fill={colors.softNeutral}
        opacity={0}
      />

      {/* ───── Subline ───── */}
      <Txt
        ref={subline}
        text={'BI - MONTHLY     FASHION     LITERATURE'}
        fontFamily={fonts.accent}
        fontSize={fontSizes.label}
        fontWeight={fontWeights.accent}
        fill={colors.secondary}
        letterSpacing={effects.trackingMicro}
        y={170}
        opacity={0}
      />
      {/* Tiny dot separators in subline (slightly offset to match wide tracking) */}
      <Circle ref={sublineDot1} size={3} x={-130} y={170} fill={colors.quiet} opacity={0} />
      <Circle ref={sublineDot2} size={3} x={130} y={170} fill={colors.quiet} opacity={0} />

      {/* ───── Single terracotta accent dot — quiet punctuation, right of title ───── */}
      {/* Outer glow halo */}
      <Circle
        ref={accentDotGlow}
        size={48}
        x={520}
        y={0}
        fill={colors.accent}
        opacity={0}
        filters={[blur(20)]}
      />
      {/* The dot itself */}
      <Circle
        ref={accentDot}
        size={11}
        x={520}
        y={0}
        fill={colors.accent}
        opacity={0}
      />

      {/* ───── Ambient dust particles — sparse, low opacity ───── */}
      {Array.from({ length: 14 }).map((_, i) => {
        // Pseudo-random distribution, generously spaced
        const ax = -800 + (i * 130) + ((i * 41) % 80) - 40;
        const ay = -380 + ((i * 73) % 700);
        const size = 1 + (i % 3);
        return (
          <Circle
            key={`dust-${i}`}
            ref={dustParticles}
            size={size}
            x={ax}
            y={ay}
            fill={i % 2 === 0 ? colors.softNeutral : colors.quiet}
            opacity={0}
            filters={[blur(1)]}
          />
        );
      })}

      {/* ───── Audio tracks from manifest (if present) ───── */}
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

  // ─── Beat 0 (00:00 – 00:60) — Background settles, atmospheric haze blooms ───
  // Editorial corner marks fade in first (page-establishing detail).
  // Multi-layer glow stack — outer haze first, then mid bloom, then inner.
  yield* all(
    // Corner marks first (lowest priority, anchor the frame)
    sequence(
      0.04,
      ...cornerMarks.map((m) => m.opacity(0.45, 0.35, easeOutCubic) as ThreadGenerator),
    ),
    // Multi-layer glow stack — using the helper
    multiLayerGlow(
      [bgGradInner, bgGradMid, bgGradOuter],
      0.55,
      [0.55, 0.45, 0.7],          // very low peak opacities for paper feel
      [0.04, 0.1, 0],             // outer arrives first
    ),
    // Secondary counter-glow comes up on slower curve
    delay(0.15, bgGradSecondary().opacity(0.5, 0.55, easeOutCubic) as ThreadGenerator),
  );

  // ─── Beat 1 (00:60 – 01:30) — Top mark "VELLUM" + brackets ─────────────────
  yield* all(
    topMark().opacity(0.85, 0.35, easeOutCubic),
    delay(0.06, all(
      topBracketLeft().size([60, 1], 0.3, easeOutQuart),
      topBracketRight().size([60, 1], 0.3, easeOutQuart),
      topBracketLeft().opacity(0.6, 0.28, linear),
      topBracketRight().opacity(0.6, 0.28, linear),
    )),
    delay(0.12, all(
      topMarkUnderline().size([180, 1], 0.3, easeOutQuart),
      topMarkUnderline().opacity(0.5, 0.28, linear),
    )),
    // Year mark fades in concurrently
    delay(0.2, yearMark().opacity(0.7, 0.3, easeOutCubic) as ThreadGenerator),
  );

  // ─── Beat 2 (01:30 – 03:00) — Title character-stagger reveal ──────────────
  // Use charStagger helper with 'opacity-y' technique. Each char rises while fading in.
  yield* charStagger(titleChars, timing.charStagger, 0.35, 'opacity-y');

  // ─── Beat 3 (03:00 – 03:55) — Letter-spacing tightens, dividers, accent dot ─
  // The signature Vellum move: hero text starts loose (16px), tightens (4px)
  // as it "lands". Parallel: dividers draw outward, accent dot appears.
  yield* all(
    // Letter-spacing animation across all chars simultaneously
    ...titleChars.map((c) =>
      c.letterSpacing(effects.trackingTight, timing.trackingTighten, easeOutQuint) as ThreadGenerator,
    ),
    // Divider above grows from center
    delay(0.04, all(
      dividerAbove().size([520, 1], 0.45, easeOutQuint),
      dividerAbove().opacity(0.6, 0.35, linear),
    )),
    // Divider below grows from center, slightly delayed
    delay(0.08, all(
      dividerBelow().size([520, 1], 0.45, easeOutQuint),
      dividerBelow().opacity(0.6, 0.35, linear),
    )),
    // Accent dot punctuation — appears with soft glow halo
    delay(0.18, all(
      accentDot().opacity(1, 0.25, easeOutCubic),
      accentDotGlow().opacity(0.55, 0.4, easeOutCubic),
    )),
  );

  // ─── Beat 4 (03:55 – 04:00) — Subline + dot separators + folio ────────────
  yield* all(
    subline().opacity(0.8, 0.4, easeOutCubic),
    delay(0.1, all(
      sublineDot1().opacity(0.6, 0.25, easeOutCubic),
      sublineDot2().opacity(0.6, 0.25, easeOutCubic),
    )),
    // Folio + page-number marks emerge
    delay(0.15, all(
      folioMark().opacity(0.6, 0.3, easeOutCubic),
      pageNumber().opacity(0.7, 0.3, easeOutCubic),
      pageNumberLine().size([60, 1], 0.3, easeOutQuart),
      pageNumberLine().opacity(0.5, 0.28, linear),
    )),
  );

  // ─── Beat 5 (04:00 – 04:40) — Dust particles + camera pull-out + emphasis ─
  // computeStagger 'wave' offsets for dust. Color emphasis on last char overlaps.
  const dustOffsets = computeStagger(dustParticles.length, 0.35, 'wave');
  const lastIdx = titleChars.length - 1;
  yield* all(
    ...dustParticles.map((p, i) =>
      delay(dustOffsets[i], p.opacity(0.35, 0.3, easeOutCubic) as ThreadGenerator),
    ),
    // Subtle camera pull-out — wrapper scales 1.04 → 1.0
    world().scale(1, 0.4, easeInOutCubic),
    // bgWorld parallax: stays a hair larger for depth
    bgWorld().scale(1.015, 0.4, easeInOutCubic),
    // Color emphasis on the final character "7" — primary → terracotta → primary
    // Inline (not via helper) so it overlaps with the camera move.
    titleChars[lastIdx].fill(colors.accent, 0.12, easeOutCubic) as ThreadGenerator,
  );
  // Brief hold on the accent color, then release
  yield* titleChars[lastIdx].fill(colors.primary, 0.28, easeInOutCubic);

  // ─── Beat 6 (04:40 – 05:00) — Long breath hold (signature pause) ──────────
  yield* breathHold(timing.breathLong);

  // ─── Matched-cut handoff — write hero composition transform for scene 2 ───
  setMatchedCut({
    anchor: 'titleHero',
    position: [0, 0],
    scale: 1,
    rotation: 0,
  });
});
