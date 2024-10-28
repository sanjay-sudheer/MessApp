import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminLoginPage.css';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        console.log('JWT Token:', data.token);

        setUsername('');
        setPassword('');
        
        navigate('/admin');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login.');
    }
  };

  return (
    <div className="mainOuter">
      <div className="adminLoginPage">
        <div className="headerSection">
          <span className="loginTitle">Admin Login</span>
          <span className="loginDescription">Enter your username and password</span>
        </div>
        <form className="formSection" onSubmit={handleSubmit}>
          {error && <div className="errorMessage">{error}</div>}
          <div className="inputSection">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="inputSection">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="loginButtonDiv">
            <button className="loginButton" type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
