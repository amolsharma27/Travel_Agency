import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiBriefcase, FiShield, FiCheckCircle, FiXCircle, FiDollarSign,
  FiSearch, FiPhone, FiMail, FiMapPin, FiAward, FiEdit3, FiSliders
} from 'react-icons/fi';

const mockAgencyPartners = [
  { id: 'ag_01', name: 'PCTE Travel & Expeditions Pvt Ltd', owner: 'Amol Sharma', email: 'agency@pctetravels.com', phone: '+91 99881 10021', city: 'Ludhiana, Punjab', licenseNo: 'PB-TO-2024-0089', commissionRate: 8.5, status: 'approved', grossSales: 640000, activeTours: 8, rating: 4.92, verifiedDocs: ['GST Registration', 'Tourism Dept License', 'Bank Escrow Mandate'] },
  { id: 'ag_02', name: 'Himalayan Wanderers Spiti & Manali', owner: 'Rajesh Negi', email: 'wanderers@himalayas.in', phone: '+91 98765 44332', city: 'Manali, HP', licenseNo: 'HP-DOT-2025-4192', commissionRate: 9.0, status: 'pending', grossSales: 0, activeTours: 2, rating: 4.80, verifiedDocs: ['HP Tourism Registration'] },
  { id: 'ag_03', name: 'Rajputana Heritage Tours & Travels', owner: 'Vikramaditya Rathore', email: 'contact@rajputanaheritage.in', phone: '+91 98290 11223', city: 'Jaipur, Rajasthan', licenseNo: 'RJ-TO-2023-8812', commissionRate: 8.0, status: 'approved', grossSales: 412000, activeTours: 6, rating: 4.88, verifiedDocs: ['Rajasthan Tourism Board', 'GST Certificate', 'Vehicle Fleet Permit'] },
  { id: 'ag_04', name: 'Spiti 4x4 Adventures & High Altitude Club', owner: 'Tenzin Dorje', email: 'spiti4x4@expeditions.com', phone: '+91 98000 77112', city: 'Kaza, Spiti', licenseNo: 'HP-DOT-2024-9918', commissionRate: 8.5, status: 'approved', grossSales: 245000, activeTours: 4, rating: 4.95, verifiedDocs: ['Adventure Operator License', 'First-Aid Wilderness Cert'] },
  { id: 'ag_05', name: 'Coastal Breeze Holidays & Cruises', owner: 'Goa Operator Fleet', email: 'ops@coastalbreeze.in', phone: '+91 98221 44556', city: 'Panaji, Goa', licenseNo: 'GA-TO-2025-3321', commissionRate: 10.0, status: 'approved', grossSales: 189000, activeTours: 3, rating: 4.75, verifiedDocs: ['Goa Tourism License', 'Watersports Safety Permit'] }
];

const AdminAgencies = () => {
  const [agencies, setAgencies] = useState(mockAgencyPartners);
  const [search, setSearch] = useState('');
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [commissionEdit, setCommissionEdit] = useState({ id: null, rate: '' });

  const filtered = agencies.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.owner.toLowerCase().includes(search.toLowerCase()) ||
    a.city.toLowerCase().includes(search.toLowerCase()) ||
    a.licenseNo.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id, newStatus) => {
    setAgencies(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    toast.success(`Agency status updated to ${newStatus}`);
  };

  const handleSaveCommission = (id) => {
    const rate = Number(commissionEdit.rate);
    if (isNaN(rate) || rate < 0 || rate > 50) {
      toast.error('Please enter a valid commission rate (0-50%)');
      return;
    }
    setAgencies(prev => prev.map(a => a.id === id ? { ...a, commissionRate: rate } : a));
    setCommissionEdit({ id: null, rate: '' });
    toast.success('Commission rate updated successfully');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">
            Agency Partners Governance &amp; Commission Desk
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verify tour operator credentials, configure platform commission splits, and monitor agency performance.
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Approved Partners</span>
          <p className="font-mono text-xl font-black text-emerald-600">
            {agencies.filter(a => a.status === 'approved').length} Verified
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Pending Onboarding</span>
          <p className="font-mono text-xl font-black text-amber-500">
            {agencies.filter(a => a.status === 'pending').length} Under Review
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Average Commission</span>
          <p className="font-mono text-xl font-black text-slate-900 dark:text-white">8.6%</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Agency Gross</span>
          <p className="font-mono text-xl font-black text-[#E11D48]">₹14.86 Lakhs</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-[#0F1D30] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400 text-xs" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agencies by name, owner, license, city..."
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
          />
        </div>
        <span className="text-xs font-bold text-slate-500">
          Showing {filtered.length} Partner Operators
        </span>
      </div>

      {/* Agencies Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((agency) => (
          <div
            key={agency.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm space-y-3.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-mono text-slate-400">{agency.licenseNo}</span>
                  </div>
                  <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {agency.name}
                  </h3>
                  <p className="text-xs text-slate-500">Owner: <b className="text-slate-700 dark:text-slate-300">{agency.owner}</b></p>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                  agency.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                }`}>
                  {agency.status}
                </span>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Headquarters:</span>
                  <span className="font-semibold">{agency.city}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Contact:</span>
                  <span className="font-mono">{agency.phone}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Gross Sales Volume:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">₹{agency.grossSales.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Guest Rating:</span>
                  <span className="font-bold text-amber-500">★ {agency.rating}</span>
                </div>

                {/* Commission Setting */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 font-medium">Platform Commission:</span>
                  {commissionEdit.id === agency.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.1"
                        value={commissionEdit.rate}
                        onChange={(e) => setCommissionEdit({ id: agency.id, rate: e.target.value })}
                        className="w-14 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 p-1 text-xs font-mono font-bold text-center"
                      />
                      <button
                        onClick={() => handleSaveCommission(agency.id)}
                        className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{agency.commissionRate}%</span>
                      <button
                        onClick={() => setCommissionEdit({ id: agency.id, rate: agency.commissionRate.toString() })}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                        title="Edit Commission"
                      >
                        <FiEdit3 size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {agency.status === 'pending' ? (
                <button
                  onClick={() => toggleStatus(agency.id, 'approved')}
                  className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-xs font-bold transition shadow"
                >
                  Approve Operator License
                </button>
              ) : (
                <button
                  onClick={() => toggleStatus(agency.id, 'pending')}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 py-1.5 text-xs font-bold transition"
                >
                  Suspend Partner
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminAgencies;
