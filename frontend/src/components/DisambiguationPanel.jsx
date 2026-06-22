import { MapPinned } from 'lucide-react';

export default function DisambiguationPanel({ results, query, onSelect, onCancel }) {
  return (
    <div className="bg-card border border-ink/10 rounded-xl p-5 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <MapPinned size={18} className="text-pine" />
        <p className="font-medium text-ink">
          Multiple places match "{query}" — which one did you mean?
        </p>
      </div>
      <div className="grid gap-2">
        {results.map((r, idx) => (
          <button
            key={`${r.latitude}-${r.longitude}-${idx}`}
            onClick={() => onSelect(r)}
            className="text-left px-4 py-3 rounded-lg border border-ink/10 hover:border-pine hover:bg-paper transition-colors flex items-center justify-between"
          >
            <span className="font-medium">{r.name}</span>
            <span className="text-sm text-muted font-mono">
              {[r.admin1, r.country].filter(Boolean).join(', ')}
            </span>
          </button>
        ))}
      </div>
      <button onClick={onCancel} className="text-sm text-muted mt-3 hover:text-ink">
        Cancel search
      </button>
    </div>
  );
}
