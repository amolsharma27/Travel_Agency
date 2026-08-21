import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiPlus, FiTrash2, FiMapPin, FiStar, FiHome, FiEdit, FiEye,
  FiSearch, FiCheck, FiSliders, FiDollarSign, FiUsers
} from 'react-icons/fi';
import api from '../../api/axios.js';
import { mockHotels } from '../../data/mockData.js';

const initialStays = [
  {
    _id: 'htl_01',
    name: 'Snow Valley Himalayan Cedar Resort & Spa',
    city: 'Manali',
    state: 'Himachal Pradesh',
    propertyType: 'Resort',
    starRating: 4.8,
    startingPrice: 2899,
    availableRooms: 12,
    totalRooms: 20,
    roomTypes: ['Deluxe Pine-View Balcony Room', 'Executive Himalayan Suite'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
    status: 'Active',
    rating: 4.9
  },
  {
    _id: 'htl_02',
    name: 'The Heritage Houseboat Floating Palace',
    city: 'Srinagar',
    state: 'Kashmir',
    propertyType: 'Houseboat',
    starRating: 4.9,
    startingPrice: 4500,
    availableRooms: 4,
    totalRooms: 6,
    roomTypes: ['Royal Cedar Suite with Dal Lake View'],
    images: ['https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80'],
    status: 'Active',
    rating: 4.95
  },
  {
    _id: 'htl_03',
    name: 'Tirthan Valley Riverside Wooden Chalet',
    city: 'Jibhi',
    state: 'Himachal Pradesh',
    propertyType: 'Cottage',
    starRating: 4.8,
    startingPrice: 2400,
    availableRooms: 8,
    totalRooms: 10,
    roomTypes: ['Riverside Alpine Wooden Cottage', 'Attic Family Loft'],
    images: ['https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80'],
    status: 'Active',
    rating: 4.85
  }
];

const emptyHotelForm = {
  name: '',
  city: '',
  state: 'Himachal Pradesh',
  propertyType: 'Resort',
  startingPrice: '3200',
  availableRooms: '10',
  totalRooms: '15',
  roomType: 'Deluxe Balcony Suite',
  image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  description: ''
};

const AgencyHotels = () => {
  const [hotels, setHotels] = useState(initialStays);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyHotelForm);
  const [selectedManageRooms, setSelectedManageRooms] = useState(null);

  const handleSaveHotel = (e) => {
    e.preventDefault();
    if (!form.name || !form.city || !form.startingPrice) {
      toast.error('Please enter property name, city, and pricing');
      return;
    }

    const newHtl = {
      _id: 'htl_' + Date.now(),
      name: form.name,
      city: form.city,
      state: form.state,
      propertyType: form.propertyType,
      startingPrice: Number(form.startingPrice),
      availableRooms: Number(form.availableRooms),
      totalRooms: Number(form.totalRooms),
      roomTypes: [form.roomType],
      images: [form.image],
      status: 'Active',
      rating: 5.0
    };

    setHotels(prev => [newHtl, ...prev]);
    toast.success('Hospitality stay listing published live!');
    setShowAddModal(false);
    setForm(emptyHotelForm);
  };

  const handleUpdateRooms = (id, newAvailable) => {
    setHotels(prev => prev.map(h => h._id === id ? { ...h, availableRooms: Number(newAvailable) } : h));
    setSelectedManageRooms(null);
    toast.success('Room inventory updated');
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this stay listing?')) return;
    setHotels(prev => prev.filter(h => h._id !== id));
    toast.success('Stay listing removed');
  };

  const filtered = hotels.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.city.toLowerCase().includes(search.toLowerCase()) ||
    h.propertyType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">
            Stays &amp; Hotels Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your mountain chalets, lakeside houseboats, resort room inventory, and nightly pricing.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[#0F2942] hover:bg-[#E11D48] text-white px-4 py-2.5 text-xs font-bold transition shadow"
        >
          <FiPlus /> Add New Stay / Resort
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-[#0F1D30] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400 text-xs" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stays by property name, city, type..."
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">
          Showing {filtered.length} Properties
        </span>
      </div>

      {/* Stays Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3">Property Name</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Room Types</th>
                <th className="pb-3">Price / Night</th>
                <th className="pb-3">Rooms (Available / Total)</th>
                <th className="pb-3">Rating</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((htl) => (
                <tr key={htl._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={htl.images[0]}
                        alt={htl.name}
                        className="h-12 w-16 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{htl.name}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{htl.propertyType}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-slate-600 dark:text-slate-300">{htl.city}, {htl.state}</td>
                  <td className="py-3.5 max-w-xs truncate text-slate-500">{htl.roomTypes.join(', ')}</td>
                  <td className="py-3.5 font-mono font-bold text-emerald-600">₹{htl.startingPrice.toLocaleString('en-IN')}</td>
                  <td className="py-3.5">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{htl.availableRooms}</span>
                    <span className="text-slate-400"> / {htl.totalRooms} rooms</span>
                  </td>
                  <td className="py-3.5">
                    <span className="font-bold text-amber-500">★ {htl.rating}</span>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                      {htl.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedManageRooms(htl)}
                        className="rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white px-2.5 py-1 text-[11px] font-bold transition shadow"
                      >
                        Manage Rooms
                      </button>
                      <button
                        onClick={() => handleDelete(htl._id)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 transition"
                        title="Delete"
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
      </div>

      {/* MANAGE ROOMS MODAL */}
      {selectedManageRooms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#E11D48]">Room Inventory Control</span>
                <h3 className="font-display text-sm font-black truncate max-w-[200px]">{selectedManageRooms.name}</h3>
              </div>
              <button onClick={() => setSelectedManageRooms(null)} className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Rooms:</span>
                <span className="font-bold font-mono">{selectedManageRooms.totalRooms} Rooms</span>
              </div>
              <div>
                <label className="text-xs font-bold block mb-1">Available Rooms for Booking</label>
                <input
                  type="number"
                  defaultValue={selectedManageRooms.availableRooms}
                  id="availRoomsInput"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono font-bold outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedManageRooms(null)}
                className="rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const val = document.getElementById('availRoomsInput')?.value;
                  handleUpdateRooms(selectedManageRooms._id, val);
                }}
                className="rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white px-4 py-1.5 text-xs font-bold shadow transition"
              >
                Save Availability
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW STAY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm overflow-y-auto">
          <form onSubmit={handleSaveHotel} className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#E11D48]">PCTE Hospitality Manager</span>
                <h3 className="font-display text-lg font-black">Register New Property</h3>
              </div>
              <button type="button" onClick={() => setShowAddModal(false)} className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Property Name *</label>
                <input
                  required
                  placeholder="e.g. Cedar Pine Chalet & Spa"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 outline-none focus:border-[#0F2942]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">City / Valley *</label>
                  <input
                    required
                    placeholder="e.g. Jibhi / Manali"
                    value={form.city}
                    onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Property Type</label>
                  <select
                    value={form.propertyType}
                    onChange={(e) => setForm(prev => ({ ...prev, propertyType: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 outline-none"
                  >
                    {['Resort', 'Homestay', 'Houseboat', 'Cottage', 'Glamping'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold block mb-1">Price / Night (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="3200"
                    value={form.startingPrice}
                    onChange={(e) => setForm(prev => ({ ...prev, startingPrice: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Total Rooms</label>
                  <input
                    type="number"
                    value={form.totalRooms}
                    onChange={(e) => setForm(prev => ({ ...prev, totalRooms: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Available Rooms</label>
                  <input
                    type="number"
                    value={form.availableRooms}
                    onChange={(e) => setForm(prev => ({ ...prev, availableRooms: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Primary Room Category</label>
                <input
                  placeholder="e.g. Deluxe Pine-View Balcony Room"
                  value={form.roomType}
                  onChange={(e) => setForm(prev => ({ ...prev, roomType: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 outline-none"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Cover Image URL</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white px-5 py-2 text-xs font-bold shadow transition"
              >
                Publish Stay Listing
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default AgencyHotels;
