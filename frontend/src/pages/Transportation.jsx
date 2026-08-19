import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiSend, FiCalendar, FiUsers, FiMapPin, FiClock, FiCheckCircle,
  FiPhoneCall, FiAlertCircle, FiArrowRight, FiShield
} from 'react-icons/fi';
import {
  FaPlane, FaTrain, FaBus, FaTaxi, FaCar, FaSuitcase, FaWhatsapp
} from 'react-icons/fa';
import api from '../api/axios.js';
import { mockTransportRoutes } from '../data/mockData.js';
import { useAuth } from '../context/AuthContext.jsx';

const Transportation = () => {
  const [activeTab, setActiveTab] = useState('flights'); // 'flights' | 'trains' | 'buses' | 'cabs'
  const [routesData, setRoutesData] = useState(mockTransportRoutes);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Search Form State
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    travelDate: '',
    returnDate: '',
    travellers: '1',
    travelClass: 'Economy',
    busType: 'AC Volvo Semi-Sleeper',
    vehicleType: 'Sedan (Swift Dzire / Etios)',
    tripType: 'one-way', // 'one-way' | 'round-trip'
    contactPhone: user?.phone || '',
    contactEmail: user?.email || '',
    pickupLocation: '',
    dropLocation: '',
    specialRequest: ''
  });

  const [bookingSuccessModal, setBookingSuccessModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/transportation').then(({ data }) => {
      if (data?.data) setRoutesData(data.data);
    }).catch(() => {});
  }, []);

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in or register to book transportation tickets');
      navigate('/login?redirect=/transportation');
      return;
    }
    if (!formData.from || !formData.to || !formData.travelDate) {
      toast.error('Please enter source, destination and travel date');
      return;
    }
    setSubmitting(true);


    try {
      const payload = {
        bookingType: 'transportation',
        transportType: activeTab,
        itemTitle: `${activeTab.toUpperCase()} Travel: ${formData.from} to ${formData.to}`,
        destination: formData.to,
        fromCity: formData.from,
        toCity: formData.to,
        travelDate: formData.travelDate,
        returnDate: formData.returnDate || undefined,
        travellersCount: Number(formData.travellers) || 1,
        selectedOption: activeTab === 'flights' ? formData.travelClass : activeTab === 'buses' ? formData.busType : formData.vehicleType,
        contactEmail: formData.contactEmail || user?.email || 'guest@example.com',
        contactPhone: formData.contactPhone || user?.phone || '+91 98765 43210',
        totalAmount: activeTab === 'flights' ? 4850 * (Number(formData.travellers) || 1) : activeTab === 'trains' ? 1550 * (Number(formData.travellers) || 1) : activeTab === 'buses' ? 950 * (Number(formData.travellers) || 1) : 3200,
        status: 'confirmed',
        ticketReference: 'TKT-' + Math.random().toString(36).substring(2, 8).toUpperCase()
      };

      const res = await api.post('/bookings', payload);
      setBookingSuccessModal(res.data?.data || payload);
      toast.success('Transportation reservation request submitted successfully!');
    } catch {
      toast.error('Could not submit booking request. Please check details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1727] min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="inline-block rounded-full bg-slate-100 dark:bg-slate-800 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Integrated Travel Logistics
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-2">
            Transportation &amp; Ticket Booking
          </h1>
          <p className="mt-2 text-xs md:text-sm text-slate-600 dark:text-slate-300">
            Official ticketing assistance, luxury Volvo coach seats, private chauffeur outstation cabs, airport transfers, and domestic flight connections.
          </p>
        </div>

        {/* SERVICE TABS */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => setActiveTab('flights')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'flights'
                  ? 'bg-[#0F2942] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <FaPlane /> Flight Booking
            </button>
            <button
              onClick={() => setActiveTab('trains')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'trains'
                  ? 'bg-[#0F2942] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <FaTrain /> Train Tickets
            </button>
            <button
              onClick={() => setActiveTab('buses')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'buses'
                  ? 'bg-[#0F2942] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <FaBus /> Volvo Bus Tickets
            </button>
            <button
              onClick={() => setActiveTab('cabs')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'cabs'
                  ? 'bg-[#0F2942] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <FaTaxi /> Cabs &amp; Airport Transfers
            </button>
          </div>
        </div>

        {/* SEARCH / BOOKING FORM CONTAINER */}
        <div className="rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm max-w-5xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="space-y-6">
            
            {/* Trip Type Selector for Flights/Cabs */}
            {(activeTab === 'flights' || activeTab === 'cabs') && (
              <div className="flex gap-4 border-b border-slate-100 dark:border-slate-800 pb-3 text-xs font-bold">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-800 dark:text-slate-200">
                  <input
                    type="radio"
                    name="tripType"
                    checked={formData.tripType === 'one-way'}
                    onChange={() => handleChange('tripType', 'one-way')}
                    className="accent-[#0F2942]"
                  />
                  One Way / Single Drop
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-800 dark:text-slate-200">
                  <input
                    type="radio"
                    name="tripType"
                    checked={formData.tripType === 'round-trip'}
                    onChange={() => handleChange('tripType', 'round-trip')}
                    className="accent-[#0F2942]"
                  />
                  Round Trip / Return Included
                </label>
              </div>
            )}

            {/* Main Form Fields Grid */}
            <div className="grid gap-4 md:grid-cols-12">
              
              {/* From */}
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <FiMapPin className="text-[#E11D48]" /> From (Source)
                </label>
                <input
                  required
                  type="text"
                  placeholder={activeTab === 'flights' ? 'e.g. Delhi (DEL)' : activeTab === 'buses' ? 'e.g. Chandigarh / Delhi' : 'e.g. Ludhiana / Airport'}
                  value={formData.from}
                  onChange={(e) => handleChange('from', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
                />
              </div>

              {/* To */}
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <FiMapPin className="text-[#E11D48]" /> To (Destination)
                </label>
                <input
                  required
                  type="text"
                  placeholder={activeTab === 'flights' ? 'e.g. Goa (GOX) / Srinagar' : activeTab === 'buses' ? 'e.g. Manali / Kasol / Shimla' : 'e.g. Manali / Amritsar'}
                  value={formData.to}
                  onChange={(e) => handleChange('to', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
                />
              </div>

              {/* Departure Date */}
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <FiCalendar className="text-[#E11D48]" /> Travel Date
                </label>
                <input
                  required
                  type="date"
                  value={formData.travelDate}
                  onChange={(e) => handleChange('travelDate', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
                />
              </div>

              {/* Return Date (if round-trip) or Option Select */}
              <div className="md:col-span-3 space-y-1.5">
                {formData.tripType === 'round-trip' ? (
                  <>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                      <FiCalendar className="text-[#E11D48]" /> Return Date
                    </label>
                    <input
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => handleChange('returnDate', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
                    />
                  </>
                ) : (
                  <>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {activeTab === 'flights' ? 'Class' : activeTab === 'buses' ? 'Bus Category' : activeTab === 'trains' ? 'Preferred Class' : 'Vehicle Type'}
                    </label>
                    {activeTab === 'flights' && (
                      <select
                        value={formData.travelClass}
                        onChange={(e) => handleChange('travelClass', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none"
                      >
                        <option value="Economy">Economy</option>
                        <option value="Premium Economy">Premium Economy</option>
                        <option value="Business">Business Class</option>
                      </select>
                    )}
                    {activeTab === 'trains' && (
                      <select
                        value={formData.travelClass}
                        onChange={(e) => handleChange('travelClass', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none"
                      >
                        <option value="Executive / AC Chair Car (CC)">Executive / Chair Car (CC)</option>
                        <option value="3rd AC (3A)">3rd AC (3A)</option>
                        <option value="2nd AC (2A)">2nd AC (2A)</option>
                        <option value="1st AC (1A)">1st AC (1A)</option>
                        <option value="Sleeper (SL)">Sleeper (SL)</option>
                      </select>
                    )}
                    {activeTab === 'buses' && (
                      <select
                        value={formData.busType}
                        onChange={(e) => handleChange('busType', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none"
                      >
                        <option value="AC Volvo Semi-Sleeper">AC Volvo Semi-Sleeper (2+2)</option>
                        <option value="AC Multi-Axle Sleeper">AC Multi-Axle Sleeper (2+1)</option>
                        <option value="Bharat Benz Luxury Coach">Bharat Benz Luxury Coach</option>
                      </select>
                    )}
                    {activeTab === 'cabs' && (
                      <select
                        value={formData.vehicleType}
                        onChange={(e) => handleChange('vehicleType', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none"
                      >
                        <option value="Sedan (Swift Dzire / Etios)">Sedan (Swift Dzire / Etios) — 4 Seats</option>
                        <option value="Premium SUV (Innova Crysta)">Premium SUV (Innova Crysta) — 6-7 Seats</option>
                        <option value="Tempo Traveller 12-Seater">Deluxe Tempo Traveller (12 Seater)</option>
                        <option value="Tempo Traveller 17-Seater">Deluxe Tempo Traveller (17 Seater)</option>
                      </select>
                    )}
                  </>
                )}
              </div>

              {/* Travellers count */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <FiUsers className="text-[#E11D48]" /> Travellers / Passengers
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.travellers}
                  onChange={(e) => handleChange('travellers', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>

              {/* Contact Phone */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <FiPhoneCall className="text-[#E11D48]" /> Contact Phone (for e-ticket / confirmation)
                </label>
                <input
                  required
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>

              {/* Contact Email */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <FiSend className="text-[#E11D48]" /> Contact Email
                </label>
                <input
                  required
                  type="email"
                  placeholder="name@example.com"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <FiShield className="text-emerald-500 text-base shrink-0" />
                <span>Instant confirmation assistance · Guaranteed seat reservation support · Zero hidden fees</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white px-8 py-3 text-xs font-bold uppercase tracking-wider shadow transition-all duration-200"
              >
                {submitting ? 'Submitting Reservation…' : `Search & Reserve ${activeTab.toUpperCase()}`}
              </button>
            </div>
          </form>
        </div>

        {/* POPULAR ACTIVE SCHEDULES & ROUTES TABLE */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E11D48]">
                Featured Daily Connectivity
              </span>
              <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                Popular Routes &amp; Daily Services
              </h2>
            </div>
          </div>

          {/* FLIGHTS ROUTE CARDS */}
          {activeTab === 'flights' && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {routesData.flights.map((f) => (
                <div key={f.id} className="rounded-xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F2942] dark:text-amber-300">{f.airline} · {f.flightNo}</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">{f.stops}</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white">
                    <div>
                      <p className="text-base">{f.departure}</p>
                      <p className="text-xs text-slate-500 font-medium">{f.from}</p>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 block">{f.duration}</span>
                      <div className="h-0.5 w-16 bg-slate-300 dark:bg-slate-700 my-1 relative">
                        <FaPlane className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[10px] text-slate-500" />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base">{f.arrival}</p>
                      <p className="text-xs text-slate-500 font-medium">{f.to}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-[#E11D48]">Starts at ₹{f.price.toLocaleString('en-IN')}</span>
                    <button
                      onClick={() => {
                        setFormData(prev => ({ ...prev, from: f.from, to: f.to }));
                        window.scrollTo({ top: 150, behavior: 'smooth' });
                      }}
                      className="text-xs font-bold text-[#0F2942] dark:text-slate-200 hover:underline"
                    >
                      Select Route &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TRAINS ROUTE CARDS */}
          {activeTab === 'trains' && (
            <div className="grid gap-4 md:grid-cols-2">
              {routesData.trains.map((t) => (
                <div key={t.id} className="rounded-xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-500 font-mono">#{t.trainNo}</span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t.trainName}</h3>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500">{t.runsOn}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-200 font-medium">
                    <div><span className="font-bold text-sm block text-slate-900 dark:text-white">{t.dep}</span> {t.from}</div>
                    <div className="text-center text-[10px] text-slate-400">{t.duration}</div>
                    <div className="text-right"><span className="font-bold text-sm block text-slate-900 dark:text-white">{t.arr}</span> {t.to}</div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    {t.classes.map((c, i) => (
                      <span key={i} className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* BUSES ROUTE CARDS */}
          {activeTab === 'buses' && (
            <div className="grid gap-4 md:grid-cols-2">
              {routesData.buses.map((b) => (
                <div key={b.id} className="rounded-xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F2942] dark:text-amber-300">{b.operator}</span>
                    <span className="text-xs font-mono font-black text-[#E11D48]">₹{b.price.toLocaleString('en-IN')} / seat</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{b.route}</p>
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span>Dep: <b className="text-slate-900 dark:text-white">{b.dep}</b></span>
                    <span>Arr: <b className="text-slate-900 dark:text-white">{b.arr}</b> ({b.duration})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {b.amenities.map((am, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                        ✓ {am}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CABS & TAXI CARDS */}
          {activeTab === 'cabs' && (
            <div className="grid gap-4 md:grid-cols-3">
              {routesData.cabs.map((c) => (
                <div key={c.id} className="rounded-xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="rounded bg-[#0F2942] px-2 py-0.5 text-[10px] font-bold text-white uppercase">{c.ratePerKm}</span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{c.vehicleType}</h3>
                    <p className="text-xs text-slate-500 font-medium">{c.capacity}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{c.bestFor}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 mb-3">
                      {c.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <FiCheckCircle className="text-emerald-500 shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => {
                        setFormData(prev => ({ ...prev, vehicleType: c.vehicleType }));
                        window.scrollTo({ top: 150, behavior: 'smooth' });
                      }}
                      className="w-full text-center rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white py-2 text-xs font-bold transition-colors"
                    >
                      Book this vehicle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BOOKING CONFIRMATION MODAL */}
        {bookingSuccessModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                  <FiCheckCircle size={24} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">Reservation Request Received</h3>
                  <p className="text-xs text-slate-500">Ref ID: {bookingSuccessModal.ticketReference || 'TKT-88192'}</p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 space-y-2 text-xs text-slate-700 dark:text-slate-200">
                <p><b>Service:</b> {bookingSuccessModal.itemTitle}</p>
                <p><b>Travel Date:</b> {bookingSuccessModal.travelDate}</p>
                <p><b>Passengers:</b> {bookingSuccessModal.travellersCount || 1}</p>
                <p><b>Status:</b> <span className="text-emerald-600 font-bold uppercase">Confirmed / Reservation Queued</span></p>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your reservation assistance request has been recorded. Our ticketing desk will send your e-ticket itinerary copy to your email &amp; WhatsApp within 30 minutes.
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setBookingSuccessModal(null);
                    navigate('/dashboard/bookings');
                  }}
                  className="flex-1 rounded-lg bg-[#0F2942] py-2.5 text-xs font-bold text-white shadow hover:bg-[#E11D48]"
                >
                  View My Bookings
                </button>
                <button
                  onClick={() => setBookingSuccessModal(null)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Transportation;
