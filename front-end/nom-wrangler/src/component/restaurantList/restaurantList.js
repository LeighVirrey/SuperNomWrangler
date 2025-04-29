import React, { useState } from "react";


const dummyRestaurants = [
    { id: 1, name: "Restaurant Name", address: "28 S State St #10, Salt Lake City, UT 84111", description: "Description Description Description Description Description Description Description Description", color: "cyan" },
    { id: 2, name: "Restaurant Name", address: "28 S State St #10, Salt Lake City, UT 84111", description: "Description Description Description Description Description Description Description Description", color: "orange" },
    { id: 3, name: "Restaurant Name", address: "28 S State St #10, Salt Lake City, UT 84111", description: "Description Description Description Description Description Description Description Description", color: "cyan" },
    { id: 4, name: "Restaurant Name", address: "28 S State St #10, Salt Lake City, UT 84111", description: "Description Description Description Description Description Description Description Description", color: "orange" },
    { id: 5, name: "Restaurant Name", address: "28 S State St #10, Salt Lake City, UT 84111", description: "Description Description Description Description Description Description Description Description", color: "cyan" },
];

const RestaurantList = () => {
    const [search, setSearch] = useState("");

    return (
        <div className="restaurant-list">
            {/* Top Logo and Links */}
            <div className="top-bar">
                <img src="/logo-placeholder.png" alt="Logo" className="logo" />
                <div className="nav-links">
                    <a href="#">HOME</a>
                    <a href="#">MAP</a>
                    <a href="#">PROFILE</a>
                    <a href="#">LOGOUT</a>
                </div>
            </div>

            {/* Search Section */}
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-bar"
                />
                <div className="search-options">
                    <div className="search-option">search option</div>
                    <div className="search-option">search option</div>
                    <div className="search-option">search option</div>
                </div>
            </div>

            {/* Restaurant List */}
            <div className="restaurants">
                <h2 className="restaurants-title">RESTAURANTS</h2>

                {dummyRestaurants.map((restaurant) => (
                    <div key={restaurant.id} className={`restaurant-card ${restaurant.color}`}>
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
            <div className="scroll-to-top">↑</div>
        </div>
    );
};

export default RestaurantList;
