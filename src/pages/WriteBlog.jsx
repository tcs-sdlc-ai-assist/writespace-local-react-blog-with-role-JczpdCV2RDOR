import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getSession } from '../utils/auth';
import { getPosts, savePosts } from '../utils/storage';

/**
 * Generates a simple UUID v4-like string.
 * @returns {string} A unique identifier string.
 */
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const TITLE_MAX_LENGTH = 150;
const CONTENT_MAX_LENGTH = 5000;

/**
 * WriteBlog component — blog post creation and editing form page.
 * - Create mode at route '/blogs/new'.
 * - Edit mode at route '/blogs/:id/edit'.
 * In edit mode, pre-fills form fields and enforces ownership:
 *   - Regular users can only edit their own posts (authorId === session.userId).
 *   - Admin users can edit any post.
 * Title and content fields with validation and character counters.
 * Cancel button navigates back without saving.
 * Saves to localStorage on submit.
 * @returns {JSX.Element} The blog post creation/editing page.
 */
function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    const allPosts = getPosts();
    const post = allPosts.find((p) => p.id === id);

    if (!post) {
      setNotFound(true);
      return;
    }

    // Enforce ownership: user can only edit own posts; admin can edit any
    if (session && session.role !== 'admin' && session.userId !== post.authorId) {
      setUnauthorized(true);
      return;
    }

    setTitle(post.title);
    setContent(post.content);
  }, [id, isEditMode, session]);

  /**
   * Handles form submission for creating or updating a blog post.
   * Validates title and content, saves to localStorage, and navigates away.
   * @param {React.FormEvent} e - The form submit event.
   */
  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError('Title and content are required.');
      return;
    }

    if (trimmedTitle.length > TITLE_MAX_LENGTH) {
      setError(`Title must be ${TITLE_MAX_LENGTH} characters or less.`);
      return;
    }

    if (trimmedContent.length > CONTENT_MAX_LENGTH) {
      setError(`Content must be ${CONTENT_MAX_LENGTH} characters or less.`);
      return;
    }

    setLoading(true);

    try {
      const allPosts = getPosts();

      if (isEditMode) {
        const postIndex = allPosts.findIndex((p) => p.id === id);
        if (postIndex === -1) {
          setError('Post not found.');
          setLoading(false);
          return;
        }

        allPosts[postIndex] = {
          ...allPosts[postIndex],
          title: trimmedTitle,
          content: trimmedContent,
        };

        savePosts(allPosts);
        navigate(`/blogs/${id}`, { replace: true });
      } else {
        const newPost = {
          id: generateId(),
          title: trimmedTitle,
          content: trimmedContent,
          date: new Date().toISOString(),
          authorId: session.userId,
          authorName: session.displayName || session.username,
          authorRole: session.role,
        };

        allPosts.push(newPost);
        savePosts(allPosts);
        navigate(`/blogs/${newPost.id}`, { replace: true });
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  /**
   * Handles cancel button click — navigates back without saving.
   */
  function handleCancel() {
    if (isEditMode) {
      navigate(`/blogs/${id}`);
    } else {
      navigate('/blogs');
    }
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Post Not Found
          </h1>
          <p className="text-gray-500 mb-6">
            The blog post you&apos;re trying to edit doesn&apos;t exist or has been removed.
          </p>
          <button
            type="button"
            onClick={() => navigate('/blogs')}
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Back to All Blogs
          </button>
        </main>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Unauthorized
          </h1>
          <p className="text-gray-500 mb-6">
            You don&apos;t have permission to edit this post.
          </p>
          <button
            type="button"
            onClick={() => navigate('/blogs')}
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Back to All Blogs
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditMode ? 'Edit Post' : 'Write a New Post'}
        </h1>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 md:p-8 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <span
                className={`text-xs ${
                  title.length > TITLE_MAX_LENGTH ? 'text-red-500' : 'text-gray-400'
                }`}
              >
                {title.length}/{TITLE_MAX_LENGTH}
              </span>
            </div>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Content
              </label>
              <span
                className={`text-xs ${
                  content.length > CONTENT_MAX_LENGTH ? 'text-red-500' : 'text-gray-400'
                }`}
              >
                {content.length}/{CONTENT_MAX_LENGTH}
              </span>
            </div>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post content here…"
              rows={12}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? isEditMode
                  ? 'Saving…'
                  : 'Publishing…'
                : isEditMode
                  ? 'Save Changes'
                  : 'Publish Post'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default WriteBlog;