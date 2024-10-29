import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './viewMonthlyReport.css';

function ViewMonthlyReport() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    
    // Redirect if token is missing
    if (!token) {
      navigate('/admin-login');
      return;
    }

    const fetchMonthlyReport = async () => {
      try {
        const response = await fetch('https://messapp-ymg5.onrender.com/api/admin/monthly-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`, // Add 'Bearer' prefix for security
          },
          body: JSON.stringify({
            month: 10,
            year: 2024,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch the monthly report');
        }

        const data = await response.json();
        setReportData(data.report);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMonthlyReport();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="report-container">
      <h1>Monthly Report for October 2024</h1>
      {reportData.length > 0 ? (
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
