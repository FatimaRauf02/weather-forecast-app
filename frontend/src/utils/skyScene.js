

const CODE_TO_SCENE = {
  0: 'clear', 1: 'clear',
  2: 'partly-cloudy', 3: 'cloudy',
  45: 'fog', 48: 'fog',
  51: 'drizzle', 53: 'drizzle', 55: 'drizzle',
  56: 'drizzle', 57: 'drizzle',
  61: 'rain', 63: 'rain', 65: 'rain',
  66: 'rain', 67: 'rain',
  71: 'snow', 73: 'snow', 75: 'snow', 77: 'snow',
  80: 'rain', 81: 'rain', 82: 'rain',
  85: 'snow', 86: 'snow',
  95: 'storm', 96: 'storm', 99: 'storm',
};


export function getSkyScene(weatherCode, isDay = true) {
  const base = CODE_TO_SCENE[weatherCode] || 'cloudy';
  const timeOfDay = isDay ? 'day' : 'night';
  return `${base}-${timeOfDay}`;
}


export const SCENE_CONFIG = {
  'clear-day':          { gradientClass: 'sky-clear-day',    showSun: true,  showClouds: false, showRain: false, showStars: false },
  'clear-night':        { gradientClass: 'sky-clear-night',  showSun: false, showClouds: false, showRain: false, showStars: true  },
  'partly-cloudy-day':  { gradientClass: 'sky-partly-day',   showSun: true,  showClouds: true,  showRain: false, showStars: false },
  'partly-cloudy-night':{ gradientClass: 'sky-partly-night', showSun: false, showClouds: true,  showRain: false, showStars: true  },
  'cloudy-day':         { gradientClass: 'sky-cloudy-day',   showSun: false, showClouds: true,  showRain: false, showStars: false },
  'cloudy-night':       { gradientClass: 'sky-cloudy-night', showSun: false, showClouds: true,  showRain: false, showStars: false },
  'fog-day':            { gradientClass: 'sky-fog-day',      showSun: false, showClouds: true,  showRain: false, showStars: false },
  'fog-night':          { gradientClass: 'sky-fog-night',    showSun: false, showClouds: true,  showRain: false, showStars: false },
  'drizzle-day':        { gradientClass: 'sky-rain-day',     showSun: false, showClouds: true,  showRain: true,  showStars: false, rainIntensity: 'light' },
  'drizzle-night':      { gradientClass: 'sky-rain-night',   showSun: false, showClouds: true,  showRain: true,  showStars: false, rainIntensity: 'light' },
  'rain-day':           { gradientClass: 'sky-rain-day',     showSun: false, showClouds: true,  showRain: true,  showStars: false, rainIntensity: 'heavy' },
  'rain-night':         { gradientClass: 'sky-rain-night',   showSun: false, showClouds: true,  showRain: true,  showStars: false, rainIntensity: 'heavy' },
  'snow-day':           { gradientClass: 'sky-snow-day',     showSun: false, showClouds: true,  showRain: false, showStars: false, showSnow: true },
  'snow-night':         { gradientClass: 'sky-snow-night',   showSun: false, showClouds: true,  showRain: false, showStars: false, showSnow: true },
  'storm-day':          { gradientClass: 'sky-storm-day',    showSun: false, showClouds: true,  showRain: true,  showStars: false, rainIntensity: 'heavy', showLightning: true },
  'storm-night':        { gradientClass: 'sky-storm-night',  showSun: false, showClouds: true,  showRain: true,  showStars: false, rainIntensity: 'heavy', showLightning: true },
};

export function getSceneConfig(weatherCode, isDay = true) {
  const key = getSkyScene(weatherCode, isDay);
  return SCENE_CONFIG[key] || SCENE_CONFIG['cloudy-day'];
}
