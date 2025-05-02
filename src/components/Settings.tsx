
import React from "react";
import { ArrowLeft, ChevronRight, User, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#231F20]">
      <div className="bg-[#FFFC00] px-6 pt-12 pb-6 rounded-b-[32px]">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/rune-clock')} className="text-black hover:bg-black/10 p-2 rounded-full transition-colors">
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <h1 className="text-3xl font-bold text-black">Settings</h1>
        </div>
      </div>

      <div className="flex-1 px-6 py-8">
        <div className="space-y-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 space-y-4">
            <Link 
              to="/" 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-[#FFFC00] p-2 rounded-lg">
                  <User size={24} className="text-black" />
                </div>
                <span className="text-xl font-medium text-[#231F20]">Edit profile</span>
              </div>
              <ChevronRight size={24} className="text-gray-400" />
            </Link>

            <Link 
              to="/app-info" 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-[#FFFC00] p-2 rounded-lg">
                  <Info size={24} className="text-black" />
                </div>
                <span className="text-xl font-medium text-[#231F20]">App Info</span>
              </div>
              <ChevronRight size={24} className="text-gray-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
