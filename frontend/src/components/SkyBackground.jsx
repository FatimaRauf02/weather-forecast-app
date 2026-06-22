import { useMemo } from 'react';
import { getSceneConfig } from '../utils/skyScene';


function seeded(i, salt = 1) {
  const x = Math.sin(i * 12.9898 * salt) * 43758.5453;
  return x - Math.floor(x);
}

export default function SkyBackground({ weatherCode, isDay = true, children }) {
  const scene = useMemo(() => getSceneConfig(weatherCode, isDay), [weatherCode, isDay]);

  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        top: `${seeded(i, 1) * 60}%`,
        left: `${seeded(i, 2) * 100}%`,
        delay: `${seeded(i, 3) * 4}s`,
        size: seeded(i, 4) > 0.85 ? 3 : 2,
      })),
    []
  );

  const rainDrops = useMemo(
    () =>
      Array.from({ length: scene.rainIntensity === 'heavy' ? 50 : 25 }, (_, i) => ({
        left: `${seeded(i, 5) * 100}%`,
        delay: `${seeded(i, 6) * 1.2}s`,
        duration: `${0.6 + seeded(i, 7) * 0.5}s`,
      })),
    [scene.rainIntensity]
  );

  const snowFlakes = useMemo(
    () =>
      Array.from({ length: 35 }, (_, i) => ({
        left: `${seeded(i, 8) * 100}%`,
        delay: `${seeded(i, 9) * 8}s`,
        duration: `${6 + seeded(i, 10) * 5}s`,
      })),
    []
  );

  return (
    <div className={`relative min-h-screen ${scene.gradientClass} transition-colors duration-700`}>
      <div className="sky-layer">
        {scene.showSun && <div className="sun-glow animate-sun-pulse" />}

        {scene.showStars &&
          stars.map((s, i) => (
            <div
              key={i}
              className="star animate-twinkle"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                animationDelay: s.delay,
              }}
            />
          ))}

        {scene.showClouds && (
          <>
            <CloudShape className="animate-drift-slow" top="10%" scale={1} opacity={0.5} />
            <CloudShape className="animate-drift-slower" top="22%" scale={0.7} opacity={0.35} delayOffset="-30s" />
            <CloudShape className="animate-drift-slow" top="4%" scale={0.55} opacity={0.4} delayOffset="-15s" />
          </>
        )}

        {scene.showRain &&
          rainDrops.map((r, i) => (
            <div
              key={i}
              className="rain-drop animate-rain-fall"
              style={{ left: r.left, animationDelay: r.delay, animationDuration: r.duration }}
            />
          ))}

        {scene.showSnow &&
          snowFlakes.map((s, i) => (
            <div
              key={i}
              className="snow-flake animate-snow-fall"
              style={{ left: s.left, animationDelay: s.delay, animationDuration: s.duration }}
            />
          ))}

        {scene.showLightning && <div className="lightning-bolt animate-lightning-flash" />}
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

function CloudShape({ top, scale, opacity, className, delayOffset = '0s' }) {
  return (
    <svg
      className={`cloud-shape ${className}`}
      style={{ top, transform: `scale(${scale})`, opacity, animationDelay: delayOffset, left: '-20%' }}
      width="220"
      height="80"
      viewBox="0 0 220 80"
      fill="none"
    >
      <ellipse cx="60" cy="50" rx="55" ry="28" fill="white" />
      <ellipse cx="110" cy="35" rx="45" ry="32" fill="white" />
      <ellipse cx="155" cy="50" rx="50" ry="25" fill="white" />
      <ellipse cx="30" cy="58" rx="35" ry="18" fill="white" />
    </svg>
  );
}
