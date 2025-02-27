import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import configfile from "../../../Data/configReact";
import { Link } from "react-router-dom";

function Orders() {
    const [orders, setOrders] = useState([]);


useEffect(() => {
    fetchOrders();
    }, []);
  
const fetchOrders = async () => {    
    try {
        const response = await fetch(`http://${configfile.HOST}:3000/api/orders`);
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
