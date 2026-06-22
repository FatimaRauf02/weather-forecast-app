const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');
const { levenshteinDistance, describeWeatherCode } = require('../utils/helpers');

// A small static list of well-known city names used purely for typo suggestions
// when geocoding returns zero results. Not exhaustive - just enough to catch
// common misspellings gracefully.
const COMMON_CITY_NAMES = [
  'Islamabad', 'Lahore', 'Karachi', 'Rawalpindi', 'Peshawar', 'Multan',
  'London', 'Paris', 'New York', 'Tokyo', 'Dubai', 'Istanbul', 'Berlin',
  'Madrid', 'Rome', 'Toronto', 'Sydney', 'Singapore', 'Bangkok', 'Cairo',
  'Springfield', 'Manchester', 'Boston', 'Chicago', 'Los Angeles', 'Houston',
];

/**
 * GET /api/weather/search?q=Lahore
 * Searches for matching locations. Returns multiple results if the name is ambiguous
 * (e.g. "Springfield" -> Springfield IL, Springfield MA, etc).
 * If nothing is found, attempts to suggest a close match via Levenshtein distance.
 */
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ error: 'Please enter at least 2 characters to search.' });
  }

  try {
    const results = await weatherService.searchLocations(q.trim());

    if (results.length === 0) {
      // Try to find a close match for a "did you mean...?" suggestion
      let bestMatch = null;
      let bestDistance = Infinity;
      for (const name of COMMON_CITY_NAMES) {
        const dist = levenshteinDistance(q.trim(), name);
        if (dist < bestDistance) {
          bestDistance = dist;
          bestMatch = name;
        }
      }

      const suggestion = bestDistance <= 3 ? bestMatch : null;

      return res.status(404).json({
        error: `We couldn't find a place called "${q}".`,
        suggestion,
      });
    }

    return res.json({ results, isAmbiguous: results.length > 1 });
  } catch (err) {
    console.error('Location search failed:', err.message);
    return res.status(503).json({
      error: 'Weather service is temporarily unavailable. Please try again in a moment.',
    });
  }
});

/**
 * GET /api/weather/reverse?lat=33.6&lon=73.0
 * Reverse-geocodes coordinates into a place name (for "use my current location").
 */
router.get('/reverse', async (req, res) => {
  const { lat, lon } = req.query;
  if (lat === undefined || lon === undefined) {
    return res.status(400).json({ error: 'Latitude and longitude are required.' });
  }

  try {
    const location = await weatherService.reverseGeocode(parseFloat(lat), parseFloat(lon));
    return res.json(location);
  } catch (err) {
    console.error('Reverse geocoding failed:', err.message);
    return res.status(503).json({ error: 'Could not determine your location right now.' });
  }
});

/**
 * GET /api/weather/current?lat=33.6&lon=73.0&unit=celsius
 * Returns current weather + 5-day forecast for the given coordinates.
 */
router.get('/current', async (req, res) => {
  const { lat, lon, unit } = req.query;
  if (lat === undefined || lon === undefined) {
    return res.status(400).json({ error: 'Latitude and longitude are required.' });
  }

  try {
    const data = await weatherService.getCurrentAndForecast(
      parseFloat(lat),
      parseFloat(lon),
      unit
    );

    // Attach human-readable descriptions for icons/labels
    const currentDescription = describeWeatherCode(data.current.weathercode);
    const dailyDescriptions = data.daily.weathercode.map(describeWeatherCode);

    // Trim hourly data to the next 24 hours starting from the current hour,
    // rather than shipping the full 10-day hourly array to the client
    let hourly = null;
    let hourlyDescriptions = [];
    if (data.hourly?.time) {
      const nowIso = data.current.time;
      const startIdx = Math.max(0, data.hourly.time.findIndex((t) => t >= nowIso));
      const endIdx = startIdx + 24;
      hourly = {
        time: data.hourly.time.slice(startIdx, endIdx),
        temperature_2m: data.hourly.temperature_2m.slice(startIdx, endIdx),
        weathercode: data.hourly.weathercode.slice(startIdx, endIdx),
        wind_speed_10m: data.hourly.wind_speed_10m.slice(startIdx, endIdx),
        is_day: data.hourly.is_day.slice(startIdx, endIdx),
        precipitation_probability: data.hourly.precipitation_probability.slice(startIdx, endIdx),
      };
      hourlyDescriptions = hourly.weathercode.map(describeWeatherCode);
    }

    return res.json({
      ...data,
      hourly,
      currentDescription,
      dailyDescriptions,
      hourlyDescriptions,
    });
  } catch (err) {
    console.error('Weather fetch failed:', err.message);
    return res.status(503).json({
      error: 'Could not fetch weather data right now. Please try again shortly.',
    });
  }
});

module.exports = router;
