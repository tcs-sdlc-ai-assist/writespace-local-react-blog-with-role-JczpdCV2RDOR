import React from 'react';
import { Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getAvatar } from './Avatar';

/**
 * Public/guest navigation bar component.
 * - Shows 'WriteSpace' logo on the left.
 * - For guests: 'Login' and 'Get Started' buttons on the right.
 * - For authenticated users: avatar chip with display name and 'Go to Dashboard' button.
 * @returns {JSX.Element} The public navigation bar.
 */
function PublicNavbar() {
  const session = getSession();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <Link to="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
        WriteSpace
      </Link>

      <div className="flex items-center gap-3">
        {session ? (
          <>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100">
              {getAvatar(session.role)}
              <span className="text-sm font-medium text-gray-700">
                {session.displayName || session.username}
              </span>
            </div>
            <Link
              to="/blogs"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Go to Dashboard
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default PublicNavbar;