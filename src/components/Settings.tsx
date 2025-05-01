import { Avatar } from '@/components/ui/avatar';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Yellow header */}
      <div className="bg-[#FFFC00] px-6 pt-12 pb-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-black">
            <ArrowLeft size={24} strokeWidth={2.5} />
          </Link>
          <h1 className="text-3xl font-bold text-black">Settings</h1>
        </div>
      </div>

      {/* White card content */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-2">
        {/* Profile section */}
        <div className="border-b border-gray-200">
          <div className="flex items-center px-6 py-4">
            <Avatar className="h-16 w-16 mr-4">
              <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                <span className="text-2xl text-gray-400">👤</span>
              </div>
            </Avatar>
            <div className="text-xl font-medium">Vedant Jha</div>
          </div>
        </div>

        {/* Account Settings section */}
        <div className="pt-4 px-6">
          <h2 className="text-xl text-gray-400 mb-4">Account Settings</h2>

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

      {/* iPhone-style bottom indicator */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-2 bg-white">
        <div className="w-32 h-1 rounded-full bg-black opacity-20"></div>
      </div>
    </div>
  );
};

export default SettingsPage;
