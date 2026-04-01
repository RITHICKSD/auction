/* ============================================================
   HOME1.JS — All Section Interactivity & Animations
   ============================================================ */
(function () {
  'use strict';

  /* ───── Intersection Observer (scroll animations) ───── */
  const animEls = document.querySelectorAll('[data-anim]');
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('animated'), delay * 150);
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  animEls.forEach(el => animObserver.observe(el));

  /* ───── Stagger helpers ───── */
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.setAttribute('data-anim', parent.dataset.stagger || 'fade-up');
      child.dataset.delay = i;
      animObserver.observe(child);
    });
  });

  /* ───── Counter animation (stats) ───── */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el  = entry.target;
        const end = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const dur  = 2000;
        const step = end / (dur / 16);
        let   cur  = 0;
        const t = setInterval(() => {
          cur += step;
          if (cur >= end) { cur = end; clearInterval(t); }
          el.textContent = prefix + (Number.isInteger(end) ? Math.floor(cur).toLocaleString() : cur.toFixed(1)) + suffix;
        }, 16);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  counters.forEach(c => counterObserver.observe(c));

  /* ───── Progress bars (animate on scroll) ───── */
  const progressBars = document.querySelectorAll('.progress-fill[data-width]');
  const progObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width + '%';
        progObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  progressBars.forEach(b => progObserver.observe(b));

  /* ───── Countdown timers ───── */
  function startCountdown(el, endTime) {
    function update() {
      const now  = Date.now();
      const diff = endTime - now;
      if (diff <= 0) { el.innerHTML = '<span style="color:var(--muted)">Ended</span>'; return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const pad = v => String(v).padStart(2, '0');
      el.querySelector('[data-cd-h]') && (el.querySelector('[data-cd-h]').textContent = pad(h));
      el.querySelector('[data-cd-m]') && (el.querySelector('[data-cd-m]').textContent = pad(m));
      el.querySelector('[data-cd-s]') && (el.querySelector('[data-cd-s]').textContent = pad(s));
    }
    update();
    setInterval(update, 1000);
  }
  document.querySelectorAll('[data-countdown]').forEach(el => {
    const ms = parseInt(el.dataset.countdown) * 1000;
    startCountdown(el, Date.now() + ms);
  });

  /* ───── Testimonial Slider ───── */
  const track  = document.querySelector('.testi-track');
  const dots   = document.querySelectorAll('.testi-dot');
  const slides = document.querySelectorAll('.testi-slide');
  let   current = 0;
  let   autoplay;

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    if (track) track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetAuto(); }));

  document.querySelector('.testi-prev')?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  document.querySelector('.testi-next')?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  function resetAuto() { clearInterval(autoplay); autoplay = setInterval(() => goTo(current + 1), 5000); }
  resetAuto();

  /* ───── FAQs ───── */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const answer = q.nextElementSibling;
      const isOpen = q.classList.toggle('open');
      answer && answer.classList.toggle('open', isOpen);
    });
  });

  /* ───── Gallery lightbox (simple) ───── */
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img  = item.querySelector('img');
      const text = item.querySelector('.gallery-overlay-text')?.textContent || '';
      if (!img) return;
      const overlay = document.createElement('div');
      overlay.style.cssText = `position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:20px;padding:24px;`;
      const imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.style.cssText = `max-width:90vw;max-height:80vh;border-radius:12px;`;
      const closeEl = document.createElement('button');
      closeEl.textContent = '✕  Close';
      closeEl.style.cssText = `color:var(--gold);font-size:16px;background:none;border:1px solid var(--gold);padding:8px 24px;border-radius:6px;cursor:pointer;font-family:inherit;`;
      overlay.appendChild(imgEl);
      const title = document.createElement('p');
      title.textContent = text;
      title.style.cssText = `color:rgba(255,255,255,0.7);font-family:var(--font-serif);font-size:18px;`;
      overlay.appendChild(title);
      overlay.appendChild(closeEl);
      closeEl.onclick = () => overlay.remove();
      overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
      document.body.appendChild(overlay);
    });
  });

  /* ───── Particle canvas ───── */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resizeCanvas() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.1
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.alpha})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  /* ───── Lot Card fake bid animation ───── */
  document.querySelectorAll('.lot-bid-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const card  = this.closest('.lot-card');
      const price = card?.querySelector('.lot-price');
      if (!price) return;
      const curr = parseFloat(price.textContent.replace(/[^0-9.]/g, ''));
      const next = curr + Math.floor(Math.random() * 500 + 200);
      price.style.transition = 'color 0.3s';
      price.style.color = '#22C55E';
      price.textContent = '$' + next.toLocaleString();
      setTimeout(() => { price.style.color = ''; }, 800);
      const bidsEl = card.querySelector('.lot-bids');
      if (bidsEl) {
        const n = parseInt(bidsEl.textContent) + 1;
        bidsEl.textContent = n + ' bids';
      }
    });
  });

  /* ───── Newsletter form ───── */
  const nlForm = document.getElementById('newsletter-form');
  nlForm && nlForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = nlForm.querySelector('input');
    if (!input?.value) return;
    const btn   = nlForm.querySelector('button');
    btn.textContent = '✓ Subscribed!';
    btn.style.background = '#22C55E';
    input.value = '';
    setTimeout(() => {
      btn.textContent = 'Subscribe';
      btn.style.background = '';
    }, 3000);
  });

  /* ───── Play button modal ───── */
  const playBtn = document.getElementById('play-btn');
  playBtn && playBtn.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;`;
    overlay.innerHTML = `
      <div style="text-align:center;color:white;">
        <div style="font-size:80px;margin-bottom:20px;">🎬</div>
        <p style="font-family:var(--font-serif);font-size:24px;color:var(--gold);">Video Preview</p>
        <p style="color:rgba(255,255,255,0.5);margin-top:8px; font-size:14px;">Connect a real video source</p>
        <button onclick="this.closest('[style]').remove()" style="margin-top:24px;padding:10px 30px;background:var(--gold);color:#000;border:none;border-radius:6px;font-size:14px;cursor:pointer;font-weight:700;">Close</button>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  });

})();
