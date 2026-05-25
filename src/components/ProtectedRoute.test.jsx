import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import * as auth from '../utils/auth';

vi.mock('../utils/auth', () => ({
  getSession: vi.fn(),
}));

function renderWithRouter(ui, { initialEntries = ['/protected'] } = {}) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/blogs" element={<div>Blogs Page</div>} />
        <Route path="/protected" element={ui} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('unauthenticated users', () => {
    it('redirects to /login when no session exists', () => {
      auth.getSession.mockReturnValue(null);

      renderWithRouter(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Login Page')).toBeTruthy();
      expect(screen.queryByText('Protected Content')).toBeNull();
    });
  });

  describe('authenticated regular users', () => {
    it('renders children when user is authenticated', () => {
      auth.getSession.mockReturnValue({
        userId: 'user1',
        username: 'johndoe',
        displayName: 'John Doe',
        role: 'user',
      });

      renderWithRouter(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected Content')).toBeTruthy();
    });

    it('redirects non-admin user to /blogs when role="admin" is required', () => {
      auth.getSession.mockReturnValue({
        userId: 'user1',
        username: 'johndoe',
        displayName: 'John Doe',
        role: 'user',
      });

      renderWithRouter(
        <ProtectedRoute role="admin">
          <div>Admin Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Blogs Page')).toBeTruthy();
      expect(screen.queryByText('Admin Content')).toBeNull();
    });
  });

  describe('authenticated admin users', () => {
    it('renders children when admin accesses a regular protected route', () => {
      auth.getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderWithRouter(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected Content')).toBeTruthy();
    });

    it('renders children when admin accesses an admin-only route', () => {
      auth.getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderWithRouter(
        <ProtectedRoute role="admin">
          <div>Admin Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Admin Content')).toBeTruthy();
    });
  });

  describe('edge cases', () => {
    it('redirects to /login when getSession returns null for admin route', () => {
      auth.getSession.mockReturnValue(null);

      renderWithRouter(
        <ProtectedRoute role="admin">
          <div>Admin Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Login Page')).toBeTruthy();
      expect(screen.queryByText('Admin Content')).toBeNull();
    });

    it('renders children when role prop is undefined and user is authenticated', () => {
      auth.getSession.mockReturnValue({
        userId: 'user2',
        username: 'janedoe',
        displayName: 'Jane Doe',
        role: 'user',
      });

      renderWithRouter(
        <ProtectedRoute>
          <div>Any User Content</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('Any User Content')).toBeTruthy();
    });
  });
});