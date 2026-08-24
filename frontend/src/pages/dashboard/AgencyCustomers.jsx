import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  FiUsers, FiSearch, FiPhone, FiMail, FiMapPin, FiCalendar,
  FiBookOpen, FiDollarSign, FiStar, FiAlertCircle
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../../api/axios.js';

const AgencyCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchAgencyCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/dashboard/agency/customers');
      if (Array.isArray(res.data?.data)) {
        setCustomers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load agency customers:', err);
      setError('Could not load guest directory. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencyCustomers();
  }, []);

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">
            Agency Guest &amp; Passenger Directory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage relationships with real guests who have booked your agency's tour packages and stays.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-[#0F1D30] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400 text-xs" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guests by name, phone, email, city..."
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">
          {filtered.length} Direct Agency Guests
        </span>
      </div>

      {/* Loading & Error */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-[#0F2942] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Loading guest directory...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-center space-y-2">
          <FiAlertCircle className="mx-auto text-red-500 text-xl" />
          <p className="text-xs font-bold text-red-700 dark:text-red-300">{error}</p>
          <button onClick={fetchAgencyCustomers} className="px-3 py-1.5 rounded-lg bg-[#0F2942] text-white text-xs font-bold">
            Retry
          </button>
        </div>
      ) : (
        /* Customers Grid */
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm space-y-3.5"
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#0F2942] text-amber-300 font-display font-bold flex items-center justify-center text-sm shadow">
                    {c.name ? c.name.charAt(0).toUpperCase() : 'E'}
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">{c.name}</h3>
                    <p className="text-[10px] text-slate-400">{c.city || 'Verified Traveler'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {c.phone && (
                    <a
                      href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                      title="WhatsApp"
                    >
                      <FaWhatsapp size={13} />
                    </a>
                  )}
                  {c.email && (
                    <a
                      href={`mailto:${c.email}`}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition"
                      title="Email"
                    >
                      <FiMail size={13} />
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-mono font-semibold">{c.phone}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Total Agency Bookings:</span>
                  <span className="font-bold">{c.totalBookingsCount} Trips</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Gross Spent:</span>
                  <span className="font-mono font-bold text-emerald-600">₹{(c.totalSpentWithAgency || 0).toLocaleString('en-IN')}</span>
                </div>
                {c.upcomingTrip && (
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Upcoming Reservation:</span>
                    <span className="font-bold text-[#0F2942] dark:text-amber-300">{c.upcomingTrip}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setSelectedCustomer(c)}
                  className="text-xs font-bold text-[#E11D48] hover:underline"
                >
                  View Booking History →
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-2 py-12 text-center text-slate-400 text-xs rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30]">
              No guest records found matching your search.
            </div>
          )}
        </div>
      )}

      {/* CUSTOMER HISTORY MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#E11D48]">Guest Dossier</span>
                <h3 className="font-display text-base font-black">{selectedCustomer.name}</h3>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <p className="text-slate-500">Passenger verification: <i>"{selectedCustomer.notes || 'Verified Traveler'}"</i></p>

              <span className="font-bold text-slate-900 dark:text-white block pt-2">Past Departures with your Agency:</span>
              {selectedCustomer.previousBookings && selectedCustomer.previousBookings.length > 0 ? (
                <div className="space-y-1.5">
                  {selectedCustomer.previousBookings.map((b, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 flex justify-between">
                      <div>
                        <p className="font-bold">{b.tour}</p>
                        <span className="text-[10px] text-slate-400">{b.date}</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-600">{b.amount}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">First-time booking with this operator.</p>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="rounded-lg bg-[#0F2942] px-4 py-2 text-xs font-bold text-white shadow"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AgencyCustomers;
