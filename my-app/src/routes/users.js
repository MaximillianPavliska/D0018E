import express from "express";
import db from "../../../db.js";
import authenticate from "../auth.js";
import bcrypt from "bcrypt";

const router = express.Router();

// Get all users (admin only)
router.get("/", authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.Role !== "Admin" && req.user.role !== "Admin") {
      return res.status(403).json({ error: "Unauthorized. Admin access required." });
    }

    const [users] = await db.execute(
      `SELECT UserID, Username, Email, Role FROM users`
    );
    
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get specific user (admin or self)
router.get("/:userId", authenticate, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Check if user is admin or requesting their own data
    if ((req.user.Role !== "Admin" && req.user.role !== "Admin") && 
        req.user.UserID !== parseInt(userId)) {
      return res.status(403).json({ error: "Unauthorized. You can only access your own data." });
    }

    const [user] = await db.execute(
      `SELECT UserID, Username, Email, Role FROM users WHERE UserID = ?`,
      [userId]
    );
    
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(user[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Update user (admin only)
router.put("/:userId", authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.Role !== "Admin" && req.user.role !== "Admin") {
      return res.status(403).json({ error: "Unauthorized. Admin access required." });
    }

    const userId = req.params.userId;
    const { Username, Email, Role, Password } = req.body;
    
    // Check if user exists
    const [userCheck] = await db.execute(
      `SELECT * FROM users WHERE UserID = ?`,
      [userId]
    );
    
    if (userCheck.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if username or email already exists for another user
    if (Username || Email) {
      const [existingCheck] = await db.execute(
        `SELECT * FROM users WHERE (Username = ? OR Email = ?) AND UserID != ?`,
        [Username, Email, userId]
      );
      
      if (existingCheck.length > 0) {
        return res.status(400).json({ error: "Username or email already in use" });
      }
    }

    // Build update query based on provided fields
    let updateFields = [];
    let queryParams = [];
    
    if (Username) {
      updateFields.push("Username = ?");
      queryParams.push(Username);
    }
    
    if (Email) {
      updateFields.push("Email = ?");
      queryParams.push(Email);
    }
    
    if (Role) {
      updateFields.push("Role = ?");
      queryParams.push(Role);
    }
    
    if (Password) {
      const hashedPassword = await bcrypt.hash(Password, 10);
      updateFields.push("Password = ?");
      queryParams.push(hashedPassword);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    
    // Add userId as last parameter
    queryParams.push(userId);
    
    await db.execute(
      `UPDATE users SET ${updateFields.join(", ")} WHERE UserID = ?`,
      queryParams
    );

    res.json({ 
      message: "User updated successfully",
      userId: userId 
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Delete user (admin only)
router.delete("/:userId", authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.Role !== "Admin" && req.user.role !== "Admin") {
      return res.status(403).json({ error: "Unauthorized. Admin access required." });
    }

    const userId = req.params.userId;
    
    // Don't allow deleting your own account
    if (req.user.UserID === parseInt(userId)) {
      return res.status(400).json({ error: "You cannot delete your own account" });
    }

    // Check if user exists
    const [userCheck] = await db.execute(
      `SELECT * FROM users WHERE UserID = ?`,
      [userId]
    );
    
    if (userCheck.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete user's cart items first to maintain referential integrity
    await db.execute(
      `DELETE FROM cart WHERE UserID = ?`,
      [userId]
    );
    
    // Delete user's orders if you have an orders table
    // await db.execute(
    //   `DELETE FROM orders WHERE UserID = ?`,
    //   [userId]
    // );

    // Finally delete the user
    await db.execute(
      `DELETE FROM users WHERE UserID = ?`,
      [userId]
    );

    res.json({ 
      message: "User deleted successfully",
      userId: userId 
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;