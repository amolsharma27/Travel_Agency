import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiShield, FiCheckCircle, FiFileText, FiCalendar, FiClock,
  FiHelpCircle, FiArrowRight, FiPhoneCall, FiAlertCircle, FiExternalLink
} from 'react-icons/fi';
import { FaPassport, FaWhatsapp, FaUserCheck } from 'react-icons/fa';
import api from '../api/axios.js';
import { mockPassportPlans, passportDocumentChecklists } from '../data/mockData.js';
import { useAuth } from '../context/AuthContext.jsx';

const pskCenters = [
  'PSK Ludhiana (Near Model Town)',
  'PSK Jalandhar (Near BMC Chowk)',
  'PSK Chandigarh (Industrial Area Phase 2)',
  'PSK Amritsar (Near Circuit House)',
  'POPSK Hoshiarpur / Patiala / Bathinda',
  'PSK Delhi (Herald House / Bhikaji Cama Place)',
  'PSK Gurgaon / Noida'
];

const PassportServices = () => {
  const [plans, setPlans] = useState(mockPassportPlans);
  const [selectedPlanId, setSelectedPlanId] = useState('pass_fresh');
  const [selectedChecklistTab, setSelectedChecklistTab] = useState('fresh');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Application Request Form State
  const [applicantName, setApplicantName] = useState(user?.name || '');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [preferredPSK, setPreferredPSK] = useState(pskCenters[0]);
  const [hasPreviousPassport, setHasPreviousPassport] = useState('no');
  const [specialNotes, setSpecialNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successSubmission, setSuccessSubmission] = useState(null);

  useEffect(() => {
    api.get('/passport-services').then(({ data }) => {
      if (data?.data) setPlans(data.data);
    }).catch(() => {});
  }, []);

  const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[0];
  const totalPayable = selectedPlan.officialGovtFee + selectedPlan.agencyServiceFee;

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in or register to submit your passport assistance request');
      navigate('/login?redirect=/passport-services');
      return;
    }
    if (!applicantName || !dob || !phone || !email) {
      toast.error('Please fill in all mandatory applicant details');
      return;
    }
    setSubmitting(true);


    try {
      const trackingId = 'MEA-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const payload = {
        bookingType: 'passport',
        servicePlanId: selectedPlan.id,
        serviceTitle: selectedPlan.name,
        applicantName,
        dob,
        contactPhone: phone,
        contactEmail: email,
        preferredPSK,
        hasPreviousPassport: hasPreviousPassport === 'yes',
        specialNotes,
        govtFee: selectedPlan.officialGovtFee,
        agencyFee: selectedPlan.agencyServiceFee,
        totalAmount: totalPayable,
        applicationTrackingId: trackingId,
        status: 'under_review',
        paymentStatus: 'paid'
      };

      const res = await api.post('/passport-requests', payload);
      setSuccessSubmission(res.data?.data || payload);
      toast.success('Passport Assistance Request submitted successfully!');
    } catch {
      toast.error('Could not submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1727] min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="inline-block rounded-full bg-amber-100 dark:bg-amber-950/60 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            Consultancy &amp; Application Facilitation
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-black text-slate-900 dark:text-white mt-2">
            Passport Application Assistance
          </h1>
          <p className="mt-2 text-xs md:text-sm text-slate-600 dark:text-slate-300">
            Professional guidance, document error pre-screening, appointment slot scheduling, and step-by-step assistance for Indian Passport applicants.
          </p>
        </div>

        {/* MANDATORY GOVERNMENT ADVISORY BANNER */}
        <div className="mb-10 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-400/50 p-5 md:p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <FiAlertCircle className="text-amber-600 dark:text-amber-400 text-2xl shrink-0 mt-0.5" />
            <div className="space-y-1.5 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              <h3 className="font-display text-sm font-black uppercase tracking-wide text-amber-950 dark:text-amber-100">
                Official Ministry of External Affairs Advisory
              </h3>
              <p>
                <b>Important Notice:</b> Passports in the Republic of India are processed, verified, and issued exclusively by the Ministry of External Affairs (MEA), Government of India via official Passport Seva Kendras (PSK / POPSK).
              </p>
              <p>
                <b>Northgate Travels</b> operates as an independent travel consultancy providing application preparation, document pre-screening to minimize rejection risks, appointment slot booking, and client guidance.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold">
                <a
                  href="https://www.passportindia.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-800 dark:text-amber-300 hover:underline"
                >
                  Visit Official Government Portal (passportindia.gov.in) <FiExternalLink />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 5-STEP ASSISTANCE WORKFLOW DIAGRAM */}
        <div className="mb-14 rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase text-[#E11D48]">Clear &amp; Transparent Procedure</span>
            <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white mt-1">
              How Our Assistance Service Works
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { step: '1', title: 'Select Service & Fill Request', desc: 'Pick your required service (Fresh, Renewal, Tatkaal, Minor, PCC) and submit basic applicant details.' },
              { step: '2', title: 'Document Pre-Screening', desc: 'Our passport executive verifies your documents against MEA guidelines to prevent rejection at PSK.' },
              { step: '3', title: 'Official Form Submission', desc: 'We prepare and file your official application form on the Government of India Passport Seva portal.' },
              { step: '4', title: 'Appointment Scheduling', desc: 'We book your preferred biometric & photo interview appointment slot at your nearest PSK.' },
              { step: '5', title: 'PSK Visit & Dispatch Tracking', desc: 'Visit PSK with our organized dossier. Track police verification and speed post dispatch status.' }
            ].map((st) => (
              <div key={st.step} className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700 space-y-2 relative">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F2942] text-xs font-black text-white font-mono">
                  {st.step}
                </span>
                <h4 className="font-display text-xs font-bold text-slate-900 dark:text-white">{st.title}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* INTERACTIVE SERVICE PLANS & APPLICATION FORM */}
        <div className="grid gap-8 lg:grid-cols-12 mb-14">
          
          {/* Left: Service Selection Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E11D48]">Step 1</span>
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                Select Required Passport Category
              </h2>
            </div>

            <div className="space-y-3">
              {plans.map((p) => {
                const isSelected = selectedPlanId === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all duration-150 ${
                      isSelected
                        ? 'border-[#0F2942] dark:border-amber-400 bg-white dark:bg-[#0F1D30] shadow-md ring-2 ring-[#0F2942]/10'
                        : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-[#0F1D30]/60 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[9px] font-bold uppercase text-slate-600 dark:text-slate-300">
                          {p.category}
                        </span>
                        <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                          {p.name}
                        </h3>
                      </div>
                      <span className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-[#0F2942] bg-[#0F2942] text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <FiCheckCircle size={12} />}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>

                    {/* Fees Breakdown Box */}
                    <div className="mt-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5 text-[11px] space-y-1 border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span>Official MEA Government Fee:</span>
                        <span className="font-mono font-semibold">₹{p.officialGovtFee.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span>Agency Assistance / Service Fee:</span>
                        <span className="font-mono font-semibold text-[#E11D48]">₹{p.agencyServiceFee.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                        <span>Total Payable:</span>
                        <span className="font-mono text-xs">₹{(p.officialGovtFee + p.agencyServiceFee).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Application Request Submission Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
              
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E11D48]">Step 2</span>
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  Apply for Passport Assistance
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Selected: <b className="text-slate-900 dark:text-white">{selectedPlan.name}</b>
                </p>
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-4">
                
                {/* Full Legal Name as per Aadhaar */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Applicant Full Name (Exactly as in Aadhaar / 10th Certificate) *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. PRIYA SHARMA"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white uppercase outline-none focus:border-[#0F2942]"
                  />
                </div>

                {/* DOB & Phone */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                      <FiCalendar className="text-[#E11D48]" /> Date of Birth *
                    </label>
                    <input
                      required
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                      <FiPhoneCall className="text-[#E11D48]" /> Mobile Number (for OTP &amp; Alerts) *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
                    />
                  </div>
                </div>

                {/* Email & Preferred PSK Center */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="priya.sharma@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#0F2942]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      Preferred PSK / Appointment Center *
                    </label>
                    <select
                      value={preferredPSK}
                      onChange={(e) => setPreferredPSK(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-900 dark:text-white outline-none"
                    >
                      {pskCenters.map((psk) => (
                        <option key={psk} value={psk}>{psk}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Previous passport status */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Have you ever held an Indian Passport previously?
                  </label>
                  <div className="flex gap-4 text-xs font-medium">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="prevPass"
                        checked={hasPreviousPassport === 'no'}
                        onChange={() => setHasPreviousPassport('no')}
                        className="accent-[#0F2942]"
                      />
                      No (Fresh First-time applicant)
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="prevPass"
                        checked={hasPreviousPassport === 'yes'}
                        onChange={() => setHasPreviousPassport('yes')}
                        className="accent-[#0F2942]"
                      />
                      Yes (Renewal / Expired / Lost)
                    </label>
                  </div>
                </div>

                {/* Fee Transparency Box */}
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span>Official Govt Fee (Paid directly to Passport Seva):</span>
                    <span className="font-mono font-bold">₹{selectedPlan.officialGovtFee}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                    <span>Agency Pre-screening &amp; Booking Assistance:</span>
                    <span className="font-mono font-bold text-[#E11D48]">₹{selectedPlan.agencyServiceFee}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span>Total Assistance Package Fee:</span>
                    <span className="font-mono text-sm text-[#0F2942] dark:text-amber-300">₹{totalPayable.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white py-3 text-xs font-black uppercase tracking-wider shadow transition-all duration-200"
                >
                  {submitting ? 'Submitting Request…' : 'Submit Passport Assistance Request'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* REQUIRED DOCUMENTS CHECKLIST */}
        <div className="mb-14 rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E11D48]">Document Verification Kit</span>
              <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                Required Documents Checklist by Category
              </h2>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedChecklistTab('fresh')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedChecklistTab === 'fresh'
                    ? 'bg-[#0F2942] text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Fresh Passport
              </button>
              <button
                onClick={() => setSelectedChecklistTab('renewal')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedChecklistTab === 'renewal'
                    ? 'bg-[#0F2942] text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Renewal / Re-issue
              </button>
              <button
                onClick={() => setSelectedChecklistTab('tatkal')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedChecklistTab === 'tatkal'
                    ? 'bg-[#0F2942] text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Tatkaal Urgent
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {passportDocumentChecklists[selectedChecklistTab].map((item, idx) => (
              <div key={idx} className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700 space-y-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FiCheckCircle className="text-emerald-500" /> {item.doc}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 pl-5">
                  {item.options}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <div className="rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Does the applicant need to visit the PSK personally?</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Yes. Under MEA regulations, every applicant (including minors) must personally visit the Passport Seva Kendra on their appointment date for live biometric fingerprinting and photograph capture.
              </p>
            </div>

            <div className="space-y-1 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">How long does police verification take?</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Typically, local police verification takes 7 - 12 working days following your PSK appointment. Our tracking portal sends automated WhatsApp alerts when your file moves.
              </p>
            </div>

            <div className="space-y-1 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">What is Non-ECR status?</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Applicants who have passed 10th standard (Matriculation) or higher qualify for Non-ECR, which means you do not require emigration clearance before traveling abroad for employment.
              </p>
            </div>

            <div className="space-y-1 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Can I change my appointment date if required?</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Yes. You can reschedule your appointment up to 2 times within 1 year from payment without any additional government fee. Our team assists with rescheduling.
              </p>
            </div>
          </div>
        </div>

        {/* APPLICATION SUCCESS MODAL */}
        {successSubmission && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="rounded-2xl bg-white dark:bg-[#0F1D30] border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                  <FiCheckCircle size={24} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">Assistance Request Initiated</h3>
                  <p className="text-xs text-slate-500">File Reference: {successSubmission.applicationTrackingId}</p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 space-y-2 text-xs text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                <p><b>Applicant:</b> {successSubmission.applicantName}</p>
                <p><b>Service Type:</b> {successSubmission.serviceTitle}</p>
                <p><b>Preferred Center:</b> {successSubmission.preferredPSK}</p>
                <p><b>Assistance Status:</b> <span className="text-amber-600 font-bold uppercase">Pre-Screening In Progress</span></p>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Our passport documentation officer will review your application and contact you via phone / WhatsApp (+91 {successSubmission.contactPhone}) within 2 hours to confirm document readiness and lock your PSK slot.
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setSuccessSubmission(null);
                    navigate('/dashboard/bookings');
                  }}
                  className="flex-1 rounded-lg bg-[#0F2942] py-2.5 text-xs font-bold text-white shadow hover:bg-[#E11D48]"
                >
                  View in Dashboard
                </button>
                <button
                  onClick={() => setSuccessSubmission(null)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PassportServices;
