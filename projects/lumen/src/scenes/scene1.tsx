/**
 * Lumen — Scene 1: "What if your data wasn't a competition?"
 *
 * Duration: ~4.5 seconds
 *
 * Patterns demonstrated:
 *   - Wrapper-Layout virtual camera (push-in + pull-out parallax)
 *   - Spring physics (OrganicSpring for the breathing orb)
 *   - Mask reveal (compositeOperation destination-in for the wordmark)
 *   - Secondary motion (glow lags shape; particle trail)
 *   - Hierarchy timing (orb → wordmark → curve → ambient particles)
 *   - Easing diversity (easeInOutCubic, easeOutCubic, easeOutQuart, linear)
 *   - Matched-cut handoff (writes wordmark transform for scene 2)
 */

import {
  makeScene2D,
  Rect, Node, Circle, Layout, Txt, Path,
  blur,
} from '@revideo/2d';
import {
  all, delay, sequence, waitFor,
  createRef, createRefArray, createSignal,
  spring,
  easeInOutCubic, easeOutCubic, easeOutQuart, linear,
  ThreadGenerator,
} from '@revideo/core';
import {
  colors, fonts, fontSizes, fontWeights,
  timing, effects, layout,
  OrganicSpring,
  staggerMarch,
} from '../lib/brand';
import { setMatchedCut } from '../lib/sharedState';

export default makeScene2D('scene1', function* (view) {
  // ─── Refs ──────────────────────────────────────────────────────────────
  const world = createRef<Layout>();          // wrapper-Layout camera
  const bgWorld = createRef<Layout>();        // background layer (parallax slower)
  const bgWash = createRef<Rect>();           // soft cream wash
  const bgGlow = createRef<Circle>();         // ambient warm-linen glow
  const sageCurve = createRef<Path>();        // editorial sage curve illustration

  const orb = createRef<Circle>();            // breathing sage orb
  const orbGlow = createRef<Circle>();        // soft warm glow behind orb (follows)
  const orbHalo = createRef<Circle>();        // outer halo (lags orb)

  const wordmarkGroup = createRef<Node>();    // wordmark + masked container
  const wordmark = createRef<Txt>();          // "Lumen" wordmark
  const wordmarkMask = createRef<Rect>();     // mask that wipes across wordmark
  const wordmarkUnderline = createRef<Rect>();// hairline beneath wordmark

  const captionText = createRef<Txt>();
  const captionLine = createRef<Rect>();      // hairline divider above caption

  const particles = createRefArray<Circle>(); // ambient sparse particles
  const dustParticles = createRefArray<Circle>(); // very subtle dust trail
  const cornerMarks = createRefArray<Rect>(); // tiny corner markers (editorial detail)

  // Signals driving spring-based motion
  const orbBreathScale = createSignal<number>(0);
  const orbBreathOpacity = createSignal<number>(0);

  // ─── Scene Graph ────────────────────────────────────────────────────────
  view.add(
    <Layout ref={world} size={[layout.width, layout.height]} scale={1.05}>
      {/* Background layer — parallax target (zooms less than foreground) */}
      <Layout ref={bgWorld} size={[layout.width, layout.height]} scale={1}>
        <Rect
          ref={bgWash}
          size={[layout.width, layout.height]}
          fill={colors.bgLight}
          opacity={1}
        />

        {/* Soft ambient warm-linen glow — very large blur, low opacity */}
        <Circle
          ref={bgGlow}
          size={1600}
          x={-220}
          y={-120}
          fill={colors.accent}
          opacity={0}
          filters={[blur(220)]}
        />

        {/* Editorial sage curve — appears as the camera pulls out */}
        <Path
          ref={sageCurve}
          data={
            'M -900,180 ' +
            'C -500,40 -200,260 60,140 ' +
            'C 320,30 600,200 900,80'
          }
          stroke={colors.secondary}
          lineWidth={1.5}
          opacity={0}
          end={0}
          y={120}
        />

        {/* Tiny corner editorial markers — hairlines in opposite corners */}
        {Array.from({ length: 4 }).map((_, i) => {
          const positions: [number, number][] = [
            [-(layout.width / 2 - 80), -(layout.height / 2 - 80)],
            [layout.width / 2 - 80, -(layout.height / 2 - 80)],
            [-(layout.width / 2 - 80), layout.height / 2 - 80],
            [layout.width / 2 - 80, layout.height / 2 - 80],
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
      </Layout>

      {/* Foreground layer — orb, wordmark, particles. Lives outside bgWorld for parallax. */}

      {/* Orb halo (outer, lags orb scale) */}
      <Circle
        ref={orbHalo}
        size={460}
        fill={colors.accent}
        opacity={0}
        filters={[blur(80)]}
      />

      {/* Orb glow (mid, follows orb by 0.05s) */}
      <Circle
        ref={orbGlow}
        size={280}
        fill={colors.secondary}
        opacity={0}
        filters={[blur(36)]}
      />

      {/* Orb itself — spring-driven scale */}
      <Circle
        ref={orb}
        size={() => 180 * orbBreathScale()}
        fill={colors.secondary}
        opacity={() => orbBreathOpacity()}
      />

      {/* Wordmark group — cached for mask compositing */}
      <Node ref={wordmarkGroup} y={260} cache>
        <Txt
          ref={wordmark}
          text={'Lumen'}
          fontFamily={fonts.heading}
          fontSize={fontSizes.hero}
          fontWeight={fontWeights.heading}
          fill={colors.primary}
          letterSpacing={-2}
          opacity={1}
        />
        {/* Mask: starts off-frame to the left, wipes right-ward, revealing wordmark */}
        <Rect
          ref={wordmarkMask}
          size={[0, 200]}
          x={-360}
          offsetX={-1}
          fill={colors.primary}
          compositeOperation={'destination-in'}
        />
      </Node>

      {/* Hairline underline below wordmark (appears via secondary motion) */}
      <Rect
        ref={wordmarkUnderline}
        size={[0, 1]}
        y={325}
        fill={colors.softNeutral}
        opacity={0}
      />

      {/* Caption hairline + label above orb */}
      <Rect
        ref={captionLine}
        size={[0, 1]}
        y={-280}
        fill={colors.softNeutral}
        opacity={0}
      />
      <Txt
        ref={captionText}
        text={'A FIELD STUDY IN STILLNESS'}
        fontFamily={fonts.accent}
        fontSize={fontSizes.label}
        fontWeight={fontWeights.accent}
        fill={colors.secondary}
        letterSpacing={4}
        y={-240}
        opacity={0}
      />

      {/* Ambient sparse particles — sage dots that drift very slowly */}
      {Array.from({ length: 8 }).map((_, i) => {
        const ax = -700 + (i * 200) + (i % 2 === 0 ? 40 : -40);
        const ay = -300 + ((i * 73) % 600);
        return (
          <Circle
            key={`amb-${i}`}
            ref={particles}
            size={5}
            x={ax}
            y={ay}
            fill={colors.secondary}
            opacity={0}
            filters={[blur(1)]}
          />
        );
      })}

      {/* Trailing dust — even smaller, very subtle */}
      {Array.from({ length: 14 }).map((_, i) => {
        const ax = -800 + i * 120 + ((i * 13) % 60);
        const ay = -100 + ((i * 47) % 220);
        return (
          <Circle
            key={`dust-${i}`}
            ref={dustParticles}
            size={2}
            x={ax}
            y={ay}
            fill={colors.accent}
            opacity={0}
          />
        );
      })}
    </Layout>,
  );

  // ─── Beat 0 (00:00 – 00:80) — Background wash + corner marks settle in
  yield* all(
    bgWash().opacity(1, 0.1),
    bgGlow().opacity(0.7, 0.7, easeOutCubic),
    sequence(0.06, ...cornerMarks.map((m) => m.opacity(0.6, 0.4, easeOutCubic))),
  );

  // ─── Beat 1 (00:80 – 01:60) — Orb breathes in using spring + glow follow-through
  // Spring drives the scale; opacity follows behind by 0.04s (secondary motion).
  yield* all(
    spring(OrganicSpring, 0, 1, 0.01, (v) => orbBreathScale(v)) as ThreadGenerator,
    delay(0.04, orbBreathOpacity(0.85, 0.45, easeInOutCubic) as ThreadGenerator),
    delay(0.08, orbGlow().opacity(0.55, 0.4, easeOutCubic) as ThreadGenerator),
    delay(0.12, orbHalo().opacity(0.35, 0.5, easeOutCubic) as ThreadGenerator),
  );

  // ─── Beat 2 (01:60 – 02:50) — Wordmark mask-wipes in from left
  // Mask grows from width 0 to 720 over 0.6s; underline appears with 0.08s lag (follow-through).
  yield* all(
    wordmarkMask().size([720, 200], 0.6, easeInOutCubic),
    delay(0.15, all(
      wordmarkUnderline().size([320, 1], 0.45, easeOutCubic),
      wordmarkUnderline().opacity(1, 0.3, linear),
    )),
    delay(0.32, all(
      captionLine().size([240, 1], 0.35, easeOutCubic),
      captionLine().opacity(0.7, 0.3, linear),
    )),
    delay(0.4, captionText().opacity(0.85, 0.35, easeOutCubic)),
  );

  // ─── Beat 3 (02:50 – 03:00) — Wrapper camera pulls back, revealing sage curve
  // Camera scales the world wrapper from 1.05 → 1.0; bg curve appears via stroke draw.
  yield* all(
    world().scale(1, 0.6, easeInOutCubic),
    sageCurve().opacity(0.6, 0.55, easeOutCubic),
    sageCurve().end(1, 0.7, easeOutQuart),
    // Background parallax: bgWorld stays at scale 1 → 1.02 (very subtle depth)
    bgWorld().scale(1.02, 0.6, easeInOutCubic),
  );

  // ─── Beat 4 (03:00 – 03:50) — Ambient particles fade in (march stagger)
  // Wave stagger to give an organic, breathing presence.
  yield* sequence(
    0.05,
    ...particles.map((p) => p.opacity(0.4, 0.4, easeOutCubic)),
  );

  // Dust particles arrive on a slower cascade (sparse ambient)
  yield* staggerMarch(
    dustParticles.map((p) => p.opacity(0.3, 0.4, easeOutCubic) as ThreadGenerator),
    0.03,
  ).reduce<ThreadGenerator>((prev, cur) => {
    // Combine all delayed generators into a single parallel sequence
    return all(prev, cur) as ThreadGenerator;
  }, waitFor(0) as ThreadGenerator);

  // ─── Beat 5 (03:50 – 04:50) — Generous hold (calm pacing)
  yield* waitFor(timing.hold);

  // ─── Matched-cut handoff — write wordmark closing transform for scene 2
  setMatchedCut({
    anchor: 'wordmark',
    position: [wordmarkGroup().position().x, wordmarkGroup().position().y],
    scale: 1,
    rotation: 0,
  });

  // Brief soft hold before scene transition
  yield* waitFor(0.2);
});
