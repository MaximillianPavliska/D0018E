import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import configfile from "../../../Data/configReact";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  const handleRegister = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`http://${configfile.HOST}:3000/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Registration failed.");
      }
      setMessage(data.message);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(error.message);
    }
  };
  

  return (
    <div>
      <h2>Register</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
