# ShootNoShoot

A medieval reenactment training application built with React + Vite, featuring multiple interactive training modes for archery safety, command vocabulary, and pacing practice. Deployed to GitHub Pages.

## Features

- **Password Protection** — Access controlled with password authentication (skipped on localhost)
- **Nickname System** — Players create nicknames for leaderboard tracking
- **Shoot / No Shoot Training** — 6 archery safety scenarios with contextual feedback
- **Distance Estimation Game** — Estimate distances from 5-30 meters using visual scale reference
- **Authentic Orders Flashcards** — Learn 23 medieval military commands in Norman French and Early English
- **Instant Call Reflex Training** — 75 rapid-fire safety scenarios with HOLD/SAFE decisions and keyboard controls
- **Command Vocabulary Drill** — Practice correct command phrasing with optional timed mode and speech recognition
- **Shot Pacing Trainer** — Audio metronome to help archers develop consistent pacing (work towards 10 shots/min)
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

1. **Enter Password** — Enter password when prompted (skipped on localhost)
2. **Set Nickname** — Enter your nickname (max 20 characters) for leaderboard tracking
3. **Choose a Training Mode:**
   - **Shoot / No Shoot** — Make split-second decisions based on archery safety rules
   - **Distance Estimation** — Guess distances by visual scale (within 2m is correct)
   - **Flashcards** — Practice authentic medieval commands with multiple quiz modes
   - **Instant Call Reflex** — Rapid HOLD/SAFE decisions (keyboard: left arrow = HOLD, right arrow = SAFE)
   - **Command Vocabulary Drill** — Learn correct command phrasing with speech recognition support
   - **Shot Pacing Trainer** — Metronome for consistent shot pacing (no scoring)
4. **View Leaderboards** — Check top scores across all scored games

**Note:** Scores are saved only when you return to the menu or close the browser tab. Reset buttons clear your current session without saving.

## Project Structure

- `src/` - React source code
  - `main.jsx` - Application entry point
  - `App.jsx` - Main app with password, nickname, and Shoot/No-Shoot game
  - `DistanceGame.jsx` - Distance estimation training component
  - `Flashcards.jsx` - Authentic Orders flashcard system
  - `ReflexGame.jsx` - Instant call reflex training with 75 scenarios
  - `VocabDrill.jsx` - Command vocabulary drill with speech recognition
  - `PacingDrill.jsx` - Shot pacing trainer with audio metronome
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

### Instant Call Reflex Training
75 rapid-fire safety scenarios based on the Combat and Field Manual. Make quick HOLD or SAFE decisions with a progressive timer that starts at 30 seconds and reduces by 1 second per correct answer. Keyboard controls: left arrow (HOLD), right arrow (SAFE).

### Command Vocabulary Drill
Practice 15 correct command phrases (e.g., "HOLD!", "Range unsafe!", "Archer — bow down!"). Features:
- Optional timed mode (starts at 30s, reduces 0.5s per correct answer, min 3s)
- Speech recognition support (automatically scores spoken commands)
- Multiple choice format with common wrong alternatives
- 20-command training sessions

### Shot Pacing Trainer
Audio metronome to help archers develop consistent shot pacing. Features:
- Adjustable target rate (1-20 shots per minute)
- Quick presets: 6/min (Beginner), 8/min (Intermediate), 10/min (Competition), 12/min (Advanced)
- Audio beeps at each shot interval
- Visual progress bar showing time until next shot
- Shot timeline tracking
- Session history (no leaderboard scoring)

## Data Storage

All data is stored locally in your browser using localStorage:
- **Nicknames** — Persist across sessions
- **Leaderboards** — Top scores for each game (sorted by percentage, then by correct count)

Clear your browser data to reset leaderboards.

## Key Configuration

The `base` property in `vite.config.js` is set to `'./'` (relative paths) for GitHub Pages compatibility. This allows the app to work regardless of the repository name.
