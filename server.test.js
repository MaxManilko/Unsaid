const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./server'); 

describe('Тестування API Unsaid Archive', () => {
    
    // 1. ПЕРЕД ТЕСТАМИ: Підключаємось до окремої ТЕСТОВОЇ бази даних
    beforeAll(async () => {
    
        const url = 'mongodb://localhost:27017/unsaid_archive_test';
        await mongoose.connect(url); 
    });

    // 2. ПІСЛЯ ТЕСТІВ: Видаляємо тестову базу і закриваємо з'єднання
    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    // тести

    it('Повинен успішно створювати нове повідомлення (POST /api/messages)', async () => {
        const response = await request(app)
            .post('/api/messages')
            .send({
                recipient: 'Test Recipient',
                color: 'sky',
                message: 'Цей тест працює ідеально!'
            });
        
        // Перевіряємо, чи сервер відповів статусом 201 (Створено)
        expect(response.statusCode).toBe(201);
        
        // Перевіряємо, чи повернулися правильні дані
        expect(response.body).toHaveProperty('recipient', 'Викладач');
        expect(response.body).toHaveProperty('message', 'Цей тест працює ідеально!');
    });

    it('Повинен повертати список повідомлень (GET /api/messages)', async () => {
        const response = await request(app).get('/api/messages');
        
        // Перевіряємо, чи сервер відповів статусом 200 (ОК)
        expect(response.statusCode).toBe(200);
        
        // Перевіряємо, чи відповідь - це масив (список)
        expect(Array.isArray(response.body)).toBeTruthy();
        
        // Оскільки ми в попередньому тесті створили 1 повідомлення, масив не має бути пустим
        expect(response.body.length).toBeGreaterThan(0);
    });
});