import { useEffect, useState } from 'react';

export const SEARCH_DEBOUNCE_MS = 300;

/**
 * Return a copy of `value` that updates only after `delayMs` without changes.
 *
 * The original value can still drive urgent UI such as a text input. The
 * delayed copy should drive expensive work such as network requests.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
