# SmogWise 🌿

> **“Breathe better. Live wiser.”**  
> An environmental-health companion built with vanilla HTML, CSS, and JavaScript.

---

## 📖 Overview

**SmogWise** helps users understand the weather and air pollution around them, demystifies what the Air Quality Index (AQI) and individual pollutants actually mean, and delivers practical, personalized do's and don'ts for daily life—all while respecting user privacy and keeping health preferences strictly inside the browser.

### ✨ Key Features

- **Hyperlocal Weather & Air Quality**: Integrates Open-Meteo for real-time weather and location search, and WAQI (World Air Quality Index) for nearest ground-level monitoring stations.
- **Explainable Do’s & Don’ts**: A transparent rule-based engine provides actionable guidance across 4 daily domains:
  1. 🏃 **Outdoor Activity & Exercise**
  2. 🚴 **Commute & Daily Travel**
  3. 🍳 **Home & Cooking Ventilation**
  4. 🍃 **Indoor Smoke & Purifier Management**
  *Every suggestion includes an explicit "Why this is recommended" explanation!*
- **Household Sensitivity Profiles**: Tailor recommendations if children (under 14), older adults (65+), asthma/cardiovascular sensitive individuals, outdoor athletes, or gas stove cooking are present in your home. All preferences remain 100% in local `localStorage` and are never shared.
- **Accurate AQI Scale Labeling & CPCB Notice**: Clearly identifies the US EPA AQI standard and provides an informative banner linking directly to the Indian Central Pollution Control Board (CPCB) Sameer portal to avoid confusing US EPA AQI with India's National AQI (NAQI).
- **Ground Sensor vs Model Transparency**: Clearly distinguishes between live physical ground stations and numerical atmospheric models (Copernicus CAMS via Open-Meteo).
- **Hourly Forecast & Trend**: 12-hour projections for temperature, rain probability, and AQI progression.
- **Interactive Educational Guide**: Plain-language breakdown of AQI bands and key pollutants: PM2.5, PM10, Ozone ($O_3$), Nitrogen Dioxide ($NO_2$), Sulfur Dioxide ($SO_2$), and Carbon Monoxide ($CO$).
- **Privacy-First & Zero-Cost Architecture**: Fully functional out of the box with zero required API keys. Optional Grok AI assistance is supported strictly through a secure server-side proxy—no API keys in client-side code, and no health or location data sent to AI.
- **Accessibility & Reduced Motion**: Full keyboard navigation, visible focus indicators, high contrast colors with text/icon reinforcement, and `@media (prefers-reduced-motion: reduce)` support that gracefully displays static graphics in place of animated elements.

---

## 🚀 Quick Start (Local Run)

SmogWise has zero external runtime dependencies. Node.js built-in standard library is all you need:

```bash
# 1. Clone or navigate to the repository folder
cd /path/to/smoke

# 2. Start the local server
npm start
# or: node server.js
```

Open your browser to:
```
http://localhost:3456
```

---

## 🧪 Testing & Verification (Playwright)

SmogWise features a comprehensive Playwright end-to-end test suite that verifies:
- Desktop & Mobile responsive layouts
- Manual city search with debounced autocomplete
- Geolocation permission flows (modal explanation & graceful denial handling)
- Recommendation engine changes across AQI categories (Good, Sensitive, Hazardous)
- Household profile toggles and dynamic guidance adaptation
- Educational guide modal with all 6 pollutants & CPCB advisories
- API failure fallback to demo/model mode
- User flow video recording generation

To run tests:

```bash
# Run all Playwright tests
npm test

# Run tests with UI runner
npm run test:ui
```

All 17 tests run reliably using mocked network fixtures.

### Generated Artifacts
- **Screenshots** (`screenshots/`):
  - `desktop-layout.png` — Full-page desktop view
  - `mobile-layout.png` — Full-page mobile view (Pixel 5)
  - `city-search.png` — City search autocomplete flow
  - `geolocation-denied.png` — Graceful handling of location denial
  - `educational-guide.png` — Educational guide modal with pollutant details
- **Recordings** (`recordings/`):
  - `main-user-flow.webm` — Complete interactive walkthrough recording
  - `mobile-user-flow.webm` — Mobile walkthrough recording

---

## 🌐 Free Hosting Instructions

SmogWise is designed to run anywhere with zero hassle. You can host it as a purely static website on free platforms or deploy the lightweight Node server.

### Option A: Pure Static Hosting (GitHub Pages / Netlify / Cloudflare Pages / Vercel)
*In static hosting mode, SmogWise runs in 100% free mode using its built-in JavaScript rule engine and direct browser calls to Open-Meteo and WAQI.*

#### 1. GitHub Pages
1. Push this repository to GitHub.
2. In your GitHub repository, click **Settings** > **Pages**.
3. Under **Build and deployment**, select **Source: Deploy from a branch**.
4. Choose `main` branch and `/ (root)` folder, then click **Save**.
5. Your website will be live in 1–2 minutes at `https://<username>.github.io/<repo-name>/`.

#### 2. Netlify (Drag & Drop or Git)
1. Go to [app.netlify.com](https://app.netlify.com/).
2. Drag and drop the project folder directly into the Netlify dashboard, or connect your Git repo.
3. Build command: *(leave empty)*.
4. Publish directory: `.` (root).
5. Done! Your site is live with HTTPS instantly.

#### 3. Cloudflare Pages / Vercel
- Deploy as a static site with root output directory.

---

### Option B: Node.js Hosting with Optional Grok AI Proxy (Render / Railway / Fly.io)
If you wish to enable the optional Grok AI proxy server:

1. Deploy the repository to **Render** or **Railway** as a Node.js web service.
2. Set the start command: `node server.js`.
3. Set optional environment variable:
   ```env
   GROK_API_KEY=xai-your-api-key-here
   PORT=3456
   ```

---

## 🔑 API Setup & Configuration

| Service | Cost | Requirement | Notes |
| :--- | :--- | :--- | :--- |
| **Open-Meteo Weather** | **Free** | No API Key needed | High-resolution global meteorological data & forecasts. |
| **Open-Meteo Geocoding** | **Free** | No API Key needed | Fast global city & coordinate search. |
| **Open-Meteo Air Quality** | **Free** | No API Key needed | Hourly CAMS atmospheric model forecast backup. |
| **WAQI (aqicn.org)** | **Free** | Built-in public demo token | Pre-configured. Users can optionally input their personal free token in app settings. |
| **xAI Grok API** | **Paid (Optional)** | `GROK_API_KEY` on server | Optional server-side proxy only. Never exposed in browser JavaScript. Local rule engine handles 100% of features for free if omitted. |

### How to get a free personal WAQI token (Optional)
1. Visit [aqicn.org/data-platform/token/](https://aqicn.org/data-platform/token/).
2. Enter your name and email to receive a free API key.
3. Click the ⚙️ **Settings** button in SmogWise and paste your token.

---

## 🏗️ Project Architecture & File Structure

```
smoke/
├── index.html                   # Semantic HTML5 single-page application
├── server.js                    # Zero-dependency Node.js HTTP server & secure Grok proxy
├── package.json                 # Scripts and development dependencies
├── playwright.config.js         # Playwright test & recording configuration
├── logo.png                     # Official SmogWise logo (reused)
├── Gemini_Generated_Gif_qn92k2qn92k2qn92.gif # Official animation (reused)
├── css/
│   ├── main.css                 # Base theme, typography, CSS variables, resets
│   ├── components.css           # Navigation, cards, spectrum bar, modals, forms
│   └── responsive.css           # Mobile breakpoints & prefers-reduced-motion
├── js/
│   ├── config.js                # App constants, storage keys, endpoints, presets
│   ├── aqi-scale.js             # US EPA AQI breakpoints, CPCB NAQI notes, pollutant info
│   ├── demo-data.js             # 5 rich mock presets (Good, Moderate, Sensitive, Unhealthy, Hazardous)
│   ├── recommendations.js       # Transparent, explainable JavaScript rule-based engine
│   ├── api.js                   # Unified Open-Meteo + WAQI data service with fallback
│   ├── grok-client.js           # Client wrapper for optional server proxy (zero PII)
│   └── app.js                   # Main application coordinator, geolocation, storage, UI
├── tests/
│   └── smogwise.spec.js         # 17 Playwright E2E browser tests
├── screenshots/                 # Captured test screenshots (Desktop, Mobile, Search, etc.)
└── recordings/                  # Screen recordings of user flows (.webm)
```

---

## ⚖️ Standards & Disclaimers

### US EPA AQI vs. India National AQI (NAQI)
SmogWise standardizes readings to the **US EPA Air Quality Index (0–500)** as reported by WAQI. India's Central Pollution Control Board (CPCB) calculates the National Air Quality Index (NAQI) using different 24-hour sub-index breakpoints. For official Indian regulatory advisories, always refer to the [CPCB National AQI Portal](https://airquality.cpcb.gov.in/AQI_India/).

### Non-Medical Disclaimer
SmogWise is an informational health-literacy tool. It cannot measure indoor air quality in your specific room, nor does it replace physician consultation or official civil emergency alerts.
# smoke
