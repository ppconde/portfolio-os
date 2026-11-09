import { useTime } from '~/hooks/use-time';
import { useRoomStore } from '~/store/RoomStore';

export default function Clock() {
  const time = useTime();
  const muted = useRoomStore((s) => s.muted);
  const toggleMute = useRoomStore((s) => s.toggleMute);
  return (
    <div className="border-windows-inverted my-1 mr-0 ml-2 flex h-[70%] min-w-20 items-center justify-center border p-0.5">
      <button
        aria-pressed={muted}
        className="mr-1 h-full border-0 bg-transparent p-0"
        onClick={toggleMute}
        type="button"
      >
        <img
          alt="Mute sound"
          className="h-full w-auto object-contain"
          src={`/assets/loudspeaker_${muted ? 'muted' : 'rays'}-0.png`}
        />
      </button>
      <p className="text-ms-reference text-center text-xs font-thin tracking-tighter uppercase">
        {time}
      </p>
    </div>
  );
}
