import useGameState from './hooks/useGameState';
import TitleScreen from './screens/TitleScreen';
import GameScreen from './screens/GameScreen';
import ResultScreen from './screens/ResultScreen';
import DayTransition from './components/DayTransition';
import DaySummary from './components/DaySummary';

export default function App() {
  const game = useGameState();
  const { screen } = game.state;

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
