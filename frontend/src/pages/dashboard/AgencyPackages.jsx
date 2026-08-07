import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import api from '../../api/axios.js';

const emptyForm = {
  title: '', destination: '', description: '', price: '', durationDays: '', durationNights: '',
  totalSeats: '', category: 'Adventure', travelMode: 'Bus', meetingPoint: '',
};

const statusColor = {
  pending: 'bg-sand-400/20 text-sand-600',
  approved: 'bg-lagoon-50 text-lagoon-700 dark:bg-lagoon-700/20 dark:text-lagoon-300',
  rejected: 'bg-red-50 text-red-600 dark:bg-red-900/20',
};

const AgencyPackages = () => {
  const [packages, setPackages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/packages/agency/mine');
      setPackages(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/packages', form);
      toast.success('Package submitted for admin approval');
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create package');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this package?')) return;
    await api.delete(`/packages/${id}`);
    toast.success('Package deleted');
    load();
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">My packages</h2>
        <button onClick={() => setShowForm((s) => !s)} className="flex items-center gap-1.5 rounded-lg bg-lagoon-500 px-4 py-2 text-sm font-semibold text-paper hover:bg-lagoon-600">
          <FiPlus /> {showForm ? 'Cancel' : 'Add package'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="mb-6 grid gap-3 rounded-xl2 border border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light p-5 shadow-card sm:grid-cols-2">
          <input required placeholder="Title" value={form.title} onChange={update('title')} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
          <input required placeholder="Destination" value={form.destination} onChange={update('destination')} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
          <textarea required placeholder="Description" value={form.description} onChange={update('description')} rows={2} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm sm:col-span-2" />
          <input required type="number" placeholder="Price per person" value={form.price} onChange={update('price')} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
          <input required type="number" placeholder="Total seats" value={form.totalSeats} onChange={update('totalSeats')} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
          <input required type="number" placeholder="Duration (days)" value={form.durationDays} onChange={update('durationDays')} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
          <input required type="number" placeholder="Duration (nights)" value={form.durationNights} onChange={update('durationNights')} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
          <select value={form.category} onChange={update('category')} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm">
            {['Adventure', 'Historical', 'Beach', 'Nature', 'Cultural', 'Honeymoon', 'Family', 'Pilgrimage'].map((c) => <option key={c}>{c}</option>)}
          </select>
          <input placeholder="Meeting point" value={form.meetingPoint} onChange={update('meetingPoint')} className="rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm" />
          <button className="rounded-lg bg-lagoon-500 py-2.5 text-sm font-semibold text-paper hover:bg-lagoon-600 sm:col-span-2">
            Submit for approval
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-ink/50 dark:text-paper/50">Loading…</p>
      ) : packages.length === 0 ? (
        <div className="rounded-xl2 border border-dashed border-ink/15 dark:border-paper/20 py-16 text-center">
          <p className="font-display text-lg font-semibold">No packages yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {packages.map((p) => (
            <div key={p._id} className="flex items-center justify-between rounded-xl2 border border-ink/5 dark:border-paper/10 bg-white dark:bg-ink-light p-4 shadow-card">
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-ink/50 dark:text-paper/50">{p.destination} · ₹{p.price} · {p.availableSeats}/{p.totalSeats} seats</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColor[p.status]}`}>{p.status}</span>
                <button onClick={() => remove(p._id)} className="text-red-400 hover:text-red-500"><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgencyPackages;
