import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import configfile from "../../../Data/configReact";
import { Link } from "react-router-dom";

function Books() {
    const [books, setBooks] = useState([]); 
    const [user, setUser] = useState(null);
    const [searchInput, setSearchInput] = useState("");

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

    const fetchUserID = async (BookID) => {
      const token = localStorage.getItem("token"); // Retrieve token
      //console.log("Token:", token);

      if (!token) {
        alert("Pleas log in if you want to add book to cart")
        console.log("User is not authenticated");
        return;
      }

      const response = await fetch(`http://${configfile.HOST}:3000/home`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}` // Use token for authentication
        }
      });

      const data = await response.json();
      console.log("Data:", data);  
      if (response.ok) {
        setUser(data.user);
        addToCart(BookID,data.user.UserID)
      } else {
        console.log("Not authenticated");
        setUser(null);
      }
    };
  

  const addToCart = async (BookID,userId) => {   
  try {
      console.log("Book", BookID)
      console.log("User", userId)
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

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    // Call your search function here, for now just alert
    //fix backend 
    alert(searchInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };


     return (
       <div>
         <h1>Books</h1>
         <input
          type="text"
          placeholder="Search here"
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          value={searchInput} />
            <button onClick={() => handleSearch()}>
                Search
            </button>

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
                <td><Link to={`/books/${book.BookID}`}>{book.Title}</Link></td>
                <td>{book.Author}</td>   
                <td>{book.Genre}</td>
                <td>{book.Pages}</td>
                <td>{book.Price}</td>
                <td>{book.Stock}</td>
                <td>
                  <button onClick={() => fetchUserID(book.BookID)}>
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

