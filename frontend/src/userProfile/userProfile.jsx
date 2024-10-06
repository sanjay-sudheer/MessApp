import React, { useEffect, useRef, useState } from 'react';
import './userProfile.css';
import userProfilePicture from '../assests/user-profile-icon-removebg-preview.png';

export default function UserProfile() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [percentage, setPercentage] = useState(100);
  const [diff, setDiff] = useState(0); 
  const currDate = new Date().toISOString().split('T')[0];
  const messCutGraph = useRef();

  const handleMessCut = (e) => {
    e.preventDefault();
    setFromDate('');
    setToDate('');
  };

  // Function to calculate the number of days in a month
  const numberOfDays = (month, year) => {
    if (month === 2) {
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
    }
    return [1, 3, 5, 7, 8, 10, 12].includes(month) ? 31 : 30;
  };

  // Function to calculate the difference in days between two dates
  const calculateDaysBetweenDates = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Calculate the difference in days
    const timeDiff = endDate.getTime() - startDate.getTime();
//     console.log(timeDiff);
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Adding 1 to include the start day
//     console.log(dayDiff);
    return dayDiff;
  };

  const changeAttendance = () => {
    if (fromDate && toDate && new Date(toDate) >= new Date(fromDate)) {
      const days = calculateDaysBetweenDates(fromDate, toDate);
      const currentMonth = new Date(fromDate).getMonth() + 1;
      const currentYear = new Date(fromDate).getFullYear();

      // Update the total days of mess cut (sum of intervals)
      setDiff((prevDiff) => {
        const newDiff = prevDiff + days;

        // Update the percentage
        const daysInMonth = numberOfDays(currentMonth, currentYear);
        const newPercentage = 100 - Math.ceil((newDiff / daysInMonth) * 100);
        setPercentage(newPercentage);

        // Update the width of the attendance graph
        if (messCutGraph.current) {
          messCutGraph.current.style.width = `${newPercentage}%`;
        }

        return newDiff; // Return the updated total days of mess cut
      });
    } else {
      alert("Double-check the dates!");
    }
  };

  // Use useEffect to log the updated diff value
  useEffect(() => {
//     console.log(diff); // Now logs the updated diff value
//     console.log(currDate);
  }, [diff]);

  const logoutUser = ()=>{
      localStorage.removeItem('token');
  }
  return (
    <div className='mainOuter'>
      <div className="userProfile">
        <div className="header">
          <div className="profileIcon">
            <img src={userProfilePicture} alt="" />
          </div>
          <div className="userNameDescription">
            <span className='userName'>John Doe</span>
            <br />
            <span className='userDescription'>men's hostel</span>
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
              max={currDate}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              required
            />
            <label htmlFor="to">To:</label>
            <input
              type="date"
              id="to"
              max={currDate}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              required
            />
            <button type='submit' onClick={changeAttendance}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
