/**
 * Scene 2A: "Introducing FGRD"
 * Duration: ~1.5 seconds (V4: faster, reordered)
 *
 * Visual: Centered FGRD logo reveal with premium glow treatment
 * V4: "Introducing" appears FIRST, then logo. Removed FGRD bottom text.
 * Style: 6-layer glow, portal grid, crystalline particles, glass reflections
 */

import { makeScene2D } from '@revideo/2d';
import { Rect, Node, Circle, Txt, Img, blur } from '@revideo/2d';
import {
  all,
  delay,
  waitFor,
  createRef,
  easeOutCubic,
  easeInOutCubic,
  easeOutBack,
  easeInOutQuad,
  linear,
} from '@revideo/core';

import { colors, fonts, fontSizes, fontWeights, timing, layout } from '../lib/brand';
import fgrdLogo from '../../FGRD_Color and White.svg';

export default makeScene2D('scene2a', function* (view) {
  view.fill(colors.background);

  const bgGlow = createRef<Circle>();
  const bgGlowSecondary = createRef<Circle>();
  const bgGlowTertiary = createRef<Circle>();
  const bgGlowDeep = createRef<Circle>();
  const bgGlowPulse = createRef<Circle>();

  const vignetteTopLeft = createRef<Circle>();
  const vignetteTopRight = createRef<Circle>();
  const vignetteBottomLeft = createRef<Circle>();
  const vignetteBottomRight = createRef<Circle>();

  const portalContainer = createRef<Node>();
  const portalRings: Array<ReturnType<typeof createRef<Circle>>> = [];
  for (let i = 0; i < 10; i++) {
    portalRings.push(createRef<Circle>());
  }

  const radialGridContainer = createRef<Node>();
  const radialLines: Array<ReturnType<typeof createRef<Rect>>> = [];
  for (let i = 0; i < 16; i++) {
    radialLines.push(createRef<Rect>());
  }

  const crystalContainer = createRef<Node>();
  const crystals: Array<ReturnType<typeof createRef<Rect>>> = [];
  for (let i = 0; i < 12; i++) {
    crystals.push(createRef<Rect>());
  }

  const orbitContainer = createRef<Node>();
  const orbitParticles: Array<ReturnType<typeof createRef<Circle>>> = [];
  for (let i = 0; i < 24; i++) {
    orbitParticles.push(createRef<Circle>());
  }

  const innerParticleContainer = createRef<Node>();
  const innerParticles: Array<ReturnType<typeof createRef<Circle>>> = [];
  for (let i = 0; i < 16; i++) {
    innerParticles.push(createRef<Circle>());
  }

  const shimmerContainer = createRef<Node>();
  const shimmerLines: Array<ReturnType<typeof createRef<Rect>>> = [];
  for (let i = 0; i < 8; i++) {
    shimmerLines.push(createRef<Rect>());
  }

  const pulseWave1 = createRef<Circle>();
  const pulseWave2 = createRef<Circle>();
  const pulseWave3 = createRef<Circle>();
  const pulseWave4 = createRef<Circle>();

  const logoContainer = createRef<Node>();
  const logo = createRef<Img>();
  const logoGlowShadow = createRef<Circle>();
  const logoGlowOuter = createRef<Circle>();
  const logoGlowMid = createRef<Circle>();
  const logoGlowInner = createRef<Circle>();
  const logoGlowCore = createRef<Circle>();
  const logoPulseRing = createRef<Circle>();
  const logoPulseRing2 = createRef<Circle>();
  const logoPulseRing3 = createRef<Circle>();

  const glassReflection = createRef<Rect>();
  const glassHighlight = createRef<Rect>();
  const glassShine = createRef<Rect>();

  const introText = createRef<Txt>();
  const introTextGlow = createRef<Txt>();
  const introTextGlowOuter = createRef<Txt>();

  // V4: Removed brandText refs (FGRD bottom text removed)

  const accentLineLeft = createRef<Rect>();
  const accentLineRight = createRef<Rect>();
  const accentDotLeft = createRef<Circle>();
  const accentDotRight = createRef<Circle>();
  const accentLineLeftGlow = createRef<Rect>();
  const accentLineRightGlow = createRef<Rect>();

  const cornerAccentTL = createRef<Rect>();
  const cornerAccentTR = createRef<Rect>();
  const cornerAccentBL = createRef<Rect>();
  const cornerAccentBR = createRef<Rect>();

  const RADIAL_COUNT = 16;
  const radialAngles = Array.from({ length: RADIAL_COUNT }, (_, i) => (i * 360) / RADIAL_COUNT);

  const portalSizes = [80, 120, 160, 200, 250, 310, 380, 460, 550, 650];

  const crystalPositions = [
    { x: -320, y: -140, size: 45, rotation: 15, delay: 0 },
    { x: 340, y: -120, size: 40, rotation: -20, delay: 0.08 },
    { x: -240, y: 170, size: 35, rotation: 45, delay: 0.12 },
    { x: 280, y: 200, size: 42, rotation: -30, delay: 0.16 },
    { x: -400, y: 60, size: 30, rotation: 60, delay: 0.1 },
    { x: 420, y: 30, size: 32, rotation: -45, delay: 0.14 },
    { x: -180, y: -240, size: 38, rotation: 30, delay: 0.06 },
    { x: 200, y: -220, size: 40, rotation: -15, delay: 0.18 },
    { x: -360, y: -220, size: 28, rotation: 75, delay: 0.04 },
    { x: 380, y: -200, size: 26, rotation: -60, delay: 0.2 },
    { x: -300, y: 280, size: 34, rotation: 25, delay: 0.22 },
    { x: 320, y: 300, size: 30, rotation: -35, delay: 0.24 },
  ];

  const orbitRadius = [140, 180, 220, 200, 160, 190, 210, 170];
  const orbitParticlePositions = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 15) * (Math.PI / 180);
    const r = orbitRadius[i % 8];
    return {
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      size: 3 + (i % 4),
      delay: i * 0.025,
    };
  });

  const innerParticlePositions = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * 22.5) * (Math.PI / 180);
    const r = 60 + (i % 3) * 25;
    return {
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      size: 2 + (i % 3),
      delay: i * 0.02,
    };
  });

  const shimmerPositions = [
    { y: -300, width: 500, delay: 0 },
    { y: -200, width: 600, delay: 0.08 },
    { y: -100, width: 550, delay: 0.16 },
    { y: 0, width: 580, delay: 0.12 },
    { y: 100, width: 520, delay: 0.2 },
    { y: 200, width: 480, delay: 0.24 },
    { y: 300, width: 440, delay: 0.28 },
    { y: 350, width: 400, delay: 0.32 },
  ];

  view.add(
    <>
      <Circle
        ref={bgGlowDeep}
        size={2400}
        fill={colors.background}
        opacity={1}
        x={0}
        y={0}
      />

      <Circle
        ref={vignetteTopLeft}
        size={800}
        fill={'#000000'}
        opacity={0}
        x={-layout.width / 2}
        y={-layout.height / 2}
        filters={[blur(200)]}
      />
      <Circle
        ref={vignetteTopRight}
        size={800}
        fill={'#000000'}
        opacity={0}
        x={layout.width / 2}
        y={-layout.height / 2}
        filters={[blur(200)]}
      />
      <Circle
        ref={vignetteBottomLeft}
        size={800}
        fill={'#000000'}
        opacity={0}
        x={-layout.width / 2}
        y={layout.height / 2}
        filters={[blur(200)]}
      />
      <Circle
        ref={vignetteBottomRight}
        size={800}
        fill={'#000000'}
        opacity={0}
        x={layout.width / 2}
        y={layout.height / 2}
        filters={[blur(200)]}
      />

      <Circle
        ref={bgGlow}
        size={1200}
        fill={colors.primary}
        opacity={0.04}
        x={0}
        y={0}
        filters={[blur(320)]}
      />
      <Circle
        ref={bgGlowSecondary}
        size={800}
        fill={colors.secondary}
        opacity={0.03}
        x={150}
        y={-80}
        filters={[blur(250)]}
      />
      <Circle
        ref={bgGlowTertiary}
        size={600}
        fill={colors.accent}
        opacity={0}
        x={-120}
        y={60}
        filters={[blur(200)]}
      />
      <Circle
        ref={bgGlowPulse}
        size={1600}
        fill={colors.primary}
        opacity={0}
        x={0}
        y={0}
        filters={[blur(400)]}
      />

      <Rect
        ref={cornerAccentTL}
        width={120}
        height={2}
        fill={colors.primary}
        opacity={0}
        x={-layout.width / 2 + 100}
        y={-layout.height / 2 + 60}
        radius={1}
      />
      <Rect
        ref={cornerAccentTR}
        width={120}
        height={2}
        fill={colors.secondary}
        opacity={0}
        x={layout.width / 2 - 100}
        y={-layout.height / 2 + 60}
        radius={1}
      />
      <Rect
        ref={cornerAccentBL}
        width={120}
        height={2}
        fill={colors.secondary}
        opacity={0}
        x={-layout.width / 2 + 100}
        y={layout.height / 2 - 60}
        radius={1}
      />
      <Rect
        ref={cornerAccentBR}
        width={120}
        height={2}
        fill={colors.primary}
        opacity={0}
        x={layout.width / 2 - 100}
        y={layout.height / 2 - 60}
        radius={1}
      />

      <Circle
        ref={pulseWave1}
        size={100}
        fill={null}
        stroke={colors.primary}
        lineWidth={1.5}
        opacity={0}
        y={0}
      />
      <Circle
        ref={pulseWave2}
        size={100}
        fill={null}
        stroke={colors.secondary}
        lineWidth={1}
        opacity={0}
        y={0}
      />
      <Circle
        ref={pulseWave3}
        size={100}
        fill={null}
        stroke={colors.primary}
        lineWidth={0.5}
        opacity={0}
        y={0}
      />
      <Circle
        ref={pulseWave4}
        size={100}
        fill={null}
        stroke={colors.accent}
        lineWidth={0.5}
        opacity={0}
        y={0}
      />

      <Node ref={portalContainer} opacity={0}>
        {portalSizes.map((size, i) => (
          <Circle
            ref={portalRings[i]}
            key={`portal-${i}`}
            size={size}
            fill={null}
            stroke={i % 2 === 0 ? colors.primary : colors.secondary}
            lineWidth={1}
            opacity={0.12 - i * 0.01}
          />
        ))}
      </Node>

      <Node ref={radialGridContainer} opacity={0}>
        {radialAngles.map((angle, i) => (
          <Rect
            ref={radialLines[i]}
            key={`radial-${i}`}
            width={1}
            height={0}
            fill={i % 2 === 0 ? colors.primary : colors.secondary}
            opacity={0.1}
            x={0}
            y={0}
            rotation={angle}
            filters={[blur(1)]}
          />
        ))}
      </Node>

      <Node ref={shimmerContainer} opacity={0}>
        {shimmerPositions.map((pos, i) => (
          <Rect
            ref={shimmerLines[i]}
            key={`shimmer-${i}`}
            width={0}
            height={1}
            fill={colors.text}
            opacity={0.06}
            x={-layout.width / 2}
            y={pos.y}
            filters={[blur(2)]}
          />
        ))}
      </Node>

      <Node ref={crystalContainer} opacity={0}>
        {crystalPositions.map((pos, i) => (
          <Rect
            ref={crystals[i]}
            key={`crystal-${i}`}
            width={pos.size}
            height={pos.size}
            x={pos.x}
            y={pos.y}
            fill={null}
            stroke={i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent}
            lineWidth={1}
            opacity={0}
            rotation={pos.rotation}
            radius={4}
            filters={[blur(1)]}
          />
        ))}
      </Node>

      <Node ref={orbitContainer} opacity={0}>
        {orbitParticlePositions.map((pos, i) => (
          <Circle
            ref={orbitParticles[i]}
            key={`orbit-${i}`}
            size={pos.size}
            x={pos.x}
            y={pos.y}
            fill={i % 4 === 0 ? colors.primary : i % 4 === 1 ? colors.secondary : i % 4 === 2 ? colors.accent : colors.text}
            opacity={0}
            filters={[blur(1)]}
          />
        ))}
      </Node>

      <Node ref={innerParticleContainer} opacity={0}>
        {innerParticlePositions.map((pos, i) => (
          <Circle
            ref={innerParticles[i]}
            key={`inner-${i}`}
            size={pos.size}
            x={pos.x}
            y={pos.y}
            fill={i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.text}
            opacity={0}
            filters={[blur(0.5)]}
          />
        ))}
      </Node>

      <Node ref={logoContainer} scale={0} opacity={0}>
        <Circle
          ref={logoGlowShadow}
          size={280}
          fill={'#000000'}
          opacity={0}
          y={10}
          x={5}
          filters={[blur(70)]}
        />

        <Circle
          ref={logoGlowOuter}
          size={360}
          fill={colors.primary}
          opacity={0}
          filters={[blur(100)]}
        />

        <Circle
          ref={logoGlowMid}
          size={300}
          fill={colors.secondary}
          opacity={0}
          filters={[blur(60)]}
        />

        <Circle
          ref={logoGlowInner}
          size={240}
          fill={colors.primary}
          opacity={0}
          filters={[blur(35)]}
        />

        <Circle
          ref={logoGlowCore}
          size={180}
          fill={colors.accent}
          opacity={0}
          filters={[blur(20)]}
        />

        <Circle
          ref={logoPulseRing}
          size={260}
          fill={null}
          stroke={colors.primary}
          lineWidth={2}
          opacity={0}
        />

        <Circle
          ref={logoPulseRing2}
          size={260}
          fill={null}
          stroke={colors.secondary}
          lineWidth={1}
          opacity={0}
        />

        <Circle
          ref={logoPulseRing3}
          size={260}
          fill={null}
          stroke={colors.accent}
          lineWidth={0.5}
          opacity={0}
        />

        <Rect
          ref={glassReflection}
          width={200}
          height={100}
          fill={colors.text}
          opacity={0}
          y={-40}
          rotation={-12}
          radius={50}
          filters={[blur(25)]}
        />

        <Rect
          ref={glassHighlight}
          width={80}
          height={25}
          fill={colors.text}
          opacity={0}
          x={-40}
          y={-50}
          rotation={-20}
          radius={12}
          filters={[blur(10)]}
        />

        <Rect
          ref={glassShine}
          width={30}
          height={8}
          fill={colors.text}
          opacity={0}
          x={50}
          y={-55}
          rotation={-25}
          radius={4}
          filters={[blur(4)]}
        />

        <Img
          ref={logo}
          src={fgrdLogo}
          width={380}
          opacity={1}
        />
      </Node>

      <Rect
        ref={accentLineLeftGlow}
        width={100}
        height={6}
        fill={colors.primary}
        opacity={0}
        x={-340}
        y={160}
        radius={3}
        filters={[blur(15)]}
      />
      <Rect
        ref={accentLineLeft}
        width={0}
        height={2}
        fill={colors.primary}
        opacity={0}
        x={-340}
        y={160}
        radius={1}
      />
      <Circle
        ref={accentDotLeft}
        size={8}
        fill={colors.primary}
        opacity={0}
        x={-420}
        y={160}
      />

      <Rect
        ref={accentLineRightGlow}
        width={100}
        height={6}
        fill={colors.secondary}
        opacity={0}
        x={340}
        y={160}
        radius={3}
        filters={[blur(15)]}
      />
      <Rect
        ref={accentLineRight}
        width={0}
        height={2}
        fill={colors.secondary}
        opacity={0}
        x={340}
        y={160}
        radius={1}
      />
      <Circle
        ref={accentDotRight}
        size={8}
        fill={colors.secondary}
        opacity={0}
        x={420}
        y={160}
      />

      {/* V5: Intro text CENTERED in frame, then fades as logo appears */}
      <Txt
        ref={introTextGlowOuter}
        text="Introducing"
        fontFamily={fonts.heading}
        fontSize={fontSizes.h2}
        fontWeight={fontWeights.bold}
        fill={colors.primary}
        opacity={0}
        y={0}
        letterSpacing={4}
        filters={[blur(35)]}
      />
      <Txt
        ref={introTextGlow}
        text="Introducing"
        fontFamily={fonts.heading}
        fontSize={fontSizes.h2}
        fontWeight={fontWeights.bold}
        fill={colors.primary}
        opacity={0}
        y={0}
        letterSpacing={4}
        filters={[blur(18)]}
      />
      <Txt
        ref={introText}
        text="Introducing"
        fontFamily={fonts.heading}
        fontSize={fontSizes.h2}
        fontWeight={fontWeights.bold}
        fill={colors.text}
        opacity={0}
        y={0}
        letterSpacing={4}
      />

      {/* V4: Removed FGRD bottom text elements */}
    </>
  );

  // ============================================
  // V4: FASTER TIMELINE - "Introducing" FIRST, then logo
  // ============================================

  // Beat 0 - Setup background
  yield* all(
    vignetteTopLeft().opacity(0.3, timing.fast),
    vignetteTopRight().opacity(0.3, timing.fast),
    vignetteBottomLeft().opacity(0.3, timing.fast),
    vignetteBottomRight().opacity(0.3, timing.fast),
    bgGlow().opacity(0.06, timing.fast),
    portalContainer().opacity(1, timing.fast),
    ...portalRings.map((ring, i) =>
      delay(i * 0.015, ring().opacity(0.15 - i * 0.012, timing.fast))
    ),
  );

  // Beat 1 - Radial grid + particles setup
  yield* all(
    radialGridContainer().opacity(1, timing.fast),
    ...radialLines.map((line, i) =>
      delay(i * 0.01, all(
        line().height(450, timing.entrance, easeOutCubic),
        line().opacity(0.1, timing.fast),
      ))
    ),
    orbitContainer().opacity(1, timing.fast),
    ...orbitParticles.map((particle, i) =>
      delay(orbitParticlePositions[i].delay * 0.5, particle().opacity(0.5, timing.fast))
    ),
  );

  // V5: Beat 2 - "Introducing" appears CENTERED
  yield* all(
    introTextGlowOuter().opacity(0.2, timing.fast),
    introTextGlow().opacity(0.4, timing.fast),
    introText().opacity(1, timing.fast),
    innerParticleContainer().opacity(1, timing.fast),
    ...innerParticles.map((particle, i) =>
      delay(innerParticlePositions[i].delay * 0.5, particle().opacity(0.6, timing.fast))
    ),
  );

  // V5: Hold "Introducing" for 1 second
  yield* waitFor(1.0);

  // V5: Beat 3 - Seamless transition: "Introducing" fades out AS logo fades in
  yield* all(
    // Fade out "Introducing"
    introText().opacity(0, timing.entrance),
    introTextGlow().opacity(0, timing.entrance),
    introTextGlowOuter().opacity(0, timing.entrance),
    // Logo appears behind/through the fading text
    logoContainer().scale(1, timing.entrance, easeOutBack),
    logoContainer().opacity(1, timing.entrance),
    logoGlowShadow().opacity(0.35, timing.entrance),
    logoGlowOuter().opacity(0.25, timing.entrance),
    logoGlowMid().opacity(0.3, timing.entrance),
    logoGlowInner().opacity(0.4, timing.entrance),
    logoGlowCore().opacity(0.2, timing.entrance),
  );

  // Beat 4 - Logo glow pulse
  yield* all(
    logoGlowInner().opacity(0.7, timing.fast),
    logoGlowInner().size(280, timing.fast, easeOutCubic),
    logoGlowCore().opacity(0.4, timing.fast),
    logoPulseRing().opacity(0.6, timing.fast),
    logoPulseRing().size(360, timing.entrance, easeOutCubic),
    delay(0.05, all(
      logoPulseRing2().opacity(0.4, timing.fast),
      logoPulseRing2().size(420, timing.entrance, easeOutCubic),
    )),
  );
  yield* all(
    logoGlowInner().opacity(0.4, timing.fast),
    logoGlowInner().size(240, timing.fast, easeInOutCubic),
    logoGlowCore().opacity(0.2, timing.fast),
    logoPulseRing().opacity(0, timing.fast),
    logoPulseRing2().opacity(0, timing.fast),
  );

  // Beat 5 - Glass effects (crystals REMOVED per V6)
  yield* all(
    glassReflection().opacity(0.08, timing.fast),
    glassHighlight().opacity(0.15, timing.fast),
    glassShine().opacity(0.2, timing.fast),
  );

  // Beat 6 - Pulse waves (corner accents + center lines REMOVED per V6)
  yield* all(
    pulseWave1().opacity(0.4, timing.fast),
    pulseWave1().size(400, timing.entrance, easeOutCubic),
    delay(0.08, all(
      pulseWave2().opacity(0.3, timing.fast),
      pulseWave2().size(520, timing.entrance, easeOutCubic),
    )),
  );
  yield* all(
    pulseWave1().opacity(0, timing.fast),
    pulseWave2().opacity(0, timing.fast),
  );

  // Beat 7 - Background intensifies (crystal rotation REMOVED per V6)
  yield* all(
    bgGlow().opacity(0.1, timing.fast),
    bgGlowSecondary().opacity(0.06, timing.fast),
    bgGlowTertiary().opacity(0.04, timing.fast),
  );

  // Beat 8 - Final logo glow pulse
  yield* all(
    logoGlowOuter().opacity(0.5, timing.fast),
    logoGlowMid().opacity(0.6, timing.fast),
    logoGlowInner().opacity(0.7, timing.fast),
    logoGlowCore().opacity(0.35, timing.fast),
    orbitContainer().rotation(10, timing.entrance, linear),
  );
  yield* all(
    logoGlowOuter().opacity(0.3, timing.fast),
    logoGlowMid().opacity(0.35, timing.fast),
    logoGlowInner().opacity(0.4, timing.fast),
    logoGlowCore().opacity(0.2, timing.fast),
  );

  // Brief hold
  yield* waitFor(0.15);

  // Fade out (faster) - intro text already faded during logo reveal
  // V6: Removed crystal, corner accents, center accent lines from fade out
  yield* all(
    logoContainer().opacity(0, timing.fast),
    radialGridContainer().opacity(0, timing.fast),
    orbitContainer().opacity(0, timing.fast),
    innerParticleContainer().opacity(0, timing.fast),
    shimmerContainer().opacity(0, timing.fast),
    portalContainer().opacity(0, timing.fast),
    bgGlow().opacity(0.03, timing.fast),
    bgGlowSecondary().opacity(0.02, timing.fast),
    bgGlowTertiary().opacity(0, timing.fast),
    vignetteTopLeft().opacity(0.18, timing.fast),
    vignetteTopRight().opacity(0.18, timing.fast),
    vignetteBottomLeft().opacity(0.18, timing.fast),
    vignetteBottomRight().opacity(0.18, timing.fast),
  );
});
