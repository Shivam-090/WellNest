import { useWellness } from '../../contexts/WellnessContext';

export const MOODS = [
  { id: 'Good', emoji: '😊', label: 'Good' },
  { id: 'Okay', emoji: '😐', label: 'Okay' },
  { id: 'Low', emoji: '😔', label: 'Low' },
  { id: 'Anxious', emoji: '😰', label: 'Anxious' },
  { id: 'Overwhelmed', emoji: '🤯', label: 'Overwhelmed' },
];

export default function MoodSelector() {
  const { selectedMood, setSelectedMood } = useWellness();

  return (
    <div className="flex flex-wrap gap-2.5 sm:gap-3 my-4">
      {MOODS.map((mood) => {
        const isSelected = selectedMood === mood.id;
        return (
          <button
            key={mood.id}
            type="button"
            onClick={() => setSelectedMood(mood.id)}
            className={`px-4 py-2.5 rounded-full flex items-center gap-2 text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm ${
              isSelected
                ? 'bg-gradient-to-r from-primary to-secondary text-white border-2 border-primary scale-105 shadow-md font-bold'
                : 'bg-surface-chip text-text-primary border border-surface-border hover:border-primary/50 hover:-translate-y-0.5'
            }`}
          >
            <span className="text-lg">{mood.emoji}</span>
            <span>{mood.label}</span>
          </button>
        );
      })}
    </div>
  );
}
