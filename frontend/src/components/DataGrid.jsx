import { Droplets, Wind, Gauge, Sunrise, Sunset, CloudRain } from 'lucide-react';

export default function DataGrid({ weather, unit }) {
  if (!weather?.current) return null;
  const { current, currentUnits, daily } = weather;
  const windUnit = currentUnits?.wind_speed_10m || (unit === 'fahrenheit' ? 'mph' : 'km/h');

  const formatTime = (iso) => {
    if (!iso) return '--';
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const uvLabel = (uv) => {
    if (uv == null) return '--';
    if (uv < 3) return 'Low';
    if (uv < 6) return 'Moderate';
    if (uv < 8) return 'High';
    if (uv < 11) return 'Very High';
    return 'Extreme';
  };

  return (
    <div className="px-5 sm:px-8 pb-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Tile
          icon={Droplets}
          accent="accentHumidity"
          label="Humidity"
          value={`${current.relative_humidity_2m}%`}
        />
        <Tile
          icon={Wind}
          accent="accentWind"
          label="Wind"
          value={`${Math.round(current.wind_speed_10m)} ${windUnit}`}
        />
        <Tile
          icon={Gauge}
          accent="accentUv"
          label="UV index"
          value={current.uv_index != null ? `${current.uv_index.toFixed(1)} - ${uvLabel(current.uv_index)}` : '--'}
        />
        <Tile
          icon={CloudRain}
          accent="accentRain"
          label="Rain chance"
          value={`${daily?.precipitation_probability_max?.[0] ?? 0}%`}
        />
        <Tile
          icon={Sunrise}
          accent="sun"
          label="Sunrise"
          value={formatTime(daily?.sunrise?.[0])}
        />
        <Tile
          icon={Sunset}
          accent="accentPressure"
          label="Sunset"
          value={formatTime(daily?.sunset?.[0])}
        />
      </div>
    </div>
  );
}

const ACCENT_CLASSES = {
  accentHumidity: 'text-accentHumidity',
  accentWind: 'text-accentWind',
  accentUv: 'text-accentUv',
  accentRain: 'text-accentRain',
  sun: 'text-sun',
  accentPressure: 'text-accentPressure',
};

function Tile({ icon: Icon, accent, label, value }) {
  return (
    <div className="glass-tile-strong rounded-xl p-3.5 flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <Icon size={15} className={ACCENT_CLASSES[accent]} strokeWidth={2.5} />
        <span className="text-xs text-white/90 uppercase tracking-wide font-mono font-semibold">{label}</span>
      </div>
      <span className="text-base font-bold text-white">{value}</span>
    </div>
  );
}
