# BeyondChats Assignment

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.0+-blue.svg)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express-4.19-orange.svg)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646cff.svg)](https://vitejs.dev/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991.svg)](https://openai.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#license)
[![Status](https://img.shields.io/badge/Status-Complete-brightgreen.svg)](#-assignment-phases-complete)

## Live Demo

<p>
<a href="https://beyondchats-frontend-lac.vercel.app/" title="Open Frontend Live">
  <img src="https://img.shields.io/badge/%F0%9F%8C%90%20Frontend-Live-brightgreen?style=for-the-badge" alt="Frontend Live" />
</a>
<a href="https://beyondchats-assignment-backend.onrender.com/api/articles" title="Open Backend API (Articles)">
  <img src="https://img.shields.io/badge/%F0%9F%93%8A%20API%20Data-13%20Articles-blue?style=for-the-badge" alt="API Data" />
</a>
<a href="https://github.com/Samiksha-Lone/beyondchats-assignment" title="View Source Repository">
  <img src="https://img.shields.io/badge/%F0%9F%93%82%20Source-Repo-6f42c1?style=for-the-badge" alt="Source Repo" />
</a>
</p>

A comprehensive full-stack web application demonstrating a complete article management and AI enhancement system. This project implements three distinct phases: a robust REST API backend, an AI-powered article enhancement service, and a responsive React frontend.

## 📑 Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [✅ Assignment Phases Complete](#-assignment-phases-complete)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Development](#development)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project is a multi-component application built as part of the BeyondChats assignment. It demonstrates:

- **Backend API** (Phase 1): A production-ready Express.js REST API with MongoDB integration
- **Article Enhancement** (Phase 2): An AI-powered service that enriches articles with enhanced content and references
- **Frontend UI** (Phase 3): A modern React application with Tailwind CSS for responsive design

The application manages articles through their complete lifecycle: creation, storage, enhancement, and presentation.

### View the Frontend Application

To see the article management system in action with original and enhanced articles side-by-side:

#### **Local Development Setup** (Recommended)

1. **Start the Backend API** (Terminal 1)
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   ✅ Backend running at: `http://localhost:5000`

2. **Start the Frontend Application** (Terminal 2)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   ✅ Frontend running at: **`http://localhost:5173`**

3. **Open in Browser**
   - Navigate to [http://localhost:5173](http://localhost:5173) in your web browser
   - You will see:
     - **Home page** with list of all articles
     - **Original Article** view with raw content from the database
     - **Enhanced Article** view with AI-enhanced content, references, and improvements
     - **Side-by-side comparison** to compare original vs enhanced versions

#### **Features Visible in Frontend**

- ✅ **Article List**: Browse all available articles
- ✅ **Original Content**: View the original article as scraped/uploaded
- ✅ **Enhanced Content**: View the AI-enhanced version with improved quality, structure, and references
- ✅ **Comparison View**: See both versions side-by-side to understand the enhancements
- ✅ **Real-time Updates**: Articles update dynamically as the enhancer service processes them

#### **Sample Data**

The application comes with sample articles. To see them:

1. Ensure the backend is running and MongoDB is connected
2. Visit `http://localhost:5173` to view articles
3. Articles display both original and enhanced versions

#### **Test the API Directly**

While viewing the frontend, you can also test the backend API:

**Get all articles:**
```bash
curl http://localhost:5000/api/articles
```

**Create a new article:**
```bash
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "content": "Your article content here...",
    "url": "https://example.com/article",
    "excerpt": "Brief summary",
    "original": true
  }'
```

See [API Documentation](#api-documentation) section below for complete API endpoints.

## ✅ Assignment Phases Complete

### **Phase 1: ✅ CRUD APIs + MongoDB** (Backend)

**Status:** COMPLETE — Production-ready REST API with full CRUD operations

**Evidence:**
- **File:** [backend/models/Article.js](backend/models/Article.js) — MongoDB schema with validation
  ```
  Schema Fields: title, content, url, excerpt, date, image, original, references, updatedAt
  ```
- **File:** [backend/routes/articles.js](backend/routes/articles.js) — All CRUD endpoints implemented
  ```
  ✅ GET    /api/articles        - Fetch all articles (8 total)
  ✅ GET    /api/articles/:id    - Get single article
  ✅ POST   /api/articles        - Create new article
  ✅ PUT    /api/articles/:id    - Update article (used by Phase 2)
  ✅ DELETE /api/articles/:id    - Delete article
  ```
- **Database:** 8 Articles stored in MongoDB
  - **5 Original articles** (Phase 1 - scraped/uploaded)
  - **3 Enhanced articles** (Phase 2 - AI-generated)

**Running:** `cd backend && npm run dev` → http://localhost:5000/api/articles

---

### **Phase 2: ✅ AI Enhancement Service** (Enhancer)

**Status:** COMPLETE — Automated article enrichment with OpenAI integration

**Evidence:**
- **File:** [enhancer/enhance.js](enhancer/enhance.js) — Production-ready enhancement script
  ```
  1. Fetches original articles via Phase 1 API
  2. Calls OpenAI GPT model for enhancement
  3. Generates references from real sources
  4. Posts enhanced articles back to Phase 1 backend
  ```
- **Enhancement Process:**
  - Reads 5 original articles from MongoDB
  - Enriches with AI-generated content
  - Adds structured references and citations
  - Stores enhanced versions with `original: false` flag
  - **Result: 3 enhanced articles** successfully created

**Running:** `node enhancer/enhance.js` → Creates enhanced articles automatically

---

### **Phase 3: ✅ React Frontend UI** (Frontend)

**Status:** COMPLETE — Responsive React UI showing original vs enhanced articles

**Evidence:**
- **File:** [frontend/src/App.jsx](frontend/src/App.jsx) — Main React component (597 lines)
  ```
  ✅ Fetches articles from Phase 1 API (GET /api/articles)
  ✅ Filters originals vs enhanced articles
  ✅ Displays side-by-side comparison
  ✅ Shows article counts: Total, Original, Enhanced
  ```
- **Features Implemented:**
  - Article list view with filtering (original vs enhanced)
  - Individual article detail pages
  - Side-by-side comparison (Original ← → Enhanced)
  - Real-time data from backend API
  - Responsive design (mobile, tablet, desktop)
  - Tailwind CSS styling with gradients

**Running:** `cd frontend && npm run dev` → http://localhost:5173

---

### **Data Flow Summary**

| Phase | Component | Input | Output | Storage |
|-------|-----------|-------|--------|---------|
| **1** | Backend API (Express) | CRUD requests | JSON articles | MongoDB |
| **2** | Enhancer (Node.js) | Original articles (5) | Enhanced articles (3) | MongoDB via Phase 1 |
| **3** | Frontend (React) | API GET requests | UI display | Browser cache |

**Total Article Count:** 8 (5 original + 3 enhanced)

---

## Features

### Phase 1: Backend REST API
- ✅ Complete CRUD operations for articles
- ✅ MongoDB integration with Mongoose ORM
- ✅ Web scraper for article collection from BeyondChats blogs
- ✅ RESTful API following best practices
- ✅ **Input Validation using express-validator** for data integrity and security
  - Title validation (minimum 5 characters)
  - Content validation (minimum 10 characters)
  - URL validation (valid URL format required)
  - Automatic error responses for invalid input
- ✅ Error handling and validation
- ✅ CORS-enabled for frontend communication

### Phase 2: Article Enhancement Service
- ✅ Automated article enhancement with AI
- ✅ Reference and citation management
- ✅ SEO optimization
- ✅ Batch processing capabilities
- ✅ Integration with OpenAI API

### Phase 3: Frontend Application
- ✅ Responsive React UI
- ✅ Side-by-side article comparison (Original vs Enhanced)
- ✅ Real-time data fetching
- ✅ Modern styling with Tailwind CSS
- ✅ Code quality with ESLint

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                 │
│                   http://localhost:5173                     │
└────────────────────────────┬────────────────────────────────┘
                             │
                      Axios HTTP Client
                             │
┌────────────────────────────▼────────────────────────────────┐
│              Backend API (Express.js)                        │
│              http://localhost:5000/api/articles              │
├──────────────────────────────────────────────────────────────┤
│  Routes: GET, POST, PUT, DELETE /articles                   │
│  Models: Article (MongoDB Schema)                           │
│  Middleware: CORS, JSON Parser, Error Handler               │
└────────────────────────────┬────────────────────────────────┘
                             │
                        Mongoose ODM
                             │
┌────────────────────────────▼────────────────────────────────┐
│                    MongoDB Database                          │
│                   (Atlas or Local)                           │
└─────────────────────────────────────────────────────────────┘

Enhancer Service (Standalone):
- Reads articles from Backend API
- Processes with OpenAI
- Posts enhanced versions back to Backend
```

## Prerequisites

### Required
- **Node.js** v18 or higher ([download](https://nodejs.org/))
- **npm** v9+ (comes with Node.js) or **yarn** v1.22+
- **MongoDB** account (Atlas recommended) or local MongoDB instance
- **Git** for version control

### Optional
- **Postman** for API testing
- **Docker** for containerization
- **VS Code** or preferred code editor

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Samiksha-Lone/beyondchats-assignment.git
cd beyondchats-assignment
```

### 2. Install Dependencies

Install dependencies for all three components:

```bash
# Backend
cd backend
npm install

# Enhancer (from project root)
cd ../enhancer
npm install

# Frontend (from project root)
cd ../frontend
npm install
```

## Configuration

### Environment Variables

Create `.env` files in the following directories. **These files should never be committed to version control.**

#### `backend/.env`

```env
# MongoDB Connection URI
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/beyondchats
# For Local MongoDB: mongodb://localhost:27017/beyondchats
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/beyondchats

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### `enhancer/.env`

```env
# MongoDB Connection (same as backend)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/beyondchats

# OpenAI API Configuration
OPENAI_API_KEY=your-openai-api-key

# Backend URL
BACKEND_URL=http://localhost:5000
```

#### `frontend/.env` (Optional)

```env
# API Configuration
VITE_API_URL=http://localhost:5000
```

### MongoDB Setup

#### Using MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Add database user
5. Get connection string
6. Add to `.env` file

#### Using Local MongoDB

```bash
# Install MongoDB Community Edition (follow OS-specific guides)
# Start MongoDB service
# Connection string: mongodb://localhost:27017/beyondchats
```

## Running the Application

### Start All Services (Recommended Setup)

#### Terminal 1: Backend API

```bash
cd backend
npm run dev
```

Expected output:
```
✅ MongoDB connected
🚀 Backend running: http://localhost:5000
📋 Articles: http://localhost:5000/api/articles
```

#### Terminal 2: Frontend Application

```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v7.2.4  ready in 245 ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

#### Terminal 3: Run Enhancer (when needed)

```bash
# From project root
node enhancer/enhance.js
```

### Available NPM Scripts

#### Backend (`backend/package.json`)

```bash
npm run dev      # Start with nodemon (hot reload)
npm start        # Production run
npm run scrape   # Execute web scraper
```

#### Frontend (`frontend/package.json`)

```bash
npm run dev      # Development server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

#### Enhancer

```bash
# From project root
node enhancer/enhance.js
```

## API Documentation

### Base URL

```
http://localhost:5000/api/articles
```

### Endpoints

#### 1. Get All Articles

**Request**
```http
GET /api/articles
```

**Response (200 OK)**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Getting Started with Chatbots",
    "content": "Article content here...",
    "url": "https://beyondchats.com/blogs/getting-started",
    "excerpt": "Learn the basics...",
    "original": true,
    "date": "2025-12-29T10:00:00.000Z",
    "references": []
  }
]
```

#### 2. Get Single Article

**Request**
```http
GET /api/articles/:id
```

**Response (200 OK)**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Getting Started with Chatbots",
  "content": "...",
  "original": true
}
```

**Response (404 Not Found)**
```json
{
  "error": "Article not found"
}
```

#### 3. Create Article

**Request**
```http
POST /api/articles
Content-Type: application/json

{
  "title": "New Article",
  "content": "Article body content...",
  "url": "https://example.com/article",
  "excerpt": "Brief summary...",
  "original": true,
  "references": []
}
```

**Response (201 Created)**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "New Article",
  ...
}
```

**Input Validation Rules**
- `title`: Must be at least 5 characters long (required)
- `content`: Must be at least 10 characters long (required)
- `url`: Must be a valid URL format (required)

**Response (400 Bad Request - Validation Failed)**
```json
{
  "errors": [
    {
      "type": "field",
      "value": "Hi",
      "msg": "Title must be at least 5 chars",
      "path": "title",
      "location": "body"
    }
  ],
  "message": "Validation failed"
}
```

**Example with invalid data:**
```bash
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hi",
    "content": "Short",
    "url": "invalid-url"
  }'
```

Response: 400 Bad Request with validation error details

#### 4. Update Article

**Request**
```http
PUT /api/articles/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content...",
  "original": false
}
```

**Response (200 OK)**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Updated Title",
  ...
}
```

#### 5. Delete Article

**Request**
```http
DELETE /api/articles/:id
```

**Response (200 OK)**
```json
{
  "message": "Article deleted"
}
```

#### 6. Trigger Scraper (Disabled)

**Request**
```http
POST /api/scrape
```

**Response (200 OK)**
```json
{
  "message": "Scraping disabled!"
}
```

### Error Responses

**400 Bad Request**
```json
{
  "error": "Validation error message"
}
```

**404 Not Found**
```json
{
  "error": "Article not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Server error message"
}
```

## Project Structure

```
beyondchats-assignment/
├── backend/                          # Express.js REST API
│   ├── models/
│   │   └── Article.js               # MongoDB schema and model
│   ├── routes/
│   │   └── articles.js              # CRUD route handlers
│   ├── scraper/
│   │   └── scrape-blogs.js          # Web scraper utility
│   ├── server.js                    # Express server entry point
│   ├── package.json                 # Backend dependencies
│   ├── .env                         # Environment variables (git ignored)
│   └── node_modules/                # Dependencies (git ignored)
│
├── enhancer/                         # AI Enhancement Service
│   ├── enhance.js                   # Main enhancer script
│   ├── package.json                 # Enhancer dependencies
│   ├── .env                         # Environment variables (git ignored)
│   └── node_modules/                # Dependencies (git ignored)
│
├── frontend/                         # React.js Frontend
│   ├── src/
│   │   ├── App.jsx                  # Main React component
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── public/                      # Static assets
│   ├── index.html                   # HTML entry point
│   ├── vite.config.js               # Vite configuration
│   ├── eslint.config.js             # ESLint rules
│   ├── package.json                 # Frontend dependencies
│   ├── .gitignore                   # Frontend specific ignores
│   └── node_modules/                # Dependencies (git ignored)
│
├── screenshots/                      # API Documentation
│   └── postman/                     # Postman collection screenshots
│
├── .gitignore                        # Git ignore rules
├── README.md                         # This file
└── LICENSE                           # MIT License
```

## 📱 Screenshots (9 Total) ✅

### Frontend UI (Phase 3)
- ![Home View](screenshots/frontend/home.webp) — Article list overview
- ![Original Articles](screenshots/frontend/original.webp) — Original article display
- ![Enhanced Articles](screenshots/frontend/enhanced.webp) — Enhanced content with comparison

### MongoDB Proof (Phase 1+2)
- ![8 Articles Database](screenshots/mongodb-articles.webp) — Complete database with 5 original + 3 enhanced articles

### Postman API Testing (Phase 1 CRUD)
- ![GET All Articles](screenshots/postman/1-get-all.webp) — Retrieve all articles
- ![POST New Article](screenshots/postman/2-post-new.webp) — Create new article
- ![GET Single Article](screenshots/postman/3-get-single.webp) — Fetch specific article by ID
- ![PUT Update Article](screenshots/postman/4-put-update.webp) — Update article (used by Phase 2 enhancer)
- ![DELETE Article](screenshots/postman/5-delete.webp) — Remove article

## 📊 Data Flow Diagram (Phase 1→2→3)

```mermaid
sequenceDiagram
    participant U as User / Browser
    participant F as React Frontend (Phase 3)
    participant B as Express Backend (Phase 1)
    participant M as MongoDB
    participant E as Enhancer Service (Phase 2)
    participant AI as OpenAI LLM
    
    rect rgb(200, 150, 255)
    Note over U,M: Phase 1: Backend REST API
    U->>F: 1. Load Articles
    F->>B: GET /api/articles
    B->>M: find({articles})
    M->>B: Return 8 articles (5 original + 3 enhanced)
    B->>F: JSON Response
    F->>U: Display Article List
    end
    
    rect rgb(150, 200, 255)
    Note over E,AI: Phase 2: AI Enhancement Service
    E->>B: Fetch articles to enhance
    B->>M: Query unenriched articles
    M->>B: Return articles
    B->>E: Articles data
    E->>AI: Call OpenAI API (enhance content)
    AI->>E: Enhanced content + references
    E->>B: POST /api/articles (updated)
    B->>M: Store enhanced version
    end
    
    rect rgb(200, 255, 200)
    Note over F,U: Phase 3: Frontend Display
    U->>F: Click on article
    F->>B: GET /api/articles/:id
    B->>M: findById(id)
    M->>B: Original + Enhanced versions
    B->>F: Article details
    F->>U: Show original vs enhanced side-by-side
    end
```

## 🏗️ Architecture Diagram

```mermaid
graph TB
    subgraph Client["🖥️ Client Layer"]
        U["👤 User / Browser<br/>(http://localhost:5173)"]
    end
    
    subgraph Frontend["📱 Phase 3: Frontend"]
        FE["React 19.2 + Vite 7.2<br/>- Article List View<br/>- Original Article Display<br/>- Enhanced Article Display<br/>- Side-by-side Comparison"]
    end
    
    subgraph Backend["⚙️ Phase 1: Backend API"]
        BE["Express.js 5.2 REST API<br/>(http://localhost:5000)<br/>- GET /api/articles<br/>- POST /api/articles<br/>- PUT /api/articles/:id<br/>- DELETE /api/articles/:id"]
        
        SC["Web Scraper<br/>(Puppeteer + Cheerio)<br/>- Fetch from BeyondChats<br/>- Parse HTML<br/>- Store raw articles"]
    end
    
    subgraph Enhancer["✨ Phase 2: Enhancement Service"]
        EN["Enhancer Script<br/>(Node.js)<br/>- Fetch articles<br/>- Call OpenAI API<br/>- Enrich content<br/>- Add references<br/>- Post back to backend"]
    end
    
    subgraph Database["💾 Data Layer"]
        M[("MongoDB Atlas<br/>- Original Articles<br/>- Enhanced Articles<br/>- References<br/>- Metadata")]
    end
    
    subgraph External["🌐 External Services"]
        AI["OpenAI API<br/>- GPT Models<br/>- Content Enhancement<br/>- Reference Generation"]
        BLOGS["BeyondChats Blogs<br/>(Web Source)"]
    end
    
    U -->|Loads & Interacts| FE
    FE -->|HTTP Axios Requests| BE
    BE -->|CRUD Operations| M
    SC -->|Fetches Data| BLOGS
    SC -->|Stores Articles| M
    EN -->|Fetches Unenriched| BE
    EN -->|Enhancement API Call| AI
    EN -->|POSTs Enhanced Articles| BE
    BE -->|Stores Enhanced| M
    BE -->|API Response| FE
    FE -->|Display Original & Enhanced| U
    
    style Client fill:#e1f5ff
    style Frontend fill:#f3e5f5
    style Backend fill:#fff3e0
    style Enhancer fill:#e8f5e9
    style Database fill:#fce4ec
    style External fill:#f1f8e9
```

**Component Responsibilities:**

- **Client**: User interface and browser interaction
- **Phase 3 (Frontend)**: React-based UI for displaying and comparing articles
- **Phase 1 (Backend)**: REST API server managing article CRUD operations
- **Phase 2 (Enhancer)**: Standalone service that enriches articles using AI
- **Database**: MongoDB storing original and enhanced articles
- **External Services**: OpenAI for content enhancement, BeyondChats blogs as source

## Technology Stack

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| Express.js | 5.2 | Web framework |
| MongoDB | - | NoSQL database |
| Mongoose | 9.0 | MongoDB ODM |
| Axios | 1.13 | HTTP client |
| Cheerio | 1.1 | HTML parsing |
| Puppeteer | 24.34 | Browser automation |
| Dotenv | 17.2 | Environment management |
| Nodemon | 3.1 | Development hot reload |

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2 | UI framework |
| Vite | 7.2 | Build tool |
| Tailwind CSS | 4.1 | CSS framework |
| Axios | 1.13 | HTTP client |
| ESLint | 9.39 | Code linter |

### Enhancement Service

| Technology | Version | Purpose |
|-----------|---------|---------|
| OpenAI | 6.15 | AI API integration |
| Axios | 1.13 | HTTP client |
| Puppeteer | 24.34 | Browser automation |
| Dotenv | 17.2 | Environment management |

## Development

### Code Quality

#### ESLint (Frontend)

```bash
cd frontend
npm run lint
```

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Test functionality locally

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push to remote**
   ```bash
   git push origin feature/your-feature-name
   ```

### Testing APIs

#### Using Postman

1. Import the collection from `screenshots/postman/`
2. Set `{{base_url}}` to `http://localhost:5000`
3. Run requests from the collection

#### Using cURL

```bash
# Get all articles
curl http://localhost:5000/api/articles

# Create article
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Test content","url":"https://test.com"}'

# Get specific article
curl http://localhost:5000/api/articles/507f1f77bcf86cd799439011

# Update article
curl -X PUT http://localhost:5000/api/articles/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'

# Delete article
curl -X DELETE http://localhost:5000/api/articles/507f1f77bcf86cd799439011
```

## Deployment

### Deploying to Heroku

1. **Create Heroku account** and install CLI
2. **Create app**
   ```bash
   heroku create your-app-name
   ```

3. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URI=your-mongo-uri
   heroku config:set OPENAI_API_KEY=your-key
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Docker Deployment (Optional)

See `Dockerfile` for containerized deployment instructions.

## Security

### Environment Variables

- **Never commit `.env` files** to version control
- All `.env` files are in `.gitignore`
- Use strong MongoDB passwords
- Rotate API keys regularly
- For production, use secure secret management (AWS Secrets Manager, GitHub Secrets, etc.)

### API Security Best Practices

- Validate all user inputs
- Implement rate limiting for production
- Use HTTPS in production
- Add authentication/authorization for protected endpoints
- Sanitize data before storing in database

### Database Security

- Use strong connection URIs
- Enable IP whitelist in MongoDB Atlas
- Use database-level access controls
- Regular backups

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### MongoDB Connection Issues

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

- Ensure MongoDB is running
- Check connection URI in `.env`
- Verify MongoDB credentials

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

```bash
# Find process using port 5000 and kill it
lsof -i :5000
kill -9 <PID>
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors

- Ensure backend is running on `http://localhost:5000`
- Frontend should be on `http://localhost:5173`
- CORS is enabled in `backend/server.js`

## Acknowledgments

- BeyondChats for the assignment
- MongoDB for database services
- OpenAI for AI capabilities
- The open-source community

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Owner

**Name:** Samiksha Balaji Lone

**Role:** Full Stack Developer

**Contact:**
- GitHub: https://github.com/Samiksha-Lone
- Email: samikshalone2@gmail.com
- LinkedIn: https://www.linkedin.com/in/samiksha-lone/