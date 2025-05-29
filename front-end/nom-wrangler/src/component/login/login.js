import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [loginData, setLoginData] = useState({ 
    username: '', 
    password: '' 
  });
  const [errors, setErrors] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = '';
    
    if (!value) {
      errorMsg = 'This field is required';
    } else if (name === 'username' && (value.length < 4 || value.length > 20)) {
      errorMsg = 'Username must be 4-20 characters';
    } else if (name === 'password' && value.length < 8) {
      errorMsg = 'Password must be at least 8 characters';
    }

    setErrors({ ...errors, [name]: errorMsg });
  };

  const validateForm = () => {
    let isValid = true;
    
    // Validate username
    if (!loginData.username || loginData.username.length < 4 || loginData.username.length > 20) {
      setErrors(prev => ({...prev, username: 'Username must be 4-20 characters'}));
      isValid = false;
    }
    
    // Validate password
    if (!loginData.password || loginData.password.length < 8) {
      setErrors(prev => ({...prev, password: 'Password must be at least 8 characters'}));
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // Store basic user data if needed
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Redirect on successful login
      navigate('/profile');
      
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <h1 className="title">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username (4-20 chars)"
              value={loginData.username}
              onChange={handleChange}
              required
              className={errors.username ? 'error-input' : ''}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password (min 8 chars)"
              value={loginData.password}
              onChange={handleChange}
              required
              className={errors.password ? 'error-input' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {error && <p className="error-message">{error}</p>}

          <button
            type="submit"
            className="login-button"
            disabled={loading || !!errors.username || !!errors.password}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="signup-text">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;