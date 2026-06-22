const express = require('express');
const router = express.Router();
const SavedTrip = require('../models/SavedTrip');
const weatherService = require('../services/weatherService');
const {
  generatePackingSuggestions,
  generateRelativePackingSuggestions,
  getTripAlerts,
} = require('../utils/helpers');

const MAX_FORECAST_DAYS = 16; 


function validateDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Dates must be valid (YYYY-MM-DD).';
  }
  if (start > end) {
    return 'Start date must be before or equal to the end date.';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  if (start < oneYearAgo) {
    return 'Start date cannot be more than a year in the past.';
  }

  const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
  if (diffDays > 30) {
    return 'Date range cannot exceed 30 days.';
  }

  return null;
}


async function buildForecastForRange(lat, lon, startDate, endDate, unit) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);

  const daysFromToday = Math.round((start - today) / (1000 * 60 * 60 * 24));

  if (daysFromToday <= MAX_FORECAST_DAYS && daysFromToday >= -5) {
    
    const daily = await weatherService.getForecastForRange(lat, lon, startDate, endDate, unit);
    return daily.time.map((date, i) => ({
      date,
      tempMax: daily.temperature_2m_max[i],
      tempMin: daily.temperature_2m_min[i],
      precipitationChance: daily.precipitation_probability_max?.[i] ?? 0,
      weatherCode: daily.weathercode[i],
      isHistoricalAverage: false,
    }));
  }

 
  const historical = await weatherService.getHistoricalAverages(lat, lon, startDate, endDate);
  if (!historical) {
    throw new Error('No forecast or historical data available for this date range.');
  }
  return historical;
}


router.post('/', async (req, res) => {
  const {
    locationName, country, admin1, latitude, longitude,
    startDate, endDate, unit, notes, submittedBy,
    originLocationName, originCountry, originAdmin1, originLatitude, originLongitude,
  } = req.body;

  if (!locationName || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'A valid location (with coordinates) is required.' });
  }
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Start and end dates are required.' });
  }

  const dateError = validateDateRange(startDate, endDate);
  if (dateError) {
    return res.status(400).json({ error: dateError });
  }

  const hasOrigin = originLatitude !== undefined && originLatitude !== null
    && originLongitude !== undefined && originLongitude !== null;

  if (hasOrigin && !originLocationName) {
    return res.status(400).json({ error: 'Origin location name is required when origin coordinates are provided.' });
  }

  try {
    const resolvedUnit = unit === 'fahrenheit' ? 'fahrenheit' : 'celsius';
    const forecast = await buildForecastForRange(latitude, longitude, startDate, endDate, resolvedUnit);

    let originForecast = [];
    let packingSuggestions;

    if (hasOrigin) {
      originForecast = await buildForecastForRange(
        originLatitude, originLongitude, startDate, endDate, resolvedUnit
      );
      packingSuggestions = generateRelativePackingSuggestions(forecast, originForecast, resolvedUnit);
    } else {
      packingSuggestions = generatePackingSuggestions(forecast, resolvedUnit);
    }

    const trip = await SavedTrip.create({
      locationName,
      country: country || '',
      admin1: admin1 || '',
      latitude,
      longitude,
      startDate,
      endDate,
      unit: resolvedUnit,
      notes: notes || '',
      forecast,
      packingSuggestions,
      submittedBy: submittedBy || 'Anonymous',
      hasOrigin,
      originLocationName: hasOrigin ? originLocationName : '',
      originCountry: hasOrigin ? (originCountry || '') : '',
      originAdmin1: hasOrigin ? (originAdmin1 || '') : '',
      originLatitude: hasOrigin ? originLatitude : undefined,
      originLongitude: hasOrigin ? originLongitude : undefined,
      originForecast: hasOrigin ? originForecast : [],
    });

    return res.status(201).json(trip);
  } catch (err) {
    console.error('Trip creation failed:', err.message);
    return res.status(503).json({
      error: 'Could not fetch weather data for this trip right now. Please try again shortly.',
    });
  }
});


router.get('/', async (req, res) => {
  const sort = req.query.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
  try {
    const trips = await SavedTrip.find().sort(sort);
    return res.json(trips);
  } catch (err) {
    console.error('Fetching trips failed:', err.message);
    return res.status(500).json({ error: 'Could not load saved trips.' });
  }
});


router.get('/alerts', async (req, res) => {
  try {
    const trips = await SavedTrip.find();
    const alerts = getTripAlerts(trips);
    return res.json({ alerts });
  } catch (err) {
    console.error('Fetching alerts failed:', err.message);
    return res.status(500).json({ error: 'Could not check trip alerts.' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const trip = await SavedTrip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found.' });
    return res.json(trip);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid trip ID.' });
  }
});


router.put('/:id', async (req, res) => {
  const { startDate, endDate, notes, unit } = req.body;

  try {
    const trip = await SavedTrip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found.' });

    const newStart = startDate || trip.startDate;
    const newEnd = endDate || trip.endDate;
    const newUnit = unit === 'fahrenheit' || unit === 'celsius' ? unit : trip.unit;

    const dateError = validateDateRange(newStart, newEnd);
    if (dateError) return res.status(400).json({ error: dateError });

    const datesChanged = newStart !== trip.startDate || newEnd !== trip.endDate;
    const unitChanged = newUnit !== trip.unit;

    if (datesChanged || unitChanged) {
      const forecast = await buildForecastForRange(
        trip.latitude, trip.longitude, newStart, newEnd, newUnit
      );
      trip.forecast = forecast;

      if (trip.hasOrigin && trip.originLatitude !== undefined && trip.originLongitude !== undefined) {
        const originForecast = await buildForecastForRange(
          trip.originLatitude, trip.originLongitude, newStart, newEnd, newUnit
        );
        trip.originForecast = originForecast;
        trip.packingSuggestions = generateRelativePackingSuggestions(forecast, originForecast, newUnit);
      } else {
        trip.packingSuggestions = generatePackingSuggestions(forecast, newUnit);
      }

      trip.startDate = newStart;
      trip.endDate = newEnd;
      trip.unit = newUnit;
    }

    if (notes !== undefined) trip.notes = notes;

    await trip.save();
    return res.json(trip);
  } catch (err) {
    console.error('Trip update failed:', err.message);
    return res.status(503).json({ error: 'Could not update trip right now. Please try again.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const trip = await SavedTrip.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found.' });
    return res.json({ message: 'Trip deleted.', id: req.params.id });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid trip ID.' });
  }
});

module.exports = router;
