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
    <div className="flex flex-col min-h-screen bg-white relative">
      <div className="bg-appYellow h-[120px] w-full rounded-b-[40px] flex items-center px-6">
        <button onClick={() => navigate('/rune-clock')} className="text-black">
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <h1 className="text-3xl font-bold text-black ml-4">Personal Details</h1>
      </div>

      <div className="px-6 mt-8">
        <div className="space-y-4">
          <div className="text-left">
            <label htmlFor="fullName" className="block text-xl font-bold mb-1">
              Name
            </label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-12 text-lg px-4 rounded-xl border border-gray-300"
              placeholder="Enter your name"
            />
          </div>

          <div className="text-left">
            <label htmlFor="dateOfBirth" className="block text-xl font-bold mb-1">
              Date of Birth (YYYY-MM-DD)
            </label>
            <Input
              id="dateOfBirth"
              type="text"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="h-12 text-lg px-4 rounded-xl border border-gray-300"
              placeholder="YYYY-MM-DD"
              pattern="\d{4}-\d{2}-\d{2}"
            />
          </div>

          <div className="text-left">
            <label htmlFor="birthplace" className="block text-xl font-bold mb-1">
              Place of Birth
            </label>
            <Input
              id="birthplace"
              value={placeOfBirth}
              onChange={(e) => setPlaceOfBirth(e.target.value)}
              className="h-12 text-lg px-4 rounded-xl border border-gray-300"
              placeholder="For eg.: Mumbai, India"
            />
          </div>

          <Button 
            onClick={handleProceed}
            className="w-full h-12 text-xl font-bold bg-appYellow hover:bg-appYellow/90 text-black rounded-xl mt-6"
          >
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;