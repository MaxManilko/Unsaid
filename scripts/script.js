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

    // пралакс ефект 
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



    // Фільтрація карток на сторінці архіву
    const searchInput = document.getElementById('archiveSearch');
    const filterBtn = document.querySelector('.archive-filter-btn');

    if (searchInput && filterBtn) {
        function filterCards() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            const currentCards = document.querySelectorAll('.unsent-card');

            currentCards.forEach(card => {
                const name = card.querySelector('h2').textContent.toLowerCase();
                const colorClass = card.querySelector('.unsent-card-body').className.split(' ')[1] || '';
                const isVisible = name.includes(searchTerm) || colorClass.includes(searchTerm) || searchTerm === '';

                card.style.display = isVisible ? 'block' : 'none';
            });
        }

        searchInput.addEventListener('input', filterCards);
        filterBtn.addEventListener('click', function() {
            searchInput.value = '';
            filterCards();
        });
    }





















	
    // --- 3. БАЗА ДАНИХ (Відправка і завантаження) ---
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_URL = isLocal ? '/api/messages' : null;

    // Supabase config for browser deploys. Replace with your actual values.
    const SUPABASE_URL = 'https://your-project.supabase.co';
    const SUPABASE_ANON_KEY = 'your-anon-key';
    const SUPABASE_TABLE = 'messages';
    let supabaseClient = null;

    async function getSupabaseClient() {
        if (supabaseClient) {
            return supabaseClient;
        }

        if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL.includes('your-project') || SUPABASE_ANON_KEY.includes('your-anon-key')) {
            throw new Error('Supabase is not configured. Update SUPABASE_URL and SUPABASE_ANON_KEY in scripts/script.js');
        }

        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
        supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        return supabaseClient;
    }

    async function saveMessageToSupabase({ recipient, color, message }) {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
            .from(SUPABASE_TABLE)
            .insert([{ recipient, color, message }])
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    }

    async function loadMessagesFromSupabase() {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
            .from(SUPABASE_TABLE)
            .select('id, recipient, color, message, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return data;
    }

    const recipientInput = document.querySelector('input[name="recipient"]');
    const colorInput = document.querySelector('input[name="color"]');
    const messageTextarea = document.querySelector('textarea[name="message"]');

    // Відправка повідомлення
    const submitBtn = document.querySelector('.submit-form .form-submit');
    if (submitBtn && recipientInput && colorInput && messageTextarea) {
        submitBtn.addEventListener('click', async () => {
            const recipient = recipientInput.value.trim();
            const color = colorInput.value.toLowerCase().trim() || 'lavender';
            const message = messageTextarea.value.trim();

            if (!recipient || !message) {
                alert('Будь ласка, заповніть отримувача та повідомлення.');
                return;
            }

            try {
                if (API_URL) {
                    const response = await fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ recipient, color, message })
                    });

                    if (!response.ok) {
                        const errorPayload = await response.json().catch(() => null);
                        console.error('Server error:', errorPayload);
                        throw new Error('Server response was not OK');
                    }
                } else {
                    await saveMessageToSupabase({ recipient, color, message });
                }

                alert('Повідомлення успішно додано до архіву!');
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Помилка відправки:', error);
                alert('Не вдалося надіслати повідомлення. Перевірте конфігурацію Supabase або локальний сервер.');
            }
        });
    }

    // Завантаження карток (Тільки для сторінки index.html)
    const archiveGrid = document.querySelector('.archive-grid');
    if (archiveGrid) {
        async function loadMessages() {
            try {
                let messages;

                if (API_URL) {
                    const response = await fetch(API_URL);
                    if (!response.ok) {
                        const errorPayload = await response.text();
                        throw new Error(errorPayload || 'API response was not OK');
                    }
                    messages = await response.json();
                } else {
                    messages = await loadMessagesFromSupabase();
                }

                
                messages.forEach(msg => {
                    const colorClass = ['lavender', 'sky', 'peach', 'mint'].includes(msg.color) ? msg.color : 'lavender';
                    
                    const cardHTML = `
                        <article class="unsent-card">
                            <header class="unsent-card-header">
                                <div class="unsent-badge">ABC</div>
                                <h2>To: ${msg.recipient}</h2>
                                <div class="unsent-stamp" aria-hidden="true"></div>
                            </header>
                            <div class="unsent-card-body ${colorClass}">
                                <p>${msg.message}</p>
                            </div>
                        </article>
                    `;
                    archiveGrid.insertAdjacentHTML('beforeend', cardHTML);
                });
            } catch (error) {
                console.error('Помилка завантаження повідомлень:', error);
            }
        }
        loadMessages();
    }
});
