import express from "express";
import db from "../../../db.js";

const router = express.Router();

// Route to create a new user account
router.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);
  try {
    // Validate input
    if (!email || !password || !username) {
      return res.status(400).send("All fields are required.");
    }

    // Insert the new user into the database
    await db.execute(
      "INSERT INTO users (email, password, username, role) VALUES (?, ?, ?, ?)",
      [email, password, username, "Customer"]
    );

    res.status(201).send("User account created successfully.");
  } catch (error) {
    console.error(error);

    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).send("An account with this email/username already exists.");
    } else {
      res.status(500).send("An error occurred while creating the account.");
    }
  }
});

export default router;
