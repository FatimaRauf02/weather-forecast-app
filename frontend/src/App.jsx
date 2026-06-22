import { useState, useEffect, useCallback } from 'react';
import { Compass } from 'lucide-react';
import LocationSearch from './components/LocationSearch';
import SkyBackground from './components/SkyBackground';
import WeatherHero from './components/WeatherHero';
import LocationDots from './components/LocationDots';
import ManageCitiesPanel from './components/ManageCitiesPanel';
import HourlyStrip from './components/HourlyStrip';
import DailyForecastList from './components/DailyForecastList';
import DataGrid from './components/DataGrid';
import ErrorBanner from './components/ErrorBanner';
import TripPlannerForm from './components/TripPlannerForm';
import TripCard from './components/TripCard';
import TripComparison from './components/TripComparison';
import TripAlertBanner from './components/TripAlertBanner';
import ExportMenu from './components/ExportMenu';
import LocationMap from './components/LocationMap';
import Footer from './components/Footer';
import { tripsApi } from './api/client';
import { useLocationCards } from './hooks/useLocationCards';

export default function App() {
  const [unit, setUnit] = useState('celsius');
  const [error, setError] = useState(null);
  const [showManageCities, setShowManageCities] = useState(false);

  const {
    cards,
    activeIndex,
    activeCard,
    addLocation,
    removeLocation,
    refetchAllForUnit,
    goNext,
    goPrev,
    goTo,
  } = useLocationCards();

  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [savingTrip, setSavingTrip] = useState(false);
  const [updatingTripId, setUpdatingTripId] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const fetchTrips = useCallback(async () => {
    setLoadingTrips(true);
    try {
      const data = await tripsApi.list();
      setTrips(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingTrips(false);
    }
  }, []);

  const fetchAlerts = useCallback(async () => {
    try {
      const data = await tripsApi.alerts();
      setAlerts(data.alerts || []);
    } catch {
      
    }
  }, []);

  useEffect(() => {
    fetchTrips();
    fetchAlerts();
  }, [fetchTrips, fetchAlerts]);

  const handleLocationSelect = async (loc) => {
    setError(null);
    try {
      await addLocation(loc, unit);
    } catch (err) {
      setError(err.message || 'Could not load weather for this location.');
    }
  };

  const handleToggleUnit = async () => {
    const next = unit === 'celsius' ? 'fahrenheit' : 'celsius';
    setUnit(next);
    if (cards.length > 0) {
      try {
        await refetchAllForUnit(next);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleRemoveActive = () => {
    if (cards.length > 0) removeLocation(activeIndex);
  };

  const handleSaveTrip = async (payload) => {
    setSavingTrip(true);
    setError(null);
    try {
      const trip = await tripsApi.create(payload);
      setTrips((prev) => [trip, ...prev]);
      fetchAlerts();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setSavingTrip(false);
    }
  };

  const handleUpdateTrip = async (id, payload) => {
    setUpdatingTripId(id);
    try {
      const updated = await tripsApi.update(id, payload);
      setTrips((prev) => prev.map((t) => (t._id === id ? updated : t)));
      fetchAlerts();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingTripId(null);
    }
  };

  const handleDeleteTrip = async (id) => {
    try {
      await tripsApi.remove(id);
      setTrips((prev) => prev.filter((t) => t._id !== id));
      setCompareIds((prev) => prev.filter((tid) => tid !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((tid) => tid !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const comparingTrips = trips.filter((t) => compareIds.includes(t._id));

  const activeWeather = activeCard?.weather;
  const activeWeatherCode = activeWeather?.current?.weathercode;

  const activeIsDay = activeWeather?.current ? activeWeather.current.is_day === 1 : true;

  return (
    <SkyBackground weatherCode={activeWeatherCode} isDay={activeIsDay}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Compass size={18} className="text-white" strokeWidth={2.5} />
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-white text-shadow-soft">
            Waypoint Weather
          </span>
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-10 pb-12">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white text-shadow-soft mb-2">
            Know before you go
          </h1>
          <p className="text-white/90 text-shadow-soft mb-6">
            Check current conditions, plan ahead for a trip, and know exactly what to pack.
          </p>
          <LocationSearch variant="hero" onLocationSelect={handleLocationSelect} onError={setError} />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="px-5 sm:px-8 pt-2">
            <LocationDots
              count={cards.length}
              activeIndex={activeIndex}
              onGoTo={goTo}
              onAddClick={() => setShowManageCities(true)}
            />
          </div>

          {}
          <WeatherHero
            card={activeCard}
            unit={unit}
            onToggleUnit={handleToggleUnit}
            onPrev={goPrev}
            onNext={goNext}
            onRemove={cards.length > 1 ? handleRemoveActive : undefined}
            showNav={cards.length > 1}
          />

          {activeWeather && (
            <>
              {}
              <DailyForecastList daily={activeWeather.daily} dailyDescriptions={activeWeather.dailyDescriptions} />
              <HourlyStrip hourly={activeWeather.hourly} hourlyDescriptions={activeWeather.hourlyDescriptions} />
              <DataGrid weather={activeWeather} unit={unit} />
            </>
          )}
        </div>
      )}

      {showManageCities && (
        <ManageCitiesPanel
          cards={cards}
          activeIndex={activeIndex}
          onSelectLocation={goTo}
          onAddLocation={handleLocationSelect}
          onRemove={removeLocation}
          onClose={() => setShowManageCities(false)}
          onError={setError}
        />
      )}

      {}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <TripAlertBanner alerts={alerts} />
        <ErrorBanner message={error} onDismiss={() => setError(null)} />

        {activeCard?.location && (
          <div className="mb-6 rounded-2xl overflow-hidden glass-tile-strong p-2">
            <LocationMap location={activeCard.location} />
          </div>
        )}

        <div className="rounded-2xl bg-card p-5 sm:p-6 shadow-lg">
          <TripPlannerForm unit={unit} onSave={handleSaveTrip} saving={savingTrip} />
        </div>

        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-bold text-white text-shadow-soft">Saved trips</h2>
            <ExportMenu trips={trips} />
          </div>

          {comparingTrips.length > 0 && (
            <div className="rounded-2xl bg-card shadow-lg p-5 sm:p-6 mb-4">
              <TripComparison trips={comparingTrips} onClear={() => setCompareIds([])} />
            </div>
          )}

          {loadingTrips ? (
            <p className="text-white/85 text-sm text-shadow-soft">Loading saved trips...</p>
          ) : trips.length === 0 ? (
            <p className="text-white/85 text-sm glass-tile-strong rounded-xl p-6 text-center text-shadow-soft">
              No trips saved yet. Search a location above and plan your first trip.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {trips.map((trip) => (
                <div key={trip._id} className="rounded-2xl bg-card shadow-lg overflow-hidden">
                  <TripCard
                    trip={trip}
                    onUpdate={handleUpdateTrip}
                    onDelete={handleDeleteTrip}
                    onToggleCompare={handleToggleCompare}
                    isComparing={compareIds.includes(trip._id)}
                    updating={updatingTripId === trip._id}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        <Footer />
      </div>
    </SkyBackground>
  );
}
