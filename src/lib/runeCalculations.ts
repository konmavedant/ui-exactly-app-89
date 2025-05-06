
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import { getLatLngFromLocation } from './locationTime';

interface RuneTimeInfluence {
  hourRotation: number;
  minuteRotation: number;
}

interface LocationTime {
  currentTime: string;
  zodiacSign: string;
  timezone: string;
}

function getZodiacSign(lat: number, lng: number, date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
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

export async function calculateRuneTime(location: string): Promise<RuneTimeInfluence & LocationTime> {
  try {
    const { lat, lng } = await getLatLngFromLocation(location);
    const now = new Date();
    
    // Get actual sunrise and sunset times
    const sunrise = getSunrise(lat, lng, now);
    const sunset = getSunset(lat, lng, now);

    // Convert to local time
    const localTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
    
    // Calculate current minutes since midnight
    const currentMinutes = localTime.getHours() * 60 + localTime.getMinutes();
    const sunriseMinutes = sunrise.getHours() * 60 + sunrise.getMinutes();
    const sunsetMinutes = sunset.getHours() * 60 + sunset.getMinutes();

    // Calculate day and night periods
    const dayLengthMinutes = sunsetMinutes - sunriseMinutes;
    const nightLengthMinutes = (1440 - sunsetMinutes) + sunriseMinutes;

    // Calculate Big Arm (Hour) rotation
    let hourRotation;
    if (currentMinutes >= sunriseMinutes && currentMinutes <= sunsetMinutes) {
      // Day period (90° to 270°)
      const minutesSinceSunrise = currentMinutes - sunriseMinutes;
      const dayProgress = minutesSinceSunrise / dayLengthMinutes;
      hourRotation = 90 + (dayProgress * 180);
    } else {
      // Night period (270° to 90°)
      let minutesSinceSunset;
      if (currentMinutes < sunriseMinutes) {
        minutesSinceSunset = currentMinutes + (1440 - sunsetMinutes);
      } else {
        minutesSinceSunset = currentMinutes - sunsetMinutes;
      }
      const nightProgress = minutesSinceSunset / nightLengthMinutes;
      hourRotation = 270 + (nightProgress * 180);
    }

    // Calculate Small Arm (zodiac) rotation based on current date
    const daysInYear = 365;
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    const minuteRotation = (dayOfYear / daysInYear) * 360;

    return {
      hourRotation: hourRotation % 360,
      minuteRotation: minuteRotation % 360,
      currentTime: localTime.toLocaleTimeString(),
      zodiacSign: getZodiacSign(lat, lng, now),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  } catch (error) {
    console.error('Error calculating rune time:', error);
    throw error;
  }
}
