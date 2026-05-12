/**
 * Vellum — Scene 2: "Three writers, three cities."
 *
 * Duration: ~5.0 seconds
 *
 * Patterns demonstrated:
 *   - Asymmetric staging (NOT centered row): TL large, centerRight medium, BL small
 *   - Three sequential mask-wipe reveals (0.4s stagger)
 *   - Multi-layer glow stack on hero card during focusPull
 *   - Wrapper-Layout camera focusPull (pan + subtle zoom) lands on hero
 *   - Color emphasis pulse on "writers" word (primary → terracotta → primary)
 *   - Character-stagger reveal of section title "Three writers, three cities."
 *   - 4+ distinct easings: easeOutQuint, easeInOutCubic, easeOutCubic,
 *     easeOutQuart, linear
 *   - Hairline tags and serif city labels below each card
 *   - SFX manifest read with try/catch fallback
 *   - Matched-cut writeback for scene 3
 */

import {
  makeScene2D,
  Rect, Node, Circle, Layout, Txt, Line, Audio,
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
  timing, effects, layout, composition,
} from '../lib/brand';
import {
  charStagger, multiLayerGlow, emphasisPulse, rimLight,
  asymmetricPosition, computeStagger, cinematicFade, breathHold,
} from '../lib/motion-helpers';
import { getMatchedCut, setMatchedCut } from '../lib/sharedState';

// ─── SFX manifest read with try/catch fallback ─────────────────────────────
let sceneBeats: Array<{ time: number; volume: number; src?: string }> = [];
try {
  const manifest = require('../../sfx-manifest.json');
  sceneBeats = (manifest?.scenes?.scene2 ?? []).map((e: any) => ({
    time: e.beat_offset ?? 0,
    volume: e.volume ?? 0.4,
    src: e.path ?? undefined,
  }));
} catch {
  // SFX manifest not present — silent scene.
}

// ─── Three asymmetric card specs (NOT a centered row) ──────────────────────
interface CardSpec {
  city: string;
  byline: string;          // tiny micro-label beneath city
  zone: 'TL' | 'centerRight' | 'BL';
  size: [number, number];  // card dimensions
  isHero: boolean;         // largest card — hero of the composition
  shade: string;           // card fill shade (cream variants)
}

const CARDS: CardSpec[] = [
  {
    city: 'PARIS',
    byline: 'on letting the room speak',
    zone: 'TL',
    size: [560, 720],     // largest — top-left hero
    isHero: true,
    shade: colors.bgCream,
  },
  {
    city: 'MEXICO CITY',
    byline: 'on the hour just before noon',
    zone: 'centerRight',
    size: [380, 480],     // medium — center-right
    isHero: false,
    shade: colors.bgWarm,
  },
  {
    city: 'LISBON',
    byline: 'on what the sea forgets',
    zone: 'BL',
    size: [260, 320],     // smallest — bottom-left, far away
    isHero: false,
    shade: colors.bgCream,
  },
];

export default makeScene2D('scene2', function* (view) {
  // ─── Fade-in transition — scene_change vocabulary ──────────────────────
  yield* fadeTransition(0.55);

  // ─── Matched-cut entry — read transform from scene 1 ───────────────────
  const entry = getMatchedCut('titleHero');

  // ─── Refs ───────────────────────────────────────────────────────────────
  const world = createRef<Layout>();
  const bgWorld = createRef<Layout>();
  const bgPaper = createRef<Rect>();
  const bgHazeA = createRef<Circle>();
  const bgHazeB = createRef<Circle>();

  // Editorial structure marks
  const cornerMarks = createRefArray<Rect>();
  const sectionRule = createRef<Rect>();        // tiny diagonal divider
  const pageFolio = createRef<Txt>();
  const issueFolio = createRef<Txt>();

  // Section title group ("Three writers, three cities.")
  const sectionTitleGroup = createRef<Layout>();
  const titleChars = createRefArray<Txt>();
  // The word "writers" needs its own ref for color-pulse emphasis
  // We split into chunks: "Three " + "writers" + ", three cities."
  // Each word/run is its own char-array piece, BUT for color pulse we treat
  // "writers" as its own contiguous group of refs.
  const writersChars = createRefArray<Txt>();   // the 7 letters of "writers"
  const sectionTitleUnderline = createRef<Rect>();

  // Card frames + content
  const cardNodes = createRefArray<Node>();
  const cardFrames = createRefArray<Rect>();
  const cardMasks = createRefArray<Rect>();
  const cardInteriorLines = createRefArray<Line>();    // interior hairlines (3 per card)
  const cardCityLabels = createRefArray<Txt>();
  const cardBylines = createRefArray<Txt>();
  const cardOrnaments = createRefArray<Rect>();   // tiny hairline under city label
  const cardNumbers = createRefArray<Txt>();      // tiny "01", "02", "03"

  // Multi-layer glow on the hero card (3 layers, warm)
  const heroGlowInner = createRef<Circle>();
  const heroGlowMid = createRef<Circle>();
  const heroGlowOuter = createRef<Circle>();

  // Tiny terracotta accent dot floats between cards
  const interCardDot = createRef<Circle>();

  // Caption strip at top of frame
  const captionTopLabel = createRef<Txt>();
  const captionTopBracketLeft = createRef<Rect>();
  const captionTopBracketRight = createRef<Rect>();

  // Helper: resolve asymmetric position by zone
  const zonePositions: Record<CardSpec['zone'], [number, number]> = {
    TL: [-380, -200],          // weighted up-left (rule-of-thirds TL approximate)
    centerRight: [380, 30],     // mid-right
    BL: [-540, 290],            // far down-left
  };

  // ─── Scene Graph ────────────────────────────────────────────────────────
  view.add(
    <Layout ref={world} size={[layout.width, layout.height]} scale={1.02}>

      {/* ───── Background layer ───── */}
      <Layout ref={bgWorld} size={[layout.width, layout.height]}>
        <Rect
          ref={bgPaper}
          size={[layout.width, layout.height]}
          fill={colors.bgWarm}
        />
        {/* Twin atmospheric glows — one near hero card, one counter */}
        <Circle
          ref={bgHazeA}
          size={1400}
          x={-300}
          y={-150}
          fill={colors.bgCream}
          opacity={0.6}
          filters={[blur(220)]}
        />
        <Circle
          ref={bgHazeB}
          size={1000}
          x={500}
          y={250}
          fill={colors.softNeutral}
          opacity={0.4}
          filters={[blur(200)]}
        />
        {/* Rim light from top-right per helper */}
        {rimLight(colors.accent, 220, 0.08, 'TR')}
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

      {/* Tiny diagonal section rule near top */}
      <Rect
        ref={sectionRule}
        size={[0, 1]}
        x={0}
        y={-(layout.height / 2 - 100)}
        fill={colors.softNeutral}
        opacity={0}
      />

      {/* Top section label "FEATURED · ISSUE NO. 27 · CONTRIBUTORS" */}
      <Txt
        ref={captionTopLabel}
        text={'CONTRIBUTORS  '}
        fontFamily={fonts.accent}
        fontSize={fontSizes.label}
        fontWeight={fontWeights.accent}
        fill={colors.secondary}
        letterSpacing={effects.trackingMicro}
        x={0}
        y={-(layout.height / 2 - 60)}
        opacity={0}
      />
      <Rect
        ref={captionTopBracketLeft}
        size={[0, 1]}
        x={-200}
        y={-(layout.height / 2 - 60)}
        fill={colors.softNeutral}
        opacity={0}
      />
      <Rect
        ref={captionTopBracketRight}
        size={[0, 1]}
        x={200}
        y={-(layout.height / 2 - 60)}
        fill={colors.softNeutral}
        opacity={0}
      />

      {/* Page folio + issue folio in bottom corners */}
      <Txt
        ref={pageFolio}
        text={'p. 014 - 023'}
        fontFamily={fonts.accent}
        fontSize={fontSizes.micro}
        fontWeight={fontWeights.accent}
        fill={colors.quiet}
        letterSpacing={4}
        x={-(layout.width / 2 - layout.margin) + 60}
        y={layout.height / 2 - layout.margin - 18}
        opacity={0}
      />
      <Txt
        ref={issueFolio}
        text={'ISSUE  XXVII'}
        fontFamily={fonts.accent}
        fontSize={fontSizes.micro}
        fontWeight={fontWeights.accent}
        fill={colors.quiet}
        letterSpacing={6}
        x={layout.width / 2 - layout.margin - 60}
        y={layout.height / 2 - layout.margin - 18}
        opacity={0}
      />

      {/* ───── Section title group (above cards) ───── */}
      <Layout
        ref={sectionTitleGroup}
        layout
        direction={'row'}
        alignItems={'baseline'}
        justifyContent={'center'}
        y={-440}
      >
        {/* "Three " */}
        {'Three '.split('').map((ch, i) => (
          <Txt
            key={`s2t-a-${i}`}
            ref={titleChars}
            text={ch}
            fontFamily={fonts.heading}
            fontSize={fontSizes.h2}
            fontWeight={fontWeights.heading}
            fill={colors.primary}
            letterSpacing={2}
            opacity={0}
            y={18}
          />
        ))}
        {/* "writers" — separately tracked for color emphasis */}
        {'writers'.split('').map((ch, i) => (
          <Txt
            key={`s2t-b-${i}`}
            ref={writersChars}
            text={ch}
            fontFamily={fonts.heading}
            fontSize={fontSizes.h2}
            fontWeight={fontWeights.heading}
            fill={colors.primary}
            letterSpacing={2}
            opacity={0}
            y={18}
          />
        ))}
        {/* ", three cities." */}
        {', three cities.'.split('').map((ch, i) => (
          <Txt
            key={`s2t-c-${i}`}
            ref={titleChars}
            text={ch}
            fontFamily={fonts.heading}
            fontSize={fontSizes.h2}
            fontWeight={fontWeights.heading}
            fill={colors.primary}
            letterSpacing={2}
            opacity={0}
            y={18}
          />
        ))}
      </Layout>

      {/* Hairline divider under section title */}
      <Rect
        ref={sectionTitleUnderline}
        size={[0, 1]}
        y={-380}
        fill={colors.softNeutral}
        opacity={0}
      />

      {/* ───── Hero glow stack (3 layers) — appears around hero card during focusPull ───── */}
      {/* Outer atmospheric haze */}
      <Circle
        ref={heroGlowOuter}
        size={1100}
        x={zonePositions.TL[0]}
        y={zonePositions.TL[1]}
        fill={colors.accent}
        opacity={0}
        filters={[blur(260)]}
      />
      {/* Mid bloom */}
      <Circle
        ref={heroGlowMid}
        size={700}
        x={zonePositions.TL[0]}
        y={zonePositions.TL[1]}
        fill={colors.bgCream}
        opacity={0}
        filters={[blur(160)]}
      />
      {/* Inner soft halo */}
      <Circle
        ref={heroGlowInner}
        size={420}
        x={zonePositions.TL[0]}
        y={zonePositions.TL[1]}
        fill={colors.bgCream}
        opacity={0}
        filters={[blur(80)]}
      />

      {/* ───── Three asymmetric portrait cards ───── */}
      {CARDS.map((card, i) => {
        const [cx, cy] = zonePositions[card.zone];
        const [cw, ch] = card.size;
        return (
          <Node ref={cardNodes} x={cx} y={cy} key={`card-${i}`} cache>
            {/* Card frame: cream fill + 1px taupe hairline stroke */}
            <Rect
              ref={cardFrames}
              size={[cw, ch]}
              fill={card.shade}
              stroke={colors.softNeutral}
              lineWidth={1}
              radius={effects.cardRadius}
              opacity={1}
              shadowColor={colors.shadow}
              shadowBlur={card.isHero ? 60 : 30}
              shadowOffsetY={card.isHero ? 18 : 8}
            />

            {/* Interior hairlines (top, middle, bottom thirds of card) */}
            {[1, 2, 3].map((seg) => (
              <Line
                key={`cline-${i}-${seg}`}
                ref={cardInteriorLines}
                points={[
                  [-cw / 2 + 24, -ch / 2 + (ch * seg) / 4],
                  [cw / 2 - 24, -ch / 2 + (ch * seg) / 4],
                ]}
                stroke={colors.softNeutral}
                lineWidth={1}
                opacity={0}
                end={0}
              />
            ))}

            {/* Tiny number tag — "01", "02", "03" — top-left of card */}
            <Txt
              ref={cardNumbers}
              text={String(i + 1).padStart(2, '0')}
              fontFamily={fonts.accent}
              fontSize={fontSizes.micro}
              fontWeight={fontWeights.accent}
              fill={colors.quiet}
              letterSpacing={3}
              x={-cw / 2 + 24}
              y={-ch / 2 + 24}
              opacity={0}
            />

            {/* City label — serif, lower-third of card */}
            <Txt
              ref={cardCityLabels}
              text={card.city}
              fontFamily={fonts.heading}
              fontSize={card.isHero ? 36 : 26}
              fontWeight={fontWeights.heading}
              fill={colors.primary}
              letterSpacing={card.isHero ? 4 : 3}
              y={ch / 2 - 90}
              opacity={0}
            />

            {/* Tiny hairline under city label */}
            <Rect
              ref={cardOrnaments}
              size={[0, 1]}
              y={ch / 2 - 64}
              fill={colors.softNeutral}
              opacity={0}
            />

            {/* Byline — sans-serif tiny */}
            <Txt
              ref={cardBylines}
              text={card.byline}
              fontFamily={fonts.body}
              fontSize={card.isHero ? 18 : 14}
              fontWeight={fontWeights.body}
              fill={colors.secondary}
              letterSpacing={1}
              y={ch / 2 - 44}
              opacity={0}
            />

            {/* Mask: starts off-frame to the top, wipes down */}
            <Rect
              ref={cardMasks}
              size={[cw, 0]}
              y={-ch / 2}
              offsetY={-1}
              fill={colors.primary}
              compositeOperation={'destination-in'}
            />
          </Node>
        );
      })}

      {/* Single terracotta accent dot floats between hero and center card */}
      <Circle
        ref={interCardDot}
        size={8}
        x={0}
        y={20}
        fill={colors.accent}
        opacity={0}
      />

      {/* ───── Audio tracks from manifest ───── */}
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

  // ─── Beat 0 (00:00 – 00:40) — Editorial structure (corners, folio, rule) ──
  yield* all(
    sequence(0.04, ...cornerMarks.map((m) => m.opacity(0.5, 0.3, easeOutCubic) as ThreadGenerator)),
    delay(0.05, all(
      sectionRule().size([180, 1], 0.35, easeOutQuart),
      sectionRule().opacity(0.55, 0.3, linear),
    )),
    delay(0.12, all(
      captionTopLabel().opacity(0.8, 0.35, easeOutCubic),
      captionTopBracketLeft().size([60, 1], 0.3, easeOutQuart),
      captionTopBracketRight().size([60, 1], 0.3, easeOutQuart),
      captionTopBracketLeft().opacity(0.55, 0.3, linear),
      captionTopBracketRight().opacity(0.55, 0.3, linear),
    )),
    delay(0.2, all(
      pageFolio().opacity(0.7, 0.3, easeOutCubic),
      issueFolio().opacity(0.7, 0.3, easeOutCubic),
    )),
  );

  // ─── Beat 1 (00:40 – 01:30) — Section title char-stagger reveal ───────────
  // Reveal in 3 phases: "Three " → "writers" → ", three cities." chained.
  const prefixCount = 6;  // "Three " length
  const prefixChars = titleChars.slice(0, prefixCount);
  const suffixChars = titleChars.slice(prefixCount);

  yield* all(
    charStagger(prefixChars, timing.charStagger, 0.32, 'opacity-y'),
    delay(prefixCount * timing.charStagger, all(
      // Underline grows in parallel with "writers"
      sectionTitleUnderline().size([720, 1], 0.4, easeOutQuint),
      sectionTitleUnderline().opacity(0.5, 0.3, linear),
      // "writers" chars reveal with same stagger
      charStagger([...writersChars], timing.charStagger, 0.32, 'opacity-y'),
    )),
    delay((prefixCount + writersChars.length) * timing.charStagger,
      charStagger(suffixChars, timing.charStagger, 0.32, 'opacity-y'),
    ),
  );

  // ─── Beat 2 (01:50 – 02:60) — Three asymmetric cards mask-wipe in ─────────
  // 0.3s stagger between cards. All three dispatched in parallel via all().
  const cardStaggerOffsets = computeStagger(CARDS.length, 0.6, 'linear');

  yield* all(
    ...CARDS.map((card, i) => {
      const [, ch] = card.size;
      const isHero = card.isHero;
      return delay(cardStaggerOffsets[i],
        all(
          // Mask wipes down — reveals card from top
          cardMasks[i].size([card.size[0], ch], 0.4, easeOutQuint),
          // Card number "01", "02", "03" fades in late
          delay(0.18, cardNumbers[i].opacity(0.7, 0.25, easeOutCubic) as ThreadGenerator),
          // Interior hairlines draw in sequence
          delay(0.1, all(
            ...cardInteriorLines
              .slice(i * 3, (i + 1) * 3)
              .map((l, k) => delay(k * 0.04,
                all(
                  l.end(1, 0.3, easeOutQuint),
                  l.opacity(0.55, 0.25, linear),
                ) as ThreadGenerator,
              )),
          )),
          // City label rises with opacity
          delay(0.22, all(
            cardCityLabels[i].opacity(1, 0.32, easeOutCubic),
            cardCityLabels[i].y(ch / 2 - 96, 0.32, easeOutQuint),
          )),
          // Hairline under city label grows
          delay(0.32, all(
            cardOrnaments[i].size([isHero ? 200 : 140, 1], 0.3, easeOutQuint),
            cardOrnaments[i].opacity(0.55, 0.28, linear),
          )),
          // Byline fades in last
          delay(0.38, cardBylines[i].opacity(0.85, 0.3, easeOutCubic) as ThreadGenerator),
        ) as ThreadGenerator,
      ) as ThreadGenerator;
    }),
  );

  // ─── Beat 3 (02:60 – 03:35) — Focus pull onto hero card (TL) with glow ────
  // Camera zooms toward TL position; hero glow stack fades in.
  // Color shift on "writers" — primary → terracotta (with wave stagger) → primary.
  const [heroX, heroY] = zonePositions.TL;
  yield* all(
    // Camera focusPull — pan toward hero card + subtle zoom
    world().position([-heroX * 0.35, -heroY * 0.35], 0.7, easeInOutCubic),
    world().scale(1.12, 0.7, easeInOutCubic),
    bgWorld().scale(1.08, 0.7, easeInOutCubic),
    // Multi-layer glow stack on hero card via helper
    multiLayerGlow(
      [heroGlowInner, heroGlowMid, heroGlowOuter],
      0.55,
      [0.4, 0.3, 0.2],
      [0, 0.06, 0.12],
    ),
    // Color shift on "writers" — wave-staggered fill from primary → terracotta.
    delay(0.15, sequence(
      0.03,
      ...writersChars.map((c) =>
        c.fill(colors.accent, 0.18, easeOutCubic) as ThreadGenerator,
      ),
    )),
    // Inter-card terracotta dot blinks in as quiet punctuation
    delay(0.3, interCardDot().opacity(0.9, 0.25, easeOutCubic) as ThreadGenerator),
  );

  // ─── Beat 4 (03:35 – 03:75) — Quick hold + return "writers" to primary ────
  yield* all(
    breathHold(0.4),
    delay(0.05, sequence(
      0.03,
      ...writersChars.map((c) =>
        c.fill(colors.primary, 0.3, easeInOutCubic) as ThreadGenerator,
      ),
    )),
  );

  // ─── Beat 5 (03:75 – 04:25) — Camera pulls back to reveal all three ──────
  yield* all(
    world().position(0, 0.5, easeInOutCubic),
    world().scale(1.02, 0.5, easeInOutCubic),
    bgWorld().scale(1, 0.5, easeInOutCubic),
    // Hero glow softens as camera retreats — atmospheric, not lost
    heroGlowInner().opacity(0.15, 0.5, easeInOutCubic),
    heroGlowMid().opacity(0.1, 0.5, easeInOutCubic),
    heroGlowOuter().opacity(0.06, 0.5, easeInOutCubic),
  );

  // ─── Beat 6 — Final brief breath + matched-cut writeback ──────────────────
  yield* breathHold(0.3);

  setMatchedCut({
    anchor: 'sectionEnd',
    position: [0, 0],
    scale: 1,
    rotation: 0,
  });
});
