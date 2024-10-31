import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './adminEditingOptions.css';
import deleteIcon from '../assets/delete.png';
import addIcon from '../assets/add-user.png';
import editIcon from '../assets/editing.png';
import userProfilePic from '../assets/user-profile-icon-removebg-preview.png';

export default function AdminEditingOptions() {
  const [inmates, setInmates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInmates = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('https://messapp-ymg5.onrender.com/api/inmates/all', {
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
        setInmates(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchInmates();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='outerDiv'>
      <div className='adminEditingheader'>
        <span>Edit Members</span>
        <Link to='/AdminAddingSection'>
          <img src={addIcon} alt="" title='add member' />
        </Link>
      </div>
      <div className="userListDiv">
        {inmates.map((inmate) => (
          <div key={inmate.admissionNumber} className="userDetail">
            <div className="userNamePictureDiv">
              <img src={userProfilePic} alt="" className='userProfilePic' />
              <span className='userName'>
                {inmate.name} 
                <br />
                <span className='userDescription'>{inmate.admissionNumber}</span>
              </span>
            </div>
            <div className="editingIconSections">
              <Link to={`/adminEditSection/${inmate.admissionNumber}`}>
                <img src={editIcon} alt="" title='edit member' />
              </Link>
              <Link to={`/AdminEditing/${inmate.admissionNumber}`}>
                <img src={deleteIcon} alt="" title='remove member' />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
