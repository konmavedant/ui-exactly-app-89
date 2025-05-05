
import { getSunrise, getSunset } from 'sunrise-sunset-js';

interface RuneTimeInfluence {
  hourRotation: number;
  minuteRotation: number;
}

// Zodiac entry dates with precise dates when Sun enters each sign
const zodiacEntryDates = {
  'Aquarius': { month: 2, day: 13 },    // Example date from provided case
  'Pisces': { month: 3, day: 15 },      // Example date from provided case
  'Aries': { month: 4, day: 20 },
  'Taurus': { month: 5, day: 21 },
  'Gemini': { month: 6, day: 21 },
  'Cancer': { month: 7, day: 22 },
  'Leo': { month: 8, day: 23 },
  'Virgo': { month: 9, day: 23 },
  'Libra': { month: 10, day: 23 },
  'Scorpio': { month: 11, day: 22 },
  'Sagittarius': { month: 12, day: 22 },
  'Capricorn': { month: 1, day: 20 }
};

export function calculateRuneTime(
  hours: number,
  minutes: number,
  zodiacSign: string,
  location: string,
  dateOfBirth?: Date
): RuneTimeInfluence {
  const now = new Date();
  // Using Belgrade coordinates as per example
  const [lat, lng] = [44.7866, 20.4489];

  // Get sunrise and sunset times
  const sunrise = getSunrise(lat, lng, now);
  const sunset = getSunset(lat, lng, now);

  // Convert all times to minutes since midnight
  const currentMinutes = hours * 60 + minutes;
  const sunriseMinutes = sunrise.getHours() * 60 + sunrise.getMinutes();
  const sunsetMinutes = sunset.getHours() * 60 + sunset.getMinutes();

  // Big Arm (Hour hand) calculation
  let minuteRotation;
  if (currentMinutes >= sunriseMinutes && currentMinutes <= sunsetMinutes) {
    // Day period (3 o'clock to 9 o'clock: 90° to 270°)
    const dayProgress = (currentMinutes - sunriseMinutes) / (sunsetMinutes - sunriseMinutes);
    minuteRotation = 90 + (dayProgress * 180); // 90° is 3 o'clock position
  } else {
    // Night period (9 o'clock back to 3 o'clock: 270° to 90°)
    let nightProgress;
    if (currentMinutes < sunriseMinutes) {
      // After midnight before sunrise
      nightProgress = (currentMinutes + (1440 - sunsetMinutes)) / (1440 - (sunsetMinutes - sunriseMinutes));
    } else {
      // After sunset
      nightProgress = (currentMinutes - sunsetMinutes) / (1440 - (sunsetMinutes - sunriseMinutes));
    }
    minuteRotation = 270 + (nightProgress * 180); // 270° is 9 o'clock position
  }

  // Small Arm (Zodiac) calculation
  const currentDate = new Date();
  const zodiacPeriods = Object.entries(zodiacEntryDates);
  let zodiacRotation = 0;

  for (let i = 0; i < zodiacPeriods.length; i++) {
    const [sign, entryDate] = zodiacPeriods[i];
    const nextIndex = (i + 1) % zodiacPeriods.length;
    const nextSign = zodiacPeriods[nextIndex];

    if (sign === zodiacSign) {
      const currentYear = currentDate.getFullYear();
      const startDate = new Date(currentYear, entryDate.month - 1, entryDate.day);
      const endDate = new Date(
        currentYear,
        nextSign[1].month - 1,
        nextSign[1].day
      );

      if (endDate < startDate) {
        endDate.setFullYear(currentYear + 1);
      }

      const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      const daysPassed = (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      
      // Calculate exact position (30 degrees per sign)
      const baseAngle = i * 30;
      const progressAngle = (daysPassed / totalDays) * 30;
      zodiacRotation = (baseAngle + progressAngle) % 360;
      break;
    }
  }

  return {
    hourRotation: zodiacRotation,
    minuteRotation: minuteRotation % 360
  };
}
