import React, { useEffect, useRef, useState } from 'react';
import './userProfile.css';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [percentage, setPercentage] = useState(100);
  const [diff, setDiff] = useState(0);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const currDate = new Date().toISOString().split('T')[0];
  const messCutGraph = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserDetails = localStorage.getItem('inmate');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (storedUserDetails) {
      try {
        const parsedDetails = JSON.parse(storedUserDetails);
        setUserDetails(parsedDetails);
      } catch (error) {
        console.error('Error parsing user details:', error);
        localStorage.removeItem('inmate');
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleMessCut = (e) => {
    e.preventDefault();
    changeAttendance();
  };

  const numberOfDays = (month, year) => {
    if (month === 2) {
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
    }
    return [1, 3, 5, 7, 8, 10, 12].includes(month) ? 31 : 30;
  };

  const calculateDaysBetweenDates = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  };

  const updateAttendanceUI = (startDate, endDate) => {
    const days = calculateDaysBetweenDates(startDate, endDate);
    const currentMonth = new Date(startDate).getMonth() + 1;
    const currentYear = new Date(startDate).getFullYear();

    setDiff((prevDiff) => {
      const newDiff = prevDiff + days;
      const daysInMonth = numberOfDays(currentMonth, currentYear);
      const newPercentage = Math.max(0, 100 - Math.ceil((newDiff / daysInMonth) * 100));
      setPercentage(newPercentage);

      if (messCutGraph.current) {
        messCutGraph.current.style.width = `${newPercentage}%`;
      }

      return newDiff;
    });
  };

  const handleAuthError = () => {
    alert('Your session has expired. Please log in again.');
    localStorage.removeItem('token');
    localStorage.removeItem('inmate');
    navigate('/login');
  };

  const changeAttendance = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both start and end dates.");
      return;
    }

    if (new Date(toDate) < new Date(fromDate)) {
      alert("End date cannot be before start date.");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const admissionNumber = userDetails?.admissionNumber;
      
      if (!token || !admissionNumber) {
        handleAuthError();
        return;
      }

      const requestData = {
        admissionNumber,
        startDate: fromDate,
        endDate: toDate
      };

      const response = await fetch('http://localhost:5000/api/attendance/mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Attendance marked successfully', result);

      updateAttendanceUI(fromDate, toDate);
      
      // Clear form after successful submission
      setFromDate('');
      setToDate('');

    } catch (error) {
      console.error('Error details:', error);
      alert(`Failed to mark attendance: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('inmate');
    navigate("/login");
  };

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className='mainOuter'>
      <div className="userProfile">
        <div className="userheader">
          <div className="profileIcon">
           
          </div>
          <div className="userNameDescription">
            <span className='userName'>{userDetails.name}</span>
            <br />
            <span className='userDescription'>Men's Hostel</span>
          </div>
          <div className="logoutButton">
            <button onClick={logoutUser}>LogOut</button>
          </div>
        </div>
        <div className="mainContentSection">
          <span className='attendanceHeading'>Mess Attendance</span>
          <div className="attendanceGraph">
            <div className="loading" ref={messCutGraph}></div>
          </div>
          <span className='attendanceDescription'>{`${percentage}% attendance this month`}</span>
        </div>
        <div className='MessCutformSection'>
          <form className="messCutReport" onSubmit={handleMessCut}>
            <label htmlFor="from">From:</label>
            <input
              type="date"
              id="from"
              min={currDate}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              required
            />
            <label htmlFor="to">To:</label>
            <input
              type="date"
              id="to"
              min={currDate}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              required
            />
            <button 
              type='submit' 
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
