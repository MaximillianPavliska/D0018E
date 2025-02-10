import express from "express";
import db from "../../../db.js";
import session from "express-session";

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query the database for a teacher with the given email
        const [user] = await db.query('SELECT * FROM users WHERE email = ? AND Password = ?', [email, password]);
    
        if (user.length === 0) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
    
        req.session.user = { 
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          };

        res.json({ message: "Login successful", user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      }
  });

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) return res.status(500).json({ error: 'Logout failed' });
      res.clearCookie('connect.sid');
      res.json({ message: 'Logout successful' });
    });
  });

export default router;