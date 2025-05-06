
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
  const API_KEY = 'c89e8967f04d4d0f86e91b4be385b830';
  const url = `https://api.ipgeolocation.io/timezone?apiKey=${API_KEY}&lat=${lat}&long=${lng}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (!data.date_time_txt || !data.timezone_offset) {
      throw new Error('Invalid response from timezone API');
    }

    return {
      time: data.date_time_txt,
      timezone: {
        gmtOffset: parseInt(data.timezone_offset) * 3600
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
