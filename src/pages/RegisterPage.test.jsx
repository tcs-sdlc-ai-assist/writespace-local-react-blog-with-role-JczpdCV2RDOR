import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './RegisterPage';
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

function renderRegisterPage({ initialEntries = ['/register'] } = {}) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/blogs" element={<div>Blogs Page</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/" element={<div>Landing Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    auth.getSession.mockReturnValue(null);
    storage.getUsers.mockReturnValue([]);
  });

  describe('form rendering', () => {
    it('renders the registration form with all fields', () => {
      renderRegisterPage();

      expect(screen.getByLabelText('Display Name')).toBeTruthy();
      expect(screen.getByLabelText('Username')).toBeTruthy();
      expect(screen.getByLabelText('Password')).toBeTruthy();
      expect(screen.getByLabelText('Confirm Password')).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Create Account' })).toBeTruthy();
    });

    it('renders the WriteSpace logo link', () => {
      renderRegisterPage();

      expect(screen.getByText('WriteSpace')).toBeTruthy();
    });

    it('renders a link to the login page', () => {
      renderRegisterPage();

      expect(screen.getByText('Sign In')).toBeTruthy();
    });

    it('renders create account description text', () => {
      renderRegisterPage();

      expect(screen.getByText('Create your account')).toBeTruthy();
    });
  });

  describe('validation', () => {
    it('displays error when all fields are empty', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.getByText('All fields are required.')).toBeTruthy();
    });

    it('displays error when display name is empty', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      await user.type(screen.getByLabelText('Username'), 'johndoe');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.type(screen.getByLabelText('Confirm Password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.getByText('All fields are required.')).toBeTruthy();
    });

    it('displays error when username is empty', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      await user.type(screen.getByLabelText('Display Name'), 'John Doe');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.type(screen.getByLabelText('Confirm Password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.getByText('All fields are required.')).toBeTruthy();
    });

    it('displays error when password is empty', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      await user.type(screen.getByLabelText('Display Name'), 'John Doe');
      await user.type(screen.getByLabelText('Username'), 'johndoe');
      await user.type(screen.getByLabelText('Confirm Password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.getByText('All fields are required.')).toBeTruthy();
    });

    it('displays error when confirm password is empty', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      await user.type(screen.getByLabelText('Display Name'), 'John Doe');
      await user.type(screen.getByLabelText('Username'), 'johndoe');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.getByText('All fields are required.')).toBeTruthy();
    });

    it('displays error when fields contain only whitespace', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      await user.type(screen.getByLabelText('Display Name'), '   ');
      await user.type(screen.getByLabelText('Username'), '   ');
      await user.type(screen.getByLabelText('Password'), '   ');
      await user.type(screen.getByLabelText('Confirm Password'), '   ');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.getByText('All fields are required.')).toBeTruthy();
    });
  });

  describe('password match check', () => {
    it('displays error when passwords do not match', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      await user.type(screen.getByLabelText('Display Name'), 'John Doe');
      await user.type(screen.getByLabelText('Username'), 'johndoe');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.type(screen.getByLabelText('Confirm Password'), 'differentpass');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.getByText('Passwords do not match.')).toBeTruthy();
    });

    it('does not display password mismatch error when passwords match', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      await user.type(screen.getByLabelText('Display Name'), 'John Doe');
      await user.type(screen.getByLabelText('Username'), 'johndoe');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.type(screen.getByLabelText('Confirm Password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.queryByText('Passwords do not match.')).toBeNull();
    });
  });

  describe('username uniqueness', () => {
    it('displays error when username already exists', async () => {
      const mockUsers = [
        {
          id: 'user1',
          username: 'johndoe',
          password: 'pass123',
          displayName: 'John Doe',
          role: 'user',
          createdAt: '2024-01-15T00:00:00.000Z',
        },
      ];
      storage.getUsers.mockReturnValue(mockUsers);

      const user = userEvent.setup();
      renderRegisterPage();

      await user.type(screen.getByLabelText('Display Name'), 'Another John');
      await user.type(screen.getByLabelText('Username'), 'johndoe');
      await user.type(screen.getByLabelText('Password'), 'newpass');
      await user.type(screen.getByLabelText('Confirm Password'), 'newpass');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.getByText('Username already exists.')).toBeTruthy();
    });

    it('does not call setSession when username already exists', async () => {
      const mockUsers = [
        {
          id: 'user1',
          username: 'johndoe',
          password: 'pass123',
          displayName: 'John Doe',
          role: 'user',
          createdAt: '2024-01-15T00:00:00.000Z',
        },
      ];
      storage.getUsers.mockReturnValue(mockUsers);

      const user = userEvent.setup();
      renderRegisterPage();

      await user.type(screen.getByLabelText('Display Name'), 'Another John');
      await user.type(screen.getByLabelText('Username'), 'johndoe');
      await user.type(screen.getByLabelText('Password'), 'newpass');
      await user.type(screen.getByLabelText('Confirm Password'), 'newpass');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(auth.setSession).not.toHaveBeenCalled();
    });

    it('does not call saveUsers when username already exists', async () => {
      const mockUsers = [
        {
          id: 'user1',
          username: 'johndoe',
          password: 'pass123',
          displayName: 'John Doe',
          role: 'user',
          createdAt: '2024-01-15T00:00:00.000Z',
        },
      ];
      storage.getUsers.mockReturnValue(mockUsers);

      const user = userEvent.setup();
      renderRegisterPage();

      await user.type(screen.getByLabelText('Display Name'), 'Another John');
      await user.type(screen.getByLabelText('Username'), 'johndoe');
      await user.type(screen.getByLabelText('Password'), 'newpass');
      await user.type(screen.getByLabelText('Confirm Password'), 'newpass');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(storage.saveUsers).not.toHaveBeenCalled();
    });
  });

  describe('successful registration', () => {
    it('calls saveUsers with the new user added to the array', async () => {
      storage.getUsers.mockReturnValue([]);

      const user = userEvent.setup();
      renderRegisterPage();

      await user.type(screen.getByLabelText('Display Name'), 'John Doe');
      await user.type(screen.getByLabelText('Username'), 'johndoe');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.type(screen.getByLabelText('Confirm Password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(storage.saveUsers).toHaveBeenCalledTimes(1);
      const savedUsers = storage.saveUsers.mock.calls[0][0];
      expect(savedUsers).toHaveLength(1);
      expect(savedUsers[0].displayName).toBe('John Doe');
      expect(savedUsers[0].username).toBe('johndoe');
      expect(savedUsers[0].password).toBe('pass123');
      expect(savedUsers[0].role).toBe('user');
      expect(savedUsers[0].id).toBeTruthy();
      expect(savedUsers[0].createdAt).toBeTruthy();
    });

    it('calls setSession with the correct session data', async () => {
      storage.getUsers.mockReturnValue([]);

      const user = userEvent.setup();
      renderRegisterPage();

      await user.type(screen.getByLabelText('Display Name'), 'John Doe');
      await user.type(screen.getByLabelText('Username'), 'johndoe');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.type(screen.getByLabelText('Confirm Password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(auth.setSession).toHaveBeenCalledTimes(1);
      const sessionArg = auth.setSession.mock.calls[0][0];
      expect(sessionArg.username).toBe('johndoe');
      expect(sessionArg.displayName).toBe('John Doe');
      expect(sessionArg.role).toBe('user');
      expect(sessionArg.userId).toBeTruthy();
    });

    it('redirects to /blogs after successful registration', async () => {
      storage.getUsers.mockReturnValue([]);

      const user = userEvent.setup();
      renderRegisterPage();

      await user.type(screen.getByLabelText('Display Name'), 'John Doe');
      await user.type(screen.getByLabelText('Username'), 'johndoe');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.type(screen.getByLabelText('Confirm Password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      await waitFor(() => {
        expect(screen.getByText('Blogs Page')).toBeTruthy();
      });
    });

    it('appends new user to existing users array', async () => {
      const existingUsers = [
        {
          id: 'user1',
          username: 'existinguser',
          password: 'pass',
          displayName: 'Existing User',
          role: 'user',
          createdAt: '2024-01-15T00:00:00.000Z',
        },
      ];
      storage.getUsers.mockReturnValue(existingUsers);

      const user = userEvent.setup();
      renderRegisterPage();

      await user.type(screen.getByLabelText('Display Name'), 'New User');
      await user.type(screen.getByLabelText('Username'), 'newuser');
      await user.type(screen.getByLabelText('Password'), 'newpass');
      await user.type(screen.getByLabelText('Confirm Password'), 'newpass');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(storage.saveUsers).toHaveBeenCalledTimes(1);
      const savedUsers = storage.saveUsers.mock.calls[0][0];
      expect(savedUsers).toHaveLength(2);
      expect(savedUsers[0].username).toBe('existinguser');
      expect(savedUsers[1].username).toBe('newuser');
    });
  });

  describe('session creation on success', () => {
    it('does not call setSession when validation fails', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(auth.setSession).not.toHaveBeenCalled();
    });

    it('does not call setSession when passwords do not match', async () => {
      const user = userEvent.setup();
      renderRegisterPage();

      await user.type(screen.getByLabelText('Display Name'), 'John Doe');
      await user.type(screen.getByLabelText('Username'), 'johndoe');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.type(screen.getByLabelText('Confirm Password'), 'differentpass');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(auth.setSession).not.toHaveBeenCalled();
    });
  });

  describe('error display on failure', () => {
    it('clears previous error when submitting again', async () => {
      storage.getUsers.mockReturnValue([]);

      const user = userEvent.setup();
      renderRegisterPage();

      // First attempt — passwords don't match
      await user.type(screen.getByLabelText('Display Name'), 'John Doe');
      await user.type(screen.getByLabelText('Username'), 'johndoe');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.type(screen.getByLabelText('Confirm Password'), 'differentpass');
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.getByText('Passwords do not match.')).toBeTruthy();

      // Clear and try empty fields
      await user.clear(screen.getByLabelText('Display Name'));
      await user.clear(screen.getByLabelText('Username'));
      await user.clear(screen.getByLabelText('Password'));
      await user.clear(screen.getByLabelText('Confirm Password'));
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      expect(screen.getByText('All fields are required.')).toBeTruthy();
      expect(screen.queryByText('Passwords do not match.')).toBeNull();
    });
  });

  describe('redirect for authenticated users', () => {
    it('redirects authenticated user to /blogs', async () => {
      auth.getSession.mockReturnValue({
        userId: 'user1',
        username: 'johndoe',
        displayName: 'John Doe',
        role: 'user',
      });

      renderRegisterPage();

      await waitFor(() => {
        expect(screen.getByText('Blogs Page')).toBeTruthy();
      });
    });

    it('redirects authenticated admin to /blogs', async () => {
      auth.getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderRegisterPage();

      await waitFor(() => {
        expect(screen.getByText('Blogs Page')).toBeTruthy();
      });
    });

    it('does not redirect unauthenticated users', () => {
      auth.getSession.mockReturnValue(null);

      renderRegisterPage();

      expect(screen.getByLabelText('Display Name')).toBeTruthy();
      expect(screen.queryByText('Blogs Page')).toBeNull();
    });
  });
});