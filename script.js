// Smooth active link + scroll spy
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = ['home','status','players','features'].map(id => document.getElementById(id)).filter(Boolean);
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

// Copy IP
const copyBtn = document.getElementById('copy-ip');
const ipEl = document.getElementById('server-ip');
if (copyBtn && ipEl) {
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(ipEl.textContent.trim());
      copyBtn.textContent = 'Kopyalandı ✓';
      setTimeout(()=> copyBtn.textContent='Kopyala', 1400);
    } catch(e){
      alert('Kopyalama başarısız, elle deneyin: ' + ipEl.textContent.trim());
    }
  });
}

// Year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

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
      ctx.fillStyle = 'rgba(0,217,255,0.7)';
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
          ctx.strokeStyle = `rgba(0,217,255,${0.08*o})`;
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

// Auto-refresh server info images with countdown
(function autoRefresh(){
  const getBadge = () => document.getElementById('refresh-timer');
  const imgs = () => Array.from(document.querySelectorAll('img[data-autorefresh="true"]'));
  // store original src once
  imgs().forEach(img => {
    if (!img.dataset.srcOriginal) img.dataset.srcOriginal = img.getAttribute('src');
  });
  let remaining = 30;
  function updateBadge(){
    const badge = getBadge();
    if (badge) badge.textContent = `Yenileme: ${remaining}s`;
  }
  function refreshImages(){
    imgs().forEach(img => {
      const base = img.dataset.srcOriginal || img.getAttribute('src');
      try {
        const url = new URL(base, window.location.href);
        url.searchParams.set('cb', Date.now());
        img.src = url.toString();
      } catch {
        // fallback if URL constructor fails
        const sep = base.includes('?') ? '&' : '?';
        img.src = `${base}${sep}cb=${Date.now()}`;
      }
    });
  }
  updateBadge();
  setInterval(() => {
    remaining -= 1;
    if (remaining <= 0){
      refreshImages();
      remaining = 30;
    }
    updateBadge();
  }, 1000);
})();