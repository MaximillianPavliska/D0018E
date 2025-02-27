import express from "express";
import db from "../../../db.js";
import authenticate from "../auth.js";

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

// Add new book - only for admins
router.post("/", authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.Role !== "Admin" && req.user.role !== "Admin") {
      return res.status(403).json({ error: "Unauthorized. Admin access required." });
    }

    const { Title, Author, Genre, Pages, Price, Stock } = req.body;
    
    // Validate required fields
    if (!Title || !Author || !Genre || !Pages || !Price || !Stock) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Insert new book
    const [result] = await db.execute(
      `INSERT INTO books (Title, Author, Genre, Pages, Price, Stock) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [Title, Author, Genre, Pages, Price, Stock]
    );

    res.status(201).json({ 
      message: "Book added successfully", 
      bookId: result.insertId 
    });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ error: "Failed to add book" });
  }
});

// Update existing book - only for admins
router.put("/:bookId", authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.Role !== "Admin" && req.user.role !== "Admin") {
      return res.status(403).json({ error: "Unauthorized. Admin access required." });
    }

    const bookId = req.params.bookId;
    const { Title, Author, Genre, Pages, Price, Stock } = req.body;
    console.log("1")

    // Validate required fields
    if (!Title || !Author || !Genre || !Pages || !Price ) { //Tog away stock as it can be 0
      return res.status(400).json({ error: "All fields are required" });
    }
    console.log("1.2")
    // Check if book exists
    const [bookCheck] = await db.execute(
      `SELECT * FROM books WHERE BookID = ?`,
      [bookId]
    );
    console.log("2")

    if (bookCheck.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    console.log("3")

    // Update book
    await db.execute(
      `UPDATE books 
       SET Title = ?, Author = ?, Genre = ?, Pages = ?, Price = ?, Stock = ? 
       WHERE BookID = ?`,
      [Title, Author, Genre, Pages, Price, Stock, bookId]
    );
    console.log("4")

    res.json({ 
      message: "Book updated successfully",
      bookId: bookId 
    });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Failed to update book" });
  }
});

// Delete existing book - only for admins
router.delete("/:bookId", authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.Role !== "Admin" && req.user.role !== "Admin") {
      return res.status(403).json({ error: "Unauthorized. Admin access required." });
    }

    const bookId = req.params.bookId;

    // Check if book exists
    const [bookCheck] = await db.execute(
      `SELECT * FROM books WHERE BookID = ?`,
      [bookId]
    );
    
    if (bookCheck.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Delete book
    await db.execute(
      `DELETE FROM books WHERE BookID = ?`,
      [bookId]
    );

    res.json({ 
      message: "Book deleted successfully",
      bookId: bookId 
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Failed to delete book" });
  }
});

export default router;