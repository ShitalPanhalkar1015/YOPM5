document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';

  // Apply theme with transition
  const applyTheme = (theme) => {
    html.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  };

  // Initial theme
  applyTheme(currentTheme);

  // Theme toggle with transition
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
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