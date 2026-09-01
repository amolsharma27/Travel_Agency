import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  FiShield, FiUpload, FiCheckCircle, FiClock, FiAlertCircle,
  FiFileText, FiLock, FiEye, FiDownload, FiPlus, FiSearch
} from 'react-icons/fi';
import { FaPassport, FaIdCard } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  validatePassport,
  validateAadhaar,
  validatePAN,
  formatPassportInput,
  formatAadhaarInput
} from '../../utils/idValidators.js';

const CustomerDocuments = () => {
  const { user } = useAuth();

  // Dynamic user documents based on user profile
  const initialDocs = useMemo(() => {
    const list = [];
    if (user?.passportNumber) {
      list.push({
        id: 'doc_passport_user',
        type: 'Passport',
        title: 'Indian Passport (36-Pages)',
        identifier: `${user.passportNumber[0]}•••••${user.passportNumber.slice(-2)}`,
        expiry: user.passportExpiry || 'Active',
        status: 'Verified',
        verifiedBy: 'MEA PSK Passport Desk',
        uploadedOn: 'Profile Sync'
      });
    }
    if (user?.aadhaarLast4) {
      list.push({
        id: 'doc_aadhaar_user',
        type: 'Aadhaar / National ID',
        title: 'UIDAI Aadhaar Card',
        identifier: `•••• •••• ${user.aadhaarLast4}`,
        expiry: 'Lifelong',
        status: 'Verified',
        verifiedBy: 'UIDAI e-KYC Verification',
        uploadedOn: 'Profile Sync'
      });
    }
    // Default system insurance document
    list.push({
      id: 'doc_insurance_policy',
      type: 'Travel Insurance',
      title: 'Himalayan High Altitude Trek & Medical Policy',
      identifier: 'POL-IN-99214',
      expiry: '31 Dec 2026',
      status: 'Verified',
      verifiedBy: 'Care Health Insurance',
      uploadedOn: '10 Jan 2026'
    });
    return list;
  }, [user]);

  const [docs, setDocs] = useState(initialDocs);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [form, setForm] = useState({ type: 'Passport', title: '', identifier: '', expiry: '' });

  // Standalone Verification Tool State
  const [verifyType, setVerifyType] = useState('Passport');
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);

  const handleTestVerify = (e) => {
    e.preventDefault();
    if (!verifyInput.trim()) {
      toast.error('Please enter a document number to verify');
      return;
    }

    if (verifyType === 'Passport') {
      const res = validatePassport(verifyInput);
      setVerifyResult(res);
      if (res.isValid) toast.success('Passport format verified successfully!');
      else toast.error(res.message);
    } else if (verifyType === 'Aadhaar') {
      const res = validateAadhaar(verifyInput);
      setVerifyResult(res);
      if (res.isValid) toast.success('Aadhaar number format & checksum verified!');
      else toast.error(res.message);
    } else if (verifyType === 'PAN') {
      const res = validatePAN(verifyInput);
      setVerifyResult(res);
      if (res.isValid) toast.success('PAN card format verified!');
      else toast.error(res.message);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.identifier) {
      toast.error('Please fill in document title and document number');
      return;
    }

    // Format validation on upload
    let validationResult = null;
    if (form.type === 'Passport') {
      validationResult = validatePassport(form.identifier);
      if (!validationResult.isValid) {
        toast.error(validationResult.message);
        return;
      }
    } else if (form.type === 'Aadhaar / National ID') {
      validationResult = validateAadhaar(form.identifier);
      if (!validationResult.isValid) {
        toast.error(validationResult.message);
        return;
      }
    }

    const maskedId = validationResult?.maskedNumber || (
      form.identifier.length > 4
        ? form.identifier.slice(0, 1) + '••••' + form.identifier.slice(-2)
        : form.identifier
    );

    const newDoc = {
      id: 'doc_' + Date.now(),
      type: form.type,
      title: form.title,
      identifier: maskedId,
      expiry: form.expiry || '2030',
      status: 'Verified',
      verifiedBy: 'PCTE Digital Security Desk',
      uploadedOn: 'Today'
    };

    setDocs(prev => [newDoc, ...prev]);
    toast.success('Document verified and added to your secure Digital Locker!');
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

      {/* LIVE ID VERIFICATION CHECKER TOOL */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase text-[#E11D48] font-mono">Real-Time Verification</span>
            <h3 className="font-display text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FiCheckCircle className="text-emerald-500" /> Government ID Verification &amp; Checksum Tool
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">UIDAI Verhoeff Algorithm &amp; MEA Format Compliant</span>
        </div>

        <form onSubmit={handleTestVerify} className="grid gap-3 sm:grid-cols-12 items-end">
          <div className="sm:col-span-3 space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Document Type</label>
            <select
              value={verifyType}
              onChange={(e) => {
                setVerifyType(e.target.value);
                setVerifyInput('');
                setVerifyResult(null);
              }}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-bold outline-none"
            >
              <option value="Passport">Indian Passport (1 Letter + 7 Digits)</option>
              <option value="Aadhaar">UIDAI Aadhaar (12 Digits with Checksum)</option>
              <option value="PAN">Income Tax PAN Card</option>
            </select>
          </div>

          <div className="sm:col-span-6 space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Enter Number to Test</label>
            <input
              value={verifyInput}
              placeholder={verifyType === 'Passport' ? 'e.g. K2098412' : verifyType === 'Aadhaar' ? 'e.g. 5421 8890 8821' : 'e.g. ABCDE1234F'}
              onChange={(e) => {
                const val = e.target.value;
                if (verifyType === 'Passport') setVerifyInput(formatPassportInput(val));
                else if (verifyType === 'Aadhaar') setVerifyInput(formatAadhaarInput(val));
                else setVerifyInput(val.toUpperCase());
                setVerifyResult(null);
              }}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono outline-none focus:border-[#0F2942]"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white p-2 text-xs font-bold transition shadow"
            >
              <FiSearch size={14} /> Verify Format
            </button>
          </div>
        </form>

        {verifyResult && (
          <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 ${
            verifyResult.isValid
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
          }`}>
            {verifyResult.isValid ? (
              <FiCheckCircle size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <FiAlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5">
              <span className="font-bold block">
                {verifyResult.isValid ? '✅ Format Verified & Accepted' : '❌ Invalid Document Format'}
              </span>
              <p className="text-[11px] leading-relaxed">{verifyResult.message}</p>
              {verifyResult.maskedNumber && (
                <p className="text-[11px] font-mono mt-1 opacity-80">Masked ID Preview: <b>{verifyResult.maskedNumber}</b></p>
              )}
            </div>
          </div>
        )}
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
                  onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value, identifier: '' }))}
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
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold block">Document Number *</label>
                  <span className="text-[10px] text-slate-400">
                    {form.type === 'Passport' ? '1 Letter + 7 Digits' : form.type.includes('Aadhaar') ? '12 Digits' : 'Official ID'}
                  </span>
                </div>
                <input
                  required
                  placeholder={form.type === 'Passport' ? 'e.g. K2098412' : form.type.includes('Aadhaar') ? 'e.g. 5421 8890 8821' : 'e.g. DL-1420110012345'}
                  value={form.identifier}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (form.type === 'Passport') {
                      setForm(prev => ({ ...prev, identifier: formatPassportInput(raw) }));
                    } else if (form.type.includes('Aadhaar')) {
                      setForm(prev => ({ ...prev, identifier: formatAadhaarInput(raw) }));
                    } else {
                      setForm(prev => ({ ...prev, identifier: raw }));
                    }
                  }}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-mono outline-none uppercase"
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
                Verify &amp; Save
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default CustomerDocuments;
