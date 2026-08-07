import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const HotelBookingForm = () => {
  const { hotelId, roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [checkIn, setCheckIn] = useState(location.state?.checkIn || '');
  const [checkOut, setCheckOut] = useState(location.state?.checkOut || '');
  const [roomsBooked, setRoomsBooked] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [couponCode, setCouponCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/hotels/${hotelId}`).then(({ data }) => {
      setHotel(data.data.hotel);
      setRoom(data.data.rooms.find((r) => r._id === roomId));
    });
  }, [hotelId, roomId]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      toast.error('Select check-in and check-out dates');
      return;
    }
    setSubmitting(true);
    try {
      const { data: bookingRes } = await api.post('/hotel-bookings', {
        hotelId, roomId, checkIn, checkOut, roomsBooked, adults, children,
        contactName, contactPhone, contactEmail, couponCode: couponCode || undefined,
      });
      const booking = bookingRes.data;

      const { data: orderRes } = await api.post('/payments/create-order', {
        bookingType: 'hotel', bookingId: booking._id,
      });
      const order = orderRes.data;

      if (order.isMock) {
        // Sandbox mode: skip the real Razorpay widget and auto-verify
        await api.post('/payments/verify', { paymentDbId: order.paymentDbId });
        toast.success('Payment successful (sandbox mode)');
        navigate(`/booking-confirmation?type=hotel&id=${booking._id}`);
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Could not load payment gateway');
        return;
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'Travel & Stay',
        description: `${hotel.name} — ${room.name}`,
        handler: async (response) => {
          await api.post('/payments/verify', {
            paymentDbId: order.paymentDbId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          toast.success('Payment successful');
          navigate(`/booking-confirmation?type=hotel&id=${booking._id}`);
        },
        prefill: { name: contactName, email: contactEmail, contact: contactPhone },
        theme: { color: '#1F8A70' },
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!hotel || !room) return <div className="mx-auto max-w-3xl px-5 py-20 text-center text-sm">Loading…</div>;

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-lagoon-600">Complete your booking</p>
      <h1 className="mt-2 font-display text-2xl font-semibold">{hotel.name} — {room.name}</h1>

      <form onSubmit={handleBook} className="mt-8 space-y-6 rounded-xl2 border border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light p-6 shadow-card">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Check-in</label>
            <input type="date" required value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Check-out</label>
            <input type="date" required value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Rooms</label>
            <input type="number" min={1} value={roomsBooked} onChange={(e) => setRoomsBooked(Number(e.target.value))} className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Adults</label>
            <input type="number" min={1} value={adults} onChange={(e) => setAdults(Number(e.target.value))} className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Children</label>
            <input type="number" min={0} value={children} onChange={(e) => setChildren(Number(e.target.value))} className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <input required placeholder="Full name" value={contactName} onChange={(e) => setContactName(e.target.value)} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
          <input required type="email" placeholder="Email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
          <input required placeholder="Phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Coupon code (optional)</label>
          <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="e.g. SAVE10" className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm uppercase" />
        </div>

        <button disabled={submitting} className="w-full rounded-lg bg-lagoon-500 py-3 text-sm font-semibold text-paper transition hover:bg-lagoon-600 disabled:opacity-60">
          {submitting ? 'Processing…' : 'Proceed to payment'}
        </button>
        <p className="text-center text-xs text-ink/50 dark:text-paper/50">{room.freeCancellation ? 'Free cancellation available per hotel policy.' : 'Cancellation policy applies as listed on the hotel page.'}</p>
      </form>
    </div>
  );
};

export default HotelBookingForm;
