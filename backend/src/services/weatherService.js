const axios = require('axios');

const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/reverse';
const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast';
const ARCHIVE_BASE = 'https://archive-api.open-meteo.com/v1/archive';

const DAILY_FIELDS = [
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_probability_max',
  'weathercode',
  'sunrise',
  'sunset',
].join(',');

const CURRENT_FIELDS = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'weathercode',
  'wind_speed_10m',
  'wind_direction_10m',
  'uv_index',
  'pressure_msl',
  'is_day',
  'cloud_cover',
].join(',');

const HOURLY_FIELDS = [
  'temperature_2m',
  'weathercode',
  'wind_speed_10m',
  'is_day',
  'precipitation_probability',
].join(',');


async function searchLocations(query, count = 5) {
  const { data } = await axios.get(GEOCODING_BASE, {
    params: { name: query, count, language: 'en', format: 'json' },
  });
  return (data.results || []).map((r) => ({
    name: r.name,
    country: r.country,
    admin1: r.admin1 || '',
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
  }));
}


async function reverseGeocode(lat, lon) {
  try {
    const { data } = await axios.get(REVERSE_GEOCODING_BASE, {
      params: { latitude: lat, longitude: lon, language: 'en', format: 'json' },
    });
    const match = data.results && data.results[0];
    if (match) {
      return {
        name: match.name,
        country: match.country,
        admin1: match.admin1 || '',
        latitude: match.latitude,
        longitude: match.longitude,
      };
    }
  } catch (err) {
   
  }
  return {
    name: 'Your location',
    country: '',
    admin1: '',
    latitude: lat,
    longitude: lon,
  };
}


 
async function getCurrentAndForecast(lat, lon, unit = 'celsius') {
  const temperature_unit = unit === 'fahrenheit' ? 'fahrenheit' : 'celsius';
  const wind_speed_unit = unit === 'fahrenheit' ? 'mph' : 'kmh';

  const { data } = await axios.get(FORECAST_BASE, {
    params: {
      latitude: lat,
      longitude: lon,
      current: CURRENT_FIELDS,
      daily: DAILY_FIELDS,
      hourly: HOURLY_FIELDS,
      temperature_unit,
      wind_speed_unit,
      timezone: 'auto',
      forecast_days: 10,
    },
  });

  return {
    current: data.current,
    currentUnits: data.current_units,
    daily: data.daily,
    dailyUnits: data.daily_units,
    hourly: data.hourly,
    hourlyUnits: data.hourly_units,
    timezone: data.timezone,
  };
}


async function getForecastForRange(lat, lon, startDate, endDate, unit = 'celsius') {
  const temperature_unit = unit === 'fahrenheit' ? 'fahrenheit' : 'celsius';

  const { data } = await axios.get(FORECAST_BASE, {
    params: {
      latitude: lat,
      longitude: lon,
      daily: DAILY_FIELDS,
      temperature_unit,
      timezone: 'auto',
      start_date: startDate,
      end_date: endDate,
    },
  });

  return data.daily;
}


async function getHistoricalAverages(lat, lon, startDate, endDate) {
  
  const years = [1, 2, 3];
  const startObj = new Date(startDate);
  const endObj = new Date(endDate);

  const yearlyResults = [];

  for (const yearsAgo of years) {
    const histStart = new Date(startObj);
    histStart.setFullYear(histStart.getFullYear() - yearsAgo);
    const histEnd = new Date(endObj);
    histEnd.setFullYear(histEnd.getFullYear() - yearsAgo);

    const fmt = (d) => d.toISOString().split('T')[0];

    try {
      const { data } = await axios.get(ARCHIVE_BASE, {
        params: {
          latitude: lat,
          longitude: lon,
          start_date: fmt(histStart),
          end_date: fmt(histEnd),
          daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode',
          timezone: 'auto',
        },
      });
      if (data.daily) yearlyResults.push(data.daily);
    } catch (err) {
     
    }
  }

  if (yearlyResults.length === 0) return null;

 
  const dayCount = yearlyResults[0].time.length;
  const averaged = [];

  for (let i = 0; i < dayCount; i++) {
    let maxSum = 0;
    let minSum = 0;
    let precipDays = 0;
    let validYears = 0;
    let mostCommonCode = 0;
    const codeCounts = {};

    for (const yearData of yearlyResults) {
      if (yearData.temperature_2m_max[i] == null) continue;
      maxSum += yearData.temperature_2m_max[i];
      minSum += yearData.temperature_2m_min[i];
      if (yearData.precipitation_sum[i] > 0.5) precipDays++;
      const code = yearData.weathercode[i];
      codeCounts[code] = (codeCounts[code] || 0) + 1;
      validYears++;
    }

    if (validYears === 0) continue;

    mostCommonCode = Object.entries(codeCounts).sort((a, b) => b[1] - a[1])[0][0];

    
    const targetDate = new Date(startObj);
    targetDate.setDate(targetDate.getDate() + i);

    averaged.push({
      date: targetDate.toISOString().split('T')[0],
      tempMax: Math.round((maxSum / validYears) * 10) / 10,
      tempMin: Math.round((minSum / validYears) * 10) / 10,
      precipitationChance: Math.round((precipDays / validYears) * 100),
      weatherCode: Number(mostCommonCode),
      isHistoricalAverage: true,
    });
  }

  return averaged;
}

module.exports = {
  searchLocations,
  reverseGeocode,
  getCurrentAndForecast,
  getForecastForRange,
  getHistoricalAverages,
};
