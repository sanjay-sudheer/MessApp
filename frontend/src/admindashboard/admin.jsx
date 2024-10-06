// Component.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import './admin.css';
// Basic button component
function Button({ children, onClick, className }) {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}

// Dropdown Menu Component
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

// Main Admin Page
export default function AdminPage() {
  const [theme, setTheme] = useState("light");

  // Toggle theme between light and dark
  const toggleTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    document.body.className = selectedTheme; // Dynamically change body class to apply theme
  };

  return (
    <div className={`container ${theme}`}>
      <header className="header">
        <div className="brand">
          <span role="img" aria-label="laptop" className="icon">
            💻
          </span>
          <span>Hostel Mess Admin</span>
        </div>
        <div className="search-bar">
          <form>
            <div className="input-wrapper">
              <input className="search-input" placeholder="Search" type="search" />
            </div>
          </form>
        </div>
        <div className="header-actions">
          <DropdownMenu>
            {{
              content: (
                <>
                  <Button onClick={() => toggleTheme("light")}>Light</Button>
                  <Button onClick={() => toggleTheme("dark")}>Dark</Button>
                  <Button onClick={() => toggleTheme("system")}>System</Button>
                </>
              ),
            }}
          </DropdownMenu>
          <DropdownMenu>
            {{
              trigger: (
                <Button className="user-avatar-button">
                  <img alt="Avatar" className="avatar" src="/placeholder-user.jpg" />
                </Button>
              ),
              content: (
                <>
                  <Button>Profile</Button>
                  <Button>Settings</Button>
                  <Button>Logout</Button>
                </>
              ),
            }}
          </DropdownMenu>
        </div>
      </header>
      <main className="main-content">
        <h1 className="dashboard-title">Hostel Mess Admin Dashboard</h1>
        <div className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <h2>Global Messcut</h2>
              <p>Manage mess cuts for all students</p>
            </div>
            <div className="card-content">
              <Link to="/global-mess" className="full-button">💳 Manage Global Messcut</Link>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h2>Monthly Mess Report</h2>
              <p>Generate and view monthly attendance reports</p>
            </div>
            <div className="card-content">
              <Link to="/viewreport" className="full-button">👥 View Monthly Report</Link>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h2>User Management</h2>
              <p>Add, edit, or remove user accounts</p>
            </div>
            <div className="card-content">
              <Button className="full-button">👤 Manage Users</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}