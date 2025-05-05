
import { getSunrise, getSunset } from 'sunrise-sunset-js';

interface RuneTimeInfluence {
  hourRotation: number;
  minuteRotation: number;
}

// Zodiac entry dates with precise dates when Sun enters each sign
const zodiacEntryDates = {
  'Aries': { month: 3, day: 21 },      // Spring Equinox
  'Taurus': { month: 4, day: 15 },     // Sun enters Taurus
  'Gemini': { month: 5, day: 15 },     // Sun enters Gemini
  'Cancer': { month: 6, day: 15 },     // Summer Solstice
  'Leo': { month: 7, day: 16 },        // Sun enters Leo
  'Virgo': { month: 8, day: 16 },      // Sun enters Virgo
  'Libra': { month: 9, day: 16 },      // Autumn Equinox
  'Scorpio': { month: 10, day: 16 },   // Sun enters Scorpio
  'Sagittarius': { month: 11, day: 16 },// Sun enters Sagittarius
  'Capricorn': { month: 12, day: 16 }, // Winter Solstice
  'Aquarius': { month: 1, day: 14 },   // Sun enters Aquarius
  'Pisces': { month: 2, day: 13 }      // Sun enters Pisces
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

  // Get sunrise and sunset times
  const sunrise = getSunrise(lat, lng, now);
  const sunset = getSunset(lat, lng, now);

  // Convert times to minutes since midnight
  const currentMinutes = hours * 60 + minutes;
  const sunriseMinutes = sunrise.getHours() * 60 + sunrise.getMinutes();
  const sunsetMinutes = sunset.getHours() * 60 + sunset.getMinutes();

  // Calculate day length and night length in minutes
  const dayLength = sunsetMinutes - sunriseMinutes;
  const nightLength = 24 * 60 - dayLength;

  // Calculate the hourRotation based on zodiac position
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  // Find the current zodiac period and calculate precise position
  let zodiacProgress = 0;
  const zodiacPeriods = Object.entries(zodiacEntryDates);
  
  for (let i = 0; i < zodiacPeriods.length; i++) {
    const [sign, date] = zodiacPeriods[i];
    const nextSign = zodiacPeriods[(i + 1) % zodiacPeriods.length];
    
    if (sign === zodiacSign) {
      const periodStart = new Date(currentDate.getFullYear(), date.month - 1, date.day);
      const periodEnd = new Date(
        currentDate.getFullYear(),
        nextSign[1].month - 1,
        nextSign[1].day
      );
      
      const totalDays = (periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24);
      const daysPassed = (currentDate.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24);
      
      zodiacProgress = (daysPassed / totalDays) * 30;
      break;
    }
  }

  // Calculate the base angle for the zodiac sign (30 degrees per sign)
  const zodiacBaseAngle = Object.keys(zodiacEntryDates).indexOf(zodiacSign) * 30;
  const hourRotation = (zodiacBaseAngle + zodiacProgress) % 360;

  // Calculate minute hand rotation based on day/night cycle
  let minuteRotation;
  if (currentMinutes >= sunriseMinutes && currentMinutes <= sunsetMinutes) {
    // Day time - lower half (0-180 degrees)
    // Divide day into 12 equal parts
    const dayPartLength = dayLength / 12;
    const dayPart = Math.floor((currentMinutes - sunriseMinutes) / dayPartLength);
    const partProgress = ((currentMinutes - sunriseMinutes) % dayPartLength) / dayPartLength;
    minuteRotation = (dayPart * 15) + (partProgress * 15);
  } else {
    // Night time - upper half (180-360 degrees)
    const nightMinutes = currentMinutes < sunriseMinutes 
      ? currentMinutes + (24 * 60 - sunsetMinutes)
      : currentMinutes - sunsetMinutes;
    
    // Divide night into 12 equal parts
    const nightPartLength = nightLength / 12;
    const nightPart = Math.floor(nightMinutes / nightPartLength);
    const partProgress = (nightMinutes % nightPartLength) / nightPartLength;
    minuteRotation = 180 + (nightPart * 15) + (partProgress * 15);
  }

  return {
    hourRotation,
    minuteRotation: minuteRotation % 360
  };
}
