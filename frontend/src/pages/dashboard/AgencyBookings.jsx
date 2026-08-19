import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiPackage, FiHome, FiCheckCircle, FiClock, FiDollarSign,
  FiPhone, FiMail, FiCalendar, FiUsers, FiSearch, FiFilter
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../../api/axios.js';

const mockAgencyBookingsData = [
  {
    _id: 'ag_bk_1',
    type: 'package',
    itemTitle: 'Himachal Group Tour: Jibhi, Tirthan Valley & Jalori Pass',
    bookingRef: 'PCTE-AG-8821',
    customerName: 'Amol Sharma',
    customerPhone: '+91 98145 19578',
    customerEmail: 'amolsharma2705@gmail.com',
    travelDate: '28 August 2026 (Friday Departure)',
    travellersCount: 2,
    grossAmount: 11998,
    commissionRate: '8.5%',
    netPayout: 10978,
    status: 'confirmed',
    pickupLocation: 'Ludhiana / Chandigarh Phase 8',
    specialNotes: 'Vegetarian meals preferred for both guests.'
  },
  {
    _id: 'ag_bk_2',
    type: 'package',
    itemTitle: 'Amritsar Spiritual & Heritage Weekend Tour',
    bookingRef: 'PCTE-AG-8829',
    customerName: 'Priya Verma',
    customerPhone: '+91 98765 11998',
    customerEmail: 'priya.verma@example.com',
    travelDate: '29 August 2026',
    travellersCount: 3,
    grossAmount: 10497,
    commissionRate: '8.5%',
    netPayout: 9605,
    status: 'confirmed',
    pickupLocation: 'Chandigarh ISBT Sector 43',
    specialNotes: 'Include Langar Seva slot assistance.'
  },
  {
    _id: 'ag_bk_3',
    type: 'hotel',
    itemTitle: 'Snow Valley Himalayan Cedar Resort (Deluxe Valley Suite)',
    bookingRef: 'PCTE-AG-8910',
    customerName: 'Karanvir Singh',
    customerPhone: '+91 94683 99221',
    customerEmail: 'karanvir.s@example.com',
    travelDate: '01 Sep 2026 - 03 Sep 2026 (2 Nights)',
    travellersCount: 2,
    grossAmount: 6998,
    commissionRate: '8.5%',
    netPayout: 6403,
    status: 'confirmed',
    pickupLocation: 'Direct Check-in at Resort',
    specialNotes: 'Upper floor mountain view room requested.'
  },
  {
    _id: 'ag_bk_4',
    type: 'package',
    itemTitle: 'Spiti Valley 4x4 Snow Leopard Expedition',
    bookingRef: 'PCTE-AG-8944',
    customerName: 'Rahul Mehra',
    customerPhone: '+91 98111 22334',
    customerEmail: 'rahul.mehra@gmail.com',
    travelDate: '12 Sep 2026',
    travellersCount: 1,
    grossAmount: 16500,
    commissionRate: '8.5%',
    netPayout: 15097,
    status: 'pending_departure',
    pickupLocation: 'Shimla Old Bus Stand',
    specialNotes: 'Carries high altitude trekking gear.'
  }
];

const AgencyBookings = () => {
  const [tab, setTab] = useState('all'); // 'all' | 'package' | 'hotel'
  const [search, setSearch] = useState('');
  const [bookings, setBookings] = useState(mockAgencyBookingsData);
  const [loading, setLoading] = useState(false);

  const filtered = bookings.filter(b => {
    const matchTab = tab === 'all' || b.type === tab;
    const matchSearch = !search ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.itemTitle.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingRef.toLowerCase().includes(search.toLowerCase()) ||
      b.customerPhone.includes(search);
    return matchTab && matchSearch;
  });

  const totalGross = filtered.reduce((acc, curr) => acc + curr.grossAmount, 0);
  const totalNet = filtered.reduce((acc, curr) => acc + curr.netPayout, 0);

  return (
    <div className="space-y-6">
      
      {/* Header & Stats Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">
            Client Bookings &amp; Manifest Manager
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage confirmed travelers, passenger manifests, pickup coordination, and bank settlement payouts.
          </p>
        </div>
      </div>

      {/* Quick Payout Telemetry Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Bookings Filtered</span>
          <p className="font-mono text-xl font-black text-slate-900 dark:text-white">{filtered.length} Bookings</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Gross Client Billing</span>
          <p className="font-mono text-xl font-black text-[#0F2942] dark:text-amber-400">₹{totalGross.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Net Operator Bank Credit</span>
          <p className="font-mono text-xl font-black text-emerald-600">₹{totalNet.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400 text-xs" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone, tour package, or booking ref..."
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
          />
        </div>

        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          {[
            { id: 'all', label: 'All Bookings' },
            { id: 'package', label: 'Tour Departures' },
            { id: 'hotel', label: 'Resort Stays' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                tab === t.id
                  ? 'bg-[#0F2942] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Manifest Cards List */}
      <div className="space-y-4">
        {filtered.map((b) => (
          <div
            key={b._id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#0F2942] dark:text-amber-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {b.bookingRef}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded uppercase">
                    ✓ {b.status}
                  </span>
                </div>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white mt-1">
                  {b.itemTitle}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <FiCalendar className="text-[#E11D48]" /> {b.travelDate} · <FiUsers className="text-slate-400" /> {b.travellersCount} Guests
                </p>
              </div>

              {/* Payout Snippet */}
              <div className="text-right text-xs">
                <span className="text-[10px] text-slate-400 block font-bold">Gross Client Bill / Net Credit</span>
                <span className="text-slate-500 font-mono">₹{b.grossAmount.toLocaleString('en-IN')}</span>
                <span className="font-bold text-emerald-600 font-mono text-sm ml-2">₹{b.netPayout.toLocaleString('en-IN')} (Net)</span>
              </div>
            </div>

            {/* Guest Details & Coordination */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Lead Traveler</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{b.customerName}</p>
                <p className="text-slate-500 font-mono">{b.customerPhone}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Boarding / Pickup</span>
                <p className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">{b.pickupLocation}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Special Request</span>
                <p className="text-slate-700 dark:text-slate-300 italic mt-0.5">{b.specialNotes || 'None'}</p>
              </div>
            </div>

            {/* Quick Operator Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-slate-400">
                Payment status: <b>Settled in Escrow</b> (Direct payout post-departure)
              </span>

              <div className="flex gap-2">
                <a
                  href={`https://wa.me/${b.customerPhone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(b.customerName)}%2C%20this%20is%20PCTE%20Travel%20Agency%20operations%20regarding%20your%20booking%20${b.bookingRef}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white shadow transition-colors"
                >
                  <FaWhatsapp /> WhatsApp Guest
                </a>
                <button
                  onClick={() => toast.success(`Departure voucher sent to ${b.customerEmail}`)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
                >
                  Email Voucher
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AgencyBookings;
