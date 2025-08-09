import React, { useState, useEffect } from 'react';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ 
    totalUsers: 0, 
    totalStores: 0, 
    totalRatings: 0 
  });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [storeOwners, setStoreOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'USER'
  });
  const [storeForm, setStoreForm] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: ''
  });

  // Filter states
  const [userFilters, setUserFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: ''
  });

  // Sort states
  const [userSort, setUserSort] = useState({ field: '', direction: 'asc' });
  const [storeSort, setStoreSort] = useState({ field: '', direction: 'asc' });

  // API Configuration
//   const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/admin';
const API_BASE_URL =  'http://localhost:5000/api/admin';

  // Get auth headers with token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      // Handle case where token doesn't exist (redirect to login)
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Enhanced fetch wrapper with error handling
  const fetchData = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await fetchData('/dashboard-stats');
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users with optional filters
  const fetchUsers = async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams(filters);
      const { data } = await fetchData(`/users?${params}`);
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stores
  const fetchStores = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await fetchData('/stores');
      setStores(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch store owners (for store creation form)
  const fetchStoreOwners = async () => {
    try {
      const { data } = await fetchData('/users?role=STORE_OWNER');
      setStoreOwners(data);
    } catch (err) {
      console.error('Error fetching store owners:', err.message);
    }
  };

  // Create new user
  const createUser = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { message } = await fetchData('/create-user', {
        method: 'POST',
        body: JSON.stringify(userForm)
      });
      setSuccess(message);
      setUserForm({ name: '', email: '', password: '', address: '', role: 'USER' });
      fetchUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new store
  const createStore = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { message } = await fetchData('/create-store', {
        method: 'POST',
        body: JSON.stringify(storeForm)
      });
      setSuccess(message);
      setStoreForm({ name: '', email: '', address: '', ownerId: '' });
      fetchStores();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle sorting
  const handleSort = (field, type) => {
    const currentSort = type === 'user' ? userSort : storeSort;
    const newDirection = currentSort.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc';
    
    const sortData = (data) => {
      return [...data].sort((a, b) => {
        const aVal = a[field] || '';
        const bVal = b[field] || '';
        return newDirection === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      });
    };

    if (type === 'user') {
      setUserSort({ field, direction: newDirection });
      setUsers(sortData(users));
    } else {
      setStoreSort({ field, direction: newDirection });
      setStores(sortData(stores));
    }
  };

  // Sort icon component
  const SortIcon = ({ field, currentSort }) => {
    if (currentSort.field !== field) return <span className="text-gray-400">↕️</span>;
    return <span>{currentSort.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  // Handle form input changes
  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'user') {
      setUserForm(prev => ({ ...prev, [name]: value }));
    } else {
      setStoreForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'stores') {
      fetchStores();
      fetchStoreOwners();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage users, stores, and platform statistics</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button onClick={() => setError('')} className="float-right font-bold">×</button>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
            <button onClick={() => setSuccess('')} className="float-right font-bold">×</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
          {[
            { key: 'dashboard', label: '📊 Dashboard' },
            { key: 'users', label: '👥 Users' },
            { key: 'stores', label: '🏪 Stores' },
            { key: 'create-user', label: '➕ Add User' },
            { key: 'create-store', label: '🏪➕ Add Store' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Stats */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🏪</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Total Stores</h3>
                  <p className="text-3xl font-bold text-green-600">{stats.totalStores}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Total Ratings</h3>
                  <p className="text-3xl font-bold text-yellow-600">{stats.totalRatings}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Management */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">All Users</h2>
              
              {/* Filters */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Filter by name"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={userFilters.name}
                  onChange={(e) => setUserFilters({...userFilters, name: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Filter by email"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={userFilters.email}
                  onChange={(e) => setUserFilters({...userFilters, email: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Filter by address"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={userFilters.address}
                  onChange={(e) => setUserFilters({...userFilters, address: e.target.value})}
                />
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={userFilters.role}
                  onChange={(e) => setUserFilters({...userFilters, role: e.target.value})}
                >
                  <option value="">All Roles</option>
                  <option value="USER">User</option>
                  <option value="STORE_OWNER">Store Owner</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <button
                onClick={() => fetchUsers(userFilters)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Applying...' : 'Apply Filters'}
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('name', 'user')}
                    >
                      Name <SortIcon field="name" currentSort={userSort} />
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('email', 'user')}
                    >
                      Email <SortIcon field="email" currentSort={userSort} />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('role', 'user')}
                    >
                      Role <SortIcon field="role" currentSort={userSort} />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Store Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {user.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                          user.role === 'STORE_OWNER' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.store?.averageRating ? (
                          <div className="flex items-center">
                            <span className="mr-1">⭐</span>
                            <span className="font-medium">{user.store.averageRating.toFixed(1)}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && !loading && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stores Management */}
        {activeTab === 'stores' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">All Stores</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('name', 'store')}
                    >
                      Store Name <SortIcon field="name" currentSort={storeSort} />
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('email', 'store')}
                    >
                      Email <SortIcon field="email" currentSort={storeSort} />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stores.map((store) => (
                    <tr key={store.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {store.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {store.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {store.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {store.averageRating ? (
                          <div className="flex items-center">
                            <span className="mr-1">⭐</span>
                            <span className="font-medium">{store.averageRating.toFixed(1)}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">No ratings</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {stores.length === 0 && !loading && (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        No stores found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create User Form */}
        {activeTab === 'create-user' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-6">Create New User</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userForm.name}
                    onChange={(e) => handleInputChange(e, 'user')}
                    placeholder="Enter user name (20-60 characters)"
                  />
                  <p className="text-xs text-gray-500 mt-1">20-60 characters required</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userForm.email}
                    onChange={(e) => handleInputChange(e, 'user')}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userForm.password}
                    onChange={(e) => handleInputChange(e, 'user')}
                    placeholder="Enter password"
                  />
                  <p className="text-xs text-gray-500 mt-1">8-16 characters, uppercase & special character required</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    name="role"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userForm.role}
                    onChange={(e) => handleInputChange(e, 'user')}
                  >
                    <option value="USER">Normal User</option>
                    <option value="STORE_OWNER">Store Owner</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  name="address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  value={userForm.address}
                  onChange={(e) => handleInputChange(e, 'user')}
                  placeholder="Enter address (maximum 400 characters)"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum 400 characters</p>
              </div>
              
              <button
                onClick={createUser}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </div>
        )}

        {/* Create Store Form */}
        {activeTab === 'create-store' && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-6">Create New Store</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={storeForm.name}
                    onChange={(e) => handleInputChange(e, 'store')}
                    placeholder="Enter store name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={storeForm.email}
                    onChange={(e) => handleInputChange(e, 'store')}
                    placeholder="Enter store email"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Owner</label>
                  <select
                    name="ownerId"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={storeForm.ownerId}
                    onChange={(e) => handleInputChange(e, 'store')}
                  >
                    <option value="">Select Store Owner</option>
                    {storeOwners.map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.name} ({owner.email})
                      </option>
                    ))}
                  </select>
                  {storeOwners.length === 0 && (
                    <p className="text-xs text-orange-600 mt-1">
                      No store owners available. Create a store owner user first.
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Address</label>
                <textarea
                  name="address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  value={storeForm.address}
                  onChange={(e) => handleInputChange(e, 'store')}
                  placeholder="Enter store address (maximum 400 characters)"
                />
              </div>
              
              <button
                onClick={createStore}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Creating...' : 'Create Store'}
              </button>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;