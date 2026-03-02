import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginPage.css';

export default function LoginPage() {
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('https://messapp-ymg5.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admissionNumber, roomNumber: password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('inmate', JSON.stringify(data.inmate));
        setPassword('');
        setAdmissionNumber('');
        navigate('/user-profile');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred while logging in.');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/user-profile');
  }, [navigate]);

  return (
    <div className='mainOuter'>
      <div className="loginPage">

        {/* ── Header with wave ── */}
        <div className="headerSection">
          <div className="headerTitleBlock">
            <span className="messBadge">🍽️ College Mess Portal</span>
            <span className="loginTitle">Mess Attendance Login</span>
            <span className="userLoginPage-loginDescription">
              Enter your admission number and room number
            </span>
          </div>
          <div className="headerIconBadge">🔐</div>
        </div>

        {/* ── Form ── */}
        <form className='formSection' onSubmit={handleSubmit}>
          {error && <div className="errorMessage">{error}</div>}

          <div className="inputSection">
            <label htmlFor='AdmissionNumber'>Admission Number (eg: 11111-22)</label>
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
              placeholder='Enter your room number'
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