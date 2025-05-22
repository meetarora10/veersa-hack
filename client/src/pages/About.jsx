import Navbar from '../components/Navbar'

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <Navbar />
      <div className="max-w-3xl mx-auto py-20 px-6">
        <h1 className="text-4xl font-bold mb-6 text-blue-900">About Us</h1>
        <p className="text-lg text-gray-700 mb-4">
          <span className="font-semibold">Veersa</span> is dedicated to connecting patients and doctors, no matter the distance. 
          Our mission is to make healthcare accessible, compassionate, and efficient for everyone.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          We believe in the power of technology to bridge gaps in healthcare, ensuring that every individual receives the care and attention they deserve.
        </p>
        <p className="text-lg text-gray-700">
          Our team is committed to your wellbeing and strives to provide innovative solutions for a healthier tomorrow.
        </p>
      </div>
    </div>
  )
}

export default About