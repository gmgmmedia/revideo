/**
 * Scene 2: Three Box Types
 * Duration: 03:11 - 10:00 (6.633 seconds internal)
 *
 * Internal timeline:
 * 0:00 - 2:05 (0 - 2.167s): Wallet box
 * 2:06 - 4:07 (2.2 - 4.233s): Token balance box (balance icon)
 * 4:08 - 6:19 (4.267 - 6.633s): Program box
 *
 * VO: "Your wallet? A box. Token balance? Box. Programs? Also boxes.
 *      Everything on Solana lives in a box."
 */

import { makeScene2D } from '@revideo/2d';
import { Rect, Node, Line, Circle, Path, Txt, blur } from '@revideo/2d';
import {
  all,
  chain,
  delay,
  sequence,
  waitFor,
  createRef,
  createRefArray,
  createSignal,
  easeOutCubic,
  easeInCubic,
  easeInOutCubic,
  easeOutQuart,
  easeOutExpo,
  easeOutBack,
  linear,
} from '@revideo/core';

import { RAIKU, colors, timing, effects, layout, cube } from '../lib/raiku';

export default makeScene2D('scene2', function* (view) {
  // ============================================
  // SCENE SETUP
  // ============================================
  view.fill(colors.background);

  // ============================================
  // TIMING CONSTANTS (internal, in seconds)
  // ============================================
  // Wallet: 0:00 - 2:05 = 0 - 2.167s
  // Balance: 2:06 - 4:07 = 2.2 - 4.233s
  // Program: 4:08 - 6:19 = 4.267 - 6.633s
  const WALLET_END = 2.167;
  const BALANCE_START = 2.2;
  const BALANCE_END = 4.233;
  const PROGRAM_START = 4.267;
  const SCENE_END = 6.633;

  // ============================================
  // REFS - Background Glows
  // ============================================
  const bgGlow1 = createRef<Circle>();
  const bgGlow2 = createRef<Circle>();
  const bgGlow3 = createRef<Circle>();

  // ============================================
  // REFS - Cube 1: WALLET
  // ============================================
  const walletGroup = createRef<Node>();
  const walletShadow = createRef<Rect>();
  const walletCube = createRef<Rect>();
  const walletGlowOuter = createRef<Rect>();
  const walletGlowInner = createRef<Circle>();
  const walletPulseRing = createRef<Circle>();
  // Wallet icon elements
  const walletIcon = createRef<Node>();
  const walletBody = createRef<Rect>();
  const walletFlap = createRef<Path>();
  const walletClasp = createRef<Circle>();
  const walletClaspGlow = createRef<Circle>();
  const walletCardSlots = createRefArray<Rect>();

  // ============================================
  // REFS - Cube 2: TOKEN BALANCE
  // ============================================
  const balanceGroup = createRef<Node>();
  const balanceShadow = createRef<Rect>();
  const balanceCube = createRef<Rect>();
  const balanceGlowOuter = createRef<Rect>();
  const balanceGlowInner = createRef<Circle>();
  const balancePulseRing = createRef<Circle>();
  // Balance icon elements (0.1 SOL with Solana logo)
  const balanceIcon = createRef<Node>();
  const balanceText = createRef<Txt>();
  const balanceSolLogo = createRef<Path>();
  const balanceSolLogoGlow = createRef<Path>();

  // Solana logo SVG path
  const SOLANA_LOGO_PATH = "M100.48 69.3817L83.8068 86.8015C83.4444 87.1799 83.0058 87.4816 82.5185 87.6878C82.0312 87.894 81.5055 88.0003 80.9743 88H1.93563C1.55849 88 1.18957 87.8926 0.874202 87.6912C0.558829 87.4897 0.31074 87.2029 0.160416 86.8659C0.0100923 86.529 -0.0359181 86.1566 0.0280382 85.7945C0.0919944 85.4324 0.263131 85.0964 0.520422 84.8278L17.2061 67.408C17.5676 67.0306 18.0047 66.7295 18.4904 66.5234C18.9762 66.3172 19.5002 66.2104 20.0301 66.2095H99.0644C99.4415 66.2095 99.8104 66.3169 100.126 66.5183C100.441 66.7198 100.689 67.0067 100.84 67.3436C100.99 67.6806 101.036 68.0529 100.972 68.415C100.908 68.7771 100.737 69.1131 100.48 69.3817ZM83.8068 34.3032C83.4444 33.9248 83.0058 33.6231 82.5185 33.4169C82.0312 33.2108 81.5055 33.1045 80.9743 33.1048H1.93563C1.55849 33.1048 1.18957 33.2121 0.874202 33.4136C0.558829 33.6151 0.31074 33.9019 0.160416 34.2388C0.0100923 34.5758 -0.0359181 34.9482 0.0280382 35.3103C0.0919944 35.6723 0.263131 36.0083 0.520422 36.277L17.2061 53.6968C17.5676 54.0742 18.0047 54.3752 18.4904 54.5814C18.9762 54.7875 19.5002 54.8944 20.0301 54.8952H99.0644C99.4415 54.8952 99.8104 54.7879 100.126 54.5864C100.441 54.3849 100.689 54.0981 100.84 53.7612C100.99 53.4242 101.036 53.0518 100.972 52.6897C100.908 52.3277 100.737 51.9917 100.48 51.723L83.8068 34.3032ZM1.93563 21.7905H80.9743C81.5055 21.7907 82.0312 21.6845 82.5185 21.4783C83.0058 21.2721 83.4444 20.9704 83.8068 20.592L100.48 3.17219C100.737 2.90357 100.908 2.56758 100.972 2.2055C101.036 1.84342 100.99 1.47103 100.84 1.13408C100.689 0.79713 100.441 0.510296 100.126 0.308823C99.8104 0.107349 99.4415 1.24074e-05 99.0644 0L20.0301 0C19.5002 0.000878397 18.9762 0.107699 18.4904 0.313848C18.0047 0.519998 17.5676 0.821087 17.2061 1.19848L0.524723 18.6183C0.267681 18.8866 0.0966198 19.2223 0.0325185 19.5839C-0.0315829 19.9456 0.0140624 20.3177 0.163856 20.6545C0.31365 20.9913 0.561081 21.2781 0.875804 21.4799C1.19053 21.6817 1.55886 21.7896 1.93563 21.7905Z";

  // ============================================
  // REFS - Cube 3: PROGRAM
  // ============================================
  const programGroup = createRef<Node>();
  const programShadow = createRef<Rect>();
  const programCube = createRef<Rect>();
  const programGlowOuter = createRef<Rect>();
  const programGlowInner = createRef<Circle>();
  const programPulseRing = createRef<Circle>();
  // Program icon elements
  const programIcon = createRef<Node>();
  const programGearOuter = createRef<Circle>();
  const programGearInner = createRef<Circle>();
  const programGearCenter = createRef<Circle>();
  const programGearTeeth = createRefArray<Rect>();
  const programBracketLeft = createRef<Line>();
  const programBracketRight = createRef<Line>();
  const programCodeDots = createRefArray<Circle>();

  // ============================================
  // REFS - Ambient Particles
  // ============================================
  const ambientParticles = createRefArray<Circle>();
  const ambientParticleGlows = createRefArray<Circle>();

  // ============================================
  // CONSTANTS
  // ============================================
  const CUBE_SIZE = 160;
  const CUBE_SPACING = 260;
  const AMBIENT_COUNT = 10;

  // Cube positions (centered)
  const positions = {
    wallet: { x: -CUBE_SPACING, y: 0 },
    balance: { x: 0, y: 0 },
    program: { x: CUBE_SPACING, y: 0 },
  };

  // ============================================
  // BUILD SCENE
  // ============================================
  view.add(
    <>
      {/* ===== LAYER 1: Background Glows ===== */}
      <Circle
        ref={bgGlow1}
        size={900}
        fill={colors.glow}
        opacity={0}
        x={-300}
        y={-100}
        filters={[blur(280)]}
      />
      <Circle
        ref={bgGlow2}
        size={700}
        fill={colors.glow}
        opacity={0}
        x={300}
        y={100}
        filters={[blur(240)]}
      />
      <Circle
        ref={bgGlow3}
        size={500}
        fill={colors.glow}
        opacity={0}
        x={0}
        y={0}
        filters={[blur(200)]}
      />

      {/* ===== LAYER 2: Ambient Particles ===== */}
      {Array.from({ length: AMBIENT_COUNT }, (_, i) => {
        const angle = (i / AMBIENT_COUNT) * Math.PI * 2;
        const radius = 350 + (i % 3) * 70;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.5;

        return (
          <Node key={`ambient-${i}`}>
            <Circle
              ref={ambientParticleGlows}
              size={12 + (i % 3) * 4}
              fill={i % 3 === 0 ? colors.neon : colors.white}
              opacity={0}
              x={x}
              y={y}
              filters={[blur(10)]}
            />
            <Circle
              ref={ambientParticles}
              size={3 + (i % 2)}
              fill={i % 3 === 0 ? colors.neon : colors.white}
              opacity={0}
              x={x}
              y={y}
            />
          </Node>
        );
      })}

      {/* ===== LAYER 3: WALLET Cube ===== */}
      <Node
        ref={walletGroup}
        x={positions.wallet.x}
        y={positions.wallet.y + 100}
        scale={0}
        opacity={0}
      >
        {/* Shadow */}
        <Rect
          ref={walletShadow}
          width={CUBE_SIZE}
          height={CUBE_SIZE}
          fill={colors.black}
          opacity={0}
          radius={12}
          x={12}
          y={12}
          filters={[blur(20)]}
        />

        {/* Pulse ring */}
        <Circle
          ref={walletPulseRing}
          size={CUBE_SIZE * 1.8}
          fill={null}
          stroke={colors.neon}
          lineWidth={2}
          opacity={0}
        />

        {/* Inner glow */}
        <Circle
          ref={walletGlowInner}
          size={CUBE_SIZE * 1.5}
          fill={colors.glow}
          opacity={0}
          filters={[blur(effects.glowBlurLarge)]}
        />

        {/* Outer glow */}
        <Rect
          ref={walletGlowOuter}
          width={CUBE_SIZE + 10}
          height={CUBE_SIZE + 10}
          fill={colors.neon}
          opacity={0}
          radius={16}
          filters={[blur(effects.glowBlur)]}
        />

        {/* Main cube */}
        <Rect
          ref={walletCube}
          width={CUBE_SIZE}
          height={CUBE_SIZE}
          fill={null}
          stroke={colors.neon}
          lineWidth={3}
          radius={12}
        />

        {/* Wallet Icon */}
        <Node ref={walletIcon} opacity={0}>
          {/* Wallet body */}
          <Rect
            ref={walletBody}
            width={65}
            height={45}
            fill={null}
            stroke={colors.white}
            lineWidth={2}
            radius={6}
            y={5}
          />
          {/* Wallet flap */}
          <Path
            ref={walletFlap}
            data="M -32 -17 Q -32 -28 0 -28 Q 32 -28 32 -17"
            stroke={colors.white}
            lineWidth={2}
            fill={null}
          />
          {/* Card slots */}
          {Array.from({ length: 3 }, (_, i) => (
            <Rect
              key={`wallet-card-${i}`}
              ref={walletCardSlots}
              width={15}
              height={10}
              fill={null}
              stroke={colors.neon}
              lineWidth={1}
              opacity={0}
              radius={2}
              x={-20 + i * 20}
              y={10}
            />
          ))}
          {/* Clasp glow */}
          <Circle
            ref={walletClaspGlow}
            size={18}
            fill={colors.neon}
            opacity={0}
            x={26}
            y={5}
            filters={[blur(8)]}
          />
          {/* Clasp */}
          <Circle
            ref={walletClasp}
            size={12}
            fill={colors.neon}
            opacity={0}
            x={26}
            y={5}
          />
        </Node>
      </Node>

      {/* ===== LAYER 4: BALANCE Cube ===== */}
      <Node
        ref={balanceGroup}
        x={positions.balance.x}
        y={positions.balance.y + 100}
        scale={0}
        opacity={0}
      >
        {/* Shadow */}
        <Rect
          ref={balanceShadow}
          width={CUBE_SIZE}
          height={CUBE_SIZE}
          fill={colors.black}
          opacity={0}
          radius={12}
          x={12}
          y={12}
          filters={[blur(20)]}
        />

        {/* Pulse ring */}
        <Circle
          ref={balancePulseRing}
          size={CUBE_SIZE * 1.8}
          fill={null}
          stroke={colors.neon}
          lineWidth={2}
          opacity={0}
        />

        {/* Inner glow */}
        <Circle
          ref={balanceGlowInner}
          size={CUBE_SIZE * 1.5}
          fill={colors.glow}
          opacity={0}
          filters={[blur(effects.glowBlurLarge)]}
        />

        {/* Outer glow */}
        <Rect
          ref={balanceGlowOuter}
          width={CUBE_SIZE + 10}
          height={CUBE_SIZE + 10}
          fill={colors.neon}
          opacity={0}
          radius={16}
          filters={[blur(effects.glowBlur)]}
        />

        {/* Main cube */}
        <Rect
          ref={balanceCube}
          width={CUBE_SIZE}
          height={CUBE_SIZE}
          fill={null}
          stroke={colors.white}
          lineWidth={3}
          radius={12}
        />

        {/* Balance Icon (Solana logo then 0.1) */}
        <Node ref={balanceIcon} opacity={0}>
          {/* Solana logo glow (left side) */}
          <Path
            ref={balanceSolLogoGlow}
            data={SOLANA_LOGO_PATH}
            fill={colors.neon}
            opacity={0}
            scale={0.32}
            x={-28}
            y={-16}
            filters={[blur(8)]}
          />
          {/* Solana logo (left side) */}
          <Path
            ref={balanceSolLogo}
            data={SOLANA_LOGO_PATH}
            fill={colors.neon}
            opacity={0}
            scale={0.32}
            x={-28}
            y={-16}
          />
          {/* "0.1" text (right side with spacing) */}
          <Txt
            ref={balanceText}
            text="0.1"
            fontFamily="JetBrains Mono"
            fontSize={32}
            fontWeight={600}
            fill={colors.white}
            opacity={0}
            x={22}
            y={0}
          />
        </Node>
      </Node>

      {/* ===== LAYER 5: PROGRAM Cube ===== */}
      <Node
        ref={programGroup}
        x={positions.program.x}
        y={positions.program.y + 100}
        scale={0}
        opacity={0}
      >
        {/* Shadow */}
        <Rect
          ref={programShadow}
          width={CUBE_SIZE}
          height={CUBE_SIZE}
          fill={colors.black}
          opacity={0}
          radius={12}
          x={12}
          y={12}
          filters={[blur(20)]}
        />

        {/* Pulse ring */}
        <Circle
          ref={programPulseRing}
          size={CUBE_SIZE * 1.8}
          fill={null}
          stroke={colors.neon}
          lineWidth={2}
          opacity={0}
        />

        {/* Inner glow */}
        <Circle
          ref={programGlowInner}
          size={CUBE_SIZE * 1.5}
          fill={colors.glow}
          opacity={0}
          filters={[blur(effects.glowBlurLarge)]}
        />

        {/* Outer glow */}
        <Rect
          ref={programGlowOuter}
          width={CUBE_SIZE + 10}
          height={CUBE_SIZE + 10}
          fill={colors.neon}
          opacity={0}
          radius={16}
          filters={[blur(effects.glowBlur)]}
        />

        {/* Main cube */}
        <Rect
          ref={programCube}
          width={CUBE_SIZE}
          height={CUBE_SIZE}
          fill={null}
          stroke={colors.white}
          lineWidth={3}
          radius={12}
        />

        {/* Program Icon (Gear + Code) */}
        <Node ref={programIcon} opacity={0}>
          {/* Gear outer */}
          <Circle
            ref={programGearOuter}
            size={40}
            fill={null}
            stroke={colors.neon}
            lineWidth={2}
          />
          {/* Gear inner */}
          <Circle
            ref={programGearInner}
            size={26}
            fill={null}
            stroke={colors.neon}
            lineWidth={1.5}
            opacity={0}
          />
          {/* Gear center */}
          <Circle
            ref={programGearCenter}
            size={12}
            fill={colors.neon}
            opacity={0}
          />
          {/* Gear teeth */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            return (
              <Rect
                key={`program-tooth-${i}`}
                ref={programGearTeeth}
                width={8}
                height={12}
                fill={colors.neon}
                x={Math.cos(angle) * 28}
                y={Math.sin(angle) * 28}
                rotation={(angle * 180) / Math.PI + 90}
                opacity={0}
              />
            );
          })}
          {/* Code bracket left */}
          <Line
            ref={programBracketLeft}
            points={[
              [-45, -20],
              [-55, 0],
              [-45, 20],
            ]}
            stroke={colors.white}
            lineWidth={2}
            lineCap="round"
            lineJoin="round"
            end={0}
          />
          {/* Code bracket right */}
          <Line
            ref={programBracketRight}
            points={[
              [45, -20],
              [55, 0],
              [45, 20],
            ]}
            stroke={colors.white}
            lineWidth={2}
            lineCap="round"
            lineJoin="round"
            end={0}
          />
          {/* Code dots */}
          {Array.from({ length: 3 }, (_, i) => (
            <Circle
              key={`program-code-dot-${i}`}
              ref={programCodeDots}
              size={5}
              fill={colors.neon}
              x={-8 + i * 8}
              y={0}
              opacity={0}
            />
          ))}
        </Node>
      </Node>
    </>
  );

  // ============================================
  // ANIMATION TIMELINE
  // ============================================

  // ========================================
  // PHASE 1: WALLET BOX (0:00 - 2:05 internal)
  // Duration: ~2.167 seconds
  // ========================================

  // Beat 0 (0:00) - Background glow
  yield* all(
    bgGlow1().opacity(0.025, 0.2),
  );

  // Beat 1 (0:04) - Wallet cube rises in
  yield* all(
    walletGroup().scale(1, 0.4, easeOutBack),
    walletGroup().opacity(1, 0.3),
    walletGroup().y(positions.wallet.y, 0.4, easeOutCubic),
    walletShadow().opacity(0.4, 0.4),
    walletGlowInner().opacity(effects.glowOpacitySubtle, 0.4),
  );

  // Beat 2 (0:12) - Wallet icon appears
  yield* all(
    walletIcon().opacity(1, 0.2),
    walletBody().opacity(1, 0.2),
  );

  // Beat 3 (0:16) - Wallet details
  yield* all(
    walletClasp().opacity(1, 0.15),
    walletClaspGlow().opacity(0.6, 0.15),
  );

  // Beat 4 (0:20) - Card slots appear
  yield* sequence(
    0.06,
    ...walletCardSlots.map((slot) => slot.opacity(0.8, 0.12))
  );

  // Beat 5 (0:26) - Wallet glow pulse
  yield* all(
    walletGlowOuter().opacity(effects.glowOpacity, 0.12),
    walletPulseRing().opacity(0.5, 0.12),
    walletPulseRing().size(CUBE_SIZE * 2.2, 0.12, easeOutCubic),
  );
  yield* all(
    walletGlowOuter().opacity(effects.glowOpacitySubtle, 0.1),
    walletPulseRing().opacity(0, 0.1),
    walletPulseRing().size(CUBE_SIZE * 1.8, 0),
  );

  // Beat 6 (0:32) - Second background glow
  yield* all(
    bgGlow3().opacity(0.02, 0.2),
  );

  // Hold wallet visible (0:36 - 2:05)
  yield* waitFor(1.3);

  // ========================================
  // PHASE 2: BALANCE BOX (2:06 - 4:07 internal)
  // Duration: ~2.033 seconds
  // ========================================

  // Beat 7 (2:06) - Balance cube rises in
  yield* all(
    balanceGroup().scale(1, 0.4, easeOutBack),
    balanceGroup().opacity(1, 0.3),
    balanceGroup().y(positions.balance.y, 0.4, easeOutCubic),
    balanceShadow().opacity(0.4, 0.4),
    balanceGlowInner().opacity(effects.glowOpacitySubtle, 0.4),
  );

  // Beat 8 (2:16) - Balance icon container appears
  yield* balanceIcon().opacity(1, 0.15);

  // Beat 9 (2:20) - Solana logo appears first with glow
  yield* all(
    balanceSolLogo().opacity(1, 0.15),
    balanceSolLogoGlow().opacity(0.5, 0.15),
  );

  // Beat 10 (2:30) - "0.1" text fades in after logo
  yield* balanceText().opacity(1, 0.2);

  // Beat 11 (2:40) - Logo pulse
  yield* all(
    balanceSolLogoGlow().opacity(0.8, 0.1),
  );
  yield* balanceSolLogoGlow().opacity(0.4, 0.1);

  // Beat 13 (3:00) - Balance cube highlights
  yield* all(
    balanceGlowOuter().opacity(effects.glowOpacity, 0.12),
    balanceCube().stroke(colors.neon, 0.12),
    balancePulseRing().opacity(0.5, 0.12),
    balancePulseRing().size(CUBE_SIZE * 2.2, 0.12, easeOutCubic),
  );
  yield* all(
    balanceGlowOuter().opacity(effects.glowOpacitySubtle, 0.1),
    balancePulseRing().opacity(0, 0.1),
  );

  // Beat 14 (3:10) - Background intensifies
  yield* all(
    bgGlow2().opacity(0.03, 0.2),
  );

  // Hold balance visible (3:15 - 4:07)
  yield* waitFor(0.6);

  // ========================================
  // PHASE 3: PROGRAM BOX (4:08 - 6:19 internal)
  // Duration: ~2.367 seconds
  // ========================================

  // Beat 15 (4:08) - Program cube rises in
  yield* all(
    programGroup().scale(1, 0.4, easeOutBack),
    programGroup().opacity(1, 0.3),
    programGroup().y(positions.program.y, 0.4, easeOutCubic),
    programShadow().opacity(0.4, 0.4),
    programGlowInner().opacity(effects.glowOpacitySubtle, 0.4),
  );

  // Beat 16 (4:18) - Program icon appears
  yield* programIcon().opacity(1, 0.15);

  // Beat 17 (4:22) - Gear internals
  yield* all(
    programGearInner().opacity(0.7, 0.12),
    programGearCenter().opacity(1, 0.12),
  );

  // Beat 18 (4:28) - Gear teeth animate
  yield* sequence(
    0.03,
    ...programGearTeeth.map((tooth) =>
      all(
        tooth.opacity(1, 0.1),
        tooth.scale(1.1, 0.1, easeOutCubic),
      )
    )
  );
  yield* all(
    ...programGearTeeth.map((tooth) => tooth.scale(1, 0.08))
  );

  // Beat 19 (4:40) - Code brackets draw
  yield* all(
    programBracketLeft().end(1, 0.2, easeOutCubic),
    programBracketRight().end(1, 0.2, easeOutCubic),
  );

  // Beat 20 (4:48) - Code dots appear
  yield* sequence(
    0.05,
    ...programCodeDots.map((dot) => dot.opacity(1, 0.1))
  );

  // Beat 21 (4:56) - Program cube highlights
  yield* all(
    programGlowOuter().opacity(effects.glowOpacity, 0.12),
    programPulseRing().opacity(0.5, 0.12),
    programPulseRing().size(CUBE_SIZE * 2.2, 0.12, easeOutCubic),
  );
  yield* all(
    programGlowOuter().opacity(effects.glowOpacitySubtle, 0.1),
    programPulseRing().opacity(0, 0.1),
  );

  // Beat 22 (5:05) - All three cubes pulse together
  yield* all(
    walletGlowOuter().opacity(effects.glowOpacity, 0.12),
    balanceGlowOuter().opacity(effects.glowOpacity, 0.12),
    programGlowOuter().opacity(effects.glowOpacity, 0.12),
    walletGroup().scale(1.03, 0.12, easeOutCubic),
    balanceGroup().scale(1.03, 0.12, easeOutCubic),
    programGroup().scale(1.03, 0.12, easeOutCubic),
  );
  yield* all(
    walletGlowOuter().opacity(effects.glowOpacitySubtle, 0.1),
    balanceGlowOuter().opacity(effects.glowOpacitySubtle, 0.1),
    programGlowOuter().opacity(effects.glowOpacitySubtle, 0.1),
    walletGroup().scale(1, 0.1, easeInOutCubic),
    balanceGroup().scale(1, 0.1, easeInOutCubic),
    programGroup().scale(1, 0.1, easeInOutCubic),
  );

  // Beat 23 (5:15) - Ambient particles fade in
  yield* all(
    ...ambientParticles.map((p, i) =>
      delay(
        i * 0.02,
        all(
          p.opacity(0.4, 0.15),
          ambientParticleGlows[i].opacity(0.2, 0.15),
        )
      )
    )
  );

  // Beat 24 (5:25) - Background final intensity
  yield* all(
    bgGlow1().opacity(0.04, 0.2),
    bgGlow2().opacity(0.04, 0.2),
    bgGlow3().opacity(0.03, 0.2),
  );

  // Beat 25 (5:35) - Final emphasis pulse
  yield* all(
    walletGlowOuter().opacity(effects.glowOpacity * 0.8, 0.1),
    balanceGlowOuter().opacity(effects.glowOpacity * 0.8, 0.1),
    programGlowOuter().opacity(effects.glowOpacity * 0.8, 0.1),
  );

  // Hold final frame (6:00 - 6:19)
  yield* waitFor(0.65);
});
