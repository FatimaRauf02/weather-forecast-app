import WeatherIcon from './WeatherIcon';

export default function ForecastStrip({ weather, unit }) {
  if (!weather?.daily) return null;

  const { daily, dailyDescriptions } = weather;
  const unitSymbol = unit === 'fahrenheit' ? '°' : '°';

  const formatDay = (dateStr, idx) => {
    if (idx === 0) return 'Today';
    const d = new Date(dateStr);
    return d.toLocaleDateString([], { weekday: 'short' });
  };

  return (
    <div className="mt-6">
      <h3 className="text-sm font-mono uppercase tracking-wide text-muted mb-3">5-Day Forecast</h3>
      <div className="flex overflow-x-auto scrollbar-thin gap-0 -mx-1 px-1">
        {daily.time.map((date, idx) => (
          <div
            key={date}
            className="flex-shrink-0 w-[140px] sm:w-auto sm:flex-1 bg-card border border-ink/10 rounded-xl p-4 flex flex-col items-center gap-2 mx-1 relative ticket-edge"
          >
            <span className="font-mono text-xs uppercase text-muted">{formatDay(date, idx)}</span>
            <WeatherIcon icon={dailyDescriptions?.[idx]?.icon} size={32} />
            <div className="flex items-baseline gap-1.5 font-display">
              <span className="text-lg font-semibold text-ink">
                {Math.round(daily.temperature_2m_max[idx])}{unitSymbol}
              </span>
              <span className="text-sm text-muted">
                {Math.round(daily.temperature_2m_min[idx])}{unitSymbol}
              </span>
            </div>
            <span className="text-xs text-pine font-mono">
              {daily.precipitation_probability_max?.[idx] ?? 0}% rain
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
