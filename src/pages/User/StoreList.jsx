import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get('http://localhost:5000/user/stores', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStores(res.data);
      } catch (err) {
        console.error('Error fetching stores:', err);
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">All Stores</h1>
      <div className="grid gap-4">
        {stores.map((store) => (
          <div key={store.id} className="border p-4 rounded shadow-sm hover:shadow-md">
            <h2 className="text-xl font-semibold">{store.name}</h2>
            <p className="text-gray-600">{store.address}</p>
            <p className="text-blue-500 font-medium">Avg Rating: {store.averageRating ?? 'Not Rated Yet'}</p>
            <p className="text-sm text-gray-700">Your Rating: {store.userRating ?? 'Not Submitted'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreList;
