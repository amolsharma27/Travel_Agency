import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';
import HotelCard from '../../components/HotelCard.jsx';
import PackageCard from '../../components/PackageCard.jsx';

const CustomerWishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/wishlist');
      setItems(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (itemType, itemId) => {
    try {
      await api.post('/wishlist/toggle', { itemType, itemId });
      toast.success('Removed from wishlist');
      load();
    } catch {
      toast.error('Could not update wishlist');
    }
  };

  if (loading) return <p className="text-sm text-ink/50 dark:text-paper/50">Loading…</p>;
  if (items.length === 0) {
    return (
      <div className="rounded-xl2 border border-dashed border-ink/15 dark:border-paper/20 py-16 text-center">
        <p className="font-display text-lg font-semibold">Your wishlist is empty</p>
        <p className="mt-1 text-sm text-ink/60 dark:text-paper/60">Tap the heart icon on any hotel or package to save it here.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) =>
        item.itemType === 'hotel' && item.hotel ? (
          <HotelCard key={item._id} hotel={item.hotel} wishlisted onToggleWishlist={() => remove('hotel', item.hotel._id)} />
        ) : item.package ? (
          <PackageCard key={item._id} pkg={item.package} wishlisted onToggleWishlist={() => remove('package', item.package._id)} />
        ) : null
      )}
    </div>
  );
};

export default CustomerWishlist;
