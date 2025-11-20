# Copilot Instructions — ShootNoShoot

A React + Vite single-page application deployed to GitHub Pages.

## Project Overview

This is a Vite-powered React app configured for automatic deployment to GitHub Pages. The build uses Vite's fast HMR for development and outputs optimized production bundles to the `dist/` folder.

## Key Files & Architecture

- **`package.json`** — Defines `dev`, `build`, `preview`, and `deploy` scripts. Always use these scripts rather than calling tools directly.
- **`vite.config.js`** — Sets `base: '/ShootNoShoot/'` for GitHub Pages routing. If the repo name changes, update this field.
- **`src/main.jsx`** — React app entry point; renders `<App />` into `#root`.
- **`src/App.jsx`** — Main application component.
- **`.github/workflows/deploy.yml`** — GitHub Actions workflow that builds and deploys on every push to `main`.

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
