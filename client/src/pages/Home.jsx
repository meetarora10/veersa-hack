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
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">Welcome to Veersa</h1>
            <p className="text-xl text-white drop-shadow-md">
              Empowering your journey with innovative solutions.
            </p>
          </div>
        </div>
        {/* Right Side - Image */}
        <div className="w-1/2 flex items-center justify-center">
          <img
            src={homeImg}
            alt="Home"
            className="max-w-[400px] w-full h-auto rounded-xl shadow-2xl object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default Home
