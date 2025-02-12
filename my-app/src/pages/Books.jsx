import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import configfile from "../../../Data/configReact";

function Books() {
    const [books, setBooks] = useState([]); 
    const userId = 1;   

useEffect(() => {
    fetchBooks();
    }, []);
  
const fetchBooks = async () => {    
    try {
        const response = await fetch(`http://${configfile.HOST}:3000/api/books`);
        if (!response.ok) {
        throw new Error("Failed to fetch books");
        }
        const data = await response.json();
    setBooks(data);
  } catch (error) {
    setError(error.message);
  }
};


const addToCart = async (BookID) => {    
  try {
      const response = await fetch (`http://${configfile.HOST}:3000/api/cart/addtoCart`,{
      method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({BookID,userId}),
      });
      if (!response.ok) {
        throw new Error("Failed to add book to cart");
      }
  
      const data = await response.json();
      console.log("Book added to cart successfully:", data);
      alert("Book added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      setError(error.message);
    }
  };


     return (
       <div>
         <h1>Books</h1>
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
            {books.map(book => (
              <tr key={book.BookID}>
                <td>{book.BookID}</td>
                <td>{book.Title}</td>
                <td>{book.Author}</td>   
                <td>{book.Genre}</td>
                <td>{book.Pages}</td>
                <td>{book.Price}</td>
                <td>{book.Stock}</td>
                <td>
                  <button onClick={() => addToCart(book.BookID)}>
                    Add to Cart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
       </div>
     );};
 
export default Books;

