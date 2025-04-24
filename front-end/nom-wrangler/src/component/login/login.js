import React from 'react';
import { Link } from 'react-router-dom';
// import Register from '../register/register';
import './login.css';
import Register from '../register/register';

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
          Don’t have an account? <Link to=Register={}>Sign up</a>
        </p>

        <button className="login-button">Login</button>
      </div>
    </div>
  );
};

export default LoginPage;
