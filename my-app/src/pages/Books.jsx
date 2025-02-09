import React, { useEffect, useState } from "react";
import Navbar from "../navbar";

function Books() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null); // Add error state for better error handling

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      // Use the correct backend server port (e.g., 3000 for Express)
      const response = await fetch(`http://localhost:3000/api/books`);
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Books</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>} {/* Display error if it exists */}
      <table>
        <thead>
          <tr>
            <th>BookID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Pages</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.BookID}>
              <td>{book.BookID}</td>
              <td>{book.Title}</td>
              <td>{book.Author}</td>
              <td>{book.Genre}</td>
              <td>{book.Pages}</td>
              <td>{book.Price}</td>
              <td>{book.Stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Books;