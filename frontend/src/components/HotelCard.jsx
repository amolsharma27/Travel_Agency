import { Link } from 'react-router-dom';
import { FiHeart, FiMapPin, FiTag } from 'react-icons/fi';
import RatingStars from './RatingStars.jsx';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60';

const HotelCard = ({ hotel, wishlisted, onToggleWishlist }) => {
  const isBudget = hotel.isBudgetFriendly || hotel.startingPrice < 1500;
  const originalPrice = hotel.originalPrice || Math.round(hotel.startingPrice * 1.35);

  return (
    <div className="group overflow-hidden rounded-xl border border-slate-200 dark:border-indigo-900/60 bg-white dark:bg-[#110D44] shadow-sm hover:shadow-xl transition duration-300 flex flex-col h-full">
      <div className="relative">
        <Link to={`/hotels/${hotel.slug || hotel._id}`}>
          <img
            src={hotel.images?.[0] || PLACEHOLDER}
            alt={hotel.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PLACEHOLDER;
            }}
            className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
        <button
          onClick={() => onToggleWishlist?.(hotel._id)}
          aria-label="Save to wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full glass text-slate-900 dark:text-white shadow-sm hover:scale-110 active:scale-95 transition"
        >
          <FiHeart size={16} className={wishlisted ? 'fill-red-500 text-red-500' : ''} />
        </button>

        <div className="absolute left-3 top-3 flex flex-col gap-1 items-start">
          {hotel.isFeatured && (
            <span className="rounded-md bg-[#9B1C1C] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              Featured Stay
            </span>
          )}
          {isBudget && (
            <span className="flex items-center gap-1 rounded-md bg-[#1B1464] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm border border-indigo-400/30">
              <FiTag className="text-[9px]" /> Pocket Friendly
            </span>
          )}
        </div>
      </div>

      <div className="relative mx-4 mt-0 ticket-perforation ticket-dashes" />

      <Link to={`/hotels/${hotel.slug || hotel._id}`} className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-semibold leading-snug line-clamp-1 group-hover:text-[#9B1C1C] transition-colors">{hotel.name}</h3>
            <span className="shrink-0 rounded bg-[#1B1464]/10 dark:bg-indigo-900/50 px-1.5 py-0.5 text-xs font-bold text-[#1B1464] dark:text-amber-300">
              {hotel.starRating}★
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-600 dark:text-indigo-200/80">
            <FiMapPin size={12} className="text-[#9B1C1C]" /> {hotel.city}
            {hotel.landmark ? ` · ${hotel.landmark}` : ''}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <RatingStars rating={hotel.rating || 4.5} size={13} />
            <span className="text-[11px] text-slate-400 dark:text-indigo-300/60">({hotel.reviewsCount || 85})</span>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-slate-100 dark:border-indigo-900/40 pt-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-xl font-bold text-[#9B1C1C] dark:text-red-400">
                ₹{hotel.startingPrice.toLocaleString('en-IN')}
              </span>
              {originalPrice > hotel.startingPrice && (
                <span className="font-mono text-xs text-slate-400 line-through">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-indigo-300/60">/ night + taxes</span>
          </div>
          {hotel.policies?.breakfastIncluded ? (
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
              Breakfast Free
            </span>
          ) : (
            <span className="text-[11px] text-[#1B1464] dark:text-amber-300 font-medium">Free WiFi</span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default HotelCard;
