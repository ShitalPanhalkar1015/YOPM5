document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';

  // Apply the saved theme on initial load
  document.documentElement.setAttribute('data-theme', currentTheme);
  if (themeToggle) {
    themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
  }

  // Add click listener to the toggle button
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      // Get the current theme from the <html> element
      let theme = document.documentElement.getAttribute('data-theme');

      // Switch theme
      theme = theme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
  }
});

// Parallax / subtle movement for background floats
(function initFloatParallax(){
  const container = () => document.querySelector('.bg-float');
  let lastX = 0, lastY = 0;
  function onMove(e){
    const c = container();
    if (!c) return;
    const clientX = (e.touches ? e.touches[0].clientX : e.clientX) || (window.innerWidth/2);
    const clientY = (e.touches ? e.touches[0].clientY : e.clientY) || (window.innerHeight/2);
    const cx = (clientX / window.innerWidth) - 0.5;
    const cy = (clientY / window.innerHeight) - 0.5;
    // subtle transforms per float
    c.querySelectorAll('.float').forEach((el, idx) => {
      const depth = (idx % 3) * 6 + 6; // 6,12,18...
      const tx = cx * depth;
      const ty = cy * depth;
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });
    lastX = clientX; lastY = clientY;
  }
  document.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('touchmove', onMove, { passive: true });
})();