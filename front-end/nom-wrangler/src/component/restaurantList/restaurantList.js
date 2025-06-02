import React, { useState, useEffect } from "react";
import "./restaurantList.css";

const RestaurantList = () => {
  const [search, setSearch] = useState("");
  const [zip, setZip] = useState("");
  const [radius] = useState("25"); // Hardcoded radius
  const [restaurants, setRestaurants] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      // Only fetch if zip is empty or 5 digits
      if (zip && zip.length !== 5) {
        setRestaurants([]);
        return;
      }
      try {
        let url = "http://localhost:4000/api/restaurants";
        const params = [];
        if (zip) params.push(`zip=${encodeURIComponent(zip)}`);
        if (radius) params.push(`radius=${encodeURIComponent(radius)}`);
        if (params.length) url += "?" + params.join("&");

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          setRestaurants([]);
          console.error("Invalid zip code or server error");
          return;
        }

        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        setRestaurants([]);
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();

    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [zip, radius]);

  const handleZipChange = (e) => {
    setZip(e.target.value);
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
          placeholder="Enter zip code"
          value={zip}
          onChange={handleZipChange}
          className="search-bar"
          style={{ marginLeft: "10px" }}
        />
        {/* Radius input removed */}
      </div>

      <div className="restaurants">
        <h1 className="mainheader">RESTAURANTS</h1>
        <div className="rest-list-item">
          {filteredRestaurants.map((restaurant, index) => (
            <div
              key={restaurant.id || index}
              className="restaurant-card"
              onClick={() =>
                (window.location.href = `/restaurantDetails/${restaurant.id}`)
              }
            >
              <div
                className="singleRest individual"
                style={{
                  flexDirection: index % 2 === 0 ? "row" : "row-reverse",
                }}
              >
                <img
                  className="restImg pic"
                  style={{
                    margin:
                      index % 2 === 0 ? "0px 15px 0px 0px" : "0px 0px 0px 15px",
                  }}
                  src={restaurant.image || restaurant.imageUrl}
                  alt={restaurant.name}
                />
                <br />
                <div
                  className="restDetails info"
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f46036" : "#1695a3",
                    alignItems: index % 2 === 0 ? "flex-start" : "flex-end",
                  }}
                >
                  <h1>{restaurant.name}</h1>
                  <h2>{restaurant.address}</h2>
                  <p>{restaurant.description}</p>
                  {restaurant.distance && (
                    <p>{restaurant.distance.toFixed(1)} miles away</p>
                  )}
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