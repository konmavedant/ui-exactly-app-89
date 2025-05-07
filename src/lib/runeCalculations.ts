import { getSunrise, getSunset } from 'sunrise-sunset-js';
import { getLatLngFromLocation, getLocalTime } from './locationTime';

interface RuneTimeInfluence {
  hourRotation: number;
  minuteRotation: number;
  currentTime: string;
  zodiacSign: string;
}

export async function calculateRuneTime(location: string): Promise<RuneTimeInfluence> {
  try {
    const { lat, lng } = await getLatLngFromLocation(location);
    const timeData = await getLocalTime(lat, lng);
    const localTime = new Date(timeData.time);

    // Get hours and minutes from the local time
    const hours = localTime.getHours();
    const minutes = localTime.getMinutes();

    // Small arm (minute hand) always points to Aries at 60°
    const minuteRotation = 60;

    // Big arm (hour hand) moves based on 24-hour clock (15 degrees per hour)
    // 360° / 24 hours = 15° per hour
    // Add minute contribution: (minutes / 60) * 15 for smooth movement
    const hourRotation = (hours * 15) + ((minutes / 60) * 15);

    // Format time for display
    const timeString = localTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return {
      hourRotation,
      minuteRotation,
      currentTime: timeString,
      zodiacSign: 'Aries'
    };
  } catch (error) {
    console.error('Error calculating rune time:', error);
    throw error;
  }
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