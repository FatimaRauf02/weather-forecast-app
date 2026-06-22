import { Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning, HelpCircle } from 'lucide-react';


const ICON_MAP = {
  sun: Sun,
  moon: Moon,
  'cloud-sun': CloudSun,
  'cloud-moon': CloudMoon,
  cloud: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  sleet: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
  unknown: HelpCircle,
};

const ICON_COLORS = {
  sun: 'text-sun',
  moon: 'text-sun-soft',
  'cloud-sun': 'text-sun',
  'cloud-moon': 'text-sun-soft',
  cloud: 'text-white/80',
  fog: 'text-white/70',
  drizzle: 'text-accentRain',
  rain: 'text-accentRain',
  sleet: 'text-accentRain',
  snow: 'text-white',
  storm: 'text-accentAlert',
  unknown: 'text-white/60',
};


 
function resolveIconKey(icon, isDay) {
  if (isDay === false) {
    if (icon === 'sun') return 'moon';
    if (icon === 'cloud-sun') return 'cloud-moon';
  }
  return icon;
}

export default function WeatherIcon({ icon, isDay = true, size = 24, className = '' }) {
  const key = resolveIconKey(icon, isDay);
  const IconComponent = ICON_MAP[key] || ICON_MAP.unknown;
  const colorClass = ICON_COLORS[key] || ICON_COLORS.unknown;
  return <IconComponent size={size} className={`${colorClass} ${className}`} strokeWidth={1.6} />;
}
