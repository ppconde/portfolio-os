import { useState } from 'react';
import { COLORS, NAME_MAX } from '~/room';
import { useRoomStore } from '~/store/RoomStore';
import RoomDialog from '../RoomDialog';

const NAMES = ['Blu', 'Pip', 'Juno', 'Ziggy', 'Mo', 'Rex'];

const store = (key: string, value?: string) => {
  try {
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
  } catch {} // private mode: just don't remember
  return null;
};

export default function Join() {
  const [name, setName] = useState(
    () =>
      store('room-name')?.slice(0, NAME_MAX) ??
      NAMES[Math.floor(Math.random() * NAMES.length)]
  );
  const taken = useRoomStore((s) => s.nameTaken);
  return (
    <div className="relative h-full bg-[#2b1612] bg-[url(/img/mancala/lounge.webp)] bg-contain bg-center bg-no-repeat">
      <RoomDialog title="Mancala lounge">
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            store('room-name', name);
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            useRoomStore.getState().connect(name, color);
          }}
        >
          <p>Walk around the lounge and play Mancala with whoever's here.</p>
          <label className="flex items-center gap-2">
            Your name
            <input
              aria-describedby="name-taken"
              className="border-windows-sunken bg-tertiary min-w-0 grow border-2 px-1 py-0.5"
              maxLength={NAME_MAX}
              onChange={(e) => setName(e.target.value)}
              required
              value={name}
            />
          </label>
          {taken && (
            <p className="text-red-700" id="name-taken" role="alert">
              Someone here is already called that. Pick another name.
            </p>
          )}
          <button
            className="border-windows bg-secondary active:border-windows-inverted self-end px-6 py-1"
            type="submit"
          >
            Enter
          </button>
        </form>
      </RoomDialog>
    </div>
  );
}
