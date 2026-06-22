import { X } from 'lucide-react';
import WeatherIcon from './WeatherIcon';

export default function TenDayDetail({ daily, dailyDescriptions, onClose }) {
  if (!daily?.time?.length) return null;

  const allTemps = [...daily.temperature_2m_max, ...daily.temperature_2m_min];
  const rangeMin = Math.min(...allTemps);
  const rangeMax = Math.max(...allTemps);
  const span = Math.max(1, rangeMax - rangeMin);

  const formatDay = (dateStr, idx) => {
    if (idx === 0) return 'Tonight';
    const d = new Date(dateStr);
    return d.toLocaleDateString([], { weekday: 'short', day: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl bg-white max-h-[85vh] overflow-y-auto animate-fade-in-up">
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm flex items-center justify-between px-5 py-4 border-b border-line">
          <h3 className="font-display text-lg font-semibold text-ink">10-Day Forecast</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-muted hover:text-ink hover:bg-paper transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-2 divide-y divide-line">
          {daily.time.map((date, idx) => {
            const max = daily.temperature_2m_max[idx];
            const min = daily.temperature_2m_min[idx];
            const precip = daily.precipitation_probability_max?.[idx] ?? 0;
            const fillStart = ((min - rangeMin) / span) * 100;
            const fillEnd = ((max - rangeMin) / span) * 100;

            return (
              <div key={date} className="flex items-center gap-3 py-3">
                <span className="text-sm font-medium text-ink w-24 flex-shrink-0">
                  {formatDay(date, idx)}
                </span>

                <div className="flex items-center gap-1 w-14 flex-shrink-0">
                  <WeatherIcon icon={dailyDescriptions?.[idx]?.icon} size={18} />
                </div>

                <span className="text-xs text-accentRain w-9 flex-shrink-0">
                  {precip > 0 ? `${precip}%` : ''}
                </span>

                <span className="text-sm text-muted w-8 text-right flex-shrink-0">
                  {Math.round(min)}°
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-line relative overflow-hidden">
                  <div
                    className="absolute h-full rounded-full"
                    style={{
                      left: `${fillStart}%`,
                      right: `${100 - fillEnd}%`,
                      background: 'linear-gradient(90deg, #FFC857, #C1561E)',
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-ink w-8 flex-shrink-0">
                  {Math.round(max)}°
                </span>
              </div>
            );
          })}
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
