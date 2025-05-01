
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import runeClockImage from "/lovable-uploads/f4e631be-5578-4d37-97a8-5e097279d63e.png";
import hourHandImage from "/lovable-uploads/74772f87-43e0-407d-8577-ee2a9c96a0b9.png";
import minuteHandImage from "/lovable-uploads/aad40062-bea9-40da-ba51-7130d085ca74.png";

const RuneClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [location, setLocation] = useState<string>("Chicago");
  const [country, setCountry] = useState<string>("United States");
  const [zodiacSign, setZodiacSign] = useState<string>("Scorpio");
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  
  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Update digital clock
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentSeconds = now.getSeconds();
      const ampm = currentHours >= 12 ? 'PM' : 'AM';
      const formattedHours = currentHours % 12 || 12;
      
      setHours(currentHours);
      setMinutes(currentMinutes);
      setSeconds(currentSeconds);
      setCurrentTime(`${formattedHours}:${currentMinutes.toString().padStart(2, '0')} ${ampm}`);
    };
    
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
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
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px]">
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
                className="h-[45%] max-h-[220px] w-auto transform -translate-y-[3.5%]"
                style={{ transformOrigin: 'center 58%' }}
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
                className="h-[55%] max-h-[270px] w-auto transform -translate-y-[5%]"
                style={{ transformOrigin: 'center 55%' }}
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
          />
        </div>
      </div>
    </div>
  );
};

export default RuneClock;
