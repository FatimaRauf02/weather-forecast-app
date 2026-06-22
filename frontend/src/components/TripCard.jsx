import { useState } from 'react';
import { Trash2, Pencil, X, Check, ShirtIcon, History, Home } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { describeIconForCode } from '../utils/weatherCodes';

const BLUE = '#395D80';
const BLUE_DARK = '#2E4D6B';

function avgTemp(forecast) {
  if (!forecast?.length) return null;
  const sum = forecast.reduce((acc, d) => acc + (d.tempMax + d.tempMin) / 2, 0);
  return sum / forecast.length;
}

export default function TripCard({ trip, onUpdate, onDelete, onToggleCompare, isComparing, updating }) {
  const [editing, setEditing] = useState(false);
  const [startDate, setStartDate] = useState(trip.startDate);
  const [endDate, setEndDate] = useState(trip.endDate);
  const [notes, setNotes] = useState(trip.notes || '');

  const unitSymbol = trip.unit === 'fahrenheit' ? '°F' : '°C';
  const hasHistorical = trip.forecast.some((d) => d.isHistoricalAverage);

  const destAvg = avgTemp(trip.forecast);
  const originAvg = trip.hasOrigin ? avgTemp(trip.originForecast) : null;
  const tempDelta = destAvg != null && originAvg != null ? Math.round((destAvg - originAvg) * 10) / 10 : null;

  const handleSaveEdit = () => {
    onUpdate(trip._id, { startDate, endDate, notes });
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setStartDate(trip.startDate);
    setEndDate(trip.endDate);
    setNotes(trip.notes || '');
    setEditing(false);
  };

  return (
    <div
      className="bg-card border rounded-xl p-5 transition-colors"
      style={isComparing
        ? { borderColor: BLUE, boxShadow: `0 0 0 1px ${BLUE}` }
        : { borderColor: 'rgba(34,40,46,0.10)' }
      }
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          {trip.hasOrigin ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-mono text-muted flex items-center gap-1">
                <Home size={11} /> {trip.originLocationName}
              </span>
              <span className="text-xs text-muted">→</span>
              <h4 className="font-display font-semibold text-lg">{trip.locationName}</h4>
            </div>
          ) : (
            <h4 className="font-display font-semibold text-lg">{trip.locationName}</h4>
          )}
          <p className="text-xs text-muted font-mono">
            {[trip.admin1, trip.country].filter(Boolean).join(', ')} · by {trip.submittedBy}
          </p>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setEditing((v) => !v)}
            className="p-2 rounded-lg hover:bg-paper text-muted transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.color = BLUE)}
            onMouseLeave={(e) => (e.currentTarget.style.color = '')}
            title="Edit trip"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(trip._id)}
            className="p-2 rounded-lg hover:bg-paper text-muted hover:text-ember transition-colors"
            title="Delete trip"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {editing ? (
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1.5 text-sm rounded-lg border border-ink/15 bg-paper"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1.5 text-sm rounded-lg border border-ink/15 bg-paper"
            />
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-2 py-1.5 text-sm rounded-lg border border-ink/15 bg-paper resize-none"
          />
          <div className="flex gap-2">
            {/* Save button — steel blue */}
            <button
              onClick={handleSaveEdit}
              disabled={updating}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg text-white disabled:opacity-60"
              style={{ backgroundColor: BLUE }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BLUE_DARK)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BLUE)}
            >
              <Check size={14} /> Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-ink/15"
            >
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted mb-3 font-mono">
            {trip.startDate} → {trip.endDate}
            {hasHistorical && (
              <span className="ml-2 inline-flex items-center gap-1 text-amber-600">
                <History size={12} /> historical avg
              </span>
            )}
          </p>

          {trip.hasOrigin && tempDelta !== null && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-paper rounded-lg px-3 py-2">
                <span className="text-xs font-mono uppercase text-muted block mb-0.5">
                  Home ({trip.originLocationName})
                </span>
                <span className="text-sm font-medium">{Math.round(originAvg)}{unitSymbol} avg</span>
              </div>
              <div className="bg-paper rounded-lg px-3 py-2">
                <span className="text-xs font-mono uppercase text-muted block mb-0.5">
                  Destination
                </span>
                <span className="text-sm font-medium">
                  {Math.round(destAvg)}{unitSymbol} avg
                  {/* cooler delta stays blue, warmer stays ember — no pine */}
                  <span style={{ color: tempDelta > 0 ? '#C1561E' : BLUE }}>
                    {' '}({tempDelta > 0 ? '+' : ''}{tempDelta}°)
                  </span>
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-2 overflow-x-auto scrollbar-thin mb-3">
            {trip.forecast.map((day) => (
              <div
                key={day.date}
                className="flex-shrink-0 flex flex-col items-center gap-1 bg-paper rounded-lg px-3 py-2 min-w-[64px]"
              >
                <span className="text-xs font-mono text-muted">{day.date.slice(5)}</span>
                <WeatherIcon icon={describeIconForCode(day.weatherCode)} size={18} />
                <span className="text-xs font-medium">
                  {Math.round(day.tempMax)}/{Math.round(day.tempMin)}{unitSymbol}
                </span>
              </div>
            ))}
          </div>

          {trip.notes && <p className="text-sm text-ink/80 mb-3 italic">"{trip.notes}"</p>}

          {trip.packingSuggestions?.length > 0 && (
            <div className="bg-paper rounded-lg p-3 mb-3">
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-muted mb-1.5">
                <ShirtIcon size={14} /> Pack for this trip
              </div>
              <ul className="text-sm text-ink/90 space-y-1">
                {trip.packingSuggestions.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {}
      <button
        onClick={() => onToggleCompare(trip._id)}
        className="w-full text-sm py-2 rounded-lg border transition-colors"
        style={isComparing
          ? { backgroundColor: BLUE, color: '#fff', borderColor: BLUE }
          : { borderColor: 'rgba(34,40,46,0.15)', color: '#8A8579' }
        }
        onMouseEnter={(e) => {
          if (!isComparing) {
            e.currentTarget.style.borderColor = BLUE;
            e.currentTarget.style.color = BLUE;
          }
        }}
        onMouseLeave={(e) => {
          if (!isComparing) {
            e.currentTarget.style.borderColor = 'rgba(34,40,46,0.15)';
            e.currentTarget.style.color = '#8A8579';
          }
        }}
      >
        {isComparing ? 'Selected for comparison' : 'Compare this trip'}
      </button>
    </div>
  );
}
