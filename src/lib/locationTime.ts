
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
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RuneClockApp/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error("Location not found");
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  } catch (error) {
    console.error("Error fetching location:", error);
    throw error;
  }
}

export async function getLocalTime(lat: number, lng: number): Promise<TimeZoneResponse> {
  try {
    // For Mumbai (and India), use a fixed offset of +5:30
    const now = new Date();
    let gmtOffset = 5.5; // Default to IST for Mumbai
    
    if (Math.abs(lat - 19.0760) < 2 && Math.abs(lng - 72.8777) < 2) {
      gmtOffset = 5.5; // Mumbai coordinates
    } else {
      gmtOffset = Math.round(lng / 15); // Fallback for other locations
    }
    
    const localTime = new Date(now.getTime() + (gmtOffset * 3600000));
    
    return {
      time: localTime.toISOString(),
      timezone: {
        gmtOffset: gmtOffset * 3600
      }
    };
  } catch (error) {
    console.error("Error getting local time:", error);
    throw error;
  }
}

export async function getSunriseSunsetTimes(lat: number, lng: number, date: string): Promise<{ sunrise: Date; sunset: Date }> {
  try {
    const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${date}&formatted=0`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch sunrise/sunset data');
    }
    
    const data = await response.json();
    
    if (!data.results) {
      throw new Error('Invalid sunrise/sunset data');
    }
    
    return {
      sunrise: new Date(data.results.sunrise),
      sunset: new Date(data.results.sunset)
    };
  } catch (error) {
    console.error("Error fetching sunrise/sunset times:", error);
    throw error;
  }
}
