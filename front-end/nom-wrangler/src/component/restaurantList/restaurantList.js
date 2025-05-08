import React, { useEffect, useState } from "react";
import axios from "axios";

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [location, setLocation] = useState(null);

    useEffect(() => {
        // Get current location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (err) => {
                setError("Unable to retrieve location.");
                setLoading(false);
            }
        );
    }, []);

    useEffect(() => {
        if (!location) return;

        const fetchRestaurants = async () => {
            try {
                const response = await axios.get(`/api/restaurants`, {
                    params: {
                        lat: location.lat,
                        lng: location.lng,
                        radius: 25, // in miles
                    },
                });
                setRestaurants(response.data);
            } catch (err) {
                setError("Failed to load restaurants.");
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, [location]);

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

    return (
        <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
                <div
                    key={restaurant._id}
                    className="border rounded-2xl p-4 shadow hover:shadow-lg transition"
                >
                    <h2 className="text-xl font-semibold">{restaurant.name}</h2>
                    <p className="text-gray-600">{restaurant.address}</p>
                    <p className="text-sm text-green-600">
                        {restaurant.distance?.toFixed(1)} miles away
                    </p>
                    {/* Optional: Add tags, ratings, etc. */}
                </div>
            ))}
        </div>
    );
};

export default RestaurantList;
