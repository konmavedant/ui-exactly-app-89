import { getSunriseSunsetTimes, getLatLngFromLocation, getLocalTime } from './locationTime';

interface RuneTimeInfluence {
  hourRotation: number;
  minuteRotation: number;
  currentTime: string;
  zodiacSign: string;
  timezone: string;
}

const VEDIC_ZODIAC_SIGNS = [
  'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn'
];

const VEDIC_DATES = {
  'Aries': { start: '14-04', end: '15-05' },
  'Taurus': { start: '15-05', end: '14-06' },
  'Gemini': { start: '14-06', end: '15-07' },
  'Cancer': { start: '15-07', end: '15-08' },
  'Leo': { start: '15-08', end: '15-09' },
  'Virgo': { start: '15-09', end: '15-10' },
  'Libra': { start: '15-10', end: '14-11' },
  'Scorpio': { start: '14-11', end: '14-12' },
  'Sagittarius': { start: '14-12', end: '14-01' },
  'Capricorn': { start: '14-01', end: '12-02' },
  'Aquarius': { start: '12-02', end: '14-03' },
  'Pisces': { start: '14-03', end: '14-04' }
};

async function getVedicZodiacSign(date: Date): Promise<{ sign: string, entryDate: string }> {
  try {
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    for (const [sign, dates] of Object.entries(VEDIC_DATES)) {
      const year = date.getFullYear();
      const startDate = new Date(`${year}-${dates.start}`);
      const endDate = new Date(`${year}-${dates.end}`);
      if (date >= startDate && date < endDate) {
        return {
          sign,
          entryDate: startDate.toISOString()
        };
      }
    }
    return {
      sign: 'Aries',
      entryDate: new Date(`${date.getFullYear()}-04-14`).toISOString()
    };
  } catch (error) {
    console.error('Error determining Vedic zodiac:', error);
    return {
      sign: 'Aries',
      entryDate: new Date(`${date.getFullYear()}-04-14`).toISOString()
    };
  }
}

function adjustTimeToLocal(utcTime: Date, gmtOffset: number): Date {
  return new Date(utcTime.getTime() + (gmtOffset * 1000));
}

export async function calculateRuneTime(location: string): Promise<RuneTimeInfluence> {
  try {
    // Get coordinates
    const { lat, lng } = await getLatLngFromLocation(location);
    const timeData = await getLocalTime(lat, lng);
    const localTime = new Date(timeData.time);
    const gmtOffset = timeData.timezone?.gmtOffset || 0;

    // Get sunrise/sunset times
    const dateStr = localTime.toISOString().split('T')[0];
    const sunData = await getSunriseSunsetTimes(lat, lng, dateStr);

    if (!sunData?.sunrise || !sunData?.sunset) {
      // Default sunrise/sunset times if API fails
      const sunrise = new Date(localTime);
      sunrise.setHours(6, 0, 0, 0);
      const sunset = new Date(localTime);
      sunset.setHours(18, 0, 0, 0);
      sunData.sunrise = sunrise;
      sunData.sunset = sunset;
    }

    // Calculate time in minutes since midnight
    const currentMinutes = localTime.getHours() * 60 + localTime.getMinutes();
    const sunriseMinutes = sunData.sunrise.getHours() * 60 + sunData.sunrise.getMinutes();
    const sunsetMinutes = sunData.sunset.getHours() * 60 + sunData.sunset.getMinutes();

    // Calculate day and night periods
    const dayLength = sunsetMinutes - sunriseMinutes;
    const nightLength = 1440 - dayLength; // 24 hours = 1440 minutes

    // Calculate hour hand rotation
    let hourRotation = 0;
    if (currentMinutes >= sunriseMinutes && currentMinutes <= sunsetMinutes) {
      // Day period (90° to 270°)
      const dayProgress = (currentMinutes - sunriseMinutes) / dayLength;
      hourRotation = 90 + (dayProgress * 180);
    } else {
      // Night period (270° to 90°)
      let nightProgress;
      if (currentMinutes < sunriseMinutes) {
        // Before sunrise
        nightProgress = currentMinutes / (sunriseMinutes);
      } else {
        // After sunset
        nightProgress = (currentMinutes - sunsetMinutes) / (1440 - sunsetMinutes + sunriseMinutes);
      }
      hourRotation = 270 + (nightProgress * 180);
      if (hourRotation >= 360) {
        hourRotation -= 360;
      }
    }

    // Fixed Aries position for small hand (90 degrees)
    const minuteRotation = 90;

    return {
      hourRotation,
      minuteRotation,
      currentTime: localTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      zodiacSign: 'Aries',
      timezone: `GMT${gmtOffset >= 0 ? '+' : ''}${Math.floor(gmtOffset / 3600)}`
    };
  } catch (error) {
    console.error('Error in calculateRuneTime:', error);
    // Return default values on error
    return {
      hourRotation: 0,
      minuteRotation: 90, // Fixed Aries position
      currentTime: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      zodiacSign: 'Aries',
      timezone: 'GMT+5.5' // Default to India timezone
    };
  }
}