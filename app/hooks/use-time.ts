import { useEffect, useState } from 'react';

const fmt = () =>
  new Date().toLocaleTimeString('en-us', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

export function useTime() {
  const [time, setTime] = useState(fmt);

  useEffect(() => {
    const interval = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}
