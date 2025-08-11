import React, { useEffect, useState } from "react";
import {
  User,
  Store,
  BarChart3,
  Users,
  Building2,
  Star,
  Filter,
} from "lucide-react";

function AdminDashboard() {
  const BASE_URL = "http://localhost:5000/api/admin";
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [storeOwners, setStoreOwners] = useState([]);

  // Filter states
  const [userFilter, setUserFilter] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [storeFilter, setStoreFilter] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER",
  });
  const [storeForm, setStoreForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [statsRes, usersRes, storesRes, ownersRes] = await Promise.all([
          fetch(`${BASE_URL}/dashboard-stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_URL}/stores`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_URL}/store-owners`, {
            // <-- Added this line
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (!statsRes.ok) throw new Error("Stats fetch failed");
        if (!usersRes.ok) throw new Error("Users fetch failed");
        if (!storesRes.ok) throw new Error("Stores fetch failed");
        if (!ownersRes.ok) throw new Error("Store owners fetch failed");

        setStats(await statsRes.json());
        setUsers(await usersRes.json());
        setStores(await storesRes.json());
        setStoreOwners(await ownersRes.json());
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  // Filter effects
  useEffect(() => {
    let filtered = users.filter((user) => {
      return (
        user.name.toLowerCase().includes(userFilter.name.toLowerCase()) &&
        user.email.toLowerCase().includes(userFilter.email.toLowerCase()) &&
        user.address.toLowerCase().includes(userFilter.address.toLowerCase()) &&
        (userFilter.role === "" || user.role === userFilter.role)
      );
    });
    setFilteredUsers(filtered);
  }, [users, userFilter]);

  useEffect(() => {
    let filtered = stores.filter((store) => {
      return (
        store.name.toLowerCase().includes(storeFilter.name.toLowerCase()) &&
        store.email.toLowerCase().includes(storeFilter.email.toLowerCase()) &&
        store.address.toLowerCase().includes(storeFilter.address.toLowerCase())
      );
    });
    setFilteredStores(filtered);
  }, [stores, storeFilter]);

  const handleInputChange = (e, formSetter) => {
    const { name, value } = e.target;
    formSetter((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e, filterSetter) => {
    const { name, value } = e.target;
    filterSetter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e, endpoint, formData, resetForm) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Request failed");
      }
      alert(
        `${endpoint === "create-user" ? "User" : "Store"} created successfully!`
      );
      resetForm();
      // Refresh data
      const [statsRes, usersRes, storesRes] = await Promise.all([
        fetch(`${BASE_URL}/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${BASE_URL}/stores`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setStats(await statsRes.json());
      setUsers(await usersRes.json());
      setStores(await storesRes.json());
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const sidebarItems = [
    { id: "dashboard", icon: BarChart3, label: "Dashboard" },
    { id: "create-user", icon: User, label: "Create User" },
    { id: "create-store", icon: Building2, label: "Create Store" },
    { id: "view-users", icon: Users, label: "View Users" },
    { id: "view-stores", icon: Store, label: "View Stores" },
  ];

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">Error: {error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6 border-b border-slate-200">
            <h1 className="text-xl font-bold text-slate-800">
              Admin Dashboard
            </h1>
          </div>

          <nav className="mt-8">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <item.icon className="w-5 h-5 mr-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Dashboard Section */}
          {activeSection === "dashboard" && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  Welcome Back!
                </h1>
                <p className="text-slate-600">
                  Here's what's happening with your system today.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 mr-4">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        Total Users
                      </p>
                      <p className="text-2xl font-bold text-slate-800">
                        {stats?.totalUsers || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 mr-4">
                      <Building2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        Total Stores
                      </p>
                      <p className="text-2xl font-bold text-slate-800">
                        {stats?.totalStores || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 mr-4">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        Total Ratings
                      </p>
                      <p className="text-2xl font-bold text-slate-800">
                        {stats?.totalRatings || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800">
                      Recent Users
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {users.slice(0, 5).map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                        >
                          <div>
                            <p className="font-medium text-slate-800">
                              {user.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              {user.email}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.role === "STORE_OWNER"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {user.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800">
                      Recent Stores
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {stores.slice(0, 5).map((store) => (
                        <div
                          key={store.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                        >
                          <div>
                            <p className="font-medium text-slate-800">
                              {store.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              {store.email}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm font-medium text-slate-600">
                              {store.averageRating || "N/A"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Create User Section */}
          {activeSection === "create-user" && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  Create New User
                </h1>
                <p className="text-slate-600">
                  Add a new user to the system with their details.
                </p>
              </div>

              <div className="max-w-2xl">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter full name"
                        value={userForm.name}
                        onChange={(e) => handleInputChange(e, setUserForm)}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        value={userForm.email}
                        onChange={(e) => handleInputChange(e, setUserForm)}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={userForm.password}
                        onChange={(e) => handleInputChange(e, setUserForm)}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        placeholder="Enter address"
                        value={userForm.address}
                        onChange={(e) => handleInputChange(e, setUserForm)}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Role
                      </label>
                      <select
                        name="role"
                        value={userForm.role}
                        onChange={(e) => handleInputChange(e, setUserForm)}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="USER">Normal User</option>
                        <option value="STORE_OWNER">Store Owner</option>
                        <option value="ADMIN">Admin User</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={(e) =>
                        handleSubmit(e, "create-user", userForm, () =>
                          setUserForm({
                            name: "",
                            email: "",
                            password: "",
                            address: "",
                            role: "USER",
                          })
                        )
                      }
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center shadow-sm"
                    >
                      <User className="w-5 h-5 mr-2" />
                      Create User
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Create Store Section */}
          {activeSection === "create-store" && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  Create New Store
                </h1>
                <p className="text-slate-600">
                  Add a new store to the system with details.
                </p>
              </div>

              <div className="max-w-2xl">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Store Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter store name"
                        value={storeForm.name}
                        onChange={(e) => handleInputChange(e, setStoreForm)}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Store Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter store email"
                        value={storeForm.email}
                        onChange={(e) => handleInputChange(e, setStoreForm)}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Store Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        placeholder="Enter store address"
                        value={storeForm.address}
                        onChange={(e) => handleInputChange(e, setStoreForm)}
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label
    htmlFor="ownerId"
    className="block text-sm font-medium text-slate-700 mb-2"
  >
    Store Owner ID
  </label>
  <input
    type="text"
    id="ownerId"
    name="ownerId"
    placeholder="Paste owner ID here"
    value={storeForm.ownerId}
    onChange={(e) => handleInputChange(e, setStoreForm)}
    required
    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
  />
  <p className="text-xs text-slate-400 mt-1">
    You can copy this ID from the Users list.
  </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) =>
                        handleSubmit(e, "create-store", storeForm, () =>
                          setStoreForm({
                            name: "",
                            email: "",
                            address: "",
                            ownerId: "",
                          })
                        )
                      }
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center shadow-sm"
                    >
                      <Building2 className="w-5 h-5 mr-2" />
                      Create Store
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* View Users Section */}
          {activeSection === "view-users" && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  All Users
                </h1>
                <p className="text-slate-600">
                  View and filter all users in the system.
                </p>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                <div className="flex items-center mb-4">
                  <Filter className="w-5 h-5 text-slate-500 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-800">
                    Filter Users
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Search by name..."
                    value={userFilter.name}
                    onChange={(e) => handleFilterChange(e, setUserFilter)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <input
                    type="text"
                    name="email"
                    placeholder="Search by email..."
                    value={userFilter.email}
                    onChange={(e) => handleFilterChange(e, setUserFilter)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Search by address..."
                    value={userFilter.address}
                    onChange={(e) => handleFilterChange(e, setUserFilter)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <select
                    name="role"
                    value={userFilter.role}
                    onChange={(e) => handleFilterChange(e, setUserFilter)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">All Roles</option>
                    <option value="USER">User</option>
                    <option value="STORE_OWNER">Store Owner</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>

              {/* Users List */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-800">
                    Users ({filteredUsers.length})
                  </h2>
                </div>
                <div className="p-6">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500">
                        No users found matching your criteria.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="border border-slate-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-lg font-semibold text-slate-800">
                                  {user.name}
                                </h3>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    user.role === "ADMIN"
                                      ? "bg-red-100 text-red-700"
                                      : user.role === "STORE_OWNER"
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {user.role}
                                </span>
                              </div>
                              <p className="text-slate-600 mb-1">
                                 {user.email}
                              </p>
                              <p className="text-slate-500">
                                 {user.address}
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                 {user.id}
                              </p>
                              {user.store && (
                                <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                                  <p className="font-medium text-slate-700">
                                    Store: {user.store.name}
                                  </p>
                                  <div className="flex items-center mt-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                    <span className="text-sm text-slate-600">
                                      Rating:{" "}
                                      {user.store.averageRating ||
                                        "No ratings yet"}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* View Stores Section */}
          {activeSection === "view-stores" && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  All Stores
                </h1>
                <p className="text-slate-600">
                  View and filter all stores in the system.
                </p>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                <div className="flex items-center mb-4">
                  <Filter className="w-5 h-5 text-slate-500 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-800">
                    Filter Stores
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Search by name..."
                    value={storeFilter.name}
                    onChange={(e) => handleFilterChange(e, setStoreFilter)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <input
                    type="text"
                    name="email"
                    placeholder="Search by email..."
                    value={storeFilter.email}
                    onChange={(e) => handleFilterChange(e, setStoreFilter)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Search by address..."
                    value={storeFilter.address}
                    onChange={(e) => handleFilterChange(e, setStoreFilter)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Stores List */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-800">
                    Stores ({filteredStores.length})
                  </h2>
                </div>
                <div className="p-6">
                  {filteredStores.length === 0 ? (
                    <div className="text-center py-12">
                      <Store className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500">
                        No stores found matching your criteria.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredStores.map((store) => (
                        <div
                          key={store.id}
                          className="border border-slate-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                                {store.name}
                              </h3>
                              <p className="text-slate-600 mb-1">
                                 {store.email}
                              </p>
                              <p className="text-slate-500 mb-3">
                                 {store.address}
                              </p>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                <span className="text-sm font-medium text-slate-600">
                                  Rating:{" "}
                                  {store.averageRating || "No ratings yet"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
