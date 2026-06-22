import { ArrowLeft, X } from 'lucide-react';
import LocationSearch from './LocationSearch';
import WeatherIcon from './WeatherIcon';


export default function ManageCitiesPanel({
  cards,
  activeIndex,
  onSelectLocation,
  onAddLocation,
  onRemove,
  onClose,
  onError,
}) {
  return (
    <div className="fixed inset-0 z-50 sky-clear-night overflow-y-auto">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-full text-white hover:bg-white/15 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>
          <h2 className="font-display text-2xl font-bold text-white text-shadow-soft">
            Manage cities
          </h2>
        </div>

        <LocationSearch
          variant="hero"
          onLocationSelect={(loc) => {
            onAddLocation(loc);
          }}
          onError={onError}
        />

        {cards.length > 0 && (
          <div className="mt-7">
            <p className="text-xs font-mono font-semibold uppercase tracking-wide text-white/80 mb-3">
              Added locations
            </p>
            <div className="flex flex-col gap-2.5">
              {cards.map((card, idx) => (
                <CityRow
                  key={`${card.location.latitude}-${card.location.longitude}`}
                  card={card}
                  active={idx === activeIndex}
                  onClick={() => {
                    onSelectLocation(idx);
                    onClose();
                  }}
                  onRemove={(e) => {
                    e.stopPropagation();
                    onRemove(idx);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {cards.length === 0 && (
          <p className="text-white/70 text-sm mt-8 text-center">
            Search for a city above to add it to your list.
          </p>
        )}
      </div>
    </div>
  );
}

function CityRow({ card, active, onClick, onRemove }) {
  const { location, weather, loading, error } = card;
  const current = weather?.current;
  const daily = weather?.daily;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl px-4 py-3.5 flex items-center justify-between transition-colors group ${
        active ? 'glass-tile-strong ring-2 ring-white/60' : 'glass-tile hover:bg-white/10'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {!loading && !error && current && (
          <WeatherIcon icon={weather.currentDescription?.icon} isDay={current.is_day === 1} size={26} />
        )}
        <div className="min-w-0">
          <p className="text-base font-bold text-white text-shadow-soft truncate">{location.name}</p>
          <p className="text-xs text-white/75 truncate">
            {loading ? 'Loading...' : error ? error : weather?.currentDescription?.label}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {!loading && !error && current && (
          <div className="text-right">
            <p className="text-xl font-bold text-white text-shadow-soft leading-none">
              {Math.round(current.temperature_2m)}°
            </p>
            {daily && (
              <p className="text-xs text-white/75 mt-0.5">
                {Math.round(daily.temperature_2m_max[0])}° / {Math.round(daily.temperature_2m_min[0])}°
              </p>
            )}
          </div>
        )}
        <span
          onClick={onRemove}
          role="button"
          aria-label={`Remove ${location.name}`}
          className="p-1.5 rounded-full text-white/60 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-white/15 transition-all"
        >
          <X size={16} strokeWidth={2.5} />
        </span>
      </div>
    </button>
  );
}
