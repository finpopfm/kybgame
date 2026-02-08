import { useMemo } from 'react';
import useGameState from './hooks/useGameState';
import TitleScreen from './screens/TitleScreen';
import GameScreen from './screens/GameScreen';
import ResultScreen from './screens/ResultScreen';
import VerifyScreen from './screens/VerifyScreen';
import DayTransition from './components/DayTransition';
import DaySummary from './components/DaySummary';
import { parseVerifyParams } from './utils/verifyUrl';

export default function App() {
  const game = useGameState();
  const { screen } = game.state;

  // Check if we're on #/verify route with params
  const verifyData = useMemo(() => parseVerifyParams(), []);

  // Render verify screen if we have valid verify data
  if (verifyData) {
    return (
      <div className="app">
        <VerifyScreen
          score={verifyData.score}
          grade={verifyData.grade}
          funTitle={verifyData.funTitle}
        />
      </div>
    );
  }

  return (
    <div className="app">
      {screen === 'title' && (
        <TitleScreen onStart={game.actions.startGame} />
      )}

      {screen === 'dayTransition' && (
        <DayTransition
          dayConfig={game.dayConfig}
          onContinue={game.actions.startDay}
        />
      )}

      {screen === 'game' && (
        <GameScreen game={game} />
      )}

      {screen === 'daySummary' && (
        <DaySummary
          day={game.state.currentDay}
          decisions={game.state.decisions}
          onNextDay={game.actions.nextDay}
        />
      )}

      {screen === 'result' && (
        <ResultScreen
          score={game.finalScore}
          grade={game.finalGrade}
          funTitle={game.finalTitle}
          allDecisions={game.state.allDecisions}
          onPlayAgain={game.actions.goToTitle}
        />
      )}
    </div>
  );
}
