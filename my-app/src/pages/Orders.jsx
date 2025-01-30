import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function Orders() {
    const [orders, setOrders] = useState([]);


useEffect(() => {
    fetchOrders();
    }, []);
  
const fetchOrders = async () => {    
    try {
        const response = await fetch("http://localhost:3000/orders");
        if (!response.ok) {
        throw new Error("Failed to fetch books");
        }
        const data = await response.json();
    setOrders(data);
  } catch (error) {
    setError(error.message);
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
              <th>BookID</th>
              <th>Quantity</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.OrderID}>
                <td>{order.OrderID}</td>
                <td>{order.UserID}</td>
                <td>{order.BookID}</td>
                <td>{order.Quantity}</td>
                <td>{order.Date}</td>
              </tr>
            ))}
          </tbody>
        </table>
       </div>
     );};

export default Orders;
