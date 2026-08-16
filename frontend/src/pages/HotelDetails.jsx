import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMapPin, FiCoffee, FiClock, FiCheckCircle } from 'react-icons/fi';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import RatingStars from '../components/RatingStars.jsx';
import HotelCard from '../components/HotelCard.jsx';

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
        toast.error('Could not load this hotel');
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
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not check availability');
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
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#9B1C1C] border-r-transparent" />
        <p className="mt-3 text-sm text-slate-600 dark:text-indigo-200/70">Loading hotel &amp; resort details…</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-indigo-900 p-10 bg-white dark:bg-[#110D44] shadow-sm">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Hotel Not Found</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-indigo-200/70">This stay might have been updated or moved.</p>
          <button
            onClick={() => navigate('/hotels')}
            className="mt-6 rounded-xl bg-[#9B1C1C] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#1B1464] shadow"
          >
            Browse Verified Stays
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 bg-[#FAFAF9] dark:bg-[#0B0830] min-h-screen">
      {/* Gallery */}
      <div className="grid gap-2 overflow-hidden rounded-xl md:h-96 md:grid-cols-4 md:grid-rows-2">
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

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">{hotel.name}</h1>
              <p className="mt-1 flex items-center gap-1 text-sm text-slate-600 dark:text-indigo-200/80">
                <FiMapPin size={14} className="text-[#9B1C1C]" /> {hotel.address}, {hotel.city}, {hotel.state}
              </p>
            </div>
            <span className="rounded-full bg-[#1B1464]/10 dark:bg-indigo-900/50 px-3 py-1.5 text-sm font-bold text-[#1B1464] dark:text-amber-300">
              {hotel.starRating}★ {hotel.propertyType}
            </span>
          </div>

          <div className="mt-3"><RatingStars rating={hotel.rating} /> <span className="text-xs text-slate-500 dark:text-indigo-300/60">({hotel.reviewsCount} reviews)</span></div>

          <p className="mt-6 leading-relaxed text-slate-700 dark:text-indigo-200/90 text-sm">{hotel.description}</p>

          <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold text-slate-700 dark:text-indigo-200">
            <span className="flex items-center gap-1.5"><FiClock className="text-[#9B1C1C]" /> Check-in {hotel.checkInTime} · Check-out {hotel.checkOutTime}</span>
            {hotel.policies?.breakfastIncluded && <span className="flex items-center gap-1.5"><FiCoffee className="text-[#9B1C1C]" /> Breakfast included</span>}
            <span className="flex items-center gap-1.5"><FiCheckCircle className="text-[#9B1C1C]" /> {hotel.policies?.cancellationPolicy}</span>
          </div>

          <div className="mt-8">
            <h2 className="mb-3 font-display text-lg font-bold text-slate-900 dark:text-white">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities?.map((a) => (
                <span key={a} className="rounded-full border border-slate-300 dark:border-indigo-800 bg-white dark:bg-[#110D44] px-3.5 py-1.5 text-xs font-bold text-slate-800 dark:text-indigo-200">{a}</span>
              ))}
            </div>
          </div>

          {hotel.nearbyAttractions?.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 font-display text-lg font-bold text-slate-900 dark:text-white">Nearby Attractions</h2>
              <ul className="space-y-1.5 text-xs font-bold text-slate-600 dark:text-indigo-200/80">
                {hotel.nearbyAttractions.map((n) => (
                  <li key={n.name}>{n.name} — {n.distanceKm} km</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8">
            <h2 className="mb-3 font-display text-lg font-bold text-slate-900 dark:text-white">Location Map</h2>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${hotel.location?.lat || 32.2432},${hotel.location?.lng || 77.1892}`}
              target="_blank"
              rel="noreferrer"
              className="flex h-44 items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-indigo-800 text-sm font-bold text-[#9B1C1C] dark:text-red-400 hover:bg-slate-100 dark:hover:bg-indigo-950/40 transition-colors"
            >
              Open in Google Maps &rarr;
            </a>
          </div>

          {/* Reviews */}
          <div className="mt-10">
            <h2 className="mb-4 font-display text-lg font-bold text-slate-900 dark:text-white">Guest Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-indigo-300/60">No reviews yet — be the first to stay and share your experience.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r._id} className="rounded-xl border border-slate-200 dark:border-indigo-900/60 bg-white dark:bg-[#110D44] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{r.user?.name}</span>
                      <RatingStars rating={r.rating} showValue={false} size={12} />
                    </div>
                    <p className="mt-2 text-xs text-slate-600 dark:text-indigo-200/80">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Room booking panel */}
        <div className="lg:sticky lg:top-24 h-fit rounded-xl border border-slate-200 dark:border-indigo-900/60 bg-white dark:bg-[#110D44] p-5 shadow-xl">
          <h2 className="mb-3 font-display text-lg font-bold text-slate-900 dark:text-white">Select Dates</h2>
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="rounded-lg border border-slate-300 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-950/60 px-3 py-2 text-xs text-slate-900 dark:text-white outline-none" />
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="rounded-lg border border-slate-300 dark:border-indigo-800 bg-slate-50 dark:bg-indigo-950/60 px-3 py-2 text-xs text-slate-900 dark:text-white outline-none" />
          </div>

          <div className="mt-5 space-y-4">
            {rooms.map((room) => (
              <div key={room._id} className="rounded-xl border border-slate-200 dark:border-indigo-800 p-4">
                <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">{room.name}</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-indigo-200/70">{room.bedType} bed · up to {room.maxAdults} adults, {room.maxChildren} children</p>
                <p className="mt-2 font-mono text-lg font-bold text-[#9B1C1C] dark:text-red-400">₹{room.basePrice} <span className="text-xs font-sans font-normal text-slate-400">/ night</span></p>

                {availability[room._id] && (
                  <p className={`mt-1 text-xs font-bold ${availability[room._id].isAvailable ? 'text-emerald-600' : 'text-red-500'}`}>
                    {availability[room._id].isAvailable
                      ? `${availability[room._id].minAvailableAcrossStay} rooms left · ₹${availability[room._id].totalPrice} total`
                      : 'Not available for these dates'}
                  </p>
                )}

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => checkAvailability(room._id)}
                    className="flex-1 rounded-lg border border-slate-300 dark:border-indigo-800 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#9B1C1C]"
                  >
                    Check dates
                  </button>
                  <button
                    onClick={() => bookRoom(room._id)}
                    className="flex-1 rounded-lg bg-[#9B1C1C] py-2 text-xs font-bold text-white hover:bg-[#1B1464] shadow"
                  >
                    Book now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-5 font-display text-2xl font-black text-slate-900 dark:text-white">Similar hotels in {hotel.city}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((h) => <HotelCard key={h._id} hotel={h} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetails;
