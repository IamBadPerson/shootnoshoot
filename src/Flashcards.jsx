import { useState, useEffect } from 'react'
import './Flashcards.css'

function Flashcards({ onBack }) {
  const [cards] = useState([
    { modern: "Form", normanFrench: "Formez! / A Forme!", earlyEnglish: "Awicken!", meaning: "Form a basic fighting line" },
    { modern: "Present", normanFrench: "Presente les armes!", earlyEnglish: "Rearath spar!", meaning: "Present weapons and prepare to advance" },
    { modern: "Advance", normanFrench: "Avancez! / Avant!", earlyEnglish: "Gegen forth!", meaning: "Advance towards the enemy" },
    { modern: "Fall Back", normanFrench: "Retout! / Donnez-sol", earlyEnglish: "Withertrod!", meaning: "Give ground/move backwards whilst maintaining formation" },
    { modern: "Charge", normanFrench: "Chargez!", earlyEnglish: "Onraes!", meaning: "Run into combat" },
    { modern: "Halt", normanFrench: "Aret!", earlyEnglish: "Stedefast!", meaning: "Stop the formation" },
    { modern: "Turn", normanFrench: "Tournez...", earlyEnglish: "Wendeth!", meaning: "Turn" },
    { modern: "(to the) Left", normanFrench: "A gauche", earlyEnglish: "Leoft!", meaning: "Left" },
    { modern: "(to the) Right", normanFrench: "A droit", earlyEnglish: "Richte!", meaning: "Right" },
    { modern: "Quickly", normanFrench: "Vite!", earlyEnglish: "Fleete!", meaning: "(The order) rapidly" },
    { modern: "Dress", normanFrench: "Dresse!", earlyEnglish: "Trimmen!", meaning: "Shuffle to fill gaps/shift the line down" },
    { modern: "(Form) Line", normanFrench: "(Formez) rangee!", earlyEnglish: "Gurth raew ficliath!", meaning: "Form a formation wider than it is deep" },
    { modern: "(Form) Column", normanFrench: "(Formez) Eschele!", earlyEnglish: "Sparfylka!", meaning: "Form a formation deeper than it is wide" },
    { modern: "(Form) Shieldwall", normanFrench: "En embrasse-deescuz", earlyEnglish: "Scealdborg!", meaning: "Overlap/butt shields closely" },
    { modern: "Company", normanFrench: "Battaille!", earlyEnglish: "Fylka!", meaning: "Non-Conroi formation" },
    { modern: "1st, 2nd, 3rd", normanFrench: "Premiere, Deuxieme, Troisieme", earlyEnglish: "Firste, Twain, Drehain", meaning: "Saxon: number/division, French: division/number" },
    { modern: "Shields! (up/down)", normanFrench: "Escuz! (ascende/descende!)", earlyEnglish: "Schilde! (rearath/nameth)", meaning: "Raise shields to receive arrows, or drop them after" },
    { modern: "Archers (forward)", normanFrench: "Arcier (avant)", earlyEnglish: "Bowmen (forth)", meaning: "Archers advancing to begin shooting" },
    { modern: "Nock", normanFrench: "Preparez-tir!", earlyEnglish: "Nockken Strael!", meaning: "Nock the arrow to the bowstring" },
    { modern: "Draw (/Aim)", normanFrench: "Marquer!", earlyEnglish: "Rearath Strael!", meaning: "Draw nocked arrows to the cheek" },
    { modern: "Loose", normanFrench: "Tirez!", earlyEnglish: "Straele Fugen!", meaning: "Release bowstring and let fly" },
    { modern: "Surrender", normanFrench: "Rendez!", earlyEnglish: "Crave!", meaning: "Asking/demanding surrender from the enemy" },
    { modern: "I surrender", normanFrench: "Je me rends!", earlyEnglish: "Craven!", meaning: "A sign of surrender to the enemy" }
  ])

  const [currentCard, setCurrentCard] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [questionType, setQuestionType] = useState('normanToMeaning') // normanToMeaning, earlyToMeaning, meaningToNorman, meaningToEarly
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [options, setOptions] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [studyMode, setStudyMode] = useState(false)

  useEffect(() => {
    loadRandomCard()
  }, [questionType])

  const loadRandomCard = () => {
    const randomIndex = Math.floor(Math.random() * cards.length)
    const card = cards[randomIndex]
    setCurrentCard(card)
    setShowAnswer(false)
    setSelectedAnswer(null)
    
    if (!studyMode) {
      generateOptions(card)
    }
  }

  const generateOptions = (correctCard) => {
    const wrongCards = cards.filter(c => c !== correctCard)
    const shuffled = wrongCards.sort(() => Math.random() - 0.5)
    const wrongOptions = shuffled.slice(0, 3)
    
    const allOptions = [correctCard, ...wrongOptions].sort(() => Math.random() - 0.5)
    setOptions(allOptions)
  }

  const handleAnswer = (selectedCard) => {
    if (showAnswer) return
    
    setSelectedAnswer(selectedCard)
    setShowAnswer(true)
    
    const correct = selectedCard === currentCard
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }))
  }

  const handleNext = () => {
    loadRandomCard()
  }

  const resetScore = () => {
    setScore({ correct: 0, total: 0 })
    loadRandomCard()
  }

  const getQuestion = () => {
    if (!currentCard) return ''
    
    switch(questionType) {
      case 'normanToMeaning':
        return currentCard.normanFrench
      case 'earlyToMeaning':
        return currentCard.earlyEnglish
      case 'meaningToNorman':
        return currentCard.meaning
      case 'meaningToEarly':
        return currentCard.meaning
      default:
        return ''
    }
  }

  const getAnswerText = (card) => {
    switch(questionType) {
      case 'normanToMeaning':
      case 'earlyToMeaning':
        return card.meaning
      case 'meaningToNorman':
        return card.normanFrench
      case 'meaningToEarly':
        return card.earlyEnglish
      default:
        return ''
    }
  }

  const getQuestionLabel = () => {
    switch(questionType) {
      case 'normanToMeaning':
        return 'Norman French Command'
      case 'earlyToMeaning':
        return 'Early English Command'
      case 'meaningToNorman':
        return 'English Meaning'
      case 'meaningToEarly':
        return 'English Meaning'
      default:
        return ''
    }
  }

  const getAnswerLabel = () => {
    switch(questionType) {
      case 'normanToMeaning':
      case 'earlyToMeaning':
        return 'What does this mean?'
      case 'meaningToNorman':
        return 'Norman French translation:'
      case 'meaningToEarly':
        return 'Early English translation:'
      default:
        return ''
    }
  }

  if (!currentCard) {
    return <div className="flashcards"><h1>Loading...</h1></div>
  }

  return (
    <div className="flashcards">
      <header>
        <h1>Authentic Orders Flashcards</h1>
        <div className="controls">
          <select 
            value={questionType} 
            onChange={(e) => {
              setQuestionType(e.target.value)
              setScore({ correct: 0, total: 0 })
            }}
            className="mode-select"
          >
            <option value="normanToMeaning">Norman French → Meaning</option>
            <option value="earlyToMeaning">Early English → Meaning</option>
            <option value="meaningToNorman">Meaning → Norman French</option>
            <option value="meaningToEarly">Meaning → Early English</option>
          </select>
          <label className="study-mode-toggle">
            <input 
              type="checkbox" 
              checked={studyMode}
              onChange={(e) => {
                setStudyMode(e.target.checked)
                loadRandomCard()
              }}
            />
            Study Mode
          </label>
        </div>
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

      <div className="card-area">
        <div className="flashcard">
          <div className="question-section">
            <p className="question-label">{getQuestionLabel()}</p>
            <h2 className="question-text">{getQuestion()}</h2>
          </div>

          {studyMode ? (
            <div className="study-mode-content">
              <button 
                className="btn btn-reveal"
                onClick={() => setShowAnswer(!showAnswer)}
              >
                {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
              </button>
              
              {showAnswer && (
                <div className="full-answer">
                  <div className="answer-row">
                    <span className="label">Modern English:</span>
                    <span className="value">{currentCard.modern}</span>
                  </div>
                  <div className="answer-row">
                    <span className="label">Norman French:</span>
                    <span className="value">{currentCard.normanFrench}</span>
                  </div>
                  <div className="answer-row">
                    <span className="label">Early English:</span>
                    <span className="value">{currentCard.earlyEnglish}</span>
                  </div>
                  <div className="answer-row meaning">
                    <span className="label">Meaning:</span>
                    <span className="value">{currentCard.meaning}</span>
                  </div>
                  <button className="btn btn-next" onClick={handleNext}>
                    Next Card →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <p className="answer-prompt">{getAnswerLabel()}</p>
              <div className="options">
                {options.map((card, index) => (
                  <button
                    key={index}
                    className={`option-btn ${
                      showAnswer 
                        ? card === currentCard 
                          ? 'correct' 
                          : card === selectedAnswer 
                            ? 'incorrect' 
                            : 'disabled'
                        : ''
                    }`}
                    onClick={() => handleAnswer(card)}
                    disabled={showAnswer}
                  >
                    {getAnswerText(card)}
                  </button>
                ))}
              </div>

              {showAnswer && (
                <div className="result">
                  <div className={`feedback ${selectedAnswer === currentCard ? 'correct' : 'incorrect'}`}>
                    <h3>{selectedAnswer === currentCard ? '✓ Correct!' : '✗ Incorrect'}</h3>
                    <div className="correct-answer-display">
                      <p><strong>Modern English:</strong> {currentCard.modern}</p>
                      <p><strong>Norman French:</strong> {currentCard.normanFrench}</p>
                      <p><strong>Early English:</strong> {currentCard.earlyEnglish}</p>
                    </div>
                  </div>
                  <button className="btn btn-next" onClick={handleNext}>
                    Next Card →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Flashcards
