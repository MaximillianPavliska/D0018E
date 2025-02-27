import express from "express";
import db from "../../../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Secret key for JWT (store securely in environment variables)
const JWT_SECRET = process.env.JWT_SECRET;


// Login route for teachers only
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query the database for a teacher with the given email
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [email, email]
    );

    console.log(rows);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];

    // Compare the provided password with the hashed password in the database
    if (password !== user.Password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token for authentication
    const token = jwt.sign(
      { userId: user.UserID, role: user.Role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Login successful:", user.UserID);
    res.json({ token, userId: user.UserID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;