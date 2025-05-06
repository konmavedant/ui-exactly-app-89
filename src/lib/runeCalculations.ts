
import { getSunriseSunsetTimes, getLatLngFromLocation } from './locationTime';

interface RuneTimeInfluence {
  hourRotation: number;
  minuteRotation: number;
  currentTime: string;
  zodiacSign: string;
  timezone: string;
}

function getZodiacSign(date: Date): string {
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

function getZodiacAngle(sign: string, date: Date): number {
  const zodiacStartAngles: { [key: string]: number } = {
    'Aries': 0, 'Taurus': 30, 'Gemini': 60, 'Cancer': 90,
    'Leo': 120, 'Virgo': 150, 'Libra': 180, 'Scorpio': 210,
    'Sagittarius': 240, 'Capricorn': 270, 'Aquarius': 300, 'Pisces': 330
  };

  const baseAngle = zodiacStartAngles[sign];
  const daysInSign = 30; // Approximate
  const dayOfMonth = date.getDate();
  const progressInSign = (dayOfMonth / daysInSign) * 30;

  return (baseAngle + progressInSign) % 360;
}

export async function calculateRuneTime(location: string): Promise<RuneTimeInfluence> {
  try {
    const { lat, lng } = await getLatLngFromLocation(location);
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    
    // Get sunrise and sunset times
    const { sunrise, sunset } = await getSunriseSunsetTimes(lat, lng, dateStr);
    
    // Convert all times to minutes since midnight
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const sunriseMinutes = sunrise.getHours() * 60 + sunrise.getMinutes();
    const sunsetMinutes = sunset.getHours() * 60 + sunset.getMinutes();

    // Calculate day and night durations
    const dayDuration = sunsetMinutes - sunriseMinutes;
    const nightDuration = 1440 - dayDuration; // 1440 = 24 hours * 60 minutes
    
    // Each rune represents 1/12 of day or night
    const dayRuneDuration = dayDuration / 12;
    const nightRuneDuration = nightDuration / 12;

    // Calculate Big Arm rotation
    let hourRotation = 0;
    if (currentMinutes >= sunriseMinutes && currentMinutes <= sunsetMinutes) {
      // Day time - lower half of clock (90° to 270°)
      const minutesIntoDaylight = currentMinutes - sunriseMinutes;
      const runesPassed = minutesIntoDaylight / dayRuneDuration;
      hourRotation = 90 + (runesPassed * 15);
    } else {
      // Night time - upper half of clock (270° to 90°)
      let minutesIntoNight;
      if (currentMinutes < sunriseMinutes) {
        minutesIntoNight = currentMinutes + (1440 - sunsetMinutes);
      } else {
        minutesIntoNight = currentMinutes - sunsetMinutes;
      }
      const runesPassed = minutesIntoNight / nightRuneDuration;
      hourRotation = 270 + (runesPassed * 15);
    }

    // Calculate Small Arm (zodiac) rotation
    const zodiacSign = getZodiacSign(now);
    const minuteRotation = getZodiacAngle(zodiacSign, now);

    // Format time for display
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return {
      hourRotation: hourRotation % 360,
      minuteRotation: minuteRotation % 360,
      currentTime: timeString,
      zodiacSign: zodiacSign,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  } catch (error) {
    console.error('Error calculating rune time:', error);
    throw error;
  }
}
