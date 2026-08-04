import { useState } from 'react';
import { useTime } from '~/hooks/use-time';

export default function Clock() {
  const time = useTime();
  const [imgPath, setImgPath] = useState('/assets/loudspeaker_rays-0.png');
  const toggleImage = () => {
    setImgPath((prev) =>
      prev === '/assets/loudspeaker_rays-0.png'
        ? '/assets/loudspeaker_muted-0.png'
        : '/assets/loudspeaker_rays-0.png'
    );
  };
  return (
    <div className="my-1 mr-0 ml-2 flex h-[70%] min-w-20 items-center justify-center border border-windows-inverted p-0.5">
      <button
        className="mr-1 h-full border-0 bg-transparent p-0"
        onClick={toggleImage}
        type="button"
      >
        <img
          alt="Speaker icon"
          className="h-full w-auto object-contain"
          src={imgPath}
        />
      </button>
      <p className="text-center font-thin text-ms-reference text-xs uppercase tracking-tighter">
        {time}
      </p>
    </div>
  );
}
