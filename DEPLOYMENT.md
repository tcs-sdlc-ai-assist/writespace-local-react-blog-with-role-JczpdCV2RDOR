# Deployment Guide

This document covers how to deploy the WriteSpace Blog application to [Vercel](https://vercel.com), including SPA routing configuration, build commands, environment notes, and CI/CD auto-deploy setup.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Vercel Deployment](#vercel-deployment)
  - [Step 1 — Push to a Git Provider](#step-1--push-to-a-git-provider)
  - [Step 2 — Import Project in Vercel](#step-2--import-project-in-vercel)
  - [Step 3 — Configure Build Settings](#step-3--configure-build-settings)
  - [Step 4 — Deploy](#step-4--deploy)
- [SPA Routing Configuration](#spa-routing-configuration)
- [Build Commands](#build-commands)
- [Environment Variables](#environment-variables)
- [CI/CD Auto-Deploy on Push](#cicd-auto-deploy-on-push)
- [Custom Domain (Optional)](#custom-domain-optional)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- A [Vercel](https://vercel.com) account (free tier is sufficient).
- The repository hosted on **GitHub**, **GitLab**, or **Bitbucket**.
- Node.js 18+ used for local development and builds.

---

## Vercel Deployment

### Step 1 — Push to a Git Provider

Ensure your code is pushed to a remote repository on one of the supported Git providers:

```bash
git remote add origin https://github.com/<your-username>/writespace-blog.git
git branch -M main
git push -u origin main
```

### Step 2 — Import Project in Vercel

1. Log in to [vercel.com](https://vercel.com).
2. Click **"Add New…"** → **"Project"**.
3. Select your Git provider and authorize Vercel if prompted.
4. Find and select the **writespace-blog** repository.
5. Click **"Import"**.

### Step 3 — Configure Build Settings

Vercel auto-detects the Vite framework preset. The following settings are applied automatically:

| Setting          | Value           |
|------------------|-----------------|
| Framework Preset | Vite            |
| Build Command    | `npm run build` |
| Output Directory | `dist`          |
| Install Command  | `npm install`   |
| Node.js Version  | 18.x            |

> **Note:** You do not need to change any of these settings. Vercel's auto-detection handles everything correctly for this project.

### Step 4 — Deploy

1. Click **"Deploy"**.
2. Vercel will install dependencies, run the build, and deploy the application.
3. Once complete, you will receive a production URL (e.g., `https://writespace-blog.vercel.app`).

---

## SPA Routing Configuration

WriteSpace Blog is a single-page application (SPA) using React Router v6 for client-side routing. All routes must resolve to `index.html` so that React Router can handle them in the browser.

The included `vercel.json` file configures this rewrite rule:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### How It Works

- Any request to a path like `/blogs`, `/login`, `/admin`, or `/blogs/some-id` is rewritten to serve `index.html`.
- React Router then reads the URL and renders the correct page component.
- Without this rewrite, refreshing the browser on any route other than `/` would return a 404 error.

### Route Map

| Path              | Component        | Access          |
|-------------------|------------------|-----------------|
| `/`               | LandingPage      | Public          |
| `/login`          | LoginPage        | Public          |
| `/register`       | RegisterPage     | Public          |
| `/blogs`          | Home             | Authenticated   |
| `/blogs/new`      | WriteBlog        | Authenticated   |
| `/blogs/:id`      | ReadBlog         | Authenticated   |
| `/blogs/:id/edit` | WriteBlog        | Authenticated   |
| `/admin`          | AdminDashboard   | Admin only      |
| `/users`          | UserManagement   | Admin only      |
| `*`               | —                | Redirects to `/`|

---

## Build Commands

The following npm scripts are available:

| Command              | Description                                      |
|----------------------|--------------------------------------------------|
| `npm install`        | Install all dependencies                         |
| `npm run dev`        | Start the Vite development server (port 5173)    |
| `npm run build`      | Create an optimized production build in `dist/`  |
| `npm run preview`    | Preview the production build locally             |
| `npm run test`       | Run all tests once with Vitest                   |
| `npm run test:watch` | Run tests in watch mode with Vitest              |

### Production Build Output

Running `npm run build` produces the following in the `dist/` directory:

```
dist/
├── index.html
├── vite.svg
└── assets/
    ├── index-[hash].js
    └── index-[hash].css
```

All JavaScript and CSS are bundled, minified, and content-hashed for optimal caching.

---

## Environment Variables

**No environment variables are required to run or deploy this application.**

WriteSpace Blog is a fully client-side application. All data is stored in the browser's `localStorage`. There is no backend server, API, or database to configure.

If you add environment variables in the future:

1. Prefix them with `VITE_` so they are exposed to the client via `import.meta.env.VITE_*`.
2. Add them in the Vercel dashboard under **Settings** → **Environment Variables**.
3. Update the `.env.example` file in the repository for documentation purposes.

Example:

```
VITE_API_URL=https://api.example.com
```

> **Important:** Never store secrets or sensitive credentials in `VITE_`-prefixed variables. They are embedded in the client-side bundle and visible to anyone inspecting the source.

---

## CI/CD Auto-Deploy on Push

Vercel provides automatic deployments out of the box when connected to a Git repository.

### Production Deploys

- Every push to the **`main`** branch triggers a **production deployment**.
- The production URL remains stable (e.g., `https://writespace-blog.vercel.app`).
- If you use a custom domain, it points to the latest production deployment.

### Preview Deploys

- Every push to a **non-main branch** (e.g., feature branches) triggers a **preview deployment**.
- Each preview deployment gets a unique URL (e.g., `https://writespace-blog-abc123.vercel.app`).
- Preview URLs are automatically posted as comments on pull requests (GitHub/GitLab).

### Deployment Flow

```
Developer pushes code
        │
        ▼
Git provider triggers Vercel webhook
        │
        ▼
Vercel runs: npm install → npm run build
        │
        ▼
Build output (dist/) is deployed to Vercel's edge network
        │
        ▼
Deployment URL is live
```

### Configuring the Production Branch

By default, Vercel uses `main` as the production branch. To change this:

1. Go to your project in the Vercel dashboard.
2. Navigate to **Settings** → **Git**.
3. Under **Production Branch**, change the branch name.

### Skipping Deployments

To skip a deployment for a specific commit, include `[skip ci]` or `[vercel skip]` in the commit message:

```bash
git commit -m "Update README [skip ci]"
```

---

## Custom Domain (Optional)

To add a custom domain to your Vercel deployment:

1. Go to your project in the Vercel dashboard.
2. Navigate to **Settings** → **Domains**.
3. Enter your domain name (e.g., `blog.yourdomain.com`).
4. Follow the DNS configuration instructions provided by Vercel.
5. Vercel automatically provisions an SSL certificate via Let's Encrypt.

---

## Troubleshooting

### 404 on Page Refresh

If you see a 404 error when refreshing the browser on a route like `/blogs` or `/admin`:

- Verify that `vercel.json` exists in the project root with the SPA rewrite rule.
- Redeploy the project after adding or modifying `vercel.json`.

### Build Failures

If the build fails on Vercel:

1. Check the build logs in the Vercel dashboard under **Deployments** → select the failed deployment → **Build Logs**.
2. Ensure the build passes locally by running `npm run build`.
3. Verify that the Node.js version on Vercel matches your local version (18+).

### Stale Data After Deploy

Since all data is stored in `localStorage`, deployments do not affect user data. Data persists in each user's browser independently. Clearing browser data or switching browsers will reset all posts, users, and sessions.

### Tests Failing

Run tests locally before pushing:

```bash
npm run test
```

All tests must pass before deploying. If tests fail on Vercel (when using a CI integration), the deployment will not proceed.