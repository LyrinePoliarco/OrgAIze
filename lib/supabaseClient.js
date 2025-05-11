// supabaseClient.js
// Supabase client initialization

// Initialize Supabase client

// Create and export the Supabase client
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Export the client for use in other files
export default supabase;
