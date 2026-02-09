import { useEffect } from 'react';
import { playDayComplete } from '../utils/sounds';

export default function DaySummary({ day, decisions, onNextDay }) {
  const correct = decisions.filter(d => d.correct).length;
  const total = decisions.length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const fraudstersCaught = decisions.filter(d => d.correctVerdict === 'reject' && d.verdict === 'reject').length;
  const totalFraudsters = decisions.filter(d => d.correctVerdict === 'reject').length;
  const wrongApprovals = decisions.filter(d => d.correctVerdict === 'reject' && d.verdict === 'approve').length;

  useEffect(() => {
    playDayComplete();
  }, []);

  return (
    <div className="day-transition">
      <div className="day-transition__day-num" style={{ fontSize: 'clamp(32px, 8vw, 56px)' }}>
        DAY {day} COMPLETE
      </div>
      <div className="day-transition__day-title">Daily Report</div>

      <div className="day-transition__stats">
        <div className="day-transition__stat">
          <div className={`day-transition__stat-value ${accuracy >= 70 ? 'day-transition__stat-value--good' : 'day-transition__stat-value--bad'}`}>
            {accuracy}%
          </div>
          <div className="day-transition__stat-label">Accuracy</div>
        </div>
        <div className="day-transition__stat">
          <div className="day-transition__stat-value day-transition__stat-value--good">
            {fraudstersCaught}/{totalFraudsters}
          </div>
          <div className="day-transition__stat-label">Fraudsters Caught</div>
        </div>
        <div className="day-transition__stat">
          <div className={`day-transition__stat-value ${wrongApprovals > 0 ? 'day-transition__stat-value--bad' : 'day-transition__stat-value--good'}`}>
            {wrongApprovals}
          </div>
          <div className="day-transition__stat-label">Fraudsters Approved</div>
        </div>
      </div>

      {wrongApprovals > 0 && (<>
        <p style={{
          marginTop: '16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          color: 'var(--neon-red)',
          maxWidth: '400px',
        }}>
          Warning: {wrongApprovals} fraudulent merchant{wrongApprovals > 1 ? 's' : ''} approved. This will affect your audit score.
        </p>
        <p style={{
          marginTop: '6px',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--text-muted)',
          opacity: 0.5,
        }}>
          This report will be included in the final audit.
        </p>
      </>)}

      <button
        className="title-screen__start-btn"
        onClick={onNextDay}
        style={{ marginTop: '32px', fontSize: '16px' }}
      >
        Next Day
      </button>
    </div>
  );
}
