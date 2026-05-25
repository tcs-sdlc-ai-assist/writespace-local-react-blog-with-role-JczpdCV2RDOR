# Changelog

All notable changes to the WriteSpace Blog project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2024-01-15

### Added

- **Public Landing Page** — Hero section with gradient background, feature highlights, latest posts preview, and footer with navigation links.
- **Authentication**
  - Login page with credential validation against hard-coded admin and localStorage users.
  - Registration page with display name, username, password, and confirm password fields.
  - Unique username validation during registration.
  - Session persistence via `localStorage` (`writespace_session` key).
  - Automatic redirect for already-authenticated users on login and register pages.
- **Role-Based Access Control**
  - `ProtectedRoute` component guarding authenticated and admin-only routes.
  - Hard-coded admin account (`admin` / `adminpass`) with full platform access.
  - Regular user accounts created via registration or admin user management panel.
  - Admin users can edit and delete any blog post; regular users can only manage their own.
- **Blog CRUD**
  - Create new blog posts with title (150 character limit) and content (5000 character limit).
  - Read single blog post view with author avatar, formatted date, and full content.
  - Edit existing blog posts with ownership enforcement.
  - Delete blog posts with confirmation dialog.
  - Blog post listing page sorted by newest first with color-coded preview cards.
  - Character counters and validation on title and content fields.
- **Admin Dashboard**
  - Platform statistics: total posts, total users, admin count, and regular user count.
  - Quick action buttons for writing new posts and managing users.
  - Recent posts list (up to 5) with inline edit and delete controls.
- **User Management (Admin)**
  - Create new users with display name, username, password, and role assignment (user or admin).
  - View all users in a responsive table (desktop) or card list (mobile).
  - Delete users with confirmation dialog.
  - Protection against deleting the hard-coded admin account and self-deletion.
- **localStorage Persistence**
  - Posts stored under `writespace_posts` key.
  - Users stored under `writespace_users` key.
  - Session stored under `writespace_session` key.
  - Graceful error handling for unavailable or full localStorage.
- **Responsive UI with Tailwind CSS**
  - Fully responsive layout across mobile, tablet, and desktop breakpoints.
  - Mobile hamburger navigation with dropdown menus in the authenticated navbar.
  - Gradient hero sections and consistent design language throughout.
  - Role-specific avatar emojis (👑 admin, 📖 user).
  - Color-coded blog cards with cycling border colors.
- **Client-Side Routing**
  - React Router v6 with public, authenticated, and admin-only route definitions.
  - Catch-all redirect to landing page for unknown routes.
- **Testing**
  - Unit tests for `auth.js` utilities (getSession, setSession, clearSession).
  - Unit tests for `storage.js` utilities (getPosts, savePosts, getUsers, saveUsers).
  - Component tests for `ProtectedRoute` covering auth and role-based redirects.
  - Page tests for `LoginPage` covering form rendering, validation, credential checks, session creation, and redirects.
  - Page tests for `RegisterPage` covering form rendering, validation, password matching, username uniqueness, successful registration, and redirects.
  - Vitest with jsdom environment and React Testing Library.
- **Vercel Deployment**
  - `vercel.json` with SPA rewrites for client-side routing support.
  - Auto-detected Vite framework preset for build and output configuration.