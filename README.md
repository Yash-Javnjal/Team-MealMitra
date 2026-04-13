# 🌍 Extra-To-Essential (MealMitra)

[![React](https://img.shields.io/badge/React-19.2.4-61DAFB.svg?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.22.1-339933.svg?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2.1-000000.svg?logo=express)](https://expressjs.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-010101.svg?logo=socket.io)](https://socket.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E.svg?logo=supabase)](https://supabase.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28.svg?logo=firebase)](https://firebase.google.com/)

---

## 📖 Introduction

**Extra-To-Essential (MealMitra)** is a full-stack, real-time food redistribution platform that bridges the gap between surplus food and hunger. The platform connects food donors (restaurants, caterers, individuals) with verified NGOs through an intelligent geolocation-based matching system, ensuring that surplus food reaches those who need it most — before it goes to waste.

In India alone, approximately **68.8 million tonnes of food** is wasted annually, while **194.4 million people** go hungry every day. Extra-To-Essential directly addresses this paradox by creating a technology-driven ecosystem where every surplus meal finds a purpose.

Built with modern web technologies including React 19, Node.js, Express 5, Socket.IO, Firebase Authentication, and Supabase (PostgreSQL), the platform provides real-time tracking, live notifications, multi-language support, carbon credit tracking, and role-based dashboards to create an efficient, transparent, and impactful ecosystem for food redistribution.

---

## 💡 Problem Statement

Food waste is one of the most critical challenges of our time:

- **One-third** of all food produced globally is wasted every year.
- In India, **40% of food** is wasted before it reaches the consumer.
- Meanwhile, **millions of families** do not have access to nutritious meals on a daily basis.
- Food decomposition in landfills contributes to **methane emissions**, accelerating climate change.

The core problem is **logistical disconnect** — donors have surplus food but no easy way to connect with NGOs who can distribute it. Traditional methods rely on phone calls, WhatsApp groups, or word-of-mouth, which are inefficient, untrackable, and unreliable.

**Extra-To-Essential solves this by providing a digital platform** that automates the entire surplus food rescue cycle — from listing to pickup to delivery — with real-time tracking at every step.

---

## 🎯 Objectives

1. **Reduce Food Waste** — Provide a streamlined platform for donors to list surplus food in under 2 minutes.
2. **Feed the Hungry** — Connect surplus food with verified NGOs who distribute it to communities in need.
3. **Real-Time Coordination** — Enable live tracking, instant notifications, and seamless volunteer assignment.
4. **Environmental Impact** — Track and visualize carbon credits saved through food rescue operations.
5. **Transparency & Trust** — Admin-verified NGOs, delivery confirmations, and impact metrics ensure accountability.
6. **Accessibility** — Multi-language support (English, Hindi, Marathi, Kannada, Telugu) for wider reach.
7. **Scalability** — Cloud-based architecture (Supabase + Firebase) that can scale to serve any city or region.

---

## 📌 Core Concept

> **Surplus food should not be wasted when it can feed someone in need.**

Extra-To-Essential eliminates the logistical disconnect between donors and NGOs by providing:

- ✅ Real-time donation listing and tracking
- ✅ Geolocation-based matching of donors with nearby NGOs
- ✅ Volunteer coordination for pickup and delivery
- ✅ Live status updates and notifications via WebSockets
- ✅ Impact metrics and carbon credit tracking
- ✅ Automated email notifications at every stage
- ✅ Admin dashboard for platform governance

---

## 👥 Platform Roles

The system operates through **four primary user roles**, each with a dedicated dashboard and specific responsibilities:

### 🎁 1. Donor

Individuals, restaurants, caterers, or organizations with surplus food.

| Capability | Description |
|---|---|
| Create Donation Listings | List surplus food with details like type, quantity (kg), expiry time, and pickup location |
| Location Pinpointing | Mark exact pickup location on an interactive map (Leaflet) |
| Real-Time Tracking | Monitor donation status from "listed" → "claimed" → "picked up" → "delivered" |
| Delivery Confirmation | Receive confirmation when food is successfully delivered |
| Impact Dashboard | View personal impact metrics — total food donated, meals provided, CO₂ saved |
| Carbon Wallet | Track impact points and carbon credits earned through donations |
| Profile Management | Update personal details, organization name, contact information |
| Donation History | Access complete history of all past donations with status and outcomes |

### 🏢 2. NGO (Non-Governmental Organization)

Verified organizations that receive and distribute food donations.

| Capability | Description |
|---|---|
| Browse Nearby Donations | View all available donations within proximity, sorted by distance |
| Accept Listings | Claim food donations based on organizational needs |
| Assign Volunteers | Assign registered volunteers for food pickup and delivery |
| Volunteer Management | Add, edit, and manage volunteer roster with contact details |
| Operations Map | View all active donations and pickup locations on a live map |
| Activity Log | Track all session activities and historical operations |
| Targeted Food Requests | Search donor inventory and request specific food items |
| Carbon Wallet | View verified environmental impact and carbon credits |
| Real-Time Notifications | Receive instant push notifications when new donations are listed nearby |
| Overview Dashboard | See operations overview with stats cards, recent incoming, and active pickups |

### 🚚 3. Volunteer

Individuals registered under an NGO who handle the physical pickup and delivery of food.

| Capability | Description |
|---|---|
| Receive Assignments | Get notified when assigned to a pickup task by the NGO |
| Navigate to Donor | View donor location and pickup details |
| Transport Food | Handle the physical transfer of food from donor to NGO |
| Update Status | Mark delivery stages — "picked up", "in transit", "delivered" |
| Delivery Confirmation | Confirm successful delivery completion |

### 🛡️ 4. Admin

Platform administrators who ensure system integrity and governance.

| Capability | Description |
|---|---|
| NGO Verification | Review and approve/reject NGO registration applications |
| Donor Management | View and manage all registered donors on the platform |
| Donation Monitoring | Monitor all donations across the platform with expiry tracking |
| Volunteer Network | Oversee the complete volunteer network and their NGO assignments |
| Activity Monitor | Track real-time platform activity and operations |
| Map Control | View all donations, NGOs, and donors on a centralized map |
| System Logs | Access detailed system logs for debugging and audit |
| Alert Center | Manage platform alerts and critical notifications |
| Platform Statistics | View comprehensive platform-wide statistics and metrics |

---

## 🔄 System Workflow

The complete donation lifecycle follows these steps:

```
┌─────────────┐     ┌──────────────────┐     ┌────────────────┐
│   DONOR     │     │    PLATFORM      │     │      NGO       │
│  Creates    │────▶│  Notifies nearby │────▶│  Reviews and   │
│  Listing    │     │  verified NGOs   │     │  Accepts       │
└─────────────┘     └──────────────────┘     └───────┬────────┘
                                                     │
┌─────────────┐     ┌──────────────────┐     ┌───────▼────────┐
│  IMPACT     │     │   VOLUNTEER      │     │      NGO       │
│  Tracked &  │◀────│   Picks up and   │◀────│  Assigns       │
│  Recorded   │     │   Delivers       │     │  Volunteer     │
└─────────────┘     └──────────────────┘     └────────────────┘
```

### Step-by-Step Flow:

1. **📝 Donor Creates Listing** — Donor fills in food details (type, quantity, expiry time) and marks the pickup location on the map.
2. **🔔 NGOs Are Notified** — The system uses geolocation to find nearby verified NGOs and sends them real-time notifications via Socket.IO.
3. **✅ NGO Accepts Listing** — The NGO reviews the donation details and accepts the listing. The donor receives a confirmation email.
4. **👤 Volunteer Is Assigned** — The NGO assigns an available volunteer from their roster for the pickup.
5. **🚚 Volunteer Picks Up Food** — The volunteer navigates to the donor location, collects the food, and updates the status.
6. **✓ Delivery Is Confirmed** — The volunteer delivers the food to the NGO and marks the delivery as complete. All parties receive email notifications.
7. **📊 Impact Is Tracked** — The system calculates and records impact metrics including meals provided, CO₂ saved, and carbon credits earned.

---

## ✨ Key Features

### 🔴 Real-Time Communication (Socket.IO)
- Live donation status updates pushed to all stakeholders instantly
- New donation notifications appear as bell alerts on the NGO dashboard
- No page refresh needed — data updates in real-time across all connected clients
- Room-based socket architecture for targeted notifications

### 📍 Geolocation-Based Matching
- Donors mark their exact pickup location on an interactive Leaflet map
- System calculates distance between donors and NGOs using the Haversine formula
- NGOs see donations sorted by proximity with distance displayed
- Geocoding service converts addresses to coordinates and vice versa

### ✓ NGO Verification System
- NGOs must register with organization details, registration number, and contact person
- Admin reviews and approves/rejects NGO applications
- Only verified NGOs can browse and accept donations
- Ensures trust and accountability in the ecosystem

### 🔔 Multi-Channel Notifications
- **Real-time push notifications** via Socket.IO for instant alerts
- **Email notifications** via Nodemailer at every stage:
  - Welcome emails for new donors and NGOs
  - Listing created notifications to matched NGOs
  - Claim accepted confirmation to donors
  - Delivery assigned alerts to volunteers
  - Delivery completed summary to all parties
- **In-app toast notifications** with auto-dismiss and stacking

### 📊 Impact Metrics & Carbon Wallet
- Track total food saved (kg), meals provided, and CO₂ emissions prevented
- **Impact Points System** — Earn points for every successful donation cycle
- **Carbon Credit Conversion** — 100 impact points = 1 Carbon Credit
- Animated arc gauge and progress bar showing real-time progress
- Cinematic conversion animation when threshold is crossed
- Live dashboard on the landing page showing platform-wide metrics

### 🗺️ Interactive Maps (Leaflet)
- Donor dashboard: Track active donations with map markers
- NGO dashboard: View all nearby donations and pickup locations
- Admin dashboard: Centralized map view of all platform activity
- Click-to-set location for donation listings

### 🔐 Secure Authentication (Firebase)
- Firebase Authentication for secure login/registration
- JWT-based token verification on every API call
- Role-based access control (Donor, NGO, Volunteer, Admin)
- Protected routes that redirect unauthorized users
- Session management with token refresh

### 🌍 Multi-Language Support (i18n)
- Full internationalization using i18next and react-i18next
- **5 supported languages:**
  - 🇬🇧 English (en)
  - 🇮🇳 Hindi (hi)
  - 🇮🇳 Marathi (mr)
  - 🇮🇳 Kannada (kn)
  - 🇮🇳 Telugu (te)
- Language switcher component accessible from the navbar
- All dashboard labels, buttons, and messages are translated
- Translation files stored in `public/locales/` directory

### 🎨 Premium UI & Animations
- **GSAP (GreenSock)** powered animations throughout the platform:
  - Cinematic page preloader with sequential reveal
  - Scroll-triggered section animations
  - Magnetic button hover effects
  - Counter animations for statistics
  - Parallax scrolling on the hero section
- **Framer Motion** for smooth React component transitions
- **Lenis** for buttery smooth page scrolling
- Responsive design that works on desktop, tablet, and mobile

### 📧 Automated Email System
- Professional HTML email templates for all notification types
- Templates include: Welcome Donor, Welcome NGO, Listing Created, Claim Accepted, Delivery Assigned, Delivery Completed
- Each email contains relevant details, action items, and branding
- Powered by Nodemailer with SMTP configuration

### 📰 Blog & Impact Stories
- Curated stories section on the landing page featuring donor, NGO, and volunteer experiences
- Dedicated stories page with detailed narratives
- Blog panel on the donor dashboard for inspiration

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.4 | UI component framework for building interactive user interfaces |
| Vite | 7.3.1 | Next-generation frontend build tool for fast development |
| React Router | 7.13.1 | Client-side routing and navigation between pages |
| GSAP | 3.14.2 | Professional-grade animations (scroll, timeline, morphing) |
| Framer Motion | 12.34.3 | React-specific animation library for component transitions |
| Leaflet | 1.9.4 | Open-source interactive maps for location visualization |
| Socket.IO Client | 4.8.3 | Real-time bidirectional communication with the server |
| Supabase Client | 2.97.0 | Client-side database queries and real-time subscriptions |
| i18next | 23.16.8 | Internationalization framework for multi-language support |
| react-i18next | 15.5.1 | React bindings for i18next |
| Lucide React | 0.564.0 | Beautiful, consistent icon library |
| Lenis | 1.3.17 | Smooth scrolling library for premium scroll experience |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 22.22.1 | JavaScript runtime for server-side execution |
| Express | 5.2.1 | Minimal web framework for building RESTful APIs |
| Socket.IO | 4.8.1 | Real-time event-based communication engine |
| Firebase Admin | 13.7.0 | Server-side authentication and token verification |
| Supabase | 2.99.0 | PostgreSQL database with real-time capabilities |
| Nodemailer | 8.0.2 | Email sending service for automated notifications |
| CORS | 2.8.6 | Cross-Origin Resource Sharing middleware |
| dotenv | 16.x | Environment variable management |
| Nodemon | - | Development server with auto-restart on file changes |

### Database & Cloud Services

| Service | Purpose |
|---|---|
| Supabase (PostgreSQL) | Primary database for users, listings, claims, deliveries, and impact data |
| Firebase Authentication | User authentication, token generation, and role management |
| SMTP (Gmail/Custom) | Email delivery for automated notifications |

---

## 📦 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher) — [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** package manager
- **Git** — [Download here](https://git-scm.com/)
- A **Firebase** project — [Create one here](https://console.firebase.google.com/)
- A **Supabase** project — [Create one here](https://supabase.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Yash-Javnjal/Team-MealMitra.git
cd Team-MealMitra
```

### Step 2: Backend Setup

```bash
cd E-to-E_backend
npm install
```

Create a `.env` file in the `E-to-E_backend/` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://localhost:5174

# Firebase Admin SDK Credentials
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=your_client_email@your_project.iam.gserviceaccount.com

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_service_role_key

# Email Configuration (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```

Start the backend server:

```bash
npm start
# Server will run on http://localhost:5000
```

### Step 3: Frontend Setup

```bash
cd ../e-to-e_frontend
npm install
```

Create a `.env` file in the `e-to-e_frontend/` directory:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id

# Backend API
VITE_BACKEND_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
# Application will be available at http://localhost:5173
```

### Step 4: Access the Application

Open your browser and navigate to:
- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`
- **Health Check:** `http://localhost:5000/health`

---

## 🗂️ Project Structure

```
Team-MealMitra/
│
├── E-to-E_backend/                    # Backend Server (Node.js + Express)
│   ├── config/                        # Firebase & Supabase configuration
│   │   ├── firebase.js                # Firebase Admin SDK initialization
│   │   └── supabase.js                # Supabase client setup
│   ├── middleware/                     # Express middleware
│   │   └── authMiddleware.js          # JWT token verification & role guards
│   ├── routes/                        # API route handlers
│   │   ├── admin.js                   # Admin operations (NGO verification, stats)
│   │   ├── auth.js                    # Authentication (register, login, verify)
│   │   ├── claims.js                  # Donation claiming by NGOs
│   │   ├── deliveries.js              # Delivery tracking & status updates
│   │   ├── donors.js                  # Donor profile & listing management
│   │   ├── geocode.js                 # Geocoding & reverse geocoding service
│   │   ├── impact.js                  # Impact metrics calculation
│   │   ├── listings.js                # Food listing CRUD operations
│   │   └── ngos.js                    # NGO operations & volunteer management
│   ├── services/                      # Business logic layer
│   │   ├── emailService.js            # Email sending with HTML templates
│   │   ├── geoMatchService.js         # Geolocation matching algorithms
│   │   ├── impactService.js           # Impact & carbon credit calculations
│   │   ├── notificationService.js     # Push notification handling
│   │   └── volunteerService.js        # Volunteer assignment logic
│   ├── templates/                     # HTML email templates
│   │   ├── welcomeDonor.html          # Welcome email for new donors
│   │   ├── welcomeNGO.html            # Welcome email for new NGOs
│   │   ├── listingCreated.html        # New listing notification
│   │   ├── claimAccepted.html         # Claim confirmation email
│   │   ├── deliveryAssigned.html      # Volunteer assignment email
│   │   └── deliveryCompleted.html     # Delivery completion summary
│   ├── utils/                         # Utility functions
│   ├── sql/                           # Database schema & queries
│   ├── server.js                      # Main server entry point
│   ├── package.json                   # Backend dependencies
│   └── .env                           # Environment variables (not in repo)
│
├── e-to-e_frontend/                   # Frontend Application (React + Vite)
│   ├── public/
│   │   └── locales/                   # i18n translation files
│   │       ├── en/                    # English translations
│   │       ├── hi/                    # Hindi translations
│   │       ├── mr/                    # Marathi translations
│   │       ├── kn/                    # Kannada translations
│   │       └── te/                    # Telugu translations
│   └── src/
│       ├── admin/                     # Admin Dashboard Module
│       │   ├── AdminDashboard.jsx     # Main admin dashboard layout
│       │   ├── AdminSidebar.jsx       # Admin navigation sidebar
│       │   ├── AdminHeader.jsx        # Admin header with search & controls
│       │   ├── OverviewPanel.jsx      # Platform overview statistics
│       │   ├── NgoManagement.jsx      # NGO verification & management
│       │   ├── DonorManagement.jsx    # Donor account management
│       │   ├── DonationMonitor.jsx    # Live donation monitoring
│       │   ├── VolunteerNetwork.jsx   # Volunteer network overview
│       │   ├── MapControl.jsx         # Centralized platform map
│       │   ├── ActivityMonitor.jsx    # Real-time activity tracker
│       │   ├── SystemLogs.jsx         # System log viewer
│       │   ├── AlertCenter.jsx        # Alert management center
│       │   └── AdminStyles.css        # Admin dashboard styles
│       │
│       ├── components/                # Shared/Landing Page Components
│       │   ├── Hero.jsx               # Hero section with video modal
│       │   ├── Navbar.jsx             # Navigation bar with language switcher
│       │   ├── Footer.jsx             # Footer with links and social media
│       │   ├── LiveDashboard.jsx      # Live impact statistics section
│       │   ├── Workflow.jsx           # "How It Works" workflow section
│       │   ├── ImpactSection.jsx      # Impact gallery with masonry layout
│       │   ├── BlogSection.jsx        # Blog/stories preview section
│       │   ├── CarbonCreditSection.jsx # Carbon credit explanation section
│       │   ├── CinematicPreloader.jsx # Animated page preloader
│       │   ├── ProtectedRoute.jsx     # Route guard for authenticated pages
│       │   ├── AuthPanel.jsx          # Login/Register authentication panel
│       │   ├── AuthImage.jsx          # Authentication page side image
│       │   ├── EssenceLine.jsx        # Decorative section divider
│       │   ├── CarbonWallet/          # Carbon Wallet component module
│       │   │   ├── CarbonWallet.jsx   # Impact points & carbon credits display
│       │   │   ├── CarbonConversionAnimation.jsx # Animated conversion effect
│       │   │   ├── carbonWallet.css   # Carbon wallet styles
│       │   │   └── index.js           # Module export
│       │   ├── LanguageSwitcher/      # Language selection component
│       │   └── auth/                  # Authentication sub-components
│       │
│       ├── context/                   # React Context Providers
│       │   ├── AuthContext.jsx        # Authentication state management
│       │   └── SocketContext.jsx      # Socket.IO connection management
│       │
│       ├── DonorDashboard/            # Donor Dashboard Module
│       │   ├── pages/
│       │   │   └── DonorDashboard.jsx # Main donor dashboard with all views
│       │   ├── components/
│       │   │   ├── Sidebar.jsx        # Donor navigation sidebar
│       │   │   ├── StatCards.jsx      # Statistics overview cards
│       │   │   ├── DonationForm.jsx   # Create new donation form with map
│       │   │   ├── ActiveTable.jsx    # Active donations table
│       │   │   ├── TrackingMap.jsx    # Live donation tracking map
│       │   │   ├── HistoryTable.jsx   # Completed donations history
│       │   │   ├── BlogPanel.jsx      # Inspiration blog panel
│       │   │   ├── ProfileSection.jsx # Profile management section
│       │   │   ├── Navbar.jsx         # Dashboard top navigation
│       │   │   └── Loader.jsx         # Loading screen component
│       │   └── animations/            # GSAP animation configurations
│       │
│       ├── modules/                   # Feature Modules
│       │   └── NGODashboard/          # NGO Dashboard Module
│       │       ├── pages/
│       │       │   └── NGODashboard.jsx # Main NGO dashboard with all views
│       │       ├── components/
│       │       │   ├── Sidebar.jsx         # NGO navigation sidebar
│       │       │   ├── OverviewCards.jsx    # Operations overview cards
│       │       │   ├── IncomingDonations.jsx # Browse & accept nearby donations
│       │       │   ├── AcceptedPickups.jsx  # Manage claimed donations
│       │       │   ├── VolunteerManager.jsx # Add/edit/assign volunteers
│       │       │   ├── MapPanel.jsx         # Operations map view
│       │       │   ├── ActivityLog.jsx      # Session activity history
│       │       │   ├── FoodRequest.jsx      # Targeted food request search
│       │       │   └── NotificationToast.jsx # Toast notification component
│       │       ├── animations/              # NGO dashboard animations
│       │       ├── api/                     # NGO API service layer
│       │       └── context/                 # NGO-specific context provider
│       │
│       ├── pages/                     # Top-Level Pages
│       │   ├── LandingPage.jsx        # Landing/home page
│       │   ├── AuthPage.jsx           # Login/Register page
│       │   ├── StoriesPage.jsx        # Impact stories page
│       │   └── ContactPage.jsx        # Contact us page
│       │
│       ├── sections/                  # Landing Page Sections
│       │   └── ImpactStories/         # Detailed impact stories
│       │
│       ├── i18n/                      # Internationalization config
│       ├── lib/                       # API service functions
│       ├── styles/                    # Global CSS styles
│       ├── App.jsx                    # Root application component
│       └── main.jsx                   # Application entry point
│
├── README.md                          # This file
└── .gitignore                         # Git ignore rules
```

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user (donor/NGO) with Firebase |
| POST | `/api/auth/login` | Login with email/password, returns JWT token |
| GET | `/api/auth/verify` | Verify current authentication token |
| POST | `/api/auth/refresh` | Refresh expired authentication token |

### Donor Operations (`/api/donors`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/donors/profile` | Get current donor's profile details |
| PUT | `/api/donors/profile` | Update donor profile information |
| GET | `/api/donors/listings` | Get all listings created by the donor |
| GET | `/api/donors/impact` | Get donor's personal impact metrics |
| GET | `/api/donors/impact-summary` | Get impact points and carbon credits |

### Food Listings (`/api/listings`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/listings` | Get all available food listings |
| POST | `/api/listings` | Create a new food listing |
| GET | `/api/listings/:id` | Get details of a specific listing |
| PUT | `/api/listings/:id` | Update listing details |
| DELETE | `/api/listings/:id` | Delete a listing |

### Claims (`/api/claims`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/claims` | NGO claims a food listing |
| GET | `/api/claims` | Get claims for the logged-in NGO |
| PUT | `/api/claims/:id` | Update claim status |

### Deliveries (`/api/deliveries`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/deliveries` | Get deliveries for the logged-in user |
| PUT | `/api/deliveries/:id` | Update delivery status (picked_up, delivered) |
| POST | `/api/deliveries/:id/complete` | Mark delivery as completed |

### NGO Operations (`/api/ngos`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/ngos/profile` | Get NGO profile details |
| GET | `/api/ngos/nearby-listings` | Get nearby available listings by distance |
| GET | `/api/ngos/volunteers` | Get NGO's registered volunteers |
| POST | `/api/ngos/volunteers` | Add a new volunteer |
| PUT | `/api/ngos/volunteers/:id` | Update volunteer details |
| DELETE | `/api/ngos/volunteers/:id` | Remove a volunteer |

### Impact Metrics (`/api/impact`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/impact/total` | Get platform-wide impact statistics (public) |
| GET | `/api/impact/summary` | Get impact summary for authenticated user |

### Geocoding (`/api/geocode`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/geocode/forward` | Convert address to coordinates |
| GET | `/api/geocode/reverse` | Convert coordinates to address |

### Admin (`/api/admin`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/ngos/pending` | Get pending NGO verification requests |
| PUT | `/api/admin/ngos/:id/verify` | Approve or reject an NGO |
| GET | `/api/admin/stats` | Get platform-wide statistics |

---

## 🌐 Multi-Language Support

The platform supports **5 Indian languages** to maximize reach and accessibility:

| Language | Code | Status |
|---|---|---|
| 🇬🇧 English | `en` | ✅ Complete |
| 🇮🇳 Hindi | `hi` | ✅ Complete |
| 🇮🇳 Marathi | `mr` | ✅ Complete |
| 🇮🇳 Kannada | `kn` | ✅ Complete |
| 🇮🇳 Telugu | `te` | ✅ Complete |

Translation files are located in `e-to-e_frontend/public/locales/{language_code}/`

The language can be switched at any time using the language switcher in the navigation bar. All UI labels, button texts, error messages, and dashboard content update immediately.

---

## 🚀 Development Scripts

### Frontend

```bash
npm run dev        # Start Vite development server with hot reload
npm run build      # Build optimized production bundle
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint to check code quality
```

### Backend

```bash
npm start          # Start server with Nodemon (auto-restart on changes)
```

---

## 🔒 Security Features

- **Firebase Authentication** — Industry-standard auth with email/password
- **JWT Token Verification** — Every API request is verified server-side
- **Role-Based Access Control** — Routes are protected based on user roles
- **CORS Protection** — Only whitelisted origins can access the API
- **Environment Variables** — Sensitive credentials are stored in `.env` files
- **Input Validation** — Server-side validation on all user inputs
- **Protected Routes** — Frontend routes redirect unauthorized users to login

---

## 📊 Database Schema Overview

The application uses **Supabase (PostgreSQL)** with the following key tables:

| Table | Purpose |
|---|---|
| `profiles` | User profiles (name, phone, role, organization) |
| `donor_profiles` | Extended donor information |
| `ngo_profiles` | NGO details (registration, verification status) |
| `food_listings` | All food donation listings with details |
| `claims` | NGO claims on food listings |
| `deliveries` | Delivery tracking records |
| `volunteers` | Volunteer registry under NGOs |
| `impact_metrics` | Platform-wide impact calculations |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Team Members

| Name | Role |
|---|---|
| **Yash Javanjal** | Full-Stack Developer & Project Lead |
| **Tanishq Shivsharan** | Frontend Developer |
| **Vinayak Sonawane** | Backend Developer |
| **Dhaiyrashail Sarwade** | Database & Testing |

---

## 📝 License

This project is open source and available for educational and non-commercial use.

---

## 🙏 Acknowledgments

- **Firebase** — Authentication and user management
- **Supabase** — PostgreSQL database with real-time capabilities
- **Leaflet** — Open-source interactive mapping
- **Socket.IO** — Real-time bidirectional communication
- **GSAP (GreenSock)** — Professional animation platform
- **Framer Motion** — React animation library
- **i18next** — Internationalization framework
- **Lucide** — Beautiful icon library
- **Lenis** — Smooth scrolling experience
- All contributors, mentors, and supporters of the project

---

## 📧 Contact

For questions, suggestions, or support:
- **GitHub:** [Yash-Javnjal](https://github.com/Yash-Javnjal)
- Open an issue on the [GitHub repository](https://github.com/Yash-Javnjal/Team-MealMitra)

---

## 📊 Project Status

🟢 **Active Development** — The platform is under active development with regular updates and feature improvements.

---

**Extra-To-Essential (MealMitra)** — *Transforming surplus into sustenance, one meal at a time.* 🌍💚
