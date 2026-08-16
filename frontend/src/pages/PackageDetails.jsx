import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMapPin, FiCalendar, FiCheck, FiX, FiCheckCircle, FiShield, FiGlobe, FiPhoneCall } from 'react-icons/fi';
import { FaMountain, FaWhatsapp } from 'react-icons/fa';
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
      toast.error('Please log in to book this package');
      navigate('/login');
      return;
    }
    navigate(`/packages/${pkg._id}/book`);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#9B1C1C] border-r-transparent" />
        <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">Loading tour details…</p>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-10 bg-white dark:bg-slate-900 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Package Not Found</h2>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">This package might have been updated or moved.</p>
          <button
            onClick={() => navigate('/packages')}
            className="mt-6 rounded-md bg-[#9B1C1C] px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-[#1B1464]"
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
    <div className="bg-[#FAFAF9] dark:bg-[#0B0830] min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        
        {/* Gallery Preview Viewer */}
        <div className="space-y-3">
          <div className="relative h-[380px] md:h-[460px] w-full overflow-hidden rounded-xl shadow-xl border border-slate-200 dark:border-indigo-900/60 group">
            <img
              src={galleryImages[activePhoto] || galleryImages[0]}
              alt={pkg.title}
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER; }}
              className="h-full w-full object-cover transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0830]/80 via-transparent to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="rounded bg-[#9B1C1C] px-2.5 py-1 text-[10px] font-black uppercase text-white shadow">
                {pkg.category}
              </span>
              <h1 className="mt-2 font-display text-2xl font-black md:text-4xl text-white">
                {pkg.title}
              </h1>
            </div>
          </div>

          {/* Thumbnail Selector Strip */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActivePhoto(idx)}
                className={`h-20 w-32 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                  activePhoto === idx
                    ? 'border-[#9B1C1C] scale-105 shadow-md'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="rounded bg-[#9B1C1C]/10 px-3 py-1 text-xs font-bold text-[#9B1C1C] dark:text-red-400 border border-[#9B1C1C]/20 uppercase tracking-wider">
                {pkg.category}
              </span>
              {discountPercent > 0 && (
                <span className="rounded bg-[#1B1464] px-3 py-1 text-xs font-bold text-white uppercase tracking-wider border border-indigo-400/30">
                  {discountPercent}% OFF Special Deal
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-bold text-slate-700 dark:text-indigo-200 border-b border-slate-200 dark:border-indigo-900/40 pb-4">
              <p className="flex items-center gap-1.5"><FiMapPin className="text-[#9B1C1C]" /> {pkg.destination}</p>
              <p className="flex items-center gap-1.5"><FiCalendar className="text-[#9B1C1C]" /> {pkg.durationDays} Days / {pkg.durationNights} Nights</p>
              <p className="flex items-center gap-1.5">Mode: <span className="text-[#9B1C1C] dark:text-red-400">{pkg.travelMode}</span></p>
              <div className="flex items-center gap-1">
                <RatingStars rating={pkg.rating || 4.9} />
                <span className="text-slate-400 font-normal">({pkg.reviewsCount || 45} reviews)</span>
              </div>
            </div>

            {/* Overview */}
            <div className="mt-6 space-y-2">
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Trip Overview</h2>
              <p className="leading-relaxed text-slate-700 dark:text-indigo-200/80 whitespace-pre-line text-xs md:text-sm">{pkg.description}</p>
            </div>

            {/* Key Highlights */}
            {pkg.facilities?.length > 0 && (
              <div className="mt-8 space-y-3">
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Key Highlights</h2>
                <div className="flex flex-wrap gap-2">
                  {pkg.facilities.map((f) => (
                    <span key={f} className="flex items-center gap-1.5 rounded-md bg-white dark:bg-[#110D44] border border-slate-200 dark:border-indigo-900/60 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-indigo-200">
                      <FiCheckCircle className="text-[#9B1C1C]" /> {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Day-wise Itinerary */}
            {pkg.itinerary?.length > 0 && (
              <div className="mt-8 space-y-4">
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Detailed Day-wise Itinerary</h2>
                <div className="space-y-3">
                  {pkg.itinerary.map((day) => (
                    <div key={day.day} className="rounded-xl border border-slate-200 dark:border-indigo-900/60 bg-white dark:bg-[#110D44] p-4 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-[#9B1C1C] text-xs font-black text-white font-mono shrink-0">
                          {day.day}
                        </span>
                        <p className="font-display text-sm font-bold text-slate-900 dark:text-white">Day {day.day}: {day.title}</p>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-indigo-200/80 pl-8">{day.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions / Exclusions */}
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 p-5 border border-emerald-500/20 space-y-3">
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
              <div className="rounded-xl bg-red-50 dark:bg-red-950/20 p-5 border border-red-500/20 space-y-3">
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

          {/* Sticky Booking Drawer */}
          <div className="lg:sticky lg:top-24 h-fit rounded-xl border border-slate-200 dark:border-indigo-900/60 bg-white dark:bg-[#110D44] p-6 shadow-2xl space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B1C1C] dark:text-red-400">Direct PCTE Price</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                {pkg.discountPrice ? (
                  <>
                    <span className="font-mono text-3xl font-black text-[#9B1C1C] dark:text-red-400">₹{pkg.discountPrice.toLocaleString('en-IN')}</span>
                    <span className="font-mono text-sm text-slate-400 line-through">₹{pkg.price.toLocaleString('en-IN')}</span>
                  </>
                ) : (
                  <span className="font-mono text-3xl font-black text-[#9B1C1C] dark:text-red-400">₹{pkg.price.toLocaleString('en-IN')}</span>
                )}
                <span className="text-xs text-slate-500 dark:text-indigo-300/60">/ person</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-b border-slate-100 dark:border-indigo-900/40 py-2.5 text-xs">
              <span className="font-medium text-slate-600 dark:text-indigo-200/80">Available Seats:</span>
              <span className="font-bold text-red-600 bg-red-50 dark:bg-red-950/40 px-2.5 py-0.5 rounded">
                {pkg.availableSeats} seats left
              </span>
            </div>

            <button 
              onClick={handleBook} 
              className="w-full rounded-md bg-[#9B1C1C] hover:bg-[#1B1464] text-white py-3.5 text-xs font-black uppercase tracking-wider shadow-lg transition-all duration-300"
            >
              Book Now
            </button>

            <button
              onClick={() => setShowCustomModal(true)}
              className="w-full rounded-md border border-slate-300 dark:border-indigo-800 py-3 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-indigo-900/60 transition-colors"
            >
              Request Custom Changes
            </button>

            <a
              href={`https://wa.me/919996696928?text=Hi%20PCTE%20Travels%2C%20I%20want%20to%20book%20${encodeURIComponent(pkg.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-md bg-emerald-600 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-500 transition-colors"
            >
              <FaWhatsapp size={16} /> WhatsApp Booking Support
            </a>

            {pkg.meetingPoint && (
              <div className="text-xs text-slate-600 dark:text-indigo-200/80 bg-slate-50 dark:bg-indigo-950/60 p-3 rounded-lg border border-slate-200 dark:border-indigo-800">
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Meeting / Departure Point:</span>
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
