# ShootNoShoot

A React app built with Vite, deployed to GitHub Pages.

## Local Development

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build locally:
```bash
npm run preview
```

## Deployment to GitHub Pages

### Automated Deployment (Recommended)

This project uses GitHub Actions for automatic deployment. Every push to the `main` branch will trigger a deployment.

**Setup steps:**
1. Go to your repository settings on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Push to the `main` branch to trigger deployment

The site will be available at: `https://<your-username>.github.io/ShootNoShoot/`

### Manual Deployment

You can also deploy manually using:
```bash
npm run deploy
```

This will build the app and push the `dist` folder to the `gh-pages` branch.

## Project Structure

- `src/` - React source code
  - `main.jsx` - Application entry point
  - `App.jsx` - Main App component
  - `App.css` - App-specific styles
  - `index.css` - Global styles
- `index.html` - HTML template
- `vite.config.js` - Vite configuration (includes GitHub Pages base path)
- `package.json` - Project dependencies and scripts
- `.github/workflows/deploy.yml` - GitHub Actions deployment workflow

## Key Configuration

The `base` property in `vite.config.js` is set to `/ShootNoShoot/` to match the GitHub Pages URL structure. Update this if you rename the repository.
