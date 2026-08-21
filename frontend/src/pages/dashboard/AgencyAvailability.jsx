import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiSliders, FiCalendar, FiUsers, FiHome, FiCheckCircle,
  FiPlus, FiMinus, FiEdit2, FiClock
} from 'react-icons/fi';

const mockTourDepartures = [
  { id: 'dep_101', tour: 'Himachal Group Tour (Jibhi & Jalori Pass)', date: '28 Aug 2026 (Every Friday)', totalSeats: 24, bookedSeats: 22, availableSeats: 2, status: 'Fast Filling' },
  { id: 'dep_102', tour: 'Himachal Group Tour (Jibhi & Jalori Pass)', date: '04 Sep 2026 (Friday Batch)', totalSeats: 24, bookedSeats: 14, availableSeats: 10, status: 'Open' },
  { id: 'dep_103', tour: 'Kashmir Paradise Group Tour', date: '02 Sep 2026 (Wednesday Batch)', totalSeats: 20, bookedSeats: 16, availableSeats: 4, status: 'Fast Filling' },
  { id: 'dep_104', tour: 'Rajasthan Royal Heritage Group Tour', date: '15 Sep 2026 (Weekly Departure)', totalSeats: 18, bookedSeats: 12, availableSeats: 6, status: 'Open' },
  { id: 'dep_105', tour: 'Spiti Valley 4x4 Expedition', date: '12 Sep 2026 (Special Batch)', totalSeats: 12, bookedSeats: 4, availableSeats: 8, status: 'Open' }
];

const mockHotelRoomAvailability = [
  { id: 'rm_101', property: 'Snow Valley Himalayan Cedar Resort', roomType: 'Deluxe Pine-View Balcony Room', totalRooms: 12, bookedRooms: 8, availableRooms: 4 },
  { id: 'rm_102', property: 'Snow Valley Himalayan Cedar Resort', roomType: 'Executive Himalayan Suite', totalRooms: 8, bookedRooms: 5, availableRooms: 3 },
  { id: 'rm_103', property: 'The Heritage Houseboat Floating Palace', roomType: 'Royal Cedar Suite with Dal Lake View', totalRooms: 6, bookedRooms: 4, availableRooms: 2 },
  { id: 'rm_104', property: 'Tirthan Valley Riverside Wooden Chalet', roomType: 'Riverside Alpine Wooden Cottage', totalRooms: 10, bookedRooms: 7, availableRooms: 3 }
];

const AgencyAvailability = () => {
  const [activeTab, setActiveTab] = useState('tours'); // 'tours' | 'hotels'
  const [tours, setTours] = useState(mockTourDepartures);
  const [rooms, setRooms] = useState(mockHotelRoomAvailability);

  const adjustTourSeat = (id, delta) => {
    setTours(prev => prev.map(t => {
      if (t.id !== id) return t;
      const newAvail = Math.max(0, t.availableSeats + delta);
      const newTotal = t.bookedSeats + newAvail;
      return {
        ...t,
        availableSeats: newAvail,
        totalSeats: newTotal,
        status: newAvail === 0 ? 'Sold Out' : newAvail <= 3 ? 'Fast Filling' : 'Open'
      };
    }));
    toast.success('Tour seat inventory updated');
  };

  const adjustRoomCount = (id, delta) => {
    setRooms(prev => prev.map(r => {
      if (r.id !== id) return r;
      const newAvail = Math.max(0, r.availableRooms + delta);
      return {
        ...r,
        availableRooms: newAvail,
        totalRooms: r.bookedRooms + newAvail
      };
    }));
    toast.success('Room inventory updated');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white">
            Inventory &amp; Slot Availability Calendar
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time control over tour bus seat allocations, departure batch schedules, and hotel room vacancies.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white dark:bg-[#0F1D30] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <button
          onClick={() => setActiveTab('tours')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'tours'
              ? 'bg-[#0F2942] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FiUsers /> Tour Departure Seats
        </button>
        <button
          onClick={() => setActiveTab('hotels')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'hotels'
              ? 'bg-[#0F2942] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FiHome /> Stay &amp; Room Vacancies
        </button>
      </div>

      {/* Content Table */}
      {activeTab === 'tours' ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
            Upcoming Tour Departure Slots &amp; Bus Allocations
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="pb-3">Tour Package</th>
                  <th className="pb-3">Departure Date</th>
                  <th className="pb-3">Total Seats</th>
                  <th className="pb-3">Booked Seats</th>
                  <th className="pb-3">Available Seats</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Quick Allocation Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tours.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 font-bold text-slate-900 dark:text-white">{t.tour}</td>
                    <td className="py-3.5 text-slate-500 font-semibold">{t.date}</td>
                    <td className="py-3.5 font-mono">{t.totalSeats}</td>
                    <td className="py-3.5 font-mono font-bold text-slate-700 dark:text-slate-300">{t.bookedSeats}</td>
                    <td className="py-3.5 font-mono font-bold text-emerald-600">{t.availableSeats} Left</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'Sold Out'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                          : t.status === 'Fast Filling'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => adjustTourSeat(t.id, -1)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300"
                          title="Reduce 1 Seat"
                        >
                          <FiMinus size={12} />
                        </button>
                        <button
                          onClick={() => adjustTourSeat(t.id, 1)}
                          className="p-1.5 rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white transition shadow"
                          title="Add 1 Seat"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F1D30] p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
            Hotel &amp; Resort Room Inventories
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="pb-3">Property</th>
                  <th className="pb-3">Room Category</th>
                  <th className="pb-3">Total Rooms</th>
                  <th className="pb-3">Booked Rooms</th>
                  <th className="pb-3">Available Rooms</th>
                  <th className="pb-3 text-right">Adjust Vacancies</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rooms.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 font-bold text-slate-900 dark:text-white">{r.property}</td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-300">{r.roomType}</td>
                    <td className="py-3.5 font-mono">{r.totalRooms}</td>
                    <td className="py-3.5 font-mono font-bold text-slate-700 dark:text-slate-300">{r.bookedRooms}</td>
                    <td className="py-3.5 font-mono font-bold text-emerald-600">{r.availableRooms} Vacant</td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => adjustRoomCount(r.id, -1)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition text-slate-600 dark:text-slate-300"
                        >
                          <FiMinus size={12} />
                        </button>
                        <button
                          onClick={() => adjustRoomCount(r.id, 1)}
                          className="p-1.5 rounded-lg bg-[#0F2942] hover:bg-[#E11D48] text-white transition shadow"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AgencyAvailability;
