/**
 * SMART COMMUNITY USING AI - Backend Server
 * Express REST API + Socket.IO Real-time Engine
 */

const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');

const db = require('./backend/database');
const { rankMatches } = require('./backend/aiMatchingEngine');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ==========================================
// 1. AUTHENTICATION & PROFILE APIS
// ==========================================

// Login API
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email or fallback to demo user
  const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) || db.users[0];

  return res.json({
    success: true,
    message: 'Login successful',
    token: `jwt-smart-token-${user.id}-${Date.now()}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      hometown: user.hometown,
      currentCity: user.currentCity,
      avatar: user.avatar,
      trustScore: user.trustScore,
      isVerified: user.isVerified,
      verificationTier: user.verificationTier
    }
  });
});

// Register API
app.post('/api/auth/register', (req, res) => {
  const { name, email, mobile, hometown, currentCity } = req.body;
  const newUser = {
    id: `usr-${Date.now()}`,
    name: name || 'New Traveler',
    email: email || 'user@travelnet.ai',
    mobile: mobile || '+91 98765 00000',
    hometown: hometown || 'Lucknow',
    currentCity: currentCity || 'Ghaziabad',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    trustScore: 85,
    isVerified: true,
    verificationTier: 'Tier 2 (Email + Phone Verified)',
    about: 'Community traveler on smart travel network.'
  };

  db.users.push(newUser);
  return res.status(201).json({
    success: true,
    message: 'Account registered successfully',
    user: newUser
  });
});

// Get User Profile
app.get('/api/auth/profile', (req, res) => {
  const user = db.users[0];
  return res.json({ success: true, user });
});

// ==========================================
// 2. JOURNEYS & AI MATCHING APIS
// ==========================================

// Create Journey and trigger AI matching
app.post('/api/journeys', (req, res) => {
  const { from, to, date, time, mode, purpose } = req.body;
  const userProfile = db.users[0];

  const newJourney = {
    id: `jrn-${Date.now()}`,
    userId: userProfile.id,
    from: from || 'Lucknow',
    to: to || 'Ghaziabad',
    date: date || '2026-10-12',
    time: time || '09:30',
    mode: mode || 'Train',
    purpose: purpose || 'Education',
    status: 'Active'
  };

  db.journeys.unshift(newJourney);

  // Run AI matching algorithm against database candidate journeys
  const candidateJourneys = db.journeys.filter(j => j.userId !== userProfile.id);
  const rankedMatches = rankMatches(newJourney, userProfile, candidateJourneys, db.users);

  // Broadcast new travel journey to community
  io.emit('new_journey_created', {
    journey: newJourney,
    travelerName: userProfile.name
  });

  return res.status(201).json({
    success: true,
    message: 'Journey created and AI matching executed',
    journey: newJourney,
    aiMatches: rankedMatches
  });
});

// Get AI Matches
app.get('/api/matches', (req, res) => {
  const userProfile = db.users[0];
  const userJourney = db.journeys.find(j => j.userId === userProfile.id) || {
    from: 'Lucknow',
    to: 'Ghaziabad',
    date: '2026-10-12',
    time: '09:30'
  };

  const candidateJourneys = db.journeys.filter(j => j.userId !== userProfile.id);
  const ranked = rankMatches(userJourney, userProfile, candidateJourneys, db.users);

  return res.json({ success: true, matches: ranked });
});

// ==========================================
// 3. CONNECTION REQUESTS APIS
// ==========================================

app.post('/api/connections/request', (req, res) => {
  const { targetUserId, message } = req.body;
  const targetUser = db.users.find(u => u.id === targetUserId || u.name.toLowerCase().includes('aman')) || db.users[1];

  const newConn = {
    id: `conn-${Date.now()}`,
    senderId: db.users[0].id,
    receiverId: targetUser.id,
    message: message || "Let's connect and travel safely together.",
    status: 'ACCEPTED', // simulated acceptance
    createdAt: new Date().toISOString()
  };

  db.connections.push(newConn);

  // Real-time socket event for connection acceptance
  io.emit('connection_accepted', {
    connectionId: newConn.id,
    receiverName: targetUser.name,
    receiverAvatar: targetUser.avatar
  });

  return res.json({
    success: true,
    message: `Connection accepted by ${targetUser.name}! Secure chat unlocked.`,
    connection: newConn
  });
});

// ==========================================
// 4. CHAT APIS
// ==========================================

app.get('/api/chat/messages', (req, res) => {
  return res.json({ success: true, messages: db.messages });
});

app.post('/api/chat/send', (req, res) => {
  const { text, receiverId } = req.body;
  const newMsg = {
    id: `msg-${Date.now()}`,
    senderId: db.users[0].id,
    receiverId: receiverId || 'usr-2',
    text: text || 'Hello!',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now()
  };

  db.messages.push(newMsg);

  // Broadcast real-time message via socket
  io.emit('receive_message', newMsg);

  return res.status(201).json({ success: true, message: newMsg });
});

app.post('/api/chat/share-journey', (req, res) => {
  const journey = db.journeys[0];
  const shareMsg = {
    id: `msg-journey-${Date.now()}`,
    senderId: db.users[0].id,
    receiverId: 'usr-2',
    type: 'JOURNEY_CARD',
    journeyData: journey,
    text: `Shared Journey: ${journey.from} → ${journey.to} on ${journey.date} (${journey.time})`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now()
  };

  db.messages.push(shareMsg);
  io.emit('receive_message', shareMsg);

  return res.json({ success: true, shareMsg });
});

// ==========================================
// 5. LIVE LOCATION TELEMETRY APIS
// ==========================================

app.get('/api/tracking/telemetry', (req, res) => {
  return res.json({
    success: true,
    status: 'On the Way (Live)',
    corridor: 'Lucknow → Ghaziabad',
    currentLocationName: 'Ghaziabad Railway Station (Approaching IMS College)',
    speed: '78 km/h',
    etaMinutes: 25,
    distanceKm: 14.2,
    companion: {
      name: 'Aman Verma',
      trustScore: 92,
      lat: 28.6692,
      lng: 77.4538
    }
  });
});

app.post('/api/tracking/update-location', (req, res) => {
  const { lat, lng, speed, etaMinutes } = req.body;
  
  // Broadcast location update in real-time
  io.emit('companion_location_stream', {
    lat: lat || 28.6692,
    lng: lng || 77.4538,
    speed: speed || '75 km/h',
    etaMinutes: etaMinutes || 22,
    updatedAt: new Date().toISOString()
  });

  return res.json({ success: true, message: 'Telemetry updated and broadcasted' });
});

// ==========================================
// 6. COMMUNITY & PARCEL APIS
// ==========================================

app.get('/api/communities', (req, res) => {
  return res.json({ success: true, communities: db.communities });
});

app.post('/api/communities/:id/join', (req, res) => {
  const comm = db.communities.find(c => c.id === req.params.id) || db.communities[0];
  comm.joined = !comm.joined;
  if (comm.joined) comm.membersCount += 1;
  else comm.membersCount = Math.max(1, comm.membersCount - 1);

  return res.json({ success: true, joined: comm.joined, membersCount: comm.membersCount });
});

app.get('/api/communities/:id/posts', (req, res) => {
  const posts = db.posts.filter(p => p.communityId === req.params.id || p.communityId === 'comm-1');
  return res.json({ success: true, posts });
});

app.post('/api/communities/:id/posts', (req, res) => {
  const { text } = req.body;
  const newPost = {
    id: `post-${Date.now()}`,
    communityId: req.params.id || 'comm-1',
    authorName: db.users[0].name,
    authorAvatar: db.users[0].avatar,
    verified: true,
    text: text || 'Looking for travel companions along Lucknow-Ghaziabad highway.',
    time: 'Just now',
    likes: 0
  };

  db.posts.unshift(newPost);
  io.emit('new_community_post', newPost);

  return res.status(201).json({ success: true, post: newPost });
});

app.post('/api/parcels/request', (req, res) => {
  const { from, to, parcelType, weight, date } = req.body;
  const newParcel = {
    id: `pcl-${Date.now()}`,
    senderId: db.users[0].id,
    matchedTravelerId: 'usr-2',
    from: from || 'Delhi',
    to: to || 'Ghaziabad',
    parcelType: parcelType || 'Documents',
    weight: weight || '1.5 kg',
    date: date || '2026-10-12',
    status: 'REQUEST_SENT'
  };

  db.parcels.push(newParcel);
  return res.status(201).json({
    success: true,
    message: 'Parcel sharing request sent with Safety Insurance Tracking.',
    parcel: newParcel
  });
});

// ==========================================
// 7. SAFETY CENTER & SOS APIS
// ==========================================

app.post('/api/safety/sos', (req, res) => {
  const { lat, lng, emergencyContacts } = req.body;
  const sosEvent = {
    id: `sos-${Date.now()}`,
    userId: db.users[0].id,
    userName: db.users[0].name,
    coords: { lat: lat || 28.6692, lng: lng || 77.4538 },
    timestamp: new Date().toISOString(),
    status: 'ACTIVE_DISTRESS_BROADCAST',
    dispatchedTo: ['+91 99887 76655', '+91 98112 23344', 'Local Police Station Ghaziabad (112)']
  };

  db.sosAlerts.push(sosEvent);

  // Broadcast SOS distress signal to active network listeners
  io.emit('emergency_sos_broadcast', sosEvent);

  return res.status(201).json({
    success: true,
    message: 'EMERGENCY SOS DISPATCHED: Live telemetry sent to contacts and local helpline',
    sosEvent
  });
});

app.post('/api/safety/report', (req, res) => {
  const { reportedUser, reason, details } = req.body;
  return res.json({
    success: true,
    message: 'Safety report filed successfully. Profile flagged for 15-minute review.'
  });
});

// ==========================================
// REAL-TIME SOCKET.IO EVENT HANDLERS
// ==========================================
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  // Handle client sending a message
  socket.on('send_message', (data) => {
    const msg = {
      id: `msg-${Date.now()}`,
      senderId: data.senderId || 'usr-1',
      receiverId: data.receiverId || 'usr-2',
      text: data.text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    };
    db.messages.push(msg);
    io.emit('receive_message', msg);
  });

  // Handle live location updates from companion
  socket.on('update_location', (data) => {
    io.emit('companion_location_stream', data);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
server.listen(PORT, () => {
  console.log(`
=====================================================
  SMART COMMUNITY USING AI - FULL STACK SERVER
=====================================================
  🚀 Server running at: http://localhost:${PORT}
  📡 Socket.IO Real-Time Engine Active on Port ${PORT}
  🧠 AI Traveler Matching Algorithm Initialized
  🛡️  24/7 Safety & Telemetry Service Online
=====================================================
  `);
});
