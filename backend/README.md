# Backend — Waypoint Weather

Express API that proxies Open-Meteo (weather, geocoding, historical data) and manages saved
trips in MongoDB.

## Setup

```bash
cp .env.example .env
```

Edit `.env` and set `MONGO_URI` to either:
- A local MongoDB instance: `mongodb://localhost:27017/weather-travel-app`
- A MongoDB Atlas connection string: `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/weather-travel-app`

Then:

```bash
npm install
npm run dev      # starts with nodemon (auto-restart on changes)
# or
npm start        # plain node, no auto-restart
```

The server runs on `http://localhost:5000` by default (configurable via `PORT` in `.env`).

Check it's running: visit `http://localhost:5000/api/health` — should return
`{"status":"ok","dbState":1}` (dbState 1 means MongoDB connected successfully).

## API Endpoints

### Weather
| Method | Endpoint                          | Description                                  |
|--------|------------------------------------|-----------------------------------------------|
| GET    | `/api/weather/search?q=Lahore`     | Search locations by name (returns multiple matches if ambiguous, or a typo suggestion if nothing matches) |
| GET    | `/api/weather/reverse?lat=&lon=`   | Reverse-geocode coordinates to a place name   |
| GET    | `/api/weather/current?lat=&lon=&unit=` | Current weather + 5-day forecast          |

### Trips (CRUD)
| Method | Endpoint              | Description                          |
|--------|------------------------|---------------------------------------|
| POST   | `/api/trips`            | Create a saved trip (fetches forecast/historical data automatically) |
| GET    | `/api/trips`            | List all saved trips                  |
| GET    | `/api/trips/:id`        | Get a single trip                     |
| PUT    | `/api/trips/:id`        | Update a trip's dates/notes (re-fetches weather if dates change) |
| DELETE | `/api/trips/:id`        | Delete a trip                          |
| GET    | `/api/trips/alerts`     | Get weather alerts (rain/storm/extreme temps) for all saved trips |

## Folder structure

```
src/
├── server.js              Express app entry point
├── models/
│   └── SavedTrip.js         Mongoose schema
├── services/
│   └── weatherService.js    Open-Meteo API wrapper
├── routes/
│   ├── weather.js            Weather/geocoding endpoints
│   └── trips.js                CRUD endpoints
└── utils/
    └── helpers.js             Levenshtein distance, weather code descriptions,
                                  packing suggestion logic, trip alert checker
```
