import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './admin.css';

export default function AdminPage() {
  const [theme, setTheme] = useState("dark");
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) navigate("/admin-login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  return (
    <div className="container">
      <div className="pageWrapper">

        {/* ── Wave Header ── */}
        <div className="header">
          <div className="headerRow">
            <div className="titleBlock">
              <span className="pill">⚡ Admin Panel</span>
              <h1 className="headerTitle">Admin Dashboard</h1>
              <p className="headerSubtitle">Manage mess operations from one place</p>
            </div>
            <div className="iconBadge">📊</div>
          </div>
        </div>

        {/* ── Card Body ── */}
        <div className="cardBody">

          <p className="sectionLabel">Quick Actions</p>

          <div className="dashboard-grid">

            {/* Global Messcut */}
            <div className="card">
              <div className="cardLeft">
                <div className="card-icon">🍽️</div>
                <h2>Global Messcut</h2>
                <p>Bulk schedule mess cuts for all students across the hostel.</p>
              </div>
              <div className="cardRight">
                <Link to="/global-mess" className="arrowBtn"><span className="btnLabel">Manage</span><span className="btnArrow">→</span></Link>
              </div>
            </div>

            {/* Monthly Reports */}
            <div className="card">
              <div className="cardLeft">
                <div className="card-icon">📈</div>
                <h2>Monthly Reports</h2>
                <p>Generate and view detailed monthly attendance analytics.</p>
              </div>
              <div className="cardRight">
                <Link to="/viewreport" className="arrowBtn"><span className="btnLabel">View Reports</span><span className="btnArrow">→</span></Link>
              </div>
            </div>

            {/* User Management */}
            <div className="card">
              <div className="cardLeft">
                <div className="card-icon">👥</div>
                <h2>User Management</h2>
                <p>Add, edit, or remove student accounts and access.</p>
              </div>
              <div className="cardRight">
                <Link to="/AdminEditing" className="arrowBtn"><span className="btnLabel">Manage Users</span><span className="btnArrow">→</span></Link>
              </div>
            </div>

          </div>

          {/* ── Divider + Logout ── */}
          <div className="divider" />
          <button className="logoutBtn" onClick={handleLogout}>
            🚪 Sign out of Admin
          </button>

        </div>
      </div>
    </div>
  );
}