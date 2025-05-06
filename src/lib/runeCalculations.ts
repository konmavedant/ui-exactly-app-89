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

  // Calculate Big Arm (Hour) rotation
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

  // Calculate Small Arm (Minute) rotation based on moon phase
  const moonPhase = calculateMoonPhase(now);
  const minuteRotation = moonPhase * 360;

  return {
    hourRotation,
    minuteRotation
  };
}

function calculateMoonPhase(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Calculate days since known new moon (Jan 6, 2000)
  const knownNewMoon = new Date(2000, 0, 6, 18, 14);
  const current = new Date(year, month - 1, day);
  const daysSinceNewMoon = (current.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);

  // Moon phase cycle is approximately 29.53 days
  const phase = (daysSinceNewMoon % 29.53) / 29.53;
  return phase;
}