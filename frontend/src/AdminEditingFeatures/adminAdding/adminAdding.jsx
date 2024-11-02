import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminAdding.css';

export default function AdminAdding() {
  const [userData, setUserData] = useState({
    name: '',
    room: '',
    admission: '',
    year: '',
    batch: '',
    department:'',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    
    // Redirect to /admin-login if token is not found
    if (!token) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleFormData = (e) => {
    e.preventDefault();
    // Reset form fields
    setUserData({
      name: '',
      room: '',
      admission: '',
      year: '',
      batch: '',
      department:'',
    });
  };

  return (
    <div className='mainOuter'>
      <div className="adminEditing">
        <form className="editingSection" onSubmit={handleFormData}>
          <label htmlFor="userName">Name</label>
          <input
            type="text"
            placeholder='Enter your name'
            id='userName'
            value={userData.name}
            onChange={(e) => setUserData({
              ...userData,
              name: e.target.value,
            })}
            required
          />
          <label htmlFor="roomNumber">Room Number</label>
          <input
            type="text"
            placeholder='Enter your Room Number'
            id='roomNumber'
            value={userData.room}
            onChange={(e) => setUserData({
              ...userData,
              room: e.target.value,
            })}
            required
          />
          <label htmlFor="admissionNumber">Admission Number</label>
          <input
            type="text"
            placeholder='Enter your Admission Number'
            id='admissionNumber'
            value={userData.admission}
            onChange={(e) => setUserData({
              ...userData,
              admission: e.target.value,
            })}
            required
          />
          <label htmlFor="year">Year</label>
          <input
            type="text"
            id="year"
            placeholder='Enter your year'
            value={userData.year}
            onChange={(e) => setUserData({
              ...userData,
              year: e.target.value,
            })}
            required
          />
          <label htmlFor="dept">Department</label>
          <input
            type="text"
            id="dept"
            placeholder='Enter your Department'
            value={userData.department}
            onChange={(e) => setUserData({
              ...userData,
              department: e.target.value,
            })}
            required
          />
          <label htmlFor="batch">Batch</label>
          <input
            type="text"
            id="batch"
            placeholder='Enter your Batch'
            value={userData.batch}
            onChange={(e) => setUserData({
              ...userData,
              batch: e.target.value,
            })}
            required
          />
          <button type='submit'>Add Member</button>
        </form>
      </div>
    </div>
  );
}
