/**
 * Levenshtein distance - used to suggest "did you mean...?" for misspelled location names.
 */
function levenshteinDistance(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1].toLowerCase() === b[j - 1].toLowerCase()) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

/**
 * Open-Meteo WMO weather codes mapped to human-readable descriptions.
 * https://open-meteo.com/en/docs (WMO Weather interpretation codes)
 */
const WEATHER_CODE_MAP = {
  0: { label: 'Clear sky', icon: 'sun' },
  1: { label: 'Mainly clear', icon: 'sun' },
  2: { label: 'Partly cloudy', icon: 'cloud-sun' },
  3: { label: 'Overcast', icon: 'cloud' },
  45: { label: 'Fog', icon: 'fog' },
  48: { label: 'Depositing rime fog', icon: 'fog' },
  51: { label: 'Light drizzle', icon: 'drizzle' },
  53: { label: 'Moderate drizzle', icon: 'drizzle' },
  55: { label: 'Dense drizzle', icon: 'drizzle' },
  56: { label: 'Light freezing drizzle', icon: 'sleet' },
  57: { label: 'Dense freezing drizzle', icon: 'sleet' },
  61: { label: 'Slight rain', icon: 'rain' },
  63: { label: 'Moderate rain', icon: 'rain' },
  65: { label: 'Heavy rain', icon: 'rain' },
  66: { label: 'Light freezing rain', icon: 'sleet' },
  67: { label: 'Heavy freezing rain', icon: 'sleet' },
  71: { label: 'Slight snow fall', icon: 'snow' },
  73: { label: 'Moderate snow fall', icon: 'snow' },
  75: { label: 'Heavy snow fall', icon: 'snow' },
  77: { label: 'Snow grains', icon: 'snow' },
  80: { label: 'Slight rain showers', icon: 'rain' },
  81: { label: 'Moderate rain showers', icon: 'rain' },
  82: { label: 'Violent rain showers', icon: 'rain' },
  85: { label: 'Slight snow showers', icon: 'snow' },
  86: { label: 'Heavy snow showers', icon: 'snow' },
  95: { label: 'Thunderstorm', icon: 'storm' },
  96: { label: 'Thunderstorm with slight hail', icon: 'storm' },
  99: { label: 'Thunderstorm with heavy hail', icon: 'storm' },
};

function describeWeatherCode(code) {
  return WEATHER_CODE_MAP[code] || { label: 'Unknown', icon: 'unknown' };
}

/**
 * Summarize a forecast array into max/min temp and worst-case precipitation/conditions.
 * Shared helper used by both the standalone and relative packing-suggestion functions.
 */
function summarizeForecast(forecast, unit) {
  let maxTemp = -Infinity;
  let minTemp = Infinity;
  let maxPrecip = 0;
  let hasSnow = false;
  let hasStorm = false;

  for (const day of forecast) {
    if (day.tempMax > maxTemp) maxTemp = day.tempMax;
    if (day.tempMin < minTemp) minTemp = day.tempMin;
    if (day.precipitationChance > maxPrecip) maxPrecip = day.precipitationChance;
    if ([71, 73, 75, 77, 85, 86].includes(day.weatherCode)) hasSnow = true;
    if ([95, 96, 99].includes(day.weatherCode)) hasStorm = true;
  }

  const toCelsius = (t) => (unit === 'fahrenheit' ? ((t - 32) * 5) / 9 : t);

  return {
    maxTemp, minTemp, maxPrecip, hasSnow, hasStorm,
    maxC: toCelsius(maxTemp),
    minC: toCelsius(minTemp),
    avgC: toCelsius((maxTemp + minTemp) / 2),
  };
}

/**
 * Relative "what to pack" suggestions that compare a destination's forecast against
 * the traveler's home (origin) forecast over the same trip dates. This is more useful
 * than absolute thresholds alone - "8 degrees hotter than home" is more actionable for
 * a traveler deciding what to pack than just "it will be hot" in isolation.
 */
function generateRelativePackingSuggestions(destForecast, originForecast, unit = 'celsius') {
  const dest = summarizeForecast(destForecast, unit);
  const origin = summarizeForecast(originForecast, unit);
  const suggestions = new Set();

  const tempDelta = Math.round((dest.avgC - origin.avgC) * 10) / 10;
  const absDelta = Math.abs(tempDelta);

  if (absDelta >= 3) {
    if (tempDelta > 0) {
      suggestions.add(
        `It'll be about ${absDelta}°C warmer than home - pack lighter than you would normally`
      );
    } else {
      suggestions.add(
        `It'll be about ${absDelta}°C cooler than home - pack warmer layers than you would normally`
      );
    }
  } else {
    suggestions.add("Temperatures are similar to home - your usual wardrobe should work fine");
  }

  if (dest.maxPrecip >= 50 && origin.maxPrecip < 25) {
    suggestions.add('Rain is much more likely at your destination than at home - pack a rain jacket or umbrella');
  } else if (dest.maxPrecip >= 50) {
    suggestions.add('Pack an umbrella or raincoat - rain is likely at your destination');
  }

  if (dest.hasStorm) suggestions.add('Thunderstorms expected at your destination - plan indoor backup activities');
  if (dest.hasSnow && !origin.hasSnow) suggestions.add('Snow expected at your destination but not at home - pack winter gear you might not normally need');
  else if (dest.hasSnow) suggestions.add('Pack winter boots and warm layers - snow expected');

  if (dest.minC <= 5) suggestions.add('Pack a heavy coat - destination temperatures will drop near freezing');
  if (dest.maxC >= 30 && origin.maxC < 25) suggestions.add('It will be notably hotter than home - sunscreen and breathable fabrics recommended');
  else if (dest.maxC >= 30) suggestions.add('Pack light, breathable clothing - it will be hot');

  return Array.from(suggestions);
}

/**
 * Rule-based "what to pack" suggestions from a forecast array.
 * Deterministic, no ML - just thresholds on max/min temp and precipitation chance.
 */
function generatePackingSuggestions(forecast, unit = 'celsius') {
  const suggestions = new Set();

  let maxTemp = -Infinity;
  let minTemp = Infinity;
  let maxPrecip = 0;
  let hasSnow = false;
  let hasStorm = false;

  for (const day of forecast) {
    if (day.tempMax > maxTemp) maxTemp = day.tempMax;
    if (day.tempMin < minTemp) minTemp = day.tempMin;
    if (day.precipitationChance > maxPrecip) maxPrecip = day.precipitationChance;
    if ([71, 73, 75, 77, 85, 86].includes(day.weatherCode)) hasSnow = true;
    if ([95, 96, 99].includes(day.weatherCode)) hasStorm = true;
  }

  // Normalize thresholds to celsius for comparison if needed
  const toCelsius = (t) => (unit === 'fahrenheit' ? ((t - 32) * 5) / 9 : t);
  const maxC = toCelsius(maxTemp);
  const minC = toCelsius(minTemp);

  if (maxPrecip >= 50) suggestions.add('Pack an umbrella or raincoat - rain is likely');
  else if (maxPrecip >= 25) suggestions.add('Bring a light rain jacket just in case');

  if (hasSnow) suggestions.add('Pack winter boots and warm layers - snow expected');
  if (hasStorm) suggestions.add('Thunderstorms expected - plan indoor backup activities');

  if (minC <= 5) suggestions.add('Pack a heavy coat - temperatures will drop near freezing');
  else if (minC <= 12) suggestions.add('Bring a warm jacket for cooler evenings');

  if (maxC >= 30) suggestions.add('Pack light, breathable clothing - it will be hot');
  else if (maxC >= 22) suggestions.add('T-shirts and light layers should be comfortable');

  if (maxC >= 25 && maxPrecip < 25) suggestions.add('Sunscreen and sunglasses recommended');

  if (suggestions.size === 0) {
    suggestions.add('Conditions look mild - pack standard everyday clothing');
  }

  return Array.from(suggestions);
}

/**
 * Checks a list of saved trips and flags ones with notable weather coming up
 * (used for the in-app weather-alert banner).
 */
function getTripAlerts(trips) {
  const alerts = [];
  const today = new Date().toISOString().split('T')[0];

  for (const trip of trips) {
    const upcomingDays = (trip.forecast || []).filter((d) => d.date >= today);
    if (upcomingDays.length === 0) continue;

    const rainyDay = upcomingDays.find((d) => d.precipitationChance >= 60);
    const stormDay = upcomingDays.find((d) => [95, 96, 99].includes(d.weatherCode));
    const extremeColdDay = upcomingDays.find(
      (d) => (trip.unit === 'fahrenheit' ? d.tempMin <= 32 : d.tempMin <= 0)
    );
    const extremeHotDay = upcomingDays.find(
      (d) => (trip.unit === 'fahrenheit' ? d.tempMax >= 95 : d.tempMax >= 35)
    );

    if (stormDay) {
      alerts.push({
        tripId: trip._id,
        location: trip.locationName,
        message: `Thunderstorms expected in ${trip.locationName} around ${stormDay.date}`,
        severity: 'high',
      });
    } else if (rainyDay) {
      alerts.push({
        tripId: trip._id,
        location: trip.locationName,
        message: `High chance of rain in ${trip.locationName} around ${rainyDay.date}`,
        severity: 'medium',
      });
    }

    if (extremeColdDay) {
      alerts.push({
        tripId: trip._id,
        location: trip.locationName,
        message: `Freezing temperatures expected in ${trip.locationName} around ${extremeColdDay.date}`,
        severity: 'medium',
      });
    }

    if (extremeHotDay) {
      alerts.push({
        tripId: trip._id,
        location: trip.locationName,
        message: `Very hot temperatures expected in ${trip.locationName} around ${extremeHotDay.date}`,
        severity: 'medium',
      });
    }
  }

  return alerts;
}

module.exports = {
  levenshteinDistance,
  describeWeatherCode,
  generatePackingSuggestions,
  generateRelativePackingSuggestions,
  getTripAlerts,
  WEATHER_CODE_MAP,
};
