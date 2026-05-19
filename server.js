
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_TABLE = process.env.SUPABASE_TABLE || 'messages';
const useSupabase = !!SUPABASE_URL && !!SUPABASE_KEY;
let supabaseClient = null;

console.log('[INFO] NODE_ENV:', process.env.NODE_ENV);
console.log('[INFO] SUPABASE_URL:', SUPABASE_URL ? 'set' : 'missing');
console.log('[INFO] SUPABASE_KEY:', SUPABASE_KEY ? 'set' : 'missing');
console.log('[INFO] SUPABASE_TABLE:', SUPABASE_TABLE);
console.log('[INFO] useSupabase:', useSupabase);

if (useSupabase) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('[INFO] ✅ Supabase client configured and ready');
} else {
    console.error('[ERROR] Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
}

async function fetchMessages() {
    if (!supabaseClient) {
        throw new Error('Supabase client is not configured');
    }

    const { data, error } = await supabaseClient
        .from(SUPABASE_TABLE)
        .select('id, recipient, color, message, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[ERROR] Supabase fetch error:', JSON.stringify(error));
        throw error;
    }

    return data;
}

async function saveMessage({ recipient, color, message }) {
    if (!supabaseClient) {
        throw new Error('Supabase client is not configured');
    }

    const { data, error } = await supabaseClient
        .from(SUPABASE_TABLE)
        .insert([{ recipient, color, message }])
        .select()
        .single();

    if (error) {
        console.error('[ERROR] Supabase save error:', JSON.stringify(error));
        throw error;
    }

    return data;
}

app.get('/api/messages', async (req, res) => {
    if (!useSupabase) {
        return res.status(500).json({ error: 'Supabase is not configured' });
    }

    try {
        const messages = await fetchMessages();
        res.json(messages);
    } catch (error) {
        console.error('Помилка отримання повідомлень:', error);
        res.status(500).json({ error: 'Помилка сервера при отриманні повідомлень' });
    }
});

app.post('/api/messages', async (req, res) => {
    if (!useSupabase) {
        return res.status(500).json({ error: 'Supabase is not configured' });
    }

    try {
        const { recipient, color = 'lavender', message } = req.body;

        if (!recipient || !message) {
            return res.status(400).json({ error: 'Recipient and message are required.' });
        }

        const newMessage = await saveMessage({ recipient, color, message });
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('ДЕТАЛЬНА ПОМИЛКА ЗБЕРЕЖЕННЯ:', error);
        res.status(500).json({ error: 'Не вдалося зберегти повідомлення' });
    }
});

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Сервер працює на порту ${PORT}`);
    });
}

module.exports = app;