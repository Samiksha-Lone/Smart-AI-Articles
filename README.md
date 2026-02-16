# SmartArticle AI

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.0+-blue.svg)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express-4.19-orange.svg)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646cff.svg)](https://vitejs.dev/)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00.svg)](https://www.tensorflow.org/js)
[![LangChain.js](https://img.shields.io/badge/LangChain.js-1C3C3C.svg)](https://js.langchain.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991.svg)](https://openai.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#license)
[![Status](https://img.shields.io/badge/Status-Complete-brightgreen.svg)](#-project-components)


## ⚠️ Security Notice

**IMPORTANT:** This repository exposes sensitive credentials (MongoDB URI, OpenAI API keys) in the `.env` file. This is a **critical security issue** for portfolio/public projects. 

**Before using this project:**
1. **Review [#security-cleanup](#security-cleanup)** section below for cleanup instructions
2. **Create fresh credentials** for MongoDB and OpenAI (your exposed keys should be rotated)
3. **Never commit .env files** to version control

## Live Demo

<p>
<a href="https://beyondchats-frontend-beta.vercel.app" title="Frontend Live">
  <img src="https://img.shields.io/badge/Frontend-LIVE-brightgreen?style=for-the-badge" alt="Frontend Live" />
</a>
<a href="https://beyondchats-assignment-backend.onrender.com/api/articles" title="Backend API">
  <img src="https://img.shields.io/badge/API-13%20Articles-blue?style=for-the-badge" alt="API Live" />
</a>
<a href="https://github.com/Samiksha-Lone/beyondchats-assignment" title="Source Code">
  <img src="https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge" alt="GitHub" />
</a>
</p>


A comprehensive full-stack web application demonstrating a complete article management and AI enhancement system. This project implements three distinct components: a robust REST API backend, an AI-powered article enhancement service, and a responsive React frontend with ML Analytics Dashboard.

## 📑 Table of Contents

- [⚠️ Security Notice](#-security-notice)
- [Overview](#overview)
- [Live Demo](#live-demo)
- [Project Components](#-project-components)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Setup (5 minutes)](#-quick-setup-5-minutes)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Development](#development)
- [Deployment](#deployment)
- [Security Cleanup Guide](#security-cleanup-guide)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project is a multi-component application showcasing SmartArticle AI capabilities. It demonstrates:

- **Backend API**: A production-ready Express.js REST API with MongoDB integration
- **Article Enhancement**: An AI-powered service that enriches articles with enhanced content and references
- **Frontend UI**: A modern React application with Tailwind CSS for responsive design and ML Analytics Dashboard

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

## ✅ Project Components

### **✅ CRUD APIs + MongoDB** (Backend)

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
  ✅ PUT    /api/articles/:id    - Update article (used by Enhancer)
  ✅ DELETE /api/articles/:id    - Delete article
  ```
- **Database:** ML Analytics Dashboard
  - **Original articles** (Backend - scraped/uploaded)
  - **Enhanced articles** (AI Enhancer - generated)

**Running:** `cd backend && npm run dev` → http://localhost:5000/api/articles

---

### **✅ AI Enhancement Service** (Enhancer)

**Status:** COMPLETE — Automated article enrichment with OpenAI integration

**Evidence:**
- **File:** [enhancer/enhance.js](enhancer/enhance.js) — Production-ready enhancement script
  ```
  1. Fetches original articles via Backend API
  2. Calls OpenAI GPT model for enhancement
  3. Generates references from real sources
  4. Posts enhanced articles back to Backend
  ```
- **Enhancement Process:**
  - Reads 5 original articles from MongoDB
  - Enriches with AI-generated content
  - Adds structured references and citations
  - Stores enhanced versions with `original: false` flag
  - **Result: 3 enhanced articles** successfully created

**Running:** `node enhancer/enhance.js` → Creates enhanced articles automatically

---

### **✅ React Frontend UI** (Frontend)

**Status:** COMPLETE — Responsive React UI showing original vs enhanced articles

**Evidence:**
- **File:** [frontend/src/App.jsx](frontend/src/App.jsx) — Main React component (597 lines)
  ```
  ✅ Fetches articles from Backend API (GET /api/articles)
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
| **2** | Enhancer (Node.js) | Original articles | Enhanced articles | MongoDB via Backend |
| **3** | Frontend (React) | API GET requests | UI display | Browser cache |

**Total Article Count:** ML Analytics Dashboard

---

## Features

### Backend REST API
- ✅ Complete CRUD operations for articles
- ✅ MongoDB integration with Mongoose ORM
- ✅ RESTful API following best practices
- ✅ **Input Validation using express-validator** for data integrity and security
  - Title validation (minimum 5 characters)
  - Content validation (minimum 10 characters)
  - URL validation (valid URL format required)
  - Automatic error responses for invalid input
- ✅ Error handling and validation
- ✅ CORS-enabled for frontend communication

### Article Enhancement Service
- ✅ Automated article enhancement with AI
- ✅ Reference and citation management
- ✅ SEO optimization
- ✅ Batch processing capabilities
- ✅ Integration with OpenAI API

### Frontend Application
- ✅ Responsive React UI
- ✅ Side-by-side article comparison (Original vs Enhanced)
- ✅ Real-time data fetching
- ✅ Modern styling with Tailwind CSS
- ✅ Code quality with ESLint
- ✅ ML Analytics Dashboard

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

## 🚀 Quick Setup (5 minutes)

### For Immediate Testing (No API Keys Needed)

```bash
# 1. Clone & Navigate
git clone https://github.com/Samiksha-Lone/beyondchats-assignment.git
cd beyondchats-assignment

# 2. Backend Setup
cd backend
npm install
# Create .env from example (remove or leave credentials blank for demo)
cp .env.example .env
npm run dev

# 3. Frontend Setup (New Terminal)
cd frontend
npm install
cp .env.example .env
npm run dev

# 4. Open Browser
# Frontend: http://localhost:5173
# API: http://localhost:5000/api/articles
```

### For Full Functionality (Need API Keys)

```bash
# Repeat steps above, BUT:
# 1. Get MongoDB URI: https://www.mongodb.com/cloud/atlas
# 2. Get OpenAI API Key: https://platform.openai.com/api-keys
# 3. Update .env files with your credentials

# Backend (.env)
MONGODB_URI=your-mongodb-connection-string
PORT=5000

# Enhancer (.env)  
MONGODB_URI=your-mongodb-connection-string
OPENAI_API_KEY=sk-proj-your-key-here
BACKEND_URL=http://localhost:5000

# Frontend (.env)
VITE_API_URL=http://localhost:5000

# Then run: npm run dev (in each directory)
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

### Step 1: Create Environment Files

For each folder (backend, enhancer, frontend), create a `.env` file from the example:

```bash
# Backend
cd backend && cp .env.example .env

# Enhancer  
cd ../enhancer && cp .env.example .env

# Frontend
cd ../frontend && cp .env.example .env
```

### Step 2: Get Required Credentials

#### MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Click "Create Project" → "Create Deployment" → Choose "Free" tier
4. In the "Security" tab → "Database Access" → Add username/password
5. In the "Network Access" tab → Add your IP (or 0.0.0.0/0 for development)
6. Click "Connect" → Copy "Connection string"
7. Replace `<password>` with your database password
8. Example connection string:
   ```
   mongodb+srv://username:password@cluster0.mongodb.net/beyondchats?retryWrites=true&w=majority
   ```

#### OpenAI API Key Setup

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Log in with your OpenAI account
3. Click "Create new secret key"
4. Copy the key (format: `sk-proj-xxxxx...`)
5. **SECURITY**: Never share or commit this key

### Step 3: Fill in .env Files

#### `backend/.env`

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/beyondchats?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

#### `enhancer/.env`

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/beyondchats?retryWrites=true&w=majority
OPENAI_API_KEY=sk-proj-your-openai-api-key
BACKEND_URL=http://localhost:5000
NODE_ENV=development
```

#### `frontend/.env`

```env
VITE_API_URL=http://localhost:5000
VITE_ENV=development
```

### Step 4: Verify Configuration

```bash
# Test backend connection
cd backend
npm install
npm run dev
# You should see: ✅ MongoDB connected

# Test frontend connection (in another terminal)
cd frontend
npm install
npm run dev
# You should see: ➜ Local: http://localhost:5173
```

### Environment Variables Reference

| Variable | Where | Purpose | Required |
|----------|-------|---------|----------|
| `MONGODB_URI` | Backend, Enhancer | Connect to MongoDB database | Yes |
| `PORT` | Backend | Server port (default: 5000) | No |
| `NODE_ENV` | All | Set to development/production | No |
| `OPENAI_API_KEY` | Enhancer | OpenAI API authentication | Yes (for enhancer) |
| `BACKEND_URL` | Enhancer | Backend API address | Yes (for enhancer) |
| `VITE_API_URL` | Frontend | Backend API address for frontend | No |

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

Example env templates are included for convenience and can be copied/renamed to `.env`:

- [backend/.env.example](backend/.env.example)
- [enhancer/.env.example](enhancer/.env.example)
- [frontend/.env.example](frontend/.env.example)

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

### Frontend UI
- ![Home View](screenshots/frontend/home.webp) — Article list overview
- ![Original Articles](screenshots/frontend/original.webp) — Original article display
- ![Enhanced Articles](screenshots/frontend/enhanced.webp) — Enhanced content with comparison

### MongoDB Proof
- ![ML Analytics Dashboard](screenshots/mongodb-articles.webp) — Complete database with original + enhanced articles

### Postman API Testing (CRUD)
- ![GET All Articles](screenshots/postman/1-get-all.webp) — Retrieve all articles
- ![POST New Article](screenshots/postman/2-post-new.webp) — Create new article
- ![GET Single Article](screenshots/postman/3-get-single.webp) — Fetch specific article by ID
- ![PUT Update Article](screenshots/postman/4-put-update.webp) — Update article (used by enhancer)
- ![DELETE Article](screenshots/postman/5-delete.webp) — Remove article

## 📊 Data Flow Diagram

```mermaid
sequenceDiagram
    participant U as User / Browser
    participant F as React Frontend
    participant B as Express Backend
    participant M as MongoDB
    participant E as Enhancer Service
    participant AI as OpenAI LLM
    
    rect rgb(200, 150, 255)
    Note over U,M: Backend REST API
    U->>F: 1. Load Articles
    F->>B: GET /api/articles
    B->>M: find({articles})
    M->>B: Return articles (original + enhanced)
    B->>F: JSON Response
    F->>U: Display Article List
    end
    
    rect rgb(150, 200, 255)
    Note over E,AI: AI Enhancement Service
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
    Note over F,U: Frontend Display
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
    
    subgraph Frontend["📱 Frontend"]
        FE["React 19.2 + Vite 7.2<br/>- Article List View<br/>- Original Article Display<br/>- Enhanced Article Display<br/>- Side-by-side Comparison<br/>- ML Analytics Dashboard"]
    end
    
    subgraph Backend["⚙️ Backend API"]
        BE["Express.js 5.2 REST API<br/>(http://localhost:5000)<br/>- GET /api/articles<br/>- POST /api/articles<br/>- PUT /api/articles/:id<br/>- DELETE /api/articles/:id"]
        
        SC["Article Management<br/>- Parse Content<br/>- Store articles"]
    end
    
    subgraph Enhancer["✨ Enhancement Service"]
        EN["Enhancer Script<br/>(Node.js)<br/>- Fetch articles<br/>- Call OpenAI API<br/>- Enrich content<br/>- Add references<br/>- Post back to backend"]
    end
    
    subgraph Database["💾 Data Layer"]
        M[("MongoDB Atlas<br/>- Original Articles<br/>- Enhanced Articles<br/>- References<br/>- Metadata<br/>- ML Analytics Dashboard")]
    end
    
    subgraph External["🌐 External Services"]
        AI["OpenAI API<br/>- GPT Models<br/>- Content Enhancement<br/>- Reference Generation"]
    end
    
    U -->|Loads & Interacts| FE
    FE -->|HTTP Axios Requests| BE
    BE -->|CRUD Operations| M
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
- **Frontend**: React-based UI for displaying and comparing articles with ML Analytics Dashboard
- **Backend**: REST API server managing article CRUD operations
- **Enhancer**: Standalone service that enriches articles using AI
- **Database**: MongoDB storing original and enhanced articles
- **External Services**: OpenAI for content enhancement

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

### Frontend Deployment (Vercel) ✅

Your frontend is already deployed! To redeploy or update:

1. **Connect GitHub Repository**
   ```
   vercel.com → Import Project → Select your GitHub repo
   ```

2. **Set Environment Variables**
   ```
   Vercel Dashboard → Settings → Environment Variables
   Add: VITE_API_URL=https://your-backend-url
   ```

3. **Preview & Deploy**
   ```
   Vercel automatically deploys on git push to main
   ```

4. **View Live**
   ```
   https://beyondchats-frontend-beta.vercel.app
   ```

### Backend Deployment (Render) ✅

Your backend is already deployed! To redeploy or update:

1. **Connect GitHub Repository**
   ```
   render.com → New Web Service → Connect GitHub
   ```

2. **Configure Build & Runtime**
   ```
   Build Command: npm install
   Start Command: npm start (or: node server.js)
   ```

3. **Set Environment Variables**
   ```
   Dashboard → Environment → Add:
   - MONGODB_URI (copy from MongoDB Atlas)
   - OPENAI_API_KEY (from OpenAI)
   - NODE_ENV=production
   - PORT=5000
   ```

4. **Enable Auto-Deploy**
   ```
   Dashboard → Settings → Auto-Deploy from Git
   ```

5. **View Live**
   ```
   https://beyondchats-assignment-backend.onrender.com/api/articles
   ```

### Backend Deployment Options

#### Option 1: Render (Recommended - What you're using)

Pros:
- ✅ Free tier available
- ✅ Easy GitHub integration
- ✅ Auto-deploy on git push
- ✅ No credit card needed
- ✅ Decent performance

Cons:
- Slow first request (cold starts)
- Free tier shuts down after 15 min inactivity

**Setup:**
```bash
# Already done! But if redoing:
1. Go to render.com
2. Click "New +" → Web Service
3. Connect your GitHub repo
4. Set environment variables
5. Click "Create Web Service"
```

#### Option 2: Heroku (Alternative)

**Note:** Heroku free tier discontinued. Cheapest paid option (~$5/month)

```bash
# Install Heroku CLI
brew tap heroku/brew && brew install heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add MongoDB URI
heroku config:set MONGODB_URI=your-mongo-uri
heroku config:set OPENAI_API_KEY=your-openai-key

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

#### Option 3: Railway (Alternative)

- Free tier: $5/month credits
- Easy GitHub integration
- Good performance

```bash
# 1. Go to railway.app
# 2. Connect GitHub
# 3. Select repository
# 4. Set environment variables
# 5. Deploy automatically
```

### Frontend Deployment Options

#### Option 1: Vercel (Recommended - What you're using)

Pros:
- ✅ Optimized for Next.js/React
- ✅ Fastest deployment
- ✅ Free tier generous
- ✅ Auto-deploys on git push

**Setup (Already Done):**
```bash
# If redoing:
1. Go to vercel.com
2. Sign in with GitHub
3. Click "Add New..." → Project
4. Select repository
5. Set environment variables
6. Click "Deploy"
```

#### Option 2: Netlify (Alternative)

- Easy drag-and-drop or git integration
- Similar performance to Vercel
- Good free tier

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

#### Option 3: GitHub Pages (Free but limited)

- Static hosting only (good for SPA)
- Free
- Limited features

### Enhancer Deployment

The enhancer is typically run:
- **Locally** for testing
- **As scheduled task** in production (cron job)
- **Via GitHub Actions** on schedule

Example GitHub Actions workflow (`.github/workflows/enhance.yml`):

```yaml
name: AI Article Enhancement

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  workflow_dispatch:     # Manual trigger

jobs:
  enhance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd enhancer && npm install
      
      - name: Run enhancer
        env:
          MONGODB_URI: ${{ secrets.MONGODB_URI }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          BACKEND_URL: https://your-backend-url
        run: cd enhancer && node enhance.js
```

### Post-Deployment Verification

After deploying, verify everything works:

```bash
# 1. Frontend
# Visit: https://beyondchats-frontend-beta.vercel.app
# ✅ Should display article list

# 2. Backend API
curl https://beyondchats-assignment-backend.onrender.com/api/articles
# ✅ Should return JSON articles

# 3. Create article (test POST)
curl -X POST https://beyondchats-assignment-backend.onrender.com/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "content": "Test content for deployment verification",
    "original": true
  }'
# ✅ Should return 201 Created

# 4. Check MongoDB
# Log into MongoDB Atlas
# ✅ Should see new article in database
```

## Deploying to Heroku

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

## Security Cleanup Guide

### ⚠️ CRITICAL: Remove Exposed Credentials from Git History

The `.env` file containing live API keys has been committed to git history. Follow these steps to remove it:

#### Option 1: Using BFG Repo-Cleaner (Recommended)

```bash
# 1. Install BFG (macOS with Homebrew)
brew install bfg

# 2. Navigate to your project
cd ~/projects/Smart-AI-Articles

# 3. Create a clone for safety
git clone --mirror https://github.com/YOUR-USERNAME/Smart-AI-Articles.git smartarticles-backup.git

# 4. Remove .env from history
cd smartarticles-backup.git
bfg --delete-files .env

# 5. Clean refs
git reflog expire --expire=now --all && git gc --prune=now --aggressive

# 6. Push cleaned history (DESTRUCTIVE - team should be notified!)
git push --force
```

#### Option 2: Using Git Filter-Branch (Alternative)

```bash
# Navigate to your project
cd ~/projects/Smart-AI-Articles

# Remove .env from git history
git filter-branch --tree-filter 'rm -rf .env' -- --all

# Force push (WARNING: Rewrites history!)
git push origin --force --all
```

#### Option 3: For New Fork (Easiest)

```bash
# Create a new clean repository
git clone https://github.com/YOUR-USERNAME/Smart-AI-Articles.git clean-repo
cd clean-repo
rm .env
git add .
git commit -m "Remove exposed .env file"
git push
# Delete old repo on GitHub and use this one
```

### After Cleanup

1. **Rotate All Exposed Credentials:**
   - MongoDB: Create new database user + rotate password
   - OpenAI: Delete exposed API key, generate new one
   - Any other exposed secrets

2. **Update `.gitignore` (Already Done):**
   ```
   .env
   .env.*
   !.env.example
   ```

3. **Use GitHub Secrets for Deployment:**
   - GitHub Actions: Settings → Secrets and variables → Actions
   - Add: `MONGODB_URI`, `OPENAI_API_KEY`, `PORT`

4. **Enable Branch Protection:**
   - GitHub: Settings → Branches → Add Rule
   - Require reviews before merge
   - Dismiss stale reviews

## Security Best Practices

### 🔐 IMPLEMENTED Security Features ✅

Your backend now includes enterprise-grade security:

#### 1. **Helmet.js** ✅
- Sets secure HTTP headers (auto-enabled)
- Prevents common vulnerabilities (XSS, Clickjacking, etc.)
- Configured headers:
  ```
  ✅ Content Security Policy (CSP)
  ✅ X-Frame-Options (Clickjacking protection)
  ✅ X-Content-Type-Options (MIME type sniffing)
  ✅ Strict-Transport-Security (HTTPS enforcement)
  ✅ X-XSS-Protection (XSS filter)
  ```

#### 2. **CORS Restrictions** ✅
- **Allowed origins** (only these can access your API):
  ```
  ✅ http://localhost:5173 (local frontend)
  ✅ http://localhost:3000 (alt local dev)
  ✅ https://beyondchats-frontend-beta.vercel.app (production)
  ✅ Custom URL from FRONTEND_URL environment variable
  ```
- **Blocked**: All other origins get CORS error
- **Methods allowed**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization
- **Credentials**: CORS credentials enabled for auth tokens

#### 3. **Rate Limiting** ✅
- **General limit**: 100 requests per 15 minutes per IP (all endpoints)
- **Strict limit**: 20 requests per 15 minutes (POST, PUT, DELETE)
- **Prevents**: Brute force attacks, API abuse, DDoS
- **Rate limit headers**: Returns `RateLimit-*` headers to clients
- **Error message**: `"Too many requests from this IP, please try again later"`

#### 4. **Request Logging** ✅
Every HTTP request logged with:
- Remote IP address
- Timestamp
- HTTP method & path
- Status code
- Response size
- Response time (ms)
- User-Agent
- Referrer

#### 5. **Error Handling** ✅
- **404 errors**: Returns proper JSON for missing routes
- **Global error handler**: Catches all errors
- **Stack traces**: Only shown in development mode
- **Proper HTTP status codes**: 400, 401, 404, 500, etc.

#### 6. **Health Check Endpoint** ✅
- **Endpoint**: `GET http://localhost:5000/health`
- **Response**: Server status, uptime, MongoDB connection status
- **Use**: Monitor server health, load balancer checks

#### 7. **Input Validation** ✅
- POST/PUT endpoints validate: title, content, URL
- Prevents: SQL injection (via Mongoose), XSS (via validation)
- Returns: 400 Bad Request with detailed error messages

#### 8. **MongoDB Security** ✅
- Connection pooling (max 10 connections)
- Mongoose ODM prevents injection
- Long timeouts (30s connection, 45s socket)

### 🔧 Configuration

#### Environment Variables (backend/.env)

```env
# Required
MONGODB_URI=your-mongodb-connection-string
PORT=5000
NODE_ENV=development

# For Production Security
FRONTEND_URL=https://your-frontend-deployment.com
NODE_ENV=production
```

#### Test Rate Limiting

```bash
# Should fail after ~20 requests
for i in {1..25}; do
  curl -X POST http://localhost:5000/api/articles \
    -H "Content-Type: application/json" \
    -d '{"title":"Test","content":"Test"}'
  sleep 0.1
done
```

#### Check Helmet Headers

```bash
curl -I http://localhost:5000/api/articles
```

Expected security headers:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-XSS-Protection: 1; mode=block
```

#### Test Health Endpoint

```bash
curl http://localhost:5000/health
# Returns: {"status":"OK","timestamp":"...","uptime":...,"mongodb":"connected"}
```

### 📋 Security Checklist

- [x] Helmet security headers enabled
- [x] CORS restricted to allowed origins
- [x] Rate limiting on all endpoints (100 req/15min)
- [x] Strict rate limiting on write operations (20 req/15min)
- [x] HTTP request logging with Morgan
- [x] Health check endpoint (for monitoring)
- [x] Global error handler
- [x] No stack traces in production
- [x] Input validation (express-validator)
- [x] MongoDB connection pooling
- [ ] Authentication/JWT (optional for production)
- [ ] Helmet CSP policies tuned (optional)
- [ ] Database encryption at rest (MongoDB Atlas)
- [ ] HTTPS in production (handled by Vercel/Render)

### 🚀 Production Security Recommendations

When deploying, already handled:

✅ **HTTPS** - Automatic on Vercel/Render
✅ **Rate Limiting** - Implemented
✅ **CORS** - Restricted to your frontend
✅ **Security Headers** - Helmet.js active
✅ **Request Logging** - Morgan middleware
✅ **Input Validation** - express-validator

Optional enhancements:

- **Authentication (JWT)** - Protect admin routes
- **Monitoring** - Sentry, LogRocket for error tracking
- **DDoS Protection** - Cloudflare integration
- **Encryption at Rest** - MongoDB encryption setting

### 🔐 Environment Variables

- **Never commit `.env` files** to version control (already in `.gitignore`)
- **Never hardcode secrets** in source code
- **Use strong passwords** for MongoDB (20+ chars)
- **Rotate API keys regularly** (every 90 days)
- **Use different keys** for development and production
- **Store secrets securely:**
  - Local: `.env` file (git ignored)
  - GitHub Actions: GitHub Secrets
  - Vercel/Render: Dashboard environment variables
  - Production: AWS Secrets Manager

### 🗄️ Database Security

- **IP Whitelist:** Configure in MongoDB Atlas (restrict IPs)
- **Strong Credentials:** Complex passwords for MongoDB users
- **User Roles:** Separate dev/prod database users
- **Backups:** MongoDB Atlas auto-backup (enabled)
- **Encryption:** SSL/TLS enabled by default
- **Connection Pooling:** Implemented (10 max connections)

### 🚀 Deployment Security

**For Vercel (Frontend):**
- Settings → Environment Variables
- Add: `VITE_API_URL=https://your-backend-url`

**For Render (Backend):**
- Dashboard → Environment
- Add: `MONGODB_URI`, `OPENAI_API_KEY`, `PORT`, `NODE_ENV`
- Set `NODE_ENV=production` for security headers

### 📋 Security Checklist for Portfolio

- [ ] `.env` file removed from git history
- [ ] All exposed credentials rotated
- [ ] `.gitignore` includes `.env*` files  
- [ ] No hardcoded API keys in code
- [ ] Input validation on all API endpoints
- [ ] HTTPS enabled in production
- [ ] CORS properly configured for production
- [ ] Environment variables set in deployment platforms
- [ ] GitHub Secrets configured for CI/CD
- [ ] Regular dependency updates (`npm audit fix`)
- [ ] Security headers added (optional but recommended)
- [ ] Rate limiting considered for production
- [ ] Database backups enabled

## Security

## 📋 Portfolio & Resume Guide

### ✅ Portfolio Checklist

Before adding this to your portfolio, verify:

- [ ] **Security**
  - [ ] No `.env` files exposed in git
  - [ ] Exposed credentials rotated
  - [ ] `.gitignore` properly configured
  
- [ ] **Code Quality**
  - [ ] No console.log() spam
  - [ ] No hardcoded values
  - [ ] Error handling on all endpoints
  - [ ] Input validation implemented
  
- [ ] **Documentation**
  - [ ] README is comprehensive
  - [ ] .env.example files present
  - [ ] Setup instructions clear
  - [ ] API endpoints documented
  - [ ] Deployment steps documented
  
- [ ] **Functionality**
  - [ ] Backend API working locally
  - [ ] Frontend displays correctly
  - [ ] Database connections solid
  - [ ] All CRUD operations work
  - [ ] Deployed and live

- [ ] **GitHub** 
  - [ ] Recent commits with good messages
  - [ ] Clean commit history
  - [ ] No merge conflicts
  - [ ] Attractive README with badges

### 📌 What to Highlight in Resume

**Project Title:** SmartArticle AI — Full-Stack Article Management with AI Enhancement

**Description (1-2 lines):**
> Developed full-stack web application featuring article CRUD API (Express.js/MongoDB), responsive React frontend (Vite/Tailwind), and AI enhancement service (OpenAI integration). Deployed frontend on Vercel and backend on Render with 13+ live sample articles.

**Technologies:**
Node.js • Express.js • MongoDB • React • Tailwind CSS • OpenAI API • Puppeteer • Vite

**Key Points to Include:**
- ✅ **Full-stack application** (3 independent components)
- ✅ **REST API design** with proper CRUD operations
- ✅ **AI integration** (OpenAI for content enhancement)
- ✅ **Modern frontend** (React 19, Vite, responsive design)
- ✅ **Production deployment** (Vercel + Render)
- ✅ **Database design** (MongoDB with Mongoose schemas)
- ✅ **Input validation** (Security-focused with express-validator)
- ✅ **Web scraping** (Cheerio, Puppeteer for content)
- ✅ **ML Analytics** (Sentiment, readability, entities extraction)

### 🎯 Interview Talking Points

**1. Architecture & Design**
> "The project consists of three independent services: a REST API backend, a React frontend, and an AI enhancement service. They communicate via HTTP APIs, making it loosely coupled and easy to scale. The architecture demonstrates microservices thinking."

**2. AI Integration Challenge**
> "Integrating OpenAI API was interesting because I had to handle API rate limits, fallback mechanisms when APIs fail, and batch processing. I also had to structure prompts effectively to generate high-quality enhanced content."

**3. Database Design**
> "I designed the MongoDB schema to store both original and enhanced versions of articles. Using the `original: boolean` flag allows filtering, and the analytics subdocument contains AI-extracted metadata (sentiment, keywords, entities)."

**4. Frontend-Backend Communication**
> "The React frontend uses Axios for HTTP requests and handles loading states, error cases, and real-time data fetching. The backend implements CORS and validates all inputs with express-validator before storing in the database."

**5. Deployment & DevOps**
> "I deployed the frontend on Vercel for optimized React hosting and the backend on Render for easy GitHub integration. Both support auto-deployment on git push, and environment variables are managed via their dashboards for security."

**6. Security Considerations**
> "I implemented input validation on all API endpoints, used MongoDB Atlas's IP whitelist, kept sensitive credentials in .env files with .gitignore, and plan to add rate limiting in production. I also learned about the importance of secret rotation."

**7. What You'd Do Differently**
> "If building again, I'd:
> - Add unit tests with Jest
> - Implement proper authentication/JWT
> - Add rate limiting middleware
> - Use TypeScript for type safety
> - Create Docker containers for consistent deployment
> - Set up CI/CD with GitHub Actions"

**8. Performance & Scalability**
> "The application can handle multiple concurrent requests thanks to Node.js event loop. MongoDB Atlas handles database scaling. For the enhancement service, I batch process articles to avoid API rate limits."

### 🔗 Sharing Your Project

**LinkedIn Headline Option:**
> Building SmartArticle AI: Full-Stack Web App with AI Content Enhancement | React • Node.js • OpenAI 🚀

**GitHub Pin Order:**
1. SmartArticle AI (this: comprehensive, deployed, full-stack)
2. [Your other top project]
3. [Your other top project]

**Portfolio Website Section:**
```html
<project>
  <title>SmartArticle AI</title>
  <description>Full-stack SPA with AI content enhancement</description>
  <link href="repo-link">
  <link href="live-demo-link">
  <img src="screenshot.png">
  <technologies>
    React, Node.js, MongoDB, OpenAI, Tailwind
  </technologies>
</project>
```

**Cover Letter Mention:**
> "I developed SmartArticle AI, a full-stack application demonstrating proficiency in modern web technologies: a REST API backend (Express.js/MongoDB), responsive React frontend, AI integration (OpenAI), and successful production deployment (Vercel/Render). The project showcases my ability to design scalable architectures, implement security best practices, and deliver complete end-to-end solutions."

### ⭐ Star This If It Helps

If this project setup helped your portfolio, consider starring or sharing!
- GitHub: [Link to repo]
- Live: [Link to demo]
- Contact: For collaboration opportunities

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### MongoDB Connection Issues

**Error:** `connect ECONNREFUSED 127.0.0.1:27017` or `Cannot connect to MongoDB`

**Solutions:**
```bash
# 1. Check if MongoDB is running
# For local MongoDB:
brew services list  # macOS
# Should show: mongodb-community started

# 2. Check connection string in .env
# Must include credentials if using MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# 3. Verify credentials
# - Username and password correct in .env
# - User exists in MongoDB Atlas
# - Database name exists

# 4. Check network access
# In MongoDB Atlas:
# - Network Access → Add Current IP
# - Or use 0.0.0.0/0 for development (NOT safe for production)

# 5. Test connection
mongo "your-connection-string-here"
```

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**
```bash
# Find process using port
lsof -i :5000

# Kill process (macOS/Linux)
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev

# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Module Not Found Errors

**Error:** `Cannot find module 'express'`, `Cannot find module 'react'`, etc.

**Solutions:**
```bash
# Reinstall all dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

# Or for frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Check Node.js version (must be 18+)
node --version
npm --version
```

### CORS Errors (Frontend can't reach Backend)

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solutions:**
```bash
# 1. Ensure backend is running
npm run dev  # in backend directory

# 2. Check frontend API URL in .env
VITE_API_URL=http://localhost:5000

# 3. Verify CORS enabled in backend
# backend/server.js should have:
const cors = require('cors');
app.use(cors());

# 4. Check both services are on localhost
# Frontend: http://localhost:5173
# Backend: http://localhost:5000

# 5. Full URL check in browser console
# Network tab should show requests to http://localhost:5000/api/...
```

### OpenAI API Errors

**Error:** `401 Unauthorized`, `Invalid API Key`, or `Quota exceeded`

**Solutions:**
```bash
# 1. Verify API key in .env
OPENAI_API_KEY=sk-proj-your-actual-key

# 2. Check key is valid
# https://platform.openai.com/api-keys
# - Key should start with "sk-proj-"
# - Not expired or revoked

# 3. Check API quota
# https://platform.openai.com/account/usage/overview
# - May need to add billing info

# 4. Verify BACKEND_URL in enhancer/.env
BACKEND_URL=http://localhost:5000

# 5. Test manually
curl -X GET http://localhost:5000/api/articles
```

### Frontend Shows "Loading Intelligence..." Forever

**Error:** Frontend stuck on loading screen

**Solutions:**
```bash
# 1. Check if backend is running
curl http://localhost:5000/api/articles
# Should return JSON

# 2. Check browser console for errors
# Open DevTools → Console tab
# Look for error messages

# 3. Check frontend .env
cat frontend/.env
# VITE_API_URL should be http://localhost:5000

# 4. Check network tab
# Should see requests to http://localhost:5000/api/articles
# If 0 requests, frontend isn't trying to connect

# 5. Clear browser cache
# DevTools → Application → Clear Storage → Clear site data
```

### Backend Returns Empty Article List

**Error:** `GET /api/articles` returns `[]`

**Causes & Solutions:**
```bash
# 1. No articles in database yet
# Create one:
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "content": "Test content here",
    "original": true
  }'

# 2. MongoDB connection is not using same database
# Check that backend .env and enhancer .env have same MONGODB_URI

# 3. Articles filtered incorrectly
# Check MongoDB Atlas directly for articles

# 4. Different MongoDB instances
# Make sure not connecting to multiple MongoDB instances
```

### Enhancer Script Not Creating Enhanced Articles

**Error:** `node enhancer/enhance.js` runs but no enhanced articles appear

**Solutions:**
```bash
# 1. Verify backend is running
npm run dev  # in backend directory

# 2. Check enhancer .env
cat enhancer/.env
# MONGODB_URI should match backend
# OPENAI_API_KEY should be valid
# BACKEND_URL should be http://localhost:5000

# 3. Check for error messages in console
node enhancer/enhance.js 2>&1 | tee enhancer.log

# 4. Test API connectivity from enhancer
curl http://localhost:5000/api/articles

# 5. Verify OpenAI API quota and credits
# https://platform.openai.com/account/usage/overview
```

### "Cannot GET /" on Frontend

**Error:** Blank page or "Cannot GET /" message

**Solutions:**
```bash
# 1. Check frontend is running
npm run dev  # in frontend directory
# Should show: ➜ Local: http://localhost:5173

# 2. Check if on correct port
# Open: http://localhost:5173
# NOT: http://localhost:5000

# 3. Rebuild frontend
cd frontend
npm run build
npm run preview

# 4. Check vite.config.js
cat vite.config.js
# Should have proper React plugin configured
```

## Troubleshooting

## Acknowledgments

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