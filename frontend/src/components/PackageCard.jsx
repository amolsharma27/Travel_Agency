import { Link } from 'react-router-dom';
import { FiHeart, FiMapPin, FiCalendar, FiCoffee, FiCompass } from 'react-icons/fi';
import { FaHotel, FaCar } from 'react-icons/fa';
import RatingStars from './RatingStars.jsx';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=60';

const PackageCard = ({ pkg, wishlisted, onToggleWishlist }) => {
  const hasHotel = pkg.inclusions?.some(inc => /hotel|stay|resort/i.test(inc)) || true;
  const hasMeals = pkg.inclusions?.some(inc => /breakfast|dinner|lunch|meal/i.test(inc));
  const hasTransfers = pkg.inclusions?.some(inc => /transfer|cab|volvo|bus|ferry|flight/i.test(inc));

  const discountPercent = pkg.discountPrice 
    ? Math.round(((pkg.price - pkg.discountPrice) / pkg.price) * 100) 
    : 0;

  return (
    <div className="group overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition duration-300 flex flex-col h-full">
      
      {/* Thumbnail & Badges */}
      <div className="relative overflow-hidden h-52 bg-slate-900">
        <Link to={`/packages/${pkg.slug || pkg._id}`}>
          <img
            src={pkg.images?.[0] || PLACEHOLDER}
            alt={pkg.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PLACEHOLDER;
            }}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Cliffseas Style Orange Category Badge */}
        <div className="absolute left-3 top-3 flex flex-col gap-1 items-start z-10">
          <span className="rounded bg-[#e0882e] px-2.5 py-1 text-[11px] font-extrabold uppercase text-white shadow-md">
            {pkg.category}
          </span>
          {discountPercent > 0 && (
            <span className="rounded bg-red-600 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        <button
          onClick={() => onToggleWishlist?.(pkg._id)}
          aria-label="Save to wishlist"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/60 text-white hover:bg-slate-950 transition z-10"
        >
          <FiHeart size={15} className={wishlisted ? 'fill-red-500 text-red-500' : ''} />
        </button>

        <div className="absolute bottom-2 right-2 rounded bg-slate-950/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-amber-300">
          By {pkg.travelMode}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <Link to={`/packages/${pkg.slug || pkg._id}`}>
            <h3 className="font-display text-base font-bold leading-snug text-slate-900 dark:text-white group-hover:text-[#e0882e] transition duration-150 line-clamp-2 min-h-[2.5rem]">
              {pkg.title}
            </h3>
          </Link>
          
          <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <p className="flex items-center gap-1.5 font-medium">
              <FiMapPin size={13} className="text-[#e0882e] shrink-0" /> {pkg.destination}
            </p>
            <p className="flex items-center gap-1.5 font-medium">
              <FiCalendar size={13} className="text-[#e0882e] shrink-0" /> {pkg.durationDays} Days / {pkg.durationNights} Nights
            </p>
          </div>

          <div className="mt-3 flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px] border-t border-slate-100 dark:border-slate-800 pt-2.5">
            {hasHotel && <span className="flex items-center gap-1 font-semibold"><FaHotel className="text-[#e0882e]" /> Stay</span>}
            {hasMeals && <span className="flex items-center gap-1 font-semibold"><FiCoffee className="text-[#e0882e]" /> Meals</span>}
            {hasTransfers && <span className="flex items-center gap-1 font-semibold"><FaCar className="text-[#e0882e]" /> Transfers</span>}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <RatingStars rating={pkg.rating || 4.9} size={12} />
              <span className="text-[11px] font-bold text-slate-500">({pkg.reviewsCount || 45})</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
              {pkg.availableSeats} seats left
            </span>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div>
              <p className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Starting Price</p>
              <div className="flex items-baseline gap-1">
                {pkg.discountPrice ? (
                  <>
                    <span className="font-mono text-lg font-black text-[#e0882e]">₹{pkg.discountPrice.toLocaleString('en-IN')}</span>
                    <span className="font-mono text-xs text-slate-400 line-through">₹{pkg.price.toLocaleString('en-IN')}</span>
                  </>
                ) : (
                  <span className="font-mono text-lg font-black text-[#e0882e]">₹{pkg.price.toLocaleString('en-IN')}</span>
                )}
              </div>
            </div>

            {/* Cliffseas Style View Details Button */}
            <Link
              to={`/packages/${pkg.slug || pkg._id}`}
              className="rounded-md bg-[#e0882e] hover:bg-white text-white hover:text-[#e0882e] border border-[#e0882e] px-3.5 py-1.5 text-xs font-bold shadow-sm transition-all duration-200"
            >
              View Details »
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
