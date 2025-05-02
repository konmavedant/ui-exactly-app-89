
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");

  const handleProceed = () => {
    const dateObj = new Date(dateOfBirth);
    navigate('/rune-clock', { 
      state: { 
        fullName, 
        dateOfBirth: dateObj,
        placeOfBirth 
      } 
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#231F20]">
      <div className="bg-[#FFFC00] px-6 pt-12 pb-6 rounded-b-[32px]">
        <div className="flex items-start gap-4">
          <button onClick={() => navigate('/rune-clock')} className="text-black hover:bg-black/10 p-2 rounded-full transition-colors">
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <h1 className="text-2xl font-bold text-black">Personal Details</h1>
        </div>
      </div>

      <div className="flex-1 px-6 py-8">
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-left text-lg font-medium text-appYellow mb-2">
                Name
              </label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-gray-400 w-full"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-left text-lg font-medium text-appYellow mb-2">
                Date of Birth
              </label>
              <Input
                id="dateOfBirth"
                type="text"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-gray-400 w-full"
                placeholder="YYYY-MM-DD"
                pattern="\d{4}-\d{2}-\d{2}"
              />
            </div>

            <div>
              <label htmlFor="birthplace" className="block text-left text-lg font-medium text-appYellow mb-2">
                Place of Birth
              </label>
              <Input
                id="birthplace"
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                className="h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-gray-400 w-full"
                placeholder="For eg.: Mumbai, India"
              />
            </div>
          </div>

          <Button 
            onClick={handleProceed}
            className="w-full h-12 text-lg font-semibold bg-appYellow hover:bg-appYellow/90 text-black rounded-xl"
          >
            Continue to Rune Clock
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
