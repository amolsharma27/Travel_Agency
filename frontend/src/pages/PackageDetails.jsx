import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiMapPin, FiCalendar, FiCheck, FiX, FiCheckCircle, FiShield,
  FiArrowLeft, FiClock, FiUsers
} from 'react-icons/fi';
import { FaWhatsapp, FaSuitcase, FaHotel, FaCar } from 'react-icons/fa';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import RatingStars from '../components/RatingStars.jsx';
import CustomTourModal from '../components/CustomTourModal.jsx';
import { getStoredPackages } from '../data/mockData.js';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=70';

const PackageDetails = () => {
  const { idOrSlug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [showCustomModal, setShowCustomModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/packages/${idOrSlug}`);
        if (data?.data) {
          setPkg(data.data);
        } else {
          const localPkgs = getStoredPackages();
          const match = localPkgs.find(p => p._id === idOrSlug || p.slug === idOrSlug);
          setPkg(match || localPkgs[0]);
        }
      } catch {
        const localPkgs = getStoredPackages();
        const match = localPkgs.find(p => p._id === idOrSlug || p.slug === idOrSlug);
        setPkg(match || localPkgs[0]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [idOrSlug]);

  const handleBook = () => {
    if (!user) {
      toast.error('Please log in to book this tour package');
      navigate('/login');
      return;
    }
    navigate(`/packages/${pkg._id}/book`);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0F2942] border-r-transparent" />
        <p className="mt-3 text-xs text-slate-500">Loading tour details…</p>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-10 bg-white dark:bg-[#0F1D30] shadow-sm">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Package Not Found</h2>
          <p className="mt-2 text-xs text-slate-500">This tour might have been updated or moved.</p>
          <button
            onClick={() => navigate('/packages')}
            className="mt-6 rounded-md bg-[#0F2942] px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-[#E11D48]"
          >
            Browse All Tour Packages
          </button>
        </div>
      </div>
    );
  }

  const galleryImages = pkg.images && pkg.images.length > 0 
    ? pkg.images 
    : [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER, PLACEHOLDER];

  const discountPercent = pkg.discountPrice 
    ? Math.round(((pkg.price - pkg.discountPrice) / pkg.price) * 100) 
    : 0;

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1727] min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/packages')}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#0F2942]"
        >
          <FiArrowLeft /> Back to all packages
        </button>

        {/* Gallery Preview Viewer */}
        <div className="space-y-3">
          <div className="relative h-[340px] md:h-[440px] w-full overflow-hidden rounded-2xl shadow-md bg-slate-900">
            <img
              src={galleryImages[activePhoto] || galleryImages[0]}
              alt={pkg.title}
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER; }}
              className="h-full w-full object-cover transition duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
            
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="rounded bg-[#0F2942] px-2.5 py-0.5 text-[10px] font-black uppercase text-white shadow border border-slate-700">
                  {pkg.tourType || pkg.category}
                </span>
                {discountPercent > 0 && (
                  <span className="rounded bg-[#E11D48] px-2.5 py-0.5 text-[10px] font-bold text-white shadow">
                    {discountPercent}% OFF Special Rate
                  </span>
                )}
              </div>

              <h1 className="font-display text-2xl md:text-4xl font-black text-white leading-tight">
                {pkg.title}
              </h1>
            </div>
          </div>

          {/* Thumbnail Selector Strip */}
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActivePhoto(idx)}
                className={`h-16 w-24 md:h-20 md:w-32 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
                  activePhoto === idx
                    ? 'border-[#0F2942] dark:border-amber-400 scale-105 shadow-sm'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Details & Booking Layout */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          
          {/* Left Column: Itinerary, Inclusions, Overview */}
          <div className="space-y-8">
            
            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-4">
              <p className="flex items-center gap-1.5"><FiMapPin className="text-[#E11D48]" /> {pkg.destination}</p>
              <p className="flex items-center gap-1.5"><FiCalendar className="text-[#E11D48]" /> {pkg.durationDays} Days / {pkg.durationNights} Nights</p>
              <p className="flex items-center gap-1.5"><FaCar className="text-[#0F2942] dark:text-amber-400" /> Mode: <span className="font-semibold text-slate-900 dark:text-white">{pkg.travelMode}</span></p>
              <div className="flex items-center gap-1">
                <RatingStars rating={pkg.rating || 4.9} size={13} />
                <span className="text-slate-400 font-normal">({pkg.reviewsCount || 45} reviews)</span>
              </div>
            </div>

            {/* Overview */}
            <div className="rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-6 space-y-3 shadow-sm">
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Trip Overview</h2>
              <p className="leading-relaxed text-slate-600 dark:text-slate-300 text-xs md:text-sm">{pkg.description}</p>
            </div>

            {/* Key Highlights */}
            {pkg.facilities?.length > 0 && (
              <div className="rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-6 space-y-3 shadow-sm">
                <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">Key Package Highlights</h2>
                <div className="flex flex-wrap gap-2">
                  {pkg.facilities.map((f) => (
                    <span key={f} className="flex items-center gap-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <FiCheckCircle className="text-[#E11D48]" /> {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Day-wise Itinerary */}
            {pkg.itinerary?.length > 0 && (
              <div className="rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Day-wise Tour Itinerary</h2>
                <div className="space-y-3">
                  {pkg.itinerary.map((day) => (
                    <div key={day.day} className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-[#0F2942] text-xs font-black text-white font-mono shrink-0">
                          {day.day}
                        </span>
                        <h4 className="font-display text-xs md:text-sm font-bold text-slate-900 dark:text-white">Day {day.day}: {day.title}</h4>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300 pl-8.5">{day.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions / Exclusions */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/20 p-5 border border-emerald-500/20 space-y-3">
                <h3 className="font-display text-sm font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <FiCheck className="text-emerald-600" /> What's Included
                </h3>
                <ul className="space-y-2 text-xs">
                  {pkg.inclusions?.map((i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-800 dark:text-slate-200">
                      <FiCheck className="text-emerald-500 shrink-0 mt-0.5" /> <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-red-50/80 dark:bg-red-950/20 p-5 border border-red-500/20 space-y-3">
                <h3 className="font-display text-sm font-bold text-red-700 dark:text-red-300 flex items-center gap-1.5">
                  <FiX className="text-red-500" /> What's Excluded
                </h3>
                <ul className="space-y-2 text-xs">
                  {pkg.exclusions?.map((i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-800 dark:text-slate-200">
                      <FiX className="text-red-400 shrink-0 mt-0.5" /> <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Booking Drawer */}
          <div className="lg:sticky lg:top-24 h-fit rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Direct Operator Price</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                {pkg.discountPrice ? (
                  <>
                    <span className="font-mono text-3xl font-black text-slate-900 dark:text-white">₹{pkg.discountPrice.toLocaleString('en-IN')}</span>
                    <span className="font-mono text-sm text-slate-400 line-through">₹{pkg.price.toLocaleString('en-IN')}</span>
                  </>
                ) : (
                  <span className="font-mono text-3xl font-black text-slate-900 dark:text-white">₹{pkg.price.toLocaleString('en-IN')}</span>
                )}
                <span className="text-xs text-slate-500">/ person</span>
              </div>
            </div>

            {pkg.availableSeats && (
              <div className="flex items-center justify-between border-t border-b border-slate-100 dark:border-slate-800 py-2.5 text-xs">
                <span className="text-slate-500">Available Group Seats:</span>
                <span className="font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                  {pkg.availableSeats} seats left
                </span>
              </div>
            )}

            <button 
              onClick={handleBook} 
              className="w-full rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white py-3 text-xs font-black uppercase tracking-wider shadow transition-all duration-200"
            >
              Book Now
            </button>

            <button
              onClick={() => setShowCustomModal(true)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Request Custom Changes
            </button>

            <a
              href={`https://wa.me/919814519578?text=Hi%20PCTE%20Travel%20Agency%2C%20I%20want%20to%20book%20${encodeURIComponent(pkg.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white shadow transition-colors"
            >
              <FaWhatsapp size={15} /> WhatsApp Booking Support
            </a>


            {pkg.meetingPoint && (
              <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Meeting / Boarding Point:</span>
                {pkg.meetingPoint}
              </div>
            )}
          </div>

        </div>

      </div>

      <CustomTourModal isOpen={showCustomModal} onClose={() => setShowCustomModal(false)} />
    </div>
  );
};

export default PackageDetails;
