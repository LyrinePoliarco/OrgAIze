import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './Admin.css';
import supabase from '../../lib/supabaseClient.js';

const AdminContent = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [roleOptions] = useState(['executive', 'ACSS', 'user', 'admin']);

  // Fetch users directly from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Get current user for authentication check
        const { data: authData, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          throw new Error('Authentication failed');
        }
        
        // Fetch users directly from Supabase
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

    fetchUsers();
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
    <div className="admin-container">
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
                      onChange={(e) => setEditingUser({ ...editingUser, roles: e.target.value })}
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

const Admin = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminContent />} />
      </Routes>
    </Router>
  );
};

export default Admin;