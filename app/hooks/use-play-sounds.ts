import { useEffect, useRef } from 'react';

type OnEvent = 'click';

export const usePlaySound = (sound: string, on?: OnEvent) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(sound);

    const playAudio = () => {
      if (audioRef.current) {
        // Reset playback to start
        audioRef.current.currentTime = 0;
        audioRef.current
          .play()
          .catch((error) => console.error('Error playing audio:', error));
      }
    };

    if (on === 'click') {
      document.addEventListener('click', playAudio);
    } else {
      playAudio();
    }

    return () => {
      document.removeEventListener('click', playAudio);
      audioRef.current = null;
    };
  }, [on, sound]);
};
