import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./RestaurantDetails.css";

function RestaurantDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/api/restaurants/${id}`)
            .then((response) => response.json())
            .then((data) => setRestaurant(data))
            .catch((error) => console.error("Error fetching restaurant:", error));
    }, [id]);

    const handleLeaveReview = () => {
        navigate(`/leave-review/${id}`);
    };

    if (!restaurant) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="restaurant-details">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="restaurant-image"
                />
                <div className="restaurant-content">
                    <h1 className="restaurant-name">{restaurant.name}</h1>

                    <hr className="sectionDivider" />
                    <div className="restaurant-info">
                        <p><strong>Contact:</strong> {restaurant.contact}</p>
                        <p><strong>Address:</strong> {restaurant.address}</p>
                        <p><strong>Description:</strong> {restaurant.description}</p>
                    </div>

                    <hr className="sectionDivider" />
                    <button className="leaveReview" onClick={handleLeaveReview}>
                        Leave a Review
                    </button>
                </div>
            </div>

            <div className="restaurantReviews-container">
                <h2 className="reviewTitle">Reviews</h2>
                {restaurant.reviews && restaurant.reviews.length > 0 ? (
                    restaurant.reviews.map((review) => (
                        <div className="reviewContainer" key={review._id}>
                            <img
                                src={review.user.profileImage}
                                alt={review.user.username}
                                className="profileImage"
                            />
                            <h3 className="username">{review.user.username}</h3>
                            <p className="userRating">Rating: {review.rating}/5</p>
                            <p className="userDescription">{review.description}</p>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: "center" }}>No reviews yet.</p>
                )}
            </div>
        </>
    );
}

export default RestaurantDetails;
