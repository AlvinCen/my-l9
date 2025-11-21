import React, { useEffect, useRef } from 'react';

export function useInterval(callback: () => void, delay: number | null) {
  // FIX: useRef was called without arguments, causing an error. Initializing it with the callback is a robust pattern that resolves this.
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      // FIX: Since savedCallback.current is guaranteed to be a function, the conditional check is unnecessary.
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
