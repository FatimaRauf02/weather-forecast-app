import { Droplets, Wind, Sunrise, Gauge } from 'lucide-react';
import WeatherIcon from './WeatherIcon';

export default function CurrentWeatherPanel({ weather, location, unit, onToggleUnit }) {
  if (!weather) return null;

  const { current, currentUnits, currentDescription } = weather;
  const unitSymbol = unit === 'fahrenheit' ? '°F' : '°C';
  const windUnit = currentUnits?.wind_speed_10m || (unit === 'fahrenheit' ? 'mph' : 'km/h');

  const formatTime = (iso) => {
    if (!iso) return '--';
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="bg-card rounded-2xl border border-ink/10 p-6 sm:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm text-muted font-mono uppercase tracking-wide">
            {location?.admin1 ? `${location.admin1}, ` : ''}{location?.country || ''}
          </p>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-ink mt-1">
            {location?.name || 'Current location'}
          </h2>
        </div>
        <button
          onClick={onToggleUnit}
          className="text-sm font-mono px-3 py-1.5 rounded-full border border-ink/15 hover:border-pine hover:text-pine transition-colors"
        >
          °C / °F
        </button>
      </div>

      <div className="flex items-center gap-6 mb-8">
        <WeatherIcon icon={currentDescription?.icon} size={72} />
        <div>
          <div className="font-display text-6xl sm:text-7xl font-light text-ink leading-none">
            {Math.round(current.temperature_2m)}
            <span className="text-3xl sm:text-4xl align-top text-muted">{unitSymbol}</span>
          </div>
          <p className="text-muted mt-1">
            {currentDescription?.label} · Feels like {Math.round(current.apparent_temperature)}{unitSymbol}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-ink/10 font-mono">
        <DataPoint icon={Droplets} label="Humidity" value={`${current.relative_humidity_2m}%`} />
        <DataPoint
          icon={Wind}
          label="Wind"
          value={`${Math.round(current.wind_speed_10m)} ${windUnit}`}
        />
        <DataPoint icon={Gauge} label="UV index" value={current.uv_index?.toFixed(1) ?? '--'} />
        <DataPoint icon={Sunrise} label="Sunrise" value={formatTime(weather.daily?.sunrise?.[0])} />
      </div>
    </div>
  );
}

function DataPoint({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-muted text-xs uppercase tracking-wide">
        <Icon size={14} />
        {label}
      </div>
      <span className="text-ink font-medium text-base">{value}</span>
    </div>
  );
}
