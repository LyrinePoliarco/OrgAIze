import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AcssOrgChart from './AcssOrgChart';
import './Acss.css';
import supabase from '../../lib/supabaseClient.js';

// Placeholder icons (replace with actual imports later)
import { 
  FaHome, 
  FaFile, 
  FaUsers, 
  FaBullhorn, 
  FaBirthdayCake, 
  FaLink, 
  FaSitemap, 
  FaCloudUploadAlt, 
  FaRobot, 
  FaUserPlus, 
  FaUsersCog
} from 'react-icons/fa';

const AcssContent = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('home');
  
  // State for user data
  const [userData, setUserData] = useState({});
  
  // State for AI error
  const [aiError, setAiError] = useState(null);
  
  // States for editable content
  const [orgDescription, setOrgDescription] = useState(
    "The Association of Computer Science Students (ACSS) at New Era University is dedicated to fostering academic excellence and professional growth in the field of computing. Founded in 2005, ACSS has been a platform for students to explore and enhance their skills beyond the classroom."
  );
  
  const [announcement, setAnnouncement] = useState(
    "Welcome to the new ACSS Executive Dashboard! This platform will help us collaborate better and keep everyone informed about upcoming events and activities."
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
  
  // Mock data for files
  const [files] = useState([
    { id: 1, name: "ACSS Constitution.pdf", size: "1.2 MB", uploadedBy: "Faye Camille Buri", date: "April 10, 2025", isHidden: false },
    { id: 2, name: "Event Calendar 2025.xlsx", size: "540 KB", uploadedBy: "Aliyah Aira A. Llana", date: "April 15, 2025", isHidden: true },
    { id: 3, name: "Technical Workshop Materials.zip", size: "15.7 MB", uploadedBy: "Julius Albert D. Ortiz", date: "April 20, 2025", isHidden: false }
  ]);
  
  // Mock data for members
  const [members] = useState([
    { id: 1, name: "Faye Camille Buri", year: "4th Year", role: "President", imageUrl: "/image/aya.png" },
    { id: 2, name: "Aliyah Aira A. Llana", year: "4th Year", role: "Vice President (Internal)", imageUrl: "/image/aya.png" },
    { id: 3, name: "Julius Albert D. Ortiz", year: "4th Year", role: "Vice President (External)", imageUrl: "/image/aya.png" },
    { id: 4, name: "Pia Katleya V. Macalanda", year: "3rd Year", role: "Secretary", imageUrl: "/image/aya.png" },
    { id: 5, name: "Ricky Joe V. Sanglay", year: "3rd Year", role: "Asst. Secretary", imageUrl: "/image/aya.png" },
    { id: 6, name: "Bai Sakina B. Abad", year: "4th Year", role: "Academic Committee Chairman", imageUrl: "/image/aya.png" },
    { id: 7, name: "Juliana R. Mancera", year: "3rd Year", role: "Documentation Committee Chairman", imageUrl: "/image/aya.png" },
    { id: 8, name: "Thoby Jim R. Ralleta", year: "4th Year", role: "Information Committee Chairman", imageUrl: "/image/aya.png" }
  ]);
  
  // Updated Join Requests state with loading indicator for each request
  const [joinRequests, setJoinRequests] = useState([]);
  
  // State to track success or error messages
  const [acceptanceStatus, setAcceptanceStatus] = useState({
    id: null,
    message: '',
    isError: false
  });

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Fetch join requests from Supabase
  useEffect(() => {
    const fetchJoinRequests = async () => {
      try {
        // Query student_roles table for unconfirmed join requests
        const { data, error } = await supabase
          .from('student_roles')
          .select('*')
          .eq('confirm', false) 
          // Only get unconfirmed requests
          // Only get ACSS role requests
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Format the data for our component
          const formattedRequests = data.map(request => ({
            id: request.id,
            user_id: request.user_id,
            // name: request.student_name || 'Unknown Student',
            email: request.email || 'No email provided',
            date: new Date(request.created_at).toLocaleDateString(),
            isLoading: false
          }));
          
          setJoinRequests(formattedRequests);
        }
      } catch (error) {
        console.error('Error fetching join requests:', error);
      }
    };
    
    fetchJoinRequests();
  }, []);
  
  const handleLogout = async () => {
    try {
      // First sign out from Supabase auth
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error during Supabase signout:", error);
      } else {
        console.log("Successfully signed out of Supabase");
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

  const handleAcceptRequest = async (requestId) => {
    if (!requestId || typeof requestId !== 'string') {
      console.error('Invalid requestId:', requestId);
      setAcceptanceStatus({
        id: null,
        message: 'Invalid request ID provided.',
        isError: true
      });
      setTimeout(() => {
        setAcceptanceStatus({ id: null, message: '', isError: false });
      }, 3000);
      return;
    }

    try {
      // Set loading state for the specific request
      setJoinRequests(requests => 
        requests.map(req => 
          req.user_id === requestId ? { ...req, isLoading: true } : req
        )
      );

      // Find the request data
      const request = joinRequests.find(req => req.user_id === requestId);
      if (!request) {
        throw new Error('Request not found');
      }

      // Update the student_roles table using user_id as the key
      const { data, error } = await supabase
        .from('student_roles')
        .update({ confirm: true })
        .eq('user_id', requestId)
        .eq('email', request.email) // Ensure the email matches
        .select();

      if (error) {
        throw error;
      }

      console.log('Request accepted successfully:', data);

      // Remove the accepted request from the list
      setJoinRequests(requests => requests.filter(req => req.user_id !== requestId));

      // Set success message
      setAcceptanceStatus({
        id: requestId,
        message: `${request.name} has been successfully accepted into ACSS!`,
        isError: false
      });

      // Clear the success message after 3 seconds
      setTimeout(() => {
        setAcceptanceStatus({ id: null, message: '', isError: false });
      }, 3000);

    } catch (error) {
      console.error('Error accepting request:', error);

      // Reset loading state for the failed request
      setJoinRequests(requests => 
        requests.map(req => 
          req.user_id === requestId ? { ...req, isLoading: false } : req
        )
      );

      // Find the failed request
      const request = joinRequests.find(req => req.user_id === requestId);

      // Set error message
      setAcceptanceStatus({
        id: requestId,
        message: `Failed to accept ${request?.name || 'member'}: ${error.message}`,
        isError: true
      });

      // Clear the error message after 3 seconds
      setTimeout(() => {
        setAcceptanceStatus({ id: null, message: '', isError: false });
      }, 3000);
    }
  };

  // Add the missing handleDeclineRequest function
  const handleDeclineRequest = async (requestId) => {
    if (!requestId || typeof requestId !== 'string') {
      console.error('Invalid requestId:', requestId);
      setAcceptanceStatus({
        id: null,
        message: 'Invalid request ID provided.',
        isError: true
      });
      setTimeout(() => {
        setAcceptanceStatus({ id: null, message: '', isError: false });
      }, 3000);
      return;
    }

    try {
      // Set loading state for the specific request
      setJoinRequests(requests => 
        requests.map(req => 
          req.user_id === requestId ? { ...req, isLoading: true } : req
        )
      );

      // Find the request data
      const request = joinRequests.find(req => req.user_id === requestId);
      if (!request) {
        throw new Error('Request not found');
      }

      // Delete the record from student_roles table
      const { error } = await supabase
        .from('student_roles')
        .delete()
        .eq('user_id', requestId);

      if (error) {
        throw error;
      }

      console.log('Request declined successfully');

      // Remove the declined request from the list
      setJoinRequests(requests => requests.filter(req => req.user_id !== requestId));

      // Set success message
      setAcceptanceStatus({
        id: requestId,
        message: `${request.name}'s request has been declined.`,
        isError: false
      });

      // Clear the success message after 3 seconds
      setTimeout(() => {
        setAcceptanceStatus({ id: null, message: '', isError: false });
      }, 3000);

    } catch (error) {
      console.error('Error declining request:', error);

      // Reset loading state for the failed request
      setJoinRequests(requests => 
        requests.map(req => 
          req.user_id === requestId ? { ...req, isLoading: false } : req
        )
      );

      // Find the failed request
      const request = joinRequests.find(req => req.user_id === requestId);

      // Set error message
      setAcceptanceStatus({
        id: requestId,
        message: `Failed to decline ${request?.name || 'member'}: ${error.message}`,
        isError: true
      });

      // Clear the error message after 3 seconds
      setTimeout(() => {
        setAcceptanceStatus({ id: null, message: '', isError: false });
      }, 3000);
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
    // Clear any errors when switching tabs
    setAiError(null);
  };
  
  return (
    <div className="acss-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <img src="/image/logo.png" alt="ACSS Logo" className="logo" />
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
          
          <button 
            className={`nav-link ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => handleTabChange('members')}
          >
            <FaUsers className="nav-icon" />
            <span>Member Access</span>
          </button>
        </div>
        
        <div className="user-info">
          <img src="/image/logo.png" alt="User" className="user-avatar" />
          <div className="user-details">
            <p>{userData.name}</p>
            <p className="user-role">{userData.role || 'ACSS Executive'}</p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1>ACSS Executive Dashboard</h1>
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
                  <button className="edit-btn">Edit</button>
                </div>
                <div className="panel-content">
                  <div className="org-description">
                    <img src="/image/org.png" alt="Organization" className="org-image" />
                    <div 
                      className="editable-content" 
                      contentEditable="true"
                      onBlur={(e) => setOrgDescription(e.target.innerText)}
                      suppressContentEditableWarning={true}
                    >
                      {orgDescription}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Announcement Panel */}
              <div className="panel">
                <div className="panel-header">
                  <h3><FaBullhorn className="panel-icon" /> Announcement</h3>
                  <button className="edit-btn">Edit</button>
                </div>
                <div className="panel-content">
                  <div 
                    className="editable-content" 
                    contentEditable="true"
                    onBlur={(e) => setAnnouncement(e.target.innerText)}
                    suppressContentEditableWarning={true}
                  >
                    {announcement}
                  </div>
                </div>
              </div>
              
              {/* Birthday Greetings Panel */}
              <div className="panel">
                <div className="panel-header">
                  <h3><FaBirthdayCake className="panel-icon" /> Birthday Greetings</h3>
                  <button className="add-btn">Add Celebrant</button>
                </div>
                <div className="panel-content">
                  <div className="celebrants-container">
                    {birthdayCelebrants.map(celebrant => (
                      <div key={celebrant.id} className="celebrant-card">
                        <img src={celebrant.imageUrl} alt={celebrant.name} className="celebrant-img" />
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
                  <button className="add-btn">Add Link</button>
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
                        <div className="meeting-link-actions">
                          <button className="action-btn edit">Edit</button>
                          <button className="action-btn delete">Delete</button>
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
              {/* Upload File Panel */}
              <div className="panel">
                <div className="panel-header">
                  <h3><FaCloudUploadAlt className="panel-icon" /> Upload File</h3>
                </div>
                <div className="panel-content">
                  <div className="upload-area">
                    <FaCloudUploadAlt className="upload-icon" />
                    <p>Drag and drop files here or</p>
                    <button className="upload-btn">Browse Files</button>
                    <input type="file" className="file-input" hidden />
                  </div>
                </div>
              </div>
              
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
                        <th>Status</th>
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
                            <span className={`status ${file.isHidden ? 'hidden' : 'visible'}`}>
                              {file.isHidden ? 'Hidden' : 'Visible'}
                            </span>
                          </td>
                          <td>
                            <div className="file-actions">
                              <button className="action-btn download">Download</button>
                              <button className="action-btn visibility">
                                {file.isHidden ? 'Show' : 'Hide'}
                              </button>
                              <button className="action-btn delete">Delete</button>
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
                      <p>Get help with organizing files, analyzing data, or answering questions about ACSS activities.</p>
                      {aiError && <p className="error-message">{aiError}</p>}
                      <button
                        onClick={launchReactAiApp}
                        style={{ marginLeft: 'auto' }} 
                        className="chat-btn"
                      >
                        Start Chat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Member Access Tab Content */}
        {activeTab === 'members' && (
          <div className="tab-content">
            <h2>Member Access</h2>
            
            <div className="panels-grid">
              {/* ACSS Student Members Panel */}
              <div className="panel members-panel">
                <div className="panel-header">
                  <h3><FaUsersCog className="panel-icon" /> ACSS Student Members</h3>
                  <div className="search-container">
                    <input type="text" placeholder="Search members..." className="search-input" />
                  </div>
                </div>
                <div className="panel-content">
                  <table className="members-table">
                    <thead>
                      <tr>
                        <th>Member</th>
                        <th>Year</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map(member => (
                        <tr key={member.id}>
                          <td className="member-cell">
                            <img src={member.imageUrl} alt={member.name} className="member-avatar" />
                            <span>{member.name}</span>
                          </td>
                          <td>{member.year}</td>
                          <td>{member.role}</td>
                          <td>
                            <div className="member-actions">
                              <button className="action-btn promote">
                                {member.role.includes("President") || member.role.includes("Chairman") ? 'Demote' : 'Promote'}
                              </button>
                              <button className="action-btn remove">Remove</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Join Requests Panel */}
              <div className="panel join-requests-panel">
                <div className="panel-header">
                  <h3><FaUserPlus className="panel-icon" /> ACSS Join Requests</h3>
                </div>
                <div className="panel-content">
                  {/* Display acceptance status message */}
                  {acceptanceStatus.message && (
                    <div 
                      className={`status-message ${acceptanceStatus.isError ? 'error' : 'success'}`}
                      style={{
                        padding: '10px',
                        margin: '0 0 15px 0',
                        borderRadius: '5px',
                        backgroundColor: acceptanceStatus.isError ? '#ffebee' : '#e8f5e9',
                        color: acceptanceStatus.isError ? '#c62828' : '#2e7d32',
                        border: `1px solid ${acceptanceStatus.isError ? '#ef9a9a' : '#a5d6a7'}`
                      }}
                    >
                      {acceptanceStatus.message}
                    </div>
                  )}
                  
                  {joinRequests.length === 0 ? (
                    <div className="no-requests-message">
                      <p>No pending join requests at this time.</p>
                    </div>
                  ) : (
                    <div className="join-requests-list">
                      {joinRequests.map(req => (
                        <div key={req.user_id} className="join-request-item">
                          <div className="request-info">
                            {/* <h4>{req.name}</h4> */}
                            <p>{req.email}</p>
                            <p className="request-date">Requested on: {req.date}</p>
                          </div>
                          <div className="request-actions">
                            <button 
                              className="action-btn accept"
                              onClick={() => handleAcceptRequest(req.user_id)}
                              disabled={req.isLoading}
                            >
                              {req.isLoading ? 'Processing...' : 'Accept'}
                            </button>
                            <button 
                              className="action-btn decline"
                              onClick={() => handleDeclineRequest(req.user_id)}
                              disabled={req.isLoading}
                            >
                              {req.isLoading ? 'Processing...' : 'Decline'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Acss = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AcssContent />} />
        {/* You might want to add a dedicated route for the AI assistant */}
        {/* <Route path="/ai-assistant" element={<AiAssistant />} /> */}
      </Routes>
    </Router>
  );
};

export default Acss;