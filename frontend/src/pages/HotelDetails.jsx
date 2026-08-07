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
        setHotel(data.data.hotel);
        setRooms(data.data.rooms);

        const [reviewsRes, similarRes] = await Promise.all([
          api.get('/reviews', { params: { targetType: 'hotel', targetId: data.data.hotel._id } }),
          api.get(`/hotels/${data.data.hotel._id}/similar`),
        ]);
        setReviews(reviewsRes.data.data);
        setSimilar(similarRes.data.data);
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

  if (loading) return <div className="mx-auto max-w-7xl px-5 py-20 text-center text-sm">Loading hotel…</div>;
  if (!hotel) return null;

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      {/* Gallery */}
      <div className="grid gap-2 overflow-hidden rounded-xl2 md:h-96 md:grid-cols-4 md:grid-rows-2">
        <img src={hotel.images?.[0] || PLACEHOLDER} alt={hotel.name} className="h-56 w-full object-cover md:col-span-2 md:row-span-2 md:h-full" />
        {[1, 2, 3, 4].map((i) => (
          <img
            key={i}
            src={hotel.images?.[i] || PLACEHOLDER}
            alt=""
            className="hidden h-full w-full object-cover md:block"
          />
        ))}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-semibold">{hotel.name}</h1>
              <p className="mt-1 flex items-center gap-1 text-sm text-ink/60 dark:text-paper/60">
                <FiMapPin size={14} /> {hotel.address}, {hotel.city}, {hotel.state}
              </p>
            </div>
            <span className="rounded-full bg-lagoon-50 dark:bg-lagoon-700/30 px-3 py-1.5 text-sm font-semibold text-lagoon-700 dark:text-lagoon-300">
              {hotel.starRating}★ {hotel.propertyType}
            </span>
          </div>

          <div className="mt-3"><RatingStars rating={hotel.rating} /> <span className="text-xs text-ink/50 dark:text-paper/50">({hotel.reviewsCount} reviews)</span></div>

          <p className="mt-6 leading-relaxed text-ink/80 dark:text-paper/80">{hotel.description}</p>

          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1.5"><FiClock /> Check-in {hotel.checkInTime} · Check-out {hotel.checkOutTime}</span>
            {hotel.policies?.breakfastIncluded && <span className="flex items-center gap-1.5"><FiCoffee /> Breakfast included</span>}
            <span className="flex items-center gap-1.5"><FiCheckCircle /> {hotel.policies?.cancellationPolicy}</span>
          </div>

          <div className="mt-8">
            <h2 className="mb-3 font-display text-lg font-semibold">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities?.map((a) => (
                <span key={a} className="rounded-full border border-ink/10 dark:border-paper/20 px-3 py-1.5 text-xs">{a}</span>
              ))}
            </div>
          </div>

          {hotel.nearbyAttractions?.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 font-display text-lg font-semibold">Nearby attractions</h2>
              <ul className="space-y-1.5 text-sm text-ink/70 dark:text-paper/70">
                {hotel.nearbyAttractions.map((n) => (
                  <li key={n.name}>{n.name} — {n.distanceKm} km</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8">
            <h2 className="mb-3 font-display text-lg font-semibold">Location</h2>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${hotel.location.lat},${hotel.location.lng}`}
              target="_blank"
              rel="noreferrer"
              className="flex h-56 items-center justify-center rounded-xl2 border border-dashed border-ink/15 dark:border-paper/20 text-sm text-lagoon-600 hover:bg-lagoon-50 dark:hover:bg-lagoon-700/10"
            >
              Open in Google Maps →
            </a>
          </div>

          {/* Reviews */}
          <div className="mt-10">
            <h2 className="mb-4 font-display text-lg font-semibold">Guest reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-sm text-ink/50 dark:text-paper/50">No reviews yet — be the first to stay and share your experience.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r._id} className="rounded-xl2 border border-ink/5 dark:border-paper/10 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{r.user?.name}</span>
                      <RatingStars rating={r.rating} showValue={false} size={12} />
                    </div>
                    <p className="mt-2 text-sm text-ink/70 dark:text-paper/70">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Room booking panel */}
        <div className="lg:sticky lg:top-24 h-fit rounded-xl2 border border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light p-5 shadow-card">
          <h2 className="mb-3 font-display text-lg font-semibold">Select dates</h2>
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
          </div>

          <div className="mt-5 space-y-4">
            {rooms.map((room) => (
              <div key={room._id} className="rounded-xl2 border border-ink/10 dark:border-paper/20 p-4">
                <h3 className="font-display text-sm font-semibold">{room.name}</h3>
                <p className="mt-1 text-xs text-ink/60 dark:text-paper/60">{room.bedType} bed · up to {room.maxAdults} adults, {room.maxChildren} children</p>
                <p className="mt-2 font-mono text-lg font-semibold">₹{room.basePrice} <span className="text-xs font-sans font-normal text-ink/50 dark:text-paper/50">/ night</span></p>

                {availability[room._id] && (
                  <p className={`mt-1 text-xs font-medium ${availability[room._id].isAvailable ? 'text-lagoon-600' : 'text-red-500'}`}>
                    {availability[room._id].isAvailable
                      ? `${availability[room._id].minAvailableAcrossStay} rooms left · ₹${availability[room._id].totalPrice} total`
                      : 'Not available for these dates'}
                  </p>
                )}

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => checkAvailability(room._id)}
                    className="flex-1 rounded-lg border border-ink/10 dark:border-paper/20 py-2 text-xs font-semibold hover:border-lagoon-500"
                  >
                    Check availability
                  </button>
                  <button
                    onClick={() => bookRoom(room._id)}
                    className="flex-1 rounded-lg bg-lagoon-500 py-2 text-xs font-semibold text-paper hover:bg-lagoon-600"
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
          <h2 className="mb-5 font-display text-2xl font-semibold">Similar hotels in {hotel.city}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((h) => <HotelCard key={h._id} hotel={h} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetails;
