import { useEffect, useState } from 'react';

export function useTime() {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString('en-us', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  );

  useEffect(() => {
    const getFormattedTime = () => {
      return new Date().toLocaleTimeString('en-us', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    };

    setTime(getFormattedTime());

    const interval = setInterval(() => {
      setTime(getFormattedTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return time;
}
