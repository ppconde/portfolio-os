type BlinkCaretProps = {
  hide?: boolean;
};

export default function BlinkCaret({ hide = false }: BlinkCaretProps) {
  return (
    <div className={`absolute left-0 top-0 p-4 ${hide ? 'hidden' : ''}`}>
      <p className="animate-blink text-lg font-bold text-windows-teal">_</p>
    </div>
  );
}
