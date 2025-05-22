import Navbar from '../components/Navbar'

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-white to-blue-50">
      <Navbar />
      <div className="max-w-3xl mx-auto py-20 px-6 rounded-2xl shadow-xl bg-white/80 mt-12">
        <h1 className="text-5xl font-extrabold mb-8 text-blue-900 text-center drop-shadow-lg">
          About Our Telehealth Platform
        </h1>

        <p className="text-lg text-gray-700 mb-6 text-center">
          <span className="font-semibold text-blue-700">Telehealth</span> is an innovative platform designed to make healthcare accessible to everyone,
          regardless of location. Our mission is to provide seamless, secure, and compassionate care through modern technology.
        </p>

        <p className="text-lg text-gray-700 mb-6 text-center">
          Whether you're in a remote area or simply looking for quick access to quality consultation, our system connects patients with certified doctors through real-time video calls, secure messaging, and encrypted health data storage.
        </p>

        <div className="mb-8">
          <p className="text-lg text-blue-800 font-semibold mb-3 text-center">
            Our platform includes:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mx-auto max-w-md">
            <li>
              <span className="font-medium text-blue-700">Instant video consultations</span> powered by Daily.co
            </li>
            <li>
              <span className="font-medium text-blue-700">Secure payment integration</span> with Square
            </li>
            <li>
              <span className="font-medium text-blue-700">Real-time transcription</span> using Deepgram or Whisper
            </li>
            <li>
              <span className="font-medium text-blue-700">Role-based dashboards</span> for patients and doctors
            </li>
            <li>
              <span className="font-medium text-blue-700">Encrypted storage</span> of PHI (Protected Health Information)
            </li>
          </ul>
        </div>

        <p className="text-lg text-gray-800 text-center italic">
          We’re committed to building a healthier, more connected future — one consultation at a time.
        </p>
      </div>
    </div>
  );
}

export default About;