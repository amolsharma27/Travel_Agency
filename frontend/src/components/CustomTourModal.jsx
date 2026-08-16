import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiCompass, FiCalendar, FiUsers, FiDollarSign, FiMail, FiPhone, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CustomTourModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: 'Himalayas / Ladakh',
    tourType: 'Climbing Expedition',
    travelDate: '',
    durationDays: 7,
    guestsCount: 2,
    budgetPerPerson: 'Moderate',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please enter your name, email and phone number.');
      return;
    }
    setSubmitted(true);
    toast.success('Your Custom Tour Request has been submitted! Our travel expert will call you shortly.');
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-[#9B1C1C] via-[#771D1D] to-[#1B1464] px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300 backdrop-blur-md">
                  <FiCompass /> PCTE Travel Agency Custom Planner
                </span>
                <h3 className="mt-2 font-display text-xl font-extrabold md:text-2xl">
                  Design Your Custom Dream Itinerary
                </h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
              >
                <FiX className="text-xl" />
              </button>
            </div>
          </div>

          {submitted ? (
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
              >
                <FiCheckCircle className="text-3xl" />
              </motion.div>
              <h4 className="mt-4 font-display text-2xl font-bold text-slate-900 dark:text-white">
                Request Received Successfully!
              </h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Thank you, <span className="font-semibold text-amber-600">{formData.name}</span>. Our senior travel consultant will review your itinerary details for <span className="font-semibold">{formData.destination}</span> and contact you within 2 business hours.
              </p>
              <div className="mt-6 rounded-xl bg-slate-50 p-4 text-left text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300 space-y-1">
                <p><strong>Tour Type:</strong> {formData.tourType}</p>
                <p><strong>Duration:</strong> {formData.durationDays} Days | {formData.guestsCount} Travelers</p>
                <p><strong>Contact:</strong> {formData.phone} | {formData.email}</p>
              </div>
              <button
                onClick={handleReset}
                className="mt-6 rounded-xl bg-amber-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-amber-700 transition-all"
              >
                Done / Back to Exploring
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto p-6 space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Can’t find your exact itinerary? Let our travel experts tailor a personalized journey for your group, honeymoon, or expedition.
              </p>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Destination Region
                  </label>
                  <select
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Himalayas / Ladakh">Ladakh &amp; Himalayan Peaks</option>
                    <option value="Goa Beaches">Goa Beaches &amp; Coastal</option>
                    <option value="Rajasthan Royal">Rajasthan Forts &amp; Desert</option>
                    <option value="Himachal Pradesh">Himachal (Manali / Spiti)</option>
                    <option value="Uttarakhand Rafting & Treks">Uttarakhand (Rishikesh / Kedarnath)</option>
                    <option value="Kerala Backwaters">Kerala Backwaters &amp; Munnar</option>
                    <option value="Kashmir Valley">Kashmir Dal Lake &amp; Snow</option>
                    <option value="Varanasi Heritage">Varanasi Spiritual</option>
                    <option value="Nepal & Bhutan">Nepal &amp; Bhutan International</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Trip Theme
                  </label>
                  <select
                    value={formData.tourType}
                    onChange={(e) => setFormData({ ...formData, tourType: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Climbing Expedition">Climbing Expedition (6000m-7000m)</option>
                    <option value="Himalayan Trek">Himalayan Trekking</option>
                    <option value="Cultural & Heritage">Cultural &amp; Heritage Tour</option>
                    <option value="Beach & Leisure">Beach &amp; Leisure Holiday</option>
                    <option value="Honeymoon Special">Honeymoon Special</option>
                    <option value="Wildlife Safari">Wildlife Safari</option>
                    <option value="Educational School Group">Educational / School Trip</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Approx Travel Date
                  </label>
                  <input
                    type="date"
                    value={formData.travelDate}
                    onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="30"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) || 3 })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    No. of Travelers
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.guestsCount}
                    onChange={(e) => setFormData({ ...formData, guestsCount: parseInt(e.target.value) || 2 })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Personal Contact Details */}
              <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3">
                  Your Contact Details
                </h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Priya Sharma"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-9 pr-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type="email"
                        placeholder="priya@example.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-9 pr-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-3 text-slate-400" />
                      <input
                        type="tel"
                        placeholder="+91 9876543210"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-9 pr-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Special Notes / Custom Requirements
                </label>
                <textarea
                  rows="2"
                  placeholder="Tell us about specific spots you want to visit, accommodation preference (Luxury/Budget/Cottage), dietary requirements, etc."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#9B1C1C] hover:bg-[#1B1464] px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all"
                >
                  Submit Custom Itinerary Request
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CustomTourModal;
