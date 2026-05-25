import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import * as auth from '../utils/auth';
import * as storage from '../utils/storage';

vi.mock('../utils/auth', () => ({
  getSession: vi.fn(),
  setSession: vi.fn(),
  clearSession: vi.fn(),
}));

vi.mock('../utils/storage', () => ({
  getUsers: vi.fn(),
  saveUsers: vi.fn(),
  getPosts: vi.fn(() => []),
  savePosts: vi.fn(),
}));

function renderLoginPage({ initialEntries = ['/login'] } = {}) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/blogs" element={<div>Blogs Page</div>} />
        <Route path="/" element={<div>Landing Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    auth.getSession.mockReturnValue(null);
    storage.getUsers.mockReturnValue([]);
  });

  describe('form rendering', () => {
    it('renders the login form with username and password fields', () => {
      renderLoginPage();

      expect(screen.getByLabelText('Username')).toBeTruthy();
      expect(screen.getByLabelText('Password')).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeTruthy();
    });

    it('renders the WriteSpace logo link', () => {
      renderLoginPage();

      expect(screen.getByText('WriteSpace')).toBeTruthy();
    });

    it('renders a link to the registration page', () => {
      renderLoginPage();

      expect(screen.getByText('Get Started')).toBeTruthy();
    });

    it('renders sign in description text', () => {
      renderLoginPage();

      expect(screen.getByText('Sign in to your account')).toBeTruthy();
    });
  });

  describe('validation', () => {
    it('displays error when both fields are empty', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('All fields are required.')).toBeTruthy();
    });

    it('displays error when username is empty', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Password'), 'somepassword');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('All fields are required.')).toBeTruthy();
    });

    it('displays error when password is empty', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'someuser');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('All fields are required.')).toBeTruthy();
    });

    it('displays error when fields contain only whitespace', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), '   ');
      await user.type(screen.getByLabelText('Password'), '   ');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('All fields are required.')).toBeTruthy();
    });
  });

  describe('admin credential check', () => {
    it('logs in with hard-coded admin credentials and sets session', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'admin');
      await user.type(screen.getByLabelText('Password'), 'adminpass');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(auth.setSession).toHaveBeenCalledWith({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });
    });

    it('redirects to /blogs after successful admin login', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'admin');
      await user.type(screen.getByLabelText('Password'), 'adminpass');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(screen.getByText('Blogs Page')).toBeTruthy();
      });
    });

    it('displays error for wrong admin password', async () => {
      const user = userEvent.setup();
      storage.getUsers.mockReturnValue([]);
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'admin');
      await user.type(screen.getByLabelText('Password'), 'wrongpass');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Invalid username or password.')).toBeTruthy();
    });
  });

  describe('localStorage user check', () => {
    it('logs in with a valid localStorage user and sets session', async () => {
      const mockUsers = [
        {
          id: 'user1',
          username: 'johndoe',
          password: 'pass123',
          displayName: 'John Doe',
          role: 'user',
        },
      ];
      storage.getUsers.mockReturnValue(mockUsers);

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'johndoe');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(auth.setSession).toHaveBeenCalledWith({
        userId: 'user1',
        username: 'johndoe',
        displayName: 'John Doe',
        role: 'user',
      });
    });

    it('redirects to /blogs after successful user login', async () => {
      const mockUsers = [
        {
          id: 'user1',
          username: 'johndoe',
          password: 'pass123',
          displayName: 'John Doe',
          role: 'user',
        },
      ];
      storage.getUsers.mockReturnValue(mockUsers);

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'johndoe');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      await waitFor(() => {
        expect(screen.getByText('Blogs Page')).toBeTruthy();
      });
    });

    it('displays error for invalid localStorage user credentials', async () => {
      const mockUsers = [
        {
          id: 'user1',
          username: 'johndoe',
          password: 'pass123',
          displayName: 'John Doe',
          role: 'user',
        },
      ];
      storage.getUsers.mockReturnValue(mockUsers);

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'johndoe');
      await user.type(screen.getByLabelText('Password'), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Invalid username or password.')).toBeTruthy();
    });

    it('displays error for non-existent username', async () => {
      storage.getUsers.mockReturnValue([]);

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'nonexistent');
      await user.type(screen.getByLabelText('Password'), 'somepass');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Invalid username or password.')).toBeTruthy();
    });
  });

  describe('session creation on success', () => {
    it('does not call setSession when credentials are invalid', async () => {
      storage.getUsers.mockReturnValue([]);

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'baduser');
      await user.type(screen.getByLabelText('Password'), 'badpass');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(auth.setSession).not.toHaveBeenCalled();
    });

    it('does not call setSession when validation fails', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(auth.setSession).not.toHaveBeenCalled();
    });
  });

  describe('error display on failure', () => {
    it('clears previous error when submitting again', async () => {
      storage.getUsers.mockReturnValue([]);

      const user = userEvent.setup();
      renderLoginPage();

      // First attempt — invalid credentials
      await user.type(screen.getByLabelText('Username'), 'baduser');
      await user.type(screen.getByLabelText('Password'), 'badpass');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Invalid username or password.')).toBeTruthy();

      // Clear and try empty fields
      await user.clear(screen.getByLabelText('Username'));
      await user.clear(screen.getByLabelText('Password'));
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('All fields are required.')).toBeTruthy();
      expect(screen.queryByText('Invalid username or password.')).toBeNull();
    });
  });

  describe('redirect for authenticated users', () => {
    it('redirects authenticated regular user to /blogs', async () => {
      auth.getSession.mockReturnValue({
        userId: 'user1',
        username: 'johndoe',
        displayName: 'John Doe',
        role: 'user',
      });

      renderLoginPage();

      await waitFor(() => {
        expect(screen.getByText('Blogs Page')).toBeTruthy();
      });
    });

    it('redirects authenticated admin user to /blogs', async () => {
      auth.getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderLoginPage();

      await waitFor(() => {
        expect(screen.getByText('Blogs Page')).toBeTruthy();
      });
    });

    it('does not redirect unauthenticated users', () => {
      auth.getSession.mockReturnValue(null);

      renderLoginPage();

      expect(screen.getByLabelText('Username')).toBeTruthy();
      expect(screen.queryByText('Blogs Page')).toBeNull();
    });
  });
});