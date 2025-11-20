import { useState, useEffect } from 'react'
import './DistanceGame.css'

function DistanceGame({ onBack, nickname }) {
  const [currentDistance, setCurrentDistance] = useState(null)
  const [userGuess, setUserGuess] = useState('')
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [feedback, setFeedback] = useState(null)
  const [showResult, setShowResult] = useState(false)

  // Save score when user leaves the game
  useEffect(() => {
    return () => {
      if (score.total > 0) {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard_distance') || '[]')
        const newScore = {
          correct: score.correct,
          total: score.total,
          nickname: nickname,
          percentage: Math.round((score.correct / score.total) * 100),
          date: new Date().toISOString()
        }
        leaderboard.push(newScore)
        leaderboard.sort((a, b) => b.percentage - a.percentage || b.correct - a.correct)
        localStorage.setItem('leaderboard_distance', JSON.stringify(leaderboard))
      }
    }
  }, [score, nickname])

  // Person height in pixels at different distances (5'9" = 1.75m tall person)
  // These are approximate ratios for a person at various distances
  const distances = [
    { meters: 5, scale: 1.0 },
    { meters: 7, scale: 0.71 },
    { meters: 10, scale: 0.50 },
    { meters: 12, scale: 0.42 },
    { meters: 15, scale: 0.33 },
    { meters: 18, scale: 0.28 },
    { meters: 20, scale: 0.25 },
    { meters: 22, scale: 0.23 },
    { meters: 25, scale: 0.20 },
    { meters: 28, scale: 0.18 },
    { meters: 30, scale: 0.17 }
  ]

  useEffect(() => {
    loadRandomDistance()
  }, [])

  const loadRandomDistance = () => {
    const randomIndex = Math.floor(Math.random() * distances.length)
    setCurrentDistance(distances[randomIndex])
    setUserGuess('')
    setFeedback(null)
    setShowResult(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!userGuess || showResult) return

    const guess = parseInt(userGuess)
    const actual = currentDistance.meters
    const difference = Math.abs(guess - actual)
    
    // Within 2 meters is considered correct
    const correct = difference <= 2

    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }))

    setFeedback({
      correct,
      guess,
      actual,
      difference,
      message: correct 
        ? `✓ Excellent! Within ${difference}m` 
        : `✗ Off by ${difference}m`
    })
    setShowResult(true)
  }

  const handleNext = () => {
    loadRandomDistance()
  }

  const resetScore = () => {
    setScore({ correct: 0, total: 0 })
    loadRandomDistance()
  }

  if (!currentDistance) {
    return <div className="distance-game"><h1>Loading...</h1></div>
  }

  return (
    <div className="distance-game">
      <header>
        <h1>Distance Estimation Training</h1>
        <p className="subtitle">Person height: 5'9" (1.75m)</p>
        <div className="score">
          Score: {score.correct} / {score.total}
          {score.total > 0 && (
            <span className="percentage">
              {' '}({Math.round((score.correct / score.total) * 100)}%)
            </span>
          )}
          <button className="reset-btn" onClick={resetScore}>Reset</button>
          <button className="back-btn" onClick={onBack}>← Back to Menu</button>
        </div>
      </header>

      <div className="game-area">
        <div className="person-container">
          <div 
            className="person-silhouette"
            style={{
              transform: `scale(${currentDistance.scale})`,
              transformOrigin: 'bottom center'
            }}
          >
            <div className="head"></div>
            <div className="body"></div>
            <div className="legs"></div>
          </div>
        </div>

        {!showResult ? (
          <form onSubmit={handleSubmit} className="guess-form">
            <label htmlFor="distance-guess">Estimate the distance (meters):</label>
            <div className="input-group">
              <input
                id="distance-guess"
                type="number"
                min="5"
                max="30"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                placeholder="5-30"
                autoFocus
                required
              />
              <span className="unit">m</span>
            </div>
            <button type="submit" className="btn btn-submit">
              Submit Guess
            </button>
          </form>
        ) : (
          <div className="result">
            <div className={`feedback ${feedback.correct ? 'correct' : 'incorrect'}`}>
              <h2>{feedback.message}</h2>
              <p className="guess-info">Your guess: {feedback.guess}m</p>
              <p className="actual-info">Actual distance: {feedback.actual}m</p>
              {!feedback.correct && (
                <p className="tip">💡 Tip: Use the person's height as a reference. At closer distances, they appear larger.</p>
              )}
            </div>
            <button className="btn btn-next" onClick={handleNext}>
              Next Distance →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DistanceGame
