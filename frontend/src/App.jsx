import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './loginPage/loginPage';
import AdminLoginPage from './adminLoginPage/adminLoginPage'; // Import Admin Login component
import UserProfile from './userProfile/userProfile';
import AdminPage from './admindashboard/admin';
import GlobalMessCut from './globalMessCut/globalMessCut';
import ViewMonthlyReport from './ViewMonthlyReport/viewMonthlyReport';
import AdminAdding from './AdminEditingFeatures/adminAdding/adminAdding';
import AdminEditing from './AdminEditingFeatures/adminEditing/adminEditing';
import AdminEditingOptions from './AdminEditing/adminEditingOptions';

export default function App() {
  const isUserAuthenticated = !!localStorage.getItem('token'); // Check user token
  const isAdminAuthenticated = !!localStorage.getItem('adminToken'); // Check admin token

  const ProtectedRoute = ({ element, isAuthenticated }) => {
    return isAuthenticated ? element : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} /> {/* Admin Login Page */}

        {/* Protected Routes for Users */}
        <Route 
          path="/user-profile" 
          element={<UserProfile />} 
        />

        {/* Protected Routes for Admin */}
        <Route 
          path="/admin" 
          element={<ProtectedRoute element={<AdminPage />} isAuthenticated={isAdminAuthenticated} />} 
        />
        <Route 
          path="/global-mess" 
          element={<ProtectedRoute element={<GlobalMessCut />} isAuthenticated={isAdminAuthenticated} />} 
        />
        <Route 
          path="/viewreport" 
          element={<ProtectedRoute element={<ViewMonthlyReport />} isAuthenticated={isAdminAuthenticated} />} 
        />
        <Route 
          path="/AdminAddingSection" 
          element={<ProtectedRoute element={<AdminAdding />} isAuthenticated={isAdminAuthenticated} />} 
        />
        <Route 
          path="/AdminEditSection" 
          element={<ProtectedRoute element={<AdminEditing />} isAuthenticated={isAdminAuthenticated} />} 
        />
        <Route 
          path="/AdminEditing" 
          element={<ProtectedRoute element={<AdminEditingOptions />} isAuthenticated={isAdminAuthenticated} />} 
        />

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
