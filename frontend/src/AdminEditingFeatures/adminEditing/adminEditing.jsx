import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './adminEditing.css';

export default function AdminEditing() {
  const { admissionNumber } = useParams();
  const navigate = useNavigate();
  const [inmateData, setInmateData] = useState({
    roomNumber: '', name: '', department: '', year: '', batch: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInmateData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`https://messapp-ymg5.onrender.com/api/inmate/${admissionNumber}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch inmate details');
        const data = await response.json();
        setInmateData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchInmateData();
  }, [admissionNumber]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInmateData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://messapp-ymg5.onrender.com/api/inmate/${admissionNumber}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` },
        body: JSON.stringify(inmateData),
      });
      if (!response.ok) throw new Error('Failed to update inmate details');
      navigate('/AdminEditing');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="editStateBox">
      <div className="editSpinner" />
      <p>Loading member details…</p>
    </div>
  );

  if (error && !inmateData.name) return (
    <div className="editStateBox">
      <div className="editErrorBox">⚠️ {error}</div>
    </div>
  );

  return (
    <div className="editPage">
      <div className="editCard">

        {/* ── Wave Header ── */}
        <div className="editHeader">
          <div className="editHeaderLeft">
            <span className="editPill">✏️ Admin</span>
            <h1 className="editTitle">Edit Member</h1>
            <p className="editSubtitle">Update student details</p>
          </div>
          <div className="editIconBadge">👤</div>
        </div>

        {/* ── Form ── */}
        <form className="editBody" onSubmit={handleUpdate}>

          <span className="editSectionLabel">📋 Student Details</span>

          <div className="editField">
            <label htmlFor="editAdmission">Admission Number</label>
            <input
              id="editAdmission"
              type="text"
              name="admissionNumber"
              value={inmateData.admissionNumber || admissionNumber}
              onChange={handleInputChange}
              placeholder="e.g. 11025-22"
              required
            />
          </div>

          <div className="editField">
            <label htmlFor="editName">Full Name</label>
            <input
              id="editName"
              type="text"
              name="name"
              value={inmateData.name}
              onChange={handleInputChange}
              placeholder="Full name"
              required
            />
          </div>

          <div className="editRow">
            <div className="editField">
              <label htmlFor="editRoom">Room No.</label>
              <input
                id="editRoom"
                type="text"
                name="roomNumber"
                value={inmateData.roomNumber}
                onChange={handleInputChange}
                placeholder="e.g. 313"
                required
              />
            </div>
            <div className="editField">
              <label htmlFor="editDept">Department</label>
              <input
                id="editDept"
                type="text"
                name="department"
                value={inmateData.department}
                onChange={handleInputChange}
                placeholder="e.g. MECH"
                required
              />
            </div>
          </div>

          <div className="editRow">
            <div className="editField">
              <label htmlFor="editYear">Year</label>
              <select
                id="editYear"
                name="year"
                value={inmateData.year}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
            <div className="editField">
              <label htmlFor="editBatch">Batch</label>
              <input
                id="editBatch"
                type="text"
                name="batch"
                value={inmateData.batch}
                onChange={handleInputChange}
                placeholder="e.g. A"
                required
              />
            </div>
          </div>

          {error && (
            <div className="editErrorBox" style={{ marginBottom: '14px' }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" className="editSubmitBtn" disabled={saving}>
            {saving ? '⏳ Saving…' : '✔ Save Changes'}
          </button>

        </form>
      </div>
    </div>
  );
}