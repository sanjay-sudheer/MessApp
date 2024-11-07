import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './adminEditingOptions.css';
import deleteIcon from '../assests/delete.png';
import addIcon from '../assests/add-user.png';
import editIcon from '../assests/editing.png';
import userProfilePic from '../assests/user-profile-icon-removebg-preview.png';

export default function AdminEditingOptions() {
  const [inmates, setInmates] = useState([]);
  const [filteredInmates, setFilteredInmates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInmates = async () => {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        navigate('/admin-login');
        return;
      }

      try {
        const response = await fetch('https://messapp-ymg5.onrender.com/api/inmate/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch inmate details');

        const data = await response.json();
        setInmates(data);
        setFilteredInmates(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching inmates:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchInmates();
  }, [navigate]);

  // Filter inmates based on the search term
  useEffect(() => {
    setFilteredInmates(
      inmates.filter(inmate =>
        inmate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inmate.admissionNumber.includes(searchTerm)
      )
    );
  }, [searchTerm, inmates]);

  // Function to handle delete action
  const handleDelete = async (admissionNumber) => {
    const token = localStorage.getItem('adminToken');

    // Confirmation dialog
    if (window.confirm('Are you sure you want to delete this inmate?')) {
      try {
        const response = await fetch(`https://messapp-ymg5.onrender.com/api/inmate/${admissionNumber}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to delete inmate');

        // Update the inmates list after deletion
        setInmates(prevInmates => prevInmates.filter(inmate => inmate.admissionNumber !== admissionNumber));
        setFilteredInmates(prevFilteredInmates => prevFilteredInmates.filter(inmate => inmate.admissionNumber !== admissionNumber));
        alert('Inmate deleted successfully');
      } catch (error) {
        console.error('Error deleting inmate:', error);
        alert('Failed to delete inmate');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!filteredInmates.length) return <div>No inmate data available.</div>;

  return (
    <div className='outerDiv'>
      <div className='adminEditingheader'>
        <span>Edit Members</span>
        <Link to='/AdminAddingSection'>
          <img src={addIcon} alt="Add member" title='add member' />
        </Link>
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name or admission number"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="searchInput"
      />

      <div className="userListDiv">
        {filteredInmates.map((inmate) => (
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
              <img
                src={deleteIcon}
                alt="Delete"
                title='remove member'
                onClick={() => handleDelete(inmate.admissionNumber)}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
