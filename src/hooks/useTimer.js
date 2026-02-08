import { useState, useEffect, useRef, useCallback } from 'react';

export default function useTimer(totalSeconds, onExpire) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const expiredRef = useRef(false);

  const start = useCallback(() => {
    setSecondsLeft(totalSeconds);
    setIsRunning(true);
    expiredRef.current = false;
  }, [totalSeconds]);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback((newTotal) => {
    stop();
    setSecondsLeft(newTotal ?? totalSeconds);
    expiredRef.current = false;
  }, [stop, totalSeconds]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsRunning(false);
          if (!expiredRef.current) {
            expiredRef.current = true;
            onExpire?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, onExpire]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const isWarning = isRunning && secondsLeft <= 30;
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 1;

  return {
    secondsLeft,
    formatted,
    isRunning,
    isWarning,
    progress,
    start,
    stop,
    reset,
  };
}
