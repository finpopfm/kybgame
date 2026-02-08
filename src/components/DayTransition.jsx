import { useState, useEffect, useCallback } from 'react';
import { initAudio } from '../utils/sounds';

export default function DayTransition({ dayConfig, onContinue }) {
  const [ready, setReady] = useState(false);

  const handleBegin = useCallback(() => {
    initAudio();
    onContinue();
  }, [onContinue]);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(t);
  }, []);

  if (!dayConfig) return null;

  return (
    <div className="day-transition">
      <div className="day-transition__day-num">DAY {dayConfig.day}</div>
      <div className="day-transition__day-title">{dayConfig.title}</div>
      <p className="day-transition__summary">{dayConfig.description}</p>
      {dayConfig.timerSeconds && (
        <p style={{
          marginTop: '12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          color: 'var(--neon-cyan)',
        }}>
          Time limit: {Math.floor(dayConfig.timerSeconds / 60)}:{(dayConfig.timerSeconds % 60).toString().padStart(2, '0')} · {dayConfig.merchantCount} applications
        </p>
      )}
      {!dayConfig.timerSeconds && (
        <p style={{
          marginTop: '12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          color: 'var(--neon-green)',
        }}>
          No time limit · {dayConfig.merchantCount} applications · Tutorial
        </p>
      )}
      {ready && (
        <button
          className="title-screen__start-btn"
          onClick={handleBegin}
          style={{ marginTop: '32px', fontSize: '16px' }}
        >
          Begin
        </button>
      )}
    </div>
  );
}
