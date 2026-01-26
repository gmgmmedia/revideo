/**
 * Real Motion Scene 4: Network Building
 * VO: "community building campaign" / "spread awareness about movement/move"
 *
 * Theme: Network of connected nodes growing organically
 * Visual Elements:
 * - Background glows (magenta/yellow gradient)
 * - Scanline overlay for retro aesthetic
 * - Central hub node
 * - Network nodes appearing in waves
 * - Connection lines drawing between nodes
 * - Ripple effects spreading outward
 * - People icons at nodes
 * - Energy pulses through connections
 * - Ambient floating particles
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
  easeInOutSine,
  easeOutElastic,
  linear,
} from '@revideo/core';

import {
  REALMOTION,
  colors,
  timing,
  effects,
  layout,
  icons,
  fonts,
  fontSizes,
} from '../lib/brand';

export default makeScene2D('scene4-network-building', function* (view) {
  // ============================================
  // SCENE SETUP
  // ============================================
  view.fill(colors.background);

  // ============================================
  // CONSTANTS
  // ============================================
  const INNER_NODE_COUNT = 6;
  const MIDDLE_NODE_COUNT = 12;
  const OUTER_NODE_COUNT = 18;
  const CONNECTION_COUNT = 48;
  const RIPPLE_COUNT = 6;
  const AMBIENT_PARTICLE_COUNT = 24;
  const GRID_H_COUNT = 16;
  const GRID_V_COUNT = 18;
  const SPARKLE_COUNT = 16;
  const ENERGY_PULSE_COUNT = 12;

  // ============================================
  // REFS - Background Glow Layer
  // ============================================
  const bgGlowMagenta1 = createRef<Circle>();
  const bgGlowMagenta2 = createRef<Circle>();
  const bgGlowMagenta3 = createRef<Circle>();
  const bgGlowYellow1 = createRef<Circle>();
  const bgGlowYellow2 = createRef<Circle>();
  const bgGlowPink1 = createRef<Circle>();
  const bgGlowPink2 = createRef<Circle>();
  const bgGlowPurple1 = createRef<Circle>();
  const bgGlowPurple2 = createRef<Circle>();

  // ============================================
  // REFS - Scanline Overlay
  // ============================================
  const scanlineContainer = createRef<Node>();

  // ============================================
  // REFS - Grid Pattern
  // ============================================
  const gridContainer = createRef<Node>();
  const gridLinesH = createRefArray<Line>();
  const gridLinesV = createRefArray<Line>();
  const gridGlowH = createRefArray<Line>();
  const gridGlowV = createRefArray<Line>();

  // ============================================
  // REFS - Central Hub Node
  // ============================================
  const hubContainer = createRef<Node>();
  const hubOuterGlow = createRef<Circle>();
  const hubMiddleGlow = createRef<Circle>();
  const hubInnerGlow = createRef<Circle>();
  const hubCore = createRef<Circle>();
  const hubRing1 = createRef<Circle>();
  const hubRing2 = createRef<Circle>();
  const hubIcon = createRef<Path>();
  const hubIconGlow = createRef<Path>();
  const hubPulse1 = createRef<Circle>();
  const hubPulse2 = createRef<Circle>();

  // ============================================
  // REFS - Inner Ring Nodes
  // ============================================
  const innerNodesContainer = createRef<Node>();
  const innerNodes = createRefArray<Circle>();
  const innerNodesGlow = createRefArray<Circle>();
  const innerNodesOuterGlow = createRefArray<Circle>();
  const innerNodeIcons = createRefArray<Path>();
  const innerNodeIconsGlow = createRefArray<Path>();

  // ============================================
  // REFS - Middle Ring Nodes
  // ============================================
  const middleNodesContainer = createRef<Node>();
  const middleNodes = createRefArray<Circle>();
  const middleNodesGlow = createRefArray<Circle>();
  const middleNodesOuterGlow = createRefArray<Circle>();
  const middleNodeIcons = createRefArray<Path>();
  const middleNodeIconsGlow = createRefArray<Path>();

  // ============================================
  // REFS - Outer Ring Nodes
  // ============================================
  const outerNodesContainer = createRef<Node>();
  const outerNodes = createRefArray<Circle>();
  const outerNodesGlow = createRefArray<Circle>();
  const outerNodeIcons = createRefArray<Path>();
  const outerNodeIconsGlow = createRefArray<Path>();

  // ============================================
  // REFS - Connection Lines
  // ============================================
  const connectionsContainer = createRef<Node>();
  const connections = createRefArray<Line>();
  const connectionsGlow = createRefArray<Line>();

  // ============================================
  // REFS - Ripple Effects
  // ============================================
  const ripplesContainer = createRef<Node>();
  const ripples = createRefArray<Circle>();
  const ripplesGlow = createRefArray<Circle>();

  // ============================================
  // REFS - Energy Pulses
  // ============================================
  const energyPulsesContainer = createRef<Node>();
  const energyPulses = createRefArray<Circle>();
  const energyPulsesGlow = createRefArray<Circle>();

  // ============================================
  // REFS - Ambient Particles
  // ============================================
  const ambientParticlesContainer = createRef<Node>();
  const ambientParticles = createRefArray<Circle>();
  const ambientParticlesGlow = createRefArray<Circle>();

  // ============================================
  // REFS - Sparkles
  // ============================================
  const sparklesContainer = createRef<Node>();
  const sparkles = createRefArray<Path>();
  const sparklesGlow = createRefArray<Path>();

  // ============================================
  // REFS - Decorative Elements
  // ============================================
  const decorContainer = createRef<Node>();
  const decorCircles = createRefArray<Circle>();
  const decorCirclesGlow = createRefArray<Circle>();
  const decorLines = createRefArray<Line>();
  const decorLinesGlow = createRefArray<Line>();

  // ============================================
  // REFS - Vignette
  // ============================================
  const vignetteTop = createRef<Rect>();
  const vignetteBottom = createRef<Rect>();

  // ============================================
  // POSITION CALCULATIONS
  // ============================================

  // Inner ring node positions
  const innerNodePositions = Array.from({ length: INNER_NODE_COUNT }, (_, i) => {
    const angle = (i / INNER_NODE_COUNT) * Math.PI * 2 - Math.PI / 2;
    const radius = 140;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.7,
      angle,
    };
  });

  // Middle ring node positions
  const middleNodePositions = Array.from({ length: MIDDLE_NODE_COUNT }, (_, i) => {
    const angle = (i / MIDDLE_NODE_COUNT) * Math.PI * 2 - Math.PI / 2 + Math.PI / MIDDLE_NODE_COUNT;
    const radius = 280;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.65,
      angle,
    };
  });

  // Outer ring node positions
  const outerNodePositions = Array.from({ length: OUTER_NODE_COUNT }, (_, i) => {
    const angle = (i / OUTER_NODE_COUNT) * Math.PI * 2 - Math.PI / 2;
    const radius = 420;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.6,
      angle,
    };
  });

  // Connection definitions (hub to inner, inner to middle, middle to outer)
  const connectionDefs: Array<{ from: [number, number]; to: [number, number] }> = [];

  // Hub to inner connections
  innerNodePositions.forEach((pos) => {
    connectionDefs.push({ from: [0, 0], to: [pos.x, pos.y] });
  });

  // Inner to middle connections
  innerNodePositions.forEach((innerPos, i) => {
    const nearestMiddle1 = i * 2;
    const nearestMiddle2 = (i * 2 + 1) % MIDDLE_NODE_COUNT;
    connectionDefs.push({ from: [innerPos.x, innerPos.y], to: [middleNodePositions[nearestMiddle1].x, middleNodePositions[nearestMiddle1].y] });
    connectionDefs.push({ from: [innerPos.x, innerPos.y], to: [middleNodePositions[nearestMiddle2].x, middleNodePositions[nearestMiddle2].y] });
  });

  // Middle to outer connections
  middleNodePositions.forEach((middlePos, i) => {
    const nearestOuter = Math.floor(i * 1.5) % OUTER_NODE_COUNT;
    connectionDefs.push({ from: [middlePos.x, middlePos.y], to: [outerNodePositions[nearestOuter].x, outerNodePositions[nearestOuter].y] });
  });

  // Additional cross-connections for density
  for (let i = 0; i < MIDDLE_NODE_COUNT; i += 2) {
    const next = (i + 3) % MIDDLE_NODE_COUNT;
    connectionDefs.push({ from: [middleNodePositions[i].x, middleNodePositions[i].y], to: [middleNodePositions[next].x, middleNodePositions[next].y] });
  }

  // ============================================
  // BUILD SCENE
  // ============================================
  view.add(
    <>
      {/* ===== LAYER 1: Background Glows ===== */}
      <Circle
        ref={bgGlowMagenta1}
        size={1000}
        fill={colors.magenta}
        opacity={0}
        x={0}
        y={0}
        filters={[blur(350)]}
      />
      <Circle
        ref={bgGlowMagenta2}
        size={700}
        fill={colors.magenta}
        opacity={0}
        x={-380}
        y={-260}
        filters={[blur(280)]}
      />
      <Circle
        ref={bgGlowMagenta3}
        size={500}
        fill={colors.magenta}
        opacity={0}
        x={420}
        y={280}
        filters={[blur(220)]}
      />
      <Circle
        ref={bgGlowYellow1}
        size={850}
        fill={colors.yellow}
        opacity={0}
        x={320}
        y={-120}
        filters={[blur(320)]}
      />
      <Circle
        ref={bgGlowYellow2}
        size={600}
        fill={colors.yellow}
        opacity={0}
        x={-360}
        y={240}
        filters={[blur(260)]}
      />
      <Circle
        ref={bgGlowPink1}
        size={750}
        fill={colors.pink}
        opacity={0}
        x={-120}
        y={60}
        filters={[blur(300)]}
      />
      <Circle
        ref={bgGlowPink2}
        size={480}
        fill={colors.pink}
        opacity={0}
        x={360}
        y={-200}
        filters={[blur(210)]}
      />
      <Circle
        ref={bgGlowPurple1}
        size={900}
        fill={colors.purple}
        opacity={0}
        x={0}
        y={400}
        filters={[blur(380)]}
      />
      <Circle
        ref={bgGlowPurple2}
        size={520}
        fill={colors.purple}
        opacity={0}
        x={-480}
        y={-380}
        filters={[blur(260)]}
      />

      {/* ===== LAYER 2: Scanline Overlay ===== */}
      <Node ref={scanlineContainer} opacity={0}>
        {Array.from({ length: 270 }, (_, i) => (
          <Rect
            key={`scanline-${i}`}
            width={layout.width + 200}
            height={1}
            fill={colors.white}
            opacity={0.012 + (i % 4) * 0.004}
            y={-540 + i * 4}
          />
        ))}
      </Node>

      {/* ===== LAYER 3: Grid Pattern ===== */}
      <Node ref={gridContainer} opacity={0}>
        {Array.from({ length: GRID_H_COUNT }, (_, i) => (
          <Node key={`h-grid-group-${i}`}>
            <Line
              ref={gridGlowH}
              points={[[-1000, -420 + i * 55], [1000, -420 + i * 55]]}
              stroke={colors.magenta}
              lineWidth={2}
              opacity={0}
              end={0}
              filters={[blur(4)]}
            />
            <Line
              ref={gridLinesH}
              points={[[-1000, -420 + i * 55], [1000, -420 + i * 55]]}
              stroke={colors.magenta}
              lineWidth={1}
              opacity={0}
              end={0}
            />
          </Node>
        ))}
        {Array.from({ length: GRID_V_COUNT }, (_, i) => (
          <Node key={`v-grid-group-${i}`}>
            <Line
              ref={gridGlowV}
              points={[[-850 + i * 100, -560], [-850 + i * 100, 560]]}
              stroke={colors.magenta}
              lineWidth={2}
              opacity={0}
              end={0}
              filters={[blur(4)]}
            />
            <Line
              ref={gridLinesV}
              points={[[-850 + i * 100, -560], [-850 + i * 100, 560]]}
              stroke={colors.magenta}
              lineWidth={1}
              opacity={0}
              end={0}
            />
          </Node>
        ))}
      </Node>

      {/* ===== LAYER 4: Ripple Effects ===== */}
      <Node ref={ripplesContainer} opacity={0}>
        {Array.from({ length: RIPPLE_COUNT }, (_, i) => {
          const size = 150 + i * 80;
          const color = i % 2 === 0 ? colors.magenta : colors.yellow;
          return (
            <Node key={`ripple-${i}`}>
              <Circle
                ref={ripplesGlow}
                size={size}
                fill={null}
                stroke={color}
                lineWidth={4}
                opacity={0}
                filters={[blur(8)]}
              />
              <Circle
                ref={ripples}
                size={size}
                fill={null}
                stroke={color}
                lineWidth={2}
                opacity={0}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 5: Connection Lines ===== */}
      <Node ref={connectionsContainer} opacity={0}>
        {connectionDefs.slice(0, CONNECTION_COUNT).map((conn, i) => {
          const color = i % 3 === 0 ? colors.magenta : i % 3 === 1 ? colors.yellow : colors.pink;
          return (
            <Node key={`connection-${i}`}>
              <Line
                ref={connectionsGlow}
                points={[conn.from, conn.to]}
                stroke={color}
                lineWidth={4}
                opacity={0}
                end={0}
                lineDash={[10, 6]}
                filters={[blur(6)]}
              />
              <Line
                ref={connections}
                points={[conn.from, conn.to]}
                stroke={color}
                lineWidth={2}
                opacity={0}
                end={0}
                lineDash={[10, 6]}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 6: Central Hub Node ===== */}
      <Node ref={hubContainer} opacity={0}>
        <Circle
          ref={hubOuterGlow}
          size={200}
          fill={colors.magenta}
          opacity={0}
          filters={[blur(80)]}
        />
        <Circle
          ref={hubMiddleGlow}
          size={130}
          fill={colors.magenta}
          opacity={0}
          filters={[blur(45)]}
        />
        <Circle
          ref={hubInnerGlow}
          size={80}
          fill={colors.yellow}
          opacity={0}
          filters={[blur(25)]}
        />
        <Circle
          ref={hubPulse1}
          size={60}
          fill={null}
          stroke={colors.magenta}
          lineWidth={3}
          opacity={0}
        />
        <Circle
          ref={hubPulse2}
          size={80}
          fill={null}
          stroke={colors.yellow}
          lineWidth={2}
          opacity={0}
        />
        <Circle
          ref={hubRing1}
          size={70}
          fill={null}
          stroke={colors.magenta}
          lineWidth={2}
          opacity={0}
          lineDash={[6, 4]}
        />
        <Circle
          ref={hubRing2}
          size={55}
          fill={null}
          stroke={colors.yellow}
          lineWidth={1}
          opacity={0}
        />
        <Circle
          ref={hubCore}
          size={0}
          fill={colors.white}
          opacity={0}
        />
        <Path
          ref={hubIconGlow}
          data={icons.network}
          fill={colors.magenta}
          opacity={0}
          scale={2.5}
          offset={[-0.5, -0.5]}
          filters={[blur(10)]}
        />
        <Path
          ref={hubIcon}
          data={icons.network}
          fill={colors.white}
          opacity={0}
          scale={0}
          offset={[-0.5, -0.5]}
        />
      </Node>

      {/* ===== LAYER 7: Inner Ring Nodes ===== */}
      <Node ref={innerNodesContainer} opacity={0}>
        {innerNodePositions.map((pos, i) => {
          const color = i % 2 === 0 ? colors.magenta : colors.yellow;
          return (
            <Node key={`inner-node-${i}`} x={pos.x} y={pos.y}>
              <Circle
                ref={innerNodesOuterGlow}
                size={70}
                fill={color}
                opacity={0}
                filters={[blur(30)]}
              />
              <Circle
                ref={innerNodesGlow}
                size={45}
                fill={color}
                opacity={0}
                filters={[blur(18)]}
              />
              <Circle
                ref={innerNodes}
                size={0}
                fill={color}
                opacity={0}
              />
              <Path
                ref={innerNodeIconsGlow}
                data={icons.person}
                fill={color}
                opacity={0}
                scale={1.8}
                offset={[-0.5, -0.5]}
                filters={[blur(8)]}
              />
              <Path
                ref={innerNodeIcons}
                data={icons.person}
                fill={colors.white}
                opacity={0}
                scale={0}
                offset={[-0.5, -0.5]}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 8: Middle Ring Nodes ===== */}
      <Node ref={middleNodesContainer} opacity={0}>
        {middleNodePositions.map((pos, i) => {
          const color = i % 3 === 0 ? colors.pink : i % 3 === 1 ? colors.magenta : colors.yellow;
          return (
            <Node key={`middle-node-${i}`} x={pos.x} y={pos.y}>
              <Circle
                ref={middleNodesOuterGlow}
                size={55}
                fill={color}
                opacity={0}
                filters={[blur(25)]}
              />
              <Circle
                ref={middleNodesGlow}
                size={35}
                fill={color}
                opacity={0}
                filters={[blur(15)]}
              />
              <Circle
                ref={middleNodes}
                size={0}
                fill={color}
                opacity={0}
              />
              <Path
                ref={middleNodeIconsGlow}
                data={icons.person}
                fill={color}
                opacity={0}
                scale={1.5}
                offset={[-0.5, -0.5]}
                filters={[blur(6)]}
              />
              <Path
                ref={middleNodeIcons}
                data={icons.person}
                fill={colors.white}
                opacity={0}
                scale={0}
                offset={[-0.5, -0.5]}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 9: Outer Ring Nodes ===== */}
      <Node ref={outerNodesContainer} opacity={0}>
        {outerNodePositions.map((pos, i) => {
          const color = i % 3 === 0 ? colors.magenta : i % 3 === 1 ? colors.yellow : colors.pink;
          return (
            <Node key={`outer-node-${i}`} x={pos.x} y={pos.y}>
              <Circle
                ref={outerNodesGlow}
                size={28}
                fill={color}
                opacity={0}
                filters={[blur(12)]}
              />
              <Circle
                ref={outerNodes}
                size={0}
                fill={color}
                opacity={0}
              />
              <Path
                ref={outerNodeIconsGlow}
                data={icons.person}
                fill={color}
                opacity={0}
                scale={1.2}
                offset={[-0.5, -0.5]}
                filters={[blur(5)]}
              />
              <Path
                ref={outerNodeIcons}
                data={icons.person}
                fill={colors.white}
                opacity={0}
                scale={0}
                offset={[-0.5, -0.5]}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 10: Energy Pulses ===== */}
      <Node ref={energyPulsesContainer} opacity={0}>
        {Array.from({ length: ENERGY_PULSE_COUNT }, (_, i) => {
          const angle = (i / ENERGY_PULSE_COUNT) * Math.PI * 2;
          const x = Math.cos(angle) * 200;
          const y = Math.sin(angle) * 200 * 0.65;
          const color = i % 3 === 0 ? colors.magenta : i % 3 === 1 ? colors.yellow : colors.pink;
          return (
            <Node key={`energy-pulse-${i}`} x={x} y={y}>
              <Circle
                ref={energyPulsesGlow}
                size={20}
                fill={color}
                opacity={0}
                filters={[blur(12)]}
              />
              <Circle
                ref={energyPulses}
                size={8}
                fill={color}
                opacity={0}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 11: Ambient Particles ===== */}
      <Node ref={ambientParticlesContainer} opacity={0}>
        {Array.from({ length: AMBIENT_PARTICLE_COUNT }, (_, i) => {
          const angle = (i / AMBIENT_PARTICLE_COUNT) * Math.PI * 2;
          const radius = 500 + (i % 5) * 70;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius * 0.55;
          const color = i % 3 === 0 ? colors.magenta : i % 3 === 1 ? colors.yellow : colors.pink;
          return (
            <Node key={`ambient-particle-${i}`} x={x} y={y}>
              <Circle
                ref={ambientParticlesGlow}
                size={16 + (i % 4) * 6}
                fill={color}
                opacity={0}
                filters={[blur(10)]}
              />
              <Circle
                ref={ambientParticles}
                size={5 + (i % 4) * 2}
                fill={color}
                opacity={0}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 12: Sparkles ===== */}
      <Node ref={sparklesContainer} opacity={0}>
        {Array.from({ length: SPARKLE_COUNT }, (_, i) => {
          const angle = (i / SPARKLE_COUNT) * Math.PI * 2 + Math.PI / 8;
          const radius = 350 + (i % 4) * 80;
          const x = Math.cos(angle) * radius + Math.sin(i * 2) * 30;
          const y = Math.sin(angle) * radius * 0.55 + Math.cos(i * 2) * 20;
          const color = i % 3 === 0 ? colors.yellow : i % 3 === 1 ? colors.magenta : colors.pink;
          return (
            <Node key={`sparkle-${i}`} x={x} y={y}>
              <Path
                ref={sparklesGlow}
                data={icons.star}
                fill={color}
                opacity={0}
                scale={0.85 + (i % 3) * 0.3}
                offset={[-0.5, -0.5]}
                filters={[blur(8)]}
              />
              <Path
                ref={sparkles}
                data={icons.star}
                fill={color}
                opacity={0}
                scale={0}
                offset={[-0.5, -0.5]}
              />
            </Node>
          );
        })}
      </Node>

      {/* ===== LAYER 13: Decorative Elements ===== */}
      <Node ref={decorContainer} opacity={0}>
        {Array.from({ length: 5 }, (_, i) => (
          <Node key={`decor-tl-${i}`} x={-860 + i * 35} y={-480 + i * 30}>
            <Circle
              ref={decorCirclesGlow}
              size={18 - i * 2}
              fill={colors.magenta}
              opacity={0}
              filters={[blur(10)]}
            />
            <Circle
              ref={decorCircles}
              size={8 - i}
              fill={colors.magenta}
              opacity={0}
            />
          </Node>
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <Node key={`decor-tr-${i}`} x={860 - i * 35} y={-480 + i * 30}>
            <Circle
              ref={decorCirclesGlow}
              size={18 - i * 2}
              fill={colors.yellow}
              opacity={0}
              filters={[blur(10)]}
            />
            <Circle
              ref={decorCircles}
              size={8 - i}
              fill={colors.yellow}
              opacity={0}
            />
          </Node>
        ))}
        {Array.from({ length: 4 }, (_, i) => (
          <Node key={`decor-bl-${i}`} x={-860 + i * 32} y={480 - i * 28}>
            <Circle
              ref={decorCirclesGlow}
              size={16 - i * 2}
              fill={colors.pink}
              opacity={0}
              filters={[blur(8)]}
            />
            <Circle
              ref={decorCircles}
              size={7 - i}
              fill={colors.pink}
              opacity={0}
            />
          </Node>
        ))}
        {Array.from({ length: 4 }, (_, i) => (
          <Node key={`decor-br-${i}`} x={860 - i * 32} y={480 - i * 28}>
            <Circle
              ref={decorCirclesGlow}
              size={16 - i * 2}
              fill={colors.magenta}
              opacity={0}
              filters={[blur(8)]}
            />
            <Circle
              ref={decorCircles}
              size={7 - i}
              fill={colors.magenta}
              opacity={0}
            />
          </Node>
        ))}
        {Array.from({ length: 3 }, (_, i) => (
          <Node key={`decor-line-tl-${i}`}>
            <Line
              ref={decorLinesGlow}
              points={[[-920 + i * 25, -520 + i * 35], [-860 + i * 25, -460 + i * 35]]}
              stroke={colors.magenta}
              lineWidth={4}
              opacity={0}
              end={0}
              filters={[blur(5)]}
            />
            <Line
              ref={decorLines}
              points={[[-920 + i * 25, -520 + i * 35], [-860 + i * 25, -460 + i * 35]]}
              stroke={colors.magenta}
              lineWidth={1.5}
              opacity={0}
              end={0}
            />
          </Node>
        ))}
        {Array.from({ length: 3 }, (_, i) => (
          <Node key={`decor-line-tr-${i}`}>
            <Line
              ref={decorLinesGlow}
              points={[[920 - i * 25, -520 + i * 35], [860 - i * 25, -460 + i * 35]]}
              stroke={colors.yellow}
              lineWidth={4}
              opacity={0}
              end={0}
              filters={[blur(5)]}
            />
            <Line
              ref={decorLines}
              points={[[920 - i * 25, -520 + i * 35], [860 - i * 25, -460 + i * 35]]}
              stroke={colors.yellow}
              lineWidth={1.5}
              opacity={0}
              end={0}
            />
          </Node>
        ))}
      </Node>

      {/* ===== LAYER 14: Vignette ===== */}
      <Rect
        ref={vignetteTop}
        width={layout.width}
        height={200}
        y={-440}
        fill={colors.darkNavy}
        opacity={0}
        filters={[blur(50)]}
      />
      <Rect
        ref={vignetteBottom}
        width={layout.width}
        height={200}
        y={440}
        fill={colors.darkNavy}
        opacity={0}
        filters={[blur(50)]}
      />
    </>
  );

  // ============================================
  // ANIMATION TIMELINE
  // ============================================

  // ========================================
  // BEAT 0 (0.0s) - Scene initialization
  // ========================================
  yield* all(
    bgGlowMagenta1().opacity(0.035, 0.16),
    bgGlowPurple1().opacity(0.02, 0.16),
    bgGlowPurple2().opacity(0.015, 0.16),
  );

  // ========================================
  // BEAT 1 (0.4s) - Scanlines appear
  // ========================================
  yield* scanlineContainer().opacity(1, 0.1);

  // ========================================
  // BEAT 2 (0.65s) - Grid starts
  // ========================================
  yield* all(
    gridContainer().opacity(1, 0.04),
    ...gridLinesH.slice(0, 5).map((line, i) =>
      delay(i * 0.012, all(
        line.opacity(0.05, 0.07),
        line.end(1, 0.16, easeOutCubic),
        gridGlowH[i].opacity(0.02, 0.09),
        gridGlowH[i].end(1, 0.16, easeOutCubic),
      ))
    ),
  );

  // ========================================
  // BEAT 3 (0.9s) - More grid
  // ========================================
  yield* all(
    ...gridLinesV.slice(0, 5).map((line, i) =>
      delay(i * 0.012, all(
        line.opacity(0.04, 0.06),
        line.end(1, 0.14, easeOutCubic),
        gridGlowV[i].opacity(0.018, 0.08),
        gridGlowV[i].end(1, 0.14, easeOutCubic),
      ))
    ),
    bgGlowYellow1().opacity(0.025, 0.12),
    bgGlowPink1().opacity(0.018, 0.12),
  );

  // ========================================
  // BEAT 4 (1.15s) - Hub container appears
  // ========================================
  yield* hubContainer().opacity(1, 0.04);

  // ========================================
  // BEAT 5 (1.25s) - Hub glows appear
  // ========================================
  yield* all(
    hubOuterGlow().opacity(0.15, 0.14),
    hubMiddleGlow().opacity(0.25, 0.12),
    hubInnerGlow().opacity(0.4, 0.11),
  );

  // ========================================
  // BEAT 6 (1.6s) - Hub core and rings
  // ========================================
  yield* all(
    hubCore().size(35, 0.14, easeOutBack),
    hubCore().opacity(1, 0.1),
    hubRing1().opacity(0.6, 0.1),
    hubRing2().opacity(0.5, 0.1),
  );

  // ========================================
  // BEAT 7 (1.95s) - Hub icon appears
  // ========================================
  yield* all(
    hubIcon().scale(2.5, 0.14, easeOutBack),
    hubIcon().opacity(1, 0.1),
    hubIconGlow().opacity(0.5, 0.12),
  );

  // ========================================
  // BEAT 8 (2.3s) - First hub pulse
  // ========================================
  yield* all(
    hubPulse1().opacity(0.6, 0.04),
    hubPulse1().size(150, 0.18, easeOutCubic),
  );
  yield* hubPulse1().opacity(0, 0.1);

  // ========================================
  // BEAT 9 (2.65s) - Connections container
  // ========================================
  yield* connectionsContainer().opacity(1, 0.04);

  // ========================================
  // BEAT 10 (2.75s) - Hub to inner connections draw
  // ========================================
  yield* sequence(
    0.024,
    ...connections.slice(0, INNER_NODE_COUNT).map((line, i) =>
      all(
        line.opacity(0.5, 0.06),
        line.end(1, 0.14, easeOutCubic),
        connectionsGlow[i].opacity(0.25, 0.08),
        connectionsGlow[i].end(1, 0.14, easeOutCubic),
      )
    )
  );

  // ========================================
  // BEAT 11 (3.2s) - Inner nodes container
  // ========================================
  yield* innerNodesContainer().opacity(1, 0.04);

  // ========================================
  // BEAT 12 (3.3s) - Inner nodes appear
  // ========================================
  yield* sequence(
    0.032,
    ...innerNodes.map((node, i) =>
      all(
        node.size(22, 0.11, easeOutBack),
        node.opacity(1, 0.08),
        innerNodesGlow[i].opacity(0.45, 0.1),
        innerNodesOuterGlow[i].opacity(0.2, 0.11),
        innerNodeIcons[i].scale(1.8, 0.11, easeOutBack),
        innerNodeIcons[i].opacity(1, 0.08),
        innerNodeIconsGlow[i].opacity(0.4, 0.1),
      )
    )
  );

  // ========================================
  // BEAT 13 (3.85s) - Inner to middle connections
  // ========================================
  yield* sequence(
    0.016,
    ...connections.slice(INNER_NODE_COUNT, INNER_NODE_COUNT + INNER_NODE_COUNT * 2).map((line, i) =>
      all(
        line.opacity(0.45, 0.05),
        line.end(1, 0.13, easeOutCubic),
        connectionsGlow[INNER_NODE_COUNT + i].opacity(0.22, 0.07),
        connectionsGlow[INNER_NODE_COUNT + i].end(1, 0.13, easeOutCubic),
      )
    )
  );

  // ========================================
  // BEAT 14 (4.35s) - Middle nodes container
  // ========================================
  yield* middleNodesContainer().opacity(1, 0.04);

  // ========================================
  // BEAT 15 (4.45s) - Middle nodes appear
  // ========================================
  yield* sequence(
    0.02,
    ...middleNodes.map((node, i) =>
      all(
        node.size(18, 0.1, easeOutBack),
        node.opacity(1, 0.07),
        middleNodesGlow[i].opacity(0.4, 0.09),
        middleNodesOuterGlow[i].opacity(0.18, 0.1),
        middleNodeIcons[i].scale(1.5, 0.1, easeOutBack),
        middleNodeIcons[i].opacity(1, 0.07),
        middleNodeIconsGlow[i].opacity(0.35, 0.09),
      )
    )
  );

  // ========================================
  // BEAT 16 (5.15s) - Second hub pulse
  // ========================================
  yield* all(
    hubPulse2().opacity(0.5, 0.04),
    hubPulse2().size(200, 0.2, easeOutCubic),
    bgGlowMagenta1().opacity(0.045, 0.14),
    bgGlowMagenta2().opacity(0.025, 0.14),
  );
  yield* hubPulse2().opacity(0, 0.11);

  // ========================================
  // BEAT 17 (5.6s) - Middle to outer connections
  // ========================================
  yield* sequence(
    0.014,
    ...connections.slice(INNER_NODE_COUNT + INNER_NODE_COUNT * 2, INNER_NODE_COUNT + INNER_NODE_COUNT * 2 + MIDDLE_NODE_COUNT).map((line, i) =>
      all(
        line.opacity(0.4, 0.05),
        line.end(1, 0.12, easeOutCubic),
        connectionsGlow[INNER_NODE_COUNT + INNER_NODE_COUNT * 2 + i].opacity(0.2, 0.06),
        connectionsGlow[INNER_NODE_COUNT + INNER_NODE_COUNT * 2 + i].end(1, 0.12, easeOutCubic),
      )
    )
  );

  // ========================================
  // BEAT 18 (6.1s) - Outer nodes container
  // ========================================
  yield* outerNodesContainer().opacity(1, 0.04);

  // ========================================
  // BEAT 19 (6.2s) - Outer nodes appear
  // ========================================
  yield* sequence(
    0.012,
    ...outerNodes.map((node, i) =>
      all(
        node.size(14, 0.09, easeOutBack),
        node.opacity(1, 0.06),
        outerNodesGlow[i].opacity(0.35, 0.08),
        outerNodeIcons[i].scale(1.2, 0.09, easeOutBack),
        outerNodeIcons[i].opacity(1, 0.06),
        outerNodeIconsGlow[i].opacity(0.3, 0.08),
      )
    )
  );

  // ========================================
  // BEAT 20 (6.8s) - Cross-connections draw
  // ========================================
  yield* sequence(
    0.024,
    ...connections.slice(INNER_NODE_COUNT + INNER_NODE_COUNT * 2 + MIDDLE_NODE_COUNT).map((line, i) =>
      all(
        line.opacity(0.35, 0.05),
        line.end(1, 0.11, easeOutCubic),
        connectionsGlow[INNER_NODE_COUNT + INNER_NODE_COUNT * 2 + MIDDLE_NODE_COUNT + i]?.opacity(0.18, 0.06),
        connectionsGlow[INNER_NODE_COUNT + INNER_NODE_COUNT * 2 + MIDDLE_NODE_COUNT + i]?.end(1, 0.11, easeOutCubic),
      )
    )
  );

  // ========================================
  // BEAT 21 (7.2s) - Ripples container
  // ========================================
  yield* ripplesContainer().opacity(1, 0.04);

  // ========================================
  // BEAT 22 (7.3s) - Ripples expand
  // ========================================
  yield* sequence(
    0.048,
    ...ripples.slice(0, 3).map((ripple, i) =>
      all(
        ripple.opacity(0.5, 0.06),
        ripple.size(ripple.size() + 100, 0.22, easeOutCubic),
        ripplesGlow[i].opacity(0.25, 0.08),
        ripplesGlow[i].size(ripplesGlow[i].size() + 100, 0.22, easeOutCubic),
      )
    )
  );
  yield* all(
    ...ripples.slice(0, 3).map((ripple) => ripple.opacity(0, 0.11)),
    ...ripplesGlow.slice(0, 3).map((glow) => glow.opacity(0, 0.11)),
  );

  // ========================================
  // BEAT 23 (7.9s) - Complete grid
  // ========================================
  yield* all(
    ...gridLinesH.slice(5).map((line, i) =>
      delay(i * 0.008, all(
        line.opacity(0.04, 0.06),
        line.end(1, 0.13, easeOutCubic),
      ))
    ),
    ...gridLinesV.slice(5).map((line, i) =>
      delay(i * 0.008, all(
        line.opacity(0.035, 0.06),
        line.end(1, 0.13, easeOutCubic),
      ))
    ),
  );

  // ========================================
  // BEAT 24 (8.3s) - Energy pulses container
  // ========================================
  yield* energyPulsesContainer().opacity(1, 0.04);

  // ========================================
  // BEAT 25 (8.4s) - Energy pulses appear and move
  // ========================================
  yield* sequence(
    0.016,
    ...energyPulses.map((pulse, i) =>
      all(
        pulse.opacity(0.7, 0.06),
        energyPulsesGlow[i].opacity(0.4, 0.08),
      )
    )
  );

  // ========================================
  // BEAT 26 (8.85s) - All nodes pulse
  // ========================================
  yield* all(
    ...innerNodes.map((node) => chain(
      node.size(28, 0.04, easeOutCubic),
      node.size(22, 0.05, easeInOutCubic),
    )),
    ...middleNodes.map((node, i) => delay(i * 0.006, chain(
      node.size(24, 0.04, easeOutCubic),
      node.size(18, 0.05, easeInOutCubic),
    ))),
    hubCore().size(42, 0.04, easeOutCubic),
  );
  yield* hubCore().size(35, 0.05, easeInOutCubic);

  // ========================================
  // BEAT 27 (9.15s) - Ambient particles
  // ========================================
  yield* ambientParticlesContainer().opacity(1, 0.04);
  yield* sequence(
    0.01,
    ...ambientParticles.map((particle, i) =>
      all(
        particle.opacity(0.6, 0.06),
        ambientParticlesGlow[i].opacity(0.35, 0.08),
      )
    )
  );

  // ========================================
  // BEAT 28 (9.65s) - Second ripple wave
  // ========================================
  yield* sequence(
    0.04,
    ...ripples.slice(3).map((ripple, i) =>
      all(
        ripple.opacity(0.45, 0.05),
        ripple.size(ripple.size() + 120, 0.24, easeOutCubic),
        ripplesGlow[i + 3].opacity(0.22, 0.07),
        ripplesGlow[i + 3].size(ripplesGlow[i + 3].size() + 120, 0.24, easeOutCubic),
      )
    )
  );
  yield* all(
    ...ripples.slice(3).map((ripple) => ripple.opacity(0, 0.12)),
    ...ripplesGlow.slice(3).map((glow) => glow.opacity(0, 0.12)),
  );

  // ========================================
  // BEAT 29 (10.25s) - Sparkles container
  // ========================================
  yield* sparklesContainer().opacity(1, 0.04);

  // ========================================
  // BEAT 30 (10.35s) - Sparkles appear
  // ========================================
  yield* sequence(
    0.016,
    ...sparkles.map((sparkle, i) =>
      all(
        sparkle.scale(0.85 + (i % 3) * 0.3, 0.1, easeOutBack),
        sparkle.opacity(0.6, 0.06),
        sparklesGlow[i].opacity(0.35, 0.08),
      )
    )
  );

  // ========================================
  // BEAT 31 (10.85s) - Background intensifies
  // ========================================
  yield* all(
    bgGlowMagenta1().opacity(0.055, 0.16),
    bgGlowYellow1().opacity(0.04, 0.16),
    bgGlowPink1().opacity(0.03, 0.16),
    bgGlowMagenta3().opacity(0.025, 0.16),
  );

  // ========================================
  // BEAT 32 (11.25s) - Connection lines pulse
  // ========================================
  yield* all(
    ...connections.slice(0, 20).map((line, i) =>
      delay(i * 0.004, chain(
        line.lineWidth(4, 0.03, easeOutCubic),
        line.lineWidth(2, 0.04, easeInOutCubic),
      ))
    ),
  );

  // ========================================
  // BEAT 33 (11.55s) - Vignette appears
  // ========================================
  yield* all(
    vignetteTop().opacity(0.3, 0.11),
    vignetteBottom().opacity(0.3, 0.11),
  );

  // ========================================
  // BEAT 34 (11.83s) - Decor container
  // ========================================
  yield* decorContainer().opacity(1, 0.04);

  // ========================================
  // BEAT 35 (11.93s) - Decorative elements
  // ========================================
  yield* all(
    ...decorCircles.map((circle, i) =>
      delay(i * 0.008, circle.opacity(0.5, 0.07))
    ),
    ...decorCirclesGlow.map((glow, i) =>
      delay(i * 0.008, glow.opacity(0.28, 0.09))
    ),
    ...decorLines.map((line, i) =>
      delay(i * 0.012, all(
        line.opacity(0.42, 0.06),
        line.end(1, 0.1, easeOutCubic),
      ))
    ),
    ...decorLinesGlow.map((glow, i) =>
      delay(i * 0.012, all(
        glow.opacity(0.22, 0.07),
        glow.end(1, 0.1, easeOutCubic),
      ))
    ),
  );

  // ========================================
  // BEAT 36 (12.35s) - Third hub pulse
  // ========================================
  yield* all(
    hubPulse1().size(60, 0),
    hubPulse1().opacity(0.65, 0.04),
    hubPulse1().size(250, 0.22, easeOutCubic),
    hubPulse2().size(80, 0),
    hubPulse2().opacity(0.45, 0.05),
    hubPulse2().size(300, 0.24, easeOutCubic),
  );
  yield* all(
    hubPulse1().opacity(0, 0.12),
    hubPulse2().opacity(0, 0.13),
  );

  // ========================================
  // BEAT 37 (12.9s) - Outer nodes pulse wave
  // ========================================
  yield* all(
    ...outerNodes.map((node, i) =>
      delay(i * 0.008, chain(
        node.size(20, 0.03, easeOutCubic),
        node.size(14, 0.04, easeInOutCubic),
      ))
    ),
  );

  // ========================================
  // BEAT 38 (13.3s) - Sparkles twinkle
  // ========================================
  yield* all(
    ...sparkles.map((sparkle, i) =>
      delay(i * 0.008, chain(
        sparkle.scale((0.85 + (i % 3) * 0.3) * 1.35, 0.03, easeOutCubic),
        sparkle.scale(0.85 + (i % 3) * 0.3, 0.04, easeInOutCubic),
      ))
    ),
  );

  // ========================================
  // BEAT 39 (13.65s) - Energy pulses move outward
  // ========================================
  yield* all(
    ...energyPulses.map((pulse, i) => {
      const angle = (i / ENERGY_PULSE_COUNT) * Math.PI * 2;
      const newX = Math.cos(angle) * 350;
      const newY = Math.sin(angle) * 350 * 0.65;
      return all(
        pulse.x(newX, 0.2, easeOutCubic),
        pulse.y(newY, 0.2, easeOutCubic),
      );
    }),
    ...energyPulsesGlow.map((glow, i) => {
      const angle = (i / ENERGY_PULSE_COUNT) * Math.PI * 2;
      const newX = Math.cos(angle) * 350;
      const newY = Math.sin(angle) * 350 * 0.65;
      return all(
        glow.x(newX, 0.2, easeOutCubic),
        glow.y(newY, 0.2, easeOutCubic),
      );
    }),
  );

  // ========================================
  // BEAT 40 (14.15s) - Final network pulse
  // ========================================
  yield* all(
    hubIcon().scale(2.8, 0.05, easeOutCubic),
    hubIconGlow().opacity(0.7, 0.04),
    hubCore().size(42, 0.05, easeOutCubic),
    ...innerNodes.map((node) => node.size(26, 0.05, easeOutCubic)),
    ...middleNodes.map((node) => node.size(22, 0.05, easeOutCubic)),
  );
  yield* all(
    hubIcon().scale(2.5, 0.06, easeInOutCubic),
    hubIconGlow().opacity(0.5, 0.06),
    hubCore().size(35, 0.06, easeInOutCubic),
    ...innerNodes.map((node) => node.size(22, 0.06, easeInOutCubic)),
    ...middleNodes.map((node) => node.size(18, 0.06, easeInOutCubic)),
  );

  // ========================================
  // BEAT 41 (14.45s) - Final intensity
  // ========================================
  yield* all(
    bgGlowMagenta1().opacity(0.065, 0.14),
    bgGlowYellow1().opacity(0.05, 0.14),
    bgGlowPink1().opacity(0.038, 0.14),
  );

  // ========================================
  // BEAT 42 (14.8s) - Hold final frame
  // ========================================
  yield* waitFor(0.28);

  // ========================================
  // Total duration: ~10 seconds
  // ========================================
});
