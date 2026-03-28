# CLAUDE.md — CrowdSurfer

This file documents the codebase structure, development conventions, and workflows for AI assistants working on this project.

---

## Project Overview

**CrowdSurfer** is a crowdsourcing mobile application that provides real-time occupancy data for locations (initially targeting McMaster University libraries). Users can view a heatmap of crowd levels, submit reports, and track location occupancy trends.

**Key Capabilities:**
- Live heatmap visualization of location occupancy
- User-submitted crowd level reports (quiet / not busy / busy / very busy)
- Backend web scraping of official occupancy data (McMaster Library)
- Background GPS tracking and Bluetooth proximity detection

---

## Repository Structure

```
CrowdSurfer/
├── Backend/                          # Django REST API
│   └── crowdsurferBackend/
│       ├── crowdsurferBackend/       # Django project settings
│       │   ├── settings.py
│       │   ├── urls.py
│       │   ├── asgi.py
│       │   └── wsgi.py
│       └── myapp/                    # Main Django application
│           ├── models.py             # Database models
│           ├── views.py              # API views & endpoints
│           ├── serializer.py         # DRF serializers
│           ├── urls.py               # URL routing
│           ├── densityScraper.py     # Selenium-based occupancy scraper
│           ├── ReportAlgorithm.py    # Occupancy calculation logic
│           ├── updateKeyLocations.py
│           ├── updateUserLocation.py
│           ├── sendDatabase.py
│           └── migrations/
├── crowdsurfer/                      # React Native / Expo frontend
│   ├── app/                          # Expo Router file-based routing
│   │   ├── _layout.tsx               # Root stack navigator
│   │   └── (tabs)/                   # Tab group (main app)
│   │       ├── _layout.tsx
│   │       ├── index.tsx             # Map screen (home)
│   │       ├── list.tsx              # Locations list
│   │       ├── report.tsx            # Submit crowd report
│   │       ├── stats.tsx             # Analytics dashboard
│   │       └── locationStats/        # Per-location detail pages
│   ├── components/                   # Reusable UI components
│   │   ├── Report/                   # Report submission components
│   │   ├── Stats/                    # Statistics/analytics components
│   │   └── ui/                       # Generic UI primitives
│   ├── hooks/                        # Custom React hooks
│   ├── context/                      # React Context providers
│   ├── constants/                    # App-wide constants
│   └── data/                         # Static JSON data files
├── README.md
└── CLAUDE.md                         # This file
```

---

## Technology Stack

### Frontend (`crowdsurfer/`)

| Category | Technology |
|---|---|
| Framework | React Native 0.79.5 + Expo 53 |
| Language | TypeScript (strict mode) |
| Routing | Expo Router 5 (file-based) |
| Maps | React Native Maps with heatmap |
| Location | Expo Location (background tracking) |
| Bluetooth | react-native-ble-plx + react-native-ble-manager |
| HTTP | Axios |
| Navigation | React Navigation (bottom tabs) |
| Animations | React Native Reanimated 3 |
| Icons | Expo Vector Icons |

### Backend (`Backend/`)

| Category | Technology |
|---|---|
| Framework | Django 5.2.4 |
| REST API | Django REST Framework 3.16 |
| Database | SQLite3 (development) |
| CORS | django-cors-headers |
| Scraping | Selenium (ChromeDriver / EdgeDriver / FirefoxDriver) |
| Env config | python-dotenv |
| Image processing | Pillow |

---

## Development Setup

### Frontend

```bash
cd crowdsurfer
npm install
npm start            # Start Expo dev server (scan QR or press a/i/w)
npm run android      # Android emulator
npm run ios          # iOS simulator
npm run web          # Browser
npm run lint         # Run ESLint
```

**Expo Router** uses file-based routing — the files under `app/` map directly to routes.

### Backend

```bash
cd Backend/crowdsurferBackend
pip install -r ../requirements.txt
python manage.py migrate
python manage.py runserver
```

Configure a `.env` file in `Backend/` (not committed):
```
SECRET_KEY=your-django-secret-key
DEBUG=True
```

---

## Key Conventions

### Frontend

**File-based routing:** Every file in `app/` is a route. Folders with `(tabs)` create a tab group. Never import route files directly — use Expo Router's `<Link>` or `router.push()`.

**Component naming:** PascalCase for components, camelCase for hooks (prefixed `use`). Keep components in `components/`, screen logic in `app/`.

**TypeScript:** Strict mode is on. Avoid `any` types. Use Expo's path alias `@/` for imports from the root (configured in `tsconfig.json`).

**Styling:** Use `StyleSheet.create()` for component-scoped styles. Theme colors live in `constants/Colors.ts`. Crowd level colors live in `constants/crowdLevels.ts` — use those constants rather than hardcoding color values.

**Crowd levels:** The canonical set of values is:
```typescript
"quiet" | "not_busy" | "busy" | "very_busy"
```
Map these to display labels and colors from `constants/crowdLevels.ts`.

**State management:** Local `useState` for component state. `ActivityContext` for cross-component report history. No Redux or external store.

**API calls:** Use Axios. The base URL is stored locally and **must be set to your machine's IP address** before testing on device:
```typescript
// crowdsurfer/app/(tabs)/list.tsx — look for the API_BASE_URL variable
const API_BASE_URL = "http://<YOUR_IP>:8000";
```

**Data fallbacks:** Static JSON files in `data/` (`KeyLocations.json`, `UserLocations.json`) serve as local fallbacks when the API is unavailable.

**Hooks:**
- `useLocationBackground` — manages background GPS updates; sends location to backend on interval
- `useBluetooth` — scans for nearby BLE devices; currently used for proximity estimation
- `useFilteredLocations` — filters/sorts the locations list
- `useColorScheme` — provides light/dark theme; use `ThemedText` and `ThemedView` for theme-aware elements

### Backend

**App layout:** All business logic lives in the single Django app `myapp`. Do not create additional apps unless the feature clearly warrants it.

**Models:**
```python
scrapeData    # Scraped occupancy: location_Id (str), occupancy (int)
Report        # User reports:     location_Id (str), crowd_Level (str)
keyLocation   # Locations:        location_Id (str), occupancy (str)
userLocation  # User GPS:         user_Id (str), latitude, longitude
```

**Serializers:** All validation (occupancy 0–100 range, valid crowd level strings) is enforced in serializers — do not duplicate it in views.

**CORS:** Currently set to allow all origins (`CORS_ALLOW_ALL_ORIGINS = True`). This is development-only — restrict before production.

**Web scraper:** `densityScraper.py` uses Selenium with automatic driver fallback (Chrome → Edge → Firefox). The scraper targets McMaster Library's PHP occupancy endpoint. Run it manually or schedule it — there is no automatic task queue yet.

**Migrations:** Always run `python manage.py makemigrations` and `python manage.py migrate` after changing `models.py`.

---

## API Reference

All endpoints are prefixed with `/api/`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/occupancy/` | Occupancy for all locations |
| GET | `/api/occupancy/<location_id>/` | Occupancy for a single location |
| GET/POST | `/api/reports/` | List / create crowd reports |
| GET/PUT/DELETE | `/api/reports/<id>/` | Report detail |
| GET | `/api/reports/location/<location_id>/` | Reports by location |
| GET/POST/PUT/DELETE | `/api/scrapedata/` | Scraped data CRUD (ViewSet) |
| GET/POST/PUT/DELETE | `/api/key-locations/` | Key location CRUD (ViewSet) |
| GET/POST/PUT/DELETE | `/api/user-locations/` | User location CRUD (ViewSet) |
| POST | `/api/update-key-location/` | Update a key location record |
| POST | `/api/save-user-location/` | Save a user's GPS position |

---

## Important Files

| File | Purpose |
|---|---|
| `crowdsurfer/app/(tabs)/index.tsx` | Main map screen — heatmap + user location |
| `crowdsurfer/app/(tabs)/list.tsx` | Location list with live occupancy data |
| `crowdsurfer/app/(tabs)/report.tsx` | Crowd report submission |
| `crowdsurfer/constants/crowdLevels.ts` | Crowd level labels, values, and colors |
| `crowdsurfer/context/ActivityContext.tsx` | Report activity state |
| `crowdsurfer/hooks/useLocationBackground.ts` | Background GPS logic |
| `crowdsurfer/data/KeyLocations.json` | Static list of tracked locations |
| `Backend/.../myapp/models.py` | Database schema |
| `Backend/.../myapp/views.py` | API endpoint implementations |
| `Backend/.../myapp/densityScraper.py` | Selenium occupancy scraper |
| `Backend/.../myapp/ReportAlgorithm.py` | Occupancy calculation from reports |

---

## Testing

- **Frontend:** No test suite exists yet. When adding tests, use Jest + React Native Testing Library (standard for Expo projects).
- **Backend:** `myapp/tests.py` exists but is empty. Use Django's built-in `TestCase` class; run with `python manage.py test`.
- **No CI/CD pipeline** — there are no GitHub Actions workflows. Consider adding one if the project grows.

---

## Known Gotchas

1. **API base URL is not configured:** `list.tsx` has a comment `⚠️ CHANGE THIS TO YOUR COMPUTER'S IP`. Set this to your local machine's IP when running on a physical device.
2. **SQLite in development only:** The README mentions MongoDB, but the codebase uses SQLite3. Do not infer Mongo usage from documentation.
3. **Bluetooth needs physical device:** BLE scanning does not work in simulators or the web target. Test BLE features on real hardware.
4. **Background location on iOS:** Requires the `NSLocationAlwaysUsageDescription` permission configured in `app.json`; it is already set.
5. **CORS is open:** `CORS_ALLOW_ALL_ORIGINS = True` — restrict this before any public deployment.
6. **Selenium drivers:** `densityScraper.py` tries Chrome, then Edge, then Firefox. Ensure at least one browser is installed on the server running the scraper.
