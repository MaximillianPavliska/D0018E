import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Users from "./pages/Users"; 
import Orders from "./pages/Orders";
import Books from "./pages/Books";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import BookDetail from "./pages/BookDetail";
import configfile from "../../Data/configReact";
import OrderDetail from "./pages/OrderDetail";

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token"); // Retrieve token

      if (!token) {
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
      if (response.ok) {
        setUser(data.user);
      } else {
        console.log("Not authenticated");
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h2>Welcome to Home</h2>
      {user ? (
        <div>
          <p><strong>Logged in as:</strong> {user.Username}</p>
          <p><strong>Email:</strong> {user.Email}</p>
          <p><strong>Role:</strong> {user.Role}</p>
        </div>
      ) : (
        <p>Please log in to view your details.</p>
      )}
    </div>
  );
};

function App() {
  return (
    <div>
    <h1>Bookstore</h1>
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/books" element={<Books />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/register" element={<Register />} />
        <Route path="/books/:bookId" element={<BookDetail />} />
        <Route path="/:orderId" element={<OrderDetail />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
