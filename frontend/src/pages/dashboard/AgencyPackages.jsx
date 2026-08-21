import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiPlus, FiTrash2, FiMapPin, FiCalendar, FiUsers, FiDollarSign,
  FiCheckCircle, FiEdit, FiEye, FiSearch, FiFilter, FiImage,
  FiClock, FiStar, FiX, FiSave, FiCheck
} from 'react-icons/fi';
import api from '../../api/axios.js';
import { mockPackages } from '../../data/mockData.js';

const initialAgencyTours = [
  {
    _id: 'pkg_101',
    title: 'Himachal Group Tour: Jibhi, Tirthan Valley & Jalori Pass',
    destination: 'Jibhi & Tirthan Valley, Himachal Pradesh',
    tourType: 'Group Tour',
    category: 'Group Tours',
    description: 'Scenic Himalayan mountain exploration. Experience lush pine forests of Tirthan Valley, wooden cottages, Jalori Pass at 10,800 ft, and Serolsar Lake hike.',
    images: ['https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'],
    price: 8500,
    discountPrice: 5999,
    discountPercent: 29,
    duration: '3 Days / 2 Nights',
    durationDays: 3,
    durationNights: 2,
    totalSeats: 24,
    bookedSeats: 15,
    availableSeats: 9,
    rating: 4.9,
    status: 'Active',
    inclusions: ['Transportation', 'Hotel', 'Meals', 'Guide', 'Activities']
  },
  {
    _id: 'pkg_102',
    title: 'Kashmir Paradise Group Tour: Srinagar, Gulmarg & Pahalgam',
    destination: 'Srinagar, Gulmarg & Pahalgam, Kashmir',
    tourType: 'Group Tour',
    category: 'Group Tours',
    description: 'Experience heaven on earth. Dal Lake shikara ride, heritage houseboats, Gulmarg Gondola over snow ridges, and Betaab Valley.',
    images: ['https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80'],
    price: 18500,
    discountPrice: 14999,
    discountPercent: 19,
    duration: '5 Days / 4 Nights',
    durationDays: 5,
    durationNights: 4,
    totalSeats: 20,
    bookedSeats: 14,
    availableSeats: 6,
    rating: 4.95,
    status: 'Active',
    inclusions: ['Transportation', 'Hotel', 'Meals', 'Guide', 'Activities']
  },
  {
    _id: 'pkg_103',
    title: 'Rajasthan Royal Heritage Group Tour: Jaipur & Jaisalmer',
    destination: 'Jaipur, Jodhpur & Jaisalmer, Rajasthan',
    tourType: 'Group Tour',
    category: 'Heritage',
    description: 'Thar desert camel safaris, Sam sand dunes camping, Amer fort, and Mehrangarh palace heritage tour.',
    images: ['https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'],
    price: 12500,
    discountPrice: 9800,
    discountPercent: 22,
    duration: '4 Days / 3 Nights',
    durationDays: 4,
    durationNights: 3,
    totalSeats: 18,
    bookedSeats: 12,
    availableSeats: 6,
    rating: 4.88,
    status: 'Active',
    inclusions: ['Transportation', 'Hotel', 'Meals', 'Activities']
  },
  {
    _id: 'pkg_104',
    title: 'Spiti Valley 4x4 Snow Leopard Expedition',
    destination: 'Kaza & Spiti Valley, Himachal Pradesh',
    tourType: 'Adventure Tour',
    category: 'Adventure',
    description: 'High altitude Himalayan road trip in 4x4 SUVs across Key Monastery, Chandratal Lake, and Pin Valley.',
    images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'],
    price: 19500,
    discountPrice: 16500,
    discountPercent: 15,
    duration: '6 Days / 5 Nights',
    durationDays: 6,
    durationNights: 5,
    totalSeats: 12,
    bookedSeats: 0,
    availableSeats: 12,
    rating: 5.0,
    status: 'Draft',
    inclusions: ['Transportation', 'Hotel', 'Meals', 'Guide']
  }
];

const emptyNewTour = {
  title: '',
  destination: '',
  tourType: 'Group Tour',
  description: '',
  price: '',
  discount: 0,
  finalPrice: '',
  durationDays: 3,
  durationNights: 2,
  startDate: '',
  endDate: '',
  availableSeats: 20,
  inclusions: ['Transportation', 'Hotel', 'Meals', 'Guide'],
  coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
  galleryImages: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
};

const AgencyPackages = () => {
  const [packages, setPackages] = useState(initialAgencyTours);
  const [filterTab, setFilterTab] = useState('All'); // 'All' | 'Active' | 'Draft' | 'Expired'
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTourInspect, setSelectedTourInspect] = useState(null);
  const [form, setForm] = useState(emptyNewTour);

  // Calculate final price dynamically
  const handlePriceChange = (priceVal, discountVal) => {
    const p = Number(priceVal) || 0;
    const d = Number(discountVal) || 0;
    const finalP = d > 0 ? Math.round(p - (p * d) / 100) : p;
    setForm(prev => ({ ...prev, price: priceVal, discount: discountVal, finalPrice: finalP }));
  };

  const toggleInclusion = (service) => {
    setForm(prev => {
      const exists = prev.inclusions.includes(service);
      return {
        ...prev,
        inclusions: exists ? prev.inclusions.filter(s => s !== service) : [...prev.inclusions, service]
      };
    });
  };

  const handleSaveTour = (isPublish) => {
    if (!form.title || !form.destination || !form.price) {
      toast.error('Please fill in title, destination, and pricing');
      return;
    }

    const newTour = {
      _id: 'pkg_' + Date.now(),
      title: form.title,
      destination: form.destination,
      tourType: form.tourType,
      category: form.tourType,
      description: form.description,
      price: Number(form.price),
      discountPrice: Number(form.finalPrice) || Number(form.price),
      discountPercent: Number(form.discount) || 0,
      duration: `${form.durationDays} Days / ${form.durationNights} Nights`,
      durationDays: Number(form.durationDays),
      durationNights: Number(form.durationNights),
      totalSeats: Number(form.availableSeats),
      bookedSeats: 0,
      availableSeats: Number(form.availableSeats),
      rating: 5.0,
      status: isPublish ? 'Active' : 'Draft',
      images: [form.coverImage || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'],
      inclusions: form.inclusions
    };

    setPackages(prev => [newTour, ...prev]);
    toast.success(isPublish ? 'Tour package published live!' : 'Tour draft saved successfully');
    setShowAddModal(false);
    setForm(emptyNewTour);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this tour package listing?')) return;
    setPackages(prev => prev.filter(p => p._id !== id));
    toast.success('Tour listing removed');
  };

  const filtered = packages.filter(p => {
    const matchFilter = filterTab === 'All' || p.status === filterTab;
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.destination.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">
            Tour Packages Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your agency's group departures, seat allocations, itineraries, and live pricing.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[#0F2942] hover:bg-[#E11D48] text-white px-4 py-2.5 text-xs font-bold transition shadow"
        >
          <FiPlus /> Add New Tour Package
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-[#0F1D30] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex gap-1 overflow-x-auto">
          {['All', 'Active', 'Draft', 'Expired'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                filterTab === tab
                  ? 'bg-[#0F2942] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab} Packages
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <FiSearch className="absolute left-3 top-2.5 text-slate-400 text-xs" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by tour name or destination..."
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
          />
        </div>
      </div>

      {/* Tour Packages Table / Cards */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3">Tour Details</th>
                <th className="pb-3">Destination</th>
                <th className="pb-3">Duration</th>
                <th className="pb-3">Price / Person</th>
                <th className="pb-3">Seats (Booked / Total)</th>
                <th className="pb-3">Rating</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((tour) => (
                <tr key={tour._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={tour.images[0]}
                        alt={tour.title}
                        className="h-12 w-16 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div className="max-w-[200px]">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{tour.title}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{tour.tourType}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-slate-600 dark:text-slate-300">{tour.destination}</td>
                  <td className="py-3.5 text-slate-500 whitespace-nowrap">{tour.duration}</td>
                  <td className="py-3.5">
                    <p className="font-mono font-bold text-slate-900 dark:text-white">₹{tour.discountPrice.toLocaleString('en-IN')}</p>
                    {tour.discountPercent > 0 && (
                      <p className="text-[10px] text-emerald-600 font-semibold">{tour.discountPercent}% Off (₹{tour.price})</p>
                    )}
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="font-bold text-slate-900 dark:text-white">{tour.bookedSeats}</span>
                      <span className="text-slate-400">/</span>
                      <span className="text-slate-600 dark:text-slate-400">{tour.totalSeats}</span>
                      <span className="text-[10px] text-emerald-600 font-semibold ml-1">({tour.availableSeats} left)</span>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className="font-bold text-amber-500">★ {tour.rating}</span>
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      tour.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {tour.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedTourInspect(tour)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-[#0F2942] hover:text-white transition"
                        title="View Tour"
                      >
                        <FiEye size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(tour._id)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 transition"
                        title="Delete Tour"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-xs text-slate-500">
            No tour packages found matching your criteria.
          </div>
        )}
      </div>

      {/* COMPLETE "ADD NEW TOUR" MULTI-STEP MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#E11D48]">PCTE Agency Tour Builder</span>
                <h3 className="font-display text-lg font-black">Publish New Tour Departure</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-xs font-bold hover:bg-slate-200 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {/* 1. Tour Information */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">1. Tour Information</span>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold block mb-1">Tour Name *</label>
                    <input
                      required
                      placeholder="e.g. Manali Snow Peak & Solang Valley Weekend"
                      value={form.title}
                      onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs outline-none focus:border-[#0F2942]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Destination *</label>
                    <input
                      required
                      placeholder="e.g. Manali & Solang, HP"
                      value={form.destination}
                      onChange={(e) => setForm(prev => ({ ...prev, destination: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs outline-none focus:border-[#0F2942]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Tour Type</label>
                    <select
                      value={form.tourType}
                      onChange={(e) => setForm(prev => ({ ...prev, tourType: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs outline-none"
                    >
                      {['Group Tour', 'Private Tour', 'Adventure Tour', 'Spiritual Tour', 'Weekend Getaway'].map(t => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold block mb-1">Description &amp; Itinerary Highlights</label>
                    <textarea
                      rows={3}
                      placeholder="Enter full trip overview, bonfire details, coordinator assistance..."
                      value={form.description}
                      onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs outline-none focus:border-[#0F2942]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Pricing */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">2. Pricing &amp; Discounts</span>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold block mb-1">Price per Person (₹) *</label>
                    <input
                      type="number"
                      placeholder="8500"
                      value={form.price}
                      onChange={(e) => handlePriceChange(e.target.value, form.discount)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono outline-none focus:border-[#0F2942]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Discount (%)</label>
                    <input
                      type="number"
                      placeholder="20"
                      value={form.discount}
                      onChange={(e) => handlePriceChange(form.price, e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono outline-none focus:border-[#0F2942]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Final Selling Price (₹)</label>
                    <input
                      disabled
                      value={form.finalPrice || form.price || ''}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 p-2 text-xs font-mono font-bold text-emerald-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Tour Details & Capacity */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">3. Tour Duration &amp; Seat Capacity</span>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold block mb-1">Duration Days</label>
                    <input
                      type="number"
                      value={form.durationDays}
                      onChange={(e) => setForm(prev => ({ ...prev, durationDays: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Duration Nights</label>
                    <input
                      type="number"
                      value={form.durationNights}
                      onChange={(e) => setForm(prev => ({ ...prev, durationNights: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Total Available Seats</label>
                    <input
                      type="number"
                      value={form.availableSeats}
                      onChange={(e) => setForm(prev => ({ ...prev, availableSeats: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Included Services */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">4. Included Services</span>
                <div className="flex flex-wrap gap-2">
                  {['Transportation', 'Hotel', 'Meals', 'Guide', 'Activities'].map((service) => {
                    const isChecked = form.inclusions.includes(service);
                    return (
                      <button
                        type="button"
                        key={service}
                        onClick={() => toggleInclusion(service)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                          isChecked
                            ? 'bg-[#0F2942] text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {isChecked ? <FiCheck size={12} /> : null} {service}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Media Images */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">5. Cover &amp; Gallery Media</span>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold block mb-1">Cover Image URL</label>
                    <input
                      value={form.coverImage}
                      onChange={(e) => setForm(prev => ({ ...prev, coverImage: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1">Gallery Image URL</label>
                    <input
                      value={form.galleryImages}
                      onChange={(e) => setForm(prev => ({ ...prev, galleryImages: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleSaveTour(false)}
                className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSaveTour(true)}
                className="rounded-lg bg-[#0F2942] hover:bg-[#E11D48] px-5 py-2 text-xs font-black text-white shadow transition"
              >
                Publish Tour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT TOUR MODAL */}
      {selectedTourInspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#E11D48]">Tour Overview</span>
                <h3 className="font-display text-base font-black truncate max-w-xs">{selectedTourInspect.title}</h3>
              </div>
              <button onClick={() => setSelectedTourInspect(null)} className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-xs font-bold">
                ✕
              </button>
            </div>

            <img
              src={selectedTourInspect.images[0]}
              alt={selectedTourInspect.title}
              className="h-40 w-full rounded-xl object-cover border border-slate-200 dark:border-slate-700"
            />

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                <span className="text-slate-500">Destination:</span>
                <span className="font-bold">{selectedTourInspect.destination}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                <span className="text-slate-500">Price / Person:</span>
                <span className="font-mono font-bold text-emerald-600">₹{selectedTourInspect.discountPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                <span className="text-slate-500">Seat Capacity:</span>
                <span className="font-mono font-bold">{selectedTourInspect.bookedSeats} booked / {selectedTourInspect.totalSeats} total</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed pt-1">
                {selectedTourInspect.description}
              </p>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedTourInspect(null)}
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

export default AgencyPackages;
