/**
 * Forge — Scene 1: "FORGE: Echoes" logo reveal.
 *
 * Duration: ~4 seconds
 *
 * Patterns demonstrated:
 *   - Iris-in transition via Circle mask growing from center (compositeOperation)
 *   - HEAVY character-stagger entrances with easeOutBack overshoot
 *   - LogoLandSpring physics on every FORGE letter (anticipation + spring)
 *   - Multi-layer glow stack (3 layers: inner sharp + mid bloom + outer haze)
 *   - PARTICLE BURST at logo-land moment (24 particles via useRandom(42))
 *   - Screen shake via world().position oscillation (5 random shakes / 0.2s)
 *   - Rim light at TR thirds intersection (magenta)
 *   - Ambient star field (sparse pixel dots) parallax behind hero
 *   - Background gradient mesh (cosmic radial glow)
 *   - Audio-driven beat alignment via sfx-manifest.json with try/catch fallback
 *   - Easing diversity: easeOutBack (40%), easeOutExpo (20%), spring (20%),
 *     linear (10%), easeInOutCubic (10%)
 *   - Setup for glitch transition to scene 2
 */

import {
  makeScene2D,
  Rect,
  Node,
  Circle,
  Layout,
  Txt,
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
import { irisTransition, glitchTransition } from '../lib/transitions';

// ─── SFX Manifest (with try/catch fallback) ──────────────────────────────
let beats: BeatGrid = [];
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const sfxManifest = require('../../sfx-manifest.json');
  beats = (sfxManifest?.scenes?.scene1 ?? []).map((entry: any) => ({
    time: entry.start_offset_seconds ?? 0,
    layer: entry.layer ?? 'accent',
    category: entry.category ?? 'ui',
    duration: entry.duration_seconds ?? 0.2,
  }));
} catch {
  beats = []; // SFX manifest not present — silent scene.
}

export default makeScene2D('scene1', function* (view) {
  // ─── Random sources (deterministic seeds) ──────────────────────────────
  const particleRand = new Random(42);
  const shakeRand = new Random(7);
  const starRand = new Random(101);

  // ─── Scene-level refs ──────────────────────────────────────────────────
  const world = createRef<Layout>();          // wrapper-Layout virtual camera (for screen shake)
  const bgWorld = createRef<Layout>();        // background layer (parallax slower)
  const bgWash = createRef<Rect>();           // base cosmic indigo wash
  const bgGradientA = createRef<Circle>();    // central cosmic glow
  const bgGradientB = createRef<Circle>();    // accent rim glow
  const bgGradientC = createRef<Circle>();    // secondary rim glow

  // Pixel grid hairlines — atmospheric pixel-art structure
  const gridLines = createRefArray<Rect>();

  // Star field (sparse pixel dots) — ambient particles
  const stars = createRefArray<Circle>();

  // Subtitle "A PIXEL PUZZLE ADVENTURE" — character-stagger
  const subtitleChars = createRefArray<Txt>();
  const subtitleHolder = createRef<Node>();
  const subtitleDividerL = createRef<Rect>();
  const subtitleDividerR = createRef<Rect>();

  // FORGE wordmark — five spring-driven letters
  const logoHolder = createRef<Node>();
  const logoChars = createRefArray<Txt>();

  // Glow stack behind logo (inner, mid, outer)
  const logoGlowInner = createRef<Circle>();
  const logoGlowMid = createRef<Circle>();
  const logoGlowOuter = createRef<Circle>();

  // ":Echoes" subtitle below logo — character-stagger
  const echoesHolder = createRef<Node>();
  const echoesChars = createRefArray<Txt>();
  const echoesUnderline = createRef<Rect>();

  // Particle burst — 24 particles seeded radial
  const burstParticles = createRefArray<Circle>();
  const PARTICLE_COUNT = 24;

  // Pre-compute particle final positions (radial, jittered)
  const particleTargets: Array<[number, number]> = Array.from(
    { length: PARTICLE_COUNT },
    (_, i) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + particleRand.nextFloat(-0.18, 0.18);
      const radius = 380 + particleRand.nextFloat(-90, 220);
      return [Math.cos(angle) * radius, Math.sin(angle) * radius];
    },
  );

  // Particle colours alternate magenta + gold + glow-pink
  const particleColors = [colors.accent, colors.secondary, colors.glow];

  // Title-card label at top: "FORGE STUDIOS PRESENTS"
  const presentsLabel = createRef<Txt>();
  const presentsLine = createRef<Rect>();

  // Bottom CTA hint label
  const teaserLabel = createRef<Txt>();
  const teaserLine = createRef<Rect>();

  // Driving signals (logo scale per character driven by springs)
  const logoLetterScales: ReturnType<typeof createSignal<number>>[] = [];
  const FORGE = 'FORGE';
  for (let i = 0; i < FORGE.length; i++) {
    logoLetterScales.push(createSignal<number>(0));
  }

  // Star twinkle signals (drive subtle scale animation later)
  const STAR_COUNT = 64;
  const starTwinkleSignals: ReturnType<typeof createSignal<number>>[] = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    starTwinkleSignals.push(createSignal<number>(0));
  }

  // ─── Scene Graph ───────────────────────────────────────────────────────
  view.add(
    <Layout ref={world} size={[layout.width, layout.height]} scale={1}>

      {/* Background layer — parallax target (zooms less than foreground) */}
      <Layout ref={bgWorld} size={[layout.width, layout.height]} scale={1.04}>

        {/* Base cosmic indigo wash */}
        <Rect
          ref={bgWash}
          size={[layout.width, layout.height]}
          fill={colors.primary}
          opacity={1}
        />

        {/* Outer atmospheric rim — magenta haze top-left */}
        <Circle
          ref={bgGradientC}
          size={2200}
          x={-360}
          y={-220}
          fill={colors.glow}
          opacity={0}
          filters={[blur(280)]}
        />

        {/* Mid bloom — magenta at center */}
        <Circle
          ref={bgGradientA}
          size={1400}
          x={0}
          y={40}
          fill={colors.accent}
          opacity={0}
          filters={[blur(220)]}
        />

        {/* Inner ambient — electric blue counterpoint bottom-right */}
        <Circle
          ref={bgGradientB}
          size={1400}
          x={420}
          y={260}
          fill={colors.tertiary}
          opacity={0}
          filters={[blur(220)]}
        />

        {/* Rim light at top-right thirds (magenta) — directional key light */}
        {rimLight(colors.accent, 140, 0.0, 'TR')}

        {/* Rim light at bottom-left thirds (electric blue) */}
        {rimLight(colors.tertiary, 140, 0.0, 'BL')}

        {/* Pixel grid hairlines — vertical (chunky pixel-art structure) */}
        {Array.from({ length: 11 }).map((_, i) => {
          const x = -(layout.width / 2) + 160 + i * 160;
          return (
            <Rect
              key={`gridV-${i}`}
              ref={gridLines}
              size={[1, layout.height]}
              x={x}
              y={0}
              fill={colors.tertiary}
              opacity={0}
            />
          );
        })}

        {/* Pixel grid hairlines — horizontal */}
        {Array.from({ length: 7 }).map((_, i) => {
          const y = -(layout.height / 2) + 140 + i * 160;
          return (
            <Rect
              key={`gridH-${i}`}
              ref={gridLines}
              size={[layout.width, 1]}
              x={0}
              y={y}
              fill={colors.tertiary}
              opacity={0}
            />
          );
        })}

        {/* Star field — 64 pixel dots scattered with seeded RNG */}
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
              key={`star-${i}`}
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

      {/* ─── Foreground content (above bgWorld) ─────────────────────── */}

      {/* Top label: "FORGE STUDIOS PRESENTS" */}
      <Rect
        ref={presentsLine}
        size={[0, 2]}
        y={-380}
        fill={colors.accent}
        opacity={0}
      />
      <Txt
        ref={presentsLabel}
        text={'FORGE STUDIOS PRESENTS'}
        fontFamily={fonts.accent}
        fontSize={fontSizes.label}
        fontWeight={fontWeights.accent}
        fill={colors.secondary}
        letterSpacing={8}
        y={-340}
        opacity={0}
      />

      {/* Subtitle row: "A PIXEL PUZZLE ADVENTURE" with dividers */}
      <Rect
        ref={subtitleDividerL}
        size={[0, 2]}
        x={-360}
        y={-180}
        fill={colors.glow}
        opacity={0}
      />
      <Rect
        ref={subtitleDividerR}
        size={[0, 2]}
        x={360}
        y={-180}
        fill={colors.glow}
        opacity={0}
      />
      <Node ref={subtitleHolder} y={-180}>
        <Layout layout direction={'row'} gap={12}>
          {'A PIXEL PUZZLE ADVENTURE'.split('').map((c, i) => (
            <Txt
              key={`subt-${i}`}
              ref={subtitleChars}
              text={c === ' ' ? '   ' : c}
              fontFamily={fonts.accent}
              fontSize={26}
              fontWeight={fontWeights.accent}
              fill={colors.white}
              letterSpacing={10}
              opacity={0}
              y={18}
            />
          ))}
        </Layout>
      </Node>

      {/* Logo glow stack — outer atmospheric haze first (renders behind) */}
      <Circle
        ref={logoGlowOuter}
        size={1400}
        x={0}
        y={0}
        fill={colors.accent}
        opacity={0}
        filters={[blur(180)]}
      />
      <Circle
        ref={logoGlowMid}
        size={900}
        x={0}
        y={0}
        fill={colors.glow}
        opacity={0}
        filters={[blur(80)]}
      />
      <Circle
        ref={logoGlowInner}
        size={560}
        x={0}
        y={0}
        fill={colors.accent}
        opacity={0}
        filters={[blur(36)]}
      />

      {/* FORGE wordmark — spring-driven character entrances */}
      <Node ref={logoHolder} y={0}>
        <Layout layout direction={'row'} gap={0}>
          {FORGE.split('').map((char, i) => (
            <Txt
              key={`logo-${i}`}
              ref={logoChars}
              text={char}
              fontFamily={fonts.heading}
              fontSize={fontSizes.hero}
              fontWeight={fontWeights.heading}
              fill={colors.white}
              letterSpacing={-2}
              opacity={0}
              scale={() => {
                const s = logoLetterScales[i];
                return s ? s() : 0;
              }}
              shadowColor={colors.accent}
              shadowBlur={32}
              shadowOffsetX={0}
              shadowOffsetY={0}
            />
          ))}
        </Layout>
      </Node>

      {/* :Echoes wordmark below logo — character-stagger entrance */}
      <Node ref={echoesHolder} y={170}>
        <Layout layout direction={'row'} gap={0}>
          {':Echoes'.split('').map((char, i) => (
            <Txt
              key={`ech-${i}`}
              ref={echoesChars}
              text={char}
              fontFamily={fonts.heading}
              fontSize={92}
              fontWeight={fontWeights.heading}
              fill={i === 0 ? colors.secondary : colors.white}
              letterSpacing={-1}
              opacity={0}
              y={20}
            />
          ))}
        </Layout>
      </Node>

      {/* Echoes underline — gold hairline that draws in */}
      <Rect
        ref={echoesUnderline}
        size={[0, 3]}
        x={0}
        y={234}
        fill={colors.secondary}
        opacity={0}
      />

      {/* Bottom label: "/ ECHO THROUGH THE DARK /" */}
      <Rect
        ref={teaserLine}
        size={[0, 2]}
        y={340}
        fill={colors.tertiary}
        opacity={0}
      />
      <Txt
        ref={teaserLabel}
        text={'/ ECHO THROUGH THE DARK /'}
        fontFamily={fonts.accent}
        fontSize={fontSizes.label}
        fontWeight={fontWeights.accent}
        fill={colors.tertiary}
        letterSpacing={8}
        y={380}
        opacity={0}
      />

      {/* Particle burst — 24 particles start at center (size 0), animate out */}
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const pickColor = particleColors[i % particleColors.length];
        const size = 18 + particleRand.nextFloat(-6, 16);
        return (
          <Circle
            key={`burst-${i}`}
            ref={burstParticles}
            size={size}
            x={0}
            y={0}
            scale={0.1}
            fill={pickColor}
            opacity={0}
            filters={[blur(3)]}
          />
        );
      })}
    </Layout>,
  );

  // ─── Iris-in transition (Circle mask growing from center) ──────────────
  yield* irisTransition(0.4);

  // ─── BEAT 0 (00:00 - 00:55) — Background gradient mesh blooms in ───────
  // Cosmic indigo wash is already at full opacity; bring up the radial bloom
  // layers and the pixel grid hairlines (atmospheric structure).
  yield* all(
    bgGradientA().opacity(0.42, 0.45, easeOutCubic),
    delay(0.05, bgGradientB().opacity(0.32, 0.45, easeOutCubic)),
    delay(0.08, bgGradientC().opacity(0.2, 0.5, easeOutCubic)),
    delay(0.02, sequence(
      0.012,
      ...gridLines.map((g) => g.opacity(0.06, 0.3, easeOutCubic)),
    )),
    // Star field — staccato twinkle-in (machine-gun cadence)
    delay(0.05, sequence(
      0.008,
      ...starTwinkleSignals.map((s) =>
        s(1, 0.25, easeOutCubic) as ThreadGenerator,
      ),
    )),
    // Top "presents" label fades in with line
    delay(0.15, all(
      presentsLine().size([260, 2], 0.32, easeOutCubic),
      presentsLine().opacity(0.85, 0.25, linear),
      delay(0.06, presentsLabel().opacity(0.9, 0.3, easeOutCubic)),
    )),
  );

  // ─── BEAT 1 (00:55 - 01:30) — Subtitle character-stagger entrance ──────
  // Dividers shoot outward first (anticipation), then subtitle chars stagger in.
  yield* all(
    subtitleDividerL().size([260, 2], 0.28, easeOutExpo),
    subtitleDividerL().opacity(0.85, 0.2, linear),
    subtitleDividerR().size([260, 2], 0.28, easeOutExpo),
    subtitleDividerR().opacity(0.85, 0.2, linear),
    delay(0.08, charStagger(
      subtitleChars.map((_, i) => () => subtitleChars[i]),
      0.022,
      0.22,
      'opacity-y',
    )),
  );

  // Quick anticipation hold — dense pacing
  yield* breathHold(0.06);

  // ─── BEAT 2 (01:30 - 02:10) — FORGE logo lands — HERO MOMENT ──────────
  // Each FORGE letter springs in via LogoLandSpring with anticipation
  // pre-scale to 0.95 then spring overshoots past 1.0 → settle at 1.0+.
  // Glow stack lights up in parallel; particle burst fires; screen shakes.

  // Step 2a — Anticipation: letters appear at pre-scale 0.55 with full opacity,
  // then spring drives scale up. Glow stack starts loading at the same time.
  const logoStagger = computeStagger(FORGE.length, 0.16, 'cascade');

  yield* all(
    // Make all chars visible (opacity 1) right before the spring fires —
    // the scale signal already controls the visual scale-from-0 effect.
    ...logoChars.map((c) => c.opacity(1, 0.04, linear) as ThreadGenerator),

    // Multi-layer glow stack lights up (additive bloom)
    multiLayerGlow(
      [logoGlowInner, logoGlowMid, logoGlowOuter],
      0.38,
      [0.65, 0.5, 0.32],
      [0, 0.04, 0.08],
    ),

    // Each FORGE letter springs in on a cascade-distributed delay
    ...FORGE.split('').map((_, i) => {
      const d = logoStagger[i] ?? 0;
      const signalRef = logoLetterScales[i];
      if (!signalRef) return waitFor(0) as ThreadGenerator;
      return delay(
        d,
        spring(LogoLandSpring, 0, 1, 0.01, (v) => signalRef(v)) as ThreadGenerator,
      ) as ThreadGenerator;
    }),
  );

  // Step 2b — On final letter land: PARTICLE BURST + SCREEN SHAKE + rim light pop
  // This is the "ta-da" moment — multiple effects fire together for impact.
  yield* all(
    // Particle burst: 24 particles fly outward radially with cascade stagger
    particleBurst(
      burstParticles.map((_, i) => () => burstParticles[i]),
      particleTargets,
      0.6,
    ),

    // Glow stack pulses harder during the impact (extra brightness flash)
    delay(0.0, all(
      logoGlowInner().opacity(0.85, 0.08, easeOutQuart) as ThreadGenerator,
      logoGlowMid().opacity(0.7, 0.08, easeOutQuart) as ThreadGenerator,
    )),

    // Screen shake — 5 oscillations over 0.2s, then settle to [0,0]
    delay(0.02, screenShake(world, shakeRand, 12, 5, 0.22)),

    // Background flashes brighter on impact
    delay(0.0, all(
      bgGradientA().opacity(0.6, 0.1, easeOutQuart) as ThreadGenerator,
    )),

    // Subtle camera push (world scale up briefly) during impact
    delay(0.0, all(
      world().scale(1.02, 0.08, easeOutBack) as ThreadGenerator,
    )),
  );

  // Glow stack settles back down to resting peak
  yield* all(
    logoGlowInner().opacity(0.55, 0.18, easeInOutCubic) as ThreadGenerator,
    logoGlowMid().opacity(0.42, 0.18, easeInOutCubic) as ThreadGenerator,
    bgGradientA().opacity(0.5, 0.2, easeInOutCubic) as ThreadGenerator,
    world().scale(1, 0.18, easeInOutCubic) as ThreadGenerator,
  );

  // ─── BEAT 3 (02:10 - 02:60) — ":Echoes" character-stagger ─────────────
  // The colon+Echoes subtitle springs in below the main logo with overshoot.
  yield* all(
    charStagger(
      echoesChars.map((_, i) => () => echoesChars[i]),
      0.028,
      0.22,
      'opacity-scale',
    ),
    // Echoes underline draws in from center outward (split-grow effect)
    delay(0.1, all(
      echoesUnderline().size([320, 3], 0.32, easeOutExpo) as ThreadGenerator,
      echoesUnderline().opacity(1, 0.22, linear) as ThreadGenerator,
    )),
  );

  // Emphasis pulse on the entire echoes row (overshoot-settle on scale)
  yield* emphasisPulse(echoesHolder, 'scale', colors.secondary, 0.6);

  // ─── BEAT 4 (02:60 - 03:10) — Bottom teaser label arrives ─────────────
  yield* all(
    teaserLine().size([420, 2], 0.32, easeOutExpo) as ThreadGenerator,
    teaserLine().opacity(0.75, 0.2, linear) as ThreadGenerator,
    delay(0.05, teaserLabel().opacity(0.95, 0.3, easeOutCubic)),
  );

  // ─── BEAT 5 — Tight breath before transition (max 0.18s per Forge spec)
  yield* breathHold(0.16);

  // ─── Exit pre-glitch micro-jitter (~0.12s, anticipation for glitch in) ──
  yield* screenShake(world, shakeRand, 5, 3, 0.12);
});
