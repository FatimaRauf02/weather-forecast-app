
const CODE_TO_ICON = {
  0: 'sun', 1: 'sun', 2: 'cloud-sun', 3: 'cloud',
  45: 'fog', 48: 'fog',
  51: 'drizzle', 53: 'drizzle', 55: 'drizzle',
  56: 'sleet', 57: 'sleet',
  61: 'rain', 63: 'rain', 65: 'rain',
  66: 'sleet', 67: 'sleet',
  71: 'snow', 73: 'snow', 75: 'snow', 77: 'snow',
  80: 'rain', 81: 'rain', 82: 'rain',
  85: 'snow', 86: 'snow',
  95: 'storm', 96: 'storm', 99: 'storm',
};

export function describeIconForCode(code) {
  return CODE_TO_ICON[code] || 'unknown';
}
