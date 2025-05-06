import { getSunriseSunsetTimes, getLatLngFromLocation, getLocalTime } from './locationTime';

interface RuneTimeInfluence {
  hourRotation: number;
  minuteRotation: number;
  currentTime: string;
  zodiacSign: string;
  timezone: string;
}

async function getVedicZodiacSign(date: Date): Promise<{ sign: string, entryDate: string }> {
  const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00 +05:30`;

  try {
    const response = await fetch(`https://api.vedastro.org/Calculate/PlanetSign/time/${formattedDate}/planet/Sun`);
    if (!response.ok) {
      throw new Error('Failed to fetch Vedic zodiac sign');
    }
    const data = await response.json();
    return {
      sign: data.zodiacSign,
      entryDate: data.signEntryDate
    };
  } catch (error) {
    console.error('Error fetching Vedic zodiac:', error);
    throw error;
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
    const timeData = await getLocalTime(lat, lng);
    const now = new Date(timeData.time);
    const dateStr = now.toISOString().split('T')[0];

    // Get sunrise and sunset times
    const sunData = await getSunriseSunsetTimes(lat, lng, dateStr);
    const { sunrise, sunset } = sunData;

    // Calculate minutes since midnight for all times
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
      // Daytime - calculate position in lower half (90° to 270°)
      const minutesIntoDaylight = currentMinutes - sunriseMinutes;
      const runesPassed = minutesIntoDaylight / dayRuneDuration;
      hourRotation = 90 + (runesPassed * 15); // Each rune is 15 degrees (180/12)
    } else {
      // Nighttime - calculate position in upper half (270° to 90°)
      let minutesIntoNight;
      if (currentMinutes < sunriseMinutes) {
        minutesIntoNight = currentMinutes + (1440 - sunsetMinutes);
      } else {
        minutesIntoNight = currentMinutes - sunsetMinutes;
      }
      const runesPassed = minutesIntoNight / nightRuneDuration;
      hourRotation = 270 + (runesPassed * 15);
    }

    // Get Vedic zodiac sign and calculate Small Arm position
    const zodiacData = await getVedicZodiacSign(now);
    const zodiacSigns = ['Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 
                        'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn'];

    const signIndex = zodiacSigns.indexOf(zodiacData.sign);
    const baseAngle = signIndex * 30; // Each sign spans 30 degrees

    // Calculate progress within the sign
    const entryDate = new Date(zodiacData.entryDate);
    const daysSinceEntry = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    const progressInSign = (daysSinceEntry / 30) * 30; // Assume 30 days per sign

    // Final rotation for Small Arm
    const minuteRotation = (baseAngle + progressInSign) % 360;

    return {
      hourRotation: hourRotation % 360,
      minuteRotation,
      currentTime: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      zodiacSign: zodiacData.sign,
      timezone: `GMT${timeData.timezone.gmtOffset >= 0 ? '+' : ''}${timeData.timezone.gmtOffset / 3600}`
    };
  } catch (error) {
    console.error('Error in calculateRuneTime:', error);
    throw error;
  }
}