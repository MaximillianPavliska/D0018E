import React, { useState } from "react";
import configfile from "../../../Data/configReact";

function Register () {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleCreateAccount = async () => {
    try {
      const response = await fetch(`http://${configfile.HOST}:3000/api/create-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setMessage("Account created successfully!");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <form
        style={styles.form}
        onSubmit={(e) => e.preventDefault()} // Prevent form submission from reloading the page
      >
        <h2>Create Account</h2>
        {message && <p style={{ color: message.startsWith("Error") ? "red" : "green" }}>{message}</p>}
        <input
          type="string"
          placeholder="Username"
          style={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="button" style={styles.button} onClick={handleCreateAccount}>
          Create Account
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  },
  input: {
    marginBottom: "10px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#007BFF",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
  },
};

export default Register;
