import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import { getPosts } from '../utils/storage';

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
 * Extracts the first 100 characters from content to use as an excerpt.
 * @param {string} content - The full blog post content.
 * @returns {string} Truncated excerpt with ellipsis if needed.
 */
function getExcerpt(content) {
  if (!content) return '';
  if (content.length <= 100) return content;
  return content.slice(0, 100) + '…';
}

/**
 * Features data for the features section.
 * @type {Array<{title: string, description: string, icon: string}>}
 */
const FEATURES = [
  {
    title: 'Write with Ease',
    description:
      'A clean, distraction-free editor that lets you focus on what matters most — your words.',
    icon: '✍️',
  },
  {
    title: 'Share Your Voice',
    description:
      'Publish your thoughts and ideas to the world. Connect with readers who care about your perspective.',
    icon: '🌍',
  },
  {
    title: 'Manage Your Content',
    description:
      'Edit, update, and organize your posts effortlessly. Stay in control of your creative space.',
    icon: '📂',
  },
];

/**
 * LandingPage component — public-facing landing page at route '/'.
 * Includes hero section, features section, latest posts preview, and footer.
 * @returns {JSX.Element} The landing page.
 */
function LandingPage() {
  const allPosts = getPosts();
  const latestPosts = [...allPosts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-500 text-white">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Welcome to WriteSpace
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Your personal space to write, share, and discover stories that matter.
            Start your blogging journey today.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-indigo-600 bg-white rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white border-2 border-white rounded-lg hover:bg-white hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Why WriteSpace?
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Everything you need to create and share your stories with the world.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow"
            >
              <span className="text-4xl mb-4 block" role="img" aria-label={feature.title}>
                {feature.icon}
              </span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Latest Posts
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Check out what our community has been writing about.
            </p>
          </div>

          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-50 rounded-lg shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                >
                  <Link
                    to="/login"
                    className="block text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors mb-2"
                  >
                    {post.title}
                  </Link>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {getExcerpt(post.content)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {post.authorName || 'Anonymous'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(post.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">
                No posts yet. Be the first to share your story!
              </p>
              <Link
                to="/register"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Start Writing
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-gray-900 text-gray-400">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-lg font-bold text-white mb-1">
                WriteSpace
              </span>
              <span className="text-sm">
                Your personal blogging platform.
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="text-sm hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm hover:text-white transition-colors"
              >
                Register
              </Link>
              <Link
                to="/blogs"
                className="text-sm hover:text-white transition-colors"
              >
                Blogs
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;