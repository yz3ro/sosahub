// Smooth active link + scroll spy
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = ['home','specs','discord','status','players','features'].map(id => document.getElementById(id)).filter(Boolean);
function onScroll() {
  const pos = window.scrollY + 100;
  let active = 'home';
  for (const s of sections) {
    if (s.offsetTop <= pos) active = s.id;
  }
  navLinks.forEach(a => {
    if (a.getAttribute('href') === `#${active}`) a.classList.add('active');
    else if (a.getAttribute('href')?.startsWith('#')) a.classList.remove('active');
  });
}
document.addEventListener('scroll', onScroll);
onScroll();

// Mobile menu
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('site-nav');
if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

// Theme toggle (dark/light)
(function themeToggle(){
  const btn = document.getElementById('theme-toggle');
  const LS_KEY = 'theme';
  // If body already declares theme-light, respect it as the source of truth.
  // Otherwise default to light unless user has a saved preference.
  const bodyHasLight = document.body.classList.contains('theme-light');
  // Persisted theme takes precedence; if none, keep what's in the DOM (defaults to light)
  const saved = localStorage.getItem(LS_KEY);
  let theme = saved || (bodyHasLight ? 'light' : 'dark');
  function apply(t){
    document.body.classList.toggle('theme-light', t === 'light');
    if (btn){
      btn.setAttribute('aria-pressed', String(t === 'light'));
      btn.textContent = t === 'light' ? '☀️' : '🌙';
    }
    applyBrandAssets(t);
  }
  apply(theme);
  // Persist the resolved theme so subsequent loads match the current page
  localStorage.setItem(LS_KEY, theme);
  if (btn){
    btn.addEventListener('click', () => {
      theme = theme === 'light' ? 'dark' : 'light';
      localStorage.setItem(LS_KEY, theme);
      apply(theme);
      // Show notice only when switching to dark
      if (theme === 'dark') {
        showLightNotice();
      }
    });
  }
})();

// Swap logo and favicon per theme
function applyBrandAssets(theme){
  const darkLogo = 'turtle_dark.png'; // dark-mode turtle image
  const lightLogo = 'turtle_logo.png';
  const desired = theme === 'light' ? lightLogo : darkLogo;

  const linkIcon = document.querySelector('link[rel="icon"]');

  // Preload desired to check availability; if missing, fall back to light
  const test = new Image();
  test.onload = () => swap(desired);
  test.onerror = () => swap(lightLogo);
  test.src = desired;

  function swap(src){
    document.querySelectorAll('img.brand-logo').forEach(img => {
      if (img.getAttribute('src') !== src) {
        img.setAttribute('src', src);
      }
    });
    if (linkIcon) linkIcon.setAttribute('href', src);
  }
}

// Dark theme notice (appears only when toggling to dark)
function showLightNotice(){
  // Prevent duplicates
  if (document.querySelector('.light-notice-backdrop')) return;
  const backdrop = document.createElement('div');
  backdrop.className = 'light-notice-backdrop';
  backdrop.setAttribute('role','dialog');
  backdrop.setAttribute('aria-modal','true');
  backdrop.setAttribute('aria-label','Bilgi');

  const box = document.createElement('div');
  box.className = 'light-notice';
  box.innerHTML = `
    <button class="light-notice-close" aria-label="Kapat">✕</button>
    <div class="light-notice-title">Bilgi</div>
    <div class="light-notice-text">Dark temanın üzerinde hâlâ çalışıyoruz.</div>
  `;
  backdrop.appendChild(box);
  document.body.appendChild(backdrop);

  const closeBtn = box.querySelector('.light-notice-close');
  const close = () => {
    backdrop.classList.add('leaving');
    // remove after animation
    setTimeout(() => backdrop.remove(), 250);
    document.removeEventListener('keydown', onKey);
  };
  function onKey(e){ if (e.key === 'Escape') close(); }

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e)=>{ if(e.target === backdrop) close(); });
  document.addEventListener('keydown', onKey);
}

// Collapsible: Anlık Oyuncular
const playersSection = document.getElementById('players');
const togglePlayersBtn = document.getElementById('toggle-players');
if (playersSection && togglePlayersBtn) {
  // ensure initial collapsed state
  playersSection.style.maxHeight = '0px';
  togglePlayersBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = playersSection.classList.toggle('open');
    if (isOpen) {
      playersSection.style.maxHeight = playersSection.scrollHeight + 'px';
      playersSection.setAttribute('aria-hidden', 'false');
      togglePlayersBtn.setAttribute('aria-expanded', 'true');
      // smooth scroll into view a bit below header
      playersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      playersSection.style.maxHeight = '0px';
      playersSection.setAttribute('aria-hidden', 'true');
      togglePlayersBtn.setAttribute('aria-expanded', 'false');
    }
  });
  // Recalculate height on resize when open
  window.addEventListener('resize', () => {
    if (playersSection.classList.contains('open')) {
      playersSection.style.maxHeight = playersSection.scrollHeight + 'px';
    }
  });
}

// Collapsible: Server Özellikleri
const specsSection = document.getElementById('specs');
const toggleSpecsBtn = document.getElementById('toggle-specs');
if (specsSection && toggleSpecsBtn) {
  specsSection.style.maxHeight = '0px';
  toggleSpecsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = specsSection.classList.toggle('open');
    if (isOpen) {
      specsSection.style.maxHeight = specsSection.scrollHeight + 'px';
      specsSection.setAttribute('aria-hidden', 'false');
      toggleSpecsBtn.setAttribute('aria-expanded', 'true');
      specsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      specsSection.style.maxHeight = '0px';
      specsSection.setAttribute('aria-hidden', 'true');
      toggleSpecsBtn.setAttribute('aria-expanded', 'false');
    }
  });
  window.addEventListener('resize', () => {
    if (specsSection.classList.contains('open')) {
      specsSection.style.maxHeight = specsSection.scrollHeight + 'px';
    }
  });
}

// Collapsible: Discord
const discordSection = document.getElementById('discord');
const toggleDiscordBtn = document.getElementById('toggle-discord');
if (discordSection && toggleDiscordBtn) {
  discordSection.style.maxHeight = '0px';
  toggleDiscordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = discordSection.classList.toggle('open');
    if (isOpen) {
      // Set a safe initial height so the panel visibly expands immediately
      discordSection.style.maxHeight = '600px';
      // Recalculate after layout to fit actual content
      setTimeout(() => {
        discordSection.style.maxHeight = discordSection.scrollHeight + 'px';
      }, 0);
      discordSection.setAttribute('aria-hidden', 'false');
      toggleDiscordBtn.setAttribute('aria-expanded', 'true');
      discordSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // If iframe loads later, adjust height again
      const iframe = discordSection.querySelector('iframe');
      if (iframe) {
        const adjust = () => {
          if (discordSection.classList.contains('open')) {
            discordSection.style.maxHeight = discordSection.scrollHeight + 'px';
          }
        };
        iframe.addEventListener('load', adjust, { once: true });
        // Fallback adjust after a short delay
        setTimeout(adjust, 500);
      }
    } else {
      discordSection.style.maxHeight = '0px';
      discordSection.setAttribute('aria-hidden', 'true');
      toggleDiscordBtn.setAttribute('aria-expanded', 'false');
    }
  });
  window.addEventListener('resize', () => {
    if (discordSection.classList.contains('open')) {
      discordSection.style.maxHeight = discordSection.scrollHeight + 'px';
    }
  });
}

// Copy IP (supports multiple ip-box entries)
const copyBtns = document.querySelectorAll('.copy-ip');
if (copyBtns.length) {
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const scope = btn.closest('.mini-ip') || btn.closest('.ip-box');
      const ipEl = scope?.querySelector('.server-ip');
      const ip = ipEl?.textContent?.trim();
      if (!ip) return;
      try {
        await navigator.clipboard.writeText(ip);
        const old = btn.textContent;
        btn.textContent = 'Kopyalandı ✓';
        setTimeout(() => (btn.textContent = old), 1400);
      } catch (e) {
        alert('Kopyalama başarısız, elle deneyin: ' + ip);
      }
    });
  });
}

// Year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Live Clock (header, top-right)
(function liveClock(){
  const el = document.getElementById('live-clock');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('tr-TR', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  function tick(){
    el.textContent = fmt.format(new Date());
    // sync to exact second boundaries
    const now = Date.now();
    const delay = 1000 - (now % 1000);
    setTimeout(tick, delay);
  }
  tick();
})();

// Background particles (lightweight)
(function particles(){
  const canvas = document.getElementById('bg-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
  const N = Math.min(90, Math.floor(W * H / 25000));
  const nodes = Array.from({length:N}, ()=>({
    x: Math.random()*W,
    y: Math.random()*H,
    vx: (Math.random()-0.5)*0.4,
    vy: (Math.random()-0.5)*0.4,
    r: Math.random()*1.8 + 0.4
  }));
  function tick(){
    ctx.clearRect(0,0,W,H);
    // dots
    for (const p of nodes){
      p.x+=p.vx; p.y+=p.vy;
      if (p.x<0||p.x>W) p.vx*=-1;
      if (p.y<0||p.y>H) p.vy*=-1;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = 'rgba(100,200,91,0.7)';
      ctx.fill();
    }
    // links
    for (let i=0;i<nodes.length;i++){
      for (let j=i+1;j<nodes.length;j++){
        const a=nodes[i], b=nodes[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const d = Math.hypot(dx,dy);
        if (d<110){
          const o = 1 - d/110;
          ctx.strokeStyle = `rgba(100,200,91,${0.08*o})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

// Hard refresh button: reload entire page
(function hardRefresh(){
  function bind(){
    const btn = document.getElementById('hard-refresh');
    if (!btn) return false;
    const handler = (e) => {
      e.preventDefault();
      window.location.reload();
    };
    btn.addEventListener('click', handler);
    // direct assignment fallback
    btn.onclick = handler;
    // keyboard support
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.reload();
      }
    });
    return true;
  }
  if (!bind()){
    document.addEventListener('DOMContentLoaded', () => { bind(); }, { once: true });
  }
})();