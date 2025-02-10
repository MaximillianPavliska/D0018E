import express from "express";
import db from "../../../db.js";

const router = express.Router();

router.get("/", async (req, res) => {  
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: "You are not logged in" });
  }
    try {
      const [cart] = await db.execute(
        `SELECT 
          cart_items.BookID, 
          cart_items.Quantity 
          FROM 
            cart 
          JOIN 
            cart_items ON cart.CartID = cart_items.CartID 
          WHERE cart.UserID = ?`,[userId]
      );
      if (cart.length === 0) {
        return res.status(404).json({ message: "No books found in cart" });
      }
      res.json(cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  });

  export default router;
  
  