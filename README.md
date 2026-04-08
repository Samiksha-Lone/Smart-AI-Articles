# Smart AI Articles

AI-powered article editor and publishing platform built for creators who want faster, smarter content.

## 🔗 Links

- 🚀 **Live Demo**: https://beyondchats-frontend-beta.vercel.app
- 💻 **GitHub Repository**: https://github.com/Samiksha-Lone/Smart-AI-Articles

## Problem Statement

Content creators and writers face significant challenges in producing high-quality articles efficiently:

- Manual content editing and rewriting is time-consuming and repetitive
- Maintaining consistent writing style, tone, and formatting across articles
- Optimizing content for readability, engagement, and SEO without specialized knowledge
- Managing multiple article versions and tracking improvements
- Scaling content production while ensuring quality and personalization
- Accessing AI-powered enhancement tools that are both powerful and user-friendly

This project addresses these challenges by providing an intelligent article enhancement platform that combines AI-driven content improvement with a simple, intuitive editor and comprehensive analytics.

## 🧩 Problem–Solution Mapping

| Problem | Solution in Smart AI Articles |
|--------|--------|
| Time-consuming manual editing | AI-powered content enhancement with OpenAI/Ollama integration |
| Inconsistent writing quality | Template-based formatting (blog, LinkedIn, email) with style/tone controls |
| Lack of content analytics | Built-in readability, engagement, and SEO scoring with detailed suggestions |
| Version management difficulties | Automatic version tracking with regeneration capabilities |
| Limited personalization | Customizable writing styles (formal/casual) and tones (professional/friendly/enthusiastic) |
| Scalability challenges | Asynchronous processing with Redis queue and background workers |

## What is implemented

Smart AI Articles delivers comprehensive content creation and enhancement capabilities:

- **User authentication system** with secure JWT-based login and registration
- **Article management** with full CRUD operations (create, read, update, delete) per user
- **AI content enhancement** using OpenAI API with local Ollama fallback for reliability
- **Asynchronous processing** with BullMQ + Redis queue for background article enhancement
- **Status tracking system** with pending, processing, completed, and failed states
- **Content templates** for blogs, LinkedIn posts, emails, and custom content types
- **Personalization options** with writing style (formal/casual) and tone (professional/friendly/enthusiastic) controls
- **Version history** with automatic tracking of content improvements and regenerations
- **Export functionality** supporting JSON and TXT formats for enhanced content
- **Analytics dashboard** with readability scores, engagement metrics, and SEO analysis
- **Advanced search and filtering** by title, content, and status with pagination
- **Rate limiting** to protect AI enhancement and write endpoints from abuse
- **Intelligent caching** for AI responses to improve performance on repeated enhancements
- **Content scraping** from blog sources with automatic article extraction and processing

## Solution Overview

The application provides a complete article enhancement workflow where users can:

- Create and manage articles with rich text editing and metadata
- Enhance content using AI models with customizable parameters
- Track enhancement progress through real-time status updates
- Analyze content quality with comprehensive scoring metrics
- Export polished content in multiple formats
- Maintain version history for iterative improvements

The platform ensures reliable, scalable content enhancement through queue-based processing, fallback AI providers, and intelligent caching mechanisms.

## ⭐ Project Highlights

- Asynchronous AI processing with Redis queue and background workers
- Dual AI provider support (OpenAI + Ollama) with automatic fallback
- Comprehensive content analytics with readability, engagement, and SEO scoring
- Template-based content formatting with style and tone customization
- Version control system for article iterations and improvements
- Real-time status tracking for long-running enhancement jobs
- Secure authentication with JWT and bcrypt password hashing
- Responsive React frontend with modern UI components
- RESTful API design with proper error handling and validation

## 🚀 Features

- 🔐 Secure user authentication with JWT tokens
- ✍️ Rich text article editor with metadata support
- 🤖 AI-powered content enhancement with multiple models
- 📊 Real-time analytics dashboard with scoring metrics
- 📝 Content templates (blog, LinkedIn, email, custom)
- 🎨 Customizable writing styles and tones
- 🔄 Article regeneration with version history
- 📤 Multiple export formats (JSON, TXT)
- 🔍 Advanced search and filtering capabilities
- 📈 Readability, engagement, and SEO analysis
- ⏱️ Asynchronous processing with status tracking
- 🗂️ Content scraping from blog sources
- 🛡️ Rate limiting and request protection
- 💾 Intelligent caching for performance optimization

## 📸 Screenshots

![Home Screen](outputs/home.webp)

![Dashboard](outputs/dashboard.webp)

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **AI Integration**: OpenAI API with Ollama local fallback
- **Queue System**: BullMQ + Redis for background processing
- **Authentication**: bcrypt + JSON Web Tokens
- **Scraping**: Cheerio for HTML parsing and content extraction
- **Security**: Helmet, CORS, Express Rate Limit
- **Logging**: Morgan for request logging

## ⚙️ Installation / Setup

1. **Clone the repository**
   ```bash
   git clone [Your GitHub Repository URL]
   cd smart-ai-articles
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   - Copy `backend/.env.example` to `backend/.env`
   - Add your MongoDB URI, JWT secret, OpenAI API key, and other required variables

4. **Start Redis server** (required for queue processing)
   ```bash
   # Install and start Redis if not already running
   redis-server
   ```

5. **Run the application**
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev

   # Worker process (Terminal 2) - for article enhancement
   npm run worker

   # Frontend (Terminal 3)
   cd frontend
   npm run dev
   ```

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