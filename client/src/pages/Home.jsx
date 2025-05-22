import Navbar from '../components/Navbar'
import img from '../assets/header_back2.jpg'
import homeSvg from '../assets/home.png' 

import { useState, useEffect } from 'react';

const dynamicTexts = [
  "Welcome to Veersa Health!",
  "Your health, our priority.",
  "Book appointments with top doctors.",
  "Get instant medical advice online."
];

function Home() {
  const [currentText, setCurrentText] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % dynamicTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className='bg-cover bg-center min-h-screen'
      style={{ backgroundImage: `url(${img})` }}
    >
      <Navbar />
      <div className="flex flex-col md:flex-row items-center justify-between px-8 md:px-24 py-16 min-h-[80vh]">
        {/* Left: Dynamic Text */}
        <div className="w-full md:w-1/2 flex flex-col items-start justify-center mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 transition-all duration-500">
            {dynamicTexts[currentText]}
          </h1>
          <p className="text-lg text-white/80">
            Empowering you with seamless healthcare solutions.
          </p>
        </div>
        {/* Right: SVG/PNG Image */}
        <div className="w-full md:w-1/2 min-h[100vh] flex justify-center">
          <img
            src={homeSvg}
            alt="Home Illustration"
            className="max-w-xs md:max-w-md lg:max-w-lg w-full h-auto drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  )
}

export default Home