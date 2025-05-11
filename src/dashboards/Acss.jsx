import React, { useState } from 'react';
import AcssOrgChart from './AcssOrgChart';
import './Acss.css';

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

const Acss = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('home');
  
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
  
  // Mock data for join requests
  const [joinRequests] = useState([
    { id: 1, name: "Maria Santos", year: "2nd Year", section: "CS-201", reason: "I want to enhance my programming skills and network with fellow CS enthusiasts.", date: "May 8, 2025", imageUrl: "/image/aya.png" },
    { id: 2, name: "John Rivera", year: "1st Year", section: "CS-101", reason: "Looking forward to participating in technical workshops and hackathons.", date: "May 9, 2025", imageUrl: "/image/aya.png" },
    { id: 3, name: "Ana Reyes", year: "3rd Year", section: "CS-301", reason: "I want to contribute to the organization's events and activities.", date: "May 10, 2025", imageUrl: "/image/aya.png" }
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
            <p className="user-name">ACSS Vice Aliyah</p>
            <p className="user-role">ACSS Executive</p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1>ACSS Executive Dashboard</h1>
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
                      <button className="chat-btn">Start Chat</button>
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
                  {joinRequests.map(request => (
                    <div key={request.id} className="join-request-card">
                      <div className="request-header">
                        <div className="requestor-info">
                          <img src={request.imageUrl} alt={request.name} className="requestor-img" />
                          <div>
                            <h4>{request.name}</h4>
                            <p>{request.year} • {request.section}</p>
                          </div>
                        </div>
                        <span className="request-date">{request.date}</span>
                      </div>
                      
                      <div className="request-reason">
                        <p><strong>Reason for joining:</strong></p>
                        <p>{request.reason}</p>
                      </div>
                      
                      <div className="request-actions">
                        <button className="action-btn accept">Accept</button>
                        <button className="action-btn decline">Decline</button>
                        <button className="action-btn view-profile">View Profile</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Acss;