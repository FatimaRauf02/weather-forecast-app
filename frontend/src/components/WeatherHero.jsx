import { ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react';
import WeatherIcon from './WeatherIcon';

export default function WeatherHero({
  card,
  unit,
  onToggleUnit,
  onPrev,
  onNext,
  onRemove,
  showNav,
}) {
  if (!card) return null;
  const { location, weather, loading, error } = card;
  const unitSymbol = unit === 'fahrenheit' ? '°F' : '°C';

  return (
    <div className="px-5 sm:px-8 pt-6 pb-5 animate-fade-in-up">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          {showNav && (
            <button
              onClick={onPrev}
              className="p-1.5 -ml-1.5 rounded-full text-white hover:bg-white/15 transition-colors flex-shrink-0"
              aria-label="Previous location"
            >
              <ChevronLeft size={22} strokeWidth={2.5} />
            </button>
          )}
          <div className="flex items-center gap-1.5 min-w-0">
            <MapPin size={15} className="text-white flex-shrink-0" strokeWidth={2.5} />
            <h1 className="font-display text-xl sm:text-2xl font-bold text-white text-shadow-soft truncate">
              {location.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onToggleUnit}
            className="font-mono text-xs font-semibold px-3 py-1.5 rounded-full glass-tile-strong text-white hover:bg-white/30 transition-colors"
          >
            {unitSymbol}
          </button>
          {showNav && onRemove && (
            <button
              onClick={onRemove}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors"
              aria-label="Remove this location"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          )}
          {showNav && (
            <button
              onClick={onNext}
              className="p-1.5 rounded-full text-white hover:bg-white/15 transition-colors"
              aria-label="Next location"
            >
              <ChevronRight size={22} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>

      <p className="text-xs font-mono font-semibold uppercase tracking-wide text-white/90 text-shadow-soft mb-4 ml-[22px]">
        {[location.admin1, location.country].filter(Boolean).join(', ')}
      </p>

      {}
      <div className="rounded-2xl glass-tile-strong px-5 py-5 sm:px-7 sm:py-6">
        {loading ? (
          <p className="text-white text-shadow-soft text-sm py-6 text-center">
            Fetching weather for {location.name}...
          </p>
        ) : error || !weather ? (
          <p className="text-white text-shadow-soft text-sm py-6 text-center">
            {error || 'Could not load weather for this location.'}
          </p>
        ) : (
          <HeroCardContent weather={weather} unit={unit} />
        )}
      </div>
    </div>
  );
}

function HeroCardContent({ weather, unit }) {
  const { current, daily, currentDescription } = weather;
  const isDay = current.is_day === 1;
  const todayHigh = daily?.temperature_2m_max?.[0];
  const todayLow = daily?.temperature_2m_min?.[0];
  const rainChance = daily?.precipitation_probability_max?.[0] ?? 0;

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex items-start font-display font-bold text-white text-shadow-soft leading-none">
          <span className="text-6xl sm:text-7xl">{Math.round(current.temperature_2m)}</span>
          <span className="text-3xl sm:text-4xl mt-1">°</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <WeatherIcon icon={currentDescription?.icon} isDay={isDay} size={48} />
          <span className="text-sm font-semibold text-white text-shadow-soft text-center max-w-[110px]">
            {currentDescription?.label}
          </span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-white/25 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Feels Like" value={`${Math.round(current.apparent_temperature)}°`} />
        <Stat label="High" value={todayHigh != null ? `${Math.round(todayHigh)}°` : '--'} />
        <Stat label="Low" value={todayLow != null ? `${Math.round(todayLow)}°` : '--'} />
        <Stat label="Rain" value={`${rainChance}%`} />
      </div>
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-mono font-semibold uppercase tracking-wide text-white/85 text-shadow-soft">
        {label}
      </p>
      <p className="text-lg font-bold text-white text-shadow-soft">{value}</p>
    </div>
  );
}
