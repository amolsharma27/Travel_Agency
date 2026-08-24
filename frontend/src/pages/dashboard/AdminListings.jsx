import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiPackage, FiHome, FiShield, FiTruck, FiCheckCircle, FiXCircle,
  FiEye, FiMapPin, FiCalendar, FiDollarSign, FiClock, FiUser, FiAlertCircle
} from 'react-icons/fi';
import { FaPassport } from 'react-icons/fa';
import api from '../../api/axios.js';

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='100%25' height='100%25' fill='%231e293b'/%3E%3Cpath d='M360 210a40 40 0 1 0 80 0a40 40 0 1 0-80 0' fill='%23475569'/%3E%3Cpath d='M200 380l160-140l100 80l140-120l120 180z' fill='%23334155'/%3E%3Ctext x='50%25' y='85%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='20' font-weight='600'%3EPCTE Travel%3C/text%3E%3C/svg%3E";

const AdminListings = () => {
  const [activeTab, setActiveTab] = useState('packages'); // 'packages' | 'hotels' | 'passport' | 'transportation'
  const [data, setData] = useState({ packages: [], hotels: [], passport: [], transportation: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInspectionItem, setSelectedInspectionItem] = useState(null);

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/dashboard/admin/listings');
      if (res.data?.data) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load listings:', err);
      setError('Could not load listings. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleModerate = async (id, newStatus, category) => {
    try {
      await api.put(`/dashboard/admin/listings/${category}/${id}/status`, { status: newStatus });
      setData(prev => ({
        ...prev,
        [category]: prev[category].map(item => item._id === id ? { ...item, status: newStatus } : item)
      }));
      toast.success(`Listing marked as ${newStatus}`);
      if (selectedInspectionItem?._id === id) {
        setSelectedInspectionItem(null);
      }
    } catch (err) {
      console.error('Listing moderation error:', err);
      toast.error('Failed to update listing status.');
    }
  };

  const currentList = data[activeTab] || [];

  return (
    <div className="space-y-6">
      
      {/* Header & Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">
            Operational Moderation &amp; Verification Desk
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pre-screen and approve agency tour packages, hotel listings, transportation fleet routes, and passport dossiers.
          </p>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex overflow-x-auto gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 shadow-sm scrollbar-none">
        {[
          { id: 'packages', label: 'Tour Packages', icon: FiPackage, count: (data.packages || []).filter(p => p.status === 'pending').length },
          { id: 'hotels', label: 'Stays & Resorts', icon: FiHome, count: (data.hotels || []).filter(h => h.status === 'pending').length },
          { id: 'passport', label: 'Passport Assistance Dossiers', icon: FaPassport, count: (data.passport || []).filter(ps => ps.status === 'under_review').length },
          { id: 'transportation', label: 'Mobility & Routes', icon: FiTruck, count: (data.transportation || []).filter(t => t.status === 'pending').length }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#0F2942] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === tab.id ? 'bg-[#E11D48] text-white' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Loading & Error */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-[#0F2942] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Loading listings for moderation...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-center space-y-2">
          <FiAlertCircle className="mx-auto text-red-500 text-xl" />
          <p className="text-xs font-bold text-red-700 dark:text-red-300">{error}</p>
          <button onClick={fetchListings} className="px-3 py-1.5 rounded-lg bg-[#0F2942] text-white text-xs font-bold">
            Retry
          </button>
        </div>
      ) : (
        /* Main Stream Card List */
        <div className="space-y-3">
          {currentList.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              {/* Image + Title */}
              <div className="flex items-center gap-3">
                {(item.images?.[0] || item.image) ? (
                  <img 
                    src={item.images?.[0] || item.image} 
                    alt={item.title || item.name} 
                    onError={(e) => {
                      if (e.currentTarget.dataset.fallbackApplied) return;
                      e.currentTarget.dataset.fallbackApplied = 'true';
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="h-14 w-20 rounded-xl object-cover shadow shrink-0 bg-slate-900" 
                  />
                ) : (
                  <div className="h-12 w-12 rounded-xl bg-[#0F2942] text-white flex items-center justify-center font-bold text-lg shrink-0">
                    {activeTab === 'passport' ? <FaPassport className="text-amber-400" /> : <FiTruck className="text-amber-400" />}
                  </div>
                )}

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                      {item.title || item.name || item.type || item.route}
                    </h4>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                      item.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : item.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  {activeTab === 'packages' && (
                    <p className="text-xs text-slate-500">
                      <FiMapPin className="inline text-[#E11D48]" /> {item.destination} · {item.duration} · Operator: <b className="text-slate-700 dark:text-slate-300">{item.operator}</b>
                    </p>
                  )}
                  {activeTab === 'hotels' && (
                    <p className="text-xs text-slate-500">
                      <FiMapPin className="inline text-[#E11D48]" /> {item.city}, {item.state} · Category: <b>{item.category}</b> · Host: <b>{item.operator}</b>
                    </p>
                  )}
                  {activeTab === 'passport' && (
                    <p className="text-xs text-slate-500">
                      Applicant: <b className="text-slate-900 dark:text-white">{item.applicantName}</b> ({item.phone}) · PSK: <b>{item.pskOffice}</b> · Ref: <span className="font-mono text-[#0F2942] dark:text-amber-400 font-bold">{item.ref}</span>
                    </p>
                  )}
                  {activeTab === 'transportation' && (
                    <p className="text-xs text-slate-500">
                      Vehicle: <b>{item.vehicle}</b> · Fleet: <b>{item.operator}</b> · {item.frequency}
                    </p>
                  )}
                </div>
              </div>

              {/* Pricing & Moderation Buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-0 pt-2 md:pt-0 border-slate-100 dark:border-slate-800">
                <div className="text-right text-xs">
                  <span className="text-[10px] text-slate-400 block font-bold">Price / Fee</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    ₹{(item.price || item.pricePerNight || item.fare || (item.govtFee ? item.govtFee + item.agencyFee : 0))?.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedInspectionItem(item)}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
                  >
                    <FiEye className="inline mr-1" /> Inspect
                  </button>

                  {item.status !== 'approved' && (
                    <button
                      onClick={() => handleModerate(item._id, 'approved', activeTab)}
                      className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-colors"
                    >
                      ✓ Approve
                    </button>
                  )}

                  {item.status !== 'rejected' && (
                    <button
                      onClick={() => handleModerate(item._id, 'rejected', activeTab)}
                      className="rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-3 py-1.5 text-xs font-bold hover:bg-red-100 transition-colors"
                    >
                      ✕ Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {currentList.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400">
              No listings found for this category.
            </div>
          )}
        </div>
      )}

      {/* INSPECTION LIGHTBOX MODAL */}
      {selectedInspectionItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#E11D48]">Moderation Inspection Audit</span>
                <h3 className="font-display text-lg font-black">{selectedInspectionItem.title || selectedInspectionItem.name || selectedInspectionItem.type || selectedInspectionItem.route}</h3>
              </div>
              <button
                onClick={() => setSelectedInspectionItem(null)}
                className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Service Stream:</span>
                <span className="font-bold uppercase">{activeTab}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Operator / Submitter:</span>
                <span className="font-bold">{selectedInspectionItem.operator || selectedInspectionItem.applicantName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Safety &amp; Compliance Audit:</span>
                <span className="font-bold text-emerald-600">Passed (Certified Vehicle/Guides)</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Price Structure:</span>
                <span className="font-mono font-bold text-emerald-600">₹{(selectedInspectionItem.price || selectedInspectionItem.pricePerNight || selectedInspectionItem.fare || (selectedInspectionItem.govtFee ? selectedInspectionItem.govtFee + selectedInspectionItem.agencyFee : 0))?.toLocaleString('en-IN')} (Net Verified)</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleModerate(selectedInspectionItem._id, 'approved', activeTab)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-emerald-500"
              >
                ✓ Approve &amp; Publish
              </button>
              <button
                onClick={() => setSelectedInspectionItem(null)}
                className="rounded-lg bg-[#0F2942] px-4 py-2 text-xs font-bold text-white shadow"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminListings;
