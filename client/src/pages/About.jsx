
function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="max-w-3xl mx-auto py-20 px-6">
        <h1 className="text-4xl font-bold mb-6 text-blue-900">About Our Telehealth Platform</h1>

        <p className="text-lg text-gray-700 mb-4">
          <span className="font-semibold">Telehealth</span> is an innovative platform designed to make healthcare accessible to everyone,
          regardless of location. Our mission is to provide seamless, secure, and compassionate care through modern technology.
        </p>

        <p className="text-lg text-gray-700 mb-4">
          Whether you're in a remote area or simply looking for quick access to quality consultation, our system connects patients with certified doctors through real-time video calls, secure messaging, and encrypted health data storage.
        </p>

        <p className="text-lg text-gray-700 mb-4">
          Our platform includes:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li>Instant video consultations powered by Daily.co</li>
          <li>Secure payment integration with Square</li>
          <li>Real-time transcription using Deepgram or Whisper</li>
          <li>Role-based dashboards for patients and doctors</li>
          <li>Encrypted storage of PHI (Protected Health Information)</li>
        </ul>

        <p className="text-lg text-gray-700">
          We’re committed to building a healthier, more connected future — one consultation at a time.
        </p>
      </div>
    </div>
  );
}

export default About;
