
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import { getLatLngFromLocation } from './locationTime';

interface RuneTimeInfluence {
  hourRotation: number;
  minuteRotation: number;
}

export async function calculateRuneTime(
  hours: number,
  minutes: number,
  location: string,
): Promise<RuneTimeInfluence> {
  const now = new Date();
  now.setHours(hours);
  now.setMinutes(minutes);

  // Get coordinates for the location
  const { lat, lng } = await getLatLngFromLocation(location);

  // Get actual sunrise and sunset times
  const sunrise = getSunrise(lat, lng, now);
  const sunset = getSunset(lat, lng, now);

  // Convert all times to minutes since midnight
  const currentMinutes = hours * 60 + minutes;
  const sunriseMinutes = sunrise.getHours() * 60 + sunrise.getMinutes();
  const sunsetMinutes = sunset.getHours() * 60 + sunset.getMinutes();

  // Calculate day and night periods
  const dayLengthMinutes = sunsetMinutes - sunriseMinutes;
  const nightLengthMinutes = (1440 - sunsetMinutes) + sunriseMinutes;

  // Calculate Big Arm rotation based on day/night cycle
  let hourRotation;
  if (currentMinutes >= sunriseMinutes && currentMinutes <= sunsetMinutes) {
    // Day period (90° to 270°)
    const minutesSinceSunrise = currentMinutes - sunriseMinutes;
    const dayProgress = minutesSinceSunrise / dayLengthMinutes;
    hourRotation = 90 + (dayProgress * 180);
  } else {
    // Night period (270° to 90°)
    let minutesSinceSunset;
    if (currentMinutes < sunriseMinutes) {
      minutesSinceSunset = currentMinutes + (1440 - sunsetMinutes);
    } else {
      minutesSinceSunset = currentMinutes - sunsetMinutes;
    }
    const nightProgress = minutesSinceSunset / nightLengthMinutes;
    hourRotation = 270 + (nightProgress * 180);
  }
  hourRotation = hourRotation % 360;

  // Calculate Small Arm rotation based on zodiac position
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((now.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000));
  const zodiacDegrees = (dayOfYear / 365) * 360;

  // Adjust zodiac rotation to align with traditional dates
  // Start from Aries (March 21)
  const zodiacOffset = 80; // Degrees to align with Aries start
  const minuteRotation = (zodiacDegrees + zodiacOffset) % 360;

  return {
    hourRotation,
    minuteRotation
  };
}
