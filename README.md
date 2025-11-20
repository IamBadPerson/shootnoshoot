# ShootNoShoot

A medieval reenactment training application built with React + Vite, featuring three interactive game modes and leaderboard tracking. Deployed to GitHub Pages.

## Features

- **Password Protection** — Access controlled with password authentication
- **Nickname System** — Players create nicknames for leaderboard tracking
- **Shoot / No Shoot Training** — 6 archery safety scenarios with contextual feedback
- **Distance Estimation Game** — Estimate distances from 5-30 meters using visual scale reference
- **Authentic Orders Flashcards** — Learn 23 medieval military commands in Norman French and Early English
- **Leaderboards** — Track top 10 scores for each game mode with localStorage persistence

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

The site will be available at: `https://iambadperson.github.io/shootnoshoot/`

### Manual Deployment

You can also deploy manually using:
```bash
npm run deploy
```

This will build the app and push the `dist` folder to the `gh-pages` branch.

## How to Play

1. **Enter Password** — Use password "Banner" when prompted with "Ragged"
2. **Set Nickname** — Enter your nickname (max 20 characters) for leaderboard tracking
3. **Choose a Training Mode:**
   - **Shoot / No Shoot** — Make split-second decisions based on archery safety rules
   - **Distance Estimation** — Guess distances by visual scale (within 2m is correct)
   - **Flashcards** — Practice authentic medieval commands with multiple quiz modes
4. **View Leaderboards** — Check top scores across all three games

**Note:** Scores are saved only when you return to the menu or close the browser tab. Reset buttons clear your current session without saving.

## Project Structure

- `src/` - React source code
  - `main.jsx` - Application entry point
  - `App.jsx` - Main app with password, nickname, and Shoot/No-Shoot game
  - `DistanceGame.jsx` - Distance estimation training component
  - `Flashcards.jsx` - Authentic Orders flashcard system
  - `Leaderboard.jsx` - Leaderboard display for all games
  - `*.css` - Component-specific styles
- `public/` - Static assets
  - `scenarios.json` - Shoot/No-Shoot training scenarios
  - `.nojekyll` - Disables Jekyll processing on GitHub Pages
- `index.html` - HTML template
- `vite.config.js` - Vite configuration with relative base path
- `package.json` - Project dependencies and scripts
- `.github/workflows/deploy.yml` - GitHub Actions deployment workflow

## Game Details

### Shoot / No Shoot Training
Practice making safe shooting decisions in medieval reenactment archery scenarios. Learn about shield zones, command timing, and target areas.

### Distance Estimation
Train your eye to judge distances from 5 to 30 meters using a person silhouette (5'9" / 1.75m) as a reference point.

### Authentic Orders Flashcards
Master 23 historical military commands in:
- Norman French (11th-12th century)
- Early English (medieval period)
- Modern English meanings

Five quiz modes available:
- Norman French → Meaning
- Early English → Meaning  
- Meaning → Norman French
- Meaning → Early English
- Mixed (random combinations)

Plus Study Mode for reviewing all translations at once.

## Data Storage

All data is stored locally in your browser using localStorage:
- **Nicknames** — Persist across sessions
- **Leaderboards** — Top scores for each game (sorted by percentage, then by correct count)

Clear your browser data to reset leaderboards.

## Key Configuration

The `base` property in `vite.config.js` is set to `'./'` (relative paths) for GitHub Pages compatibility. This allows the app to work regardless of the repository name.
