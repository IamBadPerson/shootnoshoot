import { useState, useEffect } from 'react'
import './App.css'
import DistanceGame from './DistanceGame'
import Flashcards from './Flashcards'
import Leaderboard from './Leaderboard'

function App() {
  const [scenarios, setScenarios] = useState([])
  const [currentScenario, setCurrentScenario] = useState(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [feedback, setFeedback] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState(false)
  const [nickname, setNickname] = useState(localStorage.getItem('userNickname') || '')
  const [nicknameInput, setNicknameInput] = useState('')
  const [currentGame, setCurrentGame] = useState('menu') // 'menu', 'shoot', 'distance', 'flashcards', 'leaderboard'

  // Save score on tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (score.total > 0 && currentGame === 'shoot') {
        saveScore('shoot', score)
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [score, currentGame])

  // Load scenarios on mount
  useEffect(() => {
    fetch('./scenarios.json')
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

  const saveScore = (gameType, scoreData) => {
    const leaderboard = JSON.parse(localStorage.getItem(`leaderboard_${gameType}`) || '[]')
    const newScore = {
      ...scoreData,
      nickname: nickname,
      percentage: Math.round((scoreData.correct / scoreData.total) * 100),
      date: new Date().toISOString()
    }
    leaderboard.push(newScore)
    leaderboard.sort((a, b) => b.percentage - a.percentage || b.correct - a.correct)
    localStorage.setItem(`leaderboard_${gameType}`, JSON.stringify(leaderboard))
  }

  const handleDecision = (userShoot) => {
    if (!currentScenario || showResult) return

    const correct = userShoot === currentScenario.shouldShoot
    const newScore = {
      correct: score.correct + (correct ? 1 : 0),
      total: score.total + 1
    }
    setScore(newScore)

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

  const handleBackToMenu = () => {
    if (score.total > 0) {
      saveScore('shoot', score)
      setScore({ correct: 0, total: 0 })
    }
    setCurrentGame('menu')
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'Banner') {
      setIsAuthenticated(true)
      setAuthError(false)
    } else {
      setAuthError(true)
    }
  }

  const handleSetNickname = (e) => {
    e.preventDefault()
    if (nicknameInput.trim()) {
      const savedNickname = nicknameInput.trim()
      setNickname(savedNickname)
      localStorage.setItem('userNickname', savedNickname)
    }
  }

  const handleChangeNickname = () => {
    setNickname('')
    setNicknameInput('')
    localStorage.removeItem('userNickname')
  }

  if (!isAuthenticated) {
    return (
      <div className="app">
        <div className="login-container">
          <h1>Ragged</h1>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
              autoFocus
            />
            <button type="submit" className="btn btn-login">
              Enter
            </button>
            {authError && <p className="auth-error">Incorrect password</p>}
          </form>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="app"><h1>Loading scenarios...</h1></div>
  }

  // Nickname screen
  if (!nickname) {
    return (
      <div className="app">
        <div className="login-container">
          <h1>Welcome, Archer!</h1>
          <p style={{ color: '#ccc', marginBottom: '1.5rem' }}>
            Enter your nickname for the leaderboards
          </p>
          <form onSubmit={handleSetNickname} className="login-form">
            <input
              type="text"
              placeholder="Your nickname"
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              className="password-input"
              maxLength={20}
              autoFocus
              required
            />
            <button type="submit" className="btn btn-login">
              Continue
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (currentGame === 'distance') {
    return <DistanceGame onBack={() => setCurrentGame('menu')} nickname={nickname} />
  }

  if (currentGame === 'flashcards') {
    return <Flashcards onBack={() => setCurrentGame('menu')} nickname={nickname} />
  }

  if (currentGame === 'leaderboard') {
    return <Leaderboard onBack={() => setCurrentGame('menu')} />
  }

  if (currentGame === 'menu') {
    return (
      <div className="app">
        <div className="menu-container">
          <h1>Training Menu</h1>
          <p style={{ color: '#888', marginBottom: '1rem' }}>
            Playing as: <strong style={{ color: '#646cff' }}>{nickname}</strong>
            {' '}
            <button 
              onClick={handleChangeNickname}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#888', 
                textDecoration: 'underline', 
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              (change)
            </button>
          </p>
          <div className="menu-buttons">
            <button 
              className="btn menu-btn"
              onClick={() => setCurrentGame('shoot')}
            >
              Shoot / No Shoot Training
            </button>
            <button 
              className="btn menu-btn"
              onClick={() => setCurrentGame('distance')}
            >
              Distance Estimation
            </button>
            <button 
              className="btn menu-btn"
              onClick={() => setCurrentGame('flashcards')}
            >
              Authentic Orders Flashcards
            </button>
            <button 
              className="btn menu-btn"
              onClick={() => setCurrentGame('leaderboard')}
            >
              Leaderboards
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (scenarios.length === 0) {
    return (
      <div className="app">
        <h1>Shoot No Shoot Training</h1>
        <p>No scenarios found. Please add scenarios to public/scenarios.json</p>
        <button className="btn" onClick={() => setCurrentGame('menu')}>← Back to Menu</button>
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
          <button className="back-btn" onClick={handleBackToMenu}>← Back to Menu</button>
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
