import React from 'react'
import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import './adminEditingOptions.css'
import deleteIcon from '../assests/delete.png'
import addIcon from '../assests/add-user.png'
import editIcon from '../assests/editing.png'
import userProfilePic from '../assests/user-profile-icon-removebg-preview.png'

export default function AdminEditingOptions() {
  const [inmates, setInmates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInmates = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('https://messapp-ymg5.onrender.com/api/inmate/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch inmate details');
        }

        const data = await response.json();
        setInmates(data); // Set the data directly
        setLoading(false);
      } catch (error) {
        console.error('Error fetching inmates:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchInmates();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!inmates.length) return <div>No inmate data available.</div>;

  return (
    <div className='outerDiv'>
      <div className='adminEditingheader'>
        <span>Edit Members</span>
        <Link to='/AdminAddingSection'>
          <img src={addIcon} alt="Add member" title='add member' />
        </Link>
      </div>
      <div className="userListDiv">
        {inmates.map((inmate) => (
          <div key={inmate.admissionNumber} className="userDetail">
            <div className="userNamePictureDiv">
              <img src={userProfilePic} alt="Profile" className='userProfilePic' />
              <span className='userName'>
                {inmate.name}
                <br />
                <span className='userDescription'>Admission No: {inmate.admissionNumber}</span>
                <br />
                <span className='userDescription'>Room No: {inmate.roomNumber}</span>
                <br />
                <span className='userDescription'>Department: {inmate.department}</span>
                <br />
                <span className='userDescription'>Year: {inmate.year}</span>
                <br />
                <span className='userDescription'>Batch: {inmate.batch}</span>
              </span>
            </div>
            <div className="editingIconSections">
              <Link to={`/adminEditSection/${inmate.admissionNumber}`}>
                <img src={editIcon} alt="Edit" title='edit member' />
              </Link>
              <Link to={`/AdminEditing/${inmate.admissionNumber}`}>
                <img src={deleteIcon} alt="Delete" title='remove member' />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}