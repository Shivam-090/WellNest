# 🌸 WellNest AI — Holistic Mental Wellness & Psychological Companion

> **Empathetic, privacy-first mental wellness platform powered by local psychological AI (`maxwell1500/psycho:12b`).**

---

## 🌟 Overview

**WellNest AI** is a modern student and personal wellness companion designed to support emotional balance, reduce academic anxiety, guide CBT mindfulness routines, and track holistic growth. 

Powered by a specialized local clinical intelligence model running on **Ollama**, WellNest delivers clinical insights, personalized affirmations, and adaptive recovery routines with zero cloud data leaks.

---

## ✨ Key Features

### 🧠 1. Local AI Intelligence Engine (`maxwell1500/psycho:12b`)
* **Empathetic Companion Chat**:
  * Multi-turn therapeutic conversations with personalized name address and CBT grounding (4-4-4 Box Breathing, 5-4-3-2-1 Sensory grounding, cognitive defusion).
  * Rate-locked message delivery to prevent accidental spam while the AI reflects.
  * Structured markdown rendering with highlighted steps and copy support.
* **20-Dimension Psychometric Evaluator**:
  * Evaluates multi-factor indicators across Physical, Mental, Environmental, Academic, and Social wellbeing.
  * Generates clinical stress classifications (`Low`, `Moderate`, `High`), exact stress percentages (`0%–100%`), deep psychological intersection insights, status badges, and tailored CBT action plans.

---

### 🌿 2. Holistic Check-In Assessment
* Interactive multi-step slider assessment evaluating 20 vital indicators (Anxiety, Sleep Quality, Study Load, Social Support, Self-Esteem, Somatic Tension, etc.).
* Dynamic **StressMeter** gauge with smooth eased animations, visible across both light and dark themes.
* Fullscreen reflection overlay with live diagnostics while the local model analyzes the data.

---

### 📅 3. Smart Daily Tasks & Relief Routines
* **Once-Per-Day Rule**: Completing a daily task records the exact calendar date and awards +25 XP.
* **Automatic Midnight Reset**: When opening the app on a new day (Day 2), previously completed tasks automatically reset to uncompleted so you can complete them again.
* **Mid-Day Task Additions**: Add custom routines at any time; newly created tasks start uncompleted and can be submitted independently.

---

### 🌱 4. Path to Bloom & XP Gamification
* **Streak-Based Milestone Progression**:
  * **Day 1**: 🌱 *The Seedling* (Starter)
  * **Day 3**: 🌿 *The Sprout* (3-day streak)
  * **Day 7**: 🌸 *The Blossom* (1-week streak)
  * **Day 14**: 🌻 *The Sunflower* (2-week streak)
  * **Day 21**: 🍃 *The Forest* (3-week streak)
  * **Day 30**: 🌳 *The Mighty Tree* (Champion)
* **XP Progress & Matrix Breakdown**:
  * Real-time XP tracking, dynamic level calculations, and interactive tier tables showing XP needed to reach next levels.

---

### 🎨 5. Adaptive Aesthetic Theme Engine
* 6 Curated Themes with smooth transitions and high contrast:
  * 🌸 **Pastel Meadow** (Crisp Light Theme)
  * 🌺 **Cherry Blossom** (Dark Berry & Rose)
  * 🌊 **Ocean Twilight** (Deep Midnight Cyan)
  * 🌲 **Enchanted Forest** (Emerald & Sage)
  * 🌅 **Sunset Glow** (Amber & Warm Earth)
  * 🌌 **Cosmic Aurora** (Starlit Indigo & Violet)
* Interactive falling Sakura Petal Canvas physics.

---

### 🔒 6. Security & Session Integrity
* JWT Authentication with password hashing via bcrypt.
* Global Axios 401 Interception: Displays a graceful **Session Expired Overlay** with a 5-second countdown redirect to `/login`.
* Clean session logout that purges local tokens and refreshes browser memory.

---

## 🛠️ Architecture & Tech Stack

```
Mental Wellness/
├── backend/                  # Node.js & Express API Server
│   ├── config/               # MongoDB Database Connection
│   ├── controllers/          # Business Logic (Auth, Chat, CheckIn, Task, Journey)
│   ├── middleware/           # JWT Protection & Error Handlers
│   ├── models/               # Mongoose Models (User, ChatSession, ChatMessage, DailyTask, CheckIn)
│   ├── routes/               # Express REST Routes (/api/auth, /api/chat, /api/checkins, /api/tasks)
│   ├── services/
│   │   └── ollama/           # Modular Local Ollama Integration
│   │       ├── ollamaConnection.js      # Base Client, Diagnostics & Health Check
│   │       ├── ollamaChatService.js     # Conversational Intelligence
│   │       └── ollamaCheckInService.js  # 20-Dimension Clinical Assessment Evaluator
│   └── server.js             # Entry Point
│
├── frontend/                 # React 19 + Vite Web Application
│   ├── src/
│   │   ├── components/       # UI Components (chat, checkIn, journey, home, common)
│   │   ├── contexts/         # React Contexts (AuthContext, WellnessContext, ThemeContext, ChatContext)
│   │   ├── data/             # Static Assessment & Level Data
│   │   ├── pages/            # View Pages (Auth, Home, CheckIn, Chat, Journey, Activities)
│   │   └── services/         # Modular API Layer
│   │       ├── api.js        # Core Axios Instance, Interceptors & Token Storage
│   │       ├── profileAPI.js # Profile & Auth Endpoints
│   │       ├── checkInAPI.js # Assessment & Ollama Report Endpoints
│   │       ├── chatAPI.js    # Chat Sessions & Messages Endpoints
│   │       ├── tasksAPI.js   # Daily Routine CRUD Endpoints
│   │       └── journeyAPI.js # Gamification & XP Endpoints
│   └── index.css             # Design Tokens & Theme Utility Bindings
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [MongoDB](https://www.mongodb.com/) (Local or MongoDB Atlas)
* [Ollama](https://ollama.com/) installed and running locally

---

### 1. Pull the Ollama AI Model
Ensure Ollama is running, then pull the clinical model:
```bash
ollama run maxwell1500/psycho:12b
```

---

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/wellnest?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here
   OLLAMA_BASE_URL=http://127.0.0.1:11434
   OLLAMA_MODEL=maxwell1500/psycho:12b
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

---

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Configure `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:5173`.

---

## 🧪 Testing Credentials

You can use the default pre-seeded test account:
* **Email**: `hero@wellnest.ai`
* **Password**: `demo123`

*(Or register a new account on `/signup`)*

---

## 📄 License
This project is open-source and built for mental health advocacy and educational wellness support.
