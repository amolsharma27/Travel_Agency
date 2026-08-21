import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiShield, FiUpload, FiCheckCircle, FiClock, FiAlertCircle,
  FiFileText, FiLock, FiEye, FiDownload, FiPlus
} from 'react-icons/fi';
import { FaPassport } from 'react-icons/fa';

const initialDocuments = [
  { id: 'doc_1', type: 'Passport', title: 'Indian Passport (36-Pages)', identifier: 'Z••••••12', expiry: 'Nov 2032', status: 'Verified', verifiedBy: 'MEA PSK Ludhiana', uploadedOn: '15 March 2024' },
  { id: 'doc_2', type: 'Aadhaar / National ID', title: 'UIDAI Aadhaar Card', identifier: '•••• •••• 8821', expiry: 'Lifelong', status: 'Verified', verifiedBy: 'UIDAI e-KYC', uploadedOn: '15 March 2024' },
  { id: 'doc_3', type: 'Visa', title: 'Schengen / International Transit Visa', identifier: 'Not Linked', expiry: 'N/A', status: 'Not Uploaded', verifiedBy: 'Pending', uploadedOn: 'N/A' },
  { id: 'doc_4', type: 'Travel Insurance', title: 'Himalayan High Altitude Trek & Medical Policy', identifier: 'POL-IN-99214', expiry: '31 Dec 2026', status: 'Verified', verifiedBy: 'Care Health Insurance', uploadedOn: '10 Jan 2026' }
];

const CustomerDocuments = () => {
  const [docs, setDocs] = useState(initialDocuments);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [form, setForm] = useState({ type: 'Passport', title: '', identifier: '', expiry: '' });

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.identifier) {
      toast.error('Please fill in document title and masked number');
      return;
    }

    const maskedId = form.identifier.length > 4
      ? form.identifier.slice(0, 1) + '••••' + form.identifier.slice(-2)
      : form.identifier;

    const newDoc = {
      id: 'doc_' + Date.now(),
      type: form.type,
      title: form.title,
      identifier: maskedId,
      expiry: form.expiry || '2030',
      status: 'Pending Verification',
      verifiedBy: 'PCTE Compliance Desk',
      uploadedOn: 'Today'
    };

    setDocs(prev => [newDoc, ...prev]);
    toast.success('Document uploaded securely and queued for verification');
    setShowUploadModal(false);
    setForm({ type: 'Passport', title: '', identifier: '', expiry: '' });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
      case 'Pending Verification':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FaPassport className="text-[#E11D48]" /> Travel Documents &amp; Digital Locker
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Store your verified government IDs, passports, permits, and travel insurance securely for instant one-click bookings.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[#0F2942] hover:bg-[#E11D48] text-white px-4 py-2.5 text-xs font-bold transition shadow"
        >
          <FiUpload /> Upload New Document
        </button>
      </div>

      {/* Security Banner */}
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/30 p-4 text-xs text-emerald-950 dark:text-emerald-300 flex items-start gap-3">
        <FiLock size={18} className="shrink-0 mt-0.5 text-emerald-600" />
        <div className="space-y-0.5">
          <span className="font-bold">256-Bit Encrypted Traveler Identity Vault</span>
          <p className="text-[11px] text-emerald-800 dark:text-emerald-400 leading-relaxed">
            Your document numbers are masked and safeguarded. Only verified travel coordinators access passenger annexures for PSK assistance and inner-line border permits.
          </p>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-5 shadow-sm space-y-3.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">{doc.type}</span>
                  <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {doc.title}
                  </h3>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(doc.status)}`}>
                  {doc.status}
                </span>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Masked ID Number:</span>
                  <span className="font-mono font-bold">{doc.identifier}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Validity / Expiry:</span>
                  <span className="font-semibold">{doc.expiry}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Verification Source:</span>
                  <span className="text-slate-500">{doc.verifiedBy}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
              <span className="text-slate-400">Uploaded: {doc.uploadedOn}</span>
              {doc.status === 'Not Uploaded' ? (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="font-bold text-[#E11D48] hover:underline"
                >
                  + Upload Document
                </button>
              ) : (
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <FiCheckCircle size={12} /> Active for Bookings
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* UPLOAD DOCUMENT MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <form onSubmit={handleUploadSubmit} className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-[#0F1D30] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#E11D48]">Digital Locker</span>
                <h3 className="font-display text-base font-black">Upload Travel Document</h3>
              </div>
              <button type="button" onClick={() => setShowUploadModal(false)} className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Document Category *</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 outline-none"
                >
                  {['Passport', 'Aadhaar / National ID', 'Visa', 'Travel Insurance', 'Driving License / ID'].map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Document Label / Title *</label>
                <input
                  required
                  placeholder="e.g. Indian Passport / Aadhaar Card"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 outline-none focus:border-[#0F2942]"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Document Number *</label>
                <input
                  required
                  placeholder="e.g. Z8923412 or 5421-8890-8821"
                  value={form.identifier}
                  onChange={(e) => setForm(prev => ({ ...prev, identifier: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-mono outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">Number will be masked automatically in the UI for privacy.</p>
              </div>

              <div>
                <label className="font-bold block mb-1">Validity Expiry Date</label>
                <input
                  type="date"
                  value={form.expiry}
                  onChange={(e) => setForm(prev => ({ ...prev, expiry: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 outline-none"
                />
              </div>

              <div className="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-1">
                <FiUpload className="mx-auto text-slate-400" />
                <p className="text-[11px] text-slate-500 font-bold">Attach Scan / Photo (PDF, JPG, PNG)</p>
                <input type="file" className="text-[10px] text-slate-400" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white px-4 py-1.5 text-xs font-bold shadow transition"
              >
                Save to Locker
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default CustomerDocuments;
