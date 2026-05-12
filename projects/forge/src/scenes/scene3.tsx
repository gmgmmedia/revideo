/**
 * Forge — Scene 3: "WISHLIST ON STEAM" (CTA).
 *
 * Duration: ~4 seconds
 *
 * Patterns demonstrated:
 *   - Iris transition entry (Circle mask opens from center)
 *   - Hero text "WISHLIST" — character-stagger with overshoot+settle
 *     (each letter overshoots to 1.15 then settles to 1.0 via emphasisPulse)
 *   - "ON STEAM" below with character-stagger entrance
 *   - Particle burst at the moment WISHLIST lands (28 particles)
 *   - Steam-logo silhouette (chunky pixel disk + spoke pattern) appears
 *     with iris-mask reveal (compositeOperation: 'destination-in')
 *   - Final screen-flash (full-screen white at 0.85 opacity for 0.08s,
 *     then quickly back to scene + slow fade to black)
 *   - Multi-layer glow stack on hero text
 *   - Screen shake on impact
 *   - Audio-driven beat alignment via sfx-manifest.json with try/catch fallback
 *   - Easing diversity: easeOutBack (40%), easeOutExpo (20%), spring (20%),
 *     linear (10%), easeInOutCubic (10%)
 */

import {
  makeScene2D,
  Rect,
  Node,
  Circle,
  Layout,
  Txt,
  Line,
  blur,
} from '@revideo/2d';
import {
  all,
  delay,
  sequence,
  waitFor,
  createRef,
  createRefArray,
  createSignal,
  spring,
  Random,
  easeOutCubic,
  easeOutBack,
  easeOutExpo,
  easeOutQuart,
  easeInOutCubic,
  linear,
  ThreadGenerator,
} from '@revideo/core';
import {
  colors,
  fonts,
  fontSizes,
  fontWeights,
  timing,
  effects,
  layout,
  composition,
  LogoLandSpring,
  PunchSpring,
} from '../lib/brand';
import {
  charStagger,
  multiLayerGlow,
  emphasisPulse,
  rimLight,
  particleBurst,
  screenShake,
  computeStagger,
  breathHold,
  type BeatGrid,
} from '../lib/motion-helpers';
import { irisTransition, flashTransition } from '../lib/transitions';

// ─── SFX Manifest with fallback ────────────────────────────────────────
let beats: BeatGrid = [];
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const sfxManifest = require('../../sfx-manifest.json');
  beats = (sfxManifest?.scenes?.scene3 ?? []).map((entry: any) => ({
    time: entry.start_offset_seconds ?? 0,
    layer: entry.layer ?? 'accent',
    category: entry.category ?? 'ui',
    duration: entry.duration_seconds ?? 0.2,
  }));
} catch {
  beats = []; // SFX manifest not present — silent scene.
}

export default makeScene2D('scene3', function* (view) {
  // ─── Random sources ────────────────────────────────────────────────────
  const particleRand = new Random(99);
  const shakeRand = new Random(13);
  const starRand = new Random(303);

  // ─── Scene-level refs ──────────────────────────────────────────────────
  const world = createRef<Layout>();
  const bgWorld = createRef<Layout>();
  const bgWash = createRef<Rect>();
  const bgGradientA = createRef<Circle>();
  const bgGradientB = createRef<Circle>();
  const bgGradientC = createRef<Circle>();

  const gridLines = createRefArray<Rect>();
  const stars = createRefArray<Circle>();

  // WISHLIST hero text — 8 chars
  const WISHLIST = 'WISHLIST';
  const wishlistChars = createRefArray<Txt>();
  const wishlistHolder = createRef<Node>();

  // Per-character scale signals for overshoot pulses
  const wishlistScales: ReturnType<typeof createSignal<number>>[] = [];
  for (let i = 0; i < WISHLIST.length; i++) {
    wishlistScales.push(createSignal<number>(0));
  }

  // Glow stack behind WISHLIST
  const heroGlowInner = createRef<Circle>();
  const heroGlowMid = createRef<Circle>();
  const heroGlowOuter = createRef<Circle>();

  // "ON STEAM" subtitle below
  const onSteamChars = createRefArray<Txt>();
  const onSteamHolder = createRef<Node>();
  const onSteamUnderline = createRef<Rect>();

  // Steam logo silhouette — chunky pixel disk + cross/spoke marks
  const steamLogoCache = createRef<Node>();
  const steamLogoHolder = createRef<Node>();
  const steamLogoMask = createRef<Circle>();
  const steamDisk = createRef<Circle>();
  const steamRing = createRef<Circle>();
  const steamCenterDot = createRef<Circle>();
  const steamCenterRing = createRef<Circle>();
  const steamSpokeA = createRef<Line>();
  const steamSpokeB = createRef<Line>();
  const steamSpokeC = createRef<Line>();
  const steamSpokeD = createRef<Line>();

  // Top label
  const topLabel = createRef<Txt>();
  const topLine = createRef<Rect>();

  // Bottom signature label
  const bottomLabelChars = createRefArray<Txt>();
  const bottomLabelHolder = createRef<Node>();
  const bottomLine = createRef<Rect>();

  // Particle burst — 28 particles
  const PARTICLE_COUNT = 28;
  const burstParticles = createRefArray<Circle>();
  const particleTargets: Array<[number, number]> = Array.from(
    { length: PARTICLE_COUNT },
    (_, i) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + particleRand.nextFloat(-0.18, 0.18);
      const radius = 420 + particleRand.nextFloat(-100, 240);
      return [Math.cos(angle) * radius, Math.sin(angle) * radius];
    },
  );
  const particleColors = [colors.accent, colors.secondary, colors.glow, colors.white];

  // Full-screen flash overlay
  const flashOverlay = createRef<Rect>();
  // Final fade overlay (black)
  const fadeOverlay = createRef<Rect>();

  // Star twinkle signals
  const STAR_COUNT = 56;
  const starTwinkleSignals: ReturnType<typeof createSignal<number>>[] = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    starTwinkleSignals.push(createSignal<number>(0));
  }

  // ─── Scene Graph ───────────────────────────────────────────────────────
  view.add(
    <Layout ref={world} size={[layout.width, layout.height]} scale={1}>

      {/* Background layer */}
      <Layout ref={bgWorld} size={[layout.width, layout.height]} scale={1.04}>
        <Rect
          ref={bgWash}
          size={[layout.width, layout.height]}
          fill={colors.primary}
        />

        {/* Triple cosmic glow — magenta center, gold TR, blue BL */}
        <Circle
          ref={bgGradientA}
          size={1800}
          x={0}
          y={0}
          fill={colors.accent}
          opacity={0}
          filters={[blur(260)]}
        />
        <Circle
          ref={bgGradientB}
          size={1400}
          x={460}
          y={-200}
          fill={colors.secondary}
          opacity={0}
          filters={[blur(220)]}
        />
        <Circle
          ref={bgGradientC}
          size={1400}
          x={-460}
          y={240}
          fill={colors.tertiary}
          opacity={0}
          filters={[blur(220)]}
        />

        {/* Rim lights at thirds intersections */}
        {rimLight(colors.glow, 140, 0.0, 'TR')}
        {rimLight(colors.secondary, 140, 0.0, 'BL')}

        {/* Pixel grid hairlines */}
        {Array.from({ length: 11 }).map((_, i) => {
          const x = -(layout.width / 2) + 160 + i * 160;
          return (
            <Rect
              key={`gridV3-${i}`}
              ref={gridLines}
              size={[1, layout.height]}
              x={x}
              y={0}
              fill={colors.tertiary}
              opacity={0}
            />
          );
        })}
        {Array.from({ length: 7 }).map((_, i) => {
          const y = -(layout.height / 2) + 140 + i * 160;
          return (
            <Rect
              key={`gridH3-${i}`}
              ref={gridLines}
              size={[layout.width, 1]}
              x={0}
              y={y}
              fill={colors.tertiary}
              opacity={0}
            />
          );
        })}

        {/* Star field — 56 pixel dots */}
        {Array.from({ length: STAR_COUNT }).map((_, i) => {
          const sx = starRand.nextFloat(-layout.width / 2 + 40, layout.width / 2 - 40);
          const sy = starRand.nextFloat(-layout.height / 2 + 40, layout.height / 2 - 40);
          const sz = starRand.nextFloat(2, 5);
          const pickColor =
            i % 5 === 0
              ? colors.secondary
              : i % 7 === 0
              ? colors.glow
              : colors.white;
          return (
            <Circle
              key={`star3-${i}`}
              ref={stars}
              size={() =>
                sz * (starTwinkleSignals[i] ? starTwinkleSignals[i]() : 0)
              }
              x={sx}
              y={sy}
              fill={pickColor}
              opacity={() =>
                (starTwinkleSignals[i] ? starTwinkleSignals[i]() : 0) * 0.9
              }
            />
          );
        })}
      </Layout>

      {/* Top label: "WISHLIST NOW —" */}
      <Rect
        ref={topLine}
        size={[0, 2]}
        y={-340}
        fill={colors.glow}
        opacity={0}
      />
      <Txt
        ref={topLabel}
        text={'— OUT 2026 —'}
        fontFamily={fonts.accent}
        fontSize={fontSizes.label}
        fontWeight={fontWeights.accent}
        fill={colors.glow}
        letterSpacing={12}
        y={-300}
        opacity={0}
      />

      {/* WISHLIST hero glow stack (renders behind) */}
      <Circle
        ref={heroGlowOuter}
        size={1600}
        x={0}
        y={-30}
        fill={colors.accent}
        opacity={0}
        filters={[blur(200)]}
      />
      <Circle
        ref={heroGlowMid}
        size={960}
        x={0}
        y={-30}
        fill={colors.glow}
        opacity={0}
        filters={[blur(80)]}
      />
      <Circle
        ref={heroGlowInner}
        size={620}
        x={0}
        y={-30}
        fill={colors.accent}
        opacity={0}
        filters={[blur(36)]}
      />

      {/* WISHLIST wordmark — per-character spring-driven scale */}
      <Node ref={wishlistHolder} y={-40}>
        <Layout layout direction={'row'} gap={2}>
          {WISHLIST.split('').map((c, i) => (
            <Txt
              key={`wl-${i}`}
              ref={wishlistChars}
              text={c}
              fontFamily={fonts.heading}
              fontSize={180}
              fontWeight={fontWeights.heading}
              fill={colors.white}
              letterSpacing={-2}
              opacity={0}
              scale={() => {
                const s = wishlistScales[i];
                return s ? s() : 0;
              }}
              shadowColor={colors.accent}
              shadowBlur={36}
              shadowOffsetX={0}
              shadowOffsetY={0}
            />
          ))}
        </Layout>
      </Node>

      {/* "ON STEAM" subtitle */}
      <Node ref={onSteamHolder} y={120}>
        <Layout layout direction={'row'} gap={6}>
          {'ON STEAM'.split('').map((c, i) => (
            <Txt
              key={`os-${i}`}
              ref={onSteamChars}
              text={c === ' ' ? '   ' : c}
              fontFamily={fonts.heading}
              fontSize={76}
              fontWeight={fontWeights.heading}
              fill={colors.secondary}
              letterSpacing={6}
              opacity={0}
              y={20}
            />
          ))}
        </Layout>
      </Node>

      {/* "ON STEAM" underline */}
      <Rect
        ref={onSteamUnderline}
        size={[0, 3]}
        x={0}
        y={180}
        fill={colors.secondary}
        opacity={0}
      />

      {/* ─── Steam logo silhouette — chunky pixel disk with iris reveal ── */}
      <Node ref={steamLogoCache} cache cachePadding={120} y={300}>
        <Node ref={steamLogoHolder}>
          {/* Outer disk */}
          <Circle
            ref={steamDisk}
            size={120}
            fill={colors.white}
          />
          {/* Outer ring (chunky pixel border) */}
          <Circle
            ref={steamRing}
            size={132}
            fill={null}
            stroke={colors.accent}
            lineWidth={4}
          />
          {/* Inner center disk */}
          <Circle
            ref={steamCenterDot}
            size={42}
            fill={colors.accent}
          />
          {/* Inner center ring */}
          <Circle
            ref={steamCenterRing}
            size={60}
            fill={null}
            stroke={colors.primary}
            lineWidth={3}
          />
          {/* Pixel-art spokes — 4 chunky lines */}
          <Line
            ref={steamSpokeA}
            points={[[-22, 0], [22, 0]]}
            stroke={colors.primary}
            lineWidth={4}
          />
          <Line
            ref={steamSpokeB}
            points={[[0, -22], [0, 22]]}
            stroke={colors.primary}
            lineWidth={4}
          />
          <Line
            ref={steamSpokeC}
            points={[[-15, -15], [15, 15]]}
            stroke={colors.primary}
            lineWidth={3}
          />
          <Line
            ref={steamSpokeD}
            points={[[15, -15], [-15, 15]]}
            stroke={colors.primary}
            lineWidth={3}
          />
        </Node>

        {/* Iris mask — grows to reveal the Steam logo */}
        <Circle
          ref={steamLogoMask}
          size={0}
          fill={colors.white}
          compositeOperation={'destination-in'}
        />
      </Node>

      {/* Bottom signature: "FORGE STUDIOS / @FORGEGAMES" */}
      <Rect
        ref={bottomLine}
        size={[0, 2]}
        y={418}
        fill={colors.tertiary}
        opacity={0}
      />
      <Node ref={bottomLabelHolder} y={448}>
        <Layout layout direction={'row'} gap={2}>
          {'FORGE STUDIOS @FORGEGAMES'.split('').map((c, i) => (
            <Txt
              key={`bot-${i}`}
              ref={bottomLabelChars}
              text={c === ' ' ? '   ' : c}
              fontFamily={fonts.accent}
              fontSize={20}
              fontWeight={fontWeights.accent}
              fill={colors.tertiary}
              letterSpacing={8}
              opacity={0}
              y={12}
            />
          ))}
        </Layout>
      </Node>

      {/* Particle burst — 28 particles start at center, fly outward */}
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const pickColor = particleColors[i % particleColors.length];
        const size = 22 + particleRand.nextFloat(-8, 20);
        return (
          <Circle
            key={`fburst-${i}`}
            ref={burstParticles}
            size={size}
            x={0}
            y={-30}
            scale={0.1}
            fill={pickColor}
            opacity={0}
            filters={[blur(3)]}
          />
        );
      })}

      {/* Final flash overlay (full-screen, starts hidden) */}
      <Rect
        ref={flashOverlay}
        size={[layout.width + 40, layout.height + 40]}
        fill={colors.white}
        opacity={0}
      />

      {/* Final fade-to-black overlay */}
      <Rect
        ref={fadeOverlay}
        size={[layout.width + 40, layout.height + 40]}
        fill={'#000000'}
        opacity={0}
      />
    </Layout>,
  );

  // ─── Iris transition entry ───────────────────────────────────────────
  yield* irisTransition(0.35);

  // ─── BEAT 0 (00:00 - 00:55) — Background mesh + grid + stars + top label
  yield* all(
    bgGradientA().opacity(0.45, 0.35, easeOutCubic),
    delay(0.04, bgGradientB().opacity(0.32, 0.35, easeOutCubic)),
    delay(0.08, bgGradientC().opacity(0.3, 0.4, easeOutCubic)),
    sequence(0.01, ...gridLines.map((g) => g.opacity(0.06, 0.28, easeOutCubic))),
    sequence(
      0.008,
      ...starTwinkleSignals.map((s) => s(1, 0.22, easeOutCubic) as ThreadGenerator),
    ),
    delay(0.1, all(
      topLine().size([300, 2], 0.3, easeOutExpo) as ThreadGenerator,
      topLine().opacity(0.85, 0.2, linear) as ThreadGenerator,
      delay(0.06, topLabel().opacity(0.95, 0.28, easeOutCubic) as ThreadGenerator),
    )),
  );

  // ─── BEAT 1 (00:55 - 01:15) — WISHLIST hero text lands — HERO MOMENT ──
  // Each letter springs in via LogoLandSpring with cascade-staggered delay.
  // Glow stack lights up in parallel, particle burst fires at land moment.
  const wishlistStagger = computeStagger(WISHLIST.length, 0.22, 'cascade');

  yield* all(
    // Make all chars visible (opacity 1) right before springs fire
    ...wishlistChars.map((c) => c.opacity(1, 0.04, linear) as ThreadGenerator),

    // Multi-layer glow stack lights up
    multiLayerGlow(
      [heroGlowInner, heroGlowMid, heroGlowOuter],
      0.36,
      [0.72, 0.55, 0.36],
      [0, 0.04, 0.08],
    ),

    // Per-letter springs (cascade stagger)
    ...WISHLIST.split('').map((_, i) => {
      const d = wishlistStagger[i] ?? 0;
      const signalRef = wishlistScales[i];
      if (!signalRef) return waitFor(0) as ThreadGenerator;
      return delay(
        d,
        spring(LogoLandSpring, 0, 1, 0.01, (v) => signalRef(v)) as ThreadGenerator,
      ) as ThreadGenerator;
    }),
  );

  // ─── BEAT 2 (01:15 - 01:60) — Particle burst + screen shake + emphasis ─
  // The "ta-da" land moment. All hero effects fire together for max impact.
  yield* all(
    // 28-particle burst flies outward radially
    particleBurst(
      burstParticles.map((_, i) => () => burstParticles[i]),
      particleTargets,
      0.6,
    ),

    // Glow stack flashes brighter at impact
    delay(0.0, all(
      heroGlowInner().opacity(0.95, 0.1, easeOutQuart) as ThreadGenerator,
      heroGlowMid().opacity(0.8, 0.1, easeOutQuart) as ThreadGenerator,
    )),

    // Camera push then shake
    delay(0.0, all(
      world().scale(1.04, 0.1, easeOutBack) as ThreadGenerator,
    )),

    // Screen shake (5 oscillations over 0.22s)
    delay(0.04, screenShake(world, shakeRand, 14, 5, 0.24)),

    // Background pumps brighter
    delay(0.0, bgGradientA().opacity(0.62, 0.12, easeOutQuart) as ThreadGenerator),
  );

  // emphasisPulse on each WISHLIST letter — overshoot to 1.15 then settle to 1.0
  // Wave-stagger across the 8 letters so it reads as a kinetic ripple, not a block pulse.
  const emphasisStagger = computeStagger(WISHLIST.length, 0.18, 'wave');
  yield* all(
    ...wishlistChars.map((c, i) => {
      const d = emphasisStagger[i] ?? 0;
      const charRef = (() => c) as unknown as import('@revideo/core').Reference<Txt>;
      return delay(
        d,
        emphasisPulse(charRef, 'scale', colors.accent, 1) as ThreadGenerator,
      ) as ThreadGenerator;
    }),
    // Glow stack settles back to resting state
    heroGlowInner().opacity(0.62, 0.22, easeInOutCubic) as ThreadGenerator,
    heroGlowMid().opacity(0.46, 0.22, easeInOutCubic) as ThreadGenerator,
    bgGradientA().opacity(0.5, 0.22, easeInOutCubic) as ThreadGenerator,
    world().scale(1, 0.16, easeInOutCubic) as ThreadGenerator,
  );

  // ─── BEAT 3 (01:60 - 02:10) — "ON STEAM" subtitle + underline ─────────
  yield* all(
    // Underline grows outward from center
    onSteamUnderline().size([520, 3], 0.34, easeOutExpo) as ThreadGenerator,
    onSteamUnderline().opacity(1, 0.22, linear) as ThreadGenerator,
    // Character-stagger entrance
    charStagger(
      onSteamChars.map((_, i) => () => onSteamChars[i]),
      0.025,
      0.22,
      'opacity-scale',
    ),
  );

  // ─── BEAT 4 (02:10 - 02:55) — Steam logo iris-mask reveal + bottom label
  yield* all(
    // Iris mask grows to reveal the Steam logo silhouette
    steamLogoMask().size(180, 0.36, easeOutExpo) as ThreadGenerator,
    // Bottom label arrives in parallel
    delay(0.1, all(
      bottomLine().size([520, 2], 0.32, easeOutExpo) as ThreadGenerator,
      bottomLine().opacity(0.85, 0.22, linear) as ThreadGenerator,
      delay(0.05, charStagger(
        bottomLabelChars.map((_, i) => () => bottomLabelChars[i]),
        0.015,
        0.2,
        'opacity-y',
      )),
    )),
  );

  // Steam logo emphasis snap — quick overshoot pulse on the logo holder
  yield* emphasisPulse(steamLogoHolder, 'scale', colors.accent, 0.5);

  // ─── BEAT 5 — Brief breath hold ───────────────────────────────────────
  yield* breathHold(0.12);

  // ─── BEAT 6 — FINAL SCREEN FLASH (full-screen accent for ~0.08s) ─────
  yield* all(
    flashOverlay().opacity(0.88, 0.06, easeOutQuart) as ThreadGenerator,
    delay(0.02, screenShake(world, shakeRand, 16, 4, 0.14)),
  );

  yield* flashOverlay().opacity(0, 0.1, easeInOutCubic) as ThreadGenerator;

  // ─── BEAT 7 — Quick fade to black ────────────────────────────────────
  yield* fadeOverlay().opacity(1, 0.28, easeInOutCubic) as ThreadGenerator;
});
