import { useState, useCallback, useRef } from 'react';
import { weatherApi } from '../api/client';


export function useLocationCards() {
  const [cards, setCards] = useState([]); 
  const [activeIndex, setActiveIndex] = useState(0);
  const requestIdRef = useRef(0);

  const fetchWeatherFor = useCallback(async (location, unit) => {
    const data = await weatherApi.getCurrent(location.latitude, location.longitude, unit);
    return data;
  }, []);

  
  const addLocation = useCallback(
    async (location, unit) => {
      const existingIdx = cards.findIndex(
        (c) =>
          Math.abs(c.location.latitude - location.latitude) < 0.01 &&
          Math.abs(c.location.longitude - location.longitude) < 0.01
      );

      if (existingIdx !== -1) {
        setActiveIndex(existingIdx);
        return;
      }

      const myRequestId = ++requestIdRef.current;
      const newCard = { location, weather: null, loading: true, error: null };
      setCards((prev) => [...prev, newCard]);
      setActiveIndex(cards.length);

      try {
        const weather = await fetchWeatherFor(location, unit);
        if (requestIdRef.current !== myRequestId) return;
        setCards((prev) =>
          prev.map((c) =>
            c.location.latitude === location.latitude && c.location.longitude === location.longitude
              ? { ...c, weather, loading: false }
              : c
          )
        );
      } catch (err) {
        setCards((prev) =>
          prev.map((c) =>
            c.location.latitude === location.latitude && c.location.longitude === location.longitude
              ? { ...c, loading: false, error: err.message || 'Could not load weather.' }
              : c
          )
        );
      }
    },
    [cards, fetchWeatherFor]
  );

  const removeLocation = useCallback((index) => {
    setCards((prev) => prev.filter((_, i) => i !== index));
    setActiveIndex((prev) => {
      if (index < prev) return prev - 1;
      if (index === prev) return Math.max(0, prev - 1);
      return prev;
    });
  }, []);

  const refetchAllForUnit = useCallback(
    async (unit) => {
      setCards((prev) => prev.map((c) => ({ ...c, loading: true })));
      const updated = await Promise.all(
        cards.map(async (c) => {
          try {
            const weather = await fetchWeatherFor(c.location, unit);
            return { ...c, weather, loading: false, error: null };
          } catch (err) {
            return { ...c, loading: false, error: err.message || 'Could not load weather.' };
          }
        })
      );
      setCards(updated);
    },
    [cards, fetchWeatherFor]
  );

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (cards.length === 0 ? 0 : (prev + 1) % cards.length));
  }, [cards.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (cards.length === 0 ? 0 : (prev - 1 + cards.length) % cards.length));
  }, [cards.length]);

  const goTo = useCallback((index) => setActiveIndex(index), []);

  return {
    cards,
    activeIndex,
    activeCard: cards[activeIndex] || null,
    addLocation,
    removeLocation,
    refetchAllForUnit,
    goNext,
    goPrev,
    goTo,
  };
}
