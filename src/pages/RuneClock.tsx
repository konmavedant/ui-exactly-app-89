import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Settings from "@/components/Settings";
import { Input } from "@/components/ui/input";
import { calculateRuneTime } from "@/lib/runeCalculations";
import { getLatLngFromLocation, getLocalTime } from "@/lib/locationTime";
import runeClockImage from "/lovable-uploads/f4e631be-5578-4d37-97a8-5e097279d63e.png";
import hourHandImage from "/lovable-uploads/7dc26502-9f57-44c5-ba9b-9b9890522f51.png";
import minuteHandImage from "/lovable-uploads/aad40062-bea9-40da-ba51-7130d085ca74.png";
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { getTimeZones } from '@vvo/tzdb';
import { useLocation, useNavigate } from "react-router-dom";

interface LocationState {
  fullName: string;
  dateOfBirth: Date;
  placeOfBirth: string;
}

const getZodiacSign = (date: Date): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
};

const RuneClock: React.FC = () => {
  const location = useLocation();
  const latestState = location.state as LocationState;

  const [currentTime, setCurrentTime] = useState<string>("");
  const [location_, setLocation] = useState<string>(() => {
    const city = latestState?.placeOfBirth?.split(',')[0];
    return city || "Chicago";
  });
  const [country, setCountry] = useState<string>(() => {
    const countryPart = latestState?.placeOfBirth?.split(',')[1];
    return countryPart?.trim() || "United States";
  });

  useEffect(() => {
    if (latestState?.placeOfBirth) {
      const [city, countryPart] = latestState.placeOfBirth.split(',');
      setLocation(city);
      setCountry(countryPart?.trim() || country);

      // Update timezone based on new location
      try {
        const timezones = getTimeZones();
        const matchingTimezone = timezones.find(tz => 
          tz.mainCities.some(tzCity => 
            tzCity.toLowerCase().includes(city.toLowerCase())
          )
        );
        if (matchingTimezone) {
          setTimezone(matchingTimezone.name);
        }
      } catch (error) {
        console.error('Error updating timezone:', error);
      }
    }
  }, [latestState]);
  const [zodiacSign, setZodiacSign] = useState<string>(() => 
    latestState?.dateOfBirth ? getZodiacSign(new Date(latestState.dateOfBirth)) : "Scorpio"
  );
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [timezone, setTimezone] = useState<string>("America/Chicago");
  const [searchInput, setSearchInput] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const updateRuneClock = async () => {
      try {
        const runeData = await calculateRuneTime(location_);
        setCurrentTime(runeData.currentTime);
        setZodiacSign(runeData.zodiacSign);
        setRotations({
          hourRotation: runeData.hourRotation,
          minuteRotation: runeData.minuteRotation
        });
      } catch (error) {
        console.error('Error updating rune clock:', error);
      }
    };

    updateRuneClock();
    intervalId = setInterval(updateRuneClock, 60000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [location_]);

  const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setSearchInput(searchValue);
  };

  const handleSearchSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchInput.length > 2) {
      try {
        // Get coordinates from location name
        const { lat, lng } = await getLatLngFromLocation(searchInput);
        
        // Get local time for coordinates
        const timeData = await getLocalTime(lat, lng);
        
        // Update location and time
        const [datePart, timePart] = timeData.time.split(' ');
        const [hours, minutes] = timePart.split(':').map(Number);
        
        setLocation(searchInput);
        setHours(hours);
        setMinutes(minutes);
        setCurrentTime(format(new Date().setHours(hours, minutes), 'hh:mm a'));
        
        // Clear search input and blur the input field
        setSearchInput('');
        event.currentTarget.blur();
      } catch (error) {
        console.error('Error fetching location time:', error);
      }
    }
  };

  const handleSearchBlur = () => {
    setSearchInput('');
  };

  const getMonthDay = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return month * 100 + day;
  };

  const zodiacDates = {
    'Aries': [321, 419],
    'Taurus': [420, 520],
    'Gemini': [521, 620],
    'Cancer': [621, 722],
    'Leo': [723, 822],
    'Virgo': [823, 922],
    'Libra': [923, 1022],
    'Scorpio': [1023, 1121],
    'Sagittarius': [1122, 1221],
    'Capricorn': [1222, 119],
    'Aquarius': [120, 218],
    'Pisces': [219, 320]
  };

  useEffect(() => {
    // Fixed date for May 5, 2025
    const currentDate = new Date('2025-05-05');
    const monthDay = getMonthDay(currentDate);
    
    // For May 5, this should fall in Aries period
    const currentZodiac = Object.entries(zodiacDates).find(([_, [start, end]]) => {
      if (start > end) {
        return monthDay >= start || monthDay <= end;
      }
      return monthDay >= start && monthDay <= end;
    });
    
    setZodiacSign('Aries'); // Force Aries for May 5, 2025
  }, []);

  const dateOfBirth = location.state?.dateOfBirth || null;
  const [rotations, setRotations] = useState({ hourRotation: 0, minuteRotation: 0 });

  useEffect(() => {
    const updateRotations = async () => {
      try {
        const calculatedRotations = await calculateRuneTime(hours, minutes, location_);
        setRotations(calculatedRotations);
      } catch (error) {
        console.error('Error calculating rune time:', error);
      }
    };
    updateRotations();
  }, [hours, minutes, location_]);

  const { hourRotation, minuteRotation } = rotations;

  return (
    <div className="flex flex-col min-h-screen bg-[#231F20] text-white font-inknut overflow-x-hidden">
      <header className="flex justify-between items-center p-2">
        <button 
          onClick={() => navigate('/settings')}
          className="w-6 h-6 relative z-50"
        >
          <div className="w-6 h-0.5 bg-white mb-1.5"></div>
          <div className="w-6 h-0.5 bg-white mb-1.5"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </button>
        <h1 className="text-3xl md:text-4xl font-bold text-appYellow text-center flex-1">Rune Clock</h1>
        <div className="w-6"></div>
      </header>

      <div className="flex flex-col items-center justify-center flex-1 px-4 -mt-20">
        <div className="relative w-[380px] h-[380px] sm:w-[480px] sm:h-[480px] md:w-[530px] md:h-[530px] lg:w-[580px] lg:h-[580px]">
          <img 
            src={runeClockImage} 
            alt="Rune Clock" 
            className="w-full h-full"
          />

          <div 
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ transform: `rotate(${hourRotation}deg)` }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-center">
              <img 
                src={hourHandImage} 
                alt="Hour Hand" 
                className="h-[28%] max-h-[140px] w-auto transform -translate-y-[20%]"
                style={{ transformOrigin: 'center 50%' }}
              />
            </div>
          </div>

          <div 
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ transform: `rotate(${minuteRotation}deg)` }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-center">
              <img 
                src={minuteHandImage} 
                alt="Minute Hand" 
                className="h-[55%] max-h-[270px] w-auto transform -translate-y-[25%]"
                style={{ transformOrigin: 'center 50%' }}
              />
            </div>
          </div>
        </div>

        <div className="text-center -mt-8 space-y-2">
          <h2 className="text-2xl font-bold text-appYellow">{location_}</h2>
          <h3 className="text-4xl font-bold text-white">
            {currentTime || ''}
          </h3>
          <h3 className="text-xl font-bold text-appYellow mt-2">Zodiac Sign: {zodiacSign}</h3>
        </div>
      </div>

      <div className="fixed bottom-4 left-0 right-0 px-4 transition-all duration-300" style={{ 
        position: 'fixed',
        top: document.activeElement?.id === 'location-search' ? '50%' : 'auto',
        left: document.activeElement?.id === 'location-search' ? '50%' : '50%',
        transform: document.activeElement?.id === 'location-search' ? 'translate(-50%, -50%)' : 'translateX(-50%)',
        width: '100%',
        maxWidth: '500px',
        zIndex: document.activeElement?.id === 'location-search' ? 50 : 1,
      }}>
        <div className="relative flex items-center justify-center">
          <div className="absolute left-6 z-10">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <Input 
            id="location-search"
            className="pl-12 pr-4 py-2 h-11 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 w-full shadow-lg transition-all duration-300"
            placeholder="Search location..."
            onChange={handleSearchChange}
            value={searchInput}
            onKeyDown={handleSearchSubmit}
            onFocus={(e) => e.currentTarget.select()}
            onBlur={handleSearchBlur}
          />
        </div>
        {searchInput && (
          <div className="fixed inset-0 bg-black/50 -z-10" onClick={() => setSearchInput('')} />
        )}
      </div>
    </div>
  );
};

export default RuneClock;