import { useState, useRef, useCallback, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { weatherApi } from '../api/client';
import { useGeolocation } from '../hooks/useGeolocation';

let debounceTimer = null;

export default function LocationSearch({ onLocationSelect, onError, compact = false, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const { getPosition, loading: locating } = useGeolocation();


  useEffect(() => {
    setQuery((prev) => (prev === '' ? initialQuery : prev));
  }, [initialQuery]);

 
  const runSearch = useCallback(
    (value) => {
      clearTimeout(debounceTimer);
      if (value.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      debounceTimer = setTimeout(async () => {
        setSearching(true);
        try {
          const data = await weatherApi.search(value);
          setSuggestions(data.results || []);
          setShowDropdown(true);
        } catch (err) {
          setSuggestions([]);
          
          if (err.suggestion) {
            setSuggestions([{ isSuggestionPrompt: true, suggestionText: err.suggestion }]);
            setShowDropdown(true);
          }
        } finally {
          setSearching(false);
        }
      }, 350);
    },
    []
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    runSearch(value);
  };

  const handleSelect = (location) => {
    setQuery(`${location.name}${location.admin1 ? `, ${location.admin1}` : ''}`);
    setShowDropdown(false);
    setSuggestions([]);
    onLocationSelect(location);
  };

  const handleUseMyLocation = async () => {
    try {
      const { latitude, longitude } = await getPosition();
      const place = await weatherApi.reverseGeocode(latitude, longitude);
      setQuery(`${place.name}${place.admin1 ? `, ${place.admin1}` : ''}`);
      onLocationSelect(place);
    } catch (err) {
      onError(err.message || 'Could not detect your location.');
    }
  };

  const handleSuggestionClick = (suggestionText) => {
    setQuery(suggestionText);
    runSearch(suggestionText);
  };

  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted ${compact ? '' : ''}`}
            size={compact ? 16 : 18}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            placeholder={compact ? 'Search a city...' : 'Search a city, town, or landmark...'}
            className={`w-full rounded-lg bg-card border border-ink/10 font-body text-ink placeholder:text-muted  outline-none transition-colors ${
              compact ? 'pl-9 pr-3 py-2.5 text-sm' : 'pl-10 pr-4 py-3'
            }`}
          />
          {searching && (
            <Loader2
              className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted"
              size={compact ? 16 : 18}
            />
          )}

          {showDropdown && suggestions.length > 0 && (
            <ul className="absolute z-20 mt-1 w-full bg-card border border-ink/10 rounded-lg shadow-lg overflow-hidden">
              {suggestions.map((s, idx) =>
                s.isSuggestionPrompt ? (
                  <li
                    key="suggestion"
                    onClick={() => handleSuggestionClick(s.suggestionText)}
                    className="px-4 py-3 cursor-pointer hover:bg-paper text-sm text-muted"
                  >
                    Did you mean <span style={{ color: "#395D80" }} className="font-medium">{s.suggestionText}</span>?
                  </li>
                ) : (
                  <li
                    key={`${s.latitude}-${s.longitude}-${idx}`}
                    onClick={() => handleSelect(s)}
                    className="px-4 py-3 cursor-pointer hover:bg-paper flex items-center justify-between border-b border-ink/5 last:border-0"
                  >
                    <span className="font-medium">{s.name}</span>
                    <span className="text-sm text-muted">
                      {[s.admin1, s.country].filter(Boolean).join(', ')}
                    </span>
                  </li>
                )
              )}
            </ul>
          )}
        </div>

        <button
          onClick={handleUseMyLocation}
          disabled={locating}
          type="button"
          style={{ backgroundColor: "#395D80" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2E4D6B")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#395D80")}
          className={`flex items-center gap-2 rounded-lg text-white font-medium transition-opacity disabled:opacity-60 whitespace-nowrap ${
            compact ? 'px-3 py-2.5' : 'px-4 py-3'
          }`}
          title="Use my current location"
        >
          {locating ? (
            <Loader2 size={compact ? 16 : 18} className="animate-spin" />
          ) : (
            <MapPin size={compact ? 16 : 18} />
          )}
          {!compact && <span className="hidden sm:inline">My location</span>}
        </button>
      </div>
    </div>
  );
}
