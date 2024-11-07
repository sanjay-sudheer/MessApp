import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './adminEditing.css';

export default function AdminEditing() {
  const { admissionNumber } = useParams();
  const navigate = useNavigate();
  const [inmateData, setInmateData] = useState({
    roomNumber: '',
    name: '',
    department: '',
    year: '',
    batch: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInmateData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`https://messapp-ymg5.onrender.com/api/inmate/${admissionNumber}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
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
    setInmateData({ ...inmateData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://messapp-ymg5.onrender.com/api/inmate/${admissionNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify(inmateData),
      });

      if (!response.ok) throw new Error('Failed to update inmate details');
      
      navigate('/AdminEditing');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="adminEditing">
      <form className="editingSection" onSubmit={handleUpdate}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={inmateData.name}
          onChange={handleInputChange}
          required
        />
        <label>Room Number</label>
        <input
          type="text"
          name="roomNumber"
          value={inmateData.roomNumber}
          onChange={handleInputChange}
          required
        />
        <label>Department</label>
        <input
          type="text"
          name="department"
          value={inmateData.department}
          onChange={handleInputChange}
          required
        />
        <label>Year</label>
        <input
          type="number"
          name="year"
          value={inmateData.year}
          onChange={handleInputChange}
          required
        />
        <label>Batch</label>
        <input
          type="text"
          name="batch"
          value={inmateData.batch}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Update Inmate</button>
      </form>
    </div>
  );
}
