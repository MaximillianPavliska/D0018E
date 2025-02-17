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


  router.get("/:bookId", async (req, res) => {
    try {
      const [book] = await db.execute(
        `SELECT * FROM books WHERE BookID = ?`,
        [req.params.bookId]
      );
      if (book.length === 0) return res.status(404).json({ error: "Book not found" });
      res.json(book[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch book" });
    }
  });
  
  export default router;
  
  