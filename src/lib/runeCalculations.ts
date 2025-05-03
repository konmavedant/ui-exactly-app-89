
import { formatInTimeZone } from 'date-fns-tz';
import { getSunrise, getSunset } from 'sunrise-sunset-js';

interface RuneTimeInfluence {
  hourRotation: number;
  minuteRotation: number;
}

// Helper function to get zodiac entry dates
const getZodiacEntryDates = () => ({
  'Aries': { month: 3, day: 21 },
  'Taurus': { month: 4, day: 15 },
  'Gemini': { month: 5, day: 15 },
  'Cancer': { month: 6, day: 15 },
  'Leo': { month: 7, day: 16 },
  'Virgo': { month: 8, day: 16 },
  'Libra': { month: 9, day: 16 },
  'Scorpio': { month: 10, day: 16 },
  'Sagittarius': { month: 11, day: 16 },
  'Capricorn': { month: 12, day: 16 },
  'Aquarius': { month: 1, day: 14 },
  'Pisces': { month: 2, day: 13 }
});

export function calculateRuneTime(
  hours: number,
  minutes: number,
  zodiacSign: string,
  location: string,
  dateOfBirth?: Date
): RuneTimeInfluence {
  const now = new Date();
  const [lat, lng] = [41.8781, -87.6298]; // Default to Chicago if location coords not available

  // Get sunrise and sunset times
  const sunrise = getSunrise(lat, lng);
  const sunset = getSunset(lat, lng);

  // Calculate day length in minutes
  const dayLength = (sunset.getTime() - sunrise.getTime()) / (1000 * 60);
  const nightLength = 24 * 60 - dayLength;

  // Calculate if current time is during day or night
  const currentTime = now.getTime();
  const isDaytime = currentTime >= sunrise.getTime() && currentTime <= sunset.getTime();

  // Calculate hour rotation based on day/night position
  let hourRotation;
  if (isDaytime) {
    // Day hours (lower 12 runes)
    const minutesSinceSunrise = (currentTime - sunrise.getTime()) / (1000 * 60);
    hourRotation = (minutesSinceSunrise / dayLength) * 180; // 180 degrees for day hours
  } else {
    // Night hours (upper 12 runes)
    const minutesIntoNight = currentTime < sunrise.getTime() 
      ? (currentTime - (sunrise.getTime() - nightLength * 60 * 1000)) / (1000 * 60)
      : (currentTime - sunset.getTime()) / (1000 * 60);
    hourRotation = 180 + (minutesIntoNight / nightLength) * 180; // 180-360 degrees for night hours
  }

  // Calculate zodiac-based rotation (small arm)
  const zodiacDates = getZodiacEntryDates();
  const currentZodiac = Object.entries(zodiacDates).find(([sign, date]) => {
    const zodiacDate = new Date(now.getFullYear(), date.month - 1, date.day);
    const nextDate = Object.values(zodiacDates)[Object.keys(zodiacDates).indexOf(sign) + 1] 
      || { month: 1, day: 14 }; // Default to next year's Aquarius if at end
    const nextZodiacDate = new Date(
      nextDate.month === 1 ? now.getFullYear() + 1 : now.getFullYear(),
      nextDate.month - 1,
      nextDate.day
    );
    return now >= zodiacDate && now < nextZodiacDate;
  });

  // Calculate the angle based on current zodiac position
  const minuteRotation = (Object.keys(zodiacDates).indexOf(zodiacSign) / 12) * 360;

  return {
    hourRotation: hourRotation % 360,
    minuteRotation: minuteRotation
  };
}
