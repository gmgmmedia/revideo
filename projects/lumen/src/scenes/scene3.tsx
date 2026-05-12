/**
 * Lumen — Scene 3: "Quietly intelligent health. Lumen, 2026."
 *
 * Duration: ~3.2 seconds
 *
 * Patterns demonstrated:
 *   - fadeTransition entry (calm scene-to-scene change)
 *   - Matched-cut continuity (wordmark enters at scene 2 closing transform)
 *   - Mask-wipe reveal for the tagline (compositeOperation)
 *   - Spring physics for the signature dot (OrganicSpring)
 *   - Secondary motion (dot glow lags dot scale by 0.06s)
 *   - Wrapper-camera subtle pull-out for breath
 *   - Easing diversity (easeInOutCubic, easeOutCubic, easeOutQuint, linear)
 */

import {
  makeScene2D,
  Rect, Node, Circle, Layout, Txt,
  blur,
} from '@revideo/2d';
import {
  all, delay, sequence, waitFor,
  createRef, createRefArray, createSignal,
  spring,
  fadeTransition,
  easeInOutCubic, easeOutCubic, easeOutQuint, linear,
  ThreadGenerator,
} from '@revideo/core';
import {
  colors, fonts, fontSizes, fontWeights,
  timing, effects, layout,
  OrganicSpring,
} from '../lib/brand';
import { getMatchedCut } from '../lib/sharedState';

export default makeScene2D('scene3', function* (view) {
  // ─── Fade transition (matches motion_design.transition_vocabulary.scene_change)
  yield* fadeTransition(0.5);

  // ─── Matched-cut entry — pull wordmark transform from scene 2
  const entry = getMatchedCut('wordmark');
  const entryY = entry?.position[1] ?? -360;
  const entryScale = entry?.scale ?? 0.55;

  // ─── Refs ──────────────────────────────────────────────────────────────
  const world = createRef<Layout>();          // wrapper-Layout virtual camera
  const bgWorld = createRef<Layout>();
  const bgWash = createRef<Rect>();
  const bgGlowA = createRef<Circle>();        // left ambient glow
  const bgGlowB = createRef<Circle>();        // right ambient glow (counterpoint)
  const horizonLine = createRef<Rect>();      // subtle horizon hairline

  const wordmarkGroup = createRef<Node>();
  const wordmark = createRef<Txt>();

  const taglineHolder = createRef<Node>();    // cached for mask compositing
  const tagline = createRef<Txt>();
  const taglineMask = createRef<Rect>();
  const taglineDividerTop = createRef<Rect>();
  const taglineDividerBottom = createRef<Rect>();

  const sublineText = createRef<Txt>();
  const yearLabel = createRef<Txt>();

  // Signature dot — spring-driven scale, with lagging glow
  const dot = createRef<Circle>();
  const dotGlow = createRef<Circle>();
  const dotScale = createSignal<number>(0);

  // Ambient sparse particles continuing the visual language
  const ambientDots = createRefArray<Circle>();

  // ─── Scene Graph ────────────────────────────────────────────────────────
  view.add(
    <Layout ref={world} size={[layout.width, layout.height]} scale={1.04}>

      {/* Background layer (parallax slower than world) */}
      <Layout ref={bgWorld} size={[layout.width, layout.height]} scale={1}>
        <Rect
          ref={bgWash}
          size={[layout.width, layout.height]}
          fill={colors.bgLight}
        />

        {/* Twin ambient glows — left warm-linen, right sage. Long fade-in. */}
        <Circle
          ref={bgGlowA}
          size={1600}
          x={-460}
          y={-80}
          fill={colors.accent}
          opacity={0}
          filters={[blur(220)]}
        />
        <Circle
          ref={bgGlowB}
          size={1400}
          x={520}
          y={140}
          fill={colors.secondary}
          opacity={0}
          filters={[blur(220)]}
        />

        {/* Horizon hairline — appears under tagline */}
        <Rect
          ref={horizonLine}
          size={[0, 1]}
          y={120}
          fill={colors.softNeutral}
          opacity={0}
        />
      </Layout>

      {/* Wordmark — enters at scene 2's closing transform */}
      <Node ref={wordmarkGroup} y={entryY} scale={entryScale}>
        <Txt
          ref={wordmark}
          text={'Lumen'}
          fontFamily={fonts.heading}
          fontSize={fontSizes.hero}
          fontWeight={fontWeights.heading}
          fill={colors.primary}
          letterSpacing={-2}
        />
      </Node>

      {/* Tagline group — cached for mask compositing */}
      <Node ref={taglineHolder} y={0} cache>
        <Txt
          ref={tagline}
          text={'Quietly intelligent health.'}
          fontFamily={fonts.heading}
          fontSize={72}
          fontWeight={fontWeights.heading}
          fill={colors.primary}
          letterSpacing={-1.2}
          opacity={1}
        />
        {/* Mask wiping in from the LEFT */}
        <Rect
          ref={taglineMask}
          size={[0, 180]}
          x={-820}
          offsetX={-1}
          fill={colors.primary}
          compositeOperation={'destination-in'}
        />
      </Node>

      {/* Hairline dividers framing tagline */}
      <Rect
        ref={taglineDividerTop}
        size={[0, 1]}
        y={-90}
        fill={colors.softNeutral}
        opacity={0}
      />
      <Rect
        ref={taglineDividerBottom}
        size={[0, 1]}
        y={90}
        fill={colors.softNeutral}
        opacity={0}
      />

      {/* Subline + year */}
      <Txt
        ref={sublineText}
        text={'A FIELD STUDY BY LUMEN'}
        fontFamily={fonts.accent}
        fontSize={fontSizes.label}
        fontWeight={fontWeights.accent}
        fill={colors.secondary}
        letterSpacing={4}
        y={250}
        opacity={0}
      />
      <Txt
        ref={yearLabel}
        text={'— 2026 —'}
        fontFamily={fonts.accent}
        fontSize={16}
        fontWeight={fontWeights.accent}
        fill={colors.secondary}
        letterSpacing={6}
        y={300}
        opacity={0}
      />

      {/* Signature dot (spring-driven) — sits at far right of tagline as a closing punctuation */}
      <Circle
        ref={dotGlow}
        size={56}
        x={500}
        y={0}
        fill={colors.accent}
        opacity={0}
        filters={[blur(20)]}
      />
      <Circle
        ref={dot}
        size={() => 18 * dotScale()}
        x={500}
        y={0}
        fill={colors.primary}
        opacity={() => dotScale() > 0 ? 1 : 0}
      />

      {/* Ambient sparse particles (calm density per motion_design) */}
      {Array.from({ length: 6 }).map((_, i) => {
        const ax = -700 + i * 280 + ((i % 2 === 0) ? 60 : -60);
        const ay = -380 + ((i * 91) % 600);
        return (
          <Circle
            key={`amb3-${i}`}
            ref={ambientDots}
            size={4}
            x={ax}
            y={ay}
            fill={colors.secondary}
            opacity={0}
            filters={[blur(1)]}
          />
        );
      })}
    </Layout>,
  );

  // ─── Beat 0 (00:00 – 00:50) — Background warms up + wordmark settles
  yield* all(
    bgGlowA().opacity(0.6, 0.5, easeOutCubic),
    delay(0.1, bgGlowB().opacity(0.45, 0.5, easeOutCubic)),
    // Wordmark settles from scene 2 entry up by 60px (subtle continuation)
    wordmarkGroup().y(entryY - 60, 0.5, easeInOutCubic),
  );

  // ─── Beat 1 (00:50 – 01:30) — Horizon hairline grows, tagline mask wipes in
  yield* all(
    horizonLine().size([1080, 1], 0.55, easeOutCubic),
    horizonLine().opacity(0.7, 0.4, linear),
    delay(0.15, taglineMask().size([1640, 180], 0.7, easeInOutCubic)),
  );

  // ─── Beat 2 (01:30 – 01:90) — Dividers above and below the tagline
  // Wide-stagger (calm pacing); dividers grow outward from center
  yield* all(
    taglineDividerTop().size([920, 1], 0.5, easeOutCubic),
    taglineDividerTop().opacity(0.5, 0.4, linear),
    delay(0.06, all(
      taglineDividerBottom().size([920, 1], 0.5, easeOutCubic),
      taglineDividerBottom().opacity(0.5, 0.4, linear),
    )),
  );

  // ─── Beat 3 (01:90 – 02:35) — Signature dot springs in with glow follow-through
  // Spring drives scale; glow opacity lags by 0.06s (secondary motion).
  yield* all(
    spring(OrganicSpring, 0, 1, 0.01, (v) => dotScale(v)) as ThreadGenerator,
    delay(0.06, dotGlow().opacity(0.5, 0.4, easeOutCubic) as ThreadGenerator),
  );

  // ─── Beat 4 (02:35 – 02:75) — Subline + year fade in (hierarchy: subline first)
  yield* all(
    sublineText().opacity(0.85, 0.4, easeOutCubic),
    delay(0.1, yearLabel().opacity(0.7, 0.35, easeOutCubic)),
  );

  // Ambient dots arrive last (lowest priority per hierarchy timing)
  yield* sequence(
    0.05,
    ...ambientDots.map((p) => p.opacity(0.4, 0.35, easeOutCubic)),
  );

  // ─── Beat 5 (02:75 – 03:00) — Subtle camera pull-out for breath before fade
  yield* all(
    world().scale(1, 0.4, easeInOutCubic),
    bgWorld().scale(1.015, 0.4, easeInOutCubic),  // very subtle parallax
  );

  // ─── Beat 6 (03:00 – 03:20) — Hold the final composition
  yield* waitFor(0.2);

  // (Render system will fade out via project-level transition or end-of-scene cut)
});
