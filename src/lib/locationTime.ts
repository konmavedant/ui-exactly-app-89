
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
  const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;
  if (!OPENCAGE_API_KEY) {
    throw new Error("OpenCage API key not found");
  }
  
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${OPENCAGE_API_KEY}`;
  
  const response = await fetch(url);
  const data = await response.json();

  if (data.results && data.results.length > 0) {
    const { lat, lng } = data.results[0].geometry;
    return { lat, lng };
  }
  throw new Error("Location not found");
}

export async function getLocalTime(lat: number, lng: number): Promise<TimeZoneResponse> {
  const TIMEZONE_API_KEY = import.meta.env.VITE_TIMEZONE_API_KEY;
  if (!TIMEZONE_API_KEY) {
    throw new Error("TimeZoneDB API key not found");
  }

  try {
    const url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${TIMEZONE_API_KEY}&format=json&by=position&lat=${lat}&lng=${lng}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      return {
        time: new Date(data.formatted).toLocaleString(),
        timezone: {
          gmtOffset: data.gmtOffset
        }
      };
    }
    throw new Error("Time data not available");
  } catch (error) {
    console.error("Error fetching time:", error);
    throw error;
  }
}
