import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ExperienceVisualCanvas from '../components/ExperienceVisualCanvas';
import { moods, type Mood } from '../data/moods';
import { getSoundsForMood, type SoundOption } from '../data/sounds';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

type ExperienceStep = 'state' | 'sound' | 'visual';

type OrbLayout = {
  animationDelay: string;
  animationDuration: string;
  left: string;
  size: string;
  top: string;
};

type OrbPlacement = {
  left: number;
  size: number;
  top: number;
};

const sceneTypes = [
  'Liquid Collision',
  'Color Storm',
  'Bloom Current',
  'Chromatic Flow',
  'Soft Impact',
  'Nature Fusion'
] as const;

const ORB_MAX_SIZE = 145;
const ORB_MIN_SIZE = 88;
const ORB_MIN_SIZE_FALLBACK = 56;
const ORB_GAP = 18;
const ORB_COVERAGE = 0.7;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function circlesOverlap(candidate: OrbPlacement, placed: OrbPlacement[]) {
  return placed.some((orb) => {
    const candidateCenterX = candidate.left + candidate.size / 2;
    const candidateCenterY = candidate.top + candidate.size / 2;
    const orbCenterX = orb.left + orb.size / 2;
    const orbCenterY = orb.top + orb.size / 2;
    const minimumDistance = candidate.size / 2 + orb.size / 2 + ORB_GAP;

    return Math.hypot(candidateCenterX - orbCenterX, candidateCenterY - orbCenterY) < minimumDistance;
  });
}

function createFallbackOrbLayout(count: number, minX: number, maxX: number, minY: number, maxY: number) {
  const columns = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / columns);
  const cellWidth = (maxX - minX) / columns;
  const cellHeight = (maxY - minY) / rows;

  return Array.from({ length: count }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const size = clamp(Math.min(cellWidth, cellHeight) * 0.68, ORB_MIN_SIZE_FALLBACK, ORB_MAX_SIZE);
    const availableX = Math.max(cellWidth - size, 0);
    const availableY = Math.max(cellHeight - size, 0);

    return {
      left: minX + column * cellWidth + availableX / 2,
      top: minY + row * cellHeight + availableY / 2,
      size
    };
  });
}

function createOrbLayout(count: number, viewportWidth: number, viewportHeight: number) {
  if (count === 0) {
    return [];
  }

  const sidePadding = clamp(viewportWidth * 0.06, 24, 72);
  const topPadding = clamp(viewportHeight * 0.19, 140, 220);
  const bottomPadding = clamp(viewportHeight * 0.14, 96, 160);
  const usableWidth = Math.max(viewportWidth - sidePadding * 2, 320);
  const usableHeight = Math.max(viewportHeight - topPadding - bottomPadding, 240);
  const coverageWidth = usableWidth * ORB_COVERAGE;
  const coverageHeight = usableHeight * ORB_COVERAGE;
  const minX = sidePadding + (usableWidth - coverageWidth) / 2;
  const maxX = minX + coverageWidth;
  const minY = topPadding + (usableHeight - coverageHeight) / 2;
  const maxY = minY + coverageHeight;
  const adaptiveMinimumSize = clamp(
    Math.min(ORB_MIN_SIZE, Math.min(coverageWidth, coverageHeight) / Math.max(count * 0.82, 3.2)),
    ORB_MIN_SIZE_FALLBACK,
    ORB_MIN_SIZE
  );
  const coverageArea = coverageWidth * coverageHeight;
  const targetDiameter = Math.sqrt((coverageArea * 0.48) / (count * Math.PI)) * 2;
  const baseMinSize = clamp(targetDiameter * 0.84, adaptiveMinimumSize, ORB_MAX_SIZE - 16);
  const baseMaxSize = clamp(targetDiameter * 1.1, baseMinSize + 8, ORB_MAX_SIZE);
  const sizedOrbs = Array.from({ length: count }, (_, index) => ({
    index,
    size: randomBetween(baseMinSize, baseMaxSize)
  })).sort((leftOrb, rightOrb) => rightOrb.size - leftOrb.size);
  const placedOrbs: Array<OrbPlacement | undefined> = Array.from({ length: count });
  const acceptedOrbs: OrbPlacement[] = [];

  for (const orb of sizedOrbs) {
    let placement: OrbPlacement | null = null;

    for (let attempt = 0; attempt < 250; attempt += 1) {
      const x = randomBetween(minX, Math.max(minX, maxX - orb.size));
      const y = randomBetween(minY, Math.max(minY, maxY - orb.size));
      const candidate = { left: x, top: y, size: orb.size };

      if (!circlesOverlap(candidate, acceptedOrbs)) {
        placement = candidate;
        break;
      }
    }

    if (!placement) {
      const fallbackLayout = createFallbackOrbLayout(count, minX, maxX, minY, maxY);
      return fallbackLayout.map((item) => ({
        size: `${item.size}px`,
        left: `${item.left}px`,
        top: `${item.top}px`,
        animationDuration: `${3.2 + Math.random() * 1.6}s`,
        animationDelay: `${Math.random() * 1.4}s`
      }));
    }

    placedOrbs[orb.index] = placement;
    acceptedOrbs.push(placement);
  }

  return placedOrbs.map((orb) => ({
    size: `${orb!.size}px`,
    left: `${orb!.left}px`,
    top: `${orb!.top}px`,
    animationDuration: `${3.2 + Math.random() * 1.6}s`,
    animationDelay: `${Math.random() * 1.4}s`
  }));
}

function createSceneTitle(soundName: string) {
  const sceneType = sceneTypes[Math.floor(Math.random() * sceneTypes.length)];
  return `${sceneType} · ${soundName}`;
}

export default function ExperiencePage() {
  const [step, setStep] = useState<ExperienceStep>('state');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedSound, setSelectedSound] = useState<SoundOption | null>(null);
  const [sceneTitle, setSceneTitle] = useState('Liquid Nature');
  const [sceneVersion, setSceneVersion] = useState(0);
  const [orbLayout, setOrbLayout] = useState<OrbLayout[]>([]);
  const orbContainerRef = useRef<HTMLDivElement | null>(null);
  const { restartPlayback, selectTrack, statusLabel, stopPlayback, togglePlayback } = useAudioPlayer();
  const availableSounds = selectedMood ? getSoundsForMood(selectedMood) : [];

  useEffect(() => {
    if (step !== 'sound' || availableSounds.length === 0) {
      return;
    }

    const updateLayout = () => {
      const rect = orbContainerRef.current?.getBoundingClientRect();
      const width = rect?.width ?? window.innerWidth;
      const height = rect?.height ?? window.innerHeight;
      setOrbLayout(createOrbLayout(availableSounds.length, width, height));
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);

    return () => {
      window.removeEventListener('resize', updateLayout);
    };
  }, [availableSounds.length, step]);

  async function handleMoodSelect(mood: Mood) {
    await stopPlayback();
    setSelectedMood(mood);
    setSelectedSound(null);
    setSceneTitle('Liquid Nature');
    setOrbLayout([]);
    setStep('sound');
  }

  async function handleSoundSelect(sound: SoundOption) {
    setSelectedSound(sound);
    setSceneTitle(createSceneTitle(sound.name));
    setSceneVersion((value) => value + 1);
    setStep('visual');
    await selectTrack({ name: sound.name, file: sound.file });
  }

  async function handleReturnToState() {
    await stopPlayback();
    setSelectedSound(null);
    setSceneTitle('Liquid Nature');
    setStep('state');
  }

  async function handleReturnToOrbs() {
    await stopPlayback();
    setSceneTitle('Liquid Nature');
    setStep('sound');
  }

  return (
    <main className="experience-shell">
      {step === 'state' ? (
        <section className="page page-active experience-state-page">
          <h1 className="title">Choose your state</h1>

          <div className="options" aria-label="State selector">
            {moods.map((mood) => (
              <button
                key={mood}
                className="option-btn"
                onClick={() => void handleMoodSelect(mood)}
                type="button"
              >
                {mood}
              </button>
            ))}

            <Link className="back-btn" to="/">
              Back
            </Link>
          </div>
        </section>
      ) : null}

      {step === 'sound' && selectedMood ? (
        <section className="page page-active experience-sound-page">
          <h2 className="title">Tap a floating sound orb</h2>
          <p className="small-note">Each orb carries a different natural white noise</p>

          <div ref={orbContainerRef} className="balls-container" aria-label="Sound selector">
            {availableSounds.map((sound, index) => (
              <button
                key={sound.name}
                aria-label={sound.name}
                className="ball"
                onClick={() => void handleSoundSelect(sound)}
                style={{
                  background: sound.gradient,
                  width: orbLayout[index]?.size,
                  height: orbLayout[index]?.size,
                  left: orbLayout[index]?.left,
                  top: orbLayout[index]?.top,
                  animationDuration: orbLayout[index]?.animationDuration,
                  animationDelay: orbLayout[index]?.animationDelay
                }}
                type="button"
              />
            ))}
          </div>

          <div className="top-left-controls">
            <button className="back-btn" onClick={() => void handleReturnToState()} type="button">
              Back
            </button>
          </div>

          <p className="state-badge">State: {selectedMood}</p>
        </section>
      ) : null}

      {step === 'visual' && selectedMood && selectedSound ? (
        <section className="page page-active experience-visual-page">
          <ExperienceVisualCanvas palette={selectedSound.palette} sceneVersion={sceneVersion} />
          <div className="visual-overlay" />

          <div className="top-left-controls">
            <button className="back-btn" onClick={() => void handleReturnToOrbs()} type="button">
              Back
            </button>
          </div>

          <p className="state-badge">State: {selectedMood}</p>

          <div className="visual-ui">
            <h2 className="visual-title">{sceneTitle}</h2>

            <div className="audio-controls">
              <button className="audio-btn" onClick={() => void togglePlayback()} type="button">
                Pause / Play Sound
              </button>
              <button className="audio-btn" onClick={() => void restartPlayback()} type="button">
                Restart Sound
              </button>
            </div>

            <p className="audio-status">{statusLabel}</p>
          </div>
        </section>
      ) : null}
    </main>
  );
}
