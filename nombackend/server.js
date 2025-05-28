const bcrypt = require("bcryptjs");
const express = require("express");
const session = require("express-session");
const app = express();
// const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const axios = require("axios"); // For Google Places API
const sendEmail = require("./smtp"); // Your custom SMTP module
const cors = require("cors"); // For CORS handling
const { body, validationResult } = require("express-validator");
const usersClass = require("./models/Users"); 
const addressClass = require("./models/Address");
const restaurantClass = require("./models/Restaurant");
const reviewClass = require("./models/Review");
require("dotenv").config(); 
// const User = require("./models/user"); // Not used if using direct SQL queries
const  DAL  = require('./DAL/mssqlDal')

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
  let { username, email, password, imgUrl } = req.body;
  // Basic validation
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Username, email and password are required" });
  }
  if(!imgUrl){
    imgUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  }

  try {
    let checkEmail = await usersClass.checkEmailExists(email);
    if (!checkEmail) {
      const newUser = await usersClass.createUser({
        username,
        email,
        password,
        imgUrl,
        is_Admin: false,
        rank: 0,
      });
      res
        .status(201)
        .json({ message: "User registered successfully", userId: newUser.id });
    } else {
      return res.status(409).json({ error: "Email already exists" });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/editprofile", async (req, res) => {
  const { userId, username, email, firstName, lastName, password } = req.body;

  if (!userId || !username || !email) {
    return res.status(400).json({ error: "User ID, username, and email are required" });
  }

  try {
    const user = await usersClass.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Optional: check if email is changing and already in use by another user
    if (email !== user.email) {
      const emailExists = await usersClass.checkEmailExists(email);
      if (emailExists) {
        return res.status(409).json({ error: "Email is already in use" });
      }
    }

    // Build update data object
    const updatedData = {
      username,
      email,
      firstName: firstName || "",
      lastName: lastName || "",
    };

    if (password && password.length >= 8) {
      updatedData.password = password; // Hash inside DAL ideally
    }

    const updatedUser = await usersClass.updateUser(userId, updatedData);

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      },
    });
  } catch (error) {
    console.error("Error during profile update:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ 
      success: false,
      message: "Username and password are required" 
    });
  }

  try {
    const user = await usersClass.getUserByUsername(username);
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    // Successful login
    res.status(200).json({ 
      success: true,
      message: "Logged in successfully",
      user: {
        id: user.id,
        username: user.username
        // Add any other non-sensitive user data you need
      }
    });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
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
});

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
});

//update user, normal endpoint for when user is updating themselves
app.put("/user/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, password, imgUrl } = req.body;

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
      imgUrl: imgUrl ? imgUrl : user.imgUrl
    });

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//edit user endpoint
app.put("/admin/editUser/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, is_Admin, rank, imgUrl } = req.body;

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
      rank,
      imgUrl: imgUrl ? imgUrl : user.imgUrl
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

app.get("/restaurantlist", async (req, res) => {
  let dummyRestaurants = await DAL.getRestaurants();

  console.log(dummyRestaurants)

  res.json(dummyRestaurants);
});
//Restaurant endpoints, edit them if you'd like as I know some already exist -ZK
app.get("/restaurant", async (req, res) => {
  try {
    const restaurants = await restaurantClass.getAll();
    res.json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
});

app.post("/restaurant", async (req, res) => {
  const { name, img_Url, description, price_Range, cuisine_Type, operating_Hours, hidden_Gem, mom_And_Pop, nook_And_Cranny, is_Flagged } = req.body;
  const { name_Street, number_Street, suite, city, state, zip_Code, country } = req.body;

  if (!name || !img_Url || !description || !price_Range || !operating_Hours || !cuisine_Type || !name_Street || !number_Street || !city || !state || !zip_Code || hidden_Gem === undefined || mom_And_Pop === undefined || nook_And_Cranny === undefined || is_Flagged === undefined || !country) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    //create address, this ensures that when a user goes through the process of creating a restaurant,
    //the details they put for the address is created first so that it can be placed as an id.
    await addressClass.create({
      name_Street,
      number_Street,
      suite,
      city,
      state,
      zip_Code,
      country,
    });
    const address_Id = (await addressClass.getFromAddress({ name_Street, number_Street, suite, city, state, zip_Code, country })).getAddressId();
    await restaurantClass.create({
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
      is_Flagged,
    });
    const newRestaurantWithId = await restaurantClass.getByAddressId(address_Id);
    res.status(201).json(newRestaurantWithId);
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/restaurant/:id", async (req, res) => {
  const { id } = req.params;
  const { name, img_Url, description, price_Range, cuisine_Type, operating_Hours, hidden_Gem, mom_And_Pop, nook_And_Cranny, is_Flagged } = req.body;
  const { name_Street, number_Street, suite, city, state, zip_Code, country } = req.body;
  if (!name || !img_Url || !description || !price_Range || !cuisine_Type || !name_Street || !number_Street || !suite || !city || !state || !zip_Code || !country || hidden_Gem === undefined || mom_And_Pop === undefined || nook_And_Cranny === undefined || is_Flagged === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    // Update address first, then restaurant
    const address = await addressClass.getFromAddress({ name_Street, number_Street, suite, city, state, zip_Code, country });
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }
    const address_Id = address.getAddressId();
    await addressClass.update({ address_Id, name_Street, number_Street, suite, city, state, zip_Code, country });
    const restaurant = await restaurantClass.get(id);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    const updatedRestaurant = await restaurantClass.update({
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
      is_Flagged,
    });
    res.json({
      message: "Restaurant updated successfully",
      restaurant: updatedRestaurant,
    });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
});

//reviews endpoints
//this one has a query, so if you're searching for a specific review by a user or restaurant or both then use it in the query
app.get("/review", async (req, res) => {
  const restaurant_Id = req.query.restaurant_Id;
  const user_Id = req.query.user_Id;
  try {
    let reviews;
    if (restaurant_Id && user_Id) {
      reviews = await reviewClass.getByUserIdAndRestaurantId({
        user_Id,
        restaurant_Id,
      });
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
});

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
});

app.post("/review", async (req, res) => {
  const { user_Id, restaurant_Id, rating, review, is_Flagged } = req.body;
  if (
    !user_Id ||
    !restaurant_Id ||
    !rating ||
    !review ||
    is_Flagged === undefined
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const newReview = await reviewClass.create({
      user_Id,
      restaurant_Id,
      rating,
      review,
      is_Flagged,
    });
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/review/:id", async (req, res) => {
  const { id } = req.params;
  const { rating, review, is_Flagged } = req.body;
  if (!rating || !review || is_Flagged === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const updatedReview = await reviewClass.update({
      reviewId: id,
      rating,
      review,
      is_Flagged,
    });
    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json({ message: "Review updated successfully", review: updatedReview });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
});

//     res.json(restaurants);
//   } catch (err) {
//     res.status(500).json({ error: "Server error fetching restaurants" });
//   }
// });
// }
// );

//SOMETHING ALSO DELETED THE ADDRESS GET ENDPOINTS WTF -zk
app.get("/address", async (req, res) => {
  try {
    const addresses = await addressClass.getAll();
    res.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
});

app.put("/address/:id", async (req, res) => {
  const { id } = req.params;
  const { name_Street, number_Street, suite, city, state, zipCode } = req.body;
  if (!name_Street || !number_Street || !suite || !city || !state || !zipCode) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const updatedAddress = await addressClass.update({ id, name_Street, number_Street, suite, city, state, zipCode });
    if (!updatedAddress) {
      return res.status(404).json({ error: "Address not found" });
    }
    res.json({
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
});

//
//SOMETHING DELETED THE ENTIRETY OF REVIEW ENDPOINTS IM PISSED OFF -zk
//

app.get("/review", async (req, res) => {
  try {
    const reviews = await reviewClass.getAll();
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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

app.get("/review/restaurant/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const reviews = await reviewClass.getByRestaurantId(restaurantId);
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ error: "No reviews found for this restaurant" });
    }
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/review/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const reviews = await reviewClass.getByUserId(userId);
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ error: "No reviews found for this user" });
    }
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
);

app.get("/review/user/:userId/restaurant/:restaurantId", async (req, res) => {
  const { userId, restaurantId } = req.params;
  try {
    const reviews = await reviewClass.getByUserIdAndRestaurantId(userId, restaurantId);
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ error: "No reviews found for this user and restaurant" });
    }
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
);

app.post("/review", async (req, res) => {
  const { user_Id, restaurant_Id, rating, review, is_Flagged } = req.body;

  if (!user_Id || !restaurant_Id || !rating || !review) {
    return res.status(400).json({ error: "User ID, restaurant ID, rating and review are required" });
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

  if (!rating || !review) {
    return res.status(400).json({ error: "Rating and review are required" });
  }

  try {
    const updatedReview = await reviewClass.update({ review_Id: id, rating, review, is_Flagged });
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

// Mock data for testing
app.put("/restaurant/review/:id", (req, res) => {
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
    otherNotes,
    operatingHours,
    userReview,
    isFlagged,
    ratingValue
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
  review.ratingValue = ratingValue || review.ratingValue // Update ratingValue only if it's a number

  // Update isFlagged only if it's passed and is a boolean
  if (typeof isFlagged === "boolean") {
    review.isFlagged = isFlagged;
  }

  // Return the updated review as response
  res.json({ message: "Review updated successfully", data: review });
});

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

app.get("/api/top-restaurants", async (req, res) => {
  const { zip, radius = 25 } = req.query;
  const apiKey = process.env.GOOGLE_API_KEY;
  const radiusMeters = radius * 1609.34;

  if (!zip) {
    return res.status(400).json({ error: "Zip code is required" });
  }

  try {
    // 1. Get lat/lng for zip code
    const geoResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${apiKey}`
    );
    if (geoResponse.data.results.length === 0) {
      return res.status(404).json({ error: "Invalid zip code" });
    }
    const { lat, lng } = geoResponse.data.results[0].geometry.location;

    // 2. Get restaurants using Places API v1 with includedPrimaryTypes
    const foodTypes = [
      "restaurant",
      "cafe",
      "bar",
      "bakery",
      "meal_delivery",
      "meal_takeaway",
      "night_club",
    ];

    const placesResponse = await axios.post(
      `https://places.googleapis.com/v1/places:searchNearby?key=${apiKey}`,
      {
        includedPrimaryTypes: foodTypes,
        languageCode: "en",
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: radiusMeters,
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask":
            "places.displayName,places.formattedAddress,places.primaryType",
        },
      }
    );

    const googleRestaurants = placesResponse.data.places || [];

    // 3. Match Google restaurants with your reviews by name
    const matched = [];
    const usedNames = new Set();

    for (const gRest of googleRestaurants) {
      const name = gRest.displayName?.text || "";
      const nameKey = name.trim().toLowerCase();
      if (!nameKey || usedNames.has(nameKey)) continue;

      const match = reviews.filter(
        (r) => r.restaurantName.toLowerCase() === nameKey
      );

      if (match.length > 0) {
        const avgRating =
          match.reduce((sum, r) => sum + (r.ratingValue || r.rating || 0), 0) /
          match.length;

        matched.push({
          name,
          address: gRest.formattedAddress,
          avgRating,
          reviewCount: match.length,
          imageUrl: match[0].imageUrl || null,
          primaryType: gRest.primaryType || null,
        });
        usedNames.add(nameKey);
      }
    }

    // Fill up to 4 with closest Google restaurants not already in matched
    const result = [...matched];
    const seenNames = new Set(matched.map(r => r.name.trim().toLowerCase()));

    for (const r of googleRestaurants) {
      const name = r.displayName?.text || "";
      const nameKey = name.trim().toLowerCase();
      if (!nameKey || seenNames.has(nameKey)) continue;

      result.push({
        name,
        address: r.formattedAddress,
        avgRating: null,
        reviewCount: 0,
        imageUrl: null,
        primaryType: r.primaryType || null,
      });

      seenNames.add(nameKey);
      if (result.length === 4) break;
    }

    res.json(result.slice(0, 4));
  } catch (error) {
    console.error(
      "Error fetching top restaurants:",
      error?.response?.data || error.message
    );
    res.status(500).json({ error: "Error fetching top restaurants" });
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
