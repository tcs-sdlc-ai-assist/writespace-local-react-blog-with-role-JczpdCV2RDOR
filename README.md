# WriteSpace Blog

A modern, client-side blogging platform built with React 18 and Vite. WriteSpace lets users write, share, and manage blog posts with role-based access control — all powered by localStorage for zero-backend simplicity.

## Tech Stack

- **React 18** — UI library with functional components and hooks
- **Vite 5** — Fast dev server and optimized production builds
- **React Router v6** — Client-side routing with protected routes
- **Tailwind CSS 3** — Utility-first styling
- **Vitest** — Unit testing framework
- **React Testing Library** — Component testing utilities
- **PropTypes** — Runtime prop validation

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens the app at [http://localhost:5173](http://localhost:5173).

### Build

```bash
npm run build
```

Outputs optimized production files to the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Run Tests

```bash
npm run test
```

Watch mode:

```bash
npm run test:watch
```

## Default Credentials

| Role  | Username | Password    |
|-------|----------|-------------|
| Admin | `admin`  | `adminpass` |

Regular user accounts can be created via the registration page or the admin user management panel.

## Folder Structure

```
writespace-blog/
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── vitest.config.js            # Vitest configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── vercel.json                 # Vercel deployment rewrites
├── .env.example                # Environment variable template
├── public/
│   └── vite.svg                # Favicon
└── src/
    ├── main.jsx                # React DOM entry point
    ├── App.jsx                 # Root component with route definitions
    ├── index.css               # Tailwind directives
    ├── components/
    │   ├── Avatar.jsx          # Role-specific emoji avatar
    │   ├── BlogCard.jsx        # Blog post preview card
    │   ├── Navbar.jsx          # Authenticated navigation bar
    │   ├── ProtectedRoute.jsx  # Route guard (auth + role check)
    │   ├── PublicNavbar.jsx    # Public/guest navigation bar
    │   ├── StatCard.jsx        # Dashboard statistic tile
    │   └── UserRow.jsx         # User table row / mobile card
    ├── pages/
    │   ├── AdminDashboard.jsx  # Admin overview dashboard
    │   ├── Home.jsx            # Blog post listing
    │   ├── LandingPage.jsx     # Public landing page
    │   ├── LoginPage.jsx       # Login form
    │   ├── ReadBlog.jsx        # Single blog post view
    │   ├── RegisterPage.jsx    # Registration form
    │   ├── UserManagement.jsx  # Admin user CRUD
    │   └── WriteBlog.jsx       # Create / edit blog post
    └── utils/
        ├── auth.js             # Session management (localStorage)
        └── storage.js          # Posts and users persistence (localStorage)
```

## Route Map

| Path              | Component        | Access          | Description                     |
|-------------------|------------------|-----------------|---------------------------------|
| `/`               | LandingPage      | Public          | Landing page with hero & features |
| `/login`          | LoginPage        | Public          | User login form                 |
| `/register`       | RegisterPage     | Public          | User registration form          |
| `/blogs`          | Home             | Authenticated   | All blog posts listing          |
| `/blogs/new`      | WriteBlog        | Authenticated   | Create a new blog post          |
| `/blogs/:id`      | ReadBlog         | Authenticated   | Read a single blog post         |
| `/blogs/:id/edit` | WriteBlog        | Authenticated   | Edit an existing blog post      |
| `/admin`          | AdminDashboard   | Admin only      | Platform overview dashboard     |
| `/users`          | UserManagement   | Admin only      | User CRUD management            |
| `*`               | —                | —               | Redirects to `/`                |

## Features

### Authentication & Authorization
- Hard-coded admin account with full platform access
- User registration with unique username validation
- Session persistence via localStorage
- Role-based route protection (user vs admin)
- Automatic redirect for already-authenticated users on login/register pages

### Blog Management
- Create, read, edit, and delete blog posts
- Rich post listing with color-coded cards and author avatars
- Character counters and validation on title (150 chars) and content (5000 chars)
- Ownership enforcement — users edit only their own posts, admins edit any post
- Confirmation dialogs before destructive actions

### Admin Dashboard
- Platform statistics: total posts, total users, admin count, user count
- Quick action buttons for common tasks
- Recent posts list with inline edit and delete controls

### User Management (Admin)
- Create new users with role assignment (user or admin)
- View all users in a responsive table (desktop) or card list (mobile)
- Delete users with confirmation — hard-coded admin and self-deletion are protected

### UI & Responsive Design
- Fully responsive layout with Tailwind CSS
- Mobile hamburger navigation with dropdown menus
- Gradient hero sections and consistent design language
- Role-specific avatar emojis (👑 admin, 📖 user)

## Data Storage

All data is stored in the browser's `localStorage`:

| Key                  | Description                  |
|----------------------|------------------------------|
| `writespace_session` | Current user session object  |
| `writespace_posts`   | Array of blog post objects   |
| `writespace_users`   | Array of registered users    |

No backend server or database is required. Data persists across page reloads but is scoped to the browser.

## Environment Variables

This is a client-side-only application. No environment variables are required to run the project.

If you add environment variables in the future, prefix them with `VITE_` so they are exposed to the client via `import.meta.env.VITE_*`. See `.env.example` for reference.

## Deployment on Vercel

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Import the project in [Vercel](https://vercel.com).
3. Vercel auto-detects Vite — no additional configuration needed.
4. The included `vercel.json` handles SPA rewrites so all routes resolve to `index.html`.
5. Click **Deploy**.

Build settings (auto-detected):

| Setting          | Value          |
|------------------|----------------|
| Framework Preset | Vite           |
| Build Command    | `npm run build`|
| Output Directory | `dist`         |

## License

This project is private and proprietary. All rights reserved. No part of this codebase may be reproduced, distributed, or transmitted in any form without prior written permission.