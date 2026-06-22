# Waypoint Weather

A full-stack weather and trip-planning app built for the PM Accelerator AI Engineer Intern
technical assessment (Full Stack — Tech Assessment #1 + #2).

Built by **Fatima**.

## What this app does

Beyond the basic "search a city, see the weather" requirement, this app is built around a
simple idea: most people check the weather because they're *deciding something* — what to
wear, whether to pack a jacket, whether to visit City A or City B next week. So on top of the
required features, this app adds a travel-planning layer on top of raw forecast data.

### Core features (from the assessment brief)
- Search any location by name (city, town, landmark) with live autocomplete
- "Use my location" via browser geolocation
- Current weather with icons, humidity, wind, UV index, sunrise time
- 5-day forecast displayed as a horizontal strip
- Fully responsive layout (mobile, tablet, desktop)
- Full CRUD on saved trips, backed by MongoDB
  - **Create**: save a location + date range, validated and weather-fetched automatically
  - **Read**: view all saved trips (a shared feed — no per-user login required, matching the
    "row-level security not necessary" note in the brief)
  - **Update**: edit a trip's dates or notes; weather is re-fetched if dates change
  - **Delete**: remove a saved trip
- Map view of the selected location (Leaflet + OpenStreetMap — no API key needed)
- Export saved trips to CSV, JSON, or Markdown
- Graceful error handling throughout (location not found, API failures, offline)

### Extra features (the "stand out" part)
- **Ambiguous location handling** — searching "Springfield" shows every matching Springfield
  (with state/country) instead of silently picking one
- **Typo suggestions** — a misspelled city name gets a "Did you mean...?" suggestion using
  Levenshtein distance, instead of just failing
- **Unit toggle** — switch between °C/°F at any time
- **Forecast-vs-historical travel mode** — Open-Meteo only forecasts ~16 days out. If a saved
  trip's dates are further out than that, the app automatically falls back to a historical
  average (based on the same calendar dates across the past 3 years) and clearly labels it as
  such, rather than just erroring out
- **What-to-pack suggestions** — simple, deterministic rules applied to the forecast (rain
  chance, temperature range, storms) generate a short packing list per trip — no ML, no
  external AI calls, just thresholds on real data
- **Trip comparison** — pick two saved trips and see them side-by-side (avg temp, high/low,
  rain chance) with a one-line verdict on which will be warmer
- **From/to trip planning** — "Plan a trip" lets you set both a "traveling from" (defaults to
  your current location) and a "traveling to" destination. When both are set, the app fetches
  weather for both locations over the same date range and generates packing suggestions
  *relative* to home conditions (e.g. "It'll be about 13.5°C warmer than home — pack lighter
  than you would normally") instead of just absolute thresholds. Saved trips with an origin
  show a home-vs-destination temperature comparison directly on the trip card.
- **Weather alert banner** — on load, the app checks all saved trips for upcoming rain, storms,
  or extreme temperatures and surfaces them at the top of the page, without needing a backend
  scheduler or push notifications

## Tech stack

| Layer       | Technology                                      |
|-------------|--------------------------------------------------|
| Frontend    | React (Vite) + Tailwind CSS                     |
| Backend     | Node.js + Express                                |
| Database    | MongoDB (Mongoose)                                |
| Weather API | [Open-Meteo](https://open-meteo.com/) — free, no API key required |
| Maps        | Leaflet + OpenStreetMap tiles — free, no API key |
| Icons       | lucide-react                                      |

No paid services and no API keys are required anywhere in this project.

## Project structure

```
weather-app/
├── backend/      → Express API (weather proxy + trips CRUD)
└── frontend/      → React + Vite + Tailwind UI
```

See `backend/README.md` and `frontend/README.md` for setup instructions for each half.

## Quick start

1. Set up the backend first (needs a MongoDB connection string — local or Atlas):
   ```
   cd backend
   cp .env.example .env   # then edit .env with your MONGO_URI
   npm install
   npm run dev
   ```
2. In a second terminal, set up the frontend:
   ```
   cd frontend
   cp .env.example .env   # default already points at localhost:5000/api
   npm install
   npm run dev
   ```
3. Open the URL Vite prints (usually `http://localhost:5173`).

## Notes on design decisions

- **Why MongoDB over SQL**: saved trips are mostly self-contained documents (location, date
  range, a forecast array, notes) with no need for joins — a document store fits naturally.
- **Why Open-Meteo over OpenWeather/other providers**: no API key, no rate-limit headaches
  during development or demoing, and it provides geocoding, forecast, and historical data
  through one consistent provider.
- **Why no AI/LLM calls anywhere in this app**: the packing suggestions and alerts are
  intentionally rule-based rather than calling an LLM. This is a weather CRUD assessment, not
  a GenAI assessment — adding an AI call here would be scope creep, not a feature.
