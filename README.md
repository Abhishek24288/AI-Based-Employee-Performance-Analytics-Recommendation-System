# Guruji AI Recruiter Suite - Candidate Profile Shortlisting System

Guruji AI Recruiter Suite is a production-ready, full-stack MERN application integrated with OpenRouter AI for modern talent acquisition and recruitment workflows. Recruiters can register candidate profiles, run highly granular exact skill-matching filters, view detailed candidate analytics, and generate advanced AI shortlists with ranked profiles and fit explanations using neural intelligence.

---

## 🚀 Key Features

- **Candidate Profiler (CRUD)**: Easily register, view, search, and delete candidate cards with key skills, biography, and experience indicators.
- **Dynamic Recruiting Analytics**: Beautiful analytics dashboard using Recharts for live monitoring of candidate skill distributions, experience splits, and total pool size.
- **Rule-based Skill Matcher**: Specify required skills, preferred skills, and experience constraints to automatically categorize candidates into **High Match (80%+)**, **Medium Match (50-79%)**, or **Low Match (<50%)** pools.
- **OpenRouter AI Shortlisting**: Deploys an advanced neural agent via OpenRouter to evaluate candidates based on full portfolios (bio, exact skills, experience) beyond mere keyword matches, providing ranked recommendations, strengths, and weakness summaries.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS (Custom Dark UI Theme), React Router Dom, Axios, Recharts, Lucide Icons, Vite
- **Backend**: Node.js, Express.js, MongoDB + Mongoose (ODM), Axios (for OpenRouter connections)
- **AI Core**: OpenRouter API Integration (deploys stable models like `gpt-4o`)

---

## 📂 Folder Structure

```bash
candidate-shortlister/
 ├── backend/
 │    ├── config/           # Database configurations
 │    ├── controllers/      # Route controllers (candidate, match, ai)
 │    ├── models/           # Mongoose Database Schemas (Candidate)
 │    ├── routes/           # API routes
 │    ├── utils/            # Data seed script
 │    ├── .env              # Environment configurations (local)
 │    └── server.js         # Entrypoint
 ├── frontend/
 │    ├── src/
 │    │    ├── components/  # Reusable elements (Sidebar, Navbar, Cards)
 │    │    ├── context/     # React state managers (CandidateContext)
 │    │    ├── pages/       # Navigation screens (Dashboard, AI recommendations, lists)
 │    │    ├── App.jsx      # Master Router
 │    │    └── index.css    # Global styling overrides & animations
 │    ├── tailwind.config.js# Tailwind configurations
 │    └── package.json
 └── README.md
```

---

## ⚙️ Setup and Installation

### Prerequisites
- Node.js (v16.x or newer)
- MongoDB (Local installation or MongoDB Atlas Connection String)
- OpenRouter API Key (For AI neural ranking)

### Step 1: Clone and Configure Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the node packages:
   ```bash
   npm install
   ```
3. Copy the sample environment file to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Open the newly created `.env` file and insert your configuration parameters:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/database_name   # Or local mongodb://127.0.0.1:27017/dbname
   OPENROUTER_API_KEY=your_actual_openrouter_api_key
   ```

### Step 2: Seed the Database
To view the analytics charts and matchers instantly without having to register 10 profiles by hand, run the seeding script:
```bash
node utils/seed.js
```
*Note: Make sure your MongoDB service is running before executing the script.*

### Step 3: Run the Backend
Start the Express server in development mode:
```bash
node server.js
```
The server will bind and listen on `http://localhost:5000`.

### Step 4: Configure and Run Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Boot the development dev-server:
   ```bash
   npm run dev
   ```
4. Access the web interface at `http://localhost:5173` (or the port specified by Vite in terminal).

---

## 📡 API Reference Documentation

### 1. Candidate Operations

#### Create a Candidate
- **Endpoint**: `POST /api/candidates`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "name": "Rahul Sharma",
    "email": "rahul@gmail.com",
    "skills": ["React", "Node.js", "MongoDB"],
    "experience": 5,
    "bio": "Senior MERN stack developer with AWS cloud skills."
  }
  ```

#### Fetch All Candidates
- **Endpoint**: `GET /api/candidates`
- **Response**: Array of candidate objects ordered by creation date.

#### Fetch Candidate By ID
- **Endpoint**: `GET /api/candidates/:id`

#### Delete Candidate
- **Endpoint**: `DELETE /api/candidates/:id`

---

### 2. Rule-Based Matcher

#### Compute Skill Overlap
- **Endpoint**: `POST /api/match`
- **Body**:
  ```json
  {
    "requiredSkills": ["React", "Node.js"],
    "preferredSkills": ["MongoDB"],
    "minExperience": 2
  }
  ```
- **Response Schema**:
  ```json
  [
    {
      "candidate": { ... },
      "matchedSkills": ["React", "Node.js"],
      "matchedPreferred": ["MongoDB"],
      "missingSkills": [],
      "matchScore": 100,
      "matchCategory": "High Match",
      "meetsExperience": true
    }
  ]
  ```

---

### 3. OpenRouter AI Neural Ranking

#### Run AI shortlister
- **Endpoint**: `POST /api/ai/shortlist`
- **Body**:
  ```json
  {
    "requiredSkills": ["React", "Node.js"],
    "preferredSkills": ["MongoDB"],
    "minExperience": 3,
    "jobDescription": "Looking for a seasoned developer to spearhead API architecture and dashboard creation."
  }
  ```
- **Response Schema**:
  ```json
  {
    "topCandidates": ["6412384a...", "6412384b..."],
    "aiExplanation": "Overall summary details explaining talent fits...",
    "ranking": [
      {
        "candidateId": "6412384a...",
        "name": "Rahul Sharma",
        "rank": 1,
        "fitScore": 95,
        "explanation": "Highly experienced in MERN stack with rich biography metrics...",
        "strengths": ["Strong AWS deployment capability", "5+ years MERN experience"],
        "weaknesses": ["None identified"]
      }
    ]
  }
  ```

---

## 🎨 UI Custom CSS Details
The frontend is crafted using customized dark aesthetics designed for recruiters. You can view the CSS specifications, scrollbars, and card glowing parameters directly in:
`frontend/src/index.css`
