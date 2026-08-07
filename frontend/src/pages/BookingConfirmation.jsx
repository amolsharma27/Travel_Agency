import { useSearchParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiDownload } from 'react-icons/fi';
import api from '../api/axios.js';

const BookingConfirmation = () => {
  const [params] = useSearchParams();
  const type = params.get('type');
  const id = params.get('id');

  const downloadInvoice = async () => {
    const res = await api.get(`/invoices/${type}/${id}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-5 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lagoon-50 dark:bg-lagoon-700/20 text-lagoon-600">
        <FiCheckCircle size={32} />
      </div>
      <h1 className="mt-6 font-display text-3xl font-semibold">Booking received!</h1>
      <p className="mt-2 text-ink/60 dark:text-paper/60">
        Your payment was successful. The {type === 'hotel' ? 'hotel' : 'agency'} will confirm your booking shortly —
        you'll get an email and an in-app notification either way.
      </p>

      <div className="mt-8 flex gap-3">
        <button onClick={downloadInvoice} className="flex items-center gap-2 rounded-lg bg-lagoon-500 px-5 py-2.5 text-sm font-semibold text-paper hover:bg-lagoon-600">
          <FiDownload /> Download receipt
        </button>
        <Link to="/dashboard/bookings" className="rounded-lg border border-ink/10 dark:border-paper/20 px-5 py-2.5 text-sm font-semibold">
          View my bookings
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmation;
