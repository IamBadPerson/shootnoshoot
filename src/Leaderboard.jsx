import { useState } from 'react'
import './Leaderboard.css'

function Leaderboard({ onBack }) {
  const getLeaderboard = (gameType) => {
    const stored = localStorage.getItem(`leaderboard_${gameType}`)
    return stored ? JSON.parse(stored) : []
  }

  const [shootScores] = useState(getLeaderboard('shoot'))
  const [distanceScores] = useState(getLeaderboard('distance'))
  const [flashcardScores] = useState(getLeaderboard('flashcards'))
  const [reflexScores] = useState(getLeaderboard('reflex'))
  const [vocabScores] = useState(getLeaderboard('vocab'))

  const clearLeaderboard = (gameType) => {
    if (confirm(`Clear all ${gameType} scores?`)) {
      localStorage.removeItem(`leaderboard_${gameType}`)
      window.location.reload()
    }
  }

  const ScoreTable = ({ scores, gameType, title }) => (
    <div className="leaderboard-section">
      <h2>{title}</h2>
      {scores.length === 0 ? (
        <p className="no-scores">No scores yet. Play to set a record!</p>
      ) : (
        <>
          <table className="score-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {scores.slice(0, 10).map((score, index) => (
                <tr key={index} className={index < 3 ? `rank-${index + 1}` : ''}>
                  <td className="rank">{index + 1}</td>
                  <td className="nickname">{score.nickname || 'Anonymous'}</td>
                  <td className="score">{score.correct}/{score.total}</td>
                  <td className="percentage">{score.percentage}%</td>
                  <td className="date">{new Date(score.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button 
            className="btn btn-clear"
            onClick={() => clearLeaderboard(gameType)}
          >
            Clear {title}
          </button>
        </>
      )}
    </div>
  )

  return (
    <div className="leaderboard">
      <header>
        <h1>🏆 Leaderboards</h1>
        <button className="back-btn" onClick={onBack}>← Back to Menu</button>
      </header>

      <div className="leaderboards-container">
        <ScoreTable 
          scores={shootScores} 
          gameType="shoot"
          title="Shoot / No Shoot"
        />
        <ScoreTable 
          scores={distanceScores} 
          gameType="distance"
          title="Distance Estimation"
        />
        <ScoreTable 
          scores={flashcardScores} 
          gameType="flashcards"
          title="Flashcards"
        />
        <ScoreTable 
          scores={reflexScores} 
          gameType="reflex"
          title="Instant Call Reflex"
        />
        <ScoreTable 
          scores={vocabScores} 
          gameType="vocab"
          title="Command Vocabulary"
        />
      </div>
    </div>
  )
}

export default Leaderboard
