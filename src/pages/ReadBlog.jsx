import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAvatar } from '../components/Avatar';
import { getSession } from '../utils/auth';
import { getPosts, savePosts } from '../utils/storage';

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
 * ReadBlog component — single blog post reading page at route '/blogs/:id'.
 * Displays the full blog post with title, author avatar, formatted date, and content.
 * Admin users see edit/delete controls on all posts.
 * Regular users see edit/delete only on their own posts (authorId matches session userId).
 * Delete uses a confirmation dialog and removes the post from localStorage.
 * Handles invalid or missing post IDs gracefully with a not-found state.
 * @returns {JSX.Element} The blog post reading page.
 */
function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const allPosts = getPosts();
    const found = allPosts.find((p) => p.id === id);
    if (found) {
      setPost(found);
    } else {
      setNotFound(true);
    }
  }, [id]);

  /**
   * Handles post deletion with a confirmation dialog.
   * Removes the post from localStorage and navigates back to /blogs.
   */
  function handleDelete() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this post? This action cannot be undone.'
    );
    if (!confirmed) return;

    const allPosts = getPosts();
    const updatedPosts = allPosts.filter((p) => p.id !== id);
    savePosts(updatedPosts);
    navigate('/blogs', { replace: true });
  }

  const canEdit =
    session &&
    post &&
    (session.role === 'admin' || session.userId === post.authorId);

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Post Not Found
          </h1>
          <p className="text-gray-500 mb-6">
            The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Back to All Blogs
          </Link>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-16 text-center">
          <p className="text-gray-400 text-lg">Loading…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-6">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to All Blogs
          </Link>
        </div>

        <article className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {getAvatar(post.authorRole || 'user')}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">
                  {post.authorName}
                </span>
                <span className="text-xs text-gray-400">
                  {formatDate(post.date)}
                </span>
              </div>
            </div>

            {canEdit && (
              <div className="flex items-center gap-2">
                <Link
                  to={`/blogs/${post.id}/edit`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}

export default ReadBlog;