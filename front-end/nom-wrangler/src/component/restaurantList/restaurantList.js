import React, { useState, useEffect } from "react";
import "./restaurantList.css";

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [search, setSearch] = useState("");
    const [showScrollButton, setShowScrollButton] = useState(false);

    useEffect(() => {
        // Fetch initial data
        fetchRestaurants();

        const handleScroll = () => {
            setShowScrollButton(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        // Debounced search fetch
        const delayDebounce = setTimeout(() => {
            fetchRestaurants(search);
        }, 200); // 200ms debounce delay

        return () => clearTimeout(delayDebounce);
    }, [search]);

    const fetchRestaurants = async (query = "") => {
        try {
            const url = query
                ? `http://localhost:3001/api/restaurants?search=${encodeURIComponent(query)}`
                : `http://localhost:3001/api/restaurants`;

            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch restaurants");

            const data = await response.json();
            setRestaurants(data);
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    return (
        <div className="restaurant-list">
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search by name or address..."
                    value={search}
                    onChange={handleSearchChange}
                    className="search-bar"
                />
            </div>

            <div className="restaurants">
                <h2 className="restaurants-title">RESTAURANTS NEAR YOU</h2>
                {restaurants.map((restaurant, index) => (
                    <div
                        key={restaurant.id}
                        className={`restaurant-card ${restaurant.color || "cyan"} ${index % 2 === 1 ? "reverse" : ""}`}
                    >
                        <div className="restaurant-image">
                            <div className="image-placeholder" />
                        </div>
                        <div className="restaurant-info">
                            <h3>{restaurant.name}</h3>
                            <p className="address">{restaurant.address}</p>
                            <p className="description">{restaurant.description}</p>
                        </div>
                    </div>
                ))}
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
