import { FaGithub, FaDiscord, FaEnvelope, FaUserMd } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#0e0e12] text-gray-200 pt-10 pb-6 px-6 sm:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-red-500 text-3xl">❤️</span>
            <h2 className="text-2xl font-bold">
              <span className="italic text-indigo-300">Tea</span>
              <span className="text-blue-400 font-bold">lth</span>
            </h2>
          </div>
          <p className="text-sm text-gray-400">
            Bringing healthcare to your fingertips with real-time access to doctors, secure data, and smart features.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Shop & More</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:underline cursor-pointer"> Buy Medicines</li>
            <li className="hover:underline cursor-pointer"> Disease Prediction</li>
            <li className="hover:underline cursor-pointer"> Book an Appointment</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Ours</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:underline cursor-pointer"> About Us</li>
            <li className="hover:underline cursor-pointer"> Contact Us</li>
            <li className="hover:underline cursor-pointer"> Rate Us</li>
            <li className="hover:underline cursor-pointer"> Privacy Policies</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
        <p>© 2025 Tealth. All rights reserved.</p>
        
        {/* Social Icons */}
        <div className="flex gap-5 mt-4 md:mt-0 text-white">
          <a href="#" className="hover:text-blue-500">
            <FaGithub size={20} />
          </a>
          <a href="#" className="hover:text-indigo-400">
            <FaDiscord size={20} />
          </a>
          <a href="#" className="hover:text-yellow-400">
            <FaEnvelope size={20} />
          </a>
          <a href="#" className="hover:text-green-400">
            <FaUserMd size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
