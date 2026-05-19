const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_TABLE = process.env.SUPABASE_TABLE || 'messages';

let supabaseClient = null;

function getSupabaseClient() {
    if (!supabaseClient) {
        if (!SUPABASE_URL || !SUPABASE_KEY) {
            throw new Error('Missing Supabase configuration');
        }
        supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
    }
    return supabaseClient;
}

async function fetchMessages() {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from(SUPABASE_TABLE)
        .select('id, recipient, color, message, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        throw error;
    }

    return data;
}

async function saveMessage({ recipient, color, message }) {
    const supabase = getSupabaseClient();
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

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'GET') {
            const messages = await fetchMessages();
            return res.status(200).json(messages);
        } else if (req.method === 'POST') {
            const { recipient, color = 'lavender', message } = req.body;

            if (!recipient || !message) {
                return res.status(400).json({ error: 'Recipient and message are required.' });
            }

            const newMessage = await saveMessage({ recipient, color, message });
            return res.status(201).json(newMessage);
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('[ERROR]', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
