import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./loginPage/loginPage";
import UserProfile from './userProfile/userProfile';
import AdminPage from './admindashboard/admin';
import GlobalMessCut from './adminlogin/globalMessCut';
import ViewMonthlyReport from './ViewMonthlyReport/viewMonthlyReport';
import AdminAdding from './AdminEditingFeatures/adminAdding/adminAdding';
import AdminEditing from './AdminEditingFeatures/adminEditing/adminEditing';
import AdminEditingOptions from './AdminEditing/adminEditingOptions';

export default function App() {
  const isAuthenticated = !!localStorage.getItem('token'); // Check for token
  console.log(isAuthenticated);

  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route 
          path="/user-profile" 
          element={<ProtectedRoute element={<UserProfile />} />} 
        />
        <Route 
          path="/admin" 
          element={<ProtectedRoute element={<AdminPage />} />} 
        />
        <Route 
          path="/global-mess" 
          element={<ProtectedRoute element={<GlobalMessCut />} />} 
        />
        <Route 
          path="/viewreport" 
          element={<ProtectedRoute element={<ViewMonthlyReport />} />} 
        />
        <Route 
          path="/AdminAddingSection" 
          element={<ProtectedRoute element={<AdminAdding />} />} 
        />
        <Route 
          path="/AdminEditSection" 
          element={<ProtectedRoute element={<AdminEditing />} />} 
        />
        <Route 
          path="/AdminEditing" 
          element={<ProtectedRoute element={<AdminEditingOptions />} />} 
        />
        {/* Redirect unknown routes to login */}
        <Route 
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}
