# CampusPulse — Smart Campus Issue Management System

> **StackMitra — Projects Made Simple.**  
> _Enterprise-Grade Institutional Grievance Redressal, Maintenance Dispatch & Real-Time Redressal Platform._

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-indigo.svg)](#-technology-stack)
[![React 18](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-blue.svg)](#-technology-stack)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green.svg)](#-technology-stack)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Mongoose-emerald.svg)](#-technology-stack)
[![Nodemailer](https://img.shields.io/badge/Email-Nodemailer%20SMTP%20OTP-red.svg)](#-secure-email-otp-password-recovery)
[![E2E Test Suite](https://img.shields.io/badge/Tests-47%20Passed%20%7C%200%20Failed-success.svg)](#-testing--automated-verification)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](#-license)

---

## 🏛️ System Overview

**CampusPulse** is an institutional web platform engineered for modern universities, colleges, and educational campuses. It bridges the communication gap between students and campus administration by providing a transparent, auditable, and secure workflow for reporting, tracking, triaging, and remediating campus facilities grievances (infrastructure, electrical grids, water supply, Wi-Fi, classroom equipment, hostel amenities, and sanitation).

Built with a production-grade separated architecture (`client/` and `server/`), CampusPulse features:

- **Role-Based Workspaces**: Dedicated student grievance portals and chief administrative triage consoles.
- **Cryptographic Security**: PBKDF2 password hashing (100,000 iterations), salt stretching, and JWT session versioning.
- **Link-Free OTP Password Recovery**: Complete email verification via 6-digit random OTP codes with attempt limiting, 60s cooldowns, and single-use reset authorization tokens.
- **Tactile Design System**: Built with Tailwind CSS, custom institutional tokens, spring-physics micro-interactions, and accessible dialog portals.

---

## 📌 Table of Contents

1. [Key Features](#-key-features)
2. [Secure Email OTP Password Recovery](#-secure-email-otp-password-recovery)
3. [Technology Stack](#-technology-stack)
4. [Master Design System](#-master-design-system)
5. [Repository Structure](#-repository-structure)
6. [Quick Start Guide](#-quick-start-guide)
7. [Environment Variables](#-environment-variables)
8. [Nodemailer SMTP Configuration](#-nodemailer-smtp-configuration)
9. [Default Credentials](#-default-credentials)
10. [REST API Reference](#-rest-api-reference)
11. [Testing & Automated Verification](#-testing--automated-verification)
12. [License & Credits](#-license--credits)

---

## ✨ Key Features

### 🎓 Student Workspace

- **Grievance Filing**: Report campus issues with title, category, specific location, description, urgency level, and image attachments.
- **Real-Time Audit Timeline**: Track every operational update (technician dispatch, status transition, findings) in chronological order.
- **Live Notifications**: Instant in-app alerts when an administrator triages, updates, or resolves a filed issue.
- **Student Profile**: Manage academic details (branch, year, roll number, hostel block, room number, emergency contacts).

### 🛠️ Administrative Operations

- **Central Triage Table**: Search, filter, sort, and inspect university-wide grievances with tabbed workflow views (_Pending_, _In Progress_, _Resolved_, _Rejected_).
- **Interactive Triage Modal**: Reassign maintenance departments, escalate priorities, post public status updates, and attach formal resolution notes.
- **Executive Analytics Console**: Real-time resolution rates, category volume distributions, department workloads, and turnaround times.
- **Verified Student Directory**: Complete institutional roster with enrollment IDs, branch distribution, and grievance submission histories.

### 🛡️ Enterprise Security Architecture

- **PBKDF2 Password Protection**: Cryptographic password hashing using PBKDF2 with 100,000 iterations of SHA-512 and random 16-byte salts.
- **JWT Session Versioning**: Each user has an atomic `tokenVersion`. Changing passwords automatically revokes all prior active sessions.
- **Strict Role Locking**: Student registration cannot be manipulated via payload injection to acquire administrative access.
- **Data Isolation**: Multi-tenant authorization checks prevent students from viewing private tickets belonging to other students.
- **Abuse Defense**: Sliding-window in-memory rate limiting across sensitive endpoints to prevent brute-force attacks and spam.

---

## 🔐 Secure Email OTP Password Recovery

CampusPulse implements an **OTP-based password recovery architecture** that eliminates vulnerability to password-reset link tampering or host header injection.

```
┌─────────────────┐       ┌──────────────────────┐       ┌──────────────────────┐
│  Step 1: Email  │ ────► │  Step 2: 6-Digit OTP │ ────► │  Step 3: New Pass    │
│  Validation     │       │  Nodemailer Delivery │       │  PBKDF2 Hash Update  │
└─────────────────┘       └──────────────────────┘       └──────────────────────┘
         │                           │                              │
         ▼                           ▼                              ▼
  • Checks MongoDB            • SHA-256 Hashed Store         • Single-Use Auth Token
  • Privacy Defense           • 5-Minute Expiration          • Invalidate Sessions
  • 60s Resend Cooldown       • Max 5 Attempt Lockout        • Revoke All Active JWTs
```

### Security Safeguards

1. **Registered Users Only**: Only registered accounts can initiate recovery. Nonexistent email requests return the same generic response to prevent account enumeration.
2. **Cryptographic 6-Digit OTP**: Generated using `crypto.randomInt(100000, 1000000)`. Plaintext OTPs are never stored in the database.
3. **SHA-256 Hashed Storage**: Only the cryptographic hash of the OTP is written to MongoDB.
4. **5-Minute Expiry**: OTPs expire automatically after 5 minutes.
5. **Attempt Limiting**: Maximum 5 attempts allowed. Exceeding 5 attempts immediately destroys the OTP, mitigating brute-force attacks.
6. **Resend Cooldown**: A 60-second cooldown is enforced between OTP generation requests.
7. **Single-Use Authorization Token**: Upon successful OTP verification, the server issues a single-use 32-byte cryptographic `resetToken` valid for 10 minutes.
8. **Direct API Protection**: The password reset endpoint requires a valid `resetToken` generated by OTP verification; direct calls cannot bypass the flow.
9. **Instant Invalidation**: Both the OTP and the reset token are destroyed immediately upon successful password change.

---

## 💻 Technology Stack

### Frontend Client

- **Core Framework**: React 18 (SPA)
- **Tooling & Bundler**: Vite 6 (Fast HMR, optimized production build)
- **Styling**: Tailwind CSS 3.4 with custom design tokens
- **Routing**: React Router 6 (Declarative client-side routing & Auth/Admin guards)
- **Icons**: Lucide React (Clean, accessible SVG iconography)
- **Architecture**: Modular layout wrappers, React Portals for modal overlays, contextual auth state

### Backend Server

- **Runtime Environment**: Node.js (ES Modules)
- **Web Framework**: Express 4 (REST API, structured controllers & routes)
- **Database Engine**: MongoDB via Mongoose ODM
- **Email Delivery**: Nodemailer (SMTP transport with SSL/TLS)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & PBKDF2 (`node:crypto`)
- **Rate Limiting**: Sliding-window in-memory rate limiting middleware
- **Automated Verification**: End-to-end integration test runner

---

## 🎨 Master Design System

The application features a tailored institutional design language:

| Design Token         | Hex Code  | Purpose                                                   |
| :------------------- | :-------- | :-------------------------------------------------------- |
| **Midnight Navy**    | `#172554` | Primary brand foundation, high-contrast banners, sidebars |
| **Deep Indigo**      | `#3730A3` | Active navigation states, brand accents                   |
| **Royal Indigo**     | `#4F46E5` | Primary action buttons, active focus rings, badges        |
| **Workspace Mist**   | `#F7F8FC` | Main background surface for low eyestrain                 |
| **Subtle Sidebar**   | `#F1F4FA` | Secondary navigation backdrops                            |
| **Card White**       | `#FFFFFF` | Primary elevated cards with subtle borders                |
| **Charcoal Primary** | `#172033` | Crisp headings and primary typography                     |
| **Slate Secondary**  | `#596579` | Descriptive text, labels, metadata                        |

---

## 📁 Repository Structure

```
CampusPulse/
├── client/                              # React 18 SPA (Vite + Tailwind CSS)
│   ├── public/                          # Static public assets & brand icons
│   ├── src/
│   │   ├── components/                  # UI component library & layout wrappers
│   │   │   ├── admin/                   # AdminLayout, AdminHeader, AdminSidebar, AdminComplaintModal
│   │   │   ├── layout/                  # Navbar, Footer, Public Layout
│   │   │   ├── student/                 # StudentLayout, StudentHeader, StudentSidebar, AuthGuard
│   │   │   └── ui/                      # Button, Input, Select, Badge, Card, Logo, ErrorMessage
│   │   ├── context/                     # AuthContext (JWT session management)
│   │   ├── pages/                       # Application pages & route views
│   │   │   ├── admin/                   # Dashboard, Grievance Table, Students, Analytics
│   │   │   ├── student/                 # Dashboard, My Complaints, Submit Complaint, Details
│   │   │   └── ForgotPasswordPage.jsx   # 3-Step OTP Password Recovery flow
│   │   ├── services/                    # Axios API client, complaintService, userService
│   │   ├── styles/globals.css           # Tailwind base, typography & spring keyframes
│   │   └── App.jsx                      # Route definitions & application root
│   ├── package.json                     # Frontend scripts and dependencies
│   ├── tailwind.config.js               # Theme configuration & color tokens
│   └── vite.config.js                   # Development proxy (/api -> :5000)
│
├── server/                              # Node.js + Express REST API Server
│   ├── src/
│   │   ├── config/db.js                 # MongoDB connection & pool management
│   │   ├── controllers/                 # authController, complaintController, studentController
│   │   ├── middleware/                  # auth.js (JWT verify), rateLimiter.js
│   │   ├── models/                      # User.js, Complaint.js, Notification.js
│   │   ├── routes/                      # authRoutes, complaintRoutes, studentRoutes
│   │   ├── scripts/
│   │   │   ├── provisionAdmin.js        # Default administrator initializer
│   │   │   ├── testIntegrationE2E.js    # Comprehensive 47-point E2E test runner
│   │   │   └── verifySmtp.js            # SMTP transport diagnostic utility
│   │   ├── services/emailService.js     # Nodemailer SMTP transporter & OTP template
│   │   └── server.js                    # Express application entrypoint
│   ├── package.json                     # Backend scripts and dependencies
│   └── .env.example                     # Environment template (placeholders only)
│
├── docs/                                # Technical documentation
│   ├── ARCHITECTURE.md                  # Comprehensive architectural specification
│   └── API.md                           # 17-endpoint REST API documentation
├── package.json                         # Root task runner (concurrent execution)
└── README.md                            # Primary project documentation
```

---

## ⚡ Quick Start Guide

### Prerequisites

- **Node.js**: `v18.0.0` or higher (`node -v`)
- **npm**: `v9.0.0` or higher (`npm -v`)
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017/campuspulse`) or MongoDB Atlas URI

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/StackMitra/CampusPulse.git
cd CampusPulse

# Install root, server, and client dependencies simultaneously
npm run install:all
```

_(Alternatively, run `npm install` in root, `client/`, and `server/` individually)._

### 2. Configure Environment Variables

Create `.env` inside the `server/` directory:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your values (see [Environment Variables](#-environment-variables)).

### 3. Start Frontend & Backend Simultaneously

```bash
npm run dev
```

Both services will boot concurrently in one terminal window:

| Service             | Address                                            | Description                     |
| :------------------ | :------------------------------------------------- | :------------------------------ |
| **Frontend Client** | `http://localhost:5173`                            | React application with Vite HMR |
| **Backend API**     | `https://campuspulse-1xno.onrender.com/api`        | Express REST API server         |
| **Health Check**    | `https://campuspulse-1xno.onrender.com/api/health` | Service and MongoDB status      |

---

## ⚙️ Environment Variables

Configure `server/.env` based on `server/.env.example`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/campuspulse
JWT_SECRET=your_jwt_secret_key_production_2026
CLIENT_URL=http://localhost:5173

# Chief Administrator Provisioning
ADMIN_EMAIL=admin@institution.edu
ADMIN_INITIAL_PASSWORD=your_secure_admin_password

# Nodemailer SMTP Configuration (Gmail SMTP, SendGrid, or Custom SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-verified-sender@gmail.com
SMTP_PASS=your-16-character-app-password
MAIL_FROM="CampusPulse Support <your-verified-sender@gmail.com>"
```

---

## 📧 Nodemailer SMTP Configuration

### Setting Up Gmail SMTP

1. Enable **2-Step Verification** on your Google Account: [Google Security Settings](https://myaccount.google.com/security).
2. Generate an **App Password**: [Google App Passwords](https://myaccount.google.com/apppasswords).
3. Set the app name to `CampusPulse` and copy the 16-character password generated.
4. Set `SMTP_PASS` in `server/.env` to this 16-character password (without spaces).
5. Set `SMTP_USER` to your Gmail address.
6. Verify your connection at any time using:

```bash
npm run verify:smtp
```

### Local Preview Mode (Zero-Config Testing)

If `SMTP_USER` or `SMTP_PASS` are not set, CampusPulse automatically enters **Development Preview Mode**:

- OTPs are generated and hashed normally.
- The 6-digit OTP code is logged directly to the server console for rapid testing without needing live credentials.

---

## 🔑 Default Credentials

### Administrator Account

The chief administrator account is automatically initialized upon startup:

- **Email:** `bhargavpasupuleti5@gmail.com`
- **Password:** `123456`
- **Role:** `admin` (Full triage privileges, university analytics, and department assignment)

### Student Accounts

Students register directly via `/register` with their academic details (branch, year of study, section, and roll number). Newly created accounts are strictly assigned the `student` role.

---

## 🌐 REST API Reference

| Method | Endpoint                          | Access Level          | Description                                       |
| :----- | :-------------------------------- | :-------------------- | :------------------------------------------------ |
| `GET`  | `/api/health`                     | Public                | System status & MongoDB health check              |
| `POST` | `/api/auth/register`              | Public                | Register a student account with academic records  |
| `POST` | `/api/auth/login`                 | Public                | Authenticate user & return signed JWT             |
| `POST` | `/api/auth/forgot-password`       | Public (Rate-Limited) | Request a 6-digit OTP to registered email         |
| `POST` | `/api/auth/resend-otp`            | Public (Rate-Limited) | Resend OTP (enforces 60-second cooldown)          |
| `POST` | `/api/auth/verify-otp`            | Public (Rate-Limited) | Verify 6-digit OTP & receive reset token          |
| `POST` | `/api/auth/reset-password`        | Public (Rate-Limited) | Reset password with valid reset token             |
| `GET`  | `/api/auth/me`                    | Authenticated         | Fetch current user profile                        |
| `GET`  | `/api/complaints`                 | Authenticated         | Retrieve grievances (role-scoped)                 |
| `POST` | `/api/complaints`                 | Student               | Submit a new grievance                            |
| `GET`  | `/api/complaints/:id`             | Authenticated         | Get grievance details & timeline                  |
| `PUT`  | `/api/complaints/:id/status`      | Administrator         | Update grievance status, priority, and department |
| `GET`  | `/api/complaints/admin/analytics` | Administrator         | University grievance analytics                    |
| `GET`  | `/api/students`                   | Administrator         | Verified student directory                        |
| `GET`  | `/api/notifications`              | Authenticated         | In-app user notifications                         |

_Full request/response schemas and examples are available in [`docs/API.md`](docs/API.md)._

---

## 🧪 Testing & Automated Verification

CampusPulse includes a comprehensive automated test suite verifying security, authentication, RBAC authorization, grievances, and the OTP flow:

```bash
npm test
```

### Verification Test Summary (47 Passed, 0 Failed)

```
[PASS] ✓ Health Check: API is operational and connected to MongoDB
[PASS] ✓ Admin Auth: Bhargav Pasupuleti authenticates with password
[PASS] ✓ Admin Security: Password hash is NOT exposed in response payload
[PASS] ✓ Security: Invalid credentials rejected with HTTP 401
[PASS] ✓ Registration Validation: Incomplete academic fields rejected with HTTP 400
[PASS] ✓ Student Registration: Account created with full academic records
[PASS] ✓ Security: Duplicate email registration rejected with HTTP 409
[PASS] ✓ Security: Duplicate roll number registration rejected with HTTP 409
[PASS] ✓ Student Login: Authenticates and receives valid session token
[PASS] ✓ Authorization: Student blocked from Admin API (/admin/students) with HTTP 403
[PASS] ✓ Authorization: Student blocked from Admin Analytics with HTTP 403
[PASS] ✓ Complaint Submission: Grievance persisted with tracking ID in MongoDB
[PASS] ✓ Data Isolation: Student 2 cannot read Student 1 private complaint (HTTP 403)
[PASS] ✓ Admin Queue: Administrator views newly submitted student grievance in queue
[PASS] ✓ Admin Triage: Status transitioned to "in-progress" and maintenance unit assigned
[PASS] ✓ Student View: Student sees updated "in-progress" status and audit timeline event
[PASS] ✓ Admin Resolution: Grievance resolved and official findings recorded
[PASS] ✓ Data Consistency: Student confirms grievance resolved with official findings
[PASS] ✓ Notifications: Student receives in-app notifications for submission and resolution
[PASS] ✓ Analytics Integrity: Admin dashboard reflects real MongoDB metrics (resolution rate > 0%)
[PASS] ✓ Students Directory: Admin sees registered student with academic info and complaint count

--- Section 11: Email OTP Password Reset & Security Suite ---
[PASS] ✓ Forgot Password: Malformed email rejected with HTTP 400
[PASS] ✓ Privacy Defense: Nonexistent email receives generic response (HTTP 200)
[PASS] ✓ Security: Unregistered email does NOT create any database account
[PASS] ✓ Security: Never send OTP email to unregistered email address
[PASS] ✓ Forgot Password: Real account receives generic response (HTTP 200)
[PASS] ✓ Token Security: OTP is stored ONLY as SHA-256 hash (64 hex) in MongoDB
[PASS] ✓ Token Expiration: OTP expiration is set for 5 minutes in the future
[PASS] ✓ Resend Cooldown: Requesting new OTP before 60s cooldown triggers HTTP 429
[PASS] ✓ Cycle OTP: Generating a new OTP invalidates the previous OTP hash
[PASS] ✓ Verify Validation: Non-6-digit OTP rejected with HTTP 400
[PASS] ✓ Verify Validation: Incorrect OTP rejected with HTTP 400 and remaining count
[PASS] ✓ Security: Excessive incorrect attempts (>5) invalidate the OTP completely
[PASS] ✓ Security: Expired OTP rejected with HTTP 400
[PASS] ✓ Verify Success: Correct OTP is accepted, granting reset authorization token
[PASS] ✓ Security: OTP cannot be reused after successful verification
[PASS] ✓ Security: Direct API calls cannot bypass OTP verification (HTTP 400)
[PASS] ✓ Reset Validation: Password mismatch rejected with HTTP 400
[PASS] ✓ Reset Validation: Short password (<6 chars) rejected with HTTP 400
[PASS] ✓ Reset Success: Password successfully updated in database (HTTP 200)
[PASS] ✓ Token Invalidation: Reused reset authorization token immediately rejected with HTTP 400
[PASS] ✓ Credential Security: Login with old password fails with HTTP 401
[PASS] ✓ Authentication: Login with new password succeeds with HTTP 200
[PASS] ✓ Data Preservation: User role remains "student" and roll number is intact
[PASS] ✓ Session Invalidation: Pre-reset JWT session revoked with HTTP 401
[PASS] ✓ SMTP Failure: Handled safely with HTTP 500 without claiming success
[PASS] ✓ Abuse Protection: Repeated rapid requests trigger rate limiter (HTTP 429)

===============================================================
TEST SUMMARY: 47 PASSED, 0 FAILED (TOTAL: 47)
===============================================================
```

---

## 📄 License & Credits

Developed and maintained by **StackMitra — Projects Made Simple**.

Distributed under the **MIT License**. See `LICENSE` for more information.
