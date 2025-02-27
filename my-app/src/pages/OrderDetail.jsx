import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import configfile from "../../../Data/configReact";
import { Link } from "react-router-dom";

const OrderDetail = () => {
    const { orderId } = useParams();  // Get orderId from the URL
    const [orderItems, setOrderItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await fetch(`http://${configfile.HOST}:3000/api/orders/${orderId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch order details");
                }
                const data = await response.json();
                setOrderItems(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchOrderDetails();
    }, [orderId]);  // Runs when orderId changes

    return (
        <div>
            <h1>Order Details for Order {orderId}</h1>
            {error ? (
                <p>{error}</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>BookID</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderItems.map(item => (
                            <tr key={item.BookID}>
                                <td>{item.BookID}</td>
                                <td><Link to={`/books/${item.BookID}`}>{item.Title}</Link></td>
                                <td>{item.Author}</td>
                                <td>{item.Quantity}</td>
                                <td>{item.Price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OrderDetail;
