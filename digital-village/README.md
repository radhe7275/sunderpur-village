# 🌾 Digital Village – Our Village, Our Pride (डिजिटल ग्राम पोर्टल)

A modern, attractive, fully responsive, and functional full-stack web application celebrating rural heritage, community facilities, transparent Gram Panchayat e-governance, and sustainable development.

---

## 📋 Table of Contents
1. [Tech Stack](#-tech-stack)
2. [Project Architecture](#-project-architecture)
3. [Key Features](#-key-features)
4. [Prerequisites](#-prerequisites)
5. [Complete Setup & Installation Guide](#-complete-setup--installation-guide)
6. [Database Setup (MongoDB & Mongoose)](#-database-setup-mongodb--mongoose)
7. [Running the Application](#-running-the-application)
8. [API Endpoints Reference & Testing](#-api-endpoints-reference--testing)
9. [VS Code Recommended Setup](#-vs-code-recommended-setup)
10. [Admin Dashboard Usage](#-admin-dashboard-usage)
11. [License & Credits](#-license--credits)

---

## 🛠 Tech Stack

### Frontend:
- **HTML5**: Semantic, accessible markup.
- **CSS3**: Custom CSS with Glassmorphism, animations, responsive CSS Grid and Flexbox, Dark & Light mode. *(Zero React, Zero Bootstrap, Zero Tailwind)*
- **Vanilla JavaScript (ES6+)**: Dynamic DOM manipulation, asynchronous Fetch API, live countdown clocks, animated counters, lightbox modal, form validation.
- **Font Awesome 6**: Rich vector icons for all 16 facilities, cultural events, heroes, and navigation.
- **Google Fonts**: *Outfit* (display headings) and *Poppins* (readable body text).

### Backend:
- **Node.js**: Asynchronous JavaScript runtime environment.
- **Express.js**: REST API server and routing middleware.
- **MongoDB & Mongoose**: Object Data Modeling (ODM) schemas and persistent document database (with seamless in-memory fallback for immediate zero-config previews).
- **CORS & dotenv**: Cross-origin requests and environment configuration management.

---

## 📁 Project Architecture

```
digital-village/
│
├── frontend/
│   ├── index.html          # Semantic HTML5 single-page application structure
│   ├── style.css           # Premium Indian village green theme, glassmorphism & responsive CSS
│   ├── script.js           # Client-side JavaScript (Fetch API, countdowns, filters, modals)
│   └── images/             # Visual assets & photography repository
│
├── backend/
│   ├── server.js           # Express server entry point & static file hosting
│   ├── package.json        # Backend dependencies & run scripts
│   ├── .env                # Environment variables (PORT, MONGODB_URI)
│   ├── config/
│   │   ├── db.js           # MongoDB connection with Mongoose & resilient fallback
│   │   ├── initialData.js  # Rich seed data for all 16 amenities, 6 projects, 20 photos
│   │   └── store.js        # Unified data controller supporting Mongoose & offline mode
│   ├── models/
│   │   ├── Village.js      # Village demographic, history & contact schema
│   │   ├── Facility.js     # 16 Public amenities model
│   │   ├── Project.js      # Development projects with progress & budget
│   │   ├── Event.js        # Scheduled assemblies & cultural events
│   │   ├── Gallery.js      # 20-photo categorized gallery model
│   │   ├── Contact.js      # Citizen grievances & contact inquiries
│   │   ├── News.js         # Gram Sabha news & government welfare schemes
│   │   └── Suggestion.js   # Citizen development suggestions
│   └── routes/
│       ├── villageRoutes.js    # /api/village routes
│       ├── facilityRoutes.js   # /api/facilities CRUD routes
│       ├── projectRoutes.js    # /api/projects CRUD routes
│       ├── eventRoutes.js      # /api/events CRUD routes
│       ├── galleryRoutes.js    # /api/gallery routes
│       ├── contactRoutes.js    # /api/contact citizen submission routes
│       ├── newsRoutes.js       # /api/news announcements routes
│       └── suggestionRoutes.js # /api/suggestions development feedback routes
│
└── README.md               # Complete setup, API documentation and developer manual
```

---

## ✨ Key Features

1. **Sticky Navigation Bar**:
   - Village logo with wheat emblem (`Sundarpur Digital Village 🌾`).
   - Links: Home, About, Facilities, Development, Culture, Events, Gallery, Places, News, Contact, and Admin.
   - Mobile hamburger drawer with smooth slide-in transition.
   - Dark/Light mode switcher with `localStorage` persistence.
   - Active scroll-spy link indicator.

2. **Hero Section**:
   - Heading: *“Welcome to Our Village 🌾”*.
   - Subtitle: *“Our Village, Our Culture, Our Pride”*.
   - Fast action buttons: *Explore Village* & *View Gallery*.
   - Trust highlights: 100% Solar Powered, Har Ghar Nal Se Jal, BharatNet Fiber.

3. **Village Statistics**:
   - Animated numeric counters triggered on scroll:
     - **Population**: 5,420+
     - **Houses**: 1,180+
     - **Schools**: 4 Smart Campuses
     - **Roads**: 28 km All-Weather Paved Network
     - **Green Areas**: 78% Lush Agricultural Land
     - **Water Sources**: 14 Protected RO Plants & Stepwells

4. **About Village & Gram Panchayat**:
   - Village history dating back to 1842.
   - Sarpanch, Up-Sarpanch, and Panchayat Secretary directory.
   - Interactive *“Read Full History”* accordion toggle.

5. **Exactly 16 Public Facilities (Dynamic from Backend)**:
   1. Education (Smart Digital Classrooms & E-Library)
   2. Healthcare (24/7 Primary Health Centre & Maternity)
   3. Drinking Water (Har Ghar Nal Se Jal RO Network)
   4. Electricity (24/7 Solar Microgrid)
   5. Roads (PMGSY Paved Drainage Roads)
   6. Internet (BharatNet Gigabit Optical Fiber)
   7. Local Market (Haat Bazaar & Mandi)
   8. Temple (Ancient Someshwar Mahadev Mandir)
   9. Gram Panchayat (E-GramSwaraj Digital Secretariat)
   10. Transportation (Electric Mini-Bus & E-Rickshaws)
   11. Agriculture (Krishi Seva Kendra & Soil Testing Lab)
   12. Banking (Customer Service Point & Micro-ATM)
   13. Post Office (India Post & IPPB Payments)
   14. Community Center (600-Capacity Banquet Hall)
   15. Sports Ground (Stadium, Running Track & Open Gym)
   16. Street Lights (280 Automated Solar LED Poles)

6. **Development Projects**:
   - Road Development (82% complete)
   - Solar Street Lights (100% completed)
   - Clean Water Project (100% completed)
   - School Development (68% complete)
   - Village Park & Amrit Sarovar (90% complete)
   - Digital Village Common Service Center (100% completed)

7. **Culture & Sacred Festivals**:
   - Holi, Diwali, Chhath Puja, Independence Day, Republic Day, and Local Village Festival (Gram Devi Mela).

8. **Events with Real-Time Countdown**:
   - Live JavaScript timer calculating Days, Hours, Minutes, and Seconds until event start time.

9. **20-Photo Responsive Gallery**:
   - Filter buttons: *All*, *Nature*, *People*, *Festivals*, *Development*.
   - Fullscreen Lightbox Modal with keyboard navigation (`Left`, `Right`, `Escape`).

10. **Important Places & Interactive Map**:
    - School, Health Center, Temple, Panchayat Bhawan, Haat Bazaar, Bus Stop.
    - Interactive visual layout map with pins and transport guides.

11. **Our Village Heroes ❤️**:
    - Profiles of selfless rural champions: Teacher, Doctor, Farmer, Social Worker, and Village Leader.

12. **News & Announcements**:
    - Live updates on government welfare schemes (PM-Kisan, PM-Awas) and Panchayat notices.

13. **Contact & Suggestion System**:
    - Real-time client-side input validation.
    - Submits directly to backend API and database.
    - Toast notifications on success/error.

14. **Gram Panchayat Admin Dashboard**:
    - Add, edit, or delete facilities.
    - Schedule new events and delete past ones.
    - Update project status and execution progress.
    - Add and delete gallery photos and news announcements.
    - View all citizen feedback, grievances, and development suggestions.

---

## 💻 Prerequisites

Ensure you have installed:
- [Node.js](https://nodejs.org/) (Version 18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- Optional: [MongoDB Community Server](https://www.mongodb.com/try/download/community) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cloud database.

*(Note: If MongoDB is not running locally, the server automatically uses an intelligent in-memory fallback, allowing all features to be tested immediately without database configuration!)*

---

## 🚀 Complete Setup & Installation Guide

### Step 1: Open the Project in Terminal
```bash
cd digital-village
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

Installed packages:
- `express` (~4.21.2) - REST API framework
- `mongoose` (~8.8.2) - MongoDB ODM
- `cors` (~2.8.5) - Cross-Origin Resource Sharing
- `dotenv` (~16.4.5) - Environment configuration
- `nodemon` - Hot-reload development tool (dev dependency)

---

## 🗄 Database Setup (MongoDB & Mongoose)

### Option A: Local MongoDB
1. Start your local MongoDB service:
   ```bash
   # On Windows (Command Prompt / Powershell):
   net start MongoDB
   
   # On macOS (Homebrew):
   brew services start mongodb-community
   
   # On Linux (systemd):
   sudo systemctl start mongod
   ```
2. Verify the connection string in `backend/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/digital_village
   ```

### Option B: MongoDB Atlas (Cloud Free Tier)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Get your connection URI string.
3. Update `backend/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/digital_village?retryWrites=true&w=majority
   ```

---

## ▶️ Running the Application

### 1. Start the Backend Server
From the `backend/` directory:
```bash
npm start
```
*Or for automatic restart during development:*
```bash
npm run dev
```

You should see output similar to:
```
🌾 Digital Village Server running on http://localhost:5000
📁 Serving frontend from .../digital-village/frontend
✅ MongoDB Connected successfully: 127.0.0.1
```

### 2. View the Frontend
Since Express is configured to serve the frontend statically:
1. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```
2. Alternatively, you can open `digital-village/frontend/index.html` directly or serve it using VS Code Live Server.

---

## 📡 API Endpoints Reference & Testing

You can test these endpoints using **Postman**, **cURL**, or your web browser.

### Public Endpoints:
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/village` | Retrieve village profile, history, demographic census & heroes |
| `GET` | `/api/facilities` | Retrieve all 16 public facilities |
| `GET` | `/api/projects` | Retrieve all development projects with progress percentage |
| `GET` | `/api/events` | Retrieve upcoming village assemblies and programs |
| `GET` | `/api/gallery` | Retrieve 20 gallery photographs (Supports `?category=Nature`) |
| `GET` | `/api/news` | Retrieve latest announcements and government schemes |
| `POST`| `/api/contact` | Submit citizen grievance or message |
| `POST`| `/api/suggestions` | Submit village development suggestion |

### Admin CRUD Endpoints:
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/facilities` | Add a new public amenity |
| `PUT`  | `/api/facilities/:id` | Update facility details |
| `DELETE`| `/api/facilities/:id` | Remove a facility |
| `POST` | `/api/events` | Schedule a new event |
| `DELETE`| `/api/events/:id` | Cancel an event |
| `POST` | `/api/projects` | Register a new development project |
| `PUT`  | `/api/projects/:id` | Update project execution status & progress |
| `POST` | `/api/gallery` | Upload photo metadata to gallery |
| `DELETE`| `/api/gallery/:id` | Delete photo from gallery |
| `POST` | `/api/news` | Publish news announcement |
| `DELETE`| `/api/news/:id` | Remove news announcement |
| `GET`  | `/api/contact` | Review all submitted citizen messages |
| `GET`  | `/api/suggestions` | Review all citizen development suggestions |

### Example cURL Commands:

#### 1. Fetch all 16 Facilities:
```bash
curl http://localhost:5000/api/facilities
```

#### 2. Submit a Citizen Message:
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Radheshyam Kumar",
    "email": "radheshyam@example.com",
    "phone": "+91 98765 43210",
    "subject": "Solar Light Request",
    "message": "Please install one additional solar light near Ward 4 corner."
  }'
```

---

## 💻 VS Code Recommended Setup

1. Open VS Code:
   ```bash
   code digital-village
   ```
2. Recommended Extensions:
   - **Live Server** (by Ritwick Dey) – for live reloading of static files.
   - **Prettier** – Code formatter.
   - **Thunder Client** or **Postman** – for direct API testing within VS Code.
   - **MongoDB for VS Code** – to inspect collections and documents visually.

---

## 🛡 Admin Dashboard Usage

1. Open the portal in your browser: `http://localhost:5000`
2. Click the **"Admin"** button located on the top right navigation bar.
3. The Admin modal will open with 6 tabs:
   - **Facilities**: Add new facilities or delete existing ones.
   - **Events**: Schedule upcoming Gram Sabha meetings or health camps.
   - **Projects**: Register projects or toggle completion status.
   - **Gallery**: Add and manage categorized photos.
   - **News**: Publish urgent announcements.
   - **Messages**: Read all citizen messages and suggestions in real time.

---

## 🌾 Social Links & Contact

- **Instagram**: [https://www.instagram.com/shyamzone_7/](https://www.instagram.com/shyamzone_7/)
- **Village Secretariat**: Gram Panchayat Bhawan, Ward No. 04, Sundarpur, Varanasi, UP – 221001
- **Helpline**: +91 98765 43210
- **Official Email**: `panchayat@sundarpur-village.in`

---

*Made with dedication for Rural India's Digital Empowerment 🇮🇳*
