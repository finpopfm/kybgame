import { useReducer, useCallback } from 'react';
import { getMerchantsForDay } from '../data/merchants';
import { getDayConfig } from '../data/days';
import { calculateScore, getGrade, getFunTitle } from '../utils/scoring';

const initialState = {
  screen: 'title', // 'title' | 'dayTransition' | 'game' | 'daySummary' | 'result'
  currentDay: 1,
  currentMerchantIndex: 0,
  merchants: [],
  decisions: [], // { merchantId, verdict, correct, timeSpent }
  allDecisions: [], // accumulated across all days
  dayStartTime: null,
  merchantStartTime: null,
  streak: 0,
  bestStreak: 0,
  stamping: null, // null | 'approved' | 'rejected' | 'request'
  dayTransitionPhase: 'in', // 'in' | 'out'
  chatMessages: [],
  timerExpired: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialState,
        screen: 'dayTransition',
        currentDay: 1,
        merchants: getMerchantsForDay(1),
        dayTransitionPhase: 'in',
      };

    case 'START_DAY': {
      const now = Date.now();
      return {
        ...state,
        screen: 'game',
        currentMerchantIndex: 0,
        decisions: [],
        dayStartTime: now,
        merchantStartTime: now,
        stamping: null,
        timerExpired: false,
        chatMessages: [],
      };
    }

    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatMessages: [...state.chatMessages, { ...action.payload, id: Date.now() + Math.random() }],
      };

    case 'MAKE_DECISION': {
      const { verdict } = action.payload;
      const merchant = state.merchants[state.currentMerchantIndex];
      const correct = verdict === merchant.correctVerdict;
      const timeSpent = Date.now() - state.merchantStartTime;
      const newStreak = correct ? state.streak + 1 : 0;

      const decision = {
        merchantId: merchant.id,
        merchantName: merchant.company.name,
        verdict,
        correctVerdict: merchant.correctVerdict,
        correct,
        timeSpent,
        day: state.currentDay,
        redFlags: merchant.redFlags,
      };

      return {
        ...state,
        stamping: verdict === 'approve' ? 'approved' : verdict === 'reject' ? 'rejected' : 'request',
        decisions: [...state.decisions, decision],
        streak: newStreak,
        bestStreak: Math.max(state.bestStreak, newStreak),
      };
    }

    case 'NEXT_MERCHANT': {
      const nextIndex = state.currentMerchantIndex + 1;
      const isLastMerchant = nextIndex >= state.merchants.length;

      if (isLastMerchant) {
        const allDecs = [...state.allDecisions, ...state.decisions];
        const isLastDay = state.currentDay >= 5;

        if (isLastDay) {
          return {
            ...state,
            screen: 'result',
            allDecisions: allDecs,
            stamping: null,
          };
        }

        return {
          ...state,
          screen: 'daySummary',
          allDecisions: allDecs,
          stamping: null,
        };
      }

      return {
        ...state,
        currentMerchantIndex: nextIndex,
        merchantStartTime: Date.now(),
        stamping: null,
      };
    }

    case 'NEXT_DAY': {
      const nextDay = state.currentDay + 1;
      return {
        ...state,
        screen: 'dayTransition',
        currentDay: nextDay,
        merchants: getMerchantsForDay(nextDay),
        dayTransitionPhase: 'in',
        decisions: [],
      };
    }

    case 'TIMER_EXPIRED':
      return {
        ...state,
        timerExpired: true,
      };

    case 'END_DAY_EARLY': {
      const allDecs = [...state.allDecisions, ...state.decisions];
      const isLastDay = state.currentDay >= 5;
      return {
        ...state,
        screen: isLastDay ? 'result' : 'daySummary',
        allDecisions: allDecs,
        stamping: null,
      };
    }

    case 'GO_TO_TITLE':
      return { ...initialState };

    default:
      return state;
  }
}

export default function useGameState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startGame = useCallback(() => dispatch({ type: 'START_GAME' }), []);
  const startDay = useCallback(() => dispatch({ type: 'START_DAY' }), []);
  const makeDecision = useCallback((verdict) => dispatch({ type: 'MAKE_DECISION', payload: { verdict } }), []);
  const nextMerchant = useCallback(() => dispatch({ type: 'NEXT_MERCHANT' }), []);
  const nextDay = useCallback(() => dispatch({ type: 'NEXT_DAY' }), []);
  const addChatMessage = useCallback((msg) => dispatch({ type: 'ADD_CHAT_MESSAGE', payload: msg }), []);
  const timerExpired = useCallback(() => dispatch({ type: 'TIMER_EXPIRED' }), []);
  const goToTitle = useCallback(() => dispatch({ type: 'GO_TO_TITLE' }), []);
  const endDayEarly = useCallback(() => dispatch({ type: 'END_DAY_EARLY' }), []);

  // Computed values
  const currentMerchant = state.merchants[state.currentMerchantIndex] || null;
  const dayConfig = getDayConfig(state.currentDay);
  const dayProgress = state.merchants.length > 0
    ? `${state.currentMerchantIndex + 1}/${state.merchants.length}`
    : '0/0';

  const dayCorrect = state.decisions.filter(d => d.correct).length;
  const dayTotal = state.decisions.length;

  const finalScore = state.screen === 'result' ? calculateScore(state.allDecisions) : null;
  const finalGrade = finalScore ? getGrade(finalScore.accuracy) : null;
  const finalTitle = finalScore ? getFunTitle(finalScore, finalGrade) : null;

  return {
    state,
    currentMerchant,
    dayConfig,
    dayProgress,
    dayCorrect,
    dayTotal,
    finalScore,
    finalGrade,
    finalTitle,
    actions: {
      startGame,
      startDay,
      makeDecision,
      nextMerchant,
      nextDay,
      addChatMessage,
      timerExpired,
      endDayEarly,
      goToTitle,
    },
  };
}
