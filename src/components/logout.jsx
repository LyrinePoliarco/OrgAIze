// Example App.jsx showing how to implement the logout functionality
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './logout.css'; // Import your CSS file
import Sidebar from '/Sidebar';
// Import your other components


function App() {
  // Your existing state variables
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState([{ id: "default", title: "New Chat", messages: [] }]);
  const [activeConversation, setActiveConversation] = useState("default");
  const [theme, setTheme] = useState("light");
  
  // Add user data state
  const [userData, setUserData] = useState(null);

  // Load user data from localStorage on initial render
  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      try {
        const parsedUserData = JSON.parse(savedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error.message);
        return;
      }
      
      // Clear user data from localStorage
      localStorage.removeItem('userData');
      
      // Redirect to login page
      window.location.href = '/'; // Adjust if your login page is at a different route
    } catch (err) {
      console.error('Unexpected error during logout:', err);
    }
  };

  return (
    <div className={`app ${theme}`}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        conversations={conversations}
        setConversations={setConversations}
        activeConversation={activeConversation}
        setActiveConversation={setActiveConversation}
        theme={theme}
        setTheme={setTheme}
        userData={userData}
        onLogout={handleLogout}
      />
      
      {/* Your other components */}
    </div>
  );
}

export default App;