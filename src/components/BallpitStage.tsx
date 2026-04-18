import { useEffect, useState } from 'react';
import { WebGLRenderer } from 'three';
import Ballpit from './Ballpit.jsx';
import { sounds } from '../data/sounds';

const homeBallColors = sounds.map((sound) => Number.parseInt(sound.accent.replace('#', ''), 16));

function supportsWebGL() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  if (/jsdom/i.test(window.navigator.userAgent)) {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    const renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });

    renderer.dispose();
    renderer.forceContextLoss();
    return true;
  } catch {
    return false;
  }
}

export default function BallpitStage() {
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    setWebglReady(supportsWebGL());
  }, []);

  return (
    <div className="ballpit-demo-frame">
      {webglReady ? (
        <Ballpit
          className="ballpit-canvas"
          colors={homeBallColors}
          count={100}
          followCursor={false}
          friction={1}
          gravity={0.01}
          wallBounce={0.95}
        />
      ) : (
        <div className="ballpit-fallback" aria-hidden="true" />
      )}
    </div>
  );
}
