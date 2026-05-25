const POSTS_KEY = 'writespace_posts';
const USERS_KEY = 'writespace_users';

/**
 * Retrieve all posts from localStorage.
 * @returns {Array<Object>} Array of post objects, or empty array on failure.
 */
export function getPosts() {
  try {
    const data = localStorage.getItem(POSTS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Save posts array to localStorage.
 * @param {Array<Object>} posts - Array of post objects to persist.
 */
export function savePosts(posts) {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch {
    // Silently fail — localStorage may be full or unavailable
  }
}

/**
 * Retrieve all users from localStorage.
 * @returns {Array<Object>} Array of user objects, or empty array on failure.
 */
export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Save users array to localStorage.
 * @param {Array<Object>} users - Array of user objects to persist.
 */
export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // Silently fail — localStorage may be full or unavailable
  }
}