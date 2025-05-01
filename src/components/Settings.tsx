
import React from "react";
import { Avatar } from '@/components/ui/avatar';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-[#231F20]">
      <div className="bg-[#FFFC00] px-6 pt-12 pb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/rune-clock')} className="text-black">
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <h1 className="text-3xl font-bold text-black">Settings</h1>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-t-3xl -mt-2">
        <div className="border-b border-gray-200">
          <div className="flex items-center px-6 py-4">
            <Avatar className="h-16 w-16 mr-4">
              <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                <span className="text-2xl text-gray-400">👤</span>
              </div>
            </Avatar>
            <div className="text-xl font-medium">{state?.fullName || "Guest User"}</div>
          </div>
        </div>

        <div className="pt-4 px-6">

          <div className="space-y-4">
            <Link to="/edit-profile" className="flex items-center justify-between py-2">
              <span className="text-xl font-medium">Edit profile</span>
              <ChevronRight size={24} />
            </Link>

            <Link to="/app-info" className="flex items-center justify-between py-2">
              <span className="text-xl font-medium">App Info</span>
              <ChevronRight size={24} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
