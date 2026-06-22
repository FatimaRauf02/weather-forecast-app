import { X } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { describeIconForCode } from '../utils/weatherCodes';

export default function TripComparison({ trips, onClear }) {
  if (!trips || trips.length === 0) return null;

  const avgTemp = (trip) => {
    const avg = trip.forecast.reduce((sum, d) => sum + (d.tempMax + d.tempMin) / 2, 0) / trip.forecast.length;
    return Math.round(avg * 10) / 10;
  };

  const avgRainChance = (trip) => {
    const avg = trip.forecast.reduce((sum, d) => sum + d.precipitationChance, 0) / trip.forecast.length;
    return Math.round(avg);
  };

  return (
    <div className="bg-card rounded-xl p-5 mb-6 border" style={{ borderColor: 'rgba(57,93,128,0.30)' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg">Trip comparison</h3>
        <button onClick={onClear} className="text-muted hover:text-ink flex items-center gap-1 text-sm">
          <X size={14} /> Clear
        </button>
      </div>

      <div className={`grid gap-4 ${trips.length === 2 ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
        {trips.map((trip) => {
          const unitSymbol = trip.unit === 'fahrenheit' ? '°F' : '°C';
          return (
            <div key={trip._id} className="bg-paper rounded-lg p-4">
              <h4 className="font-medium mb-1">{trip.locationName}</h4>
              <p className="text-xs text-muted font-mono mb-3">{trip.startDate} → {trip.endDate}</p>

              <div className="flex items-center gap-3 mb-3">
                <WeatherIcon icon={describeIconForCode(trip.forecast[0]?.weatherCode)} size={32} />
                <div>
                  <div className="font-display text-2xl font-semibold">
                    {avgTemp(trip)}{unitSymbol}
                  </div>
                  <span className="text-xs text-muted">avg temp</span>
                </div>
              </div>

              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted">Avg rain chance</span>
                  <span className="font-medium">{avgRainChance(trip)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">High</span>
                  <span className="font-medium">
                    {Math.max(...trip.forecast.map((d) => d.tempMax))}{unitSymbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Low</span>
                  <span className="font-medium">
                    {Math.min(...trip.forecast.map((d) => d.tempMin))}{unitSymbol}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {trips.length === 2 && (
        <p className="text-sm mt-4 font-medium" style={{ color: '#395D80' }}>
          {avgTemp(trips[0]) > avgTemp(trips[1])
            ? `${trips[0].locationName} will be warmer on average.`
            : avgTemp(trips[0]) < avgTemp(trips[1])
            ? `${trips[1].locationName} will be warmer on average.`
            : 'Both locations have similar average temperatures.'}
        </p>
      )}
    </div>
  );
}
