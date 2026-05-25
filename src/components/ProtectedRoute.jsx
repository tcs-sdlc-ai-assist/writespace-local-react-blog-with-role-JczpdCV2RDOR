import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { getSession } from '../utils/auth';

/**
 * Route guard component that checks authentication and role-based access.
 * - Redirects unauthenticated users to /login.
 * - Redirects non-admin users to /blogs when role='admin' is required.
 * - Renders children if authorized.
 *
 * @param {Object} props
 * @param {'admin'} [props.role] - Optional required role for access.
 * @param {React.ReactNode} props.children - Child elements to render when authorized.
 * @returns {JSX.Element} Children if authorized, or a Navigate redirect.
 */
function ProtectedRoute({ role, children }) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin' && session.role !== 'admin') {
    return <Navigate to="/blogs" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  role: PropTypes.oneOf(['admin']),
  children: PropTypes.node.isRequired,
};

ProtectedRoute.defaultProps = {
  role: undefined,
};

export default ProtectedRoute;