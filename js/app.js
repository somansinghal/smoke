// SmogWise Main Application Controller
// Vanilla JavaScript Single Page Architecture

(function() {
  'use strict';

  // Application State
  const state = {
    location: {
      name: 'New Delhi, India',
      lat: 28.6139,
      lng: 77.2090,
      country: 'India'
    },
    weather: null,
    airQuality: null,
    recommendations: null,
    tempUnit: 'C',
    household: {
      children: false,
      seniors: false,
      sensitive: false,
      athlete: false,
      gasCooking: false
    },
    isDemoMode: false,
    activeDemoId: null,
    isLoading: false
  };

  // DOM Elements Cache
  const DOM = {
    // Header & Navigation
    btnHeaderLocate: document.getElementById('btn-header-locate'),
    btnHouseholdProfile: document.getElementById('btn-household-profile'),
    householdActiveBadge: document.getElementById('household-active-badge'),
    btnOpenGuide: document.getElementById('btn-open-guide'),
    btnOpenSettings: document.getElementById('btn-open-settings'),
    btnRefreshData: document.getElementById('btn-refresh-data'),
    refreshIcon: document.getElementById('refresh-icon'),
    refreshText: document.getElementById('refresh-text'),

    // Hero & Search
    searchForm: document.getElementById('city-search-form'),
    searchInput: document.getElementById('search-input'),
    btnHeroLocate: document.getElementById('btn-hero-locate'),
    searchDropdownList: document.getElementById('search-dropdown-list'),
    demoSelect: document.getElementById('demo-select'),
    quickCityChips: document.querySelectorAll('.quick-city-chip'),

    // Station & Notices
    locationDisplayName: document.getElementById('location-display-name'),
    dataSourceBadge: document.getElementById('data-source-badge'),
    stationReportingName: document.getElementById('station-reporting-name'),
    stationUpdateTime: document.getElementById('station-update-time'),
    stationScaleBadge: document.getElementById('station-scale-badge'),
    cpcbBannerContainer: document.getElementById('cpcb-banner-container'),
    modelNoticeContainer: document.getElementById('model-notice-container'),
    modelNoticeText: document.getElementById('model-notice-text'),

    // Primary AQI Card
    mainAqiCard: document.getElementById('main-aqi-card'),
    aqiScaleText: document.getElementById('aqi-scale-text'),
    aqiRing: document.getElementById('aqi-ring'),
    aqiValue: document.getElementById('aqi-value'),
    aqiCategoryIcon: document.getElementById('aqi-category-icon'),
    aqiCategoryName: document.getElementById('aqi-category-name'),
    aqiCategorySummary: document.getElementById('aqi-category-summary'),
    dominantPollutantName: document.getElementById('dominant-pollutant-name'),
    aqiSpectrumIndicator: document.getElementById('aqi-spectrum-indicator'),

    // Weather Card
    btnToggleUnit: document.getElementById('btn-toggle-unit'),
    weatherTemp: document.getElementById('weather-temp'),
    weatherTempUnit: document.getElementById('weather-temp-unit'),
    weatherFeels: document.getElementById('weather-feels'),
    weatherConditionIcon: document.getElementById('weather-condition-icon'),
    weatherConditionText: document.getElementById('weather-condition-text'),
    weatherHumidity: document.getElementById('weather-humidity'),
    weatherWind: document.getElementById('weather-wind'),
    weatherRain: document.getElementById('weather-rain'),
    weatherWindDir: document.getElementById('weather-wind-dir'),

    // Pollutants & Recommendations
    pollutantsContainer: document.getElementById('pollutants-container'),
    btnExplainPollutants: document.getElementById('btn-explain-pollutants'),
    recsSummary: document.getElementById('recs-summary'),
    householdPillsList: document.getElementById('household-pills-list'),
    btnEditHouseholdInline: document.getElementById('btn-edit-household-inline'),
    recsCardsGrid: document.getElementById('recommendations-cards-grid'),
    engineStatusText: document.getElementById('engine-status-text'),
    recsUpdateTime: document.getElementById('recs-update-time'),

    // Forecast & Attributions
    forecastTimelineContainer: document.getElementById('forecast-timeline-container'),
    attributionsList: document.getElementById('attributions-list'),

    // Modals
    modalLocationExplain: document.getElementById('modal-location-explain'),
    btnProceedGeolocation: document.getElementById('btn-proceed-geolocation'),
    modalHousehold: document.getElementById('modal-household'),
    btnSaveHousehold: document.getElementById('btn-save-household'),
    prefChildren: document.getElementById('pref-children'),
    prefSeniors: document.getElementById('pref-seniors'),
    prefSensitive: document.getElementById('pref-sensitive'),
    prefAthlete: document.getElementById('pref-athlete'),
    prefGasCooking: document.getElementById('pref-gascooking'),
    modalEducationalGuide: document.getElementById('modal-educational-guide'),
    guidePollutantsList: document.getElementById('guide-pollutants-list'),
    modalSettings: document.getElementById('modal-settings'),
    btnSaveSettings: document.getElementById('btn-save-settings'),
    customWaqiToken: document.getElementById('custom-waqi-token'),
    toastContainer: document.getElementById('toast-container'),

    // Footer Links
    linkFooterGuide: document.getElementById('link-footer-guide'),
    linkFooterHousehold: document.getElementById('link-footer-household'),
    linkFooterLocate: document.getElementById('link-footer-locate')
  };

  /**
   * Initialize Application
   */
  async function init() {
    loadSavedPreferences();
    populateGuidePollutants();
    bindEvents();

    // Check if there was a saved last location
    const savedLoc = localStorage.getItem(CONFIG.STORAGE_KEYS.LAST_LOCATION);
    if (savedLoc) {
      try {
        state.location = JSON.parse(savedLoc);
      } catch (e) {
        // keep default New Delhi
      }
    }

    // Initial Data Fetch
    await fetchLocationData(state.location);
  }

  /**
   * Load Preferences from localStorage (100% Client-Side)
   */
  function loadSavedPreferences() {
    try {
      const savedHh = localStorage.getItem(CONFIG.STORAGE_KEYS.PREFERENCES);
      if (savedHh) {
        state.household = { ...state.household, ...JSON.parse(savedHh) };
      }

      const savedUnit = localStorage.getItem(CONFIG.STORAGE_KEYS.TEMP_UNIT);
      if (savedUnit === 'F' || savedUnit === 'C') {
        state.tempUnit = savedUnit;
      }

      const savedToken = localStorage.getItem(CONFIG.STORAGE_KEYS.CUSTOM_WAQI_TOKEN);
      if (savedToken && DOM.customWaqiToken) {
        DOM.customWaqiToken.value = savedToken;
      }

      updateHouseholdUI();
      updateTempUnitRadio();
    } catch (e) {
      console.warn('[SmogWise] Could not load saved preferences:', e);
    }
  }

  /**
   * Save Household Preferences
   */
  function saveHouseholdPreferences() {
    state.household = {
      children: Boolean(DOM.prefChildren?.checked),
      seniors: Boolean(DOM.prefSeniors?.checked),
      sensitive: Boolean(DOM.prefSensitive?.checked),
      athlete: Boolean(DOM.prefAthlete?.checked),
      gasCooking: Boolean(DOM.prefGasCooking?.checked)
    };

    localStorage.setItem(CONFIG.STORAGE_KEYS.PREFERENCES, JSON.stringify(state.household));
    updateHouseholdUI();
    closeAllModals();
    showToast('Household preferences updated. Guidance refreshed!', 'success');

    // Regenerate recommendations with new household profile
    generateAndRenderRecommendations();
  }

  /**
   * Update Household Badges and Checkbox States
   */
  function updateHouseholdUI() {
    if (DOM.prefChildren) DOM.prefChildren.checked = state.household.children;
    if (DOM.prefSeniors) DOM.prefSeniors.checked = state.household.seniors;
    if (DOM.prefSensitive) DOM.prefSensitive.checked = state.household.sensitive;
    if (DOM.prefAthlete) DOM.prefAthlete.checked = state.household.athlete;
    if (DOM.prefGasCooking) DOM.prefGasCooking.checked = state.household.gasCooking;

    const tags = [];
    if (state.household.children) tags.push('Children (Under 14)');
    if (state.household.seniors) tags.push('Older adults (65+)');
    if (state.household.sensitive) tags.push('Air Sensitive / Asthma');
    if (state.household.athlete) tags.push('Outdoor Athlete');
    if (state.household.gasCooking) tags.push('Gas Stove Cooking');

    const hasCustom = tags.length > 0;
    if (DOM.householdActiveBadge) {
      DOM.householdActiveBadge.style.display = hasCustom ? 'inline-flex' : 'none';
    }

    if (DOM.householdPillsList) {
      if (!hasCustom) {
        DOM.householdPillsList.innerHTML = '<span class="household-tag">General Adult</span>';
      } else {
        DOM.householdPillsList.innerHTML = tags.map(t => `<span class="household-tag">${t}</span>`).join('');
      }
    }
  }

  /**
   * Fetch All Data for a Given Location (Weather + Air Quality)
   */
  async function fetchLocationData(loc) {
    if (state.isLoading) return;
    setLoadingState(true);
    state.isDemoMode = false;
    if (DOM.demoSelect) DOM.demoSelect.value = '';

    try {
      state.location = loc;
      localStorage.setItem(CONFIG.STORAGE_KEYS.LAST_LOCATION, JSON.stringify(loc));

      // Fetch weather and air quality in parallel
      const [weatherRes, airRes] = await Promise.allSettled([
        SMOGWISE_API.fetchWeather(loc.lat, loc.lng),
        SMOGWISE_API.fetchAirQuality(loc.lat, loc.lng)
      ]);

      if (weatherRes.status === 'fulfilled') {
        state.weather = weatherRes.value;
      } else {
        console.warn('[SmogWise] Weather fetch error:', weatherRes.reason);
        state.weather = createFallbackWeather();
      }

      if (airRes.status === 'fulfilled') {
        state.airQuality = airRes.value;
      } else {
        console.warn('[SmogWise] Air quality fetch error:', airRes.reason);
        // Fall back to demo data if both real APIs fail completely
        showToast('Live monitoring station unreachable. Loading sample station data.', 'warning');
        loadDemoPreset('unhealthy');
        setLoadingState(false);
        return;
      }

      // Render Dashboard
      renderDashboard();
      showToast(`Updated conditions for ${loc.name}`, 'success');

    } catch (err) {
      console.error('[SmogWise] Error fetching data:', err);
      showToast('Could not load data for this location. Switching to demo mode.', 'error');
      loadDemoPreset('moderate');
    } finally {
      setLoadingState(false);
    }
  }

  /**
   * Render Dashboard Components
   */
  function renderDashboard() {
    renderStationHeader();
    renderAqiCard();
    renderWeatherCard();
    renderPollutants();
    generateAndRenderRecommendations();
    renderForecastTimeline();
    renderAttributions();
  }

  /**
   * Station Header, CPCB notice & Model disclaimer
   */
  function renderStationHeader() {
    const loc = state.location;
    const aq = state.airQuality;
    const station = aq.station;

    DOM.locationDisplayName.textContent = loc.name || 'Local Atmosphere';
    DOM.stationReportingName.textContent = station.name || 'Ground Station';
    DOM.stationUpdateTime.textContent = `Updated ${station.lastUpdated}`;
    DOM.stationScaleBadge.textContent = `Scale: ${station.scale}`;

    // Source badge
    if (station.isLiveStation) {
      DOM.dataSourceBadge.className = 'badge badge-live';
      DOM.dataSourceBadge.textContent = 'Live Ground Station';
      DOM.modelNoticeContainer.style.display = 'none';
    } else {
      DOM.dataSourceBadge.className = 'badge badge-forecast';
      DOM.dataSourceBadge.textContent = 'Atmospheric Forecast Model';
      DOM.modelNoticeContainer.style.display = 'block';
      if (DOM.modelNoticeText) {
        DOM.modelNoticeText.innerHTML = `Showing <strong>${station.name}</strong>. Projected estimate via Copernicus CAMS numerical models, not a live ground station measurement.`;
      }
    }

    // Check India CPCB Notice
    const isIndia = (loc.country && loc.country.toLowerCase().includes('india')) ||
                    (loc.name && loc.name.toLowerCase().includes('delhi')) ||
                    (loc.name && loc.name.toLowerCase().includes('mumbai')) ||
                    (loc.name && loc.name.toLowerCase().includes('bangalore')) ||
                    (loc.name && loc.name.toLowerCase().includes('india'));

    DOM.cpcbBannerContainer.style.display = isIndia ? 'flex' : 'none';
  }

  /**
   * Render Primary AQI Card
   */
  function renderAqiCard() {
    const aq = state.airQuality;
    const aqi = Math.round(Number(aq.aqi) || 0);
    const cat = AQI_SCALE.getCategory(aqi);

    DOM.aqiValue.textContent = aqi;
    DOM.aqiCategoryName.textContent = cat.name;
    DOM.aqiCategoryIcon.textContent = cat.icon;
    DOM.aqiCategorySummary.textContent = cat.summary;
    DOM.dominantPollutantName.textContent = (aq.dominantPollutant || 'PM2.5').toUpperCase();
    DOM.aqiScaleText.textContent = aq.station.scale;

    // Styling according to category
    DOM.mainAqiCard.style.borderLeftColor = cat.color;
    DOM.aqiRing.style.borderColor = cat.color;
    DOM.aqiRing.style.background = cat.bgColor;
    DOM.aqiValue.style.color = cat.textColor;
    DOM.aqiCategoryName.style.color = cat.textColor;

    // Spectrum Indicator position (0 to 500 mapped to 0% to 100%)
    const pct = Math.min(100, Math.max(0, (aqi / 400) * 100));
    DOM.aqiSpectrumIndicator.style.left = `${pct}%`;
  }

  /**
   * Render Weather Card
   */
  function renderWeatherCard() {
    const w = state.weather;
    if (!w) return;

    const displayTemp = state.tempUnit === 'F' ? cToF(w.temperature) : w.temperature;
    const displayFeels = state.tempUnit === 'F' ? cToF(w.apparentTemperature) : w.apparentTemperature;

    DOM.weatherTemp.textContent = displayTemp;
    DOM.weatherTempUnit.textContent = `°${state.tempUnit}`;
    DOM.weatherFeels.textContent = displayFeels;
    DOM.weatherConditionIcon.textContent = w.conditionIcon || '🌤️';
    DOM.weatherConditionText.textContent = w.condition || 'Fair Weather';
    DOM.weatherHumidity.textContent = `${w.humidity}%`;
    DOM.weatherWind.textContent = `${w.windSpeed} km/h`;
    DOM.weatherRain.textContent = `${(w.precipitation || 0).toFixed(1)} mm`;
    DOM.weatherWindDir.textContent = w.windDirection || 'N/A';
  }

  /**
   * Render Pollutants Breakdown
   */
  function renderPollutants() {
    const aq = state.airQuality;
    const container = DOM.pollutantsContainer;
    container.innerHTML = '';

    const list = [
      { key: 'pm25', def: AQI_SCALE.POLLUTANTS.pm25 },
      { key: 'pm10', def: AQI_SCALE.POLLUTANTS.pm10 },
      { key: 'o3', def: AQI_SCALE.POLLUTANTS.o3 },
      { key: 'no2', def: AQI_SCALE.POLLUTANTS.no2 },
      { key: 'so2', def: AQI_SCALE.POLLUTANTS.so2 },
      { key: 'co', def: AQI_SCALE.POLLUTANTS.co }
    ];

    list.forEach(item => {
      const reading = aq.pollutants?.[item.key];
      const hasValue = reading && reading.value != null && !isNaN(reading.value);
      const valStr = hasValue ? reading.value : '--';
      const unit = reading?.unit || item.def.unit;

      let statusPillClass = 'badge-live';
      let statusText = 'Normal';

      if (hasValue) {
        if (item.key === 'pm25') {
          if (reading.value > 150) { statusText = 'Hazardous'; statusPillClass = 'badge-demo'; }
          else if (reading.value > 55) { statusText = 'High'; statusPillClass = 'badge-demo'; }
          else if (reading.value > 35) { statusText = 'Elevated'; statusPillClass = 'badge-forecast'; }
          else if (reading.value > 12) { statusText = 'Moderate'; statusPillClass = 'badge-live'; }
          else { statusText = 'Good'; statusPillClass = 'badge-live'; }
        } else if (item.key === 'pm10') {
          if (reading.value > 150) { statusText = 'High'; statusPillClass = 'badge-demo'; }
          else if (reading.value > 54) { statusText = 'Moderate'; statusPillClass = 'badge-live'; }
          else { statusText = 'Good'; statusPillClass = 'badge-live'; }
        }
      }

      const card = document.createElement('div');
      card.className = 'pollutant-card';
      card.innerHTML = `
        <div>
          <div class="pollutant-header">
            <span class="pollutant-symbol">${item.def.symbol}</span>
            <button type="button" class="pollutant-info-btn" data-pollutant="${item.key}" title="Learn about ${item.def.name}" aria-label="Learn about ${item.def.name}">?</button>
          </div>
          <div class="pollutant-name">${item.def.name}</div>
        </div>
        <div>
          <div class="pollutant-value-row">
            <span class="pollutant-val">${valStr}</span>
            <span class="pollutant-unit">${unit}</span>
          </div>
          <span class="pollutant-status-pill ${statusPillClass}">${statusText}</span>
        </div>
      `;

      card.querySelector('.pollutant-info-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openGuideWithPollutant(item.key);
      });

      container.appendChild(card);
    });
  }

  /**
   * Generate & Render Practical Recommendations (Do's & Don'ts)
   */
  async function generateAndRenderRecommendations() {
    if (!state.airQuality || !state.weather) return;

    const aqi = Math.round(Number(state.airQuality.aqi) || 0);
    const cat = AQI_SCALE.getCategory(aqi).id;
    const dominant = state.airQuality.dominantPollutant;

    // Check optional Grok AI proxy first (if server is configured)
    let aiRecs = null;
    try {
      aiRecs = await GROK_CLIENT.getRecommendations({
        aqi: aqi,
        category: cat,
        dominantPollutant: dominant,
        weather: state.weather,
        household: state.household
      });
    } catch (e) {
      // ignore
    }

    let recsData = null;
    if (aiRecs && aiRecs.enabled && aiRecs.cards) {
      recsData = aiRecs;
      DOM.engineStatusText.textContent = 'Grok AI Environmental Assistant (Secure Server Proxy • Zero PII)';
    } else {
      // Local Explainable Rule Engine (Default zero-cost, 100% private)
      recsData = RECOMMENDATION_ENGINE.generate({
        aqi: aqi,
        category: cat,
        dominantPollutant: dominant,
        weather: state.weather,
        household: state.household
      });
      DOM.engineStatusText.textContent = 'Powered by local explainable rules (Zero-cost, 100% private in browser)';
    }

    state.recommendations = recsData;
    DOM.recsSummary.textContent = recsData.summary;
    DOM.recsUpdateTime.textContent = `Updated ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    // Render Cards
    const grid = DOM.recsCardsGrid;
    grid.innerHTML = '';

    recsData.cards.forEach(card => {
      const el = document.createElement('div');
      const isDo = card.type === 'do';
      el.className = `rec-card ${isDo ? 'rec-do' : 'rec-dont'}`;

      el.innerHTML = `
        <div>
          <div class="rec-badge-row">
            <span class="rec-domain">
              <span aria-hidden="true">${card.icon || '📌'}</span>
              <span>${card.domainTitle || card.category}</span>
            </span>
            <span class="rec-tag-pill ${isDo ? 'rec-tag-do' : 'rec-tag-dont'}">
              ${isDo ? '✓ DO' : '✕ DON\'T'}
            </span>
          </div>
          <h3 class="rec-title">${escapeHtml(card.title)}</h3>
          <p class="rec-text">${escapeHtml(card.text)}</p>
        </div>
        <div class="rec-why-box">
          <strong>Why this is recommended:</strong> ${escapeHtml(card.why)}
        </div>
      `;
      grid.appendChild(el);
    });
  }

  /**
   * Render Hourly Forecast Timeline
   */
  function renderForecastTimeline() {
    const container = DOM.forecastTimelineContainer;
    container.innerHTML = '';

    // Prefer hourly projections from Open-Meteo Air Quality or Weather
    const hourlyList = state.airQuality?.hourlyAq?.length 
      ? state.airQuality.hourlyAq 
      : (state.weather?.hourly || []);

    if (!hourlyList.length) {
      container.innerHTML = '<p style="padding:1rem;color:var(--text-muted);">Hourly forecast not available for this station.</p>';
      return;
    }

    hourlyList.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'forecast-card';

      const aqiVal = item.aqi ?? state.airQuality?.aqi ?? 50;
      const cat = AQI_SCALE.getCategory(aqiVal);
      const tempVal = state.weather?.hourly?.[idx]?.temp ?? state.weather?.temperature ?? 20;
      const displayTemp = state.tempUnit === 'F' ? cToF(tempVal) : tempVal;
      const rainProb = state.weather?.hourly?.[idx]?.rainProb ?? 0;

      card.innerHTML = `
        <span class="fc-hour">${item.hour || `+${idx}h`}</span>
        <span class="fc-aqi-badge" style="background:${cat.bgColor};color:${cat.textColor};border:1px solid ${cat.borderColor};">
          ${aqiVal} AQI
        </span>
        <span class="fc-temp">${displayTemp}°${state.tempUnit}</span>
        <span class="fc-rain">${rainProb > 0 ? `💧 ${rainProb}%` : '☀️ 0%'}</span>
      `;
      container.appendChild(card);
    });
  }

  /**
   * Render Attributions List
   */
  function renderAttributions() {
    const list = DOM.attributionsList;
    list.innerHTML = '';

    const baseAttributions = [
      { name: 'World Air Quality Index project (waqi.info)', url: 'https://waqi.info/' },
      { name: 'Open-Meteo Weather & Geocoding API', url: 'https://open-meteo.com/' },
      { name: 'Central Pollution Control Board (CPCB) India', url: 'https://airquality.cpcb.gov.in/AQI_India/' }
    ];

    const currentAttrs = state.airQuality?.attributions || [];
    const all = [...currentAttrs];
    baseAttributions.forEach(b => {
      if (!all.some(a => a.name.toLowerCase().includes(b.name.toLowerCase().slice(0, 8)))) {
        all.push(b);
      }
    });

    all.forEach((item, idx) => {
      const a = document.createElement('a');
      a.href = item.url || '#';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = item.name;
      a.style.color = 'var(--color-forest-light)';
      a.style.fontWeight = '600';
      list.appendChild(a);

      if (idx < all.length - 1) {
        const dot = document.createElement('span');
        dot.textContent = ' • ';
        list.appendChild(dot);
      }
    });
  }

  /**
   * Populate Educational Guide Pollutants
   */
  function populateGuidePollutants() {
    const container = DOM.guidePollutantsList;
    if (!container) return;
    container.innerHTML = '';

    Object.values(AQI_SCALE.POLLUTANTS).forEach(p => {
      const el = document.createElement('div');
      el.id = `guide-pollutant-${p.code}`;
      el.style.border = '1px solid var(--border-light)';
      el.style.borderRadius = 'var(--radius-md)';
      el.style.padding = '1rem';
      el.style.background = 'var(--bg-surface-alt)';

      el.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.4rem;">
          <h5 style="font-size:1.05rem;color:var(--color-forest-dark);font-weight:700;">${p.name} (${p.symbol})</h5>
          <span class="badge badge-forecast">${p.unit}</span>
        </div>
        <p style="font-size:0.85rem;color:var(--text-main);margin-bottom:0.5rem;line-height:1.4;">
          <strong>What it is:</strong> ${p.sizeDescription}
        </p>
        <p style="font-size:0.85rem;color:var(--text-main);margin-bottom:0.5rem;line-height:1.4;">
          <strong>Why it matters:</strong> ${p.whyItMatters}
        </p>
        <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:0.5rem;line-height:1.4;">
          <strong>Primary Sources:</strong> ${p.commonSources}
        </p>
        <p style="font-size:0.85rem;color:var(--color-forest-light);line-height:1.4;">
          <strong>Protective Steps:</strong> ${p.protectiveSteps}
        </p>
      `;
      container.appendChild(el);
    });
  }

  /**
   * Open Guide and scroll directly to a pollutant
   */
  function openGuideWithPollutant(pollutantKey) {
    openModal(DOM.modalEducationalGuide);
    setTimeout(() => {
      const target = document.getElementById(`guide-pollutant-${pollutantKey}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.style.outline = '3px solid var(--color-forest)';
        setTimeout(() => { target.style.outline = 'none'; }, 2000);
      }
    }, 150);
  }

  /**
   * Load Demo Presets (Requirement #9)
   */
  function loadDemoPreset(presetKey) {
    const data = DEMO_DATA[presetKey];
    if (!data) return;

    state.isDemoMode = true;
    state.activeDemoId = presetKey;
    state.location = {
      name: data.cityName,
      lat: data.lat,
      lng: data.lng,
      country: data.name.includes('India') ? 'India' : (data.name.includes('UK') ? 'United Kingdom' : 'United States')
    };

    state.weather = data.weather;
    state.airQuality = {
      aqi: data.aqi,
      dominantPollutant: data.dominantPollutant,
      pollutants: data.pollutants,
      station: data.station,
      hourlyAq: data.hourly,
      attributions: [
        { name: data.station.provider, url: data.station.providerUrl },
        { name: 'World Air Quality Index project (WAQI)', url: 'https://waqi.info/' },
        { name: 'Open-Meteo Weather Simulation', url: 'https://open-meteo.com/' }
      ]
    };

    if (DOM.demoSelect) DOM.demoSelect.value = presetKey;
    renderDashboard();
    showToast(`Loaded ${data.name} demo scenario`, 'info');
  }

  /**
   * Geolocation Handler with Explanations & Permission Fallback
   */
  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser. Please search manually.', 'error');
      DOM.searchInput.focus();
      return;
    }

    closeAllModals();
    setLoadingState(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(4));
        const lng = Number(pos.coords.longitude.toFixed(4));
        
        // Reverse label lookup via Open-Meteo
        let locName = `Nearby Station (${lat > 0 ? lat + '°N' : -lat + '°S'}, ${lng > 0 ? lng + '°E' : -lng + '°W'})`;
        let country = '';

        try {
          const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${lat},${lng}&count=1&language=en&format=json`);
          if (res.ok) {
            const d = await res.json();
            if (d.results && d.results[0]) {
              locName = `${d.results[0].name}, ${d.results[0].country}`;
              country = d.results[0].country;
            }
          }
        } catch (e) {
          // keep coords label
        }

        await fetchLocationData({ name: locName, lat, lng, country });
      },
      (err) => {
        setLoadingState(false);
        let msg = 'Could not access location.';
        if (err.code === 1) { // PERMISSION_DENIED
          msg = 'Location permission was denied. Type your city in the search box above or pick a quick chip below!';
        } else if (err.code === 2) {
          msg = 'Location position unavailable. Please search your city name.';
        } else if (err.code === 3) {
          msg = 'Location request timed out. Please try again or search manually.';
        }
        showToast(msg, 'warning');
        DOM.searchInput.focus();
      },
      { timeout: 10000, enableHighAccuracy: false, maximumAge: 300000 }
    );
  }

  /**
   * Event Binding
   */
  function bindEvents() {
    // Header & Hero Location Triggers
    DOM.btnHeaderLocate.addEventListener('click', () => openModal(DOM.modalLocationExplain));
    DOM.btnHeroLocate.addEventListener('click', () => openModal(DOM.modalLocationExplain));
    DOM.btnProceedGeolocation.addEventListener('click', handleUseMyLocation);

    // Household Profile
    DOM.btnHouseholdProfile.addEventListener('click', () => openModal(DOM.modalHousehold));
    DOM.btnEditHouseholdInline.addEventListener('click', () => openModal(DOM.modalHousehold));
    DOM.btnSaveHousehold.addEventListener('click', saveHouseholdPreferences);

    // Educational Guide
    DOM.btnOpenGuide.addEventListener('click', () => openModal(DOM.modalEducationalGuide));
    DOM.btnExplainPollutants.addEventListener('click', () => openModal(DOM.modalEducationalGuide));
    DOM.linkFooterGuide.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(DOM.modalEducationalGuide);
    });

    // Settings Modal
    DOM.btnOpenSettings.addEventListener('click', () => openModal(DOM.modalSettings));
    DOM.btnSaveSettings.addEventListener('click', () => {
      if (DOM.customWaqiToken) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.CUSTOM_WAQI_TOKEN, DOM.customWaqiToken.value.trim());
      }
      const selectedUnit = document.querySelector('input[name="temp-unit"]:checked')?.value || 'C';
      state.tempUnit = selectedUnit;
      localStorage.setItem(CONFIG.STORAGE_KEYS.TEMP_UNIT, selectedUnit);
      renderWeatherCard();
      renderForecastTimeline();
      closeAllModals();
      showToast('Settings saved successfully.', 'success');
    });

    // Unit Toggle
    DOM.btnToggleUnit.addEventListener('click', () => {
      state.tempUnit = state.tempUnit === 'C' ? 'F' : 'C';
      localStorage.setItem(CONFIG.STORAGE_KEYS.TEMP_UNIT, state.tempUnit);
      updateTempUnitRadio();
      renderWeatherCard();
      renderForecastTimeline();
    });

    // Manual Refresh
    DOM.btnRefreshData.addEventListener('click', async () => {
      if (state.isDemoMode && state.activeDemoId) {
        loadDemoPreset(state.activeDemoId);
      } else {
        await fetchLocationData(state.location);
      }
      showToast('Data refreshed.', 'info');
    });

    // Quick City Chips
    DOM.quickCityChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const lat = parseFloat(chip.dataset.lat);
        const lng = parseFloat(chip.dataset.lng);
        const name = chip.dataset.name;
        const country = name.includes('India') ? 'India' : (name.includes('UK') ? 'United Kingdom' : 'United States');
        fetchLocationData({ name, lat, lng, country });
      });
    });

    // Demo Mode Selector
    DOM.demoSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val) {
        loadDemoPreset(val);
      }
    });

    // City Autocomplete Search
    let debounceTimer = null;
    DOM.searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      const query = e.target.value.trim();
      if (query.length < 2) {
        hideSearchDropdown();
        return;
      }

      debounceTimer = setTimeout(async () => {
        const results = await SMOGWISE_API.searchLocations(query);
        renderSearchDropdown(results);
      }, 250);
    });

    DOM.searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const query = DOM.searchInput.value.trim();
      if (!query) return;

      setLoadingState(true);
      const results = await SMOGWISE_API.searchLocations(query);
      if (results && results.length) {
        hideSearchDropdown();
        DOM.searchInput.value = '';
        await fetchLocationData(results[0]);
      } else {
        setLoadingState(false);
        showToast(`No locations found matching "${query}". Try another spelling.`, 'warning');
      }
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!DOM.searchForm.contains(e.target) && !DOM.searchDropdownList.contains(e.target)) {
        hideSearchDropdown();
      }
    });

    // Close modals on close button click or backdrop click
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', closeAllModals);
    });

    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeAllModals();
        }
      });
    });

    // Keyboard navigation (Escape closes modals)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllModals();
        hideSearchDropdown();
      }
    });

    // Footer Links
    DOM.linkFooterHousehold.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(DOM.modalHousehold);
    });
    DOM.linkFooterLocate.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(DOM.modalLocationExplain);
    });
  }

  /**
   * Search Dropdown Helpers
   */
  function renderSearchDropdown(results) {
    const list = DOM.searchDropdownList;
    list.innerHTML = '';

    if (!results || !results.length) {
      list.innerHTML = '<li class="search-item" style="color:var(--text-muted);cursor:default;">No cities found</li>';
      list.classList.add('active');
      DOM.searchInput.setAttribute('aria-expanded', 'true');
      return;
    }

    results.forEach(item => {
      const li = document.createElement('li');
      li.className = 'search-item';
      li.setAttribute('role', 'option');
      li.tabIndex = 0;
      li.innerHTML = `
        <strong>${escapeHtml(item.displayName)}</strong>
        <span style="font-size:0.75rem;color:var(--text-muted);">${item.lat.toFixed(2)}°, ${item.lng.toFixed(2)}°</span>
      `;

      const selectItem = () => {
        hideSearchDropdown();
        DOM.searchInput.value = '';
        fetchLocationData(item);
      };

      li.addEventListener('click', selectItem);
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') selectItem();
      });

      list.appendChild(li);
    });

    list.classList.add('active');
    DOM.searchInput.setAttribute('aria-expanded', 'true');
  }

  function hideSearchDropdown() {
    DOM.searchDropdownList.classList.remove('active');
    DOM.searchInput.setAttribute('aria-expanded', 'false');
  }

  /**
   * Modal Open / Close Helpers
   */
  function openModal(modalEl) {
    if (!modalEl) return;
    closeAllModals();
    modalEl.classList.add('active');
    const firstInput = modalEl.querySelector('input, button:not(.modal-close-btn)');
    if (firstInput) firstInput.focus();
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
  }

  /**
   * Loading state toggling
   */
  function setLoadingState(loading) {
    state.isLoading = loading;
    if (loading) {
      DOM.refreshIcon.classList.add('spinner');
      DOM.refreshText.textContent = 'Updating...';
      DOM.btnRefreshData.disabled = true;
    } else {
      DOM.refreshIcon.classList.remove('spinner');
      DOM.refreshText.textContent = 'Refresh';
      DOM.btnRefreshData.disabled = false;
    }
  }

  /**
   * Toast notification helper
   */
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'error' ? '❌' : (type === 'warning' ? '⚠️' : '✅');
    toast.innerHTML = `<span aria-hidden="true">${icon}</span> <span>${escapeHtml(message)}</span>`;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  /**
   * Fallback Weather Factory
   */
  function createFallbackWeather() {
    return {
      temperature: 20,
      apparentTemperature: 20,
      humidity: 50,
      windSpeed: 10,
      windDirection: 'N',
      precipitation: 0.0,
      condition: 'Typical Atmosphere',
      conditionIcon: '🌤️',
      hourly: []
    };
  }

  /**
   * Radio Unit updater
   */
  function updateTempUnitRadio() {
    const radio = document.querySelector(`input[name="temp-unit"][value="${state.tempUnit}"]`);
    if (radio) radio.checked = true;
  }

  /**
   * Celsius to Fahrenheit converter
   */
  function cToF(c) {
    if (c == null) return '--';
    return Math.round((c * 9 / 5) + 32);
  }

  /**
   * HTML escape utility
   */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Start Application on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
