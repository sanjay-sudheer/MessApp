import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './viewMonthlyReport.css';

function ViewMonthlyReport() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const navigate = useNavigate();

  const fetchMonthlyReport = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
      return;
    }

    try {
      const response = await fetch('https://messapp-ymg5.onrender.com/api/admin/monthly-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`, // 'Bearer' prefix for the token
        },
        body: JSON.stringify({ month: parseInt(month), year: parseInt(year) }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch the monthly report');
      }

      const data = await response.json();
      setReportData(data.report);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (month && year) {
      fetchMonthlyReport();
    } else {
      setError('Please enter both month and year');
    }
  };

  return (
    <div className="report-container">
      <h1>Monthly Report</h1>
      <form onSubmit={handleSubmit} className="date-selection-form">
        <label>
          Month:
          <input
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="Enter month (1-12)"
            min="1"
            max="12"
            required
          />
        </label>
        <label>
          Year:
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter year"
            min="2000"
            required
          />
        </label>
        <button type="submit">Fetch Report</button>
      </form>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : reportData.length > 0 ? (
        <table className="report-table">
          <thead>
            <tr>
              <th>Admission Number</th>
              <th>Name</th>
              <th>Total Presents</th>
              <th>Total Absences</th>
              <th>Global Absences</th>
              <th>Normal Absences</th>
              <th>Month</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((report, index) => (
              <tr key={index}>
                <td>{report.admissionNumber}</td>
                <td>{report.name}</td>
                <td>{report.totalPresents}</td>
                <td>{report.totalAbsences}</td>
                <td>{report.globalAbsences}</td>
                <td>{report.normalAbsences}</td>
                <td>{report.month}</td>
                <td>{report.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No report data available.</div>
      )}
    </div>
  );
}

export default ViewMonthlyReport;
