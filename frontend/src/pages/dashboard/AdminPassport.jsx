import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiShield, FiSearch, FiCheckCircle, FiClock, FiFileText,
  FiPhone, FiCalendar, FiMapPin, FiEye, FiDownload, FiCheck, FiX
} from 'react-icons/fi';
import { FaPassport } from 'react-icons/fa';

const mockPassportApplications = [
  { id: 'MEA-LDH-2026-88192', applicant: 'Amol Sharma', dob: '1998-05-27', phone: '+91 98145 19578', email: 'amolsharma2705@gmail.com', pskOffice: 'PSK Ludhiana (Model Town)', type: 'Fresh Adult 36-Page Passport', govtFee: 1500, agencyFee: 499, status: 'Pre-Screened', appointmentDate: '28 Aug 2026, 10:30 AM', documents: ['Aadhaar Card', '10th Marksheet (DOB)', 'Electricity Bill (Address)', 'Bank Passbook'] },
  { id: 'MEA-CHD-2026-99214', applicant: 'Priya Verma', dob: '1999-11-14', phone: '+91 98765 11998', email: 'priya.verma@example.com', pskOffice: 'PSK Chandigarh (Sec 34A)', type: 'Tatkaal Passport Assistance', govtFee: 3500, agencyFee: 899, status: 'Slot Booked', appointmentDate: '01 Sep 2026, 11:00 AM', documents: ['Aadhaar Card', 'PAN Card', 'Voter ID', 'Rental Agreement'] },
  { id: 'MEA-JAL-2026-41029', applicant: 'Sumanpreet Kaur', dob: '2001-03-08', phone: '+91 98765 22119', email: 'suman.k@example.com', pskOffice: 'PSK Jalandhar', type: 'Re-issue / Passport Renewal', govtFee: 1500, agencyFee: 499, status: 'Awaiting Documents', appointmentDate: 'Pending Verification', documents: ['Old Passport Copy', 'Aadhaar Card'] },
  { id: 'MEA-AMR-2026-77103', applicant: 'Karanvir Singh', dob: '1996-08-20', phone: '+91 94683 99221', email: 'karanvir.s@example.com', pskOffice: 'PSK Amritsar', type: 'PCC (Police Clearance Certificate)', govtFee: 500, agencyFee: 399, status: 'Completed', appointmentDate: '15 Aug 2026 (Dispatched)', documents: ['Valid Passport', 'Employment Visa Offer'] }
];

const AdminPassport = () => {
  const [apps, setApps] = useState(mockPassportApplications);
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  const filtered = apps.filter(a =>
    a.id.toLowerCase().includes(search.toLowerCase()) ||
    a.applicant.toLowerCase().includes(search.toLowerCase()) ||
    a.pskOffice.toLowerCase().includes(search.toLowerCase()) ||
    a.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateStatus = (id, newStatus) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    if (selectedApp?.id === id) {
      setSelectedApp(prev => ({ ...prev, status: newStatus }));
    }
    toast.success(`Dossier ${id} status marked as ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FaPassport className="text-[#E11D48]" /> Passport Seva Assistance &amp; MEA Dossiers
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pre-screen document annexures, schedule PSK appointments across Punjab &amp; Chandigarh, and track dispatch status.
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Dossiers</span>
          <p className="font-mono text-xl font-black text-slate-900 dark:text-white">{apps.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">PSK Slot Confirmed</span>
          <p className="font-mono text-xl font-black text-emerald-600">
            {apps.filter(a => a.status === 'Slot Booked' || a.status === 'Completed').length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Pre-Screening Review</span>
          <p className="font-mono text-xl font-black text-amber-500">
            {apps.filter(a => a.status === 'Pre-Screened' || a.status === 'Awaiting Documents').length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-4 text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400">Grant Approval Rate</span>
          <p className="font-mono text-xl font-black text-blue-600">100% (Zero Rejection)</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-[#0F1D30] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400 text-xs" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by MEA tracking ID, applicant, PSK office..."
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3">MEA File Number</th>
                <th className="pb-3">Applicant Name</th>
                <th className="pb-3">Application Type</th>
                <th className="pb-3">Assigned PSK</th>
                <th className="pb-3">Slot Appointment</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 font-mono font-bold text-[#0F2942] dark:text-amber-400">{a.id}</td>
                  <td className="py-3.5 font-bold text-slate-900 dark:text-white">{a.applicant}</td>
                  <td className="py-3.5 text-slate-600 dark:text-slate-300 max-w-xs truncate">{a.type}</td>
                  <td className="py-3.5 text-slate-500">{a.pskOffice}</td>
                  <td className="py-3.5 text-slate-700 dark:text-slate-300 font-semibold">{a.appointmentDate}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      a.status === 'Completed' || a.status === 'Slot Booked'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => setSelectedApp(a)}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-[#0F2942] hover:text-white transition"
                    >
                      Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPLICATION AUDIT MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#E11D48]">MEA Passport Seva Dossier Audit</span>
                <h3 className="font-display text-lg font-black">{selectedApp.id}</h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-xs font-bold hover:bg-slate-200 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-bold">{selectedApp.applicant} (DOB: {selectedApp.dob})</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Contact:</span>
                <span>{selectedApp.email} · {selectedApp.phone}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Service Plan:</span>
                <span className="font-bold">{selectedApp.type}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Preferred PSK:</span>
                <span className="font-semibold">{selectedApp.pskOffice}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Government + Agency Fee:</span>
                <span className="font-mono font-bold text-emerald-600">₹{selectedApp.govtFee} (Govt) + ₹{selectedApp.agencyFee} (Agency)</span>
              </div>

              <div>
                <span className="text-slate-500 font-bold block mb-1.5">Submitted Documents:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApp.documents.map((doc) => (
                    <span key={doc} className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                      ✓ {doc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Action:</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleUpdateStatus(selectedApp.id, 'Slot Booked')}
                    className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 text-xs font-bold transition"
                  >
                    Confirm Slot
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedApp.id, 'Completed')}
                    className="rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white px-3 py-1 text-xs font-bold transition"
                  >
                    Mark Dispatched
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedApp(null)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
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

export default AdminPassport;
