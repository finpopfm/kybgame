import { useRef, useCallback, useEffect, useState } from 'react';
import { getGradeClass } from '../utils/scoring';
import Confetti from '../components/Confetti';
import { playResultReveal } from '../utils/sounds';

export default function ResultScreen({ score, grade, funTitle, allDecisions, onPlayAgain }) {
  const cardRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shareState, setShareState] = useState('idle'); // 'idle' | 'copied' | 'shared' | 'error'

  useEffect(() => {
    playResultReveal();
    if (grade && (grade.startsWith('A') || grade === 'B')) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(t);
    }
  }, [grade]);

  const handleShare = useCallback(async () => {
    const text = [
      `FINPOP: Pass the KYB`,
      ``,
      `Grade: ${grade} — "${funTitle}"`,
      `Accuracy: ${score.accuracy}%`,
      `Fraudsters caught: ${score.fraudstersCaught}/${score.totalFraudsters}`,
      `Speed: ${score.speedRating}`,
      ``,
      `Can you beat my score?`,
      `Play at finpop.fm`,
    ].join('\n');

    // Try native share (mobile browsers)
    if (navigator.share) {
      try {
        await navigator.share({ title: 'FINPOP: Pass the KYB', text });
        setShareState('shared');
        setTimeout(() => setShareState('idle'), 2500);
        return;
      } catch {
        // User cancelled or not supported — fall through to clipboard
      }
    }

    // Clipboard fallback (desktop)
    try {
      await navigator.clipboard.writeText(text);
      setShareState('copied');
      setTimeout(() => setShareState('idle'), 2500);
    } catch {
      // Final fallback: textarea copy trick
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setShareState('copied');
        setTimeout(() => setShareState('idle'), 2500);
      } catch {
        setShareState('error');
        setTimeout(() => setShareState('idle'), 2500);
      }
    }
  }, [grade, funTitle, score]);

  if (!score) return null;

  const shareLabel =
    shareState === 'copied' ? 'Copied!' :
    shareState === 'shared' ? 'Shared!' :
    shareState === 'error' ? 'Failed' :
    'Share Score';

  return (
    <div className="result-screen">
      {showConfetti && <Confetti />}

      <div className="result-screen__title">Performance Report</div>

      <div className="score-card" ref={cardRef}>
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

        <div className="score-card__actions">
          <button
            className={`score-card__btn score-card__btn--primary ${shareState === 'copied' || shareState === 'shared' ? 'score-card__btn--success' : ''}`}
            onClick={handleShare}
            disabled={shareState !== 'idle'}
          >
            {shareLabel}
          </button>
          <button className="score-card__btn" onClick={onPlayAgain}>
            Play Again
          </button>
        </div>

        <div className="score-card__finpop-link">
          A game by <a href="https://finpop.fm" target="_blank" rel="noopener noreferrer">FINPOP.fm</a> — Payments, Risk & Control
        </div>
      </div>
    </div>
  );
}
