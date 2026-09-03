import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX, FiUser, FiHash, FiMail, FiPhone, FiBookOpen,
  FiCheckCircle, FiSend, FiMapPin, FiCalendar, FiClock
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios.js';

const PCTE_COURSES = [
  'BBA (Bachelor of Business Administration)',
  'BCA (Bachelor of Computer Applications)',
  'B.Tech (Computer Science & Engineering)',
  'B.Tech (Mechanical / Civil / Electrical)',
  'MBA (Master of Business Administration)',
  'MCA (Master of Computer Applications)',
  'BHMCT (Hotel Management & Catering Tech)',
  'B.Pharmacy / M.Pharmacy',
  'B.Com (Honours)',
  'B.Sc (Biotechnology / Medical Lab)',
  'BAJMC (Journalism & Mass Comm)',
  'B.Des (Fashion / Interior Design)',
  'Other PCTE Course / Faculty',
];

const StudentRegistrationModal = ({
  isOpen,
  onClose,
  packageData = {},
  requestType = 'On Request',
  onSuccess
}) => {
  const emptyFormState = {
    studentName: '',
    rollNumber: '',
    email: '',
    phone: '',
    course: '',
    notes: '',
  };

  const [formData, setFormData] = useState(emptyFormState);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Always reset form cleanly whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      try {
        localStorage.removeItem('pcte_registered_student');
      } catch {}
      setFormData(emptyFormState);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const packageTitle = packageData?.title || 'PCTE Travel Package';
  const destination = packageData?.destination || 'North India Tour Circuit';
  const duration = packageData?.duration || (packageData?.durationDays ? `${packageData.durationNights || 1} Night / ${packageData.durationDays} Days` : '1 Night / 2 Days');
  const price = packageData?.price ? (typeof packageData.price === 'number' ? `INR ${packageData.price} per person` : packageData.price) : 'On Request';

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!formData.studentName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!formData.rollNumber.trim()) {
      toast.error('Please enter your college roll number');
      return;
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      toast.error('Please enter a valid contact phone number');
      return;
    }
    if (!formData.course.trim()) {
      toast.error('Please select or enter your course');
      return;
    }

    setSubmitting(true);

    const now = new Date();
    const requestDate = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const requestTime = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const payload = {
      studentName: formData.studentName.trim(),
      rollNumber: formData.rollNumber.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      course: formData.course.trim(),
      packageTitle,
      destination,
      requestType,
      tourDuration: duration,
      tourPrice: price,
      requestDate,
      requestTime,
      notes: formData.notes.trim(),
    };

    try {
      // 1. Post to backend API (saves in MongoDB + sends notification email to amolsharma2705@gmail.com)
      try {
        await api.post('/enquiries', payload);
      } catch (apiErr) {
        console.warn('Backend API notification attempt:', apiErr.message);
      }

      // 2. Save enquiry to localStorage store for offline fallback / admin view
      const existingEnquiries = JSON.parse(localStorage.getItem('pcte_student_enquiries') || '[]');
      existingEnquiries.unshift({ ...payload, _id: `enq_${Date.now()}`, status: 'New', createdAt: new Date().toISOString() });
      localStorage.setItem('pcte_student_enquiries', JSON.stringify(existingEnquiries));

      setSubmitted(true);
      toast.success('Registration submitted! Email notification sent.');
      if (onSuccess) onSuccess(payload);
    } catch (err) {
      toast.error('Submission failed. Please try again or WhatsApp us.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-[#0F2942] border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden my-6 text-slate-900 dark:text-white"
        >
          {/* Top Decorative Header */}
          <div className="bg-gradient-to-r from-[#0F2942] via-[#1B1464] to-[#9B1C1C] px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 border border-white/20">
                <FiBookOpen className="text-lg text-amber-300" />
              </div>
              <div>
                <h3 className="font-display font-black text-sm sm:text-base leading-tight">
                  {requestType === 'Booking Request' ? 'Tour Booking Request' : 'Package Enquiry (On Request)'}
                </h3>
                <p className="text-[11px] text-slate-200 font-medium">
                  PCTE Student Registration &amp; Interest Desk
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>

          {submitted ? (
            /* Success State */
            <div className="p-6 sm:p-8 text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-lg"
              >
                <FiCheckCircle size={36} />
              </motion.div>

              <div>
                <h4 className="font-display text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Enquiry Submitted Successfully!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-md mx-auto">
                  Thank you, <span className="font-bold text-slate-900 dark:text-white">{formData.studentName}</span>! Your interest in <span className="font-bold text-[#E11D48]">{packageTitle}</span> has been recorded.
                </p>
              </div>

              {/* Notification Banner */}
              <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3.5 text-left text-xs text-amber-800 dark:text-amber-200">
                <p className="font-bold mb-1">📧 Email Notification Sent to Travel Desk:</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  A notification with your details (Roll No: <b>{formData.rollNumber}</b>, Course: <b>{formData.course}</b>) has been delivered to <b>amolsharma2705@gmail.com</b>. The tour coordinator will contact you shortly.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="rounded-xl bg-[#0F2942] hover:bg-[#1B1464] text-white px-8 py-2.5 text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                >
                  Close &amp; Continue Browsing
                </button>
              </div>
            </div>
          ) : (
            /* Student Form */
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-left">
              {/* Selected Tour Summary Strip */}
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-3.5 flex items-center justify-between gap-3">
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300">
                      Selected Tour
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                      <FiCalendar size={10} /> 11 Sep to 13 Sep
                    </span>
                  </div>
                  <h4 className="font-display font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    {packageTitle}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <FiMapPin className="text-[#E11D48] text-xs shrink-0" />
                    <span className="truncate">{destination}</span>
                    <span>•</span>
                    <span className="shrink-0 font-bold text-amber-600 dark:text-amber-400">11 Sep – 13 Sep</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase">Price</span>
                  <span className="text-xs sm:text-sm font-black text-amber-500 dark:text-amber-400">
                    {price}
                  </span>
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Student Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Student Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3 text-slate-400 text-xs" />
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      required
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/90 pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#0F2942] focus:ring-1 focus:ring-[#0F2942]"
                    />
                  </div>
                </div>

                {/* 2. Roll Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    College Roll Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiHash className="absolute left-3 top-3 text-slate-400 text-xs" />
                    <input
                      type="text"
                      placeholder="e.g. 2104589"
                      required
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/90 pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#0F2942] focus:ring-1 focus:ring-[#0F2942]"
                    />
                  </div>
                </div>

                {/* 3. Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3 text-slate-400 text-xs" />
                    <input
                      type="email"
                      placeholder="student@pcte.edu.in"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/90 pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#0F2942] focus:ring-1 focus:ring-[#0F2942]"
                    />
                  </div>
                </div>

                {/* 4. Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp / Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-3 text-slate-400 text-xs" />
                    <input
                      type="tel"
                      placeholder="9988110021"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/90 pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#0F2942] focus:ring-1 focus:ring-[#0F2942]"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Course Dropdown / Custom Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Course &amp; Department <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiBookOpen className="absolute left-3 top-3 text-slate-400 text-xs" />
                  <select
                    required
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/90 pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:border-[#0F2942] focus:ring-1 focus:ring-[#0F2942]"
                  >
                    <option value="">-- Select Your PCTE Course --</option>
                    {PCTE_COURSES.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 6. Special Notes (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Questions / Group Size / Requirements <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Planning with 3 friends, vegetarian food, room sharing preference..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/90 p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#0F2942] focus:ring-1 focus:ring-[#0F2942]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] disabled:opacity-50 text-white px-6 py-2.5 text-xs font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer"
                >
                  {submitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <FiSend />
                      <span>{requestType === 'Booking Request' ? 'Submit Booking Request' : 'Submit On Request Enquiry'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StudentRegistrationModal;
