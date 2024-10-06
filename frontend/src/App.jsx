import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./loginPage/loginPage";
import UserProfile from './userProfile/userProfile';
import AdminPage from './admindashboard/admin';
import GlobalMessCut from './adminlogin/globalMessCut';
import ViewMonthlyReport from './ViewMonthlyReport/viewMonthlyReport';
export default function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  console.log(isAuthenticated)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/user-profile" 
          element={ <UserProfile />}
        />
        <Route 
          path="/admin" 
          element={<AdminPage />}
        />
        <Route path="/global-mess" element={<GlobalMessCut />}>
        </Route>
        <Route path="/viewreport" element={<ViewMonthlyReport />} />
      </Routes>
    </BrowserRouter>
  );
}