import { FiBell, FiSettings } from "react-icons/fi";

function PatientTopbar({ userProfile }) {
    console.log(userProfile);
  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-4">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
            alt="User avatar"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">{userProfile}</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full relative">
            <FiBell size={20} />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FiSettings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default PatientTopbar;