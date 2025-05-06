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

    // Get coordinates
    const { lat, lng } = await getLatLngFromLocation(location);
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    // Get sunrise and sunset times
    const sunData = await getSunriseSunsetTimes(lat, lng, dateStr);
    const sunrise = new Date(sunData.sunrise);
    const sunset = new Date(sunData.sunset);

    // Get local time data
    const timeData = await getLocalTime(lat, lng);
    const localTime = new Date(timeData.time);

    // Calculate day and night periods
    const dayStart = sunrise.getHours() * 60 + sunrise.getMinutes();
    const dayEnd = sunset.getHours() * 60 + sunset.getMinutes();
    const currentMinutes = localTime.getHours() * 60 + localTime.getMinutes();

    // Calculate big arm (hour hand) rotation
    let hourRotation;
    const dayLength = dayEnd - dayStart;
    const nightLength = 1440 - dayLength;

    if (currentMinutes >= dayStart && currentMinutes <= dayEnd) {
      // Day time calculation (90° to 270°)
      const minutesIntoDaytime = currentMinutes - dayStart;
      const dayProgress = minutesIntoDaytime / dayLength;
      hourRotation = 90 + (dayProgress * 180);
    } else {
      // Night time calculation (270° to 90°)
      let minutesIntoNight;
      if (currentMinutes < dayStart) {
        minutesIntoNight = currentMinutes + (1440 - dayEnd);
      } else {
        minutesIntoNight = currentMinutes - dayEnd;
      }
      const nightProgress = minutesIntoNight / nightLength;
      hourRotation = 270 + (nightProgress * 180);
    }

    // Small arm (zodiac) position - fixed at Aries (0°) with slight daily progression
    const dayOfMonth = localTime.getDate();
    const progressInSign = (dayOfMonth / 30) * 30; // 30° movement within the sign
    const minuteRotation = progressInSign % 360;

    return {
      hourRotation: hourRotation % 360,
      minuteRotation,
      currentTime: localTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      zodiacSign: 'Aries',
      timezone: `GMT${timeData.timezone.gmtOffset >= 0 ? '+' : ''}${timeData.timezone.gmtOffset / 3600}`
    };
  } catch (error) {
    console.error('Error in calculateRuneTime:', error);
    // Return default values in case of error
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