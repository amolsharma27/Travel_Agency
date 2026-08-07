import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import api from '../../api/axios.js';

const emptyForm = {
  name: '', description: '', propertyType: 'Hotel', starRating: 3,
  address: '', city: '', state: '', country: 'India',
  'location.lat': '', 'location.lng': '',
};

const statusColor = {
  pending: 'bg-sand-400/20 text-sand-600',
  approved: 'bg-lagoon-50 text-lagoon-700 dark:bg-lagoon-700/20 dark:text-lagoon-300',
  rejected: 'bg-red-50 text-red-600 dark:bg-red-900/20',
};

const AgencyHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/hotels/owner/mine');
      setHotels(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        location: { lat: Number(form['location.lat']), lng: Number(form['location.lng']) },
      };
      await api.post('/hotels', payload);
      toast.success('Hotel submitted for admin approval');
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create hotel');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this hotel and all its rooms?')) return;
    await api.delete(`/hotels/${id}`);
    toast.success('Hotel deleted');
    load();
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">My hotels</h2>
        <button onClick={() => setShowForm((s) => !s)} className="flex items-center gap-1.5 rounded-lg bg-lagoon-500 px-4 py-2 text-sm font-semibold text-paper hover:bg-lagoon-600">
          <FiPlus /> {showForm ? 'Cancel' : 'Add hotel'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="mb-6 grid gap-3 rounded-xl2 border border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light p-5 shadow-card sm:grid-cols-2">
          <input required placeholder="Hotel name" value={form.name} onChange={update('name')} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm sm:col-span-2" />
          <textarea required placeholder="Description" value={form.description} onChange={update('description')} rows={2} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm sm:col-span-2" />
          <select value={form.propertyType} onChange={update('propertyType')} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm">
            {['Hotel', 'Resort', 'Villa', 'Apartment', 'Homestay', 'Hostel'].map((p) => <option key={p}>{p}</option>)}
          </select>
          <select value={form.starRating} onChange={update('starRating')} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm">
            {[1, 2, 3, 4, 5].map((s) => <option key={s} value={s}>{s} star</option>)}
          </select>
          <input required placeholder="Address" value={form.address} onChange={update('address')} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm sm:col-span-2" />
          <input required placeholder="City" value={form.city} onChange={update('city')} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
          <input required placeholder="State" value={form.state} onChange={update('state')} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
          <input required type="number" step="any" placeholder="Latitude" value={form['location.lat']} onChange={update('location.lat')} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
          <input required type="number" step="any" placeholder="Longitude" value={form['location.lng']} onChange={update('location.lng')} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
          <button className="rounded-lg bg-lagoon-500 py-2.5 text-sm font-semibold text-paper hover:bg-lagoon-600 sm:col-span-2">
            Submit for approval
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-ink/50 dark:text-paper/50">Loading…</p>
      ) : hotels.length === 0 ? (
        <div className="rounded-xl2 border border-dashed border-ink/15 dark:border-paper/20 py-16 text-center">
          <p className="font-display text-lg font-semibold">No hotels yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {hotels.map((h) => (
            <div key={h._id} className="flex items-center justify-between rounded-xl2 border border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light p-4 shadow-card">
              <div>
                <p className="font-medium">{h.name}</p>
                <p className="text-xs text-ink/50 dark:text-paper/50">{h.city}, {h.state} · ₹{h.startingPrice}/night · {h.starRating}★</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColor[h.status]}`}>{h.status}</span>
                <button onClick={() => remove(h._id)} className="text-red-400 hover:text-red-500"><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="mt-4 text-xs text-ink/40 dark:text-paper/40">
        Room types can be added from the hotel details page after approval (via the API — a dedicated
        "manage rooms" screen is a good next addition here).
      </p>
    </div>
  );
};

export default AgencyHotels;
