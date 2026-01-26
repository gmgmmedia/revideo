/**
 * Scene 6: Raiku Logo Outro
 * Duration: 1 second
 *
 * Visual: Raiku logo reveal with glow
 */

import { makeScene2D } from '@revideo/2d';
import { Rect, Node, Line, Circle, Path, blur } from '@revideo/2d';
import {
  all,
  delay,
  waitFor,
  createRef,
  createRefArray,
  easeOutCubic,
  easeInOutCubic,
} from '@revideo/core';

import { colors, effects } from '../lib/raiku';

export default makeScene2D('scene6', function* (view) {
  // ============================================
  // SCENE SETUP
  // ============================================
  view.fill(colors.background);

  // ============================================
  // REFS
  // ============================================
  const bgGlow = createRef<Circle>();
  const logoGroup = createRef<Node>();
  const logoPath = createRef<Path>();
  const logoGlow = createRef<Path>();
  const ambientParticles = createRefArray<Circle>();
  const ambientGlows = createRefArray<Circle>();

  // ============================================
  // CONSTANTS
  // ============================================
  const PARTICLE_COUNT = 8;

  // Raiku logo SVG path (viewBox: 0 0 882 256, scaled down)
  const RAIKU_LOGO_PATH = "M583.938 180.733L582.532 180.186L581.665 179.411L581.246 178.895L581.067 178.576L561.249 143.058L560.262 142.481H518.953L517.113 141.402L511.115 130.798H510.098L481.606 179.685L479.782 180.748H452.531L450.706 177.497L510.412 76.0482L512.237 75H538.89L540.714 78.251L520.807 112.402L521.286 113.267H575.338L577.178 114.346L613.714 177.528L611.875 180.748H583.938V180.733ZM632.572 180.933L630.747 179.885L616 155.203V153L638.405 114.326L660.175 76.4336L662 75.3854L689.526 75.2155L691.351 78.4665L648.351 151.462L648.829 152.312L715.276 152.097L716.248 151.535L760.698 76.0482L762.523 75H789.175L791 78.251L731.892 179.67L730.068 180.733L632.587 180.948L632.572 180.933ZM405.177 180.718L403.352 177.467L462.028 76.0482L463.853 75H490.505L492.33 78.251L433.222 179.67L431.398 180.733H405.162L405.177 180.718ZM356.182 180.718L354.372 177.452L356.331 174.17L369.314 152.568L368.835 151.717H316.188L314.349 150.639L308.291 139.944H307.274L284.107 179.639L282.282 180.687H213.198L211.359 179.594L190 142.693L189.013 142.116H126.466L124.626 138.896L138.416 114.331L140.256 113.252H204.868L206.707 114.331L227.332 150.927L228.319 151.504L268.528 151.717L269.5 151.155L312.763 76.0482L314.588 75H414.228L416.052 76.0482L430.874 101.342V103.56L385.736 179.685L383.926 180.733H356.212L356.182 180.718ZM386.723 122.504L387.695 121.957L398.209 104.456L397.746 103.606H329.081L328.109 104.168L317.923 121.638L318.402 122.504H386.723ZM93.1238 180.703L91 178.545V175.826L91.2692 174.778L91.5534 174.277L103.728 152.568L105.568 151.489H160.353L162.208 152.598L168.983 165.055V167.182L161.849 179.654L160.009 180.733H93.1238V180.703ZM236.461 132L234.636 128.749L248.861 104.456L248.383 103.606H123.37L121.53 100.385L135.215 76.0786L137.055 75H269.584L271.424 76.0786L283.5 97V99.1724L265.072 130.952L263.248 132H236.461ZM587.671 104.213L585.846 100.962L600.489 76.0482L602.313 75H641.01L642.835 78.251L628.327 103.165L626.502 104.228H587.686L587.671 104.213Z";

  // ============================================
  // BUILD SCENE
  // ============================================
  view.add(
    <>
      {/* Background glow */}
      <Circle
        ref={bgGlow}
        size={800}
        fill={colors.glow}
        opacity={0}
        filters={[blur(200)]}
      />

      {/* Ambient particles */}
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
        const radius = 250 + (i % 3) * 60;
        return (
          <Node key={`particle-${i}`}>
            <Circle
              ref={ambientGlows}
              size={10 + (i % 3) * 4}
              fill={i % 2 === 0 ? colors.neon : colors.white}
              opacity={0}
              x={Math.cos(angle) * radius}
              y={Math.sin(angle) * radius * 0.5}
              filters={[blur(8)]}
            />
            <Circle
              ref={ambientParticles}
              size={3 + (i % 2)}
              fill={i % 2 === 0 ? colors.neon : colors.white}
              opacity={0}
              x={Math.cos(angle) * radius}
              y={Math.sin(angle) * radius * 0.5}
            />
          </Node>
        );
      })}

      {/* Raiku Logo */}
      <Node ref={logoGroup} scale={0} opacity={0}>
        {/* Logo glow */}
        <Path
          ref={logoGlow}
          data={RAIKU_LOGO_PATH}
          fill={colors.neon}
          opacity={0}
          scale={0.45}
          x={-200}
          y={-58}
          filters={[blur(15)]}
        />
        {/* Logo main */}
        <Path
          ref={logoPath}
          data={RAIKU_LOGO_PATH}
          fill={colors.neon}
          opacity={0}
          scale={0.45}
          x={-200}
          y={-58}
        />
      </Node>
    </>
  );

  // ============================================
  // ANIMATION TIMELINE (1 second total)
  // ============================================

  // Beat 0 (0:00) - Background glow appears
  yield* bgGlow().opacity(0.04, 0.15);

  // Beat 1 (0:05) - Logo scales in
  yield* all(
    logoGroup().scale(1, 0.25, easeOutCubic),
    logoGroup().opacity(1, 0.2),
  );

  // Beat 2 (0:10) - Logo fills and glows
  yield* all(
    logoPath().opacity(1, 0.15),
    logoGlow().opacity(0.5, 0.15),
  );

  // Beat 3 (0:15) - Ambient particles fade in
  yield* all(
    ...ambientParticles.map((p, i) =>
      delay(i * 0.02, p.opacity(0.4, 0.1))
    ),
    ...ambientGlows.map((g, i) =>
      delay(i * 0.02, g.opacity(0.2, 0.1))
    ),
  );

  // Beat 4 (0:20) - Logo pulse
  yield* all(
    logoGroup().scale(1.03, 0.08, easeOutCubic),
    logoGlow().opacity(0.7, 0.08),
    bgGlow().opacity(0.06, 0.08),
  );
  yield* all(
    logoGroup().scale(1, 0.07, easeInOutCubic),
    logoGlow().opacity(0.5, 0.07),
  );

  // Hold final frame (0:25 - 1:00)
  yield* waitFor(0.25);
});
