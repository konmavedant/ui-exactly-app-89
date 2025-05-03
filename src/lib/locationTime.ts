
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
  const GEONAMES_USERNAME = import.meta.env.VITE_GEONAMES_USERNAME;
  const url = `http://api.geonames.org/timezoneJSON?lat=${lat}&lng=${lng}&username=${GEONAMES_USERNAME}`;
  
  const response = await fetch(url);
  const data = await response.json();

  if (data.time) {
    return data;
  }
  throw new Error("Time not found for coordinates");
}
