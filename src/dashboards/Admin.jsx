import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import './Admin.css';
import supabase from '../../lib/supabaseClient.js';

const Dashboard = ({ users }) => {
  const [roleStats, setRoleStats] = useState({});
  
  useEffect(() => {
    // Calculate role statistics
    const stats = users.reduce((acc, user) => {
      acc[user.roles] = (acc[user.roles] || 0) + 1;
      return acc;
    }, {});
    
    setRoleStats(stats);
  }, [users]);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      <div className="stats-container">
        <div className="stats-grid">
          {Object.entries(roleStats).map(([role, count]) => (
            <div key={role} className={`stat-card ${role}`}>
              <h3>{role}</h3>
              <div className="stat-count">{count}</div>
              <div className="stat-label">Users</div>
            </div>
          ))}
          
          <div className="stat-card total">
            <h3>Total</h3>
            <div className="stat-count">{users.length}</div>
            <div className="stat-label">Users</div>
          </div>
        </div>
      </div>
      
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-card">
          <p>Last login: {new Date().toLocaleString()}</p>
          <p>Total records: {users.length}</p>
          <p>Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

// Role Management Component (preserving original functionality)
const RoleManagement = ({ users, loading, error, editingUser, roleOptions, startEditing, cancelEditing, saveChanges }) => {
  if (loading) return <div className="admin-loading">Loading users...</div>;
  if (error) return <div className="admin-error">Error: {error}</div>;
  
  return (
    <div className="role-management-container">
      <h1>User Management</h1>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {editingUser && editingUser.id === user.id ? (
                    <select 
                      value={editingUser.roles}
                      onChange={(e) => editingUser.roles = e.target.value}
                    >
                      {roleOptions.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`role-badge ${user.roles}`}>{user.roles}</span>
                  )}
                </td>
                <td>{new Date(user.created_at).toLocaleString()}</td>
                <td>
                  {editingUser && editingUser.id === user.id ? (
                    <div className="button-group">
                      <button className="save-btn" onClick={saveChanges}>Save</button>
                      <button className="cancel-btn" onClick={cancelEditing}>Cancel</button>
                    </div>
                  ) : (
                    <button className="edit-btn" onClick={() => startEditing(user)}>Edit Role</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Admin Content Component
const AdminContent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [roleOptions] = useState(['executive', 'ACSS', 'user', 'admin']);
  const [currentUser, setCurrentUser] = useState(null);
  
  const location = useLocation();

  // Fetch users and current user from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get current user for authentication check
        const { data: authData, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          throw new Error('Authentication failed');
        }
        
        // Fetch user profile data for current user
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();
          
        if (profileError) {
          console.error('Failed to fetch user profile:', profileError);
        } else {
          setCurrentUser(profileData);
        }
        
        // Fetch all users
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*');
        
        if (fetchError) {
          throw new Error('Failed to fetch users');
        }
        
        setUsers(data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, roles: newRole } : user
    ));
  };

  const startEditing = (user) => {
    setEditingUser({ ...user });
  };

  const cancelEditing = () => {
    setEditingUser(null);
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

  const saveChanges = async () => {
    try {
      // Update user role directly in Supabase
      const { data, error: updateError } = await supabase
        .from('users')
        .update({ roles: editingUser.roles })
        .eq('id', editingUser.id)
        .select();
      
      if (updateError) {
        throw new Error('Failed to update user role');
      }

      // Update the local state with the edited user
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      setEditingUser(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="admin-loading">Loading users...</div>;
  if (error) return <div className="admin-error">Error: {error}</div>;

  return (
    <div className="admin-layout">
      {/* Header with logged-in user info */}
      <header className="admin-header">
        <div className="logo">Admin Panel</div>
        {currentUser && (
          <div className="user-info">
            <span className="user-name">{currentUser.name}</span>
            <span className="user-email">{currentUser.email}</span>
            <span className={`user-role role-badge ${currentUser.roles}`}>{currentUser.roles}</span>
          </div>
        )}
      </header>
      
      <div className="admin-main">
        {/* Sidebar Navigation */}
        <nav className="admin-sidebar">
          <ul>
            <li className={location.pathname === "/" ? "active" : ""}>
              <Link to="/">
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Dashboard
              </Link>
            </li>
            <li className={location.pathname === "/role-management" ? "active" : ""}>
              <Link to="/role-management">
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
                Role Management
              </Link>
            </li>
            
                  <li onClick={handleLogout} style={{ cursor: 'pointer' , marginTop: '40px' }}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </li>
          </ul>
        </nav>
        
        {/* Main Content Area */}
        <main className="admin-content">
          <Routes>
            <Route path="/" element={<Dashboard users={users} />} />
            <Route path="/role-management" element={
              <RoleManagement 
                users={users}
                loading={loading}
                error={error}
                editingUser={editingUser}
                roleOptions={roleOptions}
                startEditing={startEditing}
                cancelEditing={cancelEditing}
                saveChanges={saveChanges}
              />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const Admin = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<AdminContent />} />
      </Routes>
    </Router>
  );
};

export default Admin;