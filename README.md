# 🚀 AI Career Navigator

AI Career Navigator is an intelligent career guidance platform that uses Artifical Intelligence to analyze resumes, identify skill gaps, and generate personalized learning roadmaps,Prepare for Interviews.


## 🌟 Live Demo

- **Frontend (Vercel):** [https://ai-career-navigator.vercel.app](https://ai-career-navigator.vercel.app)
- **Backend (Render):** [https://ai-career-navigator.onrender.com](https://ai-career-navigator.onrender.com)

## ✨ Features

- **📄 Smart Resume Parsing:** Upload your PDF resume and let our AI extract your skills, experience, and education.
- **🔍 Skill Gap Analysis:** tailored analysis comparing your current skills against your target role (e.g., "Full Stack Developer", "Data Scientist").
- **roadmaps 🗺️ Personalized Roadmaps:** Get a week-by-week learning plan curated just for you to bridge your skill gaps.
- **🤖 AI Study Buddy:** A context-aware chatbot that answers your questions and guides you through your learning journey.
- **🎤 Interview Prep:** Practice interview questions specific to your target role and get instant feedback.

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 14](https://nextjs.org/) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **State Management:** React Hooks
- **Icons:** Lucide React

### Backend
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas)
- **AI Models:** 
  - [Cerebras](https://cerebras.ai/) (Llama 3.1-8b) - Super fast inference
  - [Google Gemini](https://deepmind.google/technologies/gemini/) - Fallback and complex reasoning

### DevOps
- **Hosting:** Vercel (Frontend), Render (Backend)
- **Version Control:** GitHub

## 🚀 Getting Started Locally

Follow these instructions to set up the project on your local machine.

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB Atlas Account

### 1. Clone the Repository
```bash
git clone https://github.com/StealthPanther/ai-career-navigator.git
cd ai-career-navigator
```

### 2. Backend Setup
```bash
cd backend
# Create virtual environment
python -m venv venv
# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory:
```env
MONGODB_URI=your_mongodb_connection_string
CEREBRAS_API_KEY=your_cerebras_key
GOOGLE_API_KEY=your_gemini_key
PORT=8000
```

Run the backend server:
```bash
uvicorn app.main:app --reload
```
The API will be available at `http://localhost:8000`.

### 3. Frontend Setup
Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run development server
npm run dev
```
The application will be available at `http://localhost:3000`.

## 📦 Deployment

### Backend (Render)
1. Creates a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Set **Root Directory** to `backend`.
4. Set **Build Command** to `pip install -r requirements.txt`.
5. Set **Start Command** to `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
6. Add Environment Variables (`MONGODB_URI`, `CEREBRAS_API_KEY`, etc.).

### Frontend (Vercel)
1. Import your GitHub repository to Vercel.
2. Set **Root Directory** to `frontend`.
3. Add Environment Variable: `NEXT_PUBLIC_API_URL` (Points to your Render backend URL).
4. Deploy!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
