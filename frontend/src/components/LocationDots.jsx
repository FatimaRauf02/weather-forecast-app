import { Plus } from 'lucide-react';

export default function LocationDots({ count, activeIndex, onGoTo, onAddClick }) {
  if (count === 0) return null;

  return (
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            onClick={() => onGoTo(i)}
            aria-label={`Show location ${i + 1}`}
            className={`rounded-full transition-all ${
              i === activeIndex ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
      <button
        onClick={onAddClick}
        className="flex items-center gap-1 text-white hover:text-white text-xs font-semibold px-2.5 py-1.5 rounded-full glass-tile-strong transition-colors"
      >
        <Plus size={13} strokeWidth={2.5} /> Add city
      </button>
    </div>
  );
}
