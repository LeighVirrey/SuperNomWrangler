import React, { useState, useEffect } from "react";
import { Nav } from "../nav/nav";
import App from "../../App";
import "./restaurantList.css"; // Import the stylesheet

const dummyRestaurants = [
    { id: 1, name: "Restaurant Name", address: "28 S State St #10, Salt Lake City, UT 84111", description: "Description Description Description Description Description Description Description Description", color: "cyan" },
    { id: 2, name: "Restaurant Name", address: "28 S State St #10, Salt Lake City, UT 84111", description: "Description Description Description Description Description Description Description Description", color: "orange" },
    { id: 3, name: "Restaurant Name", address: "28 S State St #10, Salt Lake City, UT 84111", description: "Description Description Description Description Description Description Description Description", color: "cyan" },
    { id: 4, name: "Restaurant Name", address: "28 S State St #10, Salt Lake City, UT 84111", description: "Description Description Description Description Description Description Description Description", color: "orange" },
    { id: 5, name: "Restaurant Name", address: "28 S State St #10, Salt Lake City, UT 84111", description: "Description Description Description Description Description Description Description Description", color: "cyan" },
];

const RestaurantList = () => {
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showScrollButton, setShowScrollButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollButton(window.scrollY > 300); // Show after scrolling down a bit
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);

        if (value.trim() !== "") {
            setSuggestions([
                `${value}`,

            ]);
        } else {
            setSuggestions([]);
        }
    };

    return (
        <div className="restaurant-list">
            {/* Search Section */}
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search by city or ZIP..."
                    value={search}
                    onChange={handleSearchChange}
                    className="search-bar"
                />
                <div className="search-options">
                    {suggestions.map((suggestion, index) => (
                        <div key={index} className="search-option">
                            {suggestion}
                        </div>
                    ))}
                </div>
            </div>

            {/* Restaurant List */}
            <div className="restaurants">
                <h2 className="restaurants-title">RESTAURANTS NEAR YOU</h2>
                {dummyRestaurants.map((restaurant, index) => (
                    <div
                        key={restaurant.id}
                        className={`restaurant-card ${restaurant.color} ${index % 2 === 1 ? "reverse" : ""}`}
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

            {/* Scroll To Top Button */}
            {showScrollButton && (
                <div className="scroll-to-top" onClick={scrollToTop}>
                    ↑
                </div>
            )}
            )}
        </div>
    );
};

export default RestaurantList;
