import { useRef, useCallback, useEffect, useState } from 'react';
import { getGradeClass } from '../utils/scoring';
import Confetti from '../components/Confetti';
import { playResultReveal } from '../utils/sounds';

// --- Grade-based copy confirmation lines ---
const COPY_LINES = {
  fail: [
    'Copied. Compliance won.',
    'Copied. Legit users were harmed.',
    'Copied. False positives detected.',
  ],
  mid: [
    'Copied. Risk appetite aligned.',
    'Copied. KPIs look acceptable.',
    'Copied. No action required at this time.',
  ],
  top: [
    'Copied. Excellent risk performance.',
    'Copied. Compliance approved.',
    'Copied. Board-ready metrics.',
  ],
  neutral: [
    'Copied. Compliance has been notified.',
    'Copied. Your score is under review.',
    'Copied. A case officer will contact you shortly.',
    'Copied. Please submit additional documents.',
    'Copied. Processing time: 3–5 business weeks.',
    'Copied. Manual review required.',
  ],
};

// --- Grade-based disclaimer under buttons ---
const DISCLAIMERS = {
  fail: 'This score says more about the system than about you.',
  mid: 'Results may vary depending on jurisdiction.',
  top: 'Efficiency achieved. Collateral damage unknown.',
};

function getGradeTier(grade) {
  if (!grade) return 'neutral';
  if (grade === 'F' || grade === 'D') return 'fail';
  if (grade === 'C' || grade === 'B') return 'mid';
  if (grade.startsWith('A')) return 'top';
  return 'neutral';
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function ResultScreen({ score, grade, funTitle, allDecisions, onPlayAgain }) {
  const cardRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shareState, setShareState] = useState('idle');
  const [copyLine, setCopyLine] = useState('');
  const playCount = useRef(0);

  const tier = getGradeTier(grade);

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
      `KYB simulation result:`,
      ``,
      `Grade: ${grade} — "${funTitle}"`,
      `Accuracy: ${score.accuracy}%`,
      `Fraudsters caught: ${score.fraudstersCaught}/${score.totalFraudsters}`,
      `Speed: ${score.speedRating}`,
      ``,
      `Try it yourself → https://kyb.finpop.fm`,
    ].join('\n');

    // Pick a grade-aware confirmation line (with neutral fallback mix)
    const pool = [...COPY_LINES[tier], ...COPY_LINES.neutral];
    const line = pickRandom(pool);

    // Try native share (mobile browsers)
    if (navigator.share) {
      try {
        await navigator.share({ title: 'FINPOP: Pass the KYB', text });
        setCopyLine(line);
        setShareState('shared');
        setTimeout(() => setShareState('idle'), 3500);
        return;
      } catch {
        // fall through
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        setShareState('error');
        setCopyLine('Clipboard access denied.');
        setTimeout(() => setShareState('idle'), 3000);
        return;
      }
    }

    setCopyLine(line);
    setShareState('copied');
    setTimeout(() => setShareState('idle'), 3500);
  }, [grade, funTitle, score, tier]);

  const handlePlayAgain = useCallback(() => {
    playCount.current += 1;
    onPlayAgain();
  }, [onPlayAgain]);

  if (!score) return null;

  const shareLabel =
    (shareState === 'copied' || shareState === 'shared') ? copyLine :
    shareState === 'error' ? copyLine :
    'Share Score';

  const disclaimer = DISCLAIMERS[tier] || DISCLAIMERS.mid;
  const playAgainLabel = playCount.current >= 1
    ? 'Repeated attempts will not improve the outcome.'
    : null;

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
          <button className="score-card__btn" onClick={handlePlayAgain}>
            Play Again
          </button>
        </div>

        <div className="score-card__disclaimer">
          {disclaimer}
        </div>

        {playAgainLabel && (
          <div className="score-card__retry-note">
            {playAgainLabel}
          </div>
        )}

        <div className="score-card__finpop-link">
          A game by <a href="https://finpop.fm" target="_blank" rel="noopener noreferrer">FINPOP.fm</a> — Payments, Risk & Control
        </div>
      </div>
    </div>
  );
}
