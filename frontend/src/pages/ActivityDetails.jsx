import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiClock, FiMapPin, FiCheckCircle, FiShield, FiAlertTriangle,
  FiCalendar, FiUsers, FiCreditCard, FiArrowLeft
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import RatingStars from '../components/RatingStars.jsx';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getStoredActivities } from '../data/mockData.js';

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='100%25' height='100%25' fill='%231e293b'/%3E%3Cpath d='M360 210a40 40 0 1 0 80 0a40 40 0 1 0-80 0' fill='%23475569'/%3E%3Cpath d='M200 380l160-140l100 80l140-120l120 180z' fill='%23334155'/%3E%3Ctext x='50%25' y='85%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='20' font-weight='600'%3EPCTE Travel%3C/text%3E%3C/svg%3E";

const ActivityDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [activityDate, setActivityDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [participants, setParticipants] = useState(1);
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/activities/${id}`);
        if (data?.data) {
          setActivity(data.data);
          setSelectedSlot(data.data.slots?.[0] || '');
        } else {
          const acts = getStoredActivities();
          const match = acts.find(a => a._id === id) || acts[0];
          setActivity(match);
          setSelectedSlot(match.slots?.[0] || '');
        }
      } catch {
        const acts = getStoredActivities();
        const match = acts.find(a => a._id === id) || acts[0];
        setActivity(match);
        setSelectedSlot(match.slots?.[0] || '');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleBookActivity = async (e) => {
    e.preventDefault();
    if (!activityDate) {
      toast.error('Please select an activity date');
      return;
    }
    if (!user) {
      toast.error('Please sign in to book this adventure activity');
      navigate(`/login?redirect=/activities/${activity._id}`);
      return;
    }


    setBookingSubmitting(true);
    try {
      const perHead = activity.discountPrice || activity.price;
      const total = perHead * participants;

      const payload = {
        bookingType: 'activity',
        activityId: activity._id,
        itemTitle: activity.title,
        destination: activity.location,
        activityDate,
        slotTime: selectedSlot,
        guestsCount: participants,
        totalAmount: total,
        primaryGuest: {
          name: contactName || user.name,
          phone: contactPhone || user.phone,
          email: contactEmail || user.email,
        },
        status: 'confirmed',
        paymentStatus: 'paid'
      };

      const res = await api.post('/bookings', payload);
      toast.success('Activity booked successfully!');
      navigate(`/booking-confirmation?type=activity&id=${res.data?.data?._id || 'act_bk'}`);
    } catch {
      toast.error('Could not complete activity booking');
    } finally {
      setBookingSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0F2942] border-r-transparent" />
        <p className="mt-3 text-xs text-slate-500">Loading activity details…</p>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <h2 className="font-display text-2xl font-bold">Activity Not Found</h2>
        <button
          onClick={() => navigate('/activities')}
          className="mt-4 rounded-md bg-[#0F2942] px-6 py-2 text-xs font-bold text-white"
        >
          Browse All Activities
        </button>
      </div>
    );
  }

  const perPersonPrice = activity.discountPrice || activity.price;
  const totalPrice = perPersonPrice * participants;

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1727] min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/activities')}
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#0F2942]"
        >
          <FiArrowLeft /> Back to all activities
        </button>

        {/* Hero Image & Title */}
        <div className="relative h-[320px] md:h-[420px] w-full overflow-hidden rounded-2xl shadow-md bg-slate-900">
          <img
            src={activity.image || FALLBACK_IMAGE}
            alt={activity.title}
            onError={(e) => {
              if (e.currentTarget.dataset.fallbackApplied) return;
              e.currentTarget.dataset.fallbackApplied = 'true';
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <span className="rounded bg-[#0F2942] px-3 py-1 text-xs font-black uppercase text-white shadow border border-slate-700">
              {activity.category}
            </span>
            <h1 className="font-display text-2xl md:text-4xl font-black text-white">
              {activity.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200">
              <span className="flex items-center gap-1.5"><FiMapPin className="text-[#E11D48]" /> {activity.location}</span>
              <span className="flex items-center gap-1.5"><FiClock className="text-amber-400" /> {activity.duration}</span>
              <div className="flex items-center gap-1">
                <RatingStars rating={activity.rating} size={13} />
                <span className="font-bold">({activity.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          
          {/* Left Description & Guidelines */}
          <div className="space-y-8">
            
            {/* Overview */}
            <div className="rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-6 space-y-3 shadow-sm">
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Activity Overview
              </h2>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activity.shortDescription}
              </p>
            </div>

            {/* Inclusions */}
            {activity.inclusions?.length > 0 && (
              <div className="rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-6 space-y-3 shadow-sm">
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  What's Included in this Experience
                </h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {activity.inclusions.map((inc, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200">
                      <FiCheckCircle className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Eligibility & Requirements */}
            {activity.requirements?.length > 0 && (
              <div className="rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 p-6 space-y-3">
                <h3 className="font-display text-sm font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <FiAlertTriangle className="text-amber-600" /> Eligibility &amp; Physical Requirements
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-200">
                  {activity.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Safety & Protocol */}
            {activity.safetyInfo && (
              <div className="rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-6 space-y-3 shadow-sm">
                <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FiShield className="text-emerald-500" /> Certified Safety Standards
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activity.safetyInfo}
                </p>
              </div>
            )}

          </div>

          {/* Right Sticky Booking Drawer */}
          <div className="lg:sticky lg:top-24 h-fit rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Price per participant</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-mono text-3xl font-black text-slate-900 dark:text-white">
                  ₹{perPersonPrice.toLocaleString('en-IN')}
                </span>
                {activity.discountPrice && (
                  <span className="font-mono text-sm text-slate-400 line-through">
                    ₹{activity.price.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs text-slate-500">/ person</span>
              </div>
            </div>

            <form onSubmit={handleBookActivity} className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              
              {/* Select Date */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <FiCalendar className="text-[#E11D48]" /> Activity Date
                </label>
                <input
                  required
                  type="date"
                  value={activityDate}
                  onChange={(e) => setActivityDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
                />
              </div>

              {/* Select Time Slot */}
              {activity.slots?.length > 0 && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Preferred Time Slot
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none"
                  >
                    {activity.slots.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Number of participants */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <FiUsers className="text-[#E11D48]" /> Participants
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={participants}
                  onChange={(e) => setParticipants(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>

              {/* Price Calculation Summary */}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 space-y-1.5 text-xs border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>₹{perPersonPrice} × {participants} Participant(s)</span>
                  <span className="font-mono font-bold">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>Total Payable:</span>
                  <span className="font-mono text-sm text-[#E11D48]">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Book Button */}
              <button
                type="submit"
                disabled={bookingSubmitting}
                className="w-full rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white py-3 text-xs font-black uppercase tracking-wider shadow transition-all duration-200"
              >
                {bookingSubmitting ? 'Confirming Booking…' : 'Book Activity Now'}
              </button>

              <a
                href={`https://wa.me/919996696928?text=Hi%2C%20I%20want%20to%20inquire%20about%20${encodeURIComponent(activity.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 text-xs font-bold shadow transition-colors"
              >
                <FaWhatsapp /> WhatsApp Activity Support
              </a>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ActivityDetails;
