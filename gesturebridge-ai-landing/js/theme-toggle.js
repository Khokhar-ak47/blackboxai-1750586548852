// theme-toggle.js - handles dark/light mode toggle and persistence

const themeToggleCheckbox = document.getElementById('theme-toggle');

function setTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
    themeToggleCheckbox.checked = savedTheme === 'dark';
  } else {
    // Default to system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
    themeToggleCheckbox.checked = prefersDark;
  }
}

themeToggleCheckbox.addEventListener('change', () => {
  setTheme(themeToggleCheckbox.checked ? 'dark' : 'light');
});

initTheme();
