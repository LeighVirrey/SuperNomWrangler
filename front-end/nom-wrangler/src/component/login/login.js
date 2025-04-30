import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './login.css';

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in with:', loginData);
    // Add login logic here (e.g., call to API)
  };

  return (
    <div className="container">
      
      <div className="login-box">
      <h1 className="title">Login</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter username"
            value={loginData.username}
            onChange={handleChange}
            required
            autoComplete="username"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter password"
            value={loginData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <p className="signup-text">
          Don’t have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
