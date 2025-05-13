import React, { useState, useEffect } from "react";
import "./restaurantList.css";

const RestaurantList = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    // Fetch data from backend
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("http://localhost:4000/restaurantlist", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        const data = await response.json();
        console.log("DATA: ", data)
        setRestaurants(data);
        
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();

    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setSuggestions([]);
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(search.toLowerCase())
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="home">
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

      <div className="restaurants">
        <h2 className="aboutHeader">RESTAURANTS</h2>
        <div className="reviewers">
          {filteredRestaurants.map((restaurant, index) => (
            <div
              key={restaurant.id}
              className="restaurant-card"
            >
              <div
                className="singleRest"
                style={{
                  flexDirection: index % 2 === 0 ? "row" : "row-reverse",
                  backgroundColor: index % 2 === 0 ? "#f46036" : "#1695a3"
                }}
              >
                <img
                  className="restImg"
                  src={restaurant.image}
                  alt={restaurant.name}
                />
                <div className='restDetails'>
                  <h1>{restaurant.name}</h1>
                  <h2><strong>Address:</strong> {restaurant.address}</h2>
                  <p>{restaurant.description}</p>
                  <p>{restaurant.distance.toFixed(1)} miles away</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showScrollButton && (
        <div className="scroll-to-top" onClick={scrollToTop}>
          ↑
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
