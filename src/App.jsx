import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Home from './pages/Home';
import ReadBlog from './pages/ReadBlog';
import WriteBlog from './pages/WriteBlog';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';

/**
 * Root application component.
 * Defines all route entries using React Router v6.
 * Wraps protected routes in ProtectedRoute (with role='admin' for admin-only routes).
 * @returns {JSX.Element} The root application with routing.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes — any authenticated user */}
        <Route
          path="/blogs"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs/new"
          element={
            <ProtectedRoute>
              <WriteBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <ProtectedRoute>
              <ReadBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs/:id/edit"
          element={
            <ProtectedRoute>
              <WriteBlog />
            </ProtectedRoute>
          }
        />

        {/* Admin-only routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute role="admin">
              <UserManagement />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;