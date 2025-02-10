import express from "express";
import db from "../../../db.js";

const router = express.Router();

router.get("/", async (req, res) => {  
    try {
      const [users] = await db.execute(
        `SELECT UserID, Username, Email, Role FROM users`
      );
  
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });
  
  // New POST route for user registration
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
      // Check if user already exists
      const [existingUsers] = await db.execute(
        "SELECT * FROM users WHERE Username = ? OR Email = ?",
        [username, email]
      );
  
      if (existingUsers.length > 0) {
        return res.status(400).json({ error: "Username or email already exists" });
      }
  
      // Hash the password
      //const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert new user
      await db.execute(
        "INSERT INTO users (Username, Email, Password, Role) VALUES (?, ?, ?, 'customer')",
        [username, email, password]
      );
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  export default router;
  
  