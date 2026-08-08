import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMapPin, FiCalendar, FiCheck, FiX, FiCheckCircle } from 'react-icons/fi';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import RatingStars from '../components/RatingStars.jsx';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=70';

const PackageDetails = () => {
  const { idOrSlug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/packages/${idOrSlug}`);
        const packageData = data?.data;
        setPkg(packageData);
        try {
          const reviewsRes = await api.get('/reviews', { params: { targetType: 'package', targetId: packageData?._id } });
          setReviews(reviewsRes.data?.data || []);
        } catch {
          // ignore review load error
        }
      } catch {
        toast.error('Could not load this package');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [idOrSlug]);

  const handleBook = () => {
    if (!user) {
      toast.error('Please log in to book this package');
      navigate('/login');
      return;
    }
    navigate(`/packages/${pkg._id}/book`);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-lagoon-500 border-r-transparent" />
        <p className="mt-3 text-sm text-ink/60 dark:text-paper/60">Loading package details…</p>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <div className="rounded-2xl border border-dashed border-ink/15 dark:border-paper/20 p-10 bg-white dark:bg-ink-light shadow-sm">
          <h2 className="font-display text-2xl font-bold text-ink dark:text-paper">Package Not Found</h2>
          <p className="mt-2 text-sm text-ink/60 dark:text-paper/60">This package might have been updated or moved.</p>
          <button
            onClick={() => navigate('/packages')}
            className="mt-6 rounded-xl bg-lagoon-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-lagoon-600 shadow"
          >
            Browse Tour Packages
          </button>
        </div>
      </div>
    );
  }

  // Ensure we have a list of images to render (if empty, pad with placeholder)
  const galleryImages = pkg.images && pkg.images.length > 0 
    ? pkg.images 
    : [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER, PLACEHOLDER, PLACEHOLDER];

  // Calculate discount percentage
  const discountPercent = pkg.discountPrice 
    ? Math.round(((pkg.price - pkg.discountPrice) / pkg.price) * 100) 
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      {/* Gallery Block */}
      <div className="grid gap-2 overflow-hidden rounded-xl2 md:h-[400px] md:grid-cols-4 md:grid-rows-2 shadow-sm bg-paper-dim/35">
        <div className="h-64 w-full md:col-span-2 md:row-span-2 md:h-full relative overflow-hidden group">
          <img 
            src={galleryImages[0]} 
            alt={pkg.title} 
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER; }}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-102" 
          />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="hidden h-full w-full md:block relative overflow-hidden group">
            <img
              src={galleryImages[i] || galleryImages[0]}
              alt=""
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER; }}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          {/* Main Info Header */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-lagoon-50 dark:bg-lagoon-700/30 px-3 py-1 text-xs font-semibold text-lagoon-700 dark:text-lagoon-300 uppercase tracking-wider">
              {pkg.category}
            </span>
            {pkg.rating >= 4.8 && (
              <span className="rounded-full bg-sand-500 px-3 py-1 text-xs font-bold text-ink uppercase tracking-wider">
                Best Seller
              </span>
            )}
            {discountPercent > 0 && (
              <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                {discountPercent}% Off Special Deal
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl font-bold leading-tight text-ink dark:text-paper md:text-4xl">
            {pkg.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-ink/70 dark:text-paper/70 border-b border-ink/5 dark:border-paper/5 pb-5">
            <p className="flex items-center gap-1.5 font-medium"><FiMapPin className="text-lagoon-500" /> {pkg.destination}</p>
            <p className="flex items-center gap-1.5 font-medium"><FiCalendar className="text-lagoon-500" /> {pkg.durationDays} Days / {pkg.durationNights} Nights</p>
            <p className="flex items-center gap-1.5 font-medium">Mode: <span className="text-lagoon-600 dark:text-lagoon-300 font-semibold">{pkg.travelMode}</span></p>
            <div className="flex items-center gap-1.5">
              <RatingStars rating={pkg.rating} />
              <span className="text-xs text-ink/40 dark:text-paper/40">({pkg.reviewsCount} reviews)</span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="font-display text-xl font-bold text-ink dark:text-paper mb-3">Overview</h2>
            <p className="leading-relaxed text-ink/80 dark:text-paper/80 whitespace-pre-line">{pkg.description}</p>
          </div>

          {/* Facilities */}
          {pkg.facilities?.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-xl font-bold text-ink dark:text-paper mb-3 font-semibold">Key Highlights & Facilities</h2>
              <div className="flex flex-wrap gap-2">
                {pkg.facilities.map((f) => (
                  <span key={f} className="flex items-center gap-1.5 rounded-full bg-paper-dim dark:bg-ink-light px-4 py-1.5 text-xs font-medium text-ink/80 dark:text-paper/85">
                    <FiCheckCircle className="text-lagoon-500" /> {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Itinerary */}
          {pkg.itinerary?.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-xl font-bold text-ink dark:text-paper mb-4">Detailed Day-wise Itinerary</h2>
              <div className="space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-ink/5 dark:before:bg-paper/5">
                {pkg.itinerary.map((day) => (
                  <div key={day.day} className="relative pl-12">
                    {/* Circle Node */}
                    <div className="absolute left-3.5 top-1.5 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-lagoon-500 text-[10px] font-bold text-paper font-mono ring-4 ring-white dark:ring-ink">
                      {day.day}
                    </div>
                    <div className="rounded-xl2 border border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light p-5 shadow-sm hover:shadow transition">
                      <p className="font-display text-base font-bold text-ink dark:text-paper">Day {day.day}: {day.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-ink/60 dark:text-paper/60">{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inclusions / Exclusions */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl2 bg-lagoon-50/40 dark:bg-lagoon-700/5 p-6 border border-lagoon-500/10">
              <h2 className="font-display text-lg font-bold text-lagoon-700 dark:text-lagoon-300 mb-4 flex items-center gap-1.5">
                What's Included
              </h2>
              <ul className="space-y-3 text-sm">
                {pkg.inclusions?.map((i) => (
                  <li key={i} className="flex items-start gap-2.5 leading-tight text-ink/80 dark:text-paper/85">
                    <FiCheck className="text-lagoon-500 shrink-0 mt-0.5" size={16} /> <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl2 bg-red-50/20 dark:bg-red-950/5 p-6 border border-red-500/10">
              <h2 className="font-display text-lg font-bold text-red-500 mb-4 flex items-center gap-1.5">
                What's Excluded
              </h2>
              <ul className="space-y-3 text-sm">
                {pkg.exclusions?.map((i) => (
                  <li key={i} className="flex items-start gap-2.5 leading-tight text-ink/80 dark:text-paper/85">
                    <FiX className="text-red-400 shrink-0 mt-0.5" size={16} /> <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-12">
            <h2 className="font-display text-xl font-bold text-ink dark:text-paper mb-5">Traveller Reviews</h2>
            {reviews.length === 0 ? (
              <div className="rounded-xl2 border border-dashed border-ink/10 dark:border-paper/20 p-8 text-center text-sm text-ink/50 dark:text-paper/50 bg-paper-dim/10">
                No reviews yet for this tour.
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r._id} className="rounded-xl2 border border-ink/5 dark:border-paper/10 p-5 bg-white dark:bg-ink-light shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-ink dark:text-paper">{r.user?.name}</span>
                        <p className="text-[10px] text-ink/40 dark:text-paper/40 font-mono mt-0.5">Verified Traveller</p>
                      </div>
                      <RatingStars rating={r.rating} showValue={false} size={12} />
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-ink/70 dark:text-paper/70 italic">&ldquo;{r.comment}&rdquo;</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky Booking Widget */}
        <div className="lg:sticky lg:top-24 h-fit rounded-xl2 border border-ink/10 dark:border-paper/15 bg-white dark:bg-ink-light p-6 shadow-pop">
          <p className="text-xs font-semibold text-ink/40 dark:text-paper/40 uppercase tracking-wider">Best Deal Price</p>
          
          <div className="flex items-baseline gap-2 mt-1">
            {pkg.discountPrice ? (
              <>
                <span className="font-mono text-3xl font-extrabold text-ink dark:text-paper">₹{pkg.discountPrice.toLocaleString('en-IN')}</span>
                <span className="font-mono text-sm text-ink/40 line-through dark:text-paper/40">₹{pkg.price.toLocaleString('en-IN')}</span>
              </>
            ) : (
              <span className="font-mono text-3xl font-extrabold text-ink dark:text-paper">₹{pkg.price.toLocaleString('en-IN')}</span>
            )}
            <span className="text-xs text-ink/50 dark:text-paper/50">/ person</span>
          </div>

          {pkg.discountPrice && (
            <p className="text-xs text-green-600 font-semibold mt-1">
              You save ₹{(pkg.price - pkg.discountPrice).toLocaleString('en-IN')}!
            </p>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-b border-ink/5 dark:border-paper/5 py-3">
            <span className="text-xs font-medium text-ink/60 dark:text-paper/60">Seats Remaining:</span>
            <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/20 px-2.5 py-1 rounded">
              {pkg.availableSeats} seats left
            </span>
          </div>

          <button 
            onClick={handleBook} 
            className="mt-6 w-full rounded-lg bg-lagoon-500 py-3 text-sm font-semibold text-paper shadow-md hover:bg-lagoon-600 active:scale-98 transition duration-150"
          >
            Book This Package
          </button>

          {pkg.meetingPoint && (
            <div className="mt-4 text-xs text-ink/50 dark:text-paper/50 bg-paper-dim/40 dark:bg-ink-light/40 p-3 rounded-lg border border-ink/5">
              <span className="font-bold text-ink dark:text-paper block mb-0.5">Meeting Point:</span>
              {pkg.meetingPoint}
            </div>
          )}

          <div className="mt-4 text-[10px] text-center text-ink/40 dark:text-paper/40">
            * Instant confirmation after payment. Free cancellation up to 7 days before departure.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
