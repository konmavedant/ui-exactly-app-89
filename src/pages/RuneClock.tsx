
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import runeClockImage from "/lovable-uploads/77360373-aaa6-447e-8255-80e4eadd17a1.png";

const RuneClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [location, setLocation] = useState<string>("Chicago");
  const [country, setCountry] = useState<string>("United States");
  const [zodiacSign, setZodiacSign] = useState<string>("Scorpio");
  
  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      setCurrentTime(`${formattedHours}:${minutes} ${ampm}`);
    };
    
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-[#1A1F2C] text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <div className="w-8 h-8">
          <div className="w-8 h-0.5 bg-white mb-2"></div>
          <div className="w-8 h-0.5 bg-white mb-2"></div>
          <div className="w-8 h-0.5 bg-white"></div>
        </div>
        <h1 className="text-4xl font-bold text-appYellow text-center flex-1">Rune Clock</h1>
        <div className="w-8"></div> {/* Empty div for spacing */}
      </header>
      
      {/* Clock Image */}
      <div className="flex justify-center items-center my-8">
        <img src={runeClockImage} alt="Rune Clock" className="w-4/5 max-w-xs" />
      </div>
      
      {/* Location & Time Info */}
      <div className="text-center px-4 space-y-2 mt-4">
        <h2 className="text-4xl font-bold text-appYellow">{location}</h2>
        <h3 className="text-6xl font-bold text-white">{currentTime}</h3>
        <p className="text-3xl text-gray-400">{country}</p>
        
        <div className="mt-8 mb-6">
          <h3 className="text-4xl font-bold text-appYellow">Zodiac Sign: {zodiacSign}</h3>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="mt-auto px-4 pb-10">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
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
