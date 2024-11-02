import React, { useState, useEffect } from 'react';
import './prevMessCut.css';
import { useNavigate } from 'react-router-dom'; 
// import moment from 'moment-timezone';

const PrevMessCut = () => {
    const [month, setMonth] = useState('');
    const [absentDates, setAbsentDates] = useState([]);
    const [error, setError] = useState(null);
    const [isCalendarFetched, setIsCalendarFetched] = useState(false);
    const navigate = useNavigate();

    // Function to fetch absent dates
    const fetchAbsentDates = async () => {
        try {
            const token = localStorage.getItem('token');
            const inmate = JSON.parse(localStorage.getItem('inmate'));
            const admissionNumber = inmate?.admissionNumber; // Assuming the admission number is stored in the inmate object

            if (!admissionNumber) {
                throw new Error('Admission number not found in local storage.');
            }

            const [year, monthNumber] = month.split('-');
            const response = await fetch('https://messapp-ymg5.onrender.com/api/attendance/absent-dates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`, // Include the token in the headers
                },
                body: JSON.stringify({
                    admissionNumber,
                    month: monthNumber,
                    year
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setAbsentDates(data.absentDates);
            setIsCalendarFetched(true);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        // Redirect to /admin-login if token is not found
        if (!token) {
          navigate('/');
        }
      }, [navigate]);

    // Effect to set the default month to the current month
    useEffect(() => {
        const now = new Date();
        const year = now.getFullYear();
        const monthNumber = (now.getMonth() + 1).toString().padStart(2, '0');
        const monthString = `${year}-${monthNumber}`;
        setMonth(monthString);
        fetchAbsentDates(); // Automatically fetch dates for the current month
    }, []);

    // Effect to fetch absent dates when the month changes
    useEffect(() => {
        if (month) {
            fetchAbsentDates();
        }
    }, [month]);

    const renderCalendar = () => {
        if (!isCalendarFetched || !month) return null;

        const [year, monthNumber] = month.split('-');
        const daysInMonth = new Date(year, monthNumber, 0).getDate();
        const firstDay = new Date(year, monthNumber - 1, 1).getDay();
        const calendarDays = [];

        // Day names
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Render day names
        dayNames.forEach((day) => {
            calendarDays.push(
                <div key={day} className="day-name">{day}</div>
            );
        });

        // Fill in the blank spaces for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(<div key={`blank-${i}`} className="day blank" />);
        }

        // Render days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = `${year}-${monthNumber.padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const isAbsent = absentDates.includes(dateString);

            calendarDays.push(
                <div key={day} className={`day ${isAbsent ? 'absent' : ''}`}>
                    {day}
                </div>
            );
        }

        return calendarDays;
    };

    return (
        <div className='mainOuter'>
            <h1 className='prevMessCutTitle'>Attendance Calendar</h1>
            <div className="inputDiv">
                <label htmlFor="month">Select Month:</label>
                <input
                    type="month"
                    id="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                />
            </div>
            <div className="calendar">
                {renderCalendar()}
            </div>
        </div>
    );
};

export default PrevMessCut;
