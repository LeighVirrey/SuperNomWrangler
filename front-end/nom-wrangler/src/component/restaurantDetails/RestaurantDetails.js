import React from 'react';
import { useNavigate } from 'react-router-dom';

// CSS imports
import './RestaurantDetails.css';
import './../../index.css';

const RestaurantDetails = ({ restaurant }) => {
    const navigate = useNavigate();

    const submitReview = () => {
        navigate('/review');
    };

    return (
        <div className="restaurantDetail-container">
            <div className="restaurantImage">
                <img src='/images/11steakhouse.jpg' alt="Restaurant" />
            </div>

            <div className="detailHeader">
                <h1 className="restaurantName">Lucky J Steakhouse & Arena</h1>
                <div className="ratingPrice">
                    <h3 className="detailsAverageRating">-4.6 Dogs-</h3>
                    <h3 className="detailsPriceRange">-$20-49.99-</h3>
                </div>
            </div>

            <div className="detailInfo">
                <h3 className="restaurantStyle">-Sit Down-</h3>
                <h3 className="restaurantCuisine">-Steak House-</h3>
                <h4 className="restaurantAddress">11664 Fir Rd, Carthage, MO 64836</h4>
                <p className="restaurantDescription">American chophouse with plank walls, taxidermy decor & a horse-show arena visible from the tables.</p>
            </div>

            <button className="leaveReview BlueButton" onClick={submitReview}>
                Leave a Review
            </button>

            <div className="restaurantReviews-container">
                <h1 className="reviewTitle">Reviews</h1>
                <div className="reviewContainer">
                    <img className="profileImage" src='/images/bin.jpg' alt="Profile" />
                    <h2 className="username">@Roadrash002</h2>
                    <h6 className="userRating">4/5</h6>
                    <p className="userDescription">I love the restaurant and the staff are amazing!!!!!!!!!!</p>
                </div>
            </div>
        </div>
    );
};

export default RestaurantDetails
