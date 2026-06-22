import WeatherIcon from './WeatherIcon';

export default function HourlyStrip({ hourly, hourlyDescriptions }) {
  if (!hourly?.time?.length) return null;

  const formatHour = (iso, idx) => {
    if (idx === 0) return 'Now';
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: 'numeric' }).replace(' ', '');
  };

  return (
    <div className="px-5 sm:px-8 pb-5">
      <div className="glass-tile-strong rounded-2xl px-4 py-4">
        <div className="flex gap-5 overflow-x-auto scrollbar-thin pb-1">
          {hourly.time.map((t, idx) => (
            <div key={t} className="flex flex-col items-center gap-2 flex-shrink-0 min-w-[44px]">
              <span className="text-xs font-mono font-semibold text-white/90">{formatHour(t, idx)}</span>
              <WeatherIcon
                icon={hourlyDescriptions?.[idx]?.icon}
                isDay={hourly.is_day?.[idx] === 1}
                size={22}
              />
              <span className="text-sm font-bold text-white">
                {Math.round(hourly.temperature_2m[idx])}°
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
