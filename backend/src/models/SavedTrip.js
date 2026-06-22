const mongoose = require('mongoose');

const dailyForecastSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // YYYY-MM-DD
    tempMax: Number,
    tempMin: Number,
    precipitationChance: Number,
    weatherCode: Number,
    isHistoricalAverage: { type: Boolean, default: false },
  },
  { _id: false }
);

const savedTripSchema = new mongoose.Schema(
  {
    locationName: { type: String, required: true, trim: true },
    country: { type: String, trim: true },
    admin1: { type: String, trim: true }, // state/province
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    startDate: { type: String, required: true }, // YYYY-MM-DD
    endDate: { type: String, required: true },
    unit: { type: String, enum: ['celsius', 'fahrenheit'], default: 'celsius' },
    notes: { type: String, trim: true, default: '' },
    forecast: [dailyForecastSchema],
    packingSuggestions: [String],
    submittedBy: { type: String, trim: true, default: 'Anonymous' },

    // Optional "traveling from" location. When present, the trip was planned
    // as a from/to comparison rather than a single destination lookup -
    // packing suggestions become relative to home conditions, and the UI
    // can show a side-by-side of origin vs destination.
    hasOrigin: { type: Boolean, default: false },
    originLocationName: { type: String, trim: true, default: '' },
    originCountry: { type: String, trim: true, default: '' },
    originAdmin1: { type: String, trim: true, default: '' },
    originLatitude: { type: Number },
    originLongitude: { type: Number },
    originForecast: [dailyForecastSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('SavedTrip', savedTripSchema);
