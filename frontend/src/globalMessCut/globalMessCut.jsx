import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./globalMessCut.css";
import userProfilePic from "../assests/user-profile-icon-removebg-preview.png";

function GlobalMessCut() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      // Redirect to login page if token is not found
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fromDate || !toDate) {
      setMessage('Please select both start and end dates.');
      return;
    }

    const requestData = {
      startDate: fromDate,
      endDate: toDate,
    };

    setIsLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('adminToken'); // Retrieve the admin token

      const response = await fetch('https://messapp-ymg5.onrender.com/api/admin/mark-global-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Global attendance marked successfully');
      } else {
        setMessage(result.message || 'Error marking global attendance');
      }
    } catch (error) {
      setMessage('Error: Unable to mark global attendance');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='mainOuter'>
      <div className="userProfile">
        <div className="userheader">
          <div className="profileIcon">
            <img src={userProfilePic} alt="User Profile" />
          </div>
          <div className="userNameDescription">
            <span className='userName'>Sanjay Sudheer</span>
            <br />
            <span className='userDescription'>Mess Secretary</span>
          </div>
        </div>
        <div className='MessCutformSection'>
          <form className="messCutReport" onSubmit={handleSubmit}>
            <label htmlFor="from">From:</label>
            <input
              type="date"
              id="from"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              required
            />
            <label htmlFor="to">To:</label>
            <input
              type="date"
              id="to"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              required
            />
            <button type='submit' disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
          {message && <div className="message">{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default GlobalMessCut;
