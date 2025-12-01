import { useState, useEffect, useRef } from 'react'
import './PacingDrill.css'

function PacingDrill({ onBack, nickname }) {
  const [targetRate, setTargetRate] = useState(10) // shots per minute
  const [isActive, setIsActive] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [shotTimes, setShotTimes] = useState([])
  const [nextShotTime, setNextShotTime] = useState(0)
  const [sessionHistory, setSessionHistory] = useState([])
  const audioRef = useRef(null)
  const timerRef = useRef(null)
  const startTimeRef = useRef(null)

  // Calculate interval between shots in milliseconds
  const intervalMs = (60 / targetRate) * 1000

  useEffect(() => {
    // Create audio context for beep
    audioRef.current = new (window.AudioContext || window.webkitAudioContext)()
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (audioRef.current) audioRef.current.close()
    }
  }, [])

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        const now = Date.now()
        const elapsed = (now - startTimeRef.current) / 1000
        setElapsedTime(elapsed)
        
        // Check if it's time for the next shot
        const expectedShotCount = Math.floor(elapsed / (intervalMs / 1000))
        if (expectedShotCount > shotTimes.length) {
          playBeep()
          setNextShotTime(elapsed + (intervalMs / 1000))
          setShotTimes(prev => [...prev, elapsed])
        }
      }, 100)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isActive, shotTimes.length, intervalMs])

  const playBeep = () => {
    if (!audioRef.current) return
    
    const oscillator = audioRef.current.createOscillator()
    const gainNode = audioRef.current.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioRef.current.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3, audioRef.current.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioRef.current.currentTime + 0.1)
    
    oscillator.start(audioRef.current.currentTime)
    oscillator.stop(audioRef.current.currentTime + 0.1)
  }

  const startSession = () => {
    setElapsedTime(0)
    setShotTimes([])
    setIsActive(true)
    startTimeRef.current = Date.now()
    setNextShotTime(intervalMs / 1000)
    playBeep() // Initial beep
  }

  const stopSession = () => {
    setIsActive(false)
    
    if (shotTimes.length > 0) {
      const avgInterval = shotTimes.reduce((sum, time, idx) => {
        if (idx === 0) return sum
        return sum + (time - shotTimes[idx - 1])
      }, 0) / (shotTimes.length - 1)
      
      const actualRate = shotTimes.length > 1 ? (60 / avgInterval) : 0
      
      setSessionHistory(prev => [...prev, {
        shots: shotTimes.length,
        duration: elapsedTime,
        targetRate,
        actualRate: actualRate.toFixed(1),
        timestamp: new Date().toISOString()
      }])
    }
  }

  const resetSession = () => {
    setIsActive(false)
    setElapsedTime(0)
    setShotTimes([])
    setSessionHistory([])
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const timeUntilNext = Math.max(0, nextShotTime - elapsedTime)

  return (
    <div className="pacing-drill">
      <header>
        <h1>🎯 Shot Pacing Trainer</h1>
        <button className="back-btn" onClick={onBack}>← Back to Menu</button>
      </header>

      {!isActive && shotTimes.length === 0 ? (
        <div className="setup-section">
          <h2>Set Your Target Rate</h2>
          <p className="description">
            Train consistent shot pacing with audio cues. Work towards 10 shots per minute for competition readiness.
          </p>
          
          <div className="rate-selector">
            <label htmlFor="target-rate">Target Rate (shots/min):</label>
            <div className="rate-controls">
              <button 
                className="btn btn-adjust"
                onClick={() => setTargetRate(Math.max(1, targetRate - 1))}
              >
                -
              </button>
              <input
                id="target-rate"
                type="number"
                min="1"
                max="20"
                value={targetRate}
                onChange={(e) => setTargetRate(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                className="rate-input"
              />
              <button 
                className="btn btn-adjust"
                onClick={() => setTargetRate(Math.min(20, targetRate + 1))}
              >
                +
              </button>
            </div>
            <p className="interval-display">
              One shot every <strong>{(60 / targetRate).toFixed(1)}</strong> seconds
            </p>
          </div>

          <div className="rate-presets">
            <p><strong>Quick Presets:</strong></p>
            <button className="btn btn-preset" onClick={() => setTargetRate(6)}>6/min (Beginner)</button>
            <button className="btn btn-preset" onClick={() => setTargetRate(8)}>8/min (Intermediate)</button>
            <button className="btn btn-preset" onClick={() => setTargetRate(10)}>10/min (Competition)</button>
            <button className="btn btn-preset" onClick={() => setTargetRate(12)}>12/min (Advanced)</button>
          </div>

          <button className="btn btn-start" onClick={startSession}>
            Start Pacing Session
          </button>

          {sessionHistory.length > 0 && (
            <div className="session-history">
              <h3>Session History</h3>
              <div className="history-list">
                {sessionHistory.slice(-5).reverse().map((session, idx) => (
                  <div key={idx} className="history-item">
                    <div className="history-shots">{session.shots} shots</div>
                    <div className="history-time">{formatTime(session.duration)}</div>
                    <div className="history-rate">
                      Target: {session.targetRate}/min | Actual: {session.actualRate}/min
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-clear" onClick={() => setSessionHistory([])}>
                Clear History
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="active-session">
          <div className="timer-display">
            <h2>{formatTime(elapsedTime)}</h2>
            <p className="shot-count">{shotTimes.length} shots</p>
          </div>

          <div className="visual-metronome">
            <div 
              className="pulse-indicator"
              style={{
                width: `${Math.max(0, (1 - timeUntilNext / (intervalMs / 1000)) * 100)}%`
              }}
            />
          </div>
          
          <div className="next-shot-countdown">
            <p>Next shot in: <strong>{timeUntilNext.toFixed(1)}s</strong></p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Target Rate</div>
              <div className="stat-value">{targetRate}/min</div>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn btn-stop" onClick={stopSession}>
              ⏹️ Stop Session
            </button>
          </div>

          <div className="shot-timeline">
            <h3>Shot Timeline</h3>
            <div className="timeline-list">
              {shotTimes.slice().reverse().map((time, idx) => (
                <div key={idx} className="timeline-item">
                  <span className="timeline-number">#{shotTimes.length - idx}</span>
                  <span className="timeline-time">{formatTime(time)}</span>
                  {shotTimes.length - idx > 1 && (
                    <span className="timeline-gap">
                      (+{(time - shotTimes[shotTimes.length - idx - 1]).toFixed(1)}s)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PacingDrill
