/**
 * Scene 5: CTA
 * Duration: ~3 seconds
 *
 * V4: Bigger centered logo (280→400px), truly centered (y=0)
 * Visual: "Gateway opens" - door/portal opening, invitation
 * Large centered FGRD logo with OPEN badge at top-right corner
 * Text: "Now available on Figure Markets."
 * Animation: Portal effect, light burst, enhanced finale, cinematic flares
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
  linear,
} from '@revideo/core';

import { colors, fonts, fontSizes, fontWeights, timing, layout } from '../lib/brand';
import fgrdLogo from '../../FGRD_Color and White.svg';

export default makeScene2D('scene5', function* (view) {
  view.fill(colors.background);

  const bgGlow = createRef<Circle>();
  const bgGlowSecondary = createRef<Circle>();
  const bgGlowTertiary = createRef<Circle>();
  const bgGlowFinal = createRef<Circle>();
  const bgGlowDeep = createRef<Circle>();
  const bgGlowPulse = createRef<Circle>();

  const vignetteTopLeft = createRef<Circle>();
  const vignetteTopRight = createRef<Circle>();
  const vignetteBottomLeft = createRef<Circle>();
  const vignetteBottomRight = createRef<Circle>();

  const portalContainer = createRef<Node>();
  const portalRings: Array<ReturnType<typeof createRef<Circle>>> = [];
  for (let i = 0; i < 12; i++) {
    portalRings.push(createRef<Circle>());
  }

  const radialGridContainer = createRef<Node>();
  const radialLines: Array<ReturnType<typeof createRef<Rect>>> = [];
  for (let i = 0; i < 20; i++) {
    radialLines.push(createRef<Rect>());
  }

  const lightColumn = createRef<Rect>();
  const lightColumnGlow = createRef<Rect>();
  const lightColumnCore = createRef<Rect>();
  const lightBurst = createRef<Circle>();
  const lightBurstOuter = createRef<Circle>();

  const particleBurstContainer = createRef<Node>();
  const burstParticles: Array<ReturnType<typeof createRef<Circle>>> = [];
  for (let i = 0; i < 28; i++) {
    burstParticles.push(createRef<Circle>());
  }

  const floatingParticleContainer = createRef<Node>();
  const floatingParticles: Array<ReturnType<typeof createRef<Circle>>> = [];
  for (let i = 0; i < 24; i++) {
    floatingParticles.push(createRef<Circle>());
  }

  const flareContainer = createRef<Node>();
  const flare1 = createRef<Rect>();
  const flare2 = createRef<Rect>();
  const flare3 = createRef<Rect>();
  const flare4 = createRef<Rect>();
  const flare1Glow = createRef<Rect>();
  const flare2Glow = createRef<Rect>();
  const flare3Glow = createRef<Rect>();
  const flare4Glow = createRef<Rect>();

  const logoContainer = createRef<Node>();
  const logo = createRef<Img>();
  const logoGlowShadow = createRef<Circle>();
  const logoGlowDeep = createRef<Circle>();
  const logoGlowOuter = createRef<Circle>();
  const logoGlowMid = createRef<Circle>();
  const logoGlowInner = createRef<Circle>();
  const logoGlowCore = createRef<Circle>();
  const logoPulseRing = createRef<Circle>();
  const logoPulseRing2 = createRef<Circle>();
  const logoPulseRing3 = createRef<Circle>();
  const logoPulseRing4 = createRef<Circle>();

  const openBadge = createRef<Node>();
  const openBadgeBg = createRef<Rect>();
  const openBadgeGlow = createRef<Rect>();
  const openBadgeGlowOuter = createRef<Rect>();
  const openText = createRef<Txt>();
  const openTextGlow = createRef<Txt>();
  const openDot = createRef<Circle>();
  const openDotGlow = createRef<Circle>();
  const openDotRing = createRef<Circle>();
  const openBadgeParticles: Array<ReturnType<typeof createRef<Circle>>> = [];
  for (let i = 0; i < 8; i++) {
    openBadgeParticles.push(createRef<Circle>());
  }

  const ctaText = createRef<Txt>();
  const ctaTextGlowShadow = createRef<Txt>();
  const ctaTextGlowOuter = createRef<Txt>();
  const ctaTextGlowMid = createRef<Txt>();
  const ctaTextGlow = createRef<Txt>();

  // Tagline refs removed per V5

  const screenGlowPulse = createRef<Circle>();

  const portalRingSizes = [80, 130, 180, 240, 310, 390, 480, 580, 690, 810, 940, 1080];
  const radialAngles = Array.from({ length: 20 }, (_, i) => (i * 360) / 20);

  const burstParticlePositions = Array.from({ length: 28 }, (_, i) => {
    const angle = (i * 12.86) * (Math.PI / 180);
    return {
      startX: 0,
      startY: 0,
      endX: Math.cos(angle) * (220 + Math.random() * 180),
      endY: Math.sin(angle) * (220 + Math.random() * 180),
      size: 3 + Math.random() * 5,
      delay: i * 0.015,
    };
  });

  const floatingParticlePositions = [
    { x: -520, y: -320, size: 4 }, { x: -380, y: -270, size: 3 },
    { x: -220, y: -350, size: 5 }, { x: 220, y: -350, size: 4 },
    { x: 380, y: -270, size: 3 }, { x: 520, y: -320, size: 5 },
    { x: -480, y: -120, size: 4 }, { x: -320, y: -20, size: 3 },
    { x: 320, y: -20, size: 4 }, { x: 480, y: -120, size: 3 },
    { x: -520, y: 130, size: 4 }, { x: -380, y: 180, size: 5 },
    { x: -220, y: 130, size: 3 }, { x: 220, y: 130, size: 4 },
    { x: 380, y: 180, size: 3 }, { x: 520, y: 130, size: 5 },
    { x: -420, y: 280, size: 4 }, { x: 0, y: 330, size: 3 },
    { x: 420, y: 280, size: 4 }, { x: -170, y: 260, size: 3 },
    { x: 170, y: 260, size: 4 }, { x: -280, y: -180, size: 3 },
    { x: 280, y: -180, size: 4 }, { x: 0, y: -280, size: 5 },
  ];

  view.add(
    <>
      <Circle
        ref={bgGlowDeep}
        size={2400}
        fill={colors.background}
        opacity={1}
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

      {/* V4: Background glows centered at y=0 */}
      <Circle
        ref={bgGlow}
        size={1400}
        fill={colors.primary}
        opacity={0.04}
        y={0}
        filters={[blur(350)]}
      />
      <Circle
        ref={bgGlowSecondary}
        size={900}
        fill={colors.secondary}
        opacity={0.03}
        x={180}
        y={-60}
        filters={[blur(280)]}
      />
      <Circle
        ref={bgGlowTertiary}
        size={700}
        fill={colors.accent}
        opacity={0}
        x={-150}
        y={60}
        filters={[blur(220)]}
      />
      <Circle
        ref={bgGlowFinal}
        size={1800}
        fill={colors.primary}
        opacity={0}
        y={0}
        filters={[blur(400)]}
      />
      <Circle
        ref={bgGlowPulse}
        size={2200}
        fill={colors.primary}
        opacity={0}
        y={0}
        filters={[blur(480)]}
      />

      <Circle
        ref={screenGlowPulse}
        size={2200}
        fill={colors.primary}
        opacity={0}
        filters={[blur(450)]}
      />

      {/* V4: Portal centered at y=0 to match logo */}
      <Node ref={portalContainer} y={0} opacity={0}>
        {portalRingSizes.map((size, i) => (
          <Circle
            ref={portalRings[i]}
            key={`portal-${i}`}
            size={size}
            fill={null}
            stroke={i % 2 === 0 ? colors.primary : colors.secondary}
            lineWidth={1}
            opacity={0.12 - i * 0.008}
          />
        ))}
      </Node>

      {/* V4: Radial grid centered at y=0 */}
      <Node ref={radialGridContainer} y={0} opacity={0}>
        {radialAngles.map((angle, i) => (
          <Rect
            ref={radialLines[i]}
            key={`radial-${i}`}
            width={1}
            height={0}
            fill={i % 2 === 0 ? colors.primary : colors.secondary}
            opacity={0.08}
            rotation={angle}
            filters={[blur(1)]}
          />
        ))}
      </Node>

      {/* V4: Light effects centered at y=0 */}
      <Circle
        ref={lightBurstOuter}
        size={0}
        fill={colors.primary}
        opacity={0}
        y={0}
        filters={[blur(120)]}
      />
      <Circle
        ref={lightBurst}
        size={0}
        fill={colors.secondary}
        opacity={0}
        y={0}
        filters={[blur(60)]}
      />

      <Rect
        ref={lightColumnGlow}
        width={80}
        height={0}
        fill={colors.primary}
        opacity={0}
        y={0}
        filters={[blur(50)]}
      />
      <Rect
        ref={lightColumn}
        width={30}
        height={0}
        fill={colors.secondary}
        opacity={0}
        y={0}
        filters={[blur(20)]}
      />
      <Rect
        ref={lightColumnCore}
        width={6}
        height={0}
        fill={colors.text}
        opacity={0}
        y={0}
        filters={[blur(5)]}
      />

      <Node ref={floatingParticleContainer} opacity={0}>
        {floatingParticlePositions.map((pos, i) => (
          <Circle
            ref={floatingParticles[i]}
            key={`float-${i}`}
            size={pos.size}
            x={pos.x}
            y={pos.y}
            fill={i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.text}
            opacity={0}
            filters={[blur(1)]}
          />
        ))}
      </Node>

      {/* V4: Particle burst centered at y=0 */}
      <Node ref={particleBurstContainer} y={0} opacity={0}>
        {burstParticlePositions.map((pos, i) => (
          <Circle
            ref={burstParticles[i]}
            key={`burst-${i}`}
            size={pos.size}
            x={pos.startX}
            y={pos.startY}
            fill={i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent}
            opacity={0}
            filters={[blur(2)]}
          />
        ))}
      </Node>

      <Node ref={flareContainer} opacity={0}>
        <Rect
          ref={flare1Glow}
          width={450}
          height={18}
          fill={colors.primary}
          opacity={0}
          x={-320}
          y={-220}
          rotation={-28}
          filters={[blur(25)]}
        />
        <Rect
          ref={flare1}
          width={0}
          height={3}
          fill={colors.text}
          opacity={0}
          x={-320}
          y={-220}
          rotation={-28}
          filters={[blur(3)]}
        />
        <Rect
          ref={flare2Glow}
          width={400}
          height={15}
          fill={colors.secondary}
          opacity={0}
          x={320}
          y={-200}
          rotation={28}
          filters={[blur(22)]}
        />
        <Rect
          ref={flare2}
          width={0}
          height={2}
          fill={colors.text}
          opacity={0}
          x={320}
          y={-200}
          rotation={28}
          filters={[blur(2)]}
        />
        <Rect
          ref={flare3Glow}
          width={350}
          height={12}
          fill={colors.primary}
          opacity={0}
          x={-280}
          y={170}
          rotation={22}
          filters={[blur(18)]}
        />
        <Rect
          ref={flare3}
          width={0}
          height={2}
          fill={colors.text}
          opacity={0}
          x={-280}
          y={170}
          rotation={22}
          filters={[blur(2)]}
        />
        <Rect
          ref={flare4Glow}
          width={420}
          height={16}
          fill={colors.secondary}
          opacity={0}
          x={300}
          y={200}
          rotation={-24}
          filters={[blur(20)]}
        />
        <Rect
          ref={flare4}
          width={0}
          height={3}
          fill={colors.text}
          opacity={0}
          x={300}
          y={200}
          rotation={-24}
          filters={[blur(3)]}
        />
      </Node>

      {/* V4: Logo centered at y=0, bigger (400px) */}
      <Node ref={logoContainer} y={0} scale={0} opacity={0}>
        <Circle
          ref={logoGlowShadow}
          size={480}
          fill={'#000000'}
          opacity={0}
          y={15}
          x={8}
          filters={[blur(100)]}
        />

        <Circle
          ref={logoGlowDeep}
          size={640}
          fill={colors.primary}
          opacity={0}
          filters={[blur(180)]}
        />

        <Circle
          ref={logoGlowOuter}
          size={540}
          fill={colors.primary}
          opacity={0}
          filters={[blur(130)]}
        />

        <Circle
          ref={logoGlowMid}
          size={460}
          fill={colors.secondary}
          opacity={0}
          filters={[blur(85)]}
        />

        <Circle
          ref={logoGlowInner}
          size={380}
          fill={colors.primary}
          opacity={0}
          filters={[blur(55)]}
        />

        <Circle
          ref={logoGlowCore}
          size={300}
          fill={colors.accent}
          opacity={0}
          filters={[blur(35)]}
        />

        <Circle
          ref={logoPulseRing}
          size={430}
          fill={null}
          stroke={colors.primary}
          lineWidth={2.5}
          opacity={0}
        />

        <Circle
          ref={logoPulseRing2}
          size={430}
          fill={null}
          stroke={colors.secondary}
          lineWidth={2}
          opacity={0}
        />

        <Circle
          ref={logoPulseRing3}
          size={430}
          fill={null}
          stroke={colors.accent}
          lineWidth={1.5}
          opacity={0}
        />

        <Circle
          ref={logoPulseRing4}
          size={430}
          fill={null}
          stroke={colors.primary}
          lineWidth={1}
          opacity={0}
        />

        <Img
          ref={logo}
          src={fgrdLogo}
          width={400}
        />
      </Node>

      {/* V4: OPEN badge repositioned for larger logo */}
      <Node ref={openBadge} x={200} y={-75} opacity={0}>
        <Rect
          ref={openBadgeGlowOuter}
          width={120}
          height={45}
          fill={colors.accent}
          opacity={0}
          radius={22}
          filters={[blur(35)]}
        />
        <Rect
          ref={openBadgeGlow}
          width={100}
          height={38}
          fill={colors.accent}
          opacity={0}
          radius={19}
          filters={[blur(20)]}
        />
        <Rect
          ref={openBadgeBg}
          width={90}
          height={32}
          fill={null}
          stroke={colors.accent}
          lineWidth={1.5}
          radius={16}
          opacity={0}
        />
        <Circle
          ref={openDotRing}
          size={14}
          fill={null}
          stroke={colors.accent}
          lineWidth={1}
          x={-26}
          opacity={0}
        />
        <Circle
          ref={openDotGlow}
          size={12}
          fill={colors.accent}
          x={-26}
          opacity={0}
          filters={[blur(8)]}
        />
        <Circle
          ref={openDot}
          size={7}
          fill={colors.accent}
          x={-26}
          opacity={0}
        />
        <Txt
          ref={openTextGlow}
          text="OPEN"
          fontFamily={fonts.heading}
          fontSize={15}
          fontWeight={fontWeights.semibold}
          fill={colors.accent}
          x={10}
          letterSpacing={2}
          opacity={0}
          filters={[blur(10)]}
        />
        <Txt
          ref={openText}
          text="OPEN"
          fontFamily={fonts.heading}
          fontSize={15}
          fontWeight={fontWeights.semibold}
          fill={colors.accent}
          x={10}
          letterSpacing={2}
          opacity={0}
        />

        {Array.from({ length: 8 }, (_, i) => (
          <Circle
            ref={openBadgeParticles[i]}
            key={`open-particle-${i}`}
            size={2 + (i % 2)}
            fill={colors.accent}
            opacity={0}
            x={-55 - i * 8}
            y={(i % 2 === 0 ? -1 : 1) * (4 + i * 1.5)}
            filters={[blur(2)]}
          />
        ))}
      </Node>

      {/* V5: CTA text - font style matched with scenes 2b and 4 */}
      <Txt
        ref={ctaTextGlowShadow}
        text="Now available on Figure Markets."
        fontFamily={fonts.display}
        fontSize={fontSizes.h2}
        fontWeight={fontWeights.bold}
        fill={'#000000'}
        opacity={0}
        y={200}
        x={3}
        letterSpacing={-1}
        filters={[blur(35)]}
      />
      <Txt
        ref={ctaTextGlowOuter}
        text="Now available on Figure Markets."
        fontFamily={fonts.display}
        fontSize={fontSizes.h2}
        fontWeight={fontWeights.bold}
        fill={colors.primary}
        opacity={0}
        y={200}
        letterSpacing={-1}
        filters={[blur(45)]}
      />
      <Txt
        ref={ctaTextGlowMid}
        text="Now available on Figure Markets."
        fontFamily={fonts.display}
        fontSize={fontSizes.h2}
        fontWeight={fontWeights.bold}
        fill={colors.secondary}
        opacity={0}
        y={200}
        letterSpacing={-1}
        filters={[blur(28)]}
      />
      <Txt
        ref={ctaTextGlow}
        text="Now available on Figure Markets."
        fontFamily={fonts.display}
        fontSize={fontSizes.h2}
        fontWeight={fontWeights.bold}
        fill={colors.primary}
        opacity={0}
        y={200}
        letterSpacing={-1}
        filters={[blur(14)]}
      />
      <Txt
        ref={ctaText}
        text="Now available on Figure Markets."
        fontFamily={fonts.display}
        fontSize={fontSizes.h2}
        fontWeight={fontWeights.bold}
        fill={colors.text}
        opacity={0}
        y={200}
        letterSpacing={-1}
      />

      {/* Tagline removed per V5 */}
    </>
  );

  yield* all(
    vignetteTopLeft().opacity(0.28, timing.smooth),
    vignetteTopRight().opacity(0.28, timing.smooth),
    vignetteBottomLeft().opacity(0.28, timing.smooth),
    vignetteBottomRight().opacity(0.28, timing.smooth),
  );

  yield* all(
    portalContainer().opacity(1, timing.entrance),
    ...portalRings.map((ring, i) =>
      delay(i * 0.03, ring().opacity(0.16 - i * 0.01, timing.entrance))
    ),
  );

  yield* all(
    ...portalRings.map((ring, i) =>
      delay(i * 0.025, ring().size(portalRingSizes[i] + 50, timing.smooth, easeOutCubic))
    ),
  );

  yield* all(
    radialGridContainer().opacity(1, timing.entrance),
    ...radialLines.map((line, i) =>
      delay(i * 0.015, line().height(400, timing.smooth, easeOutCubic))
    ),
  );

  yield* all(
    lightBurstOuter().opacity(0.15, timing.fast),
    lightBurstOuter().size(500, timing.smooth, easeOutCubic),
    lightBurst().opacity(0.25, timing.fast),
    lightBurst().size(350, timing.smooth, easeOutCubic),
  );

  yield* all(
    lightColumnGlow().opacity(0.25, timing.fast),
    lightColumnGlow().height(900, timing.smooth, easeOutCubic),
    lightColumn().opacity(0.45, timing.fast),
    lightColumn().height(900, timing.smooth, easeOutCubic),
    lightColumnCore().opacity(0.65, timing.fast),
    lightColumnCore().height(900, timing.smooth, easeOutCubic),
  );

  yield* all(
    floatingParticleContainer().opacity(1, timing.entrance),
    ...floatingParticles.map((p, i) =>
      delay(i * 0.015, p().opacity(0.5, timing.entrance))
    ),
  );

  yield* all(
    logoContainer().scale(1, timing.smooth, easeOutBack),
    logoContainer().opacity(1, timing.entrance),
    logoGlowShadow().opacity(0.35, timing.entrance),
  );

  yield* all(
    logoGlowDeep().opacity(0.15, timing.entrance),
    delay(0.05, logoGlowOuter().opacity(0.25, timing.entrance)),
    delay(0.1, logoGlowMid().opacity(0.3, timing.entrance)),
    delay(0.15, logoGlowInner().opacity(0.4, timing.entrance)),
    delay(0.2, logoGlowCore().opacity(0.2, timing.entrance)),
    bgGlow().opacity(0.08, timing.entrance),
  );

  // V4: Larger pulse rings for bigger logo
  yield* all(
    logoPulseRing().opacity(0.65, timing.fast),
    logoPulseRing().size(560, timing.smooth, easeOutCubic),
    delay(0.08, all(
      logoPulseRing2().opacity(0.5, timing.fast),
      logoPulseRing2().size(660, timing.smooth, easeOutCubic),
    )),
    delay(0.16, all(
      logoPulseRing3().opacity(0.35, timing.fast),
      logoPulseRing3().size(760, timing.smooth, easeOutCubic),
    )),
    delay(0.24, all(
      logoPulseRing4().opacity(0.2, timing.fast),
      logoPulseRing4().size(860, timing.smooth, easeOutCubic),
    )),
  );
  yield* all(
    logoPulseRing().opacity(0, timing.beat),
    logoPulseRing2().opacity(0, timing.beat),
    logoPulseRing3().opacity(0, timing.beat),
    logoPulseRing4().opacity(0, timing.beat),
  );

  yield* all(
    openBadge().opacity(1, timing.entrance),
    openBadgeBg().opacity(1, timing.entrance),
    openBadgeGlow().opacity(0.25, timing.entrance),
    openBadgeGlowOuter().opacity(0.15, timing.entrance),
    openDot().opacity(1, timing.fast),
    openDotGlow().opacity(0.5, timing.fast),
    openDotRing().opacity(0.4, timing.fast),
    openText().opacity(1, timing.entrance),
    openTextGlow().opacity(0.4, timing.entrance),
  );

  yield* all(
    ...openBadgeParticles.map((p, i) =>
      delay(i * 0.03, p().opacity(0.5, timing.entrance))
    ),
  );

  yield* all(
    openDot().size(10, timing.fast, easeOutCubic),
    openDotGlow().size(18, timing.fast, easeOutCubic),
    openDotRing().size(22, timing.fast, easeOutCubic),
  );
  yield* all(
    openDot().size(7, timing.beat, easeInOutCubic),
    openDotGlow().size(12, timing.beat, easeInOutCubic),
    openDotRing().size(14, timing.beat, easeInOutCubic),
  );

  yield* all(
    flareContainer().opacity(1, timing.fast),
    flare1().width(450, timing.smooth, easeOutCubic),
    flare1().opacity(0.65, timing.fast),
    flare1Glow().opacity(0.18, timing.fast),
    delay(0.06, all(
      flare2().width(400, timing.smooth, easeOutCubic),
      flare2().opacity(0.55, timing.fast),
      flare2Glow().opacity(0.14, timing.fast),
    )),
    delay(0.12, all(
      flare3().width(350, timing.smooth, easeOutCubic),
      flare3().opacity(0.55, timing.fast),
      flare3Glow().opacity(0.12, timing.fast),
    )),
    delay(0.18, all(
      flare4().width(420, timing.smooth, easeOutCubic),
      flare4().opacity(0.6, timing.fast),
      flare4Glow().opacity(0.14, timing.fast),
    )),
  );

  yield* all(
    ctaTextGlowShadow().opacity(0.22, timing.entrance),
    ctaTextGlowOuter().opacity(0.18, timing.entrance),
    ctaTextGlowMid().opacity(0.28, timing.entrance),
    ctaTextGlow().opacity(0.55, timing.entrance),
    ctaText().opacity(1, timing.entrance),
  );

  yield* all(
    particleBurstContainer().opacity(1, timing.fast),
    ...burstParticles.map((p, i) =>
      delay(burstParticlePositions[i].delay, all(
        p().opacity(0.75, timing.fast),
        p().x(burstParticlePositions[i].endX, timing.smooth, easeOutCubic),
        p().y(burstParticlePositions[i].endY, timing.smooth, easeOutCubic),
      ))
    ),
  );

  yield* all(
    ...burstParticles.map((p, i) =>
      delay(i * 0.008, p().opacity(0, timing.beat))
    ),
  );

  // Tagline removed per V5

  yield* all(
    bgGlowSecondary().opacity(0.06, timing.beat),
    bgGlowTertiary().opacity(0.04, timing.beat),
  );

  yield* all(
    logoGlowOuter().opacity(0.4, timing.fast),
    logoGlowMid().opacity(0.5, timing.fast),
    logoGlowInner().opacity(0.6, timing.fast),
  );
  yield* all(
    logoGlowOuter().opacity(0.25, timing.beat),
    logoGlowMid().opacity(0.3, timing.beat),
    logoGlowInner().opacity(0.4, timing.beat),
  );

  // V4: Larger pulse ring animation
  yield* all(
    logoPulseRing().size(430, 0),
    logoPulseRing().opacity(0.55, timing.fast),
    logoPulseRing().size(580, timing.smooth, easeOutCubic),
    delay(0.08, all(
      logoPulseRing2().size(430, 0),
      logoPulseRing2().opacity(0.4, timing.fast),
      logoPulseRing2().size(680, timing.smooth, easeOutCubic),
    )),
    delay(0.16, all(
      logoPulseRing3().size(430, 0),
      logoPulseRing3().opacity(0.3, timing.fast),
      logoPulseRing3().size(780, timing.smooth, easeOutCubic),
    )),
  );
  yield* all(
    logoPulseRing().opacity(0, timing.beat),
    logoPulseRing2().opacity(0, timing.beat),
    logoPulseRing3().opacity(0, timing.beat),
  );

  yield* all(
    ...portalRings.map((ring, i) =>
      delay(i * 0.015, ring().size(portalRingSizes[i] + 100, timing.smooth, easeOutCubic))
    ),
  );

  yield* all(
    ...floatingParticles.map((p, i) =>
      delay(i * 0.008, p().opacity(0.7, timing.fast))
    ),
  );
  yield* all(
    ...floatingParticles.map((p, i) =>
      delay(i * 0.008, p().opacity(0.4, timing.beat))
    ),
  );

  yield* all(
    openBadgeGlow().opacity(0.45, timing.fast),
    openDotGlow().opacity(0.8, timing.fast),
  );
  yield* all(
    openBadgeGlow().opacity(0.25, timing.beat),
    openDotGlow().opacity(0.4, timing.beat),
  );

  yield* all(
    ctaTextGlow().opacity(0.75, timing.fast),
    ctaTextGlowMid().opacity(0.45, timing.fast),
  );
  yield* all(
    ctaTextGlow().opacity(0.45, timing.beat),
    ctaTextGlowMid().opacity(0.22, timing.beat),
  );

  // V4: Larger glow sizes for bigger logo
  yield* all(
    logoGlowDeep().opacity(0.25, timing.fast),
    logoGlowOuter().opacity(0.5, timing.fast),
    logoGlowOuter().size(600, timing.fast, easeOutCubic),
    logoGlowMid().opacity(0.6, timing.fast),
    logoGlowMid().size(500, timing.fast, easeOutCubic),
    logoGlowInner().opacity(0.7, timing.fast),
    logoGlowInner().size(420, timing.fast, easeOutCubic),
    logoGlowCore().opacity(0.35, timing.fast),
    logoPulseRing().size(430, 0),
    logoPulseRing().opacity(0.6, timing.fast),
    logoPulseRing().size(650, timing.smooth, easeOutCubic),
    bgGlowFinal().opacity(0.14, timing.smooth),
    bgGlowPulse().opacity(0.08, timing.smooth),
    ctaTextGlow().opacity(0.85, timing.fast),
    screenGlowPulse().opacity(0.1, timing.fast),
  );

  yield* all(
    logoGlowDeep().opacity(0.15, timing.beat),
    logoGlowOuter().opacity(0.35, timing.beat),
    logoGlowOuter().size(540, timing.beat, easeInOutCubic),
    logoGlowMid().opacity(0.4, timing.beat),
    logoGlowMid().size(460, timing.beat, easeInOutCubic),
    logoGlowInner().opacity(0.5, timing.beat),
    logoGlowInner().size(380, timing.beat, easeInOutCubic),
    logoGlowCore().opacity(0.22, timing.beat),
    logoPulseRing().opacity(0, timing.beat),
    ctaTextGlow().opacity(0.5, timing.beat),
    bgGlowFinal().opacity(0.1, timing.beat),
    bgGlowPulse().opacity(0, timing.beat),
    screenGlowPulse().opacity(0, timing.beat),
  );

  yield* all(
    lightColumnGlow().opacity(0.4, timing.fast),
    lightColumn().opacity(0.65, timing.fast),
    lightColumnCore().opacity(0.85, timing.fast),
  );
  yield* all(
    lightColumnGlow().opacity(0.18, timing.beat),
    lightColumn().opacity(0.38, timing.beat),
    lightColumnCore().opacity(0.55, timing.beat),
  );

  yield* all(
    ...radialLines.map((line, i) =>
      delay(i * 0.008, all(
        line().height(440, timing.fast),
        line().opacity(0.18, timing.fast),
      ))
    ),
  );
  yield* all(
    ...radialLines.map((line, i) =>
      delay(i * 0.008, all(
        line().height(400, timing.beat),
        line().opacity(0.06, timing.beat),
      ))
    ),
  );

  yield* all(
    flare1().opacity(0.45, timing.beat),
    flare2().opacity(0.38, timing.beat),
    flare3().opacity(0.35, timing.beat),
    flare4().opacity(0.4, timing.beat),
  );

  // V6: Even brighter purple glow at ending for more contrast with logo
  yield* all(
    logoGlowInner().opacity(0.85, timing.fast),
    logoGlowMid().opacity(0.75, timing.fast),
    logoGlowCore().opacity(0.65, timing.fast),
    logoGlowOuter().opacity(0.55, timing.fast),
  );
  yield* all(
    logoGlowInner().opacity(0.7, timing.beat),
    logoGlowMid().opacity(0.6, timing.beat),
    logoGlowCore().opacity(0.55, timing.beat),
    logoGlowOuter().opacity(0.45, timing.beat),
  );

  // Tagline glow removed per V5

  yield* all(
    ...openBadgeParticles.map((p, i) =>
      p().x(-60 - i * 10, timing.smooth, linear)
    ),
  );

  yield* all(
    bgGlow().opacity(0.12, timing.fast),
    bgGlowSecondary().opacity(0.08, timing.fast),
    bgGlowFinal().opacity(0.12, timing.fast),
  );
  yield* all(
    bgGlow().opacity(0.09, timing.beat),
    bgGlowSecondary().opacity(0.06, timing.beat),
    bgGlowFinal().opacity(0.08, timing.beat),
  );

  yield* waitFor(0.25);
});
