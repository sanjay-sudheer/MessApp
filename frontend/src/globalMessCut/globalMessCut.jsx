import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./globalMessCut.css";

function GlobalMessCut() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
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
      const token = localStorage.getItem('adminToken');

      const response = await fetch('https://messapp-ymg5.onrender.com/api/admin/mark-global-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('✅ Global attendance marked successfully');
      } else {
        setMessage(result.message || '❌ Error marking global attendance');
      }
    } catch (error) {
      setMessage('❌ Error: Unable to mark global attendance');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='mainOuter'>
      <div className="userProfile">

        {/* ── Wave Header ── */}
        <div className="userheader">
          <div className="userNameDescription">
            <span className="headerPill">🍽️ Admin</span>
            <span className="userName">Global Mess Cut</span>
            <span className="userDescription">Mark absence for all students</span>
          </div>
          <div className="profileIcon">
            ✂️
          </div>
        </div>

        {/* ── Form Body ── */}
        <div className='MessCutformSection'>
          <span className="sectionLabel">📅 Select Date Range</span>
          <form className="messCutReport" onSubmit={handleSubmit}>

            <div className="inputGroup">
              <label htmlFor="from">From</label>
              <input
                type="date"
                id="from"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="to">To</label>
              <input
                type="date"
                id="to"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
              />
            </div>

            <button type='submit' disabled={isLoading}>
              {isLoading ? '⏳ Submitting...' : '✔ Apply Global Mess Cut'}
            </button>
          </form>

          {message && (
            <div className={`message ${message.includes('✅') ? 'success' : message.includes('❌') ? 'error' : ''}`}>
              {message}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default GlobalMessCut;