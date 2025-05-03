
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
  // Calculate the day of the year (1-365)
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Big arm (24-hour rotation)
  const hourRotation = ((hours + minutes / 60) / 24) * 360;

  // Small arm (yearly rotation)
  const minuteRotation = (dayOfYear / 365) * 360;

  // Apply zodiac influence (subtle effect)
  const zodiacInfluence = {
    'Aries': { hour: 2, minute: 1 },
    'Taurus': { hour: 4, minute: 2 },
    'Gemini': { hour: 6, minute: 3 },
    'Cancer': { hour: 8, minute: 4 },
    'Leo': { hour: 10, minute: 5 },
    'Virgo': { hour: 12, minute: 6 },
    'Libra': { hour: 14, minute: 7 },
    'Scorpio': { hour: 16, minute: 8 },
    'Sagittarius': { hour: 18, minute: 9 },
    'Capricorn': { hour: 20, minute: 10 },
    'Aquarius': { hour: 22, minute: 11 },
    'Pisces': { hour: 24, minute: 12 }
  }[zodiacSign] || { hour: 0, minute: 0 };

  return {
    hourRotation: (hourRotation + zodiacInfluence.hour) % 360,
    minuteRotation: (minuteRotation + zodiacInfluence.minute) % 360
  };
}
