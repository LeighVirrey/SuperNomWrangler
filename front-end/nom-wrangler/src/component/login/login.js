import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import {useAuth} from './authContext';
import './login.css';

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // const { login } = useAuth(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // const success = login(loginData.username, loginData.password);
    // if (success) {
    //   console.log('Login successful');
    //   setError('');
    //   navigate('/'); 
    // }
    // else {
    //   console.log('Invalid credentials');
    //   setError('Invalid username or password.');
    // };
  
    
    
    const isValidLogin =
      loginData.username === 'admin' && loginData.password === 'password123';

    if (isValidLogin) {
      console.log('Login successful');
      setError('');
      navigate('/login'); 
    } else {
      console.log('Invalid credentials');
      setError('Invalid username or password.');
      
    }
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

          {error && <p className="error-message">{error}</p>}

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
