import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, clearSession } from '../utils/auth';
import { getAvatar } from './Avatar';

/**
 * Authenticated navigation bar component.
 * - Shows 'WriteSpace' logo on the left.
 * - Role-based nav links:
 *   - Admin: All Blogs, Write, Users
 *   - User: All Blogs, Write
 * - Avatar chip with display name and logout dropdown on the right.
 * - Mobile hamburger toggle for responsive navigation.
 * @returns {JSX.Element} The authenticated navigation bar.
 */
function Navbar() {
  const session = getSession();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = session?.role === 'admin';

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function handleLogout() {
    clearSession();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/login');
  }

  const navLinks = [
    { to: '/blogs', label: 'All Blogs' },
    { to: '/blogs/new', label: 'Write' },
  ];

  if (isAdmin) {
    navLinks.push({ to: '/users', label: 'Users' });
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link
            to="/blogs"
            className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            WriteSpace
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {session && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                {getAvatar(session.role)}
                <span className="text-sm font-medium text-gray-700">
                  {session.displayName || session.username}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {session && (
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                {getAvatar(session.role)}
                <span className="text-sm font-medium text-gray-700">
                  {session.displayName || session.username}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;