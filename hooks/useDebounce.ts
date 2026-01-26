import { useEffect, useState } from 'react';

/**
 * Debounces a value by delaying updates until the value has stopped changing
 * for the specified delay period.
 *
 * Useful for delaying expensive operations (like QR generation) until user
 * has finished typing or adjusting controls.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds before updating (default: 300ms)
 * @returns The debounced value
 *
 * @example
 * const [input, setInput] = useState('');
 * const debouncedInput = useDebounce(input, 500);
 *
 * // debouncedInput only updates 500ms after user stops typing
 * useEffect(() => {
 *   // Expensive operation only runs after debounce
 *   performExpensiveOperation(debouncedInput);
 * }, [debouncedInput]);
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up timer to update debounced value after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function clears timeout if value changes before delay expires
    // This prevents memory leaks and ensures only the latest value is used
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
