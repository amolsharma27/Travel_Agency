import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiPackage, FiHome, FiCheckCircle, FiClock, FiDollarSign,
  FiPhone, FiMail, FiCalendar, FiUsers, FiSearch, FiFilter,
  FiCheck, FiX, FiEye, FiDownload, FiMessageSquare
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

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
    paymentStatus: 'Paid',
    bookingStatus: 'Confirmed',
    pickupLocation: 'Ludhiana / Chandigarh ISBT',
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
    paymentStatus: 'Paid',
    bookingStatus: 'Confirmed',
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
    paymentStatus: 'Paid',
    bookingStatus: 'Confirmed',
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
    paymentStatus: 'Escrow Pending',
    bookingStatus: 'Pending',
    pickupLocation: 'Shimla Old Bus Stand',
    specialNotes: 'Carries high altitude trekking gear.'
  },
  {
    _id: 'ag_bk_5',
    type: 'package',
    itemTitle: 'Kashmir Paradise Group Tour: Srinagar, Gulmarg & Pahalgam',
    bookingRef: 'PCTE-AG-8712',
    customerName: 'Rohit Verma',
    customerPhone: '+91 98765 44001',
    customerEmail: 'rohit.v@example.com',
    travelDate: '10 Aug 2026 - 15 Aug 2026',
    travellersCount: 2,
    grossAmount: 29998,
    commissionRate: '8.5%',
    netPayout: 27448,
    paymentStatus: 'Paid',
    bookingStatus: 'Completed',
    pickupLocation: 'Srinagar Airport Pickup',
    specialNotes: 'Trip concluded with 5-star review.'
  },
  {
    _id: 'ag_bk_6',
    type: 'package',
    itemTitle: 'Goa Coastal Beach & Cruise Luxury Tour',
    bookingRef: 'PCTE-AG-8620',
    customerName: 'Sunita Goyal',
    customerPhone: '+91 98722 33441',
    customerEmail: 'sunita.g@yahoo.com',
    travelDate: '20 Sep 2026',
    travellersCount: 2,
    grossAmount: 14500,
    commissionRate: '8.5%',
    netPayout: 0,
    paymentStatus: 'Refunded',
    bookingStatus: 'Cancelled',
    pickupLocation: 'Goa Dabolim Airport',
    specialNotes: 'Cancelled by customer due to personal emergency.'
  }
];

const AgencyBookings = () => {
  const [tab, setTab] = useState('All'); // 'All' | 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled'
  const [search, setSearch] = useState('');
  const [bookings, setBookings] = useState(mockAgencyBookingsData);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleStatusChange = (id, newStatus) => {
    setBookings(prev => prev.map(b => b._id === id ? { ...b, bookingStatus: newStatus } : b));
    if (selectedBooking?._id === id) {
      setSelectedBooking(prev => ({ ...prev, bookingStatus: newStatus }));
    }
    toast.success(`Booking marked as ${newStatus}`);
  };

  const filtered = bookings.filter(b => {
    const matchTab = tab === 'All' || b.bookingStatus === tab;
    const matchSearch = !search ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.itemTitle.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingRef.toLowerCase().includes(search.toLowerCase()) ||
      b.customerPhone.includes(search);
    return matchTab && matchSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-900';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-900';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">
            Agency Bookings &amp; Passenger Manifest
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            View traveler reservations, verify seat allocations, contact guests, and manage departures.
          </p>
        </div>
      </div>

      {/* Tabs & Search Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-[#0F1D30] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Tabs: All, Confirmed, Pending, Completed, Cancelled */}
        <div className="flex overflow-x-auto gap-1 scrollbar-none">
          {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                tab === t
                  ? 'bg-[#0F2942] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t === 'All' ? 'All Reservations' : t}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <FiSearch className="absolute left-3 top-2.5 text-slate-400 text-xs" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, booking ref, tour..."
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3">Booking ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Tour / Stay</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Travellers</th>
                <th className="pb-3">Amount &amp; Net Payout</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 font-mono font-bold text-[#0F2942] dark:text-amber-400">{b.bookingRef}</td>
                  <td className="py-3.5">
                    <p className="font-bold text-slate-900 dark:text-white">{b.customerName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{b.customerPhone}</p>
                  </td>
                  <td className="py-3.5 max-w-[180px]">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{b.itemTitle}</p>
                    <span className="text-[10px] text-slate-400 capitalize">{b.type}</span>
                  </td>
                  <td className="py-3.5 text-slate-500 whitespace-nowrap">{b.travelDate}</td>
                  <td className="py-3.5 font-mono font-bold">{b.travellersCount} Guests</td>
                  <td className="py-3.5">
                    <p className="font-mono font-bold text-slate-900 dark:text-white">₹{b.grossAmount.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-emerald-600 font-semibold font-mono">Net: ₹{b.netPayout.toLocaleString('en-IN')}</p>
                  </td>
                  <td className="py-3.5">
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(b.bookingStatus)}`}>
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:bg-[#0F2942] hover:text-white transition"
                      >
                        View
                      </button>

                      {b.bookingStatus === 'Pending' && (
                        <button
                          onClick={() => handleStatusChange(b._id, 'Confirmed')}
                          className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 hover:bg-emerald-200 transition"
                          title="Confirm Booking"
                        >
                          <FiCheck size={12} />
                        </button>
                      )}

                      {b.bookingStatus !== 'Cancelled' && (
                        <button
                          onClick={() => handleStatusChange(b._id, 'Cancelled')}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 transition"
                          title="Cancel Booking"
                        >
                          <FiX size={12} />
                        </button>
                      )}

                      <a
                        href={`https://wa.me/${b.customerPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(b.customerName)},%20this%20is%20PCTE%20Travel%20Agency%20regarding%20your%20upcoming%20tour:%20${encodeURIComponent(b.itemTitle)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                        title="WhatsApp Contact"
                      >
                        <FaWhatsapp size={12} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOOKING DETAILS MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#E11D48]">Agency Passenger File</span>
                <h3 className="font-display text-lg font-black">{selectedBooking.bookingRef}</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-xs font-bold hover:bg-slate-200 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Lead Passenger:</span>
                <span className="font-bold">{selectedBooking.customerName} ({selectedBooking.customerPhone})</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Email:</span>
                <span className="font-mono">{selectedBooking.customerEmail}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Tour / Stay Reserved:</span>
                <span className="font-bold text-right max-w-xs">{selectedBooking.itemTitle}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Departure / Travel Date:</span>
                <span className="font-bold">{selectedBooking.travelDate}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Boarding &amp; Pickup Point:</span>
                <span className="font-semibold">{selectedBooking.pickupLocation}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Guest Special Request:</span>
                <span className="italic text-slate-700 dark:text-slate-300">{selectedBooking.specialNotes}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Billing &amp; Net Payout:</span>
                <span className="font-mono font-bold text-emerald-600">
                  ₹{selectedBooking.grossAmount.toLocaleString('en-IN')} (Gross) → ₹{selectedBooking.netPayout.toLocaleString('en-IN')} (Net Payout)
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500">Booking Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(selectedBooking.bookingStatus)}`}>
                  {selectedBooking.bookingStatus}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <a
                href={`mailto:${selectedBooking.customerEmail}?subject=Regarding%20your%20PCTE%20Travel%20Booking%20${selectedBooking.bookingRef}`}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <FiMail /> Email Customer
              </a>
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg bg-[#0F2942] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#E11D48] transition"
              >
                Close File
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AgencyBookings;
