# SMART COMMUNITY USING AI
### Full-Stack AI-Powered Travel Community, Companion Matching & Secure Transit Platform

A complete, production-grade, high-fidelity full-stack web application featuring an **Express.js & Socket.IO Real-Time Backend** and a **Tailwind CSS + Leaflet.js Interactive Frontend**.

---

## 🚀 Quick Start (Running Frontend & Backend)

### Method 1: Run Full-Stack Server (Recommended)
1. Open a terminal in this folder:
   ```bash
   npm start
   ```
   *(or `node server.js`)*
2. Open your browser at:
   👉 **`http://localhost:3000`**

### Method 2: Standalone Frontend
You can also directly double-click [`index.html`](file:///c:/Users/hp/OneDrive/Desktop/project%20prototype/index.html) in file explorer. The frontend features automatic fallback logic so the interactive prototype runs smoothly in both online connected and standalone modes.

---

## 🏗️ Architecture Overview

```
project prototype/
├── backend/
│   ├── aiMatchingEngine.js   # Multi-dimensional AI matching & weighted compatibility algorithm
│   └── database.js           # In-memory data store for users, journeys, communities, chats & SOS logs
├── server.js                 # Express REST API server + Socket.IO real-time WebSocket hub (Port 3000)
├── package.json              # Backend dependencies (express, cors, socket.io)
├── index.html                # Master responsive frontend application shell
├── app.js                    # Reactive frontend state engine & WebSocket client
├── style.css                 # Dark cyber theme, animations, pulsing pins & route dash styling
└── README.md                 # Full documentation & demo walkthrough guide
```

---

## 🔌 Backend REST API & Socket.IO Endpoints

### 🔐 Authentication & Trust Profile
- `POST /api/auth/login` — Authenticates traveler & returns JWT token + Trust Score (85%).
- `POST /api/auth/register` — Registers new traveler with hometown & current city.
- `GET /api/auth/profile` — Retrieves active user verification tier & history.

### 🧠 AI Traveler Matching & Journeys
- `POST /api/journeys` — Posts new travel itinerary (Lucknow → Ghaziabad) & triggers the AI Matching Algorithm.
- `GET /api/matches` — Evaluates candidate journeys using multi-factor weights (Route 40%, Date/Time 25%, Hometown 15%, Trust 20%) to rank matches:
  - **Aman Verma: 94% Compatibility**
  - **Rahul Sharma: 91% Compatibility**
  - **Priya Singh: 87% Compatibility**

### 💬 Real-Time Secure Chat (WebSockets)
- `POST /api/connections/request` — Dispatches connection request & triggers instant acceptance.
- `GET /api/chat/messages` — Retrieves encrypted conversation history.
- `POST /api/chat/send` — Dispatches messages and emits `receive_message` socket events.
- `POST /api/chat/share-journey` — Generates interactive journey ticket cards in chat.

### 📍 Live GPS Location & Telemetry
- `GET /api/tracking/telemetry` — Fetches current companion coordinates, speed (78 km/h), and ETA.
- `POST /api/tracking/update-location` — Broadcasts live waypoint updates via `companion_location_stream`.

### 👥 Communities & Parcel Sharing
- `GET /api/communities` — Returns local hometown circles (*People from Lucknow in Ghaziabad*).
- `POST /api/communities/:id/join` — Toggles circle membership.
- `POST /api/communities/:id/posts` — Creates and broadcasts community feed posts.
- `POST /api/parcels/request` — Dispatches peer-to-peer package delivery requests with safety insurance.

### 🛡️ Safety Center & Emergency SOS
- `POST /api/safety/sos` — Dispatches emergency beacon with GPS coordinates to emergency contacts & helpline 112 via `emergency_sos_broadcast`.
- `POST /api/safety/report` — Files user incident reports for 15-minute review.

---

## 🌟 Guided Demonstration Flow (16-Step Story)

The prototype includes a **Presentation Toolbar** at the top with a **"Guided Next Step"** button to present the complete user flow step-by-step:

1. **Login** (`anurag.sharma@travelnet.ai` / `TravelAI@2026`)
2. **Registration** (Hometown: Lucknow, Destination: Ghaziabad)
3. **Profile Verification** (Trust Score: 85% Tier 2 Verified)
4. **Dashboard Overview** (Statistics, AI recommendations, Quick service tiles)
5. **Create Journey** (Lucknow → Ghaziabad, 12 Oct 2026, 09:30 AM, Train)
6. **AI Traveler Matching** (Animated neural scanner & ranked compatibility scores)
7. **Traveler Profile** (Inspect Aman Verma 94% match, 92% trust score)
8. **Connection Request** (Personalized message & simulated acceptance)
9. **Secure Chat** (Real-time conversation with verified companion)
10. **Share Journey** (Interactive journey card in chat)
11. **Live Location Tracking** (Leaflet map with moving GPS marker, telemetry, speed & ETA)
12. **Community Hub** (*People from Lucknow in Ghaziabad* discussion board)
13. **Parcel Sharing** (Matching compatible package carriers safely)
14. **Safety Center & SOS** (Emergency distress beacon & 112 police helpline)
15. **Profile & Reviews** (Travel history, badges, and peer reviews)
16. **Settings & Logout** (Privacy toggles, 2FA, and sign-out)
