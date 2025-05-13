import React, { useState } from 'react';
import './register.css';

const apiUrl = 'http://localhost:6000/register';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Regex patterns
  const patterns = {
    username: /^[a-zA-Z0-9_]{4,20}$/,
    firstName: /^[a-zA-Z]{2,30}$/,
    lastName: /^[a-zA-Z]{2,30}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ // min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate on change
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = '';

    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        errorMsg = 'Passwords do not match';
      }
    } else if (patterns[name] && !patterns[name].test(value)) {
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
          errorMsg = 'Password must be at least 8 chars with uppercase, lowercase, number, and special char';
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
    const newErrors = { ...errors };

    // Validate all fields
    for (const field in formData) {
      if (field === 'confirmPassword') {
        if (formData[field] !== formData.password) {
          newErrors[field] = 'Passwords do not match';
          valid = false;
        }
      } else if (patterns[field] && !patterns[field].test(formData[field])) {
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
      const response = await fetch(`${apiUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password
      });

      // Handle successful registration
      setRegistrationSuccess(true);
      console.log('Registration successful:', response.data);

      // Reset form
      setFormData({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);

      // Handle backend validation errors
      if (error.response?.data?.errors) {
        setErrors(prev => ({ ...prev, ...error.response.data.errors }));
      } else {
        alert(error.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="signup-container">
        <div className="signup-box success-message">
          <h2>Registration Successful!</h2>
          <p>Please check your email to verify your account.</p>
          <button onClick={() => setRegistrationSuccess(false)}>Back to Registration</button>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-form">
          <h2 className="signup-title">Sign Up</h2>
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
                placeholder="Enter first name (letters only)"
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
                placeholder="Enter last name (letters only)"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <span className="error">{errors.lastName}</span>}
            </div>

            <div className="form-group">
              <label>*Password:</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password (min 8 chars with complexity)"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label>*Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>

            <div className="form-button">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


export default Register;