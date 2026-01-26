/**
 * Scene 5: Parallel Execution
 * Duration: 13 seconds (11 sec intro + 2 sec parallel flow)
 * VO: "When you make a transaction, you tell Solana which boxes you need.
 *      If you're not fighting over the same boxes, everyone runs at the same time."
 *
 * Visual: Envelope/transaction appears with target boxes listed.
 *         Multiple users send beams to different boxes (parallel success).
 *         One user tries same box as another (has to wait).
 *         Ends with warehouse alive with parallel connections.
 *
 * Enhanced with:
 * - Animated transaction envelope with seal
 * - Clear conflict visualization (blocking effect)
 * - Sophisticated beam particles with trails
 * - Dramatic parallel flow finale (2 sec)
 * - Background data stream layer
 */

import { makeScene2D } from '@revideo/2d';
import { Rect, Node, Line, Circle, Path, Txt, blur } from '@revideo/2d';
import {
  all,
  chain,
  delay,
  sequence,
  waitFor,
  loop,
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

import { RAIKU, colors, timing, effects, layout, cube, fonts, fontSizes } from '../lib/raiku';

export default makeScene2D('scene5', function* (view) {
  // ============================================
  // SCENE SETUP
  // ============================================
  view.fill(colors.background);

  // ============================================
  // REFS - Background Layers
  // ============================================
  const bgGlow1 = createRef<Circle>();
  const bgGlow2 = createRef<Circle>();
  const bgGlow3 = createRef<Circle>();
  const bgGridLines = createRefArray<Line>();
  const bgVerticalLines = createRefArray<Line>();

  // Hexagonal grid
  const hexGridGroup = createRef<Node>();
  const hexCells = createRefArray<Path>();
  const hexGlows = createRefArray<Path>();

  // Corner vignettes
  const vignetteTopLeft = createRef<Rect>();
  const vignetteTopRight = createRef<Rect>();
  const vignetteBottomLeft = createRef<Rect>();
  const vignetteBottomRight = createRef<Rect>();

  // Background data streams
  const dataStreamGroup = createRef<Node>();
  const dataStreams = createRefArray<Line>();
  const dataStreamParticles = createRefArray<Circle>();

  // ============================================
  // REFS - Transaction Envelope (Enhanced)
  // ============================================
  const envelopeGroup = createRef<Node>();
  const envelopeBody = createRef<Rect>();
  const envelopeFlap = createRef<Path>();
  const envelopeGlow = createRef<Rect>();
  const envelopeDepth = createRef<Rect>();

  // Envelope seal
  const envelopeSeal = createRef<Circle>();
  const envelopeSealGlow = createRef<Circle>();
  const envelopeSealIcon = createRef<Path>();

  // Target list inside envelope
  const envelopeDottedLines = createRefArray<Line>();
  const envelopeTargetLabels = createRefArray<Txt>();
  const envelopeTargetDots = createRefArray<Circle>();

  // Envelope opening animation
  const envelopeOpenLines = createRefArray<Line>();

  // ============================================
  // REFS - Target Boxes (A, B, C, D)
  // ============================================
  const boxesGroup = createRef<Node>();
  const targetBoxes = createRefArray<Node>();
  const targetBoxRects = createRefArray<Rect>();
  const targetBoxGlows = createRefArray<Rect>();
  const targetBoxDepths = createRefArray<Rect>();
  const targetBoxLabels = createRefArray<Txt>();
  const targetBoxIcons = createRefArray<Circle>();
  const targetBoxInners = createRefArray<Rect>();

  // ============================================
  // REFS - User Silhouettes (Enhanced)
  // ============================================
  const usersGroup = createRef<Node>();
  const userNodes = createRefArray<Node>();
  const userBodies = createRefArray<Circle>();
  const userHeads = createRefArray<Circle>();
  const userGlows = createRefArray<Circle>();
  const userLabels = createRefArray<Txt>();
  const userAuras = createRefArray<Circle>();

  // ============================================
  // REFS - Connection Beams with Particles
  // ============================================
  const beamsGroup = createRef<Node>();
  const user1Beams = createRefArray<Line>();
  const user1BeamGlows = createRefArray<Line>();
  const user1BeamParticles = createRefArray<Circle>();
  const user1BeamTrails = createRefArray<Circle>();

  const user2Beams = createRefArray<Line>();
  const user2BeamGlows = createRefArray<Line>();
  const user2BeamParticles = createRefArray<Circle>();
  const user2BeamTrails = createRefArray<Circle>();

  const user3Beam = createRef<Line>();
  const user3BeamGlow = createRef<Line>();
  const user3BeamParticle = createRef<Circle>();

  // ============================================
  // REFS - Conflict Visualization (Enhanced)
  // ============================================
  const conflictGroup = createRef<Node>();
  const conflictBarrier = createRef<Rect>();
  const conflictBarrierGlow = createRef<Rect>();
  const conflictX = createRef<Node>();
  const conflictXLines = createRefArray<Line>();
  const conflictWaves = createRefArray<Circle>();
  const conflictText = createRef<Txt>();

  // ============================================
  // REFS - Status Indicators
  // ============================================
  const checkmarks = createRefArray<Node>();
  const checkmarkCircles = createRefArray<Circle>();
  const checkmarkLines = createRefArray<Line>();

  const waitIcon = createRef<Node>();
  const waitCircle = createRef<Circle>();
  const waitCircleGlow = createRef<Circle>();
  const waitHand = createRef<Line>();
  const waitText = createRef<Txt>();

  // ============================================
  // REFS - Parallel Flow Visualization (Finale)
  // ============================================
  const flowGroup = createRef<Node>();
  const flowBeams = createRefArray<Line>();
  const flowBeamGlows = createRefArray<Line>();
  const flowParticles = createRefArray<Circle>();
  const flowParticleTrails = createRefArray<Circle>();

  // Additional flow layers
  const flowSecondaryBeams = createRefArray<Line>();
  const flowEndpoints = createRefArray<Circle>();

  // ============================================
  // REFS - Ambient
  // ============================================
  const ambientDots = createRefArray<Circle>();
  const ambientGlows = createRefArray<Circle>();
  const floatingBits = createRefArray<Rect>();

  // ============================================
  // CONSTANTS
  // ============================================
  const BOX_SIZE = 80;
  const USER_SIZE = 35;
  const FLOW_BEAM_COUNT = 20;
  const AMBIENT_COUNT = 15;
  const HEX_SIZE = 40;
  const HEX_COLS = 12;
  const HEX_ROWS = 9;

  // Positions
  const boxPositions = [
    { x: 180, y: -140, label: 'A', desc: 'balance' },
    { x: 320, y: -70, label: 'B', desc: 'mint' },
    { x: 240, y: 70, label: 'C', desc: 'owner' },
    { x: 380, y: 140, label: 'D', desc: 'data' },
  ];

  const userPositions = [
    { x: -380, y: -100, label: 'TX 1', color: colors.neon },
    { x: -380, y: 50, label: 'TX 2', color: colors.neon },
    { x: -380, y: 200, label: 'TX 3', color: colors.white },
  ];

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  // Generate hexagon path
  const hexPath = (size: number) => {
    const angle = Math.PI / 3;
    let path = '';
    for (let i = 0; i < 6; i++) {
      const x = size * Math.cos(angle * i - Math.PI / 6);
      const y = size * Math.sin(angle * i - Math.PI / 6);
      path += (i === 0 ? 'M' : 'L') + `${x},${y}`;
    }
    return path + 'Z';
  };

  // ============================================
  // BUILD SCENE
  // ============================================
  view.add(
    <>
      {/* ===== LAYER 0: Deep Background Glows ===== */}
      <Circle
        ref={bgGlow1}
        size={1000}
        fill={colors.neon}
        opacity={0}
        x={-250}
        y={-80}
        filters={[blur(250)]}
      />
      <Circle
        ref={bgGlow2}
        size={800}
        fill={colors.neon}
        opacity={0}
        x={350}
        y={120}
        filters={[blur(200)]}
      />
      <Circle
        ref={bgGlow3}
        size={600}
        fill={colors.white}
        opacity={0}
        x={50}
        y={250}
        filters={[blur(180)]}
      />

      {/* ===== LAYER 0.5: Corner Vignettes ===== */}
      <Rect
        ref={vignetteTopLeft}
        width={550}
        height={400}
        x={-layout.width / 2 + 200}
        y={-layout.height / 2 + 150}
        fill={colors.black}
        opacity={0}
        filters={[blur(100)]}
      />
      <Rect
        ref={vignetteTopRight}
        width={550}
        height={400}
        x={layout.width / 2 - 200}
        y={-layout.height / 2 + 150}
        fill={colors.black}
        opacity={0}
        filters={[blur(100)]}
      />
      <Rect
        ref={vignetteBottomLeft}
        width={550}
        height={400}
        x={-layout.width / 2 + 200}
        y={layout.height / 2 - 150}
        fill={colors.black}
        opacity={0}
        filters={[blur(100)]}
      />
      <Rect
        ref={vignetteBottomRight}
        width={550}
        height={400}
        x={layout.width / 2 - 200}
        y={layout.height / 2 - 150}
        fill={colors.black}
        opacity={0}
        filters={[blur(100)]}
      />

      {/* ===== LAYER 1: Hexagonal Grid Background ===== */}
      <Node ref={hexGridGroup} opacity={0}>
        {Array.from({ length: HEX_ROWS }, (_, row) =>
          Array.from({ length: HEX_COLS }, (_, col) => {
            const offsetX = row % 2 === 0 ? 0 : HEX_SIZE * 0.866;
            const x = (col - HEX_COLS / 2) * HEX_SIZE * 1.732 + offsetX;
            const y = (row - HEX_ROWS / 2) * HEX_SIZE * 1.5;
            const key = `hex-${row}-${col}`;
            const isHighlight = (row + col) % 6 === 0;

            return (
              <Node key={key}>
                {isHighlight && (
                  <Path
                    ref={hexGlows}
                    data={hexPath(HEX_SIZE * 0.85)}
                    x={x}
                    y={y}
                    fill={colors.neon}
                    opacity={0}
                    filters={[blur(12)]}
                  />
                )}
                <Path
                  ref={hexCells}
                  data={hexPath(HEX_SIZE * 0.8)}
                  x={x}
                  y={y}
                  stroke={isHighlight ? colors.neon : colors.white}
                  lineWidth={isHighlight ? 1.5 : 0.5}
                  opacity={0}
                />
              </Node>
            );
          })
        ).flat()}
      </Node>

      {/* ===== LAYER 1.5: Grid Lines ===== */}
      {Array.from({ length: 12 }, (_, i) => (
        <Line
          key={`bg-grid-h-${i}`}
          ref={bgGridLines}
          points={[
            [-layout.width / 2, -300 + i * 55],
            [layout.width / 2, -300 + i * 55],
          ]}
          stroke={colors.white}
          lineWidth={0.5}
          opacity={0}
        />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <Line
          key={`bg-grid-v-${i}`}
          ref={bgVerticalLines}
          points={[
            [-700 + i * 200, -layout.height / 2],
            [-700 + i * 200, layout.height / 2],
          ]}
          stroke={colors.white}
          lineWidth={0.3}
          opacity={0}
        />
      ))}

      {/* ===== LAYER 1.7: Background Data Streams ===== */}
      <Node ref={dataStreamGroup} opacity={0}>
        {Array.from({ length: 10 }, (_, i) => {
          const y = -350 + i * 80;
          const x = -800;
          return (
            <Node key={`stream-${i}`}>
              <Line
                ref={dataStreams}
                points={[
                  [x, y],
                  [x + 1600, y],
                ]}
                stroke={colors.neon}
                lineWidth={1}
                opacity={0}
                lineCap="round"
                lineDash={[2, 20]}
                end={0}
              />
              <Circle
                ref={dataStreamParticles}
                size={3}
                fill={colors.neon}
                x={x}
                y={y}
                opacity={0}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 2: Ambient Elements ===== */}
      {Array.from({ length: AMBIENT_COUNT }, (_, i) => {
        const x = (i - AMBIENT_COUNT / 2) * 130 + (i % 2) * 30;
        const y = (i % 5 - 2) * 130;
        const isNeon = i % 4 === 0;
        return (
          <Node key={`ambient-${i}`}>
            <Circle
              ref={ambientGlows}
              size={(5 + (i % 4) * 3) * 3}
              fill={isNeon ? colors.neon : colors.white}
              opacity={0}
              x={x}
              y={y}
              filters={[blur(10)]}
            />
            <Circle
              ref={ambientDots}
              size={4 + (i % 4) * 2}
              fill={isNeon ? colors.neon : colors.white}
              opacity={0}
              x={x}
              y={y}
            />
          </Node>
        );
      })}

      {/* Floating data bits */}
      {Array.from({ length: 12 }, (_, i) => (
        <Rect
          key={`bit-${i}`}
          ref={floatingBits}
          width={3 + (i % 3)}
          height={3 + (i % 3)}
          fill={colors.neon}
          x={-500 + (i % 6) * 170}
          y={-300 + Math.floor(i / 6) * 600}
          opacity={0}
          radius={1}
        />
      ))}

      {/* ===== LAYER 3: Target Boxes ===== */}
      <Node ref={boxesGroup} opacity={0}>
        {boxPositions.map((pos, i) => (
          <Node
            key={`box-${i}`}
            ref={targetBoxes}
            x={pos.x}
            y={pos.y}
            scale={0}
            opacity={0}
          >
            {/* Depth shadow */}
            <Rect
              ref={targetBoxDepths}
              width={BOX_SIZE}
              height={BOX_SIZE}
              fill={colors.black}
              opacity={0}
              radius={10}
              x={4}
              y={4}
              filters={[blur(15)]}
            />

            {/* Glow */}
            <Rect
              ref={targetBoxGlows}
              width={BOX_SIZE + 15}
              height={BOX_SIZE + 15}
              fill={colors.neon}
              opacity={0}
              radius={12}
              filters={[blur(effects.glowBlur)]}
            />

            {/* Box */}
            <Rect
              ref={targetBoxRects}
              width={BOX_SIZE}
              height={BOX_SIZE}
              fill={colors.background}
              stroke={colors.white}
              lineWidth={2}
              radius={10}
            />

            {/* Inner structure */}
            <Rect
              ref={targetBoxInners}
              width={BOX_SIZE - 20}
              height={BOX_SIZE - 20}
              fill={null}
              stroke={colors.white}
              lineWidth={1}
              opacity={0}
              radius={5}
            />

            {/* Label (A, B, C, D) */}
            <Txt
              ref={targetBoxLabels}
              text={pos.label}
              fontFamily={fonts.heading}
              fontSize={24}
              fill={colors.neon}
              fontWeight={700}
              opacity={0}
            />

            {/* Icon indicator above - removed per request */}
            <Circle
              ref={targetBoxIcons}
              size={0}
              fill={colors.neon}
              y={-BOX_SIZE / 2 - 18}
              opacity={0}
            />
          </Node>
        ))}
      </Node>

      {/* ===== LAYER 4: Transaction Envelope (Enhanced) ===== */}
      <Node ref={envelopeGroup} x={-100} y={-220} scale={0} opacity={0}>
        {/* Depth shadow */}
        <Rect
          ref={envelopeDepth}
          width={130}
          height={90}
          fill={colors.black}
          opacity={0}
          radius={8}
          x={4}
          y={4}
          filters={[blur(15)]}
        />

        {/* Glow */}
        <Rect
          ref={envelopeGlow}
          width={135}
          height={95}
          fill={colors.neon}
          opacity={0}
          radius={10}
          filters={[blur(20)]}
        />

        {/* Body */}
        <Rect
          ref={envelopeBody}
          width={130}
          height={90}
          fill={colors.background}
          stroke={colors.neon}
          lineWidth={2.5}
          radius={8}
        />

        {/* Flap (triangle) */}
        <Path
          ref={envelopeFlap}
          data="M -65 -45 L 0 5 L 65 -45"
          stroke={colors.neon}
          lineWidth={2}
          fill={null}
        />

        {/* Opening lines from flap */}
        {Array.from({ length: 3 }, (_, i) => (
          <Line
            key={`open-${i}`}
            ref={envelopeOpenLines}
            points={[
              [0, 5],
              [-30 + i * 30, -20],
            ]}
            stroke={colors.neon}
            lineWidth={1}
            opacity={0}
            lineCap="round"
            end={0}
          />
        ))}

        {/* Seal */}
        <Circle
          ref={envelopeSealGlow}
          size={35}
          fill={colors.neon}
          y={-42}
          opacity={0}
          filters={[blur(12)]}
        />
        <Circle
          ref={envelopeSeal}
          size={28}
          fill={colors.neon}
          stroke={colors.white}
          lineWidth={1.5}
          y={-42}
          opacity={0}
        />
        <Path
          ref={envelopeSealIcon}
          data="M -6,-6 L 6,6 M 6,-6 L -6,6"
          stroke={colors.white}
          lineWidth={2}
          y={-42}
          opacity={0}
        />

        {/* Target list inside (dotted lines + labels) - adjusted to fit inside envelope */}
        {Array.from({ length: 4 }, (_, i) => (
          <Node key={`target-${i}`}>
            <Circle
              ref={envelopeTargetDots}
              size={5}
              fill={colors.neon}
              x={-45}
              y={-5 + i * 12}
              opacity={0}
            />
            <Line
              ref={envelopeDottedLines}
              points={[
                [-35, -5 + i * 12],
                [35 - (i % 2) * 15, -5 + i * 12],
              ]}
              stroke={colors.white}
              lineWidth={2}
              lineCap="round"
              opacity={0}
              end={0}
            />
            <Txt
              ref={envelopeTargetLabels}
              text={['A', 'B', 'C', 'D'][i]}
              fontFamily={fonts.data}
              fontSize={11}
              fill={colors.neon}
              x={45}
              y={-5 + i * 12}
              opacity={0}
            />
          </Node>
        ))}
      </Node>

      {/* ===== LAYER 5: Users (Enhanced) ===== */}
      <Node ref={usersGroup} opacity={0}>
        {userPositions.map((pos, i) => (
          <Node
            key={`user-${i}`}
            ref={userNodes}
            x={pos.x}
            y={pos.y}
            scale={0}
            opacity={0}
          >
            {/* Aura */}
            <Circle
              ref={userAuras}
              size={USER_SIZE * 4}
              fill={pos.color}
              opacity={0}
              filters={[blur(25)]}
            />

            {/* Glow */}
            <Circle
              ref={userGlows}
              size={USER_SIZE * 2.8}
              fill={pos.color}
              opacity={0}
              filters={[blur(15)]}
            />

            {/* Body (larger circle) */}
            <Circle
              ref={userBodies}
              size={USER_SIZE * 1.3}
              fill={colors.background}
              stroke={pos.color}
              lineWidth={2.5}
              y={USER_SIZE * 0.45}
            />

            {/* Head (smaller circle) */}
            <Circle
              ref={userHeads}
              size={USER_SIZE}
              fill={colors.background}
              stroke={pos.color}
              lineWidth={2.5}
              y={-USER_SIZE * 0.5}
            />

            {/* Label */}
            <Txt
              ref={userLabels}
              text={pos.label}
              fontFamily={fonts.data}
              fontSize={14}
              fill={pos.color}
              y={USER_SIZE * 1.5}
              opacity={0}
            />
          </Node>
        ))}
      </Node>

      {/* ===== LAYER 6: Connection Beams with Particles ===== */}
      <Node ref={beamsGroup} opacity={0}>
        {/* User 1 -> Boxes A, B */}
        {[0, 1].map((bi) => {
          const startX = userPositions[0].x + 60;
          const startY = userPositions[0].y;
          const endX = boxPositions[bi].x - BOX_SIZE / 2;
          const endY = boxPositions[bi].y;

          return (
            <Node key={`u1-beam-${bi}`}>
              <Line
                ref={user1BeamGlows}
                points={[[startX, startY], [endX, endY]]}
                stroke={colors.neon}
                lineWidth={10}
                opacity={0}
                lineCap="round"
                end={0}
                filters={[blur(12)]}
              />
              <Line
                ref={user1Beams}
                points={[[startX, startY], [endX, endY]]}
                stroke={colors.neon}
                lineWidth={3}
                opacity={0}
                lineCap="round"
                end={0}
              />
              {/* Trail particles */}
              <Circle
                ref={user1BeamTrails}
                size={12}
                fill={colors.neon}
                opacity={0}
                x={startX}
                y={startY}
                filters={[blur(6)]}
              />
              {/* Main particle */}
              <Circle
                ref={user1BeamParticles}
                size={8}
                fill={colors.neon}
                opacity={0}
                x={startX}
                y={startY}
              />
            </Node>
          );
        })}

        {/* User 2 -> Boxes C, D */}
        {[2, 3].map((bi, idx) => {
          const startX = userPositions[1].x + 60;
          const startY = userPositions[1].y;
          const endX = boxPositions[bi].x - BOX_SIZE / 2;
          const endY = boxPositions[bi].y;

          return (
            <Node key={`u2-beam-${bi}`}>
              <Line
                ref={user2BeamGlows}
                points={[[startX, startY], [endX, endY]]}
                stroke={colors.neon}
                lineWidth={10}
                opacity={0}
                lineCap="round"
                end={0}
                filters={[blur(12)]}
              />
              <Line
                ref={user2Beams}
                points={[[startX, startY], [endX, endY]]}
                stroke={colors.neon}
                lineWidth={3}
                opacity={0}
                lineCap="round"
                end={0}
              />
              {/* Trail particles */}
              <Circle
                ref={user2BeamTrails}
                size={12}
                fill={colors.neon}
                opacity={0}
                x={startX}
                y={startY}
                filters={[blur(6)]}
              />
              {/* Main particle */}
              <Circle
                ref={user2BeamParticles}
                size={8}
                fill={colors.neon}
                opacity={0}
                x={startX}
                y={startY}
              />
            </Node>
          );
        })}

        {/* User 3 -> Box A (conflict!) */}
        {(() => {
          const startX = userPositions[2].x + 60;
          const startY = userPositions[2].y;
          const endX = boxPositions[0].x - BOX_SIZE / 2;
          const endY = boxPositions[0].y + 25;

          return (
            <Node key="u3-beam">
              <Line
                ref={user3BeamGlow}
                points={[[startX, startY], [endX, endY]]}
                stroke={colors.white}
                lineWidth={8}
                opacity={0}
                lineCap="round"
                lineDash={[12, 12]}
                end={0}
                filters={[blur(8)]}
              />
              <Line
                ref={user3Beam}
                points={[[startX, startY], [endX, endY]]}
                stroke={colors.white}
                lineWidth={2.5}
                opacity={0}
                lineCap="round"
                lineDash={[10, 10]}
                end={0}
              />
              <Circle
                ref={user3BeamParticle}
                size={8}
                fill={colors.white}
                opacity={0}
                x={startX}
                y={startY}
              />
            </Node>
          );
        })()}
      </Node>

      {/* ===== LAYER 7: Conflict Visualization ===== */}
      <Node ref={conflictGroup} opacity={0}>
        {/* Conflict barrier at midpoint */}
        <Rect
          ref={conflictBarrierGlow}
          width={60}
          height={60}
          fill={colors.white}
          opacity={0}
          x={-100}
          y={40}
          rotation={45}
          filters={[blur(20)]}
        />
        <Rect
          ref={conflictBarrier}
          width={50}
          height={50}
          fill={null}
          stroke={colors.white}
          lineWidth={3}
          opacity={0}
          x={-100}
          y={40}
          rotation={45}
        />

        {/* X mark on barrier */}
        <Node ref={conflictX} x={-100} y={40} opacity={0}>
          <Line
            ref={conflictXLines}
            points={[[-15, -15], [15, 15]]}
            stroke={colors.white}
            lineWidth={4}
            lineCap="round"
            end={0}
          />
          <Line
            ref={conflictXLines}
            points={[[15, -15], [-15, 15]]}
            stroke={colors.white}
            lineWidth={4}
            lineCap="round"
            end={0}
          />
        </Node>

        {/* Conflict waves */}
        {Array.from({ length: 3 }, (_, i) => (
          <Circle
            key={`wave-${i}`}
            ref={conflictWaves}
            size={30 + i * 20}
            fill={null}
            stroke={colors.white}
            lineWidth={2}
            opacity={0}
            x={-100}
            y={40}
          />
        ))}

        {/* WAIT text */}
        <Txt
          ref={conflictText}
          text="BLOCKED"
          fontFamily={fonts.heading}
          fontSize={16}
          fill={colors.white}
          x={-100}
          y={90}
          opacity={0}
        />
      </Node>

      {/* ===== LAYER 8: Status Indicators ===== */}
      {/* Checkmarks for User 1 and User 2 */}
      {[0, 1].map((i) => (
        <Node
          key={`check-${i}`}
          ref={checkmarks}
          x={userPositions[i].x + 90}
          y={userPositions[i].y - 50}
          scale={0}
          opacity={0}
        >
          <Circle
            ref={checkmarkCircles}
            size={36}
            fill={colors.neon}
            opacity={0.25}
          />
          <Line
            ref={checkmarkLines}
            points={[
              [-10, 0],
              [-4, 8],
              [12, -10],
            ]}
            stroke={colors.neon}
            lineWidth={4}
            lineCap="round"
            lineJoin="round"
            end={0}
          />
        </Node>
      ))}

      {/* Wait icon for User 3 */}
      <Node
        ref={waitIcon}
        x={userPositions[2].x + 90}
        y={userPositions[2].y - 50}
        scale={0}
        opacity={0}
      >
        <Circle
          ref={waitCircleGlow}
          size={45}
          fill={colors.white}
          opacity={0}
          filters={[blur(15)]}
        />
        <Circle
          ref={waitCircle}
          size={36}
          fill={null}
          stroke={colors.white}
          lineWidth={2.5}
        />
        <Line
          ref={waitHand}
          points={[
            [0, 0],
            [0, -12],
          ]}
          stroke={colors.white}
          lineWidth={2.5}
          lineCap="round"
          rotation={0}
        />
        <Line
          points={[
            [0, 0],
            [8, 0],
          ]}
          stroke={colors.white}
          lineWidth={2.5}
          lineCap="round"
        />
        <Txt
          ref={waitText}
          text="WAIT"
          fontFamily={fonts.data}
          fontSize={12}
          fill={colors.white}
          y={30}
          opacity={0}
        />
      </Node>

      {/* ===== LAYER 9: Parallel Flow (Finale) ===== */}
      <Node ref={flowGroup} opacity={0}>
        {Array.from({ length: FLOW_BEAM_COUNT }, (_, i) => {
          const startX = -500;
          const startY = -250 + (i % 10) * 55;
          const endX = 500;
          const endY = -220 + ((i + 4) % 10) * 50;
          const isNeon = i % 3 === 0;

          return (
            <Node key={`flow-${i}`}>
              <Line
                ref={flowBeamGlows}
                points={[[startX, startY], [endX, endY]]}
                stroke={isNeon ? colors.neon : colors.white}
                lineWidth={5 + (i % 4)}
                opacity={0}
                lineCap="round"
                end={0}
                filters={[blur(10)]}
              />
              <Line
                ref={flowBeams}
                points={[[startX, startY], [endX, endY]]}
                stroke={isNeon ? colors.neon : colors.white}
                lineWidth={1.5 + (i % 2)}
                opacity={0}
                lineCap="round"
                end={0}
              />
              {/* Particle trail */}
              <Circle
                ref={flowParticleTrails}
                size={(5 + (i % 4)) * 2}
                fill={isNeon ? colors.neon : colors.white}
                opacity={0}
                x={startX}
                y={startY}
                filters={[blur(8)]}
              />
              {/* Main particle */}
              <Circle
                ref={flowParticles}
                size={5 + (i % 4)}
                fill={isNeon ? colors.neon : colors.white}
                opacity={0}
                x={startX}
                y={startY}
              />
            </Node>
          );
        })}

        {/* Secondary horizontal beams for density */}
        {Array.from({ length: 10 }, (_, i) => {
          const y = -300 + i * 70;
          return (
            <Line
              key={`sec-beam-${i}`}
              ref={flowSecondaryBeams}
              points={[[-600, y], [600, y]]}
              stroke={i % 2 === 0 ? colors.neon : colors.white}
              lineWidth={1}
              opacity={0}
              lineCap="round"
              lineDash={[3, 15]}
              end={0}
            />
          );
        })}

        {/* Endpoint glow points */}
        {Array.from({ length: 8 }, (_, i) => {
          const x = 450;
          const y = -200 + i * 55;
          return (
            <Circle
              key={`endpoint-${i}`}
              ref={flowEndpoints}
              size={15}
              fill={colors.neon}
              x={x}
              y={y}
              opacity={0}
              filters={[blur(10)]}
            />
          );
        })}
      </Node>
    </>
  );

  // ============================================
  // ANIMATION TIMELINE
  // ============================================

  // --- Beat 0 (20:00) - Background layers fade in ---
  yield* all(
    bgGlow1().opacity(0.04, timing.beat),
    bgGlow2().opacity(0.02, timing.beat),
    vignetteTopLeft().opacity(0.5, timing.beat),
    vignetteTopRight().opacity(0.5, timing.beat),
    vignetteBottomLeft().opacity(0.5, timing.beat),
    vignetteBottomRight().opacity(0.5, timing.beat),
    ...bgGridLines.map((line, i) => delay(i * 0.02, line.opacity(0.04, timing.entrance))),
    ...bgVerticalLines.map((line, i) => delay(i * 0.02, line.opacity(0.03, timing.entrance))),
  );

  // --- Beat 0.3 (20:03) - Hex grid fades in ---
  yield* all(
    hexGridGroup().opacity(1, timing.entrance),
    ...hexCells.map((cell, i) => delay(i * 0.003, cell.opacity(i % 6 === 0 ? 0.12 : 0.04, timing.entrance))),
    ...hexGlows.map((glow, i) => delay(i * 0.005, glow.opacity(0.08, timing.entrance))),
  );

  // --- Beat 1 (20:10) - Envelope materializes ---
  yield* all(
    envelopeGroup().scale(1, timing.entrance * 2, easeOutBack),
    envelopeGroup().opacity(1, timing.entrance * 1.5),
    envelopeGlow().opacity(0.35, timing.entrance * 1.5),
    envelopeDepth().opacity(0.4, timing.entrance * 1.5),
  );

  // --- Beat 1.5 (20:15) - Seal appears ---
  yield* all(
    envelopeSeal().opacity(1, timing.entrance),
    envelopeSealGlow().opacity(0.4, timing.entrance),
    envelopeSealIcon().opacity(0.8, timing.entrance),
  );

  // --- Beat 2 (20:20) - Envelope "opens" / seal breaks ---
  yield* all(
    envelopeGroup().scale(1.08, timing.fast, easeOutCubic),
    envelopeSeal().scale(1.3, timing.fast, easeOutCubic),
    envelopeSealGlow().opacity(0.6, timing.fast),
  );
  yield* all(
    envelopeGroup().scale(1, timing.microBeat, easeInOutCubic),
    envelopeSeal().opacity(0, timing.fast),
    envelopeSealGlow().opacity(0, timing.fast),
    envelopeSealIcon().opacity(0, timing.fast),
  );

  // --- Beat 2.3 (20:23) - Opening lines animate ---
  yield* all(
    ...envelopeOpenLines.map((line, i) =>
      delay(i * 0.05, all(
        line.opacity(0.6, timing.fast),
        line.end(1, 0.15, easeOutCubic),
      ))
    ),
  );

  // --- Beat 3 (20:25) - Target list appears (dots + lines + labels) ---
  yield* sequence(
    0.06,
    ...envelopeDottedLines.map((line, i) =>
      all(
        line.opacity(0.8, timing.fast),
        line.end(1, 0.12, easeOutCubic),
        envelopeTargetDots[i].opacity(1, timing.fast),
        delay(0.05, envelopeTargetLabels[i].opacity(0.8, timing.fast)),
      )
    )
  );

  // --- Beat 4 (21:00) - Boxes group appears ---
  yield* boxesGroup().opacity(1, timing.entrance);

  // --- Beat 5 (21:10) - Target boxes pop in ---
  yield* sequence(
    0.08,
    ...targetBoxes.map((box, i) =>
      all(
        box.scale(1, timing.entrance * 1.2, easeOutBack),
        box.opacity(1, timing.entrance),
        targetBoxDepths[i].opacity(0.35, timing.entrance),
        targetBoxLabels[i].opacity(0.8, timing.entrance),
        targetBoxIcons[i].opacity(0.6, timing.entrance),
      )
    )
  );

  // --- Beat 5.5 (21:15) - Box inners reveal ---
  yield* sequence(
    0.04,
    ...targetBoxInners.map((inner) => inner.opacity(0.4, timing.entrance))
  );

  // --- Beat 6 (21:20) - Envelope moves aside and shrinks ---
  yield* all(
    envelopeGroup().x(-200, timing.beat * 1.2, easeInOutCubic),
    envelopeGroup().y(-280, timing.beat * 1.2, easeInOutCubic),
    envelopeGroup().scale(0.55, timing.beat * 1.2, easeInOutCubic),
    envelopeGroup().opacity(0.4, timing.beat),
  );

  // --- Beat 7 (21:25) - Users group appears ---
  yield* usersGroup().opacity(1, timing.entrance);

  // --- Beat 8 (22:00) - User silhouettes appear with labels ---
  yield* sequence(
    0.1,
    ...userNodes.map((user, i) =>
      all(
        user.scale(1, timing.entrance * 1.2, easeOutBack),
        user.opacity(1, timing.entrance),
        userLabels[i].opacity(0.7, timing.entrance),
      )
    )
  );

  // --- Beat 9 (22:10) - Beams group appears ---
  yield* beamsGroup().opacity(1, timing.entrance);

  // --- Beat 10 (22:15) - User 1 sends beams to boxes A, B ---
  yield* all(
    user1Beams[0].opacity(0.9, timing.fast),
    user1Beams[0].end(1, 0.28, easeOutCubic),
    user1BeamGlows[0].opacity(0.5, timing.fast),
    user1BeamGlows[0].end(1, 0.28, easeOutCubic),
    delay(0.12, all(
      user1Beams[1].opacity(0.9, timing.fast),
      user1Beams[1].end(1, 0.28, easeOutCubic),
      user1BeamGlows[1].opacity(0.5, timing.fast),
      user1BeamGlows[1].end(1, 0.28, easeOutCubic),
    )),
  );

  // --- Beat 10.3 (22:18) - Particles travel along beams ---
  yield* all(
    ...user1BeamParticles.map((particle, i) => {
      const endX = boxPositions[i].x - BOX_SIZE / 2;
      const endY = boxPositions[i].y;
      return all(
        particle.opacity(1, timing.fast),
        user1BeamTrails[i].opacity(0.5, timing.fast),
        particle.x(endX, 0.3, easeInOutCubic),
        particle.y(endY, 0.3, easeInOutCubic),
        user1BeamTrails[i].x(endX, 0.35, easeInOutCubic),
        user1BeamTrails[i].y(endY, 0.35, easeInOutCubic),
        delay(0.25, all(
          particle.opacity(0, timing.fast),
          user1BeamTrails[i].opacity(0, timing.fast),
        )),
      );
    })
  );

  // --- Beat 11 (22:25) - Boxes A, B light up ---
  yield* all(
    targetBoxGlows[0].opacity(effects.glowOpacity, timing.fast),
    targetBoxGlows[1].opacity(effects.glowOpacity, timing.fast),
    targetBoxRects[0].stroke(colors.neon, timing.fast),
    targetBoxRects[1].stroke(colors.neon, timing.fast),
    userGlows[0].opacity(0.3, timing.entrance),
    userAuras[0].opacity(0.1, timing.entrance),
  );

  // --- Beat 12 (23:00) - Checkmark 1 appears ---
  yield* all(
    checkmarks[0].scale(1, timing.entrance, easeOutBack),
    checkmarks[0].opacity(1, timing.entrance),
    checkmarkLines[0].end(1, 0.22, easeOutCubic),
  );

  // --- Beat 13 (23:05) - User 2 sends beams SIMULTANEOUSLY (parallel!) ---
  yield* all(
    user2Beams[0].opacity(0.9, timing.fast),
    user2Beams[0].end(1, 0.28, easeOutCubic),
    user2BeamGlows[0].opacity(0.5, timing.fast),
    user2BeamGlows[0].end(1, 0.28, easeOutCubic),
    delay(0.1, all(
      user2Beams[1].opacity(0.9, timing.fast),
      user2Beams[1].end(1, 0.28, easeOutCubic),
      user2BeamGlows[1].opacity(0.5, timing.fast),
      user2BeamGlows[1].end(1, 0.28, easeOutCubic),
    )),
  );

  // --- Beat 13.3 (23:08) - Particles for User 2 ---
  yield* all(
    ...user2BeamParticles.map((particle, i) => {
      const endX = boxPositions[i + 2].x - BOX_SIZE / 2;
      const endY = boxPositions[i + 2].y;
      return all(
        particle.opacity(1, timing.fast),
        user2BeamTrails[i].opacity(0.5, timing.fast),
        particle.x(endX, 0.3, easeInOutCubic),
        particle.y(endY, 0.3, easeInOutCubic),
        user2BeamTrails[i].x(endX, 0.35, easeInOutCubic),
        user2BeamTrails[i].y(endY, 0.35, easeInOutCubic),
        delay(0.25, all(
          particle.opacity(0, timing.fast),
          user2BeamTrails[i].opacity(0, timing.fast),
        )),
      );
    })
  );

  // --- Beat 14 (23:15) - Boxes C, D light up ---
  yield* all(
    targetBoxGlows[2].opacity(effects.glowOpacity, timing.fast),
    targetBoxGlows[3].opacity(effects.glowOpacity, timing.fast),
    targetBoxRects[2].stroke(colors.neon, timing.fast),
    targetBoxRects[3].stroke(colors.neon, timing.fast),
    userGlows[1].opacity(0.3, timing.entrance),
    userAuras[1].opacity(0.1, timing.entrance),
  );

  // --- Beat 15 (23:20) - Checkmark 2 appears (parallel success!) ---
  yield* all(
    checkmarks[1].scale(1, timing.entrance, easeOutBack),
    checkmarks[1].opacity(1, timing.entrance),
    checkmarkLines[1].end(1, 0.22, easeOutCubic),
  );

  // --- Beat 16 (24:00) - User 3 tries to send beam to Box A (conflict!) ---
  yield* all(
    user3Beam().opacity(0.7, timing.fast),
    user3Beam().end(0.45, 0.35, easeOutCubic),
    user3BeamGlow().opacity(0.35, timing.fast),
    user3BeamGlow().end(0.45, 0.35, easeOutCubic),
    user3BeamParticle().opacity(0.8, timing.fast),
    user3BeamParticle().x(-150, 0.35, easeOutCubic),
    user3BeamParticle().y(70, 0.35, easeOutCubic),
  );

  // --- Beat 17 (24:10) - Conflict visualization appears ---
  yield* all(
    conflictGroup().opacity(1, timing.fast),
    conflictBarrier().opacity(0.8, timing.fast),
    conflictBarrierGlow().opacity(0.3, timing.fast),
  );

  // --- Beat 17.3 (24:13) - X mark draws ---
  yield* all(
    conflictX().opacity(1, timing.fast),
    conflictXLines[0].end(1, 0.15, easeOutCubic),
    delay(0.05, conflictXLines[1].end(1, 0.15, easeOutCubic)),
  );

  // --- Beat 17.5 (24:15) - Conflict waves pulse ---
  yield* all(
    ...conflictWaves.map((wave, i) =>
      delay(i * 0.08, all(
        wave.opacity(0.5, timing.fast),
        wave.size(60 + i * 30, 0.3, easeOutCubic),
      ))
    ),
  );
  yield* all(
    ...conflictWaves.map((wave) => wave.opacity(0, timing.beat)),
    conflictText().opacity(0.8, timing.fast),
  );

  // --- Beat 18 (24:20) - Wait icon appears for User 3 ---
  yield* all(
    waitIcon().scale(1, timing.entrance, easeOutBack),
    waitIcon().opacity(1, timing.entrance),
    waitCircleGlow().opacity(0.2, timing.entrance),
  );

  // --- Beat 19 (24:25) - Clock hand rotates (waiting) ---
  yield* all(
    waitHand().rotation(180, 0.45, linear),
    waitText().opacity(0.8, timing.entrance),
  );

  // --- Beat 19.5 (24:28) - Second rotation ---
  yield* waitHand().rotation(360, 0.45, linear);

  // --- Beat 20 (25:00) - Background glows intensify ---
  yield* all(
    bgGlow2().opacity(0.05, timing.beat),
    bgGlow3().opacity(0.03, timing.beat),
  );

  // ==================================================
  // PARALLEL FLOW SECTION (2 seconds)
  // Intro section above: 11 seconds
  // ==================================================

  // --- Beat 21 - Transition to parallel flow finale ---
  yield* all(
    envelopeGroup().opacity(0, timing.beat),
    usersGroup().opacity(0.25, timing.beat),
    beamsGroup().opacity(0.25, timing.beat),
    conflictGroup().opacity(0, timing.beat),
    waitIcon().opacity(0, timing.beat),
    checkmarks[0].opacity(0, timing.beat),
    checkmarks[1].opacity(0, timing.beat),
    boxesGroup().opacity(0.3, timing.beat),
  );

  // --- Beat 22 (25:15) - Flow group appears ---
  yield* flowGroup().opacity(1, timing.entrance);

  // --- Beat 22.5 (25:18) - Data stream background activates ---
  yield* all(
    dataStreamGroup().opacity(1, timing.entrance),
    ...dataStreams.map((stream, i) =>
      delay(i * 0.05, all(
        stream.opacity(0.2, timing.fast),
        stream.end(1, 0.5, linear),
      ))
    ),
  );

  // --- Beat 23-26 (25:20 - 26:15) - Parallel beams animate across screen ---
  yield* sequence(
    0.035,
    ...flowBeams.map((beam, i) =>
      all(
        beam.opacity(0.7, timing.fast),
        beam.end(1, 0.45, easeOutCubic),
        flowBeamGlows[i].opacity(0.35, timing.fast),
        flowBeamGlows[i].end(1, 0.45, easeOutCubic),
      )
    )
  );

  // --- Beat 26.3 (26:18) - Secondary beams for density ---
  yield* all(
    ...flowSecondaryBeams.map((beam, i) =>
      delay(i * 0.04, all(
        beam.opacity(0.25, timing.fast),
        beam.end(1, 0.35, linear),
      ))
    ),
  );

  // --- Beat 27 (26:20) - Particles travel along beams ---
  yield* all(
    ...flowParticles.map((particle, i) => {
      const endX = 500;
      const endY = -220 + ((i + 4) % 10) * 50;
      return delay(
        i * 0.025,
        all(
          particle.opacity(0.9, timing.fast),
          flowParticleTrails[i].opacity(0.5, timing.fast),
          particle.x(endX, 0.55, easeInOutCubic),
          particle.y(endY, 0.55, easeInOutCubic),
          flowParticleTrails[i].x(endX, 0.6, easeInOutCubic),
          flowParticleTrails[i].y(endY, 0.6, easeInOutCubic),
          delay(0.4, all(
            particle.opacity(0, 0.15, easeInCubic),
            flowParticleTrails[i].opacity(0, 0.15, easeInCubic),
          )),
        )
      );
    })
  );

  // --- Beat 27.3 (26:23) - Endpoints glow ---
  yield* all(
    ...flowEndpoints.map((endpoint, i) =>
      delay(i * 0.05, endpoint.opacity(0.6, timing.fast))
    ),
  );

  // --- Beat 27.5 (26:25) - Data stream particles travel ---
  yield* all(
    ...dataStreamParticles.map((particle, i) =>
      delay(i * 0.05, all(
        particle.opacity(0.6, timing.fast),
        particle.x(particle.x() + 1600, 1.5, linear),
        delay(1.2, particle.opacity(0, timing.fast)),
      ))
    ),
  );

  // --- Beat 28 (27:00) - All boxes pulse together ---
  yield* all(
    boxesGroup().opacity(1, timing.fast),
    ...targetBoxGlows.map((glow) => glow.opacity(effects.glowOpacityBright, timing.fast)),
    ...targetBoxes.map((box) => box.scale(1.1, timing.fast, easeOutCubic)),
  );
  yield* all(
    ...targetBoxGlows.map((glow) => glow.opacity(effects.glowOpacity, timing.microBeat)),
    ...targetBoxes.map((box) => box.scale(1, timing.microBeat * 1.5, easeInOutCubic)),
  );

  // --- Beat 29 (27:10) - Ambient elements fade in ---
  yield* all(
    ...ambientDots.map((dot, i) =>
      delay(i * 0.025, dot.opacity(0.5, timing.entrance))
    ),
    ...ambientGlows.map((glow, i) =>
      delay(i * 0.025, glow.opacity(0.2, timing.entrance))
    ),
    ...floatingBits.map((bit, i) =>
      delay(i * 0.03, bit.opacity(0.5, timing.entrance))
    ),
  );

  // --- Beat 30 (27:20) - Flow beams pulse ---
  yield* all(
    ...flowBeamGlows.slice(0, 10).map((glow) => glow.opacity(0.7, timing.fast)),
  );
  yield* all(
    ...flowBeamGlows.slice(0, 10).map((glow) => glow.opacity(0.35, timing.microBeat)),
  );

  // --- Beat 31 (27:25) - Final glow intensification ---
  yield* all(
    bgGlow1().opacity(0.07, timing.beat),
    bgGlow2().opacity(0.06, timing.beat),
    bgGlow3().opacity(0.04, timing.beat),
  );

  // --- Hold for transition ---
  // Total scene: 13 seconds (11 sec intro + 2 sec parallel flow)
  yield* waitFor(0.3);
});
