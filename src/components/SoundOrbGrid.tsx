import type { CSSProperties } from 'react';
import { sounds } from '../data/sounds';

type SoundOrbGridProps = {
  selectedSound: string | null;
  onSelect: (soundName: string) => void;
};

export default function SoundOrbGrid({ selectedSound, onSelect }: SoundOrbGridProps) {
  return (
    <section aria-label="Sound selector" className="panel">
      <h2>Tap a floating sound orb</h2>
      <div className="orb-grid">
        {sounds.map((sound) => (
          <button
            key={sound.name}
            className={selectedSound === sound.name ? 'sound-orb sound-orb-active' : 'sound-orb'}
            onClick={() => onSelect(sound.name)}
            style={{ '--orb-accent': sound.accent } as CSSProperties}
            type="button"
          >
            {sound.name}
          </button>
        ))}
      </div>
    </section>
  );
}
