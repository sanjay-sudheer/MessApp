import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './loginPage/loginPage';
import AdminLoginPage from './adminLoginPage/adminLoginPage'; // Import Admin Login component
import UserProfile from './userProfile/userProfile';
import AdminPage from './admindashboard/admin';
import GlobalMessCut from './globalMessCut/globalMessCut';
import ViewMonthlyReport from './viewMonthlyReport/viewMonthlyReport';
import AdminAdding from './AdminEditingFeatures/adminAdding/adminAdding';
import AdminEditing from './AdminEditingFeatures/adminEditing/adminEditing';
import AdminEditingOptions from './AdminEditing/adminEditingOptions';
import PrevMesscut from './viewPrevMessCut/prevMessCut';

export default function App() {
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
          element={<AdminPage />} 
        />
        <Route 
          path="/global-mess" 
          element={<GlobalMessCut />} 
        />
        <Route 
          path="/viewreport" 
          element={<ViewMonthlyReport />} 
        />
        <Route 
          path="/AdminAddingSection" 
          element={<AdminAdding />} 
        />
        <Route 
          path="/AdminEditSection" 
          element={<AdminEditing />} 
        />
        <Route 
          path="/AdminEditing" 
          element={<AdminEditingOptions />} 
        />
        <Route 
          path="/prevmesscut" 
          element={<PrevMesscut />} 
        />

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
