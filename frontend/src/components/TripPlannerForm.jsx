import { useState } from 'react';
import { CalendarRange, Save, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import LocationSearch from './LocationSearch';

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function addDaysISO(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

const DEFAULT_DATES = { startDate: todayISO(), endDate: addDaysISO(4) };

export default function TripPlannerForm({ unit, onSave, saving }) {
  
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [originKey, setOriginKey] = useState(0);
  const [destinationKey, setDestinationKey] = useState(0);

  const [startDate, setStartDate] = useState(DEFAULT_DATES.startDate);
  const [endDate, setEndDate] = useState(DEFAULT_DATES.endDate);
  const [notes, setNotes] = useState('');
  const [submittedBy, setSubmittedBy] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [justSaved, setJustSaved] = useState(false);

  const resetForm = () => {
    setOrigin(null);
    setDestination(null);
   
    setOriginKey((k) => k + 1);
    setDestinationKey((k) => k + 1);
    setStartDate(DEFAULT_DATES.startDate);
    setEndDate(addDaysISO(4));
    setNotes('');
    setSubmittedBy('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);
    setJustSaved(false);

    if (!destination) {
      setValidationError('Search for a destination before planning a trip.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setValidationError('Start date must be before the end date.');
      return;
    }
    const diffDays = Math.round((new Date(endDate) - new Date(startDate)) / 86400000);
    if (diffDays > 30) {
      setValidationError('Trip length cannot exceed 30 days.');
      return;
    }

    const payload = {
      locationName: destination.name,
      country: destination.country,
      admin1: destination.admin1,
      latitude: destination.latitude,
      longitude: destination.longitude,
      startDate,
      endDate,
      unit,
      notes,
      submittedBy: submittedBy.trim() || 'Anonymous',
    };

    
    if (
      origin &&
      (origin.latitude !== destination.latitude || origin.longitude !== destination.longitude)
    ) {
      payload.originLocationName = origin.name;
      payload.originCountry = origin.country;
      payload.originAdmin1 = origin.admin1;
      payload.originLatitude = origin.latitude;
      payload.originLongitude = origin.longitude;
    }

    const succeeded = await onSave(payload);
    if (succeeded) {
      setJustSaved(true);
      resetForm();
      
      setTimeout(() => setJustSaved(false), 4000);
    }
  };

  const isFarOut = (() => {
    const days = Math.round((new Date(startDate) - new Date()) / 86400000);
    return days > 16;
  })();

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-ink/10 rounded-xl p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <CalendarRange size={18} className="text-accent" />
        <h3 className="font-display font-semibold text-lg">Plan a trip</h3>
      </div>

      {justSaved && (
        <div className="flex items-center gap-2 text-sm text-pine bg-pine/10 px-3 py-2 rounded-lg mb-4">
          <CheckCircle2 size={16} />
          Trip saved! Search for your next trip below.
        </div>
      )}

      <div className="grid sm:grid-cols-[1fr_auto_1fr] sm:items-end gap-3 mb-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-mono uppercase text-muted">Traveling from</span>
          <LocationSearch
            key={`origin-${originKey}`}
            compact
            onLocationSelect={setOrigin}
            onError={() => {}}
          />
        </label>

        <ArrowRight size={18} className="hidden sm:block text-muted mb-3" />

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-mono uppercase text-muted">Traveling to</span>
          <LocationSearch
            key={`destination-${destinationKey}`}
            compact
            onLocationSelect={setDestination}
            onError={() => {}}
          />
        </label>
      </div>

      {origin && destination && (origin.latitude !== destination.latitude || origin.longitude !== destination.longitude) && (
        <p className="text-xs text-muted mb-4 bg-paper px-3 py-2 rounded-lg">
          We'll compare weather at your destination against home conditions and adjust
          packing suggestions accordingly.
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-mono uppercase text-muted">Start date</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 rounded-lg border border-ink/15 bg-paper focus:border-accent outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-mono uppercase text-muted">End date</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 rounded-lg border border-ink/15 bg-paper focus:border-accent outline-none"
          />
        </label>
      </div>

      {isFarOut && (
        <p className="text-xs text-muted mb-4 bg-paper px-3 py-2 rounded-lg">
          This trip is more than 16 days away — actual forecasts aren't available yet, so
          we'll show historical averages for these dates instead.
        </p>
      )}

      <label className="flex flex-col gap-1.5 mb-4">
        <span className="text-xs font-mono uppercase text-muted">Your name (optional)</span>
        <input
          type="text"
          value={submittedBy}
          onChange={(e) => setSubmittedBy(e.target.value)}
          placeholder="Anonymous"
          className="px-3 py-2 rounded-lg border border-ink/15 bg-paper focus:border-accent outline-none"
        />
      </label>

      <label className="flex flex-col gap-1.5 mb-4">
        <span className="text-xs font-mono uppercase text-muted">Notes (optional)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="e.g. visiting for a conference"
          className="px-3 py-2 rounded-lg border border-ink/15 bg-paper focus:border-accent outline-none resize-none"
        />
      </label>

      {validationError && (
        <p className="text-sm text-ember mb-4">{validationError}</p>
      )}

      <button
        type="submit"
        disabled={saving}
        style={{ backgroundColor: '#395D80', color: '#FFFFFF' }}
        className="w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        Save this trip
      </button>
    </form>
  );
}