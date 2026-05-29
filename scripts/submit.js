document.addEventListener('DOMContentLoaded', function() {
    const API_URL = '/api/messages';
    const recipientInput = document.querySelector('input[name="recipient"]');
    const colorInput = document.querySelector('input[name="color"]');
    const messageTextarea = document.querySelector('textarea[name="message"]');
    const submitBtn = document.querySelector('.submit-form .form-submit');

    if (submitBtn && recipientInput && colorInput && messageTextarea) {
        submitBtn.addEventListener('click', async event => {
            event.preventDefault();

            const recipient = recipientInput.value.trim();
            const color = colorInput.value.toLowerCase().trim() || 'lavender';
            const message = messageTextarea.value.trim();

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
                    window.location.href = 'index.html';
                } else {
                    const errorPayload = await response.json().catch(() => null);
                    console.error('Server error:', errorPayload);
                    alert('Помилка сервера. Спробуйте ще раз.');
                }
            } catch (error) {
                console.error('Помилка відправки:', error);
                alert('Не вдалося з\'єднатися з сервером. Переконайтеся, що він запущений.');
            }
        });
    }
});
