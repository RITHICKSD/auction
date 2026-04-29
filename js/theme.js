/**
 * THEME.JS — Theme switching logic for OAW
 */
(function() {
  // 1. Immediate theme application to prevent flash (applied to html element)
  const theme = localStorage.getItem('oaw-theme') || 'dark';
  const root = document.documentElement;
  
  if (theme === 'light') {
    root.classList.add('light-theme');
  }

  // 2. Global toggle function
  window.toggleTheme = function() {
    const isLight = root.classList.toggle('light-theme');
    localStorage.setItem('oaw-theme', isLight ? 'light' : 'dark');
    console.log('Theme toggled. Current light mode:', isLight);
  };

  // 3. Event Delegation for better reliability across all pages
  document.addEventListener('click', (e) => {
    // Check if the clicked element (or its parents) is a theme toggle button
    const toggleBtn = e.target.closest('.theme-toggle-btn, .sidebar-theme-toggle');
    if (toggleBtn) {
      e.preventDefault();
      window.toggleTheme();
    }
  });

  // 4. Persistence Check (helps if multiple tabs are open)
  window.addEventListener('storage', (e) => {
    if (e.key === 'oaw-theme') {
      root.classList.toggle('light-theme', e.newValue === 'light');
    }
  });
})();
