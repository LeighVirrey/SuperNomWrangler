import React, { useState, useEffect } from "react";
import "./restaurantList.css"; // <-- Import the separate CSS file

const RestaurantList = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("http://localhost:4000/restaurantlist", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
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
        <h1 className="mainheader">RESTAURANTS</h1>
        <div className="rest-list-item">
          {filteredRestaurants.map((restaurant, index) => (
            <div key={restaurant.id} className="restaurant-card">

              <div
                className="singleRest"
                style={{
                  flexDirection: index % 2 === 0 ? "row" : "row-reverse",
                }}
              >

                <img
                  className="restImg"
                  style={{margin: index % 2 === 0 ? "0px 15px 0px 0px" : "0px 0px 0px 15px",}}
                  src={restaurant.image}
                  alt={restaurant.name}
                />
                <br />
                <div className="restDetails" style={{
                  backgroundColor: index % 2 === 0 ? "#f46036" : "#1695a3",
                  alignItems: index % 2 === 0 ? "flex-start" : "flex-end",
                }}>
                  <h1>{restaurant.name}</h1>
                  <h2>{restaurant.address}</h2>
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
          <div className="scroll-to-top-icon"></div>
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
