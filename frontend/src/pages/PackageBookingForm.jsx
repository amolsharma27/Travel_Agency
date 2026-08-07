import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
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

const PackageBookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pkg, setPkg] = useState(null);
  const [travelDate, setTravelDate] = useState('');
  const [travellers, setTravellers] = useState([{ name: '', age: '', gender: 'Male' }]);
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [couponCode, setCouponCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/packages/${id}`).then(({ data }) => setPkg(data.data));
  }, [id]);

  const addTraveller = () => setTravellers((t) => [...t, { name: '', age: '', gender: 'Male' }]);
  const removeTraveller = (i) => setTravellers((t) => t.filter((_, idx) => idx !== i));
  const updateTraveller = (i, field, value) =>
    setTravellers((t) => t.map((tr, idx) => (idx === i ? { ...tr, [field]: value } : tr)));

  const handleBook = async (e) => {
    e.preventDefault();
    if (!travelDate) {
      toast.error('Select a travel date');
      return;
    }
    setSubmitting(true);
    try {
      const { data: bookingRes } = await api.post('/package-bookings', {
        packageId: id,
        travelDate,
        travellers,
        seatsBooked: travellers.length,
        contactPhone,
        contactEmail,
        couponCode: couponCode || undefined,
      });
      const booking = bookingRes.data;

      const { data: orderRes } = await api.post('/payments/create-order', {
        bookingType: 'package', bookingId: booking._id,
      });
      const order = orderRes.data;

      if (order.isMock) {
        await api.post('/payments/verify', { paymentDbId: order.paymentDbId });
        toast.success('Payment successful (sandbox mode)');
        navigate(`/booking-confirmation?type=package&id=${booking._id}`);
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
        description: pkg.title,
        handler: async (response) => {
          await api.post('/payments/verify', {
            paymentDbId: order.paymentDbId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          toast.success('Payment successful');
          navigate(`/booking-confirmation?type=package&id=${booking._id}`);
        },
        prefill: { email: contactEmail, contact: contactPhone },
        theme: { color: '#1F8A70' },
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!pkg) return <div className="mx-auto max-w-3xl px-5 py-20 text-center text-sm">Loading…</div>;

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-lagoon-600">Complete your booking</p>
      <h1 className="mt-2 font-display text-2xl font-semibold">{pkg.title}</h1>

      <form onSubmit={handleBook} className="mt-8 space-y-6 rounded-xl2 border border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light p-6 shadow-card">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Travel date</label>
          <input type="date" required value={travelDate} onChange={(e) => setTravelDate(e.target.value)} className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium">Travellers</label>
            <button type="button" onClick={addTraveller} className="flex items-center gap-1 text-xs font-semibold text-lagoon-600">
              <FiPlus size={14} /> Add traveller
            </button>
          </div>
          <div className="space-y-3">
            {travellers.map((tr, i) => (
              <div key={i} className="grid grid-cols-[1fr_80px_100px_auto] gap-2">
                <input required placeholder="Full name" value={tr.name} onChange={(e) => updateTraveller(i, 'name', e.target.value)} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
                <input required type="number" placeholder="Age" value={tr.age} onChange={(e) => updateTraveller(i, 'age', e.target.value)} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
                <select value={tr.gender} onChange={(e) => updateTraveller(i, 'gender', e.target.value)} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                {travellers.length > 1 && (
                  <button type="button" onClick={() => removeTraveller(i)} className="text-red-400"><FiTrash2 /></button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input required type="email" placeholder="Contact email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
          <input required placeholder="Contact phone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Coupon code (optional)</label>
          <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="e.g. SAVE10" className="w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm uppercase" />
        </div>

        <div className="rounded-lg bg-lagoon-50 dark:bg-lagoon-700/10 p-4 text-sm">
          <div className="flex justify-between"><span>Per person</span><span className="font-mono">₹{pkg.discountPrice || pkg.price}</span></div>
          <div className="flex justify-between font-semibold"><span>{travellers.length} traveller(s)</span><span className="font-mono">₹{(pkg.discountPrice || pkg.price) * travellers.length}</span></div>
        </div>

        <button disabled={submitting} className="w-full rounded-lg bg-lagoon-500 py-3 text-sm font-semibold text-paper transition hover:bg-lagoon-600 disabled:opacity-60">
          {submitting ? 'Processing…' : 'Proceed to payment'}
        </button>
      </form>
    </div>
  );
};

export default PackageBookingForm;
