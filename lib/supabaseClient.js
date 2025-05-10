// supabaseClient.js
// Supabase client initialization

// Initialize Supabase client
const supabaseUrl = 'https://hqbswwhkncwmztisouli.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxYnN3d2hrbmN3bXp0aXNvdWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2ODU4NjYsImV4cCI6MjA2MjI2MTg2Nn0.ILNna1DCoNJoKpUmTiYKCxEyrMiBMdWfgptDRDPeE7w';

// Create and export the Supabase client
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Export the client for use in other files
export default supabase;