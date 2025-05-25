# 🩺 MediBridge – Telehealth from Anywhere

A digitally enabled telehealth platform that ensures **instant, secure, and affordable healthcare consultations**, especially for rural and remote regions.

---

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Hackathon](https://img.shields.io/badge/Hackathon-Veersa%202025-orange)
![Status](https://img.shields.io/badge/status-Prototype-green)


## 📌 Problem Statement

After the pandemic, access to quality healthcare from remote locations has become essential. The goal is to develop a telehealth solution that:

- Provides **instant consultation** similar to an in-person experience.
- Captures **patient details and specialty** before the consultation.
- Integrates **payment** before session begins.
- Ensures **privacy of PHI data** and securely stores it.
- Supports **chat and real-time transcription**.
- Overcomes **accent/dialect barriers** using speech-to-text.

---

## 🧠 Our Solution

MediBridge offers:

- 🧑‍⚕️ Instant doctor consultations via video
- 📄 Patient profile & medical history capture
- 🏥 Specialty selection for targeted care
- 💳 Razorpay integration for seamless payments
- 🔐 Secure login and PHI data handling
- 💬 Chatbox with real-time transcription support

---

## 🏗️ Tech Stack

| Area         | Tech Used                            |
|--------------|---------------------------------------|
| 💻 Frontend  | React.js                              |
| 🔙 Backend   | Node.js, Express.js                   |
| 💾 Database  | SQLITE                              |
| 💸 Payments  | Razorpay API                          |
| 🎙️ Transcription | Google Speech-to-Text / AssemblyAI |
| 🔐 Auth      | JWT, bcrypt, HTTPS                    |

---

## 🧾 Features Snapshot

- 🔐 User Authentication (JWT)
- 📋 Upload patient data and case description
- 🎯 Choose consultation specialty
- 💸 Online payment integration (Razorpay)
- 📞 Secure video consultation with transcription
- 💬 Chat functionality within the app
- 🗂️ Encrypted storage for future reference

---

## 📁 Folder Structure

veersa-hack/
│
├── client/ # React frontend
│ └── src/components # UI components (Auth, Booking, Payment)
│
├── server/ # Node.js backend
│ ├── models/ # SQLite schema
│ ├── routes/ # API routes
│ └── controllers/ # Route logic
│
├── model/ # ML models and chatbot (WIP)
├── model_chatbot_use.ipynb # Chatbot notebook demo
└── README.md # Project documentation


## 🔮 Future Scope
-📱 Mobile App Integration (Android/iOS)
-🧾 Govt. health record integration
-📶 Offline support with SMS fallback


