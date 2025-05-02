
interface RuneTimeInfluence {
  hourRotation: number;
  minuteRotation: number;
}

export function calculateRuneTime(
  hours: number,
  minutes: number,
  zodiacSign: string,
  location: string,
  dateOfBirth?: Date
): RuneTimeInfluence {
  // Base rotation calculations
  const baseHourRotation = (hours % 12) * 30 + minutes * 0.5;
  const baseMinuteRotation = minutes * 6;

  // Zodiac influence calculations
  const zodiacInfluence = {
    'Aries': { hour: 15, minute: 10 },
    'Taurus': { hour: 30, minute: 20 },
    'Gemini': { hour: 45, minute: 30 },
    'Cancer': { hour: 60, minute: 40 },
    'Leo': { hour: 75, minute: 50 },
    'Virgo': { hour: 90, minute: 60 },
    'Libra': { hour: 105, minute: 70 },
    'Scorpio': { hour: 120, minute: 80 },
    'Sagittarius': { hour: 135, minute: 90 },
    'Capricorn': { hour: 150, minute: 100 },
    'Aquarius': { hour: 165, minute: 110 },
    'Pisces': { hour: 180, minute: 120 }
  }[zodiacSign] || { hour: 0, minute: 0 };

  // Location hemisphere influence
  const isNorthern = !location.toLowerCase().includes('south');
  const hemisphereMultiplier = isNorthern ? 1 : -1;

  // Birth date influence (if available)
  const birthDateInfluence = dateOfBirth ? 
    Math.sin(dateOfBirth.getTime() / (1000 * 60 * 60 * 24 * 365.25) * Math.PI) * 15 : 
    0;

  // Calculate final rotations
  const hourRotation = (
    baseHourRotation + 
    (zodiacInfluence.hour / 12) * hemisphereMultiplier +
    birthDateInfluence
  ) % 360;

  const minuteRotation = (
    baseMinuteRotation + 
    (zodiacInfluence.minute / 60) * hemisphereMultiplier +
    birthDateInfluence * 0.5
  ) % 360;

  return { hourRotation, minuteRotation };
}
