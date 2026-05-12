import { createClient } from '@supabase/supabase-js';

// Pastikan URL dan KEY ini di file .env frontend Anda
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);