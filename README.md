# PlaceUp 🚀
[LIVE](https://place-up-tau.vercel.app/)

**Your AI Placement Co-Pilot**

PlaceUp is a personalized, AI-driven placement preparation platform tailored for Indian B.Tech students. Instead of getting overwhelmed by generic roadmaps, PlaceUp uses artificial intelligence to craft a custom daily study plan based on your target companies, weak areas, and available time.

## ✨ Key Features

- **🧠 AI Smart Plan:** Powered by the cutting-edge Groq API (Llama-3.3-70B), PlaceUp generates a personalized week-by-week study schedule focusing on DSA, Aptitude, Web Dev, Communication, and Resume building.
- **📅 Daily Stack:** Breaks down overwhelming syllabuses into bite-sized daily tasks so you know exactly what to study each day.
- **🔄 AI Rescheduling:** Missed a day? No problem. The AI can intelligently redistribute your missed tasks across the upcoming days without overloading your schedule.
- **📊 Progress Analytics:** Visualizes your study distribution with interactive pie charts (powered by Recharts) to show which skills you are leveling up the fastest.
- **🎮 Gamification & Streaks:** Stay motivated with daily streaks, unlockable profile badges, and satisfying confetti animations when you crush your daily goals.
- **📱 Premium UI:** Built with modern glassmorphism aesthetics, fluid 3D tilt hover effects, and a responsive design.

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite
- **Routing:** React Router DOM
- **Styling:** Vanilla CSS (Glassmorphism, CSS Variables, Flexbox/Grid)
- **AI Integration:** Groq API (`llama-3.3-70b-versatile`)
- **Data Visualization:** Recharts
- **Icons & UI:** Lucide React, Canvas Confetti
- **State Management:** React Context API & `localStorage`

## 🚀 How to Run Locally

1. **Clone the repository** (or download the source code).
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Set up your API Key:**
   - The application relies on the Groq API for generating plans.
   - The API key is currently configured inside `src/services/gemini.js`.
4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
5. **Open your browser** and navigate to `http://localhost:5173`.

## 💡 How It Works

1. **Onboarding:** Input your name, target companies (e.g., FAANG, TCS), placement date, and select your weak areas.
2. **AI Generation:** The AI builds a highly targeted plan to bridge your skill gaps before your placement date.
3. **Execution:** Log in to your Dashboard every day, follow the "Today's Stack", check off tasks, and build your consistency streak!

---
*Made with ❤️ for every B.Tech student striving for their dream job.*
.....