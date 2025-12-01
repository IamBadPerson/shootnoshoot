import { useState, useEffect } from 'react'
import './VocabDrill.css'

function VocabDrill({ onBack, nickname }) {
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [currentCommand, setCurrentCommand] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [options, setOptions] = useState([])
  const [sessionCount, setSessionCount] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [spokenText, setSpokenText] = useState('')
  const [micSupported, setMicSupported] = useState(true)
  const [timedMode, setTimedMode] = useState(false)
  const [timeLimit, setTimeLimit] = useState(30)
  const [timeLeft, setTimeLeft] = useState(30)
  const sessionGoal = 20

  // Correct command vocabulary
  const commands = [
    { 
      correct: "HOLD!", 
      situation: "Immediate danger spotted",
      wrong: ["STOP!", "WAIT!", "FREEZE!", "HALT!"]
    },
    { 
      correct: "Bows hold!", 
      situation: "Command to archers to cease",
      wrong: ["Bows stop!", "Hold bows!", "Cease bows!", "Bows down!"]
    },
    { 
      correct: "Range unsafe!", 
      situation: "Range condition announcement",
      wrong: ["Range hot!", "Unsafe range!", "Danger range!", "Range not clear!"]
    },
    { 
      correct: "Danger close!", 
      situation: "Target too near",
      wrong: ["Too close!", "Close danger!", "Near target!", "Close range!"]
    },
    { 
      correct: "Misfire!", 
      situation: "Equipment malfunction",
      wrong: ["Malfunction!", "Bow failure!", "Equipment fault!", "Failed shot!"]
    },
    { 
      correct: "Archer — bow down!", 
      situation: "Individual archer correction",
      wrong: ["Archer down!", "Lower bow!", "Bow — archer down!", "Put bow down!"]
    },
    { 
      correct: "Line safe!", 
      situation: "All clear announcement",
      wrong: ["Safe line!", "Line clear!", "Clear!", "All safe!"]
    },
    { 
      correct: "Archers forward!", 
      situation: "Begin archery phase",
      wrong: ["Archers advance!", "Forward archers!", "Archers ready!", "Move forward!"]
    },
    { 
      correct: "Archers back!", 
      situation: "End archery phase",
      wrong: ["Archers retreat!", "Back archers!", "Archers withdraw!", "Fall back!"]
    },
    { 
      correct: "Shieldwall down!", 
      situation: "Infantry prepare for missiles",
      wrong: ["Shields down!", "Lower shields!", "Down shields!", "Shieldwall lower!"]
    },
    { 
      correct: "Shieldwall up!", 
      situation: "Infantry rise after archery",
      wrong: ["Shields up!", "Raise shields!", "Up shields!", "Shieldwall raise!"]
    },
    { 
      correct: "Bows!", 
      situation: "Archers transition to melee",
      wrong: ["Switch weapons!", "Melee!", "Close combat!", "Drop bows!"]
    },
    { 
      correct: "Shields!", 
      situation: "Infantry response to 'Bows'",
      wrong: ["Shield ready!", "To shields!", "Prepare shields!", "Shield up!"]
    },
    { 
      correct: "Range clear!", 
      situation: "Safe to proceed",
      wrong: ["Clear range!", "All clear!", "Range safe!", "Clear to shoot!"]
    },
    { 
      correct: "Nock!", 
      situation: "Prepare arrows",
      wrong: ["Load arrows!", "Ready arrows!", "Arrow nock!", "Prepare shot!"]
    }
  ]

  // Save score when user leaves the game
  useEffect(() => {
    return () => {
      if (score.total > 0) {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard_vocab') || '[]')
        const newScore = {
          correct: score.correct,
          total: score.total,
          nickname: nickname,
          percentage: Math.round((score.correct / score.total) * 100),
          date: new Date().toISOString()
        }
        leaderboard.push(newScore)
        leaderboard.sort((a, b) => b.percentage - a.percentage || b.correct - a.correct)
        localStorage.setItem('leaderboard_vocab', JSON.stringify(leaderboard))
      }
    }
  }, [score, nickname])

  useEffect(() => {
    loadNewCommand()
    // Check if speech recognition is supported
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setMicSupported(false)
    }
  }, [])

  useEffect(() => {
    if (timedMode && !showFeedback && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 0.1)
      }, 100)
      return () => clearTimeout(timer)
    } else if (timedMode && !showFeedback && timeLeft <= 0) {
      // Time's up - mark as incorrect
      handleAnswer('')
    }
  }, [timeLeft, showFeedback, timedMode])

  const loadNewCommand = () => {
    const randomIndex = Math.floor(Math.random() * commands.length)
    const command = commands[randomIndex]
    setCurrentCommand(command)
    
    // Generate 4 options: 1 correct + 3 wrong
    const wrongOptions = [...command.wrong].sort(() => Math.random() - 0.5).slice(0, 3)
    const allOptions = [command.correct, ...wrongOptions].sort(() => Math.random() - 0.5)
    setOptions(allOptions)
    
    setSelectedAnswer(null)
    setShowFeedback(false)
    setSpokenText('')
    
    if (timedMode) {
      setTimeLeft(timeLimit)
    }
    
    // Auto-start listening after a brief delay
    if (micSupported) {
      setTimeout(() => {
        startListening()
      }, 500)
    }
  }

  const handleAnswer = (answer) => {
    if (showFeedback) return

    setSelectedAnswer(answer)
    setShowFeedback(true)
    
    const correct = answer === currentCommand.correct
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }))
    
    // Reduce time limit on correct answer in timed mode (minimum 3 seconds)
    if (timedMode && correct && timeLimit > 3) {
      setTimeLimit(prev => Math.max(3, prev - 0.5))
    }
    
    setSessionCount(prev => prev + 1)
  }

  const handleNext = () => {
    setSpokenText('')
    loadNewCommand()
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
      
      // Normalize the spoken text and correct answer for comparison
      const normalizeText = (text) => text.toLowerCase().replace(/[^a-z\s]/g, '').trim()
      const spokenNormalized = normalizeText(transcript)
      const correctNormalized = normalizeText(currentCommand.correct)
      
      // Check if the spoken command matches the correct answer
      if (spokenNormalized === correctNormalized || 
          spokenNormalized.includes(correctNormalized) ||
          correctNormalized.includes(spokenNormalized)) {
        // Automatically select the correct answer
        setTimeout(() => handleAnswer(currentCommand.correct), 500)
      } else {
        // Show what was heard but don't auto-select
        setSpokenText(`Heard: "${transcript}" - Try again or select manually`)
      }
    }

    recognition.onerror = (event) => {
      setIsListening(false)
      if (event.error === 'no-speech') {
        setSpokenText('No speech detected. Try again.')
      } else if (event.error === 'not-allowed') {
        setSpokenText('Microphone access denied. Please allow microphone access.')
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
    loadNewCommand()
  }

  if (!currentCommand) {
    return <div className="vocab-drill"><h1>Loading...</h1></div>
  }

  const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0
  const sessionComplete = sessionCount >= sessionGoal

  if (sessionComplete) {
    return (
      <div className="vocab-drill">
        <header>
          <h1>Correct Command Vocabulary Drill</h1>
          <button className="back-btn" onClick={onBack}>← Back to Menu</button>
        </header>

        <div className="session-complete">
          <h2>🎯 Session Complete!</h2>
          <p className="session-goal">Completed {sessionGoal} commands</p>
          <div className="final-score">
            <p className="score-line">Score: {score.correct} / {score.total}</p>
            <p className="percentage-line">{percentage}%</p>
            <p className="practice-tip">💡 Practice 20 commands daily for one week to build muscle memory!</p>
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

  return (
    <div className="vocab-drill">
      <header>
        <h1>Correct Command Vocabulary Drill</h1>
        <div className="score">
          Session: {sessionCount} / {sessionGoal}
          <span className="divider">|</span>
          Score: {score.correct} / {score.total}
          {score.total > 0 && (
            <span className="percentage"> ({percentage}%)</span>
          )}
          {timedMode && (
            <>
              <span className="divider">|</span>
              <span className={`timer ${timeLeft < 5 ? 'urgent' : ''}`}>⏱️ {timeLeft.toFixed(1)}s</span>
            </>
          )}
          <button className="reset-btn" onClick={resetSession}>Reset</button>
          <button 
            className="mode-btn"
            onClick={() => {
              setTimedMode(!timedMode)
              if (!timedMode) {
                setTimeLimit(30)
                setTimeLeft(30)
              }
            }}
          >
            {timedMode ? '⏱️ Timed' : '∞ Untimed'}
          </button>
          <button className="back-btn" onClick={onBack}>← Back to Menu</button>
        </div>
      </header>

      <div className="drill-area">
        <div className="situation-card">
          <p className="situation-label">SITUATION:</p>
          <h2 className="situation-text">{currentCommand.situation}</h2>
        </div>

        {timedMode && (
          <div className="time-bar">
            <div 
              className="time-fill"
              style={{ 
                width: `${(timeLeft / timeLimit) * 100}%`,
                background: timeLeft < 5 ? '#f5576c' : timeLeft < 10 ? '#ffd700' : '#4ade80'
              }}
            />
          </div>
        )}

        <p className="instruction">Select the CORRECT command or speak it aloud:</p>

        {!showFeedback ? (
          <>
            <div className="mic-section">
              <button 
                className={`btn btn-mic ${isListening ? 'listening' : ''}`}
                onClick={startListening}
                disabled={isListening || !micSupported}
              >
                {isListening ? '🎤 Listening...' : '🎤 Speak Command'}
              </button>
              {spokenText && (
                <p className="spoken-text">{spokenText}</p>
              )}
              {!micSupported && (
                <p className="mic-warning">⚠️ Speech recognition not supported in this browser</p>
              )}
            </div>
            <div className="command-options">
            {options.map((option, index) => (
              <button
                key={index}
                className="btn btn-command"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
          </>
        ) : (
          <div className="feedback-section">
            <div className={`feedback ${selectedAnswer === currentCommand.correct ? 'correct' : 'incorrect'}`}>
              {selectedAnswer === currentCommand.correct ? (
                <>
                  <h3>✓ Correct!</h3>
                  <p className="correct-command">"{currentCommand.correct}"</p>
                  <p className="practice-prompt">Say it aloud now: <strong>{currentCommand.correct}</strong></p>
                </>
              ) : (
                <>
                  <h3>✗ Incorrect</h3>
                  <p className="wrong-command">You said: "{selectedAnswer}"</p>
                  <p className="correct-command">Correct: <strong>"{currentCommand.correct}"</strong></p>
                  <p className="practice-prompt">Practice saying: <strong>{currentCommand.correct}</strong></p>
                </>
              )}
            </div>
            <button className="btn btn-next" onClick={handleNext}>
              Next Command →
            </button>
          </div>
        )}
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${(sessionCount / sessionGoal) * 100}%` }}
        />
      </div>
    </div>
  )
}

export default VocabDrill
