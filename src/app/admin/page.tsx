'use client';

import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, Ticket, Calendar, Users, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminStats {
  totalEvents: number;
  totalTickets: number;
  totalRevenue: number;
  activeEvents: number;
}

export default function AdminLogin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
  };

  const mockStats: AdminStats = {
    totalEvents: 12,
    totalTickets: 2450,
    totalRevenue: 125000,
    activeEvents: 8
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (loginForm.username === ADMIN_CREDENTIALS.username && 
          loginForm.password === ADMIN_CREDENTIALS.password) {
        setIsAuthenticated(true);
      } else {
        alert('Invalid credentials');
      }
      setLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginForm({ username: '', password: '' });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-r zinc-800 via zinc-900 to-zinc-400 flex items-center justify-center px-4">
        <motion.div
          className="max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <motion.div
              className="mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Lock className="h-16 w-16 text-black mx-auto" />
            </motion.div>
            <h1 className="text-3xl font-bold text-black mb-2">Admin Login</h1>
            <p className="text-gray-600">Enter your credentials to access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-800" />
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 border-3 border-zinc-300 rounded-lg focus:ring-2 focus:ring-neutral-600 focus:border-transparent"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-800" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-10 pr-4 py-3 border-3 border-zinc-300 rounded-lg focus:ring-2 focus:ring-neutral-00 focus:border-transparent"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                /> 
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-800"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-neutral-800" />
                  ) : (
                    <Eye className="h-4 w-4 text-black" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors btn-hover disabled:opacity-50"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Demo Credentials:</p>
            <p className="text-sm font-mono">Username: admin</p>
            <p className="text-sm font-mono">Password: admin123</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <motion.header 
        className="border-b border-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <Ticket className="h-8 w-8 text-black" />
              <h1 className="text-2xl font-bold text-black">Admin Dashboard</h1>
            </motion.div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, Admin</span>
              <motion.button
                onClick={handleLogout}
                className="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="bg-white border border-gray-200 rounded-lg p-6"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-3xl font-bold text-black">{mockStats.totalEvents}</p>
              </div>
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white border border-gray-200 rounded-lg p-6"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tickets</p>
                <p className="text-3xl font-bold text-black">{mockStats.totalTickets}</p>
              </div>
              <Ticket className="h-8 w-8 text-gray-400" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white border border-gray-200 rounded-lg p-6"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-black">NPR {mockStats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white border border-gray-200 rounded-lg p-6"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Events</p>
                <p className="text-3xl font-bold text-black">{mockStats.activeEvents}</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.button
            onClick={() => router.push('/admin/events/new')}
            className="bg-black text-white p-8 rounded-lg text-left hover:bg-gray-800 transition-colors btn-hover"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Calendar className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Create New Event</h3>
            <p className="text-gray-300">Add a new event to the system</p>
          </motion.button>

          <motion.button
            onClick={() => router.push('/admin/events')}
            className="bg-gray-100 text-black p-8 rounded-lg text-left hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Ticket className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Manage Events</h3>
            <p className="text-gray-600">View and edit existing events</p>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
