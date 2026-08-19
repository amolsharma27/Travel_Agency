import { Link } from 'react-router-dom';
import { FiHeart, FiMapPin, FiCheck } from 'react-icons/fi';
import RatingStars from './RatingStars.jsx';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60';

const HotelCard = ({ hotel, wishlisted, onToggleWishlist }) => {
  const originalPrice = hotel.originalPrice || Math.round(hotel.startingPrice * 1.3);

  return (
    <div className="group overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden bg-slate-900">
        <Link to={`/hotels/${hotel.slug || hotel._id}`}>
          <img
            src={hotel.images?.[0] || PLACEHOLDER}
            alt={hotel.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PLACEHOLDER;
            }}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
        <button
          onClick={() => onToggleWishlist?.(hotel._id)}
          aria-label="Save to wishlist"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition z-10"
        >
          <FiHeart size={14} className={wishlisted ? 'fill-red-500 text-red-500' : ''} />
        </button>

        <div className="absolute left-3 top-3 flex flex-col gap-1 items-start">
          <span className="rounded bg-[#0F2942] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm border border-slate-700">
            {hotel.propertyType || 'Hotel'}
          </span>
          {hotel.starRating && (
            <span className="rounded bg-amber-500 px-2 py-0.5 text-[9px] font-bold text-slate-900 shadow-sm">
              {hotel.starRating}★ Rated
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <Link to={`/hotels/${hotel.slug || hotel._id}`}>
            <h3 className="font-display text-sm md:text-base font-bold leading-snug text-slate-900 dark:text-white group-hover:text-[#0F2942] dark:group-hover:text-amber-400 transition-colors line-clamp-1">
              {hotel.name}
            </h3>
          </Link>
          
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
            <FiMapPin size={12} className="text-[#E11D48]" /> {hotel.city}
            {hotel.landmark ? ` · ${hotel.landmark}` : ''}
          </p>

          <div className="mt-2 flex items-center gap-1.5">
            <RatingStars rating={hotel.rating || 4.5} size={12} />
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">({hotel.reviewsCount || 85})</span>
          </div>

          {hotel.amenities && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {hotel.amenities.slice(0, 2).map((a, i) => (
                <span key={i} className="text-[10px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-medium">
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-end justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Starts at</p>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-lg font-black text-slate-900 dark:text-white">
                ₹{hotel.startingPrice.toLocaleString('en-IN')}
              </span>
              {originalPrice > hotel.startingPrice && (
                <span className="font-mono text-xs text-slate-400 line-through">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-[10px] text-slate-400">/ night</span>
            </div>
          </div>

          <Link
            to={`/hotels/${hotel.slug || hotel._id}`}
            className="rounded-md bg-[#0F2942] hover:bg-[#E11D48] text-white px-3 py-1.5 text-xs font-bold shadow-sm transition-all duration-150"
          >
            View Stay &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
