
interface TimeZoneResponse {
  time: string;
  timezone: {
    gmtOffset: number;
  };
}

interface GeoLocation {
  lat: number;
  lng: number;
}

export async function getLatLngFromLocation(location: string): Promise<GeoLocation> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'RuneClockApp/1.0'
    }
  });
  const data = await response.json();

  if (data && data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  }
  throw new Error("Location not found");
}

export async function getLocalTime(lat: number, lng: number): Promise<TimeZoneResponse> {
  try {
    // Use the system time and calculate offset based on longitude
    const now = new Date();
    const gmtOffset = Math.round(lng / 15); // Approximate timezone offset
    
    const localTime = new Date(now.getTime() + (gmtOffset * 3600000));
    
    return {
      time: localTime.toISOString(),
      timezone: {
        gmtOffset: gmtOffset * 3600
      }
    };
  } catch (error) {
    console.error("Error fetching time:", error);
    throw new Error(`Failed to fetch local time: ${error.message}`);
  }
}

interface SunriseSunsetData {
  sunrise: Date;
  sunset: Date;
}

export async function getSunriseSunsetTimes(lat: number, lng: number, date: string): Promise<SunriseSunsetData> {
  const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${date}&formatted=0`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    return {
      sunrise: new Date(data.results.sunrise),
      sunset: new Date(data.results.sunset)
    };
  } catch (error) {
    console.error("Error fetching sunrise/sunset times:", error);
    throw error;
  }
}
