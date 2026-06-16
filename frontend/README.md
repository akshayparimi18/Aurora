<div align="center">
  
  # 🌅 Aurora
  ### Your Multi-modal AI Health & Wellness Companion
  
  [![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)](#)
  [![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](#)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](#)
  [![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)](#)

  **[📥 DOWNLOAD LATEST APK FOR ANDROID (CLICK HERE)](https://expo.dev/artifacts/eas/ImRuQbkRs0yObV9yte7IFZGeK8tVYC0SDB9xL9qdbYQ.apk)**

</div>

---

## 🌟 The Problem
In a world saturated with health trackers, users are left with highly fragmented data—knowing *what* they did, but not *why* it matters or *how* to improve. Traditional trackers provide charts and numbers, but offer **zero actionable, personalized insights.**

## 💡 The Aurora Solution
**Aurora bridges the gap between tracking data and taking meaningful action.** 
Aurora is a beautifully designed health application that acts as a proactive wellness companion. Instead of just logging sleep, hydration, and workouts, Aurora uses advanced Generative AI to understand the context of your lifestyle and deliver deeply personalized, actionable feedback through an intelligent chat interface.

---

## ✨ Core Features

- **📊 Unified Health Dashboard**  
  A clean, edge-to-edge interface to track sleep cycles, hydration targets, and workout routines effortlessly.
  
- **🤖 Multi-modal AI Health Assistant**  
  Chat directly with Aurora! Ask complex, contextual questions like *"How can I improve my sleep based on my heavy workout today?"* and receive intelligent, personalized guidance instantly.

- **🎨 Premium UX/UI Design**  
  Built to feel like a top-tier production app, featuring smooth micro-animations, glassmorphism elements, and stunning onboarding carousels.

- **🔒 Secure & Real-time Synchronization**  
  Powered by Supabase for lightning-fast, secure authentication and real-time database syncing across devices.

---

## 🛠️ Technical Architecture

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Mobile** | React Native & Expo | Delivers a blazing-fast, truly native mobile experience across Android. |
| **Backend & AI** | Python (FastAPI) | A robust backend service that integrates Google Gemini to process complex health queries and multimodal context. |
| **Database & Auth** | Supabase | Handles scalable, relational data storage and secure user authentication seamlessly. |
| **Build Pipeline** | Expo Application Services (EAS) | Automated cloud builds for continuous delivery of production-ready APKs. |

---

## 🚧 Challenges We Overcame
- **Real-time AI Latency:** Architecting a high-speed bridge between the React Native frontend and the Python Generative AI backend to ensure chat responses felt conversational and instantaneous.
- **Native Android Build Constraints:** We successfully tackled complex native module conflicts (`expo-font`) and implemented strict polyfill environments (`react-native-url-polyfill`) necessary to ensure our Supabase integration remained stable in production Android environments.

---

## 🚀 Future Roadmap
1. **Wearable Integration:** Direct integration with Apple HealthKit and Google Fit APIs to pull biometric data automatically, removing all friction from data logging.
2. **Predictive Analytics:** Using historical data to warn users of potential burnout, dehydration, or sleep debt *before* it happens.

---

## 💻 How to Run Locally

**1. Clone the repository:**
```bash
git clone https://github.com/YOUR_USERNAME/aurora-mobile.git
cd aurora-mobile
```

**2. Install dependencies:**
```bash
npm install
```

**3. Run the development server:**
```bash
npx expo start
```
*Note: Make sure your backend Python server is running simultaneously to access the AI chat features.*
