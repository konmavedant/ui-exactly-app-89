import { getSunriseSunsetTimes, getLatLngFromLocation, getLocalTime } from './locationTime';

interface RuneTimeInfluence {
  hourRotation: number;
  minuteRotation: number;
  currentTime: string;
  zodiacSign: string;
  timezone: string;
}

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

async function getVedicZodiacSign(date: Date): Promise<{ sign: string, entryDate: string }> {
  try {
    // Format the date in IST timezone
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00 +05:30`;

    const response = await fetch(`https://api.vedastro.org/Calculate/PlanetSign/time/${encodeURIComponent(formattedDate)}/planet/Sun`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      sign: data.zodiacSign,
      entryDate: data.signEntryDate
    };
  } catch (error) {
    console.error('Error fetching Vedic zodiac:', error);
    // Fallback: Calculate approximate zodiac sign based on date
    const month = date.getMonth() + 1;
    const day = date.getDate();
    let zodiacSign = 'Aries'; // Default fallback

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) zodiacSign = 'Aries';
    else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) zodiacSign = 'Taurus';
    else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) zodiacSign = 'Gemini';
    else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) zodiacSign = 'Cancer';
    else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) zodiacSign = 'Leo';
    else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) zodiacSign = 'Virgo';
    else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) zodiacSign = 'Libra';
    else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) zodiacSign = 'Scorpio';
    else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) zodiacSign = 'Sagittarius';
    else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) zodiacSign = 'Capricorn';
    else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) zodiacSign = 'Aquarius';
    else zodiacSign = 'Pisces';

    return {
      sign: zodiacSign,
      entryDate: date.toISOString()
    };
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

    // Get coordinates and local time
    const { lat, lng } = await getLatLngFromLocation(location);
    const now = new Date();
    let timeData;

    try {
      timeData = await getLocalTime(lat, lng);
    } catch (error) {
      console.error('Error fetching local time:', error);
      // Fallback to browser's local time
      timeData = {
        time: now.toISOString(),
        timezone: { gmtOffset: now.getTimezoneOffset() * -60 }
      };
    }

    const dateStr = now.toISOString().split('T')[0];

    // Get sunrise and sunset times with fallback
    let sunrise = new Date(now);
    let sunset = new Date(now);
    try {
      const sunData = await getSunriseSunsetTimes(lat, lng, dateStr);
      sunrise = sunData.sunrise;
      sunset = sunData.sunset;
    } catch (error) {
      console.error('Error fetching sun times:', error);
      // Fallback to approximate times
      sunrise.setHours(6, 0, 0);
      sunset.setHours(18, 0, 0);
    }

    // Calculate minutes since midnight
    const currentMinutes = getMinutesSinceMidnight(now);
    const sunriseMinutes = getMinutesSinceMidnight(sunrise);
    const sunsetMinutes = getMinutesSinceMidnight(sunset);

    // Calculate day and night durations
    const dayDuration = sunsetMinutes - sunriseMinutes;
    const nightDuration = 1440 - dayDuration;

    // Calculate Rune durations
    const dayRuneDuration = dayDuration / 12;
    const nightRuneDuration = nightDuration / 12;

    // Calculate Big Arm (Hour Hand) rotation
    let hourRotation = 0;
    if (currentMinutes >= sunriseMinutes && currentMinutes <= sunsetMinutes) {
      const minutesIntoDaylight = currentMinutes - sunriseMinutes;
      const runesPassed = minutesIntoDaylight / dayRuneDuration;
      hourRotation = 90 + (runesPassed * 15);
    } else {
      let minutesIntoNight;
      if (currentMinutes < sunriseMinutes) {
        minutesIntoNight = currentMinutes + (1440 - sunsetMinutes);
      } else {
        minutesIntoNight = currentMinutes - sunsetMinutes;
      }
      const runesPassed = minutesIntoNight / nightRuneDuration;
      hourRotation = 270 + (runesPassed * 15);
    }

    // Get zodiac sign and calculate Small Arm position
    const zodiacSign = 'Aries'; // Always Aries
    const dayOfMonth = now.getDate();
    const baseAngle = 0; // Aries starts at 0 degrees (12 o'clock)
    const progressInSign = (dayOfMonth / 30) * 30;
    const minuteRotation = (baseAngle + progressInSign) % 360;


    return {
      hourRotation: hourRotation % 360,
      minuteRotation: minuteRotation,
      currentTime: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      zodiacSign: zodiacSign,
      timezone: `GMT${timeData.timezone.gmtOffset >= 0 ? '+' : ''}${timeData.timezone.gmtOffset / 3600}`
    };
  } catch (error) {
    console.error('Error in calculateRuneTime:', error);
    // Return default values if everything fails
    return {
      hourRotation: 0,
      minuteRotation: 0,
      currentTime: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      zodiacSign: 'Aries',
      timezone: 'GMT+0'
    };
  }
}