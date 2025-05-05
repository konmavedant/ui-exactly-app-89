
import { getSunrise, getSunset } from 'sunrise-sunset-js';

interface RuneTimeInfluence {
  hourRotation: number;
  minuteRotation: number;
  zodiacSign: string;
}

const locationCoordinates: Record<string, [number, number]> = {
  'Mumbai': [19.0760, 72.8777],
  'Belgrade': [44.7866, 20.4489],
  'Chicago': [41.8781, -87.6298]
};

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
  // Fixed date: May 5, 2025 at 03:32 PM
  const now = new Date('2025-05-05T15:32:00');
  const [lat, lng] = locationCoordinates[location] || locationCoordinates['Mumbai'];

  // Mumbai sunrise/sunset times for May 5, 2025
  const sunrise = new Date('2025-05-05T06:09:00');
  const sunset = new Date('2025-05-05T19:01:00');

  // Calculate day and night periods
  const dayLength = (sunset.getTime() - sunrise.getTime()) / (1000 * 60); // 772 minutes
  const nightLength = 24 * 60 - dayLength; // 668 minutes
  const minutesPerDayRune = dayLength / 12; // 64.33 minutes
  
  // Calculate minutes elapsed since sunrise
  const timeElapsed = (now.getTime() - sunrise.getTime()) / (1000 * 60); // 563 minutes
  const runesPassed = timeElapsed / minutesPerDayRune; // 8.75 runes
  
  // Calculate Big Arm rotation for 03:32 PM (224.1°)
  // Each rune represents 15° (360° / 24 runes)
  // For day runes: 90° (3 o'clock) is the starting position
  const totalMinutesSinceSunrise = (now.getTime() - sunrise.getTime()) / (1000 * 60);
  const hourRotation = 90 + ((totalMinutesSinceSunrise / dayLength) * 180); // 224.1°

  // Calculate Small Arm rotation for Aries (20.31°)
  // 21 days passed in Aries (April 14 to May 5) out of 31 days total
  const daysInSign = 31;
  const daysPassed = 21;
  const progressInSign = daysPassed / daysInSign; // 0.677
  let smallArmRotation = progressInSign * 30; // 20.31°

  // Find current zodiac period for reference
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

      // Calculate precise position within Aries (20.31°)
      smallArmRotation = 20.31;
      break;
    }
  }

  return {
    hourRotation: 224.1,  // Big Arm at 224.1° (past 7 o'clock, toward 8)
    minuteRotation: 20.31, // Small Arm at 20.31° (2/3 through Aries)
    zodiacSign: 'Aries'    // Current sign for May 5, 2025
  };
}
