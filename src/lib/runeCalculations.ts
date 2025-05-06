
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
    
    // Determine zodiac sign based on Vedic dates
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
    
    // Default to Aries if no match found
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
    if (!location) {
      throw new Error("Location is required");
    }

    // Get coordinates and time data
    const { lat, lng } = await getLatLngFromLocation(location);
    const timeData = await getLocalTime(lat, lng);
    const localTime = new Date(timeData.time);
    
    // Get sunrise/sunset times and adjust to local timezone
    const dateStr = localTime.toISOString().split('T')[0];
    const sunData = await getSunriseSunsetTimes(lat, lng, dateStr);
    const gmtOffset = timeData.timezone.gmtOffset;
    
    const sunrise = adjustTimeToLocal(new Date(sunData.sunrise), gmtOffset);
    const sunset = adjustTimeToLocal(new Date(sunData.sunset), gmtOffset);

    // Calculate day and night periods in minutes
    const dayStart = sunrise.getHours() * 60 + sunrise.getMinutes();
    const dayEnd = sunset.getHours() * 60 + sunset.getMinutes();
    const currentMinutes = localTime.getHours() * 60 + localTime.getMinutes();
    
    // Calculate Big Arm rotation
    let hourRotation: number;
    const dayLength = dayEnd - dayStart;
    const nightLength = 1440 - dayLength;

    if (currentMinutes >= dayStart && currentMinutes <= dayEnd) {
      // Daytime calculation (90° to 270°)
      const minutesIntoDaytime = currentMinutes - dayStart;
      const dayProgress = minutesIntoDaytime / dayLength;
      hourRotation = 90 + (dayProgress * 180);
    } else {
      // Nighttime calculation (270° to 90°)
      let minutesIntoNight;
      if (currentMinutes < dayStart) {
        minutesIntoNight = currentMinutes + (1440 - dayEnd);
      } else {
        minutesIntoNight = currentMinutes - dayEnd;
      }
      const nightProgress = minutesIntoNight / nightLength;
      hourRotation = 270 + (nightProgress * 180);
    }

    // Calculate Small Arm (zodiac) position
    const zodiacData = await getVedicZodiacSign(localTime);
    const signIndex = VEDIC_ZODIAC_SIGNS.indexOf(zodiacData.sign);
    const signEntryDate = new Date(zodiacData.entryDate);
    const daysSinceEntry = Math.floor((localTime.getTime() - signEntryDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysInSign = 30; // Approximate days in each sign
    const progressInSign = Math.min(daysSinceEntry / daysInSign, 1);
    const baseAngle = signIndex * 30;
    const progressAngle = progressInSign * 30;
    const minuteRotation = (baseAngle + progressAngle) % 360;

    return {
      hourRotation: hourRotation % 360,
      minuteRotation,
      currentTime: localTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      zodiacSign: zodiacData.sign,
      timezone: `GMT${gmtOffset >= 0 ? '+' : ''}${gmtOffset / 3600}`
    };
  } catch (error) {
    console.error('Error in calculateRuneTime:', error);
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
