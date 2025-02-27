import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import configfile from "../../../Data/configReact";
import { Link } from "react-router-dom";

function Books() {
    const [books, setBooks] = useState([]); 
    const [user, setUser] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [error, setError] = useState("");
    const [showAddBookForm, setShowAddBookForm] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [newBook, setNewBook] = useState({
      Title: "",
      Author: "",
      Genre: "",
      Pages: "",
      Price: "",
      Stock: ""
    });
    const [showSettings, setShowSettings] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {
        fetchBooks();
        fetchCurrentUser();
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

    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`http://${configfile.HOST}:3000/home`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchUserID = async (BookID) => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please log in if you want to add book to cart")
        console.log("User is not authenticated");
        return;
      }

      const response = await fetch(`http://${configfile.HOST}:3000/home`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log("Data:", data);  
      if (response.ok) {
        setUser(data.user);
        addToCart(BookID, data.user.UserID)
      } else {
        console.log("Not authenticated");
        setUser(null);
      }
    };
  
    const addToCart = async (BookID, userId) => {   
      try {
          console.log("Book", BookID)
          console.log("User", userId)
          const response = await fetch(`http://${configfile.HOST}:3000/api/cart/addtoCart`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({BookID, userId}),
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
      alert(searchInput);
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    };

    const handleNewBookChange = (e) => {
      const { name, value } = e.target;
      if (editingBook) {
        setEditingBook(prev => ({
          ...prev,
          [name]: value
        }));
      } else {
        setNewBook(prev => ({
          ...prev,
          [name]: value
        }));
      }
    };

    const handleAddBook = async (e) => {
      e.preventDefault();
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://${configfile.HOST}:3000/api/books`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(newBook),
        });

        if (!response.ok) {
          throw new Error("Failed to add new book");
        }

        const data = await response.json();
        console.log("Book added successfully:", data);
        alert("Book added successfully!");
        
        // Reset form and fetch updated books
        setNewBook({
          Title: "",
          Author: "",
          Genre: "",
          Pages: "",
          Price: "",
          Stock: ""
        });
        setShowAddBookForm(false);
        fetchBooks();
      } catch (error) {
        console.error("Error adding book:", error);
        setError(error.message);
        alert(`Error adding book: ${error.message}`);
      }
    };

    const handleEditClick = (book) => {
      setEditingBook({...book});
      setSelectedBook(book);
      setShowSettings(true);
    };

    const handleCancelEdit = () => {
      setEditingBook(null);
      setShowSettings(false);
    };

    const handleUpdateBook = async (e) => {
      e.preventDefault();
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://${configfile.HOST}:3000/api/books/${editingBook.BookID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(editingBook),
        });

        if (!response.ok) {
          throw new Error("Failed to update book");
        }

        const data = await response.json();
        console.log("Book updated successfully:", data);
        alert("Book updated successfully!");
        
        // Reset form and fetch updated books
        setEditingBook(null);
        setShowSettings(false);
        fetchBooks();
      } catch (error) {
        console.error("Error updating book:", error);
        setError(error.message);
        alert(`Error updating book: ${error.message}`);
      }
    };

    const handleDeleteBook = async (bookId) => {
      // Show confirmation dialog
      const confirmDelete = window.confirm("Are you sure you want to delete this book? This action cannot be undone.");
      
      if (!confirmDelete) {
        return; // User canceled the deletion
      }
      
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://${configfile.HOST}:3000/api/books/${bookId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Failed to delete book");
        }

        const data = await response.json();
        console.log("Book deleted successfully:", data);
        alert("Book deleted successfully!");
        
        // Reset states and fetch updated books
        setEditingBook(null);
        setSelectedBook(null);
        setShowSettings(false);
        fetchBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
        setError(error.message);
        alert(`Error deleting book: ${error.message}`);
      }
    };

    const isAdmin = user?.Role === "Admin" || user?.role === "Admin";

    // CSS Styles
    const styles = {
      button: {
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        border: 'none',
      },
      primaryButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
      },
      secondaryButton: {
        backgroundColor: '#f1f1f1',
        color: '#333',
        marginRight: '5px'
      },
      dangerButton: {
        backgroundColor: '#f44336',
        color: 'white',
      },
      settingsButton: {
        backgroundColor: '#2196F3',
        color: 'white',
      },
      formContainer: {
        marginBottom: '30px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px'
      },
      formGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px'
      },
      formField: {
        width: '100%',
        padding: '8px',
        marginTop: '5px'
      },
      settingsPanel: {
        marginBottom: '30px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9'
      },
      settingsActions: {
        display: 'flex',
        marginTop: '20px',
        gap: '10px'
      }
    };

    return (
      <div>
        <h1>Books</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <input
              type="text"
              placeholder="Search here"
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              value={searchInput} />
            <button onClick={() => handleSearch()}>
              Search
            </button>
          </div>
          
          {isAdmin && (
            <button 
              onClick={() => setShowAddBookForm(!showAddBookForm)}
              style={{...styles.button, ...styles.primaryButton}}
            >
              {showAddBookForm ? 'Cancel' : 'Add New Book'}
            </button>
          )}
        </div>

        {/* Add Book Form */}
        {showAddBookForm && isAdmin && (
          <div style={styles.formContainer}>
            <h2>Add New Book</h2>
            <form onSubmit={handleAddBook}>
              <div style={styles.formGrid}>
                <div>
                  <label htmlFor="title">Title:</label>
                  <input
                    type="text"
                    id="title"
                    name="Title"
                    value={newBook.Title}
                    onChange={handleNewBookChange}
                    required
                    style={styles.formField}
                  />
                </div>
                <div>
                  <label htmlFor="author">Author:</label>
                  <input
                    type="text"
                    id="author"
                    name="Author"
                    value={newBook.Author}
                    onChange={handleNewBookChange}
                    required
                    style={styles.formField}
                  />
                </div>
                <div>
                  <label htmlFor="genre">Genre:</label>
                  <input
                    type="text"
                    id="genre"
                    name="Genre"
                    value={newBook.Genre}
                    onChange={handleNewBookChange}
                    required
                    style={styles.formField}
                  />
                </div>
                <div>
                  <label htmlFor="pages">Pages:</label>
                  <input
                    type="number"
                    id="pages"
                    name="Pages"
                    value={newBook.Pages}
                    onChange={handleNewBookChange}
                    required
                    style={styles.formField}
                  />
                </div>
                <div>
                  <label htmlFor="price">Price:</label>
                  <input
                    type="number"
                    id="price"
                    name="Price"
                    value={newBook.Price}
                    onChange={handleNewBookChange}
                    required
                    style={styles.formField}
                    step="0.01"
                  />
                </div>
                <div>
                  <label htmlFor="stock">Stock:</label>
                  <input
                    type="number"
                    id="stock"
                    name="Stock"
                    value={newBook.Stock}
                    onChange={handleNewBookChange}
                    required
                    style={styles.formField}
                  />
                </div>
              </div>
              <button 
                type="submit"
                style={{...styles.button, ...styles.primaryButton, marginTop: '15px'}}
              >
                Add Book
              </button>
            </form>
          </div>
        )}

        {/* Edit Book Form */}
        {editingBook && isAdmin && (
          <div style={styles.formContainer}>
            <h2>Edit Book</h2>
            <form onSubmit={handleUpdateBook}>
              <div style={styles.formGrid}>
                <div>
                  <label htmlFor="edit-title">Title:</label>
                  <input
                    type="text"
                    id="edit-title"
                    name="Title"
                    value={editingBook.Title}
                    onChange={handleNewBookChange}
                    required
                    style={styles.formField}
                  />
                </div>
                <div>
                  <label htmlFor="edit-author">Author:</label>
                  <input
                    type="text"
                    id="edit-author"
                    name="Author"
                    value={editingBook.Author}
                    onChange={handleNewBookChange}
                    required
                    style={styles.formField}
                  />
                </div>
                <div>
                  <label htmlFor="edit-genre">Genre:</label>
                  <input
                    type="text"
                    id="edit-genre"
                    name="Genre"
                    value={editingBook.Genre}
                    onChange={handleNewBookChange}
                    required
                    style={styles.formField}
                  />
                </div>
                <div>
                  <label htmlFor="edit-pages">Pages:</label>
                  <input
                    type="number"
                    id="edit-pages"
                    name="Pages"
                    value={editingBook.Pages}
                    onChange={handleNewBookChange}
                    required
                    style={styles.formField}
                  />
                </div>
                <div>
                  <label htmlFor="edit-price">Price:</label>
                  <input
                    type="number"
                    id="edit-price"
                    name="Price"
                    value={editingBook.Price}
                    onChange={handleNewBookChange}
                    required
                    style={styles.formField}
                    step="0.01"
                  />
                </div>
                <div>
                  <label htmlFor="edit-stock">Stock:</label>
                  <input
                    type="number"
                    id="edit-stock"
                    name="Stock"
                    value={editingBook.Stock}
                    onChange={handleNewBookChange}
                    required
                    style={styles.formField}
                  />
                </div>
              </div>
              <div style={{ marginTop: '15px' }}>
                <button 
                  type="submit"
                  style={{...styles.button, ...styles.primaryButton, marginRight: '10px'}}
                >
                  Update Book
                </button>
                <button 
                  onClick={() => handleDeleteBook(selectedBook.BookID)}
                  style={{...styles.button, ...styles.dangerButton, marginRight: '10px'}}
                >
                  Remove Book
                </button>
                <button 
                  type="button"
                  onClick={handleCancelEdit}
                  style={{...styles.button, ...styles.secondaryButton}}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}

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
              <th>Actions</th>
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
                <td style={{ display: 'flex' }}>
                  <button onClick={() => fetchUserID(book.BookID)}
                    style={{...styles.button, ...styles.secondaryButton}}>
                    Add to Cart
                  </button>
                  {isAdmin && (
                    <button 
                      onClick={() => handleEditClick(book)}
                      style={{...styles.button, ...styles.settingsButton}}
                    >
                      Settings
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}
 
export default Books;