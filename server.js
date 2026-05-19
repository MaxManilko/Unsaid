
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
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '';
const useSupabase = process.env.NODE_ENV !== 'test' && !!SUPABASE_URL && !!SUPABASE_KEY;
let supabaseClient = null;

console.log('[DEBUG] NODE_ENV:', process.env.NODE_ENV);
console.log('[DEBUG] SUPABASE_URL:', SUPABASE_URL ? 'set' : 'missing');
console.log('[DEBUG] SUPABASE_KEY:', SUPABASE_KEY ? 'set' : 'missing');
console.log('[DEBUG] useSupabase:', useSupabase);

if (useSupabase) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('[INFO] ✅ Supabase client configured and ready');
} else if (process.env.NODE_ENV !== 'test') {
    console.warn('[WARN] ❌ SUPABASE_URL or SUPABASE_KEY is missing. Using in-memory fallback storage.');
}

const fallbackMessages = [];

async function fetchMessages() {
    if (useSupabase) {
        const { data, error } = await supabaseClient
            .from('messages')
            .select('id, recipient, color, message, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[ERROR] Supabase fetch error:', JSON.stringify(error));
            throw error;
        }

        console.log('[DEBUG] Fetched', data?.length || 0, 'messages from Supabase');
        return data;
    }

    console.log('[DEBUG] Using fallback storage for fetch');
    return [...fallbackMessages].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

async function saveMessage({ recipient, color, message }) {
    if (useSupabase) {
        console.log('[DEBUG] Attempting to save to Supabase...');
        const { data, error } = await supabaseClient
            .from('messages')
            .insert([{ recipient, color, message }])
            .select()
            .single();

        if (error) {
            console.error('[ERROR] Supabase save error:', JSON.stringify(error));
            throw error;
        }

        console.log('[DEBUG] Successfully saved to Supabase, ID:', data.id);
        return data;
    }

    console.log('[DEBUG] Using fallback storage for save');

    const newMessage = {
        id: `${Date.now()}`,
        recipient,
        color,
        message,
        created_at: new Date().toISOString()
    };

    fallbackMessages.push(newMessage);
    return newMessage;
}

app.get('/api/messages', async (req, res) => {
    try {
        const messages = await fetchMessages();
        res.json(messages);
    } catch (error) {
        console.error('Помилка отримання повідомлень:', error);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

app.post('/api/messages', async (req, res) => {
    console.log('[POST-START] useSupabase:', useSupabase, 'supabaseClient:', !!supabaseClient);
    try {
        const { recipient, color, message } = req.body;

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

app.resetTestData = () => {
    fallbackMessages.length = 0;
};

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Сервер працює на порту ${PORT}`);
    });
}

module.exports = app;