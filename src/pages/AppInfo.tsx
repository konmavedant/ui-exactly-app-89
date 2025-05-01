
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AppInfo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#231F20]">
      <div className="bg-[#FFFC00] px-6 pt-12 pb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-black">
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <h1 className="text-3xl font-bold text-black text-left">App Info</h1>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-t-3xl -mt-2 px-6 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-[#FFFC00] mb-4 text-left">About Rune Clock</h2>
            <p className="text-lg text-gray-700 text-left">
              The Rune Clock app is a unique timepiece that combines traditional timekeeping with runic symbolism. 
              It provides personalized time experiences based on your birth details and location.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-[#FFFC00] mb-4 text-left">Features</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold mb-2 text-left">Personalized Time Display</h3>
                <p className="text-lg text-gray-700 pl-4 text-left">
                  View time through a beautiful runic interface customized to your preferences and location.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-left">Zodiac Integration</h3>
                <p className="text-lg text-gray-700 pl-4 text-left">
                  See how your zodiac sign influences your time perception and daily rhythms.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#FFFC00] mb-2">Version</h2>
            <p className="text-lg text-gray-700">1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppInfo;
