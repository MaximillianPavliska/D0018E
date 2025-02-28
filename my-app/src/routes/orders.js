import express from "express";
import db from "../../../db.js";

const router = express.Router();

router.get("/", async (req, res) => {  
    try {
      const [orders] = await db.execute(
        `SELECT * FROM orders`
      );
  
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

router.get("/:orderId", async (req, res) => {
  const { orderId } = req.params;
  console.log(orderId)
  try {
      const [orderItems] = await db.query(
          `SELECT oi.OrderID, oi.BookID, b.Title, b.Author, oi.Quantity, oi.Price 
          FROM order_items oi 
          JOIN books b ON oi.BookID = b.BookID 
          WHERE oi.OrderID = ?`,
          [orderId]
      );

      if (orderItems.length === 0) {
          return res.status(404).json({ message: "No items found for this order" });
      }

      res.json(orderItems);
  } catch (error) {
      console.error("Error fetching order details:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});
  

  router.post("/makeorder", async (req, res) => {
    const { userId } = req.body;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction(); // Start transaction, if anyting fail it resets evertyhing it canged

        // Get the cart items with stock check
        const [cartItems] = await connection.execute(
            `SELECT cart_items.BookID, cart_items.Quantity, books.Stock, books.Price
             FROM cart_items
             JOIN books ON cart_items.BookID = books.BookID
             WHERE cart_items.CartID = (SELECT CartID FROM cart WHERE UserID = ?) FOR UPDATE;`,
            [userId]
        );

        if (cartItems.length === 0) {
            throw new Error("Cart is empty.");
        }

        // Check stock availability
        for (let item of cartItems) {
            if (item.Quantity > item.Stock) {
                throw new Error(`Not enough stock for Book ID: ${item.BookID}`);
            }
        }

        // Deduct stock
        for (let item of cartItems) {
            await connection.execute(
                `UPDATE books SET Stock = Stock - ? WHERE BookID = ?;`,
                [item.Quantity, item.BookID]
            );
        }

        // Calculate total cost
        const totalCost = cartItems.reduce((sum, item) => sum + item.Price * item.Quantity, 0);

        // Insert into orders table
        // Insert into orders table and retrieve the OrderID
        const [orderResult] = await connection.query(
          `INSERT INTO orders (UserID, Order_date, Total_cost) VALUES (?, NOW(), ?);`,
          [userId, totalCost]
        );

        const orderId = orderResult.insertId; // This should now correctly retrieve the OrderID

        if (!orderId) {
          throw new Error("Failed to retrieve OrderID.");
        }

        // Insert order details into order_items
        for (let item of cartItems) {
          await connection.execute(
              `INSERT INTO order_items (OrderID, BookID, Quantity, Price) VALUES (?, ?, ?, ?);`,
              [orderId, item.BookID, item.Quantity, item.Price]
          );
        }

        // Clear the cart
        await connection.execute(
            `DELETE FROM cart_items WHERE CartID = (SELECT CartID FROM cart WHERE UserID = ?);`,
            [userId]
        );

        await connection.commit(); // Commit transaction
        res.status(200).json({ message: "Order placed successfully!" });
    } catch (error) {
        await connection.rollback(); // Rollback in case of failure
        res.status(400).json({ error: error.message });
    } finally {
        connection.release(); // Release connection back to the pool
    }
});


  export default router;
  
  