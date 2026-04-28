// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Підключення до MongoDB
mongoose.connect('mongodb://localhost:27017/unsaid_archive')
  .then(() => console.log('Підключено до MongoDB'))
  .catch(err => console.error('Помилка підключення:', err));
// Створення колекції та структури документа (Схема) 
const messageSchema = new mongoose.Schema({
    recipient: String,
    color: String,
    message: String,
    date: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Маршрутизація (CRUD операції) 

// 1. Отримання всіх повідомлень (Read) 
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ date: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

// 2. Створення нового повідомлення (Create)
app.post('/api/messages', async (req, res) => {
    try {
        const { recipient, color, message } = req.body;
        const newMessage = new Message({ recipient, color, message });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        // ДОДАЛИ ЦЕЙ РЯДОК, щоб бачити помилку в терміналі:
        console.error('ДЕТАЛЬНА ПОМИЛКА ЗБЕРЕЖЕННЯ:', error); 
        res.status(500).json({ error: 'Не вдалося зберегти повідомлення' });
    }
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер працює на порту ${PORT}`);
});