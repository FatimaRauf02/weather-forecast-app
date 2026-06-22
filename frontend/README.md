# Frontend — Waypoint Weather

React (Vite) + Tailwind CSS frontend for Waypoint Weather.

## Setup

```bash
cp .env.example .env
```

By default `.env` points the app at `http://localhost:5000/api` — change `VITE_API_BASE_URL`
if your backend runs somewhere else.

Then:

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Make sure the backend is running
first, or location search / weather data won't load.

## Build for production

```bash
npm run build
```

Output goes to `dist/`. Preview the production build locally with `npm run preview`.

## Folder structure

```
src/
├── App.jsx                      Main app - ties all features together
├── index.css                    Tailwind setup + custom utilities
├── api/
│   └── client.js                  Axios wrapper for backend calls
├── hooks/
│   └── useGeolocation.js          Browser geolocation hook
├── utils/
│   ├── exportUtils.js              CSV/JSON/Markdown export
│   └── weatherCodes.js             Weather code → icon mapping
└── components/
    ├── LocationSearch.jsx          Search bar + autocomplete + disambiguation dropdown
    ├── CurrentWeatherPanel.jsx     Current weather hero display
    ├── ForecastStrip.jsx            5-day forecast cards
    ├── WeatherIcon.jsx               Icon component for weather conditions
    ├── LocationMap.jsx                Leaflet map view
    ├── TripPlannerForm.jsx            Save-a-trip form (date range, notes)
    ├── TripCard.jsx                    Saved trip card (edit/delete/compare)
    ├── TripComparison.jsx              Side-by-side trip comparison
    ├── TripAlertBanner.jsx             Weather alert banner for saved trips
    ├── ExportMenu.jsx                   CSV/JSON/Markdown export dropdown
    ├── ErrorBanner.jsx                   Shared error/status banner
    ├── DisambiguationPanel.jsx           Standalone disambiguation UI (alternate to the inline dropdown)
    └── Footer.jsx                          PM Accelerator branding + credit
```

## Design notes

The visual direction intentionally avoids the generic "AI app" look (cream + terracotta, or
dark mode with a neon accent). Instead it uses a warm paper background with a deep pine-green
accent — meant to feel grounded and travel-oriented rather than like a generic SaaS dashboard.
Fraunces (serif) is used for display type (temperatures, headings) and Inter for body text,
with JetBrains Mono for data labels (humidity, wind, coordinates) to reinforce a
"weather-instrument" feel.
