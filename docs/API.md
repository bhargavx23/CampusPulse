# CampusPulse — REST API Specification

**Product:** CampusPulse — Smart Campus Issue Management  
**Company:** StackMitra  
**Base URL (Local Development):** `http://localhost:5000/api`  
**Client Reverse Proxy:** `/api`  
**Authentication Scheme:** `Bearer <JWT_TOKEN>` in HTTP Header `Authorization`  

---

## Table of Endpoints

| Category | Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- | :--- |
| **System** | `GET` | `/health` | Public | System status and MongoDB connectivity |
| **Authentication** | `POST` | `/auth/register` | Public | Register a student account with academic fields |
| | `POST` | `/auth/login` | Public | Authenticate student or administrator |
| | `POST` | `/auth/forgot-password` | Public | Request a secure single-use password reset link |
| | `POST` | `/auth/reset-password` | Public | Set new password with valid reset token |
| | `GET` | `/auth/me` | Authenticated | Retrieve current user profile from JWT session |
| **Complaints (Student)** | `GET` | `/complaints` | Authenticated | Fetch list of complaints (filtered by student/status) |
| | `GET` | `/complaints/stats` | Authenticated | Fetch complaint summary counts for student |
| | `GET` | `/complaints/:id` | Authenticated | Fetch individual complaint with full audit timeline |
| | `POST` | `/complaints` | Student | File a new campus complaint |
| **Complaints (Admin)** | `PUT` | `/complaints/:id/status` | Administrator | Update complaint status, department, and priority |
| | `GET` | `/complaints/admin/analytics`| Administrator | Fetch university-wide grievance breakdown metrics |
| **Notifications** | `GET` | `/notifications` | Authenticated | Fetch notifications for current user |
| | `GET` | `/notifications/unread-count`| Authenticated | Count unread notifications |
| | `PUT` | `/notifications/:id/read` | Authenticated | Mark a single notification as read |
| | `PUT` | `/notifications/mark-all-read`| Authenticated | Mark all notifications for user as read |
| | `DELETE` | `/notifications/:id` | Authenticated | Delete a notification |

---

## 1. System Endpoints

### 1.1 Health Check
- **Endpoint:** `GET /health`
- **Description:** Verifies that the API server is running and the MongoDB database connection is active.
- **Request Headers:** None
- **Success Response (200 OK):**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-10-24T06:15:00.000Z"
}
```

---

## 2. Authentication Endpoints

### 2.1 Student Registration
- **Endpoint:** `POST /auth/register`
- **Description:** Creates a new verified student account with required academic details.
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "fullName": "Alex Morgan",
  "email": "alex.morgan@campus.edu",
  "password": "SecurePassword123!",
  "branch": "CSE — Computer Science and Engineering",
  "yearOfStudy": "3rd Year",
  "section": "A",
  "rollNumber": "21CS042"
}
```
- **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Student registered successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "67b9318b321a59218d6e9001",
    "fullName": "Alex Morgan",
    "email": "alex.morgan@campus.edu",
    "role": "student",
    "branch": "CSE — Computer Science and Engineering",
    "yearOfStudy": "3rd Year",
    "section": "A",
    "rollNumber": "21CS042"
  }
}
```
- **Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "A user with this campus email already exists."
}
```

---

### 2.2 User Login
- **Endpoint:** `POST /auth/login`
- **Description:** Authenticates a student or administrator using PBKDF2 verification and generates a signed JWT.
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "bhargavpasupuleti5@gmail.com",
  "password": "Password123"
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Authentication successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "67b9318b321a59218d6e9000",
    "fullName": "Bhargav Pasupuleti",
    "email": "bhargavpasupuleti5@gmail.com",
    "role": "admin"
  }
}
```
- **Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid email address or password."
}
```

---

### 2.3 Request Password Reset OTP
- **Endpoint:** `POST /auth/forgot-password`
- **Description:** Generates a cryptographically secure, random 6-digit OTP, stores its SHA-256 hash in MongoDB with a 5-minute expiration, and dispatches a branded OTP email via Nodemailer SMTP. Implements sliding-window rate limiting, a 60-second resend cooldown, and privacy protection (identical generic response regardless of account existence).
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "student@campus.edu"
}
```
- **Success Response (200 OK — Both for registered & unregistered emails):**
```json
{
  "success": true,
  "message": "If an account exists for that email address, an OTP verification code has been sent.",
  "cooldownSeconds": 60
}
```
- **Error Response (400 Bad Request — Malformed email):**
```json
{
  "success": false,
  "error": "Please provide a valid institutional email address."
}
```
- **Error Response (429 Too Many Requests — Cooldown Active):**
```json
{
  "success": false,
  "error": "Please wait 45 seconds before requesting a new OTP.",
  "cooldownSeconds": 45
}
```

---

### 2.4 Resend Password Reset OTP
- **Endpoint:** `POST /auth/resend-otp`
- **Description:** Resends the OTP verification code to the registered email address while strictly enforcing the 60-second cooldown period.
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "student@campus.edu"
}
```

---

### 2.5 Verify Password Reset OTP
- **Endpoint:** `POST /auth/verify-otp`
- **Description:** Validates the 6-digit OTP code against the SHA-256 hash in MongoDB. Checks expiration (5 minutes) and enforces a maximum of 5 attempts. Upon success, immediately clears the OTP and issues a single-use 32-byte cryptographic `resetToken` valid for 10 minutes.
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "student@campus.edu",
  "otp": "849201"
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Verification code confirmed. You may now set your new password.",
  "resetToken": "c8d4a9f3e1b0c7d2e5a8f4c1b9a7d3e5f2a8c4b1d7e9f3a6b5c2d8e4f1a7b9c3"
}
```
- **Error Response (400 Bad Request — Incorrect Code):**
```json
{
  "success": false,
  "error": "Invalid verification code. 4 attempts remaining.",
  "remainingAttempts": 4
}
```
- **Error Response (400 Bad Request — Expired Code):**
```json
{
  "success": false,
  "error": "The verification code has expired. Please request a new code.",
  "isExpired": true
}
```
- **Error Response (400 Bad Request — Attempts Exceeded):**
```json
{
  "success": false,
  "error": "Too many incorrect attempts. This OTP has been invalidated for security. Please request a new code.",
  "attemptsExceeded": true
}
```

---

### 2.6 Execute Password Reset
- **Endpoint:** `POST /auth/reset-password`
- **Description:** Verifies the single-use reset authorization token, validates the new password, updates the password using PBKDF2 hash stretching (100,000 iterations, SHA-512), destroys the reset token immediately, and increments `tokenVersion` to revoke prior active JWT sessions.
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "student@campus.edu",
  "resetToken": "c8d4a9f3e1b0c7d2e5a8f4c1b9a7d3e5f2a8c4b1d7e9f3a6b5c2d8e4f1a7b9c3",
  "password": "NewSecurePassword2026!",
  "confirmPassword": "NewSecurePassword2026!"
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Your password has been successfully reset. You may now sign in with your new password."
}
```
- **Error Response (400 Bad Request — Invalid or Expired Token):**
```json
{
  "success": false,
  "error": "This password reset authorization is invalid or has expired. Please verify your OTP again."
}
```
- **Error Response (400 Bad Request — Password Mismatch or Length Violation):**
```json
{
  "success": false,
  "error": "Passwords do not match. Please verify both fields."
}
```

---

### 2.5 Verify Current Session (`me`)
- **Endpoint:** `GET /auth/me`
- **Description:** Validates the client's Bearer token and returns the current user profile. Rejects sessions invalidated by a password reset (`tokenVersion` check).
- **Request Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "67b9318b321a59218d6e9000",
    "fullName": "Bhargav Pasupuleti",
    "email": "bhargavpasupuleti5@gmail.com",
    "role": "admin"
  }
}
```

---

## 3. Complaint Management Endpoints

### 3.1 Fetch Complaints
- **Endpoint:** `GET /complaints`
- **Description:** Retrieves complaints. If called by a student, only returns tickets filed by that student. If called by an administrator, returns campus-wide complaints with optional search and filters.
- **Query Parameters:**
  - `status`: Filter by status (`pending`, `in-progress`, `resolved`, `rejected`)
  - `category`: Filter by category (e.g., `Hostel & Residential`)
  - `search`: Keyword search in title and description
- **Request Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "complaints": [
    {
      "id": "#CP-1001",
      "title": "Low water pressure in Hostel Wing B",
      "description": "Third floor washrooms have minimal pressure during morning peak hours.",
      "category": "Hostel & Residential",
      "location": "Hostel 4, Block B, Floor 3",
      "status": "pending",
      "priority": "Medium",
      "studentName": "Alex Morgan",
      "studentEmail": "alex.morgan@campus.edu",
      "assignedTo": "Awaiting Department Assignment",
      "createdAt": "2026-10-24T05:30:00.000Z"
    }
  ]
}
```

---

### 3.2 Fetch Student Statistics
- **Endpoint:** `GET /complaints/stats`
- **Description:** Calculates summary totals (total, pending, in-progress, resolved) for the authenticated student.
- **Request Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "stats": {
    "total": 5,
    "pending": 2,
    "inProgress": 1,
    "resolved": 2
  }
}
```

---

### 3.3 Fetch Complaint Details
- **Endpoint:** `GET /complaints/:id`
- **Description:** Retrieves a single complaint by its human-readable ID (e.g., `#CP-1001`) including complete event timeline and department assignments.
- **Request Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "complaint": {
    "id": "#CP-1001",
    "title": "Low water pressure in Hostel Wing B",
    "description": "Third floor washrooms have minimal pressure during morning peak hours.",
    "category": "Hostel & Residential",
    "location": "Hostel 4, Block B, Floor 3",
    "status": "in-progress",
    "priority": "High",
    "studentName": "Alex Morgan",
    "studentEmail": "alex.morgan@campus.edu",
    "assignedTo": "Residential Maintenance & Plumbing",
    "timeline": [
      {
        "status": "pending",
        "note": "Complaint filed by student.",
        "actor": "Alex Morgan",
        "date": "2026-10-24T05:30:00.000Z"
      },
      {
        "status": "in-progress",
        "note": "Plumbing crew dispatched to check pump feeder line.",
        "actor": "Bhargav Pasupuleti (Admin)",
        "date": "2026-10-24T06:00:00.000Z"
      }
    ]
  }
}
```

---

### 3.4 Submit New Complaint
- **Endpoint:** `POST /complaints`
- **Description:** Creates a new campus complaint ticket under the authenticated student profile.
- **Request Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body:**
```json
{
  "title": "Air Conditioner Leaking Water in Lab 304",
  "description": "The split AC unit above rack 2 is dripping water directly over network switches.",
  "category": "Labs & Equipment",
  "location": "Academic Block 2, Room 304",
  "priority": "Urgent"
}
```
- **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Complaint logged successfully.",
  "complaint": {
    "id": "#CP-1048",
    "title": "Air Conditioner Leaking Water in Lab 304",
    "status": "pending",
    "priority": "Urgent",
    "studentName": "Alex Morgan",
    "studentEmail": "alex.morgan@campus.edu"
  }
}
```

---

### 3.5 Administrative Status Triage
- **Endpoint:** `PUT /complaints/:id/status`
- **Description:** Authorized administrator modifies complaint operational status, assigns campus department, adjusts priority, and appends resolution findings. Automatically generates an in-app student notification.
- **Access Level:** Chief Administrator (`bhargavpasupuleti5@gmail.com`)
- **Request Headers:** `Authorization: Bearer <admin_token>`, `Content-Type: application/json`
- **Request Body:**
```json
{
  "status": "resolved",
  "assignedTo": "Campus Electrical Services (Unit 2)",
  "priority": "High",
  "resolutionNote": "Drainage pipe unclogged and secondary tray sealed. System running without leakage."
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Complaint status updated successfully.",
  "complaint": {
    "id": "#CP-1048",
    "status": "resolved",
    "assignedTo": "Campus Electrical Services (Unit 2)",
    "resolutionNote": "Drainage pipe unclogged and secondary tray sealed. System running without leakage."
  }
}
```
- **Error Response (403 Forbidden):**
```json
{
  "success": false,
  "error": "Forbidden: Administrator privileges required."
}
```

---

### 3.6 Institutional Analytics
- **Endpoint:** `GET /complaints/admin/analytics`
- **Description:** Aggregates university-wide operational statistics, category volumes, priority distribution, and resolution rates.
- **Access Level:** Administrator
- **Request Headers:** `Authorization: Bearer <admin_token>`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "total": 48,
  "pending": 12,
  "inProgress": 8,
  "resolved": 26,
  "rejected": 2,
  "urgent": 5,
  "resolutionRate": 54,
  "categoryStats": [
    { "category": "Hostel & Residential", "count": 16, "percentage": 33 },
    { "category": "Electrical & Power", "count": 12, "percentage": 25 },
    { "category": "Network & Wi-Fi", "count": 10, "percentage": 21 }
  ],
  "priorityMap": {
    "Low": 8,
    "Medium": 22,
    "High": 13,
    "Urgent": 5
  }
}
```

---

## 4. Notification Endpoints

### 4.1 Fetch In-App Notifications
- **Endpoint:** `GET /notifications`
- **Description:** Retrieves real-time alerts dispatched to the authenticated user.
- **Request Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "notifications": [
    {
      "_id": "67b9319c321a59218d6e9010",
      "complaintId": "#CP-1048",
      "message": "Complaint #CP-1048 has been marked as resolved: Drainage pipe unclogged and secondary tray sealed.",
      "read": false,
      "createdAt": "2026-10-24T06:30:00.000Z"
    }
  ]
}
```

---

### 4.2 Count Unread Notifications
- **Endpoint:** `GET /notifications/unread-count`
- **Request Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "count": 1
}
```

---

### 4.3 Mark Single Notification as Read
- **Endpoint:** `PUT /notifications/:id/read`
- **Request Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification marked as read."
}
```

---

### 4.4 Mark All Notifications as Read
- **Endpoint:** `PUT /notifications/mark-all-read`
- **Request Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "All notifications marked as read."
}
```

---

### 4.5 Delete Notification
- **Endpoint:** `DELETE /notifications/:id`
- **Request Headers:** `Authorization: Bearer <token>`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification deleted."
}
```
