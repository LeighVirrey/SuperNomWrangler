const bcrypt = require("bcryptjs");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const axios = require("axios"); // For Google Places API
const sendEmail = require("./smtp"); // Your custom SMTP module
const cors = require("cors"); // For CORS handling
const usersClass = require("./models/Users"); 
const addressClass = require("./models/Address");
const restaurantClass = require("./models/Restaurant");
const reviewClass = require("./models/Review");
require("dotenv").config(); 

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
// Middleware setup
app.use(express.json());
app.use(cookieParser());

app.get("/", async (req, res) => {
  res.json({ message: "Nomnomshark" });
});
// Registration endpoint
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email and password are required" });
  }

  try {
    let checkEmail = await usersClass.checkEmailExists(email);
    if (!checkEmail) {
      const newUser = await usersClass.createUser({
        username,
        email,
        password,
        is_Admin: false,
        rank: 0
      });
      res.status(201).json({ message: "User registered successfully", userId: newUser.id });
    }
    else {
      return res.status(409).json({ error: "Email already exists" });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login endpoint
app.get("/login", async (req, res) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email and password are required" });
  }
  try {
    const checkUser = await usersClass.checkEmailExists(email);
    if (!checkUser) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = await usersClass.getUserById(checkUser);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/user", async (req, res) => {
  try {
    const users = await usersClass.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
);

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await usersClass.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
);

//update user, normal endpoint for when user is updating themselves
app.put("/user/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: "Username and email are required" });
  }

  try {
    const user = await usersClass.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user details
    const updatedUser = await usersClass.updateUser(id, {
      username,
      email,
      password: password ? await bcrypt.hash(password, 10) : user.password,
    });

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
);

//edit user endpoint
app.put("/admin/editUser/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, is_Admin, rank } = req.body;

  if (!username || !email || is_Admin === undefined || rank === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await usersClass.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user details
    const updatedUser = await usersClass.updateUser(id, {
      username,
      email,
      is_Admin,
      rank
    });

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await usersClass.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await usersClass.deleteUser(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/restaurants', async (req, res) => {
  const { lat, lng, radius = 25 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing latitude or longitude" });
  }

  const userLocation = {
    type: "Point",
    coordinates: [parseFloat(lng), parseFloat(lat)],
  };

  try {
    const restaurants = await Restaurant.find({
      location: {
        $near: {
          $geometry: userLocation,
          $maxDistance: radius * 1609.34, // miles to meters
        },
      },
    });

    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching restaurants" });
  }
}
);


//Restaurant endpoints, edit them if you'd like as I know some already exist -ZK
app.get("/restaurant", async (req, res) => {
  try {
    const restaurants = await restaurantClass.getAll();
    res.json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
);

app.get("/restaurant/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await restaurantClass.get(id);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
);

app.post("/restaurant", async (req, res) => {
  const { name, img_Url, description, price_Range, cuisine_Type, operating_Hours, hidden_Gem, mom_And_Pop, nook_And_Cranny, is_Flagged } = req.body;
  const { name_Street, suite, city, state, zip_Code, country } = req.body;

  if (!name || !img_Url || !description || !price_Range || !operating_Hours || !cuisine_Type || !name_Street || !city || !state || !zip_Code || hidden_Gem === undefined || mom_And_Pop === undefined || nook_And_Cranny === undefined || is_Flagged === undefined || !country) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    //create address, this ensures that when a user goes through the process of creating a restaurant,
    //the details they put for the address is created first so that it can be placed as an id.
    await addressClass.create({
      name_Street,
      suite,
      city,
      state,
      zip_Code,
      country
    });
    const address_Id = (await addressClass.getFromAddress({ name_Street, suite, city, state, zip_Code, country })).getAddressId();
    const newRestaurant = await restaurantClass.create({
      name,
      address_Id,
      img_Url,
      description,
      price_Range,
      cuisine_Type,
      operating_Hours,
      hidden_Gem,
      mom_And_Pop,
      nook_And_Cranny,
      is_Flagged
    });

    res.status(201).json(newRestaurant);
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
);

app.put("/restaurant/:id", async (req, res) => {
  const { id } = req.params;
  const { name, img_Url, description, price_Range, cuisine_Type, operating_Hours, hidden_Gem, mom_And_Pop, nook_And_Cranny, is_Flagged } = req.body;
  const { name_Street, suite, city, state, zip_Code, country } = req.body;
  if (!name || !img_Url || !description || !price_Range || !cuisine_Type || !name_Street || !suite || !city || !state || !zip_Code || !country || hidden_Gem === undefined || mom_And_Pop === undefined || nook_And_Cranny === undefined || is_Flagged === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    // Update address first, then restaurant
    const address = await addressClass.getFromAddress({ name_Street, suite, city, state, zip_Code, country });
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }
    const address_Id = address.getAddressId();
    await addressClass.update({ address_Id, name_Street, suite, city, state, zip_Code, country });
    const restaurant = await restaurantClass.get(id);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    const updatedRestaurant = await restaurantClass.update( {
      restaurant_Id: id,
      name,
      address_Id,
      img_Url,
      description,
      price_Range,
      cuisine_Type,
      operating_Hours,
      hidden_Gem,
      mom_And_Pop,
      nook_And_Cranny,
      is_Flagged
    });
    res.json({ message: "Restaurant updated successfully", restaurant: updatedRestaurant });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
);

app.delete("/restaurant/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await restaurantClass.get(id);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    await restaurantClass.delete(id);
    res.json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
);

//reviews endpoints
//this one has a query, so if you're searching for a specific review by a user or restaurant or both then use it in the query
app.get("/review", async (req, res) => {
  const restaurant_Id = req.query.restaurant_Id;
  const user_Id = req.query.user_Id;
  try {
    let reviews;
    if (restaurant_Id && user_Id) {
      reviews = await reviewClass.getByUserIdAndRestaurantId({ user_Id, restaurant_Id });
    } else if (restaurant_Id) {
      reviews = await reviewClass.getByRestaurantId(restaurant_Id);
    } else if (user_Id) {
      reviews = await reviewClass.getByUserId(user_Id);
    } else {
      reviews = await reviewClass.getAll();
    }
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
);

app.get("/review/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const review = await reviewClass.get(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
);

app.post("/review", async (req, res) => {
  const { user_Id, restaurant_Id, rating, review, is_Flagged } = req.body;
  if (!user_Id || !restaurant_Id || !rating || !review || is_Flagged === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const newReview = await reviewClass.create({ user_Id, restaurant_Id, rating, review, is_Flagged });
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
);

app.put("/review/:id", async (req, res) => {
  const { id } = req.params;
  const { rating, review, is_Flagged } = req.body;
  if (!rating || !review || is_Flagged === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const updatedReview = await reviewClass.update({ reviewId: id, rating, review, is_Flagged });
    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json({ message: "Review updated successfully", review: updatedReview });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
);

app.delete("/review/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const review = await reviewClass.get(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    await reviewClass.delete(id);
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
);

app.get("/address", async (req, res) => {
  try {
    const addresses = await addressClass.getAll();
    res.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
);
app.get("/address/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const address = await addressClass.get(id);
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }
    res.json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
);

//disabled since creating a restaurant creates the address, creating a new address itself will not have a matching restaurant -ZK
// app.post("/address", async (req, res) => {
//   const { streetName, suite, city, state, zipCode } = req.body;
//   if (!streetName || !suite || !city || !state || !zipCode) {
//     return res.status(400).json({ error: "All fields are required" });
//   }
//   try {
//     const newAddress = await addressClass.create({ streetName, suite, city, state, zipCode });
//     res.status(201).json(newAddress);
//   } catch (error) {
//     console.error("Error creating address:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }
// );

app.put("/address/:id", async (req, res) => {
  const { id } = req.params;
  const { name_Street, suite, city, state, zipCode } = req.body;
  if (!name_Street || !suite || !city || !state || !zipCode) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const updatedAddress = await addressClass.update({ id, name_Street, suite, city, state, zipCode });
    if (!updatedAddress) {
      return res.status(404).json({ error: "Address not found" });
    }
    res.json({ message: "Address updated successfully", address: updatedAddress });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
);

app.delete("/address/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const address = await addressClass.get(id);
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }
    await addressClass.delete(id);
    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
);

// Logout endpoint - clear the auth cookie
//we probably don't need this anymore -zk
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
    restaurantName: "Pho Real",
    imageUrl: "https://lh3.googleusercontent.com/gps-cs-s/AB5caB_FEWKdmdQVET9381JO8q23Cy2FwZw_Mu6HKdzEXdYwecoyMx-N0O9_EERPG0mIYQqT43eCRCX0rq6Re5s84gbovjlt4fGWyHGWNRkbNtCIFUP-edyelizr2A3_H_VBv9aqRLfc=s1360-w1360-h1020",
    streetName: "Main St",
    streetNumber: "123",
    city: "Austin",
    state: "TX",
    zipCode: "78701",
    country: "USA",
    description: "Great atmosphere and authentic Vietnamese flavors!",
    cuisineTypes: ["Vietnamese", "Asian"],
    diningStyle: "Sit down",
    priceRange: "$$",
    otherNotes: "Wheelchair accessible",
    operatingHours: [{ day: "Monday", open: "10:00", close: "21:00" }],
    userReview: "The pho broth is next level. 10/10!",
    isFlagged: false
  }
];

// let reviewIdCounter = 0;
// let reviews = [];


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


app.get('/api/restaurants', async (req, res) => {
  const { zip, radius } = req.query;
  const apiKey = process.env.GOOGLE_API_KEY; 

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

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
