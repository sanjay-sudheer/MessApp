import React, { useState, useEffect } from 'react';
import './prevMessCut.css';
import { useNavigate } from 'react-router-dom';

const PrevMessCut = () => {
    const [month, setMonth] = useState('');
    const [absentDates, setAbsentDates] = useState([]);
    const [error, setError] = useState(null);
    const [isCalendarFetched, setIsCalendarFetched] = useState(false);
    const navigate = useNavigate();

    const fetchAbsentDates = async () => {
        if (!month) return;
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const inmate = JSON.parse(localStorage.getItem('inmate'));
            const admissionNumber = inmate?.admissionNumber;

            if (!admissionNumber) throw new Error('Admission number not found in local storage.');

            const [year, monthNumber] = month.split('-');
            const response = await fetch('https://messapp-ymg5.onrender.com/api/attendance/absent-dates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
                body: JSON.stringify({ admissionNumber, month: monthNumber, year }),
            });

            if (!response.ok) throw new Error(`Error: ${response.statusText}`);

            const data = await response.json();
            setAbsentDates(data.absentDates);
            setIsCalendarFetched(true);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/');
    }, [navigate]);

    useEffect(() => {
        const now = new Date();
        const year = now.getFullYear();
        const monthNumber = (now.getMonth() + 1).toString().padStart(2, '0');
        setMonth(`${year}-${monthNumber}`);
        fetchAbsentDates();
    }, []);

    useEffect(() => {
        if (month) fetchAbsentDates();
    }, [month]);

    const renderCalendar = () => {
        if (!isCalendarFetched || !month) return null;

        const [year, monthNumber] = month.split('-');
        const daysInMonth = new Date(year, monthNumber, 0).getDate();
        const firstDay = new Date(year, monthNumber - 1, 1).getDay();
        const calendarDays = [];

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach((day) => {
            calendarDays.push(<div key={day} className="day-name">{day}</div>);
        });

        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(<div key={`blank-${i}`} className="day blank" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = `${year}-${monthNumber.padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const isAbsent = absentDates.includes(dateString);
            calendarDays.push(
                <div key={day} className={`day ${isAbsent ? 'absent' : ''}`}>{day}</div>
            );
        }

        return calendarDays;
    };

    const monthLabel = month
        ? new Date(month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })
        : '';

    return (
        <div className='mainOuter'>
            <div className="calendarCard">

                {/* ── Header ── */}
                <div className="calendarHeader">
                    <div className="calendarHeaderTop">
                        <div className="calendarTitleBlock">
                            <h1 className='prevMessCutTitle'>Attendance Calendar</h1>
                            <span className="calendarSubtitle">Your mess cut history</span>
                        </div>
                        <div className="calendarIconBadge">📅</div>
                    </div>

                    <div className="inputDiv">
                        <label htmlFor="month">Month</label>
                        <input
                            type="month"
                            id="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                        />
                    </div>
                </div>

                {/* ── Calendar Body ── */}
                <div className="calendarBody">
                    <div className="calendarLegend">
                        <div className="legendDot"></div>
                        <span className="legendLabel">Absent</span>
                    </div>

                    <div className="calendar">
                        {renderCalendar()}
                    </div>

                    {isCalendarFetched && (
                        <div className="absentSummary">
                            <span className="absentSummaryLabel">Total absent days in {monthLabel}</span>
                            <span className="absentSummaryCount">{absentDates.length} days</span>
                        </div>
                    )}

                    {error && (
                        <div style={{
                            marginTop: '14px',
                            background: '#fff3f0',
                            border: '1px solid #ffcab8',
                            color: '#c0391a',
                            fontSize: '0.82rem',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            fontWeight: 500
                        }}>{error}</div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PrevMessCut;