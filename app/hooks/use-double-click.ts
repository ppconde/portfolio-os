import { useState, useEffect } from 'react';
import { isTouchDevice } from '~/utils/media-matcher';

export function useDoubleClick(callback: () => void, delay: number = 300) {
  const [tapCount, setTapCount] = useState(0);

  useEffect(() => {
    if (!isTouchDevice()) return;

    // Cleanup any timeout when tapCount changes or the component unmounts
    const timeoutId = setTimeout(() => setTapCount(0), delay);

    return () => clearTimeout(timeoutId);
  }, [tapCount, delay]);

  const onTap = () => {
    setTapCount((prevCount) => prevCount + 1);

    if (tapCount === 1) {
      setTapCount(0); // Reset the tap count
      callback(); // Call the passed callback when double-tapped
    }
  };

  return onTap;
}
