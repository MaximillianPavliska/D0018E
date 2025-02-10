import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import configfile from "../../../Data/configReact";

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);
    const userId = 1; // Replace this with dynamic user retrieval logic

    useEffect(() => {
        fetchCartItems();
      }, []);
    
      const fetchCartItems = async () => {
        try {
          const response = await fetch(`http://${configfile.HOST}:3000/api/cart?userId=${userId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch cart items");
          }
          const data = await response.json();
          setCartItems(data);
        } catch (error) {
          setError(error.message);
        }
      };
    
      return (
        <div>
          <Navbar />
          <h1>My Cart</h1>
          {error ? (
            <p>Error: {error}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>BookID</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.BookID}>
                    <td>{item.BookID}</td>
                    <td>{item.Quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );
    }
    
    export default Cart;