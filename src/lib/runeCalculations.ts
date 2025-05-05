
import { getSunrise, getSunset } from 'sunrise-sunset-js';

interface RuneTimeInfluence {
  hourRotation: number;
  minuteRotation: number;
  zodiacSign: string;
}

// Correct zodiac entry dates based on provided example
const zodiacEntryDates = {
  'Capricorn': { month: 1, day: 14 },
  'Aquarius': { month: 2, day: 13 },
  'Pisces': { month: 3, day: 15 },
  'Aries': { month: 4, day: 14 },
  'Taurus': { month: 5, day: 15 },
  'Gemini': { month: 6, day: 14 },
  'Cancer': { month: 7, day: 15 },
  'Leo': { month: 8, day: 15 },
  'Virgo': { month: 9, day: 15 },
  'Libra': { month: 10, day: 15 },
  'Scorpio': { month: 11, day: 14 },
  'Sagittarius': { month: 12, day: 14 }
};

// Location coordinates mapping
const locationCoordinates: Record<string, [number, number]> = {
  'Mumbai': [19.0760, 72.8777],
  'Belgrade': [44.7866, 20.4489],
  'Chicago': [41.8781, -87.6298]
};

export function calculateRuneTime(
  hours: number,
  minutes: number,
  location: string,
  date?: Date
): RuneTimeInfluence {
  const now = date || new Date();
  const [lat, lng] = locationCoordinates[location] || locationCoordinates['Belgrade'];

  // Get sunrise and sunset times for the specified date and location
  const sunrise = getSunrise(lat, lng, now);
  const sunset = getSunset(lat, lng, now);

  // Convert all times to minutes since midnight
  const currentMinutes = hours * 60 + minutes;
  const sunriseMinutes = sunrise.getHours() * 60 + sunrise.getMinutes();
  const sunsetMinutes = sunset.getHours() * 60 + sunset.getMinutes();

  // Calculate day and night durations
  const dayLengthMinutes = sunsetMinutes - sunriseMinutes;
  const nightLengthMinutes = (1440 - sunsetMinutes) + sunriseMinutes;

  // Calculate duration of each rune (12 parts for day and night)
  const dayRuneDuration = dayLengthMinutes / 12;
  const nightRuneDuration = nightLengthMinutes / 12;

  // Big Arm (Hour hand) calculation
  let hourRotation;
  if (currentMinutes >= sunriseMinutes && currentMinutes <= sunsetMinutes) {
    // Day period (3 o'clock to 9 o'clock)
    const minutesSinceSunrise = currentMinutes - sunriseMinutes;
    const dayRuneIndex = Math.floor(minutesSinceSunrise / dayRuneDuration);
    const progressInRune = (minutesSinceSunrise % dayRuneDuration) / dayRuneDuration;
    const degreesPerRune = 180 / 12; // 15° per rune
    hourRotation = 90 + (dayRuneIndex * degreesPerRune) + (progressInRune * degreesPerRune);
  } else {
    // Night period (9 o'clock to 3 o'clock)
    let minutesSinceSunset;
    if (currentMinutes < sunriseMinutes) {
      // After midnight, before sunrise
      minutesSinceSunset = currentMinutes + (1440 - sunsetMinutes);
    } else {
      // After sunset, before midnight
      minutesSinceSunset = currentMinutes - sunsetMinutes;
    }
    const nightRuneIndex = Math.floor(minutesSinceSunset / nightRuneDuration);
    const progressInRune = (minutesSinceSunset % nightRuneDuration) / nightRuneDuration;
    const degreesPerRune = 180 / 12; // 15° per rune
    hourRotation = 270 + (nightRuneIndex * degreesPerRune) + (progressInRune * degreesPerRune);
  }

  // Ensure rotation stays within 0-360 degrees
  hourRotation = hourRotation % 360;

  // Small Arm (Zodiac) calculation
  const zodiacPeriods = Object.entries(zodiacEntryDates);
  let currentZodiacSign = '';
  let minuteRotation = 0;

  // Find current zodiac sign and calculate position
  for (let i = 0; i < zodiacPeriods.length; i++) {
    const [sign, entryDate] = zodiacPeriods[i];
    const nextIndex = (i + 1) % zodiacPeriods.length;
    const nextSign = zodiacPeriods[nextIndex];

    const startDate = new Date(now.getFullYear(), entryDate.month - 1, entryDate.day);
    let endDate = new Date(
      now.getFullYear(),
      nextSign[1].month - 1,
      nextSign[1].day
    );

    // Handle year transition
    if (endDate < startDate) {
      endDate.setFullYear(now.getFullYear() + 1);
    }

    if (now >= startDate && now < endDate) {
      currentZodiacSign = sign;
      const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      const daysPassed = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      const progressInSign = daysPassed / totalDays;
      
      // Calculate rotation starting from 12 o'clock position
      minuteRotation = (i * 30) + (progressInSign * 30); // 30° per zodiac sign
      break;
    }
  }

  return {
    hourRotation,
    minuteRotation: minuteRotation % 360,
    zodiacSign: currentZodiacSign
  };
}
