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

document.addEventListener("DOMContentLoaded", () => {
  loadLiveLeaderboard('auric');

  /* ── SECURE DOWNLOAD BUTTONS ── */
  document.querySelectorAll('.download-btn[data-href]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = btn.getAttribute('data-href');
      if (url) window.location.href = url;
    });
    btn.addEventListener('contextmenu', (e) => e.preventDefault());
  });
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

