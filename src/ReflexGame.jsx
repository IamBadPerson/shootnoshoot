import { useState, useEffect, useRef } from 'react'
import './ReflexGame.css'

function ReflexGame({ onBack, nickname }) {
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [currentPrompt, setCurrentPrompt] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState(30)
  const [maxTime, setMaxTime] = useState(30)
  const [gameOver, setGameOver] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [answered, setAnswered] = useState(false)
  const timerRef = useRef(null)

  // Safety scenarios requiring instant HOLD call
  const prompts = [
    // Distance violations
    { text: "Archer drawing at 8 metres!", requiresHold: true, description: "Under 10m minimum range - HOLD required!" },
    { text: "Archer drawing at 5 metres!", requiresHold: true, description: "Critically under minimum range - immediate HOLD!" },
    { text: "Crossbow aimed at 9 metres!", requiresHold: true, description: "Crossbows require 10m minimum - HOLD!" },
    { text: "Crossbow aimed at 7 metres!", requiresHold: true, description: "Dangerous crossbow range - call HOLD now!" },
    { text: "Archer-on-archer at 12 metres!", requiresHold: true, description: "Under 15m minimum for archer volleys - HOLD!" },
    { text: "Archer-on-archer at 14 metres!", requiresHold: true, description: "Too close for safe archer volleys - HOLD!" },
    { text: "Infantry at 8m, no 'Bows' called!", requiresHold: true, description: "Infantry too close without transition - HOLD!" },
    { text: "Rolling archery at 6 metres!", requiresHold: true, description: "Under minimum safe distance - HOLD!" },
    
    // Infantry coverage issues
    { text: "Infantry shields not raised!", requiresHold: true, description: "Infantry not covered before archery - HOLD immediately!" },
    { text: "Infantry head exposed during volley!", requiresHold: true, description: "Uncovered infantry during archery - call HOLD!" },
    { text: "Shield lowered before 'Archers Back'!", requiresHold: true, description: "Infantry uncovering too early - HOLD!" },
    { text: "Infantry standing, shields down!", requiresHold: true, description: "No coverage during archery phase - HOLD!" },
    { text: "Partial shieldwall, gaps visible!", requiresHold: true, description: "Incomplete infantry coverage - call HOLD!" },
    { text: "Infantry advancing shields lowered!", requiresHold: true, description: "Rolling archery without raised shields - HOLD!" },
    { text: "Face exposed above shield rim!", requiresHold: true, description: "Infantry head not covered - call HOLD!" },
    { text: "Crouching infantry, back exposed!", requiresHold: true, description: "Improper coverage position - HOLD!" },
    
    // Volley fire violations
    { text: "Archer loosing outside volley!", requiresHold: true, description: "No individual shots during volley fire - HOLD!" },
    { text: "Early release before captain's order!", requiresHold: true, description: "Archer shooting without command - call HOLD!" },
    { text: "Archer continuing after volley!", requiresHold: true, description: "Shooting after volley complete - HOLD!" },
    { text: "Multiple archers loosing individually!", requiresHold: true, description: "Loss of volley discipline - call HOLD!" },
    { text: "Nocked late, archer shooting alone!", requiresHold: true, description: "Must wait for next volley - HOLD!" },
    { text: "Archer shooting during cover phase!", requiresHold: true, description: "Shooting while unit should be covered - HOLD!" },
    
    // Equipment violations
    { text: "Bow over 25lb draw weight!", requiresHold: true, description: "Maximum 25lbs for bows - HOLD!" },
    { text: "Crossbow over 40lb draw weight!", requiresHold: true, description: "Maximum 40lbs for crossbows - HOLD!" },
    { text: "Damaged bowstring visible!", requiresHold: true, description: "Equipment failure risk - call HOLD!" },
    { text: "Broken arrow being nocked!", requiresHold: true, description: "Damaged ammunition - HOLD immediately!" },
    { text: "Bow drawn beyond safe limit!", requiresHold: true, description: "Over-drawing bow - call HOLD!" },
    
    // Arena and audience safety
    { text: "Audience member in line of fire!", requiresHold: true, description: "Arena breach - immediate HOLD!" },
    { text: "Person walking across range!", requiresHold: true, description: "Range not clear - call HOLD now!" },
    { text: "Child near arena boundary!", requiresHold: true, description: "Spectator too close - HOLD!" },
    { text: "Non-combatant in target zone!", requiresHold: true, description: "Unauthorized person downrange - HOLD!" },
    { text: "Marshal in line of fire!", requiresHold: true, description: "Official at risk - immediate HOLD!" },
    { text: "Photographer in danger zone!", requiresHold: true, description: "Media too close - call HOLD!" },
    { text: "Spectator breaching barrier!", requiresHold: true, description: "Arena security breach - HOLD!" },
    
    // Phase declaration issues
    { text: "Archery starting, no declaration!", requiresHold: true, description: "Archery phase must be declared - HOLD!" },
    { text: "Archers forward, no response!", requiresHold: true, description: "Infantry didn't respond 'Shieldwall Down' - HOLD!" },
    { text: "Shooting before captain confirms!", requiresHold: true, description: "No safety confirmation - call HOLD!" },
    { text: "Rolling archery not declared!", requiresHold: true, description: "Display type must be announced - HOLD!" },
    { text: "Static archery not announced!", requiresHold: true, description: "Formation type not declared - HOLD!" },
    
    // Transition violations
    { text: "Infantry lowering shields early!", requiresHold: true, description: "Before 'Archers Back' called - HOLD!" },
    { text: "Melee starting, arrows still flying!", requiresHold: true, description: "No 'Bows' transition called - HOLD!" },
    { text: "Archers not withdrawing safely!", requiresHold: true, description: "Improper retreat procedure - call HOLD!" },
    { text: "Infantry charging during archery!", requiresHold: true, description: "No transition to melee phase - HOLD!" },
    { text: "Shields dropped before all clear!", requiresHold: true, description: "Premature uncovering - call HOLD!" },
    
    // Targeting violations
    { text: "Aimed shot at head height!", requiresHold: true, description: "Must target legs and feet only - HOLD!" },
    { text: "Direct shot at shield face!", requiresHold: true, description: "Should lob over shields - call HOLD!" },
    { text: "Flat trajectory at infantry!", requiresHold: true, description: "Improper shot angle - HOLD!" },
    { text: "Shooting at torso in melee!", requiresHold: true, description: "Wrong target area - call HOLD!" },
    
    // SAFE SITUATIONS - Proper Procedures
    { text: "Captain calls 'Archers Forward'", requiresHold: false, description: "Declared archery phase - infantry respond 'Shieldwall Down'" },
    { text: "Infantry respond 'Shieldwall Down'", requiresHold: false, description: "Proper response to archery declaration" },
    { text: "Infantry shields raised, advancing", requiresHold: false, description: "Rolling archery - properly covered infantry" },
    { text: "Captain confirms all covered", requiresHold: false, description: "Safety check complete - archery may proceed" },
    { text: "Enemy calls 'Bows'", requiresHold: false, description: "Proper transition to melee declared" },
    { text: "Infantry respond 'Shields'", requiresHold: false, description: "Proper melee transition response" },
    { text: "Volley complete, infantry covered", requiresHold: false, description: "Safe archery phase completion" },
    { text: "Lob shots at legs, 15m+ range", requiresHold: false, description: "Proper archery technique within safety rules" },
    { text: "Archers awaiting captain's order", requiresHold: false, description: "Controlled volley fire - proper discipline" },
    { text: "All archers in synchronized volley", requiresHold: false, description: "Proper coordinated shooting" },
    { text: "Archers covering after volley", requiresHold: false, description: "Correct post-shot safety procedure" },
    { text: "Captain orders unit to cover", requiresHold: false, description: "Proper protection during enemy volley" },
    { text: "Archer-on-archer at 18 metres", requiresHold: false, description: "Safe distance for archer volleys" },
    { text: "Infantry crouching, shields up", requiresHold: false, description: "Proper static archery position" },
    { text: "Shields covering heads and faces", requiresHold: false, description: "Correct defensive coverage" },
    { text: "Pulled lob-shots in volley", requiresHold: false, description: "Safe archer-on-archer technique" },
    { text: "Archery phase at 12 metres", requiresHold: false, description: "Above minimum safe distance" },
    { text: "Captain: 'Archers Back'", requiresHold: false, description: "Proper end of archery phase" },
    { text: "Infantry rise on command", requiresHold: false, description: "Correct response to 'Shieldwall Up'" },
    { text: "Non-combatant archers retreating", requiresHold: false, description: "Proper withdrawal procedure" },
    { text: "Melee archers advancing safely", requiresHold: false, description: "Correct transition to hand-to-hand" },
    { text: "Arrows targeting feet and legs", requiresHold: false, description: "Proper target area selection" },
    { text: "Bow at 22lb draw weight", requiresHold: false, description: "Within safe weight limits" },
    { text: "Crossbow at 38lb draw weight", requiresHold: false, description: "Within crossbow weight limits" },
    { text: "All audience behind barriers", requiresHold: false, description: "Arena properly secured" },
    { text: "Marshal observing from safe zone", requiresHold: false, description: "Officials in protected area" },
    { text: "Clear arena, no obstructions", requiresHold: false, description: "Safe combat environment" },
    { text: "Archers switching to melee weapons", requiresHold: false, description: "Proper 'Bows' transition behavior" }
  ]

  // Save score when user leaves the game
  useEffect(() => {
    return () => {
      if (score.total > 0) {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard_reflex') || '[]')
        const newScore = {
          correct: score.correct,
          total: score.total,
          nickname: nickname,
          percentage: Math.round((score.correct / score.total) * 100),
          date: new Date().toISOString()
        }
        leaderboard.push(newScore)
        leaderboard.sort((a, b) => b.percentage - a.percentage || b.correct - a.correct)
        localStorage.setItem('leaderboard_reflex', JSON.stringify(leaderboard))
      }
    }
  }, [score, nickname])

  useEffect(() => {
    if (!gameOver && !answered) {
      loadNewPrompt()
    }
  }, [])

  useEffect(() => {
    if (currentPrompt && !answered && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 0.1) {
            handleTimeout()
            return 0
          }
          return prev - 0.1
        })
      }, 100)

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }
    }
  }, [currentPrompt, answered, gameOver])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (answered || gameOver) return
      
      if (e.key === 'ArrowLeft') {
        handleAnswer(true) // Left arrow = HOLD
      } else if (e.key === 'ArrowRight') {
        handleAnswer(false) // Right arrow = SAFE
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [answered, gameOver, currentPrompt])

  const loadNewPrompt = () => {
    const randomIndex = Math.floor(Math.random() * prompts.length)
    setCurrentPrompt(prompts[randomIndex])
    setTimeRemaining(maxTime)
    setAnswered(false)
    setFeedback(null)
  }

  const handleTimeout = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setAnswered(true)
    setScore(prev => ({ ...prev, total: prev.total + 1 }))
    setFeedback({
      correct: false,
      message: '⏰ Time\'s Up!',
      description: currentPrompt.description
    })
  }

  const handleAnswer = (calledHold) => {
    if (answered || gameOver) return

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    const correct = calledHold === currentPrompt.requiresHold
    setAnswered(true)
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }))

    let message = ''
    if (correct) {
      message = currentPrompt.requiresHold 
        ? '✓ Good Call! HOLD called correctly!' 
        : '✓ Correct! No HOLD needed here.'
    } else {
      message = currentPrompt.requiresHold
        ? '✗ MISSED! You should have called HOLD!'
        : '✗ False Alarm! No HOLD was needed.'
    }

    setFeedback({
      correct,
      message,
      description: currentPrompt.description
    })

    // Reduce time for next round (minimum 0.5 seconds)
    if (correct && maxTime > 0.5) {
      setMaxTime(prev => Math.max(0.5, prev - 1))
    }
  }

  const handleNext = () => {
    loadNewPrompt()
  }

  const handleEndGame = () => {
    setGameOver(true)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const resetGame = () => {
    setScore({ correct: 0, total: 0 })
    setMaxTime(30)
    setGameOver(false)
    setAnswered(false)
    setFeedback(null)
    loadNewPrompt()
  }

  if (gameOver) {
    const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0
    return (
      <div className="reflex-game">
        <header>
          <h1>Instant Call Reflex Training</h1>
          <button className="back-btn" onClick={onBack}>← Back to Menu</button>
        </header>

        <div className="game-over">
          <h2>Training Complete!</h2>
          <div className="final-score">
            <p className="score-line">Score: {score.correct} / {score.total}</p>
            <p className="percentage-line">{percentage}%</p>
            <p className="fastest-time">Fastest Response Time: {maxTime.toFixed(1)}s</p>
          </div>
          <div className="game-over-buttons">
            <button className="btn btn-primary" onClick={resetGame}>
              Train Again
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
    <div className="reflex-game">
      <header>
        <h1>Instant Call Reflex Training</h1>
        <div className="score">
          Score: {score.correct} / {score.total}
          {score.total > 0 && (
            <span className="percentage">
              {' '}({Math.round((score.correct / score.total) * 100)}%)
            </span>
          )}
          <span className="max-time">Response Time: {maxTime.toFixed(1)}s</span>
          <button className="reset-btn" onClick={resetGame}>Reset</button>
          <button className="end-btn" onClick={handleEndGame}>End Training</button>
          <button className="back-btn" onClick={onBack}>← Back to Menu</button>
        </div>
      </header>

      {currentPrompt && (
        <div className="reflex-area">
          <div className="timer-container">
            <div 
              className="timer-bar"
              style={{
                width: `${(timeRemaining / maxTime) * 100}%`,
                backgroundColor: timeRemaining < maxTime * 0.3 ? '#f44336' : '#4caf50'
              }}
            />
            <span className="timer-text">{timeRemaining.toFixed(1)}s</span>
          </div>

          <div className="prompt-card">
            <h2 className="prompt-text">{currentPrompt.text}</h2>
          </div>

          {!answered ? (
            <div className="action-buttons">
              <button 
                className="btn btn-action btn-hold"
                onClick={() => handleAnswer(true)}
              >
                🚨 CALL HOLD!
                <span className="key-hint">← Left Arrow</span>
              </button>
              <button 
                className="btn btn-action btn-safe"
                onClick={() => handleAnswer(false)}
              >
                ✓ SAFE - No Call
                <span className="key-hint">Right Arrow →</span>
              </button>
            </div>
          ) : (
            <div className="result">
              <div className={`feedback ${feedback.correct ? 'correct' : 'incorrect'}`}>
                <h3>{feedback.message}</h3>
                <p className="description">{feedback.description}</p>
                {feedback.correct && maxTime < 30 && (
                  <p className="speed-increase">
                    ⚡ Speed increased! Next response time: {maxTime.toFixed(1)}s
                  </p>
                )}
              </div>
              <button className="btn btn-next" onClick={handleNext}>
                Next Command →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ReflexGame
