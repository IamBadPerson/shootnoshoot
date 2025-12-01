# Copilot Instructions — ShootNoShoot

A React + Vite medieval reenactment training application with multiple interactive training modes for archery safety, command vocabulary, reflex training, and pacing practice. Deployed to GitHub Pages.

## Project Overview

This is a Vite-powered React app configured for automatic deployment to GitHub Pages. The application provides comprehensive training tools for historical reenactment archery including safety scenarios, distance estimation, authentic military commands, reflex drills, command vocabulary practice with speech recognition, and shot pacing training. Features password protection (skipped on localhost), nickname-based user tracking, and localStorage-based leaderboards.

## Key Files & Architecture

**Core Configuration:**
- **`package.json`** — Defines `dev`, `build`, `preview`, and `deploy` scripts. Always use these scripts rather than calling tools directly.
- **`vite.config.js`** — Sets `base: './'` for relative paths on GitHub Pages. Uses relative paths instead of absolute for better compatibility.
- **`src/main.jsx`** — React app entry point; renders `<App />` into `#root`.
- **`.github/workflows/deploy.yml`** — GitHub Actions workflow that builds and deploys on every push to `main`.

**Application Components:**
- **`src/App.jsx`** — Main application router with password authentication ("Banner", skipped on localhost), nickname management, and Shoot/No-Shoot game logic.
- **`src/DistanceGame.jsx`** — Distance estimation training game (5'9" person at 5-30m ranges).
- **`src/Flashcards.jsx`** — Authentic Orders flashcard system (23 commands in Norman French/Early English with 5 modes).
- **`src/ReflexGame.jsx`** — Instant Call Reflex Training with 75 rapid scenarios, keyboard controls, and progressive timing.
- **`src/VocabDrill.jsx`** — Command Vocabulary Drill with 15 commands, optional timed mode, and speech recognition.
- **`src/PacingDrill.jsx`** — Shot Pacing Trainer with audio metronome (no scoring, no leaderboard).
- **`src/Leaderboard.jsx`** — Displays top 10 scores for all scored games with player nicknames.

**Data & Assets:**
- **`public/scenarios.json`** — 6 shoot/no-shoot scenarios with archery safety context.
- **`public/.nojekyll`** — Disables Jekyll processing on GitHub Pages.

## Developer Workflows

**Local development:**
```bash
npm install
npm run dev
```
Visit `http://localhost:5173/` (Vite will use port 5174+ if 5173 is in use).

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

## Application Flow

1. **Password Authentication** — User enters password when prompted, automatically skipped on localhost
2. **Nickname Entry** — User provides nickname (stored in localStorage, max 20 chars)
3. **Main Menu** — Six training modes:
   - Shoot / No Shoot Training
   - Distance Estimation
   - Authentic Orders Flashcards
   - Instant Call Reflex Training
   - Command Vocabulary Drill
   - Shot Pacing Trainer
   - Leaderboards
4. **Game Sessions** — Scores tracked but NOT saved on reset
5. **Score Saving** — Scores saved to localStorage leaderboards when:
   - User returns to menu (via back button)
   - Browser tab closes (beforeunload event)
   - Note: Pacing Trainer does NOT save scores (tool only)

## Game Details

**Shoot / No Shoot Training:**
- 6 archery safety scenarios from `scenarios.json`
- Binary decision: SHOOT or NO SHOOT
- Tracks correct/total and percentage
- Descriptions explain archery safety rules (shields, leg/head zones, commands)

**Distance Estimation:**
- 11 distances from 5m to 30m
- Person silhouette scaled appropriately (5'9" / 1.75m tall)
- Correct answer = within 2 meters
- Visual scale-based training

**Flashcards:**
- 23 authentic medieval military commands
- 5 modes: Norman French→Meaning, Early English→Meaning, Meaning→Norman, Meaning→Early, Mixed (random)
- Multiple choice (4 options) or Study Mode (reveal all)
- Ensures unique answer options per question

**Instant Call Reflex Training:**
- 75 rapid-fire safety scenarios
- Progressive timer: starts at 30 seconds, decreases by 1 second per correct answer (minimum 3 seconds)
- Keyboard controls: Left Arrow = HOLD FIRE, Right Arrow = SAFE TO SHOOT
- Instant feedback with visual indicators
- Tracks correct/total and percentage

**Command Vocabulary Drill:**
- 15 command scenarios with correct phrasing vs common mistakes
- Multiple choice format (1 correct, 3 wrong alternatives)
- Optional timed mode: starts at 30 seconds, decreases by 0.5 seconds per correct answer (minimum 3 seconds)
- Speech recognition: speaks answers aloud for hands-free practice (Web Speech API)
- 20-command session length
- Toggle between ⏱️ Timed and ∞ Untimed modes

**Shot Pacing Trainer:**
- Audio metronome for consistent shot pacing practice
- Adjustable rate: 1-20 shots per minute
- Preset buttons: 6, 8, 10, 12 shots/min
- Audio beeps mark each shot (Web Audio API)
- Visual progress bar for 10-shot sets
- Session history tracks target vs actual rates
- No scoring or leaderboard (practice tool only)

## Data Storage

**localStorage keys:**
- `userNickname` — Player's nickname (string)
- `leaderboard_shoot` — Shoot/No-Shoot scores (array)
- `leaderboard_distance` — Distance estimation scores (array)
- `leaderboard_flashcards` — Flashcard scores (array)
- `leaderboard_reflex` — Instant Call Reflex scores (array)
- `leaderboard_vocab` — Command Vocabulary Drill scores (array)

**Score object structure:**
```js
{
  nickname: string,
  correct: number,
  total: number,
  percentage: number,
  date: ISO string
}
```

Leaderboards sorted by percentage (descending), then by correct count (descending). Display top 10 per game. Note: Pacing Trainer has no leaderboard (training tool only).

## Conventions & Patterns

- **Component files:** Use `.jsx` extension for React components.
- **Styling:** Plain CSS files imported in components (e.g., `App.css`, `DistanceGame.css`). Uses `clamp()` for responsive font/element sizing.
- **Base path:** Relative paths (`./`) for GitHub Pages compatibility. Vite handles this automatically in builds.
- **State management:** React `useState` and `useEffect` hooks throughout. No external state libraries.
- **No backend:** Static SPA using localStorage for persistence. All data client-side.

## Common Tasks

**Adding a new game mode:**
1. Create `src/NewGame.jsx` with `onBack` and `nickname` props.
2. Import in `App.jsx` and add to routing logic.
3. Add menu button with `onClick={() => setCurrentGame('newgame')}`.
4. Implement score saving with localStorage pattern.
5. Add leaderboard section in `Leaderboard.jsx`.

**Adding new scenarios:**
Edit `public/scenarios.json` with new entries containing `id`, `image`, `shouldShoot`, and `description` fields.

**Changing the app title:**
Edit `<title>` in `index.html`.

**Changing password:**
Update the string comparison in `handleLogin` function in `App.jsx`.

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

## Important Notes

- **Score Saving Behavior:** Scores are ONLY saved when the user returns to menu or closes the browser tab. Reset buttons do NOT save scores.
- **Nickname Persistence:** Nicknames are stored in localStorage and persist across sessions. Users can change their nickname from the main menu.
- **Leaderboard Storage:** All leaderboard data is stored client-side in localStorage. Clearing browser data will remove leaderboard entries.
