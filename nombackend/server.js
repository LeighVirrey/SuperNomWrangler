const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const axios = require("axios"); // For Google Places API
const mysql = require("mysql2/promise"); //need to replace with mssql
const sendEmail = require("./smtp"); // Your custom SMTP module
const cors = require("cors"); // For CORS handling
const { body, validationResult } = require("express-validator");
require("dotenv").config();
// const User = require("./models/user"); // Not used if using direct SQL queries


app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
// Middleware setup
app.use(express.json());
app.use(cookieParser());

//#region - Should be moveed to a env file
// Create a MySQL connection pool
const pool = mysql.createPool({
  host: "localhost", // update to your host
  user: "your_mysql_username", // update with your username
  password: "your_mysql_password", // update with your password
  database: "your_database_name", // update with your database name
});

// JWT secret key (In production, store this in environment variables)
const JWT_SECRET = "YOUR_SECRET_KEY";
//#endregion

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
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Hash the user password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    await pool.query("INSERT INTO users (email, password) VALUES (?, ?)", [
      email,
      hashedPassword,
    ]);

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
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
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
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the token in an HTTP-only cookie
    res.cookie("token", token, { httpOnly: true });

    res.json({ message: "Logged in successfully" });
  } catch (error) {
    console.error("Error during login:", error);
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

let reviewIdCounter = 1;

const reviews = [
  {
    id: reviewIdCounter++, 
    imageUrl: "https://example.com/image.jpg",
    restaurantName: "Sushi Place",
    streetName: "Main St",
    streetNumber: "123",
    city: "Tokyo",
    state: "TK",
    zipCode: "12345",
    country: "USA",
    description: "Best sushi in town!",
    cuisineTypes: ["Japanese"],
    diningStyle: "Sit down",
    priceRange: "option1",
    extraText: "Great ambiance",
    operatingHours: [
      { day: "Monday", hours: "10:00 AM - 10:00 PM" },
      { day: "Tuesday", hours: "10:00 AM - 10:00 PM" },
    ],
    reviewText: "Amazing food and service!",
    ratingValue: 5,
    isFlagged: false,
  },
];

// Endpoint to submit a restaurant review
// Mock data for testing
app.post(
  "/restaurant/review",
  [
    // Restaurant Name: required, 2-100 chars, letters/numbers/spaces/.'-&
    body("restaurantName")
      .trim()
      .matches(/^[\w\s.'&-]{2,100}$/)
      .withMessage(
        "Restaurant name must be 2-100 characters and contain only letters, numbers, spaces, .'-&"
      ),

    // Description: required, 1-1000 chars, no < or >
    body("description")
      .trim()
      .matches(/^[^<>]{1,1000}$/)
      .withMessage(
        "Description must be 1-1000 characters and cannot contain < or >"
      ),

    // Cuisine Types: required, must be array of allowed values
    body("cuisineTypes")
      .isArray({ min: 1 })
      .withMessage("At least one cuisine type is required")
      .custom((arr) =>
        arr.every((type) =>
          ["Japanese", "Chinese", "German", "Italian", "Mexican"].includes(type)
        )
      )
      .withMessage("Invalid cuisine type(s)"),

    // Dining Style: required, must be one of allowed values
    body("diningStyle")
      .isIn(["Sit down", "Fast Food", "Cafe", "Buffet", "Takeout"])
      .withMessage("Dining style is invalid"),

    // Price Range: required, must be one of allowed options
    body("priceRange")
      .isIn(["option1", "option2", "option3"])
      .withMessage("Price range is invalid"),

    // Street Name: required, 2-100 chars, letters/numbers/spaces/.'-&
    body("streetName")
      .trim()
      .matches(/^[\w\s.'&-]{2,100}$/)
      .withMessage(
        "Street name must be 2-100 characters and contain only letters, numbers, spaces, .'-&"
      ),

    // Street Number: required, 1-10 chars, numbers/letters
    body("streetNumber")
      .trim()
      .matches(/^[\w\s-]{1,10}$/)
      .withMessage(
        "Street number must be 1-10 characters and contain only letters, numbers, spaces, or -"
      ),

    // City: required, 2-50 chars, letters/spaces/.'-&
    body("city")
      .trim()
      .matches(/^[a-zA-Z\s.'&-]{2,50}$/)
      .withMessage(
        "City must be 2-50 characters and contain only letters, spaces, .'-&"
      ),

    // State: required, 2 uppercase letters
    body("state")
      .trim()
      .matches(/^[A-Z]{2}$/)
      .withMessage("State must be a 2-letter abbreviation (e.g., TX)"),

    // Zip Code: required, 5 digits or ZIP+4
    body("zipCode")
      .trim()
      .matches(/^\d{5}(-\d{4})?$/)
      .withMessage("Zip code must be valid (e.g., 12345 or 12345-6789)"),

    // Country: required, must be USA
    body("country").equals("USA").withMessage("Country must be USA"),

    // Review Text: required, 1-1000 chars, no < or >
    body("reviewText")
      .trim()
      .matches(/^[^<>]{1,1000}$/)
      .withMessage(
        "Review must be 1-1000 characters and cannot contain < or >"
      ),

    // Extra Text: optional, 0-1000 chars, no < or >
    body("extraText")
      .optional()
      .trim()
      .matches(/^[^<>]{0,1000}$/)
      .withMessage("Extra text cannot contain < or >"),

    // Operating Hours: optional, must be valid JSON array or string
    body("operatingHours")
      .optional()
      .custom((value) => {
        try {
          const arr = typeof value === "string" ? JSON.parse(value) : value;
          return Array.isArray(arr);
        } catch {
          return false;
        }
      })
      .withMessage("Operating hours must be a valid array"),

    // Rating: required, integer 1-5
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be an integer between 1 and 5"),

    // Image URL: optional, must be a valid URL if present
    body("imageUrl").optional().isURL().withMessage("Image URL must be valid"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
      extraText,
      operatingHours,
      reviewText,
      ratingValue,
    } = req.body;

    // Check if the restaurant name already exists in the reviews array
    const existingRestaurant = reviews.find(
      (review) =>
        review.restaurantName.toLowerCase() === restaurantName.toLowerCase()
    );

    // If the restaurant is new and no imageUrl is provided, return an error
    if (!existingRestaurant && !imageUrl) {
      return res.status(400).json({
        error: "First review for a restaurant must include an image URL.",
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
      extraText,
      operatingHours: JSON.parse(operatingHours || "[]"),
      reviewText,
      ratingValue,
      isFlagged: false,
    };

    reviews.push(newReview);
    res.status(201).json(newReview);
  }
);

// Get all reviews for the restaurant

// Mock data for testing
app.get("/restaurant/reviews", (req, res) => {
  res.json(reviews);
});

// Get a single review for the restaurant
// Mock data for testing
app.get("/restaurant/review/:id", (req, res) => {
  const review = reviews.find((r) => r.id === parseInt(req.params.id));
  if (!review) return res.status(404).json({ error: "Review not found" });
  res.json(review);
});

// Allows user to update any review (only if they are the author of the review)
// Mock data for testing
app.put(
  "/restaurant/review/:id",
  [
    // Restaurant Name: required, 2-100 chars, letters/numbers/spaces/.'-&
    body("restaurantName")
      .trim()
      .matches(/^[\w\s.'&-]{2,100}$/)
      .withMessage(
        "Restaurant name must be 2-100 characters and contain only letters, numbers, spaces, .'-&"
      ),

    // Description: required, 1-1000 chars, no < or >
    body("description")
      .trim()
      .matches(/^[^<>]{1,1000}$/)
      .withMessage(
        "Description must be 1-1000 characters and cannot contain < or >"
      ),

    // Cuisine Types: required, must be array of allowed values
    body("cuisineTypes")
      .isArray({ min: 1 })
      .withMessage("At least one cuisine type is required")
      .custom((arr) =>
        arr.every((type) =>
          ["Japanese", "Chinese", "German", "Italian", "Mexican"].includes(type)
        )
      )
      .withMessage("Invalid cuisine type(s)"),

    // Dining Style: required, must be one of allowed values
    body("diningStyle")
      .isIn(["Sit down", "Fast Food", "Cafe", "Buffet", "Takeout"])
      .withMessage("Dining style is invalid"),

    // Price Range: required, must be one of allowed options
    body("priceRange")
      .isIn(["option1", "option2", "option3"])
      .withMessage("Price range is invalid"),

    // Street Name: required, 2-100 chars, letters/numbers/spaces/.'-&
    body("streetName")
      .trim()
      .matches(/^[\w\s.'&-]{2,100}$/)
      .withMessage(
        "Street name must be 2-100 characters and contain only letters, numbers, spaces, .'-&"
      ),

    // Street Number: required, 1-10 chars, numbers/letters
    body("streetNumber")
      .trim()
      .matches(/^[\w\s-]{1,10}$/)
      .withMessage(
        "Street number must be 1-10 characters and contain only letters, numbers, spaces, or -"
      ),

    // City: required, 2-50 chars, letters/spaces/.'-&
    body("city")
      .trim()
      .matches(/^[a-zA-Z\s.'&-]{2,50}$/)
      .withMessage(
        "City must be 2-50 characters and contain only letters, spaces, .'-&"
      ),

    // State: required, 2 uppercase letters
    body("state")
      .trim()
      .matches(/^[A-Z]{2}$/)
      .withMessage("State must be a 2-letter abbreviation (e.g., TX)"),

    // Zip Code: required, 5 digits or ZIP+4
    body("zipCode")
      .trim()
      .matches(/^\d{5}(-\d{4})?$/)
      .withMessage("Zip code must be valid (e.g., 12345 or 12345-6789)"),

    // Country: required, must be USA
    body("country").equals("USA").withMessage("Country must be USA"),

    // Review Text: required, 1-1000 chars, no < or >
    body("reviewText")
      .trim()
      .matches(/^[^<>]{1,1000}$/)
      .withMessage(
        "Review must be 1-1000 characters and cannot contain < or >"
      ),

    // Extra Text: optional, 0-1000 chars, no < or >
    body("extraText")
      .optional()
      .trim()
      .matches(/^[^<>]{0,1000}$/)
      .withMessage("Extra text cannot contain < or >"),

    // Operating Hours: optional, must be valid JSON array or string
    body("operatingHours")
      .optional()
      .custom((value) => {
        try {
          const arr = typeof value === "string" ? JSON.parse(value) : value;
          return Array.isArray(arr);
        } catch {
          return false;
        }
      })
      .withMessage("Operating hours must be a valid array"),

    // Rating: required, integer 1-5
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be an integer between 1 and 5"),

    // Image URL: optional, must be a valid URL if present
    body("imageUrl").optional().isURL().withMessage("Image URL must be valid"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Find the review by ID
    const review = reviews.find((r) => r.id === parseInt(req.params.id));

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
      extraText,
      operatingHours,
      reviewText,
      ratingValue,
      isFlagged,
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
    review.extraText = extraText || review.extraText;
    review.operatingHours = operatingHours || review.operatingHours;
    review.reviewText = reviewText || review.reviewText;
    review.ratingValue = ratingValue || review.ratingValue;

    // Update isFlagged only if it's passed and is a boolean
    if (typeof isFlagged === "boolean") {
      review.isFlagged = isFlagged;
    }

    // Return the updated review as response
    res.json({ message: "Review updated successfully", data: review });
  }
);

// Remove any review (Admin only)
// Mock data for testing
app.delete("/restaurant/review/:id", (req, res) => {
  const index = reviews.findIndex((r) => r.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Review not found" });

  reviews.splice(index, 1);
  res.json({ message: "Review deleted successfully" });
});

// Flag a review for investigation (Admin and certain ranks only)
// Mock data for testing
app.patch("/restaurant/review/:id/flag", (req, res) => {
  const review = reviews.find((r) => r.id === parseInt(req.params.id));
  if (!review) return res.status(404).json({ error: "Review not found" });

  review.isFlagged = true;
  res.json({ message: "Review has been flagged for investigation" });
});

//To Unflag a review (Admin only)
// Mock data for testing
app.patch("/restaurant/review/:id/unflag", (req, res) => {
  const review = reviews.find((r) => r.id === parseInt(req.params.id));
  if (!review) return res.status(404).json({ error: "Review not found" });

  review.isFlagged = false;
  res.json({ message: "Review passed investigation" });
});
//#endregion

app.get("/api/restaurants", async (req, res) => {
  const { zip, radius } = req.query;
  const apiKey = process.env.GOOGLE_API_KEY;

  console.log(
    `Received request to find restaurants near zip: ${zip}, radius: ${radius}`
  );

  try {
    // Convert zip code to lat/lng
    const geoResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${apiKey}`
    );
    console.log("Geocoding response:", geoResponse.data);

    if (geoResponse.data.results.length === 0) {
      return res.status(404).send("Invalid zip code");
    }

    const location = geoResponse.data.results[0].geometry.location;
    const { lat, lng } = location;

    console.log(`Geocoded location: lat=${lat}, lng=${lng}`);

    let restaurants = [];
    let nextPageToken = "";
    let keepFetching = true;

    // Fetch all restaurant locations within the specified radius
    while (keepFetching) {
      const restaurantResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${
          radius * 1609.34
        }&type=restaurant&key=${apiKey}&pagetoken=${nextPageToken}`
      );
      console.log("Restaurants response:", restaurantResponse.data);

      restaurants = restaurants.concat(restaurantResponse.data.results);

      nextPageToken = restaurantResponse.data.next_page_token;

      if (!nextPageToken) {
        keepFetching = false;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    // Fetch details for each restaurant to get hours of operation
    const detailedRestaurants = await Promise.all(
      restaurants.map(async (restaurant) => {
        const detailsResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${restaurant.place_id}&fields=name,formatted_address,opening_hours&key=${apiKey}`
        );
        const details = detailsResponse.data.result;

        if (details.opening_hours && details.opening_hours.weekday_text) {
          return {
            name: details.name,
            address: details.formatted_address,
            hours: details.opening_hours.weekday_text,
          };
        }

        return null; // Filter out restaurants with no operational hours
      })
    );

    console.log(
      `Total restaurants inside ${radius} miles for your zip code: ${restaurants.length}`
    );

    const operationalRestaurants = detailedRestaurants.filter(
      (restaurant) => restaurant !== null
    );

    res.json(operationalRestaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).send("Error fetching restaurants");
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
