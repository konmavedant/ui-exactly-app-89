import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import runeClockImage from "/lovable-uploads/f4e631be-5578-4d37-97a8-5e097279d63e.png";
import hourHandImage from "/lovable-uploads/74772f87-43e0-407d-8577-ee2a9c96a0b9.png";
import minuteHandImage from "/lovable-uploads/aad40062-bea9-40da-ba51-7130d085ca74.png";
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { getTimeZones } from '@vvo/tzdb';

const RuneClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [location, setLocation] = useState<string>("Chicago");
  const [country, setCountry] = useState<string>("United States");
  const [zodiacSign, setZodiacSign] = useState<string>("Scorpio");
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [timezone, setTimezone] = useState<string>("America/Chicago");
  const [searchInput, setSearchInput] = useState<string>("");

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = formatInTimeZone(now, timezone, 'hh:mm a'); // Use date-fns-tz for timezone support

      setCurrentTime(formattedTime);
      setHours(now.getHours());
      setMinutes(now.getMinutes());
      setSeconds(now.getSeconds());
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [timezone]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchInput(searchValue);

    if (searchValue.length > 2) {
      const timezones = getTimeZones();
      const matchingTimezone = timezones.find(tz => 
        tz.name.toLowerCase().includes(searchValue) ||
        tz.mainCities.some(city => city.toLowerCase().includes(searchValue))
      );

      if (matchingTimezone) {
        const cityName = matchingTimezone.mainCities[0] || matchingTimezone.name.split('/').pop()?.replace(/_/g, ' ');
        setLocation(cityName || searchValue);
        setCountry(matchingTimezone.continentName);
        setTimezone(matchingTimezone.name);

        // Update zodiac sign based on current date
        const currentDate = new Date();
        const zodiacSigns = {
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

        const monthDay = parseInt(format(currentDate, 'Mdd'));
        const currentZodiac = Object.entries(zodiacSigns).find(([_, [start, end]]) => {
          if (start > end) {
            return monthDay >= start || monthDay <= end;
          }
          return monthDay >= start && monthDay <= end;
        });

        setZodiacSign(currentZodiac ? currentZodiac[0] : 'Scorpio');
      }
    }
  };


  // Calculate rotation angles for clock hands
  const hourRotation = (hours % 12) * 30 + minutes * 0.5; // 30 degrees per hour, plus small adjustment for minutes
  const minuteRotation = minutes * 6; // 6 degrees per minute

  return (
    <div className="flex flex-col min-h-screen bg-[#231F20] text-white font-inknut">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="w-8 h-8">
          <div className="w-8 h-0.5 bg-white mb-2"></div>
          <div className="w-8 h-0.5 bg-white mb-2"></div>
          <div className="w-8 h-0.5 bg-white"></div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-appYellow text-center flex-1">Rune Clock</h1>
        <div className="w-8"></div> {/* Empty div for spacing */}
      </header>

      {/* Clock Image and Hands */}
      <div className="flex-1 flex justify-center items-center my-4 px-4">
        <div className="relative w-96 h-96 sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px]">
          {/* Rune Clock Background */}
          <img 
            src={runeClockImage} 
            alt="Rune Clock" 
            className="w-full h-full"
          />

          {/* Hour Hand */}
          <div 
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ transform: `rotate(${hourRotation}deg)` }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-center">
              <img 
                src={hourHandImage} 
                alt="Hour Hand" 
                className="h-[45%] max-h-[220px] w-auto transform -translate-y-[20%]"
                style={{ transformOrigin: 'center 50%' }}
              />
            </div>
          </div>

          {/* Minute Hand */}
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
      </div>

      {/* Location & Time Info */}
      <div className="text-center px-6 py-6 space-y-5">
        <h2 className="text-3xl md:text-4xl font-bold text-appYellow">{location}</h2>
        <h3 className="text-5xl md:text-6xl font-bold text-white">{currentTime}</h3>
        <p className="text-2xl md:text-3xl text-gray-400">{country}</p>

        <div className="mt-8 mb-6">
          <h3 className="text-3xl md:text-4xl font-bold text-appYellow">Zodiac Sign: {zodiacSign}</h3>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-auto px-6 pb-10 pt-6">
        <div className="relative flex items-center">
          <div className="absolute left-3">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <Input 
            className="pl-10 pr-4 py-3 h-14 rounded-full bg-white text-gray-800 placeholder-gray-400 w-full"
            placeholder="Search location..."
            onChange={handleSearchChange}
            value={searchInput}
          />
        </div>
      </div>
    </div>
  );
};

export default RuneClock;