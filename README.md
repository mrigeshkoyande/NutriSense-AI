# SentraAI — Intelligent Visitor Security System

> **Enterprise-grade visitor management and access control platform** with AI-powered analytics, real-time alerts, and a fully isolated role-based portal architecture designed for residential complexes, corporate offices, and secure facilities.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)
![Node](https://img.shields.io/badge/node-v16+-brightgreen.svg?style=flat-square)
![React](https://img.shields.io/badge/react-18.2-61DAFB.svg?style=flat-square)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features In v2.0](#key-features-in-v20)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Role-Based Access Control](#role-based-access-control)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

SentraAI is a comprehensive **full-stack visitor management system** that revolutionizes how organizations handle visitor tracking, security approvals, and administrative operations. The platform employs a **Route-Based Separated Architecture** where each user role (Admin, Guard, Resident) operates within its own dedicated portal with isolated URLs, authentication flows, and user interfaces—ensuring zero cross-role UI contamination and maximum security boundaries.

### Problem Statement
Traditional visitor management relies on manual logbooks, delayed approvals, and minimal audit trails. SentraAI eliminates these inefficiencies with:
- ✅ Real-time visitor validation and approval workflows
- ✅ Automated alert systems for suspicious activities
- ✅ Comprehensive audit logs and analytics dashboards
- ✅ Multi-channel notifications (email, SMS, in-app)
- ✅ End-to-end security workflows with 21-second SLA tracking

---

## ⭐ Key Features In v2.0

### For Administrators
- **Dashboard Analytics** - Real-time metrics on visitors, approvals, and security events
- **User Management** - Unique User IDs (`USR-ADM-`, `USR-GRD-`, `USR-RES-`) and role management
- **System Configuration** - Customize approval workflows and notification settings
- **Audit Logs** - Complete activity history with timestamps and user attribution
- **Alert Management** - Configure and monitor security alerts system-wide
- **Visitor Photos Gallery** - Centralized storage and review of all gate-captured photos

### For Guards
- **12-Hour Shift Management** - Automated shift tracking, elapsed timers, and overtime alerts
- **21-Second Checkpoint Timers** - Live tracking of visitors with automated breach alerts
- **Camera Monitoring** - Multi-camera simulation feeds directly integrated into the guard console
- **Visitor Logs** - Dedicated searchable, filterable logs with CSV export features
- **Quick Actions** - Unified "Emergency", "New Visitor", and "Contact" action panels
- **Live Duty Status** - Guards are displayed to residents transparently based on active shifts

### For Residents
- **Emergency Infotainment System** - Premium full-screen popups for instant visitor accept/deny responses
- **Live Guard Calling** - Call on-duty guards instantly with specific inquiry types
- **Profile Management** - Avatar uploads, updatable flat details, and custom notifications
- **Visitor History** - View all historical visits and approved guests
- **Activity Feed** - Real-time notifications of visitor arrivals

---

## 🛠️ Tech Stack

### Frontend
| Component | Technology | Version |
|---|---|---|
| Framework | React | 18.2 |
| Build Tool | Vite | 4.5 |
| Routing | React Router DOM | 6 |
| UI Icons | Lucide React | 0.x |
| HTTP Client | Native Fetch API | - |
| Authentication | Firebase SDK | 10.x |
| Styling | Vanilla CSS3 (Glassmorphism + Inter font) | Native |

### Backend
| Component | Technology | Version |
|---|---|---|
| Runtime | Node.js | 16+ |
| Framework | Express.js | 4.18 |
| Authentication | Firebase Admin | 12.x |
| Database Client | Supabase Admin SDK | 2.x |
| File Upload | Multer | 2.1 |
| CORS | cors | 2.8 |
| Environment | dotenv | 16.0 |

### Database
- **Type**: PostgreSQL (via Supabase)
- **Migrations**: Controlled native SQL executions
- **Storage**: Supabase Storage for profile avatars and visitor photos

---

## 🏗️ Architecture

### Route-Based Separated Portal Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SentraAI Platform                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  /admin/*          │  /guard/*          │  /resident/*      │
│  ┌──────────────┐  │  ┌──────────────┐  │  ┌──────────────┐ │
│  │   Admin      │  │  │    Guard     │  │  │  Resident    │ │
│  │  Portal      │  │  │   Portal     │  │  │   Portal     │ │
│  │              │  │  │              │  │  │              │ │
│  │ • Dashboard  │  │  │ • Cameras    │  │  │ • Approvals  │ │
│  │ • Analytics  │  │  │ • Logs       │  │  │ • Infotainment│ │
│  │ • Users      │  │  │ • Alerts     │  │  │ • Guard Call │ │
│  │ • Photos     │  │  │ • Contact    │  │  │ • Passes     │ │
│  └──────────────┘  │  └──────────────┘  │  └──────────────┘ │
│                    │                    │                    │
├─────────────────────────────────────────────────────────────┤
│              Role Gateway (/)                                │
│         [Login Portal Selector]                              │
├─────────────────────────────────────────────────────────────┤
│                  Shared Backend API                          │
│         (Express.js - /api/*)                                │
├─────────────────────────────────────────────────────────────┤
│            Supabase PostgreSQL Database                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
SentraAI/
├── client/                       # React Frontend
│   ├── src/
│   │   ├── components/           # Shared components (Header, Sidebar, ContactGuard)
│   │   ├── context/              # Firebase+Supabase AuthContext
│   │   ├── hooks/                # Custom React Hooks
│   │   ├── pages/                # Admin, Guard, Resident specific pages
│   │   ├── App.jsx               # Role-based React Router
│   │   └── index.css             # Main styling, glassmorphism variables
│   ├── index.html                # Vite entry point
│   └── vite.config.js            # Build constraints & proxy
│
├── server/                       # Node.js Express Backend
│   ├── index.js                  # Main entry point and server startup
│   ├── middleware/               # Auth (verifyToken, requireRole)
│   ├── routes/                   # Feature specific routing logic
│   │   ├── admin.js              # User management and unique IDs
│   │   ├── cameras.js            # Mock surveillance and camera logs
│   │   ├── checkpoints.js        # 21-second timer validation logic
│   │   ├── guards.js             # Resident-to-Guard messaging endpoints
│   │   ├── profile.js            # Avatar uploads and profile changes
│   │   ├── shifts.js             # Guard 12h duty and overtime tracking
│   │   └── visitors.js           # Core visitor logic
│   ├── services/                 # Notification wrappers
│   └── .env                      # Secrets configurations
│
└── supabase/                     # PostgreSQL Migrations & Seeding
    ├── schema.sql                # Initial schema configuration
    ├── seed.sql                  # Mock initial state population
    ├── migration_add_visitor_id.sql
    └── migration_v3.sql          # v2.0 tables (shifts, checkpoints, calls, cameras)
```

---

## Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js** - v16 or higher
- **npm** or **Yarn** - v8+
- **Git** - For version control
- **Modern Browser** - Chrome 90+, Firefox 88+, Safari 14+

---

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/SentraAI.git
cd SentraAI
```

### Step 2: Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### Step 3: Configure Environment

Create a `.env` file in the `server/` directory:
```env
PORT=5001
NODE_ENV=development

# Firebase Admin SDK credentials
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@your-project.iam.gserviceaccount.com"

# Supabase API
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-key

# CORS limit
CORS_ORIGIN=http://localhost:3000
```

### Step 4: Database Setup

Using your Supabase Dashboard's SQL editor, execute the migrations in this exact order:
1. `supabase/schema.sql`
2. `supabase/migration_add_visitor_id.sql`
3. `supabase/migration_v3.sql`

---

## 🚀 Running the Application

For a fully optimized development startup using `concurrently`:

```bash
# In the root project directory:
npm run dev
```

This starts:
- **Backend API**: `http://localhost:5001`
- **Frontend App**: `http://localhost:3000`

---

## 🌐 Route Architecture

### Role Portals

| Role | Login URL | Dashboard URL | Accent Color | Theme |
|---|---|---|---|---|
| **Admin** | `/admin/login` | `/admin/dashboard` | Purple `#8b5cf6` | Command Center |
| **Guard** | `/guard/login` | `/guard/dashboard` | Cyan `#22d3ee` | Guard Station |
| **Resident** | `/resident/login` | `/resident/dashboard` | Green `#34d399` | Resident Portal |

### Access Control
Visiting a protected route without being authenticated triggers a UI-safe redirect to that domain's login scope. Visiting `/` yields the graphical **Role Gateway** selector.

---

## 📡 Key API Routes (v2.0)

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/shifts/start` | POST | Guard | Begins a 12-hour tracked shift |
| `/api/shifts/current` | GET | Guard | Fetches the elapsed seconds for the header UI |
| `/api/guards/call` | POST | Resident | Triggers an immediate communication alert to a guard |
| `/api/profile` | PUT | All | Saves changes and flat overrides to `users` |
| `/api/profile/avatar` | POST | All | Buffers and stores an image to Supabase Storage |
| `/api/checkpoints` | POST | System | Enforces the 21-second timer validation between gates |
| `/api/admin/users` | POST | Admin | Issues a formatted Unique Identifier (e.g. `USR-RES-1718`) |

---

## 🌟 Quality Assurance & Production Polish

- **Vite Output Optimization**: Built with specific manual chunking for React dependencies, Firebase, and Lucide Icons to prevent large bundle generation.
- **Micro-Animations**: Extensive implementation of CSS variable-based hover lifts, glow rings, fading dropdowns, and continuous `spin` loaders for all async operations.
- **Timer Validation Compliance**: Guaranteed exact syncs globally using `elapsed_seconds` payloads avoiding client-client clock drift vulnerabilities.
- **Design Tokens**: Standardized `var(--bg-glass)`, layout breakpoints, flex spacing patterns in `index.css`.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
