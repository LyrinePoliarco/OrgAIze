import React, { useState } from 'react';
import AcssOrgChart from './AcssOrgChart';
import './Acss.css';

// Placeholder icons (replace with actual imports later)
import { 
  FaHome, 
  FaFile, 
  FaBullhorn, 
  FaBirthdayCake, 
  FaLink, 
  FaSitemap, 
  FaCloudUploadAlt, 
  FaRobot, 
  FaDownload
} from 'react-icons/fa';

const AcssStudent = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('home');
  
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
  
  // Function to handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
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
        </div>
        
        <div className="user-info">
          <img src="/image/logo.png" alt="User" className="user-avatar" />
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
            <button className="header-btn">Logout</button>
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
                    <img src="/image/org.png" alt="Organization" className="org-image" />
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
                      <button className="chat-btn">Start Chat</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcssStudent;