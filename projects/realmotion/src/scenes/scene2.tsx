/**
 * Real Motion Scene 2: Movement Labs
 * VO: "movement curious vote coming in"
 * Duration: ~10 seconds (300 frames @ 30fps)
 *
 * Theme: Movement Labs brand reveal with community interest
 * Visual: Central M logo with particles flowing toward it
 */

import {makeScene2D, Rect, Node, Line, Circle, Path, blur} from '@revideo/2d';
import {
  all,
  chain,
  waitFor,
  createRef,
  createRefArray,
  easeOutCubic,
  easeInOutCubic,
  easeOutBack,
  easeInOutQuad,
  easeOutQuad,
  linear,
} from '@revideo/core';

import {colors, icons, layout} from '../lib/brand';

// Movement Labs Logo Path (M-shaped brand mark)
const MOVEMENT_LOGO_PATH = 'm105.7075,46.0442c-1.0695,0-2.1234-.164-3.1302-.4854l-.1264-.0377c-.1124-.0323-.2319-.0699-.3652-.1157-.299-.1022-.6241-.2514-.9893-.4504l-.1194-.0646c-1.3328-.6952-2.5183-1.6957-3.4309-2.8951-2.7859-3.6588-2.778-8.7605.0218-12.4073,1.1375-1.4831,2.6525-2.6275,4.3819-3.3106l.1708-.0712c.5213-.2205.9004-.3402,1.1977-.3779l.3277-.0538c.6755-.1372,1.3685-.2071,2.0632-.2071,4.177,0,7.6655-1.2895,10.087-3.7274,2.2411-2.2563,3.4091-5.3625,3.3795-8.9837V0h-25.5146v8.4741c0,1.6499-.0044,3.2998,0,4.9498.0061,3.3361-1.8872,7.8904-5.3582,9.0496-2.2098.7382-4.9513-.3644-7.2985-.0941-1.9286.2219-3.7993.8807-5.4399,1.9175-3.2974,2.0829-5.5247,5.6261-5.9527,9.5028-.1655,1.4953-.0727,2.61-.004,3.4249.0753.9077.0982,1.1807-.2194,2.0856-.6245,1.7669-1.9596,3.4088-3.7577,4.6216-1.798,1.2129-3.8652,1.8798-5.8221,1.8798l-.1911-.0027-.1912.0027c-1.9569,0-4.0255-.6669-5.8221-1.8798-1.7981-1.2115-3.1331-2.8547-3.7577-4.6216-.3175-.905-.296-1.1793-.2193-2.0856.0673-.8135.1601-1.9282-.0041-3.4249-.428-3.8767-2.6554-7.4185-5.9527-9.5028-1.6406-1.0368-3.5113-1.6956-5.4399-1.9175-2.3471-.2703-5.0886.8324-7.2986.0941-3.471-1.1591-5.3646-5.7135-5.3578-9.0496.004-1.65,0-3.2999,0-4.9498V0H.0552v12.8564c-.0296,3.6212,1.1399,6.7274,3.3794,8.9837,2.4212,2.4393,5.9097,3.7274,10.0872,3.7274.6945,0,1.3875.0699,2.0632.2071l.3271.0538c.2974.039.6769.1586,1.1978.3779l.1708.0712c1.7295.6831,3.2449,1.8275,4.3821,3.3106,2.7994,3.6467,2.8075,8.7484.0215,12.4073-.9125,1.1994-2.0995,2.1999-3.4305,2.8951l-.1199.0646c-.3647.199-.6904.3469-.9892.4504-.1333.0458-.253.0834-.3647.1157l-.1266.0377c-1.0067.3227-2.0605.4854-3.1304.4854-8.0886,0-13.5232,4.9699-13.5232,12.3669,0,5.774,2.6352,8.77,4.8451,10.2666,2.6971,1.8261,5.95,2.3437,9.0643,2.6288l.2154.0242c.8263.1076,1.5235.277,2.3243.5648l.3862.1465.0659.0242c2.0969.7154,3.8532,2.177,4.9474,4.116.6178,1.0959,1.0457,2.5307,1.2046,4.0381.0619.593.1036,1.1672.144,1.7346.0309.4317.0659.9157.1131,1.4024v11.1367h25.3344v-13.1133c0-3.3698-1.284-6.6386-3.6689-9.0214-.0861-.086-.1722-.1694-.2611-.2528-.1898-.1775-.3647-.3281-.5047-.4478l-.0861-.074c-2.7456-2.3773-6.3161-2.4405-8.9244-2.4876h-.0282c-.4361-.0081-.8493-.0161-1.214-.0336l-.3916-.0605-.8385-.1869-.79-.2435-.852-.3388c-.8922-.4047-1.7254-.9319-2.4642-1.5599l-.1655-.1425c-2.3607-2.1084-3.5316-4.7077-3.58-7.9443.0067-2.3128.7469-4.5046,2.1413-6.3401,1.3594-1.7884,3.2852-3.1196,5.4225-3.749,2.1641-.6361,6.2004-.6522,8.1465-.0309,3.5463,1.1309,6.0631,4.3823,6.2609,8.0909.0161.3066.004.628-.0094,1.0044-.0404,1.0878-.0956,2.5778.5329,4.4616,1.7765,5.2388,6.6902,8.774,12.2432,8.7982,5.5531-.0255,10.4668-3.5594,12.2433-8.7982.6285-1.8825.5733-3.3724.5329-4.4616-.0134-.3765-.0255-.6992-.0094-1.0044.1979-3.7086,2.7132-6.96,6.2609-8.0909,1.9474-.6212,5.9823-.6051,8.1468.0309,2.1365.6293,4.0637,1.9619,5.4218,3.749,1.3947,1.8355,2.1347,4.0273,2.1417,6.3401-.0488,3.2366-1.2195,5.8345-3.5799,7.9443l-.1656.1425c-.7392.6266-1.5716,1.1551-2.4642,1.5599l-.8525.3388-.7897.2435-.8383.1869-.3916.0605c-.3634.0175-.778.0255-1.214.0336h-.0283c-2.6069.0471-6.1788.1103-8.9243,2.4876l-.0861.074c-.14.1197-.3149.2703-.5047.4478-.0888.0833-.1749.1681-.2612.2528-2.3848,2.3828-3.6688,5.6516-3.6688,9.0214v13.1133h25.3348v-11.1367c.0471-.4854.0819-.9708.1125-1.4024.041-.5661.0819-1.1403.1438-1.7346.1595-1.5074.5875-2.9422,1.2047-4.0381,1.0931-1.939,2.8504-3.4007,4.9476-4.116l.0662-.0242.3862-.1465c.8002-.2864,1.4975-.4559,2.3239-.5648l.2153-.0242c3.1145-.285,6.3675-.8027,9.0645-2.6288,2.2097-1.4967,4.8456-4.4926,4.8456-10.2666,0-7.397-5.4349-12.3669-13.5239-12.3669h.0044Z';

export default makeScene2D('scene2-movement-labs', function* (view) {
  // ============================================
  // SCENE SETUP
  // ============================================
  view.fill(colors.background);

  // ============================================
  // CONSTANTS
  // ============================================
  const STREAM_PARTICLE_COUNT = 40;
  const VOTE_COUNT = 12;
  const PEOPLE_COUNT = 14;
  const ENERGY_RING_COUNT = 6;
  const SPARKLE_COUNT = 24;
  const ORBIT_COUNT = 16;
  const RADIAL_LINE_COUNT = 12;
  const GRID_H = 14;
  const GRID_V = 20;

  // ============================================
  // REFS - Background Glows
  // ============================================
  const bgGlowMagenta1 = createRef<Circle>();
  const bgGlowMagenta2 = createRef<Circle>();
  const bgGlowYellow1 = createRef<Circle>();
  const bgGlowYellow2 = createRef<Circle>();
  const bgGlowPink1 = createRef<Circle>();
  const bgGlowPurple1 = createRef<Circle>();

  // ============================================
  // REFS - Scanlines & Grid
  // ============================================
  const scanlineContainer = createRef<Node>();
  const gridContainer = createRef<Node>();
  const gridLinesH = createRefArray<Line>();
  const gridLinesV = createRefArray<Line>();

  // ============================================
  // REFS - Central Logo
  // ============================================
  const logoContainer = createRef<Node>();
  const logo = createRef<Path>();
  const logoGlow = createRef<Path>();
  const logoSphereOuter = createRef<Circle>();
  const logoSphereMid = createRef<Circle>();
  const logoSphereInner = createRef<Circle>();

  // ============================================
  // REFS - Energy Rings
  // ============================================
  const energyRings = createRefArray<Circle>();
  const pulseRings = createRefArray<Circle>();

  // ============================================
  // REFS - Stream Particles
  // ============================================
  const streamContainer = createRef<Node>();
  const streamParticles = createRefArray<Circle>();
  const streamGlows = createRefArray<Circle>();

  // ============================================
  // REFS - Vote Indicators
  // ============================================
  const voteContainer = createRef<Node>();
  const votes = createRefArray<Path>();
  const voteGlows = createRefArray<Circle>();

  // ============================================
  // REFS - People Icons
  // ============================================
  const peopleContainer = createRef<Node>();
  const people = createRefArray<Path>();
  const peopleGlows = createRefArray<Circle>();
  const peopleSpheres = createRefArray<Circle>();

  // ============================================
  // REFS - Radial Lines
  // ============================================
  const radialContainer = createRef<Node>();
  const radialLines = createRefArray<Line>();
  const radialGlows = createRefArray<Line>();

  // ============================================
  // REFS - Orbit Particles
  // ============================================
  const orbitContainer = createRef<Node>();
  const orbitParticles = createRefArray<Circle>();
  const orbitGlows = createRefArray<Circle>();

  // ============================================
  // REFS - Sparkles
  // ============================================
  const sparkleContainer = createRef<Node>();
  const sparkles = createRefArray<Circle>();
  const sparkleGlows = createRefArray<Circle>();

  // ============================================
  // REFS - Hexagon Pattern
  // ============================================
  const hexContainer = createRef<Node>();
  const hexagons = createRefArray<Path>();
  const hexagonsGlow = createRefArray<Path>();

  // ============================================
  // REFS - Diamond Accents
  // ============================================
  const diamondContainer = createRef<Node>();
  const diamonds = createRefArray<Path>();
  const diamondsGlow = createRefArray<Circle>();

  // ============================================
  // REFS - Floating Particles
  // ============================================
  const floatingContainer = createRef<Node>();
  const floatingParticles = createRefArray<Circle>();
  const floatingGlows = createRefArray<Circle>();
  const floatingTrails = createRefArray<Circle>();

  // ============================================
  // REFS - Corner Brackets
  // ============================================
  const cornerBracketContainer = createRef<Node>();
  const cornerBrackets = createRefArray<Line>();
  const cornerBracketsGlow = createRefArray<Line>();

  // ============================================
  // REFS - Wave Rings
  // ============================================
  const waveRingContainer = createRef<Node>();
  const waveRings = createRefArray<Circle>();
  const waveRingsInner = createRefArray<Circle>();

  // ============================================
  // REFS - Data Lines
  // ============================================
  const dataLineContainer = createRef<Node>();
  const dataLines = createRefArray<Line>();
  const dataLinesGlow = createRefArray<Line>();
  const dataLineDots = createRefArray<Circle>();

  // ============================================
  // REFS - Accent Stars
  // ============================================
  const accentStarContainer = createRef<Node>();
  const accentStars = createRefArray<Path>();
  const accentStarsGlow = createRefArray<Path>();

  // ============================================
  // REFS - Progress Bars
  // ============================================
  const progressBarContainer = createRef<Node>();
  const progressBars = createRefArray<Rect>();
  const progressBarBgs = createRefArray<Rect>();
  const progressBarGlows = createRefArray<Rect>();

  // ============================================
  // REFS - Outer Ring Dots
  // ============================================
  const outerDotContainer = createRef<Node>();
  const outerDots = createRefArray<Circle>();
  const outerDotsGlow = createRefArray<Circle>();

  // ============================================
  // REFS - Trailing Particles
  // ============================================
  const trailParticleContainer = createRef<Node>();
  const trailParticles = createRefArray<Circle>();
  const trailGlows = createRefArray<Circle>();

  // ============================================
  // ADDITIONAL CONSTANTS
  // ============================================
  const HEX_COUNT = 14;
  const DIAMOND_COUNT = 10;
  const FLOATING_COUNT = 28;
  const WAVE_RING_COUNT = 5;
  const DATA_LINE_COUNT = 8;
  const ACCENT_STAR_COUNT = 16;
  const PROGRESS_BAR_COUNT = 6;
  const OUTER_DOT_COUNT = 20;
  const TRAIL_PARTICLE_COUNT = 18;

  // ============================================
  // POSITION CALCULATIONS
  // ============================================

  // Stream particles (flowing toward center from edges)
  const streamPos = Array.from({length: STREAM_PARTICLE_COUNT}, (_, i) => {
    const angle = (i / STREAM_PARTICLE_COUNT) * Math.PI * 2;
    const startRadius = 550 + Math.random() * 150;
    return {
      startX: Math.cos(angle) * startRadius,
      startY: Math.sin(angle) * startRadius * 0.6,
      angle,
      size: 5 + Math.random() * 6,
      delay: i * 0.02,
    };
  });

  // Vote indicator positions (arc above logo)
  const votePos = Array.from({length: VOTE_COUNT}, (_, i) => {
    const angle = Math.PI + (i / (VOTE_COUNT - 1)) * Math.PI;
    const radius = 280;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.5 - 80,
      scale: 1.8 + (i % 3) * 0.3,
    };
  });

  // People positions (arc below logo)
  const peoplePos = Array.from({length: PEOPLE_COUNT}, (_, i) => {
    const angle = (i / (PEOPLE_COUNT - 1)) * Math.PI;
    const radius = 320;
    return {
      x: Math.cos(angle) * radius - radius / 2 + (i * radius) / (PEOPLE_COUNT - 1),
      y: 220 + Math.abs(i - (PEOPLE_COUNT - 1) / 2) * 8,
      scale: 2.2 + (i % 2) * 0.3,
    };
  });

  // Radial lines from center
  const radialPos = Array.from({length: RADIAL_LINE_COUNT}, (_, i) => {
    const angle = (i / RADIAL_LINE_COUNT) * Math.PI * 2;
    return {angle, length: 350 + (i % 3) * 50};
  });

  // Orbit particles
  const orbitPos = Array.from({length: ORBIT_COUNT}, (_, i) => {
    const angle = (i / ORBIT_COUNT) * Math.PI * 2;
    const radius = 200 + (i % 2) * 40;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.55,
      angle,
      radius,
      size: 6 + (i % 3) * 3,
    };
  });

  // Sparkles
  const sparklePos = Array.from({length: SPARKLE_COUNT}, (_, i) => {
    const angle = (i / SPARKLE_COUNT) * Math.PI * 2;
    const radius = 350 + (i % 5) * 60;
    return {
      x: Math.cos(angle) * radius + Math.sin(i * 2) * 50,
      y: Math.sin(angle) * radius * 0.55 + Math.cos(i * 2) * 35,
    };
  });

  // Hexagon positions
  const hexPath = 'M 0 -12 L 10.39 -6 L 10.39 6 L 0 12 L -10.39 6 L -10.39 -6 Z';
  const hexPos = Array.from({length: HEX_COUNT}, (_, i) => {
    const angle = (i / HEX_COUNT) * Math.PI * 2 + Math.PI / 8;
    const radius = 380 + (i % 4) * 70;
    return {
      x: Math.cos(angle) * radius + Math.sin(i * 1.7) * 40,
      y: Math.sin(angle) * radius * 0.52 + Math.cos(i * 1.7) * 30,
      scale: 0.8 + (i % 3) * 0.25,
    };
  });

  // Diamond positions
  const diamondPath = 'M 0 -10 L 8 0 L 0 10 L -8 0 Z';
  const diamondPos = Array.from({length: DIAMOND_COUNT}, (_, i) => {
    const angle = (i / DIAMOND_COUNT) * Math.PI * 2 + Math.PI / 5;
    const radius = 420 + (i % 3) * 55;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.5,
      scale: 1.0 + (i % 2) * 0.3,
    };
  });

  // Floating particles positions
  const floatingPos = Array.from({length: FLOATING_COUNT}, (_, i) => {
    const angle = (i / FLOATING_COUNT) * Math.PI * 2;
    const radius = 300 + (i % 6) * 60;
    return {
      x: Math.cos(angle) * radius + Math.sin(i * 2.2) * 50,
      y: Math.sin(angle) * radius * 0.5 + Math.cos(i * 2.2) * 35,
      size: 4 + (i % 4) * 2,
    };
  });

  // Corner bracket positions
  const cornerBracketPos = [
    {x: -820, y: -420, rotation: 0},
    {x: 820, y: -420, rotation: 90},
    {x: 820, y: 420, rotation: 180},
    {x: -820, y: 420, rotation: 270},
  ];

  // Wave ring positions (concentric from center)
  const waveRingPos = Array.from({length: WAVE_RING_COUNT}, (_, i) => ({
    size: 100 + i * 45,
    delay: i * 0.05,
  }));

  // Data line positions
  const dataLinePos = Array.from({length: DATA_LINE_COUNT}, (_, i) => {
    const baseY = -320 + i * 92;
    const startX = -850;
    const endX = -650 + (i % 3) * 100;
    return {startX, endX, y: baseY, side: i % 2 === 0 ? 'left' : 'right'};
  });

  // Accent star positions
  const accentStarPos = Array.from({length: ACCENT_STAR_COUNT}, (_, i) => {
    const angle = (i / ACCENT_STAR_COUNT) * Math.PI * 2;
    const radius = 440 + (i % 5) * 50;
    return {
      x: Math.cos(angle) * radius + Math.sin(i * 2.5) * 55,
      y: Math.sin(angle) * radius * 0.48 + Math.cos(i * 2.5) * 40,
      scale: 0.7 + (i % 3) * 0.2,
    };
  });

  // Progress bar positions
  const progressBarPos = Array.from({length: PROGRESS_BAR_COUNT}, (_, i) => ({
    x: 650,
    y: -250 + i * 100,
    width: 120 + (i % 3) * 30,
  }));

  // Outer dot positions (ring around everything)
  const outerDotPos = Array.from({length: OUTER_DOT_COUNT}, (_, i) => {
    const angle = (i / OUTER_DOT_COUNT) * Math.PI * 2;
    const radius = 520;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.5,
      size: 5 + (i % 3) * 2,
    };
  });

  // Trail particle positions
  const trailParticlePos = Array.from({length: TRAIL_PARTICLE_COUNT}, (_, i) => {
    const angle = (i / TRAIL_PARTICLE_COUNT) * Math.PI * 2 + Math.PI / 9;
    const radius = 280 + (i % 4) * 50;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.55,
      size: 3 + (i % 4) * 2,
    };
  });

  // ============================================
  // BUILD SCENE
  // ============================================
  view.add(
    <>
      {/* Background Glows */}
      <Circle ref={bgGlowMagenta1} size={1100} fill={colors.magenta} opacity={0} x={-300} y={-200} filters={[blur(400)]} />
      <Circle ref={bgGlowMagenta2} size={700} fill={colors.magenta} opacity={0} x={350} y={250} filters={[blur(300)]} />
      <Circle ref={bgGlowYellow1} size={800} fill={colors.yellow} opacity={0} x={300} y={-180} filters={[blur(350)]} />
      <Circle ref={bgGlowYellow2} size={550} fill={colors.yellow} opacity={0} x={-250} y={200} filters={[blur(250)]} />
      <Circle ref={bgGlowPink1} size={600} fill={colors.pink} opacity={0} x={0} y={0} filters={[blur(280)]} />
      <Circle ref={bgGlowPurple1} size={900} fill={colors.purple} opacity={0} x={0} y={300} filters={[blur(380)]} />

      {/* Scanlines */}
      <Node ref={scanlineContainer} opacity={0}>
        {Array.from({length: 135}, (_, i) => (
          <Rect key={`scan-${i}`} width={layout.width + 200} height={2} fill="#000000" opacity={0.06} y={-540 + i * 8} />
        ))}
      </Node>

      {/* Grid */}
      <Node ref={gridContainer} opacity={0}>
        {Array.from({length: GRID_H}, (_, i) => (
          <Line ref={gridLinesH} key={`gh-${i}`} points={[[-960, -400 + i * 60], [960, -400 + i * 60]]} stroke={colors.yellow} lineWidth={1} opacity={0} end={0} />
        ))}
        {Array.from({length: GRID_V}, (_, i) => (
          <Line ref={gridLinesV} key={`gv-${i}`} points={[[-900 + i * 95, -540], [-900 + i * 95, 540]]} stroke={colors.yellow} lineWidth={1} opacity={0} end={0} />
        ))}
      </Node>

      {/* Radial Lines */}
      <Node ref={radialContainer} opacity={0}>
        {radialPos.map((pos, i) => (
          <Node key={`radial-${i}`}>
            <Line
              ref={radialGlows}
              points={[[0, 0], [Math.cos(pos.angle) * pos.length, Math.sin(pos.angle) * pos.length * 0.55]]}
              stroke={colors.yellow}
              lineWidth={4}
              opacity={0}
              end={0}
              filters={[blur(5)]}
            />
            <Line
              ref={radialLines}
              points={[[0, 0], [Math.cos(pos.angle) * pos.length, Math.sin(pos.angle) * pos.length * 0.55]]}
              stroke={colors.yellow}
              lineWidth={2}
              opacity={0}
              end={0}
            />
          </Node>
        ))}
      </Node>

      {/* Stream Particles */}
      <Node ref={streamContainer} opacity={0}>
        {streamPos.map((pos, i) => (
          <Node key={`stream-${i}`} x={pos.startX} y={pos.startY}>
            <Circle ref={streamGlows} size={pos.size * 3} fill={i % 3 === 0 ? colors.yellow : i % 3 === 1 ? colors.magenta : colors.pink} opacity={0} filters={[blur(10)]} />
            <Circle ref={streamParticles} size={pos.size} fill={i % 3 === 0 ? colors.yellow : i % 3 === 1 ? colors.magenta : colors.pink} opacity={0} />
          </Node>
        ))}
      </Node>

      {/* Energy Rings */}
      {Array.from({length: ENERGY_RING_COUNT}, (_, i) => (
        <Circle
          ref={energyRings}
          key={`energy-${i}`}
          size={120 + i * 50}
          fill={null}
          stroke={i % 2 === 0 ? colors.yellow : colors.magenta}
          lineWidth={2}
          opacity={0}
          lineDash={[12, 6]}
        />
      ))}

      {/* Pulse Rings */}
      {Array.from({length: 4}, (_, i) => (
        <Circle ref={pulseRings} key={`pulse-${i}`} size={100} fill={null} stroke={colors.yellow} lineWidth={3} opacity={0} />
      ))}

      {/* Orbit Particles */}
      <Node ref={orbitContainer} opacity={0}>
        {orbitPos.map((pos, i) => (
          <Node key={`orbit-${i}`} x={pos.x} y={pos.y}>
            <Circle ref={orbitGlows} size={pos.size * 3} fill={i % 2 === 0 ? colors.yellow : colors.magenta} opacity={0} filters={[blur(10)]} />
            <Circle ref={orbitParticles} size={pos.size} fill={i % 2 === 0 ? colors.yellow : colors.magenta} opacity={0} />
          </Node>
        ))}
      </Node>

      {/* People Icons */}
      <Node ref={peopleContainer} opacity={0} x={-30}>
        {peoplePos.map((pos, i) => (
          <Node key={`people-${i}`} x={pos.x} y={pos.y}>
            <Circle ref={peopleSpheres} size={70} fill={colors.magenta} opacity={0} filters={[blur(25)]} />
            <Circle ref={peopleGlows} size={50} fill={colors.magenta} opacity={0} filters={[blur(15)]} />
            <Path ref={people} data={icons.person} fill={colors.white} opacity={0} scale={0} offset={[-0.5, -0.5]} />
          </Node>
        ))}
      </Node>

      {/* Vote Indicators */}
      <Node ref={voteContainer} opacity={0}>
        {votePos.map((pos, i) => (
          <Node key={`vote-${i}`} x={pos.x} y={pos.y}>
            <Circle ref={voteGlows} size={50} fill={colors.neonGreen} opacity={0} filters={[blur(18)]} />
            <Path ref={votes} data={icons.arrowUp} fill={colors.neonGreen} opacity={0} scale={0} offset={[-0.5, -0.5]} />
          </Node>
        ))}
      </Node>

      {/* Central Logo */}
      <Node ref={logoContainer} opacity={0}>
        <Circle ref={logoSphereOuter} size={320} fill={colors.yellow} opacity={0} filters={[blur(80)]} />
        <Circle ref={logoSphereMid} size={220} fill={colors.yellow} opacity={0} filters={[blur(50)]} />
        <Circle ref={logoSphereInner} size={140} fill={colors.white} opacity={0} filters={[blur(25)]} />
        <Path ref={logoGlow} data={MOVEMENT_LOGO_PATH} fill={colors.yellow} opacity={0} scale={0} x={-65} y={-45} filters={[blur(15)]} />
        <Path ref={logo} data={MOVEMENT_LOGO_PATH} fill={colors.yellow} opacity={0} scale={0} x={-65} y={-45} />
      </Node>

      {/* Sparkles */}
      <Node ref={sparkleContainer} opacity={0}>
        {sparklePos.map((pos, i) => (
          <Node key={`sparkle-${i}`} x={pos.x} y={pos.y}>
            <Circle ref={sparkleGlows} size={20} fill={i % 3 === 0 ? colors.yellow : i % 3 === 1 ? colors.magenta : colors.white} opacity={0} filters={[blur(8)]} />
            <Circle ref={sparkles} size={8} fill={colors.white} opacity={0} />
          </Node>
        ))}
      </Node>

      {/* Hexagon Pattern */}
      <Node ref={hexContainer} opacity={0}>
        {hexPos.map((pos, i) => (
          <Node key={`hex-${i}`} x={pos.x} y={pos.y}>
            <Path
              ref={hexagonsGlow}
              data={hexPath}
              fill={null}
              stroke={i % 3 === 0 ? colors.yellow : i % 3 === 1 ? colors.magenta : colors.pink}
              lineWidth={3}
              opacity={0}
              scale={pos.scale}
              filters={[blur(5)]}
            />
            <Path
              ref={hexagons}
              data={hexPath}
              fill={null}
              stroke={i % 3 === 0 ? colors.yellow : i % 3 === 1 ? colors.magenta : colors.pink}
              lineWidth={1.5}
              opacity={0}
              scale={0}
            />
          </Node>
        ))}
      </Node>

      {/* Diamond Accents */}
      <Node ref={diamondContainer} opacity={0}>
        {diamondPos.map((pos, i) => (
          <Node key={`diamond-${i}`} x={pos.x} y={pos.y}>
            <Circle
              ref={diamondsGlow}
              size={30}
              fill={i % 2 === 0 ? colors.yellow : colors.magenta}
              opacity={0}
              filters={[blur(12)]}
            />
            <Path
              ref={diamonds}
              data={diamondPath}
              fill={i % 2 === 0 ? colors.yellow : colors.magenta}
              opacity={0}
              scale={0}
            />
          </Node>
        ))}
      </Node>

      {/* Floating Particles */}
      <Node ref={floatingContainer} opacity={0}>
        {floatingPos.map((pos, i) => (
          <Node key={`float-${i}`} x={pos.x} y={pos.y}>
            <Circle
              ref={floatingTrails}
              size={pos.size * 4}
              fill={i % 4 === 0 ? colors.yellow : i % 4 === 1 ? colors.magenta : i % 4 === 2 ? colors.pink : colors.white}
              opacity={0}
              filters={[blur(12)]}
            />
            <Circle
              ref={floatingGlows}
              size={pos.size * 2.5}
              fill={i % 4 === 0 ? colors.yellow : i % 4 === 1 ? colors.magenta : i % 4 === 2 ? colors.pink : colors.white}
              opacity={0}
              filters={[blur(6)]}
            />
            <Circle
              ref={floatingParticles}
              size={pos.size}
              fill={i % 4 === 0 ? colors.yellow : i % 4 === 1 ? colors.magenta : i % 4 === 2 ? colors.pink : colors.white}
              opacity={0}
            />
          </Node>
        ))}
      </Node>

      {/* Corner Brackets */}
      <Node ref={cornerBracketContainer} opacity={0}>
        {cornerBracketPos.map((pos, i) => (
          <Node key={`corner-${i}`} x={pos.x} y={pos.y} rotation={pos.rotation}>
            <Line
              ref={cornerBracketsGlow}
              points={[[0, 0], [60, 0], [60, 60]]}
              stroke={i % 2 === 0 ? colors.yellow : colors.magenta}
              lineWidth={4}
              opacity={0}
              end={0}
              filters={[blur(5)]}
            />
            <Line
              ref={cornerBrackets}
              points={[[0, 0], [60, 0], [60, 60]]}
              stroke={i % 2 === 0 ? colors.yellow : colors.magenta}
              lineWidth={2}
              opacity={0}
              end={0}
            />
          </Node>
        ))}
      </Node>

      {/* Wave Rings */}
      <Node ref={waveRingContainer} opacity={0}>
        {waveRingPos.map((ring, i) => (
          <Node key={`wave-ring-${i}`}>
            <Circle
              ref={waveRings}
              size={ring.size}
              fill={null}
              stroke={i % 2 === 0 ? colors.yellow : colors.magenta}
              lineWidth={2}
              opacity={0}
              lineDash={[8, 4]}
            />
            <Circle
              ref={waveRingsInner}
              size={ring.size * 0.7}
              fill={null}
              stroke={i % 2 === 0 ? colors.yellow : colors.magenta}
              lineWidth={1}
              opacity={0}
              lineDash={[4, 4]}
            />
          </Node>
        ))}
      </Node>

      {/* Data Lines */}
      <Node ref={dataLineContainer} opacity={0}>
        {dataLinePos.map((pos, i) => (
          <Node key={`data-line-${i}`} x={pos.side === 'right' ? -pos.startX : pos.startX} y={pos.y}>
            <Line
              ref={dataLinesGlow}
              points={[[0, 0], [pos.side === 'right' ? -(pos.endX - pos.startX) : pos.endX - pos.startX, 0]]}
              stroke={i % 3 === 0 ? colors.yellow : i % 3 === 1 ? colors.magenta : colors.neonGreen}
              lineWidth={4}
              opacity={0}
              end={0}
              filters={[blur(4)]}
            />
            <Line
              ref={dataLines}
              points={[[0, 0], [pos.side === 'right' ? -(pos.endX - pos.startX) : pos.endX - pos.startX, 0]]}
              stroke={i % 3 === 0 ? colors.yellow : i % 3 === 1 ? colors.magenta : colors.neonGreen}
              lineWidth={2}
              opacity={0}
              end={0}
            />
            <Circle
              ref={dataLineDots}
              size={8}
              fill={i % 3 === 0 ? colors.yellow : i % 3 === 1 ? colors.magenta : colors.neonGreen}
              opacity={0}
              x={pos.side === 'right' ? -(pos.endX - pos.startX) : pos.endX - pos.startX}
            />
          </Node>
        ))}
      </Node>

      {/* Accent Stars */}
      <Node ref={accentStarContainer} opacity={0}>
        {accentStarPos.map((pos, i) => (
          <Node key={`accent-star-${i}`} x={pos.x} y={pos.y}>
            <Path
              ref={accentStarsGlow}
              data={icons.star}
              fill={i % 3 === 0 ? colors.yellow : i % 3 === 1 ? colors.magenta : colors.pink}
              opacity={0}
              scale={pos.scale}
              offset={[-0.5, -0.5]}
              filters={[blur(6)]}
            />
            <Path
              ref={accentStars}
              data={icons.star}
              fill={i % 3 === 0 ? colors.yellow : i % 3 === 1 ? colors.magenta : colors.pink}
              opacity={0}
              scale={0}
              offset={[-0.5, -0.5]}
            />
          </Node>
        ))}
      </Node>

      {/* Progress Bars */}
      <Node ref={progressBarContainer} opacity={0}>
        {progressBarPos.map((pos, i) => (
          <Node key={`progress-${i}`} x={pos.x} y={pos.y}>
            <Rect
              ref={progressBarBgs}
              width={pos.width}
              height={8}
              fill={colors.background}
              opacity={0}
              stroke={colors.magenta}
              lineWidth={1}
            />
            <Rect
              ref={progressBarGlows}
              width={0}
              height={8}
              fill={i % 2 === 0 ? colors.yellow : colors.neonGreen}
              opacity={0}
              x={-pos.width / 2}
              offset={[-1, 0]}
              filters={[blur(4)]}
            />
            <Rect
              ref={progressBars}
              width={0}
              height={6}
              fill={i % 2 === 0 ? colors.yellow : colors.neonGreen}
              opacity={0}
              x={-pos.width / 2 + 1}
              offset={[-1, 0]}
            />
          </Node>
        ))}
      </Node>

      {/* Outer Ring Dots */}
      <Node ref={outerDotContainer} opacity={0}>
        {outerDotPos.map((pos, i) => (
          <Node key={`outer-dot-${i}`} x={pos.x} y={pos.y}>
            <Circle
              ref={outerDotsGlow}
              size={pos.size * 3}
              fill={i % 3 === 0 ? colors.yellow : i % 3 === 1 ? colors.magenta : colors.pink}
              opacity={0}
              filters={[blur(8)]}
            />
            <Circle
              ref={outerDots}
              size={pos.size}
              fill={i % 3 === 0 ? colors.yellow : i % 3 === 1 ? colors.magenta : colors.pink}
              opacity={0}
            />
          </Node>
        ))}
      </Node>

      {/* Trail Particles */}
      <Node ref={trailParticleContainer} opacity={0}>
        {trailParticlePos.map((pos, i) => (
          <Node key={`trail-${i}`} x={pos.x} y={pos.y}>
            <Circle
              ref={trailGlows}
              size={pos.size * 3.5}
              fill={i % 4 === 0 ? colors.yellow : i % 4 === 1 ? colors.magenta : i % 4 === 2 ? colors.pink : colors.white}
              opacity={0}
              filters={[blur(10)]}
            />
            <Circle
              ref={trailParticles}
              size={pos.size}
              fill={i % 4 === 0 ? colors.yellow : i % 4 === 1 ? colors.magenta : i % 4 === 2 ? colors.pink : colors.white}
              opacity={0}
            />
          </Node>
        ))}
      </Node>
    </>
  );

  // ============================================
  // ANIMATION TIMELINE (~10 seconds)
  // ============================================

  // === PHASE 1: Atmosphere (0.0 - 0.3s) ===
  yield* all(
    bgGlowMagenta1().opacity(0.035, 0.15),
    bgGlowPurple1().opacity(0.025, 0.15),
    scanlineContainer().opacity(1, 0.15),
  );

  // === PHASE 2: Grid draws (0.3 - 0.6s) ===
  yield* all(
    gridContainer().opacity(1, 0.08),
    ...gridLinesH.slice(0, 7).map((line, i) =>
      chain(waitFor(i * 0.015), all(line.opacity(0.06, 0.1), line.end(1, 0.2, easeOutCubic)))
    ),
    ...gridLinesV.slice(0, 10).map((line, i) =>
      chain(waitFor(i * 0.012), all(line.opacity(0.05, 0.1), line.end(1, 0.2, easeOutCubic)))
    ),
  );

  // === PHASE 3: Logo sphere appears (0.6 - 1.0s) ===
  yield* logoContainer().opacity(1, 0.08);
  yield* all(
    logoSphereOuter().opacity(0.15, 0.25),
    logoSphereMid().opacity(0.25, 0.22),
    logoSphereInner().opacity(0.35, 0.2),
  );

  // === PHASE 4: Logo scales in (1.0 - 1.4s) ===
  yield* all(
    logo().scale(1.1, 0.28, easeOutBack),
    logo().opacity(1, 0.18),
    chain(waitFor(0.06), logoGlow().scale(1.1, 0.28, easeOutBack)),
    chain(waitFor(0.06), logoGlow().opacity(0.6, 0.22)),
  );

  // === PHASE 5: First pulse ring (1.4 - 1.6s) ===
  yield* all(
    pulseRings[0].opacity(0.6, 0.08),
    pulseRings[0].size(200, 0.22, easeOutCubic),
  );
  yield* pulseRings[0].opacity(0, 0.12);

  // === PHASE 6: Radial lines draw (1.6 - 2.0s) ===
  yield* radialContainer().opacity(1, 0.05);
  yield* all(
    ...radialLines.map((line, i) =>
      chain(
        waitFor(i * 0.025),
        all(
          line.opacity(0.35, 0.1),
          line.end(1, 0.2, easeOutCubic),
          radialGlows[i].opacity(0.18, 0.15),
          radialGlows[i].end(1, 0.2, easeOutCubic),
        )
      )
    ),
  );

  // === PHASE 7: Energy rings appear (2.0 - 2.4s) ===
  yield* all(
    ...energyRings.map((ring, i) =>
      chain(
        waitFor(i * 0.04),
        all(ring.opacity(0.4, 0.15), ring.rotation(10, 0.3, linear))
      )
    ),
  );

  // === PHASE 8: Background intensifies (2.4 - 2.6s) ===
  yield* all(
    bgGlowYellow1().opacity(0.03, 0.15),
    bgGlowMagenta2().opacity(0.025, 0.15),
    bgGlowPink1().opacity(0.035, 0.15),
  );

  // === PHASE 9: Stream particles flow in (2.6 - 3.2s) ===
  yield* streamContainer().opacity(1, 0.05);
  yield* all(
    ...streamParticles.map((p, i) => {
      const pos = streamPos[i];
      return chain(
        waitFor(pos.delay),
        all(
          p.opacity(0.7, 0.1),
          streamGlows[i].opacity(0.35, 0.1),
          p.x(-pos.startX * 0.85, 0.5, easeInOutCubic),
          p.y(-pos.startY * 0.85, 0.5, easeInOutCubic),
        )
      );
    }),
  );

  // === PHASE 10: Orbit particles appear (3.2 - 3.6s) ===
  yield* orbitContainer().opacity(1, 0.05);
  yield* all(
    ...orbitParticles.map((p, i) =>
      chain(
        waitFor(i * 0.02),
        all(p.opacity(0.7, 0.12), orbitGlows[i].opacity(0.35, 0.15))
      )
    ),
  );

  // === PHASE 11: Second pulse (3.6 - 3.9s) ===
  yield* all(
    logo().scale(1.15, 0.08, easeOutCubic),
    logoGlow().opacity(0.75, 0.06),
    pulseRings[1].opacity(0.5, 0.06),
    pulseRings[1].size(240, 0.2, easeOutCubic),
  );
  yield* all(
    logo().scale(1.1, 0.1, easeInOutCubic),
    logoGlow().opacity(0.6, 0.08),
    pulseRings[1].opacity(0, 0.12),
  );

  // === PHASE 12: People icons appear (3.9 - 4.4s) ===
  yield* peopleContainer().opacity(1, 0.05);
  const peopleOrder = Array.from({length: PEOPLE_COUNT}, (_, i) => Math.abs(i - (PEOPLE_COUNT - 1) / 2)).map((_, i) => i).sort((a, b) => Math.abs(a - (PEOPLE_COUNT - 1) / 2) - Math.abs(b - (PEOPLE_COUNT - 1) / 2));
  yield* all(
    ...peopleOrder.map((idx, i) =>
      chain(
        waitFor(i * 0.025),
        all(
          people[idx].scale(peoplePos[idx].scale, 0.16, easeOutBack),
          people[idx].opacity(1, 0.1),
          chain(waitFor(0.03), peopleGlows[idx].opacity(0.4, 0.12)),
          chain(waitFor(0.05), peopleSpheres[idx].opacity(0.2, 0.15)),
        )
      )
    ),
  );

  // === PHASE 13: Vote indicators pop in (4.4 - 4.9s) ===
  yield* voteContainer().opacity(1, 0.05);
  yield* all(
    ...votes.map((v, i) =>
      chain(
        waitFor(i * 0.035),
        all(
          v.scale(votePos[i].scale, 0.14, easeOutBack),
          v.opacity(1, 0.1),
          voteGlows[i].opacity(0.45, 0.12),
        )
      )
    ),
  );

  // === PHASE 14: Grid completes (4.9 - 5.2s) ===
  yield* all(
    ...gridLinesH.slice(7).map((line, i) =>
      chain(waitFor(i * 0.012), all(line.opacity(0.05, 0.08), line.end(1, 0.18, easeOutCubic)))
    ),
    ...gridLinesV.slice(10).map((line, i) =>
      chain(waitFor(i * 0.012), all(line.opacity(0.04, 0.08), line.end(1, 0.18, easeOutCubic)))
    ),
  );

  // === PHASE 15: Sparkles appear (5.2 - 5.5s) ===
  yield* sparkleContainer().opacity(1, 0.05);
  yield* all(
    ...sparkles.map((s, i) =>
      chain(
        waitFor(i * 0.015),
        all(s.opacity(0.8, 0.12), sparkleGlows[i].opacity(0.5, 0.15))
      )
    ),
  );

  // === PHASE 15.3: Hexagons scale in (5.3 - 5.6s) ===
  yield* hexContainer().opacity(1, 0.05);
  yield* all(
    ...hexagons.map((hex, i) =>
      chain(
        waitFor(i * 0.015),
        all(
          hex.scale(hexPos[i].scale, 0.14, easeOutBack),
          hex.opacity(0.5, 0.1),
          hexagonsGlow[i].opacity(0.28, 0.12),
        )
      )
    ),
  );

  // === PHASE 15.5: Corner brackets draw (5.4 - 5.7s) ===
  yield* cornerBracketContainer().opacity(1, 0.05);
  yield* all(
    ...cornerBrackets.map((bracket, i) =>
      chain(
        waitFor(i * 0.04),
        all(
          bracket.opacity(0.5, 0.1),
          bracket.end(1, 0.2, easeOutCubic),
          cornerBracketsGlow[i].opacity(0.3, 0.12),
          cornerBracketsGlow[i].end(1, 0.2, easeOutCubic),
        )
      )
    ),
  );

  // === PHASE 15.7: Floating particles appear (5.5 - 5.8s) ===
  yield* floatingContainer().opacity(1, 0.05);
  yield* all(
    ...floatingParticles.map((p, i) =>
      chain(
        waitFor(i * 0.008),
        all(
          p.opacity(0.65, 0.1),
          floatingGlows[i].opacity(0.35, 0.12),
          floatingTrails[i].opacity(0.15, 0.15),
        )
      )
    ),
  );

  // === PHASE 15.8: Outer ring dots appear (5.6 - 5.9s) ===
  yield* outerDotContainer().opacity(1, 0.05);
  yield* all(
    ...outerDots.map((dot, i) =>
      chain(
        waitFor(i * 0.012),
        all(
          dot.opacity(0.6, 0.1),
          outerDotsGlow[i].opacity(0.35, 0.12),
        )
      )
    ),
  );

  // === PHASE 15.9: Trail particles appear (5.7 - 6.0s) ===
  yield* trailParticleContainer().opacity(1, 0.05);
  yield* all(
    ...trailParticles.map((p, i) =>
      chain(
        waitFor(i * 0.015),
        all(
          p.opacity(0.55, 0.12),
          trailGlows[i].opacity(0.3, 0.14),
        )
      )
    ),
  );

  // === PHASE 16: Energy rings rotate (5.5 - 6.0s) ===
  yield* all(
    ...energyRings.map((ring, i) => ring.rotation(ring.rotation() + (i % 2 === 0 ? 30 : -30), 0.45, linear)),
  );

  // === PHASE 16.3: Wave rings appear (6.0 - 6.2s) ===
  yield* waveRingContainer().opacity(1, 0.05);
  yield* all(
    ...waveRings.map((ring, i) =>
      chain(
        waitFor(waveRingPos[i].delay),
        all(
          ring.opacity(0.35, 0.12),
          waveRingsInner[i].opacity(0.25, 0.15),
        )
      )
    ),
  );

  // === PHASE 16.5: Diamonds scale in (6.1 - 6.4s) ===
  yield* diamondContainer().opacity(1, 0.05);
  yield* all(
    ...diamonds.map((diamond, i) =>
      chain(
        waitFor(i * 0.025),
        all(
          diamond.scale(diamondPos[i].scale, 0.14, easeOutBack),
          diamond.opacity(0.6, 0.1),
          diamondsGlow[i].opacity(0.35, 0.12),
        )
      )
    ),
  );

  // === PHASE 17: Third logo pulse (6.0 - 6.3s) ===
  yield* all(
    logo().scale(1.2, 0.1, easeOutCubic),
    logoSphereOuter().opacity(0.22, 0.08),
    logoSphereMid().opacity(0.35, 0.08),
    pulseRings[2].opacity(0.5, 0.06),
    pulseRings[2].size(280, 0.22, easeOutCubic),
  );
  yield* all(
    logo().scale(1.1, 0.12, easeInOutCubic),
    logoSphereOuter().opacity(0.15, 0.1),
    logoSphereMid().opacity(0.25, 0.1),
    pulseRings[2].opacity(0, 0.14),
  );

  // === PHASE 17.3: Data lines draw (6.2 - 6.5s) ===
  yield* dataLineContainer().opacity(1, 0.05);
  yield* all(
    ...dataLines.map((line, i) =>
      chain(
        waitFor(i * 0.03),
        all(
          line.opacity(0.45, 0.1),
          line.end(1, 0.2, easeOutCubic),
          dataLinesGlow[i].opacity(0.25, 0.12),
          dataLinesGlow[i].end(1, 0.2, easeOutCubic),
          chain(waitFor(0.15), dataLineDots[i].opacity(0.6, 0.1)),
        )
      )
    ),
  );

  // === PHASE 17.5: Progress bars fill (6.3 - 6.6s) ===
  yield* progressBarContainer().opacity(1, 0.05);
  yield* all(
    ...progressBarBgs.map((bg, i) =>
      chain(
        waitFor(i * 0.03),
        bg.opacity(0.5, 0.1),
      )
    ),
  );
  yield* all(
    ...progressBars.map((bar, i) =>
      chain(
        waitFor(i * 0.025),
        all(
          bar.opacity(0.8, 0.08),
          bar.width(progressBarPos[i].width * 0.7, 0.2, easeOutCubic),
          progressBarGlows[i].opacity(0.4, 0.1),
          progressBarGlows[i].width(progressBarPos[i].width * 0.7, 0.2, easeOutCubic),
        )
      )
    ),
  );

  // === PHASE 17.7: Accent stars appear (6.5 - 6.8s) ===
  yield* accentStarContainer().opacity(1, 0.05);
  yield* all(
    ...accentStars.map((star, i) =>
      chain(
        waitFor(i * 0.012),
        all(
          star.scale(accentStarPos[i].scale, 0.12, easeOutBack),
          star.opacity(0.55, 0.1),
          accentStarsGlow[i].opacity(0.3, 0.12),
        )
      )
    ),
  );

  // === PHASE 18: Orbit particles rotate (6.3 - 6.8s) ===
  yield* all(
    ...orbitParticles.map((p, i) => {
      const pos = orbitPos[i];
      const newAngle = pos.angle + Math.PI / 4;
      const newX = Math.cos(newAngle) * pos.radius;
      const newY = Math.sin(newAngle) * pos.radius * 0.55;
      return all(p.x(newX, 0.4, easeInOutQuad), p.y(newY, 0.4, easeInOutQuad));
    }),
    ...orbitGlows.map((g, i) => {
      const pos = orbitPos[i];
      const newAngle = pos.angle + Math.PI / 4;
      const newX = Math.cos(newAngle) * pos.radius;
      const newY = Math.sin(newAngle) * pos.radius * 0.55;
      return all(g.x(newX, 0.4, easeInOutQuad), g.y(newY, 0.4, easeInOutQuad));
    }),
  );

  // === PHASE 19: People wave up (6.8 - 7.2s) ===
  yield* all(
    ...people.map((p, i) =>
      chain(waitFor(Math.abs(i - (PEOPLE_COUNT - 1) / 2) * 0.015), p.y(p.y() - 12, 0.15, easeOutCubic))
    ),
  );
  yield* all(
    ...people.map((p, i) =>
      chain(waitFor(Math.abs(i - (PEOPLE_COUNT - 1) / 2) * 0.015), p.y(p.y() + 12, 0.18, easeInOutCubic))
    ),
  );

  // === PHASE 20: Votes pulse (7.2 - 7.5s) ===
  yield* all(
    ...votes.map((v, i) =>
      chain(waitFor(i * 0.02), v.scale(votePos[i].scale * 1.2, 0.08, easeOutCubic))
    ),
    ...voteGlows.map(g => g.opacity(0.65, 0.08)),
  );
  yield* all(
    ...votes.map((v, i) => v.scale(votePos[i].scale, 0.1, easeInOutCubic)),
    ...voteGlows.map(g => g.opacity(0.45, 0.1)),
  );

  // === PHASE 21: Sparkle twinkle (7.5 - 7.8s) ===
  yield* all(
    ...sparkles.slice(0, 12).map((s, i) =>
      chain(waitFor(i * 0.012), all(s.scale(1.5, 0.08, easeOutBack), sparkleGlows[i].opacity(0.7, 0.08)))
    ),
  );
  yield* all(
    ...sparkles.slice(0, 12).map((s, i) =>
      chain(waitFor(i * 0.012), all(s.scale(1, 0.1), sparkleGlows[i].opacity(0.5, 0.1)))
    ),
  );

  // === PHASE 21.3: Hexagons pulse (7.6 - 7.9s) ===
  yield* all(
    ...hexagons.map((hex, i) =>
      chain(
        waitFor(i * 0.01),
        chain(
          hex.scale(hexPos[i].scale * 1.2, 0.08, easeOutCubic),
          hex.scale(hexPos[i].scale, 0.1, easeInOutCubic),
        )
      )
    ),
  );

  // === PHASE 21.5: Floating particles drift (7.7 - 8.0s) ===
  yield* all(
    ...floatingParticles.map((p, i) => {
      const angle = (i / FLOATING_COUNT) * Math.PI * 2;
      const driftX = Math.cos(angle) * 12;
      const driftY = Math.sin(angle) * 10;
      return chain(
        waitFor(i * 0.006),
        all(
          p.x(p.x() + driftX, 0.25, easeInOutQuad),
          p.y(p.y() + driftY, 0.25, easeInOutQuad),
          p.opacity(0.75, 0.2),
        )
      );
    }),
  );

  // === PHASE 21.7: Wave rings expand (7.8 - 8.0s) ===
  yield* all(
    ...waveRings.map((ring, i) =>
      chain(
        waitFor(i * 0.02),
        all(
          ring.size(waveRingPos[i].size * 1.15, 0.12, easeOutCubic),
          ring.opacity(0.45, 0.1),
        )
      )
    ),
  );
  yield* all(
    ...waveRings.map((ring, i) =>
      all(
        ring.size(waveRingPos[i].size, 0.1, easeInOutCubic),
        ring.opacity(0.35, 0.08),
      )
    ),
  );

  // === PHASE 21.8: Outer dots pulse (7.9 - 8.1s) ===
  yield* all(
    ...outerDots.map((dot, i) =>
      chain(
        waitFor(i * 0.01),
        chain(
          all(dot.size(outerDotPos[i].size * 1.5, 0.08, easeOutCubic), outerDotsGlow[i].opacity(0.5, 0.08)),
          all(dot.size(outerDotPos[i].size, 0.1, easeInOutCubic), outerDotsGlow[i].opacity(0.35, 0.1)),
        )
      )
    ),
  );

  // === PHASE 21.9: Trail particles orbit (8.0 - 8.2s) ===
  yield* all(
    ...trailParticles.map((p, i) => {
      const angle = (i / TRAIL_PARTICLE_COUNT) * Math.PI * 2 + Math.PI / 9;
      const radius = 280 + (i % 4) * 50;
      const newAngle = angle + Math.PI / 8;
      const newX = Math.cos(newAngle) * radius;
      const newY = Math.sin(newAngle) * radius * 0.55;
      return all(
        p.x(newX, 0.18, easeInOutQuad),
        p.y(newY, 0.18, easeInOutQuad),
      );
    }),
    ...trailGlows.map((g, i) => {
      const angle = (i / TRAIL_PARTICLE_COUNT) * Math.PI * 2 + Math.PI / 9;
      const radius = 280 + (i % 4) * 50;
      const newAngle = angle + Math.PI / 8;
      const newX = Math.cos(newAngle) * radius;
      const newY = Math.sin(newAngle) * radius * 0.55;
      return all(
        g.x(newX, 0.18, easeInOutQuad),
        g.y(newY, 0.18, easeInOutQuad),
      );
    }),
  );

  // === PHASE 22: Radial lines pulse (7.8 - 8.1s) ===
  yield* all(
    ...radialLines.map((line, i) =>
      chain(waitFor(i * 0.01), line.lineWidth(4, 0.08, easeOutCubic))
    ),
    ...radialGlows.map(g => g.opacity(0.35, 0.08)),
  );
  yield* all(
    ...radialLines.map(line => line.lineWidth(2, 0.1, easeInOutCubic)),
    ...radialGlows.map(g => g.opacity(0.18, 0.1)),
  );

  // === PHASE 23: Background glow shift (8.1 - 8.4s) ===
  yield* all(
    bgGlowMagenta1().opacity(0.05, 0.25),
    bgGlowYellow1().opacity(0.045, 0.25),
    bgGlowYellow2().opacity(0.03, 0.25),
  );

  // === PHASE 24: Fourth big pulse (8.4 - 8.7s) ===
  yield* all(
    logo().scale(1.25, 0.1, easeOutCubic),
    logoGlow().opacity(0.85, 0.08),
    logoSphereInner().opacity(0.5, 0.08),
    pulseRings[3].opacity(0.55, 0.06),
    pulseRings[3].size(320, 0.22, easeOutCubic),
    ...energyRings.map(ring => ring.opacity(0.55, 0.1)),
  );

  // === PHASE 25: Settle (8.7 - 9.0s) ===
  yield* all(
    logo().scale(1.1, 0.12, easeInOutCubic),
    logoGlow().opacity(0.6, 0.1),
    logoSphereInner().opacity(0.35, 0.1),
    pulseRings[3].opacity(0, 0.14),
    ...energyRings.map(ring => ring.opacity(0.4, 0.12)),
  );

  // === PHASE 25.3: Diamonds pulse (8.8 - 9.0s) ===
  yield* all(
    ...diamonds.map((diamond, i) =>
      chain(
        waitFor(i * 0.02),
        chain(
          all(diamond.scale(diamondPos[i].scale * 1.25, 0.08, easeOutCubic), diamondsGlow[i].opacity(0.5, 0.08)),
          all(diamond.scale(diamondPos[i].scale, 0.1, easeInOutCubic), diamondsGlow[i].opacity(0.35, 0.1)),
        )
      )
    ),
  );

  // === PHASE 25.5: Progress bars complete (8.9 - 9.1s) ===
  yield* all(
    ...progressBars.map((bar, i) =>
      chain(
        waitFor(i * 0.02),
        all(
          bar.width(progressBarPos[i].width * 0.95, 0.15, easeOutCubic),
          progressBarGlows[i].width(progressBarPos[i].width * 0.95, 0.15, easeOutCubic),
        )
      )
    ),
  );

  // === PHASE 25.7: Accent stars twinkle (9.0 - 9.2s) ===
  yield* all(
    ...accentStars.slice(0, 8).map((star, i) =>
      chain(
        waitFor(i * 0.015),
        chain(
          all(star.scale(accentStarPos[i].scale * 1.3, 0.06, easeOutBack), accentStarsGlow[i].opacity(0.5, 0.06)),
          all(star.scale(accentStarPos[i].scale, 0.08), accentStarsGlow[i].opacity(0.3, 0.08)),
        )
      )
    ),
  );

  // === PHASE 26: Stream particles second wave (9.0 - 9.4s) ===
  yield* all(
    ...streamParticles.slice(0, 20).map((p, i) => {
      const pos = streamPos[i];
      return chain(
        p.x(pos.startX * 0.3, 0.35, easeOutCubic),
        p.y(pos.startY * 0.3, 0.35, easeOutCubic),
      );
    }),
  );

  // === PHASE 26.3: Corner brackets flash (9.2 - 9.4s) ===
  yield* all(
    ...cornerBrackets.map((bracket, i) =>
      chain(
        waitFor(i * 0.03),
        chain(
          all(bracket.opacity(0.75, 0.06), cornerBracketsGlow[i].opacity(0.5, 0.06)),
          all(bracket.opacity(0.5, 0.08), cornerBracketsGlow[i].opacity(0.3, 0.08)),
        )
      )
    ),
  );

  // === PHASE 26.5: Data line dots pulse (9.3 - 9.5s) ===
  yield* all(
    ...dataLineDots.map((dot, i) =>
      chain(
        waitFor(i * 0.02),
        chain(
          all(dot.size(12, 0.06, easeOutCubic), dot.opacity(0.85, 0.06)),
          all(dot.size(8, 0.08, easeInOutCubic), dot.opacity(0.6, 0.08)),
        )
      )
    ),
  );

  // === PHASE 27: Final glow pulse (9.4 - 9.7s) ===
  yield* all(
    logoSphereOuter().opacity(0.2, 0.12),
    logoSphereMid().opacity(0.32, 0.12),
    ...peopleGlows.map(g => g.opacity(0.5, 0.12)),
    ...voteGlows.map(g => g.opacity(0.55, 0.12)),
    ...hexagonsGlow.map(g => g.opacity(0.4, 0.12)),
    ...diamondsGlow.map(g => g.opacity(0.45, 0.12)),
  );
  yield* all(
    logoSphereOuter().opacity(0.15, 0.1),
    logoSphereMid().opacity(0.25, 0.1),
    ...peopleGlows.map(g => g.opacity(0.4, 0.1)),
    ...voteGlows.map(g => g.opacity(0.45, 0.1)),
    ...hexagonsGlow.map(g => g.opacity(0.28, 0.1)),
    ...diamondsGlow.map(g => g.opacity(0.35, 0.1)),
  );

  // === PHASE 27.5: Floating particles return (9.6 - 9.8s) ===
  yield* all(
    ...floatingParticles.map((p, i) => {
      const angle = (i / FLOATING_COUNT) * Math.PI * 2;
      const driftX = Math.cos(angle) * 12;
      const driftY = Math.sin(angle) * 10;
      return p.x(p.x() - driftX, 0.18, easeInOutQuad);
    }),
  );

  // === PHASE 28: Hold with subtle breathing (9.7 - 10.0s) ===
  yield* all(
    logo().scale(1.12, 0.15, easeInOutQuad),
    logoGlow().opacity(0.65, 0.15),
    bgGlowYellow1().opacity(0.04, 0.15),
  );
  yield* all(
    logo().scale(1.1, 0.1),
    logoGlow().opacity(0.6, 0.1),
    bgGlowYellow1().opacity(0.035, 0.1),
  );

  // ============================================
  // Total: ~10 seconds
  // ============================================
});
