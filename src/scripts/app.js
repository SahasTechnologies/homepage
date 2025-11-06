// Bundled client module for icons, theme toggle, and interactions
import { createIcons, icons } from 'lucide';
import cursorListUrl from './cursor.json?url';

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
  const randomBtn = document.querySelector('.random-cursor');
  const toggleBtn = document.querySelector('.theme-toggle');
  let cursorSetsPromise = null;

  function loadCursorSets() {
    if (!cursorSetsPromise) {
      cursorSetsPromise = fetch(cursorListUrl).then((r) => r.json()).catch(() => []);
    }
    return cursorSetsPromise;
  }

  function applyCursorSet(set) {
    if (!set || !set.cursor || !set.pointer) return;
    try {
      document.body.style.cursor = `url('${set.cursor}'), default`;
      const pointerTargets = document.querySelectorAll(
        'button, a[href], .btn, .theme-toggle, .footer-link, input, textarea'
      );
      pointerTargets.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.cursor = `url('${set.pointer}'), pointer`;
        }
      });
      // Apply default cursor to text elements and labels
      const defaultTargets = document.querySelectorAll(
        '.guestbook, .field-label, .guestbook-title, .credits, .tagline'
      );
      defaultTargets.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.cursor = `url('${set.cursor}'), default`;
        }
      });
    } catch (_) {}
  }

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

  if (randomBtn) {
    randomBtn.addEventListener('click', async () => {
      document.body.style.cursor = 'wait';
      randomBtn.style.cursor = 'wait';
      const sets = await loadCursorSets();
      if (Array.isArray(sets) && sets.length) {
        const idx = Math.floor(Math.random() * sets.length);
        applyCursorSet(sets[idx]);
      } else {
        document.body.style.cursor = '';
        randomBtn.style.cursor = '';
      }
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
