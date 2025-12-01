import { useState, useEffect, useRef } from 'react'
import './SpeedDrill.css'

function SpeedDrill({ onBack, nickname }) {
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [currentScenario, setCurrentScenario] = useState(null)
  const [timeLimit, setTimeLimit] = useState(30)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isActive, setIsActive] = useState(false)
  const [userCommand, setUserCommand] = useState('')
  const [userAction, setUserAction] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [spokenText, setSpokenText] = useState('')
  const [micSupported, setMicSupported] = useState(true)
  const sessionGoal = 10
  const timerRef = useRef(null)

  // Speed drill scenarios
  const scenarios = [
    {
      prompt: "The archer beside you begins crossing the line while nocked.",
      correctCommand: "Archer — bow down!",
      correctAction: "Correcting unsafe angle",
      alternatives: ["HOLD!", "Bows hold!", "Line safe!"]
    },
    {
      prompt: "You see someone entering the safety zone downrange while archers are nocked.",
      correctCommand: "HOLD!",
      correctAction: "Person in danger zone",
      alternatives: ["Range unsafe!", "Danger close!", "Archers back!"]
    },
    {
      prompt: "An arrow breaks on release sending fragments toward nearby archers.",
      correctCommand: "Misfire!",
      correctAction: "Equipment failure with debris risk",
      alternatives: ["HOLD!", "Danger close!", "Range unsafe!"]
    },
    {
      prompt: "The target has moved within 10 meters due to wind.",
      correctCommand: "Danger close!",
      correctAction: "Target too near minimum range",
      alternatives: ["HOLD!", "Range unsafe!", "Archers back!"]
    },
    {
      prompt: "Combat phase ending and infantry need to prepare for archery.",
      correctCommand: "Shieldwall down!",
      correctAction: "Infantry cover before volley",
      alternatives: ["Bows!", "Archers forward!", "HOLD!"]
    },
    {
      prompt: "All arrows are clear and archers need to advance to the line.",
      correctCommand: "Archers forward!",
      correctAction: "Beginning archery phase safely",
      alternatives: ["Range clear!", "Line safe!", "Nock!"]
    },
    {
      prompt: "Archery complete and archers must clear the line for melee.",
      correctCommand: "Archers back!",
      correctAction: "Ending archery phase safely",
      alternatives: ["Bows!", "Line safe!", "Range clear!"]
    },
    {
      prompt: "A spectator has breached the barrier near the target area.",
      correctCommand: "HOLD!",
      correctAction: "Civilian in danger zone",
      alternatives: ["Range unsafe!", "Danger close!", "Archers back!"]
    },
    {
      prompt: "Inspection complete and the range is verified safe to begin.",
      correctCommand: "Range clear!",
      correctAction: "Safe to proceed with archery",
      alternatives: ["Line safe!", "Archers forward!", "Nock!"]
    },
    {
      prompt: "An archer's bow string breaks during draw creating sudden movement.",
      correctCommand: "Misfire!",
      correctAction: "Equipment failure causing unsafe action",
      alternatives: ["HOLD!", "Archer — bow down!", "Bows hold!"]
    },
    {
      prompt: "Multiple archers are not maintaining discipline during the hold command.",
      correctCommand: "Bows hold!",
      correctAction: "Reinforcing cease order to group",
      alternatives: ["HOLD!", "Archers back!", "Line safe!"]
    },
    {
      prompt: "The line has been verified safe after resolving a hold situation.",
      correctCommand: "Line safe!",
      correctAction: "Cleared to resume after incident",
      alternatives: ["Range clear!", "Archers forward!", "Nock!"]
    },
    {
      prompt: "Archery phase complete and transition to melee is ordered.",
      correctCommand: "Bows!",
      correctAction: "Archers switching to melee weapons",
      alternatives: ["Shields!", "Archers back!", "Line safe!"]
    },
    {
      prompt: "Archers have transitioned and infantry respond to Bows command.",
      correctCommand: "Shields!",
      correctAction: "Infantry ready after archer transition",
      alternatives: ["Shieldwall up!", "Bows!", "Archers back!"]
    },
    {
      prompt: "Volley complete and infantry can rise from cover position.",
      correctCommand: "Shieldwall up!",
      correctAction: "Infantry resume after archery",
      alternatives: ["Shields!", "Line safe!", "Archers back!"]
    },
    {
      prompt: "Command given to prepare arrows on the string.",
      correctCommand: "Nock!",
      correctAction: "Archers load arrows safely",
      alternatives: ["Range clear!", "Archers forward!", "Draw!"]
    },
    {
      prompt: "A new archer is drawing past safe angle toward other fighters.",
      correctCommand: "Archer — bow down!",
      correctAction: "Individual correction for unsafe draw",
      alternatives: ["HOLD!", "Bows hold!", "Range unsafe!"]
    },
    {
      prompt: "Weather conditions have created visibility issues affecting safety.",
      correctCommand: "Range unsafe!",
      correctAction: "Environmental hazard affecting operations",
      alternatives: ["HOLD!", "Archers back!", "Line safe!"]
    },
    {
      prompt: "Emergency vehicle needs access through the range area immediately.",
      correctCommand: "HOLD!",
      correctAction: "Emergency personnel requiring access",
      alternatives: ["Range unsafe!", "Archers back!", "Bows hold!"]
    },
    {
      prompt: "All safety checks passed and archery phase can commence.",
      correctCommand: "Range clear!",
      correctAction: "Initial safety verification complete",
      alternatives: ["Line safe!", "Archers forward!", "Range unsafe!"]
    }
  ]

  // Save score when user leaves the game
  useEffect(() => {
    return () => {
      if (score.total > 0) {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard_speed') || '[]')
        const newScore = {
          correct: score.correct,
          total: score.total,
          nickname: nickname,
          percentage: Math.round((score.correct / score.total) * 100),
          date: new Date().toISOString()
        }
        leaderboard.push(newScore)
        leaderboard.sort((a, b) => b.percentage - a.percentage || b.correct - a.correct)
        localStorage.setItem('leaderboard_speed', JSON.stringify(leaderboard))
      }
    }
  }, [score, nickname])

  useEffect(() => {
    // Check if speech recognition is supported
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setMicSupported(false)
    }
  }, [])

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 0.1)
      }, 100)
    } else if (isActive && timeLeft <= 0) {
      handleTimeout()
    }
    return () => clearTimeout(timerRef.current)
  }, [timeLeft, isActive])

  const startScenario = () => {
    const randomIndex = Math.floor(Math.random() * scenarios.length)
    const scenario = scenarios[randomIndex]
    setCurrentScenario(scenario)
    setTimeLeft(timeLimit)
    setIsActive(true)
    setShowFeedback(false)
    setUserCommand('')
    setUserAction('')
    setSpokenText('')
    setIsListening(false)
  }

  const handleTimeout = () => {
    setIsActive(false)
    setShowFeedback(true)
    setScore(prev => ({
      correct: prev.correct,
      total: prev.total + 1
    }))
    setSessionCount(prev => prev + 1)
  }

  const handleSubmit = () => {
    if (!userCommand.trim() || !userAction.trim()) {
      alert('Please enter both command and action!')
      return
    }

    setIsActive(false)
    setShowFeedback(true)
    clearTimeout(timerRef.current)

    const normalizeText = (text) => text.toLowerCase().replace(/[^a-z\s]/g, '').trim()
    const commandNormalized = normalizeText(userCommand)
    const correctNormalized = normalizeText(currentScenario.correctCommand)
    
    const commandCorrect = commandNormalized === correctNormalized || 
                          commandNormalized.includes(correctNormalized) ||
                          correctNormalized.includes(commandNormalized)

    const actionCorrect = userAction.trim().length > 10 // Basic check for thoughtful action

    const bothCorrect = commandCorrect && actionCorrect

    setScore(prev => ({
      correct: prev.correct + (bothCorrect ? 1 : 0),
      total: prev.total + 1
    }))
    
    // Reduce time limit on correct answer (minimum 3 seconds)
    if (bothCorrect && timeLimit > 3) {
      setTimeLimit(prev => Math.max(3, prev - 0.5))
    }
    
    setSessionCount(prev => prev + 1)
  }

  const startListening = () => {
    if (!micSupported) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
      setSpokenText('Listening...')
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setSpokenText(transcript)
      setIsListening(false)
      
      // Parse the transcript to extract command and action
      // Format expected: "Command! Action description."
      const parts = transcript.split(/[.!?]/).filter(p => p.trim())
      
      if (parts.length >= 1) {
        setUserCommand(parts[0].trim())
      }
      if (parts.length >= 2) {
        setUserAction(parts.slice(1).join('. ').trim())
      } else {
        setSpokenText(`Got: "${transcript}" - Need command AND action separated`)
      }
    }

    recognition.onerror = (event) => {
      setIsListening(false)
      if (event.error === 'no-speech') {
        setSpokenText('No speech detected. Try again.')
      } else if (event.error === 'not-allowed') {
        setSpokenText('Microphone access denied.')
      } else {
        setSpokenText(`Error: ${event.error}`)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const resetSession = () => {
    setScore({ correct: 0, total: 0 })
    setSessionCount(0)
    setTimeLimit(30)
    setTimeLeft(30)
    setCurrentScenario(null)
    setIsActive(false)
    setShowFeedback(false)
  }

  const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0
  const sessionComplete = sessionCount >= sessionGoal

  if (sessionComplete) {
    return (
      <div className="speed-drill">
        <header>
          <h1>Scenario Speed Drills</h1>
          <button className="back-btn" onClick={onBack}>← Back to Menu</button>
        </header>

        <div className="session-complete">
          <h2>⚡ Session Complete!</h2>
          <p className="session-goal">Completed {sessionGoal} speed scenarios</p>
          <div className="final-score">
            <p className="score-line">Score: {score.correct} / {score.total}</p>
            <p className="percentage-line">{percentage}%</p>
            <p className="practice-tip">🎯 Speed drills eliminate hesitation and force prioritization under pressure!</p>
          </div>
          <div className="session-buttons">
            <button className="btn btn-primary" onClick={resetSession}>
              New Session
            </button>
            <button className="btn btn-secondary" onClick={onBack}>
              Return to Menu
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentScenario) {
    return (
      <div className="speed-drill">
        <header>
          <h1>Scenario Speed Drills</h1>
          <button className="back-btn" onClick={onBack}>← Back to Menu</button>
        </header>

        <div className="intro-section">
          <h2>⚡ Speed Reaction Training</h2>
          <div className="instructions">
            <p><strong>Goal:</strong> Eliminate hesitation and force prioritization under stress</p>
            <p><strong>Time Limit:</strong> Starts at 30 seconds, reduces 0.5s per correct answer (min 3s)</p>
            <p><strong>You must provide:</strong></p>
            <ol>
              <li>The correct command (e.g., "HOLD!")</li>
              <li>A one-sentence action description</li>
            </ol>
            <p className="example">
              <strong>Example:</strong><br/>
              <em>Scenario: "The archer beside you begins crossing the line."</em><br/>
              <strong>Your response:</strong> "Archer — bow down! Correcting unsafe angle."
            </p>
            <p className="tip">💡 This drill trains voice-before-action and real-world timing under stress</p>
          </div>
          <div className="score-display">
            <p>Session: {sessionCount} / {sessionGoal}</p>
            <p>Score: {score.correct} / {score.total}</p>
          </div>
          <button className="btn btn-start" onClick={startScenario}>
            Start Drill
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="speed-drill">
      <header>
        <h1>Scenario Speed Drills</h1>
        <div className="score">
          Session: {sessionCount} / {sessionGoal}
          <span className="divider">|</span>
          Score: {score.correct} / {score.total}
          {score.total > 0 && (
            <span className="percentage"> ({percentage}%)</span>
          )}
          <span className="divider">|</span>
          <span className="timer-limit">⏱️ {timeLimit.toFixed(1)}s limit</span>
          <button className="reset-btn" onClick={resetSession}>Reset</button>
          <button className="back-btn" onClick={onBack}>← Back to Menu</button>
        </div>
      </header>

      <div className="drill-area">
        {!showFeedback ? (
          <>
            <div className="timer-display">
              <div className="timer-circle" style={{
                background: `conic-gradient(#646cff ${(timeLeft / timeLimit) * 360}deg, #f5576c ${(timeLeft / timeLimit) * 360}deg)`
              }}>
                <span className="timer-text">{timeLeft.toFixed(1)}s</span>
              </div>
            </div>

            <div className="scenario-card">
              <p className="scenario-label">SCENARIO:</p>
              <h2 className="scenario-text">{currentScenario.prompt}</h2>
            </div>

            <div className="input-section">
              <div className="mic-option">
                <button 
                  className={`btn btn-mic ${isListening ? 'listening' : ''}`}
                  onClick={startListening}
                  disabled={isListening || !micSupported || !isActive}
                >
                  {isListening ? '🎤 Listening...' : '🎤 Speak Response'}
                </button>
                {spokenText && (
                  <p className="spoken-text">{spokenText}</p>
                )}
              </div>

              <div className="manual-input">
                <p className="input-label">OR TYPE YOUR RESPONSE:</p>
                <input
                  type="text"
                  className="command-input"
                  placeholder="Command (e.g., HOLD!)"
                  value={userCommand}
                  onChange={(e) => setUserCommand(e.target.value)}
                  disabled={!isActive}
                />
                <input
                  type="text"
                  className="action-input"
                  placeholder="Action description (e.g., Person in danger zone)"
                  value={userAction}
                  onChange={(e) => setUserAction(e.target.value)}
                  disabled={!isActive}
                />
                <button 
                  className="btn btn-submit"
                  onClick={handleSubmit}
                  disabled={!isActive}
                >
                  Submit
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="feedback-section">
            <div className={`feedback ${
              userCommand && userAction && 
              userCommand.toLowerCase().includes(currentScenario.correctCommand.toLowerCase().replace(/[^a-z\s]/g, ''))
              ? 'correct' : 'incorrect'
            }`}>
              <h3>Correct Response:</h3>
              <p className="correct-command">
                <strong>Command:</strong> "{currentScenario.correctCommand}"
              </p>
              <p className="correct-action">
                <strong>Action:</strong> {currentScenario.correctAction}
              </p>
              
              {userCommand || userAction ? (
                <>
                  <h3>Your Response:</h3>
                  <p className="user-command">
                    <strong>Command:</strong> {userCommand || '(none)'}
                  </p>
                  <p className="user-action">
                    <strong>Action:</strong> {userAction || '(none)'}
                  </p>
                </>
              ) : (
                <p className="timeout-msg">⏱️ Time's up! No response given.</p>
              )}
              
              <div className="alternatives">
                <p><strong>Common Wrong Commands:</strong></p>
                <p>{currentScenario.alternatives.join(', ')}</p>
              </div>
            </div>
            <button className="btn btn-next" onClick={startScenario}>
              Next Scenario →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SpeedDrill
