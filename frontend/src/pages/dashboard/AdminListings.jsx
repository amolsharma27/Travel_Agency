import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiPackage, FiHome, FiShield, FiTruck, FiCheckCircle, FiXCircle,
  FiEye, FiMapPin, FiCalendar, FiDollarSign, FiClock, FiUser
} from 'react-icons/fi';
import { FaPassport } from 'react-icons/fa';
import api from '../../api/axios.js';

const mockPendingListings = {
  packages: [
    { _id: 'pkg_p1', title: 'Kasol & Tosh Alpine Village Camping', destination: 'Kasol, Parvati Valley', price: 5499, duration: '3 Days / 2 Nights', operator: 'PCTE Himalayan Club', category: 'Group Tours', seats: 18, image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=600&q=80', status: 'pending' },
    { _id: 'pkg_p2', title: 'Jaipur & Udaipur Royal Forts Experience', destination: 'Rajasthan', price: 9800, duration: '4 Days / 3 Nights', operator: 'Rajputana Heritage Tours', category: 'Heritage', seats: 12, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80', status: 'pending' },
    { _id: 'pkg_p3', title: 'Spiti Valley 4x4 Snow Leopard Expedition', destination: 'Spiti Valley, HP', price: 17500, duration: '6 Days / 5 Nights', operator: 'Spiti 4x4 Adventures', category: 'Adventure Tours', seats: 8, image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80', status: 'pending' }
  ],
  hotels: [
    { _id: 'htl_p1', name: 'Cedar Pine Wooden Chalet', city: 'Jibhi', state: 'Himachal Pradesh', pricePerNight: 2899, rating: 4.8, category: 'Homestays', operator: 'Tirthan Valley Hosts', image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=600&q=80', status: 'pending' },
    { _id: 'htl_p2', name: 'The Himalayan Riverside Glamping', city: 'Kasol', state: 'Himachal Pradesh', pricePerNight: 2200, rating: 4.7, category: 'Camping', operator: 'Parvati Eco Camps', image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80', status: 'pending' }
  ],
  passport: [
    { _id: 'ps_p1', applicantName: 'Amol Sharma', phone: '+91 98145 19578', pskOffice: 'PSK Ludhiana', type: 'Tatkaal Adult Passport Assistance', ref: 'MEA-LDH-9921', govtFee: 3500, agencyFee: 899, status: 'under_review', submittedOn: '19 Aug 2026' },
    { _id: 'ps_p2', applicantName: 'Sumanpreet Kaur', phone: '+91 98765 22119', pskOffice: 'PSK Jalandhar', type: 'Fresh 36-Page Normal Passport', ref: 'MEA-JAL-4102', govtFee: 1500, agencyFee: 499, status: 'under_review', submittedOn: '18 Aug 2026' }
  ],
  transportation: [
    { _id: 'tr_p1', route: 'Delhi to Manali (Volvo AC Multi-Axle)', vehicle: 'Volvo B11R AC Sleeper', operator: 'Northern Express Fleet', fare: 1199, frequency: 'Daily 08:30 PM', status: 'pending' },
    { _id: 'tr_p2', route: 'Ludhiana to Chandigarh Airport (Innova Crysta)', vehicle: 'Toyota Innova Crysta 6-Seater', operator: 'Punjab Airport Cabs', fare: 2400, frequency: 'On-Demand 24/7', status: 'pending' }
  ]
};

const AdminListings = () => {
  const [activeTab, setActiveTab] = useState('packages'); // 'packages' | 'hotels' | 'passport' | 'transportation'
  const [data, setData] = useState(mockPendingListings);
  const [selectedInspectionItem, setSelectedInspectionItem] = useState(null);

  const handleModerate = (id, newStatus, category) => {
    setData(prev => ({
      ...prev,
      [category]: prev[category].map(item => item._id === id ? { ...item, status: newStatus } : item)
    }));
    toast.success(`Listing successfully marked as ${newStatus}`);
    if (selectedInspectionItem?._id === id) {
      setSelectedInspectionItem(null);
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
          { id: 'packages', label: 'Tour Packages', icon: FiPackage, count: data.packages.filter(p => p.status === 'pending').length },
          { id: 'hotels', label: 'Stays & Resorts', icon: FiHome, count: data.hotels.filter(h => h.status === 'pending').length },
          { id: 'passport', label: 'Passport Assistance Dossiers', icon: FaPassport, count: data.passport.filter(ps => ps.status === 'under_review').length },
          { id: 'transportation', label: 'Mobility & Routes', icon: FiTruck, count: data.transportation.filter(t => t.status === 'pending').length }
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

      {/* Main Stream Card List */}
      <div className="space-y-3">
        {currentList.map((item) => (
          <div
            key={item._id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            {/* Image + Title */}
            <div className="flex items-center gap-3">
              {item.image ? (
                <img src={item.image} alt={item.title || item.name} className="h-14 w-20 rounded-xl object-cover shadow shrink-0" />
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
                  ₹{(item.price || item.pricePerNight || item.fare || (item.govtFee + item.agencyFee))?.toLocaleString('en-IN')}
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
      </div>

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
                <span className="font-mono font-bold text-emerald-600">₹{(selectedInspectionItem.price || selectedInspectionItem.pricePerNight || selectedInspectionItem.fare || (selectedInspectionItem.govtFee + selectedInspectionItem.agencyFee))?.toLocaleString('en-IN')} (Net Verified)</span>
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
