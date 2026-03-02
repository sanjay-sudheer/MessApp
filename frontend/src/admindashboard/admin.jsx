import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './admin.css';

const SearchIcon  = () => <span>🔍</span>;
const SettingsIcon= () => <span>⚙️</span>;
const UserIcon    = () => <span>👤</span>;
const ThemeIcon   = () => <span>🎨</span>;
const DashboardIcon=() => <span>📊</span>;
const ReportIcon  = () => <span>📈</span>;
const UsersIcon   = () => <span>👥</span>;
const MessIcon    = () => <span>🍽️</span>;

function Button({ children, onClick, className }) {
  return <button onClick={onClick} className={className}>{children}</button>;
}

function DropdownMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="dropdown">
      <Button className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
        {children.trigger}
      </Button>
      {isOpen && <div className="dropdown-content">{children.content}</div>}
    </div>
  );
}

export default function AdminPage() {
  const [theme, setTheme] = useState("dark");
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) navigate("/admin-login");
  }, [navigate]);

  const toggleTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    document.body.className = selectedTheme;
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  return (
    <div className={`container ${theme}`}>

      {/* ── Sticky Header ── */}
      <header className="header">
        <div className="brand">
          <DashboardIcon />
          <span>Mess Admin</span>
        </div>

        

        <div className="header-actions">
         

          <DropdownMenu>
            {{
              trigger: <><UserIcon /></>,
              content: (
                <>
                  <Button><UserIcon /> Profile</Button>
                  <Button><SettingsIcon /> Settings</Button>
                  <Button onClick={handleLogout}>🚪 Logout</Button>
                </>
              ),
            }}
          </DropdownMenu>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="main-content">

        <div className="dashboard-title-block">
          <div className="dashboard-eyebrow">⚡ Admin Panel</div>
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">Manage attendance, reports, and users from one place.</p>
        </div>

        <div className="dashboard-grid">

          {/* Global Messcut */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon"><MessIcon /></div>
              <h2>Global Messcut</h2>
              <p>Manage mess cuts for all students across the hostel with bulk scheduling operations.</p>
            </div>
            <div className="card-content">
              <Link to="/global-mess" className="full-button">
                Manage → 
              </Link>
            </div>
          </div>

          {/* Monthly Reports */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon"><ReportIcon /></div>
              <h2>Monthly Reports</h2>
              <p>Generate comprehensive monthly attendance reports with detailed analytics.</p>
            </div>
            <div className="card-content">
              <Link to="/viewreport" className="full-button">
                View Reports →
              </Link>
            </div>
          </div>

          {/* User Management */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon"><UsersIcon /></div>
              <h2>User Management</h2>
              <p>Add, edit, or remove student accounts with role-based access control.</p>
            </div>
            <div className="card-content">
              <Link to="/AdminEditing" className="full-button">
                Manage Users →
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}