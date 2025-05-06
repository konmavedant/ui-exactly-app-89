import { getSunriseSunsetTimes, getLatLngFromLocation, getLocalTime } from './locationTime';

interface RuneTimeInfluence {
  hourRotation: number;
  minuteRotation: number;
  currentTime: string;
  zodiacSign: string;
  timezone: string;
}

function getZodiacSignForDate(date: Date): string {
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

function getMinutesSinceMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

export async function calculateRuneTime(location: string): Promise<RuneTimeInfluence> {
  try {
    if (!location) {
      throw new Error("Location is required");
    }

    // Get coordinates and current time for location
    const { lat, lng } = await getLatLngFromLocation(location);
    const timeData = await getLocalTime(lat, lng);

    if (!timeData || !timeData.time) {
      throw new Error("Invalid time data received");
    }

    // Create date object from location's current time
    const now = new Date(timeData.time);
    const dateStr = now.toISOString().split('T')[0];

    // Get sunrise and sunset times
    const sunData = await getSunriseSunsetTimes(lat, lng, dateStr);
    if (!sunData || !sunData.sunrise || !sunData.sunset) {
      throw new Error('Invalid sunrise/sunset data received');
    }
    const { sunrise, sunset } = sunData;


    // Convert all times to minutes since midnight
    const currentMinutes = getMinutesSinceMidnight(now);
    const sunriseMinutes = getMinutesSinceMidnight(sunrise);
    const sunsetMinutes = getMinutesSinceMidnight(sunset);

    // Calculate day and night durations
    const dayDuration = sunsetMinutes - sunriseMinutes;
    const nightDuration = 1440 - dayDuration; // 1440 = 24 hours * 60 minutes

    // Each rune represents 1/12 of day or night
    const dayRuneDuration = dayDuration / 12;
    const nightRuneDuration = nightDuration / 12;

    // Calculate Hour Hand (Big Arm) rotation
    let hourRotation = 0;
    if (currentMinutes >= sunriseMinutes && currentMinutes <= sunsetMinutes) {
      // Daytime - calculate position in lower half (90° to 270°)
      const minutesIntoDaylight = currentMinutes - sunriseMinutes;
      const progressThroughDay = minutesIntoDaylight / dayDuration;
      hourRotation = 90 + (progressThroughDay * 180);
    } else {
      // Nighttime - calculate position in upper half (270° to 90°)
      let minutesIntoNight;
      if (currentMinutes < sunriseMinutes) {
        minutesIntoNight = currentMinutes + (1440 - sunsetMinutes);
      } else {
        minutesIntoNight = currentMinutes - sunsetMinutes;
      }
      const progressThroughNight = minutesIntoNight / nightDuration;
      hourRotation = 270 + (progressThroughNight * 180);
    }

    // Calculate Minute Hand (zodiac) rotation
    const zodiacSign = getZodiacSignForDate(now);
    const dayOfMonth = now.getDate();

    // Calculate precise position within zodiac sign
    const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                         'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const signIndex = zodiacSigns.indexOf(zodiacSign);

    // Each zodiac sign spans 30 degrees
    const baseAngle = signIndex * 30;
    // Calculate progress within the current sign (0-30 degrees)
    const progressInSign = (dayOfMonth / 30) * 30;

    // Final rotation combines base angle of sign and progress within it
    const minuteRotation = (baseAngle + progressInSign) % 360;

    return {
      hourRotation: hourRotation % 360,
      minuteRotation: minuteRotation % 360,
      currentTime: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      zodiacSign,
      timezone: `GMT${timeData.timezone.gmtOffset >= 0 ? '+' : ''}${timeData.timezone.gmtOffset / 3600}`
    };
  } catch (error) {
    console.error('Error in calculateRuneTime:', error);
    throw error;
  }
}