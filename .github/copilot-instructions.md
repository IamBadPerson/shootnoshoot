# Copilot Instructions — ShootNoShoot

A React + Vite medieval reenactment training application with three interactive game modes and leaderboard tracking, deployed to GitHub Pages.

## Project Overview

This is a Vite-powered React app configured for automatic deployment to GitHub Pages. The application provides training tools for historical reenactment archery safety, distance estimation, and authentic military commands. Features password protection, nickname-based user tracking, and localStorage-based leaderboards.

## Key Files & Architecture

**Core Configuration:**
- **`package.json`** — Defines `dev`, `build`, `preview`, and `deploy` scripts. Always use these scripts rather than calling tools directly.
- **`vite.config.js`** — Sets `base: './'` for relative paths on GitHub Pages. Uses relative paths instead of absolute for better compatibility.
- **`src/main.jsx`** — React app entry point; renders `<App />` into `#root`.
- **`.github/workflows/deploy.yml`** — GitHub Actions workflow that builds and deploys on every push to `main`.

**Application Components:**
- **`src/App.jsx`** — Main application router with password authentication ("Banner"), nickname management, and Shoot/No-Shoot game logic.
- **`src/DistanceGame.jsx`** — Distance estimation training game (5'9" person at 5-30m ranges).
- **`src/Flashcards.jsx`** — Authentic Orders flashcard system (23 commands in Norman French/Early English with 5 modes).
- **`src/Leaderboard.jsx`** — Displays top 10 scores for all three games with player nicknames.

**Data & Assets:**
- **`public/scenarios.json`** — 6 shoot/no-shoot scenarios with archery safety context.
- **`public/.nojekyll`** — Disables Jekyll processing on GitHub Pages.

## Developer Workflows

**Local development:**
```bash
npm install
npm run dev
```
Visit `http://localhost:5173/ShootNoShoot/` (note the base path).

**Production build & preview:**
```bash
npm run build
npm run preview
```

**Manual deployment:**
```bash
npm run deploy
```
(Pushes `dist/` to the `gh-pages` branch.)

**Automated deployment:**
Push to `main` → GitHub Actions builds and deploys automatically. Ensure **Settings → Pages → Source** is set to **GitHub Actions**.

## Conventions & Patterns

- **Component files:** Use `.jsx` extension for React components.
- **Styling:** CSS Modules are not configured; use plain CSS files imported in components (e.g., `App.css`, `index.css`).
- **Base path:** All routes and assets must account for the `/ShootNoShoot/` base. Vite handles this automatically in builds.
- **No backend:** This is a static SPA. For APIs, integrate external endpoints or add a separate backend service.

## Common Tasks

**Adding a new component:**
1. Create `src/components/MyComponent.jsx`.
2. Import and use in `App.jsx` or another parent component.

**Changing the app title:**
Edit `<title>` in `index.html`.

**Updating deployment base path:**
If you rename the repo, update `base` in `vite.config.js` to match the new repo name (e.g., `base: '/NewRepoName/'`).

## Deployment Checklist

- Push changes to `main` branch.
- GitHub Actions workflow runs automatically.
- Site deploys to `https://<username>.github.io/ShootNoShoot/`.
- If the deployment fails, check the Actions tab for build logs.

## External Dependencies

- **React 18.3.1** — UI library.
- **Vite 5.4.10** — Build tool and dev server.
- **gh-pages 6.1.1** — Manual deployment helper (optional; GitHub Actions is preferred).

No backend services or external APIs are currently configured.
