import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminAdding.css';

export default function AdminAdding() {
  const [userData, setUserData] = useState({
    name: '', room: '', admission: '',
    year: '', batch: '', department: '',
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin-login');
  }, [navigate]);

  const set = (key) => (e) => setUserData(prev => ({ ...prev, [key]: e.target.value }));

  const handleFormData = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://messapp-ymg5.onrender.com/api/inmate/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({
          name:            userData.name,
          roomNumber:      userData.room,
          admissionNumber: userData.admission,
          year:            userData.year,
          batch:           userData.batch,
          department:      userData.department,
        }),
      });
      if (!response.ok) throw new Error('Failed to add member. Please try again.');
      setSuccessMessage(`✅ ${userData.name} added successfully!`);
      setUserData({ name: '', room: '', admission: '', year: '', batch: '', department: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addPage">
      <div className="addCard">

        {/* ── Wave Header ── */}
        <div className="addHeader">
          <div className="addHeaderLeft">
            <span className="addPill">👥 Admin</span>
            <h1 className="addTitle">Add Member</h1>
            <p className="addSubtitle">Register a new hostel student</p>
          </div>
          <div className="addIconBadge">➕</div>
        </div>

        {/* ── Form ── */}
        <form className="addBody" onSubmit={handleFormData}>

          <span className="addSectionLabel">📋 Student Details</span>

          <div className="addField">
            <label htmlFor="addName">Full Name</label>
            <input
              id="addName"
              type="text"
              placeholder="e.g. John Doe"
              value={userData.name}
              onChange={set('name')}
              required
            />
          </div>

          <div className="addField">
            <label htmlFor="addAdmission">Admission Number</label>
            <input
              id="addAdmission"
              type="text"
              placeholder="e.g. 11025-22"
              value={userData.admission}
              onChange={set('admission')}
              required
            />
          </div>

          <div className="addRow">
            <div className="addField">
              <label htmlFor="addRoom">Room No.</label>
              <input
                id="addRoom"
                type="text"
                placeholder="e.g. 313"
                value={userData.room}
                onChange={set('room')}
                required
              />
            </div>
            <div className="addField">
              <label htmlFor="addDept">Department</label>
              <input
                id="addDept"
                type="text"
                placeholder="e.g. MECH"
                value={userData.department}
                onChange={set('department')}
                required
              />
            </div>
          </div>

          <div className="addRow">
            <div className="addField">
              <label htmlFor="addYear">Year</label>
              <select
                id="addYear"
                value={userData.year}
                onChange={set('year')}
                required
              >
                <option value="">Select</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
            <div className="addField">
              <label htmlFor="addBatch">Batch</label>
              <input
                id="addBatch"
                type="text"
                placeholder="e.g. A"
                value={userData.batch}
                onChange={set('batch')}
                required
              />
            </div>
          </div>

          <button type="submit" className="addSubmitBtn" disabled={loading}>
            {loading ? '⏳ Adding…' : '✚ Add Member'}
          </button>

        </form>

        {successMessage && <p className="addSuccess">{successMessage}</p>}
        {error          && <p className="addError">⚠️ {error}</p>}

      </div>
    </div>
  );
}