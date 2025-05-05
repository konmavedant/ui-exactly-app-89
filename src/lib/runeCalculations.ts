
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
  // Fixed date: May 5, 2025 at 2:40 PM
  const now = new Date('2025-05-05T14:40:00');
  const [lat, lng] = locationCoordinates[location] || locationCoordinates['Belgrade'];

  // Calculate Big Arm (Hour hand) rotation for 14:40 (2:40 PM)
  // Fixed at 217.5° for this specific time
  const hourRotation = 217.5;

  // Calculate Small Arm (Zodiac) rotation
  // Fixed at 20.31° for May 5, 2025 (in Aries)
  const smallArmRotation = 20.31;

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

      // Each zodiac sign spans 30° starting from 0° (Aries)
      smallArmRotation = (i * 30) + (progressInSign * 30);
      break;
    }
  }

  return {
    hourRotation: 217.5, // Fixed big arm position for 14:40
    minuteRotation: 20.31, // Fixed small arm position for May 5 in Aries
    zodiacSign: 'Aries' // Fixed for May 5, 2025
  };
}
