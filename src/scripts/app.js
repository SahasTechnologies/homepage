// Bundled client module for icons, theme toggle, and interactions
import { createIcons, icons } from 'lucide';

function setThemeLight() {
  document.documentElement.setAttribute('data-theme', 'light');
}
function setThemeDark() {
  document.documentElement.setAttribute('data-theme', 'dark');
}

function init() {
  // Render Lucide icons
  createIcons({ icons });

  const avatar = document.querySelector('.avatar');
  const ring = document.querySelector('.avatar-ring');
  const popTargets = Array.from(document.querySelectorAll('.pop-target'));
  const toggleBtn = document.querySelector('.theme-toggle');

  // Theme default: stored override else system
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  let stored = null;
  try { stored = localStorage.getItem('theme'); } catch (e) {}
  if (stored === 'light') setThemeLight();
  else if (stored === 'dark') setThemeDark();
  else {
    prefersDark.matches ? setThemeDark() : setThemeLight();
    prefersDark.addEventListener('change', (e) => {
      try {
        if (!localStorage.getItem('theme')) {
          e.matches ? setThemeDark() : setThemeLight();
        }
      } catch (err) {}
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      next === 'dark' ? setThemeDark() : setThemeLight();
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  if (avatar) {
    avatar.addEventListener('click', () => {
      avatar.classList.remove('spin');
      void getComputedStyle(avatar).transform;
      avatar.classList.add('spin');
    });
  }

  if (ring && ring instanceof HTMLElement) {
    ring.addEventListener('mouseenter', () => {
      const hue = 200 + Math.floor(Math.random() * 60); // blue hues ~200-260
      const newColor = `hsl(${hue}, 75%, 60%)`;
      ring.style.setProperty('--ring-color', newColor);
    });
  }

  popTargets.forEach((target) => {
    target.addEventListener('click', () => {
      target.classList.remove('pop');
      void getComputedStyle(target).transform;
      target.classList.add('pop');
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
