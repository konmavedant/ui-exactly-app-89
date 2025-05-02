
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AppInfo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#231F20]">
      <div className="bg-[#FFFC00] px-6 pt-12 pb-6 rounded-b-[32px]">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-black hover:bg-black/10 p-2 rounded-full transition-colors">
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <h1 className="text-3xl font-bold text-black">App Info</h1>
        </div>
      </div>

      <div className="flex-1 px-6 py-8">
        <div className="space-y-10">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-[#231F20] mb-4">About Rune Clock</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              The Rune Clock app is a unique timepiece that combines traditional timekeeping with runic symbolism. 
              It provides personalized time experiences based on your birth details and location.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#231F20] border-b border-[#FFFC00]/20 pb-2">Features</h2>
            <div className="grid gap-6">
              <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
                <h3 className="text-xl font-bold text-[#231F20] mb-2">Personalized Time Display</h3>
                <p className="text-gray-700">
                  View time through a beautiful runic interface customized to your preferences and location.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
                <h3 className="text-xl font-bold text-[#231F20] mb-2">Zodiac Integration</h3>
                <p className="text-gray-700">
                  See how your zodiac sign influences your time perception and daily rhythms.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#231F20] text-white rounded-2xl p-6 mt-8">
            <h2 className="text-xl font-bold text-[#FFFC00] mb-2">Version</h2>
            <p className="text-lg">1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppInfo;
