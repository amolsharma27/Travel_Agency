import { FiStar } from 'react-icons/fi';

const RatingStars = ({ rating = 0, size = 14, showValue = true }) => {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <span className="inline-flex items-center gap-1">
      <span className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <FiStar
            key={i}
            size={size}
            className={i <= rounded ? 'fill-sand-500 text-sand-500' : 'text-ink/20 dark:text-paper/20'}
          />
        ))}
      </span>
      {showValue && <span className="text-xs font-medium text-ink/60 dark:text-paper/60">{rating.toFixed(1)}</span>}
    </span>
  );
};

export default RatingStars;
