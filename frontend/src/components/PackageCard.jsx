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

  const isMussoorie =
    pkg._id === 'pkg_mussoorie_01' ||
    pkg.slug === 'mussoorie-trip' ||
    pkg.slug === 'mussoorie-kempty-water-fall' ||
    pkg.title?.toLowerCase().includes('mussoorie');

  const hasHotel = pkg.inclusions?.some(inc => /hotel|stay|resort|cottage|camp|tent/i.test(inc)) ?? true;
  const hasMeals = pkg.inclusions?.some(inc => /breakfast|dinner|lunch|meal/i.test(inc)) ?? true;
  const hasTransfers = pkg.inclusions?.some(inc => /transfer|cab|volvo|coach|bus|suv|tempo/i.test(inc)) ?? true;

  const durationStr = isMussoorie
    ? '11 – 13 Sep (3 Days / 2 Nights)'
    : `${pkg.durationNights || 1} Night / ${pkg.durationDays || 2} Days`;

  const prefilledMessage = encodeURIComponent(
    isMussoorie
      ? 'Hello PCTE Travels, I am interested in the official Mussoorie Excursion (11-13 Sep). Please provide me with booking details.'
      : `Hello PCTE Travels, I am interested in the ${pkg.title} tour. Please provide me with more details.`
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
    <div className={`group overflow-hidden rounded-2xl border ${isMussoorie ? 'border-amber-400 dark:border-amber-500 shadow-md ring-1 ring-amber-400/50' : 'border-slate-200 dark:border-slate-800'} bg-white dark:bg-[#0F1D30] shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col h-full`}>

      {/* Thumbnail & Badges */}
      <div className="relative overflow-hidden h-52 bg-slate-900">
        <Link to={`/packages/${isMussoorie ? 'mussoorie-trip' : (pkg.slug || pkg._id)}`}>
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
          {isMussoorie ? (
            <span className="rounded-lg bg-[#E11D48] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow border border-red-400/40">
              ★ Official Excursion
            </span>
          ) : (
            <span className="rounded-lg bg-[#0F2942]/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm border border-slate-700">
              {pkg.tourType || pkg.category || 'Tour Package'}
            </span>
          )}
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

        <div className="absolute bottom-2 right-2 rounded-lg bg-slate-900/85 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-semibold text-slate-200 border border-slate-700">
          {isMussoorie ? 'Tempo Traveller' : (pkg.travelMode || 'Coach / Cabs')}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <Link to={`/packages/${isMussoorie ? 'mussoorie-trip' : (pkg.slug || pkg._id)}`}>
            <h3 className="font-display text-sm md:text-base font-bold leading-snug text-slate-900 dark:text-white group-hover:text-[#0F2942] dark:group-hover:text-amber-400 transition-colors line-clamp-2 min-h-[2.5rem]">
              {isMussoorie ? 'Mussoorie Trip (Official Excursion)' : pkg.title}
            </h3>
          </Link>

          <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
            <p className="flex items-center gap-1.5">
              <FiMapPin size={13} className="text-[#E11D48] shrink-0" /> {pkg.destination}
            </p>
            <p className="flex items-center gap-1.5">
              <FiCalendar size={13} className={isMussoorie ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-[#E11D48]'} /> {durationStr}
            </p>
          </div>

          <div className="mt-3 flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px] border-t border-slate-100 dark:border-slate-800 pt-2.5">
            {hasHotel && <span className="flex items-center gap-1 font-medium"><FaHotel className="text-slate-400" /> Stays</span>}
            {hasMeals && <span className="flex items-center gap-1 font-medium"><FiCheck className="text-emerald-500" /> Meals</span>}
            {hasTransfers && <span className="flex items-center gap-1 font-medium"><FaCar className="text-slate-400" /> Transfers</span>}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {/* Price status */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {isMussoorie ? 'Package Cost' : 'Package Fare'}
            </span>
            {isMussoorie ? (
              <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                INR 3,700 <span className="text-[10px] text-slate-400 font-normal">/ person</span>
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-0.5 text-xs font-black tracking-wide border border-slate-200 dark:border-slate-700">
                On Request
              </span>
            )}
          </div>

          {/* Action Row */}
          {isMussoorie ? (
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/packages/mussoorie-trip"
                className="inline-flex items-center justify-center gap-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 py-2.5 px-2 text-xs font-black uppercase tracking-wider shadow transition-all hover:scale-[1.02] text-center"
              >
                <span>View Details</span>
              </Link>
              <button
                onClick={handleEnquiryClick}
                className="inline-flex items-center justify-center gap-1 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white py-2.5 px-2 text-xs font-black uppercase tracking-wider shadow transition-all hover:scale-[1.02] cursor-pointer"
              >
                <FiSend size={12} />
                <span>Register</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleEnquiryClick}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white py-2.5 px-3 text-xs font-black uppercase tracking-wider shadow transition-all hover:scale-[1.02] cursor-pointer"
              >
                <FiSend size={13} />
                <span>On Request</span>
              </button>
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
          )}
        </div>
      </div>

      {/* Internal Student Registration Modal */}
      <StudentRegistrationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        packageData={{
          title: isMussoorie ? 'Mussoorie Trip' : pkg.title,
          destination: isMussoorie ? 'Mussoorie, Uttarakhand' : pkg.destination,
          duration: durationStr,
          price: isMussoorie ? 'INR 3,700 per person' : 'On Request',
        }}
        requestType={isMussoorie ? 'Booking Request' : 'On Request'}
      />
    </div>
  );
};

export default PackageCard;
