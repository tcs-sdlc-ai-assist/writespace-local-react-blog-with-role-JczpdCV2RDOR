import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getAvatar } from './Avatar';

const BORDER_COLORS = [
  'border-indigo-500',
  'border-violet-500',
  'border-pink-500',
  'border-rose-500',
  'border-orange-500',
  'border-amber-500',
  'border-emerald-500',
  'border-teal-500',
  'border-cyan-500',
  'border-blue-500',
];

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
 * Extracts the first 120 characters from content to use as an excerpt.
 * @param {string} content - The full blog post content.
 * @returns {string} Truncated excerpt with ellipsis if needed.
 */
function getExcerpt(content) {
  if (!content) return '';
  if (content.length <= 120) return content;
  return content.slice(0, 120) + '…';
}

/**
 * BlogCard component that displays a blog post preview.
 * @param {Object} props
 * @param {Object} props.post - The blog post object.
 * @param {string} props.post.id - Unique post identifier.
 * @param {string} props.post.title - Post title.
 * @param {string} props.post.content - Post content body.
 * @param {string|number} props.post.date - Post creation date.
 * @param {string} props.post.authorId - The user ID of the post author.
 * @param {string} props.post.authorName - Display name of the post author.
 * @param {string} [props.post.authorRole] - Role of the post author ('admin' or 'user').
 * @param {number} props.index - Index of the card in the list, used for border color cycling.
 * @returns {JSX.Element} A styled blog post preview card.
 */
function BlogCard({ post, index }) {
  const session = getSession();
  const borderColor = BORDER_COLORS[index % BORDER_COLORS.length];

  const canEdit =
    session &&
    (session.role === 'admin' || session.userId === post.authorId);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-t-4 ${borderColor} overflow-hidden hover:shadow-md transition-shadow`}
    >
      <div className="p-5">
        <Link
          to={`/blogs/${post.id}`}
          className="block text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors mb-2"
        >
          {post.title}
        </Link>

        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          {getExcerpt(post.content)}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
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
          )}
        </div>
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    authorId: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
    authorRole: PropTypes.oneOf(['admin', 'user']),
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default BlogCard;