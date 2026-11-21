// AQI Scale Definitions, Breakpoints, and Pollutant Educational Metadata

const AQI_SCALE = {
  SCALE_NAME: 'US EPA Air Quality Index (AQI)',
  SCALE_DESCRIPTION: 'Calculated using the US EPA standard standard breakpoints (0 to 500), normalized across key criteria pollutants.',
  
  // Categorical Breakpoints for US EPA AQI
  CATEGORIES: [
    {
      id: 'good',
      name: 'Good',
      min: 0,
      max: 50,
      color: '#10b981', // leaf emerald
      bgColor: '#ecfdf5',
      textColor: '#064e3b',
      borderColor: '#a7f3d0',
      icon: '🌱',
      summary: 'Air quality is satisfactory, and air pollution poses little or no risk.',
      generalAdvice: 'Enjoy your normal outdoor activities. Open windows for fresh air ventilation.',
      sensitiveAdvice: 'No precautions necessary. Great day for outdoor recreation.'
    },
    {
      id: 'moderate',
      name: 'Moderate',
      min: 51,
      max: 100,
      color: '#eab308', // amber yellow
      bgColor: '#fefce8',
      textColor: '#713f12',
      borderColor: '#fde047',
      icon: '⛅',
      summary: 'Air quality is acceptable. However, there may be some risk for unusually sensitive individuals.',
      generalAdvice: 'Safe for most people. Outdoor activities can proceed as normal.',
      sensitiveAdvice: 'Unusually sensitive individuals or those with asthma should monitor symptoms and consider shortening strenuous outdoor exertion.'
    },
    {
      id: 'sensitive',
      name: 'Unhealthy for Sensitive Groups',
      min: 101,
      max: 150,
      color: '#f97316', // orange
      bgColor: '#fff7ed',
      textColor: '#7c2d12',
      borderColor: '#fed7aa',
      icon: '⚠️',
      summary: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
      generalAdvice: 'The general public can still do outdoor activities, but reduce heavy outdoor exercise during peak pollution hours.',
      sensitiveAdvice: 'Children, older adults, and individuals with respiratory or cardiovascular diseases should take more breaks and reduce prolonged outdoor exertion.'
    },
    {
      id: 'unhealthy',
      name: 'Unhealthy',
      min: 151,
      max: 200,
      color: '#ef4444', // red
      bgColor: '#fef2f2',
      textColor: '#7f1d1d',
      borderColor: '#fecaca',
      icon: '🚨',
      summary: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.',
      generalAdvice: 'Reduce prolonged or vigorous outdoor exertion. Keep windows closed and run indoor air filtration.',
      sensitiveAdvice: 'Children, seniors, and sensitive individuals should avoid strenuous outdoor exertion and stay indoors where possible.'
    },
    {
      id: 'very_unhealthy',
      name: 'Very Unhealthy',
      min: 201,
      max: 300,
      color: '#8b5cf6', // purple
      bgColor: '#f5f3ff',
      textColor: '#4c1d95',
      borderColor: '#ddd6fe',
      icon: '☣️',
      summary: 'Health alert: The risk of health effects is increased for everyone in the area.',
      generalAdvice: 'Avoid outdoor activities. Keep doors and windows tightly sealed. Wear an N95/FFP2 respirator mask if going outside is unavoidable.',
      sensitiveAdvice: 'Remain indoors, keep physical activity levels light, and ensure HEPA air filtration is active.'
    },
    {
      id: 'hazardous',
      name: 'Hazardous',
      min: 301,
      max: 500,
      color: '#881337', // maroon / deep burgundy
      bgColor: '#fff1f2',
      textColor: '#4c0519',
      borderColor: '#fecdd3',
      icon: '🛑',
      summary: 'Emergency conditions: The entire population is more likely to experience serious adverse health impacts.',
      generalAdvice: 'Stay indoors with clean air measures active. Cancel all outdoor activities. Wear a sealed N95/FFP2 mask if outdoors is required.',
      sensitiveAdvice: 'Strictly remain indoors. Close all fresh air intakes. Seek medical advice if respiratory discomfort occurs.'
    }
  ],

  // Specific Comparison details with India's NAQI (CPCB)
  INDIA_NAQI_NOTE: {
    title: "Understanding AQI Scales: US EPA vs India's National AQI (NAQI)",
    body: "The WAQI platform normalizes global air quality readings to the US EPA AQI standard. However, India's Central Pollution Control Board (CPCB) uses its own National Air Quality Index (NAQI) with different category bands and 24-hour concentration breakpoints.",
    cpcbBreakpointsNotice: "For example, in India NAQI: 0-50 is Good, 51-100 Satisfactory, 101-200 Moderately Polluted, 201-300 Poor, 301-400 Very Poor, and 401-500 Severe. An AQI value calculated on the US EPA scale should never be assumed to be identical to an Indian NAQI score.",
    officialPortalNotice: "If you are in India, please cross-reference with the official CPCB portal (Sameer app / airquality.cpcb.gov.in) for statutory national advisories.",
    cpcbUrl: "https://airquality.cpcb.gov.in/AQI_India/"
  },

  // Detailed Pollutant Definitions for "What does this mean?"
  POLLUTANTS: {
    pm25: {
      code: 'pm25',
      name: 'Fine Particulate Matter (PM2.5)',
      symbol: 'PM₂.₅',
      unit: 'µg/m³',
      sizeDescription: 'Microscopic particles 2.5 micrometers or smaller (about 30 times thinner than a human hair).',
      whyItMatters: 'Due to their tiny size, PM2.5 particles bypass the body\'s natural defenses in the nose and throat, penetrating deep into the lungs and even entering the bloodstream.',
      commonSources: 'Vehicle combustion (diesel & petrol exhaust), wood smoke, forest fires, agricultural burning, coal power generation, and indoor frying or incense.',
      healthImpact: 'Short-term exposure can cause eye, nose, and throat irritation, coughing, and shortness of breath. Long-term exposure increases risks of asthma aggravation, chronic bronchitis, and cardiovascular events.',
      protectiveSteps: 'Use a HEPA air purifier indoors, avoid burning candles/incense, and wear a well-fitted N95/KN95 respirator during high concentrations.'
    },
    pm10: {
      code: 'pm10',
      name: 'Coarse Particulate Matter (PM10)',
      symbol: 'PM₁₀',
      unit: 'µg/m³',
      sizeDescription: 'Inhalable particles up to 10 micrometers in diameter.',
      whyItMatters: 'While larger than PM2.5, PM10 particles still reach the upper respiratory tract, irritating airways and bronchial tubes.',
      commonSources: 'Crushing or grinding operations, road dust, construction sites, agriculture, unpaved surfaces, and windblown soil/pollen.',
      healthImpact: 'Irritates eyes, throat, and nasal passages. Exacerbates asthma, allergic rhinitis, and chronic obstructive pulmonary disease (COPD).',
      protectiveSteps: 'Wipe indoor surfaces with damp cloths instead of dry sweeping, keep windows closed on windy dusty days, and wear dust-filtration masks outdoors.'
    },
    o3: {
      code: 'o3',
      name: 'Ground-level Ozone (O₃)',
      symbol: 'O₃',
      unit: 'µg/m³ or ppb',
      sizeDescription: 'A reactive invisible gas consisting of three oxygen atoms.',
      whyItMatters: 'Unlike the protective ozone layer high in the stratosphere, ground-level ozone is a powerful oxidant that chemically reacts with and inflames sensitive lung tissue.',
      commonSources: 'Not emitted directly; formed when nitrogen oxides (NOx) and volatile organic compounds (VOCs) react in the presence of strong sunlight and heat.',
      healthImpact: 'Causes chest pain, coughing, throat dryness, and airway inflammation. Can trigger asthma attacks and reduce overall lung capacity during outdoor exercise.',
      protectiveSteps: 'Ozone typically peaks during warm, sunny mid-afternoons. Schedule outdoor runs and workouts for early morning when ozone levels are lowest.'
    },
    no2: {
      code: 'no2',
      name: 'Nitrogen Dioxide (NO₂)',
      symbol: 'NO₂',
      unit: 'µg/m³ or ppb',
      sizeDescription: 'A reddish-brown, pungent gas belonging to the group of nitrogen oxides.',
      whyItMatters: 'Highly corrosive to mucous membranes and an essential chemical building block for secondary particulate matter and ground-level ozone.',
      commonSources: 'Vehicle exhausts (especially diesel engines), fossil fuel power plants, industrial boilers, and indoor unvented gas cooktops or heaters.',
      healthImpact: 'Increases airway sensitivity, exacerbates childhood asthma, and lowers resistance to respiratory infections.',
      protectiveSteps: 'Always turn on the kitchen exhaust hood when cooking with gas, avoid exercise along heavily congested motorways, and maintain proper home ventilation.'
    },
    so2: {
      code: 'so2',
      name: 'Sulfur Dioxide (SO₂)',
      symbol: 'SO₂',
      unit: 'µg/m³ or ppb',
      sizeDescription: 'A colorless gas with a pungent, choking odor.',
      whyItMatters: 'Reacts easily with moisture in the air to produce sulfurous and sulfuric acids (acid rain) and secondary sulfate particulates.',
      commonSources: 'Burning of sulfur-rich fuels like coal and crude oil at power stations, metal smelting facilities, and industrial chemical processing plants.',
      healthImpact: 'Can provoke rapid bronchoconstriction and wheezing in individuals with asthma within just minutes of exposure.',
      protectiveSteps: 'Stay indoors with closed doors and windows during industrial emission episodes, and limit strenuous exertion.'
    },
    co: {
      code: 'co',
      name: 'Carbon Monoxide (CO)',
      symbol: 'CO',
      unit: 'mg/m³ or ppm',
      sizeDescription: 'A colorless, odorless, and tasteless toxic gas.',
      whyItMatters: 'Binds with hemoglobin in red blood cells roughly 200 times more readily than oxygen, severely impeding the delivery of oxygen to vital organs.',
      commonSources: 'Incomplete combustion in motor vehicle engines, malfunctioning gas water heaters, wood stoves, charcoal grills, and tobacco smoke.',
      healthImpact: 'Causes headaches, dizziness, confusion, fatigue, and can be life-threatening at elevated concentrations in enclosed spaces.',
      protectiveSteps: 'Never operate gasoline generators, charcoal grills, or unvented heaters indoors. Install certified CO alarms on every floor of your home.'
    }
  },

  // Helper function to find category by numeric AQI
  getCategory: function(aqiValue) {
    const val = Math.max(0, Math.round(Number(aqiValue) || 0));
    for (const cat of this.CATEGORIES) {
      if (val >= cat.min && val <= cat.max) {
        return cat;
      }
    }
    // If > 500, fallback to Hazardous
    return this.CATEGORIES[this.CATEGORIES.length - 1];
  },

  // Helper to fetch pollutant details
  getPollutant: function(code) {
    const key = (code || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return this.POLLUTANTS[key] || {
      code: key,
      name: code ? code.toUpperCase() : 'Unknown Pollutant',
      symbol: code ? code.toUpperCase() : 'N/A',
      unit: 'µg/m³',
      sizeDescription: 'Airborne pollutant metric.',
      whyItMatters: 'Monitored as part of air quality standards.',
      commonSources: 'Combustion and industrial processes.',
      healthImpact: 'May irritate airways at elevated levels.',
      protectiveSteps: 'Reduce exposure during high readings.'
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AQI_SCALE;
}
