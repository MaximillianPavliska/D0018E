import express from "express";
import db from "../../../db.js";

const router = express.Router();

router.get("/", async (req, res) => {  
    try {
      const [books] = await db.execute(
        `SELECT * FROM books`,
      );
      if (books.length === 0) {
        return res.status(404).json({ message: "No books found" });
      }
      res.json(books);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ error: "Failed to fetch books" });
    }
  });

  export default router;
  
  