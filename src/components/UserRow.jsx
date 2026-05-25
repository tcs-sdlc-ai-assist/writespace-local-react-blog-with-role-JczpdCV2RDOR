import React from 'react';
import PropTypes from 'prop-types';
import { getAvatar } from './Avatar';

/**
 * Formats an ISO date string or timestamp into a human-readable date.
 * @param {string|number} date - The date value to format.
 * @returns {string} Formatted date string, e.g. "Jan 15, 2024".
 */
function formatDate(date) {
  try {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * UserRow component that displays a user as a table row on desktop
 * and a stacked card on mobile.
 *
 * @param {Object} props
 * @param {Object} props.user - The user object.
 * @param {string} props.user.id - Unique user identifier.
 * @param {string} props.user.displayName - The user's display name.
 * @param {string} props.user.username - The user's username.
 * @param {'admin'|'user'} props.user.role - The user's role.
 * @param {string|number} [props.user.createdAt] - The user's account creation date.
 * @param {function} props.onDelete - Callback invoked with the user's id when delete is clicked.
 * @returns {JSX.Element} A user row (desktop) or stacked card (mobile).
 */
function UserRow({ user, onDelete }) {
  const isAdmin = user.role === 'admin';

  const roleBadge = isAdmin ? (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
      Admin
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
      User
    </span>
  );

  return (
    <>
      {/* Desktop table row */}
      <tr className="hidden md:table-row border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            {getAvatar(user.role)}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {user.displayName}
              </span>
              <span className="text-xs text-gray-400">@{user.username}</span>
            </div>
          </div>
        </td>
        <td className="px-5 py-4">
          {roleBadge}
        </td>
        <td className="px-5 py-4">
          <span className="text-sm text-gray-500">
            {user.createdAt ? formatDate(user.createdAt) : '—'}
          </span>
        </td>
        <td className="px-5 py-4 text-right">
          <button
            type="button"
            onClick={() => onDelete(user.id)}
            disabled={isAdmin}
            className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
              isAdmin
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
            }`}
            aria-label={`Delete ${user.displayName}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </td>
      </tr>

      {/* Mobile stacked card */}
      <div className="md:hidden bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getAvatar(user.role)}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {user.displayName}
              </span>
              <span className="text-xs text-gray-400">@{user.username}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onDelete(user.id)}
            disabled={isAdmin}
            className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
              isAdmin
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
            }`}
            aria-label={`Delete ${user.displayName}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-3 mt-3">
          {roleBadge}
          <span className="text-xs text-gray-400">
            {user.createdAt ? formatDate(user.createdAt) : '—'}
          </span>
        </div>
      </div>
    </>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['admin', 'user']).isRequired,
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UserRow;