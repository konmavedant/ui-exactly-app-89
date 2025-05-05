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
  zodiacSign: string,
  location: string,
  dateObj?: Date | string | null
): RuneTimeInfluence {
  let now = dateObj ? new Date(dateObj) : new Date();
  if (isNaN(now.getTime())) {
    now = new Date();
  }
  const [lat, lng] = locationCoordinates[location] || locationCoordinates['Belgrade'];

  // Get sunrise and sunset times
  const sunrise = getSunrise(lat, lng, now);
  const sunset = getSunset(lat, lng, now);

  // Convert all times to minutes since midnight
  const currentMinutes = hours * 60 + minutes;
  const sunriseMinutes = sunrise.getHours() * 60 + sunrise.getMinutes();
  const sunsetMinutes = sunset.getHours() * 60 + sunset.getMinutes();

  // Calculate day and night durations
  const dayLengthMinutes = sunsetMinutes - sunriseMinutes;
  const nightLengthMinutes = (1440 - sunsetMinutes) + sunriseMinutes;

  // Calculate position in day/night cycle
  const isDay = currentMinutes >= sunriseMinutes && currentMinutes <= sunsetMinutes;
  
  // Big Arm (Hour hand) calculation - Updated to match required angles
  let hourRotation;
  if (isDay) {
    // Day period (90° to 270°)
    const dayProgress = (currentMinutes - sunriseMinutes) / dayLengthMinutes;
    hourRotation = 90 + (dayProgress * 180);
  } else {
    // Night period (270° to 90°)
    let nightProgress;
    if (currentMinutes < sunriseMinutes) {
      // After midnight, before sunrise
      nightProgress = (currentMinutes + (1440 - sunsetMinutes)) / nightLengthMinutes;
    } else {
      // After sunset, before midnight
      nightProgress = (currentMinutes - sunsetMinutes) / nightLengthMinutes;
    }
    hourRotation = 270 + (nightProgress * 180);
    if (hourRotation >= 360) {
      hourRotation -= 360;
    }
  }

  // Ensure rotation stays within 0-360 degrees
  hourRotation = hourRotation % 360;

  // Small Arm (Zodiac) calculation
  const zodiacPeriods = [
    { sign: 'Aries', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
    { sign: 'Taurus', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
    { sign: 'Gemini', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
    { sign: 'Cancer', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
    { sign: 'Leo', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
    { sign: 'Virgo', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
    { sign: 'Libra', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
    { sign: 'Scorpio', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
    { sign: 'Sagittarius', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
    { sign: 'Capricorn', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
    { sign: 'Aquarius', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
    { sign: 'Pisces', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 }
  ];

  let currentZodiacSign = '';
  let minuteRotation = 0;

  const month = now.getMonth() + 1;
  const day = now.getDate();

  // Find current zodiac sign and calculate position
  for (let i = 0; i < zodiacPeriods.length; i++) {
    const period = zodiacPeriods[i];
    const startDate = new Date(now.getFullYear(), period.startMonth - 1, period.startDay);
    let endDate = new Date(now.getFullYear(), period.endMonth - 1, period.endDay);

    // Handle year transition for Capricorn
    if (period.sign === 'Capricorn' && month === 1) {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    if (now >= startDate && now <= endDate) {
      currentZodiacSign = period.sign;
      const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      const daysPassed = (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      const progressInSign = daysPassed / totalDays;
      
      // Adjust rotation to align with zodiac positions (starting from 0° at Aries)
      minuteRotation = (i * 30) + (progressInSign * 30);
      break;
    }
  }

  return {
    hourRotation: hourRotation % 360,
    minuteRotation: minuteRotation % 360,
    zodiacSign: currentZodiacSign
  };
}