import Navbar from '../components/Navbar'
import img from '../assets/header_back2.jpg'
import homeImg from '../assets/home.png'
import { useState, useEffect } from 'react'

function Typewriter({ text, speed = 80, pause = 1000 }) {
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    let i = typing ? 0 : text.length
    let interval

    if (typing) {
      interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1))
        i++
        if (i > text.length) {
          clearInterval(interval)
          setTimeout(() => setTyping(false), pause)
        }
      }, speed)
    } else {
      interval = setInterval(() => {
        setDisplayed(text.slice(0, i - 1))
        i--
        if (i < 0) {
          clearInterval(interval)
          setTimeout(() => setTyping(true), pause)
        }
      }, speed)
    }
    return () => clearInterval(interval)
  }, [text, speed, typing, pause])

  return <span>{displayed}</span>
}

function Home() {
  return (
    <div className='bg-cover bg-center h-screen' style={{ backgroundImage: `url(${img})` }}>
      <Navbar />
      <div className="flex h-[100vh]">
        {/* Left Side - Text */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">
              <Typewriter text="Healing Hands & Caring Hearts" speed={80} pause={1200} />
            </h1>
            <p className="text-xl text-white drop-shadow-md mb-2">
              Connecting patients and doctors, no matter the distance
            </p>
            <p className="text-lg text-white drop-shadow-md">
              we are dedicated to your wellbeing & committed to your care...
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