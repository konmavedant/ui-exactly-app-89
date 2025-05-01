
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const ProfileSetup: React.FC = () => {
  const [fullName, setFullName] = useState("Lorem Ipsum");
  const [dob, setDob] = useState("01 Jan 2002");
  const [placeOfBirth, setPlaceOfBirth] = useState("Chicago, United States");

  return (
    <div className="flex flex-col min-h-screen bg-white relative">
      {/* Yellow header */}
      <div className="bg-appYellow h-[180px] w-full rounded-b-[40px] flex items-start pt-12 px-8">
        <h1 className="text-4xl font-bold text-black">Get Started</h1>
      </div>

      {/* Profile picture area */}
      <div className="flex flex-col items-center -mt-16 mb-8">
        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-white">
          <div className="w-16 h-16 bg-white rounded-full mb-4"></div>
        </div>
        <button className="mt-4 text-black text-xl font-medium">
          Change Picture
        </button>
      </div>

      {/* Form fields */}
      <div className="px-8 flex flex-col gap-6">
        <div>
          <label htmlFor="fullName" className="block text-2xl font-bold mb-2">
            Full Name
          </label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-16 text-xl px-5 rounded-xl border border-gray-300"
          />
        </div>

        <div>
          <label htmlFor="dob" className="block text-2xl font-bold mb-2">
            DOB
          </label>
          <div className="relative">
            <Input
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="h-16 text-xl px-5 rounded-xl border border-gray-300"
            />
            <Calendar className="absolute right-5 top-1/2 transform -translate-y-1/2 w-6 h-6" />
          </div>
        </div>

        <div>
          <label htmlFor="birthplace" className="block text-2xl font-bold mb-2">
            Place of Birth
          </label>
          <Input
            id="birthplace"
            value={placeOfBirth}
            onChange={(e) => setPlaceOfBirth(e.target.value)}
            className="h-16 text-xl px-5 rounded-xl border border-gray-300"
          />
        </div>

        {/* Proceed button */}
        <div className="mt-8 mb-10">
          <Button 
            className="w-full h-16 text-2xl font-bold bg-appYellow hover:bg-appYellow/90 text-black rounded-xl"
          >
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
