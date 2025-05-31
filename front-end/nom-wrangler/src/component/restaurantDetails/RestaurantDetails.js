import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./RestaurantDetails.css";

function RestaurantDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);

    useEffect(() => {
        async function fetchAllDetails() {
            try {
                const resRestaurant = await fetch(`http://localhost:4000/restaurant/${id}`);
                const restaurantData = await resRestaurant.json();
                let addressData = null;
                if (restaurantData.address_Id) {
                    const resAddress = await fetch(`http://localhost:4000/address/${restaurantData.address_Id}`);
                    addressData = await resAddress.json();
                }

                const resReviews = await fetch(`http://localhost:4000/review/restaurant/${id}`);
                const reviewsData = await resReviews.json();
                //TODO: GET USER INFO
                setRestaurant({
                    ...restaurantData,
                    address: addressData,
                    reviews: reviewsData,
                });
            } catch (error) {
                console.error("Error fetching restaurant details:", error);
            }
        }

        fetchAllDetails();
    }, [id]);
    console.log("Restaurant Details:", restaurant);

    // useEffect(() => {
    //     // Hardcoded demo data
    //     const demoData = {
    //         _id: id,
    //         name: "The Gourmet Kitchen",
    //         image: "/images/11steakhouse.jpg",
    //         rating: 4.6,
    //         price: "$25 - $49.99",
    //         style: "Modern European",
    //         type: "Fine Dining",
    //         address: "123 Flavor Street, Foodie Town",
    //         description: "An exquisite dining experience blending modern techniques with classic flavors.",
    //         reviews: [
    //             {
    //                 _id: "r1",
    //                 rating: 5,
    //                 description: "Amazing food and great atmosphere!",
    //                 user: {
    //                     username: "foodlover92",
    //                     profileImage: "/images/hotdog.png"
    //                 }
    //             },
    //             {
    //                 _id: "r2",
    //                 rating: 4,
    //                 description: "Loved the desserts. Would visit again.",
    //                 user: {
    //                     username: "gourmetfan",
    //                     profileImage: "/images/steak.jpg"
    //                 }
    //             }
    //         ]
    //     };

    //     // Simulate API delay for better UX
    //     setTimeout(() => {
    //         setRestaurant(demoData);
    //     }, 500);
    // }, [id]);

    const handleLeaveReview = () => {
        navigate(`/review`);
    };

    if (!restaurant) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="restaurant-details">
                <img
                    src={restaurant.img_Url}
                    alt={restaurant.name}
                    className="restaurant-image"
                />
                <div className="restaurant-content">
                    <h1 className="restaurant-name">{restaurant.name}</h1>
                    <p className="blueText">- {restaurant.rating} -</p>
                    <p className="blueText">- {restaurant.price_Range} -</p>

                    <hr className="sectionDivider" />
                    <div className="restaurant-info">
                        <p className="blueText">- {restaurant.dining_Style} -</p>
                        <p className="blueText">- {restaurant.cuisine_Type} -</p>
                        <p><strong>Address:</strong> {restaurant.address.number_Street} {restaurant.address.name_Street}, {restaurant.address.city.trim()}, {restaurant.address.state.trim()} {restaurant.address.zip_Code}, {restaurant.address.country.trim()}</p>
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
                        <div className="reviewContainer" key={review.review_Id}>
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
