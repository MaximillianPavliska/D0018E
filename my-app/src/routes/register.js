import express from "express";
import db from "../../../db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }
  
  console.log("username", username);
  console.log("email", email); 
  console.log("password", password);  
  const [rows] = await db.query("SELECT * FROM users WHERE Username = ? OR Email = ?", [username, email]);

  console.log("rows", rows);
    if (rows.length > 0) {
      return res.status(400).json({ error: "Username or email already exists. Please choose another one." });
    }

  const sql = "INSERT INTO users (Username, Email, Password, Role) VALUES (?, ?, ?, ?)";
  const values = [username, email, password, "Customer"];

  db.query(sql, values, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Username or email already exists. Please choose another one." });
      }
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error. Please try again later." });
    }
    res.json({ message: "User registered successfully!" });
  });
});

export default router;
