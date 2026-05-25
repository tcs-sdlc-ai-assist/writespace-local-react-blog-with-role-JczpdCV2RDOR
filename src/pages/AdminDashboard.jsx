import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import { getAvatar } from '../components/Avatar';
import { getSession } from '../utils/auth';
import { getPosts, savePosts, getUsers } from '../utils/storage';

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
 * Extracts the first 80 characters from content to use as an excerpt.
 * @param {string} content - The full blog post content.
 * @returns {string} Truncated excerpt with ellipsis if needed.
 */
function getExcerpt(content) {
  if (!content) return '';
  if (content.length <= 80) return content;
  return content.slice(0, 80) + '…';
}

/**
 * AdminDashboard component — admin-only overview dashboard at route '/admin'.
 * Displays stat cards for total posts, total users, admin count, and user count.
 * Shows quick action buttons and the 5 most recent posts with edit/delete controls.
 * Non-admin users are redirected to /blogs via ProtectedRoute.
 * @returns {JSX.Element} The admin dashboard page.
 */
function AdminDashboard() {
  const navigate = useNavigate();
  const session = getSession();
  const allPosts = getPosts();
  const allUsers = getUsers();

  const totalPosts = allPosts.length;
  const totalUsers = allUsers.length + 1; // +1 for hard-coded admin
  const adminCount = allUsers.filter((u) => u.role === 'admin').length + 1; // +1 for hard-coded admin
  const userCount = allUsers.filter((u) => u.role === 'user').length;

  const recentPosts = [...allPosts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  /**
   * Handles post deletion with a confirmation dialog.
   * Removes the post from localStorage and re-renders by navigating.
   * @param {string} postId - The ID of the post to delete.
   * @param {string} postTitle - The title of the post (for confirmation message).
   */
  function handleDelete(postId, postTitle) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${postTitle}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    const currentPosts = getPosts();
    const updatedPosts = currentPosts.filter((p) => p.id !== postId);
    savePosts(updatedPosts);
    navigate('/admin', { replace: true });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Gradient Header Banner */}
      <section className="bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 text-white">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-2">
            {getAvatar(session?.role || 'admin')}
            <h1 className="text-2xl md:text-3xl font-bold">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-indigo-100 text-sm md:text-base">
            Welcome back, {session?.displayName || session?.username || 'Admin'}. Here&apos;s an overview of your platform.
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            value={totalPosts}
            label="Total Posts"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            }
            bgColor="bg-indigo-100"
            textColor="text-indigo-600"
          />
          <StatCard
            value={totalUsers}
            label="Total Users"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            bgColor="bg-violet-100"
            textColor="text-violet-600"
          />
          <StatCard
            value={adminCount}
            label="Admins"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            bgColor="bg-pink-100"
            textColor="text-pink-600"
          />
          <StatCard
            value={userCount}
            label="Regular Users"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            bgColor="bg-emerald-100"
            textColor="text-emerald-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/blogs/new"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Write New Post
            </Link>
            <Link
              to="/users"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Manage Users
            </Link>
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Posts</h2>
            <Link
              to="/blogs"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              View All
            </Link>
          </div>

          {recentPosts.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {getAvatar(post.authorRole || 'user')}
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/blogs/${post.id}`}
                        className="block text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors truncate"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-gray-500 truncate">
                        {getExcerpt(post.content)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">
                          {post.authorName}
                        </span>
                        <span className="text-xs text-gray-300">·</span>
                        <span className="text-xs text-gray-400">
                          {formatDate(post.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                    <Link
                      to={`/blogs/${post.id}/edit`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      aria-label={`Edit ${post.title}`}
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
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id, post.title)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      aria-label={`Delete ${post.title}`}
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
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-400 text-lg mb-2">No posts yet.</p>
              <p className="text-gray-400 text-sm mb-6">
                Create the first post for your platform!
              </p>
              <Link
                to="/blogs/new"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Write Your First Post
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;