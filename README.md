# Smart AI Articles

AI-powered article editor and publishing platform built for creators who want faster, smarter content.

This full-stack web application helps users generate, enhance, and manage articles with AI-backed writing guidance, templates, analytics, and secure account-based storage.

## Why I Built This

Creating good content takes time and repeated editing. I built this app to help writers land on stronger articles faster by combining AI-driven enhancement with a simple editor, versioning, and performance scoring.

## ✨ Features

- **User authentication** with secure JWT login and registration
- **Article CRUD**: create, edit, delete, and view articles stored per user
- **AI enhancement**: improve article content using OpenAI or local Ollama fallback
- **Async processing**: BullMQ + Redis queue for background article enhancement
- **Status tracking**: pending, processing, completed, and failed article states
- **Templates** for blogs, LinkedIn posts, emails, and custom content
- **Personalization**: choose writing style (`formal` or `casual`) and tone (`professional`, `friendly`, or `enthusiastic`)
- **Regeneration**: regenerate articles to get improved rewrites and maintain version history
- **Export**: download enhanced content in JSON or TXT formats
- **Analytics dashboard**: readability, engagement, and SEO scoring across your articles
- **Search, pagination & filters**: find articles by title/content and filter by status
- **Rate limiting**: protection around AI enhancement and write endpoints
- **Caching**: temporary AI response caching for faster repeated enhancements

## 🧱 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **AI Integration**: OpenAI API with Ollama local fallback
- **Queue**: BullMQ + Redis for background worker processing
- **Authentication**: bcrypt + JSON Web Tokens
- **Utilities**: helmet, cors, express-rate-limit, morgan

## ✅ What’s Implemented

- `backend/server.js` with CORS, security headers, logging, and health check
- `backend/routes/auth.js` and `backend/controllers/authController.js` for register/login
- `backend/routes/articles.js` and `backend/controllers/articlesController.js` for full article workflow
- `backend/services/aiService.js` for prompt building, AI calls, analytics scoring, and suggestions
- `backend/workers/articleWorker.js` to process enhancement jobs from Redis
- `backend/models/Article.js` with templates, personalization, analytics, versions, and status tracking
- `frontend/src/App.jsx` for article editor, templates, pagination, search, dashboard, export, and auth handling
- `frontend/src/contexts/AuthContext.jsx` for token management and protected API calls

## 🚀 Local Setup

1. Clone the repo:
```bash
git clone https://github.com/yourusername/smart-ai-articles.git
cd Smart-AI-Articles
```

2. Install dependencies:
```bash
cd backend
npm install
cd ..
cd frontend
npm install
```

3. Create `backend/.env` with:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/smart-ai-articles
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=mistral
FRONTEND_URL=http://localhost:5173
```

4. Start Redis for BullMQ queue processing (recommended):
```bash
redis-server
```

5. Start the backend:
```bash
cd backend
npm run dev
```

6. Start the worker in a separate terminal:
```bash
cd backend
npm run worker
```

7. Start the frontend:
```bash
cd frontend
npm run dev
```

8. Open the app at `http://localhost:5173`

## 🔧 Notes

- If `OPENAI_API_KEY` is not configured, the app falls back to Ollama local model calls.
- Article enhancement requests are rate limited to prevent overuse.
- The worker will mark jobs as failed if AI processing fails after retries.
- Exported articles include enhanced content, selected template, style, tone, and analytics metadata.

## 📚 What I Learned

- Building a full-stack AI workflow with async background jobs
- Integrating OpenAI/Ollama and parsing model responses safely
- Designing per-user article storage with versioning and analytics
- Adding UX features like templates, search, filters, and export
- Using Express middleware for auth, validation, rate limiting, and CORS

## 🔮 Future Improvements

- **Multi-User Collaboration**: Team workspaces with shared article access, permission levels, and reviewer comments.
- **Advanced Version History**: Detailed snapshots for each enhancement, allowing users to compare and revert to previous AI versions.
- **Rich Text (WYSIWYG) Editor**: Integration of TipTap or Quill.js for advanced formatting (bold, links, headers) within the workspace.
- **Social Media Integration**: One-click publishing and cross-posting directly to LinkedIn, Medium, and WordPress.
- **SEO Keyword Tracking**: Real-time keyword density analysis and content optimization recommendations.
- **PDF Export**: Download professional, pre-formatted PDF copies of enhanced articles for offline use.
- **Queue Monitoring Dashboard**: A dedicated UI for tracking background AI jobs and managing retries.

## License

This project is licensed under the ISC License.
