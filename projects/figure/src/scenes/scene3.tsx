/**
 * Scene 3: Core Value Prop (True 3D Cube)
 * Duration: ~6 seconds
 *
 * V4: Removed pedestal/bottom lines, cube centered
 * Visual: "Building blocks of wealth" - architectural, foundational
 * True 3D cube with proper perspective projection rotating on Y-axis
 * 6 faces with z-sorting, 12 edge highlights, 8 vertex particles
 * Text on rotating cube faces (reduced size for readability)
 */

import { makeScene2D } from '@revideo/2d';
import { Rect, Node, Circle, Txt, Line, blur } from '@revideo/2d';
import {
  all,
  delay,
  waitFor,
  createRef,
  createSignal,
  easeOutCubic,
  easeInOutCubic,
  easeOutBack,
  easeInOutQuad,
  linear,
} from '@revideo/core';

import { colors, fonts, fontWeights, timing, layout } from '../lib/brand';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface ProjectedPoint {
  x: number;
  y: number;
  scale: number;
  z: number;
}

export default makeScene2D('scene3', function* (view) {
  view.fill(colors.background);

  const CUBE_SIZE = 240;
  const FOCAL_LENGTH = 600;
  const FACE_TEXTS = [
    'Direct\nownership.',
    'Combine with\ncrypto in\none wallet.',
    'Lend shares.\nBorrow against\nholdings.',
  ];

  const rotationY = createSignal(0);
  const rotationX = createSignal(-15);

  const project3D = (point: Point3D): ProjectedPoint => {
    const cosY = Math.cos(rotationY() * Math.PI / 180);
    const sinY = Math.sin(rotationY() * Math.PI / 180);
    const cosX = Math.cos(rotationX() * Math.PI / 180);
    const sinX = Math.sin(rotationX() * Math.PI / 180);

    let x = point.x * cosY - point.z * sinY;
    let z = point.x * sinY + point.z * cosY;
    let y = point.y * cosX - z * sinX;
    z = point.y * sinX + z * cosX;

    const scale = FOCAL_LENGTH / (FOCAL_LENGTH + z);
    return {
      x: x * scale,
      y: y * scale,
      scale,
      z,
    };
  };

  const halfSize = CUBE_SIZE / 2;
  const vertices: Point3D[] = [
    { x: -halfSize, y: -halfSize, z: -halfSize },
    { x: halfSize, y: -halfSize, z: -halfSize },
    { x: halfSize, y: halfSize, z: -halfSize },
    { x: -halfSize, y: halfSize, z: -halfSize },
    { x: -halfSize, y: -halfSize, z: halfSize },
    { x: halfSize, y: -halfSize, z: halfSize },
    { x: halfSize, y: halfSize, z: halfSize },
    { x: -halfSize, y: halfSize, z: halfSize },
  ];

  // V5: Removed face-container-5 (bottom face)
  const faces = [
    { verts: [0, 1, 2, 3], normal: { x: 0, y: 0, z: -1 }, text: FACE_TEXTS[0], color: colors.primary },
    { verts: [5, 4, 7, 6], normal: { x: 0, y: 0, z: 1 }, text: FACE_TEXTS[2], color: colors.secondary },
    { verts: [4, 0, 3, 7], normal: { x: -1, y: 0, z: 0 }, text: FACE_TEXTS[1], color: colors.primary },
    { verts: [1, 5, 6, 2], normal: { x: 1, y: 0, z: 0 }, text: '', color: colors.secondary },
    { verts: [4, 5, 1, 0], normal: { x: 0, y: -1, z: 0 }, text: '', color: colors.accent },
  ];

  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];

  const bgGlow = createRef<Circle>();
  const bgGlowSecondary = createRef<Circle>();
  const bgGlowTertiary = createRef<Circle>();
  const bgGlowDeep = createRef<Circle>();

  const vignetteTopLeft = createRef<Circle>();
  const vignetteTopRight = createRef<Circle>();
  const vignetteBottomLeft = createRef<Circle>();
  const vignetteBottomRight = createRef<Circle>();

  const isometricGridContainer = createRef<Node>();
  const isoLinesHorizontal: Array<ReturnType<typeof createRef<Rect>>> = [];
  const isoLinesVertical: Array<ReturnType<typeof createRef<Rect>>> = [];
  for (let i = 0; i < 12; i++) {
    isoLinesHorizontal.push(createRef<Rect>());
    isoLinesVertical.push(createRef<Rect>());
  }

  const circuitContainer = createRef<Node>();
  const circuitHLines: Array<ReturnType<typeof createRef<Rect>>> = [];
  const circuitVLines: Array<ReturnType<typeof createRef<Rect>>> = [];
  const circuitNodes: Array<ReturnType<typeof createRef<Circle>>> = [];
  for (let i = 0; i < 8; i++) {
    circuitHLines.push(createRef<Rect>());
    circuitVLines.push(createRef<Rect>());
  }
  for (let i = 0; i < 16; i++) {
    circuitNodes.push(createRef<Circle>());
  }

  const particleContainer = createRef<Node>();
  const ambientParticles: Array<ReturnType<typeof createRef<Circle>>> = [];
  for (let i = 0; i < 28; i++) {
    ambientParticles.push(createRef<Circle>());
  }

  const dataStreamContainer = createRef<Node>();
  const dataStreams: Array<ReturnType<typeof createRef<Rect>>> = [];
  const dataStreamGlows: Array<ReturnType<typeof createRef<Rect>>> = [];
  for (let i = 0; i < 12; i++) {
    dataStreams.push(createRef<Rect>());
    dataStreamGlows.push(createRef<Rect>());
  }

  const cubeContainer = createRef<Node>();
  const cubeShadow = createRef<Circle>();
  const cubeShadowOuter = createRef<Circle>();
  const cubeReflection = createRef<Rect>();

  const faceContainers: Array<ReturnType<typeof createRef<Node>>> = [];
  const faceRects: Array<ReturnType<typeof createRef<Rect>>> = [];
  const faceGlows: Array<ReturnType<typeof createRef<Rect>>> = [];
  const faceGlowsOuter: Array<ReturnType<typeof createRef<Rect>>> = [];
  const faceTexts: Array<ReturnType<typeof createRef<Txt>>> = [];
  // V5: Reduced to 5 faces (removed bottom face)
  for (let i = 0; i < 5; i++) {
    faceContainers.push(createRef<Node>());
    faceRects.push(createRef<Rect>());
    faceGlows.push(createRef<Rect>());
    faceGlowsOuter.push(createRef<Rect>());
    faceTexts.push(createRef<Txt>());
  }

  const edgeLines: Array<ReturnType<typeof createRef<Line>>> = [];
  const edgeGlows: Array<ReturnType<typeof createRef<Line>>> = [];
  for (let i = 0; i < 12; i++) {
    edgeLines.push(createRef<Line>());
    edgeGlows.push(createRef<Line>());
  }

  const vertexParticles: Array<ReturnType<typeof createRef<Circle>>> = [];
  const vertexGlows: Array<ReturnType<typeof createRef<Circle>>> = [];
  for (let i = 0; i < 8; i++) {
    vertexParticles.push(createRef<Circle>());
    vertexGlows.push(createRef<Circle>());
  }

  // V4: Removed pedestal refs (bottom lines removed)

  const dotContainer = createRef<Node>();
  const dot1 = createRef<Circle>();
  const dot2 = createRef<Circle>();
  const dot3 = createRef<Circle>();
  const dot1Glow = createRef<Circle>();
  const dot2Glow = createRef<Circle>();
  const dot3Glow = createRef<Circle>();
  const dot1Ring = createRef<Circle>();
  const dot2Ring = createRef<Circle>();
  const dot3Ring = createRef<Circle>();

  const particlePositions = Array.from({ length: 28 }, (_, i) => {
    const angle = (i * 12.86) * (Math.PI / 180);
    const r = 200 + Math.random() * 140;
    return {
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r * 0.6 - 30,
      size: 2 + Math.random() * 3,
      delay: i * 0.02,
    };
  });

  const dataStreamPositions = [
    { x: -420, y: -220, angle: 30, length: 160 },
    { x: -370, y: -120, angle: 25, length: 130 },
    { x: -320, y: -20, angle: 15, length: 110 },
    { x: -300, y: 80, angle: 5, length: 120 },
    { x: 420, y: -220, angle: -30, length: 160 },
    { x: 370, y: -120, angle: -25, length: 130 },
    { x: 320, y: -20, angle: -15, length: 110 },
    { x: 300, y: 80, angle: -5, length: 120 },
    { x: -220, y: -300, angle: 55, length: 140 },
    { x: 0, y: -320, angle: 85, length: 150 },
    { x: 220, y: -300, angle: -55, length: 140 },
    { x: 0, y: 280, angle: -90, length: 110 },
  ];

  const circuitHLinePositions = [
    { x: -520, y: -370, width: 200 },
    { x: 420, y: -340, width: 180 },
    { x: -470, y: -170, width: 150 },
    { x: 470, y: -200, width: 160 },
    { x: -420, y: 260, width: 180 },
    { x: 400, y: 280, width: 200 },
    { x: -520, y: 330, width: 220 },
    { x: 440, y: 360, width: 190 },
  ];

  const circuitVLinePositions = [
    { x: -570, y: -320, height: 150 },
    { x: 540, y: -300, height: 140 },
    { x: -500, y: -120, height: 180 },
    { x: 520, y: -140, height: 160 },
    { x: -540, y: 180, height: 200 },
    { x: 500, y: 200, height: 180 },
    { x: -620, y: 300, height: 150 },
    { x: 580, y: 320, height: 160 },
  ];

  const circuitNodePositions = [
    { x: -570, y: -370 }, { x: -320, y: -370 },
    { x: 420, y: -340 }, { x: 600, y: -340 },
    { x: -470, y: -170 }, { x: -320, y: -170 },
    { x: 470, y: -200 }, { x: 630, y: -200 },
    { x: -420, y: 260 }, { x: -240, y: 260 },
    { x: 400, y: 280 }, { x: 600, y: 280 },
    { x: -520, y: 330 }, { x: -300, y: 330 },
    { x: 440, y: 360 }, { x: 630, y: 360 },
  ];

  const getFaceCenter = (faceIndex: number): ProjectedPoint => {
    const face = faces[faceIndex];
    let cx = 0, cy = 0, cz = 0;
    for (const vi of face.verts) {
      cx += vertices[vi].x;
      cy += vertices[vi].y;
      cz += vertices[vi].z;
    }
    return project3D({ x: cx / 4, y: cy / 4, z: cz / 4 });
  };

  // V5: Returns smooth opacity value (0-1) based on face angle for gradual transitions
  const getFaceOpacity = (faceIndex: number): number => {
    const face = faces[faceIndex];
    const cosY = Math.cos(rotationY() * Math.PI / 180);
    const sinY = Math.sin(rotationY() * Math.PI / 180);
    const cosX = Math.cos(rotationX() * Math.PI / 180);
    const sinX = Math.sin(rotationX() * Math.PI / 180);

    let nx = face.normal.x * cosY - face.normal.z * sinY;
    let nz = face.normal.x * sinY + face.normal.z * cosY;
    let ny = face.normal.y * cosX - nz * sinX;
    nz = face.normal.y * sinX + nz * cosX;

    // nz < 0 means facing camera, nz > 0 means facing away
    // Create smooth transition: fully visible when nz < -0.3, fade out between -0.3 and 0.1
    if (nz < -0.3) return 0.95;
    if (nz > 0.1) return 0;
    // Smooth interpolation in transition zone
    const t = (nz + 0.3) / 0.4; // 0 to 1 as nz goes from -0.3 to 0.1
    return 0.95 * (1 - t * t); // Quadratic ease-out
  };

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

      <Circle
        ref={bgGlow}
        size={1100}
        fill={colors.secondary}
        opacity={0.04}
        x={0}
        y={-60}
        filters={[blur(300)]}
      />
      <Circle
        ref={bgGlowSecondary}
        size={700}
        fill={colors.primary}
        opacity={0.03}
        x={-220}
        y={140}
        filters={[blur(220)]}
      />
      <Circle
        ref={bgGlowTertiary}
        size={550}
        fill={colors.accent}
        opacity={0}
        x={220}
        y={-120}
        filters={[blur(200)]}
      />

      <Node ref={circuitContainer} opacity={0}>
        {circuitHLinePositions.map((pos, i) => (
          <Rect
            ref={circuitHLines[i]}
            key={`circuit-h-${i}`}
            width={0}
            height={1}
            fill={colors.primary}
            opacity={0.08}
            x={pos.x}
            y={pos.y}
            filters={[blur(1)]}
          />
        ))}
        {circuitVLinePositions.map((pos, i) => (
          <Rect
            ref={circuitVLines[i]}
            key={`circuit-v-${i}`}
            width={1}
            height={0}
            fill={colors.secondary}
            opacity={0.08}
            x={pos.x}
            y={pos.y}
            filters={[blur(1)]}
          />
        ))}
        {circuitNodePositions.map((pos, i) => (
          <Circle
            ref={circuitNodes[i]}
            key={`circuit-node-${i}`}
            size={4}
            fill={i % 2 === 0 ? colors.primary : colors.secondary}
            opacity={0}
            x={pos.x}
            y={pos.y}
          />
        ))}
      </Node>

      {/* V5: Grid repositioned for centered cube */}
      <Node ref={isometricGridContainer} y={180} opacity={0}>
        {Array.from({ length: 12 }, (_, i) => {
          const spacing = 55;
          const offset = (i - 6) * spacing;
          return (
            <>
              <Rect
                ref={isoLinesHorizontal[i]}
                key={`iso-h-${i}`}
                width={900}
                height={1}
                fill={colors.primary}
                opacity={0.05}
                y={offset * 0.4}
                filters={[blur(1)]}
              />
              <Rect
                ref={isoLinesVertical[i]}
                key={`iso-v-${i}`}
                width={1}
                height={450}
                fill={colors.secondary}
                opacity={0.04}
                x={offset}
                filters={[blur(1)]}
              />
            </>
          );
        })}
      </Node>

      <Node ref={dataStreamContainer} opacity={0}>
        {dataStreamPositions.map((pos, i) => (
          <>
            <Rect
              ref={dataStreamGlows[i]}
              key={`stream-glow-${i}`}
              width={8}
              height={0}
              fill={i % 2 === 0 ? colors.primary : colors.secondary}
              opacity={0.15}
              x={pos.x}
              y={pos.y}
              rotation={pos.angle}
              filters={[blur(8)]}
            />
            <Rect
              ref={dataStreams[i]}
              key={`stream-${i}`}
              width={2}
              height={0}
              fill={i % 2 === 0 ? colors.primary : colors.secondary}
              opacity={0.4}
              x={pos.x}
              y={pos.y}
              rotation={pos.angle}
              filters={[blur(2)]}
            />
          </>
        ))}
      </Node>

      {/* V5: Shadows repositioned for centered cube */}
      <Circle
        ref={cubeShadowOuter}
        size={420}
        fill={'#000000'}
        opacity={0}
        y={200}
        filters={[blur(90)]}
      />
      <Circle
        ref={cubeShadow}
        size={300}
        fill={'#000000'}
        opacity={0}
        y={190}
        filters={[blur(50)]}
      />

      {/* V4: Removed pedestal elements (bottom lines removed) */}

      {/* V5: Particles centered at y=0 */}
      <Node ref={particleContainer} y={0} opacity={0}>
        {particlePositions.map((pos, i) => (
          <Circle
            ref={ambientParticles[i]}
            key={`particle-${i}`}
            size={pos.size}
            x={pos.x}
            y={pos.y}
            fill={i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.text}
            opacity={0}
            filters={[blur(1)]}
          />
        ))}
      </Node>

      {/* V5: Cube centered at y=0 */}
      <Node ref={cubeContainer} y={0} opacity={0} scale={0.85}>
        {edges.map((edge, i) => (
          <>
            <Line
              ref={edgeGlows[i]}
              key={`edge-glow-${i}`}
              points={() => {
                const p1 = project3D(vertices[edge[0]]);
                const p2 = project3D(vertices[edge[1]]);
                return [[p1.x, p1.y], [p2.x, p2.y]];
              }}
              stroke={i < 4 ? colors.primary : i < 8 ? colors.secondary : colors.accent}
              lineWidth={6}
              opacity={0}
              filters={[blur(8)]}
            />
            <Line
              ref={edgeLines[i]}
              key={`edge-${i}`}
              points={() => {
                const p1 = project3D(vertices[edge[0]]);
                const p2 = project3D(vertices[edge[1]]);
                return [[p1.x, p1.y], [p2.x, p2.y]];
              }}
              stroke={i < 4 ? colors.primary : i < 8 ? colors.secondary : colors.accent}
              lineWidth={1.5}
              opacity={0}
            />
          </>
        ))}

        {vertices.map((_, i) => (
          <>
            <Circle
              ref={vertexGlows[i]}
              key={`vertex-glow-${i}`}
              size={20}
              x={() => project3D(vertices[i]).x}
              y={() => project3D(vertices[i]).y}
              fill={i % 2 === 0 ? colors.primary : colors.secondary}
              opacity={0}
              filters={[blur(12)]}
            />
            <Circle
              ref={vertexParticles[i]}
              key={`vertex-${i}`}
              size={6}
              x={() => project3D(vertices[i]).x}
              y={() => project3D(vertices[i]).y}
              fill={i % 2 === 0 ? colors.primary : colors.secondary}
              opacity={0}
            />
          </>
        ))}

        {faces.map((face, i) => (
          <Node
            ref={faceContainers[i]}
            key={`face-container-${i}`}
            x={() => getFaceCenter(i).x}
            y={() => getFaceCenter(i).y}
            scale={() => getFaceCenter(i).scale}
            opacity={() => getFaceOpacity(i)}
            zIndex={() => -getFaceCenter(i).z}
          >
            <Rect
              ref={faceGlowsOuter[i]}
              width={CUBE_SIZE + 20}
              height={CUBE_SIZE + 20}
              fill={face.color}
              opacity={0.15}
              radius={20}
              filters={[blur(50)]}
            />
            <Rect
              ref={faceGlows[i]}
              width={CUBE_SIZE + 8}
              height={CUBE_SIZE + 8}
              fill={face.color}
              opacity={0.25}
              radius={16}
              filters={[blur(30)]}
            />
            <Rect
              ref={faceRects[i]}
              width={CUBE_SIZE}
              height={CUBE_SIZE}
              fill={colors.background}
              stroke={face.color}
              lineWidth={2}
              radius={12}
            />
            {face.text && (
              <Txt
                ref={faceTexts[i]}
                text={face.text}
                fontFamily={'Sharp Grotesk, system-ui, sans-serif'}
                fontSize={22}
                fontWeight={fontWeights.semibold}
                fill={colors.text}
                textAlign="center"
                lineHeight="135%"
              />
            )}
          </Node>
        ))}
      </Node>

      {/* V5: Dots moved closer to cube */}
      <Node ref={dotContainer} y={180}>
        <Circle
          ref={dot1Ring}
          size={24}
          fill={null}
          stroke={colors.primary}
          lineWidth={1}
          opacity={0}
          x={-30}
        />
        <Circle
          ref={dot1Glow}
          size={20}
          fill={colors.primary}
          opacity={0}
          x={-30}
          filters={[blur(12)]}
        />
        <Circle
          ref={dot1}
          size={10}
          fill={colors.primary}
          opacity={0}
          x={-30}
        />

        <Circle
          ref={dot2Ring}
          size={24}
          fill={null}
          stroke={colors.primary}
          lineWidth={1}
          opacity={0}
          x={0}
        />
        <Circle
          ref={dot2Glow}
          size={20}
          fill={colors.primary}
          opacity={0}
          x={0}
          filters={[blur(12)]}
        />
        {/* V5: All inactive dots use same textMuted color */}
        <Circle
          ref={dot2}
          size={10}
          fill={colors.textMuted}
          opacity={0}
          x={0}
        />

        <Circle
          ref={dot3Ring}
          size={24}
          fill={null}
          stroke={colors.primary}
          lineWidth={1}
          opacity={0}
          x={30}
        />
        <Circle
          ref={dot3Glow}
          size={20}
          fill={colors.primary}
          opacity={0}
          x={30}
          filters={[blur(12)]}
        />
        <Circle
          ref={dot3}
          size={10}
          fill={colors.textMuted}
          opacity={0}
          x={30}
        />
      </Node>
    </>
  );

  yield* all(
    vignetteTopLeft().opacity(0.28, timing.smooth),
    vignetteTopRight().opacity(0.28, timing.smooth),
    vignetteBottomLeft().opacity(0.28, timing.smooth),
    vignetteBottomRight().opacity(0.28, timing.smooth),
  );

  yield* all(
    circuitContainer().opacity(1, timing.entrance),
    ...circuitHLines.map((line, i) =>
      delay(i * 0.04, line().width(circuitHLinePositions[i].width, timing.smooth, easeOutCubic))
    ),
    ...circuitVLines.map((line, i) =>
      delay(i * 0.04, line().height(circuitVLinePositions[i].height, timing.smooth, easeOutCubic))
    ),
  );

  yield* all(
    ...circuitNodes.map((node, i) =>
      delay(i * 0.025, node().opacity(0.4, timing.entrance))
    ),
  );

  yield* all(
    isometricGridContainer().opacity(1, timing.smooth),
  );

  yield* all(
    dataStreamContainer().opacity(1, timing.entrance),
    ...dataStreams.map((stream, i) =>
      delay(i * 0.05, all(
        stream().height(dataStreamPositions[i].length, timing.smooth, easeOutCubic),
        dataStreamGlows[i]().height(dataStreamPositions[i].length, timing.smooth, easeOutCubic),
      ))
    ),
  );

  yield* all(
    cubeShadowOuter().opacity(0.18, timing.entrance),
    cubeShadow().opacity(0.28, timing.entrance),
  );

  // V4: Cube appears without pedestal
  yield* all(
    cubeContainer().opacity(1, timing.entrance),
    cubeContainer().scale(1, timing.smooth, easeOutCubic),
    bgGlow().opacity(0.07, timing.entrance),
  );

  yield* all(
    ...edgeLines.map((line, i) =>
      delay(i * 0.03, line().opacity(0.7, timing.entrance))
    ),
    ...edgeGlows.map((glow, i) =>
      delay(i * 0.03, glow().opacity(0.25, timing.entrance))
    ),
  );

  yield* all(
    ...vertexParticles.map((p, i) =>
      delay(i * 0.04, p().opacity(0.9, timing.entrance))
    ),
    ...vertexGlows.map((g, i) =>
      delay(i * 0.04, g().opacity(0.4, timing.entrance))
    ),
  );

  // V5: All dots appear with consistent styling - inactive dots same opacity
  yield* all(
    dot1().opacity(1, timing.fast),
    dot1Glow().opacity(0.5, timing.fast),
    dot1Ring().opacity(0.3, timing.fast),
    dot2().opacity(0.5, timing.fast),
    dot3().opacity(0.5, timing.fast),
  );

  yield* all(
    particleContainer().opacity(1, timing.entrance),
    ...ambientParticles.map((particle, i) =>
      delay(particlePositions[i].delay, particle().opacity(0.5, timing.entrance))
    ),
  );

  yield* all(
    ...ambientParticles.map((particle, i) =>
      particle().y(particlePositions[i].y - 18, timing.smooth, linear)
    ),
  );

  yield* all(
    ...dataStreams.map((stream, i) =>
      delay(i * 0.025, stream().opacity(0.7, timing.fast))
    ),
  );
  yield* all(
    ...dataStreams.map((stream, i) =>
      delay(i * 0.025, stream().opacity(0.4, timing.beat))
    ),
  );

  yield* waitFor(0.4);

  // V5: First rotation - dot activation happens AFTER rotation completes
  yield* all(
    rotationY(90, 1.4, easeInOutCubic),
    bgGlowSecondary().opacity(0.05, timing.smooth),
  );

  // Activate dot 2 after rotation is complete
  yield* all(
    dot1().fill(colors.textMuted, timing.beat),
    dot1Glow().opacity(0, timing.beat),
    dot1Ring().opacity(0, timing.beat),
    dot2().fill(colors.primary, timing.beat),
    dot2Glow().opacity(0.5, timing.beat),
    dot2Ring().opacity(0.3, timing.beat),
  );

  yield* all(
    ...ambientParticles.map((particle, i) =>
      particle().y(particlePositions[i].y - 28, timing.smooth, linear)
    ),
  );

  yield* all(
    ...vertexGlows.map((glow, i) =>
      delay(i * 0.02, glow().opacity(0.6, timing.fast))
    ),
  );
  yield* all(
    ...vertexGlows.map((glow, i) =>
      delay(i * 0.02, glow().opacity(0.35, timing.beat))
    ),
  );

  yield* waitFor(0.4);

  // V5: Second rotation - dot activation happens AFTER rotation completes
  yield* all(
    rotationY(180, 1.4, easeInOutCubic),
    bgGlowTertiary().opacity(0.04, timing.smooth),
  );

  // Activate dot 3 after rotation is complete
  yield* all(
    dot2().fill(colors.textMuted, timing.beat),
    dot2Glow().opacity(0, timing.beat),
    dot2Ring().opacity(0, timing.beat),
    dot3().fill(colors.primary, timing.beat),
    dot3Glow().opacity(0.5, timing.beat),
    dot3Ring().opacity(0.3, timing.beat),
  );

  yield* all(
    ...circuitNodes.map((node, i) =>
      delay(i * 0.015, node().opacity(0.7, timing.fast))
    ),
  );
  yield* all(
    ...circuitNodes.map((node, i) =>
      delay(i * 0.015, node().opacity(0.35, timing.beat))
    ),
  );

  yield* all(
    bgGlow().opacity(0.1, timing.beat),
    bgGlowSecondary().opacity(0.07, timing.beat),
  );

  // V4: Removed pedestal glow pulse

  yield* all(
    ...dataStreams.map((stream, i) =>
      delay(i * 0.02, all(
        stream().opacity(0.8, timing.fast),
        dataStreamGlows[i]().opacity(0.25, timing.fast),
      ))
    ),
  );
  yield* all(
    ...dataStreams.map((stream, i) =>
      delay(i * 0.02, all(
        stream().opacity(0.35, timing.beat),
        dataStreamGlows[i]().opacity(0.12, timing.beat),
      ))
    ),
  );

  yield* all(
    ...ambientParticles.map((particle, i) =>
      all(
        particle().y(particlePositions[i].y - 38, timing.smooth, linear),
        particle().opacity(0.6, timing.beat),
      )
    ),
  );

  yield* all(
    dot3().size(14, timing.fast),
    dot3Glow().opacity(0.7, timing.fast),
    dot3Ring().size(30, timing.fast, easeOutCubic),
  );
  yield* all(
    dot3().size(10, timing.beat),
    dot3Glow().opacity(0.4, timing.beat),
    dot3Ring().size(24, timing.beat, easeInOutCubic),
  );

  yield* all(
    ...edgeGlows.map((glow, i) =>
      delay(i * 0.02, glow().opacity(0.5, timing.fast))
    ),
  );
  yield* all(
    ...edgeGlows.map((glow, i) =>
      delay(i * 0.02, glow().opacity(0.2, timing.beat))
    ),
  );

  yield* all(
    cubeShadow().opacity(0.38, timing.fast),
    cubeShadowOuter().opacity(0.22, timing.fast),
  );
  yield* all(
    cubeShadow().opacity(0.22, timing.beat),
    cubeShadowOuter().opacity(0.14, timing.beat),
  );

  yield* waitFor(0.5);

  // V4: Exit without pedestal elements
  yield* all(
    cubeContainer().opacity(0, timing.exit),
    cubeContainer().scale(0.92, timing.exit),
    cubeShadow().opacity(0, timing.exit),
    cubeShadowOuter().opacity(0, timing.exit),
    dot1().opacity(0, timing.exit),
    dot2().opacity(0, timing.exit),
    dot3().opacity(0, timing.exit),
    dot1Glow().opacity(0, timing.exit),
    dot2Glow().opacity(0, timing.exit),
    dot3Glow().opacity(0, timing.exit),
    dot1Ring().opacity(0, timing.exit),
    dot2Ring().opacity(0, timing.exit),
    dot3Ring().opacity(0, timing.exit),
    particleContainer().opacity(0, timing.exit),
    dataStreamContainer().opacity(0, timing.exit),
    circuitContainer().opacity(0, timing.exit),
    isometricGridContainer().opacity(0, timing.exit),
    bgGlow().opacity(0.03, timing.exit),
    bgGlowSecondary().opacity(0.02, timing.exit),
    bgGlowTertiary().opacity(0, timing.exit),
    vignetteTopLeft().opacity(0.18, timing.exit),
    vignetteTopRight().opacity(0.18, timing.exit),
    vignetteBottomLeft().opacity(0.18, timing.exit),
    vignetteBottomRight().opacity(0.18, timing.exit),
  );
});
