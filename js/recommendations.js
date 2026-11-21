// Explainable JavaScript Rule-Based Recommendation Engine
// Generates personalized, transparent, and actionable environmental health guidance
// No PII, zero external tracking, 100% private in browser

const RECOMMENDATION_ENGINE = {
  /**
   * Main generator function
   * @param {Object} params
   * @param {number} params.aqi - numeric AQI
   * @param {string} params.category - 'good', 'moderate', 'sensitive', 'unhealthy', 'very_unhealthy', 'hazardous'
   * @param {string} params.dominantPollutant - 'pm25', 'pm10', 'o3', 'no2', etc.
   * @param {Object} params.weather - { temperature, humidity, windSpeed, precipitation, condition }
   * @param {Object} params.household - { children: bool, seniors: bool, sensitive: bool, athlete: bool, gasCooking: bool }
   * @returns {Object} { summary, cards: [] }
   */
  generate: function(params) {
    const aqi = Math.max(0, Math.round(Number(params.aqi) || 0));
    const category = params.category || 'moderate';
    const dominant = (params.dominantPollutant || 'pm25').toLowerCase();
    const weather = params.weather || { temperature: 20, humidity: 50, windSpeed: 10, precipitation: 0 };
    const hh = params.household || {};

    const hasVulnerableMember = Boolean(hh.children || hh.seniors || hh.sensitive);
    const isColdInversion = weather.humidity > 70 && weather.windSpeed < 8 && weather.temperature < 20;
    const isHotOzoneRisk = weather.temperature > 28 && dominant === 'o3';
    const isRainCleansing = (weather.precipitation || 0) > 1.0;

    const cards = [];

    // ==========================================
    // 1. OUTDOOR ACTIVITY & EXERCISE
    // ==========================================
    let outdoor = {
      category: 'outdoor',
      domainTitle: 'Outdoor Activity & Exercise',
      icon: '🏃'
    };

    if (aqi <= 50) {
      outdoor.type = 'do';
      outdoor.title = 'Ideal for Outdoor Sports & Recreation';
      outdoor.text = 'Air quality is pristine. Take advantage of clean conditions for jogging, cycling, or outdoor team sports.';
      outdoor.why = 'Air Quality Index is in the Good zone (0-50). Particulate and gaseous pollutants are well below health advisory thresholds.';
      outdoor.priority = 'normal';
    } else if (aqi <= 100) {
      if (hh.sensitive || hh.children) {
        outdoor.type = 'do';
        outdoor.title = 'Enjoy Outdoors, Monitor Symptoms';
        outdoor.text = 'Safe for most activities. If sensitive or asthmatic, take frequent breaks during vigorous aerobic workouts.';
        outdoor.why = `AQI is Moderate (${aqi}). While safe for the general public, ${hh.sensitive ? 'sensitive individuals' : 'young children'} may experience mild coughing during high-intensity cardio.`;
        outdoor.priority = 'normal';
      } else {
        outdoor.type = 'do';
        outdoor.title = 'Normal Outdoor Routines Encouraged';
        outdoor.text = 'Enjoy workouts, walks, and sports outdoors without restrictions.';
        outdoor.why = `Air quality is acceptable (AQI ${aqi}). Pollutant concentrations pose minimal risk to healthy adults.`;
        outdoor.priority = 'normal';
      }
    } else if (aqi <= 150) {
      // Unhealthy for Sensitive Groups
      if (hasVulnerableMember || hh.athlete) {
        outdoor.type = 'dont';
        outdoor.title = 'Avoid Strenuous Midday Outdoor Exertion';
        outdoor.text = isHotOzoneRisk 
          ? 'Postpone heavy workouts to early morning before sunlight activates ground-level ozone formation.'
          : 'Move intensive cardio sessions indoors or shift to light stretching/walking instead of heavy running.';
        outdoor.why = `AQI is ${aqi} (Unhealthy for Sensitive Groups). Deep inhalation during aerobic exercise draws fine ${dominant.toUpperCase()} particles 4-6 times deeper into bronchial passages.`;
        outdoor.priority = 'high';
      } else {
        outdoor.type = 'do';
        outdoor.title = 'Reduce Prolonged Outdoor Exercise Duration';
        outdoor.text = 'Keep outdoor runs or games under 45 minutes, and take regular hydration breaks.';
        outdoor.why = `AQI is ${aqi}. General adults can exercise outdoors but should avoid pushing to maximum respiratory exhaustion.`;
        outdoor.priority = 'medium';
      }
    } else if (aqi <= 200) {
      // Unhealthy
      outdoor.type = 'dont';
      outdoor.title = 'Cancel Vigorous Outdoor Workouts';
      outdoor.text = 'Shift all cardio, running, and heavy labor indoors into a filtered environment. Keep children from playing outdoors.';
      outdoor.why = `AQI is ${aqi} (Unhealthy). Inhalation of PM2.5 at this level causes acute airway inflammation, reduced lung capacity, and increased oxidative stress for all persons.`;
      outdoor.priority = 'critical';
    } else {
      // Very Unhealthy & Hazardous (>200)
      outdoor.type = 'dont';
      outdoor.title = 'Strictly Avoid All Outdoor Exertion';
      outdoor.text = 'Stay entirely indoors. Even short walks can trigger respiratory distress, eye stinging, and headaches.';
      outdoor.why = `AQI is ${aqi} (Emergency Level). Microscopic particles reach alveoli and bloodstream, placing high strain on cardiovascular systems.`;
      outdoor.priority = 'critical';
    }
    cards.push(outdoor);

    // ==========================================
    // 2. COMMUTE & TRAVEL
    // ==========================================
    let commute = {
      category: 'commute',
      domainTitle: 'Commute & Daily Travel',
      icon: '🚴'
    };

    if (aqi <= 50) {
      commute.type = 'do';
      commute.title = 'Walk, Bike, or Roll to Destination';
      commute.text = 'Great day for active commuting. Walking or cycling reduces traffic emissions and promotes cardiovascular health.';
      commute.why = 'Clean ambient air means outdoor transit routes are pleasant and restorative.';
      commute.priority = 'normal';
    } else if (aqi <= 100) {
      commute.type = 'do';
      commute.title = 'Active Commute Safe; Avoid Heavy Truck Corridors';
      commute.text = 'Walking and cycling remain good options. Where possible, choose secondary tree-lined streets over congested arterial highways.';
      commute.why = `Near roadside corridors, tailpipe NO2 and ultrafine particles can be 2-3x higher than regional average (current AQI ${aqi}).`;
      commute.priority = 'normal';
    } else if (aqi <= 150) {
      commute.type = 'do';
      commute.title = 'Set Car Air to Recirculation Mode; Pack Mask';
      commute.text = 'When driving, press the cabin air recirculation button. If walking near busy intersections or waiting at bus stops, consider wearing a light KN95/KF94 mask.';
      commute.why = `Recirculation mode stops exterior tailpipe exhaust from entering your vehicle cabin, reducing passenger pollutant exposure by up to 80%.`;
      commute.priority = 'medium';
    } else if (aqi <= 200) {
      commute.type = 'do';
      commute.title = 'Wear a Sealed N95/FFP2 Mask During Commute';
      commute.text = 'Cloth masks and loose surgical masks do not block PM2.5. Put on a certified tight-fitting N95 or FFP2 respirator for any outdoor walking or public transit transfers.';
      commute.why = `Fine particulate PM2.5 (current AQI ${aqi}) passes directly through standard cloth fibers. A sealed N95 traps 95%+ of sub-micron particles.`;
      commute.priority = 'high';
    } else {
      commute.type = 'dont';
      commute.title = 'Minimize Non-Essential Travel';
      commute.text = 'Work remotely if permissible. If you must travel, use enclosed vehicles with windows rolled up and wear an airtight N95/P100 respirator during transfers.';
      commute.why = `Severe air contamination (AQI ${aqi}) poses acute hazards during road delays and outdoor platform waiting times.`;
      commute.priority = 'critical';
    }
    cards.push(commute);

    // ==========================================
    // 3. HOME & COOKING VENTILATION
    // ==========================================
    let vent = {
      category: 'ventilation',
      domainTitle: 'Home & Cooking Ventilation',
      icon: '🍳'
    };

    if (aqi <= 50) {
      vent.type = 'do';
      vent.title = 'Open Windows for Cross-Ventilation';
      vent.text = 'Open windows on opposing sides of your home for 30-60 minutes to flush out accumulated indoor CO2, moisture, and VOCs.';
      vent.why = 'Outdoor air is cleaner than typical indoor ambient air today, making natural air replacement beneficial.';
      vent.priority = 'normal';
    } else if (aqi <= 100) {
      vent.type = 'do';
      vent.title = 'Air Out Home During Off-Peak Traffic Hours';
      vent.text = 'Ventilate your home in early afternoon or late morning when morning rush-hour traffic emissions have dispersed.';
      vent.why = `Ambient AQI is Moderate (${aqi}). Timed ventilation balances fresh oxygen intake without letting in traffic fumes.`;
      vent.priority = 'normal';
    } else if (aqi <= 150) {
      vent.type = hh.gasCooking ? 'do' : 'dont';
      if (hh.gasCooking) {
        vent.title = 'Run Stove Exhaust Hood & Use Back Burners';
        vent.text = 'Cooking with gas produces NO2 and ultrafine particles. Run your range hood on high and keep bedroom doors shut to confine fumes.';
        vent.why = 'With outdoor air at AQI 100+, unvented gas cooking creates an indoor NO2 spike that cannot easily be flushed by opening windows.';
        vent.priority = 'high';
      } else {
        vent.title = 'Keep Windows Closed; Rely on Mechanical Filtration';
        vent.text = 'Keep windows shut. Use kitchen extractor hood when frying or boiling, venting directly to the exterior.';
        vent.why = `Outdoor particulate concentrations (${aqi} AQI) will seep indoors if windows are kept open.`;
        vent.priority = 'medium';
      }
    } else {
      // Unhealthy or worse
      vent.type = 'dont';
      vent.title = 'Keep All Windows & Balcony Doors Latched';
      vent.text = 'Seal window gaps with weatherstripping or damp towels if drafty. Always operate kitchen exhaust while cooking, and favor steaming/baking over high-heat frying.';
      vent.why = isColdInversion 
        ? `A cold meteorological inversion (${weather.temperature}°C, ${weather.humidity}% humidity) is trapping pollutants near the surface; opening windows will quickly contaminate indoor air.`
        : `At AQI ${aqi}, outdoor air contains hazardous concentrations of respirable particulate matter that take hours to clear once inside.`;
      vent.priority = 'critical';
    }
    cards.push(vent);

    // ==========================================
    // 4. INDOOR SMOKE & AIR PURIFIER MANAGEMENT
    // ==========================================
    let indoor = {
      category: 'indoor',
      domainTitle: 'Indoor Smoke & Air Purifier',
      icon: '🍃'
    };

    if (aqi <= 50) {
      indoor.type = 'do';
      indoor.title = 'Routine Purifier Maintenance';
      indoor.text = 'Check your air purifier pre-filters and wipe down dust sensors. Eco/low speed mode is sufficient.';
      indoor.why = 'Low ambient pollution lets HEPA purifiers run quietly on low-wattage standby modes.';
      indoor.priority = 'normal';
    } else if (aqi <= 100) {
      indoor.type = 'do';
      indoor.title = 'Run Purifiers on Auto / Silent Mode';
      indoor.text = 'Place portable HEPA purifiers in primary living areas and bedrooms. Keep filters clean.';
      indoor.why = 'Running on auto maintains background particulate counts below 10 µg/m³ for optimal sleep and recovery.';
      indoor.priority = 'normal';
    } else if (aqi <= 150) {
      indoor.type = 'dont';
      indoor.title = 'Avoid Incense, Scented Candles, & Dry Sweeping';
      indoor.text = 'Do not burn agarbatti/incense, mosquito coils, or decorative candles. Vacuum with a HEPA-sealed vacuum or use damp mopping.';
      indoor.why = `A single burning incense stick or candle generates significant PM2.5 and VOC spikes, exacerbating outdoor pollution already entering at AQI ${aqi}.`;
      indoor.priority = 'high';
    } else if (aqi <= 200) {
      indoor.type = 'do';
      indoor.title = 'Set HEPA Air Purifier to High / Medium Fan Speed';
      indoor.text = 'Create a dedicated "clean air sanctuary" room (preferably the bedroom). Close the door, turn the purifier to high, and run continuously.';
      indoor.why = `High fan speeds maximize Air Changes per Hour (ACH), keeping indoor PM2.5 under 25 µg/m³ despite severe exterior smog (AQI ${aqi}).`;
      indoor.priority = 'critical';
    } else {
      // Hazardous
      indoor.type = 'do';
      indoor.title = 'Continuous Maximum HEPA Filtration & Seal Door Gaps';
      indoor.text = 'Run all available HEPA purifiers on turbo/high in bedrooms. Tape damp towels at base of doors if smoke smell is detectable. Avoid any indoor combustion whatsoever.';
      indoor.why = `Outdoor AQI is ${aqi} (Hazardous). Without continuous multi-stage HEPA filtration, indoor particulate levels will rapidly mirror dangerous outdoor levels.`;
      indoor.priority = 'critical';
    }
    cards.push(indoor);

    // Generate concise summary
    let summaryText = `Air quality is ${params.category ? params.category.replace('_', ' ') : 'Moderate'} (AQI ${aqi}). `;
    if (aqi <= 50) {
      summaryText += 'Great outdoor conditions for everyone.';
    } else if (aqi <= 100) {
      summaryText += hasVulnerableMember ? 'Mostly safe, with mild precautions for sensitive household members.' : 'Favorable conditions for normal daily activities.';
    } else if (aqi <= 150) {
      summaryText += 'Sensitive groups should reduce strenuous outdoor workouts and keep vehicles recirculating.';
    } else if (aqi <= 200) {
      summaryText += 'Unhealthy air. Keep windows sealed, run indoor air filtration, and wear an N95 outdoors.';
    } else {
      summaryText += 'Hazardous emergency air quality. Stay indoors and ensure continuous HEPA filtration.';
    }

    return {
      summary: summaryText,
      cards: cards,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ruleCount: 4
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = RECOMMENDATION_ENGINE;
}
