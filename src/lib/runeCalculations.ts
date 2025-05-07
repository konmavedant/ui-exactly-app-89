import { getSunrise, getSunset } from 'sunrise-sunset-js';
import { getLatLngFromLocation, getLocalTime } from './locationTime';

interface RuneTimeInfluence {
  hourRotation: number;
  minuteRotation: number;
  currentTime: string;
  zodiacSign: string;
}

function getZodiacSign(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // In May, return Aries as specified
  if (month === 5) return 'Aries';

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
}

export async function calculateRuneTime(location: string): Promise<RuneTimeInfluence> {
  try {
    const { lat, lng } = await getLatLngFromLocation(location);
    const timeData = await getLocalTime(lat, lng);
    const localTime = new Date(timeData.time);

    // Get sunrise and sunset times for the current date
    const sunrise = getSunrise(lat, lng);
    const sunset = getSunset(lat, lng);

    // Convert times to minutes since midnight
    const currentMinutes = localTime.getHours() * 60 + localTime.getMinutes();
    const sunriseMinutes = sunrise.getHours() * 60 + sunrise.getMinutes();
    const sunsetMinutes = sunset.getHours() * 60 + sunset.getMinutes();

    // Calculate day and night durations
    const dayDuration = sunsetMinutes - sunriseMinutes;
    const nightDuration = 1440 - dayDuration; // 1440 = 24 hours * 60 minutes

    // Calculate big arm rotation
    let hourRotation;
    if (currentMinutes >= sunriseMinutes && currentMinutes <= sunsetMinutes) {
      // Daytime period (90° to 270°)
      const dayProgress = (currentMinutes - sunriseMinutes) / dayDuration;
      hourRotation = 90 + (dayProgress * 180);
    } else {
      // Nighttime period (270° to 90°)
      const nightMinutes = currentMinutes < sunriseMinutes 
        ? currentMinutes + (1440 - sunsetMinutes)
        : currentMinutes - sunsetMinutes;
      const nightProgress = nightMinutes / nightDuration;
      hourRotation = 270 + (nightProgress * 180);
      if (hourRotation >= 360) hourRotation -= 360;
    }

    // Small arm (Zodiac) positioned at Aries (60 degrees)
    const minuteRotation = 60;

    // Format time for display
    const timeString = localTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return {
      hourRotation: hourRotation % 360,
      minuteRotation,
      currentTime: timeString,
      zodiacSign: getZodiacSign(localTime)
    };
  } catch (error) {
    console.error('Error calculating rune time:', error);
    throw error;
  }
}