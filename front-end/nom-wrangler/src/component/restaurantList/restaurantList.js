import React, { useState, useEffect } from "react";
import "./restaurantList.css";

const dummyRestaurants = [
  {
    id: 1,
    name: "Cyan Bistro",
    address: "28 S State St #10, Salt Lake City, UT 84111",
    description: "A vibrant spot known for fresh flavors and a bright atmosphere.",
    color: "cyan",
    distance: 1.2,
  },
  {
    id: 2,
    name: "Orange Grove",
    address: "150 W 200 S, Salt Lake City, UT 84101",
    description: "Farm-to-table meals with a citrus twist in a cozy setting.",
    color: "orange",
    distance: 2.7,
  },
  {
    id: 3,
    name: "Cyan Corner",
    address: "75 N Main St, Salt Lake City, UT 84103",
    description: "A favorite for locals, featuring casual dining and bold dishes.",
    color: "cyan",
    distance: 3.4,
  },
  {
    id: 4,
    name: "Orange Flame Grill",
    address: "201 E 400 S, Salt Lake City, UT 84111",
    description: "Spicy grilled specialties and warm vibes await you here.",
    color: "orange",
    distance: 4.1,
  },
  {
    id: 5,
    name: "Cyan Noodle House",
    address: "390 S State St, Salt Lake City, UT 84111",
    description: "Serving hearty noodle bowls and quick bites at great prices.",
    color: "cyan",
    distance: 5.8,
  },
];

const RestaurantList = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim() !== "") {
      setSuggestions([
        `${value}ville`,
        `${value} City`,
        `New ${value}`,
      ]);
    } else {
      setSuggestions([]);
    }
  };

  const filteredRestaurants = dummyRestaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(search.toLowerCase())
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="restaurant-list">
      

      {/* Search Section */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={search}
          onChange={handleSearchChange}
          className="search-bar"
        />
        {suggestions.length > 0 && (
          <div className="search-options">
            {suggestions.map((s, i) => (
              <div key={i} className="search-option">
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Restaurant List */}
      <div className="restaurants">
        <h2 className="restaurants-title">RESTAURANTS</h2>
        <div className="restaurant-grid">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className={`restaurant-card ${restaurant.color}`}
            >
              <div className="image-placeholder" />
              <div>
                <h3>{restaurant.name}</h3>
                <p>{restaurant.address}</p>
                <p>{restaurant.description}</p>
                <p>{restaurant.distance.toFixed(1)} miles away</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll To Top Button */}
      {showScrollButton && (
        <div className="scroll-to-top" onClick={scrollToTop}>
          ↑
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
