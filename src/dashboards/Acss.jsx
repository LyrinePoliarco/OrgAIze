import React, { useState, useEffect } from "react";
import AcssOrgChart from './AcssOrgChart';
import './Acss.css';
import { FaHome, FaFile, FaUsers, FaBullhorn, FaBirthdayCake, FaLink, FaSitemap, 
  FaCloudUploadAlt, FaRobot, FaUserPlus, FaUsersCog, FaEdit, FaSave, 
  FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaAlignLeft, FaAlignCenter, FaAlignRight } from 'react-icons/fa';
import supabase from '../../lib/supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';



//State Declaration of Supabase
const Acss = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [organizationId, setOrganizationId] = useState(null);

  const [orgDescription, setOrgDescription] = useState("");
  const [orgImageUrl, setOrgImageUrl] = useState("/image/org1.png");
  const [announcement, setAnnouncement] = useState("");
  const [files, setFiles] = useState([]);

  const [editingDescription, setEditingDescription] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [birthdayCelebrants, setBirthdayCelebrants] = useState([]);
  const [meetingLinks, setMeetingLinks] = useState([]);

  // Rich text editor states
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderlined, setIsUnderlined] = useState(false);
  const [textAlign, setTextAlign] = useState('left');

  const [editingCelebrants, setEditingCelebrants] = useState(false);
  const [editingMeetings, setEditingMeetings] = useState(false);

  const [isEditingCelebrants, setIsEditingCelebrants] = useState({});


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



const handleCelebrantChange = (index, key, value) => {
  const updated = [...birthdayCelebrants];
  updated[index][key] = value;
  setBirthdayCelebrants(updated);
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


  useEffect(() => {
    const fetchUserOrgId = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

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
          setMeetingLinks(data.meeting_links || []);
        } catch (e) {
          console.error("Invalid JSON in meeting_links", e);
        }
      } else {
        console.error("Org details fetch error:", error?.message);
      }
    };

    fetchOrgDetails();
  }, [organizationId]);

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

    // Fetch birthday celebrants
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

  const handleTabChange = (tab) => setActiveTab(tab);

  const handleSaveDescription = async () => {
    setIsUploading(true);
    
    const { error } = await supabase
      .from("organization_details")
      .update({ 
        description: orgDescription,
        updated_at: new Date()
      })
      .eq("organization_id", organizationId);
      
    if (error) {
      console.error("Description update error:", error.message);
      alert("Failed to save description. Please try again.");
    } else {
      // Success feedback
      const savedElement = document.getElementById('saved-feedback-desc');
      if (savedElement) {
        savedElement.style.opacity = 1;
        setTimeout(() => {
          savedElement.style.opacity = 0;
        }, 2000);
      }
    }
    
    setIsUploading(false);
    setEditingDescription(false);
  };

  const handleSaveAnnouncement = async () => {
    setIsUploading(true);
    
    const { error } = await supabase
      .from("organization_details")
      .update({ 
        announcement: announcement,
        updated_at: new Date()
      })
      .eq("organization_id", organizationId);
      
    if (error) {
      console.error("Announcement update error:", error.message);
      alert("Failed to save announcement. Please try again.");
    } else {
      // Success feedback
      const savedElement = document.getElementById('saved-feedback-announce');
      if (savedElement) {
        savedElement.style.opacity = 1;
        setTimeout(() => {
          savedElement.style.opacity = 0;
        }, 2000);
      }
    }
    
    setIsUploading(false);
    setEditingAnnouncement(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `org-${organizationId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `organizations/${fileName}`;
    
    // Upload image to Storage
    const { error: uploadError } = await supabase.storage
      .from('organization_images')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      alert("Failed to upload image. Please try again.");
      setIsUploading(false);
      return;
    }
    
    // Get public URL for the uploaded image
    const { data: urlData } = supabase.storage
      .from('organization_images')
      .getPublicUrl(filePath);
      
    if (urlData) {
      const imageUrl = urlData.publicUrl;
      
      // Update the organization_details with the new image URL
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

  // Rich text editor functions
  const toggleBold = () => setIsBold(!isBold);
  const toggleItalic = () => setIsItalic(!isItalic);
  const toggleUnderline = () => setIsUnderlined(!isUnderlined);
  const setAlign = (alignment) => setTextAlign(alignment);

  // Function to apply formatting to selected text
  const formatSelectedText = (formatType) => {
    const textarea = document.getElementById('announcement-textarea');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = announcement.substring(start, end);
    
    let formattedText = selectedText;
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
    
    // Restore focus and selection after state update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
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
      <div className="sidebar">
        <div className="logo-container">
          <img src="/image/logo.png" alt="ACSS Logo" className="logo" />
          <h2>ACSS</h2>
        </div>
        <div className="nav-links">
          <button className={`nav-link ${activeTab === 'home' ? 'active' : ''}`} onClick={() => handleTabChange('home')}>
            <FaHome className="nav-icon" /><span>Home</span>
          </button>
          <button className={`nav-link ${activeTab === 'files' ? 'active' : ''}`} onClick={() => handleTabChange('files')}>
            <FaFile className="nav-icon" /><span>Files</span>
          </button>
          <button className={`nav-link ${activeTab === 'members' ? 'active' : ''}`} onClick={() => handleTabChange('members')}>
            <FaUsers className="nav-icon" /><span>Member Access</span>
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="header">
          <h1>ACSS Executive Dashboard</h1>
        </div>

        {activeTab === 'home' && (
          <div className="tab-content">
            <div className="panels-grid">
              <div className="panel">
                <div className="panel-header">
                  <h3><FaBullhorn /> Organization Description</h3>
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
                  <textarea
                    disabled={!editingDescription}
                    value={orgDescription}
                    onChange={(e) => setOrgDescription(e.target.value)}
                    className={`editable-textarea ${editingDescription ? 'active' : ''}`}
                    placeholder="Enter your organization description here..."
                  />
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <h3><FaBullhorn /> Announcement</h3>
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

              
              {/* Birthday Celebrants Panel */}
          <div className="panel">
       <div className="panel-header">
    <h3><FaBirthdayCake /> Birthday Celebrants</h3>
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
      <div key={celebrant.id} className="celebrant-item">
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
         <button onClick={() => deleteBirthdayCelebrant(celebrant.id)}>❌</button>
          </>
          ) : (
          <>
           <strong>{celebrant.name}</strong> - {new Date(celebrant.birthday).toLocaleDateString()}
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
    <h3><FaLink /> Meeting Links</h3>
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
          <>
            <input
              type="text"
              value={link.name}
              placeholder="Meeting Name"
              onChange={(e) => handleMeetingLinkChange(index, 'name', e.target.value)}
            />
            <input
              type="text"
              value={link.url}
              placeholder="Meeting URL"
              onChange={(e) => handleMeetingLinkChange(index, 'url', e.target.value)}
            />
            <button onClick={() => handleRemoveMeetingLink(index)}>Remove</button>
          </>
        ) : (
          <p><strong>{link.name}</strong>: <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a></p>
        )}
      </div>
    ))}
    {editingMeetings && (
      <button onClick={handleAddMeetingLink}>+ Add Meeting Link</button>
    )}
            </div>
          </div>


              <div className="panel org-chart-panel">
                <div className="panel-header"><h3><FaSitemap /> Organizational Chart</h3></div>
                <div className="panel-content"><AcssOrgChart /></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="tab-content">
            <div className="panel">
              <div className="panel-header">
                <h3><FaFile /> Files</h3>
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
                    </tr>
                  </thead>
                  <tbody>
                    {files.length > 0 ? (
                      files.map(file => (
                        <tr key={file.id}>
                          <td>{file.name}</td>
                          <td>{file.size}</td>
                          <td>{file.uploadedBy}</td>
                          <td>{file.date}</td>
                          <td><span className={`status ${file.isHidden ? 'hidden' : 'visible'}`}>
                            {file.isHidden ? 'Hidden' : 'Visible'}
                          </span></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="no-data">No files available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="tab-content">
            <h2>Member Access</h2>
            <p>Member management features coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Acss;