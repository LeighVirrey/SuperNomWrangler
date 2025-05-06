import React from 'react';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="container">
      <h1 className="title">Login</h1>
      <div className="login-box">
        <label htmlFor="username">Username</label>
        <input id="username" type="text" placeholder="Placeholder" />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" placeholder="Placeholder" />

        <p className="signup-text">
          Don’t have an account? <a href="#">Sign up</a>
        </p>

        <button className="login-button">Login</button>
      </div>
    </div>
  );
};

export default LoginPage;
