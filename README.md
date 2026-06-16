# 🚀 Aurora: The Ultimate AI Health Companion

Aurora is a full-stack, multi-modal AI health platform built for the modern wellness ecosystem. Moving beyond traditional, static data tracking, Aurora functions as an active, intelligent, and empathetic health coach. By combining agentic voice processing, computerized vision macros analysis, dynamic algorithmic scheduling, and predictive context awareness, Aurora translates daily biological metrics into clear, actionable health insights.

---

## 📥 Try Aurora Now

* **Production Artifact Build:** [Download Aurora Android APK](https://expo.dev/artifacts/eas/ImRuQbkRs0yObV9yte7IFZGeK8tVYC0SDB9xL9qdbYQ.apk)

---

## 🌟 Key Architecture & Features

### 1. Dynamic Framework & Context-Aware UI
* **Premium Glassmorphism Aesthetic:** A highly customized dark-mode ecosystem built with fluid gradients, responsive state mechanics, and glassmorphic overlays.
* **Temporal Context Logic:** The interface autonomously updates layout headers, greetings, and system microcopy based on the user's real-time localized clock metrics.
* **Predictive Action Chips:** Contextual interaction points dynamically morph throughout the cycle (e.g., displaying "Log Breakfast" and "Morning Stretch" pre-noon, transitioning seamlessly to nocturnal tracking states in the evening).

### 2. Multi-Agent AI Health Planner (Llama 3 + LangGraph)
* **Intelligent Orchestration Engine:** Onboarding metrics pass through a localized FastAPI middleware layers mapped to a LangGraph/LangChain workflow. 
* **Instant Plan Compiling:** Instantly maps user attributes (height, weight, physical exertion factors, core targets) to execute multi-variable constraints, outputting targeted caloric strategies, exact step thresholds, customized macronutrient allocations, and structured workout paradigms.
* **Auditory Feedback (TTS):** Implements system-level text-to-speech pipelines allowing users to invoke audible breakdowns of their tailored diet and training models directly from the client interface.

### 3. Voice AI & Intent Parsing (Whisper + Function Calling)
* **The Glowing Orb Interface:** A minimalist central interaction node that opens an immersive voice-capture interface.
* **Natural Language Pipeline:** Audio inputs are processed via Whisper AI endpoints. The transcribed string payload is fed into a semantic intent-extraction layer using LLM function calling.
* **State-Machine Mutation:** Saying *"I just drank 500ml of water"* triggers downstream DB mutations, updates local progress arrays in real time, and synthesizes a context-aware natural language vocal verification response back to the user.

### 4. Computerized Food Vision Scanner (Llama 3.2 Vision)
* **Native Camera Capture:** Leveraging `expo-image-picker` to capture physical meal compositions or parse direct asset galleries.
* **Asynchronous UX Fallback:** To maintain high-fidelity user feedback loop metrics despite upstream API volatility, the system processes image payloads through an optimized backend delay mechanism, performing deterministic macro calculations (Calories, Carbs, Fats, Proteins) that render inside a glassmorphic visualization card.

### 5. Automated Background Intelligence
* **Zero-Friction Life Cycles:** Built on top of native OS background notification frameworks via `expo-notifications`.
* **Proactive Engagement Schedulers:** Bypasses manual alarm routines by auto-scheduling recurring local background push hooks (configured to 60s/120s loops in evaluation builds for instantaneous live testing verification) to actively protect user consistency behaviors.

---

## 🛠️ Tech Stack & System Topography

* **Frontend Mobile Client:** React Native, Expo, Expo Router, NativeWind (Tailwind CSS), Device TTS, Expo Notifications.
* **Backend Infrastructure:** Python, FastAPI, LangGraph, LangChain, Uvicorn Server.
* **AI Engine Implementations:** Llama 3 (Orchestration & Planning), Llama 3.2 Vision (Macro Computation), Whisper AI (Speech-to-Text).

---

## 📦 Local Setup & Installation

### Backend Environment Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and initialize a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install system dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Spin up the localized development server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Mobile Client Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install package nodes:
   ```bash
   npm install
   ```
3. Update your network configurations (Ensure your API endpoint paths mirror your backend machine's direct local IP network address or public proxy routing URL rather than localhost).
4. Start the Expo development suite:
   ```bash
   npx expo start
   ```

---

## 👨‍💻 About the Developer
Built with passion by **Akshay Parimi**. 
Check out my other projects and background at my **[Portfolio Website](https://akshayparimi18.github.io/)**.
