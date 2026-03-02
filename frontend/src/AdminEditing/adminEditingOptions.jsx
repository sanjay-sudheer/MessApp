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
      if (!token) { navigate('/admin-login'); return; }
      try {
        const response = await fetch('https://messapp-ymg5.onrender.com/api/inmate/all', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch inmate details');
        const data = await response.json();
        setInmates(data);
        setFilteredInmates(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchInmates();
  }, [navigate]);

  useEffect(() => {
    let filtered = inmates.filter(inmate =>
      inmate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inmate.admissionNumber.includes(searchTerm)
    );
    if (yearFilter) {
      filtered = filtered.filter(inmate => inmate.year && inmate.year.toString() === yearFilter);
    }
    setFilteredInmates(filtered);
  }, [searchTerm, inmates, yearFilter]);

  const clearFilters = () => { setSearchTerm(''); setYearFilter(''); };

  const [confirmTarget, setConfirmTarget] = useState(null); // admissionNumber to delete

  const handleDelete = async (admissionNumber) => {
    setConfirmTarget(admissionNumber); // show modal
  };

  const confirmDelete = async () => {
    const admissionNumber = confirmTarget;
    setConfirmTarget(null);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`https://messapp-ymg5.onrender.com/api/inmate/${admissionNumber}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete inmate');
      setInmates(prev => prev.filter(i => i.admissionNumber !== admissionNumber));
      setFilteredInmates(prev => prev.filter(i => i.admissionNumber !== admissionNumber));
    } catch (error) {
      alert('Failed to delete inmate');
    }
  };

  if (loading) return (
    <div className='outerDiv'>
      <div className="adminEditingheader">
        <div className="headerTitleBlock">
          <span className="headerPill">👥 Admin</span>
          <h1 className="headerTitle">Manage Members</h1>
          <p className="headerSubtitle">Loading hostel members…</p>
        </div>
      </div>
      <div className="loading">
        <div className="loadingSpinner" />
        Fetching members…
      </div>
    </div>
  );

  if (error) return (
    <div className='outerDiv'>
      <div className="adminEditingheader">
        <div className="headerTitleBlock">
          <span className="headerPill">👥 Admin</span>
          <h1 className="headerTitle">Manage Members</h1>
        </div>
      </div>
      <div className="error">⚠️ {error}</div>
    </div>
  );

  return (
    <div className='outerDiv'>

      {/* ── Sticky Wave Header ── */}
      <div className='adminEditingheader'>
        <div className="headerTitleBlock">
          <span className="headerPill">👥 Admin</span>
          <h1 className="headerTitle">Manage Members</h1>
          <p className="headerSubtitle">{inmates.length} hostel members</p>
        </div>
        <Link to='/AdminAddingSection' className="addBtn">
          ＋ Add Member
          {/* keep img for legacy, hidden via CSS */}
          <img src={addIcon} alt="" />
        </Link>
      </div>

      {/* ── Content ── */}
      <div className="contentArea">

        {/* ── Search + Filter row ── */}
        <div className="controlsRow">
          <div className="searchWrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2"/>
              <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search name or admission no…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clearSearchBtn" onClick={() => setSearchTerm('')}>✕</button>
            )}
          </div>

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

        {/* ── Meta row ── */}
        <div className="metaRow">
          <span className="metaCount">
            {filteredInmates.length}{(searchTerm || yearFilter) ? ` of ${inmates.length}` : ''} member{filteredInmates.length !== 1 ? 's' : ''}
          </span>
          {(searchTerm || yearFilter) && (
            <button className="clearFiltersBtn" onClick={clearFilters}>✕ Clear filters</button>
          )}
        </div>

        {/* ── List ── */}
        <div className="userListDiv">
          {filteredInmates.length ? (
            filteredInmates.map((inmate, idx) => (
              <div
                key={inmate.admissionNumber}
                className="userDetail"
                style={{ animationDelay: `${idx * 0.04}s` }}
              >
                <div className="userNamePictureDiv">
                  {/* Avatar circle — emoji fallback, old img hidden via CSS */}
                  <div className="avatarCircle">👤</div>
                  <img src={userProfilePic} alt="" className='userProfilePic' />

                  <div className="userInfoBlock">
                    <div className="userName">{inmate.name}</div>
                    <div className="userMeta">
                      <span className="metaTag highlight">{inmate.admissionNumber}</span>
                      <span className="metaTag">🏠 {inmate.roomNumber}</span>
                      <span className="metaTag">🎓 {inmate.department}</span>
                      <span className="metaTag">Year {inmate.year}</span>
                      <span className="metaTag">Batch {inmate.batch}</span>
                    </div>
                  </div>
                </div>

                <div className="editingIconSections">
                  <Link to={`/adminEditSection/${inmate.admissionNumber}`} className="actionBtn edit" title="Edit member">
                    {/* hidden old img */}
                    <img src={editIcon} alt="" />
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                  <button
                    className="actionBtn delete"
                    title="Delete member"
                    onClick={() => handleDelete(inmate.admissionNumber)}
                  >
                    {/* hidden old img */}
                    <img src={deleteIcon} alt="" />
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="noData">
              <span className="noDataIcon">📭</span>
              <p>No members found matching your filters. Try adjusting your search or add new members.</p>
              <Link to='/admin'>
                <button className="backButton">← Back to Dashboard</button>
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* ── Delete confirm modal ── */}
      {confirmTarget && (
        <div className="modalOverlay" onClick={() => setConfirmTarget(null)}>
          <div className="modalCard" onClick={e => e.stopPropagation()}>
            <div className="modalIcon">🗑️</div>
            <h2 className="modalTitle">Remove Member?</h2>
            <p className="modalBody">
              This will permanently delete <strong>{filteredInmates.find(i => i.admissionNumber === confirmTarget)?.name || confirmTarget}</strong> and all their attendance records. This cannot be undone.
            </p>
            <div className="modalActions">
              <button className="modalCancel" onClick={() => setConfirmTarget(null)}>Cancel</button>
              <button className="modalConfirm" onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}