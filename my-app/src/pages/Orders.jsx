import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import configfile from "../../../Data/configReact";
import { Link } from "react-router-dom";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);


    useEffect(() => {
      fetchCurrentUser();
      }, []);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
      }, [user]); // Runs fetchOrders only when user is updated
  
    const fetchOrders = async () => {    
      try {
          const token = localStorage.getItem("token");
          if (!token) return;
  
          const response = await fetch(`http://${configfile.HOST}:3000/api/orders`, {
              method: "GET",
              headers: {
                  "Authorization": `Bearer ${token}`
              }
          });
  
          if (!response.ok) {
              throw new Error("Failed to fetch orders");
          }
  
          const data = await response.json();
          const isAdmin = user?.Role === "Admin" || user?.role === "Admin";
          console.log(isAdmin)
          if (isAdmin) {
              setOrders(data);  // Admin sees all orders
          } else {
              setOrders(data.filter(order => order.UserID === user.UserID)); // Regular user sees only their orders
          }
      } catch (error) {
          console.error("Error fetching orders:", error);
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

  

     return (
       <div>
         <h1>Orders</h1>
         <table>
          <thead>
            <tr>
              <th>OrderID</th>
              <th>UserID</th>
              <th>Order date</th>
              <th>Total cost</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.OrderID}>
                <td><Link to={`/${order.OrderID}`}>{order.OrderID}</Link></td>
                <td>{order.UserID}</td>
                <td>{order.Order_date}</td>
                <td>{order.Total_cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
       </div>
     );};

export default Orders;
