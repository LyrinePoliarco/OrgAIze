import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "./Student.css";
import supabase from '../../lib/supabaseClient.js';

const StudentContent = () => {
  // Existing states
  const [pendingMemberships, setPendingMemberships] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [userData, setUserData] = useState(null);



  // Existing useEffect for loading user data
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        console.log("User data loaded:", parsedUserData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      console.warn("No user data found, redirecting to login...");
      window.location.href = '/';
    }
  }, []);

  // Sample organization data
  const organizations = [
    {
      id: 1,
      name: "ACSS",
      fullName: "Association of Computer Science Students",
      description: "A community for passionate computer science students to collaborate, share knowledge, and grow together in the tech industry.",
      longDescription: "The Association of Computer Science Students (ACSS) is a premier organization dedicated to fostering academic excellence and professional growth among computer science enthusiasts. We organize coding competitions, tech talks by industry leaders, collaborative projects, and networking events that connect students with potential employers. Our members gain exclusive access to workshops, internship opportunities, and a supportive community that enhances their technical skills and career prospects.",
      imgUrl: "/acss.PNG", // These would be replaced with actual image paths
      color: "#4f46e5", // Indigo
    },
    {
      id: 2,
      name: "CSSC",
      fullName: "Computer Studies Student Council",
      description: "Representing and advocating for the academic and extracurricular interests of all students within the College of Informatics and Computing.",
      longDescription: "The Computer Studies Student Council (CSSC) serves as the official student representative body for the College of Informatics and Computing. We bridge the gap between faculty and students, ensuring that student concerns are heard and addressed. Our initiatives include curriculum feedback sessions, academic support programs, career fairs, and social events that create a sense of community within the college. We work tirelessly to improve the academic environment and enhance the overall college experience for all computing students.",
      imgUrl: "/cssc.PNG",
      color: "#0891b2", // Cyan
    },
    {
      id: 3,
      name: "LINKS",
      fullName: "League of Information and Knowledge Specialists",
      description: "Connecting information technology enthusiasts through professional development, networking, and innovative tech projects.",
      longDescription: "The League of Information and Knowledge Specialists (LINKS) brings together students passionate about various IT disciplines. We focus on bridging theoretical knowledge with practical skills through hands-on projects, industry certifications, and professional development workshops. Our organization maintains strong ties with alumni and industry partners, providing members with mentorship opportunities and insights into current industry trends and practices. LINKS members collaborate on real-world projects that enhance their portfolios and prepare them for successful careers in technology.",
      imgUrl: "/links.PNG",
      color: "#ca8a04", // Yellow
    },
    {
      id: 4,
      name: "META",
      fullName: "Multimedia and Entertainment Technology Alliance",
      description: "Bringing together creative minds interested in digital media, game development, VR/AR, and interactive entertainment.",
      longDescription: "The Multimedia and Entertainment Technology Alliance (META) is where technology meets creativity. Our organization caters to students interested in game development, animation, digital art, VR/AR, and interactive media. We host game jams, animation festivals, portfolio development workshops, and collaborative projects with industry partners. Members get hands-on experience with cutting-edge tools and technologies while developing their creative vision. META provides a supportive community where artistic and technical skills flourish, preparing members for careers in the dynamic digital entertainment industry.",
      imgUrl: "/meta.PNG",
      color: "#be185d", // Pink
    },
    {
      id: 5,
      name: "SITES",
      fullName: "Society for Information Technology and Engineering Students",
      description: "Building bridges between technology and engineering disciplines to foster innovation and multidisciplinary collaboration.",
      longDescription: "The Society for Information Technology and Engineering Students (SITES) promotes interdisciplinary collaboration between computing and engineering fields. We organize hackathons, design challenges, robotics competitions, and industry site visits that expose members to diverse technological applications. Our projects often involve IoT, embedded systems, automation, and sustainable technology solutions. SITES members develop versatile skill sets that combine software and hardware expertise, preparing them for the increasingly interconnected tech landscape where multidisciplinary approaches drive innovation.",
      imgUrl: "/sites.PNG",
      color: "#15803d", // Green
    },
  ];

  // Function to handle membership requests
  const handleMembershipRequest = (orgId) => {
    if (!pendingMemberships.includes(orgId)) {
      setPendingMemberships([...pendingMemberships, orgId]);
    }
  };

  // Function to open modal
  const openOrgModal = (org) => {
    setSelectedOrg(org);
  };

  // Function to close modal
  const closeOrgModal = () => {
    setSelectedOrg(null);
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

 

  // Function to handle logout
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
return (
  <div className="dashboard-container">
    {/* Header with User Info */}
    {userData && (
      <div className="user-header">
        <div className="user-welcome">
          <h1>Hello, {userData.name}!</h1>
          {/* <p>{userData.email}</p> */}
        </div>
        <button
          onClick={launchReactAiApp} // 🔁 DIRECTLY LAUNCHES THE AI APP
          className="chat-with-orgaiize-button"
          style={{ marginLeft: 'auto' }}
        >
          Chat with OrgAIze
        </button>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    )}

      {/* Welcome Section */}
      <div className="welcome-section">
  
        {/* Background image behind the whole section */}
        <img 
          src="/welcome.PNG" 
          alt="Background" 
          className="welcome-bg-image" 
        />
  
        <div className="welcome-content">
          <h1>🎉 Welcome to NEU orgAIze! 🎓</h1>
          <p>
            Get ready to level up your student life at New Era University's College of Information and Computing Studies! 🚀<br /><br />
  
            <strong>NEU orgAIze</strong> is your all-in-one hub for everything related to student organizations. Stay updated with the latest <strong>events 📅, activities 🕹️ ,  announcements 📢, birthday celebrants 🍰,  and file management 📂</strong> — all in one place!<br /><br />
  
            Meet your organization's <strong>officers 🧑‍💼 and fellow members 🤝</strong>, explore what each group has to offer, and find your perfect fit. Whether you're into tech, arts, leadership, or community service, there's a place here for you! 💡💻🎭<br /><br />
  
            Don't miss out on the chance to <strong>connect, grow, and thrive</strong> — join a student organization today and make your NEU journey unforgettable! 🌟
          </p>
        </div>
  
        <div className="welcome-graphic">
          <div className="pulse-circle"></div>
          <img 
            src="/neubg.png" 
            alt="NEU ORGANIZE" 
            className="logo-image" 
          />
        </div>
        
      </div>
   
      {/* Organizations Section */}
      <div className="section-header">
      <h2>🔍 Explore CICS Student Organizations</h2>
      <p>Find your organization here! Get involved, stay inspired✨🤝</p>
      </div>

      <div className="organizations-grid">
        {organizations.map((org) => (
          <div 
            className="org-card clickable" 
            key={org.id}
            style={{ 
              "--org-color": org.color 
            }}
            onClick={() => openOrgModal(org)}
          >
            <div 
              className="org-image" 
              style={{ 
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${org.imgUrl})` 
              }}
            >
              <div className="org-badge">{org.name}</div>
            </div>
            <div className="org-content">
              <h3>{org.fullName}</h3>
              <p>{org.description}</p>
              <div className="card-footer">
                <span className="view-more">Click to view more</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* App Features Section */}
      <div className="app-features-section">
        <div className="section-header">
          <h2>🚀 NEU orgAIze App Features</h2>
          <p>Revolutionize your student organization experience</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon ai-icon"></div>
            <h3>🤖 AI Student Assistant</h3>
            <p>Need help writing letters, answering assignments, or generating ideas? Our built-in AI assistant works like ChatGPT — available 24/7 to support your academic and org tasks.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon file-icon"></div>
            <h3>📁 Smart File Management</h3>
            <p>Access and share organization documents, meeting minutes, and project files with our secure cloud storage system.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon updates-icon"></div>
            <h3>🔔 Real-time Activity Updates</h3>
            <p>Never miss an important announcement or event with personalized notifications and a comprehensive activity feed.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon repo-icon"></div>
            <h3>📚 Knowledge Repositories</h3>
            <p>Benefit from years of resources, tutorials, and guides created by organization alumni and current members.</p>
          </div>
        </div>

        <div className="app-cta">
          <h3>🌟 Transform Your University Experience Today</h3>
          <p>NEU orgAIze brings powerful tools and a vibrant community to help you thrive throughout your academic journey.</p>
          <button className="download-app-btn">Join Now!</button>
          
        </div>
      </div>
        
      {/* Recent Activity Section */}
      <div className="section-header">
        <h2>Recent Organization Activities</h2>
        <p>Stay updated with the latest events and announcements</p>
      </div>

      <div className="activity-timeline">
        <div className="timeline-item">
          <div className="timeline-date">May 8</div>
          <div className="timeline-content">
            <h4>ACSS Workshop: Introduction to AI</h4>
            <p>Learn the fundamentals of artificial intelligence with hands-on exercises.</p>
            <div className="timeline-tag">Workshop</div>
          </div>
        </div>
        <div className="timeline-item">
          <div className="timeline-date">May 7</div>
          <div className="timeline-content">
            <h4>CSSC General Assembly</h4>
            <p>Annual meeting to discuss upcoming initiatives and elect new representatives.</p>
            <div className="timeline-tag">Meeting</div>
          </div>
        </div>
        <div className="timeline-item">
          <div className="timeline-date">May 5</div>
          <div className="timeline-content">
            <h4>META Game Jam Results</h4>
            <p>Congratulations to Team Pixel for winning the 48-hour game development challenge!</p>
            <div className="timeline-tag">Announcement</div>
          </div>
        </div>
      </div>

      {/* Organization Modal */}
      {selectedOrg && (
        <div className="org-modal-overlay" onClick={closeOrgModal}>
          <div 
            className="org-modal" 
            style={{ "--modal-color": selectedOrg.color }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={closeOrgModal}>×</button>
            
            <div 
              className="modal-header" 
              style={{ 
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url(${selectedOrg.imgUrl})` 
              }}
            >
              <div className="modal-badge">{selectedOrg.name}</div>
              <h2>{selectedOrg.fullName}</h2>
            </div>
            
            <div className="modal-content">
              <div className="modal-description">
                <h3>About Us</h3>
                <p>{selectedOrg.longDescription}</p>
              </div>
              
              <div className="modal-activities">
                <h3>Upcoming Activities</h3>
                <ul className="activities-list">
                  <li>
                    <span className="activity-date">May 15</span>
                    <span className="activity-name">General Assembly</span>
                  </li>
                  <li>
                    <span className="activity-date">May 22</span>
                    <span className="activity-name">Workshop Series</span>
                  </li>
                  <li>
                    <span className="activity-date">June 5</span>
                    <span className="activity-name">Industry Talk</span>
                  </li>
                </ul>
              </div>
              
              <div className="modal-contact">
                <h3>Contact</h3>
                <p>Email: {selectedOrg.name.toLowerCase()}@neu.edu.ph</p>
                <p>Office: Building {Math.floor(Math.random() * 5) + 1}, Room {Math.floor(Math.random() * 100) + 100}</p>
                <p>Faculty Advisor: Dr. {["Smith", "Johnson", "Williams", "Garcia", "Martinez"][Math.floor(Math.random() * 5)]}</p>
              </div>
              
              <div className="modal-actions">
                <button 
                  className={`membership-button ${pendingMemberships.includes(selectedOrg.id) ? 'pending' : ''}`}
                  onClick={() => handleMembershipRequest(selectedOrg.id)}
                  disabled={pendingMemberships.includes(selectedOrg.id)}
                >
                  {pendingMemberships.includes(selectedOrg.id) ? 'Pending Approval' : 'Request Membership'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Student = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentContent />} />
        {/* <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </Router>
  );
};

export default Student;