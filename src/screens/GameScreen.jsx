import { useEffect, useRef, useCallback, useState } from 'react';
import DayHeader from '../components/DayHeader';
import MerchantCard from '../components/MerchantCard';
import DocumentViewer from '../components/DocumentViewer';
import ActionPanel from '../components/ActionPanel';
import TeamChat from '../components/TeamChat';
import Stamp from '../components/Stamp';
import useTimer from '../hooks/useTimer';
import { getDayStartDialogues, getRandomDialogue } from '../data/dialogues';
import { playApprove, playReject, playRequest, playStamp, playSlide } from '../utils/sounds';

export default function GameScreen({ game }) {
  const { state, currentMerchant, dayConfig, dayProgress, actions } = game;
  const { stamping, currentDay, currentMerchantIndex, streak, decisions } = state;

  const timerSeconds = dayConfig?.timerSeconds || null;
  const timer = useTimer(timerSeconds || 999, actions.timerExpired);
  const chatInitialized = useRef(false);
  const [chatOpen, setChatOpen] = useState(true); // start open to show intro
  const [chatAutoClose, setChatAutoClose] = useState(true);
  const prevMsgCount = useRef(0);

  // Auto-close chat after 6 seconds (separate effect, unaffected by StrictMode)
  useEffect(() => {
    if (!chatAutoClose) return;
    const id = setTimeout(() => {
      setChatOpen(false);
      setChatAutoClose(false);
    }, 6000);
    return () => clearTimeout(id);
  }, [chatAutoClose]);

  // Start timer and send day-start dialogues
  useEffect(() => {
    if (!chatInitialized.current) {
      chatInitialized.current = true;

      const msgs = getDayStartDialogues(currentDay);
      msgs.forEach((msg, i) => {
        setTimeout(() => {
          actions.addChatMessage(msg);
        }, i * 800);
      });
      if (timerSeconds) {
        timer.start();
      }
    }
  }, [currentDay, actions, timerSeconds, timer]);

  // Send reaction messages on decisions
  useEffect(() => {
    if (decisions.length === 0) return;
    const lastDecision = decisions[decisions.length - 1];
    if (!lastDecision) return;

    let category;
    if (lastDecision.correct) {
      if (lastDecision.verdict === 'approve') category = 'correctApprove';
      else if (lastDecision.verdict === 'reject') category = 'correctReject';
      else category = 'correctRequest';
    } else {
      if (lastDecision.verdict === 'approve') category = 'wrongApprove';
      else if (lastDecision.verdict === 'reject') category = 'wrongReject';
      else if (lastDecision.correctVerdict === 'reject') category = 'wrongRequestOnFraud';
      else category = 'wrongRequest';
    }

    const msg = getRandomDialogue(category);
    if (msg) {
      setTimeout(() => actions.addChatMessage(msg), 300);
    }

    // Streak messages
    if (streak === 3) {
      const streakMsg = getRandomDialogue('streak3');
      if (streakMsg) setTimeout(() => actions.addChatMessage(streakMsg), 900);
    } else if (streak === 5) {
      const streakMsg = getRandomDialogue('streak5');
      if (streakMsg) setTimeout(() => actions.addChatMessage(streakMsg), 900);
    }
  }, [decisions.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Time pressure warning
  useEffect(() => {
    if (timer.isWarning && timer.secondsLeft === 30) {
      const msg = getRandomDialogue('timePressure');
      if (msg) actions.addChatMessage(msg);
    }
  }, [timer.isWarning, timer.secondsLeft, actions]);

  // Auto-end day when timer expires (use ref to fire only once)
  const timerHandled = useRef(false);
  useEffect(() => {
    if (state.timerExpired && !timerHandled.current) {
      timerHandled.current = true;
      actions.addChatMessage({
        character: 'vera',
        text: "Time's up! Day is over. Let's review your performance."
      });
      setTimeout(() => {
        actions.endDayEarly();
      }, 2500);
    }
  }, [state.timerExpired, actions]);

  const handleDecision = useCallback((verdict) => {
    if (stamping) return;

    // Play verdict sound immediately
    if (verdict === 'approve') playApprove();
    else if (verdict === 'reject') playReject();
    else playRequest();

    // Play stamp thump after a tiny delay
    setTimeout(() => playStamp(), 80);

    actions.makeDecision(verdict);

    // After stamp animation, slide to next merchant
    setTimeout(() => {
      playSlide();
      actions.nextMerchant();
    }, 1200);
  }, [stamping, actions]);

  if (!currentMerchant) return null;

  return (
    <div className="game-screen">
      <DayHeader
        day={currentDay}
        title={dayConfig?.title}
        progress={dayProgress}
        timer={timerSeconds ? timer : null}
      />

      <div className="desk">
        <div className="desk__main">
          <div style={{ position: 'relative' }}>
            <MerchantCard
              key={currentMerchant.id}
              merchant={currentMerchant}
            />
            {stamping && <Stamp type={stamping} />}
          </div>

          <DocumentViewer
            key={`doc-${currentMerchant.id}`}
            merchant={currentMerchant}
          />

          <ActionPanel
            onDecision={handleDecision}
            disabled={!!stamping || state.timerExpired}
          />
        </div>

        {/* Mobile: toggle button for chat */}
        <button
          className={`chat-toggle ${chatOpen ? 'chat-toggle--open' : ''}`}
          onClick={() => setChatOpen(prev => !prev)}
        >
          {chatOpen ? 'Hide Chat' : 'Team Chat'}
          {!chatOpen && state.chatMessages.length > 0 && (
            <span className="chat-toggle__badge">{state.chatMessages.length}</span>
          )}
        </button>

        <div className={`desk__sidebar ${chatOpen ? 'desk__sidebar--open' : ''}`}>
          <TeamChat messages={state.chatMessages} />
        </div>
      </div>
    </div>
  );
}
