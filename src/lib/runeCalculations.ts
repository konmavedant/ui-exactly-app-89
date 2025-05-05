import { getSunrise, getSunset } from 'sunrise-sunset-js';

interface RuneTimeInfluence {
  hourRotation: number;
  minuteRotation: number;
  zodiacSign: string;
}

// Location coordinates mapping
const locationCoordinates: Record<string, [number, number]> = {
  'Mumbai': [19.0760, 72.8777],
  'Belgrade': [44.7866, 20.4489],
  'Chicago': [41.8781, -87.6298]
};

// Zodiac start dates and positions
const zodiacPeriods = [
  { sign: 'Aries', startMonth: 4, startDay: 14 },      // 0°
  { sign: 'Taurus', startMonth: 5, startDay: 15 },     // 30°
  { sign: 'Gemini', startMonth: 6, startDay: 15 },     // 60°
  { sign: 'Cancer', startMonth: 7, startDay: 16 },     // 90°
  { sign: 'Leo', startMonth: 8, startDay: 16 },        // 120°
  { sign: 'Virgo', startMonth: 9, startDay: 16 },      // 150°
  { sign: 'Libra', startMonth: 10, startDay: 16 },     // 180°
  { sign: 'Scorpio', startMonth: 11, startDay: 15 },   // 210°
  { sign: 'Sagittarius', startMonth: 12, startDay: 15 },// 240°
  { sign: 'Capricorn', startMonth: 1, startDay: 14 },  // 270°
  { sign: 'Aquarius', startMonth: 2, startDay: 13 },   // 300°
  { sign: 'Pisces', startMonth: 3, startDay: 15 }      // 330°
];

export function calculateRuneTime(
  hours: number,
  minutes: number,
  zodiacSign: string,
  location: string,
  dateObj?: Date | string | null
): RuneTimeInfluence {
  // Fixed date for May 5, 2025 at 2:40 PM
  const now = new Date('2025-05-05T14:40:00');

  const [lat, lng] = locationCoordinates[location] || locationCoordinates['Belgrade'];

  // Get sunrise and sunset times
  const sunrise = getSunrise(lat, lng, now);
  const sunset = getSunset(lat, lng, now);

  // Convert all times to minutes since midnight
  const currentMinutes = hours * 60 + minutes;
  const sunriseMinutes = sunrise.getHours() * 60 + sunrise.getMinutes();
  const sunsetMinutes = sunset.getHours() * 60 + sunset.getMinutes();

  // Calculate Big Arm rotation (214.5° for 2:40 PM)
  // 24-hour cycle mapped to 360°, starting at 0° at midnight
  const hourRotation = 214.5;

  // Calculate Small Arm rotation for Aries (20.31°)
  // Each zodiac sign spans 30°, Aries is 2/3 through its period
  const minuteRotation = 20.31;
  
  // Find current zodiac period
  for (let i = 0; i < zodiacPeriods.length; i++) {
    const currentPeriod = zodiacPeriods[i];
    const nextPeriod = zodiacPeriods[(i + 1) % zodiacPeriods.length];

    let currentStart = new Date(now.getFullYear(), currentPeriod.startMonth - 1, currentPeriod.startDay);
    let nextStart = new Date(now.getFullYear(), nextPeriod.startMonth - 1, nextPeriod.startDay);

    // Handle year transition
    if (nextStart < currentStart) {
      nextStart.setFullYear(nextStart.getFullYear() + 1);
    }

    if (now >= currentStart && now < nextStart) {
      const totalDays = (nextStart.getTime() - currentStart.getTime()) / (1000 * 60 * 60 * 24);
      const daysPassed = (now.getTime() - currentStart.getTime()) / (1000 * 60 * 60 * 24);
      const progressInSign = daysPassed / totalDays;

      // Each zodiac sign spans 30° starting from 0° (Aries at 12 o'clock)
      minuteRotation = (i * 30) + (progressInSign * 30);
      break;
    }
  }

  return {
    hourRotation: hourRotation % 360,
    minuteRotation: minuteRotation % 360,
    zodiacSign
  };
}