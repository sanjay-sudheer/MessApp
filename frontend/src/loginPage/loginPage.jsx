import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './loginPage.css';

export default function LoginPage() {
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();  // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null);  // Clear previous errors

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ admissionNumber, roomNumber: password }) // Sending roomNumber as password
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Store token in local storage
        localStorage.setItem('inmate', JSON.stringify(data.inmate)); // Store inmate data in local storage
        console.log('JWT Token:', data.token); // Log the token in the console
        console.log('Inmate Data:', data.inmate); // Log inmate data in the console

        setPassword('');
        setAdmissionNumber('');

        // Navigate to a new route after successful login
        console.log('Navigating to user profile');
        navigate('/user-profile');  // Redirect to the dashboard or desired page
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred while logging in.');
    }
  };

  useEffect(() => {
    console.log(localStorage.getItem('token'));
    console.log(JSON.parse(localStorage.getItem('inmate'))); // Log inmate data from local storage
  }, []);

  return (
    <div className='mainOuter'>
      <div className="loginPage">
        <div className="headerSection">
          <span className="loginTitle">mess attendance login</span>
          <span className='loginDescription'>
            Enter your room number and preset password
          </span>
        </div>
        <form className='formSection' onSubmit={handleSubmit}>
          {error && <div className="errorMessage">{error}</div>} {/* Error message display */}
          <div className="inputSection">
            <label htmlFor='AdmissionNumber'>Admission Number</label>
            <input
              type="text"
              id="AdmissionNumber"
              placeholder='Enter your Admission Number'
              value={admissionNumber}
              onChange={(e) => setAdmissionNumber(e.target.value)}
              required
            />
          </div>
          <div className="inputSection">
            <label htmlFor='roomPassword'>Room Number</label>
            <input
              type="password"
              id="roomPassword"
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="loginButtonDiv">
            <button className="loginButton" type='submit'>Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
