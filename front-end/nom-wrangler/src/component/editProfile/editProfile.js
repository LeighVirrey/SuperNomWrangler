import React from 'react';
import './editProfile.css';

const EditProfile = () => {
  return (
    <div className="edit-profile-container">
      <h1>Edit Profile</h1>
      <div className="edit-profile-content">
        <div className="profile-picture-section">
          <img
            src="https://i.imgur.com/6X1AoYY.png" // You can replace this with your own image path
            alt="Profile"
            className="profile-image"
          />
          <p className="profile-change-text">Change Profile Picture</p>
          <p className="profile-add-text">Add Profile Picture</p>
        </div>
        <div className="form-section">
          <label>
            Change Username:
            <input type="text" placeholder="@username" />
          </label>
          <label>
            Change Email:
            <input type="text" placeholder="@username" />
          </label>
          <label>
            Change Password:
            <input type="text" placeholder="Placeholder" />
          </label>
        </div>
      </div>
      <button className="save-button">Save Changes</button>
    </div>
  );
};

export default EditProfile;
