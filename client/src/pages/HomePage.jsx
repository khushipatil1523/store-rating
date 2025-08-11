import React from 'react';
import { Star, Store, Users, Shield } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-8 pt-24 pb-12 text-center">
        <h1 className="text-6xl font-bold text-gray-900">
          Store Rating <span className="text-blue-600 block">Platform</span>
        </h1>
        <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
          Discover, rate, and review stores in your area. Honest opinions, transparent ratings, and a better shopping experience.
        </p>
      </header>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-8 grid grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Store className="text-blue-600" size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">500+</h3>
          <p className="text-gray-600">Registered Stores</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="text-green-600" size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">2,500+</h3>
          <p className="text-gray-600">Active Users</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Star className="text-yellow-600" size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">15,000+</h3>
          <p className="text-gray-600">Ratings Submitted</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-3 gap-8">
          <div className="bg-blue-50 rounded-xl p-8 border border-blue-100">
            <Users className="text-blue-600 mb-4" size={32} />
            <h3 className="text-lg font-semibold mb-3">For Users</h3>
            <p className="text-gray-600">
              Browse stores, submit ratings, and view overall store performance.
            </p>
          </div>
          <div className="bg-green-50 rounded-xl p-8 border border-green-100">
            <Store className="text-green-600 mb-4" size={32} />
            <h3 className="text-lg font-semibold mb-3">For Store Owners</h3>
            <p className="text-gray-600">
              Access your dashboard, view ratings, and track performance over time.
            </p>
          </div>
          <div className="bg-purple-50 rounded-xl p-8 border border-purple-100">
            <Shield className="text-purple-600 mb-4" size={32} />
            <h3 className="text-lg font-semibold mb-3">For Administrators</h3>
            <p className="text-gray-600">
              Manage users, stores, and platform analytics with powerful tools.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 text-center text-sm text-gray-500 mt-auto">
        © {new Date().getFullYear()} Store Rating Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
