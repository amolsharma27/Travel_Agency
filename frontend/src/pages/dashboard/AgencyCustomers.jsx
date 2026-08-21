import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiUsers, FiSearch, FiPhone, FiMail, FiMapPin, FiCalendar,
  FiBookOpen, FiDollarSign, FiStar
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const mockAgencyCustomers = [
  {
    id: 'cust_ag_1',
    name: 'Amol Sharma',
    email: 'amolsharma2705@gmail.com',
    phone: '+91 98145 19578',
    city: 'Ludhiana, Punjab',
    totalBookingsCount: 3,
    totalSpentWithAgency: 28996,
    upcomingTrip: 'Himachal Group Tour (28 Aug 2026)',
    previousBookings: [
      { tour: 'Amritsar Spiritual Weekend Tour', date: 'Jan 2026', amount: '₹10,497' },
      { tour: 'Serolsar Lake Trek Departure', date: 'Nov 2025', amount: '₹6,501' }
    ],
    notes: 'Prefers window seats on deluxe Volvo coaches.'
  },
  {
    id: 'cust_ag_2',
    name: 'Priya Verma',
    email: 'priya.verma@example.com',
    phone: '+91 98765 11998',
    city: 'Chandigarh Tri-City',
    totalBookingsCount: 2,
    totalSpentWithAgency: 40495,
    upcomingTrip: 'Kashmir Paradise Group Tour (02 Sep 2026)',
    previousBookings: [
      { tour: 'Amritsar Spiritual & Heritage Weekend Tour', date: 'Jan 2026', amount: '₹10,497' }
    ],
    notes: 'Vegetarian meals on all group departures.'
  },
  {
    id: 'cust_ag_3',
    name: 'Karanvir Singh',
    email: 'karanvir.s@example.com',
    phone: '+91 94683 99221',
    city: 'Amritsar, Punjab',
    totalBookingsCount: 2,
    totalSpentWithAgency: 13996,
    upcomingTrip: 'Snow Valley Himalayan Cedar Resort (05 Sep 2026)',
    previousBookings: [
      { tour: 'Jibhi Pine Valley Weekend', date: 'Oct 2025', amount: '₹6,998' }
    ],
    notes: 'Travels with family co-travellers.'
  },
  {
    id: 'cust_ag_4',
    name: 'Rahul Mehra',
    email: 'rahul.mehra@gmail.com',
    phone: '+91 98111 22334',
    city: 'Delhi NCR',
    totalBookingsCount: 1,
    totalSpentWithAgency: 16500,
    upcomingTrip: 'Spiti Valley 4x4 Expedition (12 Sep 2026)',
    previousBookings: [],
    notes: 'First time high altitude traveler.'
  }
];

const AgencyCustomers = () => {
  const [customers, setCustomers] = useState(mockAgencyCustomers);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.city.toLowerCase().includes(search.toLowerCase())
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
            Manage relationships with guests who have booked your agency's tour packages and stays.
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

      {/* Customers Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm space-y-3.5"
          >
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#0F2942] text-amber-300 font-display font-bold flex items-center justify-center text-sm shadow">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">{c.name}</h3>
                  <p className="text-[10px] text-slate-400">{c.city}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <a
                  href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                  title="WhatsApp"
                >
                  <FaWhatsapp size={13} />
                </a>
                <a
                  href={`mailto:${c.email}`}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition"
                  title="Email"
                >
                  <FiMail size={13} />
                </a>
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
                <span className="font-mono font-bold text-emerald-600">₹{c.totalSpentWithAgency.toLocaleString('en-IN')}</span>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Upcoming Reservation:</span>
                <span className="font-bold text-[#0F2942] dark:text-amber-300">{c.upcomingTrip}</span>
              </div>
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
      </div>

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
              <p className="text-slate-500">Preference notes: <i>"{selectedCustomer.notes}"</i></p>

              <span className="font-bold text-slate-900 dark:text-white block pt-2">Past Departures with your Agency:</span>
              {selectedCustomer.previousBookings.length > 0 ? (
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
