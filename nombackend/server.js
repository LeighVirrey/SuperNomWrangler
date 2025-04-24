const bcrypt = require("bcryptjs");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const axios = require("axios"); // For Google Places API
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

//#region - Restaurant Reviews 
// Mock information for testing
let reviewIdCounter = 0;
let reviews = [];

// Allows users to add reviews
/*
app.post("/restaurant/review", async (req, res) => {
  const {
    imageUrl,
    restaurantName,
    streetName,
    streetNumber,
    city,
    state,
    zipCode,
    country,
    description,
    cuisineTypes,
    diningStyle,
    priceRange,
    otherNotes,
    operatingHours,
    userReview,
    userId,       // optional user id
    isFlagged     // new field (optional)
  } = req.body;

  if (!restaurantName || !streetName || !streetNumber || !city || !state || !zipCode || !country || !cuisineTypes || !diningStyle || !priceRange) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const [existingReviews] = await pool.query(
      "SELECT COUNT(*) as count FROM reviews WHERE restaurantName = ? AND streetName = ? AND streetNumber = ? AND city = ? AND zipCode = ?",
      [restaurantName, streetName, streetNumber, city, zipCode]
    );

    const isFirstReview = existingReviews[0].count === 0;

    if (isFirstReview && !imageUrl) {
      return res.status(400).json({ error: "First review for a restaurant must include an image URL." });
    }

    await pool.query(
      `INSERT INTO reviews (
        userId, restaurantName, imageUrl,
        streetName, streetNumber, city, state, zipCode, country,
        description, cuisineTypes, diningStyle, priceRange,
        otherNotes, operatingHours, userReview, isFlagged
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId || null,
        restaurantName,
        imageUrl || null,
        streetName, streetNumber, city, state, zipCode, country,
        description || null,
        JSON.stringify(cuisineTypes),
        diningStyle,
        priceRange,
        otherNotes || null,
        operatingHours ? JSON.stringify(JSON.parse(operatingHours)) : null,
        userReview || null,
        isFlagged ? 1 : 0
      ]
    );

    res.status(201).json({
      message: "Review submitted successfully.",
      submitted: {
        userId: userId || null,
        restaurantName,
        imageUrl: imageUrl || null,
        streetName,
        streetNumber,
        city,
        state,
        zipCode,
        country,
        description: description || null,
        cuisineTypes,
        diningStyle,
        priceRange,
        otherNotes: otherNotes || null,
        operatingHours: operatingHours ? JSON.parse(operatingHours) : null,
        userReview: userReview || null,
        isFlagged: isFlagged ? true : false
      }
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}); This has the try catch that can be used once we are further into the project*/

app.post("/restaurant/review", (req, res) => {
  const {
    imageUrl,
    restaurantName,
    streetName,
    streetNumber,
    city,
    state,
    zipCode,
    country,
    description,
    cuisineTypes,
    diningStyle,
    priceRange,
    otherNotes,
    operatingHours,
    userReview
  } = req.body;

  // Check if the restaurant name already exists in the reviews array
  const existingRestaurant = reviews.find(
    (review) => review.restaurantName.toLowerCase() === restaurantName.toLowerCase()
  );

  // If the restaurant is new and no imageUrl is provided, return an error
  if (!existingRestaurant && !imageUrl) {
    return res.status(400).json({
      error: "First review for a restaurant must include an image URL."
    });
  }

  const newReview = {
    id: reviewIdCounter++,
    imageUrl,
    restaurantName,
    streetName,
    streetNumber,
    city,
    state,
    zipCode,
    country,
    description,
    cuisineTypes,
    diningStyle,
    priceRange,
    otherNotes,
    operatingHours: JSON.parse(operatingHours || "[]"),
    userReview,
    isFlagged: false
  };

  reviews.push(newReview);
  res.status(201).json(newReview);
});

// Get all reviews for the restaurant
/* app.get("/restaurant/reviews", async (req, res) => {
  try {
    const [reviews] = await pool.query("SELECT * FROM reviews");
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});  This has the try catch that can be used once we are further into the project*/

// Mock data for testing
app.get("/restaurant/reviews", (req, res) => {
  res.json(reviews);
});

// Get a single review for the restaurant
/*app.get("/restaurant/review/:id", async (req, res) => {
  try {
    const [reviews] = await pool.query("SELECT * FROM reviews WHERE id = ?", [req.params.id]);
    if (reviews.length === 0) return res.status(404).json({ error: "Review not found" });
    res.json(reviews[0]);
  } catch (err) {
    console.error("Error fetching review:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}); This has the try catch that can be used later*/

// Mock data for testing
app.get("/restaurant/review/:id", (req, res) => {
  const review = reviews.find(r => r.id === parseInt(req.params.id));
  if (!review) return res.status(404).json({ error: "Review not found" });
  res.json(review);
});

// Allows user to update any review (only if they are the author of the review)
/*
app.put("/restaurant/review/:id", async (req, res) => {
  try {
    const [reviewRows] = await pool.query("SELECT * FROM reviews WHERE id = ?", [req.params.id]);
    if (reviewRows.length === 0) return res.status(404).json({ error: "Review not found" });

    const {
      imageUrl,
      location,
      description,
      cuisineTypes,
      diningStyle,
      priceRange,
      otherNotes,
      operatingHours,
      userReview,
      isFlagged 
    } = req.body;

    await pool.query(
      `UPDATE reviews SET 
        imageUrl = ?, streetName = ?, streetNumber = ?, city = ?, state = ?, zipCode = ?, country = ?, 
        description = ?, cuisineTypes = ?, diningStyle = ?, priceRange = ?, 
        otherNotes = ?, operatingHours = ?, userReview = ?, isFlagged = ?
      WHERE id = ?`,
      [
        imageUrl || null,
        location.streetName, location.streetNumber, location.city, location.state, location.zipCode, location.country,
        description || null,
        JSON.stringify(cuisineTypes), diningStyle, priceRange,
        otherNotes || null, JSON.stringify(operatingHours || []),
        userReview || null,
        isFlagged ? 1 : 0,
        req.params.id
      ]
    );

    res.json({ message: "Review updated successfully" });
  } catch (err) {
    console.error("Error updating review:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}); This has the try catch that can be used later*/

// Mock data for testing
app.put("/restaurant/review/:id", (req, res) => {
  // Find the review by ID
  const review = reviews.find(r => r.id === parseInt(req.params.id));
  
  // If review doesn't exist, return 404
  if (!review) return res.status(404).json({ error: "Review not found" });

  // Destructure request body
  const {
    imageUrl,
    restaurantName,
    streetName,
    streetNumber,
    city,
    state,
    zipCode,
    country,
    description,
    cuisineTypes,
    diningStyle,
    priceRange,
    otherNotes,
    operatingHours,
    userReview,
    isFlagged 
  } = req.body;

  // Update the review object with the new values
  review.imageUrl = imageUrl || review.imageUrl;
  review.restaurantName = restaurantName || review.restaurantName;
  review.streetName = streetName || review.streetName;
  review.streetNumber = streetNumber || review.streetNumber;
  review.city = city || review.city;
  review.state = state || review.state;
  review.zipCode = zipCode || review.zipCode;
  review.country = country || review.country;
  review.description = description || review.description;
  review.cuisineTypes = cuisineTypes || review.cuisineTypes;
  review.diningStyle = diningStyle || review.diningStyle;
  review.priceRange = priceRange || review.priceRange;
  review.otherNotes = otherNotes || review.otherNotes;
  review.operatingHours = operatingHours || review.operatingHours;
  review.userReview = userReview || review.userReview;
  
  // Update isFlagged only if it's passed and is a boolean
  if (typeof isFlagged === "boolean") {
    review.isFlagged = isFlagged;
  }

  // Return the updated review as response
  res.json({ message: "Review updated successfully", data: review });
});

// Remove any review (Admin only)
/*app.delete("/restaurant/review/:id", async (req, res) => {
  try {
    const [reviewRows] = await pool.query("SELECT * FROM reviews WHERE id = ?", [req.params.id]);
    if (reviewRows.length === 0) return res.status(404).json({ error: "Review not found" });

    await pool.query("DELETE FROM reviews WHERE id = ?", [req.params.id]);
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}); This has the try catch that can be used later*/

// Mock data for testing
app.delete("/restaurant/review/:id", (req, res) => {
  const index = reviews.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Review not found" });

  reviews.splice(index, 1);
  res.json({ message: "Review deleted successfully" });
});

// Flag a review for investigation (Admin and certain ranks only)
/*app.patch("/restaurant/review/:id/flag", async (req, res) => {
  try {
    const [reviewRows] = await pool.query("SELECT * FROM reviews WHERE id = ?", [req.params.id]);
    if (reviewRows.length === 0) return res.status(404).json({ error: "Review not found" });

    await pool.query("UPDATE reviews SET isFlagged = 1 WHERE id = ?", [req.params.id]);
    res.json({ message: "Review has been flagged for investigation" });
  } catch (err) {
    console.error("Error flagging review:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}); This has the try catch that can be used later*/

// Mock data for testing
app.patch("/restaurant/review/:id/flag", (req, res) => {
  const review = reviews.find(r => r.id === parseInt(req.params.id));
  if (!review) return res.status(404).json({ error: "Review not found" });

  review.isFlagged = true;
  res.json({ message: "Review has been flagged for investigation" });
});

//To Unflag a review (Admin only)
/*app.put("/restaurant/review/:id/unflag", async (req, res) => {
  try {
    const [reviewRows] = await pool.query("SELECT * FROM reviews WHERE id = ?", [req.params.id]);
    if (reviewRows.length === 0) return res.status(404).json({ error: "Review not found" });

    await pool.query("UPDATE reviews SET isFlagged = 0 WHERE id = ?", [req.params.id]);
    res.json({ message: "Review has been unflagged successfully" });
  } catch (err) {
    console.error("Error unflagging review:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}); Has try catch but could be used later*/
app.patch("/restaurant/review/:id/unflag", (req, res) => {
  const review = reviews.find(r => r.id === parseInt(req.params.id));
  if (!review) return res.status(404).json({ error: "Review not found" });

  review.isFlagged = false;
  res.json({ message: "Review passed investigation" });
});
//#endregion

/* Under construction - Google Places API integration
   - This code is commented out to avoid using an expired API key. 
    - Uncomment and replace the API key with a valid one when ready to use.
app.get('/api/restaurants', async (req, res) => {
  const { zip, radius } = req.query;

  //KEY IS EXPIRED DO NOT USE
  //const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyDYNBpj2XKkjwEkTmfyVf1mW-MAIfrFWVI'; 

  console.log(`Received request to find restaurants near zip: ${zip}, radius: ${radius}`);

  try {
      // Convert zip code to lat/lng
      const geoResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${apiKey}`);
      console.log('Geocoding response:', geoResponse.data);

      if (geoResponse.data.results.length === 0) {
          return res.status(404).send('Invalid zip code');
      }

      const location = geoResponse.data.results[0].geometry.location;
      const { lat, lng } = location;

      console.log(`Geocoded location: lat=${lat}, lng=${lng}`);

      let restaurants = [];
      let nextPageToken = '';
      let keepFetching = true;

      // Fetch all restaurant locations within the specified radius
      while (keepFetching) {
          const restaurantResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius * 1609.34}&type=restaurant&key=${apiKey}&pagetoken=${nextPageToken}`);
          console.log('Restaurants response:', restaurantResponse.data);

          restaurants = restaurants.concat(restaurantResponse.data.results);

          nextPageToken = restaurantResponse.data.next_page_token;

          if (!nextPageToken) {
              keepFetching = false;
          } else {
              await new Promise(resolve => setTimeout(resolve, 2000));
          }
      }

      // Fetch details for each restaurant to get hours of operation
      const detailedRestaurants = await Promise.all(restaurants.map(async (restaurant) => {
          const detailsResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${restaurant.place_id}&fields=name,formatted_address,opening_hours&key=${apiKey}`);
          const details = detailsResponse.data.result;

          if (details.opening_hours && details.opening_hours.weekday_text) {
              return {
                  name: details.name,
                  address: details.formatted_address,
                  hours: details.opening_hours.weekday_text,
              };
          }

          return null; // Filter out restaurants with no operational hours
      }));

      console.log(`Total restaurants inside ${radius} miles for your zip code: ${restaurants.length}`);

      const operationalRestaurants = detailedRestaurants.filter(restaurant => restaurant !== null);

      res.json(operationalRestaurants);
  } catch (error) {
      console.error('Error fetching restaurants:', error);
      res.status(500).send('Error fetching restaurants');
  }
});
*/
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
