import React, { useState, useEffect } from 'react';
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

  
  const patterns = {
    username: /^[a-zA-Z0-9_]{4,20}$/, 
    password: /^.{8,}$/ 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = '';
    
    if (!value) {
      errorMsg = 'This field is required';
    } else if (name === 'username' && !patterns.username.test(value)) {
      errorMsg = 'Username must be 4-20 chars (letters, numbers, underscores)';
    } else if (name === 'password' && !patterns.password.test(value)) {
      errorMsg = 'Password must be at least 8 characters';
    }

    setErrors({ ...errors, [name]: errorMsg });
    return errorMsg === '';
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    for (const field in loginData) {
      if (!validateField(field, loginData[field])) {
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  // Secure token storage functions
  const storeToken = (token) => {
    try {
      // For HTTP-only cookies (preferred for production):
      // document.cookie = `authToken=${token}; Secure; HttpOnly; SameSite=Strict; path=/; max-age=86400`;
      
      // For local storage (less secure but common):
      localStorage.setItem('authToken', token);
      return true;
    } catch (err) {
      console.error('Token storage failed:', err);
      return false;
    }
  };

  const clearToken = () => {
    try {
      // For cookies:
      // document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // For local storage:
      localStorage.removeItem('authToken');
    } catch (err) {
      console.error('Token removal failed:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: 'include' // For HTTP-only cookies
      });

      const data = await response.json();

      if (response.ok) {
        // For JWT token in response body (if not using HTTP-only cookies)
        if (data.token) {
          if (!storeToken(data.token)) {
            throw new Error('Failed to store authentication token');
          }
        }
        
        // Store additional user data if needed (avoid sensitive data)
        if (data.user) {
          localStorage.setItem('user', JSON.stringify({
            id: data.user.id,
            username: data.user.username,
            // Other non-sensitive user data
          }));
        }

        navigate('/');
      } else {
        clearToken();
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      clearToken();
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/profile'); 
    }
  }, [navigate]);

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
              autoComplete="username"
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
              autoComplete="current-password"
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
            {loading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
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