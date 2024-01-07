import { useCallback, useRef } from 'react';

export default function useDebounce<T>(
  callback: (arg: T) => void,
  delay = 700,
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = (args: T) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(args);
      timeoutRef.current = null;
    }, delay);
  };

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return { debouncedCallback, cancel };
}
