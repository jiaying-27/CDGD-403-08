import { moods, type Mood } from '../data/moods';

type MoodSelectorProps = {
  selectedMood: Mood | null;
  onSelect: (mood: Mood) => void;
};

export default function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
  return (
    <section aria-label="Mood selector" className="panel">
      <h2>Choose your state</h2>
      <div className="chip-grid">
        {moods.map((mood) => (
          <button
            key={mood}
            className={selectedMood === mood ? 'chip chip-active' : 'chip'}
            onClick={() => onSelect(mood)}
            type="button"
          >
            {mood}
          </button>
        ))}
      </div>
    </section>
  );
}
