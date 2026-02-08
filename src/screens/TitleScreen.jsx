import { useCallback } from 'react';
import { CHARACTERS } from '../data/dialogues';
import { initAudio } from '../utils/sounds';

const characterOrder = ['luna', 'iris', 'nova', 'vera'];

export default function TitleScreen({ onStart }) {
  const handleStart = useCallback(() => {
    initAudio(); // Unlock audio on mobile (must be inside user gesture)
    onStart();
  }, [onStart]);

  return (
    <div className="title-screen">
      <div className="title-screen__brand">FINPOP GAMES</div>
      <h1 className="title-screen__logo">PASS THE KYB</h1>
      <h2 className="title-screen__subtitle">Compliance Edition</h2>
      <p className="title-screen__tagline">
      You are about to review KYB cases under time pressure. Spot the fraudsters. Protect the startup.
        Can you survive 5 days as a fintech compliance officer?
      </p>

      <div className="title-screen__characters">
        {characterOrder.map((key) => {
          const char = CHARACTERS[key];
          return (
            <div key={key} className="title-screen__character-label">
              <img
                className="title-screen__character"
                src={char.image}
                alt={char.name}
                style={{ borderColor: char.color }}
              />
              <span className="title-screen__character-name">
                {char.name} · {char.role}
              </span>
            </div>
          );
        })}
      </div>

      <button className="title-screen__start-btn" onClick={handleStart}>
        Start Review
      </button>

      <div className="title-screen__version">
        <a href="https://finpop.fm" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--neon-purple)', textDecoration: 'none' }}>FINPOP.fm</a> · Pass the KYB v1.0
      </div>
    </div>
  );
}
