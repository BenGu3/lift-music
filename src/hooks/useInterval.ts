import { useEffect } from 'react';

export const useInterval = (callback: () => void | Promise<void>, delay: number): void => {
  useEffect(() => {
    const tick = () => {
      callback();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [callback, delay]);
}
