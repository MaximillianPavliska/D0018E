import express from "express";
import db from "../../../db.js";
const router = express.Router();

router.get("/:bookId", async (req, res) => {
  try {
    const [reviews] = await db.execute(
      `SELECT * FROM reviews WHERE BookID = ?`,
      [req.params.bookId]
    );
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

router.post("/", async (req, res) => {
  const { bookId, userId, rating, comment } = req.body;
  
  try {
    await db.execute(
      `INSERT INTO reviews (BookID, UserID, Rating, Comment)
       VALUES (?, ?, ?, ?)`,
      [bookId, userId, rating, comment]
    );
    res.status(201).json({ message: "Review added" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add review" });
  }
});

export default router;