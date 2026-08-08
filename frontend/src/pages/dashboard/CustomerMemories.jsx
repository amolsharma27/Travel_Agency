import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiMapPin, FiStar, FiCamera, FiPlus, FiCalendar, FiCheckCircle, FiShare2, FiDownload, FiTag, FiEye
} from 'react-icons/fi';
import { getStoredMemories, saveMemory } from '../../data/mockData.js';

const popularSpotBadges = [
  { name: 'Solang Valley Snow Point', location: 'Manali, HP', icon: '❄️', category: 'Mountain' },
  { name: 'Baga & Vagator Cliffs', location: 'Goa', icon: '🌊', category: 'Coastal' },
  { name: 'Shivpuri Grade IV Rapids', location: 'Rishikesh, UK', icon: '🚣', category: 'Adventure' },
  { name: 'Dal Lake Wooden Houseboat', location: 'Srinagar, J&K', icon: '🛶', category: 'Lakes' },
  { name: 'Nahargarh Fort Sunset Point', location: 'Jaipur, Rajasthan', icon: '🏰', category: 'Heritage' },
  { name: 'Vembanad Backwaters Canal', location: 'Alleppey, Kerala', icon: '🌴', category: 'Backwaters' },
  { name: 'Dashashwamedh Maha Aarti', location: 'Varanasi, UP', icon: '🪔', category: 'Spiritual' },
  { name: 'Matanga Hill Sunrise Rock', location: 'Hampi, Karnataka', icon: '🧗', category: 'Heritage' },
];

const CustomerMemories = () => {
  const [memories, setMemories] = useState(() => getStoredMemories());
  const [showAddModal, setShowAddModal] = useState(false);
  const [activePhotoModal, setActivePhotoModal] = useState(null);

  const [form, setForm] = useState({
    packageTitle: '',
    destination: '',
    travelDates: '',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    costPaid: '₹3,499',
    ratingGiven: 5,
    spotName: '',
    spotNotes: '',
    reviewNote: '',
  });

  const handleAddMemory = (e) => {
    e.preventDefault();
    if (!form.packageTitle || !form.destination) {
      toast.error('Please enter trip title and destination');
      return;
    }

    const newTrip = {
      id: 'trip_' + Date.now(),
      packageTitle: form.packageTitle,
      destination: form.destination,
      travelDates: form.travelDates || 'Recent Trip',
      days: 4,
      status: 'Completed',
      coverImage: form.coverImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
      costPaid: form.costPaid || '₹4,999',
      ratingGiven: Number(form.ratingGiven) || 5,
      spotsVisited: [
        {
          name: form.spotName || form.destination + ' Highlight Spot',
          type: 'Adventure',
          rating: 5,
          notes: form.spotNotes || 'Unforgettable travel experience!'
        }
      ],
      photos: [
        form.coverImage,
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
      ],
      reviewNote: form.reviewNote || 'Had an incredible budget-friendly trip with seamless arrangements!'
    };

    const updated = saveMemory(newTrip);
    setMemories(updated);
    toast.success('Trip memory & spot added to your travel album!');
    setShowAddModal(false);
    setForm({
      packageTitle: '',
      destination: '',
      travelDates: '',
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      costPaid: '₹3,499',
      ratingGiven: 5,
      spotName: '',
      spotNotes: '',
      reviewNote: '',
    });
  };

  return (
    <div className="space-y-8">
      {/* HEADER WITH STATS & ADD BUTTON */}
      <div className="flex flex-col gap-4 rounded-2xl border border-ink/10 dark:border-paper/10 bg-white dark:bg-ink-light p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
            <FiCheckCircle /> Verified Travel Memory Passport
          </span>
          <h1 className="mt-2 font-display text-2xl font-bold">My Previous Trips & Visited Spots</h1>
          <p className="text-sm text-ink/60 dark:text-paper/60">
            Your personal travel diary: relive completed journeys, browse photos, and review spots you visited.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-lagoon-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-lagoon-600"
        >
          <FiPlus /> Add Trip Memory / Spot
        </button>
      </div>

      {/* QUICK SUMMARY METRICS */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-ink/10 dark:border-paper/10 bg-white dark:bg-ink-light p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-ink/50 dark:text-paper/50">Trips Completed</p>
          <p className="mt-1 font-display text-2xl font-bold text-lagoon-600 dark:text-lagoon-400">{memories.length}</p>
        </div>
        <div className="rounded-xl border border-ink/10 dark:border-paper/10 bg-white dark:bg-ink-light p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-ink/50 dark:text-paper/50">Spots Checked-in</p>
          <p className="mt-1 font-display text-2xl font-bold text-amber-500">
            {memories.reduce((acc, m) => acc + (m.spotsVisited?.length || 0), 0) + 12}
          </p>
        </div>
        <div className="rounded-xl border border-ink/10 dark:border-paper/10 bg-white dark:bg-ink-light p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-ink/50 dark:text-paper/50">Photos Uploaded</p>
          <p className="mt-1 font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {memories.reduce((acc, m) => acc + (m.photos?.length || 0), 0) + 8}
          </p>
        </div>
        <div className="rounded-xl border border-ink/10 dark:border-paper/10 bg-white dark:bg-ink-light p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-ink/50 dark:text-paper/50">Traveler Level</p>
          <p className="mt-1 font-display text-2xl font-bold text-indigo-600 dark:text-indigo-400">Explorer Gold ⭐</p>
        </div>
      </div>

      {/* COMPLETED TRIPS ALBUMS */}
      <div className="space-y-6">
        <h2 className="font-display text-xl font-bold flex items-center gap-2">
          <FiCamera className="text-lagoon-500" /> Past Trip Albums & Highlights
        </h2>

        {memories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink/20 dark:border-paper/20 p-12 text-center">
            <p className="font-display text-lg font-semibold">No completed trip memories recorded yet</p>
            <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">
              Book your first budget package or click "Add Trip Memory" to record your travels!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {memories.map((trip) => (
              <div
                key={trip.id}
                className="overflow-hidden rounded-2xl border border-ink/10 dark:border-paper/10 bg-white dark:bg-ink-light shadow-sm transition hover:shadow-md"
              >
                {/* Trip Header Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink/20">
                  <img
                    src={trip.coverImage}
                    alt={trip.packageTitle}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
                  
                  <span className="absolute left-3 top-3 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    ✓ {trip.status} Trip
                  </span>

                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow">
                    <FiStar className="fill-white" /> {trip.ratingGiven} / 5
                  </span>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <p className="flex items-center gap-1 text-xs text-paper/80">
                      <FiMapPin className="text-lagoon-400" /> {trip.destination}
                    </p>
                    <h3 className="font-display text-lg font-bold leading-tight">{trip.packageTitle}</h3>
                    <p className="mt-1 flex items-center gap-3 text-xs text-paper/70">
                      <span className="flex items-center gap-1"><FiCalendar /> {trip.travelDates}</span>
                      <span>• Total Paid: <strong className="text-lagoon-300">{trip.costPaid}</strong></span>
                    </p>
                  </div>
                </div>

                {/* Trip Body: Visited Spots & Photos */}
                <div className="p-5 space-y-4">
                  {/* Visited Spots in this Trip */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-lagoon-700 dark:text-lagoon-300">
                      📍 Spots Visited ({trip.spotsVisited?.length || 0})
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {trip.spotsVisited?.map((spot, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-ink/10 dark:border-paper/10 bg-ink/5 dark:bg-paper/5 px-3 py-1.5 text-xs"
                        >
                          <span className="font-semibold text-ink dark:text-paper">{spot.name}</span>
                          {spot.notes && (
                            <p className="text-[11px] text-ink/60 dark:text-paper/60 mt-0.5">{spot.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Photo Thumbnails */}
                  {trip.photos?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-ink/50 dark:text-paper/50">
                        📸 Trip Photos
                      </p>
                      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                        {trip.photos.map((photo, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setActivePhotoModal(photo)}
                            className="group relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-ink/10"
                          >
                            <img src={photo} alt="Trip snap" className="h-full w-full object-cover transition group-hover:scale-110" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                              <FiEye className="text-white text-sm" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Review Note */}
                  {trip.reviewNote && (
                    <div className="rounded-xl bg-lagoon-50/60 dark:bg-lagoon-900/10 p-3 text-xs italic text-ink/80 dark:text-paper/80 border border-lagoon-500/10">
                      "{trip.reviewNote}"
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between border-t border-ink/5 dark:border-paper/10 pt-3">
                    <Link
                      to="/packages"
                      className="text-xs font-semibold text-lagoon-600 dark:text-lagoon-400 hover:underline"
                    >
                      Book this route again →
                    </Link>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toast.success('Trip memory card downloaded as PDF receipt')}
                        className="flex items-center gap-1 rounded-lg border border-ink/10 dark:border-paper/20 px-2.5 py-1 text-xs font-medium text-ink/70 dark:text-paper/70 hover:bg-ink/5"
                      >
                        <FiDownload /> Certificate
                      </button>
                      <button
                        onClick={() => toast.success('Trip memory link copied to clipboard!')}
                        className="flex items-center gap-1 rounded-lg bg-lagoon-500/10 px-2.5 py-1 text-xs font-semibold text-lagoon-600 dark:text-lagoon-300 hover:bg-lagoon-500/20"
                      >
                        <FiShare2 /> Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* POPULAR TRAVEL SPOTS PASSPORT CHECKLIST */}
      <div className="rounded-2xl border border-ink/10 dark:border-paper/10 bg-white dark:bg-ink-light p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold">India Travel Spots Explorer</h3>
            <p className="text-xs text-ink/60 dark:text-paper/60">Check off bucket list spots you've conquered or plan next!</p>
          </div>
          <Link to="/packages" className="text-xs font-semibold text-lagoon-600 dark:text-lagoon-400 hover:underline">
            View all destinations →
          </Link>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {popularSpotBadges.map((spot, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-xl border border-ink/5 dark:border-paper/10 bg-ink/5 dark:bg-paper/5 p-3.5"
            >
              <span className="text-2xl select-none">{spot.icon}</span>
              <div>
                <p className="text-xs font-bold leading-tight text-ink dark:text-paper">{spot.name}</p>
                <p className="text-[11px] text-ink/60 dark:text-paper/60 mt-0.5">{spot.location}</p>
                <span className="mt-1.5 inline-block rounded bg-lagoon-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-lagoon-700 dark:text-lagoon-300">
                  {spot.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD MEMORY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white dark:bg-ink p-6 shadow-2xl">
            <h3 className="font-display text-xl font-bold">Add Previous Trip & Visited Spot</h3>
            <p className="mt-1 text-xs text-ink/60 dark:text-paper/60">
              Record a completed adventure to your personal travel memory album.
            </p>

            <form onSubmit={handleAddMemory} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase text-ink/70 dark:text-paper/70">Trip / Package Title *</label>
                <input
                  required
                  value={form.packageTitle}
                  onChange={(e) => setForm({ ...form, packageTitle: e.target.value })}
                  placeholder="e.g. Goa Beach Vacation with College Friends"
                  className="mt-1 w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-lagoon-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium uppercase text-ink/70 dark:text-paper/70">Destination *</label>
                  <input
                    required
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    placeholder="e.g. North Goa"
                    className="mt-1 w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-lagoon-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase text-ink/70 dark:text-paper/70">Travel Dates</label>
                  <input
                    value={form.travelDates}
                    onChange={(e) => setForm({ ...form, travelDates: e.target.value })}
                    placeholder="e.g. Jan 2025"
                    className="mt-1 w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-lagoon-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase text-ink/70 dark:text-paper/70">Spot Visited / Landmark</label>
                <input
                  value={form.spotName}
                  onChange={(e) => setForm({ ...form, spotName: e.target.value })}
                  placeholder="e.g. Vagator Beach Sunset Cliff"
                  className="mt-1 w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-lagoon-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase text-ink/70 dark:text-paper/70">Photo URL (Image link)</label>
                <input
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="mt-1 w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-lagoon-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase text-ink/70 dark:text-paper/70">Your Memory Review & Tips</label>
                <textarea
                  rows={3}
                  value={form.reviewNote}
                  onChange={(e) => setForm({ ...form, reviewNote: e.target.value })}
                  placeholder="Share what made this spot so memorable or a budget saving tip..."
                  className="mt-1 w-full rounded-lg border border-ink/10 dark:border-paper/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-lagoon-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-ink/15 dark:border-paper/20 px-4 py-2 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-lagoon-500 px-5 py-2 text-xs font-semibold text-white hover:bg-lagoon-600"
                >
                  Save to Travel Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PHOTO PREVIEW MODAL */}
      {activePhotoModal && (
        <div
          onClick={() => setActivePhotoModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
        >
          <div className="relative max-h-[85vh] max-w-2xl overflow-hidden rounded-2xl bg-black">
            <img src={activePhotoModal} alt="Enlarged trip memory" className="h-full w-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerMemories;
