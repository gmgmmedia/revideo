/**
 * Forge — Scene 2: "Three realms, one key."
 *
 * Duration: ~4 seconds
 *
 * Patterns demonstrated:
 *   - Glitch transition entry (RGB-split chromatic aberration)
 *   - Three portal cards positioned ASYMMETRICALLY (NOT centered row)
 *     — varied scale and Y offset to break the row symmetry
 *   - Each portal entrance: anticipation pre-scale + spring overshoot
 *     + per-portal particle burst (LogoLandSpring, then 12 particles each)
 *   - Color cycling: portal 1 magenta, 2 gold, 3 electric blue
 *   - Center "key" element with iris-mask reveal (Circle mask growing)
 *   - emphasisPulse on key hero element ('scale' technique with overshoot)
 *   - Camera pushes in + slight shake during emphasis (world transforms)
 *   - Multi-layer glow stack on the key (3 layers)
 *   - Section label "THREE REALMS, ONE KEY" with character-stagger
 *   - Audio-driven beat alignment via sfx-manifest.json with try/catch fallback
 *   - Heavy easing diversity: easeOutBack, easeOutExpo, spring, linear, easeOutQuart
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
  UISpring,
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
  asymmetricPosition,
  type BeatGrid,
} from '../lib/motion-helpers';
import { glitchTransition, irisTransition } from '../lib/transitions';

// ─── SFX Manifest with fallback ────────────────────────────────────────
let beats: BeatGrid = [];
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const sfxManifest = require('../../sfx-manifest.json');
  beats = (sfxManifest?.scenes?.scene2 ?? []).map((entry: any) => ({
    time: entry.start_offset_seconds ?? 0,
    layer: entry.layer ?? 'accent',
    category: entry.category ?? 'ui',
    duration: entry.duration_seconds ?? 0.2,
  }));
} catch {
  beats = []; // SFX manifest not present — silent scene.
}

// ─── Portal specs — three realms, asymmetric layout ────────────────────
interface PortalSpec {
  label: string;
  glyph: string;            // pixel-style glyph character
  color: string;
  glowColor: string;
  position: [number, number];   // asymmetric — not on a single row
  scale: number;                // varied scales break the symmetry further
}

const PORTALS: PortalSpec[] = [
  {
    label: 'EMBER',
    glyph: '▲',          // ▲ triangle — flame realm
    color: colors.accent,
    glowColor: colors.glow,
    position: [-580, 30],     // left, slight downward bias
    scale: 1.0,
  },
  {
    label: 'AETHER',
    glyph: '●',          // ● circle — sky/spirit realm
    color: colors.secondary,
    glowColor: colors.secondary,
    position: [-40, 240],      // center-bottom (well below key)
    scale: 1.05,                // slightly larger — visual anchor
  },
  {
    label: 'TIDE',
    glyph: '◆',          // ◆ diamond — water/tide realm
    color: colors.tertiary,
    glowColor: colors.tertiary,
    position: [590, 60],       // right, slight downward bias
    scale: 0.94,
  },
];

export default makeScene2D('scene2', function* (view) {
  // ─── Random sources ────────────────────────────────────────────────────
  const burstRand = new Random(73);
  const shakeRand = new Random(11);
  const starRand = new Random(202);

  // ─── Scene-level refs ──────────────────────────────────────────────────
  const world = createRef<Layout>();
  const bgWorld = createRef<Layout>();
  const bgWash = createRef<Rect>();
  const bgGradientA = createRef<Circle>();
  const bgGradientB = createRef<Circle>();

  const gridLines = createRefArray<Rect>();
  const stars = createRefArray<Circle>();

  // Section title "THREE REALMS, ONE KEY"
  const sectionTitleChars = createRefArray<Txt>();
  const sectionTitleHolder = createRef<Node>();
  const sectionLine = createRef<Rect>();

  // Three portals — refs collected per index
  const portalGroups = createRefArray<Node>();
  const portalCards = createRefArray<Rect>();
  const portalGlyphs = createRefArray<Txt>();
  const portalLabels = createRefArray<Txt>();
  const portalGlows = createRefArray<Circle>();
  const portalInnerRings = createRefArray<Circle>();

  // Per-portal particle bursts (12 particles each)
  const PARTICLES_PER_PORTAL = 12;
  const portalBurstParticles: ReturnType<typeof createRefArray<Circle>>[] = PORTALS.map(
    () => createRefArray<Circle>(),
  );

  // Pre-compute per-portal radial targets
  const portalBurstTargets: Array<Array<[number, number]>> = PORTALS.map(() => {
    return Array.from({ length: PARTICLES_PER_PORTAL }, (_, i) => {
      const angle = (i / PARTICLES_PER_PORTAL) * Math.PI * 2 + burstRand.nextFloat(-0.2, 0.2);
      const radius = 140 + burstRand.nextFloat(-30, 80);
      return [Math.cos(angle) * radius, Math.sin(angle) * radius] as [number, number];
    });
  });

  // Per-portal spring-driven scale signals
  const portalScales: ReturnType<typeof createSignal<number>>[] = PORTALS.map(() =>
    createSignal<number>(0),
  );

  // The center "key" element — appears between portals with iris reveal
  const keyHolder = createRef<Node>();
  const keyCacheNode = createRef<Node>();
  const keyMask = createRef<Circle>();
  const keyGlyph = createRef<Txt>();
  const keyRing = createRef<Circle>();
  const keyGlowInner = createRef<Circle>();
  const keyGlowMid = createRef<Circle>();
  const keyGlowOuter = createRef<Circle>();
  const keyLabel = createRef<Txt>();
  const keyLabelLine = createRef<Rect>();

  // Star twinkle signals
  const STAR_COUNT = 48;
  const starTwinkleSignals: ReturnType<typeof createSignal<number>>[] = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    starTwinkleSignals.push(createSignal<number>(0));
  }

  // ─── Scene Graph ───────────────────────────────────────────────────────
  view.add(
    <Layout ref={world} size={[layout.width, layout.height]} scale={1}>

      {/* Background layer (parallax) */}
      <Layout ref={bgWorld} size={[layout.width, layout.height]} scale={1.04}>
        <Rect
          ref={bgWash}
          size={[layout.width, layout.height]}
          fill={colors.primary}
        />

        {/* Twin cosmic glows — magenta top-left, gold bottom-right */}
        <Circle
          ref={bgGradientA}
          size={1700}
          x={-280}
          y={-180}
          fill={colors.accent}
          opacity={0}
          filters={[blur(240)]}
        />
        <Circle
          ref={bgGradientB}
          size={1500}
          x={360}
          y={220}
          fill={colors.secondary}
          opacity={0}
          filters={[blur(220)]}
        />

        {/* Rim lights at thirds intersections */}
        {rimLight(colors.glow, 140, 0.0, 'TL')}
        {rimLight(colors.tertiary, 140, 0.0, 'BR')}

        {/* Pixel grid hairlines */}
        {Array.from({ length: 9 }).map((_, i) => {
          const x = -(layout.width / 2) + 240 + i * 200;
          return (
            <Rect
              key={`gridV2-${i}`}
              ref={gridLines}
              size={[1, layout.height]}
              x={x}
              y={0}
              fill={colors.tertiary}
              opacity={0}
            />
          );
        })}
        {Array.from({ length: 5 }).map((_, i) => {
          const y = -(layout.height / 2) + 220 + i * 180;
          return (
            <Rect
              key={`gridH2-${i}`}
              ref={gridLines}
              size={[layout.width, 1]}
              x={0}
              y={y}
              fill={colors.tertiary}
              opacity={0}
            />
          );
        })}

        {/* Star field — 48 pixel dots */}
        {Array.from({ length: STAR_COUNT }).map((_, i) => {
          const sx = starRand.nextFloat(-layout.width / 2 + 60, layout.width / 2 - 60);
          const sy = starRand.nextFloat(-layout.height / 2 + 60, layout.height / 2 - 60);
          const sz = starRand.nextFloat(2, 4);
          const pickColor =
            i % 4 === 0 ? colors.secondary : i % 6 === 0 ? colors.glow : colors.white;
          return (
            <Circle
              key={`star2-${i}`}
              ref={stars}
              size={() =>
                sz * (starTwinkleSignals[i] ? starTwinkleSignals[i]() : 0)
              }
              x={sx}
              y={sy}
              fill={pickColor}
              opacity={() =>
                (starTwinkleSignals[i] ? starTwinkleSignals[i]() : 0) * 0.85
              }
            />
          );
        })}
      </Layout>

      {/* Section title row — "THREE REALMS, ONE KEY" */}
      <Rect
        ref={sectionLine}
        size={[0, 2]}
        y={-420}
        fill={colors.accent}
        opacity={0}
      />
      <Node ref={sectionTitleHolder} y={-380}>
        <Layout layout direction={'row'} gap={14}>
          {'THREE REALMS, ONE KEY'.split('').map((c, i) => (
            <Txt
              key={`secT-${i}`}
              ref={sectionTitleChars}
              text={c === ' ' ? '   ' : c}
              fontFamily={fonts.accent}
              fontSize={28}
              fontWeight={fontWeights.accent}
              fill={colors.white}
              letterSpacing={6}
              opacity={0}
              y={18}
            />
          ))}
        </Layout>
      </Node>

      {/* ─── Three portals — asymmetric staging ───────────────────── */}
      {PORTALS.map((portal, idx) => {
        const burstRefs = portalBurstParticles[idx] ?? createRefArray<Circle>();
        return (
          <Node
            key={`portal-${idx}`}
            ref={portalGroups}
            x={portal.position[0]}
            y={portal.position[1]}
            scale={() => {
              const s = portalScales[idx];
              return s ? s() : 0;
            }}
          >
            {/* Portal outer glow (atmospheric haze) */}
            <Circle
              ref={portalGlows}
              size={460}
              fill={portal.glowColor}
              opacity={0}
              filters={[blur(80)]}
            />

            {/* Portal inner ring (chunky pixel border) */}
            <Circle
              ref={portalInnerRings}
              size={280}
              fill={null}
              stroke={portal.color}
              lineWidth={6}
              opacity={0}
            />

            {/* Portal card surface */}
            <Rect
              ref={portalCards}
              size={[260, 260]}
              radius={effects.cardRadius}
              fill={colors.bgMid}
              stroke={portal.color}
              lineWidth={3}
              opacity={0}
              shadowColor={colors.shadow}
              shadowBlur={48}
              shadowOffsetY={12}
            />

            {/* Portal glyph (chunky pixel character) */}
            <Txt
              ref={portalGlyphs}
              text={portal.glyph}
              fontFamily={fonts.heading}
              fontSize={140}
              fontWeight={fontWeights.heading}
              fill={portal.color}
              y={-10}
              opacity={0}
              shadowColor={portal.glowColor}
              shadowBlur={24}
            />

            {/* Portal label below glyph */}
            <Txt
              ref={portalLabels}
              text={portal.label}
              fontFamily={fonts.accent}
              fontSize={fontSizes.label}
              fontWeight={fontWeights.accent}
              fill={colors.white}
              letterSpacing={6}
              y={104}
              opacity={0}
            />

            {/* 12 burst particles per portal (start at center, fly outward) */}
            {Array.from({ length: PARTICLES_PER_PORTAL }).map((_, i) => {
              const size = 10 + burstRand.nextFloat(-2, 8);
              return (
                <Circle
                  key={`portalP-${idx}-${i}`}
                  ref={burstRefs}
                  size={size}
                  x={0}
                  y={0}
                  scale={0.1}
                  fill={i % 2 === 0 ? portal.color : portal.glowColor}
                  opacity={0}
                  filters={[blur(2)]}
                />
              );
            })}
          </Node>
        );
      })}

      {/* ─── Center "KEY" hero element with iris-mask reveal ─────────── */}
      {/* Key glow stack (renders behind the cached mask group) */}
      <Circle
        ref={keyGlowOuter}
        size={760}
        x={0}
        y={-110}
        fill={colors.secondary}
        opacity={0}
        filters={[blur(160)]}
      />
      <Circle
        ref={keyGlowMid}
        size={420}
        x={0}
        y={-110}
        fill={colors.accent}
        opacity={0}
        filters={[blur(60)]}
      />
      <Circle
        ref={keyGlowInner}
        size={260}
        x={0}
        y={-110}
        fill={colors.secondary}
        opacity={0}
        filters={[blur(24)]}
      />

      {/* Key cache node — wraps the key with a destination-in mask Circle */}
      <Node ref={keyCacheNode} cache cachePadding={120}>
        <Node ref={keyHolder} x={0} y={-110}>
          {/* Outer ring (chunky pixel border) */}
          <Circle
            ref={keyRing}
            size={280}
            fill={null}
            stroke={colors.secondary}
            lineWidth={6}
          />
          {/* Key glyph — bright gold star */}
          <Txt
            ref={keyGlyph}
            text={'✦'}
            fontFamily={fonts.heading}
            fontSize={180}
            fontWeight={fontWeights.heading}
            fill={colors.secondary}
            shadowColor={colors.glow}
            shadowBlur={30}
          />
        </Node>

        {/* Iris mask — grows from radius 0 to full coverage */}
        <Circle
          ref={keyMask}
          size={0}
          x={0}
          y={-110}
          fill={colors.white}
          compositeOperation={'destination-in'}
        />
      </Node>

      {/* Key label below */}
      <Rect
        ref={keyLabelLine}
        size={[0, 2]}
        y={70}
        fill={colors.glow}
        opacity={0}
      />
      <Txt
        ref={keyLabel}
        text={'THE KEY'}
        fontFamily={fonts.accent}
        fontSize={28}
        fontWeight={fontWeights.accent}
        fill={colors.glow}
        letterSpacing={14}
        y={108}
        opacity={0}
      />
    </Layout>,
  );

  // ─── Glitch transition entry (RGB-split chromatic aberration) ─────────
  yield* glitchTransition(0.3);

  // ─── BEAT 0 (00:00 - 00:35) — Background mesh + grid + stars ──────────
  yield* all(
    bgGradientA().opacity(0.4, 0.35, easeOutCubic),
    delay(0.04, bgGradientB().opacity(0.3, 0.35, easeOutCubic)),
    sequence(0.012, ...gridLines.map((g) => g.opacity(0.06, 0.28, easeOutCubic))),
    sequence(
      0.008,
      ...starTwinkleSignals.map((s) => s(1, 0.2, easeOutCubic) as ThreadGenerator),
    ),
    // Section title row — chunky character-stagger
    delay(0.05, all(
      sectionLine().size([400, 2], 0.3, easeOutExpo) as ThreadGenerator,
      sectionLine().opacity(0.9, 0.2, linear) as ThreadGenerator,
      delay(0.06, charStagger(
        sectionTitleChars.map((_, i) => () => sectionTitleChars[i]),
        0.022,
        0.22,
        'opacity-y',
      )),
    )),
  );

  // ─── BEAT 1 (00:35 - 01:55) — Three portals pop in with anticipation ──
  // Each portal: anticipation pre-scale (signal goes 0 → spring overshoot)
  // + per-portal particle burst + glow lights up. Cascade-staggered across
  // the three so they don't all land at once.
  const portalStagger = computeStagger(PORTALS.length, 0.42, 'cascade');

  yield* all(
    ...PORTALS.map((portal, idx) => {
      const d = portalStagger[idx] ?? 0;
      const scaleSignal = portalScales[idx];
      const burstRefs = portalBurstParticles[idx];
      const burstTargets = portalBurstTargets[idx] ?? [];
      if (!scaleSignal || !burstRefs) return waitFor(0) as ThreadGenerator;

      return delay(
        d,
        all(
          // Card materials fade in just before the spring fires
          portalCards[idx].opacity(1, 0.06, linear) as ThreadGenerator,
          delay(0.02, portalInnerRings[idx].opacity(1, 0.12, easeOutCubic) as ThreadGenerator),
          delay(0.04, portalGlyphs[idx].opacity(1, 0.16, easeOutCubic) as ThreadGenerator),
          delay(0.08, portalLabels[idx].opacity(0.95, 0.18, easeOutCubic) as ThreadGenerator),
          delay(0.02, portalGlows[idx].opacity(0.55, 0.22, easeOutCubic) as ThreadGenerator),

          // SPRING drives the entire portal group scale 0 → overshoot → settle
          spring(LogoLandSpring, 0, 1, 0.01, (v) => scaleSignal(v * portal.scale)) as ThreadGenerator,

          // Per-portal particle burst fires at the moment the spring lands
          delay(
            0.18,
            particleBurst(
              burstRefs.map((_, i) => () => burstRefs[i]),
              burstTargets,
              0.5,
            ) as ThreadGenerator,
          ) as ThreadGenerator,
        ) as ThreadGenerator,
      ) as ThreadGenerator;
    }),
  );

  // ─── BEAT 2 (01:55 - 02:30) — Center KEY iris-reveal ──────────────────
  // Key element materializes with iris mask growing from center 0 → 460.
  // Glow stack fires in parallel; rim light at the key boosts.
  yield* all(
    // Iris mask grows — circle expands revealing the key
    keyMask().size(640, 0.45, easeOutExpo) as ThreadGenerator,

    // Glow stack lights up additively
    multiLayerGlow(
      [keyGlowInner, keyGlowMid, keyGlowOuter],
      0.4,
      [0.85, 0.6, 0.4],
      [0, 0.05, 0.1],
    ),

    // Key label line + text arrive a beat after the iris starts
    delay(0.18, all(
      keyLabelLine().size([240, 2], 0.28, easeOutExpo) as ThreadGenerator,
      keyLabelLine().opacity(0.9, 0.2, linear) as ThreadGenerator,
      delay(0.05, keyLabel().opacity(1, 0.25, easeOutCubic) as ThreadGenerator),
    )),
  );

  // ─── BEAT 3 (02:30 - 02:90) — emphasisPulse on key + camera push-in ──
  // Camera pushes in (world().scale up) + slight shake during emphasis.
  yield* all(
    // Camera push-in (dramatic zoom)
    world().scale(1.18, 0.32, easeOutBack) as ThreadGenerator,
    world().position([0, -10], 0.32, easeOutBack) as ThreadGenerator,

    // Key glow flashes brighter during emphasis
    delay(0.08, all(
      keyGlowInner().opacity(1, 0.1, easeOutQuart) as ThreadGenerator,
      keyGlowMid().opacity(0.8, 0.1, easeOutQuart) as ThreadGenerator,
    )),

    // emphasisPulse on the key holder — overshoot to 1.15 then settle
    delay(0.05, emphasisPulse(keyHolder, 'scale', colors.secondary, 1) as ThreadGenerator),
  );

  // Subtle screen shake while camera is pushed in
  yield* screenShake(world, shakeRand, 6, 4, 0.16);

  // ─── BEAT 4 — Camera pulls back + key glow settles ───────────────────
  yield* all(
    world().scale(1, 0.22, easeInOutCubic) as ThreadGenerator,
    world().position([0, 0], 0.22, easeInOutCubic) as ThreadGenerator,
    keyGlowInner().opacity(0.7, 0.22, easeInOutCubic) as ThreadGenerator,
    keyGlowMid().opacity(0.5, 0.22, easeInOutCubic) as ThreadGenerator,
  );

  // ─── BEAT 5 — Brief breath hold (short for indie energy) + pre-iris pop
  yield* all(
    breathHold(0.14) as ThreadGenerator,
    delay(0.06, keyGlowOuter().opacity(0.6, 0.14, easeOutCubic) as ThreadGenerator),
  );
});
