import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AcssOrgChart from './AcssOrgChart';
import './Acss.css';
import supabase from '../../lib/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';

// Icons
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
  FaUsersCog,
  FaEdit, 
  FaSave, 
  FaBold, 
  FaItalic, 
  FaUnderline, 
  FaAlignLeft, 
  FaAlignCenter, 
  FaAlignRight 
} from 'react-icons/fa';

const AcssContent = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('home');
  const [organizationId, setOrganizationId] = useState(null);
  
  // State for user data
  const [userData, setUserData] = useState({});
  
  // State for AI error
  const [aiError, setAiError] = useState(null);
  
  // Organization content states
  const [orgDescription, setOrgDescription] = useState("");
  const [orgImageUrl, setOrgImageUrl] = useState("/image/org.png");
  const [announcement, setAnnouncement] = useState("");
  const [editingDescription, setEditingDescription] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Rich text editor states
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderlined, setIsUnderlined] = useState(false);
  const [textAlign, setTextAlign] = useState('left');

  // Data states
  const [birthdayCelebrants, setBirthdayCelebrants] = useState([]);
  const [meetingLinks, setMeetingLinks] = useState([]);
  const [files, setFiles] = useState([]);
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
  
  // Join Requests state
  const [joinRequests, setJoinRequests] = useState([]);
  const [acceptanceStatus, setAcceptanceStatus] = useState({
    id: null,
    message: '',
    isError: false
  });

  // Editing states
  const [editingCelebrants, setEditingCelebrants] = useState(false);
  const [editingMeetings, setEditingMeetings] = useState(false);
  const [isEditingCelebrants, setIsEditingCelebrants] = useState({});

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

    const fetchUserOrgId = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Auth error:", userError.message);
        return;
      }

      const { data: userData, error } = await supabase
        .from("users")
        .select("organization_id")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Failed to fetch user organization:", error.message);
      } else {
        setOrganizationId(userData.organization_id);
      }
    };

    fetchUserOrgId();
  }, []);

  // Fetch organization details
  useEffect(() => {
    if (!organizationId) return;

    const fetchOrgDetails = async () => {
      const { data, error } = await supabase
        .from('organization_details')
        .select('*')
        .eq("organization_id", organizationId)
        .single();

      if (data) {
        setOrgDescription(data.description || "");
        setAnnouncement(data.announcement || "");
        if (data.image_url) {
          setOrgImageUrl(data.image_url);
        }
        
         try {
          // Ensure meeting_links is always an array
          const links = data.meeting_links ? 
            (Array.isArray(data.meeting_links) ? data.meeting_links : JSON.parse(data.meeting_links)) : [];
          setMeetingLinks(links);
        } catch (e) {
          console.error("Invalid JSON in meeting_links", e);
          setMeetingLinks([]);
        }
      } else {
        console.error("Org details fetch error:", error?.message);
      }
    };

    fetchOrgDetails();
  }, [organizationId]);

  // Fetch files and birthday celebrants
  useEffect(() => {
    if (!organizationId) return;

    const fetchFiles = async () => {
      const { data, error } = await supabase
        .from("files")
        .select("id, file_name, file_url, uploaded_by, is_hidden, uploaded_at")
        .eq("organization_id", organizationId)
        .order("uploaded_at", { ascending: false });

      if (data) {
        const formatted = data.map(file => ({
          id: file.id,
          name: file.file_name,
          size: "N/A",
          uploadedBy: file.uploaded_by || "Unknown",
          date: new Date(file.uploaded_at).toLocaleDateString(),
          isHidden: file.is_hidden
        }));
        setFiles(formatted);
      } else {
        console.error("File fetch error:", error?.message);
      }
    };

    const fetchBirthdayCelebrants = async () => {
      const { data, error } = await supabase
        .from('organization_details')
        .select('birthday_celebrants')
        .eq('organization_id', organizationId)
        .single();

      if (error) {
        console.error('Error fetching birthday celebrants:', error.message);
        return;
      }

      setBirthdayCelebrants(data?.birthday_celebrants || []);
    };

    fetchFiles();
    fetchBirthdayCelebrants();
  }, [organizationId]);

  // Fetch join requests from Supabase
  useEffect(() => {
    const fetchJoinRequests = async () => {
      try {
        const { data, error } = await supabase
          .from('student_roles')
          .select('*')
          .eq('confirm', false);
        
        if (error) {
          throw error;
        }
        
        if (data) {
          const formattedRequests = data.map(request => ({
            id: request.id,
            user_id: request.user_id,
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

  // Organization description and announcement handlers
  // Fixed handleSaveDescription function
  const handleSaveDescription = async () => {
  if (!organizationId) {
    console.error("No organization ID set");
    return;
  }
  setIsUploading(true);
  
  try {
    const { error } = await supabase
      .from("organization_details")
      .update({ 
        description: orgDescription,
        updated_at: new Date().toISOString()
      })
      .eq("organization_id", organizationId);
      
    if (error) {
      throw error;
    }

    const savedElement = document.getElementById('saved-feedback-desc');
    if (savedElement) {
      savedElement.style.opacity = 1;
      setTimeout(() => {
        savedElement.style.opacity = 0;
      }, 2000);
    }
  } catch (error) {
    console.error("Description update error:", error.message);
    alert(`Failed to save description: ${error.message}`);
  } finally {
    setIsUploading(false);
    setEditingDescription(false);
  }
};

const handleSaveAnnouncement = async () => {
  if (!organizationId) {
    console.error("No organization ID set");
    return;
  }

  setIsUploading(true);
  
  try {
    const { error } = await supabase
      .from("organization_details")
      .update({ 
        announcement: announcement,
        updated_at: new Date().toISOString()
      })
      .eq("organization_id", organizationId);
      
    if (error) {
      throw error;
    }

    const savedElement = document.getElementById('saved-feedback-announce');
    if (savedElement) {
      savedElement.style.opacity = 1;
      setTimeout(() => {
        savedElement.style.opacity = 0;
      }, 2000);
    }
  } catch (error) {
    console.error("Announcement update error:", error.message);
    alert("Failed to save announcement. Please try again.");
  } finally {
    setIsUploading(false);
    setEditingAnnouncement(false);
  }
};

  // Image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `org-${organizationId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `organizations/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('organization_images')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      alert("Failed to upload image. Please try again.");
      setIsUploading(false);
      return;
    }
    
    const { data: urlData } = supabase.storage
      .from('organization_images')
      .getPublicUrl(filePath);
      
    if (urlData) {
      const imageUrl = urlData.publicUrl;
      
      const { error: updateError } = await supabase
        .from('organization_details')
        .update({ 
          image_url: imageUrl,
          updated_at: new Date()
        })
        .eq('organization_id', organizationId);
        
      if (updateError) {
        console.error('Error updating organization with image URL:', updateError);
      } else {
        setOrgImageUrl(imageUrl);
      }
    }
    
    setIsUploading(false);
  };
  
//
  // Rich text editor functions
  const toggleBold = () => setIsBold(!isBold);
  const toggleItalic = () => setIsItalic(!isItalic);
  const toggleUnderline = () => setIsUnderlined(!isUnderlined);
  const setAlign = (alignment) => setTextAlign(alignment);

  const formatSelectedText = (formatType) => {
    const textarea = document.getElementById('announcement-textarea');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = announcement.substring(start, end);
    
    let prefix = '';
    let suffix = '';
    
    switch(formatType) {
      case 'bold':
        prefix = '<strong>';
        suffix = '</strong>';
        break;
      case 'italic':
        prefix = '<em>';
        suffix = '</em>';
        break;
      case 'underline':
        prefix = '<u>';
        suffix = '</u>';
        break;
      default:
        break;
    }
    
    const newText = 
      announcement.substring(0, start) + 
      prefix + selectedText + suffix + 
      announcement.substring(end);
    
    setAnnouncement(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  // Birthday celebrants handlers
  const addBirthdayCelebrant = () => {
    const newCelebrant = { id: uuidv4(), name: '', birthday: '' };
    setBirthdayCelebrants(prev => [...prev, newCelebrant]);
    setIsEditingCelebrants(prev => ({ ...prev, [newCelebrant.id]: true }));
  };

  const updateCelebrant = (id, updatedField, value) => {
    setBirthdayCelebrants(prev =>
      prev.map(c =>
        c.id === id ? { ...c, [updatedField]: value } : c
      )
    );
  };

  const saveBirthdayCelebrant = async (id) => {
    const updated = birthdayCelebrants.find(c => c.id === id);
    const newList = birthdayCelebrants.map(c =>
      c.id === id ? updated : c
    );

    const { error } = await supabase
      .from('organization_details')
      .update({ birthday_celebrants: newList })
      .eq('organization_id', organizationId);

    if (error) {
      console.error('Error saving celebrant:', error.message);
    } else {
      setIsEditingCelebrants(prev => ({ ...prev, [id]: false }));
    }
  };

  const saveAllBirthdayCelebrants = async () => {
    const { error } = await supabase
      .from('organization_details')
      .update({ birthday_celebrants: birthdayCelebrants })
      .eq('organization_id', organizationId);

    if (error) {
      console.error('Error saving celebrants:', error.message);
      alert("Failed to save birthday celebrants.");
    } else {
      alert("Birthday celebrants saved!");
      setEditingCelebrants(false);
    }
  };

  const deleteBirthdayCelebrant = async (id) => {
    const newList = birthdayCelebrants.filter(c => c.id !== id);

    const { error } = await supabase
      .from('organization_details')
      .update({ birthday_celebrants: newList })
      .eq('organization_id', organizationId);

    if (error) {
      console.error('Error deleting celebrant:', error.message);
    } else {
      setBirthdayCelebrants(newList);
      const updatedEditingState = { ...isEditingCelebrants };
      delete updatedEditingState[id];
      setIsEditingCelebrants(updatedEditingState);
    }
  };

  // Meeting links handlers
  const handleSaveMeetingLinks = async () => {
    setIsUploading(true);
    const { error } = await supabase
      .from("organization_details")
      .update({ 
        meeting_links: meetingLinks, 
        updated_at: new Date() 
      })
      .eq("organization_id", organizationId);

    if (error) {
      console.error("Meeting links update error:", error.message);
      alert("Failed to save meeting links. Please try again.");
    } else {
      alert("Meeting links saved!");
    }

    setEditingMeetings(false);
    setIsUploading(false);
  };

  const handleMeetingLinkChange = (index, key, value) => {
    const updated = [...meetingLinks];
    updated[index][key] = value;
    setMeetingLinks(updated);
  };

  const handleAddMeetingLink = () => {
    setMeetingLinks([...meetingLinks, { name: "", url: "" }]);
  };

  const handleRemoveMeetingLink = (index) => {
    const updated = [...meetingLinks];
    updated.splice(index, 1);
    setMeetingLinks(updated);
  };

  // Join request handlers
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
      setJoinRequests(requests => 
        requests.map(req => 
          req.user_id === requestId ? { ...req, isLoading: true } : req
        )
      );

      const request = joinRequests.find(req => req.user_id === requestId);
      if (!request) {
        throw new Error('Request not found');
      }

      const { data, error } = await supabase
        .from('student_roles')
        .update({ confirm: true })
        .eq('user_id', requestId)
        .eq('email', request.email)
        .select();

      if (error) {
        throw error;
      }

      console.log('Request accepted successfully:', data);
      setJoinRequests(requests => requests.filter(req => req.user_id !== requestId));

      setAcceptanceStatus({
        id: requestId,
        message: `${request.name} has been successfully accepted into ACSS!`,
        isError: false
      });

      setTimeout(() => {
        setAcceptanceStatus({ id: null, message: '', isError: false });
      }, 3000);

    } catch (error) {
      console.error('Error accepting request:', error);
      setJoinRequests(requests => 
        requests.map(req => 
          req.user_id === requestId ? { ...req, isLoading: false } : req
        )
      );

      const request = joinRequests.find(req => req.user_id === requestId);
      setAcceptanceStatus({
        id: requestId,
        message: `Failed to accept ${request?.name || 'member'}: ${error.message}`,
        isError: true
      });

      setTimeout(() => {
        setAcceptanceStatus({ id: null, message: '', isError: false });
      }, 3000);
    }
  };

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
      setJoinRequests(requests => 
        requests.map(req => 
          req.user_id === requestId ? { ...req, isLoading: true } : req
        )
      );

      const request = joinRequests.find(req => req.user_id === requestId);
      if (!request) {
        throw new Error('Request not found');
      }

      const { error } = await supabase
        .from('student_roles')
        .delete()
        .eq('user_id', requestId);

      if (error) {
        throw error;
      }

      console.log('Request declined successfully');
      setJoinRequests(requests => requests.filter(req => req.user_id !== requestId));

      setAcceptanceStatus({
        id: requestId,
        message: `${request.name}'s request has been declined.`,
        isError: false
      });

      setTimeout(() => {
        setAcceptanceStatus({ id: null, message: '', isError: false });
      }, 3000);

    } catch (error) {
      console.error('Error declining request:', error);
      setJoinRequests(requests => 
        requests.map(req => 
          req.user_id === requestId ? { ...req, isLoading: false } : req
        )
      );

      const request = joinRequests.find(req => req.user_id === requestId);
      setAcceptanceStatus({
        id: requestId,
        message: `Failed to decline ${request?.name || 'member'}: ${error.message}`,
        isError: true
      });

      setTimeout(() => {
        setAcceptanceStatus({ id: null, message: '', isError: false });
      }, 3000);
    }
  };

  // AI app launcher
  const launchReactAiApp = () => {
    try {
      document.body.classList.add('hide-content');
      const storedUserData = localStorage.getItem('userData');
      if (!storedUserData) {
        throw new Error('No user data found');
      }

      const script = document.createElement('script');
      script.type = 'module';
      script.src = '/src/ai/Ai-layout.jsx';
      document.body.appendChild(script);
      console.log('AI React app launched');
    } catch (error) {
      console.error('Error launching AI app:', error);
      setAiError('Could not launch AI assistant');
    }
  };

  // Tab handler
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setAiError(null);
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during Supabase signout:", error);
      } else {
        console.log("Successfully signed out of Supabase");
      }
      
      localStorage.removeItem('userData');
      console.log("User data removed from localStorage");
      window.location.href = '/';
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.removeItem('userData');
      window.location.href = '/';
    }
  };

  if (!organizationId) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

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
    <div className="panel-actions">
      {!editingDescription ? (
        <button className="edit-btn" onClick={() => setEditingDescription(true)}>
          <FaEdit /> Edit
        </button>
      ) : (
        <div className="save-container">
          <button 
            className={`save-btn ${isUploading ? 'loading' : ''}`} 
            onClick={handleSaveDescription}
            disabled={isUploading}
          >
            {isUploading ? 'Saving...' : (<><FaSave /> Save</>)}
          </button>
          <span id="saved-feedback-desc" className="saved-feedback">Saved!</span>
        </div>
      )}
    </div>
  </div>
  <div className="panel-content org-description">
    <div className="org-image-container">
      <img src={orgImageUrl} alt="Organization" className="org-image" />
      {editingDescription && (
        <div className="image-upload-overlay">
          <label htmlFor="org-image-upload" className="image-upload-label">
            <FaCloudUploadAlt /> Change Image
          </label>
          <input 
            type="file" 
            id="org-image-upload" 
            accept="image/*" 
            onChange={handleImageUpload}
            disabled={isUploading}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </div>
    {editingDescription && (
      <div className="rich-text-toolbar">
        <button 
          className={`toolbar-btn ${isBold ? 'active' : ''}`} 
          onClick={() => formatSelectedText('bold')}
          title="Bold"
        >
          <FaBold />
        </button>
        <button 
          className={`toolbar-btn ${isItalic ? 'active' : ''}`} 
          onClick={() => formatSelectedText('italic')}
          title="Italic"
        >
          <FaItalic />
        </button>
        <button 
          className={`toolbar-btn ${isUnderlined ? 'active' : ''}`} 
          onClick={() => formatSelectedText('underline')}
          title="Underline"
        >
          <FaUnderline />
        </button>
        <div className="toolbar-divider"></div>
        <button 
          className={`toolbar-btn ${textAlign === 'left' ? 'active' : ''}`}
          onClick={() => setAlign('left')}
          title="Align Left"
        >
          <FaAlignLeft />
        </button>
        <button 
          className={`toolbar-btn ${textAlign === 'center' ? 'active' : ''}`}
          onClick={() => setAlign('center')}
          title="Align Center"
        >
          <FaAlignCenter />
        </button>
        <button 
          className={`toolbar-btn ${textAlign === 'right' ? 'active' : ''}`}
          onClick={() => setAlign('right')}
          title="Align Right"
        >
          <FaAlignRight />
        </button>
      </div>
    )}
    {editingDescription ? (
      <textarea
        id="description-textarea"
        value={orgDescription}
        onChange={(e) => setOrgDescription(e.target.value)}
        className={`editable-textarea ${editingDescription ? 'active' : ''}`}
        style={{ textAlign }}
        placeholder="Enter your organization description here..."
      />
    ) : (
      <div 
        className="description-display"
        dangerouslySetInnerHTML={{ __html: orgDescription }}
      />
    )}
  </div>
</div>
              
              {/* Announcement Panel */}
              <div className="panel">
                <div className="panel-header">
                  <h3><FaBullhorn className="panel-icon" /> Announcement</h3>
                  <div className="panel-actions">
                    {!editingAnnouncement ? (
                      <button className="edit-btn" onClick={() => setEditingAnnouncement(true)}>
                        <FaEdit /> Edit
                      </button>
                    ) : (
                      <div className="save-container">
                        <button 
                          className={`save-btn ${isUploading ? 'loading' : ''}`} 
                          onClick={handleSaveAnnouncement}
                          disabled={isUploading}
                        >
                          {isUploading ? 'Saving...' : (<><FaSave /> Save</>)}
                        </button>
                        <span id="saved-feedback-announce" className="saved-feedback">Saved!</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="panel-content">
                  {editingAnnouncement && (
                    <div className="rich-text-toolbar">
                      <button 
                        className={`toolbar-btn ${isBold ? 'active' : ''}`} 
                        onClick={() => formatSelectedText('bold')}
                        title="Bold"
                      >
                        <FaBold />
                      </button>
                      <button 
                        className={`toolbar-btn ${isItalic ? 'active' : ''}`} 
                        onClick={() => formatSelectedText('italic')}
                        title="Italic"
                      >
                        <FaItalic />
                      </button>
                      <button 
                        className={`toolbar-btn ${isUnderlined ? 'active' : ''}`} 
                        onClick={() => formatSelectedText('underline')}
                        title="Underline"
                      >
                        <FaUnderline />
                      </button>
                      <div className="toolbar-divider"></div>
                      <button 
                        className={`toolbar-btn ${textAlign === 'left' ? 'active' : ''}`}
                        onClick={() => setAlign('left')}
                        title="Align Left"
                      >
                        <FaAlignLeft />
                      </button>
                      <button 
                        className={`toolbar-btn ${textAlign === 'center' ? 'active' : ''}`}
                        onClick={() => setAlign('center')}
                        title="Align Center"
                      >
                        <FaAlignCenter />
                      </button>
                      <button 
                        className={`toolbar-btn ${textAlign === 'right' ? 'active' : ''}`}
                        onClick={() => setAlign('right')}
                        title="Align Right"
                      >
                        <FaAlignRight />
                      </button>
                    </div>
                  )}
                  
                  {editingAnnouncement ? (
                    <textarea
                      id="announcement-textarea"
                      value={announcement}
                      onChange={(e) => setAnnouncement(e.target.value)}
                      className={`editable-textarea ${editingAnnouncement ? 'active' : ''}`}
                      style={{ textAlign }}
                      placeholder="Enter your announcement here..."
                    />
                  ) : (
                    <div 
                      className="announcement-display"
                      dangerouslySetInnerHTML={{ __html: announcement }}
                    />
                  )}
                </div>
              </div>
              
              {/* Birthday Greetings Panel */}
              <div className="panel">
                <div className="panel-header">
                  <h3><FaBirthdayCake className="panel-icon" /> Birthday Greetings</h3>
                  <button className="edit-btn" onClick={() => {
                    if (editingCelebrants) {
                      saveAllBirthdayCelebrants();
                    } else {
                      setEditingCelebrants(true);
                    }
                  }}>
                    {editingCelebrants ? (<><FaSave /> Save Changes</>) : (<><FaEdit /> Edit</>)}
                  </button>
                </div>
                <div className="panel-content">
                  {birthdayCelebrants.length === 0 && <p>No birthday celebrants added yet.</p>}
                  {birthdayCelebrants.map((celebrant, index) => (
                    <div key={celebrant.id} className="celebrant-card">
                      {editingCelebrants ? (
                        <>
                          <input
                            type="text"
                            value={celebrant.name}
                            onChange={(e) => updateCelebrant(celebrant.id, "name", e.target.value)}
                            placeholder="Name"
                          />
                          <input
                            type="date"
                            value={celebrant.birthday}
                            onChange={(e) => updateCelebrant(celebrant.id, "birthday", e.target.value)}
                          />
                          <button 
                            className="action-btn delete" 
                            onClick={() => deleteBirthdayCelebrant(celebrant.id)}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <img src="/image/user.png" alt={celebrant.name} className="celebrant-img" />
                          <div className="celebrant-info">
                            <h4>{celebrant.name}</h4>
                            <p>{new Date(celebrant.birthday).toLocaleDateString()}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {editingCelebrants && (
                    <button onClick={addBirthdayCelebrant} className="add-celebrant-btn">
                      <FaUserPlus /> Add Celebrant
                    </button>
                  )}
                </div>
              </div>
              
              {/* Meeting Links Panel */}
<div className="panel">
  <div className="panel-header">
    <h3><FaLink className="panel-icon" /> Meeting Links</h3>
    <div className="panel-actions">
      {!editingMeetings ? (
        <button className="edit-btn" onClick={() => setEditingMeetings(true)}>
          <FaEdit /> Edit
        </button>
      ) : (
        <div className="save-container">
          <button 
            className={`save-btn ${isUploading ? 'loading' : ''}`} 
            onClick={handleSaveMeetingLinks}
            disabled={isUploading}
          >
            {isUploading ? 'Saving...' : (<><FaSave /> Save</>)}
          </button>
        </div>
      )}
    </div>
  </div>
  <div className="panel-content">
    {meetingLinks.map((link, index) => (
      <div key={index} className="meeting-link-item">
        {editingMeetings ? (
          <div className="meeting-link-edit">
            <input
              type="text"
              value={link.name}
              placeholder="Meeting Name"
              onChange={(e) => handleMeetingLinkChange(index, 'name', e.target.value)}
              className="meeting-link-input"
            />
            <input
              type="text"
              value={link.url}
              placeholder="Meeting URL"
              onChange={(e) => handleMeetingLinkChange(index, 'url', e.target.value)}
              className="meeting-link-input"
            />
            <button 
              className="action-btn delete"
              onClick={() => handleRemoveMeetingLink(index)}
            >
              Delete
            </button>
          </div>
        ) : (
          <div className="meeting-link-info">
            <h4>{link.name}</h4>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="meeting-link-url">
              {link.url}
            </a>
          </div>
        )}
      </div>
    ))}
    {editingMeetings && (
      <button onClick={handleAddMeetingLink} className="add-link-btn">
        <FaLink /> Add Meeting Link
      </button>
    )}
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

//FETCHING DESCRIPTION ANNOUNCEMENT BIRTHDAY CELEBRANTS AND MEETING LINKS