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
  const [yearFilter, setYearFilter] = useState('');
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

  // Filter inmates based on search term and filters
  useEffect(() => {
    let filtered = inmates.filter(inmate =>
      inmate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inmate.admissionNumber.includes(searchTerm)
    );

    if (yearFilter) {
      // Convert year filter to string and match with inmate.year
      filtered = filtered.filter(inmate => 
        inmate.year && inmate.year.toString() === yearFilter
      );
    }

    setFilteredInmates(filtered);
  }, [searchTerm, inmates, yearFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setYearFilter('');
  };

  const handleDelete = async (admissionNumber) => {
    const token = localStorage.getItem('adminToken');
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

        setInmates(prevInmates => prevInmates.filter(inmate => inmate.admissionNumber !== admissionNumber));
        setFilteredInmates(prevFilteredInmates => prevFilteredInmates.filter(inmate => inmate.admissionNumber !== admissionNumber));
        alert('Inmate deleted successfully');
      } catch (error) {
        console.error('Error deleting inmate:', error);
        alert('Failed to delete inmate');
      }
    }
  };

  if (loading) return (
    <div className='outerDiv'>
      <div className="loading">Loading members...</div>
    </div>
  );
  
  if (error) return (
    <div className='outerDiv'>
      <div className="error">Error: {error}</div>
    </div>
  );

  return (
    <div className='outerDiv'>
      <div className='adminEditingheader'>
        <span>👥 Manage Members</span>
        <Link to='/AdminAddingSection'>
          <img src={addIcon} alt="Add member" title='Add new member' />
        </Link>
      </div>

      <input
        type="text"
        placeholder="🔍 Search by name or admission number..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="searchInput"
      />

      {/* Filter Section */}
      <div className="filterSection">
        <div className="filterGroup">
          <label className="filterLabel">📅 Filter by Year</label>
          <select 
            value={yearFilter} 
            onChange={(e) => setYearFilter(e.target.value)}
            className="filterSelect"
          >
            <option value="">All Years</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>

        {(yearFilter || searchTerm) && (
          <button onClick={clearFilters} className="clearFiltersBtn">
            🗑️ Clear Filters
          </button>
        )}
      </div>

      <div className="userListDiv">
        {filteredInmates.length ? (
          filteredInmates.map((inmate) => (
            <div key={inmate.admissionNumber} className="userDetail">
              <div className="userNamePictureDiv">
                <img src={userProfilePic} alt="Profile" className='userProfilePic' />
                <div className='userName'>
                  <div style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                    {inmate.name}
                  </div>
                  <div className='userDescription'>📝 Admission: {inmate.admissionNumber}</div>
                  <div className='userDescription'>🏠 Room: {inmate.roomNumber}</div>
                  <div className='userDescription'>🎓 Department: {inmate.department}</div>
                  <div className='userDescription'>📅 Year: {inmate.year}</div>
                  <div className='userDescription'>👨‍🎓 Batch: {inmate.batch}</div>
                </div>
              </div>
              <div className="editingIconSections">
                <Link to={`/adminEditSection/${inmate.admissionNumber}`}>
                  <img src={editIcon} alt="Edit" title='Edit member details' />
                </Link>
                <img
                  src={deleteIcon}
                  alt="Delete"
                  title='Remove member'
                  onClick={() => handleDelete(inmate.admissionNumber)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="noData">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
            <p>No members found. Try adjusting your search or add new members to get started.</p>
            <Link to='/admin'>
              <button className="backButton">← Back to Dashboard</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
