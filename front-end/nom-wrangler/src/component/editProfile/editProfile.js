
import './editProfile.css';

import React, { useState, useEffect } from 'react';

const apiUrl = 'http://localhost:4000/editprofile'; // Adjust this based on your actual route

const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Regex patterns
  const patterns = {
    username: /^[a-zA-Z0-9_]{4,20}$/,
    firstName: /^[a-zA-Z]{2,30}$/,
    lastName: /^[a-zA-Z]{2,30}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^$|^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ // Password optional, but must be complex if entered
  };

  useEffect(() => {
    // Simulate fetching user data
    const fetchProfile = async () => {
      try {
        const response = await fetch(apiUrl, {
          method: 'PUT',
          credentials: 'include'
        });
        const data = await response.json();
        setFormData({
          username: data.username || '',
          email: data.email || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          password: ''
        });
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = '';

    if (patterns[name] && !patterns[name].test(value)) {
      switch (name) {
        case 'username':
          errorMsg = 'Username must be 4-20 chars (letters, numbers, underscores)';
          break;
        case 'firstName':
        case 'lastName':
          errorMsg = 'Must be 2-30 letters only';
          break;
        case 'email':
          errorMsg = 'Please enter a valid email';
          break;
        case 'password':
          errorMsg = 'Password must be 8+ chars with upper/lower/number/special (or leave blank)';
          break;
        default:
          errorMsg = 'Invalid input';
      }
    }

    setErrors({ ...errors, [name]: errorMsg });
    return errorMsg === '';
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    for (const field in formData) {
      if (!validateField(field, formData[field])) {
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Update failed');

      setUpdateSuccess(true);
    } catch (error) {
      console.error('Update error:', error.message);
      alert('Profile update failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (updateSuccess) {
    return (
      <div className="signup-container">
        <div className="signup-box success-message">
          <h2>Profile Updated!</h2>
          <p>Your changes have been saved successfully.</p>
          <button onClick={() => setUpdateSuccess(false)}>Edit Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-form">
          <h2 className="signup-title">Edit Profile</h2>
          <form className="form-row" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>*Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter username (4-20 chars)"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {errors.username && <span className="error">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label>*Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <span className="error">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <span className="error">{errors.lastName}</span>}
            </div>

            <div className="form-group">
              <label>New Password (optional)</label>
              <input
                type="password"
                name="password"
                placeholder="Change password (leave blank to keep current)"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>

            <div className="form-button">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
