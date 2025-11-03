import classNames from 'classnames';

type BlinkCaretProps = {
  hide?: boolean;
};

export default function BlinkCaret({ hide = false }: BlinkCaretProps) {
  return (
    <div className={classNames('absolute top-0 left-0 p-4', { hidden: hide })}>
      <p className="animate-blink text-windows-teal text-lg font-bold">_</p>
    </div>
  );
}
