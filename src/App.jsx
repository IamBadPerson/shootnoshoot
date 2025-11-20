import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [scenarios, setScenarios] = useState([])
  const [currentScenario, setCurrentScenario] = useState(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [feedback, setFeedback] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load scenarios on mount
  useEffect(() => {
    fetch('/ShootNoShoot/scenarios.json')
      .then(res => res.json())
      .then(data => {
        setScenarios(data.scenarios)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load scenarios:', err)
        setLoading(false)
      })
  }, [])

  // Load first scenario when scenarios are loaded
  useEffect(() => {
    if (scenarios.length > 0 && !currentScenario) {
      loadRandomScenario()
    }
  }, [scenarios])

  const loadRandomScenario = () => {
    const randomIndex = Math.floor(Math.random() * scenarios.length)
    setCurrentScenario(scenarios[randomIndex])
    setFeedback(null)
    setShowResult(false)
  }

  const handleDecision = (userShoot) => {
    if (!currentScenario || showResult) return

    const correct = userShoot === currentScenario.shouldShoot
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }))

    setFeedback({
      correct,
      message: correct 
        ? '✓ Correct Decision!' 
        : '✗ Incorrect Decision',
      shouldShoot: currentScenario.shouldShoot,
      description: currentScenario.description
    })
    setShowResult(true)
  }

  const handleNext = () => {
    loadRandomScenario()
  }

  const resetScore = () => {
    setScore({ correct: 0, total: 0 })
    loadRandomScenario()
  }

  if (loading) {
    return <div className="app"><h1>Loading scenarios...</h1></div>
  }

  if (scenarios.length === 0) {
    return (
      <div className="app">
        <h1>Shoot No Shoot Training</h1>
        <p>No scenarios found. Please add scenarios to public/scenarios.json</p>
      </div>
    )
  }

  return (
    <div className="app">
      <header>
        <h1>Shoot / No Shoot Training</h1>
        <div className="score">
          Score: {score.correct} / {score.total}
          {score.total > 0 && (
            <span className="percentage">
              {' '}({Math.round((score.correct / score.total) * 100)}%)
            </span>
          )}
          <button className="reset-btn" onClick={resetScore}>Reset</button>
        </div>
      </header>

      {currentScenario && (
        <div className="scenario">
          <div className="image-container">
            <img 
              src={currentScenario.image} 
              alt="Scenario"
              onError={(e) => {
                e.target.src = 'https://placehold.co/1080x1920'
              }}
            />
          </div>

          {!showResult ? (
            <div className="buttons">
              <button 
                className="btn btn-shoot" 
                onClick={() => handleDecision(true)}
              >
                SHOOT
              </button>
              <button 
                className="btn btn-no-shoot" 
                onClick={() => handleDecision(false)}
              >
                NO SHOOT
              </button>
            </div>
          ) : (
            <div className="result">
              <div className={`feedback ${feedback.correct ? 'correct' : 'incorrect'}`}>
                <h2>{feedback.message}</h2>
                <p className="correct-answer">
                  Correct answer: {feedback.shouldShoot ? 'SHOOT' : 'NO SHOOT'}
                </p>
                <p className="description">{feedback.description}</p>
              </div>
              <button className="btn btn-next" onClick={handleNext}>
                Next Scenario →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
