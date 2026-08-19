import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiMapPin, FiStar, FiHome } from 'react-icons/fi';
import { mockHotels } from '../../data/mockData.js';

const emptyForm = {
  name: '',
  description: '',
  propertyType: 'Resort',
  starRating: 4,
  city: '',
  state: 'Himachal Pradesh',
  startingPrice: '3200',
  image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
};

const AgencyHotels = () => {
  const [hotels, setHotels] = useState(mockHotels);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      const newHotel = {
        _id: 'htl_' + Date.now(),
        ...form,
        startingPrice: Number(form.startingPrice),
        starRating: Number(form.starRating),
        status: 'approved'
      };
      setHotels(prev => [newHotel, ...prev]);
      toast.success('Hotel listing published successfully!');
      setForm(emptyForm);
      setShowForm(false);
    } catch {
      toast.error('Could not create hotel listing');
    }
  };

  const remove = (id) => {
    if (!window.confirm('Delete this hotel listing?')) return;
    setHotels(prev => prev.filter(h => h._id !== id));
    toast.success('Hotel deleted');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">Hospitality &amp; Stays Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage mountain chalets, riverside resorts, homestays, and inventory availability.</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1.5 rounded-xl bg-[#0F2942] hover:bg-[#E11D48] text-white px-4 py-2 text-xs font-bold shadow transition-colors"
        >
          <FiPlus /> {showForm ? 'Cancel' : 'Add New Stay / Resort'}
        </button>
      </div>

      {/* Creation Form */}
      {showForm && (
        <form onSubmit={submit} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Register New Property / Resort Listing
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Property Name *</label>
              <input required placeholder="e.g. Cedar Pine Chalet & Spa" value={form.name} onChange={update('name')} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs outline-none focus:border-[#0F2942]" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">City / Valley *</label>
              <input required placeholder="e.g. Jibhi / Manali" value={form.city} onChange={update('city')} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs outline-none focus:border-[#0F2942]" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Property Description *</label>
              <textarea required rows={3} placeholder="Describe mountain views, wooden architecture, amenities..." value={form.description} onChange={update('description')} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs outline-none focus:border-[#0F2942]" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Property Type</label>
              <select value={form.propertyType} onChange={update('propertyType')} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs outline-none">
                {['Resorts', 'Hotels', 'Homestays', 'Hostels', 'Camping', 'Villas'].map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Starting Nightly Rate (₹) *</label>
              <input required type="number" placeholder="3200" value={form.startingPrice} onChange={update('startingPrice')} className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs outline-none focus:border-[#0F2942]" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="submit" className="rounded-xl bg-[#0F2942] hover:bg-[#E11D48] px-6 py-2.5 text-xs font-bold text-white shadow transition-colors">
              Publish Property Listing
            </button>
          </div>
        </form>
      )}

      {/* Hotel Cards List */}
      <div className="space-y-3">
        {hotels.map((h) => (
          <div key={h._id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={h.images?.[0] || h.image} alt={h.name} className="h-14 w-20 rounded-xl object-cover shadow shrink-0" />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">{h.name}</h4>
                  <span className="text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded flex items-center gap-0.5">
                    <FiStar size={10} className="fill-amber-400" /> {h.starRating || 4.5}★
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  <FiMapPin className="inline text-[#E11D48]" /> {h.city}, {h.state} · Category: <b>{h.category || h.propertyType}</b>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-0 pt-2 md:pt-0 border-slate-100 dark:border-slate-800">
              <div className="text-right text-xs">
                <span className="text-[10px] text-slate-400 block font-bold">Starting Price</span>
                <span className="font-mono text-sm font-black text-slate-900 dark:text-white">₹{h.startingPrice?.toLocaleString('en-IN')}<span className="text-[10px] text-slate-400 font-normal"> /night</span></span>
              </div>

              <button
                onClick={() => remove(h._id)}
                className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Delete Listing"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AgencyHotels;
