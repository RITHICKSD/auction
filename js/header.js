/* ============================================================
   HEADER.JS — Navigation, Mobile Menu, RTL/LTR Toggle
   ============================================================ */

(function () {
  'use strict';

  /* ── Scroll state ── */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (window.scrollY > 60) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Desktop dropdowns (Click to open) ── */
  document.querySelectorAll('.desktop-nav .nav-item').forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown');

    if (dropdown) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          e.stopPropagation();
          
          // Close other open dropdowns
          document.querySelectorAll('.desktop-nav .nav-item').forEach(other => {
            if (other !== item) other.classList.remove('open');
          });

          item.classList.toggle('open');
        }
      });
    }
  });

  // Close dropdowns when clicking anywhere else
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.desktop-nav')) {
      document.querySelectorAll('.desktop-nav .nav-item').forEach(item => {
        item.classList.remove('open');
      });
    }
  });

  /* ── Mobile menu ── */
  const menuBtn  = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const body     = document.body;

  menuBtn && menuBtn.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuBtn.classList.toggle('open', isOpen);
    body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on overlay click
  mobileNav && mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) {
      mobileNav.classList.remove('open');
      menuBtn && menuBtn.classList.remove('open');
      body.style.overflow = '';
    }
  });

  /* ── Mobile dropdowns (Click entire link to toggle) ── */
  document.querySelectorAll('.mobile-nav-item').forEach(item => {
    const link   = item.querySelector('.mobile-nav-link');
    const toggle = item.querySelector('.mobile-dd-toggle');
    const dd     = item.querySelector('.mobile-dropdown');
    
    if (!dd || !link) return;

    link.addEventListener('click', (e) => {
      // Only toggle if we are actually clicking a parent that HAS a dropdown
      if (toggle) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = dd.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
      }
    });
  });

  /* ── Globe — single-click toggles RTL ↔ LTR ── */
  const globeBtn   = document.getElementById('globe-btn');
  const mobileLtrBtns = document.querySelectorAll('.mobile-ltr-btn');
  const mobileRtlBtns = document.querySelectorAll('.mobile-rtl-btn');

  function setDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.body.setAttribute('dir', dir);
    localStorage.setItem('oaw-dir', dir);
    // Update globe button tooltip & style
    if (globeBtn) {
      globeBtn.title = dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL';
      const textSpan = globeBtn.querySelector('.globe-text');
      if (textSpan) textSpan.textContent = dir.toUpperCase();
    }
    // Sync mobile dir buttons
    mobileLtrBtns.forEach(b => b.classList.toggle('active', dir === 'ltr'));
    mobileRtlBtns.forEach(b => b.classList.toggle('active', dir === 'rtl'));
  }

  // Globe click: toggle direction
  globeBtn && globeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    setDir(current === 'ltr' ? 'rtl' : 'ltr');
  });

  // Mobile dir buttons still available inside mobile nav
  mobileLtrBtns.forEach(b => b.addEventListener('click', () => setDir('ltr')));
  mobileRtlBtns.forEach(b => b.addEventListener('click', () => setDir('rtl')));

  // Restore saved direction on load
  const savedDir = localStorage.getItem('oaw-dir') || 'ltr';
  setDir(savedDir);

  /* ── Active nav link based on current page ── */
  const currentPage = window.location.pathname.split('/').pop() || 'home1.html';
  document.querySelectorAll('.nav-link[data-page], .dropdown-link[data-page], .mobile-nav-link[data-page], .mobile-dd-link[data-page]').forEach(link => {
    if (link.dataset.page === currentPage) {
      link.classList.add('active');
      // Also activate parent nav-link if inside dropdown
      const parentNav = link.closest('.nav-item');
      if (parentNav) parentNav.querySelector('.nav-link')?.classList.add('active');
    }
  });

  /* ── Back to top ── */
  const btt = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    btt && btt.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btt && btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));



  /* ── Cursor glow (desktop) ── */
  const cursor = document.getElementById('cursor-glow');
  if (cursor && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    });
  }
})();
