import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BlogCard from '../components/BlogCard';
import { getPosts } from '../utils/storage';

/**
 * Home component — authenticated blog post listing page at route '/blogs'.
 * Displays all posts in a responsive grid sorted newest first.
 * Shows an empty state with a CTA to write the first post if no posts exist.
 * Accessible only to authenticated users (guarded by ProtectedRoute).
 * @returns {JSX.Element} The authenticated blog listing page.
 */
function Home() {
  const allPosts = getPosts();
  const sortedPosts = [...allPosts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">All Blogs</h1>
          <Link
            to="/blogs/new"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Write Post
          </Link>
        </div>

        {sortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-2">No posts yet.</p>
            <p className="text-gray-400 text-sm mb-6">
              Be the first to share your story!
            </p>
            <Link
              to="/blogs/new"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Write Your First Post
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;