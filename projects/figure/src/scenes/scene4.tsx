/**
 * Scene 4: Reframing the Outcome
 * Duration: ~4 seconds
 *
 * V4: Removed bottom accent line (y=350)
 * Visual: "Unified ecosystem" - interconnected nodes, network effect
 * Figure Markets branded environment, polished UI glimpse
 * Text: "One Wallet. All your assets. Your control."
 * Subline: "Trade, Lend, and Borrow. All on Figure"
 * Style: Connection beams, network grid, card enhancements, particle field
 */

import { makeScene2D } from '@revideo/2d';
import { Rect, Node, Circle, Txt, Line, blur } from '@revideo/2d';
import {
  all,
  chain,
  delay,
  sequence,
  waitFor,
  createRef,
  createSignal,
  easeOutCubic,
  easeInOutCubic,
  easeOutQuart,
  easeOutBack,
  easeInOutQuad,
  linear,
} from '@revideo/core';

import { colors, fonts, fontSizes, fontWeights, timing, effects, layout } from '../lib/brand';

export default makeScene2D('scene4', function* (view) {
  // ============================================
  // SCENE SETUP
  // ============================================
  view.fill(colors.background);

  // ============================================
  // REFS - Background Layers
  // ============================================
  const bgGlow = createRef<Circle>();
  const bgGlowSecondary = createRef<Circle>();
  const bgGlowTertiary = createRef<Circle>();
  const bgGlowDeep = createRef<Circle>();

  // Vignette corners
  const vignetteTopLeft = createRef<Circle>();
  const vignetteTopRight = createRef<Circle>();
  const vignetteBottomLeft = createRef<Circle>();
  const vignetteBottomRight = createRef<Circle>();

  // Network grid (nodes + connections pattern)
  const networkGridContainer = createRef<Node>();
  const networkNodes: Array<ReturnType<typeof createRef<Circle>>> = [];
  const networkConnections: Array<ReturnType<typeof createRef<Rect>>> = [];
  for (let i = 0; i < 24; i++) {
    networkNodes.push(createRef<Circle>());
  }
  for (let i = 0; i < 32; i++) {
    networkConnections.push(createRef<Rect>());
  }

  // Ambient particle field (20 particles)
  const particleContainer = createRef<Node>();
  const ambientParticles: Array<ReturnType<typeof createRef<Circle>>> = [];
  for (let i = 0; i < 20; i++) {
    ambientParticles.push(createRef<Circle>());
  }

  // UI Cards (abstract representation)
  const cardContainer = createRef<Node>();

  // Card 1 - Trade (with 5-layer glow)
  const card1 = createRef<Rect>();
  const card1Shadow = createRef<Rect>();
  const card1GlowOuter = createRef<Rect>();
  const card1GlowMid = createRef<Rect>();
  const card1Glow = createRef<Rect>();
  const card1Highlight = createRef<Rect>();
  const card1Icon = createRef<Circle>();
  const card1IconGlow = createRef<Circle>();
  const card1Label = createRef<Txt>();
  const card1LabelGlow = createRef<Txt>();

  // Floating icon particles around card 1 (6 particles)
  const card1Particles: Array<ReturnType<typeof createRef<Circle>>> = [];
  for (let i = 0; i < 6; i++) {
    card1Particles.push(createRef<Circle>());
  }

  // Card 2 - Lend
  const card2 = createRef<Rect>();
  const card2Shadow = createRef<Rect>();
  const card2GlowOuter = createRef<Rect>();
  const card2GlowMid = createRef<Rect>();
  const card2Glow = createRef<Rect>();
  const card2Highlight = createRef<Rect>();
  const card2Icon = createRef<Circle>();
  const card2IconGlow = createRef<Circle>();
  const card2Label = createRef<Txt>();
  const card2LabelGlow = createRef<Txt>();

  // Floating icon particles around card 2
  const card2Particles: Array<ReturnType<typeof createRef<Circle>>> = [];
  for (let i = 0; i < 6; i++) {
    card2Particles.push(createRef<Circle>());
  }

  // Card 3 - Borrow
  const card3 = createRef<Rect>();
  const card3Shadow = createRef<Rect>();
  const card3GlowOuter = createRef<Rect>();
  const card3GlowMid = createRef<Rect>();
  const card3Glow = createRef<Rect>();
  const card3Highlight = createRef<Rect>();
  const card3Icon = createRef<Circle>();
  const card3IconGlow = createRef<Circle>();
  const card3Label = createRef<Txt>();
  const card3LabelGlow = createRef<Txt>();

  // Floating icon particles around card 3
  const card3Particles: Array<ReturnType<typeof createRef<Circle>>> = [];
  for (let i = 0; i < 6; i++) {
    card3Particles.push(createRef<Circle>());
  }

  // Connection beams between cards (3 bezier connections with particles)
  const connectionContainer = createRef<Node>();
  const connection1 = createRef<Rect>();
  const connection1Glow = createRef<Rect>();
  const connection2 = createRef<Rect>();
  const connection2Glow = createRef<Rect>();
  const connection3 = createRef<Rect>();
  const connection3Glow = createRef<Rect>();

  // Pulsing data dots traveling between cards
  const dataDotsContainer = createRef<Node>();
  const dataDots: Array<ReturnType<typeof createRef<Circle>>> = [];
  for (let i = 0; i < 9; i++) {
    dataDots.push(createRef<Circle>());
  }

  // Main text with enhanced glows
  const textContainer = createRef<Node>();
  const mainTextLine1 = createRef<Txt>();
  const mainTextLine2 = createRef<Txt>();
  const mainTextLine3 = createRef<Txt>();

  const textGlow1Outer = createRef<Txt>();
  const textGlow1Mid = createRef<Txt>();
  const textGlow1 = createRef<Txt>();
  const textGlow2Outer = createRef<Txt>();
  const textGlow2Mid = createRef<Txt>();
  const textGlow2 = createRef<Txt>();
  const textGlow3Outer = createRef<Txt>();
  const textGlow3Mid = createRef<Txt>();
  const textGlow3 = createRef<Txt>();

  // Text line sweep effects
  const textSweep1 = createRef<Rect>();
  const textSweep2 = createRef<Rect>();
  const textSweep3 = createRef<Rect>();

  // Subline refs removed per V5

  // V4: Removed decorative accent elements at bottom (y=350)

  // ============================================
  // CONSTANTS
  // ============================================
  const CARD_WIDTH = 160;
  const CARD_HEIGHT = 200;
  const CARD_GAP = 40;

  // ============================================
  // NETWORK NODE POSITIONS
  // ============================================
  const networkNodePositions = [
    { x: -700, y: -350 }, { x: -550, y: -380 }, { x: -400, y: -320 },
    { x: 700, y: -350 }, { x: 550, y: -380 }, { x: 400, y: -320 },
    { x: -750, y: -150 }, { x: -600, y: -100 }, { x: -450, y: -180 },
    { x: 750, y: -150 }, { x: 600, y: -100 }, { x: 450, y: -180 },
    { x: -700, y: 150 }, { x: -550, y: 200 }, { x: -400, y: 100 },
    { x: 700, y: 150 }, { x: 550, y: 200 }, { x: 400, y: 100 },
    { x: -750, y: 350 }, { x: -600, y: 380 }, { x: -450, y: 320 },
    { x: 750, y: 350 }, { x: 600, y: 380 }, { x: 450, y: 320 },
  ];

  // ============================================
  // NETWORK CONNECTION POSITIONS
  // ============================================
  const networkConnectionPositions = [
    // Left side horizontal
    { x: -625, y: -365, width: 150, rotation: -10 },
    { x: -475, y: -350, width: 150, rotation: 20 },
    { x: -675, y: -125, width: 150, rotation: 20 },
    { x: -525, y: -140, width: 150, rotation: -30 },
    { x: -625, y: 175, width: 150, rotation: 15 },
    { x: -475, y: 150, width: 150, rotation: -25 },
    { x: -675, y: 365, width: 150, rotation: 10 },
    { x: -525, y: 350, width: 150, rotation: -15 },
    // Right side horizontal
    { x: 625, y: -365, width: 150, rotation: 10 },
    { x: 475, y: -350, width: 150, rotation: -20 },
    { x: 675, y: -125, width: 150, rotation: -20 },
    { x: 525, y: -140, width: 150, rotation: 30 },
    { x: 625, y: 175, width: 150, rotation: -15 },
    { x: 475, y: 150, width: 150, rotation: 25 },
    { x: 675, y: 365, width: 150, rotation: -10 },
    { x: 525, y: 350, width: 150, rotation: 15 },
    // Left side vertical
    { x: -700, y: -250, width: 200, rotation: 90 },
    { x: -550, y: -290, width: 180, rotation: 85 },
    { x: -700, y: 0, width: 300, rotation: 90 },
    { x: -550, y: 50, width: 200, rotation: 95 },
    { x: -700, y: 250, width: 200, rotation: 90 },
    { x: -550, y: 290, width: 180, rotation: 85 },
    // Right side vertical
    { x: 700, y: -250, width: 200, rotation: 90 },
    { x: 550, y: -290, width: 180, rotation: 95 },
    { x: 700, y: 0, width: 300, rotation: 90 },
    { x: 550, y: 50, width: 200, rotation: 85 },
    { x: 700, y: 250, width: 200, rotation: 90 },
    { x: 550, y: 290, width: 180, rotation: 95 },
    // Diagonal connections
    { x: -480, y: -250, width: 180, rotation: 45 },
    { x: 480, y: -250, width: 180, rotation: -45 },
    { x: -480, y: 250, width: 180, rotation: -45 },
    { x: 480, y: 250, width: 180, rotation: 45 },
  ];

  // ============================================
  // PARTICLE POSITIONS
  // ============================================
  const particlePositions = [
    { x: -500, y: -250, size: 3 }, { x: -350, y: -300, size: 4 },
    { x: -200, y: -280, size: 3 }, { x: 200, y: -280, size: 4 },
    { x: 350, y: -300, size: 3 }, { x: 500, y: -250, size: 4 },
    { x: -450, y: 0, size: 3 }, { x: -380, y: 50, size: 4 },
    { x: 380, y: 50, size: 3 }, { x: 450, y: 0, size: 4 },
    { x: -500, y: 250, size: 3 }, { x: -350, y: 300, size: 4 },
    { x: -200, y: 280, size: 3 }, { x: 200, y: 280, size: 4 },
    { x: 350, y: 300, size: 3 }, { x: 500, y: 250, size: 4 },
    { x: -600, y: -100, size: 3 }, { x: 600, y: -100, size: 4 },
    { x: -600, y: 100, size: 3 }, { x: 600, y: 100, size: 4 },
  ];

  // ============================================
  // CARD PARTICLE POSITIONS (relative to card center)
  // ============================================
  const cardParticlePositions = [
    { x: -60, y: -80, size: 3 }, { x: 60, y: -80, size: 3 },
    { x: -80, y: 0, size: 4 }, { x: 80, y: 0, size: 4 },
    { x: -60, y: 80, size: 3 }, { x: 60, y: 80, size: 3 },
  ];

  // ============================================
  // BUILD SCENE
  // ============================================
  view.add(
    <>
      {/* ===== LAYER 0: Deep Background ===== */}
      <Circle
        ref={bgGlowDeep}
        size={2200}
        fill={colors.background}
        opacity={1}
        x={0}
        y={0}
      />

      {/* ===== LAYER 1: Corner Vignettes ===== */}
      <Circle
        ref={vignetteTopLeft}
        size={700}
        fill={'#000000'}
        opacity={0}
        x={-layout.width / 2}
        y={-layout.height / 2}
        filters={[blur(180)]}
      />
      <Circle
        ref={vignetteTopRight}
        size={700}
        fill={'#000000'}
        opacity={0}
        x={layout.width / 2}
        y={-layout.height / 2}
        filters={[blur(180)]}
      />
      <Circle
        ref={vignetteBottomLeft}
        size={700}
        fill={'#000000'}
        opacity={0}
        x={-layout.width / 2}
        y={layout.height / 2}
        filters={[blur(180)]}
      />
      <Circle
        ref={vignetteBottomRight}
        size={700}
        fill={'#000000'}
        opacity={0}
        x={layout.width / 2}
        y={layout.height / 2}
        filters={[blur(180)]}
      />

      {/* ===== LAYER 2: Background Glows ===== */}
      <Circle
        ref={bgGlow}
        size={1200}
        fill={colors.primary}
        opacity={0.04}
        x={0}
        y={0}
        filters={[blur(300)]}
      />
      <Circle
        ref={bgGlowSecondary}
        size={800}
        fill={colors.secondary}
        opacity={0.03}
        x={300}
        y={-150}
        filters={[blur(220)]}
      />
      <Circle
        ref={bgGlowTertiary}
        size={600}
        fill={colors.accent}
        opacity={0}
        x={-200}
        y={100}
        filters={[blur(180)]}
      />

      {/* ===== LAYER 3: Network Grid ===== */}
      <Node ref={networkGridContainer} opacity={0}>
        {networkConnectionPositions.map((pos, i) => (
          <Rect
            ref={networkConnections[i]}
            key={`net-conn-${i}`}
            width={0}
            height={1}
            fill={i % 2 === 0 ? colors.primary : colors.secondary}
            opacity={0.06}
            x={pos.x}
            y={pos.y}
            rotation={pos.rotation}
            filters={[blur(1)]}
          />
        ))}
        {networkNodePositions.map((pos, i) => (
          <Circle
            ref={networkNodes[i]}
            key={`net-node-${i}`}
            size={5}
            fill={i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent}
            opacity={0}
            x={pos.x}
            y={pos.y}
          />
        ))}
      </Node>

      {/* ===== LAYER 4: Ambient Particles ===== */}
      <Node ref={particleContainer} opacity={0}>
        {particlePositions.map((pos, i) => (
          <Circle
            ref={ambientParticles[i]}
            key={`particle-${i}`}
            size={pos.size}
            fill={i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.text}
            opacity={0}
            x={pos.x}
            y={pos.y}
            filters={[blur(1)]}
          />
        ))}
      </Node>

      {/* ===== LAYER 5: UI Cards ===== */}
      <Node ref={cardContainer} y={-80}>
        {/* Card 1 - Trade */}
        <Node x={-(CARD_WIDTH + CARD_GAP)}>
          <Rect
            ref={card1Shadow}
            width={CARD_WIDTH + 10}
            height={CARD_HEIGHT + 10}
            fill={'#000000'}
            opacity={0}
            y={8}
            radius={20}
            filters={[blur(30)]}
          />
          <Rect
            ref={card1GlowOuter}
            width={CARD_WIDTH + 30}
            height={CARD_HEIGHT + 30}
            fill={colors.primary}
            opacity={0}
            radius={28}
            filters={[blur(50)]}
          />
          <Rect
            ref={card1GlowMid}
            width={CARD_WIDTH + 15}
            height={CARD_HEIGHT + 15}
            fill={colors.primary}
            opacity={0}
            radius={22}
            filters={[blur(30)]}
          />
          <Rect
            ref={card1Glow}
            width={CARD_WIDTH + 8}
            height={CARD_HEIGHT + 8}
            fill={colors.primary}
            opacity={0}
            radius={20}
            filters={[blur(25)]}
          />
          <Rect
            ref={card1}
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            fill={colors.background}
            stroke={colors.primary}
            lineWidth={1.5}
            opacity={0}
            radius={16}
          />
          <Rect
            ref={card1Highlight}
            width={CARD_WIDTH - 20}
            height={4}
            fill={colors.primary}
            opacity={0}
            y={-CARD_HEIGHT / 2 + 20}
            radius={2}
          />
          <Circle
            ref={card1IconGlow}
            size={70}
            fill={colors.primary}
            opacity={0}
            y={-40}
            filters={[blur(20)]}
          />
          <Circle
            ref={card1Icon}
            size={50}
            fill={null}
            stroke={colors.primary}
            lineWidth={2}
            y={-40}
            opacity={0}
          />
          <Txt
            ref={card1LabelGlow}
            text="Trade"
            fontFamily={fonts.heading}
            fontSize={fontSizes.caption}
            fontWeight={fontWeights.semibold}
            fill={colors.primary}
            y={30}
            opacity={0}
            filters={[blur(10)]}
          />
          <Txt
            ref={card1Label}
            text="Trade"
            fontFamily={fonts.heading}
            fontSize={fontSizes.caption}
            fontWeight={fontWeights.semibold}
            fill={colors.text}
            y={30}
            opacity={0}
          />
          {/* Card 1 particles */}
          {cardParticlePositions.map((pos, i) => (
            <Circle
              ref={card1Particles[i]}
              key={`c1p-${i}`}
              size={pos.size}
              fill={colors.primary}
              opacity={0}
              x={pos.x}
              y={pos.y}
              filters={[blur(2)]}
            />
          ))}
        </Node>

        {/* Card 2 - Lend */}
        <Node x={0}>
          <Rect
            ref={card2Shadow}
            width={CARD_WIDTH + 10}
            height={CARD_HEIGHT + 10}
            fill={'#000000'}
            opacity={0}
            y={8}
            radius={20}
            filters={[blur(30)]}
          />
          <Rect
            ref={card2GlowOuter}
            width={CARD_WIDTH + 30}
            height={CARD_HEIGHT + 30}
            fill={colors.secondary}
            opacity={0}
            radius={28}
            filters={[blur(50)]}
          />
          <Rect
            ref={card2GlowMid}
            width={CARD_WIDTH + 15}
            height={CARD_HEIGHT + 15}
            fill={colors.secondary}
            opacity={0}
            radius={22}
            filters={[blur(30)]}
          />
          <Rect
            ref={card2Glow}
            width={CARD_WIDTH + 8}
            height={CARD_HEIGHT + 8}
            fill={colors.secondary}
            opacity={0}
            radius={20}
            filters={[blur(25)]}
          />
          <Rect
            ref={card2}
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            fill={colors.background}
            stroke={colors.secondary}
            lineWidth={1.5}
            opacity={0}
            radius={16}
          />
          <Rect
            ref={card2Highlight}
            width={CARD_WIDTH - 20}
            height={4}
            fill={colors.secondary}
            opacity={0}
            y={-CARD_HEIGHT / 2 + 20}
            radius={2}
          />
          <Circle
            ref={card2IconGlow}
            size={70}
            fill={colors.secondary}
            opacity={0}
            y={-40}
            filters={[blur(20)]}
          />
          <Circle
            ref={card2Icon}
            size={50}
            fill={null}
            stroke={colors.secondary}
            lineWidth={2}
            y={-40}
            opacity={0}
          />
          <Txt
            ref={card2LabelGlow}
            text="Lend"
            fontFamily={fonts.heading}
            fontSize={fontSizes.caption}
            fontWeight={fontWeights.semibold}
            fill={colors.secondary}
            y={30}
            opacity={0}
            filters={[blur(10)]}
          />
          <Txt
            ref={card2Label}
            text="Lend"
            fontFamily={fonts.heading}
            fontSize={fontSizes.caption}
            fontWeight={fontWeights.semibold}
            fill={colors.text}
            y={30}
            opacity={0}
          />
          {/* Card 2 particles */}
          {cardParticlePositions.map((pos, i) => (
            <Circle
              ref={card2Particles[i]}
              key={`c2p-${i}`}
              size={pos.size}
              fill={colors.secondary}
              opacity={0}
              x={pos.x}
              y={pos.y}
              filters={[blur(2)]}
            />
          ))}
        </Node>

        {/* Card 3 - Borrow */}
        <Node x={CARD_WIDTH + CARD_GAP}>
          <Rect
            ref={card3Shadow}
            width={CARD_WIDTH + 10}
            height={CARD_HEIGHT + 10}
            fill={'#000000'}
            opacity={0}
            y={8}
            radius={20}
            filters={[blur(30)]}
          />
          <Rect
            ref={card3GlowOuter}
            width={CARD_WIDTH + 30}
            height={CARD_HEIGHT + 30}
            fill={colors.accent}
            opacity={0}
            radius={28}
            filters={[blur(50)]}
          />
          <Rect
            ref={card3GlowMid}
            width={CARD_WIDTH + 15}
            height={CARD_HEIGHT + 15}
            fill={colors.accent}
            opacity={0}
            radius={22}
            filters={[blur(30)]}
          />
          <Rect
            ref={card3Glow}
            width={CARD_WIDTH + 8}
            height={CARD_HEIGHT + 8}
            fill={colors.accent}
            opacity={0}
            radius={20}
            filters={[blur(25)]}
          />
          <Rect
            ref={card3}
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            fill={colors.background}
            stroke={colors.accent}
            lineWidth={1.5}
            opacity={0}
            radius={16}
          />
          <Rect
            ref={card3Highlight}
            width={CARD_WIDTH - 20}
            height={4}
            fill={colors.accent}
            opacity={0}
            y={-CARD_HEIGHT / 2 + 20}
            radius={2}
          />
          <Circle
            ref={card3IconGlow}
            size={70}
            fill={colors.accent}
            opacity={0}
            y={-40}
            filters={[blur(20)]}
          />
          <Circle
            ref={card3Icon}
            size={50}
            fill={null}
            stroke={colors.accent}
            lineWidth={2}
            y={-40}
            opacity={0}
          />
          <Txt
            ref={card3LabelGlow}
            text="Borrow"
            fontFamily={fonts.heading}
            fontSize={fontSizes.caption}
            fontWeight={fontWeights.semibold}
            fill={colors.accent}
            y={30}
            opacity={0}
            filters={[blur(10)]}
          />
          <Txt
            ref={card3Label}
            text="Borrow"
            fontFamily={fonts.heading}
            fontSize={fontSizes.caption}
            fontWeight={fontWeights.semibold}
            fill={colors.text}
            y={30}
            opacity={0}
          />
          {/* Card 3 particles */}
          {cardParticlePositions.map((pos, i) => (
            <Circle
              ref={card3Particles[i]}
              key={`c3p-${i}`}
              size={pos.size}
              fill={colors.accent}
              opacity={0}
              x={pos.x}
              y={pos.y}
              filters={[blur(2)]}
            />
          ))}
        </Node>
      </Node>

      {/* ===== LAYER 6: Connection Beams Between Cards ===== */}
      <Node ref={connectionContainer} y={-80} opacity={0}>
        {/* Connection 1: Card 1 to Card 2 */}
        <Rect
          ref={connection1Glow}
          width={0}
          height={6}
          fill={colors.primary}
          opacity={0.2}
          x={-(CARD_WIDTH + CARD_GAP) / 2}
          y={0}
          filters={[blur(10)]}
        />
        <Rect
          ref={connection1}
          width={0}
          height={2}
          fill={colors.primary}
          opacity={0.5}
          x={-(CARD_WIDTH + CARD_GAP) / 2}
          y={0}
          filters={[blur(2)]}
        />

        {/* Connection 2: Card 2 to Card 3 */}
        <Rect
          ref={connection2Glow}
          width={0}
          height={6}
          fill={colors.secondary}
          opacity={0.2}
          x={(CARD_WIDTH + CARD_GAP) / 2}
          y={0}
          filters={[blur(10)]}
        />
        <Rect
          ref={connection2}
          width={0}
          height={2}
          fill={colors.secondary}
          opacity={0.5}
          x={(CARD_WIDTH + CARD_GAP) / 2}
          y={0}
          filters={[blur(2)]}
        />

        {/* Connection 3: Curved connection above (visual arc) */}
        <Rect
          ref={connection3Glow}
          width={0}
          height={4}
          fill={colors.accent}
          opacity={0.15}
          x={0}
          y={-120}
          filters={[blur(8)]}
        />
        <Rect
          ref={connection3}
          width={0}
          height={1}
          fill={colors.accent}
          opacity={0.4}
          x={0}
          y={-120}
          filters={[blur(2)]}
        />
      </Node>

      {/* ===== LAYER 7: Data Dots ===== */}
      <Node ref={dataDotsContainer} y={-80} opacity={0}>
        {/* Data dots for connection 1 */}
        <Circle ref={dataDots[0]} size={4} fill={colors.primary} opacity={0} x={-(CARD_WIDTH + CARD_GAP) / 2 - 30} y={0} />
        <Circle ref={dataDots[1]} size={4} fill={colors.primary} opacity={0} x={-(CARD_WIDTH + CARD_GAP) / 2} y={0} />
        <Circle ref={dataDots[2]} size={4} fill={colors.primary} opacity={0} x={-(CARD_WIDTH + CARD_GAP) / 2 + 30} y={0} />

        {/* Data dots for connection 2 */}
        <Circle ref={dataDots[3]} size={4} fill={colors.secondary} opacity={0} x={(CARD_WIDTH + CARD_GAP) / 2 - 30} y={0} />
        <Circle ref={dataDots[4]} size={4} fill={colors.secondary} opacity={0} x={(CARD_WIDTH + CARD_GAP) / 2} y={0} />
        <Circle ref={dataDots[5]} size={4} fill={colors.secondary} opacity={0} x={(CARD_WIDTH + CARD_GAP) / 2 + 30} y={0} />

        {/* Data dots for connection 3 */}
        <Circle ref={dataDots[6]} size={3} fill={colors.accent} opacity={0} x={-80} y={-120} />
        <Circle ref={dataDots[7]} size={3} fill={colors.accent} opacity={0} x={0} y={-120} />
        <Circle ref={dataDots[8]} size={3} fill={colors.accent} opacity={0} x={80} y={-120} />
      </Node>

      {/* ===== LAYER 8: Main Text with Enhanced Glows ===== */}
      <Node ref={textContainer} y={160}>
        {/* Line 1: "One Wallet." */}
        <Rect
          ref={textSweep1}
          width={0}
          height={60}
          fill={colors.primary}
          opacity={0}
          y={0}
          x={-200}
          filters={[blur(30)]}
        />
        <Txt
          ref={textGlow1Outer}
          text="One Wallet."
          fontFamily={fonts.display}
          fontSize={fontSizes.h2}
          fontWeight={fontWeights.bold}
          fill={colors.primary}
          opacity={0}
          y={0}
          letterSpacing={-1}
          filters={[blur(40)]}
        />
        <Txt
          ref={textGlow1Mid}
          text="One Wallet."
          fontFamily={fonts.display}
          fontSize={fontSizes.h2}
          fontWeight={fontWeights.bold}
          fill={colors.primary}
          opacity={0}
          y={0}
          letterSpacing={-1}
          filters={[blur(25)]}
        />
        <Txt
          ref={textGlow1}
          text="One Wallet."
          fontFamily={fonts.display}
          fontSize={fontSizes.h2}
          fontWeight={fontWeights.bold}
          fill={colors.primary}
          opacity={0}
          y={0}
          letterSpacing={-1}
          filters={[blur(12)]}
        />
        <Txt
          ref={mainTextLine1}
          text="One Wallet."
          fontFamily={fonts.display}
          fontSize={fontSizes.h2}
          fontWeight={fontWeights.bold}
          fill={colors.text}
          opacity={0}
          y={0}
          letterSpacing={-1}
        />

        {/* Line 2: "All your assets." */}
        <Rect
          ref={textSweep2}
          width={0}
          height={60}
          fill={colors.secondary}
          opacity={0}
          y={60}
          x={-200}
          filters={[blur(30)]}
        />
        <Txt
          ref={textGlow2Outer}
          text="All your assets."
          fontFamily={fonts.display}
          fontSize={fontSizes.h2}
          fontWeight={fontWeights.bold}
          fill={colors.secondary}
          opacity={0}
          y={60}
          letterSpacing={-1}
          filters={[blur(40)]}
        />
        <Txt
          ref={textGlow2Mid}
          text="All your assets."
          fontFamily={fonts.display}
          fontSize={fontSizes.h2}
          fontWeight={fontWeights.bold}
          fill={colors.secondary}
          opacity={0}
          y={60}
          letterSpacing={-1}
          filters={[blur(25)]}
        />
        <Txt
          ref={textGlow2}
          text="All your assets."
          fontFamily={fonts.display}
          fontSize={fontSizes.h2}
          fontWeight={fontWeights.bold}
          fill={colors.secondary}
          opacity={0}
          y={60}
          letterSpacing={-1}
          filters={[blur(12)]}
        />
        <Txt
          ref={mainTextLine2}
          text="All your assets."
          fontFamily={fonts.display}
          fontSize={fontSizes.h2}
          fontWeight={fontWeights.bold}
          fill={colors.text}
          opacity={0}
          y={60}
          letterSpacing={-1}
        />

        {/* Line 3: "Your control." */}
        <Rect
          ref={textSweep3}
          width={0}
          height={60}
          fill={colors.accent}
          opacity={0}
          y={120}
          x={-200}
          filters={[blur(30)]}
        />
        <Txt
          ref={textGlow3Outer}
          text="Your control."
          fontFamily={fonts.display}
          fontSize={fontSizes.h2}
          fontWeight={fontWeights.bold}
          fill={colors.accent}
          opacity={0}
          y={120}
          letterSpacing={-1}
          filters={[blur(40)]}
        />
        <Txt
          ref={textGlow3Mid}
          text="Your control."
          fontFamily={fonts.display}
          fontSize={fontSizes.h2}
          fontWeight={fontWeights.bold}
          fill={colors.accent}
          opacity={0}
          y={120}
          letterSpacing={-1}
          filters={[blur(25)]}
        />
        <Txt
          ref={textGlow3}
          text="Your control."
          fontFamily={fonts.display}
          fontSize={fontSizes.h2}
          fontWeight={fontWeights.bold}
          fill={colors.accent}
          opacity={0}
          y={120}
          letterSpacing={-1}
          filters={[blur(12)]}
        />
        <Txt
          ref={mainTextLine3}
          text="Your control."
          fontFamily={fonts.display}
          fontSize={fontSizes.h2}
          fontWeight={fontWeights.bold}
          fill={colors.text}
          opacity={0}
          y={120}
          letterSpacing={-1}
        />

        {/* Subline - removed per V5 */}
      </Node>

      {/* V4: Removed accent line at y=350 */}
    </>
  );

  // ============================================
  // ANIMATION TIMELINE - 35+ Beats
  // ============================================

  // Beat 0 (0:00) - Vignettes and initial background
  yield* all(
    vignetteTopLeft().opacity(0.25, timing.smooth),
    vignetteTopRight().opacity(0.25, timing.smooth),
    vignetteBottomLeft().opacity(0.25, timing.smooth),
    vignetteBottomRight().opacity(0.25, timing.smooth),
  );

  // Beat 1 (0:06) - Network grid connections appear
  yield* all(
    networkGridContainer().opacity(1, timing.entrance),
    ...networkConnections.map((conn, i) =>
      delay(i * 0.02, conn().width(networkConnectionPositions[i].width, timing.smooth, easeOutCubic))
    ),
  );

  // Beat 2 (0:12) - Network nodes appear
  yield* all(
    ...networkNodes.map((node, i) =>
      delay(i * 0.03, node().opacity(0.4, timing.entrance))
    ),
  );

  // Beat 3 (0:18) - Ambient particles fade in
  yield* all(
    particleContainer().opacity(1, timing.entrance),
    ...ambientParticles.map((particle, i) =>
      delay(i * 0.02, particle().opacity(0.5, timing.entrance))
    ),
  );

  // Beat 4 (0:24) - Cards appear with stagger (shadows first)
  yield* sequence(
    0.1,
    all(
      card1Shadow().opacity(0.3, timing.entrance),
      card1().opacity(1, timing.entrance),
      card1().y(0, timing.entrance, easeOutCubic),
    ),
    all(
      card2Shadow().opacity(0.3, timing.entrance),
      card2().opacity(1, timing.entrance),
      card2().y(0, timing.entrance, easeOutCubic),
    ),
    all(
      card3Shadow().opacity(0.3, timing.entrance),
      card3().opacity(1, timing.entrance),
      card3().y(0, timing.entrance, easeOutCubic),
    ),
  );

  // Beat 5 (0:32) - Card glow layers appear
  yield* all(
    card1GlowOuter().opacity(0.1, timing.entrance),
    card1GlowMid().opacity(0.15, timing.entrance),
    card1Glow().opacity(0.25, timing.entrance),
    card2GlowOuter().opacity(0.1, timing.entrance),
    card2GlowMid().opacity(0.15, timing.entrance),
    card2Glow().opacity(0.25, timing.entrance),
    card3GlowOuter().opacity(0.1, timing.entrance),
    card3GlowMid().opacity(0.15, timing.entrance),
    card3Glow().opacity(0.25, timing.entrance),
  );

  // Beat 6 (0:38) - Card icons and labels appear
  yield* all(
    card1Icon().opacity(1, timing.fast),
    card1IconGlow().opacity(0.3, timing.fast),
    card1Label().opacity(1, timing.fast),
    card1LabelGlow().opacity(0.4, timing.fast),
    card1Highlight().opacity(0.6, timing.fast),
    card2Icon().opacity(1, timing.fast),
    card2IconGlow().opacity(0.3, timing.fast),
    card2Label().opacity(1, timing.fast),
    card2LabelGlow().opacity(0.4, timing.fast),
    card2Highlight().opacity(0.6, timing.fast),
    card3Icon().opacity(1, timing.fast),
    card3IconGlow().opacity(0.3, timing.fast),
    card3Label().opacity(1, timing.fast),
    card3LabelGlow().opacity(0.4, timing.fast),
    card3Highlight().opacity(0.6, timing.fast),
  );

  // Beat 7 (0:44) - Card particles appear
  yield* all(
    ...card1Particles.map((p, i) => delay(i * 0.03, p().opacity(0.4, timing.entrance))),
    ...card2Particles.map((p, i) => delay(i * 0.03, p().opacity(0.4, timing.entrance))),
    ...card3Particles.map((p, i) => delay(i * 0.03, p().opacity(0.4, timing.entrance))),
  );

  // Beat 8 (0:50) - Connection beams appear
  yield* all(
    connectionContainer().opacity(1, timing.fast),
    connection1().width(CARD_GAP, timing.smooth, easeOutCubic),
    connection1Glow().width(CARD_GAP, timing.smooth, easeOutCubic),
    delay(0.1, all(
      connection2().width(CARD_GAP, timing.smooth, easeOutCubic),
      connection2Glow().width(CARD_GAP, timing.smooth, easeOutCubic),
    )),
    delay(0.2, all(
      connection3().width(CARD_WIDTH * 2 + CARD_GAP * 2, timing.smooth, easeOutCubic),
      connection3Glow().width(CARD_WIDTH * 2 + CARD_GAP * 2, timing.smooth, easeOutCubic),
    )),
  );

  // Beat 9 (0:56) - Data dots appear
  yield* all(
    dataDotsContainer().opacity(1, timing.entrance),
    ...dataDots.map((dot, i) =>
      delay(i * 0.04, dot().opacity(0.7, timing.entrance))
    ),
  );

  // Beat 10 (1:02) - First text line with sweep
  yield* all(
    textSweep1().opacity(0.15, timing.fast),
    textSweep1().width(300, timing.smooth, easeOutCubic),
    textSweep1().x(0, timing.smooth, easeOutCubic),
    textGlow1Outer().opacity(0.15, timing.entrance),
    textGlow1Mid().opacity(0.25, timing.entrance),
    textGlow1().opacity(0.5, timing.entrance),
    mainTextLine1().opacity(1, timing.entrance),
    bgGlow().opacity(0.08, timing.entrance),
  );
  yield* textSweep1().opacity(0, timing.beat);

  // Beat 11 (1:08) - Second text line with sweep
  yield* all(
    textSweep2().opacity(0.15, timing.fast),
    textSweep2().width(350, timing.smooth, easeOutCubic),
    textSweep2().x(0, timing.smooth, easeOutCubic),
    textGlow2Outer().opacity(0.15, timing.entrance),
    textGlow2Mid().opacity(0.25, timing.entrance),
    textGlow2().opacity(0.5, timing.entrance),
    mainTextLine2().opacity(1, timing.entrance),
  );
  yield* textSweep2().opacity(0, timing.beat);

  // Beat 12 (1:14) - Third text line with sweep
  yield* all(
    textSweep3().opacity(0.15, timing.fast),
    textSweep3().width(300, timing.smooth, easeOutCubic),
    textSweep3().x(0, timing.smooth, easeOutCubic),
    textGlow3Outer().opacity(0.15, timing.entrance),
    textGlow3Mid().opacity(0.25, timing.entrance),
    textGlow3().opacity(0.5, timing.entrance),
    mainTextLine3().opacity(1, timing.entrance),
    bgGlowTertiary().opacity(0.04, timing.entrance),
  );
  yield* textSweep3().opacity(0, timing.beat);

  // Beat 13 (1:20) - Subline removed per V5

  // V4: Removed accent line animation (Beat 14)

  // Beat 15 (1:32) - Unified glow pulse across all cards
  yield* all(
    card1Glow().opacity(0.45, timing.fast),
    card1GlowMid().opacity(0.3, timing.fast),
    card2Glow().opacity(0.45, timing.fast),
    card2GlowMid().opacity(0.3, timing.fast),
    card3Glow().opacity(0.45, timing.fast),
    card3GlowMid().opacity(0.3, timing.fast),
  );
  yield* all(
    card1Glow().opacity(0.25, timing.beat),
    card1GlowMid().opacity(0.15, timing.beat),
    card2Glow().opacity(0.25, timing.beat),
    card2GlowMid().opacity(0.15, timing.beat),
    card3Glow().opacity(0.25, timing.beat),
    card3GlowMid().opacity(0.15, timing.beat),
  );

  // Beat 16 (1:38) - Data dots pulse and travel
  yield* all(
    ...dataDots.slice(0, 3).map((dot, i) =>
      dot().x(-(CARD_WIDTH + CARD_GAP) / 2 - 30 + (i + 1) * 25, timing.smooth, linear)
    ),
    ...dataDots.slice(3, 6).map((dot, i) =>
      dot().x((CARD_WIDTH + CARD_GAP) / 2 - 30 + (i + 1) * 25, timing.smooth, linear)
    ),
    ...dataDots.slice(6, 9).map((dot, i) =>
      dot().x(-80 + (i + 1) * 50, timing.smooth, linear)
    ),
  );

  // Beat 17 (1:44) - Network nodes pulse
  yield* all(
    ...networkNodes.map((node, i) =>
      delay(i * 0.02, node().opacity(0.7, timing.fast))
    ),
  );
  yield* all(
    ...networkNodes.map((node, i) =>
      delay(i * 0.02, node().opacity(0.35, timing.beat))
    ),
  );

  // Beat 18 (1:50) - Card particles float up
  yield* all(
    ...card1Particles.map((p, i) =>
      p().y(cardParticlePositions[i].y - 10, timing.smooth, linear)
    ),
    ...card2Particles.map((p, i) =>
      p().y(cardParticlePositions[i].y - 10, timing.smooth, linear)
    ),
    ...card3Particles.map((p, i) =>
      p().y(cardParticlePositions[i].y - 10, timing.smooth, linear)
    ),
  );

  // Beat 19 (1:56) - Connection beams pulse
  yield* all(
    connection1().opacity(0.8, timing.fast),
    connection1Glow().opacity(0.35, timing.fast),
    connection2().opacity(0.8, timing.fast),
    connection2Glow().opacity(0.35, timing.fast),
    connection3().opacity(0.6, timing.fast),
    connection3Glow().opacity(0.25, timing.fast),
  );
  yield* all(
    connection1().opacity(0.5, timing.beat),
    connection1Glow().opacity(0.2, timing.beat),
    connection2().opacity(0.5, timing.beat),
    connection2Glow().opacity(0.2, timing.beat),
    connection3().opacity(0.4, timing.beat),
    connection3Glow().opacity(0.15, timing.beat),
  );

  // Beat 20 (2:02) - Text glow pulse
  yield* all(
    textGlow1().opacity(0.7, timing.fast),
    textGlow1Mid().opacity(0.4, timing.fast),
    textGlow2().opacity(0.7, timing.fast),
    textGlow2Mid().opacity(0.4, timing.fast),
    textGlow3().opacity(0.7, timing.fast),
    textGlow3Mid().opacity(0.4, timing.fast),
  );
  yield* all(
    textGlow1().opacity(0.4, timing.beat),
    textGlow1Mid().opacity(0.2, timing.beat),
    textGlow2().opacity(0.4, timing.beat),
    textGlow2Mid().opacity(0.2, timing.beat),
    textGlow3().opacity(0.4, timing.beat),
    textGlow3Mid().opacity(0.2, timing.beat),
  );

  // Beat 21 (2:08) - Background glow intensifies
  yield* all(
    bgGlow().opacity(0.1, timing.fast),
    bgGlowSecondary().opacity(0.06, timing.fast),
    bgGlowTertiary().opacity(0.05, timing.fast),
  );

  // Beat 22 (2:14) - Ambient particles pulse
  yield* all(
    ...ambientParticles.map((p, i) =>
      delay(i * 0.02, p().opacity(0.7, timing.fast))
    ),
  );
  yield* all(
    ...ambientParticles.map((p, i) =>
      delay(i * 0.02, p().opacity(0.4, timing.beat))
    ),
  );

  // Beat 23 (2:20) - Card icon glow pulse
  yield* all(
    card1IconGlow().opacity(0.5, timing.fast),
    card2IconGlow().opacity(0.5, timing.fast),
    card3IconGlow().opacity(0.5, timing.fast),
  );
  yield* all(
    card1IconGlow().opacity(0.25, timing.beat),
    card2IconGlow().opacity(0.25, timing.beat),
    card3IconGlow().opacity(0.25, timing.beat),
  );

  // V4: Removed accent dots pulse (Beat 24)

  // Beat 25 (2:32) - Final card glow pulse
  yield* all(
    card1GlowOuter().opacity(0.2, timing.fast),
    card1Glow().opacity(0.4, timing.fast),
    card2GlowOuter().opacity(0.2, timing.fast),
    card2Glow().opacity(0.4, timing.fast),
    card3GlowOuter().opacity(0.2, timing.fast),
    card3Glow().opacity(0.4, timing.fast),
  );
  yield* all(
    card1GlowOuter().opacity(0.1, timing.beat),
    card1Glow().opacity(0.25, timing.beat),
    card2GlowOuter().opacity(0.1, timing.beat),
    card2Glow().opacity(0.25, timing.beat),
    card3GlowOuter().opacity(0.1, timing.beat),
    card3Glow().opacity(0.25, timing.beat),
  );

  // Hold (2:38 - 4:00) - reduced for faster pacing
  yield* waitFor(0.4);

  // V4: Fade out without accent line elements
  yield* all(
    cardContainer().opacity(0, timing.exit),
    connectionContainer().opacity(0, timing.exit),
    dataDotsContainer().opacity(0, timing.exit),
    mainTextLine1().opacity(0, timing.exit),
    mainTextLine2().opacity(0, timing.exit),
    mainTextLine3().opacity(0, timing.exit),
    textGlow1().opacity(0, timing.exit),
    textGlow1Mid().opacity(0, timing.exit),
    textGlow1Outer().opacity(0, timing.exit),
    textGlow2().opacity(0, timing.exit),
    textGlow2Mid().opacity(0, timing.exit),
    textGlow2Outer().opacity(0, timing.exit),
    textGlow3().opacity(0, timing.exit),
    textGlow3Mid().opacity(0, timing.exit),
    textGlow3Outer().opacity(0, timing.exit),
    networkGridContainer().opacity(0, timing.exit),
    particleContainer().opacity(0, timing.exit),
    bgGlow().opacity(0.03, timing.exit),
    bgGlowSecondary().opacity(0.02, timing.exit),
    bgGlowTertiary().opacity(0, timing.exit),
    vignetteTopLeft().opacity(0.15, timing.exit),
    vignetteTopRight().opacity(0.15, timing.exit),
    vignetteBottomLeft().opacity(0.15, timing.exit),
    vignetteBottomRight().opacity(0.15, timing.exit),
  );
});
