/**
 * SMART COMMUNITY USING AI - Full-Stack Frontend Engine
 * Connects directly to Express REST API & Socket.IO WebSockets with standalone offline fallback
 */

class SmartCommunityApp {
  constructor() {
    this.apiBaseUrl = window.location.origin.includes('http') ? window.location.origin : 'http://localhost:3000';
    this.socket = null;
    this.isBackendConnected = false;

    // Application State
    this.state = {
      currentUser: {
        id: 'usr-1',
        name: 'Anurag Sharma',
        email: 'anurag.sharma@travelnet.ai',
        mobile: '+91 98765 43210',
        hometown: 'Lucknow',
        currentCity: 'Ghaziabad (Delhi NCR)',
        trustScore: 85,
        isVerified: true
      },
      currentJourney: {
        from: 'Lucknow',
        to: 'Ghaziabad',
        date: '2026-10-12',
        time: '09:30 AM',
        mode: 'Train (AC-3 Tier)',
        purpose: 'Education & College'
      },
      matchedTravelers: {
        aman: {
          id: 'usr-2',
          key: 'aman',
          name: 'Aman Verma',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
          hometown: 'Lucknow',
          currentCity: 'Ghaziabad',
          from: 'Lucknow',
          to: 'Ghaziabad',
          date: '12 October 2026',
          time: '09:30 AM',
          mode: 'Train (Lucknow Intercity)',
          trustScore: '92%',
          matchPercent: '94%',
          verified: true,
          about: 'Final year B.Tech student traveling frequently between Lucknow Charbagh and Ghaziabad. Friendly, punctual, and strictly follows travel safety rules.',
          connected: false
        },
        rahul: {
          id: 'usr-3',
          key: 'rahul',
          name: 'Rahul Sharma',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
          hometown: 'Kanpur',
          currentCity: 'Ghaziabad',
          from: 'Delhi',
          to: 'Ghaziabad',
          date: '12 October 2026',
          time: '10:15 AM',
          mode: 'Metro / Local Train',
          trustScore: '89%',
          matchPercent: '91%',
          verified: true,
          about: 'Working professional in IT sector. Regular commuter along Delhi-Ghaziabad corridor.',
          connected: false
        },
        priya: {
          id: 'usr-4',
          key: 'priya',
          name: 'Priya Singh',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
          hometown: 'Kanpur',
          currentCity: 'Ghaziabad',
          from: 'Kanpur',
          to: 'Ghaziabad',
          date: '12 October 2026',
          time: '11:00 AM',
          mode: 'Volvo AC Bus',
          trustScore: '95%',
          matchPercent: '87%',
          verified: true,
          about: 'Research scholar visiting IMS Engineering college for conference. Verified female traveler network advocate.',
          connected: false
        }
      },
      activeTravelerProfile: 'aman',
      notifications: [
        { id: 1, text: 'AI found 3 high-compatibility travel matches for Lucknow → Ghaziabad', time: '10m ago', unread: true, targetTab: 'tab-ai-matching', icon: 'sparkles', color: 'text-purple-400' },
        { id: 2, text: 'Aman Verma accepted your connection request. Secure chat is now unlocked.', time: '2m ago', unread: true, targetTab: 'tab-chat', icon: 'check-circle-2', color: 'text-emerald-400' },
        { id: 3, text: 'Your Trust Score reached 85% with Verified Tier 2 badge.', time: '1h ago', unread: false, targetTab: 'tab-safety', icon: 'shield-check', color: 'text-cyan-400' },
        { id: 4, text: 'New post in "People from Lucknow in Ghaziabad" community.', time: '2h ago', unread: false, targetTab: 'tab-community', icon: 'users', color: 'text-amber-400' }
      ],
      currentStepIndex: 0,
      mapInstance: null,
      markerUser: null,
      markerAman: null,
      routePolyline: null,
      isLiveSimulating: false,
      liveSimInterval: null,
      simStep: 0
    };

    // Presentation Demo Sequence
    this.demoSteps = [
      { step: '1. Login Screen', screen: 'screen-login', tab: null, desc: 'Login to access the AI travel network' },
      { step: '2. Registration', screen: 'screen-register', tab: null, desc: 'Register new traveler profile' },
      { step: '3. Profile Verification', screen: 'screen-verify', tab: null, desc: 'View AI trust score 85% & verification steps' },
      { step: '4. Dashboard', screen: 'authenticated-shell', tab: 'tab-dashboard', desc: 'Overview of matches, stats, and recommended companions' },
      { step: '5. Create Journey', screen: 'authenticated-shell', tab: 'tab-create-journey', desc: 'Create journey from Lucknow to Ghaziabad' },
      { step: '6. AI Matching', screen: 'authenticated-shell', tab: 'tab-ai-matching', desc: 'Neural AI matching scanner & top recommendations' },
      { step: '7. Traveler Profile', modal: 'modal-traveler-profile', desc: 'Inspect Aman Verma (94% Match, 92% Trust)' },
      { step: '8. Connect Request', modal: 'modal-connect-request', desc: 'Send connection request to Aman Verma' },
      { step: '9. Secure Chat', screen: 'authenticated-shell', tab: 'tab-chat', desc: 'Chat in real-time with verified companion Aman' },
      { step: '10. Share Journey in Chat', screen: 'authenticated-shell', tab: 'tab-chat', action: 'shareJourney', desc: 'Share travel card directly inside chat' },
      { step: '11. Live Location Tracking', screen: 'authenticated-shell', tab: 'tab-live-tracking', desc: 'Track live GPS movement and route telemetry' },
      { step: '12. Community Hub', screen: 'authenticated-shell', tab: 'tab-community', desc: 'Browse Lucknow in Ghaziabad circles' },
      { step: '13. Parcel Sharing', screen: 'authenticated-shell', tab: 'tab-parcel', desc: 'Find trusted travelers to share packages' },
      { step: '14. Safety Center & SOS', screen: 'authenticated-shell', tab: 'tab-safety', desc: 'Safety protocols and instant SOS alert' },
      { step: '15. Profile & Reviews', screen: 'authenticated-shell', tab: 'tab-profile', desc: 'View user trust badge, history and ratings' },
      { step: '16. Settings & Logout', screen: 'authenticated-shell', tab: 'tab-settings', desc: 'Manage privacy, 2FA, and sign out' }
    ];

    this.audioCtx = null;
  }

  // Initialize UI, Icons, and Real-Time WebSockets
  init() {
    this.renderLucide();
    this.renderNotificationsList();
    this.updateCurrentStepLabel();
    this.initSocketConnection();

    // Setup audio context on first user click
    document.addEventListener('click', () => {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.audioCtx = new AudioContext();
        }
      }
    }, { once: true });
  }

  // Socket.IO Real-Time Connection
  initSocketConnection() {
    if (typeof io !== 'undefined') {
      try {
        this.socket = io(this.apiBaseUrl, { timeout: 3000 });

        this.socket.on('connect', () => {
          this.isBackendConnected = true;
          console.log('[Socket.IO] Connected to backend server successfully!');
        });

        // Listen for real-time chat messages
        this.socket.on('receive_message', (msg) => {
          if (msg.senderId !== this.state.currentUser.id) {
            this.appendChatMessage(msg.text, 'aman');
            this.playSound('notification');
          }
        });

        // Listen for real-time companion location stream
        this.socket.on('companion_location_stream', (telemetry) => {
          if (this.state.markerAman && telemetry.lat && telemetry.lng) {
            this.state.markerAman.setLatLng([telemetry.lat, telemetry.lng]);
          }
        });

        // Listen for emergency SOS broadcast alerts
        this.socket.on('emergency_sos_broadcast', (sos) => {
          this.showToast(`🚨 NETWORK SOS ALERT: ${sos.userName} triggered emergency beacon!`, 'error');
        });

      } catch (err) {
        console.warn('Socket connection initialized in offline client mode:', err);
      }
    }
  }

  // Acoustic synthesizer
  playSound(type = 'click') {
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.audioCtx = new AudioContext();
      }
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;

      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.1); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'notification') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'sos') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(440, now + 0.15);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(380, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {
      console.warn('Audio skipped:', e);
    }
  }

  renderLucide() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  showToast(message, type = 'info') {
    this.playSound(type === 'success' ? 'success' : (type === 'error' ? 'sos' : 'notification'));
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-item pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-xs backdrop-blur-md transition-all';

    let icon = 'info';
    let style = 'bg-slate-900/95 border-slate-700 text-slate-100';

    if (type === 'success') {
      icon = 'check-circle-2';
      style = 'bg-emerald-950/95 border-emerald-500/50 text-emerald-100 shadow-emerald-900/30';
    } else if (type === 'error') {
      icon = 'alert-triangle';
      style = 'bg-rose-950/95 border-rose-500/60 text-rose-100 shadow-rose-900/40';
    } else if (type === 'match') {
      icon = 'sparkles';
      style = 'bg-purple-950/95 border-purple-500/50 text-purple-100 shadow-purple-900/30';
    }

    toast.className += ` ${style}`;
    toast.innerHTML = `
      <i data-lucide="${icon}" class="w-4 h-4 flex-shrink-0"></i>
      <span class="font-medium">${message}</span>
    `;

    container.appendChild(toast);
    this.renderLucide();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  navigateTo(screenId) {
    this.playSound('click');
    const screens = ['screen-login', 'screen-register', 'screen-verify', 'authenticated-shell'];
    screens.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.renderLucide();
  }

  switchTab(tabId) {
    this.playSound('click');
    this.navigateTo('authenticated-shell');

    const tabViews = document.querySelectorAll('.tab-view');
    tabViews.forEach(el => el.classList.add('hidden'));

    const navButtons = document.querySelectorAll('.nav-item');
    navButtons.forEach(btn => btn.classList.remove('active'));

    const targetTab = document.getElementById(tabId);
    if (targetTab) {
      targetTab.classList.remove('hidden');
    }

    const activeBtn = document.querySelector(`[data-tab-btn="${tabId}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }

    const headerTitle = document.getElementById('header-page-title');
    const titles = {
      'tab-dashboard': 'Dashboard Overview',
      'tab-create-journey': 'Create New Journey',
      'tab-ai-matching': 'AI Traveler Matching',
      'tab-chat': 'Secure End-to-End Chat',
      'tab-live-tracking': 'Live Location GPS Tracking',
      'tab-community': 'Smart Regional Community',
      'tab-parcel': 'Community Parcel Sharing',
      'tab-safety': 'Safety & Emergency Center',
      'tab-profile': 'User Profile & Trust Score',
      'tab-settings': 'Account & Privacy Settings'
    };
    if (headerTitle && titles[tabId]) {
      headerTitle.textContent = titles[tabId];
    }

    if (tabId === 'tab-live-tracking') {
      setTimeout(() => this.initLiveMap(), 150);
    }

    this.renderLucide();
  }

  fillDemoLogin() {
    const emailInput = document.getElementById('login-email');
    const pwdInput = document.getElementById('login-password');
    if (emailInput) emailInput.value = 'anurag.sharma@travelnet.ai';
    if (pwdInput) pwdInput.value = 'TravelAI@2026';
    this.showToast('Demo credentials auto-filled', 'info');
  }

  // Handle Login via REST API
  async handleLogin(event) {
    event.preventDefault();
    this.playSound('click');
    const submitBtn = document.getElementById('btn-login-submit');
    const btnText = document.getElementById('login-btn-text');

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (submitBtn && btnText) {
      submitBtn.disabled = true;
      btnText.innerHTML = '<span class="inline-block animate-spin mr-2">⟳</span> Authenticating via API...';
    }

    try {
      // Fetch from Backend REST API
      const res = await fetch(`${this.apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.user) {
        this.state.currentUser = data.user;
      }
    } catch (e) {
      console.log('Client-mode auth active');
    }

    setTimeout(() => {
      if (submitBtn && btnText) {
        submitBtn.disabled = false;
        btnText.textContent = 'Sign In to Community';
      }
      this.showToast('Login successful! Connected to Smart Travel Network.', 'success');
      this.switchTab('tab-dashboard');
      this.triggerConfetti();
      this.updateStepByIndex(3);
    }, 450);
  }

  // Handle Register via REST API
  async handleRegister(event) {
    event.preventDefault();
    this.playSound('click');

    const name = document.getElementById('reg-name')?.value || 'Anurag Sharma';
    const email = document.getElementById('reg-email')?.value || 'anurag.sharma@travelnet.ai';
    const hometown = document.getElementById('reg-hometown')?.value || 'Lucknow';
    const currentCity = document.getElementById('reg-city')?.value || 'Ghaziabad';

    try {
      await fetch(`${this.apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, hometown, currentCity })
      });
    } catch (e) {
      console.log('Registration registered in memory');
    }

    this.showToast('Account registered successfully!', 'success');
    this.navigateTo('screen-verify');
    this.updateStepByIndex(2);
  }

  completeVerification() {
    this.playSound('success');
    this.showToast('Profile verified with Tier 2 (85% Trust Score)!', 'success');
    this.switchTab('tab-dashboard');
    this.triggerConfetti();
    this.updateStepByIndex(3);
  }

  // Handle Create Journey via REST API & AI Matching Algorithm
  async handleCreateJourney(event) {
    event.preventDefault();
    this.playSound('click');

    const fromCity = document.getElementById('journey-from').value || 'Lucknow';
    const toCity = document.getElementById('journey-to').value || 'Ghaziabad';
    const travelDate = document.getElementById('journey-date').value || '2026-10-12';
    const travelTime = document.getElementById('journey-time').value || '09:30';

    this.state.currentJourney = {
      from: fromCity,
      to: toCity,
      date: travelDate,
      time: travelTime,
      mode: 'Train (AC-3 Tier)',
      purpose: 'Education'
    };

    const statJourney = document.getElementById('dash-stat-journey');
    if (statJourney) statJourney.textContent = `${travelDate}`;

    try {
      const res = await fetch(`${this.apiBaseUrl}/api/journeys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state.currentJourney)
      });
      const data = await res.json();
      console.log('AI Matches from backend:', data.aiMatches);
    } catch (e) {
      console.log('AI matcher executed locally');
    }

    this.showToast('Journey Created Successfully ✓', 'success');
    
    setTimeout(() => {
      this.switchTab('tab-ai-matching');
      this.runAIMatchingAnimation();
      this.updateStepByIndex(5);
    }, 500);
  }

  runAIMatchingAnimation() {
    const statusText = document.getElementById('ai-scan-status-text');
    if (statusText) {
      statusText.innerHTML = '<span class="text-purple-300 animate-pulse">AI Algorithm scanning corridor Lucknow → Ghaziabad across 4,200 travelers...</span>';
      
      setTimeout(() => {
        statusText.innerHTML = '<span class="text-cyan-300 font-semibold">Matched 3 verified companions. Top match: Aman Verma (94% Compatibility).</span>';
        this.showToast('AI analysis completed: 3 high-trust matches found!', 'match');
        this.triggerConfetti();
      }, 900);
    }
  }

  viewTravelerProfile(travelerId) {
    this.playSound('click');
    const traveler = this.state.matchedTravelers[travelerId] || this.state.matchedTravelers.aman;
    this.state.activeTravelerProfile = travelerId;

    document.getElementById('modal-profile-img').src = traveler.avatar;
    document.getElementById('modal-profile-name').textContent = traveler.name;
    document.getElementById('modal-profile-cities').textContent = `Hometown: ${traveler.hometown} • Current City: ${traveler.currentCity}`;
    document.getElementById('modal-profile-trust').textContent = `AI Trust Score: ${traveler.trustScore}`;
    document.getElementById('modal-profile-from').textContent = traveler.from;
    document.getElementById('modal-profile-to').textContent = traveler.to;
    document.getElementById('modal-profile-date').textContent = traveler.date;
    document.getElementById('modal-profile-time').textContent = traveler.time;
    document.getElementById('modal-profile-mode').textContent = traveler.mode;
    document.getElementById('modal-profile-about').textContent = traveler.about;

    const connectBtn = document.getElementById('modal-btn-connect');
    if (connectBtn) {
      connectBtn.textContent = traveler.connected ? 'Connected ✓' : 'Connect';
      connectBtn.className = traveler.connected 
        ? 'flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs'
        : 'flex-1 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 text-white font-bold text-xs shadow-lg';
    }

    this.openModal('modal-traveler-profile');
  }

  triggerConnectFromModal() {
    this.closeModal('modal-traveler-profile');
    this.openConnectModal(this.state.activeTravelerProfile);
  }

  openConnectModal(travelerId) {
    this.playSound('click');
    const traveler = this.state.matchedTravelers[travelerId] || this.state.matchedTravelers.aman;
    this.state.activeTravelerProfile = travelerId;
    document.getElementById('connect-target-name').textContent = traveler.name;
    this.openModal('modal-connect-request');
  }

  // Send Connection Request via Backend API
  async sendConnectionRequest() {
    this.playSound('click');
    const travelerId = this.state.activeTravelerProfile;
    const traveler = this.state.matchedTravelers[travelerId] || this.state.matchedTravelers.aman;
    const customMsg = document.getElementById('connect-message-input')?.value;
    
    this.closeModal('modal-connect-request');
    this.showToast(`✓ Connection Request Sent to ${traveler.name}`, 'info');

    try {
      await fetch(`${this.apiBaseUrl}/api/connections/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: traveler.id, message: customMsg })
      });
    } catch (e) {
      console.log('Connection request saved');
    }

    setTimeout(() => {
      traveler.connected = true;
      this.playSound('success');
      this.showToast(`✓ Connection Accepted! ${traveler.name} is now connected with you.`, 'success');
      this.triggerConfetti();

      const chatBadge = document.getElementById('chat-unread-badge');
      if (chatBadge) chatBadge.classList.remove('hidden');

      this.state.notifications.unshift({
        id: Date.now(),
        text: `${traveler.name} accepted your connection request. Secure chat unlocked!`,
        time: 'Just now',
        unread: true,
        targetTab: 'tab-chat',
        icon: 'check-circle-2',
        color: 'text-emerald-400'
      });
      this.renderNotificationsList();

      setTimeout(() => {
        this.switchTab('tab-chat');
        this.updateStepByIndex(8);
      }, 700);
    }, 1100);
  }

  // Send Chat Message via REST / Socket.IO
  async sendChatMessage(event) {
    if (event) event.preventDefault();
    const input = document.getElementById('chat-text-input');
    if (!input || !input.value.trim()) return;

    const userText = input.value.trim();
    input.value = '';

    this.appendChatMessage(userText, 'user');
    this.playSound('click');

    try {
      if (this.socket && this.socket.connected) {
        this.socket.emit('send_message', {
          senderId: this.state.currentUser.id,
          receiverId: 'usr-2',
          text: userText
        });
      } else {
        await fetch(`${this.apiBaseUrl}/api/chat/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: userText, receiverId: 'usr-2' })
        });
      }
    } catch (e) {
      console.log('Chat message processed in memory');
    }

    // Smart bot reply simulation
    setTimeout(() => {
      const replies = [
        "Sounds great! I will be at Lucknow Charbagh Platform 1 by 09:10 AM.",
        "I have shared my live GPS location on the map so you can see when I arrive.",
        "Perfect coordination. Traveling with a verified companion is always safer and more comfortable!"
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      this.appendChatMessage(reply, 'aman');
      this.playSound('notification');
    }, 1200);
  }

  appendChatMessage(text, sender = 'user') {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    const msgDiv = document.createElement('div');
    const isUser = sender === 'user';
    msgDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'}`;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    msgDiv.innerHTML = `
      <div class="max-w-xs sm:max-w-md ${isUser ? 'bg-brand-600 text-white rounded-2xl rounded-tr-sm' : 'bg-slate-800 text-slate-100 rounded-2xl rounded-tl-sm border border-slate-700'} p-3 shadow-md">
        <p>${text}</p>
        <div class="text-[9px] ${isUser ? 'text-indigo-200' : 'text-slate-400'} text-right mt-1">${timeStr} ${isUser ? '• Sent ✓✓' : ''}</div>
      </div>
    `;

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;

    const lastMsgEl = document.getElementById('chat-sidebar-last-msg');
    if (lastMsgEl) lastMsgEl.textContent = text;
  }

  async shareJourneyInChat() {
    this.playSound('click');
    const slot = document.getElementById('chat-journey-card-slot');
    if (!slot) return;

    try {
      await fetch(`${this.apiBaseUrl}/api/chat/share-journey`, { method: 'POST' });
    } catch (e) {}

    slot.innerHTML = `
      <div class="my-2 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 border border-brand-500/50 shadow-xl max-w-sm ml-auto">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
          <span class="text-[10px] font-bold text-brand-400 flex items-center gap-1 uppercase tracking-wider">
            <i data-lucide="ticket" class="w-3 h-3"></i> Shared Journey Card
          </span>
          <span class="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">Confirmed</span>
        </div>
        <div class="text-xs space-y-1 text-slate-200">
          <div class="font-bold text-white text-sm">Lucknow → Ghaziabad</div>
          <div class="text-slate-400">Date: <strong class="text-brand-300">12 October 2026</strong></div>
          <div class="text-slate-400">Time: <strong class="text-brand-300">09:30 AM</strong> • Mode: <strong>Train</strong></div>
        </div>
        <button onclick="smartApp.switchTab('tab-live-tracking')" class="w-full mt-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md">
          <i data-lucide="navigation" class="w-3.5 h-3.5"></i>
          <span>Track Live Journey on Map</span>
        </button>
      </div>
    `;

    this.renderLucide();
    this.showToast('Journey card shared inside secure chat!', 'success');
    
    const container = document.getElementById('chat-messages-container');
    if (container) container.scrollTop = container.scrollHeight;
  }

  shareLocationInChat() {
    this.playSound('click');
    this.appendChatMessage('📍 Shared Live Location: Ghaziabad Junction (Lat: 28.6692, Lng: 77.4538). Click Live Map tab to view real-time telemetry.', 'user');
    this.showToast('Live GPS location shared with Aman', 'info');
  }

  // Initialize Leaflet Live Tracking Map
  initLiveMap() {
    if (this.state.mapInstance) {
      this.state.mapInstance.invalidateSize();
      return;
    }

    const mapEl = document.getElementById('live-map');
    if (!mapEl || !window.L) return;

    const centerCoords = [28.6692, 77.4538];
    const map = window.L.map('live-map', {
      center: centerCoords,
      zoom: 13,
      zoomControl: true
    });

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const routeCoordinates = [
      [28.6644, 77.4332],
      [28.6680, 77.4420],
      [28.6710, 77.4510],
      [28.6750, 77.4620],
      [28.6780, 77.4780],
      [28.6820, 77.4950],
      [28.6865, 77.5085]
    ];

    this.routeWaypoints = routeCoordinates;

    this.state.routePolyline = window.L.polyline(routeCoordinates, {
      color: '#6366f1',
      weight: 5,
      opacity: 0.85,
      className: 'leaflet-route-animated'
    }).addTo(map);

    const destIcon = window.L.divIcon({
      className: 'custom-dest-pin',
      html: `
        <div class="w-8 h-8 rounded-full bg-rose-600 border-2 border-white flex items-center justify-center text-white shadow-xl">
          <i style="font-size: 14px;">🏁</i>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    window.L.marker([28.6865, 77.5085], { icon: destIcon })
      .addTo(map)
      .bindPopup('<b>Destination:</b> IMS Engineering College, Ghaziabad');

    const amanIcon = window.L.divIcon({
      className: 'pulsing-companion-pin',
      html: `
        <div class="relative flex items-center justify-center">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" class="w-9 h-9 rounded-full border-2 border-cyan-400 shadow-xl object-cover">
          <span class="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    this.state.markerAman = window.L.marker(routeCoordinates[1], { icon: amanIcon })
      .addTo(map)
      .bindPopup('<b>Aman Verma (Live GPS)</b><br>Speed: 78 km/h • Verified Companion')
      .openPopup();

    this.state.mapInstance = map;
    map.fitBounds(this.state.routePolyline.getBounds(), { padding: [40, 40] });
  }

  // Live Location Telemetry Simulation
  toggleLiveSimulation() {
    this.playSound('click');
    const toggleBtn = document.getElementById('btn-toggle-tracking');
    const toggleText = document.getElementById('text-tracking-toggle');

    if (this.state.isLiveSimulating) {
      clearInterval(this.state.liveSimInterval);
      this.state.isLiveSimulating = false;
      if (toggleText) toggleText.textContent = 'Simulate Live Movement';
      if (toggleBtn) toggleBtn.className = 'px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5';
      this.showToast('Live telemetry simulation paused', 'info');
    } else {
      this.state.isLiveSimulating = true;
      if (toggleText) toggleText.textContent = 'Pause Movement';
      if (toggleBtn) toggleBtn.className = 'px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5';
      this.showToast('Simulating live GPS movement with backend WebSocket telemetry sync', 'success');

      const waypoints = this.routeWaypoints || [
        [28.6644, 77.4332], [28.6680, 77.4420], [28.6710, 77.4510],
        [28.6750, 77.4620], [28.6780, 77.4780], [28.6820, 77.4950], [28.6865, 77.5085]
      ];

      this.state.liveSimInterval = setInterval(async () => {
        this.state.simStep = (this.state.simStep + 1) % waypoints.length;
        const currentCoord = waypoints[this.state.simStep];

        if (this.state.markerAman) {
          this.state.markerAman.setLatLng(currentCoord);
        }

        const etaVal = document.getElementById('map-eta-val');
        const distVal = document.getElementById('map-dist-val');
        const locVal = document.getElementById('map-current-loc');

        const remainingKm = Math.max(1.2, (14.2 - (this.state.simStep * 2.1))).toFixed(1);
        const remainingMin = Math.max(3, Math.round(remainingKm * 1.8));

        if (etaVal) etaVal.textContent = `${remainingMin} minutes`;
        if (distVal) distVal.textContent = `${remainingKm} km`;
        if (locVal) locVal.textContent = `Waypoint ${this.state.simStep + 1}: NH-24 Corridor (Approaching College)`;

        // Send telemetry update to backend
        try {
          if (this.socket && this.socket.connected) {
            this.socket.emit('update_location', {
              lat: currentCoord[0],
              lng: currentCoord[1],
              speed: '76 km/h',
              etaMinutes: remainingMin
            });
          }
        } catch (e) {}
      }, 2000);
    }
  }

  stopLiveTracking() {
    this.playSound('click');
    if (this.state.isLiveSimulating) {
      this.toggleLiveSimulation();
    }
    this.showToast('Live GPS sharing stopped for this session', 'info');
  }

  // Toggle Community Membership via REST API
  async toggleJoinCommunity(commId) {
    this.playSound('success');
    const btn = document.getElementById('btn-join-comm-1');
    if (btn) {
      if (btn.textContent.includes('Joined')) {
        btn.textContent = 'Join Community';
        btn.className = 'flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700';
        this.showToast('Left community circle', 'info');
      } else {
        btn.textContent = 'Joined ✓';
        btn.className = 'flex-1 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition-colors';
        this.showToast('Joined "People from Lucknow in Ghaziabad" Community!', 'success');
        this.triggerConfetti();
      }
    }

    try {
      await fetch(`${this.apiBaseUrl}/api/communities/comm-1/join`, { method: 'POST' });
    } catch (e) {}
  }

  openCommunityDetail(slug) {
    this.playSound('click');
    this.showToast('Opening Community Discussion and Local Chat Hub...', 'info');
    const feed = document.getElementById('community-feed-posts');
    if (feed) feed.scrollIntoView({ behavior: 'smooth' });
  }

  // Post to Community Feed via Backend API
  async openNewPostModal() {
    this.playSound('click');
    const userPrompt = prompt('Create a post in Lucknow in Ghaziabad Circle:', 'Heading to Lucknow on Friday. Any companion for shared cab from Charbagh?');
    if (userPrompt) {
      const feed = document.getElementById('community-feed-posts');
      if (feed) {
        const postDiv = document.createElement('div');
        postDiv.className = 'p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2';
        postDiv.innerHTML = `
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" alt="avatar" class="w-7 h-7 rounded-full object-cover">
              <span class="font-bold text-xs text-white">${this.state.currentUser.name}</span>
              <span class="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-semibold">Author</span>
            </div>
            <span class="text-[10px] text-slate-400">Just now</span>
          </div>
          <p class="text-xs text-slate-200">${userPrompt}</p>
        `;
        feed.prepend(postDiv);
        this.showToast('Post published to Community feed via REST API!', 'success');
      }

      try {
        await fetch(`${this.apiBaseUrl}/api/communities/comm-1/posts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: userPrompt })
        });
      } catch (e) {}
    }
  }

  likePost(btn) {
    this.playSound('click');
    btn.classList.toggle('text-rose-400');
    this.showToast('Liked post', 'info');
  }

  handleFindParcelTraveler(event) {
    event.preventDefault();
    this.playSound('click');
    this.showToast('AI found compatible verified traveler Aman Verma traveling on 12 Oct!', 'match');
    this.triggerConfetti();
  }

  async requestParcelSharing() {
    this.playSound('click');
    const btn = document.getElementById('btn-request-parcel');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>Parcel Sharing Request Sent ✓</span>';
      btn.className = 'w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2';
    }

    try {
      await fetch(`${this.apiBaseUrl}/api/parcels/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: 'Delhi', to: 'Ghaziabad', parcelType: 'Documents', weight: '1.5 kg' })
      });
    } catch (e) {}

    this.showToast('Parcel sharing request dispatched to Aman Verma with Safety Insurance.', 'success');
  }

  // Trigger Emergency SOS with GPS Dispatch
  async triggerEmergencySOS() {
    this.playSound('sos');
    this.openModal('modal-sos');

    try {
      await fetch(`${this.apiBaseUrl}/api/safety/sos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: 28.6692, lng: 77.4538 })
      });
    } catch (e) {}

    this.showToast('EMERGENCY SOS: Coordinates broadcasted to contacts & 112 emergency services', 'error');
  }

  showReportModal(userName) {
    this.playSound('click');
    this.openModal('modal-report');
  }

  async submitReport() {
    this.playSound('click');
    this.closeModal('modal-report');
    try {
      await fetch(`${this.apiBaseUrl}/api/safety/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportedUser: 'Aman Verma', reason: 'Flagged by user' })
      });
    } catch (e) {}
    this.showToast('Safety report filed. User flagged for review by trust team.', 'info');
  }

  toggleNotifications() {
    this.playSound('click');
    const panel = document.getElementById('notifications-panel');
    if (panel) {
      panel.classList.toggle('hidden');
    }
  }

  renderNotificationsList() {
    const list = document.getElementById('notifications-list');
    const badge = document.getElementById('notif-badge');
    if (!list) return;

    const unreadCount = this.state.notifications.filter(n => n.unread).length;
    if (badge) {
      badge.style.display = unreadCount > 0 ? 'block' : 'none';
    }

    list.innerHTML = this.state.notifications.map(n => `
      <div onclick="smartApp.handleNotificationClick(${n.id}, '${n.targetTab}')" class="p-3 hover:bg-slate-800/60 cursor-pointer flex items-start gap-3 ${n.unread ? 'bg-indigo-950/20' : ''}">
        <div class="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 ${n.color || 'text-brand-400'}">
          <i data-lucide="${n.icon || 'bell'}" class="w-3.5 h-3.5"></i>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[11px] text-slate-200 leading-snug ${n.unread ? 'font-semibold' : ''}">${n.text}</p>
          <span class="text-[9px] text-slate-400 mt-1 block">${n.time}</span>
        </div>
        ${n.unread ? '<span class="w-2 h-2 rounded-full bg-brand-500 mt-1"></span>' : ''}
      </div>
    `).join('');

    this.renderLucide();
  }

  handleNotificationClick(id, targetTab) {
    const item = this.state.notifications.find(n => n.id === id);
    if (item) item.unread = false;
    this.renderNotificationsList();
    this.toggleNotifications();
    if (targetTab) this.switchTab(targetTab);
  }

  markAllNotificationsRead() {
    this.state.notifications.forEach(n => n.unread = false);
    this.renderNotificationsList();
    this.showToast('All notifications marked as read', 'info');
  }

  toggleMobileSidebar() {
    this.showToast('Tip: Use bottom navigation or dashboard buttons on mobile', 'info');
  }

  openModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) {
      el.classList.remove('hidden');
      this.renderLucide();
    }
  }

  closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.add('hidden');
  }

  logout() {
    this.playSound('click');
    this.showToast('Signed out successfully', 'info');
    this.navigateTo('screen-login');
    this.updateStepByIndex(0);
  }

  toggleStoryGuide() {
    this.playSound('click');
    const modal = document.getElementById('story-modal');
    if (modal) modal.classList.toggle('hidden');
  }

  nextGuidedStep() {
    this.state.currentStepIndex = (this.state.currentStepIndex + 1) % this.demoSteps.length;
    this.executeCurrentStep();
  }

  updateStepByIndex(index) {
    this.state.currentStepIndex = index;
    this.updateCurrentStepLabel();
  }

  updateCurrentStepLabel() {
    const cur = this.demoSteps[this.state.currentStepIndex];
    const label = document.getElementById('current-step-label');
    if (label && cur) {
      label.textContent = `Step: ${cur.step}`;
    }
  }

  executeCurrentStep() {
    const cur = this.demoSteps[this.state.currentStepIndex];
    if (!cur) return;

    this.updateCurrentStepLabel();

    ['modal-traveler-profile', 'modal-connect-request', 'modal-sos', 'modal-report'].forEach(id => this.closeModal(id));

    if (cur.modal) {
      if (cur.modal === 'modal-traveler-profile') this.viewTravelerProfile('aman');
      if (cur.modal === 'modal-connect-request') this.openConnectModal('aman');
    } else if (cur.action === 'shareJourney') {
      this.switchTab('tab-chat');
      this.shareJourneyInChat();
    } else if (cur.screen) {
      if (cur.screen === 'authenticated-shell' && cur.tab) {
        this.switchTab(cur.tab);
      } else {
        this.navigateTo(cur.screen);
      }
    }

    this.showToast(`Guided Tour: ${cur.step} — ${cur.desc}`, 'info');
  }

  triggerConfetti() {
    if (window.confetti) {
      window.confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }
}

const smartApp = new SmartCommunityApp();

document.addEventListener('DOMContentLoaded', () => {
  smartApp.init();
});
