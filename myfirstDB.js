const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1337",
  database: "mydb",
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Fetch all users (excluding password)
app.get("/users", (req, res) => {
  db.query("SELECT UserID, Username, Email, Role FROM users", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// Add a new user
app.post("/add-user", (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = "INSERT INTO users (Username, Email, Password, Role) VALUES (?, ?, ?, ?)";
  db.query(sql, [username, email, password, role], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "User added!", id: result.insertId });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
