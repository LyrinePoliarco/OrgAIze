import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './Acss.css'; // Make sure this file exists
import supabase from '../../lib/supabaseClient.js'; // Uncommented this line

// Placeholder icons
import { 
  FaHome, 
  FaFile, 
  FaBullhorn, 
  FaBirthdayCake, 
  FaLink, 
  FaSitemap, 
  FaRobot
} from 'react-icons/fa';

// Simple placeholder for AcssOrgChart component
const AcssOrgChart = () => {
  return (
    <div className="org-chart">
      <p>Organization Chart Placeholder</p>
    </div>
  );
};

const AcssStudentContent = () => {
  const [userData, setUserData] = useState(null);
  // State for active tab
  const [activeTab, setActiveTab] = useState('home');
  // State for AI error messages
  const [aiError, setAiError] = useState(null);
  
  // States for content (non-editable for students)
  const [orgDescription] = useState(
    "The Association of Computer Science Students (ACSS) at New Era University is dedicated to fostering academic excellence and professional growth in the field of computing. Founded in 2005, ACSS has been a platform for students to explore and enhance their skills beyond the classroom."
  );
  
  const [announcement] = useState(
    "Welcome to the ACSS Student Dashboard! This platform will help you stay informed about upcoming events and activities."
  );
  
  // Mock data for birthday celebrants
  const [birthdayCelebrants] = useState([
    { id: 1, name: "Faye Camille Buri", date: "May 15", imageUrl: "/image/faye.png" },
    { id: 2, name: "Etienne Banquil", date: "May 22", imageUrl: "/image/eti.png" }
  ]);
  
  // Mock data for meeting links
  const [meetingLinks] = useState([
    { id: 1, title: "Weekly General Assembly", url: "https://meet.google.com/abc-defg-hij", date: "Every Friday, 4:00 PM" },
    { id: 2, title: "Executive Committee Meeting", url: "https://meet.google.com/xyz-abcd-efg", date: "Every Wednesday, 5:30 PM" },
    { id: 3, title: "Technical Workshop Series", url: "https://meet.google.com/123-456-789", date: "May 18, 2:00 PM" }
  ]);
  
  // Mock data for files (only showing visible files)
  const [files] = useState([
    { id: 1, name: "ACSS Constitution.pdf", size: "1.2 MB", uploadedBy: "Faye Camille Buri", date: "April 10, 2025", isHidden: false },
    { id: 3, name: "Technical Workshop Materials.zip", size: "15.7 MB", uploadedBy: "Julius Albert D. Ortiz", date: "April 20, 2025", isHidden: false }
  ]);
  
  // Function to handle logout
  const handleLogout = async () => {
    try {
      // First sign out from Supabase auth
      if (supabase && supabase.auth) {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          console.error("Error during Supabase signout:", error);
        } else {
          console.log("Successfully signed out of Supabase");
        }
      } else {
        console.log("Supabase not available, proceeding with local logout");
      }
      
      // Clear local storage
      localStorage.removeItem('userData');
      console.log("User data removed from localStorage");
      
      // Redirect to the index page
      window.location.href = '/';
    } catch (error) {
      console.error("Error during logout:", error);
      // Fallback if there's an error - still try to redirect
      localStorage.removeItem('userData');
      window.location.href = '/';
    }
  };
  
  // Function to launch React AI app
  const launchReactAiApp = () => {
    try {
      // Hide current body content (optional, depending on your UI)
      document.body.classList.add('hide-content');
      
      // Ensure we have user data
      const storedUserData = localStorage.getItem('userData');
      if (!storedUserData) {
        throw new Error('No user data found');
      }

      // Create a script element to load the AI main app
      const script = document.createElement('script');
      script.type = 'module';
      script.src = '/src/ai/Ai-layout.jsx';
      
      // Append script to body
      document.body.appendChild(script);
      
      console.log('AI React app launched');
    } catch (error) {
      console.error('Error launching AI app:', error);
      // Optionally show an error to the user
      setAiError('Could not launch AI assistant');
    }
  };

  // Function to handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  return (
    <div className="acss-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          {/* Using a placeholder for the logo to prevent errors */}
          <div className="logo-placeholder">ACSS</div>
          <h2>ACSS</h2>
        </div>
        
        <div className="nav-links">
          <button 
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => handleTabChange('home')}
          >
            <FaHome className="nav-icon" />
            <span>Home</span>
          </button>
          
          <button 
            className={`nav-link ${activeTab === 'files' ? 'active' : ''}`}
            onClick={() => handleTabChange('files')}
          >
            <FaFile className="nav-icon" />
            <span>Files</span>
          </button>
        </div>
        
        <div className="user-info">
          {/* Using a placeholder for the avatar to prevent errors */}
          <div className="avatar-placeholder">LP</div>
          <div className="user-details">
            <p className="user-name">Lyrine Poliarco</p>
            <p className="user-role">ACSS Member</p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1>ACSS Student Dashboard</h1>
          <div className="header-actions">
            <button className="header-btn">Settings</button>
            <button onClick={handleLogout} className="header-btn">Logout</button>
          </div>
        </div>
        
        {/* Home Tab Content */}
        {activeTab === 'home' && (
          <div className="tab-content">
            <h2>Home</h2>
            
            <div className="panels-grid">
              {/* Organization Description Panel */}
              <div className="panel">
                <div className="panel-header">
                  <h3><FaBullhorn className="panel-icon" /> Organization Description</h3>
                </div>
                <div className="panel-content">
                  <div className="org-description">
                    {/* Using a placeholder for the org image to prevent errors */}
                    <div className="org-image-placeholder">Organization Image</div>
                    <div className="content-display">
                      {orgDescription}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Announcement Panel */}
              <div className="panel">
                <div className="panel-header">
                  <h3><FaBullhorn className="panel-icon" /> Announcement</h3>
                </div>
                <div className="panel-content">
                  <div className="content-display">
                    {announcement}
                  </div>
                </div>
              </div>
              
              {/* Birthday Greetings Panel */}
              <div className="panel">
                <div className="panel-header">
                  <h3><FaBirthdayCake className="panel-icon" /> Birthday Greetings</h3>
                </div>
                <div className="panel-content">
                  <div className="celebrants-container">
                    {birthdayCelebrants.map(celebrant => (
                      <div key={celebrant.id} className="celebrant-card">
                        {/* Using a placeholder for the celebrant image to prevent errors */}
                        <div className="celebrant-img-placeholder">{celebrant.name.charAt(0)}</div>
                        <div className="celebrant-info">
                          <h4>{celebrant.name}</h4>
                          <p>{celebrant.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Meeting Links Panel */}
              <div className="panel">
                <div className="panel-header">
                  <h3><FaLink className="panel-icon" /> Meeting Links</h3>
                </div>
                <div className="panel-content">
                  <div className="meeting-links">
                    {meetingLinks.map(link => (
                      <div key={link.id} className="meeting-link-item">
                        <div className="meeting-link-info">
                          <h4>{link.title}</h4>
                          <p>{link.date}</p>
                          <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Organizational Chart Panel */}
              <div className="panel org-chart-panel">
                <div className="panel-header">
                  <h3><FaSitemap className="panel-icon" /> Organizational Chart</h3>
                </div>
                <div className="panel-content">
                  <AcssOrgChart />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Files Tab Content */}
        {activeTab === 'files' && (
          <div className="tab-content">
            <h2>Files</h2>
            
            <div className="panels-grid">
              {/* Files List Panel */}
              <div className="panel files-list-panel">
                <div className="panel-header">
                  <h3><FaFile className="panel-icon" /> Files</h3>
                  <div className="search-container">
                    <input type="text" placeholder="Search files..." className="search-input" />
                  </div>
                </div>
                <div className="panel-content">
                  <table className="files-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Size</th>
                        <th>Uploaded By</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.map(file => (
                        <tr key={file.id}>
                          <td>{file.name}</td>
                          <td>{file.size}</td>
                          <td>{file.uploadedBy}</td>
                          <td>{file.date}</td>
                          <td>
                            <div className="file-actions">
                              <button className="action-btn download">Download</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* AI Chat Panel */}
              <div className="panel">
                <div className="panel-header">
                  <h3><FaRobot className="panel-icon" /> AI Assistant</h3>
                </div>
                <div className="panel-content">
                  <div className="ai-chat-preview">
                    <FaRobot className="ai-icon" />
                    <div className="ai-intro">
                      <h4>ACSS AI Assistant</h4>
                      <p>Get help with finding information or answering questions about ACSS activities.</p>
                      <button
                        onClick={launchReactAiApp}
                        className="chat-btn">Start Chat</button>
                    </div>
                  </div>
                  {aiError && <p className="error-message">{aiError}</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AcssStudent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AcssStudentContent />} />
        {/* You might want to add a dedicated route for the AI assistant */}
        {/* <Route path="/ai-assistant" element={<AiAssistant />} /> */}
      </Routes>
    </Router>
  );
};

export default AcssStudent;