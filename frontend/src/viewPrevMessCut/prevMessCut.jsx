import React, { useState, useEffect } from 'react';
import './prevMessCut.css'
const dummyAbsentDates = [
    '2024-10-05',
    '2024-10-12',
    '2024-10-20',
    '2024-10-25',
    '2024-11-03'
];

const PrevMessCut = () => {
    const [month, setMonth] = useState('');
    const [absentDates, setAbsentDates] = useState([]);
    const [error, setError] = useState(null);
    const [isCalendarFetched, setIsCalendarFetched] = useState(false);

    // Function to fetch absent dates
    const fetchAbsentDates = () => {
        // Simulating fetching absent dates from a "dummy API"
        setAbsentDates(dummyAbsentDates);
        setIsCalendarFetched(true);
    };

    // Effect to set the default month to the current month
    useEffect(() => {
        const now = new Date();
        const year = now.getFullYear();
        const monthNumber = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed in JS
        const monthString = `${year}-${monthNumber}`;
        setMonth(monthString);
        fetchAbsentDates(); // Automatically fetch dates for the current month
    }, []);

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
            {/* <button onClick={fetchAbsentDates}>Fetch Attendance</button> */}
            {error && <p>{error}</p>}
            <div className="calendar">
                {renderCalendar()}
            </div>
        </div>
    );
};

export default PrevMessCut;
