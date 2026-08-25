import { CHARACTERS } from '../../data/characters';

export default function CharacterGrid({ selectedChar, onSelectChar }) {
  return (
    <div className="grid grid-cols-4 gap-2.5 sm:gap-3 mb-6">
      {CHARACTERS.map((c) => {
        const isSelected = selectedChar === c.emoji;
        return (
          <button
            key={c.name}
            type="button"
            onClick={() => onSelectChar(c.emoji)}
            className={`p-3 rounded-2xl text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
              isSelected
                ? 'bg-primary-soft/90 border-2 border-primary shadow-md scale-105 ring-2 ring-primary/30'
                : 'bg-white/10 border border-white/20 hover:bg-white/20 hover:-translate-y-1'
            }`}
          >
            <span className="text-3xl sm:text-4xl mb-1 drop-shadow-sm">{c.emoji}</span>
            <span
              className={`text-[11px] font-semibold tracking-wide ${
                isSelected ? 'text-primary font-bold' : 'text-white/70'
              }`}
            >
              {c.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
