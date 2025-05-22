import Navbar from '../components/Navbar';

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4">About Our Telehealth Platform</h1>
          <p className="text-lg text-gray-600">
            We combine technology and care to deliver fast, secure, and remote healthcare solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">🌍 Our Mission</h2>
            <p className="text-gray-700">
              Veersa Telehealth is committed to making healthcare accessible to everyone. 
              Our platform bridges the gap between doctors and patients, ensuring quality consultation from anywhere.
            </p>
          </div>

          {/* Features Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">⚙️ Key Features</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Instant video consultations with doctors</li>
              <li>Secure payments via Square API</li>
              <li>Encrypted PHI storage and access control</li>
              <li>Real-time transcription using Deepgram or Whisper</li>
              <li>Role-based dashboards for patients & doctors</li>
            </ul>
          </div>

          {/* Technology Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">🛠️ Technology Stack</h2>
            <p className="text-gray-700">
              This platform is powered by React, Tailwind CSS, Flask, SQL, and secure APIs like Daily.co, Square, and Deepgram.
              We prioritize both performance and security in everything we build.
            </p>
          </div>

          {/* Commitment Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">💙 Our Commitment</h2>
            <p className="text-gray-700">
              Your privacy and health are our top priorities. We ensure that all data is securely stored and every consultation is handled with care and confidentiality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
