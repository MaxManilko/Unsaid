document.addEventListener('DOMContentLoaded', function() {
    const parallaxShowcase = document.querySelector('.parallax-showcase');
    if (parallaxShowcase && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const parallaxItems = parallaxShowcase.querySelectorAll('[data-parallax-speed]');
        let pointerX = 0;
        let pointerY = 0;
        let ticking = false;

        parallaxItems.forEach(item => {
            item.style.setProperty('--layer-speed', item.dataset.parallaxSpeed);
        });

        function updateParallax() {
            const rect = parallaxShowcase.getBoundingClientRect();
            const viewportCenter = window.innerHeight / 2;
            const blockCenter = rect.top + rect.height / 2;
            const scrollOffset = (viewportCenter - blockCenter) * 0.18;

            parallaxShowcase.style.setProperty('--parallax-x', `${pointerX * 18}px`);
            parallaxShowcase.style.setProperty('--parallax-y', `${scrollOffset + pointerY * 16}px`);
            ticking = false;
        }

        function requestParallaxUpdate() {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }

        parallaxShowcase.addEventListener('pointermove', event => {
            const rect = parallaxShowcase.getBoundingClientRect();
            pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
            pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
            requestParallaxUpdate();
        });

        parallaxShowcase.addEventListener('pointerleave', () => {
            pointerX = 0;
            pointerY = 0;
            requestParallaxUpdate();
        });

        window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
        window.addEventListener('resize', requestParallaxUpdate);
        requestParallaxUpdate();
    }

    const searchInput = document.getElementById('archiveSearch');
    const filterBtn = document.querySelector('.archive-filter-btn');
    let cards = Array.from(document.querySelectorAll('.unsent-card'));
    let filterScheduled = false;

    function refreshCardCache() {
        cards = Array.from(document.querySelectorAll('.unsent-card'));
    }

    function updateCardVisibility() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (cards.length === 0) {
            refreshCardCache();
        }

        cards.forEach(card => {
            const nameElement = card.querySelector('h2');
            const body = card.querySelector('.unsent-card-body');
            const name = nameElement ? nameElement.textContent.toLowerCase() : '';
            const colorClass = body ? body.className.split(' ')[1] || '' : '';
            const isVisible = searchTerm === '' || name.includes(searchTerm) || colorClass.includes(searchTerm);
            card.style.display = isVisible ? '' : 'none';
        });

        filterScheduled = false;
    }

    function scheduleFilter() {
        if (!filterScheduled) {
            filterScheduled = true;
            window.requestAnimationFrame(updateCardVisibility);
        }
    }

    if (searchInput && filterBtn) {
        searchInput.addEventListener('input', scheduleFilter);
        filterBtn.addEventListener('click', function() {
            searchInput.value = '';
            scheduleFilter();
        });
    }

    const API_URL = '/api/messages';
    const archiveGrid = document.querySelector('.archive-grid');

    if (archiveGrid) {
        async function loadMessages() {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    const errorPayload = await response.text();
                    throw new Error(errorPayload || 'API response was not OK');
                }
                const messages = await response.json();
                const fragment = document.createDocumentFragment();

                messages.forEach(msg => {
                    const colorClass = ['lavender', 'sky', 'peach', 'mint'].includes(msg.color) ? msg.color : 'lavender';
                    const article = document.createElement('article');
                    article.className = 'unsent-card';

                    const header = document.createElement('header');
                    header.className = 'unsent-card-header';

                    const badge = document.createElement('div');
                    badge.className = 'unsent-badge';
                    badge.textContent = 'ABC';

                    const title = document.createElement('h2');
                    title.textContent = `To: ${msg.recipient}`;

                    const stamp = document.createElement('div');
                    stamp.className = 'unsent-stamp';
                    stamp.setAttribute('aria-hidden', 'true');

                    header.appendChild(badge);
                    header.appendChild(title);
                    header.appendChild(stamp);

                    const body = document.createElement('div');
                    body.className = `unsent-card-body ${colorClass}`;

                    const paragraph = document.createElement('p');
                    paragraph.textContent = msg.message;
                    body.appendChild(paragraph);

                    article.appendChild(header);
                    article.appendChild(body);
                    fragment.appendChild(article);
                });

                archiveGrid.innerHTML = '';
                archiveGrid.appendChild(fragment);
                refreshCardCache();
            } catch (error) {
                console.error('Помилка завантаження повідомлень:', error);
            }
        }

        loadMessages();
    }
});
