import Navbar from '../components/Navbar'
import img from '../assets/header_back2.jpg'
import homeImg from '../assets/home1.png'
function Home() {
  return (
    <div className='bg-cover bg-center h-screen ' style={{backgroundImage: `url(${img})`}}>

      <Navbar />
       <div className="flex h-[100vh]">
        {/* Left Side - Text */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="text-left">
            <h2 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">
              Healing Hands & Caring Hearts
            </h2>
            <p className="text-xl text-white drop-shadow-md mb-2">
              Connecting patients and doctors, no matter the distance
            </p>
            <p className="text-lg text-white drop-shadow-md">
              we are dedicated to your wellbeing & committed to your care.
            </p>
          </div>
        </div>
        {/* Right Side - Image */}
        <div className="w-1/2 flex items-center justify-center">
          <img
            src={homeImg}
            alt="Home"
            className="max-w-[500px] w-full h-auto rounded-xl  object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default Home
