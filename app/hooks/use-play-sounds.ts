import { useEffect } from 'react';

type OnEvent = 'click';

export const usePlaySound = (sound: string, on?: OnEvent) => {
  useEffect(() => {
    const audio = new Audio(sound);
    const playAudio = () => audio.play();

    if (on === 'click') {
      document.addEventListener('click', playAudio);
    } else {
      playAudio();
    }

    return () => document.removeEventListener('click', playAudio);
  }, [on, sound]);
};
