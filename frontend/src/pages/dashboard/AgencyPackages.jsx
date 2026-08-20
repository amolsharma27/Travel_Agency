import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiMapPin, FiCalendar, FiUsers, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import api from '../../api/axios.js';
import { mockPackages } from '../../data/mockData.js';

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='100%25' height='100%25' fill='%231e293b'/%3E%3Cpath d='M360 210a40 40 0 1 0 80 0a40 40 0 1 0-80 0' fill='%23475569'/%3E%3Cpath d='M200 380l160-140l100 80l140-120l120 180z' fill='%23334155'/%3E%3Ctext x='50%25' y='85%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='20' font-weight='600'%3EPCTE Travel%3C/text%3E%3C/svg%3E";

const emptyForm = {
  title: '',
  destination: '',
  description: '',
  price: '',
  durationDays: '3',
  durationNights: '2',
  totalSeats: '20',
  category: 'Group Tours',
  travelMode: 'AC Deluxe Coach',
  meetingPoint: 'Ludhiana / Chandigarh ISBT',
  image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=600&q=80'
};

const AgencyPackages = () => {
  const [packages, setPackages] = useState(mockPackages);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get('/packages/agency/mine');
      if (Array.isArray(data?.data) && data.data.length > 0) {
        setPackages(data.data);
      }
    } catch {
      // fallback to initialPackages
    }
  };

  useEffect(() => { load(); }, []);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      const newPkg = {
        _id: 'pkg_' + Date.now(),
        ...form,
        images: [form.image || 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=600&q=80'],
        duration: `${form.durationDays} Days / ${form.durationNights} Nights`,
        price: Number(form.price),
        totalSeats: Number(form.totalSeats),
        availableSeats: Number(form.totalSeats),
        status: 'approved'
      };
      setPackages(prev => [newPkg, ...prev]);
      toast.success('Tour Package created and published successfully!');
      setForm(emptyForm);
      setShowForm(false);
    } catch {
      toast.error('Could not create package');
    }
  };

  const remove = (id) => {
    if (!window.confirm('Delete this tour package listing?')) return;
    setPackages(prev => prev.filter(p => p._id !== id));
    toast.success('Package deleted');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">Agency Tour Packages</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage live departure listings, seat allocations, and day-wise itineraries.</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1.5 rounded-xl bg-[#0F2942] hover:bg-[#E11D48] text-white px-4 py-2 text-xs font-bold shadow transition-colors"
        >
          <FiPlus /> {showForm ? 'Cancel' : 'Create New Package'}
        </button>
      </div>

      {/* Creation Form */}
      {showForm && (
        <form onSubmit={submit} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Add New Tour Departure Package
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Package Title *</label>
              <input required placeholder="e.g. Kasol & Tosh Alpine Village Weekend" value={form.title} onChange={update('title')} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs outline-none focus:border-[#0F2942]" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Destination &amp; Region *</label>
              <input required placeholder="e.g. Kasol, Parvati Valley, HP" value={form.destination} onChange={update('destination')} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs outline-none focus:border-[#0F2942]" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Package Summary &amp; Highlights *</label>
              <textarea required rows={3} placeholder="Describe the tour itinerary, bonfires, guided treks..." value={form.description} onChange={update('description')} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs outline-none focus:border-[#0F2942]" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Price per Person (₹) *</label>
              <input required type="number" placeholder="5999" value={form.price} onChange={update('price')} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs outline-none focus:border-[#0F2942]" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Total Bus/Vehicle Seats *</label>
              <input required type="number" placeholder="20" value={form.totalSeats} onChange={update('totalSeats')} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs outline-none focus:border-[#0F2942]" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
              <select value={form.category} onChange={update('category')} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs outline-none">
                {['Group Tours', 'Adventure Tours', 'Private Tours', 'Spiritual', 'Heritage'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Meeting &amp; Boarding Point</label>
              <input placeholder="Ludhiana / Chandigarh ISBT" value={form.meetingPoint} onChange={update('meetingPoint')} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs outline-none focus:border-[#0F2942]" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Cover Image URL</label>
              <input placeholder="https://images.unsplash.com/..." value={form.image} onChange={update('image')} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs outline-none focus:border-[#0F2942]" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="submit" className="rounded-xl bg-[#0F2942] hover:bg-[#E11D48] px-6 py-2.5 text-xs font-bold text-white shadow transition-colors">
              Publish Package Listing
            </button>
          </div>
        </form>
      )}

      {/* Package Cards List */}
      <div className="space-y-3">
        {packages.map((p) => {
          const imgSrc = p.images?.[0] || p.image || p.coverImage || FALLBACK_IMAGE;
          return (
            <div key={p._id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src={imgSrc} 
                  alt={p.title} 
                  onError={(e) => {
                    if (e.currentTarget.dataset.fallbackApplied) return;
                    e.currentTarget.dataset.fallbackApplied = 'true';
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="h-14 w-20 rounded-xl object-cover shadow shrink-0 bg-slate-900" 
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">{p.title}</h4>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded uppercase">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    <FiMapPin className="inline text-[#E11D48]" /> {p.destination} · {p.duration || `${p.durationDays} Days / ${p.durationNights} Nights`} · Category: <b>{p.category}</b>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-0 pt-2 md:pt-0 border-slate-100 dark:border-slate-800">
                <div className="text-right text-xs">
                  <span className="text-[10px] text-slate-400 block font-bold">Price per Person</span>
                  <span className="font-mono text-sm font-black text-slate-900 dark:text-white">₹{p.price?.toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={() => remove(p._id)}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title="Delete Listing"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default AgencyPackages;
