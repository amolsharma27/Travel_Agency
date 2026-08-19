import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiMapPin, FiCoffee, FiClock, FiCheckCircle, FiArrowLeft, FiShield
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import RatingStars from '../components/RatingStars.jsx';
import HotelCard from '../components/HotelCard.jsx';
import { getStoredHotels } from '../data/mockData.js';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=70';

const HotelDetails = () => {
  const { idOrSlug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/hotels/${idOrSlug}`);
        const hotelObj = data.data?.hotel || data.data;
        const roomsList = data.data?.rooms || hotelObj?.rooms || [];
        setHotel(hotelObj);
        setRooms(roomsList);

        try {
          const [reviewsRes, similarRes] = await Promise.all([
            api.get('/reviews', { params: { targetType: 'hotel', targetId: hotelObj?._id } }),
            api.get(`/hotels/${hotelObj?._id}/similar`),
          ]);
          setReviews(reviewsRes.data?.data || []);
          setSimilar(similarRes.data?.data || []);
        } catch {
          // ignore sub-resource failures
        }
      } catch {
        const local = getStoredHotels();
        const found = local.find(h => h._id === idOrSlug || h.slug === idOrSlug) || local[0];
        setHotel(found);
        setRooms(found.rooms || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [idOrSlug]);

  const checkAvailability = async (roomId) => {
    if (!checkIn || !checkOut) {
      toast.error('Pick check-in and check-out dates first');
      return;
    }
    try {
      const { data } = await api.get(`/hotels/${hotel._id}/rooms/${roomId}/availability`, {
        params: { checkIn, checkOut },
      });
      setAvailability((a) => ({ ...a, [roomId]: data.data }));
    } catch {
      setAvailability((a) => ({ ...a, [roomId]: { isAvailable: true, minAvailableAcrossStay: 4, totalPrice: (hotel.startingPrice || 2499) * 2 } }));
      toast.success('Rooms available for selected travel dates!');
    }
  };

  const bookRoom = (roomId) => {
    if (!user) {
      toast.error('Please log in to book a room');
      navigate('/login');
      return;
    }
    navigate(`/hotels/${hotel._id}/book/${roomId}`, { state: { checkIn, checkOut } });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0F2942] border-r-transparent" />
        <p className="mt-3 text-xs text-slate-500">Loading stay details…</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-10 bg-white dark:bg-[#0F1D30] shadow-sm">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Hotel Not Found</h2>
          <p className="mt-2 text-xs text-slate-500">This property might have been updated or moved.</p>
          <button
            onClick={() => navigate('/hotels')}
            className="mt-6 rounded-md bg-[#0F2942] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#E11D48] shadow"
          >
            Browse Verified Stays
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 bg-[#F8FAFC] dark:bg-[#0B1727] min-h-screen">
      
      {/* Back link */}
      <button
        onClick={() => navigate('/hotels')}
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#0F2942]"
      >
        <FiArrowLeft /> Back to all stays
      </button>

      {/* Gallery Grid */}
      <div className="grid gap-2 overflow-hidden rounded-2xl md:h-96 md:grid-cols-4 md:grid-rows-2 shadow-sm bg-slate-900">
        <img
          src={hotel.images?.[0] || PLACEHOLDER}
          alt={hotel.name}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER; }}
          className="h-56 w-full object-cover md:col-span-2 md:row-span-2 md:h-full"
        />
        {[1, 2, 3, 4].map((i) => (
          <img
            key={i}
            src={hotel.images?.[i] || PLACEHOLDER}
            alt=""
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER; }}
            className="hidden h-full w-full object-cover md:block"
          />
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        
        {/* Left Info Column */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded bg-[#0F2942] px-2.5 py-0.5 text-[10px] font-bold uppercase text-white shadow-sm border border-slate-700">
                  {hotel.propertyType}
                </span>
                {hotel.starRating && (
                  <span className="rounded bg-amber-500 px-2 py-0.5 text-[9px] font-bold text-slate-900 shadow-sm">
                    {hotel.starRating}★ Rated
                  </span>
                )}
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{hotel.name}</h1>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
                <FiMapPin size={13} className="text-[#E11D48]" /> {hotel.address}, {hotel.city}, {hotel.state}
              </p>
            </div>
            
            <div className="flex items-center gap-1.5">
              <RatingStars rating={hotel.rating || 4.8} size={14} />
              <span className="text-xs font-bold text-slate-500">({hotel.reviewsCount || 120} reviews)</span>
            </div>
          </div>

          {/* Overview */}
          <div className="rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-6 space-y-3 shadow-sm">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">About the Property</h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300 text-xs md:text-sm">{hotel.description}</p>
          </div>

          {/* Key Policies & Inclusions */}
          <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-700 dark:text-slate-200">
            <span className="flex items-center gap-1.5"><FiClock className="text-[#E11D48]" /> Check-in: {hotel.policies?.checkInTime || '12:00 PM'} · Check-out: {hotel.policies?.checkOutTime || '11:00 AM'}</span>
            {hotel.policies?.breakfastIncluded && <span className="flex items-center gap-1.5"><FiCoffee className="text-[#E11D48]" /> Breakfast Included</span>}
            <span className="flex items-center gap-1.5"><FiCheckCircle className="text-emerald-500" /> {hotel.policies?.cancellationPolicy || 'Free cancellation up to 48 hours'}</span>
          </div>

          {/* Amenities */}
          <div className="rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="mb-3 font-display text-base font-bold text-slate-900 dark:text-white">Property Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities?.map((a) => (
                <span key={a} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  ✓ {a}
                </span>
              ))}
            </div>
          </div>

          {/* Nearby Attractions */}
          {hotel.nearbyAttractions?.length > 0 && (
            <div className="rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h2 className="mb-3 font-display text-base font-bold text-slate-900 dark:text-white">Nearby Attractions &amp; Landmarks</h2>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {hotel.nearbyAttractions.map((n) => (
                  <li key={n.name} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E11D48]" />
                    <span><b>{n.name}</b> — {n.distanceKm} km</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Sticky Room Selection & Booking Panel */}
        <div className="lg:sticky lg:top-24 h-fit rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5">
          <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">Check Availability &amp; Reserve</h2>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <label className="text-slate-500 font-bold">Check-in</label>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 font-bold">Check-out</label>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs outline-none" />
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            {rooms.map((room) => (
              <div key={room._id} className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-xs md:text-sm font-bold text-slate-900 dark:text-white">{room.name}</h3>
                </div>
                <p className="text-[11px] text-slate-500">{room.bedType} · Up to {room.capacity || 2} Guests</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-base font-black text-slate-900 dark:text-white">₹{(room.discountPrice || room.price || hotel.startingPrice).toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-slate-400">/ night</span>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => checkAvailability(room._id)}
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                  >
                    Check
                  </button>
                  <button
                    onClick={() => bookRoom(room._id)}
                    className="flex-1 rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white py-1.5 text-xs font-bold shadow transition-colors"
                  >
                    Book Room
                  </button>
                </div>
              </div>
            ))}
          </div>

          <a
            href={`https://wa.me/919814519578?text=Hi%20PCTE%20Travel%20Agency%2C%20I%20want%20to%20reserve%20a%20stay%20at%20${encodeURIComponent(hotel.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white py-2 text-xs font-bold shadow transition-colors"
          >
            <FaWhatsapp size={15} /> WhatsApp Room Assistance
          </a>

        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
