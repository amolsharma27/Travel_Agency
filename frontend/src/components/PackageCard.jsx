import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiMapPin, FiCalendar, FiCheck, FiSend } from 'react-icons/fi';
import { FaHotel, FaCar, FaWhatsapp } from 'react-icons/fa';
import StudentRegistrationModal from './StudentRegistrationModal.jsx';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=60';
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='100%25' height='100%25' fill='%231e293b'/%3E%3Cpath d='M360 210a40 40 0 1 0 80 0a40 40 0 1 0-80 0' fill='%23475569'/%3E%3Cpath d='M200 380l160-140l100 80l140-120l120 180z' fill='%23334155'/%3E%3Ctext x='50%25' y='85%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='20' font-weight='600'%3EPCTE Travel%3C/text%3E%3C/svg%3E";

const WHATSAPP_NUMBER = '919988110021';

const PackageCard = ({ pkg, wishlisted, onToggleWishlist, onRequestClick }) => {
  const [showModal, setShowModal] = useState(false);

  const hasHotel = pkg.inclusions?.some(inc => /hotel|stay|resort|cottage|camp|tent/i.test(inc)) ?? true;
  const hasMeals = pkg.inclusions?.some(inc => /breakfast|dinner|lunch|meal/i.test(inc)) ?? true;
  const hasTransfers = pkg.inclusions?.some(inc => /transfer|cab|volvo|coach|bus|suv/i.test(inc)) ?? true;

  const durationStr = `${pkg.durationNights || 1} Night / ${pkg.durationDays || 2} Days`;

  const prefilledMessage = encodeURIComponent(
    `Hello PCTE Travels, I am interested in the ${pkg.title} tour. Please provide me with more details.`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${prefilledMessage}`;

  const handleEnquiryClick = () => {
    if (onRequestClick) {
      onRequestClick(pkg);
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col h-full">
      
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

        {/* Category Badge */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 items-start z-10">
          <span className="rounded-lg bg-[#0F2942]/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm border border-slate-700">
            {pkg.tourType || pkg.category || 'Tour Package'}
          </span>
        </div>

        {onToggleWishlist && (
          <button
            onClick={() => onToggleWishlist(pkg._id)}
            aria-label="Save to wishlist"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition z-10"
          >
            <FiHeart size={14} className={wishlisted ? 'fill-red-500 text-red-500' : ''} />
          </button>
        )}

        {pkg.travelMode && (
          <div className="absolute bottom-2 right-2 rounded-lg bg-slate-900/85 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-semibold text-slate-200 border border-slate-700">
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
              <FiCalendar size={13} className="text-[#E11D48] shrink-0" /> {durationStr}
            </p>
          </div>

          <div className="mt-3 flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px] border-t border-slate-100 dark:border-slate-800 pt-2.5">
            {hasHotel && <span className="flex items-center gap-1 font-medium"><FaHotel className="text-slate-400" /> Stays</span>}
            {hasMeals && <span className="flex items-center gap-1 font-medium"><FiCheck className="text-emerald-500" /> Meals</span>}
            {hasTransfers && <span className="flex items-center gap-1 font-medium"><FaCar className="text-slate-400" /> Transfers</span>}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {/* Price status: 'On Request' */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Package Fare
            </span>
            <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-0.5 text-xs font-black tracking-wide border border-slate-200 dark:border-slate-700">
              On Request
            </span>
          </div>

          {/* Action Row: 'On Request' Button & WhatsApp 'Know More' */}
          <div className="grid grid-cols-2 gap-2">
            {/* 1. 'On Request' Button (Student Registration & Enquiry) */}
            <button
              onClick={handleEnquiryClick}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white py-2.5 px-3 text-xs font-black uppercase tracking-wider shadow transition-all hover:scale-[1.02] cursor-pointer"
            >
              <FiSend size={13} />
              <span>On Request</span>
            </button>

            {/* 2. WhatsApp 'Know More' CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-3 text-xs font-bold shadow transition-all hover:scale-[1.02]"
              title={`Enquire on WhatsApp about ${pkg.title}`}
            >
              <FaWhatsapp size={14} />
              <span>Know More</span>
            </a>
          </div>
        </div>
      </div>

      {/* Internal Student Registration Modal (if not handled by parent) */}
      <StudentRegistrationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        packageData={{
          title: pkg.title,
          destination: pkg.destination,
          duration: durationStr,
          price: 'On Request',
        }}
        requestType="On Request"
      />
    </div>
  );
};

export default PackageCard;
