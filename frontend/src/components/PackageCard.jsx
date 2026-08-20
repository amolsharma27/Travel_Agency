import { Link } from 'react-router-dom';
import { FiHeart, FiMapPin, FiCalendar, FiCheck } from 'react-icons/fi';
import { FaHotel, FaCar } from 'react-icons/fa';
import RatingStars from './RatingStars.jsx';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=60';
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='100%25' height='100%25' fill='%231e293b'/%3E%3Cpath d='M360 210a40 40 0 1 0 80 0a40 40 0 1 0-80 0' fill='%23475569'/%3E%3Cpath d='M200 380l160-140l100 80l140-120l120 180z' fill='%23334155'/%3E%3Ctext x='50%25' y='85%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='20' font-weight='600'%3EPCTE Travel%3C/text%3E%3C/svg%3E";

const PackageCard = ({ pkg, wishlisted, onToggleWishlist }) => {
  const hasHotel = pkg.inclusions?.some(inc => /hotel|stay|resort|cottage|camp|tent/i.test(inc)) || true;
  const hasMeals = pkg.inclusions?.some(inc => /breakfast|dinner|lunch|meal/i.test(inc)) || true;
  const hasTransfers = pkg.inclusions?.some(inc => /transfer|cab|volvo|coach|bus|suv/i.test(inc)) || true;

  const discountPercent = pkg.discountPrice 
    ? Math.round(((pkg.price - pkg.discountPrice) / pkg.price) * 100) 
    : 0;

  return (
    <div className="group overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col h-full">
      
      {/* Thumbnail & Badges */}
      <div className="relative overflow-hidden h-52 bg-slate-900">
        <Link to={`/packages/${pkg.slug || pkg._id}`}>
          <img
            src={pkg.images?.[0] || PLACEHOLDER}
            alt={pkg.title}
            onError={(e) => {
              if (e.currentTarget.dataset.fallbackApplied) return;
              e.currentTarget.dataset.fallbackApplied = 'true';
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Clean Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 items-start z-10">
          <span className="rounded bg-[#0F2942] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm border border-slate-700">
            {pkg.tourType || pkg.category}
          </span>
          {discountPercent > 0 && (
            <span className="rounded bg-[#E11D48] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        <button
          onClick={() => onToggleWishlist?.(pkg._id)}
          aria-label="Save to wishlist"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition z-10"
        >
          <FiHeart size={14} className={wishlisted ? 'fill-red-500 text-red-500' : ''} />
        </button>

        {pkg.travelMode && (
          <div className="absolute bottom-2 right-2 rounded bg-slate-900/85 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-semibold text-slate-200 border border-slate-700">
            {pkg.travelMode}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <Link to={`/packages/${pkg.slug || pkg._id}`}>
            <h3 className="font-display text-sm md:text-base font-bold leading-snug text-slate-900 dark:text-white group-hover:text-[#0F2942] dark:group-hover:text-amber-400 transition-colors line-clamp-2 min-h-[2.5rem]">
              {pkg.title}
            </h3>
          </Link>
          
          <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
            <p className="flex items-center gap-1.5">
              <FiMapPin size={13} className="text-[#E11D48] shrink-0" /> {pkg.destination}
            </p>
            <p className="flex items-center gap-1.5">
              <FiCalendar size={13} className="text-[#E11D48] shrink-0" /> {pkg.durationDays} Days / {pkg.durationNights} Nights
            </p>
          </div>

          <div className="mt-3 flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px] border-t border-slate-100 dark:border-slate-800 pt-2.5">
            {hasHotel && <span className="flex items-center gap-1 font-medium"><FaHotel className="text-slate-400" /> Stays</span>}
            {hasMeals && <span className="flex items-center gap-1 font-medium"><FiCheck className="text-emerald-500" /> Meals</span>}
            {hasTransfers && <span className="flex items-center gap-1 font-medium"><FaCar className="text-slate-400" /> Transfers</span>}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <RatingStars rating={pkg.rating || 4.9} size={12} />
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">({pkg.reviewsCount || 45})</span>
            </div>
            {pkg.availableSeats && (
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/40">
                {pkg.availableSeats} seats left
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <div>
              <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Starting from</p>
              <div className="flex items-baseline gap-1.5">
                {pkg.discountPrice ? (
                  <>
                    <span className="font-mono text-lg font-black text-slate-900 dark:text-white">₹{pkg.discountPrice.toLocaleString('en-IN')}</span>
                    <span className="font-mono text-xs text-slate-400 line-through">₹{pkg.price.toLocaleString('en-IN')}</span>
                  </>
                ) : (
                  <span className="font-mono text-lg font-black text-slate-900 dark:text-white">₹{pkg.price.toLocaleString('en-IN')}</span>
                )}
                <span className="text-[10px] text-slate-400">/ person</span>
              </div>
            </div>

            <Link
              to={`/packages/${pkg.slug || pkg._id}`}
              className="rounded-md bg-[#0F2942] hover:bg-[#E11D48] text-white px-3 py-1.5 text-xs font-bold shadow-sm transition-all duration-150"
            >
              View Tour &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
