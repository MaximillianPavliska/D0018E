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
          books.Title,
          books.Author,
          books.Price,
          cart_items.BookID, 
          cart_items.Quantity 
          FROM 
            cart 
          JOIN 
            cart_items ON cart.CartID = cart_items.CartID 
          JOIN 
            books ON cart_items.BookID = books.BookID
          WHERE cart.UserID = ?`,[userId]
      );
      
      if (cart.length === 0) {
        console.log("no books in cart")
      }
      return res.json(cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  });

  router.post("/addtoCart", async (req, res) => {
    const {userId, BookID} = req.body;
    
    //console.log("userId", userId);
    //console.log("BookID", BookID); 

    try {
      let cartIDuse;
      //check if the user already has a cart
      const [cartUserID] = await db.execute(
        `SELECT 
          CartID 
        FROM 
          cart 
        WHERE 
          UserID=?`,[userId]
      );
      
      if (cartUserID.length === 0) {
        //No CartID assigned yet, insert and get CartID
        await db.execute(
          "INSERT INTO cart (UserID) VALUES (?)",
          [userId]
        );

        //get new CartID
        const [NewCartUserID] = await db.execute(
          `SELECT 
            CartID 
          FROM 
            cart 
          WHERE 
            UserID=?`,[userId]
        );
        cartIDuse = NewCartUserID[0].CartID

      }
      else{
        cartIDuse = cartUserID[0].CartID
      }
      //check if book exist in cart
      const [BooksinCart] = await db.execute(
        `SELECT Quantity FROM cart_items WHERE CartID = ? AND BookID = ?`, [cartIDuse,BookID]
      );
      if (BooksinCart.length > 0) {
      
        await db.execute("UPDATE cart_items SET Quantity = Quantity + 1 WHERE CartID = ? AND BookID = ?",[cartIDuse,BookID]
  );
        return res.status(200).json({message: "Book quantity was uppdated in cart of user"})
    }else{
      await db.execute("INSERT INTO cart_items (CartID, BookID, Quantity) VALUES (?, ?, 1)",
        [cartIDuse, BookID]
      );
      return res.status(201).json({ message: "Book added to cart" });

    }
  } catch (error) {
      console.error("Error adding book to cart:", error);
      return res.status(500).json({ error: "Failed to add book to cart" });
  }
  
    });


  router.delete("/removefromcart", async (req, res) => {  
    const { BookID, userId } = req.query;
    console.log(BookID)
    console.log(userId)
    if (!BookID || !userId) {
      return res.status(400).json({ error: "Missing BookID or userId" });
  }
      try {
        //get CartID
        const [cartRows] = await db.execute(
          `SELECT CartID FROM cart WHERE UserID = ?`, [userId]
      );
       const cartID = cartRows[0].CartID;
       console.log(cartID)
        //chech if there are more than i of the book
        const [cart] = await db.execute(
          `SELECT 
            Quantity
            FROM 
              cart_items
            WHERE CartID = ? AND BookID = ?`,[cartID, BookID]
        );
        //Quantity is larger/or 2 so take away one book. 
        const quantity = cart[0].Quantity;
        if (quantity >= 2) {
          await db.execute(
            `UPDATE cart_items SET Quantity = Quantity - 1 WHERE CartID = ? AND BookID = ?`,[cartID,BookID]
          );
          return res.status(201).json({ message: "Book quantity reduces by one in cart" });
        }
        else{
          //only one book in cart so delete it
          await db.execute(
            `DELETE FROM cart_items WHERE CartID = ? AND BookID = ?`, [cartID, BookID]
          );
          return res.status(201).json({ message: "Book removed from cart" });

        }
      } catch (error) {
        console.error("Error altering cart:", error);
        res.status(500).json({ error: "Failed to alter cart" });
      }
    });


  

  export default router;
  
  