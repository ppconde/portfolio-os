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
    <>
      <div className="border-windows-inverted my-1 mr-0 ml-2 flex h-[70%] min-w-20 items-center justify-center border p-0.5">
        <button
          onClick={toggleImage}
          className="mr-1 h-full border-0 bg-transparent p-0"
        >
          <img
            className="h-full w-auto object-contain"
            src={imgPath}
            alt="Speaker icon"
          />
        </button>
        <p className="text-ms-reference text-center text-xs font-thin tracking-tighter uppercase">
          {time}
        </p>
      </div>
    </>
  );
}
