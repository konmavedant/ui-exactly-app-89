
import { getSunrise, getSunset } from 'sunrise-sunset-js';

interface RuneTimeInfluence {
  hourRotation: number;
  minuteRotation: number;
}

// Zodiac entry dates with precise dates when Sun enters each sign
const zodiacEntryDates = {
  'Aries': { month: 3, day: 21 },      // Spring Equinox
  'Taurus': { month: 4, day: 20 },     // Sun enters Taurus
  'Gemini': { month: 5, day: 21 },     // Sun enters Gemini
  'Cancer': { month: 6, day: 21 },     // Summer Solstice
  'Leo': { month: 7, day: 23 },        // Sun enters Leo
  'Virgo': { month: 8, day: 23 },      // Sun enters Virgo
  'Libra': { month: 9, day: 23 },      // Autumn Equinox
  'Scorpio': { month: 10, day: 23 },   // Sun enters Scorpio
  'Sagittarius': { month: 11, day: 22 },// Sun enters Sagittarius
  'Capricorn': { month: 12, day: 22 }, // Winter Solstice
  'Aquarius': { month: 1, day: 20 },   // Sun enters Aquarius
  'Pisces': { month: 2, day: 19 }      // Sun enters Pisces
};

export function calculateRuneTime(
  hours: number,
  minutes: number,
  zodiacSign: string,
  location: string,
  dateOfBirth?: Date
): RuneTimeInfluence {
  const now = new Date();
  const [lat, lng] = [51.5074, -0.1278]; // Default coordinates (London)

  // Get sunrise and sunset times for current date
  const sunrise = getSunrise(lat, lng, now);
  const sunset = getSunset(lat, lng, now);

  // Convert all times to minutes since midnight
  const currentMinutes = hours * 60 + minutes;
  const sunriseMinutes = sunrise.getHours() * 60 + sunrise.getMinutes();
  const sunsetMinutes = sunset.getHours() * 60 + sunset.getMinutes();

  // Calculate day and night lengths
  const dayLength = sunsetMinutes - sunriseMinutes;
  const nightLength = 1440 - dayLength; // 1440 = 24 hours * 60 minutes

  // BIG ARM (minutes hand) - Divides day and night into 12 parts each
  let minuteRotation;
  if (currentMinutes >= sunriseMinutes && currentMinutes <= sunsetMinutes) {
    // Daytime - lower hemisphere (0° to 180°)
    const timePassedSinceSunrise = currentMinutes - sunriseMinutes;
    const dayRuneLength = dayLength / 12; // Length of each day rune
    const currentDayRune = Math.floor(timePassedSinceSunrise / dayRuneLength);
    const progressInCurrentRune = (timePassedSinceSunrise % dayRuneLength) / dayRuneLength;
    minuteRotation = (currentDayRune * 15) + (progressInCurrentRune * 15);
  } else {
    // Nighttime - upper hemisphere (180° to 360°)
    const timeInNight = currentMinutes < sunriseMinutes 
      ? currentMinutes + (1440 - sunsetMinutes)
      : currentMinutes - sunsetMinutes;
    const nightRuneLength = nightLength / 12; // Length of each night rune
    const currentNightRune = Math.floor(timeInNight / nightRuneLength);
    const progressInCurrentRune = (timeInNight % nightRuneLength) / nightRuneLength;
    minuteRotation = 180 + (currentNightRune * 15) + (progressInCurrentRune * 15);
  }

  // SMALL ARM (hours hand) - Moves through zodiac signs
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  
  // Find current zodiac period and calculate precise position
  let zodiacRotation = 0;
  const zodiacPeriods = Object.entries(zodiacEntryDates);
  
  for (let i = 0; i < zodiacPeriods.length; i++) {
    const [sign, entryDate] = zodiacPeriods[i];
    const nextSign = zodiacPeriods[(i + 1) % zodiacPeriods.length];
    
    if (sign === zodiacSign) {
      // Calculate days between zodiac entry dates
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
      
      // Calculate exact position within zodiac sign (30 degrees per sign)
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
