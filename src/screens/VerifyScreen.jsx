import { getGradeClass } from '../utils/scoring';

export default function VerifyScreen({ score, grade, funTitle }) {
  return (
    <div className="result-screen">
      <div className="result-screen__title">Audit Verification</div>

      <div className="score-card">
        <div className={`score-card__grade score-card__grade--${getGradeClass(grade)}`}>
          {grade}
        </div>
        <div className="score-card__fun-title">"{funTitle}"</div>

        <div className="score-card__stats">
          <div className="score-card__stat">
            <div className="score-card__stat-value">{score.accuracy}%</div>
            <div className="score-card__stat-label">Accuracy</div>
          </div>
          <div className="score-card__stat">
            <div className="score-card__stat-value">{score.fraudstersCaught}/{score.totalFraudsters}</div>
            <div className="score-card__stat-label">Fraudsters Caught</div>
          </div>
          <div className="score-card__stat">
            <div className="score-card__stat-value">{score.legitimateBlocked}</div>
            <div className="score-card__stat-label">False Blocks</div>
          </div>
          <div className="score-card__stat">
            <div className="score-card__stat-value">{score.speedRating}</div>
            <div className="score-card__stat-label">Speed Rating</div>
          </div>
          <div className="score-card__stat">
            <div className="score-card__stat-value">{score.correct}/{score.total}</div>
            <div className="score-card__stat-label">Correct Calls</div>
          </div>
          <div className="score-card__stat">
            <div className="score-card__stat-value">{score.approvedFraudsters}</div>
            <div className="score-card__stat-label">Fraudsters Approved</div>
          </div>
        </div>

        <div className="verify-stamp">
          <div className="verify-stamp__icon">✓</div>
          <div className="verify-stamp__text">Audit reproduced successfully.</div>
          <div className="verify-stamp__sub">Simulation environment. No discrepancies detected.</div>
        </div>

        <div className="score-card__actions">
          <a
            href="/"
            className="score-card__btn score-card__btn--primary"
            style={{ textDecoration: 'none', textAlign: 'center' }}
          >
            Try It Yourself
          </a>
        </div>

        <div className="score-card__footer">
          <div className="score-card__finpop-link">
            <a href="https://finpop.fm" target="_blank" rel="noopener noreferrer">FINPOP.fm</a> — Payments, Risk & Control
          </div>
          <div className="score-card__soundtrack">
            <a href="https://music.youtube.com/watch?v=wAaE0vr0pMA&si=tHOgkPNPdOl7shDb" target="_blank" rel="noopener noreferrer">
            Official soundtrack: Pass the KYB
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
