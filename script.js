/* ══════════════════════════════════════
   DRAZOLMAKES — INTERACTIVE SCRIPTS
   ══════════════════════════════════════ */

/* ── SCROLL REVEAL ── */
const scrollObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => scrollObserver.observe(el));

/* ── ACTIVE NAV TRACKING ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[data-section]');
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => navObserver.observe(s));

/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobile-overlay');
function toggleMenu() {
  hamburger.classList.toggle('open');
  mobileOverlay.classList.toggle('open');
  document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : '';
}
hamburger.addEventListener('click', toggleMenu);
mobileOverlay.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── DYNAMIC GREETING ── */
const setGreeting = () => {
  const h = new Date().getHours();
  const el = document.getElementById('dynamic-greeting');
  if (el) el.innerText = h < 12 ? 'Good morning.' : h < 18 ? 'Good afternoon.' : 'Good evening.';
};
setGreeting();

/* ── CANVAS BACKGROUND ── */
const cvs = document.getElementById('bg-canvas');
const ctx = cvs.getContext('2d');
let w = cvs.width = window.innerWidth;
let h2 = cvs.height = window.innerHeight;
let mouseX = w / 2, mouseY = h2 / 2;
let t = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

const orbs = [
  { bx: 0.2, by: 0.3, r: 0.45, color: [128, 40, 200], alpha: 0.12, phase: 0 },
  { bx: 0.8, by: 0.7, r: 0.4,  color: [245, 158, 11], alpha: 0.08, phase: 2.5 },
  { bx: 0.5, by: 0.5, r: 0.5,  color: [59, 130, 246], alpha: 0.08, phase: 5 },
  { bx: 0.7, by: 0.2, r: 0.3,  color: [168, 85, 247], alpha: 0.06, phase: 3.5 },
  { bx: 0.3, by: 0.8, r: 0.35, color: [34, 197, 94],  alpha: 0.04, phase: 1.5 }
];

function drawCanvas() {
  t += 0.004;
  ctx.clearRect(0, 0, w, h2);

  const mx = (mouseX / w - 0.5) * 0.08;
  const my = (mouseY / h2 - 0.5) * 0.08;

  orbs.forEach(o => {
    const drift = Math.sin(t + o.phase) * (w * 0.06);
    const ox = o.bx * w + drift + mx * w * 0.3;
    const oy = o.by * h2 + Math.cos(t + o.phase) * (h2 * 0.04) + my * h2 * 0.3;
    const r = Math.max(20, o.r * w + Math.sin(t + o.phase) * (w * 0.05));
    const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
    g.addColorStop(0, `rgba(${o.color.join(',')},${o.alpha})`);
    g.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.fillStyle = g;
    ctx.arc(ox, oy, r, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(drawCanvas);
}
drawCanvas();
window.addEventListener('resize', () => {
  w = cvs.width = window.innerWidth;
  h2 = cvs.height = window.innerHeight;
});

/* ── RANDOM REVIEWS ── */
const allReviews = [
  { text: "The cleanest UI I've ever used. Completely distraction-free.", user: "@mindful_dev" },
  { text: "Helped me manage my pre-meeting anxiety perfectly.", user: "@sarah_flows" },
  { text: "Love the custom intervals for box breathing.", user: "@hacker_abhi" },
  { text: "Finally, a breathing app without annoying subscriptions.", user: "@zen_coder" },
  { text: "The haptics and sounds are incredibly soothing.", user: "@night_owl" },
  { text: "My go-to app before writing any code. Pure focus.", user: "@flutter_fan" },
  { text: "Aesthetically pleasing and it actually works.", user: "@ui_wizard" },
  { text: "It feels like a high-end physical product, not just an app. The animations are buttery smooth.", user: "@design_nomad" },
  { text: "The 2-1-4 quick reset is perfect for deep work. I use it between coding sprints.", user: "@sysadmin_life" },
  { text: "The 4-7-8 cycle actually knocks me out in minutes. Goodbye insomnia.", user: "@luna_rest" },
  { text: "Seeing the live sync on the leaderboard makes breathwork feel like a multiplayer game.", user: "@comp_sci_guy" },
  { text: "The haptic feedback syncs perfectly. I don't even need to look at the screen.", user: "@haptic_junkie" }
];

const rc = document.getElementById('reviews-container');
if (rc) {
  rc.innerHTML = allReviews.sort(() => 0.5 - Math.random()).slice(0, 3).map((r, i) => `
    <div class="review-bubble">
      <div class="review-stars">★★★★★</div>
      <div class="review-text">"${r.text}"</div>
      <div class="review-user">${r.user}</div>
    </div>
  `).join('');
}

/* ── 5-STEP QUIZ ── */
const modal = document.getElementById('quiz-modal');
const qContent = document.getElementById('quiz-content');
const qProg = document.getElementById('quiz-progress');
let currentStep = 0;
let userAnswers = { coreProblem: '', tension: '', time: '', experience: '', goal: '' };

function openQuiz() {
  currentStep = 0;
  userAnswers = { coreProblem: '', tension: '', time: '', experience: '', goal: '' };
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  renderQuizStep();
}
function closeQuiz() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

const quizData = [
  { q: "What is your primary goal right now?", options: [
    { text: "Calm anxiety & relieve stress", val: "anxiety" },
    { text: "Improve deep focus & productivity", val: "focus" },
    { text: "Fix my sleep schedule & rest", val: "sleep" }
  ]},
  { q: "How would you describe your current state?", options: [
    { text: "Overwhelmed and racing thoughts", val: "racing" },
    { text: "Foggy, distracted, and scattered", val: "foggy" },
    { text: "Exhausted but physically wired", val: "wired" }
  ]},
  { q: "Where do you hold the most tension?", options: [
    { text: "Tightness in the chest and shallow breath", val: "chest" },
    { text: "Headaches, jaw clenching, or eye strain", val: "head" },
    { text: "Restless body and fidgeting", val: "body" }
  ]},
  { q: "How much time do you have to reset?", options: [
    { text: "I need a fast reset (Under 60 seconds)", val: "fast" },
    { text: "I have a few minutes to spare", val: "mid" },
    { text: "I am ready for a longer dedicated session", val: "long" }
  ]},
  { q: "What is your experience with breathwork?", options: [
    { text: "I'm completely new to this", val: "new" },
    { text: "I know the basics, but need guidance", val: "some" },
    { text: "I practice regularly and want control", val: "pro" }
  ]}
];

function renderQuizStep() {
  if (currentStep >= quizData.length) { calculateResult(); return; }
  const s = quizData[currentStep];
  qProg.style.width = `${(currentStep / quizData.length) * 100}%`;
  qContent.innerHTML = `
    <div class="quiz-step-text">QUESTION 0${currentStep + 1} OF 05</div>
    <div class="quiz-question">${s.q}</div>
    <div class="quiz-options">
      ${s.options.map(o => `<button class="quiz-btn" onclick="handleAnswer('${o.val}')">${o.text}<span class="arrow">→</span></button>`).join('')}
    </div>`;
}

function handleAnswer(val) {
  const keys = ['coreProblem', 'tension', 'time', 'experience', 'goal'];
  userAnswers[keys[currentStep]] = val;
  currentStep++;
  renderQuizStep();
}

function calculateResult() {
  qProg.style.width = '100%';
  let appName, exerciseTitle, detail, desc, actionBtn;

  if (userAnswers.coreProblem === 'focus') {
    appName = "FOCUS FLOW APP"; exerciseTitle = "Deep Work Protocol"; detail = "App In Development";
    desc = "Your answers indicate a need for sustained attention. Focus Flow is currently in closed testing to help developers and creatives achieve flow state.";
    actionBtn = `<button class="rx-btn-primary" onclick="closeQuiz()">JOIN THE WAITLIST</button>`;
  } else if (userAnswers.coreProblem === 'sleep') {
    appName = "SLEEP SYNC APP"; exerciseTitle = "Circadian Reset"; detail = "App In Development";
    desc = "You are struggling to transition from 'wired' to 'tired'. Sleep Sync will feature specialized long-form sessions to drop your core temperature and induce sleep.";
    actionBtn = `<button class="rx-btn-primary" onclick="closeQuiz()">JOIN THE WAITLIST</button>`;
  } else {
    appName = "AURIC APP";
    actionBtn = `<a href="#apps" class="rx-btn-primary" onclick="closeQuiz()">DOWNLOAD AURIC TO START</a>`;
    if (userAnswers.tension === 'racing' && userAnswers.time === 'fast') {
      exerciseTitle = "2-1-4 Reset"; detail = "Inhale 2s · Hold 1s · Exhale 4s";
      desc = "You need an immediate circuit breaker. The 2-1-4 pattern delivers a fast calm-reset in under a minute, perfect for breaking tension between tasks.";
    } else if (userAnswers.tension === 'racing') {
      exerciseTitle = "5-5-5 Breathing"; detail = "Inhale 5s · Hold 5s · Exhale 5s";
      desc = "You are dealing with acute mental overwhelm. This pattern rapidly lowers cortisol levels and interrupts anxious thought spirals.";
    } else if (userAnswers.coreProblem === 'anxiety' && userAnswers.time === 'long') {
      exerciseTitle = "4-7-8 Breathing"; detail = "Inhale 4s · Hold 7s · Exhale 8s";
      desc = "Because you have the time for a dedicated session, the 4-7-8 method will deeply activate your parasympathetic nervous system and melt away physical tension.";
    } else {
      exerciseTitle = "Coherent Breathing"; detail = "Inhale 5s · Hold 0s · Exhale 5s";
      desc = "Your body needs steady balance. Coherent breathing achieves heart-rate coherence, proven to reduce chronic chest tension and lower blood pressure.";
    }
  }

  qContent.innerHTML = `
    <div class="prescription-card">
      <div class="rx-badge">YOUR PRESCRIPTION</div>
      <div class="rx-app">${appName}</div>
      <div class="rx-title">${exerciseTitle}</div>
      <div class="rx-detail">${detail}</div>
      <div class="rx-desc">${desc}</div>
      <div class="rx-actions">${actionBtn}</div>
      <div class="retake-link" onclick="openQuiz()">↺ RETAKE ASSESSMENT</div>
    </div>`;
}

/* ── SUPABASE LEADERBOARD ── */
async function loadLiveLeaderboard(app) {
  const c = document.getElementById('lb-rows-container');
  const b = document.getElementById('lb-badge');
  if (!c || !b) return;

  if (app !== 'auric') {
    b.classList.add('offline');
    b.innerHTML = 'IN DEVELOPMENT';
    c.innerHTML = '<div class="lb-loading">Leaderboards will open upon app release.</div>';
    return;
  }

  b.classList.remove('offline');
  b.innerHTML = '<div class="lb-live-dot"></div> LIVE SYNC';

  try {
    if (typeof APP_CONFIG === 'undefined' || !APP_CONFIG.SUPABASE_URL || !APP_CONFIG.SUPABASE_ANON_KEY) {
      throw new Error("Missing config.js — copy config.example.js to config.js and add your credentials.");
    }
    if (!window.supabase) throw new Error("Supabase Library failed to load. Check your internet connection or ad-blocker.");

    const supabaseClient = window.supabase.createClient(
      APP_CONFIG.SUPABASE_URL,
      APP_CONFIG.SUPABASE_ANON_KEY
    );

    const { data, error } = await supabaseClient
      .from('profiles')
      .select('username, total_minutes')
      .order('total_minutes', { ascending: false })
      .limit(5);

    if (error) throw error;

    if (!data || data.length === 0) {
      c.innerHTML = '<div class="lb-loading">No sessions logged yet.</div>';
      return;
    }

    c.innerHTML = data.map((u, i) => `
      <div class="lb-row">
        <div class="lb-rank">0${i + 1}</div>
        <div class="lb-user">${u.username || 'Breather'}</div>
        <div class="lb-score">${u.total_minutes} min</div>
      </div>`).join('');

  } catch (e) {
    console.error("Leaderboard Error:", e);
    c.innerHTML = `<div class="lb-loading" style="color:#ef4444;font-size:12px;line-height:1.6">
      <b>CONNECTION FAILED:</b><br>${e.message || JSON.stringify(e)}
    </div>`;
  }
}

window.switchLeaderboardTab = (app, el) => {
  document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  loadLiveLeaderboard(app);
};

// Make quiz functions global
window.openQuiz = openQuiz;
window.closeQuiz = closeQuiz;
window.handleAnswer = handleAnswer;

document.addEventListener("DOMContentLoaded", () => {
  loadLiveLeaderboard('auric');
});

/* ── SCROLL PROGRESS BAR ── */
const scrollProgressBar = document.getElementById('scroll-progress');
if (scrollProgressBar) {
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    scrollProgressBar.style.width = progress + '%';
  }, { passive: true });
}

/* ── SCROLL INDICATOR FADE ── */
const scrollIndicator = document.getElementById('scroll-indicator');
if (scrollIndicator) {
  window.addEventListener('scroll', () => {
    scrollIndicator.classList.toggle('hidden', window.scrollY > 100);
  }, { passive: true });
}

/* ── INTERACTIVE EFFECTS (desktop only) ── */
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {

  /* ── CUSTOM CURSOR ── */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorGlow = document.getElementById('cursor-glow');
  let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  let gx = cx, gy = cy;

  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cursorDot.style.left = cx + 'px';
    cursorDot.style.top = cy + 'px';
  });

  function animateGlow() {
    gx += (cx - gx) * 0.12;
    gy += (cy - gy) * 0.12;
    cursorGlow.style.left = gx + 'px';
    cursorGlow.style.top = gy + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // Hover state for interactive elements
  const hoverTargets = 'a, button, [data-magnetic], .lb-tab, .quiz-btn, .hamburger';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      cursorDot.classList.add('hover');
      cursorGlow.classList.add('hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      cursorDot.classList.remove('hover');
      cursorGlow.classList.remove('hover');
    }
  });

  /* ── MAGNETIC BUTTONS ── */
  const magneticEls = document.querySelectorAll('[data-magnetic]');
  const MAG_RADIUS = 120, PULL = 0.35;

  document.addEventListener('mousemove', e => {
    magneticEls.forEach(el => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAG_RADIUS) {
        const p = (1 - dist / MAG_RADIUS) * PULL;
        el.style.transform = `translate(${dx * p}px, ${dy * p}px)`;
      } else {
        el.style.transform = '';
      }
    });
  });

  document.addEventListener('mouseleave', () => {
    magneticEls.forEach(el => { el.style.transform = ''; });
  });

  /* ── 3D TILT ON APP CARD ── */
  const tiltEls = document.querySelectorAll('[data-tilt]');
  tiltEls.forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.01,1.01,1.01)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

