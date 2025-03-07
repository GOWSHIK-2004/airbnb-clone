# MERN Stack Airbnb Clone

An Airbnb-like platform built using the MERN stack where users can list and book accommodations.

**Features**
---

- User Authentication (JWT-based Login & Registration)
- List Accommodations (Users can add their properties)
- Book Accommodations (Logged-in users can make bookings)
- Favorites (Save accommodations for later)
- User Dashboard (View owned properties & bookings)
- Email OTP Verification

**Tech Stack**
---

- Frontend: React, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB Atlas, Firebase storage
- Authentication: JWT
- Deployment: Render (backend), Vercel (frontend)

**Data Structures & Algorithms Implemented**
---

- Trie for efficient searching
- Overlapping intervals algorithm to prevent booking conflict

**Installation & Setup**
---

1️. Clone the Repository

2️. Install Dependencies

- Backend Setup

```bash
cd backend
npm install
```

- Frontend Setup

```bash
cd frontend
npm install
```

3️. Configure Environment Variables

Create respective .env file in backend & frontend directory and add environment variables as mentioned in .env_sample.txt

4️. Run the Application

- Start Backend Server

```bash
cd backend
npm start
```

- Start Frontend Server

```bash
cd frontend
npm run dev
```