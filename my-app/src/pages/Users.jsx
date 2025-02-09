import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import configfile from "../../../Data/configReact";

function Users() {
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "" });

useEffect(() => {
  fetchUsers();
}, []);


const fetchUsers = async () => {
  try {
    const response = await fetch(`http://${configfile.HOST}:3000/api/users`); // Using Fetch API
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


const handleInputChange = (e) => {
  setNewUser({ ...newUser, [e.target.name]: e.target.value });
};

const addUser = async () => {
  if (!newUser.username || !newUser.email || !newUser.password || !newUser.role) {
    alert("All fields are required!");
    return;
  }
  
  try {
    const response = await fetch(`http://${configfile.HOST}:3000/add-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      throw new Error("Failed to add user");
    }

    setNewUser({ username: "", email: "", password: "", role: "" }); // Clear input fields
    fetchUsers(); // Refresh the list
  } catch (error) {
    setError(error.message);
  }
};


return (
  <div>
  <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-5">
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">User List</h2>

      {loading && <p className="text-gray-500 text-center">Loading users...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">UserID</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.UserID} className="text-center">
              <td className="border p-2">{user.UserID}</td>
              <td className="border p-2">{user.Username}</td>
              <td className="border p-2">{user.Email}</td>
              <td className="border p-2">{user.Role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  </div>
)};

export default Users;
