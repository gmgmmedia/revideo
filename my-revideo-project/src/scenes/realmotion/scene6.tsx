import {makeScene2D, Rect, Circle, Line, Node, Path, blur} from '@revideo/2d';
import {
  all,
  chain,
  waitFor,
  createRef,
  createRefArray,
  easeOutBack,
  easeOutCubic,
  easeInOutCubic,
  easeOutElastic,
  easeInOutQuad,
  easeOutQuad,
  linear,
  loop,
  Vector2,
  Color,
} from '@revideo/core';

/**
 * Scene 6: Core Engineer - Level Up + Crown
 * Theme: Andy Gole transformation from community member to core engineer
 * Duration: ~5-6 seconds
 * Visual: Figure leveling up with crown/star effect, achievement celebration
 */

// Real Motion Brand Colors
const COLORS = {
  magenta: '#FF00FF',
  yellow: '#FFFF00',
  purple: '#800080',
  pink: '#E94E87',
  darkNavy: '#0F0E1F',
  neonGreen: '#55FF33',
  cyan: '#00FFFF',
  white: '#FFFFFF',
  gold: '#FFD700',
  orange: '#FF6B00',
};

// Crown path
const CROWN_PATH = 'M-30,10 L-30,-5 L-20,-15 L-10,0 L0,-20 L10,0 L20,-15 L30,-5 L30,10 Z';

// Star path (5-pointed)
const STAR_PATH = 'M0,-20 L5,-8 L18,-8 L8,2 L12,15 L0,8 L-12,15 L-8,2 L-18,-8 L-5,-8 Z';

// Small star
const SMALL_STAR_PATH = 'M0,-10 L2.5,-4 L9,-4 L4,1 L6,7.5 L0,4 L-6,7.5 L-4,1 L-9,-4 L-2.5,-4 Z';

// Person silhouette (simplified)
const PERSON_PATH = 'M0,-25 C-10,-25 -15,-15 -15,-5 C-15,5 -5,10 0,10 C5,10 15,5 15,-5 C15,-15 10,-25 0,-25 M-20,50 L-15,15 L0,20 L15,15 L20,50 L-20,50';

// Level up arrow
const ARROW_UP_PATH = 'M0,-20 L15,5 L8,5 L8,20 L-8,20 L-8,5 L-15,5 Z';

// Badge/shield path
const BADGE_PATH = 'M0,-25 L20,-15 L20,10 L0,25 L-20,10 L-20,-15 Z';

export default makeScene2D('scene6', function* (view) {
  // Background
  const background = createRef<Rect>();

  // Scanline overlay
  const scanlineOverlay = createRef<Rect>();

  // Grid container
  const gridContainer = createRef<Node>();
  const gridLines = createRefArray<Line>();

  // Central figure (person transforming)
  const figureContainer = createRef<Node>();
  const figureGlowOuter = createRef<Circle>();
  const figureGlowInner = createRef<Circle>();
  const figure = createRef<Path>();
  const figureShadow = createRef<Circle>();

  // Crown (appears above figure)
  const crownContainer = createRef<Node>();
  const crownGlow = createRef<Circle>();
  const crown = createRef<Path>();
  const crownSparkles = createRefArray<Circle>();

  // Stars orbiting
  const starContainers = createRefArray<Node>();
  const stars = createRefArray<Path>();
  const starGlows = createRefArray<Circle>();

  // Level up indicators
  const levelUpArrows = createRefArray<Node>();
  const arrowPaths = createRefArray<Path>();
  const arrowGlows = createRefArray<Circle>();

  // Achievement badge
  const badgeContainer = createRef<Node>();
  const badgeGlow = createRef<Circle>();
  const badge = createRef<Path>();
  const badgeInner = createRef<Path>();

  // Celebration particles
  const celebrationParticles = createRefArray<Circle>();

  // Confetti elements
  const confetti = createRefArray<Rect>();

  // Light rays
  const lightRays = createRefArray<Line>();

  // Ripple effects
  const ripples = createRefArray<Circle>();

  // Energy rings
  const energyRings = createRefArray<Circle>();

  // Sparkle bursts
  const sparkles = createRefArray<Circle>();
  const sparkleGlows = createRefArray<Circle>();

  // Progress bar (filling up)
  const progressContainer = createRef<Node>();
  const progressBg = createRef<Rect>();
  const progressFill = createRef<Rect>();
  const progressGlow = createRef<Rect>();

  // Text elements (CORE ENGINEER styled)
  const titleContainer = createRef<Node>();
  const titleBars = createRefArray<Rect>();

  // Floating achievement icons
  const achievementIcons = createRefArray<Node>();
  const achievementCircles = createRefArray<Circle>();
  const achievementGlows = createRefArray<Circle>();

  // Electric/power effects
  const electricArcs = createRefArray<Line>();

  // Aura layers
  const auraLayers = createRefArray<Circle>();

  // Small decorative stars
  const decorativeStars = createRefArray<Path>();
  const decorativeStarGlows = createRefArray<Circle>();

  // Star orbit positions
  const starOrbitPositions = [
    {angle: 0, radius: 150, scale: 1},
    {angle: Math.PI / 3, radius: 150, scale: 0.8},
    {angle: (2 * Math.PI) / 3, radius: 150, scale: 0.9},
    {angle: Math.PI, radius: 150, scale: 1},
    {angle: (4 * Math.PI) / 3, radius: 150, scale: 0.85},
    {angle: (5 * Math.PI) / 3, radius: 150, scale: 0.95},
  ];

  // Level up arrow positions
  const arrowPositions = [
    {x: -180, y: 100, delay: 0.1},
    {x: 180, y: 100, delay: 0.2},
    {x: -120, y: 150, delay: 0.3},
    {x: 120, y: 150, delay: 0.4},
    {x: 0, y: 180, delay: 0.5},
  ];

  // Sparkle positions
  const sparklePositions = [
    {x: -400, y: -300},
    {x: 400, y: -280},
    {x: -450, y: 100},
    {x: 450, y: 80},
    {x: -380, y: 280},
    {x: 380, y: 300},
    {x: -200, y: -350},
    {x: 200, y: -340},
    {x: 0, y: -380},
    {x: -500, y: -150},
    {x: 500, y: -120},
    {x: -480, y: 220},
    {x: 480, y: 200},
    {x: -100, y: 350},
    {x: 100, y: 340},
    {x: -300, y: -200},
    {x: 300, y: -180},
    {x: -350, y: 150},
    {x: 350, y: 130},
    {x: -250, y: 320},
  ];

  // Confetti positions and rotations
  const confettiConfigs = Array.from({length: 40}, (_, i) => ({
    x: -500 + Math.random() * 1000,
    y: -600,
    rotation: Math.random() * 360,
    width: 8 + Math.random() * 12,
    height: 20 + Math.random() * 15,
    color: [COLORS.magenta, COLORS.yellow, COLORS.cyan, COLORS.pink, COLORS.neonGreen, COLORS.gold][i % 6],
    delay: Math.random() * 0.8,
  }));

  // Light ray configurations
  const lightRayConfigs = Array.from({length: 12}, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    return {
      angle,
      length: 400 + Math.random() * 200,
    };
  });

  // Decorative star positions
  const decorativeStarPositions = [
    {x: -320, y: -220, scale: 0.5},
    {x: 320, y: -200, scale: 0.6},
    {x: -280, y: 180, scale: 0.4},
    {x: 280, y: 200, scale: 0.55},
    {x: -420, y: -80, scale: 0.45},
    {x: 420, y: -60, scale: 0.5},
    {x: -380, y: 100, scale: 0.4},
    {x: 380, y: 120, scale: 0.45},
  ];

  // Achievement icon positions
  const achievementPositions = [
    {x: -350, y: -150},
    {x: 350, y: -130},
    {x: -380, y: 80},
    {x: 380, y: 100},
  ];

  // Build scene
  view.add(
    <>
      {/* Dark navy background */}
      <Rect
        ref={background}
        width={1920}
        height={1080}
        fill={COLORS.darkNavy}
      />

      {/* Animated grid */}
      <Node ref={gridContainer} opacity={0}>
        {/* Vertical grid lines */}
        {Array.from({length: 25}, (_, i) => {
          const x = -960 + i * 80;
          return (
            <Line
              ref={gridLines}
              key={`v-${i}`}
              points={[[x, -540], [x, 540]]}
              stroke={COLORS.purple}
              lineWidth={1}
              opacity={0.15}
            />
          );
        })}
        {/* Horizontal grid lines */}
        {Array.from({length: 15}, (_, i) => {
          const y = -540 + i * 80;
          return (
            <Line
              ref={gridLines}
              key={`h-${i}`}
              points={[[-960, y], [960, y]]}
              stroke={COLORS.purple}
              lineWidth={1}
              opacity={0.15}
            />
          );
        })}
      </Node>

      {/* Light rays from center */}
      {lightRayConfigs.map((config, i) => (
        <Line
          ref={lightRays}
          key={`ray-${i}`}
          points={[[0, 0], [0, 0]]}
          stroke={i % 2 === 0 ? COLORS.gold : COLORS.yellow}
          lineWidth={4}
          opacity={0}
          filters={[blur(5)]}
        />
      ))}

      {/* Ripple effects */}
      {Array.from({length: 6}, (_, i) => (
        <Circle
          ref={ripples}
          key={`ripple-${i}`}
          x={0}
          y={50}
          width={0}
          height={0}
          stroke={COLORS.gold}
          lineWidth={3}
          opacity={0}
        />
      ))}

      {/* Energy rings */}
      {Array.from({length: 4}, (_, i) => (
        <Circle
          ref={energyRings}
          key={`energy-${i}`}
          x={0}
          y={0}
          width={100 + i * 50}
          height={100 + i * 50}
          stroke={i % 2 === 0 ? COLORS.magenta : COLORS.yellow}
          lineWidth={2}
          opacity={0}
          lineDash={[10, 5]}
        />
      ))}

      {/* Aura layers */}
      {Array.from({length: 5}, (_, i) => (
        <Circle
          ref={auraLayers}
          key={`aura-${i}`}
          x={0}
          y={20}
          width={150 + i * 60}
          height={150 + i * 60}
          fill={i % 2 === 0 ? COLORS.gold : COLORS.yellow}
          opacity={0}
          filters={[blur(40 + i * 10)]}
        />
      ))}

      {/* Celebration particles */}
      {Array.from({length: 50}, (_, i) => (
        <Circle
          ref={celebrationParticles}
          key={`particle-${i}`}
          x={0}
          y={50}
          width={8}
          height={8}
          fill={[COLORS.magenta, COLORS.yellow, COLORS.cyan, COLORS.pink, COLORS.gold][i % 5]}
          opacity={0}
          filters={[blur(3)]}
        />
      ))}

      {/* Confetti */}
      {confettiConfigs.map((config, i) => (
        <Rect
          ref={confetti}
          key={`confetti-${i}`}
          x={config.x}
          y={config.y}
          width={config.width}
          height={config.height}
          fill={config.color}
          rotation={config.rotation}
          opacity={0}
          radius={2}
        />
      ))}

      {/* Figure shadow */}
      <Circle
        ref={figureShadow}
        x={0}
        y={120}
        width={120}
        height={30}
        fill={'#000000'}
        opacity={0}
        filters={[blur(20)]}
      />

      {/* Central figure container */}
      <Node ref={figureContainer} x={0} y={20} opacity={0} scale={0}>
        <Circle
          ref={figureGlowOuter}
          width={300}
          height={300}
          fill={COLORS.gold}
          opacity={0.15}
          filters={[blur(60)]}
        />
        <Circle
          ref={figureGlowInner}
          width={180}
          height={180}
          fill={COLORS.yellow}
          opacity={0.25}
          filters={[blur(30)]}
        />
        <Path
          ref={figure}
          data={PERSON_PATH}
          fill={COLORS.white}
          stroke={COLORS.magenta}
          lineWidth={3}
          scale={2}
        />
      </Node>

      {/* Level up arrows */}
      {arrowPositions.map((pos, i) => (
        <Node
          ref={levelUpArrows}
          key={`arrow-container-${i}`}
          x={pos.x}
          y={pos.y}
          opacity={0}
          scale={0}
        >
          <Circle
            ref={arrowGlows}
            width={60}
            height={60}
            fill={COLORS.neonGreen}
            opacity={0.4}
            filters={[blur(15)]}
          />
          <Path
            ref={arrowPaths}
            data={ARROW_UP_PATH}
            fill={COLORS.neonGreen}
            stroke={COLORS.white}
            lineWidth={2}
            scale={1.2}
          />
        </Node>
      ))}

      {/* Orbiting stars */}
      {starOrbitPositions.map((pos, i) => {
        const x = Math.cos(pos.angle) * pos.radius;
        const y = Math.sin(pos.angle) * pos.radius * 0.5; // Elliptical orbit
        return (
          <Node
            ref={starContainers}
            key={`star-container-${i}`}
            x={x}
            y={y}
            opacity={0}
            scale={0}
          >
            <Circle
              ref={starGlows}
              width={50}
              height={50}
              fill={COLORS.gold}
              opacity={0.5}
              filters={[blur(15)]}
            />
            <Path
              ref={stars}
              data={STAR_PATH}
              fill={COLORS.gold}
              stroke={COLORS.white}
              lineWidth={2}
              scale={pos.scale}
            />
          </Node>
        );
      })}

      {/* Crown container */}
      <Node ref={crownContainer} x={0} y={-120} opacity={0} scale={0}>
        <Circle
          ref={crownGlow}
          width={150}
          height={150}
          fill={COLORS.gold}
          opacity={0.4}
          filters={[blur(30)]}
        />
        <Path
          ref={crown}
          data={CROWN_PATH}
          fill={COLORS.gold}
          stroke={COLORS.yellow}
          lineWidth={3}
          scale={2}
        />
        {/* Crown sparkles */}
        {Array.from({length: 5}, (_, i) => (
          <Circle
            ref={crownSparkles}
            key={`crown-sparkle-${i}`}
            x={-30 + i * 15}
            y={-15}
            width={10}
            height={10}
            fill={COLORS.white}
            opacity={0}
            filters={[blur(3)]}
          />
        ))}
      </Node>

      {/* Badge container */}
      <Node ref={badgeContainer} x={0} y={150} opacity={0} scale={0}>
        <Circle
          ref={badgeGlow}
          width={120}
          height={120}
          fill={COLORS.magenta}
          opacity={0.3}
          filters={[blur(25)]}
        />
        <Path
          ref={badge}
          data={BADGE_PATH}
          fill={COLORS.magenta}
          stroke={COLORS.white}
          lineWidth={3}
          scale={1.5}
        />
        <Path
          ref={badgeInner}
          data={SMALL_STAR_PATH}
          fill={COLORS.white}
          scale={1.2}
        />
      </Node>

      {/* Progress bar */}
      <Node ref={progressContainer} x={68} y={280} opacity={0}>
        <Rect
          ref={progressBg}
          width={300}
          height={16}
          fill={'#1a1a2e'}
          stroke={COLORS.purple}
          lineWidth={2}
          radius={8}
        />
        <Rect
          ref={progressGlow}
          x={-150}
          width={0}
          height={20}
          fill={COLORS.gold}
          opacity={0.5}
          radius={10}
          filters={[blur(10)]}
        />
        <Rect
          ref={progressFill}
          x={-150}
          width={0}
          height={12}
          fill={COLORS.gold}
          radius={6}
        />
      </Node>

      {/* Achievement icons */}
      {achievementPositions.map((pos, i) => (
        <Node
          ref={achievementIcons}
          key={`achievement-${i}`}
          x={pos.x}
          y={pos.y}
          opacity={0}
          scale={0}
        >
          <Circle
            ref={achievementGlows}
            width={70}
            height={70}
            fill={i % 2 === 0 ? COLORS.cyan : COLORS.pink}
            opacity={0.3}
            filters={[blur(20)]}
          />
          <Circle
            ref={achievementCircles}
            width={50}
            height={50}
            fill={i % 2 === 0 ? COLORS.cyan : COLORS.pink}
            stroke={COLORS.white}
            lineWidth={3}
          />
          <Path
            data={SMALL_STAR_PATH}
            fill={COLORS.white}
            scale={0.8}
          />
        </Node>
      ))}

      {/* Decorative stars */}
      {decorativeStarPositions.map((pos, i) => (
        <Node key={`dec-star-${i}`}>
          <Circle
            ref={decorativeStarGlows}
            x={pos.x}
            y={pos.y}
            width={40}
            height={40}
            fill={COLORS.gold}
            opacity={0}
            filters={[blur(15)]}
          />
          <Path
            ref={decorativeStars}
            x={pos.x}
            y={pos.y}
            data={SMALL_STAR_PATH}
            fill={COLORS.gold}
            stroke={COLORS.white}
            lineWidth={1}
            scale={pos.scale}
            opacity={0}
          />
        </Node>
      ))}

      {/* Electric arcs */}
      {Array.from({length: 8}, (_, i) => (
        <Line
          ref={electricArcs}
          key={`arc-${i}`}
          points={[[0, 0], [0, 0]]}
          stroke={COLORS.cyan}
          lineWidth={2}
          opacity={0}
          lineCap={'round'}
          filters={[blur(3)]}
        />
      ))}

      {/* Sparkles */}
      {sparklePositions.map((pos, i) => (
        <Node key={`sparkle-${i}`}>
          <Circle
            ref={sparkleGlows}
            x={pos.x}
            y={pos.y}
            width={25}
            height={25}
            fill={i % 3 === 0 ? COLORS.gold : i % 3 === 1 ? COLORS.yellow : COLORS.white}
            opacity={0}
            filters={[blur(10)]}
          />
          <Circle
            ref={sparkles}
            x={pos.x}
            y={pos.y}
            width={10}
            height={10}
            fill={COLORS.white}
            opacity={0}
          />
        </Node>
      ))}

      {/* Title bars (stylized text representation) */}
      <Node ref={titleContainer} x={0} y={350} opacity={0}>
        {/* "CORE ENGINEER" represented as bars */}
        {Array.from({length: 12}, (_, i) => (
          <Rect
            ref={titleBars}
            key={`title-${i}`}
            x={-220 + i * 40}
            y={0}
            width={0}
            height={20}
            fill={i % 2 === 0 ? COLORS.gold : COLORS.yellow}
            radius={4}
          />
        ))}
      </Node>

      {/* Scanline overlay */}
      <Rect
        ref={scanlineOverlay}
        width={1920}
        height={1080}
        opacity={0}

      >
        {Array.from({length: 135}, (_, i) => (
          <Rect
            key={`scanline-${i}`}
            y={-540 + i * 8}
            width={1920}
            height={2}
            fill={'#000000'}
            opacity={0.08}
          />
        ))}
      </Rect>
    </>
  );

  // Animation sequence

  // Phase 1: Grid and atmosphere (0.0 - 0.3s)
  yield* all(
    gridContainer().opacity(1, 0.12, easeOutCubic),
    scanlineOverlay().opacity(1, 0.12, easeOutCubic),
  );

  // Phase 2: Figure appears with dramatic entrance (0.3 - 0.8s)
  yield* all(
    figureShadow().opacity(0.3, 0.12, easeOutCubic),
    figureContainer().opacity(1, 0.16, easeOutCubic),
    figureContainer().scale(1, 0.2, easeOutBack),
  );

  // Aura layers fade in
  yield* all(
    ...auraLayers.map((aura, i) =>
      chain(
        waitFor(i * 0.02),
        aura.opacity(0.08 - i * 0.01, 0.12, easeOutCubic),
      )
    ),
  );

  // Phase 3: Progress bar fills up (0.8 - 1.3s)
  yield* progressContainer().opacity(1, 0.08);

  yield* all(
    progressFill().width(300, 0.2, easeInOutCubic),
    progressGlow().width(300, 0.2, easeInOutCubic),
  );

  // Phase 4: Level up arrows shoot up (1.3 - 1.8s)
  yield* all(
    ...levelUpArrows.map((arrow, i) =>
      chain(
        waitFor(arrowPositions[i].delay * 0.4),
        all(
          arrow.opacity(1, 0.08, easeOutCubic),
          arrow.scale(1, 0.12, easeOutBack),
          arrow.y(arrowPositions[i].y - 100, 0.2, easeOutCubic),
        ),
      )
    ),
  );

  // Arrows fade out as they rise
  yield* all(
    ...levelUpArrows.map((arrow, i) =>
      chain(
        waitFor(0.08),
        arrow.opacity(0, 0.12),
      )
    ),
  );

  // Phase 5: Energy rings expand (1.8 - 2.2s)
  yield* all(
    ...energyRings.map((ring, i) =>
      chain(
        waitFor(i * 0.04),
        all(
          ring.opacity(0.6, 0.08),
          ring.width(200 + i * 80, 0.16, easeOutCubic),
          ring.height(200 + i * 80, 0.16, easeOutCubic),
          ring.rotation(30, 0.16, linear),
        ),
      )
    ),
  );

  // Phase 6: Crown descends (2.2 - 2.8s)
  crownContainer().y(-250);
  yield* all(
    crownContainer().opacity(1, 0.12, easeOutCubic),
    crownContainer().scale(1, 0.16, easeOutBack),
    crownContainer().y(-120, 0.24, easeOutCubic),
  );

  // Crown sparkles
  yield* all(
    ...crownSparkles.map((sparkle, i) =>
      chain(
        waitFor(i * 0.032),
        all(
          sparkle.opacity(1, 0.04),
          sparkle.scale(1.3, 0.04, easeOutBack),
        ),
      )
    ),
  );

  // Phase 7: Stars appear and orbit (2.8 - 3.4s)
  yield* all(
    ...starContainers.map((container, i) =>
      chain(
        waitFor(i * 0.04),
        all(
          container.opacity(1, 0.12, easeOutCubic),
          container.scale(1, 0.16, easeOutBack),
        ),
      )
    ),
  );

  // Light rays burst outward
  yield* all(
    ...lightRays.map((ray, i) => {
      const config = lightRayConfigs[i];
      const endX = Math.cos(config.angle) * config.length;
      const endY = Math.sin(config.angle) * config.length;
      return chain(
        waitFor(i * 0.012),
        all(
          ray.opacity(0.5, 0.08),
          ray.points([[0, 0], [endX, endY]], 0.16, easeOutCubic),
        ),
      );
    }),
  );

  // Phase 8: Badge appears (3.4 - 3.8s)
  yield* all(
    badgeContainer().opacity(1, 0.12, easeOutCubic),
    badgeContainer().scale(1, 0.16, easeOutElastic),
  );

  // Phase 9: Achievement icons pop in (3.8 - 4.2s)
  yield* all(
    ...achievementIcons.map((icon, i) =>
      chain(
        waitFor(i * 0.04),
        all(
          icon.opacity(1, 0.08, easeOutCubic),
          icon.scale(1, 0.12, easeOutBack),
        ),
      )
    ),
  );

  // Phase 10: Celebration! (4.2 - 4.8s)
  // Confetti falls
  yield* all(
    ...confetti.map((c, i) =>
      chain(
        waitFor(confettiConfigs[i].delay * 0.4),
        all(
          c.opacity(1, 0.04),
          c.y(600, 1.0, linear),
          c.rotation(confettiConfigs[i].rotation + 720, 1.0, linear),
        ),
      )
    ),
  );

  // Simultaneously: Celebration particles burst outward
  yield* all(
    ...celebrationParticles.map((particle, i) => {
      const angle = (i / 50) * Math.PI * 2;
      const distance = 200 + Math.random() * 300;
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance - 50;
      return chain(
        waitFor(i * 0.008),
        all(
          particle.opacity(0.8, 0.04),
          particle.x(targetX, 0.32, easeOutCubic),
          particle.y(targetY, 0.32, easeOutCubic),
          particle.opacity(0, 0.32),
        ),
      );
    }),
  );

  // Ripples expand from figure
  yield* all(
    ...ripples.map((ripple, i) =>
      chain(
        waitFor(i * 0.048),
        all(
          ripple.opacity(0.6, 0.04),
          ripple.width(400 + i * 100, 0.24, easeOutCubic),
          ripple.height(400 + i * 100, 0.24, easeOutCubic),
          ripple.opacity(0, 0.24),
        ),
      )
    ),
  );

  // Phase 11: Sparkles twinkle (4.8 - 5.2s)
  yield* all(
    ...sparkles.map((sparkle, i) =>
      chain(
        waitFor(i * 0.012),
        all(
          sparkle.opacity(1, 0.04),
          sparkleGlows[i].opacity(0.6, 0.04),
          sparkle.scale(1.3, 0.06, easeOutBack),
        ),
      )
    ),
  );

  // Decorative stars appear
  yield* all(
    ...decorativeStars.map((star, i) =>
      chain(
        waitFor(i * 0.032),
        all(
          star.opacity(1, 0.08),
          decorativeStarGlows[i].opacity(0.5, 0.08),
        ),
      )
    ),
  );

  // Phase 12: Title bars reveal (5.2 - 5.6s)
  yield* titleContainer().opacity(1, 0.08);

  yield* all(
    ...titleBars.map((bar, i) =>
      chain(
        waitFor(i * 0.02),
        bar.width(30, 0.08, easeOutCubic),
      )
    ),
  );

  // Phase 13: Final emphasis (5.6 - 6.0s)
  // Figure glows brighter
  yield* all(
    figureGlowOuter().opacity(0.3, 0.12, easeOutCubic),
    figureGlowOuter().scale(1.2, 0.12, easeOutCubic),
    figureGlowInner().opacity(0.4, 0.12, easeOutCubic),
    figure().stroke(COLORS.gold, 0.12),
  );

  // Crown pulses
  yield* all(
    crown().scale(2.2, 0.08, easeOutCubic),
    crownGlow().opacity(0.6, 0.08, easeOutCubic),
  );

  yield* all(
    crown().scale(2, 0.08, easeOutCubic),
    crownGlow().opacity(0.4, 0.08, easeOutCubic),
  );

  // Stars orbit animation
  yield* all(
    ...starContainers.map((container, i) => {
      const currentAngle = starOrbitPositions[i].angle;
      const newAngle = currentAngle + Math.PI / 6;
      const x = Math.cos(newAngle) * 150;
      const y = Math.sin(newAngle) * 75;
      return all(
        container.x(x, 0.16, easeInOutQuad),
        container.y(y, 0.16, easeInOutQuad),
      );
    }),
  );

  // Electric arcs appear
  yield* all(
    ...electricArcs.map((arc, i) => {
      const angle1 = (i / 8) * Math.PI * 2;
      const angle2 = angle1 + Math.PI / 12;
      const r1 = 100;
      const r2 = 180;
      const x1 = Math.cos(angle1) * r1;
      const y1 = Math.sin(angle1) * r1;
      const x2 = Math.cos(angle2) * r2;
      const y2 = Math.sin(angle2) * r2;
      return chain(
        waitFor(i * 0.016),
        all(
          arc.opacity(0.8, 0.04),
          arc.points([[x1, y1], [x2, y2]], 0.08, easeOutCubic),
        ),
      );
    }),
  );

  // Electric arcs fade
  yield* all(
    ...electricArcs.map(arc => arc.opacity(0, 0.12)),
  );

  // Phase 14: Ambient hold and polish

  // Energy rings continue rotating
  yield* all(
    ...energyRings.map((ring, i) =>
      ring.rotation(ring.rotation() + 60, 0.24, linear)
    ),
  );

  // Stars continue orbiting
  yield* all(
    ...starContainers.map((container, i) => {
      const currentAngle = starOrbitPositions[i].angle + Math.PI / 6;
      const newAngle = currentAngle + Math.PI / 6;
      const x = Math.cos(newAngle) * 150;
      const y = Math.sin(newAngle) * 75;
      return all(
        container.x(x, 0.16, easeInOutQuad),
        container.y(y, 0.16, easeInOutQuad),
      );
    }),
  );

  // Crown sparkles pulse
  yield* all(
    ...crownSparkles.map((sparkle, i) =>
      chain(
        waitFor(i * 0.02),
        all(
          sparkle.opacity(0.5, 0.06),
          sparkle.scale(1, 0.06),
        ),
      )
    ),
  );

  yield* all(
    ...crownSparkles.map((sparkle, i) =>
      chain(
        waitFor(i * 0.02),
        all(
          sparkle.opacity(1, 0.06),
          sparkle.scale(1.3, 0.06, easeOutBack),
        ),
      )
    ),
  );

  // Aura pulses
  yield* all(
    ...auraLayers.map((aura, i) =>
      aura.opacity(0.12 - i * 0.02, 0.12, easeInOutQuad)
    ),
  );

  yield* all(
    ...auraLayers.map((aura, i) =>
      aura.opacity(0.08 - i * 0.01, 0.12, easeInOutQuad)
    ),
  );

  // Badge pulses
  yield* all(
    badgeContainer().scale(1.1, 0.08, easeOutCubic),
    badgeGlow().opacity(0.5, 0.08),
  );

  yield* all(
    badgeContainer().scale(1, 0.08, easeOutCubic),
    badgeGlow().opacity(0.3, 0.08),
  );

  // Achievement icons pulse
  yield* all(
    ...achievementIcons.map((icon, i) =>
      chain(
        waitFor(i * 0.032),
        icon.scale(1.1, 0.06, easeOutCubic),
      )
    ),
  );

  yield* all(
    ...achievementIcons.map((icon, i) =>
      chain(
        waitFor(i * 0.032),
        icon.scale(1, 0.06, easeOutCubic),
      )
    ),
  );

  // Sparkles twinkle
  yield* all(
    ...sparkles.slice(0, 10).map((sparkle, i) =>
      chain(
        waitFor(i * 0.012),
        all(
          sparkle.scale(0.8, 0.04),
          sparkleGlows[i].opacity(0.3, 0.04),
        ),
      )
    ),
  );

  yield* all(
    ...sparkles.slice(0, 10).map((sparkle, i) =>
      chain(
        waitFor(i * 0.012),
        all(
          sparkle.scale(1.4, 0.06, easeOutBack),
          sparkleGlows[i].opacity(0.7, 0.06),
        ),
      )
    ),
  );

  // Light rays fade slightly
  yield* all(
    ...lightRays.map(ray => ray.opacity(0.3, 0.12)),
  );

  yield* all(
    ...lightRays.map(ray => ray.opacity(0.5, 0.12)),
  );

  // Title bars shimmer
  yield* all(
    ...titleBars.map((bar, i) =>
      chain(
        waitFor(i * 0.016),
        bar.opacity(0.7, 0.06),
      )
    ),
  );

  yield* all(
    ...titleBars.map((bar, i) =>
      chain(
        waitFor(i * 0.016),
        bar.opacity(1, 0.06),
      )
    ),
  );

  // Progress bar glow pulse
  yield* all(
    progressGlow().opacity(0.7, 0.08),
    progressFill().fill(COLORS.yellow, 0.08),
  );

  yield* all(
    progressGlow().opacity(0.5, 0.08),
    progressFill().fill(COLORS.gold, 0.08),
  );

  // Decorative stars twinkle
  yield* all(
    ...decorativeStars.map((star, i) =>
      chain(
        waitFor(i * 0.024),
        all(
          star.scale(decorativeStarPositions[i].scale * 1.2, 0.06, easeOutBack),
          decorativeStarGlows[i].opacity(0.7, 0.06),
        ),
      )
    ),
  );

  yield* all(
    ...decorativeStars.map((star, i) =>
      chain(
        waitFor(i * 0.024),
        all(
          star.scale(decorativeStarPositions[i].scale, 0.06),
          decorativeStarGlows[i].opacity(0.5, 0.06),
        ),
      )
    ),
  );

  // Figure final emphasis
  yield* all(
    figure().scale(2.1, 0.08, easeOutCubic),
    figureGlowInner().scale(1.1, 0.08, easeOutCubic),
  );

  yield* all(
    figure().scale(2, 0.08, easeOutCubic),
    figureGlowInner().scale(1, 0.08, easeOutCubic),
  );

  // Second wave of ripples
  yield* all(
    ...ripples.map((ripple, i) => {
      ripple.width(0);
      ripple.height(0);
      ripple.opacity(0);
      return chain(
        waitFor(i * 0.04),
        all(
          ripple.opacity(0.4, 0.04),
          ripple.width(350 + i * 80, 0.2, easeOutCubic),
          ripple.height(350 + i * 80, 0.2, easeOutCubic),
          ripple.opacity(0, 0.2),
        ),
      );
    }),
  );

  // Energy rings expand more
  yield* all(
    ...energyRings.map((ring, i) =>
      all(
        ring.width(ring.width() + 50, 0.16, easeOutCubic),
        ring.height(ring.height() + 50, 0.16, easeOutCubic),
        ring.opacity(0.4, 0.16),
      )
    ),
  );

  // Stars final orbit
  yield* all(
    ...starContainers.map((container, i) => {
      const currentAngle = starOrbitPositions[i].angle + Math.PI / 3;
      const newAngle = currentAngle + Math.PI / 6;
      const x = Math.cos(newAngle) * 150;
      const y = Math.sin(newAngle) * 75;
      return all(
        container.x(x, 0.16, easeInOutQuad),
        container.y(y, 0.16, easeInOutQuad),
        stars[i].rotation(20, 0.16, easeInOutQuad),
      );
    }),
  );

  // Crown floats
  yield* crownContainer().y(-115, 0.12, easeInOutQuad);
  yield* crownContainer().y(-120, 0.12, easeInOutQuad);

  // Grid pulse
  yield* gridContainer().opacity(0.8, 0.08);
  yield* gridContainer().opacity(1, 0.08);

  // Scanline intensify
  yield* scanlineOverlay().opacity(0.8, 0.04);
  yield* scanlineOverlay().opacity(1, 0.04);

  // All glows pulse together
  yield* all(
    figureGlowOuter().opacity(0.35, 0.08),
    figureGlowInner().opacity(0.45, 0.08),
    crownGlow().opacity(0.55, 0.08),
    badgeGlow().opacity(0.45, 0.08),
    ...starGlows.map(glow => glow.opacity(0.65, 0.08)),
    ...achievementGlows.map(glow => glow.opacity(0.45, 0.08)),
  );

  yield* all(
    figureGlowOuter().opacity(0.2, 0.08),
    figureGlowInner().opacity(0.3, 0.08),
    crownGlow().opacity(0.4, 0.08),
    badgeGlow().opacity(0.3, 0.08),
    ...starGlows.map(glow => glow.opacity(0.5, 0.08)),
    ...achievementGlows.map(glow => glow.opacity(0.3, 0.08)),
  );

  // Final sparkle burst
  yield* all(
    ...sparkles.slice(10, 20).map((sparkle, i) =>
      chain(
        waitFor(i * 0.008),
        all(
          sparkle.opacity(1, 0.04),
          sparkle.scale(1.5, 0.06, easeOutBack),
          sparkleGlows[i + 10].opacity(0.8, 0.06),
        ),
      )
    ),
  );

  yield* all(
    ...sparkles.slice(10, 20).map((sparkle, i) =>
      chain(
        waitFor(i * 0.008),
        all(
          sparkle.scale(1, 0.06),
          sparkleGlows[i + 10].opacity(0.5, 0.06),
        ),
      )
    ),
  );

  // Second celebration particle burst
  yield* all(
    ...celebrationParticles.slice(0, 25).map((particle, i) => {
      particle.x(0);
      particle.y(50);
      particle.opacity(0);
      const angle = (i / 25) * Math.PI * 2;
      const distance = 150 + Math.random() * 200;
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance;
      return chain(
        waitFor(i * 0.008),
        all(
          particle.opacity(0.7, 0.04),
          particle.x(targetX, 0.24, easeOutCubic),
          particle.y(targetY, 0.24, easeOutCubic),
          particle.opacity(0, 0.24),
        ),
      );
    }),
  );

  // Electric arcs reappear briefly
  yield* all(
    ...electricArcs.map((arc, i) => {
      const angle1 = (i / 8) * Math.PI * 2 + Math.PI / 16;
      const angle2 = angle1 + Math.PI / 10;
      const r1 = 120;
      const r2 = 200;
      const x1 = Math.cos(angle1) * r1;
      const y1 = Math.sin(angle1) * r1;
      const x2 = Math.cos(angle2) * r2;
      const y2 = Math.sin(angle2) * r2;
      return chain(
        waitFor(i * 0.012),
        all(
          arc.opacity(0.6, 0.04),
          arc.points([[x1, y1], [x2, y2]], 0.06, easeOutCubic),
        ),
      );
    }),
  );

  yield* all(
    ...electricArcs.map(arc => arc.opacity(0, 0.08)),
  );

  // Light rays final pulse
  yield* all(
    ...lightRays.map((ray, i) =>
      chain(
        waitFor(i * 0.008),
        ray.opacity(0.6, 0.06),
      )
    ),
  );

  yield* all(
    ...lightRays.map((ray, i) =>
      chain(
        waitFor(i * 0.008),
        ray.opacity(0.4, 0.06),
      )
    ),
  );

  // Badge inner star pulse
  yield* all(
    badgeInner().scale(1.3, 0.06, easeOutBack),
    badgeInner().fill(COLORS.yellow, 0.06),
  );

  yield* all(
    badgeInner().scale(1.2, 0.06),
    badgeInner().fill(COLORS.white, 0.06),
  );

  // Crown final glitter
  yield* all(
    ...crownSparkles.map((sparkle, i) =>
      chain(
        waitFor(i * 0.012),
        all(
          sparkle.scale(1.5, 0.04, easeOutBack),
        ),
      )
    ),
  );

  yield* all(
    ...crownSparkles.map((sparkle, i) =>
      chain(
        waitFor(i * 0.012),
        all(
          sparkle.scale(1.3, 0.04),
        ),
      )
    ),
  );

  // Energy rings fade to ambient
  yield* all(
    ...energyRings.map((ring, i) =>
      ring.opacity(0.3, 0.12)
    ),
  );

  // Title bars final emphasis
  yield* all(
    ...titleBars.map((bar, i) =>
      chain(
        waitFor(i * 0.012),
        bar.scale(1.1, 0.04, easeOutCubic),
      )
    ),
  );

  yield* all(
    ...titleBars.map((bar, i) =>
      chain(
        waitFor(i * 0.012),
        bar.scale(1, 0.04),
      )
    ),
  );

  // Very final ambient hold
  yield* all(
    figureContainer().scale(1.02, 0.12, easeInOutQuad),
    crownContainer().scale(1.02, 0.12, easeInOutQuad),
    badgeContainer().scale(1.02, 0.12, easeInOutQuad),
  );

  yield* all(
    figureContainer().scale(1, 0.12, easeInOutQuad),
    crownContainer().scale(1, 0.12, easeInOutQuad),
    badgeContainer().scale(1, 0.12, easeInOutQuad),
  );

  // Achievement icons gentle bounce
  yield* all(
    ...achievementIcons.map((icon, i) =>
      chain(
        waitFor(i * 0.02),
        icon.y(achievementPositions[i].y - 5, 0.08, easeInOutQuad),
      )
    ),
  );

  yield* all(
    ...achievementIcons.map((icon, i) =>
      chain(
        waitFor(i * 0.02),
        icon.y(achievementPositions[i].y, 0.08, easeInOutQuad),
      )
    ),
  );

  // Decorative stars final twinkle
  yield* all(
    ...decorativeStars.map((star, i) =>
      star.opacity(0.7, 0.08)
    ),
  );

  yield* all(
    ...decorativeStars.map((star, i) =>
      star.opacity(1, 0.08)
    ),
  );

  // Final hold
  yield* waitFor(0.08);

  // End with all elements stable and glowing
  yield* all(
    figureGlowOuter().opacity(0.25, 0.08),
    crownGlow().opacity(0.45, 0.08),
    ...starGlows.map(glow => glow.opacity(0.55, 0.08)),
  );
});
