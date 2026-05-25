import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import UserRow from '../components/UserRow';
import { getSession } from '../utils/auth';
import { getUsers, saveUsers } from '../utils/storage';

/**
 * Generates a simple UUID v4-like string.
 * @returns {string} A unique identifier string.
 */
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Hard-coded admin user object for display in the user list.
 * @type {Object}
 */
const HARD_CODED_ADMIN = {
  id: 'admin',
  displayName: 'Admin',
  username: 'admin',
  role: 'admin',
  createdAt: null,
};

/**
 * UserManagement component — admin-only user management page at route '/users'.
 * Displays a create user form at the top with all fields required and unique username validation.
 * Below the form, shows a user table (desktop) / card list (mobile) using UserRow component.
 * Delete with confirmation dialog. Hard-coded admin cannot be deleted.
 * Logged-in user cannot delete their own account.
 * Non-admins are redirected to /blogs via ProtectedRoute.
 * @returns {JSX.Element} The user management page.
 */
function UserManagement() {
  const navigate = useNavigate();
  const session = getSession();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Re-read users on every render to stay in sync after create/delete
  const users = getUsers();

  // Build the full user list including the hard-coded admin
  const allUsers = [HARD_CODED_ADMIN, ...users];

  /**
   * Handles form submission for creating a new user.
   * Validates all fields, checks username uniqueness (including 'admin'),
   * saves to localStorage, and clears the form on success.
   * @param {React.FormEvent} e - The form submit event.
   */
  function handleCreateUser(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);

    try {
      const currentUsers = getUsers();

      // Check against hard-coded admin username
      if (trimmedUsername === 'admin') {
        setError('Username already exists.');
        setLoading(false);
        return;
      }

      // Check against existing localStorage users
      if (currentUsers.some((u) => u.username === trimmedUsername)) {
        setError('Username already exists.');
        setLoading(false);
        return;
      }

      const newUser = {
        id: generateId(),
        displayName: trimmedDisplayName,
        username: trimmedUsername,
        password: trimmedPassword,
        role: role,
        createdAt: new Date().toISOString(),
      };

      currentUsers.push(newUser);
      saveUsers(currentUsers);

      // Clear form
      setDisplayName('');
      setUsername('');
      setPassword('');
      setRole('user');
      setSuccess(`User "${newUser.displayName}" created successfully.`);
      setLoading(false);

      // Force re-render by navigating to the same page
      navigate('/users', { replace: true });
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  /**
   * Handles user deletion with a confirmation dialog.
   * Prevents deletion of the hard-coded admin and the currently logged-in user.
   * Removes the user from localStorage and re-renders.
   * @param {string} userId - The ID of the user to delete.
   */
  function handleDeleteUser(userId) {
    // Prevent deleting the hard-coded admin
    if (userId === 'admin') {
      return;
    }

    // Prevent deleting own account
    if (session && session.userId === userId) {
      setError('You cannot delete your own account.');
      return;
    }

    const userToDelete = users.find((u) => u.id === userId);
    const userName = userToDelete ? userToDelete.displayName : 'this user';

    const confirmed = window.confirm(
      `Are you sure you want to delete "${userName}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    const currentUsers = getUsers();
    const updatedUsers = currentUsers.filter((u) => u.id !== userId);
    saveUsers(updatedUsers);

    setSuccess(`User "${userName}" has been deleted.`);
    setError('');

    // Force re-render
    navigate('/users', { replace: true });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">User Management</h1>

        {/* Create User Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New User</h2>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-600">
              {success}
            </div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter display name"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  autoComplete="name"
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  autoComplete="username"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating…' : 'Create User'}
              </button>
            </div>
          </form>
        </div>

        {/* Users List */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            All Users ({allUsers.length})
          </h2>

          {allUsers.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((user) => (
                      <UserRow
                        key={user.id}
                        user={user}
                        onDelete={handleDeleteUser}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {allUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onDelete={handleDeleteUser}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-400 text-lg mb-2">No users found.</p>
              <p className="text-gray-400 text-sm">
                Create the first user using the form above.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserManagement;