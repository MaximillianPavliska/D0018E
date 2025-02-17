import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import configfile from "../../../Data/configReact";

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);
    //const userId = 1; // Replace this with dynamic user retrieval logic
    const [user, setUser] = useState(null);

        // Fetch user when component mounts
        useEffect(() => {
            fetchUser();
        }, []);
    
          // Fetch cart items only when user is set
          useEffect(() => {
            if (user) {
                console.log("User found, fetching cart items...");
                fetchCartItems();
            }
        }, [user]); // Runs ONLY when `user` changes


      const fetchUser = async () => {
        const token = localStorage.getItem("token"); // Retrieve token
        console.log("Token:", token);
  
        if (!token) {
          console.log("User is not authenticated");
          return;
        }
  
        const response = await fetch(`http://${configfile.HOST}:3000/home`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}` // Use token or authentication
          }
        });
  
        const data = await response.json();
        console.log("Data:", data);  
        if (response.ok) {
          setUser(data.user);
        } else {
          console.log("Not authenticated");
          setUser(null);
        }
      };
    
      const fetchCartItems = async () => {
        if (!user) {
          setError("User not logged in");
          return;
        }
        try {
          //alert("ja?")
          console.log(user.UserID)
          const response = await fetch(`http://${configfile.HOST}:3000/api/cart?userId=${user.UserID}`);
          if (!response.ok) {
            throw new Error(" Error No Books in cart");
          }
          
          const data = await response.json();
          console.log(data)
          if(data.length === 0){
            setCartItems([]);
            setError("Nothing in cart");
          }
          else{
            setCartItems(data);
          }
        } catch (error) {
          setError("Error", error.message);
        }
      };

      const RemoveFromCart = async (BookID) => {    
        try {
            const response = await fetch (`http://${configfile.HOST}:3000/api/cart/removefromcart?BookID=${BookID}&userId=${user.UserID}`,{
            method: "DELETE",
              headers: {
                "Content-Type": "application/json"}
            });
            if (!response.ok) {
              throw new Error("Failed to remove book from cart");
            }
        
            const data = await response.json();
            //console.log("Book removed from cart successfully:", data);
            fetchCartItems();
            alert("Book removed from cart!");
          } catch (error) {
            console.error("Error removing from cart:", error);
            setError(error.message);
          }
        };

    
      return (
        <div>
          <h1>My Cart</h1>
          {error ? (
            <p>{error}</p>
          ) : (
            <><table>
                <thead>
                  <tr>
                    <th>BookID</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Price</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.BookID}>
                      <td>{item.BookID}</td>
                      <td>{item.Title}</td>
                      <td>{item.Author}</td>
                      <td>{item.Price}</td>
                      <td>{item.Quantity}</td>
                      <td>
                        <button onClick={() => RemoveFromCart(item.BookID)}>
                          Remove from cart
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={() => Makeorder()}>
                Make a Order
                </button></>
          )}
        </div>
      );
    }
    
    export default Cart;