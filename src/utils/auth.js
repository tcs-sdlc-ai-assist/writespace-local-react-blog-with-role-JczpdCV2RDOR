const SESSION_KEY = 'writespace_session';

/**
 * Retrieve the current session from localStorage.
 * @returns {Object|null} Session object with userId, username, displayName, role — or null if not found.
 */
export function getSession() {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Save a session object to localStorage.
 * @param {Object} session - Session object to persist.
 * @param {string} session.userId - The user's unique identifier.
 * @param {string} session.username - The user's username.
 * @param {string} session.displayName - The user's display name.
 * @param {string} session.role - The user's role ('admin' or 'user').
 */
export function setSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Silently fail — localStorage may be full or unavailable
  }
}

/**
 * Remove the current session from localStorage.
 */
export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Silently fail — localStorage may be unavailable
  }
}