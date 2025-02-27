import React, { useEffect, useState } from "react";
import configfile from "../../../Data/configReact";

function Users() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`http://${configfile.HOST}:3000/home`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setCurrentUser(data.user);
        setIsAdmin(data.user.Role === "Admin" || data.user.role === "Admin");
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      const response = await fetch(`http://${configfile.HOST}:3000/api/users`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser({...user});
    setSelectedUser(user);
    setShowSettings(true);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setShowSettings(false);
    setSelectedUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://${configfile.HOST}:3000/api/users/${editingUser.UserID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editingUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const data = await response.json();
      console.log("User updated successfully:", data);
      alert("User updated successfully!");
      
      // Reset form and fetch updated users
      setEditingUser(null);
      setShowSettings(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      setError(error.message);
      alert(`Error updating user: ${error.message}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    // Don't allow deleting yourself
    if (userId === currentUser?.UserID) {
      alert("You cannot delete your own account!");
      return;
    }
    
    // Show confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete this user? This action cannot be undone.");
    
    if (!confirmDelete) {
      return; // User canceled the deletion
    }
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://${configfile.HOST}:3000/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      const data = await response.json();
      console.log("User deleted successfully:", data);
      alert("User deleted successfully!");
      
      // Reset states and fetch updated users
      setEditingUser(null);
      setSelectedUser(null);
      setShowSettings(false);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      setError(error.message);
      alert(`Error deleting user: ${error.message}`);
    }
  };

  // CSS Styles
  const styles = {
    container: {
      padding: '20px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px'
    },
    th: {
      padding: '12px',
      textAlign: 'left',
      borderBottom: '1px solid #ddd'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #ddd'
    },
    button: {
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      border: 'none',
      marginRight: '5px'
    },
    primaryButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
    },
    secondaryButton: {
      backgroundColor: '#f1f1f1',
      color: '#333',
    },
    dangerButton: {
      backgroundColor: '#f44336',
      color: 'white',
    },
    settingsButton: {
      backgroundColor: '#2196F3',
      color: 'white',
    },
    formContainer: {
      marginBottom: '30px',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px'
    },
    formGroup: {
      marginBottom: '15px'
    },
    formLabel: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold'
    },
    formInput: {
      width: '100%',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ccc'
    },
    formSelect: {
      width: '100%',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ccc'
    },
    settingsPanel: {
      marginBottom: '30px',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      backgroundColor: '#f9f9f9'
    },
    settingsActions: {
      display: 'flex',
      marginTop: '20px',
      gap: '10px'
    },
    error: {
      color: 'red',
      padding: '10px',
      backgroundColor: '#ffeeee',
      borderRadius: '4px',
      marginBottom: '20px'
    },
    loading: {
      padding: '20px',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.container}>
      <h1>User List</h1>
      
      {loading && <div style={styles.loading}>Loading users...</div>}
      {error && <div style={styles.error}>{error}</div>}

      {/* Edit User Form */}
      {editingUser && isAdmin && (
        <div style={styles.formContainer}>
          <h2>Edit User</h2>
          <form onSubmit={handleUpdateUser}>
            <div style={styles.formGroup}>
              <label htmlFor="Username" style={styles.formLabel}>Username:</label>
              <input
                type="text"
                id="Username"
                name="Username"
                value={editingUser.Username}
                onChange={handleInputChange}
                required
                style={styles.formInput}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="Email" style={styles.formLabel}>Email:</label>
              <input
                type="email"
                id="Email"
                name="Email"
                value={editingUser.Email}
                onChange={handleInputChange}
                required
                style={styles.formInput}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="Role" style={styles.formLabel}>Role:</label>
              <select
                id="Role"
                name="Role"
                value={editingUser.Role}
                onChange={handleInputChange}
                required
                style={styles.formSelect}
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div style={{ marginTop: '15px' }}>
              <button 
                type="submit"
                style={{...styles.button, ...styles.primaryButton, marginRight: '10px'}}
              >
                Update User
              </button>
              <button 
                onClick={() => handleDeleteUser(selectedUser.UserID)}
                style={{...styles.button, ...styles.dangerButton, marginRight: '10px'}}
                disabled={selectedUser.UserID === currentUser?.UserID}
              >
                {selectedUser.UserID === currentUser?.UserID ? "Cannot Delete Self" : "Remove User"}
              </button>
              <button 
                type="button"
                onClick={handleCancelEdit}
                style={{...styles.button, ...styles.secondaryButton}}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!loading && users.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>UserID</th>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              {isAdmin && <th style={styles.th}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.UserID}>
                <td style={styles.td}>{user.UserID}</td>
                <td style={styles.td}>{user.Username}</td>
                <td style={styles.td}>{user.Email}</td>
                <td style={styles.td}>{user.Role}</td>
                {isAdmin && (
                  <td style={styles.td}>
                    <button 
                      onClick={() => handleEditClick(user)}
                      style={{...styles.button, ...styles.settingsButton}}
                    >
                      Settings
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && users.length === 0 && !error && (
        <p>No users found.</p>
      )}
    </div>
  );
}

export default Users;