
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
  // Calculate base angles using 24-hour format
  const minuteRotation = (minutes / 60) * 360; // 6° per minute
  const hourRotation = ((hours % 24) + minutes / 60) * 15; // 15° per hour

  // Zodiac influence (reduced effect)
  const zodiacInfluence = {
    'Aries': { hour: 5, minute: 3 },
    'Taurus': { hour: 10, minute: 6 },
    'Gemini': { hour: 15, minute: 9 },
    'Cancer': { hour: 20, minute: 12 },
    'Leo': { hour: 25, minute: 15 },
    'Virgo': { hour: 30, minute: 18 },
    'Libra': { hour: 35, minute: 21 },
    'Scorpio': { hour: 40, minute: 24 },
    'Sagittarius': { hour: 45, minute: 27 },
    'Capricorn': { hour: 50, minute: 30 },
    'Aquarius': { hour: 55, minute: 33 },
    'Pisces': { hour: 60, minute: 36 }
  }[zodiacSign] || { hour: 0, minute: 0 };

  // Apply zodiac and other influences
  const finalHourRotation = (hourRotation + zodiacInfluence.hour) % 360;
  const finalMinuteRotation = (minuteRotation + zodiacInfluence.minute) % 360;

  return { 
    hourRotation: finalHourRotation, 
    minuteRotation: finalMinuteRotation 
  };
}
