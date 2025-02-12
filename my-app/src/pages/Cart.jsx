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
            throw new Error(" Error No Books in cart");
          }
          const data = await response.json();
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
            const response = await fetch (`http://${configfile.HOST}:3000/api/cart/removefromcart?BookID=${BookID}&userId=${userId}`,{
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