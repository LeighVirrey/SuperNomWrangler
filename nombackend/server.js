const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mysql = require("mysql2/promise");
const sendEmail = require("./smtp"); // Your custom SMTP module
// const User = require("./models/user"); // Not used if using direct SQL queries

// Middleware setup
app.use(express.json());
app.use(cookieParser());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",                // update to your host
  user: "your_mysql_username",      // update with your username
  password: "your_mysql_password",  // update with your password
  database: "your_database_name",   // update with your database name
});

// JWT secret key (In production, store this in environment variables)
const JWT_SECRET = "YOUR_SECRET_KEY";

// Middleware to authenticate JWT token from cookies
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

app.get("/", (req, res) => {
  res.send("nom nom nom");
});
// Registration endpoint
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Check if the user already exists
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash the user password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    await pool.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword]);

    // Optionally send a welcome email
    sendEmail(email, "Welcome!", "Thank you for registering!");

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Retrieve the user from the database
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const user = rows[0];

    // Compare provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token for the user (expires in 1 hour)
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    // Set the token in an HTTP-only cookie
    res.cookie("token", token, { httpOnly: true });

    res.json({ message: "Logged in successfully" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Protected route
app.get("/dashboard", authenticateToken, async (req, res) => {
  try {
    // Optionally, fetch more details from the database using req.user.id
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: `Welcome to your dashboard, ${rows[0].email}` });
  } catch (error) {
    console.error("Error accessing dashboard:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout endpoint - clear the auth cookie
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
