document.addEventListener('DOMContentLoaded', function() {
    // --- 1. ТЕМА (Працює на всіх сторінках) ---
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

    // --- 2. ПОШУК ТА ФІЛЬТР (Тільки для index.html) ---
    const searchInput = document.getElementById('archiveSearch');
    const filterBtn = document.querySelector('.archive-filter-btn');

    if (searchInput && filterBtn) {
        function filterCards() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            // Отримуємо актуальні картки (бо вони тепер вантажаться з БД)
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
    const API_URL = 'http://localhost:3000/api/messages';

    // Відправка повідомлення (Тільки для сторінки submit.html)
    const submitBtn = document.querySelector('.submit-form .form-submit');
    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const recipient = document.querySelector('input[name="recipient"]').value;
            const color = document.querySelector('input[name="color"]').value.toLowerCase();
            const message = document.querySelector('textarea[name="message"]').value;

            if (!recipient || !message) {
                alert('Будь ласка, заповніть отримувача та повідомлення.');
                return;
            }

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ recipient, color, message })
                });

                if (response.ok) {
                    alert('Повідомлення успішно додано до архіву!');
                    window.location.href = 'index.html'; // Перенаправлення на головну
                } else {
                    alert('Помилка сервера. Спробуйте ще раз.');
                }
            } catch (error) {
                console.error('Помилка відправки:', error);
                alert('Не вдалося з\'єднатися з сервером. Перевірте, чи запущений сервер (node server.js в терміналі).');
            }
        });
    }

    // Завантаження карток (Тільки для сторінки index.html)
    const archiveGrid = document.querySelector('.archive-grid');
    if (archiveGrid) {
        async function loadMessages() {
            try {
                const response = await fetch(API_URL);
                const messages = await response.json();
                
                archiveGrid.innerHTML = ''; // Очищуємо статичні картки
                
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