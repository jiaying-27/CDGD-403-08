import { useEffect, useState } from 'react';
import { WebGLRenderer } from 'three';
import Ballpit from './Ballpit.jsx';
import { sounds } from '../data/sounds';

const homeBallColors = sounds.map((sound) => Number.parseInt(sound.accent.replace('#', ''), 16));

type InteractionMode = 'pointer' | 'orientation';

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
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('pointer');
  const [motionEnabled, setMotionEnabled] = useState(false);
  const [motionPermissionRequired, setMotionPermissionRequired] = useState(false);

  useEffect(() => {
    setWebglReady(supportsWebGL());

    if (typeof window === 'undefined') {
      return;
    }

    const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const orientationPermissionApi =
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> })
        .requestPermission === 'function';

    if (coarsePointer) {
      setInteractionMode('orientation');
      setMotionPermissionRequired(orientationPermissionApi);
      setMotionEnabled(!orientationPermissionApi);
      return;
    }

    setInteractionMode('pointer');
    setMotionEnabled(false);
    setMotionPermissionRequired(false);
  }, []);

  async function handleEnableMotion() {
    if (
      typeof DeviceOrientationEvent === 'undefined' ||
      typeof (DeviceOrientationEvent as typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<string>;
      }).requestPermission !== 'function'
    ) {
      setMotionEnabled(true);
      setMotionPermissionRequired(false);
      return;
    }

    try {
      const permission = await (
        DeviceOrientationEvent as typeof DeviceOrientationEvent & {
          requestPermission: () => Promise<string>;
        }
      ).requestPermission();

      if (permission === 'granted') {
        setMotionEnabled(true);
        setMotionPermissionRequired(false);
      }
    } catch {
      setMotionEnabled(false);
    }
  }

  return (
    <div className="ballpit-demo-frame">
      {webglReady ? (
        <>
          <Ballpit
            className="ballpit-canvas"
            colors={homeBallColors}
            count={100}
            followCursor={false}
            interactionMode={interactionMode}
            interactive={interactionMode === 'pointer'}
            motionEnabled={motionEnabled}
            friction={1}
            gravity={0.01}
            wallBounce={0.95}
          />

          {interactionMode === 'orientation' && motionPermissionRequired ? (
            <button className="ballpit-motion-button" onClick={() => void handleEnableMotion()} type="button">
              Enable Motion
            </button>
          ) : null}
        </>
      ) : (
        <div className="ballpit-fallback" aria-hidden="true" />
      )}
    </div>
  );
}
