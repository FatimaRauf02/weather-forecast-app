# Waypoint Weather

A full-stack weather and trip-planning app built for the PM Accelerator AI Engineer Intern
technical assessment (Full Stack Development — Tech Assessment #1 + #2).

Built by **Fatima Rauf**.

## What this app does

Beyond the basic "search a city, see the weather" requirement, this app is built around a
simple idea: most people check the weather because they're *deciding something* — what to
wear, whether to pack a jacket, whether to visit City A or City B next week. So on top of the
required features, this app adds a travel-planning layer on top of raw forecast data.

### Screenshots

<img width="955" height="441" alt="1" src="https://github.com/user-attachments/assets/30227112-7f6b-490b-ab27-8a1357c086b2" />
<img width="960" height="426" alt="2" src="https://github.com/user-attachments/assets/6461909d-187c-49fb-92da-0bfc992ae995" />
<img width="944" height="401" alt="3" src="https://github.com/user-attachments/assets/26d4d8a5-a777-41ff-a9c0-45b8a772e0b7" />
<img width="802" height="390" alt="4" src="https://github.com/user-attachments/assets/ea92929d-727d-4729-922b-23845f843ff2" />
<img width="463" height="443" alt="5" src="https://github.com/user-attachments/assets/bd770f8e-4dd1-43fb-b58c-ad8d05aee4f7" />
<img width="508" height="435" alt="6" src="https://github.com/user-attachments/assets/6e6f750d-0852-4a87-833f-e92ae8f2c736" />
<img width="406" height="303" alt="7" src="https://github.com/user-attachments/assets/fe34444e-946e-4fdc-b013-b45de452c74c" />
<img width="353" height="424" alt="8" src="https://github.com/user-attachments/assets/1645441b-4c25-4da1-b51d-26f30cc1155f" />
<img width="294" height="183" alt="9" src="https://github.com/user-attachments/assets/0ec0653d-89e1-445f-a6bc-882c958f2c2f" />




### Core features 
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

### Extra features 
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


