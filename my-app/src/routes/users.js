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

  export default router;
  
  