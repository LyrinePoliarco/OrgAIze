import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './Acss.css'; // Make sure this file exists
import supabase from '../../lib/supabaseClient.js';

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

// Define the Home component
const HomeComponent = ({ orgDescription, announcement, birthdayCelebrants, meetingLinks }) => {
  return (
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
              <div className="org-image-placeholder"></div>
              <img src="/image/org.png" alt="Organization" className="org-image" />
              <div
                className="content-display"
                dangerouslySetInnerHTML={{ __html: orgDescription || 'No organization description available.' }}
              />
            </div>
          </div>
        </div>
        
        {/* Announcement Panel */}
        <div className="panel">
          <div className="panel-header">
            <h3><FaBullhorn className="panel-icon" /> Announcement</h3>
          </div>
          <div className="panel-content">
            <div 
              className="announcement-display"
              dangerouslySetInnerHTML={{ __html: announcement || 'No announcements at this time.' }}
            />
          </div>
        </div>
        
        {/* Birthday Greetings Panel */}
        <div className="panel">
          <div className="panel-header">
            <h3><FaBirthdayCake className="panel-icon" /> Birthday Greetings</h3>
          </div>
          <div className="panel-content">
            {birthdayCelebrants && birthdayCelebrants.length > 0 ? (
              <div className="celebrants-list">
                {birthdayCelebrants.map((celebrant, index) => {
                  // Format the birthday date
                  const birthDate = new Date(celebrant.birthday);
                  const formattedDate = birthDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric'
                  });
                  
                  return (
                    <div key={celebrant.id || index} className="celebrant-item">
                      <div className="celebrant-name">{celebrant.name}</div>
                      <div className="celebrant-date">{formattedDate}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>No birthday celebrants this month.</p>
            )}
          </div>
        </div>
        
        {/* Meeting Links Panel */}
        <div className="panel">
          <div className="panel-header">
            <h3><FaLink className="panel-icon" /> Meeting Links</h3>
          </div>
          <div className="panel-content">
            {meetingLinks.length > 0 ? (
              <div className="meeting-links">
                {meetingLinks.map(link => (
                  <div key={link.id} className="meeting-link-item">
                    <div className="meeting-link-info">
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.url}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No meeting links available.</p>
            )}
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
  );
};

// Define the Files component
const FilesComponent = ({ files, launchReactAiApp, aiError }) => {
  return (
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
            {files.length > 0 ? (
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
            ) : (
              <p>No files available.</p>
            )}
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
  );
};

const AcssStudentContent = () => {
  // User data state
  const [userData, setUserData] = useState(null);
  // State for active tab
  const [activeTab, setActiveTab] = useState('home');
  // State for AI error messages
  const [aiError, setAiError] = useState(null);
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // States for content fetched from Supabase
  const [orgDescription, setOrgDescription] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [birthdayCelebrants, setBirthdayCelebrants] = useState([]);
  const [meetingLinks, setMeetingLinks] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    name: '',
    role: ''
  });
  
  // Fetch data from Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the user from localStorage (assuming it's stored during login)
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);
          
          // Fetch current user details from users table
          const { data: userDetails, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', parsedUserData.id)
            .single();
          
          if (userError) throw userError;
          
          if (userDetails) {
            setCurrentUser({
              name: userDetails.name || 'ACSS Member',
              role: userDetails.role || 'Member'
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchOrganizationDetails = async () => {
      try {
        // Fetch organization description from organization_details table
        const { data: orgData, error: orgError } = await supabase
          .from('organization_details')
          .select('description')
          .single();
        
        if (orgError) throw orgError;
        
        if (orgData) {
          setOrgDescription(orgData.description);
        }
      } catch (error) {
        console.error('Error fetching organization details:', error);
      }
    };

    const fetchAnnouncement = async () => {
      try {
        // Fetch latest announcement
        const { data: announcementData, error: announcementError } = await supabase
          .from('organization_details')
          .select('announcement')
          .single();
        
        if (announcementError) throw announcementError;
        
        if (announcementData) {
          setAnnouncement(announcementData.announcement);
        }
      } catch (error) {
        console.error('Error fetching announcement:', error);
      }
    };

    const fetchBirthdayCelebrants = async () => {
      try {
        // Fetch birthday celebrants from organization_details table
        const { data: celebrantsData, error: celebrantsError } = await supabase
          .from('organization_details')
          .select('birthday_celebrants')
          .single();
          
        if (celebrantsError) throw celebrantsError;
        
        if (celebrantsData && celebrantsData.birthday_celebrants) {
          // Set the birthday celebrants HTML content directly
          setBirthdayCelebrants(celebrantsData.birthday_celebrants);
        } else {
          setBirthdayCelebrants('No birthday celebrants this month.');
        }
      } catch (error) {
        console.error('Error fetching birthday celebrants:', error);
        setBirthdayCelebrants('Error loading birthday celebrants.');
      }
    };

    // Fixed fetchMeetingLinks function
    const fetchMeetingLinks = async () => {
      try {
        const { data, error } = await supabase
          .from('organization_details')
          .select('meeting_links')
          .single(); // get only one row

        if (error) throw error;

        if (data?.meeting_links) {
          // Handle different possible formats of meeting_links
          if (typeof data.meeting_links === 'string') {
            // If it's a single string URL
            setMeetingLinks([{ id: 1, url: data.meeting_links }]);
          } else if (Array.isArray(data.meeting_links)) {
            // If it's already an array of objects with URLs
            const formattedLinks = data.meeting_links.map((link, index) => {
              // If each item is already an object with id and url
              if (typeof link === 'object' && link.url) {
                return link;
              }
              // If each item is just a string URL
              return { id: index + 1, url: link };
            });
            setMeetingLinks(formattedLinks);
          }
        } else {
          setMeetingLinks([]);
        }
      } catch (error) {
        console.error('Error fetching meeting links:', error);
        setMeetingLinks([]);
      }
    };

    const fetchFiles = async () => {
      try {
        // Fetch visible files (not hidden)
        const { data: fileData, error: fileError } = await supabase
          .from('files') // Changed from Organization_details to files based on context
          .select('*')
          .eq('isHidden', false);
        
        if (fileError) throw fileError;
        
        if (fileData) {
          // Format dates for display
          const formattedFiles = fileData.map(file => {
            return {
              id: file.id,
              name: file.name,
              size: file.size,
              uploadedBy: file.uploadedBy,
              date: new Date(file.date).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              }),
              isHidden: file.isHidden
            };
          });
          
          setFiles(formattedFiles);
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Execute all fetch functions
    fetchUserData();
    fetchOrganizationDetails();
    fetchAnnouncement();
    fetchBirthdayCelebrants();
    fetchMeetingLinks();
    fetchFiles();
  }, []);
  
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
  
  if (isLoading) {
    return <div className="loading">Loading dashboard data...</div>;
  }
  
  return (
    <div className="acss-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          {/* Placeholder for the logo */}
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
          <div className="avatar-placeholder">{currentUser.name ? currentUser.name.charAt(0) : 'U'}</div>
          <div className="user-details">
            <p className="user-name">{currentUser.name || 'ACSS Member'}</p>
            <p className="user-role">{currentUser.role || 'Member'}</p>
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

        {/* Dynamic Content */}
        <div className="content-area">
          {activeTab === 'home' && 
            <HomeComponent 
              orgDescription={orgDescription}
              announcement={announcement}
              birthdayCelebrants={birthdayCelebrants}
              meetingLinks={meetingLinks}
            />
          }
          {activeTab === 'files' && 
            <FilesComponent 
              files={files} 
              launchReactAiApp={launchReactAiApp} 
              aiError={aiError} 
            />
          }
        </div>
      </div>
    </div>
  );
};

const AcssStudent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AcssStudentContent />} />
      </Routes>
    </Router>
  );
};

export default AcssStudent;