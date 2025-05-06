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

function calculateBigArmRotation(
  currentTime: Date,
  sunrise: Date,
  sunset: Date
): number {
  const current = currentTime.getTime();
  const sunriseTime = sunrise.getTime();
  const sunsetTime = sunset.getTime();

  // Check if it's day or night
  const isDaytime = current >= sunriseTime && current <= sunsetTime;

  if (isDaytime) {
    // During day: map time between sunrise (90°) and sunset (270°)
    const dayProgress = (current - sunriseTime) / (sunsetTime - sunriseTime);
    return 90 + (dayProgress * 180); // 180° spread across day period
  } else {
    // During night: map time between sunset (270°) and next sunrise (90°)
    let nightProgress;
    if (current > sunsetTime) {
      // After sunset but before midnight
      const nextSunrise = new Date(sunrise);
      nextSunrise.setDate(nextSunrise.getDate() + 1);
      nightProgress = (current - sunsetTime) / (nextSunrise.getTime() - sunsetTime);
    } else {
      // After midnight but before sunrise
      nightProgress = (current - (sunset.getTime() - 24 * 60 * 60 * 1000)) / 
                     (sunrise.getTime() - (sunset.getTime() - 24 * 60 * 60 * 1000));
    }
    // Map night progress from 270° to 90° (through 360/0)
    return nightProgress <= 0.5 ? 
           270 + (nightProgress * 2 * 180) : // First half of night
           (nightProgress - 0.5) * 2 * 180;  // Second half of night
  }
}

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

export async function calculateRuneTime(location: string): Promise<RuneTimeInfluence> {
  try {
    // Get coordinates and local time
    const { lat, lng } = await getLatLngFromLocation(location);
    const timeData = await getLocalTime(lat, lng);
    const localTime = new Date(timeData.time);

    // Get sunrise/sunset times
    const dateStr = localTime.toISOString().split('T')[0];
    const sunData = await getSunriseSunsetTimes(lat, lng, dateStr);

    if (!sunData?.sunrise || !sunData?.sunset) {
      throw new Error('Failed to get sunrise/sunset times');
    }

    // Calculate rotations
    const hourRotation = calculateBigArmRotation(
      localTime,
      sunData.sunrise,
      sunData.sunset
    );

    // Small arm (minute hand) stays fixed at Aries (90 degrees)
    const minuteRotation = 90;

    // Format time string properly
    const timeString = localTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    });

    // Add timezone offset to displayed time
    const offsetHours = timeData.timezone?.gmtOffset / 3600;
    const adjustedTime = new Date(localTime.getTime() + (offsetHours * 3600000));
    const displayTime = adjustedTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Get zodiac sign
    const zodiacInfo = await getVedicZodiacSign(localTime);

    return {
      hourRotation,
      minuteRotation: 90, // Fixed at Aries position (90 degrees)
      currentTime: displayTime,
      zodiacSign: zodiacInfo.sign,
      timezone: `GMT${timeData.timezone?.gmtOffset >= 0 ? '+' : ''}${Math.floor(timeData.timezone?.gmtOffset / 3600)}`
    };
  } catch (error) {
    console.error('Error in calculateRuneTime:', error);
    throw error;
  }
}