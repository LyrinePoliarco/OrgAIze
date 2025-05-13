// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY || '';

// Create and export the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY,SUPABASE_SERVICE_KEY );

export default supabase;
