// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Ensure screenshots and recordings directories exist
test.beforeAll(() => {
  const screenshotsDir = path.join(__dirname, '../screenshots');
  const recordingsDir = path.join(__dirname, '../recordings');
  if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });
  if (!fs.existsSync(recordingsDir)) fs.mkdirSync(recordingsDir, { recursive: true });
});

// Mock Data fixtures
const MOCK_WEATHER = {
  current: {
    temperature_2m: 21,
    apparent_temperature: 21,
    relative_humidity_2m: 65,
    wind_speed_10m: 8,
    wind_direction_10m: 180,
    precipitation: 0.0,
    weather_code: 1
  },
  hourly: {
    time: Array.from({ length: 12 }, (_, i) => new Date(Date.now() + i * 3600000).toISOString()),
    temperature_2m: [21, 22, 23, 22, 21, 20, 19, 18, 17, 17, 16, 16],
    relative_humidity_2m: [65, 63, 60, 62, 65, 70, 75, 78, 80, 82, 85, 85],
    wind_speed_10m: [8, 9, 10, 8, 7, 6, 6, 5, 5, 5, 4, 4],
    precipitation_probability: [0, 0, 5, 10, 15, 0, 0, 0, 0, 0, 0, 0],
    weather_code: [1, 1, 2, 2, 3, 3, 1, 1, 1, 1, 1, 1]
  }
};

const MOCK_WAQI_UNHEALTHY = {
  status: 'ok',
  data: {
    aqi: 188,
    dominentpol: 'pm25',
    city: {
      name: 'Delhi Ground Monitoring Center',
      url: 'https://aqicn.org/city/delhi/'
    },
    iaqi: {
      pm25: { v: 128.4 },
      pm10: { v: 242.0 },
      o3: { v: 41.0 },
      no2: { v: 92.4 },
      so2: { v: 18.5 },
      co: { v: 28.0 }
    },
    time: { s: '2026-11-21 08:00:00' },
    attributions: [
      { name: 'Central Pollution Control Board (CPCB)', url: 'https://cpcb.nic.in/' },
      { name: 'Delhi Pollution Control Committee (DPCC)', url: 'https://dpcc.delhigovt.nic.in/' },
      { name: 'World Air Quality Index Project (waqi.info)', url: 'https://waqi.info/' }
    ]
  }
};

const MOCK_GEOCODING_LONDON = {
  results: [
    {
      id: 2643743,
      name: 'London',
      latitude: 51.50853,
      longitude: -0.12574,
      country: 'United Kingdom',
      admin1: 'England'
    }
  ]
};

// Helper to set up network mocks for repeatable offline testing
async function setupMocks(page) {
  // Mock Geocoding
  await page.route('**/geocoding-api.open-meteo.com/**', async route => {
    const url = route.request().url();
    if (url.includes('London')) {
      await route.fulfill({ json: MOCK_GEOCODING_LONDON });
    } else {
      await route.fulfill({
        json: {
          results: [
            { id: 1, name: 'Sample City', latitude: 28.61, longitude: 77.20, country: 'India', admin1: 'Delhi' }
          ]
        }
      });
    }
  });

  // Mock Weather
  await page.route('**/api.open-meteo.com/v1/forecast**', async route => {
    await route.fulfill({ json: MOCK_WEATHER });
  });

  // Mock Open-Meteo Air Quality Model
  await page.route('**/air-quality-api.open-meteo.com/**', async route => {
    await route.fulfill({
      json: {
        current: {
          pm2_5: 128.4,
          pm10: 242.0,
          carbon_monoxide: 2800,
          nitrogen_dioxide: 92.4,
          sulphur_dioxide: 18.5,
          ozone: 41.0,
          us_aqi: 188
        },
        hourly: {
          time: MOCK_WEATHER.hourly.time,
          pm2_5: [128, 134, 140, 132, 125, 120, 115, 110, 105, 100, 95, 90],
          us_aqi: [188, 192, 195, 190, 185, 182, 178, 175, 172, 170, 165, 160]
        }
      }
    });
  });

  // Mock WAQI Feed
  await page.route('**/api.waqi.info/feed/**', async route => {
    await route.fulfill({ json: MOCK_WAQI_UNHEALTHY });
  });
}

test.describe('SmogWise E2E Tests & UI Verification', () => {

  test('Desktop layout, branding, AQI, weather, and full page screenshot', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop test only');
    await setupMocks(page);
    await page.goto('/');

    // Check Branding & Tagline
    await expect(page.locator('.brand-title')).toHaveText('SmogWise');
    await expect(page.locator('.brand-tagline')).toHaveText('Breathe better. Live wiser.');
    await expect(page.locator('header .brand-logo')).toBeVisible();

    // Check AQI Card renders properly
    await expect(page.locator('#aqi-value')).not.toHaveText('--');
    await expect(page.locator('#aqi-category-name')).toBeVisible();
    await expect(page.locator('#station-scale-badge')).toContainText('Scale: US EPA');

    // Check Weather Card
    await expect(page.locator('#weather-temp')).toHaveText('21');
    await expect(page.locator('#weather-humidity')).toHaveText('65%');

    // Check Pollutants Breakdown Grid (all 6 pollutants)
    const pollutantCards = page.locator('.pollutant-card');
    await expect(pollutantCards).toHaveCount(6);

    // Check Practical Do's & Don'ts (4 domains)
    const recCards = page.locator('.rec-card');
    await expect(recCards).toHaveCount(4);
    await expect(page.locator('.rec-why-box').first()).toContainText('Why this is recommended');

    // Check CPCB banner for India
    await expect(page.locator('#cpcb-banner-container')).toBeVisible();

    // Check Disclaimer in Footer
    await expect(page.locator('.disclaimer-box')).toContainText('Important Informational Notice');

    // Capture Full Page Desktop Screenshot
    await page.screenshot({ path: 'screenshots/desktop-layout.png', fullPage: true });
  });

  test('Mobile responsive layout check', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile test running on mobile project');
    await setupMocks(page);
    await page.goto('/');

    await expect(page.locator('.brand-title')).toHaveText('SmogWise');
    await expect(page.locator('#main-aqi-card')).toBeVisible();
    await expect(page.locator('.search-box-wrapper')).toBeVisible();

    // Capture Full Page Mobile Screenshot
    await page.screenshot({ path: 'screenshots/mobile-layout.png', fullPage: true });
  });

  test('Manual city search with autocomplete', async ({ page, isMobile }) => {
    await setupMocks(page);
    await page.goto('/');

    const searchInput = page.locator('#search-input');
    await searchInput.fill('London');

    // Wait for dropdown
    const dropdown = page.locator('#search-dropdown-list');
    await expect(dropdown).toHaveClass(/active/);
    const firstItem = dropdown.locator('.search-item').first();
    await expect(firstItem).toContainText('London');

    // Click suggestion
    await firstItem.click();

    // Verify location updated
    await expect(page.locator('#location-display-name')).toContainText('London');
    if (!isMobile) await page.screenshot({ path: 'screenshots/city-search.png' });
  });

  test('Geolocation permission flow (modal and denied state)', async ({ page, context, isMobile }) => {
    await setupMocks(page);
    await page.goto('/');

    // 1. Click "Check my air" -> opens explanation modal
    await page.locator('#btn-header-locate').click();
    const modal = page.locator('#modal-location-explain');
    await expect(modal).toHaveClass(/active/);
    await expect(modal).toContainText('Why SmogWise requests your location');

    // Deny geolocation in browser context
    await context.grantPermissions([]); // No permissions

    // Click proceed
    await page.locator('#btn-proceed-geolocation').click();

    // Check for toast notification or graceful handling
    const warningToast = page.locator('.toast.toast-warning');
    await expect(warningToast).toBeVisible();
    await expect(warningToast).toContainText('Location');

    if (!isMobile) await page.screenshot({ path: 'screenshots/geolocation-denied.png' });
  });

  test('Recommendation engine changes across AQI categories (Good, Sensitive, Hazardous)', async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');

    // 1. Select "Good" demo scenario (AQI 24)
    await page.locator('#demo-select').selectOption('good');
    await expect(page.locator('#aqi-value')).toHaveText('24');
    await expect(page.locator('#aqi-category-name')).toHaveText('Good');
    // Check outdoor recommendation is "DO"
    const firstRecGood = page.locator('.rec-card').first();
    await expect(firstRecGood).toHaveClass(/rec-do/);
    await expect(firstRecGood).toContainText('Ideal for Outdoor Sports');

    // 2. Select "Sensitive" demo scenario (AQI 128)
    await page.locator('#demo-select').selectOption('sensitive');
    await expect(page.locator('#aqi-value')).toHaveText('128');
    await expect(page.locator('#aqi-category-name')).toHaveText('Unhealthy for Sensitive Groups');

    // 3. Select "Hazardous" demo scenario (AQI 348)
    await page.locator('#demo-select').selectOption('hazardous');
    await expect(page.locator('#aqi-value')).toHaveText('348');
    await expect(page.locator('#aqi-category-name')).toHaveText('Hazardous');
    const firstRecHazardous = page.locator('.rec-card').first();
    await expect(firstRecHazardous).toHaveClass(/rec-dont/);
    await expect(firstRecHazardous).toContainText('Strictly Avoid All Outdoor Exertion');
  });

  test('Household sensitivity toggle personalizes recommendations', async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');

    // Open household profile modal
    await page.locator('#btn-household-profile').click();
    const modal = page.locator('#modal-household');
    await expect(modal).toHaveClass(/active/);

    // Toggle Children and Sensitive
    await page.locator('#pref-children').check();
    await page.locator('#pref-sensitive').check();
    await page.locator('#btn-save-household').click();

    // Check modal closed and active badge visible
    await expect(modal).not.toHaveClass(/active/);
    await expect(page.locator('#household-active-badge')).toBeVisible();

    // Verify recommendations explain children/sensitivity
    await expect(page.locator('#household-pills-list')).toContainText('Children (Under 14)');
  });

  test('Educational Guide Modal ("What does this mean?") with all pollutants and CPCB note', async ({ page, isMobile }) => {
    await setupMocks(page);
    await page.goto('/');

    await page.locator('#btn-open-guide').click();
    const guideModal = page.locator('#modal-educational-guide');
    await expect(guideModal).toHaveClass(/active/);

    // Verify all 6 pollutants are present in guide
    await expect(page.locator('#guide-pollutant-pm25')).toBeVisible();
    await expect(page.locator('#guide-pollutant-pm10')).toBeVisible();
    await expect(page.locator('#guide-pollutant-o3')).toBeVisible();
    await expect(page.locator('#guide-pollutant-no2')).toBeVisible();
    await expect(page.locator('#guide-pollutant-so2')).toBeVisible();
    await expect(page.locator('#guide-pollutant-co')).toBeVisible();

    // Verify CPCB comparison note is present
    await expect(guideModal).toContainText('India National AQI (CPCB)');

    if (!isMobile) await page.screenshot({ path: 'screenshots/educational-guide.png' });
    await guideModal.locator('.modal-close-btn').click();
    await expect(guideModal).not.toHaveClass(/active/);
  });

  test('API failure fallback to demo/model mode', async ({ page }) => {
    // Force API 500 error
    await page.route('**/api.waqi.info/**', route => route.fulfill({ status: 500 }));
    await page.route('**/air-quality-api.open-meteo.com/**', route => route.fulfill({ status: 500 }));

    await page.goto('/');

    // The app falls back gracefully to sample station demo data
    await expect(page.locator('#aqi-value')).not.toHaveText('--');
    await expect(page.locator('.toast.toast-warning')).toBeVisible();
  });

  test('Main user flow video recording walkthrough', async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');

    // 1. Initial page exploration
    await page.waitForTimeout(500);

    // 2. Open educational guide
    await page.locator('#btn-open-guide').click();
    await page.waitForTimeout(800);
    await page.locator('#modal-educational-guide .modal-close-btn').click();
    await page.waitForTimeout(400);

    // 3. Customize household preferences
    await page.locator('#btn-household-profile').click();
    await page.waitForTimeout(600);
    await page.locator('#pref-children').check();
    await page.locator('#pref-sensitive').check();
    await page.locator('#btn-save-household').click();
    await page.waitForTimeout(600);

    // 4. Try different AQI categories via Demo mode
    await page.locator('#demo-select').selectOption('good');
    await page.waitForTimeout(700);
    await page.locator('#demo-select').selectOption('unhealthy');
    await page.waitForTimeout(700);

    // 5. Search for a city
    await page.locator('#search-input').fill('London');
    await page.waitForTimeout(600);
    const firstItem = page.locator('#search-dropdown-list .search-item').first();
    if (await firstItem.isVisible()) {
      await firstItem.click();
      await page.waitForTimeout(800);
    }

    // 6. Scroll down to see recommendations and forecast
    await page.evaluate(() => window.scrollTo({ top: 700, behavior: 'smooth' }));
    await page.waitForTimeout(800);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(500);
  });

});
