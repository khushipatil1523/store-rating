import React, { useEffect, useState } from 'react';
import { Star, MapPin, User } from 'lucide-react';

function StarRating({ rating = 0, onRatingChange = () => {}, readonly = false }) {
  const intRating = Math.round(Number(rating) || 0);
  return (
    <div className="flex items-center space-x-1" role="img" aria-label={`Rating: ${intRating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          aria-label={readonly ? `Star ${star}` : `Set ${star} stars`}
          onClick={() => !readonly && onRatingChange(star)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-transform hover:scale-110`}
        >
          <Star className={`w-5 h-5 ${star <= intRating ? 'text-yellow-400' : 'text-gray-300'}`} />
        </button>
      ))}
    </div>
  );
}

function OwnerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', address: '' });

  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    let mounted = true;
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:5000/api/store-owner/dashboard', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || 'Failed to fetch dashboard');
        if (!mounted) return;
        setDashboard(json);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Unknown error');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDashboard();
    return () => { mounted = false; };
  }, [token]);

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('http://localhost:5000/api/store-owner/create-store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Failed to create store');
      alert('Store created successfully!');
      window.location.reload();
    } catch (err) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading dashboard…</p>
      </div>
    );
  }

  // If no store found, show create store form
  if (error && error.includes('No store found for this owner')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleCreateStore} className="bg-white shadow-md rounded p-6 w-96">
          <h2 className="text-xl font-bold mb-4">Create Your Store</h2>
          <input
            type="text"
            placeholder="Store Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="border rounded w-full p-2 mb-3"
          />
          <input
            type="email"
            placeholder="Store Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="border rounded w-full p-2 mb-3"
          />
          <input
            type="text"
            placeholder="Store Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="border rounded w-full p-2 mb-3"
          />
          <button
            type="submit"
            disabled={creating}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            {creating ? 'Creating…' : 'Create Store'}
          </button>
        </form>
      </div>
    );
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600">{error}</div>;
  }

  if (!dashboard || !dashboard.store) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">No store data available.</div>;
  }

  const { store, ratingsData = [] } = dashboard;
  const avgText =
    store.averageRating !== null && store.averageRating !== undefined
      ? Number(store.averageRating).toFixed(2)
      : 'No ratings yet';

return (
  <div className="min-h-screen bg-gray-50">
    {/* Store Header */}
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        {/* Store Initial Badge */}
        <div className="mx-auto mb-4 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="font-bold text-blue-600 text-2xl">
            {(store.name || "").slice(0, 2).toUpperCase()}
          </span>
        </div>

        {/* Store Name */}
        <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>

        {/* Average Rating */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-3">
          <div className="flex items-center">
            <StarRating rating={store.averageRating} readonly />
            <span className="ml-2 text-lg font-semibold">
              {store.averageRating !== null && store.averageRating !== undefined
                ? Number(store.averageRating).toFixed(2)
                : "No ratings yet"}
            </span>
          </div>
          {store.totalRatings !== undefined && (
            <span className="text-sm text-gray-500">
              ({store.totalRatings} ratings)
            </span>
          )}
        </div>

        {/* Store Address */}
        {store.address && (
          <div className="mt-2 text-gray-600 text-sm">
            {store.address}
          </div>
        )}
      </div>
    </div>

    {/* Ratings List */}
    <div className="max-w-4xl mx-auto mt-6 bg-white p-6 shadow-md rounded">
      {ratingsData.length === 0 ? (
        <p className="text-gray-500 text-center">No ratings yet.</p>
      ) : (
        ratingsData.map((r) => (
          <div
            key={r.id}
            className="border-b last:border-none py-3 flex justify-between items-center"
          >
            <span className="font-medium">{r.user?.name || "Anonymous"}</span>
            <StarRating rating={r.value} readonly />
          </div>
        ))
      )}
    </div>
  </div>
);

}

export default OwnerDashboard;
