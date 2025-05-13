import React from 'react';
import './profile.css';

const Profile = () => {
    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-top-bar" />
                <div className="profile-info">
                    <img
                        src="data:image/jpeg;base64,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" // replace with user img
                        alt="Profile"
                        className="profile-avatar"
                    />
                    <div className="profile-text">
                        <h2>@TXRED</h2>
                        <p>txred@gmail.com</p>
                        <p>20 reviews</p>
                        <p>gold hot dog</p>
                        <div className="trophies">
                            {[...Array(8)].map((_, i) => (
                                <span key={i} className="trophy-dot" />
                            ))}
                            <p className="trophies-label">trophies^</p>
                        </div>
                    </div>
                    <div className="gear-icon">⚙️</div>
                </div>
                <button className="edit-profile-btn">Edit Profile</button>
            </div>

            <div className="reviews-section">
                <h2>Reviews</h2>

                
                <div className="review-box">
                    <h3>RESTAURANT NAME</h3>
                    <p className="review-description">
                        DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION
                        DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION
                    </p>
                    <button className="edit-review-btn">Edit</button>
                </div>

                
                <div className="review-box alt">
                    <h3>RESTAURANT NAME</h3>
                    <p className="review-description">
                        DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION
                        DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Profile;