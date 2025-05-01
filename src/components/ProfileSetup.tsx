import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [date, setDate] = useState<Date>();
  const [placeOfBirth, setPlaceOfBirth] = useState("");

  const handleProceed = () => {
    navigate('/rune-clock', { 
      state: { 
        fullName, 
        dateOfBirth: date,
        placeOfBirth 
      } 
    });
  };

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
      </div>

      {/* Form fields */}
      <div className="px-8 flex flex-col gap-6">
        <div className="text-left">
          <label htmlFor="fullName" className="block text-2xl font-bold mb-2">
            Full Name
          </label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-16 text-xl px-5 rounded-xl border border-gray-300"
            placeholder="Enter your full name"
          />
        </div>

        <div className="text-left">
          <label className="block text-2xl font-bold mb-2">
            DOB
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "h-16 text-xl px-5 rounded-xl border border-gray-300 w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="text-left">
          <label htmlFor="birthplace" className="block text-2xl font-bold mb-2">
            Place of Birth
          </label>
          <Input
            id="birthplace"
            value={placeOfBirth}
            onChange={(e) => setPlaceOfBirth(e.target.value)}
            className="h-16 text-xl px-5 rounded-xl border border-gray-300"
            placeholder="For eg.: Mumbai, Asia"
          />
        </div>

        {/* Proceed button */}
        <div className="mt-8 mb-10">
          <Button 
            onClick={handleProceed}
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