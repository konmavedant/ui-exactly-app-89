
import React from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SettingsProps {
  onClose: () => void;
  fullName: string;
}

const Settings: React.FC<SettingsProps> = ({ onClose, fullName }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-appYellow z-50 overflow-auto">
      <div className="p-6">
        <button 
          onClick={onClose}
          className="flex items-center text-3xl font-bold mb-8"
        >
          <ArrowLeft className="mr-2 h-8 w-8" />
          Settings
        </button>

        <div className="bg-white rounded-3xl p-6">
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
            </div>
            <span className="ml-4 text-xl font-medium">{fullName}</span>
          </div>

          <div className="mb-8">
            <h2 className="text-gray-500 text-lg mb-4">Account Settings</h2>
            <button 
              onClick={() => navigate("/")}
              className="w-full flex items-center justify-between py-4 text-left text-xl"
            >
              <span>Edit profile</span>
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div>
            <h2 className="text-gray-500 text-lg mb-4">App Info</h2>
            <button className="w-full flex items-center justify-between py-4 text-left text-xl">
              <span>App Info</span>
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
