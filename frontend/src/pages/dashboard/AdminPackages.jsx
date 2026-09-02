import { useState, useEffect } from 'react';
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiCheck, FiX,
  FiMapPin, FiClock, FiUsers, FiDollarSign, FiImage,
  FiAlertCircle, FiRefreshCw, FiEye
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';
import { mockPackages } from '../../data/mockData.js';

const CATEGORIES = [
  'Weekend Trips',
  'Trekking & Camps',
  'Leisure & Luxury',
  'Nearby Getaways',
  'Adventure',
  'Spiritual',
];

const AdminPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const initialForm = {
    title: '',
    destination: '',
    price: '',
    discountPrice: '',
    durationDays: 2,
    durationNights: 1,
    totalSeats: 30,
    availableSeats: 30,
    category: 'Weekend Trips',
    images: [''],
    description: '',
    isActive: true,
  };
  const [formData, setFormData] = useState(initialForm);

  // Fetch all packages
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/packages/admin/all');
      if (res.data.data && res.data.data.length > 0) {
        setPackages(res.data.data);
      } else {
        // Fallback to public packages or mock data
        const pubRes = await api.get('/packages');
        if (pubRes.data.data && pubRes.data.data.length > 0) {
          setPackages(pubRes.data.data);
        } else {
          setPackages(mockPackages);
        }
      }
    } catch (err) {
      console.warn('Fallback to local package catalog:', err.message);
      try {
        const stored = localStorage.getItem('travelagency_packages_v10');
        setPackages(stored ? JSON.parse(stored) : mockPackages);
      } catch {
        setPackages(mockPackages);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Quick Seat Updater
  const handleQuickSeatChange = async (pkgId, delta) => {
    const target = packages.find(p => p._id === pkgId || p.id === pkgId);
    if (!target) return;

    const currentSeats = target.availableSeats !== undefined ? target.availableSeats : (target.totalSeats || 30);
    const newSeats = Math.max(0, Math.min(target.totalSeats || 50, currentSeats + delta));

    // Optimistic UI update
    setPackages(prev =>
      prev.map(p => (p._id === pkgId || p.id === pkgId) ? { ...p, availableSeats: newSeats } : p)
    );

    try {
      if (target._id) {
        await api.put(`/packages/${target._id}`, { availableSeats: newSeats });
      }
      toast.success(`Seats updated for ${target.title}: ${newSeats} remaining`);
    } catch (err) {
      console.warn('Local update fallback:', err.message);
      toast.success(`Seats updated: ${newSeats} remaining`);
    }
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingPkg(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (pkg) => {
    setEditingPkg(pkg);
    setFormData({
      title: pkg.title || '',
      destination: pkg.destination || '',
      price: pkg.price || '',
      discountPrice: pkg.discountPrice || '',
      durationDays: pkg.durationDays || 2,
      durationNights: pkg.durationNights || 1,
      totalSeats: pkg.totalSeats || 30,
      availableSeats: pkg.availableSeats !== undefined ? pkg.availableSeats : (pkg.totalSeats || 30),
      category: pkg.category || 'Weekend Trips',
      images: pkg.images && pkg.images.length > 0 ? pkg.images : [''],
      description: pkg.description || '',
      isActive: pkg.isActive !== false,
    });
    setIsModalOpen(true);
  };

  // Delete Package
  const handleDelete = async (pkgId, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const target = packages.find(p => p._id === pkgId || p.id === pkgId);
      if (target && target._id) {
        await api.delete(`/packages/${target._id}`);
      }
      setPackages(prev => prev.filter(p => p._id !== pkgId && p.id !== pkgId));
      toast.success(`Tour package "${title}" removed successfully.`);
    } catch (err) {
      // Fallback
      setPackages(prev => prev.filter(p => p._id !== pkgId && p.id !== pkgId));
      toast.success(`Tour package "${title}" removed.`);
    }
  };

  // Save / Update Package Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.destination.trim() || !formData.price) {
      toast.error('Please fill in Title, Destination, and Price.');
      return;
    }

    setSaving(true);
    const payload = {
      ...formData,
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
      durationDays: Number(formData.durationDays) || 1,
      durationNights: Number(formData.durationNights) || 0,
      totalSeats: Number(formData.totalSeats) || 30,
      availableSeats: Number(formData.availableSeats) !== undefined ? Number(formData.availableSeats) : Number(formData.totalSeats),
      images: formData.images.filter(img => img && img.trim().length > 0),
    };

    if (payload.images.length === 0) {
      payload.images = ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'];
    }

    try {
      if (editingPkg) {
        // Edit existing
        const targetId = editingPkg._id || editingPkg.id;
        let updated;
        try {
          const res = await api.put(`/packages/${targetId}`, payload);
          updated = res.data.data;
        } catch {
          updated = { ...editingPkg, ...payload };
        }
        setPackages(prev => prev.map(p => (p._id === targetId || p.id === targetId) ? { ...p, ...updated } : p));
        toast.success(`"${payload.title}" updated successfully!`);
      } else {
        // Create new
        let created;
        try {
          const res = await api.post('/packages', payload);
          created = res.data.data;
        } catch {
          created = { ...payload, _id: `pkg_${Date.now()}` };
        }
        setPackages(prev => [created, ...prev]);
        toast.success(`New package "${payload.title}" added successfully!`);
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to save package. Please check inputs.');
    } finally {
      setSaving(false);
    }
  };

  // Filtered packages
  const filtered = packages.filter(p => {
    const matchSearch =
      (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.destination || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded bg-[#E11D48] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
              Inventory &amp; Seats Desk
            </span>
            <span className="text-xs text-slate-400 font-bold">
              {packages.length} Total Packages
            </span>
          </div>
          <h1 className="font-display text-2xl font-black text-slate-900 dark:text-white">
            Tour Packages &amp; Seat Allocations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Add new tours, update available seats, modify prices, or delete outdated itineraries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchPackages}
            title="Refresh List"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F1D30] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} size={16} />
          </button>
          
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#9B1C1C] hover:from-red-600 hover:to-red-800 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-red-950/30 transition hover:scale-105 active:scale-95"
          >
            <FiPlus size={16} />
            <span>Add New Tour Package</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-sm">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tours or destinations..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#E11D48]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                selectedCategory === cat
                  ? 'bg-[#0F2942] text-white dark:bg-white dark:text-[#0F2942]'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Packages Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E11D48] border-t-transparent" />
          <p className="mt-3 text-xs text-slate-400 font-bold uppercase">Loading Tour Catalog...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-12 text-center">
          <FiAlertCircle className="mx-auto text-4xl text-amber-500 mb-3" />
          <h3 className="font-bold text-slate-800 dark:text-white text-base">No Tour Packages Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or click &quot;Add New Tour Package&quot; to publish your first itinerary.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0F2942] hover:bg-[#1B1464] px-4 py-2 text-xs font-bold text-white shadow"
          >
            <FiPlus /> Add Package
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((pkg) => {
            const pkgId = pkg._id || pkg.id;
            const img = (pkg.images && pkg.images[0]) || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
            const total = pkg.totalSeats || 30;
            const avail = pkg.availableSeats !== undefined ? pkg.availableSeats : total;
            const percentRemaining = Math.round((avail / total) * 100);

            return (
              <div
                key={pkgId}
                className="group relative flex flex-col rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200"
              >
                {/* Image & Badges */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={img}
                    alt={pkg.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Top Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-lg bg-black/60 backdrop-blur-md border border-white/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                      {pkg.category || 'Weekend Tour'}
                    </span>
                  </div>

                  {/* Active Status */}
                  <div className="absolute top-3 right-3">
                    <span className={`rounded-lg px-2 py-0.5 text-[10px] font-black uppercase ${
                      pkg.isActive !== false
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      {pkg.isActive !== false ? 'Active' : 'Draft'}
                    </span>
                  </div>

                  {/* Destination & Price on Image Bottom */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-200 font-medium">
                        <FiMapPin size={12} className="text-amber-400" />
                        <span className="truncate max-w-[170px]">{pkg.destination}</span>
                      </div>
                      <h3 className="font-display text-base font-black text-white leading-tight truncate max-w-[200px]">
                        {pkg.title}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase text-slate-300">Price</div>
                      <div className="font-black text-amber-300 text-sm">
                        ₹{pkg.price?.toLocaleString('en-IN') || 'On Req'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  
                  {/* Duration & Highlights */}
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-1.5 font-medium">
                      <FiClock className="text-[#E11D48]" />
                      <span>
                        {pkg.durationDays ? `${pkg.durationNights || 1}N / ${pkg.durationDays}D` : '2 Days'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Total Capacity: <b>{total} Seats</b>
                    </div>
                  </div>

                  {/* ⚡ REAL-TIME SEAT CONTROL WIDGET */}
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                        <FiUsers className="text-blue-500" />
                        <span>Available Seats:</span>
                      </span>
                      <span className={`font-black text-xs px-2 py-0.5 rounded-md ${
                        avail === 0
                          ? 'bg-red-500 text-white'
                          : avail <= 5
                          ? 'bg-amber-500 text-white animate-pulse'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {avail} / {total} Seats Left
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          avail === 0
                            ? 'bg-red-500'
                            : avail <= 5
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percentRemaining}%` }}
                      />
                    </div>

                    {/* Quick + / - Adjuster */}
                    <div className="flex items-center justify-between pt-1 gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickSeatChange(pkgId, -1)}
                        disabled={avail <= 0}
                        className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 text-xs font-black text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-30"
                      >
                        - 1 Seat
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickSeatChange(pkgId, 1)}
                        disabled={avail >= total}
                        className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 text-xs font-black text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-30"
                      >
                        + 1 Seat
                      </button>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleOpenEdit(pkg)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 py-2 text-xs font-bold text-slate-800 dark:text-white hover:bg-[#0F2942] hover:text-white dark:hover:bg-white dark:hover:text-[#0F2942] transition"
                    >
                      <FiEdit2 size={13} />
                      <span>Edit Package</span>
                    </button>

                    <button
                      onClick={() => handleDelete(pkgId, pkg.title)}
                      title="Delete Package"
                      className="rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 p-2 text-[#E11D48] hover:bg-[#E11D48] hover:text-white transition"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* ADD / EDIT PACKAGE MODAL                                     */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#0F2942] border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden my-8 text-slate-900 dark:text-white">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0F2942] via-[#1B1464] to-[#9B1C1C] px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="font-display font-black text-lg">
                  {editingPkg ? 'Edit Tour Package' : 'Add New Tour Package'}
                </h3>
                <p className="text-xs text-slate-200">
                  Configure tour destination, prices, photos, and seat allocations.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-white/80 hover:bg-white/20 hover:text-white"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Tour Package Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Mussoorie – Kempty Water Fall"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#E11D48]"
                  />
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Destination Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="e.g. Mussoorie & Kempty Falls, Uttarakhand"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#E11D48]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Tour Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#E11D48]"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Price per Person (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 3800"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#E11D48]"
                  />
                </div>

                {/* Discounted Price */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Discount Price (Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    placeholder="e.g. 3499"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#E11D48]"
                  />
                </div>

                {/* Duration Nights & Days */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Duration Nights
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.durationNights}
                    onChange={(e) => setFormData({ ...formData, durationNights: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#E11D48]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Duration Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#E11D48]"
                  />
                </div>

                {/* ⚡ SEAT CONFIGURATION */}
                <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 p-3.5 md:col-span-2">
                  <div className="text-xs font-bold uppercase text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-1.5">
                    <FiUsers /> Seat Allocation Settings
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Total Bus / Tour Seats
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={formData.totalSeats}
                        onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#E11D48]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Available Remaining Seats
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={formData.availableSeats}
                        onChange={(e) => setFormData({ ...formData, availableSeats: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#E11D48]"
                      />
                    </div>
                  </div>
                </div>

                {/* Image URL */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.images[0] || ''}
                    onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#E11D48]"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-300 mb-1">
                    Tour Highlights &amp; Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed tour itinerary, sightseeing spots, inclusions..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#E11D48]"
                  />
                </div>

              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-gradient-to-r from-[#E11D48] to-[#9B1C1C] hover:from-red-600 hover:to-red-800 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-950/30 transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingPkg ? 'Update Package' : 'Publish Tour Package'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPackages;
