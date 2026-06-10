import { useEffect } from 'react';

/**
 *
 * @param callback
 * @param ref
 * @param delay
 * This function handles the onKeyUp event for an input element. It will call the provided callback function after a specified delay when a key is released.
 * The callback function will be executed after the user stops typing for the specified delay, inside a useEffect.
 */
export function useOnKeyUp(
  callback: () => void,
  ref: React.RefObject<HTMLInputElement | null>,
  delay: number = 500
): void {
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (ref.current) {
      ref.current.onkeyup = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          callback();
        }, delay);
      };
    }

    return () => clearTimeout(timeout);
  }, [callback, delay, ref]);
}
