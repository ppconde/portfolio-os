import { useEffect } from 'react';

// Plays `sound` on every document click.
export const usePlaySound = (sound: string) => {
  useEffect(() => {
    const audio = new Audio(sound);
    const play = () => {
      audio.currentTime = 0;
      audio
        .play()
        .catch((error) => console.error('Error playing audio:', error));
    };
    document.addEventListener('click', play);
    return () => document.removeEventListener('click', play);
  }, [sound]);
};
