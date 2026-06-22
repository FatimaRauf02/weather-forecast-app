import { CalendarDays } from 'lucide-react';
import WeatherIcon from './WeatherIcon';


export default function DailyForecastList({ daily, dailyDescriptions }) {
  if (!daily?.time?.length) return null;

  const dayCount = daily.time.length;
  const allTemps = [...daily.temperature_2m_max, ...daily.temperature_2m_min];
  const rangeMin = Math.min(...allTemps);
  const rangeMax = Math.max(...allTemps);
  const span = Math.max(1, rangeMax - rangeMin);

  const formatDay = (dateStr, idx) => {
    if (idx === 0) return 'Today';
    if (idx === 1) return 'Tomorrow';
    return new Date(dateStr).toLocaleDateString([], { weekday: 'short' });
  };

  return (
    <div className="px-5 sm:px-8 pb-5">
      <div className="rounded-2xl glass-tile-strong px-4 py-4 sm:px-5">
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays size={17} className="text-white" strokeWidth={2.5} />
          <span className="text-sm font-bold text-white text-shadow-soft">
            {dayCount}-Day Forecast
          </span>
        </div>

        <div className="divide-y divide-white/15">
          {daily.time.map((date, idx) => {
            const max = daily.temperature_2m_max[idx];
            const min = daily.temperature_2m_min[idx];
            const precip = daily.precipitation_probability_max?.[idx] ?? 0;
            const fillStart = ((min - rangeMin) / span) * 100;
            const fillEnd = ((max - rangeMin) / span) * 100;

            return (
              <div key={date} className="flex items-center gap-2.5 sm:gap-3 py-2.5">
                <span className="text-sm font-semibold text-white w-[64px] sm:w-20 flex-shrink-0">
                  {formatDay(date, idx)}
                </span>
                <WeatherIcon icon={dailyDescriptions?.[idx]?.icon} size={20} />
                <span className="text-xs font-semibold text-accentRain w-8 flex-shrink-0 text-right">
                  {precip > 0 ? `${precip}%` : ''}
                </span>
                <span className="text-sm font-medium text-white/85 w-7 text-right flex-shrink-0">
                  {Math.round(min)}°
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-white/20 relative overflow-hidden min-w-[40px]">
                  <div
                    className="absolute h-full rounded-full"
                    style={{
                      left: `${fillStart}%`,
                      right: `${100 - fillEnd}%`,
                      background: 'linear-gradient(90deg, #FFC857, #FF8A65)',
                    }}
                  />
                </div>
                <span className="text-sm font-bold text-white w-7 flex-shrink-0">
                  {Math.round(max)}°
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
