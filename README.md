<<<<<<< HEAD


# Run and deploy your AI Studio app

This contains everything you need to run your app locally.


## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Optional: Real Transit Routing (No Docker)

This project can use OpenTripPlanner (OTP) for real transit itineraries (OSM + GTFS), instead of simulating bus routes.

1. Run OTP locally (Java) with an OSM extract and a GTFS feed for your city.
2. Set env vars:
   - `ROUTING_ENGINE="otp"`
   - `OTP_BASE_URL="http://localhost:8080"`
   - `OTP_PLAN_PATH="/otp/routers/default/plan"` (OTP1 default)

If OTP is not running or fails, the app falls back to simulated bus and bus+walk routes automatically.

## Vector Tiles + Offline Cache

This app supports a vector map mode for route display and offline-friendly caching:

1. Enable in `.env.local`:
   - `VITE_USE_VECTOR_TILES="true"`
   - `VITE_MAP_STYLE_URL="<your style.json URL>"`
   - `VITE_PMTILES_URL="<optional ranchi.pmtiles URL>"`
2. Run app and open route screen once while online (tiles/styles are cached by service worker).
3. Later, if network is unavailable:
   - cached map tiles/styles can still render
   - routing tries server first, then falls back to local JSON route cache.

Notes:
- Core routing logic remains on server.
- Local route cache key is based on origin, destination, and weight settings.

## Build Android APK (Capacitor)

This project includes a Node/Express API (`/api/*`). When running as an APK, the UI is loaded inside a WebView, so you must point the app to a reachable backend via `VITE_API_BASE_URL`.

**Prerequisites:** Android Studio + Android SDK, JDK (17+), Node.js

1. Set backend URL in `.env.local` (examples):
   - Emulator: `VITE_API_BASE_URL="http://10.0.2.2:3000"`
   - Device (same Wi‑Fi): `VITE_API_BASE_URL="http://<your-pc-lan-ip>:3000"`
2. Install Capacitor:
   - `npm i @capacitor/core @capacitor/android`
   - `npm i -D @capacitor/cli`
3. Build web assets: `npm run build`
4. Create Android project (once): `npx cap add android`
5. Sync web → Android: `npx cap sync android`
6. Open Android Studio: `npx cap open android`
7. Build APK:
   - Debug: Android Studio → Build → Build Bundle(s)/APK(s) → Build APK(s)
   - Or CLI (Windows): `cd android; .\gradlew assembleDebug`

Output APK (debug): `android\app\build\outputs\apk\debug\app-debug.apk`
=======
# Eco-Route
Smart Trip Planner - A production-ready full-stack web and Android application built with React (Vite + TypeScript), Node.js, Express, and MongoDB/PostgreSQL. Designed with scalable architecture and real-world deployment practices.
>>>>>>> d0a36c04907ec781a356afd0defb1c50554ec177
