import { getSunriseSunsetTimes, getLatLngFromLocation, getLocalTime } from './locationTime';

interface RuneTimeInfluence {
  hourRotation: number;
  minuteRotation: number;
  currentTime: string;
  zodiacSign: string;
  timezone: string;
}

async function getZodiacSignForDate(date: Date): Promise<string> {
  try {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateStr = `${month}-${day}-${date.getFullYear()}`;
    
    const response = await fetch('https://aztro.sameerkumar.website/zodiac', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date: dateStr
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch zodiac sign');
    }
    
    const data = await response.json();
    return data.zodiac_sign;
  } catch (error) {
    console.error('Error fetching zodiac sign:', error);
    // Fallback to calculation if API fails
    if ((date.getMonth() + 1 === 3 && date.getDate() >= 21) || (date.getMonth() + 1 === 4 && date.getDate() <= 19)) return 'Aries';
    if ((date.getMonth() + 1 === 4 && date.getDate() >= 20) || (date.getMonth() + 1 === 5 && date.getDate() <= 20)) return 'Taurus';
    if ((date.getMonth() + 1 === 5 && date.getDate() >= 21) || (date.getMonth() + 1 === 6 && date.getDate() <= 20)) return 'Gemini';
    if ((date.getMonth() + 1 === 6 && date.getDate() >= 21) || (date.getMonth() + 1 === 7 && date.getDate() <= 22)) return 'Cancer';
    if ((date.getMonth() + 1 === 7 && date.getDate() >= 23) || (date.getMonth() + 1 === 8 && date.getDate() <= 22)) return 'Leo';
    if ((date.getMonth() + 1 === 8 && date.getDate() >= 23) || (date.getMonth() + 1 === 9 && date.getDate() <= 22)) return 'Virgo';
    if ((date.getMonth() + 1 === 9 && date.getDate() >= 23) || (date.getMonth() + 1 === 10 && date.getDate() <= 22)) return 'Libra';
    if ((date.getMonth() + 1 === 10 && date.getDate() >= 23) || (date.getMonth() + 1 === 11 && date.getDate() <= 21)) return 'Scorpio';
    if ((date.getMonth() + 1 === 11 && date.getDate() >= 22) || (date.getMonth() + 1 === 12 && date.getDate() <= 21)) return 'Sagittarius';
    if ((date.getMonth() + 1 === 12 && date.getDate() >= 22) || (date.getMonth() + 1 === 1 && date.getDate() <= 19)) return 'Capricorn';
    if ((date.getMonth() + 1 === 1 && date.getDate() >= 20) || (date.getMonth() + 1 === 2 && date.getDate() <= 18)) return 'Aquarius';
    return 'Pisces';
  }
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
    const zodiacSign = await getZodiacSignForDate(now);
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