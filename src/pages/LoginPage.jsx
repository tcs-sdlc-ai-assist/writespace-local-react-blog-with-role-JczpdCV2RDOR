import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, setSession } from '../utils/auth';
import { getUsers } from '../utils/storage';

/**
 * LoginPage component — user authentication login page at route '/login'.
 * Features a gradient background with a centered card form.
 * Validates credentials against hard-coded admin and localStorage users.
 * Redirects authenticated users away from the login page.
 * @returns {JSX.Element} The login page.
 */
function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session) {
      if (session.role === 'admin') {
        navigate('/blogs', { replace: true });
      } else {
        navigate('/blogs', { replace: true });
      }
    }
  }, [navigate]);

  /**
   * Handles form submission for login.
   * Checks hard-coded admin credentials first, then localStorage users.
   * Sets session and redirects on success, displays error on failure.
   * @param {React.FormEvent} e - The form submit event.
   */
  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);

    try {
      // Check hard-coded admin credentials first
      if (trimmedUsername === 'admin' && trimmedPassword === 'adminpass') {
        setSession({
          userId: 'admin',
          username: 'admin',
          displayName: 'Admin',
          role: 'admin',
        });
        navigate('/blogs', { replace: true });
        return;
      }

      // Check localStorage users
      const users = getUsers();
      const user = users.find(
        (u) => u.username === trimmedUsername && u.password === trimmedPassword
      );

      if (!user) {
        setError('Invalid username or password.');
        setLoading(false);
        return;
      }

      setSession({
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      });

      navigate('/blogs', { replace: true });
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Link
              to="/"
              className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              WriteSpace
            </Link>
            <p className="text-sm text-gray-500 mt-2">
              Sign in to your account
            </p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="Enter your username"
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
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Get Started
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;