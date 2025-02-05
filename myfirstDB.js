const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const session = require("express-session");
const dotenv = require("dotenv");
const configfile = require("./Data/configNode");

dotenv.config();
const app = express();
const port = 3000;


app.use(express.json());


app.use(cors({
  origin: `http://${configfile.HOST}:5173`,
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

app.use(session({
  secret: "VäldigtHemlig",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 } // 1 hour session
}));


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: configfile.pwd,
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

app.get("/books", (req, resBooks) => {
  db.query("SELECT * FROM books", (err, results) => {
    if (err) {
      resBooks.status(500).json({ error: err.message });
    } else {
      resBooks.json(results);
    }
  });
});

app.get("/orders", (reqt, resOders) => {
  db.query("SELECT * FROM orders", (err, results) => {
    if (err) {
      resOders.status(500).json({ error: err.message });
    } else {
      resOders.json(results);
    }
  });
});


// Register User
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
  const values = [username, email, password, "Customer"];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User registered successfully!" });
  });
});

// Login User
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Store user data in session
    req.session.user = result[0];
    res.json({ message: "Login successful", user: req.session.user });
  });
});

app.get("/home", (req, res) => {
  const sessionId = req.headers["x-session-id"]; // Get session ID from request headers

  if (!sessionId || !req.sessionStore.sessions[sessionId]) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // Retrieve session data from session store
  const sessionData = JSON.parse(req.sessionStore.sessions[sessionId]);

  res.json({ user: sessionData.user });
});

app.listen(port, () => {
  console.log(`Server is running at http://${configfile.HOST}:${port}`);
});
