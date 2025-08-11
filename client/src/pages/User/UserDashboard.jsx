import React, { useEffect, useState } from 'react';
import { Star, MapPin, ArrowLeft, User, Search, X } from 'lucide-react';

// Star Rating Component
function StarRating({ rating, onRatingChange, readonly = false }) {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRatingChange(star)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-transform hover:scale-110`}
        >
          <Star
            className={`w-5 h-5 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// Search Bar Component
function SearchBar({ searchTerm, onSearchChange, onClearSearch }) {
  return (
    <div className="relative max-w-md mx-auto mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search stores by name or address..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
        {searchTerm && (
          <button
            onClick={onClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

// Store Card Component
function StoreCard({ store, onClick, searchTerm }) {
  // Highlight search matches
  const highlightText = (text, search) => {
    if (!search) return text;
    
    const regex = new RegExp(`(${search})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* Store Image Placeholder */}
      <div className="h-48 bg-blue-100 flex items-center justify-center">
        <span className="text-blue-600 text-lg font-medium">{store.name}</span>
      </div>

      {/* Store Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {highlightText(store.name, searchTerm)}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">
            {highlightText(store.address, searchTerm)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <StarRating 
              rating={parseFloat(store.averageRating) || 0} 
              readonly={true} 
            />
            <span className="text-sm text-gray-600">
              ({store.ratings?.length || 0})
            </span>
          </div>
          
          {store.yourRating && (
            <div className="bg-blue-50 px-2 py-1 rounded">
              <span className="text-xs text-blue-700">
                Your: {store.yourRating}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Store Details Component
function StoreDetails({ store, onBack, onRatingSubmit, ratingsInput, onRatingChange }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  
  const handleRatingSubmit = async (storeId) => {
    setIsSubmitting(true);
    setSubmitStatus('');
    
    try {
      await onRatingSubmit(storeId);
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus(''), 3000);
    } catch (err) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button 
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Stores
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Store Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="h-64 bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 text-2xl font-medium">{store.name}</span>
          </div>

          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{store.name}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{store.address}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Average Rating: {store.averageRating || 'No ratings yet'}</p>
                <p className="text-gray-600">Your Rating: {store.yourRating || 'Not rated'}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Rate This Store</h3>
                <div className="flex items-center space-x-3 mb-3">
                  <StarRating 
                    rating={ratingsInput[store.id] || 0}
                    onRatingChange={(rating) => onRatingChange(store.id, rating)}
                  />
                </div>
                <button
                  onClick={() => handleRatingSubmit(store.id)}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2 rounded transition-colors ${
                    submitStatus === 'success' 
                      ? 'bg-green-600 text-white' 
                      : submitStatus === 'error'
                      ? 'bg-red-600 text-white'
                      : isSubmitting
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isSubmitting 
                    ? 'Submitting...' 
                    : submitStatus === 'success' 
                    ? 'Rating Updated!' 
                    : submitStatus === 'error'
                    ? 'Failed - Try Again'
                    : store.yourRating 
                    ? 'Update Rating' 
                    : 'Submit Rating'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">All Reviews</h2>
          
          {store.ratings && store.ratings.length > 0 ? (
            <div className="space-y-4">
              {store.ratings.map((rating) => (
                <div key={rating.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium">{rating.userName}</span>
                      <StarRating rating={rating.value} readonly={true} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No reviews yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Main User Dashboard Component
function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ratingsInput, setRatingsInput] = useState({});
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStores, setFilteredStores] = useState([]);
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:5000/api/user/stores', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch stores');
        const data = await res.json();
        setStores(data);
        setFilteredStores(data);

        const initialRatings = {};
        data.forEach(store => {
          initialRatings[store.id] = store.yourRating || 0;
        });
        setRatingsInput(initialRatings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [token]);

  // Filter stores based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStores(stores);
    } else {
      const filtered = stores.filter(store => 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStores(filtered);
    }
  }, [searchTerm, stores]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleRatingChange = (storeId, value) => {
    setRatingsInput(prev => ({ ...prev, [storeId]: value }));
  };

  const submitRating = async (storeId) => {
    const value = ratingsInput[storeId];
    if (!value || value < 1 || value > 5) {
      alert('Please select a rating between 1 and 5');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/user/submit-rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ storeId, value }),
      });
      if (!res.ok) throw new Error('Failed to submit rating');
      const result = await res.json();

      // Update both stores list and selected store
      setStores(prevStores =>
        prevStores.map(store => {
          if (store.id === storeId) {
            const updatedStore = {
              ...store,
              yourRating: value,
            };
            return updatedStore;
          }
          return store;
        })
      );

      // Update selected store if it's the same one
      if (selectedStore && selectedStore.id === storeId) {
        setSelectedStore(prevStore => ({
          ...prevStore,
          yourRating: value
        }));
      }

    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  // Show store details if a store is selected
  if (selectedStore) {
    return (
      <StoreDetails 
        store={selectedStore}
        onBack={() => setSelectedStore(null)}
        onRatingSubmit={submitRating}
        ratingsInput={ratingsInput}
        onRatingChange={handleRatingChange}
      />
    );
  }

  // Store listing view
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Store Directory</h1>
          <p className="text-gray-600 mt-1">Browse and rate stores</p>
        </div>
      </div>

      {/* Search and Results */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
        />

        {/* Search Results Info */}
        {searchTerm && (
          <div className="mb-4 text-center">
            <p className="text-gray-600">
              {filteredStores.length === 0 
                ? `No stores found for "${searchTerm}"`
                : `Found ${filteredStores.length} store${filteredStores.length === 1 ? '' : 's'} matching "${searchTerm}"`
              }
            </p>
          </div>
        )}

        {/* Store Grid */}
        {filteredStores.length === 0 && !searchTerm ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No stores available</p>
          </div>
        ) : filteredStores.length === 0 && searchTerm ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto mb-2" />
            </div>
            <p className="text-gray-600 mb-2">No stores match your search</p>
            <p className="text-gray-500 text-sm">Try searching with different keywords or check the spelling</p>
            <button
              onClick={handleClearSearch}
              className="mt-4 text-blue-600 hover:text-blue-700 underline"
            >
              Clear search to see all stores
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map(store => (
              <StoreCard 
                key={store.id} 
                store={store} 
                onClick={() => setSelectedStore(store)}
                searchTerm={searchTerm}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;