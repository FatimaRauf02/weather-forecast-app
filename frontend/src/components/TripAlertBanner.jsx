import { useState } from 'react';
import { CloudLightning, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function TripAlertBanner({ alerts }) {
  const [expanded, setExpanded] = useState(true);

  if (!alerts || alerts.length === 0) return null;

  const highSeverity = alerts.filter((a) => a.severity === 'high');
  const Icon = highSeverity.length > 0 ? CloudLightning : AlertCircle;

  return (
    <div className="glass-tile-strong border border-accentAlert/40 rounded-xl mb-6 overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2 text-white font-semibold text-sm text-shadow-soft">
          <Icon size={18} className="text-accentAlert" strokeWidth={2.5} />
          {alerts.length} weather alert{alerts.length > 1 ? 's' : ''} for your saved trips
        </div>
        {expanded ? (
          <ChevronUp size={16} className="text-white" />
        ) : (
          <ChevronDown size={16} className="text-white" />
        )}
      </button>
      {expanded && (
        <ul className="px-4 pb-3 space-y-1.5">
          {alerts.map((alert, i) => (
            <li key={i} className="text-sm text-white/90 pl-6">
              {alert.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
