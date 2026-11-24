import { useState } from 'react';
import { useRoomStore } from '~/store/RoomStore';

// Owns the draft text, so typing re-renders the chat box, not the whole room.
export default function Chat({ children }: { children: React.ReactNode }) {
  const [text, setText] = useState('');
  return (
    <form
      className="border-windows bg-secondary absolute bottom-2 left-1/2 flex w-[calc(100%-1rem)] -translate-x-1/2 flex-wrap gap-1 p-1 font-mono text-sm sm:w-lg"
      onSubmit={(e) => {
        e.preventDefault();
        if (text.trim()) useRoomStore.getState().send({ t: 'say', text });
        setText('');
      }}
    >
      <input
        aria-label="Say something"
        className="border-windows-sunken bg-tertiary min-w-0 grow border-2 px-1"
        maxLength={80}
        onChange={(e) => setText(e.target.value)}
        placeholder="Say something…"
        value={text}
      />
      <button
        className="border-windows bg-secondary active:border-windows-inverted px-3"
        type="submit"
      >
        Say
      </button>
      {children}
    </form>
  );
}
