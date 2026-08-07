import { Link } from 'react-router-dom';
import { FiHeart, FiMapPin } from 'react-icons/fi';
import RatingStars from './RatingStars.jsx';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60';

const HotelCard = ({ hotel, wishlisted, onToggleWishlist }) => (
  <div className="group overflow-hidden rounded-xl2 border border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light shadow-card transition hover:shadow-pop">
    <div className="relative">
      <Link to={`/hotels/${hotel.slug || hotel._id}`}>
        <img
          src={hotel.images?.[0] || PLACEHOLDER}
          alt={hotel.name}
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <button
        onClick={() => onToggleWishlist?.(hotel._id)}
        aria-label="Save to wishlist"
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full glass text-ink dark:text-paper"
      >
        <FiHeart size={16} className={wishlisted ? 'fill-red-500 text-red-500' : ''} />
      </button>
      {hotel.isFeatured && (
        <span className="absolute left-3 top-3 rounded-full bg-sand-500 px-3 py-1 text-xs font-semibold text-ink">
          Featured
        </span>
      )}
    </div>

    <div className="relative mx-4 mt-0 ticket-perforation ticket-dashes" />

    <Link to={`/hotels/${hotel.slug || hotel._id}`} className="block p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-base font-semibold leading-snug line-clamp-1">{hotel.name}</h3>
        <span className="shrink-0 rounded bg-lagoon-50 dark:bg-lagoon-700/30 px-1.5 py-0.5 text-xs font-semibold text-lagoon-700 dark:text-lagoon-300">
          {hotel.starRating}★
        </span>
      </div>
      <p className="mt-1 flex items-center gap-1 text-xs text-ink/60 dark:text-paper/60">
        <FiMapPin size={12} /> {hotel.city}
        {hotel.landmark ? ` · ${hotel.landmark}` : ''}
      </p>
      <div className="mt-2">
        <RatingStars rating={hotel.rating || 0} />
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <span className="font-mono text-lg font-semibold text-ink dark:text-paper">₹{hotel.startingPrice}</span>
          <span className="text-xs text-ink/50 dark:text-paper/50"> / night</span>
        </div>
        {hotel.policies?.breakfastIncluded && (
          <span className="text-xs font-medium text-lagoon-600">Breakfast included</span>
        )}
      </div>
    </Link>
  </div>
);

export default HotelCard;
