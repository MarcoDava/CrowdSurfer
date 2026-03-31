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
│           ├── ReportAlgorithm.py    # Weighted occupancy algorithm (Haversine + 3 sources)
│           ├── updateKeyLocations.py
│           ├── updateUserLocation.py
│           ├── sendDatabase.py
│           ├── management/
│           │   └── commands/
│           │       └── seed_locations.py   # ⬅ run once to seed keyLocation table
│           └── migrations/
├── crowdsurfer/                      # React Native / Expo frontend
│   ├── app/                          # Expo Router file-based routing
│   │   ├── _layout.tsx               # Root stack navigator
│   │   └── (tabs)/                   # Tab group (main app)
│   │       ├── _layout.tsx
│   │       ├── index.tsx             # Map screen (home) — fetches live heatmap
│   │       ├── list.tsx              # Locations list
│   │       ├── report.tsx            # Submit crowd report
│   │       ├── stats.tsx             # Analytics dashboard
│   │       └── locationStats/        # Per-location detail pages
│   ├── components/                   # Reusable UI components
│   │   ├── CampusMap.native.tsx      # react-native-maps (iOS + Android)
│   │   ├── CampusMap.web.tsx         # Web fallback (no MapView)
│   │   ├── Report/                   # Report submission components
│   │   ├── Stats/                    # Statistics/analytics components
│   │   └── ui/                       # Generic UI primitives
│   ├── hooks/                        # Custom React hooks
│   ├── context/                      # React Context providers
│   ├── constants/
│   │   ├── api.ts                    # Platform-aware API_BASE_URL
│   │   └── crowdLevels.ts
│   └── data/                         # Static JSON fallbacks
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
python manage.py seed_locations   # ⚠️ run once to populate keyLocation table
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

**API base URL** is platform-aware — defined in `constants/api.ts`:
```typescript
// Android emulator → 10.0.2.2:8000  |  iOS sim + web → localhost:8000
// Override via EXPO_PUBLIC_API_URL in .env for physical device / staging
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? `http://${DEV_HOST}:8000/api`;
```
All API calls use this constant. Never hardcode an IP address in screen files.

**Platform-split map:** `CampusMap.native.tsx` is loaded on iOS/Android (react-native-maps). `CampusMap.web.tsx` is loaded on web (static fallback). Import as `import CampusMap from '@/components/CampusMap'` — Metro resolves automatically. The `Heatmap` component inside the native file is further guarded by `Platform.OS === 'android'` because react-native-maps only ships it on Android.

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

**Data fallbacks:** Static JSON files in `data/` (`KeyLocations.json`, `UserLocations.json`) serve as local fallbacks when the API is unavailable.

**Hooks:**
- `useLocationBackground` — manages background GPS; POSTs position to `/api/save-user-location/` every 5 min (native) or uses `watchPositionAsync` (web)
- `useBluetooth` — scans for nearby BLE devices; currently used for proximity estimation
- `useFilteredLocations` — filters/sorts the locations list
- `useColorScheme` — provides light/dark theme; use `ThemedText` and `ThemedView` for theme-aware elements

### Backend

**App layout:** All business logic lives in the single Django app `myapp`. Do not create additional apps unless the feature clearly warrants it.

**Models (current schema after migration 0007):**
```python
scrapeData    # Scraped occupancy: location_Id, occupancy (int), scraped_at
Report        # User reports:     location_Id, user_Id, crowd_Level, created_at
keyLocation   # Locations:        location_Id (unique), name, latitude, longitude,
              #                   radius_meters, capacity, occupancy (int, computed), updated_at
userLocation  # User GPS:         user_Id (unique), latitude, longitude, updated_at
```

**Occupancy algorithm** (`ReportAlgorithm.py`): weighted blend of three sources:
- Scraper data (40%) — latest `scrapeData` row for the location
- Crowd reports (30%) — average of `Report` rows within last 30 min
- User proximity (30%) — users within `radius_meters` in last 10 min, as % of `capacity`

If a source has no current data its weight is redistributed among sources that do. Call `compute_occupancy(location)` for a single location or `refresh_all_occupancies()` to recompute and persist all.

**Serializers:** All validation (occupancy 0–100 range, valid crowd level strings) is enforced in serializers — do not duplicate it in views.

**CORS:** Currently set to allow all origins (`CORS_ALLOW_ALL_ORIGINS = True`). This is development-only — restrict before production.

**Web scraper:** `densityScraper.py` uses Selenium with automatic driver fallback (Chrome → Edge → Firefox). The scraper targets McMaster Library's PHP occupancy endpoint. Run it manually or schedule it — there is no automatic task queue yet.

**Migrations:** Always run `python manage.py makemigrations` and `python manage.py migrate` after changing `models.py`. Latest migration is `0007_multi_user_refactor`.

**Seeding:** Run `python manage.py seed_locations` once after migrating. This populates `keyLocation` with the 4 McMaster campus locations (Mills, Thode, Health Sciences, Student Union). Without this the occupancy algorithm has no locations to compute against.

---

## API Reference

All endpoints are prefixed with `/api/`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/occupancy/` | Computed occupancy for all key locations (runs algorithm) |
| GET | `/api/occupancy/<location_id>/` | Computed occupancy for a single location |
| GET/POST | `/api/reports/` | List / create crowd reports |
| GET/PUT/DELETE | `/api/reports/<id>/` | Report detail |
| GET | `/api/reports/location/<location_id>/` | Reports by location |
| GET/POST/PUT/DELETE | `/api/scrapedata/` | Scraped data CRUD (ViewSet) |
| GET/POST/PUT/DELETE | `/api/key-locations/` | Key location CRUD (ViewSet) |
| GET/POST/PUT/DELETE | `/api/user-locations/` | User location CRUD (ViewSet) |
| POST | `/api/update-key-location/` | Upsert a key location record |
| POST | `/api/save-user-location/` | Upsert a user's GPS position (one row per user_Id) |
| GET | `/api/heatmap/` | Active user positions for heatmap (last 10 min) → `[{latitude, longitude, weight}]` |

---

## Important Files

| File | Purpose |
|---|---|
| `crowdsurfer/app/(tabs)/index.tsx` | Main map screen — fetches `/api/heatmap/`, falls back to static JSON |
| `crowdsurfer/app/(tabs)/list.tsx` | Location list with live occupancy from `/api/occupancy/` |
| `crowdsurfer/app/(tabs)/report.tsx` | Crowd report submission to `/api/reports/` |
| `crowdsurfer/constants/api.ts` | Platform-aware API_BASE_URL |
| `crowdsurfer/constants/crowdLevels.ts` | Crowd level labels, values, and colors |
| `crowdsurfer/context/ActivityContext.tsx` | Report activity state |
| `crowdsurfer/components/CampusMap.native.tsx` | MapView + conditional Heatmap (Android only) |
| `crowdsurfer/components/CampusMap.web.tsx` | Web fallback for the map |
| `crowdsurfer/hooks/useLocationBackground.ts` | Background GPS — posts to API on native, watches position on web |
| `crowdsurfer/data/KeyLocations.json` | Static fallback list of tracked locations |
| `Backend/.../myapp/models.py` | Database schema |
| `Backend/.../myapp/views.py` | API endpoint implementations |
| `Backend/.../myapp/serializer.py` | DRF serializers with validation |
| `Backend/.../myapp/ReportAlgorithm.py` | Weighted occupancy algorithm with Haversine distance |
| `Backend/.../myapp/densityScraper.py` | Selenium occupancy scraper |
| `Backend/.../myapp/management/commands/seed_locations.py` | One-time data seed command |

---

## In-Progress Work (resume here next session)

The multi-user backend refactor was started on branch `claude/add-claude-documentation-QYZVq`.

### Completed
- [x] `models.py` — all four models updated with timestamps, geo fields, widened char fields, unique constraints
- [x] `migrations/0007_multi_user_refactor.py` — schema migration written
- [x] `ReportAlgorithm.py` — full weighted occupancy algorithm with Haversine distance
- [x] `serializer.py` — fixed `UserLocationSerializer` wrong-model bug, added `HeatmapPointSerializer`, updated all fields
- [x] `constants/api.ts` — platform-aware API URL (from previous session)
- [x] `components/CampusMap.native.tsx` + `CampusMap.web.tsx` — platform split (from previous session)
- [x] `hooks/useLocationBackground.ts` — web-compatible, platform guards on TaskManager (from previous session)
- [x] `app/(tabs)/list.tsx` — uses shared `API_BASE_URL`, inline search, clean UI (from previous session)
- [x] `app/(tabs)/report.tsx` — uses shared `API_BASE_URL` + explicit `/reports/` path (from previous session)
- [x] `app/(tabs)/index.tsx` — uses `CampusMap` component, no overlapping placeholder (from previous session)

### Still TODO (pick up here)
1. **`views.py`** — needs full rewrite:
   - Remove reference to deleted `scrapeData.data` field in `get_latest_occupancy`
   - Replace `get_latest_occupancy` with algorithm-driven version (call `compute_occupancy` per location)
   - Fix `SaveUserLocationView` to upsert via `update_or_create(user_Id=...)` instead of creating duplicates
   - Add `get_heatmap_points` view: return active users (last 10 min) as `[{latitude, longitude, weight: 1.0}]`
   - Fix `UpdateKeyLocationsView` to upsert by `location_Id`
   - Remove the now-redundant `ReportAPIView` and `create_report` function-based view (duplicates `ReportView`)

2. **`urls.py`** — add `path('api/heatmap/', views.get_heatmap_points, name='heatmap')`

3. **`management/commands/seed_locations.py`** — create this file:
   - Creates `management/` and `management/commands/` directories (each needs `__init__.py`)
   - Seeds 4 McMaster locations into `keyLocation` using `update_or_create`:
     - Mills Library: lat=43.2628, lon=-79.9192, capacity=800, radius=120
     - Thode Library: lat=43.2628, lon=-79.9192, capacity=400, radius=100
     - Health Sciences Library: lat=43.26023, lon=-79.91790, capacity=300, radius=80
     - Student Union Study Hall: lat=43.26355, lon=-79.91774, capacity=200, radius=60

4. **`hooks/useLocationBackground.ts`** — change background task to POST to `${API_BASE_URL}/save-user-location/` instead of calling `prependUserLocation` (which writes to a local file). Needs a stable `user_Id` — use `expo-application` `getAndroidId`/`getIosIdForVendorAsync` or a UUID stored in `AsyncStorage`.

5. **`app/(tabs)/index.tsx`** — add heatmap fetch:
   ```typescript
   const [heatPoints, setHeatPoints] = useState(staticFallback);
   useEffect(() => {
     axios.get(`${API_BASE_URL}/heatmap/`)
       .then(({ data }) => setHeatPoints(data))
       .catch(() => {}); // keep static fallback silently
   }, []);
   ```

6. **Run migrations** after all backend changes: `python manage.py migrate && python manage.py seed_locations`

---

## Testing

- **Frontend:** No test suite exists yet. When adding tests, use Jest + React Native Testing Library (standard for Expo projects).
- **Backend:** `myapp/tests.py` exists but is empty. Use Django's built-in `TestCase` class; run with `python manage.py test`.
- **No CI/CD pipeline** — there are no GitHub Actions workflows. Consider adding one if the project grows.

---

## Known Gotchas

1. **Seed locations first:** `keyLocation` table must be populated via `python manage.py seed_locations` before `/api/occupancy/` returns any data.
2. **API base URL for physical devices:** Set `EXPO_PUBLIC_API_URL=http://<your-machine-ip>:8000/api` in `crowdsurfer/.env` when testing on a real phone.
3. **SQLite in development only:** The README mentions MongoDB, but the codebase uses SQLite3. Do not infer Mongo usage from documentation.
4. **Bluetooth needs physical device:** BLE scanning does not work in simulators or the web target. Test BLE features on real hardware.
5. **Background location on iOS:** Requires the `NSLocationAlwaysUsageDescription` permission configured in `app.json`; it is already set.
6. **CORS is open:** `CORS_ALLOW_ALL_ORIGINS = True` — restrict this before any public deployment.
7. **Selenium drivers:** `densityScraper.py` tries Chrome, then Edge, then Firefox. Ensure at least one browser is installed on the server running the scraper.
8. **Heatmap on iOS:** `react-native-maps` `Heatmap` is Android-only. The native map file guards it with `Platform.OS === 'android'`. On iOS, markers are shown but no heat overlay.
