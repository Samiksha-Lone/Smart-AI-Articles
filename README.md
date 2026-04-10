Original implementation by Samiksha Lone

# Smart AI Articles

AI-powered content editing and publishing platform for faster article creation and improved quality.

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **GitHub Repository**: [https://github.com/Samiksha-Lone/Smart-AI-Articles](https://github.com/Samiksha-Lone/Smart-AI-Articles)

## Problem Statement

Content creators need a faster way to edit, rewrite, and optimize articles while keeping tone consistent and managing versions.

## Problem–Solution Mapping

Smart AI Articles uses AI-powered enhancement, templates, analytics, and background processing to improve content quality, maintain style, and scale article creation.

## System Architecture

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Auth: JWT and bcrypt
- Queue: Redis + BullMQ
- AI: OpenAI with Ollama fallback

## Features

- User authentication and article CRUD
- AI-enhanced content editing
- Blog, LinkedIn, email, and custom templates
- Version history with regeneration
- Readability, engagement, and SEO analytics
- Export as JSON or TXT
- Background queue processing with status tracking
- Search, filtering, and caching

## Tech Stack

- React 19, Vite, Tailwind CSS, Axios
- Node.js, Express, MongoDB, Mongoose
- Redis, BullMQ
- OpenAI, Ollama
- bcrypt, JSON Web Tokens

## Installation / Setup

1. Clone repository
   ```bash
   git clone https://github.com/Samiksha-Lone/Smart-AI-Articles.git
   cd Smart-AI-Articles
   ```
2. Install dependencies
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```
3. Configure environment
   - Copy `backend/.env.example` to `backend/.env`
   - Add MongoDB URI, JWT secret, OpenAI key, and Redis settings
4. Start Redis
   ```bash
   redis-server
   ```
5. Run services
   ```bash
   # Backend
   cd backend
   npm run dev

   # Worker
   npm run worker

   # Frontend
   cd ../frontend
   npm run dev
   ```

## Screenshots

![Home Screen](outputs/home.webp)

![Dashboard](outputs/dashboard.webp)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credit

If you use or build upon this project, please provide attribution:
Samiksha Lone
https://github.com/Samiksha-Lone

## 🎯 Key Learnings

- Built a full-stack application with asynchronous AI processing and queue management
- Implemented dual AI provider integration with fallback mechanisms for reliability
- Designed comprehensive content analytics system with multiple scoring metrics
- Created template-based content generation with customizable parameters
- Developed version control system for iterative content improvements
- Integrated content scraping and processing pipeline
- Implemented secure authentication and authorization patterns
- Built responsive frontend with modern React and Tailwind CSS
- Managed complex data relationships and schema design with MongoDB
- Optimized performance with caching and rate limiting strategies

## 🚀 Future Improvements

- Add more content templates (social media posts, newsletters, technical articles)
- Implement collaborative editing features for team content creation
- Enhance analytics with more detailed SEO recommendations and competitor analysis
- Add content scheduling and publishing integration with platforms like Medium/LinkedIn
- Implement advanced AI features like content summarization and translation
- Add user feedback system for continuous content improvement
- Integrate with more AI providers and local models for broader compatibility
- Build admin dashboard for content moderation and user management
- Add real-time collaboration features with WebSocket integration

## 📬 Contact

**Samiksha Balaji Lone**  
📧 samikshalone2@gmail.com  
🔗 [LinkedIn](https://linkedin.com/in/samiksha-lone) | [Portfolio](https://samiksha-lone.vercel.app/)