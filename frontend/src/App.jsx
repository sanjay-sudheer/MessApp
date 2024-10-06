import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./loginPage/loginPage";
import UserProfile from './userProfile/userProfile';

export default function App() {
  // const isAuthenticated = !!localStorage.getItem('token');
  const isAuthenticated =true;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/user-profile" 
          element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
