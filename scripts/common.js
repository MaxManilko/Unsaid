document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = navToggle
        ? document.getElementById(navToggle.getAttribute('aria-controls'))
        : null;

    if (navToggle && navMenu) {
        const desktopNavQuery = window.matchMedia('(min-width: 721px)');

        function closeNav() {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open navigation');
            navMenu.classList.remove('is-open');
        }

        function toggleNav() {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!isOpen));
            navToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
            navMenu.classList.toggle('is-open', !isOpen);
        }

        navToggle.addEventListener('click', toggleNav);

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeNav);
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                closeNav();
            }
        });

        function handleDesktopNavChange(event) {
            if (event.matches) {
                closeNav();
            }
        }

        if (desktopNavQuery.addEventListener) {
            desktopNavQuery.addEventListener('change', handleDesktopNavChange);
        } else {
            desktopNavQuery.addListener(handleDesktopNavChange);
        }
    }

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        function toggleTheme() {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            themeToggle.textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        }

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.textContent = '☀️';
        } else {
            themeToggle.textContent = '🌙';
        }

        themeToggle.addEventListener('click', toggleTheme);
    }
});
