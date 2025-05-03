
import { getSunrise, getSunset } from 'sunrise-sunset-js';

interface RuneTimeInfluence {
  hourRotation: number;
  minuteRotation: number;
}

// Zodiac entry dates according to Sun enters dates
const zodiacEntryDates = {
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
};

export function calculateRuneTime(
  hours: number,
  minutes: number,
  zodiacSign: string,
  location: string,
  dateOfBirth?: Date
): RuneTimeInfluence {
  const now = new Date();
  const [lat, lng] = [51.5074, -0.1278]; // Default coordinates (should be replaced with actual location)

  // Get sunrise and sunset times
  const sunrise = getSunrise(lat, lng, now);
  const sunset = getSunset(lat, lng, now);

  // Convert current time to minutes since midnight
  const currentMinutes = hours * 60 + minutes;
  const sunriseMinutes = sunrise.getHours() * 60 + sunrise.getMinutes();
  const sunsetMinutes = sunset.getHours() * 60 + sunset.getMinutes();

  // Calculate day length and night length in minutes
  const dayLength = sunsetMinutes - sunriseMinutes;
  const nightLength = 24 * 60 - dayLength;

  // Calculate hour hand rotation
  let hourRotation;
  if (currentMinutes >= sunriseMinutes && currentMinutes <= sunsetMinutes) {
    // Day time - lower half (0-180 degrees)
    const dayProgress = (currentMinutes - sunriseMinutes) / dayLength;
    hourRotation = dayProgress * 180;
  } else {
    // Night time - upper half (180-360 degrees)
    let nightProgress;
    if (currentMinutes > sunsetMinutes) {
      nightProgress = (currentMinutes - sunsetMinutes) / nightLength;
    } else {
      nightProgress = (currentMinutes + (24 * 60 - sunsetMinutes)) / nightLength;
    }
    hourRotation = 180 + (nightProgress * 180);
  }

  // Calculate zodiac-based rotation for small arm
  const zodiacAngles = Object.keys(zodiacEntryDates).reduce((acc, sign, index) => {
    acc[sign] = (index * 30) % 360; // Each zodiac sign gets 30 degrees
    return acc;
  }, {} as Record<string, number>);

  return {
    hourRotation: hourRotation % 360,
    minuteRotation: zodiacAngles[zodiacSign] || 0
  };
}
