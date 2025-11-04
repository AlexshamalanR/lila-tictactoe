interface SquareProps {
  value: number | null;
  onSquareClick: () => void;
  isClickable?: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onSquareClick, isClickable = true }) => {
  let content: string;
  if (value === 1) {
    content = 'O';
  } else if (value === 0) {
    content = 'X';
  } else {
    content = '';
  }

  return (
    <button
      onClick={isClickable ? onSquareClick : undefined}
      disabled={!isClickable}
      className={`square ${
        content === 'X'
          ? 'square-x'
          : content === 'O'
            ? 'square-o'
            : isClickable ? 'hover:border-primary/30 hover:shadow-primary/20' : ''
      } ${!isClickable && 'opacity-50 cursor-not-allowed hover:scale-100'}`}
      aria-label={content ? `Square with ${content}` : 'Empty square'}
    >
      {content}
    </button>
  );
};

export default Square;
