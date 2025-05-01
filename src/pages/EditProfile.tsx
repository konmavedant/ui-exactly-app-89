
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("Vedant Jha");
  const [date, setDate] = useState<Date>();
  const [placeOfBirth, setPlaceOfBirth] = useState("Mumbai, India");

  const handleSave = () => {
    // Handle save logic here
    navigate('/settings');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#231F20]">
      <div className="bg-[#FFFC00] px-6 pt-12 pb-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-black">
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <h1 className="text-3xl font-bold text-black">Edit Profile</h1>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-t-3xl -mt-2 px-6 py-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-white">
            <div className="w-16 h-16 bg-white rounded-full mb-4"></div>
          </div>
          <button className="mt-4 text-black text-xl font-medium">
            Change Picture
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-2xl font-bold mb-2 text-black">
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
            <label className="block text-2xl font-bold mb-2 text-black">
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

          <div>
            <label htmlFor="placeOfBirth" className="block text-2xl font-bold mb-2 text-black">
              Place of Birth
            </label>
            <Input
              id="placeOfBirth"
              value={placeOfBirth}
              onChange={(e) => setPlaceOfBirth(e.target.value)}
              className="h-16 text-xl px-5 rounded-xl border border-gray-300"
            />
          </div>

          <Button 
            onClick={handleSave}
            className="w-full h-16 text-2xl font-bold bg-appYellow hover:bg-appYellow/90 text-black rounded-xl mt-8"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
