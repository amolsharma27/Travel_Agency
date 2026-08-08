import { Link } from 'react-router-dom';
import { FiHeart, FiMapPin, FiCalendar, FiCoffee, FiCompass } from 'react-icons/fi';
import { FaHotel, FaCar } from 'react-icons/fa';
import RatingStars from './RatingStars.jsx';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=60';

const PackageCard = ({ pkg, wishlisted, onToggleWishlist }) => {
  // Parse inclusions to show icons
  const hasHotel = pkg.inclusions?.some(inc => /hotel|stay|resort/i.test(inc)) || true; // default true for package tours
  const hasMeals = pkg.inclusions?.some(inc => /breakfast|dinner|lunch|meal/i.test(inc));
  const hasTransfers = pkg.inclusions?.some(inc => /transfer|cab|volvo|bus|ferry|flight/i.test(inc));
  const hasSightseeing = pkg.inclusions?.some(inc => /sightseeing|tour|cruise|entry/i.test(inc));

  // Calculate discount percentage
  const discountPercent = pkg.discountPrice 
    ? Math.round(((pkg.price - pkg.discountPrice) / pkg.price) * 100) 
    : 0;

  return (
    <div className="group overflow-hidden rounded-xl2 border border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-pop flex flex-col h-full">
      <div className="relative overflow-hidden">
        <Link to={`/packages/${pkg.slug || pkg._id}`}>
          <img
            src={pkg.images?.[0] || PLACEHOLDER}
            alt={pkg.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PLACEHOLDER;
            }}
            className="h-52 w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </Link>
        <button
          onClick={() => onToggleWishlist?.(pkg._id)}
          aria-label="Save to wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full glass text-ink dark:text-paper shadow-sm hover:scale-110 active:scale-95 transition"
        >
          <FiHeart size={16} className={wishlisted ? 'fill-red-500 text-red-500' : ''} />
        </button>
        
        {/* Dynamic badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 items-start">
          <span className="rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase text-paper">
            {pkg.category}
          </span>
          {pkg.rating >= 4.8 && (
            <span className="rounded-full bg-sand-500 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-ink shadow-sm">
              Best Seller
            </span>
          )}
          {discountPercent > 0 && (
            <span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-white shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Travel Mode Badge */}
        <div className="absolute bottom-3 right-3 rounded bg-white/95 dark:bg-ink-light/95 px-2 py-0.5 text-[10px] font-medium text-ink dark:text-paper">
          By {pkg.travelMode}
        </div>
      </div>

      <div className="relative mx-4 mt-0 ticket-perforation ticket-dashes" />

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/packages/${pkg.slug || pkg._id}`}>
            <h3 className="font-display text-base font-semibold leading-snug text-ink dark:text-paper group-hover:text-lagoon-600 dark:group-hover:text-lagoon-300 transition duration-150 line-clamp-2 min-h-[2.5rem]">
              {pkg.title}
            </h3>
          </Link>
          <p className="mt-1.5 flex items-center gap-1 text-xs text-ink/60 dark:text-paper/60">
            <FiMapPin size={12} className="text-lagoon-500" /> {pkg.destination}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-ink/60 dark:text-paper/60">
            <FiCalendar size={12} className="text-lagoon-500" /> {pkg.durationDays} Days / {pkg.durationNights} Nights
          </p>

          {/* Inclusion Icons Grid */}
          <div className="mt-3.5 flex gap-3 text-ink/40 dark:text-paper/40 border-b border-ink/5 dark:border-paper/5 pb-3">
            {hasHotel && (
              <span className="flex items-center gap-1 text-[11px]" title="Hotel Stay Included">
                <FaHotel size={11} className="text-lagoon-500/70" /> Stay
              </span>
            )}
            {hasMeals && (
              <span className="flex items-center gap-1 text-[11px]" title="Meals Included">
                <FiCoffee size={12} className="text-lagoon-500/70" /> Meals
              </span>
            )}
            {hasTransfers && (
              <span className="flex items-center gap-1 text-[11px]" title="Transfers Included">
                <FaCar size={11} className="text-lagoon-500/70" /> Transfers
              </span>
            )}
            {hasSightseeing && (
              <span className="flex items-center gap-1 text-[11px]" title="Sightseeing Tours Included">
                <FiCompass size={12} className="text-lagoon-500/70" /> Tours
              </span>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <RatingStars rating={pkg.rating || 0} size={13} />
            <span className="text-[11px] text-ink/40 dark:text-paper/40">({pkg.reviewsCount})</span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] text-ink/40 dark:text-paper/40 uppercase tracking-wider font-semibold">Starting from</p>
              <div className="flex items-baseline gap-1.5">
                {pkg.discountPrice ? (
                  <>
                    <span className="font-mono text-xl font-bold text-ink dark:text-paper">₹{pkg.discountPrice.toLocaleString('en-IN')}</span>
                    <span className="font-mono text-xs text-ink/40 line-through dark:text-paper/40">₹{pkg.price.toLocaleString('en-IN')}</span>
                  </>
                ) : (
                  <span className="font-mono text-xl font-bold text-ink dark:text-paper">₹{pkg.price.toLocaleString('en-IN')}</span>
                )}
                <span className="text-[10px] text-ink/50 dark:text-paper/50 font-medium">/ person</span>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-lagoon-600 dark:text-lagoon-300 bg-lagoon-50 dark:bg-lagoon-700/20 px-2 py-0.5 rounded">
              {pkg.availableSeats} seats left
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
