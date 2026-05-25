import React from 'react';
import PropTypes from 'prop-types';

/**
 * Avatar component that displays a role-specific emoji with styled background.
 * @param {Object} props
 * @param {'admin'|'user'} props.role - The user's role.
 * @returns {JSX.Element} A styled span element with role-specific emoji and colors.
 */
function Avatar({ role }) {
  const isAdmin = role === 'admin';
  const emoji = isAdmin ? '👑' : '📖';
  const bgClass = isAdmin
    ? 'bg-violet-100 text-violet-700'
    : 'bg-indigo-100 text-indigo-700';

  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm ${bgClass}`}
      role="img"
      aria-label={isAdmin ? 'Admin avatar' : 'User avatar'}
    >
      {emoji}
    </span>
  );
}

Avatar.propTypes = {
  role: PropTypes.oneOf(['admin', 'user']).isRequired,
};

/**
 * Returns a styled JSX <span> with an emoji and role-specific Tailwind classes.
 * @param {'admin'|'user'} role - The user's role.
 * @returns {JSX.Element} A styled Avatar span element.
 */
export function getAvatar(role) {
  return <Avatar role={role === 'admin' ? 'admin' : 'user'} />;
}

export { Avatar };
export default Avatar;