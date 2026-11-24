import RoomDialog from '../RoomDialog';

export default function HowToPlay({ close }: { close: () => void }) {
  return (
    <RoomDialog
      data-testid="how-to-play-panel"
      onClose={close}
      title="How to play Mancala"
    >
      <ul className="list-disc space-y-1.5 pl-5">
        <li>
          Each player has 6 pits with 4 stones, and a store at their right end.
        </li>
        <li>
          On your turn, pick one of your pits. Its stones are dropped one by one
          into the next pits, counter-clockwise, into your store but never your
          opponent's.
        </li>
        <li>Last stone lands in your store? Go again.</li>
        <li>
          Last stone lands in an empty pit on your side? Capture it plus every
          stone in the pit facing it.
        </li>
        <li>
          When one side runs out of stones, the other player banks what's left
          on theirs. Most stones in the store wins.
        </li>
      </ul>
      <p>
        Click a cushion to sit. When someone sits opposite you, the game starts.
        No one around? The Computer is always up for a game.
      </p>
      <button
        className="border-windows bg-secondary active:border-windows-inverted self-end px-6 py-1"
        onClick={close}
        type="button"
      >
        Got it
      </button>
    </RoomDialog>
  );
}
