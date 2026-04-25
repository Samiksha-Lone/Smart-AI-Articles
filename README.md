# Smart AI Articles — AI-Powered Content Creation Platform

> A full-stack MERN application designed to streamline article creation, editing, and optimization through advanced AI models.

## 🔗 Links
- **Live Demo**: [https://beyondchats-frontend-beta.vercel.app/](https://beyondchats-frontend-beta.vercel.app/)
- **GitHub Repository**: [https://github.com/Samiksha-Lone/Smart-AI-Articles](https://github.com/Samiksha-Lone/Smart-AI-Articles)

## Overview

Smart AI Articles is a centralized platform for content creators and writers. It leverages the power of Large Language Models (LLMs) to help users generate, refine, and analyze content across various formats like blogs, social media, and professional emails.

## Problem Statement

- **Content Bottlenecks**: Writers often struggle with "writer's block" or spend excessive time on initial drafts.
- **Inconsistent Quality**: Maintaining a consistent tone and optimizing for SEO/readability across multiple pieces is challenging.
- **Synchronous Delays**: Generating high-quality AI content can be slow, blocking the user interface during processing.

## Solution

Smart AI Articles solves these challenges by providing an AI-enhanced editor with pre-built templates and real-time analytics. It uses Google Gemini to intelligently enhance content and provide actionable quality insights.

## Key Features

- 🔐 **Secure Authentication** — JWT-based user registration and login with encrypted passwords.
- ✍️ **AI-Powered Editor** — Dynamic content enhancement, rewriting, and style adjustment using Google Gemini.
- 📋 **Template Library** — Specialized templates for Blog posts, LinkedIn updates, Professional Emails, and Custom formats.
- 📊 **Content Analytics** — Deep insights into readability, engagement levels, and SEO optimization.
- 📂 **Version Control** — Track content history with the ability to regenerate and compare versions.
- 📤 **Export Options** — One-click export of articles to JSON or TXT formats for easy publishing.
- 📱 **Modern Responsive UI** — A premium, high-performance interface built with React 19 and Tailwind CSS 4.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS 4, React Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose) |
| **AI Models** | Google Gemini (production), Ollama (local dev) |
| **Auth & Security** | JWT, bcrypt, Helmet.js, express-rate-limit |
| **Deployment** | Vercel (frontend) |

## Architecture / Flow

```text
User → React Frontend → Axios → Express API → MongoDB
                                      ↓
                           Google Gemini / Ollama
```

## My Contribution

**I independently designed and built this entire project from scratch**, including:

- 🖥️ **Frontend** — Developing the responsive UI, state management, and real-time analytics dashboard.
- ⚙️ **Backend** — Architecting the RESTful API, implementing secure authentication, and managing MongoDB schemas.
- 🤖 **AI Integration** — Designing a multi-provider AI system (Gemini + Ollama) with automatic fallback and structured error handling.
- 🚀 **Deployment** — Configuring environment variables and managing the production deployment on Vercel.

## Setup

### Prerequisites
Node.js 18+, npm, MongoDB Atlas account, Gemini API key.

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<your-cluster>
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
OLLAMA_BASE_URL=http://localhost:11434
```

```bash
npm run dev   # http://localhost:3000
```

### 2. Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

```bash
npm run dev   # http://localhost:5173
```

## Screenshots

### Home Page
![Home Page](outputs/home.webp)

### Content Dashboard
![Dashboard](outputs/dashboard.webp)

## Future Improvements

- [ ] Collaborative editing features for real-time team content creation.
- [ ] Integration with Medium and LinkedIn APIs for direct one-click publishing.
- [ ] Advanced SEO recommendation engine with competitor keyword analysis.
- [ ] Multi-language support for content translation and localization.

## License

MIT License — see [LICENSE](LICENSE) for details.

## Credits

**Developed by [Samiksha Lone](https://github.com/Samiksha-Lone)**