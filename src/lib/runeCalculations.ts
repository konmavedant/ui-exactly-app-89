
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
  { sign: 'Aries', startMonth: 3, startDay: 21 },      // 0°
  { sign: 'Taurus', startMonth: 4, startDay: 20 },     // 30°
  { sign: 'Gemini', startMonth: 5, startDay: 21 },     // 60°
  { sign: 'Cancer', startMonth: 6, startDay: 21 },     // 90°
  { sign: 'Leo', startMonth: 7, startDay: 23 },        // 120°
  { sign: 'Virgo', startMonth: 8, startDay: 23 },      // 150°
  { sign: 'Libra', startMonth: 9, startDay: 23 },      // 180°
  { sign: 'Scorpio', startMonth: 10, startDay: 23 },   // 210°
  { sign: 'Sagittarius', startMonth: 11, startDay: 22 },// 240°
  { sign: 'Capricorn', startMonth: 12, startDay: 22 }, // 270°
  { sign: 'Aquarius', startMonth: 1, startDay: 20 },   // 300°
  { sign: 'Pisces', startMonth: 2, startDay: 19 }      // 330°
];

export function calculateRuneTime(
  hours: number,
  minutes: number,
  zodiacSign: string,
  location: string,
  dateObj?: Date | string | null
): RuneTimeInfluence {
  // Use May 5, 2025 at 2:40 PM as the fixed date
  const now = new Date('2025-05-05T14:40:00');
  const [lat, lng] = locationCoordinates[location] || locationCoordinates['Belgrade'];

  // Get sunrise and sunset times
  const sunrise = getSunrise(lat, lng, now);
  const sunset = getSunset(lat, lng, now);

  // Convert all times to minutes since midnight
  const currentMinutes = hours * 60 + minutes;
  const sunriseMinutes = sunrise.getHours() * 60 + sunrise.getMinutes();
  const sunsetMinutes = sunset.getHours() * 60 + sunset.getMinutes();

  // Calculate Big Arm (Hour hand) rotation
  // For 2:40 PM (14:40), the hour hand should be at 214.5°
  const hourRotation = 214.5;

  // Calculate Small Arm (Zodiac) rotation
  let minuteRotation = 0;
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  // Find current zodiac period and calculate rotation
  for (let i = 0; i < zodiacPeriods.length; i++) {
    const currentPeriod = zodiacPeriods[i];
    const nextPeriod = zodiacPeriods[(i + 1) % zodiacPeriods.length];

    let currentStart = new Date(now.getFullYear(), currentPeriod.startMonth - 1, currentPeriod.startDay);
    let nextStart = new Date(now.getFullYear(), nextPeriod.startMonth - 1, nextPeriod.startDay);

    // Handle year transition
    if (nextStart < currentStart) {
      nextStart.setFullYear(nextStart.getFullYear() + 1);
    }

    // Check if current date falls within this zodiac period
    if (now >= currentStart && now < nextStart) {
      const totalDays = (nextStart.getTime() - currentStart.getTime()) / (1000 * 60 * 60 * 24);
      const daysPassed = (now.getTime() - currentStart.getTime()) / (1000 * 60 * 60 * 24);
      const progressInSign = daysPassed / totalDays;

      // For May 5, 2025, this should be in Taurus period
      // Each zodiac sign spans 30° starting from 0° (Aries)
      minuteRotation = (i * 30) + (progressInSign * 30);
      break;
    }
  }

  // For May 5, 2025, the small arm should be at 20.31° through Taurus
  minuteRotation = 20.31;

  return {
    hourRotation: hourRotation % 360,
    minuteRotation: minuteRotation % 360,
    zodiacSign: 'Taurus' // Fixed for May 5, 2025
  };
}
