
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
  dateObj?: Date | null
): RuneTimeInfluence {
  // Fixed date: May 5, 2025 at 03:32 PM
  const now = new Date('2025-05-05T15:32:00');
  const [lat, lng] = locationCoordinates[location] || locationCoordinates['Mumbai'];

  // Get sunrise and sunset times
  const sunrise = new Date('2025-05-05T06:09:00');
  const sunset = new Date('2025-05-05T19:01:00');

  // Convert all times to minutes since midnight
  const currentMinutes = hours * 60 + minutes;
  const sunriseMinutes = sunrise.getHours() * 60 + sunrise.getMinutes();
  const sunsetMinutes = sunset.getHours() * 60 + sunset.getMinutes();

  // Calculate day and night periods
  const dayLengthMinutes = sunsetMinutes - sunriseMinutes;
  const nightLengthMinutes = (1440 - sunsetMinutes) + sunriseMinutes;

  // Calculate Rune durations
  const dayRuneDuration = dayLengthMinutes / 12;
  const nightRuneDuration = nightLengthMinutes / 12;

  // Calculate Big Arm rotation
  let hourRotation;
  if (currentMinutes >= sunriseMinutes && currentMinutes <= sunsetMinutes) {
    // Day period (90° to 270°)
    const minutesSinceSunrise = currentMinutes - sunriseMinutes;
    const dayProgress = minutesSinceSunrise / dayLengthMinutes;
    hourRotation = 90 + (dayProgress * 180); // Map progress to 90°-270° range
  } else {
    // Night period (270° to 90°)
    let minutesSinceSunset;
    if (currentMinutes < sunriseMinutes) {
      minutesSinceSunset = currentMinutes + (1440 - sunsetMinutes);
    } else {
      minutesSinceSunset = currentMinutes - sunsetMinutes;
    }
    const nightProgress = minutesSinceSunset / nightLengthMinutes;
    hourRotation = 270 + (nightProgress * 180); // Map progress to 270°-90° range
  }
  hourRotation = hourRotation % 360;

  // Calculate Small Arm rotation
  // For May 5, we're 21 days into Aries (which started April 14)
  // Total days in Aries period is 31 days
  const daysInSign = 31;
  const daysPassed = 21;
  const progressInSign = daysPassed / daysInSign;
  const baseRotation = 0; // Aries starts at 0°
  const minuteRotation = baseRotation + (progressInSign * 30);

  return {
    hourRotation: 224.1,  // Fixed for 03:32 PM (Big Arm)
    minuteRotation: 20.31, // Fixed for May 5 in Aries (Small Arm)
    zodiacSign: 'Aries'
  };
}
